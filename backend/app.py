from flask import Flask, request, jsonify, send_file, Response, stream_with_context
from flask_cors import CORS
import subprocess
import os
import logging
import traceback

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SCRIPTS_DIR = os.path.join(BASE_DIR, "scripts")
OUTPUT_DIR = os.path.join(BASE_DIR, "output")

os.makedirs(OUTPUT_DIR, exist_ok=True)

logging.basicConfig(
    level=logging.INFO, format="[%(asctime)s] [%(levelname)s] %(message)s"
)

def run_subprocess(command, timeout=None):
    try:
        result = subprocess.run(
            command,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            check=True,
            timeout=timeout,
        )
        logs = result.stdout + "\n" + result.stderr
        return True, logs
    except subprocess.TimeoutExpired as e:
        logging.error(f"Subprocess timed out: {command}")
        return False, f"Timeout expired: {str(e)}"
    except subprocess.CalledProcessError as e:
        logging.error(f"Subprocess failed: {command}\n{e.stderr}")
        return False, e.stderr
    except Exception as e:
        logging.error(f"Unexpected error running subprocess: {command}\n{traceback.format_exc()}")
        return False, str(e)


@app.route("/api/scrape_urls", methods=["POST"])
def scrape_urls():
    """Blocking request – waits until scraper is done"""
    data = request.get_json()
    url = data.get("url")
    max_books = str(data.get("max", 10))
    delay = str(data.get("delay", 3))
    output_file = data.get("output", "list.py")

    if not url:
        return jsonify({
            "success": False,
            "error": "URL is required"
        }), 400

    script_path = os.path.join(SCRIPTS_DIR, "url_scraper.py")
    output_path = os.path.join(OUTPUT_DIR, output_file)

    if not os.path.exists(script_path):
        return jsonify({
            "success": False,
            "error": "Scraper script not found"
        }), 500

    success, logs = run_subprocess(
        [
            "python",
            script_path,
            "--url",
            url,
            "--max",
            max_books,
            "--delay",
            delay,
            "--output",
            output_path,
        ]
    )

    if success:
        return jsonify({
            "success": True,
            "output_file": output_file,
            "logs": logs
        })
    else:
        return jsonify({
            "success": False,
            "error": logs
        }), 500


@app.route("/api/scrape_urls_stream")
def scrape_urls_stream():
    url = request.args.get("url")
    max_books = request.args.get("max", "20")
    delay = request.args.get("delay", "2")
    output_file = request.args.get("output", "list.py")

    script_path = os.path.join(SCRIPTS_DIR, "url_scraper.py")
    output_path = os.path.join(OUTPUT_DIR, output_file)

    if not os.path.exists(script_path):
        return jsonify({
            "success": False,
            "error": "Scraper script not found"
        }), 500

    def generate():
        try:
            process = subprocess.Popen(
                [
                    "python",
                    script_path,
                    "--url",
                    url,
                    "--max",
                    max_books,
                    "--delay",
                    delay,
                    "--output",
                    output_path,
                ],
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                bufsize=1,
            )

            for line in iter(process.stdout.readline, ""):
                if line.strip():
                    yield f"data: {line.rstrip()}\n\n"

            process.stdout.close()
            process.wait()

            if process.returncode == 0:
                yield f"data: [COMPLETED] {output_file}\n\n"
            else:
                yield f"data: ERROR:Scraper exited with code {process.returncode}\n\n"

        except Exception as e:
            logging.error(f"Streaming scraper failed: {traceback.format_exc()}")
            yield f"data: ERROR:{str(e)}\n\n"

    return Response(stream_with_context(generate()), mimetype="text/event-stream")


@app.route("/api/scrape_books", methods=["POST"])
def scrape_books():
    data = request.get_json()
    input_file = data.get("input", "list.py")
    output_file = data.get("output", "metadata.json")

    input_path = os.path.join(OUTPUT_DIR, input_file)
    output_base = os.path.splitext(os.path.basename(output_file))[0]

    script_path = os.path.join(SCRIPTS_DIR, "book_scraper.py")

    if not os.path.exists(script_path):
        return (
            jsonify({
                "success": False,
                "error": "Book scraper script not found"
            }),
            500,
        )

    if not os.path.exists(input_path):
        return (
            jsonify({
                "success": False,
                "error": f"Input file {input_file} not found"
            }), 404,
        )

    success, logs = run_subprocess(
        [
            "python",
            script_path,
            "--input",
            input_path,
            "--output",
            os.path.join(OUTPUT_DIR, f"{output_base}.json"),
        ]
    )

    if success:
        return jsonify({
            "success": True,
            "json_file": f"{output_base}.json",
            "csv_file": f"{output_base}.csv",
        })
    else:
        return jsonify({
            "success": False,
            "error": logs
        }), 500


@app.route("/api/scrape_books_stream", methods=["GET"])
def scrape_books_stream():
    input_file = request.args.get("input", "list.py")
    output_file = request.args.get("output", "metadata.json")

    input_path = os.path.join(OUTPUT_DIR, input_file)
    output_base = os.path.splitext(os.path.basename(output_file))[0]

    script_path = os.path.join(SCRIPTS_DIR, "book_scraper.py")

    if not os.path.exists(script_path):
        return (
            jsonify({
                "success": False,
                "error": "Book scraper script not found"
            }), 500,
        )

    if not os.path.exists(input_path):
        return (
            jsonify({
                "success": False,
                "error": f"Input file {input_file} not found"
            }), 404,
        )

    def generate():
        try:
            process = subprocess.Popen(
                [
                    "python",
                    script_path,
                    "--input",
                    input_path,
                    "--output",
                    os.path.join(OUTPUT_DIR, f"{output_base}.json"),
                ],
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                bufsize=1,
            )

            for line in iter(process.stdout.readline, ""):
                if line.strip():
                    yield f"data: {line.rstrip()}\n\n"

            process.stdout.close()
            process.wait()

            if process.returncode == 0:
                yield f"data: DONE:{output_base}.json,{output_base}.csv\n\n"
            else:
                yield f"data: ERROR:Scraper exited with code {process.returncode}\n\n"

        except Exception as e:
            logging.error(f"Streaming book scraper failed: {traceback.format_exc()}")
            yield f"data: ERROR:{str(e)}\n\n"

    return Response(stream_with_context(generate()), mimetype="text/event-stream")


@app.route("/api/download/<filename>", methods=["GET"])
def download_file(filename):
    file_path = os.path.join(OUTPUT_DIR, filename)
    if not os.path.exists(file_path):
        return jsonify({
            "error": "File not found"
        }), 404
    return send_file(file_path, as_attachment=True)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)