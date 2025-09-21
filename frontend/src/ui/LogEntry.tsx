import { classifyLog } from "../helper/classifyLog";

interface LogEntryProps {
  log: string;
}

export default function LogEntry(
  { log }: LogEntryProps
) {

  const type = classifyLog(log);

  return (
    <pre className={`log-entry ${type}`} title={log}>
      {log}
    </pre>
  );
}
