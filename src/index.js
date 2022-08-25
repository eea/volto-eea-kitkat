const applyConfig = (config) => {
  if (process.env.NODE_ENV !== 'production') {
    // Enable description block for cypress
    config.blocks.blocksConfig.description.restricted = false;
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

  config.settings.frontendName =
    config.settings.frontendName ||
    process.env.RAZZLE_FRONTEND_NAME ||
    'eea-website-frontend';

  config.settings.backendName =
    config.settings.backendName ||
    process.env.RAZZLE_BACKEND_NAME ||
    'eea-website-backend';

  return config;
};

export default applyConfig;
