import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { Event } from "@/types/database-types"
import { GetServerSideProps } from "next"
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs"
import { getEvent } from "@/services/event.service"
import { XMarkIcon } from "@heroicons/react/24/solid"
import EventInfoCard from "@/components/events/event-info-card"
import AttendanceButton from "@/components/events/attendance-button"
import AttendingMembers from "@/components/events/attending-members"
import { FolderMinusIcon } from "@heroicons/react/24/outline"
import DeleteEventOverlay from "@/components/overlays/delete-event.overlay"
import { useUser } from "@supabase/auth-helpers-react"

interface EventPageProps {
  event: Event
}

const EventPage = ({ event }: EventPageProps) => {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const user = useUser()
  const isAdmin = user?.app_metadata.claims_admin

  return (
    <div className={"page-wrapper lg:w-3/5"}>
      <div className={"flex justify-between"}>
        <div className={"page-header"}>Event</div>
        <div className={"flex flex-row gap-2"}>
          {isAdmin && (
            <FolderMinusIcon
              data-cy={"delete-event-btn"}
              className={"h-8 w-8 cursor-pointer text-red-500 hover:text-red-400"}
              onClick={() => setIsOpen(true)}
            />
          )}
          <XMarkIcon
            data-cy={"button-back-to-events"}
            className={"h-8 w-8 cursor-pointer text-zinc-400 hover:text-red-500"}
            onClick={() => router.push("/events")}
          />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <EventInfoCard event={event} />
        <AttendanceButton eventId={event.id} />
        <p className={"text-center text-xl font-medium text-moon"}>Attending Members</p>
        <AttendingMembers eventId={event.id} />
      </div>
      {isOpen && <DeleteEventOverlay event={event} onClose={() => setIsOpen(false)} />}
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const supabase = createPagesServerClient(context)
  const { params } = context
  try {
    let { data } = await getEvent(supabase, params?.event as string)
    if (data == null) return { notFound: true }
    return { props: { event: data } }
  } catch {
    return { redirect: { destination: "/500", permanent: false } }
  }
}
export default EventPage
