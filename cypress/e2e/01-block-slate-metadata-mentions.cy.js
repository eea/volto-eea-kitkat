import { slateBeforeEach, slateAfterEach } from '../support/e2e';

const API_PATH = Cypress.env('API_PATH') || 'http://localhost:8080/Plone';
const AUTH = {
  user: 'admin',
  pass: 'admin',
};

const setMetadataMentionBlocks = () =>
  cy.request({
    method: 'PATCH',
    url: `${API_PATH}/cypress/my-page`,
    headers: {
      Accept: 'application/json',
    },
    auth: AUTH,
    body: {
      description: 'blue cats sleep',
      blocks: {
        title: {
          '@type': 'title',
        },
        slate: {
          '@type': 'slate',
          plaintext: 'Colorless blue cats sleep furiously.',
          value: [
            {
              type: 'p',
              children: [
                { text: 'Colorless ' },
                {
                  type: 'mention',
                  data: {
                    metadata: 'description',
                    widget: 'string',
                    description: 'blue cats sleep',
                  },
                  children: [{ text: 'green ideas sleep' }],
                },
                { text: ' furiously.' },
              ],
            },
          ],
        },
      },
      blocks_layout: {
        items: ['title', 'slate'],
      },
    },
  });

describe('Block Tests: Metadata', () => {
  beforeEach(slateBeforeEach);
  afterEach(slateAfterEach);

  it('renders saved metadata mentions', () => {
    setMetadataMentionBlocks();
    cy.visit('/cypress/my-page');
    cy.waitForResourceToLoad('my-page');

    cy.contains('Colorless blue cats sleep furiously.');
  });
});
