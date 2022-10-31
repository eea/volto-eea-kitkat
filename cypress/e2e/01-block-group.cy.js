import { slateBeforeEach, slateAfterEach } from '../support/e2e';

describe('Blocks Tests', () => {
  beforeEach(slateBeforeEach);
  afterEach(slateAfterEach);

  it('Add Block: Empty', () => {
    // Change page title
    cy.clearSlateTitle();
    cy.getSlateTitle().type('My Add-on Page');

    cy.get('.documentFirstHeading').contains('My Add-on Page');

    cy.getSlate().click();

    // Add block
    cy.get('.ui.basic.icon.button.block-add-button').first().click();
    cy.get('.blocks-chooser .title').contains('Common').click();
    cy.get('.content.active.common .button.group')
      .contains('Section (Group)')
      .click({ force: true });

    cy.get('.block-editor-group [contenteditable=true]')
      .focus()
      .click()
      .type('test{enter}');
    cy.get('.block-editor-group [contenteditable=true]')
      .eq(1)
      .focus()
      .click()
      .type('test2{enter}');
    cy.get('.block-editor-group [contenteditable=true]')
      .eq(2)
      .focus()
      .click()
      .type('test3');

    cy.get('.block-toolbar svg')
      .first()
      .trigger('mousedown', { button: 0 })
      .trigger('mousemove', 10, -40, { force: true })
      .trigger('mouseup', 10, -40, { force: true });

    // Save
    cy.get('#toolbar-save').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/cypress/my-page');

    // then the page view should contain our changes
    cy.contains('My Add-on Page');
    cy.contains('test2');
  });
});
