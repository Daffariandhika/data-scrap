import { useState } from "react";

interface Files {
  json: string;
  csv: string;
}

export default function useScraperMetadata(
  inputFile: string,
  outputName: string
) {

  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<Files | null>(null);

  const scrape = () => {
    setLoading(true);
    setLogs([]);
    setFiles(null);

    const params = new URLSearchParams(
      { input: inputFile, output: outputName }
    );

    const evtSource = new EventSource(
      `api/scrape_books_stream?${params}`
    );

    evtSource.onmessage = (event) => {
      if (event.data.startsWith("DONE:")) {
        const [jsonFile, csvFile] = event.data.replace("DONE:", "").split(",");
        setFiles(
          { json: jsonFile, csv: csvFile }
        );
        setLoading(false);
        evtSource.close();
      }
      else if (event.data.startsWith("ERROR:")) {
        setLogs(
          (prev) => [...prev, event.data.replace("ERROR:", "")]
        );
        setLoading(false);
        evtSource.close();
      }
      else {
        setLogs(
          (prev) => [...prev, event.data]
        );
      }
    };
  };

  return {
    logs, setLogs,
    loading, setLoading,
    files, scrape
  };
}
