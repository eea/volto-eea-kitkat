const addonName = process.env.ADDON_NAME;

if (!addonName) {
  throw new Error('ADDON_NAME must be set');
}

module.exports = {
  addons: [addonName],
  theme: '',
};
