export type LogType =
  | "completed"
  | "success"
  | "error"
  | "info"
  | "config"
  | "raw"
  | "warning";

export function classifyLog(log: string): LogType {
  if (log.startsWith(
    "[COMPLETED]"
  )) return "completed";

  if (log.startsWith(
    "[SUCCESS]"
  )) return "success";

  if (log.startsWith(
    "[ERROR]"
  )) return "error";

  if (log.startsWith(
    "[INFO]"
  )) return "info";

  if (log.startsWith(
    "[CONFIG]"
  )) return "config";

  if (log.startsWith(
    "[WARNING]"
  )) return "warning";

  return "raw";
}
