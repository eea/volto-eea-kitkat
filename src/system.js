/* eslint no-console: ["error", { allow: ["warn", "log"] }] */
export const updateSystemInfo = (config) => {
  var fetch = require('node-fetch');
  const internalApi =
    config.settings.internalApiPath || config.settings.devProxyToApiPath;
  const version = config.settings.frontendVersion;

  // Nothing to do
  if (!version || !internalApi) {
    return config;
  }

  // Backend @system update via PATCH is allowed only via internal API
  if (
    !(
      internalApi.startsWith('http://localhost') ||
      internalApi.startsWith('http://backend')
    )
  ) {
    return config;
  }

  // Persist FRONTEND_VERSION on backend registry
  const url = `${internalApi}/@system`;
  fetch(url, {
    method: 'PATCH',
    body: JSON.stringify({
      'eea.kitkat.interfaces.IEEAVersionsFrontend.version': version,
    }),
    headers: {
      Accept: 'application/json',
    },
  })
    .then((response) => response.text())
    .then((text) => {
      if (text) {
        console.log(`Updating FRONTEND_VERSION on backend registry: ${text}`);
      } else {
        console.log(
          `FRONTEND_VERSION already up-to-date on backend registry: ${version}`,
        );
      }
    })
    .catch((err) =>
      console.warn(`Could NOT update FRONTEND_VERSION on backend: ${err}`),
    );

  return config;
};
