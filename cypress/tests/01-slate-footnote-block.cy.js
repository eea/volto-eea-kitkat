import { slateBeforeEach, slateAfterEach } from '../support/e2e';

const API_PATH = Cypress.env('API_PATH') || 'http://localhost:8080/Plone';
const AUTH = {
  user: 'admin',
  pass: 'admin',
};

const buildFootnoteNode = ({ footnote, extra = [] }) => ({
  type: 'footnote',
  data: {
    uid: 'uid1',
    footnote,
    ...(extra.length
      ? {
          extra: extra.map((citation, index) => ({
            uid: `uid${index + 2}`,
            footnote: citation,
          })),
        }
      : {}),
  },
  children: [{ text: 'green' }],
});

const setFootnoteBlocks = ({
  footnote = null,
  extra = [],
  title = 'Footnotes',
}) => {
  const blocks = {
    title: {
      '@type': 'title',
    },
    slate: {
      '@type': 'slate',
      plaintext: footnote
        ? 'Colorless green ideas sleep furiously.'
        : 'Colorless ideas sleep furiously.',
      value: [
        {
          type: 'p',
          children: footnote
            ? [
                { text: 'Colorless ' },
                buildFootnoteNode({ footnote, extra }),
                { text: ' ideas sleep furiously.' },
              ]
            : [{ text: 'Colorless ideas sleep furiously.' }],
        },
      ],
    },
  };

  if (footnote) {
    blocks.footnotes = {
      '@type': 'slateFootnotes',
      title,
      global: true,
    };
  }

  return cy.request({
    method: 'PATCH',
    url: `${API_PATH}/cypress/my-page`,
    headers: {
      Accept: 'application/json',
    },
    auth: AUTH,
    body: {
      blocks,
      blocks_layout: {
        items: Object.keys(blocks),
      },
    },
  });
};

const visitPageView = () => {
  cy.visit('/cypress/my-page');
  cy.waitForResourceToLoad('my-page');
};

describe('Slate citations', () => {
  beforeEach(slateBeforeEach);
  afterEach(slateAfterEach);

  it('renders a single citation and footnotes block', () => {
    setFootnoteBlocks({ footnote: 'Citation' });
    visitPageView();

    cy.get('span.citation-item').contains('green');
    cy.contains('Footnotes');
    cy.contains('Citation');
    cy.get('[aria-label="Back to content"]').first().click();
  });

  it('does not render footnotes when no citation is saved', () => {
    setFootnoteBlocks({});
    visitPageView();

    cy.contains('My Page');
    cy.get('span.citation-item').should('not.exist');
    cy.contains('Footnotes').should('not.exist');
  });

  it('renders multiple citations for the same reference', () => {
    setFootnoteBlocks({
      footnote: 'Citation',
      extra: ['Yet another citation'],
    });
    visitPageView();

    cy.get('span.citation-item').contains('green');
    cy.contains('Footnotes');
    cy.contains('Citation');
    cy.contains('Yet another citation');
  });
});
