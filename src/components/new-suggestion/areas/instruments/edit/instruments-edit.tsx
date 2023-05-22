import { NewSuggestionInstrument } from "@/interfaces/new-suggestion"
import InstrumentsEditItem from "./instruments-edit-item"
import { AppDispatch, AppState } from "@/redux/store"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { updateNewSuggestion } from "@/redux/slices/new-suggestion.slice"

const InstrumentsEdit = () => {
  const dispatch: AppDispatch = useDispatch()
  const newSuggestion = useSelector((state: AppState) => state.newSuggestion.suggestion)
  const [instrumentItems, setInstrumentItems] = useState<NewSuggestionInstrument[]>(
    newSuggestion.instruments
  )

  useEffect(() => {
    setInstrumentItems(newSuggestion.instruments)
  }, [instrumentItems, newSuggestion])

  const onDeleteInstrument = (index: number): boolean => {
    const newItems = [...instrumentItems]
    newItems.splice(index, 1)

    dispatch(
      updateNewSuggestion({
        ...newSuggestion,
        instruments: newItems,
      })
    )
    return true
  }

  const onNoteChanged = (index: number, description: string) => {
    const newItems = [...instrumentItems]
    newItems[index] = { ...newItems[index], description }

    dispatch(
      updateNewSuggestion({
        ...newSuggestion,
        instruments: newItems,
      })
    )

    return true
  }

  return (
    <div>
      {instrumentItems.map((instrumentItem: NewSuggestionInstrument, index) => {
        return (
          <InstrumentsEditItem
            onDeleteClick={() => onDeleteInstrument(index)}
            instrumentItem={instrumentItem}
            onNoteChanged={(description) => onNoteChanged(index, description)}
            key={index}
          />
        )
      })}
    </div>
  )
}

export default InstrumentsEdit
