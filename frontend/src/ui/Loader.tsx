import { useEffect, useState } from "react";

interface LoaderProps {
  text?: string[];
  type?: "starting" | "loading";
  color?: "Textwhite" | "Textblack"
  customClass?: string;
}

export default function Loader({
  text = ["Loading..."],
  type = "loading",
  color = "Textblack",
  customClass = ""
}: LoaderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (text.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % text.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [text]);

  const baseClass = type === "starting" ? "starting" : "loading-inline";
  const className = `${baseClass} ${customClass}`.trim();

  return (
    <div className={className}>
      <p>
        <span className={`shine-text ${color}`}>
          {text[currentIndex]}
        </span>
      </p>
    </div>
  );
}
