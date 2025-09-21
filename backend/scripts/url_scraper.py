import argparse
import requests
import time
import logging
import sys
import os
from urllib.parse import urlparse, parse_qs, urlencode, urlunparse
from bs4 import BeautifulSoup

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    )
}

logging.basicConfig(level=logging.INFO, format="[%(levelname)s] - %(message)s")


def parse_args():
    parser = argparse.ArgumentParser(
        description="Scrape unique book URLs from Goodreads shelf/search/list pages.",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    )
    parser.add_argument("--url", type=str, required=True)
    parser.add_argument("--max", type=int, default=10)
    parser.add_argument("--delay", type=int, default=3)
    parser.add_argument("--output", type=str, default="list.py")
    return parser.parse_args()


def update_pagination_url(base_url, page_number):
    parsed = urlparse(base_url)
    params = parse_qs(parsed.query)
    params["page"] = [str(page_number)]
    updated_query = urlencode(params, doseq=True)
    return urlunparse(parsed._replace(query=updated_query))


def fetch_goodreads_urls(base_url, max_urls=20, delay=2):
    logging.info("Starting Goodreads scraping session...")
    page = 1
    seen_urls = set()
    book_urls = []

    while len(book_urls) < max_urls:
        paginated_url = update_pagination_url(base_url, page)
        logging.info(f"Fetching: {paginated_url}")

        try:
            response = requests.get(paginated_url, headers=HEADERS, timeout=10)
            response.raise_for_status()
        except requests.RequestException as e:
            logging.error(f"Request failed on page {page}: {e}")
            logging.error("Stopping scraping due to network error.")
            break

        soup = BeautifulSoup(response.text, "html.parser")
        book_links = soup.find_all("a", class_="bookTitle", href=True)

        if not book_links:
            logging.info("No book url found on this page.")
            break

        new_links = 0
        for tag in book_links:
            full_url = "https://www.goodreads.com" + tag["href"]
            if full_url not in seen_urls:
                seen_urls.add(full_url)
                book_urls.append(full_url)
                new_links += 1
                if len(book_urls) >= max_urls:
                    break

        logging.info(
            f"Found {new_links} new url on page {page}. Total collected: {len(book_urls)}/{max_urls}"
        )
        page += 1
        time.sleep(delay)

    logging.info(f"Scraping session complete. Total url collected: {len(book_urls)}")
    return book_urls


def save_urls_to_file(urls, filename):
    if not filename.endswith(".py"):
        filename += ".py"
    try:
        with open(filename, "w", encoding="utf-8") as f:
            f.write("book_urls = [\n")
            for url in urls:
                f.write(f'    "{url}",\n')
            f.write("]\n")
        logging.info(
            f"Generating Python File. . .\n[COMPLETED] - Python successfully saved to {os.path.abspath(filename)}"
        )
    except Exception as e:
        logging.error(f"Failed to write output to {filename}: {e}")
        sys.exit(1)


def main():
    args = parse_args()
    logging.info(
        f"Initial Configuration:\n[CONFIG] - URL={args.url}\n[CONFIG] - Max={args.max}\n[CONFIG] - Delay={args.delay}s\n[CONFIG] - Output={args.output}"
    )

    urls = fetch_goodreads_urls(args.url, args.max, args.delay)

    if urls:
        save_urls_to_file(urls, args.output)
    else:
        logging.warning("No url collected. Output file was not created.")


if __name__ == "__main__":
    main()
