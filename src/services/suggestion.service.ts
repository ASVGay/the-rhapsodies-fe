import { SupabaseClient } from "@supabase/supabase-js"
import { Database } from "@/types/database"
import { DivisionDatabaseOperation } from "@/types/database-types"

export const getSuggestions = async (supabase: SupabaseClient<Database>) => {
  return supabase.from("suggestion").select(`
      *,
      suggestion_instruments:suggestion_instrument (
        id,
        instrument (*),
        division (*)
      )
    `)
}

export const getSuggestion = async (supabase: SupabaseClient<Database>, id: string) => {
  return supabase
    .from("suggestion")
    .select(
      `*,
        author (display_name),
        suggestion_instruments:suggestion_instrument (
          id,
          instrument (*),
          division (
            *,
            musician (display_name, id)
          )
        )`
    )
    .eq("id", id)
    .limit(1)
    .single()
}

export const getInstrumentImage = (sourceName: string) => {
  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1684372007/instrument-icons/${sourceName}.svg`
}

export const insertDivision = (
  supabaseClient: SupabaseClient<Database>,
  division: DivisionDatabaseOperation
) => {
  return supabaseClient.from("division").insert(division)
}

export const deleteDivision = (
  supabaseClient: SupabaseClient<Database>,
  division: DivisionDatabaseOperation
) => {
  return supabaseClient
    .from("division")
    .delete()
    .eq("musician", division.musician)
    .eq("suggestion_instrument_id", division.suggestion_instrument_id)
}
