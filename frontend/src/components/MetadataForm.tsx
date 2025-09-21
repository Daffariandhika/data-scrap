import { useState } from 'react';
import { Button, Input, Loader, LogViewer } from "../ui";
import useScraperMetadata from '../hooks/useScraperMetadata';

export default function MetadataForm({ inputFile }: { inputFile: string }) {

  const [output, setOutput] = useState('metadata');
  const [showLogs, setShowLogs] = useState(false);

  const {
    logs,
    loading,
    files,
    scrape
  } = useScraperMetadata(inputFile, output);

  const handleScrape = () => {
    scrape();
    setShowLogs(true);
  };

  return (
    <div className="form-container">
      <h2 className="form-header">
        Metadata
      </h2>
      <form className="form">
        <Input<string>
          label="URL"
          value={output}
          onChange={setOutput}
        />
        <div className='Flex_Wrap'>
          <Button
            variant="default"
            onClick={handleScrape}
            disabled={loading}
          >
            {
              loading ?
                <Loader
                  text={[
                    "Scraping...",
                    "Almost Done...",
                    "A bit more..."
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
          files && (
            <>
              <Button
                variant="json"
                downloadFile={files.json}
              >
                JSON File
              </Button>
              <Button
                variant="csv"
                downloadFile={files.csv}
              >
                CSV File
              </Button>
            </>
          )
        }
      </form>
      <LogViewer
        logs={logs}
        isOpen={showLogs}
        onClose={() => setShowLogs(false)}
        title="Scraping Metadata"
        subtitle="Colecting Each Book Metadata"
      />
    </div>
  );
}
