interface FormHeader {
  heading: string;
  subheading: string;
  onClick?: () => void;
}

export default function FormHeader({
  heading,
  subheading,
  onClick
}: FormHeader) {

  return (
    <div className="form-header">
      <div className="Flex_Column">
        <h1>
          {heading}
        </h1>
        <p>
          {subheading}
        </p>
      </div>
      <svg
        onClick={onClick}
        height="28"
        width="28"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Information"
      >
        <path
          d="M12 9v2m0 4h.01M12 4a8 8 0 1 1 0 16 8 8 0 0 1 0-16z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
