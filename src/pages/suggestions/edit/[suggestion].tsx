import React, { useState } from "react"
import SuggestionPageSection from "@/components/new-suggestion/suggestion-page-section"
import { GetServerSideProps } from "next"
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs"
import { getSuggestion, getAuthorOfSuggestion } from "@/services/suggestion.service"
import { Suggestion } from "@/types/database-types"
import { NewSuggestion, NewSuggestionInstrument } from "@/interfaces/new-suggestion"

export const getServerSideProps: GetServerSideProps = async (context) => {
  const supabase = createPagesServerClient(context)
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { params } = context
  try {
    const { data: authorData } = await getAuthorOfSuggestion(supabase, params?.suggestion as string)

    // No suggestion found at all
    if (authorData === null) {
      return { notFound: true }
    }

    // If the the user does not match with the
    if (session?.user.id !== authorData.author) {
      return {
        redirect: {
          destination: "/403",
          permanent: false,
        },
      }
    }

    //Fetch the suggestion from the database
    const { data } = await getSuggestion(supabase, params?.suggestion as string)
    if (data == null) return { notFound: true }

    return { props: { suggestion: data } }
  } catch {
    return { notFound: true }
  }
}

interface EditSuggestionPageProps {
  suggestion: Suggestion
}

const EditSuggestionPage = (props: EditSuggestionPageProps) => {
  //TODO: add method to retrieve correct suggestion to edit

  const suggestionInstruments: NewSuggestionInstrument[] = []

  props.suggestion.suggestion_instruments.forEach((element) => {
    // console.log(element.description)
    suggestionInstruments.push({
      description: element.description || "",
      instrument: element.instrument,
    })
  })
  const [suggestion] = useState<NewSuggestion>({
    artist: props.suggestion.artist,
    link: props.suggestion.link,
    motivation: props.suggestion.motivation,
    title: props.suggestion.title,
    instruments: suggestionInstruments,
  })

  return <SuggestionPageSection title={"Edit Suggestion"} suggestion={suggestion} />
}

export default EditSuggestionPage
