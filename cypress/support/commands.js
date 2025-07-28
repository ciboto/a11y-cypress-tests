import 'cypress-axe'
import 'cypress-plugin-tab';


Cypress.Commands.add('injectAxeAndCheck', () => {
  cy.injectAxe()
  cy.checkA11y(null, null, terminalLog)
})

function terminalLog(violations) {
  violations.forEach(({ id, impact, description, nodes }) => {
    console.log(`${impact} issue (${id}): ${description} on ${nodes.length} node(s)`)
  })
}
