import React, { useEffect, useState } from "react"
import { XMarkIcon } from "@heroicons/react/24/outline"
import ProgressBar from "@/components/new-suggestion/progress-bar/progress-bar"
import { useRouter } from "next/router"
import SongInformationArea from "@/components/new-suggestion/areas/song-information.area"
import ReviewArea from "@/components/new-suggestion/areas/review.area"
import { Area } from "@/constants/area"
import { useSelector } from "react-redux"
import { AppState } from "@/redux/store"
import InstrumentsArea from "@/components/new-suggestion/areas/instruments/instruments.area"
import { Database } from "@/types/database"
import { Instrument } from "@/types/database-types"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { getInstruments } from "@/services/instruments.service"
import Spinner from "@/components/utils/spinner"
import ErrorPopup from "@/components/popups/error-popup"

const NewSuggestion = () => {
  const router = useRouter()
  const activeArea = useSelector((state: AppState) => state.newSuggestion.activeArea)

  const supabaseClient = useSupabaseClient<Database>()
  const [instruments, setInstruments] = useState<Instrument[]>([])
  const [showSpinner, setShowSpinner] = useState<boolean>(false)
  const [showLoadingError, setShowLoadingError] = useState<boolean>(false)

  useEffect(() => {
    setShowSpinner(true)
    getInstruments(supabaseClient)
      .then((response) => {
        if (response.error || response.data?.length! > 0) {
          setShowLoadingError(true)
          return
        } else {
          setInstruments(response.data as Instrument[])
        }

        //   response.data?.length! > 0
        //     ? setSuggestions(response.data as Suggestion[])
        //     : setNoSuggestionsMade(true)
      })
      .catch(() => {
        setShowLoadingError(true)
      })
      .finally(() => {
        setShowSpinner(false)
      })
  }, [supabaseClient])

  return (
    <div className={"page-wrapper"}>
      <div className={"flex justify-between"}>
        <div className={"page-header"}>New Suggestion</div>
        <XMarkIcon
          data-cy={"button-discard-new-suggestion"}
          className={"h-8 w-8 cursor-pointer text-zinc-400 hover:text-red-500"}
          onClick={() => router.push("/suggestions")}
        />
      </div>
      {showSpinner && (
        <div className={"h-[75vh] text-center"} data-cy="suggestions-spinner">
          <Spinner size={10} />
        </div>
      )}

      {showLoadingError && (
        <div className={"mt-6"} data-cy="failed-fetching-suggestions">
          <ErrorPopup text={"Failed to load suggestions."} closePopup={() => {}} />
        </div>
      )}
      {!showLoadingError && (
        <div className={"mx-auto text-center lg:w-2/4"}>
          <ProgressBar />
          {activeArea == Area.SongInformation && <SongInformationArea />}
          {activeArea == Area.Instruments && <InstrumentsArea />}
          {activeArea == Area.Review && <ReviewArea />}
        </div>
      )}
    </div>
  )
}

export default NewSuggestion
