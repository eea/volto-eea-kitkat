import { version as frontendVersion } from '../../../../package.json';
import { name as frontendName } from '../../../../package.json';
import { updateSystemInfo } from '@eeacms/volto-eea-kitkat/system';

const applyConfig = (config) => {
  if (process.env.NODE_ENV !== 'production') {
    // Enable description block for cypress
    config.blocks.blocksConfig.description.restricted = false;
  }

  // Changelogs
  config.settings.changelogUrlPrefix =
    config.settings.changelogPrefix || __SERVER__
      ? process.env.RAZZLE_CHANGELOG_PREFIX
      : window.env.RAZZLE_CHANGELOG_PREFIX || 'https://github.com/eea';

  config.settings.changelogUrlSuffix =
    config.settings.changelogSuffix || __SERVER__
      ? process.env.RAZZLE_CHANGELOG_SUFFIX
      : window.env.RAZZLE_CHANGELOG_SUFFIX || 'releases';

  config.settings.frontendVersion =
    config.settings.frontendVersion || __SERVER__
      ? process.env.RAZZLE_FRONTEND_VERSION
      : window.env.RAZZLE_FRONTEND_VERSION || frontendVersion;

  config.settings.frontendName =
    config.settings.frontendName || __SERVER__
      ? process.env.RAZZLE_FRONTEND_NAME
      : window.env.RAZZLE_FRONTEND_NAME || frontendName;

  config.settings.backendVersion =
    config.settings.backendVersion || __SERVER__
      ? process.env.RAZZLE_BACKEND_VERSION
      : window.env.RAZZLE_BACKEND_VERSION || '';

  config.settings.backendName =
    config.settings.backendName || __SERVER__
      ? process.env.RAZZLE_BACKEND_NAME
      : window.env.RAZZLE_BACKEND_NAME || 'plone-backend';

  // Persist FRONTEND_VERSION on backend registry
  if (__SERVER__) {
    updateSystemInfo(config);
  }

  return config;
};

export default applyConfig;
