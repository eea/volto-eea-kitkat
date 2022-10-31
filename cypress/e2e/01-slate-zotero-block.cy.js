import { slateBeforeEach, slateAfterEach } from '../support/e2e';

describe('Slate citations', () => {
  beforeEach(slateBeforeEach);
  afterEach(slateAfterEach);

  it('Removes citation element when saving Zotero without selecting citation ', () => {
    // Enter text in slate field
    cy.getSlateEditorAndType('Luck is failure that failed.');

    // Zotero element select
    cy.setSlateSelection('Luck', 'failure');
    cy.clickSlateButton('Citation');

    // Zotero as slate element
    cy.get('.slate-editor.selected [contenteditable=true]').find(
      'span[id^="cite_ref"]',
    );

    // Save Zotero without citation
    cy.get('.sidebar-container #zotero-comp .form .header button:first-of-type')
      .wait(2000)
      .click();

    // element is not slate Zotero
    cy.get('.slate-editor.selected [contenteditable=true]').not(
      'span[id^="cite_ref"]',
    );

    // Zotero element select
    cy.setSlateSelection('Luck', 'failure');
    cy.clickSlateButton('Citation');

    // Zotero as slate element
    cy.get('.slate-editor.selected [contenteditable=true]').find(
      'span[id^="cite_ref"]',
    );

    // Exit Zotero without citation
    cy.get(
      '.sidebar-container #zotero-comp .form .header button:nth-of-type(2)',
    )
      .wait(2000)
      .click();

    // element is not slate Zotero
    cy.get('.slate-editor.selected [contenteditable=true]').not(
      'span[id^="cite_ref"]',
    );
  });

  it('Adds Zotero single and multiple citations and correctly indicates it even when deleting citations', () => {
    // intercept the two items in the first collection
    cy.fixture('zotero-items.json').then((itemsResp) => {
      const { body, statusCode, headers } = itemsResp;

      cy.intercept(
        'GET',
        'https://api.zotero.org/users/6732/collections/24C33/items/?start=0&limit=10&sort=title',
        { body, statusCode, headers },
      ).as('itemsResp');
    });

    // intercept xml citation response for first item (citation)
    cy.fixture('zotero-item1.json').then((item1Resp) => {
      const { body, statusCode, headers } = item1Resp;

      cy.intercept(
        'GET',
        'https://api.zotero.org/users/6732/items/INFEDJ40?format=bib&style=https://www.eea.europa.eu/zotero/eea.csl',
        { body, statusCode, headers },
      ).as('item1Resp');
    });

    // intercept xml citation response for second item (citation)
    cy.fixture('zotero-item2.json').then((item2Resp) => {
      const { body, statusCode, headers } = item2Resp;

      cy.intercept(
        'GET',
        'https://api.zotero.org/users/6732/items/QHCG97BD?format=bib&style=https://www.eea.europa.eu/zotero/eea.csl',
        { body, statusCode, headers },
      ).as('item2Resp');
    });

    // Enter text in slate input
    cy.getSlateEditorAndType('Luck is failure that failed.');

    // Zotero
    cy.setSlateSelection('Luck', 'failure');
    cy.clickSlateButton('Citation');

    // select first Zotero collection
    cy.get('.pastanaga-menu-list ul>li button').first().click().wait(2000);

    // select first item from the Zotero collection
    cy.get('.items.pastanaga-menu .pastanaga-menu-list ul li')
      .wait(2000)
      .first()
      .click();

    // click preview button to get the citation
    cy.get('.ui.fluid.card .content .description button')
      .first()
      .click()
      .wait(2000);

    // select second item from the Zotero collection
    cy.get('.items.pastanaga-menu .pastanaga-menu-list ul li')
      .wait(2000)
      .first()
      .next()
      .click();

    // click preview button to get the citation
    cy.get('.ui.fluid.card .content .description button').first().click();

    // save Zotero citation
    cy.get('.sidebar-container #zotero-comp .form .header button:first-of-type')
      .wait(2000)
      .click();

    // element is Zotero element and multiple citations works
    cy.get('.slate-editor.selected [contenteditable=true]')
      .find('span[id^="cite_ref"]')
      .should('have.attr', 'data-footnote-indice', '[1][2]');

    // add new Footnotes block
    cy.getSlateEditorAndType('{enter}');
    cy.get('.ui.basic.icon.button.block-add-button').first().click();
    cy.get('.blocks-chooser .title').contains('Text').click();
    cy.get('.content.active.text .button.slateFootnotes')
      .contains('Footnotes')
      .click();

    // Footnotes block contains one reference
    cy.get('.footnotes-listing-block ol').children().should('have.length', 2);

    // Zotero reference is cited multiple times
    cy.get('.content-area .slate-editor [contenteditable=true]')
      .first()
      .focus()
      .click()
      .setSlateSelection('failed');
    cy.clickSlateButton('Citation');

    // select first Zotero collection
    cy.get('.pastanaga-menu-list ul>li button').wait(2000).first().click();

    // select first item from the Zotero collection
    cy.get('.items.pastanaga-menu .pastanaga-menu-list ul li')
      .wait(2000)
      .first()
      .click();

    // click preview button to get the citation
    cy.get('.ui.fluid.card .content .description button').first().click();

    // save Zotero citation
    cy.get('.sidebar-container #zotero-comp .form .header button:first-of-type')
      .wait(2000)
      .click();

    // element is Zotero element and multiple citations works
    cy.get('.slate-editor.selected [contenteditable=true]')
      .find('span[id^="cite_ref"]')
      .eq(1)
      .should('have.attr', 'data-footnote-indice', '[1]');

    // In Footnotes block first reference has "a,b" to link to citing elements
    cy.get('.footnotes-listing-block ol')
      .children()
      .first()
      .find('sup')
      .contains('a');
    cy.get('.footnotes-listing-block ol')
      .children()
      .first()
      .find('sup')
      .eq(1)
      .contains('b');

    // Delete citation from multiple set
    cy.setSlateSelection('Luck', 'failure');
    cy.get('.slate-inline-toolbar.slate-toolbar')
      .find('a[title^="Edit citation"]')
      .click();

    cy.get(
      '#blockform-fieldset-default .slate-toolbar .ui.fluid.card .content .description .list .item',
    )
      .first()
      .find('a')
      .click();

    // save Zotero citation
    cy.get('.sidebar-container #zotero-comp .form .header button:first-of-type')
      .wait(2000)
      .click();

    // Footnotes block contains one reference
    cy.get('.footnotes-listing-block ol').children().should('have.length', 2);

    // In Footnotes block first reference has "a,b" to link to citing elements
    cy.get('.footnotes-listing-block ol')
      .click()
      .children()
      .first()
      .find('sup')
      .should('have.length', 1)
      .contains('↵');

    // Configure block
    cy.get('[id=sidebar-properties] [name=title]').click().type('Footnotes');
    cy.get('[id=sidebar-properties] label[for=field-global]').click();

    // Save
    cy.get('#toolbar-save').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/cypress/my-page');

    // then the page view should contain our changes
    cy.get('span.citation-item').first().contains('Luck is failure');
    cy.contains('Luck is failure that failed.');
  });

  it('Determines if collection has subCollections and requests that data', () => {
    // intercept Zotero subcollections response
    cy.fixture('zotero-subCollections.json').then((subCollections) => {
      const { body, statusCode, headers } = subCollections;

      cy.intercept(
        'GET',
        'https://api.zotero.org/users/6732/collections/TFU5D/collections/?start=0&limit=10&sort=title',
        { body, statusCode, headers },
      ).as('subCollections');
    });

    // intercept Zotero items response
    cy.fixture('zotero-items3.json').then((items3) => {
      const { body, statusCode, headers } = items3;

      cy.intercept(
        'GET',
        'https://api.zotero.org/users/6732/collections/TFU5D/items/?start=0&limit=10&sort=title',
        { body, statusCode, headers },
      ).as('items3');
    });

    // intercept Zotero subcollection items response
    cy.fixture('zotero-items2.json').then((items2) => {
      const { body, statusCode, headers } = items2;

      cy.intercept(
        'GET',
        'https://api.zotero.org/users/6732/collections/JGTEPMWE/items/?start=0&limit=10&sort=title',
        { body, statusCode, headers },
      ).as('items2');
    });

    // intercept xml citation response for item
    cy.fixture('zotero-item3.json').then((item3Resp) => {
      const { body, statusCode, headers } = item3Resp;

      cy.intercept(
        'GET',
        'https://api.zotero.org/users/6732/items/STUJEJKU?format=bib&style=https://www.eea.europa.eu/zotero/eea.csl',
        { body, statusCode, headers },
      ).as('item3Resp');
    });

    // Enter text in slate input
    cy.getSlateEditorAndType('Luck is failure that failed.');

    // Zotero
    cy.setSlateSelection('Luck', 'failure');
    cy.clickSlateButton('Citation');

    // select third Zotero collection (because it has a subCollection)
    cy.get('.pastanaga-menu-list ul>li:nth-of-type(3) button')
      .wait(2000)
      .click()
      .wait(2000);

    // select first Zotero subCollection
    cy.get('.items.pastanaga-menu .pastanaga-menu-list ul>li button')
      .first()
      .wait(2000)
      .click()
      .wait(2000);

    // select first item from the Zotero collection
    cy.get('.items.pastanaga-menu .pastanaga-menu-list ul li')
      .wait(2000)
      .first()
      .click();

    // click preview button to get the citation
    cy.get('.ui.fluid.card .content .description button').first().click();

    // save Zotero citation
    cy.get('.sidebar-container #zotero-comp .form .header button:first-of-type')
      .wait(2000)
      .click();

    // element is Zotero element and multiple citations works
    cy.get('.slate-editor.selected [contenteditable=true]')
      .find('span[id^="cite_ref"]')
      .should('have.attr', 'data-footnote-indice', '[1]');
  });

  it('Searches for Openaire results Pub and RSD and Zotero results and adds them', () => {
    // intercept Zotero response for search term "forest"
    cy.fixture('zotero-subCollections.json').then((subCollections) => {
      const { body, statusCode, headers } = subCollections;

      cy.intercept(
        'GET',
        'https://api.zotero.org/users/6732/items?q=forest&limit=10&start=0&sort=title',
        { body, statusCode, headers },
      ).as('subCollections');
    });

    // intercept Openaire publications author response for search term "forest"
    cy.fixture('zotero-openaireSearchResultsPub.json').then(
      (openaireSearchResultsPub) => {
        const { body, statusCode, headers } = openaireSearchResultsPub;

        cy.intercept(
          'GET',
          'https://api.openaire.eu/search/publications/?author=forest&format=json&size=20&page=1',
          { body, statusCode, headers },
        ).as('openaireSearchResultsPub');
      },
    );

    // intercept Openaire publications title response for search term "forest"
    cy.fixture('zotero-openaireSearchResultsPub.json').then(
      (openaireSearchResultsPub) => {
        const { body, statusCode, headers } = openaireSearchResultsPub;

        cy.intercept(
          'GET',
          'https://api.openaire.eu/search/publications/?title=forest&format=json&size=20&page=1',
          { body, statusCode, headers },
        ).as('openaireSearchResultsPub');
      },
    );

    // intercept Openaire datasets author response for search term "forest"
    cy.fixture('zotero-openaireSearchResultsRSD.json').then(
      (openaireSearchResultsRSD) => {
        const { body, statusCode, headers } = openaireSearchResultsRSD;

        cy.intercept(
          'GET',
          'https://api.openaire.eu/search/datasets/?author=forest&format=json&size=20&page=1',
          { body, statusCode, headers },
        ).as('openaireSearchResultsRSD');
      },
    );

    // intercept Openaire datasets title response for search term "forest"
    cy.fixture('zotero-openaireSearchResultsRSD.json').then(
      (openaireSearchResultsRSD) => {
        const { body, statusCode, headers } = openaireSearchResultsRSD;

        cy.intercept(
          'GET',
          'https://api.openaire.eu/search/datasets/?title=forest&format=json&size=20&page=1',
          { body, statusCode, headers },
        ).as('openaireSearchResultsRSD');
      },
    );

    // intercept Zotero save item from Openaire response
    cy.fixture('zotero-saveItemResponse.json').then((saveItemResponse) => {
      const { body, statusCode, headers } = saveItemResponse;

      cy.intercept('POST', 'https://api.zotero.org/users/6732/items/', {
        body,
        statusCode,
        headers,
      }).as('saveItemResponse');
    });

    // intercept xml citation response for Zotero item (citation)
    cy.fixture('zotero-item4.json').then((item4Resp) => {
      const { body, statusCode, headers } = item4Resp;

      cy.intercept(
        'GET',
        'https://api.zotero.org/users/6732/items/H8TWWRZC?format=bib&style=https://www.eea.europa.eu/zotero/eea.csl',
        { body, statusCode, headers },
      ).as('item4Resp');
    });

    // Enter text in slate input
    cy.getSlateEditorAndType('Luck is failure that failed.');

    // Zotero select item
    cy.setSlateSelection('Luck', 'failure');
    cy.clickSlateButton('Citation');

    // Enter text "forest" in search input
    cy.get('.collections.pastanaga-menu input')
      .focus()
      .click()
      .wait(2000)
      .type('forest');

    // click search button
    cy.get(
      '.collections.pastanaga-menu header .ui.fluid.action.icon.input button',
    )
      .focus()
      .click();

    // select second item from list (first Openiare result)
    cy.get('.collections.pastanaga-menu .pastanaga-menu-list ul li')
      .wait(2000)
      .first()
      .next()
      .click();

    // click preview button to get the citation
    cy.get('.ui.fluid.card .content .description button').first().click();

    // save Openaire item to Zotero and get citation xml
    cy.get('.sidebar-container #zotero-comp .form .header button:first-of-type')
      .wait(2000)
      .click();

    // element is Zotero element
    cy.get('.slate-editor.selected [contenteditable=true]')
      .find('span[id^="cite_ref"]')
      .should('have.attr', 'data-footnote-indice', '[1]');
  });
});
