import { GetServerSideProps } from "next"
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs"
import { DivisionDatabaseOperation, RepertoireSong, SongInstrument } from "@/types/database-types"
import React, { useEffect, useState } from "react"
import { getSong, moveSongToSuggestions } from "@/services/song.service"
import Link from "next/link"
import { MusicalNoteIcon, XMarkIcon } from "@heroicons/react/24/solid"
import SuggestionLink from "@/components/suggestion/song-information/suggestion-link"
import Instrument from "@/components/suggestion/instrument"
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react"
import { UserAppMetadata } from "@supabase/gotrue-js"
import { Database } from "@/types/database"
import { useRouter } from "next/router"
import ErrorPopup from "@/components/popups/error-popup"
import { deleteDivision, insertDivision } from "@/services/suggestion.service"
import Spinner from "@/components/utils/spinner"

interface SongProps {
  song: RepertoireSong
}

const SongPage = (props: SongProps) => {
  const [song, setSong] = useState<RepertoireSong>(props.song)
  const [roles, setRoles] = useState<UserAppMetadata>()
  const [showSpinner, setShowSpinner] = useState<boolean>(false)
  const [showConversionError, setShowConversionError] = useState<boolean>(false)
  const [showUpdateError, setShowUpdateError] = useState<string>("")
  const supabase = useSupabaseClient<Database>()
  const router = useRouter()
  const user = useUser()
  const uid = user?.id

  useEffect(() => {
    if (supabase) {
      supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setRoles(session?.user?.app_metadata)
        }
      })
    }
  }, [supabase])

  const updateSong = () => {
    setShowSpinner(true)
    getSong(supabase, song.id)
      .then((response) => {
        response.data
          ? setSong(response.data as RepertoireSong)
          : setShowUpdateError("Failed to update the song.")
      })
      .catch(() => setShowUpdateError("Failed to update the song."))
      .finally(() => setShowSpinner(false))
  }

  const updateOrDeleteDivision = async (
    exists: boolean,
    division: DivisionDatabaseOperation,
    divisionLength: number
  ) => {
    if (exists && divisionLength == 0) {
      setShowUpdateError("You're not allowed to remove yourself from this instrument.")
    } else if (exists) {
      deleteDivision(supabase, division).then(({ error }) => {
        if (error) setShowUpdateError("Failed to remove user from the instrument.")
        updateSong()
      })
    } else {
      insertDivision(supabase, division).then(({ error }) => {
        if (error) setShowUpdateError("Failed to add user to the instrument.")
        updateSong()
      })
    }
  }

  const selectInstrument = (songInstrument: SongInstrument) => {
    if (!uid) return

    setShowSpinner(true)

    const division: DivisionDatabaseOperation = {
      musician: uid,
      song_instrument_id: songInstrument.id
    }

    const exists = songInstrument.division.some(({ musician }) => musician.id === uid)
    updateOrDeleteDivision(exists, division, songInstrument.division.length)
      .catch(() => setShowUpdateError("Failed to update the instrument division."))
      .finally(() => setShowSpinner(false))
  }

  const displayButton = (): boolean => roles?.["claims_admin"]

  const moveToSuggestions = () => {
    setShowSpinner(true)
    moveSongToSuggestions(supabase, song.id)
      .then(() => router.push("/repertoire"))
      .catch(() => setShowConversionError(true))
      .finally(() => setShowSpinner(false))
  }

  return <>
    {showSpinner ? (
      <div className={"h-[75vh] text-center"}>
        <Spinner size={10} />
      </div>
    ) : (
      <>
        {song && <div className={"m-4 flex flex-col pt-2"} data-cy="song">

          <div className={"flex"}>
            <p className={"w-full text-2xl leading-8"}>Repertoire</p>
            <Link href={"/repertoire"} data-cy="song-x-icon">
              <XMarkIcon className={"h-8 w-8 text-zinc-400"} />
            </Link>
          </div>

          <div className={"m-2 md:ml-auto md:mr-auto md:max-w-sm"}>
            <p className={"m-4 text-center text-xl font-medium leading-7 text-moon-500"}>
              Song information
            </p>
            <div className={"flex"}>
              <MusicalNoteIcon className={"h-14 w-14 rounded-md bg-neutral-200 p-2 text-black"} />
              <div className={"ml-3"}>
                <p className={"line-clamp-1 font-bold"}>{song.title}</p>
                <p className={"line-clamp-1"}>{song.artist.join(", ")}</p>
              </div>
            </div>
            <div className={"my-3"}><SuggestionLink link={song.link} /></div>
          </div>

          <div className={"flex-col items-center md:flex mt-2"}>
            <p className={"text-center text-xl font-medium text-moon-500"}>Instruments</p>
            <div className={"grid gap-6"}>
              {song.song_instruments.map((instrument) => {
                return (
                  <Instrument
                    key={instrument.id}
                    imageURL={instrument.instrument.image_source}
                    name={instrument.instrument.instrument_name}
                    division={instrument.division}
                    description={instrument.description}
                    uid={uid}
                    onclick={() => {
                      if (showSpinner) return
                      selectInstrument(instrument)
                    }}
                  />
                )
              })}
            </div>
          </div>

          {displayButton() && (
            <div className={"m-8 flex justify-center"}>
              <button className={"btn toSuggestions"} onClick={() => moveToSuggestions()}>
                Move to suggestions
              </button>
            </div>
          )}

          {showConversionError && (
            <div className={"mt-6"}>
              <ErrorPopup
                text={"Failed to convert this song back into a suggestion."}
                closePopup={() => setShowConversionError(false)}
              />
            </div>
          )}

          {showUpdateError &&
            <div className={"mt-6"}>
              <ErrorPopup text={showUpdateError} closePopup={() => setShowUpdateError("")} />
            </div>
          }

        </div>
        }

      </>
    )
    }
  </>
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const supabase = createPagesServerClient(context)
  const { params } = context
  try {
    let { data } = await getSong(supabase, params?.song as string)
    if (data == null) return { notFound: true }
    return { props: { song: data } }
  } catch {
    return { notFound: true }
  }
}

export default SongPage