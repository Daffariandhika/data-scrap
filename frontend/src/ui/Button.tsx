import React from "react";
import { DownloadIcon } from "../ui/";

type ButtonVariant = "default" | "py" | "csv" | "json";

type DownloadButtonProps = {
  downloadFile: string;
  onClick?: never;
};

type ActionButtonProps = {
  onClick?: () => void;
  downloadFile?: never;
};

type CommonProps = {
  variant?: ButtonVariant;
  children: React.ReactNode;
  title?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  showIcon?: boolean;
};

type ButtonProps = CommonProps & (DownloadButtonProps | ActionButtonProps);

const Button: React.FC<ButtonProps> = ({
  variant = "default",
  children,
  downloadFile,
  onClick,
  title,
  disabled = false,
  type = "button",
  showIcon,
}) => {
  const className = `btn-${variant}`;
  const label =
    title ||
    (downloadFile
      ? `Download ${variant.toUpperCase()} file`
      : `Action: ${children}`);

  const shouldShowIcon = showIcon ?? Boolean(downloadFile);

  return (
    <button
      type={type}
      className={`buttonMain ${className}`}
      onClick={onClick}
      aria-label={label}
      title={label}
      disabled={disabled}
    >
      <span className="shadow"></span>
      <span className="edge"></span>

      {downloadFile ? (
        <a
          className="front"
          href={disabled ? undefined : `/api/download/${downloadFile}`}
          download={!disabled}
          aria-disabled={disabled}
          onClick={disabled ? (e) => e.preventDefault() : undefined}
        >
          <span className="btn-content">
            {shouldShowIcon && <DownloadIcon />}
            <span className="btn-text">{children}</span>
          </span>
        </a>
      ) : (
        <span className="front">
          <span className="btn-content">
            {shouldShowIcon && <DownloadIcon />}
            <span className="btn-text">{children}</span>
          </span>
        </span>
      )}
    </button>
  );
};

export default Button;
