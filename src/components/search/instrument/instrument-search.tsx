import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline"
import React, { useEffect, useRef, useState } from "react"
import InstrumentSearchItem from "./instrument-search-item"
import { Instrument } from "@/types/database-types"

interface InstrumentSearchProps {
  instruments: Instrument[]
  onInstrumentSelected(instrument: Instrument): boolean
}

const InstrumentSearch = ({ instruments, onInstrumentSelected }: InstrumentSearchProps) => {
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [searchResults, setSearchResults] = useState<Instrument[]>([])
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const listRef = useRef<HTMLUListElement>(null)

  const handleSearch = (value: string) => {
    setSearchTerm(value)

    const searchResults = instruments.filter((instruments) =>
      instruments.instrument_name.toLowerCase().includes(value.toLowerCase())
    )

    setSearchResults(searchResults)
  }

  const handleClickOutside = (event: MouseEvent | TouchEvent) => {
    if (listRef.current && !listRef.current.contains(event.target as Node)) {
      setIsSearchFocused(false)
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("touchstart", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchstart", handleClickOutside)
    }
  }, [])

  const handleSearchBlur = () => {
    // Use setTimeout to allow time for a click event on the list item to be registered
    setTimeout(() => {
      setIsSearchFocused(false)
    }, 200)
  }

  const clearSearch = () => {
    setSearchTerm("")
    setSearchResults([])
  }

  const onSelected = (instrument: Instrument) => {
    onInstrumentSelected(instrument)
    clearSearch()
    return true
  }

  const boldSpecificTextSections = (str: string, find: string) => {
    var re = new RegExp(find, "gi")

    const newString = str.replace(re, "<b>" + find + "</b>")

    //if the first occurrence is the bold tag, Capitalize the letter inside that bold tag.
    if (newString.charAt(0) === "<")
      return newString.replace(
        `<b>${newString.charAt(3)}`,
        `<b>${newString.charAt(3).toUpperCase()}`
      )

    return newString
  }

  return (
    <div className="relative">
      <div className="h-12 ">
        <input
          type="text"
          placeholder="Enter an instrument..."
          value={searchTerm}
          data-cy="search-instrument-input"
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={handleSearchBlur}
          className="flex w-full rounded-lg  px-4 py-2 pr-10 outline outline-1 outline-gray-300  focus:outline-moon-300"
        />
        {searchTerm ? (
          <XMarkIcon
            onClick={() => clearSearch()}
            className="absolute right-0 top-0 mr-3 mt-3 h-5 w-5 text-gray-400"
          />
        ) : (
          <MagnifyingGlassIcon className="absolute right-0 top-0 mr-3 mt-3 h-5 w-5 text-gray-400" />
        )}
      </div>
      {isSearchFocused && searchResults.length > 0 && (
        <div className="absolute z-10 w-full rounded-md bg-white shadow-md outline outline-1 outline-gray-300">
          <ul ref={listRef} data-cy="instrument-search-list">
            {searchResults.map((instrumentItem: Instrument, index: number) => {
              return (
                <InstrumentSearchItem
                  onClick={(instrument) => onSelected(instrument)}
                  instrument={instrumentItem}
                  textNode={
                    <div
                      dangerouslySetInnerHTML={{
                        __html: boldSpecificTextSections(
                          instrumentItem.instrument_name,
                          searchTerm
                        ),
                      }}
                    ></div>
                  }
                  key={instrumentItem.instrument_name}
                />
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}

export default InstrumentSearch
