const displayName = "New"
const newPassword = Cypress.env("CYPRESS_NEW_PASSWORD")
const errorPopup = "error-popup-change-password"
const displayNameTextfield = "set-name-textfield"
const passwordTextfield = "change-password-textfield"
const confirmPasswordTextfield = "change-password-confirm-textfield"
const submitPasswordBtn = "submit-password-btn"
const shortPassword = "test"
describe("Change password", () => {
  beforeEach(() => {
    //this ensures the user is logged in when visiting the change password page
    cy.logout()
    cy.deleteNewUser()
    cy.login(true)
    cy.visit("/change-password")
  })

  it("should login when changing password", () => {
    cy.data(displayNameTextfield).type(displayName)
    cy.data(passwordTextfield).type(newPassword)
    cy.data(confirmPasswordTextfield).type(newPassword)
    cy.data(submitPasswordBtn).click()
    cy.location("pathname").should("equal", "/")
  })

  it("should all give error messages when nothing is filled in", () => {
    cy.data(submitPasswordBtn).click()
    cy.data(`${confirmPasswordTextfield}-error`).contains("Confirm Password is required")
    cy.data(`${passwordTextfield}-error`).contains("Password is required")
    cy.data(`${displayNameTextfield}-error`).contains("Username is required")
  })

  it("should give error when passwords are not the same", () => {
    cy.data(passwordTextfield).type("test12345")
    cy.data(confirmPasswordTextfield).type("test123456")
    cy.data(submitPasswordBtn).click()
    cy.data(`${confirmPasswordTextfield}-error`).contains("Passwords do not match")
  })

  it("should give error when new password is too short", () => {
    cy.data(passwordTextfield).type(shortPassword)
    cy.data(confirmPasswordTextfield).type(shortPassword)
    cy.data(submitPasswordBtn).click()
    cy.data(`${passwordTextfield}-error`).contains("Password should at least be 6 characters.")
  })
})