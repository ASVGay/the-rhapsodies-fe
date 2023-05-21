const suggestionId = Cypress.env("CYPRESS_SUGGESTION_ID")
const username = Cypress.env("CYPRESS_USERNAME")

describe("suggestion detail page", () => {

  context("suggestion exists", () => {
    beforeEach(() => {
      cy.login()
      cy.visit(`/suggestions/${suggestionId}`)
    })

    it("should contain a suggestion", () => {
      cy.data("suggestion").should("exist")
    })

    it("should add or remove username from division", () => {
      cy.data("division").first().then((division) => {
        const criteria = division.text().includes(username)
        cy.data("division").first().click().should(`${criteria ? "not." : ""}contain.text`, username)
      })
    })
  })

  context("suggestion doesn't exists", () => {
    before(() => {
      cy.login()
    })

    it("should display 404 page", () => {
      cy.request({ url: "/suggestions/non-existing-id", failOnStatusCode: false })
        .its("status").should("equal", 404)
    })

  })

})
