import React, { useEffect } from "react";

interface LogContainerProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  children: React.ReactNode;
}

export default function LogContainer({
  containerRef,
  children
}: LogContainerProps) {

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [children, containerRef]);

  return (
    <div
      className="modal-content"
      ref={containerRef}
    >
      {children}
    </div>
  );
};
