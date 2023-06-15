import React, { useState } from "react"
import SettingsWrapper from "@/components/settings/settings-wrapper"
import { BookOpenIcon } from "@heroicons/react/24/outline"
import SettingsButton from "../controls/settings-button"
import { createPortal } from "react-dom"
import TermsAndConditions from "@/components/overlays/terms-and-conditions"
import { OverlayContent } from "@/interfaces/overlay-content"

interface TermsAndPoliciesSettingsProps {
  overlayContent: OverlayContent
}

const TermsAndPoliciesSettings = ({ overlayContent }: TermsAndPoliciesSettingsProps) => {
  const [showTerms, setShowTerms] = useState(false)

  return (
    <SettingsWrapper category={"Terms & Policies"} icon={BookOpenIcon}>
      <SettingsButton
        disabled={false}
        onClick={() => setShowTerms(true)}
        text={"View Terms and Conditions"}
        dataCy={"terms-conditions-button"}
      />
      {showTerms &&
        createPortal(
          <TermsAndConditions
            overlayContent={overlayContent}
            onClose={() => setShowTerms(false)}
          />,
          document.getElementById("overlay-container") as Element | DocumentFragment
        )}
    </SettingsWrapper>
  )
}

export default TermsAndPoliciesSettings
