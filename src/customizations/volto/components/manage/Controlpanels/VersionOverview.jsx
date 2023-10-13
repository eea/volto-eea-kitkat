/**
 * Version Overview component.
 * @module components/manage/Controlpanels/VersionOverview
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Grid, Label, Header } from 'semantic-ui-react';
import { formatDate } from '@plone/volto/helpers/Utils/Date';
import packageJson from '@plone/volto/../package.json';

import config from '@plone/volto/registry';

const VersionOverview = ({
  cmf_version,
  debug_mode,
  pil_version,
  plone_version,
  plone_restapi_version,
  python_version,
  zope_version,
  eggs = {},
  frontend = {},
  backend = {},
}) => {
  const { addonsInfo } = config.settings;
  const locale = config.settings.dateLocale || 'en-gb';
  const frontendVersion = frontend.version || config.settings.frontendVersion;
  const backendVersion = backend.version || config.settings.backendVersion;
  const voltoVersion = packageJson.version;

  return (
    <Grid columns={2} stackable>
      <Grid.Row>
        <Grid.Column>
          {frontend.date && (
            <Label className="highlight" ribbon>
              Updated:{' '}
              {formatDate({
                date: frontend.date,
                format: {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                },
                locale: locale,
              })}{' '}
            </Label>
          )}
          <Header as="h3">
            <span>Frontend {frontendVersion ? frontendVersion : ''}</span>
          </Header>
          {frontendVersion && (
            <a
              href={[
                config.settings.changelogUrlPrefix,
                config.settings.frontendName,
                config.settings.changelogUrlSuffix,
              ].join('/')}
              target="_blank"
              rel="noreferrer"
            >
              History: {frontend.old_version} ⇢ {frontendVersion}
            </a>
          )}
          <ul style={{ fontSize: '16px', fontFamily: 'Monospace' }}>
            {voltoVersion && <li>Volto {voltoVersion}</li>}
            {addonsInfo.map((addon) => (
              <li key={addon.name}>{`${addon.name} ${addon.version || ''}`}</li>
            ))}
          </ul>
        </Grid.Column>
        <Grid.Column>
          {backend.date && (
            <Label className="high" ribbon="right">
              Updated:{' '}
              {formatDate({
                date: backend.date,
                format: {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                },
                locale: locale,
              })}
            </Label>
          )}
          <Header as="h3" textAlign="right">
            Backend {backendVersion ? backendVersion : ''}
          </Header>
          <a
            className="ui right aligned container"
            href={[
              config.settings.changelogUrlPrefix,
              config.settings.backendName,
              config.settings.changelogUrlSuffix,
            ].join('/')}
            target="_blank"
            rel="noreferrer"
          >
            History: {backend.old_version} ⇢ {backendVersion}
          </a>
          <ul
            style={{
              fontSize: '16px',
              fontFamily: 'Monospace',
            }}
          >
            <li>Plone {plone_version}</li>
            <li>plone.restapi {plone_restapi_version}</li>
            <li>CMF {cmf_version}</li>
            <li>Zope {zope_version}</li>
            <li>Python {python_version}</li>
            <li>PIL {pil_version}</li>
            {Object.keys(eggs).map((k) => (
              <li>
                {k} {eggs[k]}
              </li>
            ))}
          </ul>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row columns={1}>
        <Grid.Column>
          {debug_mode !== 'No' && (
            <p>
              <FormattedMessage
                id="Warning Regarding debug mode"
                defaultMessage="You are running in 'debug mode'. This mode is intended for sites that are under development. This allows many configuration changes to be immediately visible, but will make your site run more slowly. To turn off debug mode, stop the server, set 'debug-mode=off' in your buildout.cfg, re-run bin/buildout and then restart the server process."
              />
            </p>
          )}
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default VersionOverview;
