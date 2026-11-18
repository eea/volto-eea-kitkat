import { slateBeforeEach, slateAfterEach } from '../support/e2e';

describe('Blocks Tests', () => {
  beforeEach(slateBeforeEach);
  afterEach(slateAfterEach);

  it('Add Metadata block: Description', () => {
    // without this the clear command below does nothing sometimes
    cy.clearSlateTitle();
    cy.getSlateTitle().type('My Add-on Page');

    cy.get('.documentFirstHeading').contains('My Add-on Page');

    cy.getSlate().click();

    // Add Metadata Section block
    cy.get('.ui.basic.icon.button.block-add-button').first().click();
    cy.get('.blocks-chooser .title').contains('Common').click();
    cy.get('.content.active.common .button.metadataSection')
      .contains('Metadata Section')
      .click({ force: true });

    cy.get('.objectlist-widget button').contains('Add Field').click();
    cy.get('.objectlist-widget .react-select__value-container')
      .click()
      .type('Summary{enter}');
    cy.get('.block.metadataSection textarea')
      .click()
      .type('Test metadata: Summary');

    // Save
    cy.get('#toolbar-save').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/cypress/my-page');

    // then the page view should contain our changes
    cy.contains('My Add-on Page');
    cy.get('#page-document p').contains('Test metadata: Summary');
  });
});
