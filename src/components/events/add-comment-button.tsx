import React, { useCallback, useEffect, useState } from "react"
import { ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/outline"
import AddCommentOverlay from "@/components/overlays/add-comment.overlay"
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react"
import { Database } from "@/types/database"
import { getComment } from "@/services/event.service"
import { toast } from "react-toastify"
import SpinnerStripes from "@/components/utils/spinner-stripes"

interface AddCommentButtonProps {
  eventId: string
}

const AddCommentButton = ({ eventId }: AddCommentButtonProps) => {
  const supabase = useSupabaseClient<Database>()
  const uid = useUser()?.id
  const [showOverlay, setShowOverlay] = useState<boolean>(false)
  const [commentValue, setCommentValue] = useState<string | null>("")
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const fetchCommentValue = useCallback(() => {
    if (uid) {
      setIsLoading(true)
      getComment(supabase, eventId, uid).then(({ data, error }) => {
        if (error) toast.error("Something went wrong while retrieving your saved comment.")
        if (data) setCommentValue(data.comment)
        setIsLoading(false)
      })
    }
  }, [eventId, supabase, uid])

  const hideOverlay = (updated: boolean) => {
    if (updated) fetchCommentValue()
    setShowOverlay(false)
  }

  useEffect(() => fetchCommentValue(), [fetchCommentValue])

  return (
    <div className={"mb-2 text-center"}>
      <button
        data-cy={"add-comment-button"}
        type={"button"}
        onClick={() => setShowOverlay(true)}
        disabled={isLoading}
        className={`inline-flex w-36 min-w-[9rem] justify-center gap-2 rounded-lg 
          border border-sky-500 px-2 py-1 align-baseline text-sm text-sky-500 
          hover:bg-sky-500 hover:text-white focus:ring-2 focus:ring-sky-500`}
      >
        {isLoading ? (
          <SpinnerStripes dataCy={"add-comment-button-loader"} size={5} stroke={"stroke-sky-500"} />
        ) : (
          <>
            <ChatBubbleBottomCenterTextIcon className={"inline h-5"} />
            <span>{commentValue ? "Edit" : "Add"} comment</span>
          </>
        )}
      </button>
      {showOverlay && (
        <AddCommentOverlay
          onClose={(updated: boolean) => hideOverlay(updated)}
          eventId={eventId}
          commentValue={commentValue}
        />
      )}
    </div>
  )
}

export default AddCommentButton
