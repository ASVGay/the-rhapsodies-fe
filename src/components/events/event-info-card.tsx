import React from "react"
import { getEventImage, getTitle } from "@/helpers/event.helper"
import { CalendarIcon, ClockIcon, MapPinIcon } from "@heroicons/react/24/outline"
import { format } from "date-fns"
import { Event } from "@/types/database-types"

interface EventInfoCardProps {
  event: Event
}

const EventInfoCard = ({ event }: EventInfoCardProps) => {
  const title = getTitle(event.event_type)

  return (
    <div>
      <div className={"relative text-center"}>
        <img
          src={getEventImage(event.event_type)}
          alt={`Background image ${title}`}
          className={"h-32 w-full rounded-lg object-cover brightness-[30%] filter"}
        />
        <div className="content absolute left-1/2 top-1/2 w-max -translate-x-1/2 -translate-y-1/2 text-neutral-200">
          <p data-cy={"event-title"} className={"text-lg font-bold text-white"}>
            {title}
          </p>
          <p data-cy={"event-date"} className={"info-item"}>
            <CalendarIcon />
            {format(new Date(event.start_time), "cccc, LLLL d")}
          </p>
          <p data-cy={"event-time"} className={"info-item"}>
            <ClockIcon />
            {format(new Date(event.start_time), "HH:mm")} -{" "}
            {format(new Date(event.end_time), "HH:mm")}
          </p>
          <p data-cy={"event-location"} className={"info-item"}>
            <MapPinIcon />
            {event.location}
          </p>
        </div>
      </div>
    </div>
  )
}

export default EventInfoCard
