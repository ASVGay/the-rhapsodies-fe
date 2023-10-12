import React, { useCallback, useEffect, useState } from "react"
import OneSignal from "react-onesignal"
import { toast } from "react-toastify"
import { useUser } from "@supabase/auth-helpers-react"
import Toggle from "@/components/settings/controls/toggle"

interface ReceiveNotificationsToggleProps {
  isSubscribed: boolean
  setIsSubscribed: React.Dispatch<boolean>
  hasNotificationPermission: boolean
}

const ReceiveNotificationsToggle = ({
  isSubscribed,
  setIsSubscribed,
  hasNotificationPermission,
}: ReceiveNotificationsToggleProps) => {
  const [renderContent, setRenderContent] = useState<boolean>(false)
  const userId = useUser()?.id

  const getSubscriptionStatus = useCallback(() => {
    if (!OneSignal.User && userId) {
      OneSignal.login(userId).then(() => {})
    }
    setIsSubscribed(OneSignal.User.PushSubscription.optedIn === true)
  }, [setIsSubscribed, userId])

  const changeSubscription = () => {
    if (isSubscribed) {
      OneSignal.User.PushSubscription.optOut().then(() => {
        setIsSubscribed(false)
        toast.success(
          "Unsubscribed from notifications! It might take a couple of seconds to take effect.",
        )
      })
    } else if (OneSignal.User.PushSubscription.id) {
      OneSignal.User.PushSubscription.optIn().then(() => {
        getSubscriptionStatus()
        toast.success(
          "Subscribed to notifications! It might take a couple of seconds to take effect.",
        )
      })
    }
  }

  useEffect(() => {
    // Only show content once window has been defined (since that is necessary for notificationsAreSupported)
    setRenderContent(true)
    getSubscriptionStatus()
  }, [getSubscriptionStatus])

  return (
    <>
      {renderContent && (
        // <div className="onesignal-customlink-container"></div>
        <Toggle
          dataCy={"receive-notifications-toggle"}
          text={"Subscribe to notifications"}
          checked={isSubscribed}
          handleChange={changeSubscription}
          disabled={!hasNotificationPermission}
        />
      )}
    </>
  )
}

export default ReceiveNotificationsToggle
