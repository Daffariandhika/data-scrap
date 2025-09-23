import { footHeader, footText } from "../helper/text";

interface UsageContent {
  heading?: string;
  lists?: string[];
  footerHeader?: string,
  footerText?: string,
  displayFooter?: boolean
  children?: React.ReactNode;
}

export default function UsageContent({
  heading, lists = [],
  footerHeader = footHeader,
  footerText = footText,
  displayFooter = true,
  children
}: UsageContent) {

  return (
    <div className="usage-content">
      <h3>{heading}</h3>
      {
        lists.map((list, index) => (
          <pre
            key={index}
          >
            {list}
          </pre>
        ))
      }
      {displayFooter && (
        <>
          <h3>
            {footerHeader}
          </h3>
          <footer>
            {footerText}
          </footer>
        </>
      )}
      {children}
    </div>
  );
}
