import React from "react";

interface ModalProps {
  title: string;
  subtitle: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({
  title,
  subtitle,
  isOpen,
  onClose,
  children
}: ModalProps) {

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
    >
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="Flex_Column">
          <h3>
            {title}
          </h3>
          <p>
            {subtitle}
            </p>
            </div>
              <button
                className="close-btn"
                onClick={onClose}
              >
                ✖
              </button>
            </div>
            {children}
        </div>
      </div>
      );
};
