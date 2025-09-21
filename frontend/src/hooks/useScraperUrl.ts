import { useState, useEffect } from "react";

export default function useScraperURL(
  params: URLSearchParams,
  onSuccess: (file: string) => void
) {

  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [downloadFile, setDownloadFile] = useState<string | null>(null);

  useEffect(() => {
    if (!loading) return;

    const evtSource = new EventSource(
      `/api/scrape_urls_stream?${params}`
    );

    evtSource.onmessage = (event) => {
      if (event.data.startsWith("[COMPLETED]")) {
        setLogs(
          prev => [...prev, event.data]
        );
        const fullPath = event.data.replace("[COMPLETED]", "").trim();
        const file = fullPath.split(/[/\\]/).pop() || fullPath;
        setDownloadFile(file);
        onSuccess(file);
        evtSource.close();
        setLoading(false);
      }
      else if (event.data.startsWith("[ERROR]")) {
        setLogs(
          prev => [...prev, event.data]
        );
        evtSource.close();
        setLoading(false);
      }
      else {
        setLogs(
          prev => [...prev, event.data]
        );
      }
    };
    return () => evtSource.close();
  }, [loading]);

  return {
    logs, setLogs,
    loading, setLoading,
    downloadFile
  };
}
