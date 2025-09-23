import { useState, useEffect } from 'react';
import { Button, Modal, UsageContent } from '../ui';
import { terms } from '../helper/text';

export default function Agreement() {
  const [showAgreement, setShowAgreement] = useState(true);
  const [isChecked, setIsChecked] = useState(false);

  const handleAgree = () => {
    if (isChecked) {
      setShowAgreement(false);
      localStorage.setItem("agreedToTerms", "true");
    }
  };

  useEffect(() => {
    const agreed = localStorage.getItem("agreedToTerms");
    if (agreed === "true") {
      setShowAgreement(false);
    }
  }, []);

  return (
    <Modal
      title="Usage Agreement"
      subtitle="Please review and accept before continuing."
      isOpen={showAgreement}
      onClose={() => { }}
      hideClose={true}
    >
      <UsageContent
        displayFooter={false}
        heading="By using this software, you acknowledge and agree that:"
      >
        <div className="agreement-body">
          <ul>
            {
              terms.map((term, index) => (
                <li
                  key={index}
                >
                  {term}
                </li>
              ))
            }
          </ul>
          <div className={isChecked ? "accepted Flex_Wrap" : "Flex_Wrap"}>
          <svg
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 9v3m0 3h.01M4.5 19.5h15l-7.5-15z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h5>
            If you do not agree to these terms, you must not use this software.
            </h5>
            </div>
        </div>
        <div className="checkbox-flex">
          <label className="container">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
            />
            <div className="checkmark" title='I Agree'/>
          </label>
          <div className='flex-agreement'>
            <h6 className={isChecked ? "accepted" : ""}>
              I have read and agree to the Terms of Use
            </h6>
            <p>
              Clicking “I Agree” confirms your acceptance.
            </p>
          </div>
        </div>
        <Button
          disabled={!isChecked}
          onClick={handleAgree}
        >
          Agree & Continue
        </Button>
      </UsageContent>
    </Modal >
  );
}
