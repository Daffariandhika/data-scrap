import { useState } from "react";
import { Button, Input, Loader, LogViewer } from "../ui";
import useScraperUrl from "../hooks/useScraperUrl";

export default function UrlForm({ onSuccess }: { onSuccess: (file: string) => void }) {

  const [url, setUrl] = useState("");
  const [max, setMax] = useState(10);
  const [delay, setDelay] = useState(3);
  const [output, setOutput] = useState("list");
  const [showLogs, setShowLogs] = useState(false);

  const params = new URLSearchParams({
    url,
    max: String(max),
    delay: String(delay),
    output: output.endsWith(".py") ? output : `${output}.py`,
  });

  const {
    logs, setLogs,
    loading, setLoading,
    downloadFile
  } = useScraperUrl(params, onSuccess);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setLogs([]);
    setLoading(true);
    setShowLogs(true);
  };

  return (
    <div className="form-container">
      <h2 className="form-header">
        Scrap URL
      </h2>
      <form
        className="form"
        onSubmit={handleSubmit}
      >
        <Input<string>
          label="URL"
          value={url}
          onChange={setUrl}
          placeholder="Enter Goodreads Search result url"
        />
        <div className="Flex_Row">
          <Input<number>
            label="Amount"
            type="number"
            value={max}
            onChange={setMax}
          />
          <Input<number>
            label="Delay"
            type="number"
            value={delay}
            onChange={setDelay}
          />
        </div>
        <Input<string>
          label="Output file name"
          value={output}
          onChange={setOutput}
          placeholder="Python File Output Name"
        />
        <div className="Flex_Wrap">
          <Button
            variant="default"
            type="submit"
            disabled={loading}
          >
            {
              loading ?
                <Loader
                  text={
                    ["Scraping...",
                      "Almost there...",
                      "Just a moment..."
                    ]}
                  color="Textwhite" /> : "Start"
            }
          </Button>
          {
            logs.length > 0 &&
            <Button
              variant="default"
              onClick={() => setShowLogs(true)}
            >
              Logs
            </Button>
          }
        </div>
        {
          downloadFile &&
          <Button
            variant="py"
            downloadFile={downloadFile}
            disabled={!downloadFile}
          >
            Python File
          </Button>
        }
      </form>
      <LogViewer
        logs={logs}
        isOpen={showLogs}
        onClose={() => setShowLogs(false)}
        title="Scraping Url"
        subtitle="Scraping Unique Book Url from Provided Url"
      />
    </div>
  );
}
