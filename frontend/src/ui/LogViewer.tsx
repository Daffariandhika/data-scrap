import { useEffect, useRef, useState } from "react";
import { Modal, LogContainer, LogEntry, Loader } from "../ui";

interface LogViewerProps {
  logs: string[];
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  error?: string | null;
}

export default function LogViewer({
  logs,
  isOpen,
  onClose,
  title = "Scraping Logs",
  subtitle = "Collecting Data",
  error = null,
}: LogViewerProps) {

  const [scrapingDone, setScrapingDone] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lastLog = logs[logs.length - 1] || "";
    setScrapingDone(
      lastLog.startsWith("[COMPLETED]") ||
      lastLog.startsWith("[WARNING]") ||
      lastLog.startsWith("[ERROR]")
    );
  }, [logs]);

  const waiting = !scrapingDone && logs.length > 0;

  return (
    <Modal
      title={title}
      subtitle={subtitle}
      isOpen={isOpen}
      onClose={onClose}
    >
      <LogContainer containerRef={containerRef}>
        {
          error &&
          <div className="error-state">
            {error}
          </div>
        }
        {
          !error && logs.length === 0 && !waiting &&
          <Loader
            type="starting"
            text={[
              "Initializing...",
              "Starting Script...",
              "Just a moment..."
            ]}
          />
        }
        {
          logs.map((log, index) => (
            <LogEntry
              key={index}
              log={log}
            />
          ))
        }
        {
          waiting && !error &&
          <Loader
            type="loading"
            text={[
              "Scanning the web ...",
              "Harvesting data...",
              "Following breadcrumbs..."
            ]}
          />
        }
      </LogContainer>
    </Modal>
  );
};
