import React, { useEffect, useState } from "react"
import Spinner from "@/components/utils/spinner"
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react"
import { Database } from "@/types/database"
import { EventWithAttendance } from "@/types/database-types"
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline"
import EventCard from "@/components/events/event-card"
import { getEventsWithAttendees } from "@/services/event.service"
import { getDisplayName } from "@/services/authentication.service"

export default function Home() {
  const [showSpinner, setShowSpinner] = useState<boolean>(true)
  const [displayName, setDisplayName] = useState<string>("")
  const [upcomingEvent, setUpcomingEvent] = useState<EventWithAttendance>()
  const [showEventError, setShowEventError] = useState<boolean>(false)

  const supabase = useSupabaseClient<Database>()
  const uid = useUser()?.id

  useEffect(() => {
    setShowSpinner(true)

    if (uid) {
      getDisplayName(supabase, uid).then(({ data, error }) => {
        if (data) setDisplayName(data.display_name)
      })
    }

    getEventsWithAttendees(supabase)
      .then(({ data, error }) => {
        if (data) setUpcomingEvent((data as EventWithAttendance[])[0])
        else setShowEventError(true)
      })
    setShowSpinner(false)
  }, [])

  return <>
    {showSpinner ? (
      <div className={"h-[75vh] text-center"}>
        <Spinner size={10} />
      </div>
    ) : (<>
        <div className={"m-4 flex flex-col pt-2 gap-4"}>
          <div className={"flex flex-col w-full"}>
            <b className={"text-2xl leading-8"}>Home</b>
          </div>
          <div className={"flex justify-center flex-col text-center"}>
            <p><span className={"text-moon-400"}>Hi {displayName}! </span>Check out the next event or start browsing the app.</p>
            {upcomingEvent &&
              <EventCard key={upcomingEvent.id} event={upcomingEvent} setShowSpinner={setShowSpinner} />}
            {showEventError &&
              <div className={"max-w-m flex items-center justify-center gap-4 text-zinc-400"}>
                <div><ExclamationTriangleIcon className={"h-[50px] w-[50px]"} /></div>
                <p>No upcoming events..</p>
              </div>
            }
          </div>
        </div>
      </>
    )}
  </>
}
