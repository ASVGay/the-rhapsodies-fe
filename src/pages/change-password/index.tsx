import React, { useEffect, useState } from "react"
import SignInTextField from "@/components/text-fields/sign-in-text-field"
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react"
import { Database } from "@/types/database"
import { setName } from "@/services/authentication.service"
import { useRouter } from "next/router"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import { FormDataItem } from "@/interfaces/form-data-item"
import ErrorMessage from "@/components/error/error-message"
import TermsAndConditions from "@/components/overlays/terms-and-conditions"
import { CheckIcon } from "@heroicons/react/24/solid"
import { getMarkdownData } from "@/helpers/markdown.helper"
import { OverlayContent } from "@/interfaces/overlay-content"
import { getOverlay } from "@/helpers/overlay.helper"

export async function getStaticProps() {
  const markdownData = await getMarkdownData("src/lib/terms-and-conditions.md")
  const overlayContent: OverlayContent = {
    title: "Terms and Conditions",
    content: markdownData,
    footer: "By accepting, you agree to our terms and conditions.",
    buttonText: "Close",
  }

  return {
    props: {
      overlayContent,
    },
  }
}

interface ChangePasswordProps {
  overlayContent: OverlayContent
}

const ChangePassword = ({ overlayContent }: ChangePasswordProps) => {
  const supabase = useSupabaseClient<Database>()
  const user = useUser()
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState("")
  const [showTerms, setShowTerms] = useState(false)

  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
    setValue,
  } = useForm()

  useEffect(() => {
    watch(() => setErrorMessage(""))
  }, [watch])

  const password = watch("password")
  const isChecked = watch("terms")

  const changePasswordFormData: FormDataItem[] = [
    {
      tag: "name",
      type: "text",
      placeholder: "Name",
      dataCy: "set-name-textfield",
      validationOptions: { required: "Username is required" },
    },
    {
      tag: "password",
      type: "password",
      placeholder: "Password",
      dataCy: "change-password-textfield",
      validationOptions: {
        required: "Password is required",
        minLength: { value: 6, message: "Password should at least be 6 characters." },
      },
    },
    {
      tag: "confirmPassword",
      type: "password",
      placeholder: "Confirm Password",
      dataCy: "change-password-confirm-textfield",
      validationOptions: {
        required: "Confirm Password is required",
        validate: (value) => value === password || "Passwords do not match",
      },
    },
  ]

  const submitNewPassword: SubmitHandler<FieldValues> = async ({ name, password }) => {
    if (!user) return

    const { data, error } = await supabase.auth.updateUser({ password })

    if (error) {
      setErrorMessage("Change password failed, try again")
    } else if (data) {
      setName(supabase, user.id, name)
        .then((response) => {
          const { error } = response
          if (error) {
            setErrorMessage("Something went wrong, try again")
          } else router.push("/")
        })
        .catch(() => {
          setErrorMessage("Something went wrong, try again")
        })
    }
  }

  return (
    <div>
      <div className={"full-bg-moon-50"}>
        <div className={"auth-container"}>
          <div className={"flex w-full flex-col justify-center gap-6"}>
            <span className={"w-fit font-semibold leading-8 text-black"}>
              Welcome to the application of The Rhapsodies! Please give us your name and change your
              password.
            </span>
          </div>
          <form className={"flex flex-col gap-6"} onSubmit={handleSubmit(submitNewPassword)}>
            {changePasswordFormData.map(({ dataCy, placeholder, validationOptions, tag, type }) => {
              return (
                <div className="flex w-full flex-col gap-2" key={tag}>
                  <SignInTextField
                    tag={tag}
                    validationOptions={validationOptions}
                    register={register}
                    type={type}
                    placeholder={placeholder}
                    dataCy={dataCy}
                  />
                  {errors[tag] && (
                    <ErrorMessage
                      dataCy={`${dataCy}-error`}
                      message={errors[tag]?.message?.toString()}
                    />
                  )}
                </div>
              )
            })}
            <div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={isChecked}
                  {...register("terms", {
                    onChange: () => setValue("terms", !isChecked),
                    required: true,
                  })}
                  className="sr-only"
                />
                <div
                  onClick={() => setValue("terms", !isChecked)}
                  data-cy="terms-conditions-checkbox"
                  className={`relative mr-4 flex h-6 min-w-[24px] cursor-pointer items-center justify-center rounded border-2 border-gray-300 checked:bg-black 
                  ${isChecked && "border-none bg-moon-500"}`}
                >
                  {isChecked && <CheckIcon className="absolute h-5 w-5 text-white" />}
                </div>
                <span>
                  I agree to the{" "}
                  <a
                    data-cy="terms-conditions-link"
                    onClick={() => setShowTerms(true)}
                    className="cursor-pointer text-moon-500"
                  >
                    Terms and Conditions.
                  </a>
                </span>
              </div>
              {errors["terms"] && (
                <ErrorMessage dataCy={`terms-error`} message={"Terms and Conditions is required"} />
              )}
            </div>
            <button className={"btn"} data-cy={"submit-password-btn"}>
              Submit
            </button>
            {errorMessage !== "" && (
              <ErrorMessage dataCy={"submit-password-err"} message={errorMessage} />
            )}
          </form>
          {showTerms &&
            getOverlay(
              <TermsAndConditions
                overlayContent={overlayContent}
                onClose={() => setShowTerms(false)}
              />
            )}
        </div>
      </div>
    </div>
  )
}

export default ChangePassword
