import { slateBeforeEach, slateAfterEach } from '../support/e2e';

describe('Slate citations', () => {
  beforeEach(slateBeforeEach);
  afterEach(slateAfterEach);

  it('Add Footnotes block and create citation', () => {
    // Complete chained commands
    cy.getSlateEditorAndType('Colorless green ideas sleep furiously.')
      .type('{selectAll}')
      .dblclick();

    // Footnote
    cy.setSlateCursor('Colorless').dblclick();
    cy.setSlateSelection('Colorless', 'green');
    cy.clickSlateButton('Footnote');

    cy.get('.sidebar-container .field-wrapper-footnote .react-select-container')
      .click()
      .type('Citation{enter}');
    cy.get('.sidebar-container .form .header button:first-of-type').click();

    // Add block
    cy.getSlateEditorAndType('{enter}');

    cy.get('.ui.basic.icon.button.block-add-button').first().click();
    cy.get('.blocks-chooser .title').contains('Text').click();
    cy.get('.content.active.text .button.slateFootnotes')
      .contains('Footnotes')
      .click();

    // Configure block
    cy.get('[id=sidebar-properties] [name=title]').click().type('Footnotes');
    cy.get('[id=sidebar-properties] label[for=field-global]').click();

    // Save
    cy.get('#toolbar-save').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/cypress/my-page');

    // then the page view should contain our changes
    cy.get('span.citation-item').contains('Colorless green');
    cy.contains('Footnotes');
    cy.contains('Citation');
  });

  it('Add Footnotes block and create multiple citations', () => {
    // Complete chained commands
    cy.getSlateEditorAndType('Colorless green ideas sleep furiously.')
      .type('{selectAll}')
      .dblclick();

    // Footnote
    cy.setSlateCursor('Colorless').dblclick();
    cy.setSlateSelection('Colorless', 'green');
    cy.clickSlateButton('Footnote');

    cy.get('.sidebar-container .field-wrapper-footnote .react-select-container')
      .click()
      .type('Citation{enter}')
      .type('Yet another citation{enter}');
    cy.get('.sidebar-container .form .header button:first-of-type').click();

    // Add block
    cy.getSlateEditorAndType('{enter}');

    cy.get('.ui.basic.icon.button.block-add-button').first().click();
    cy.get('.blocks-chooser .title').contains('Text').click();
    cy.get('.content.active.text .button.slateFootnotes')
      .contains('Footnotes')
      .click();

    // Configure block
    cy.get('[id=sidebar-properties] [name=title]').click().type('Footnotes');
    cy.get('[id=sidebar-properties] label[for=field-global]').click();

    // Save
    cy.get('#toolbar-save').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/cypress/my-page');

    // then the page view should contain our changes
    cy.get('span.citation-item').contains('Colorless green');
    cy.contains('Footnotes');
    cy.contains('Citation');
    cy.contains('Yet another citation');
  });
});
