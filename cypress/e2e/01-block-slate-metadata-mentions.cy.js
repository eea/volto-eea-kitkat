import { slateBeforeEach, slateAfterEach } from '../support/e2e';

describe('Block Tests: Metadata', () => {
  beforeEach(slateBeforeEach);
  afterEach(slateAfterEach);

  it('As editor I can add metadata mentions', function () {
    // Complete chained commands
    cy.getSlateEditorAndType('Colorless green ideas sleep furiously.');

    // Metadata mention
    cy.setSlateSelection('Colorless', 'green');
    cy.clickSlateButton('Metadata');

    cy.get('.sidebar-container div[id="field-metadata"]')
      .type('Publishing Date{enter}');
    cy.get('.sidebar-container .form .header button:first-of-type').click();

    // Remove link
    cy.setSlateSelection('Colorless')
      .setSlateSelection('green');
    cy.clickSlateButton('Remove metadata');

    // Re-add link
    cy.setSlateSelection('green', 'sleep');
    cy.clickSlateButton('Metadata');

    cy.get('.sidebar-container div[id="field-metadata"]')
      .type('Summary{enter}');
    cy.get('.sidebar-container [id="blockform-fieldset-metadata"] [id="field-description"]')
      .type('blue cats sleep');
    cy.get('.sidebar-container .form .header button:first-of-type').click();

    // Save
    cy.toolbarSave();

    // then the page view should contain a link
    cy.contains('Colorless blue cats sleep furiously.');
  });
});
