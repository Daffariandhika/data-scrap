import { useState } from "react";
import { Button, FormHeader, Input, Loader, LogViewer, Modal } from "../ui";
import useScraperUrl from "../hooks/useScraperUrl";
import UsageContent from './../ui/UsageContent';

export default function UrlForm({ onSuccess }: { onSuccess: (file: string) => void }) {

  const [url, setUrl] = useState("");
  const [max, setMax] = useState(10);
  const [delay, setDelay] = useState(3);
  const [output, setOutput] = useState("list");
  const [showLogs, setShowLogs] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

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
      <FormHeader
        heading="Scrap Urls"
        subheading="Collect Each Book Url From Provided Url"
        onClick={() => setShowInfo(true)} />
      <form onSubmit={handleSubmit}>
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
        <div className="Button_Wrap_Col">
          <div className="Flex_Wrap">
            <Button
              variant="default"
              type="submit"
              disabled={loading || !url}
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
        </div>
      </form>
      <Modal
        title="Usage Guide"
        subtitle="Guidance to use this form"
        isOpen={showInfo}
        onClose={() => setShowInfo(false)}
      >
        <UsageContent
          heading="Parameter"
          lists={[
            "URL : Enter a Goodreads search, list, or shelf link",
            "Amount : Number of URLs to scrape (keep reasonable)",
            "Delay : Seconds between requests (higher = safer)",
            "Output : Name of the file to save results",
          ]} />
      </Modal>
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
