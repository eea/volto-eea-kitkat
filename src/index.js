import { version as frontendVersion } from '../../../../package.json';
import { name as frontendName } from '../../../../package.json';
import { updateSystemInfo } from '@eeacms/volto-eea-kitkat/system';

const applyConfig = (config) => {
  if (process.env.NODE_ENV !== 'production') {
    // Enable description block for cypress
    config.blocks.blocksConfig.description.restricted = false;
  }

  // Persist FRONTEND_VERSION on backend registry
  if (__SERVER__) {
    updateSystemInfo(config);
  }

  // Changelogs
  config.settings.changelogUrlPrefix =
    config.settings.changelogPrefix ||
    process.env.RAZZLE_CHANGELOG_PREFIX ||
    'https://github.com/eea';

  config.settings.changelogUrlSuffix =
    config.settings.changelogSuffix ||
    process.env.RAZZLE_CHANGELOG_PREFIX ||
    'releases';

  config.settings.frontendVersion =
    config.settings.frontendVersion ||
    process.env.FRONTEND_VERSION ||
    frontendVersion;

  config.settings.frontendName =
    config.settings.frontendName || process.env.FRONTEND_NAME || frontendName;

  config.settings.backendVersion =
    config.settings.backendVersion || process.env.BACKEND_VERSION || '';

  config.settings.backendName =
    config.settings.backendName || process.env.BACKEND_NAME || 'plone-backend';

  return config;
};

export default applyConfig;
