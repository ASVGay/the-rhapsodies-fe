import React, { useEffect, useState } from "react"
import Image from "next/image"
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react"
import { Database } from "@/types/database"
import { getDisplayName } from "@/services/authentication.service"
import { toast } from "react-toastify"
import SignOut from "@/components/settings/account/sign-out"

const AwayModeEnabled = () => {
  const [displayName, setDisplayName] = useState<string>("")

  const supabase = useSupabaseClient<Database>()
  const uid = useUser()?.id

  useEffect(() => {
    const fetchData = async () => {
      if (uid) {
        const { data, error } = await getDisplayName(supabase, uid)
        if (data) setDisplayName(data.display_name)
        if (error)
          toast.error(`Something went wrong while retrieving your account data.`, {
            toastId: "name-error",
          })
      }
    }

    fetchData().catch(() =>
      toast.error("Something went wrong while retrieving data.", { toastId: "fetch-error" }),
    )
  }, [supabase, uid])

  return (
    <div className={"full-bg-moon-50"}>
      <div className={"auth-container"}>
        <div className={"flex w-full flex-col justify-center items-center gap-6"}>
          <span className={"w-fit font-semibold leading-8 text-black"}>Away Mode Enabled</span>
          <Image
            src={"/images/undraw-travel-mode.svg"}
            alt={"Open envelope with checkmark"}
            className={"animate-fade-right animate-once"}
            width={0}
            height={0}
            style={{ width: "100%" }}
          />
          <span>
            Hi
            {displayName && (
              <span className={"text-moon-400 font-bold"} data-cy={"display-name"}>
                {" "}
                {displayName}
              </span>
            )}
            ,
          </span>
          <p className={"text-center"}>
            Away Mode is now active on your account. This means you are currently invisible in the
            song suggestions, repertoire, and event attendance lists. If you are coming back to the
            Rhapsodies and want to start using the app again, simply disable Away Mode.
          </p>
          <button data-cy={"button-disable-away-mode"} className={"btn submit"}>
            Disable Away Mode
          </button>
          <SignOut style={"link"} text={"Or sign out"} />
        </div>
      </div>
    </div>
  )
}

export default AwayModeEnabled