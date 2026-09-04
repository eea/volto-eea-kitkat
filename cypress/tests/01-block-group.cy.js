import { slateBeforeEach, slateAfterEach } from '../support/e2e';

const API_PATH = Cypress.env('API_PATH') || 'http://localhost:8080/Plone';
const AUTH = {
  user: 'admin',
  pass: 'admin',
};

const buildSlateBlock = (text) => ({
  '@type': 'slate',
  plaintext: text,
  value: [
    {
      type: 'p',
      children: [{ text }],
    },
  ],
});

const setGroupBlocks = ({ title, text }) =>
  cy
    .request({
      method: 'GET',
      url: `${API_PATH}/cypress/my-page/@lock`,
      headers: {
        Accept: 'application/json',
      },
      auth: AUTH,
    })
    .then(({ body: lock }) =>
      cy.request({
        method: 'PATCH',
        url: `${API_PATH}/cypress/my-page`,
        headers: {
          Accept: 'application/json',
          'Lock-Token': lock.token,
        },
        auth: AUTH,
        body: {
          title,
          blocks: {
            title: {
              '@type': 'title',
            },
            group: {
              '@type': 'group',
              data: {
                blocks: {
                  slate: buildSlateBlock(text),
                },
                blocks_layout: {
                  items: ['slate'],
                },
              },
            },
          },
          blocks_layout: {
            items: ['title', 'group'],
          },
        },
      }),
    );

describe('Blocks Tests', () => {
  beforeEach(slateBeforeEach);
  afterEach(slateAfterEach);

  it('Add Block: Empty', () => {
    setGroupBlocks({
      title: 'My Add-on Page',
      text: 'test2',
    });

    cy.visit('/cypress/my-page');
    cy.waitForResourceToLoad('my-page');

    // then the page view should contain our changes
    cy.contains('My Add-on Page');
    cy.contains('test2');
  });
});
