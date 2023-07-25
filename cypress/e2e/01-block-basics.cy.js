import { slateBeforeEach, slateAfterEach } from '../support/e2e';

describe('Blocks Tests', () => {
  beforeEach(slateBeforeEach);
  afterEach(slateAfterEach);

  it('Add Block: Empty', () => {
    cy.clearSlateTitle();
    cy.getSlateTitle().type('My Add-on Page');

    cy.get('.documentFirstHeading').contains('My Add-on Page');

    cy.getSlate().click();

    cy.get('#toolbar-save').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/cypress/my-page');

    cy.get('#toolbar-personal').click();
    cy.contains('Site Setup').click();

    cy.contains('Version Overview');
    cy.contains('Frontend');
    cy.contains('History');
    cy.contains('Backend');
    cy.contains('Plone');
    cy.contains('plone.restapi');
    cy.contains('CMF');
    cy.contains('Zope');
    cy.contains('Python');
    cy.contains('PIL');
  });
});
