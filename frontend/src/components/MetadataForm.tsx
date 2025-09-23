import { useState } from 'react';
import { Button, FormHeader, Input, Loader, LogViewer, Modal, UsageContent } from "../ui";
import useScraperMetadata from '../hooks/useScraperMetadata';

export default function MetadataForm({ inputFile }: { inputFile: string }) {

  const [output, setOutput] = useState('metadata');
  const [showLogs, setShowLogs] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

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
      <FormHeader
        heading="Scrap Metadata"
        subheading="Collect each book metadata"
        onClick={() => setShowInfo(true)}
      />
      <form>
        <Input<string>
          label="Output File Name"
          value={output}
          onChange={setOutput}
        />
        <div className="Button_Wrap_Col">
          <div className="Flex_Wrap">
            <Button
              variant="default"
              onClick={handleScrape}
              disabled={loading || !inputFile}
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
            files &&
            <Button
              variant="json"
              downloadFile={files.json}
              disabled={!inputFile}
            >
              JSON File
            </Button>
          }
          {
            files &&
            <Button
              variant="csv"
              downloadFile={files.csv}
              disabled={!inputFile}
            >
              CSV File
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
            "Input : Automaticly use the .Py file from previous form",
            "Output : Output file name",
          ]}
        />
      </Modal>
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
