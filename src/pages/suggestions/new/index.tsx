import React from "react"
import { useSelector } from "react-redux"
import { AppState } from "@/redux/store"
import SuggestionPageSection from "@/components/new-suggestion/suggestion-page-section"

const NewSuggestion = () => {
  const suggestion = useSelector((state: AppState) => state.newSuggestion.suggestion)

  return <SuggestionPageSection title={"New Suggestion"} suggestion={suggestion} />
}

export default NewSuggestion
