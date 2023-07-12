import React from 'react';
import { render, screen } from '@testing-library/react';
import VersionOverview from './VersionOverview';
import config from '@plone/volto/registry';
import '@testing-library/jest-dom/extend-expect';

jest.mock('@plone/volto/helpers/Utils/Date', () => ({
  formatDate: jest.fn(() => 'formatted date'),
}));

config.settings.addonsInfo = [
  { name: 'addon1', version: '1.0.0' },
  { name: 'addon2', version: '2.0.0' },
  { test: 'test' },
];

describe('VersionOverview', () => {
  it('renders correctly', () => {
    const frontend = {
      version: '1.0.0',
      old_version: '0.9.0',
      date: new Date(),
    };
    const backend = {
      version: '1.0.0',
      old_version: '0.9.0',
      date: new Date(),
    };
    const eggs = { egg1: '1.0.0', egg2: '2.0.0' };

    const { queryAllByText } = render(
      <VersionOverview
        cmf_version="1.0.0"
        debug_mode="No"
        pil_version="1.0.0"
        plone_version="1.0.0"
        plone_restapi_version="1.0.0"
        python_version="1.0.0"
        zope_version="1.0.0"
        eggs={eggs}
        frontend={frontend}
        backend={backend}
      />,
    );

    expect(queryAllByText(/Frontend 1.0.0/)).not.toBeNull();
    expect(queryAllByText(/Backend 1.0.0/)).not.toBeNull();

    expect(queryAllByText(/Plone 1.0.0/)).not.toBeNull();
    expect(queryAllByText(/plone.restapi 1.0.0/)).not.toBeNull();
    expect(queryAllByText(/CMF 1.0.0/)).not.toBeNull();
    expect(queryAllByText(/Zope 1.0.0/)).not.toBeNull();
    expect(queryAllByText(/Python 1.0.0/)).not.toBeNull();
    expect(queryAllByText(/PIL 1.0.0/)).not.toBeNull();
    expect(queryAllByText(/egg1 1.0.0/)).not.toBeNull();
    expect(queryAllByText(/egg2 2.0.0/)).not.toBeNull();
  });

  it('renders correctly', () => {
    config.settings.frontendVersion = '1.0.0';
    config.settings.BackendVersion = '1.0.0';

    const { queryAllByText } = render(
      <VersionOverview
        cmf_version="1.0.0"
        debug_mode="Yes"
        pil_version="1.0.0"
        plone_version="1.0.0"
        plone_restapi_version="1.0.0"
        python_version="1.0.0"
        zope_version="1.0.0"
      />,
    );

    expect(queryAllByText(/Frontend 1.0.0/)).not.toBeNull();
    expect(queryAllByText(/Backend 1.0.0/)).not.toBeNull();

    expect(queryAllByText(/Plone 1.0.0/)).not.toBeNull();
    expect(queryAllByText(/plone.restapi 1.0.0/)).not.toBeNull();
    expect(queryAllByText(/CMF 1.0.0/)).not.toBeNull();
    expect(queryAllByText(/Zope 1.0.0/)).not.toBeNull();
    expect(queryAllByText(/Python 1.0.0/)).not.toBeNull();
    expect(queryAllByText(/PIL 1.0.0/)).not.toBeNull();
    expect(queryAllByText(/egg1 1.0.0/)).not.toBeNull();
    expect(queryAllByText(/egg2 2.0.0/)).not.toBeNull();
  });

  it('renders correctly', () => {
    config.settings.frontendVersion = undefined;
    config.settings.BackendVersion = undefined;

    const { queryAllByText } = render(
      <VersionOverview
        cmf_version="1.0.0"
        debug_mode="Yes"
        pil_version="1.0.0"
        plone_version="1.0.0"
        plone_restapi_version="1.0.0"
        python_version="1.0.0"
        zope_version="1.0.0"
      />,
    );

    expect(queryAllByText(/Frontend 1.0.0/)).not.toBeNull();
    expect(queryAllByText(/Backend 1.0.0/)).not.toBeNull();

    expect(queryAllByText(/Plone 1.0.0/)).not.toBeNull();
    expect(queryAllByText(/plone.restapi 1.0.0/)).not.toBeNull();
    expect(queryAllByText(/CMF 1.0.0/)).not.toBeNull();
    expect(queryAllByText(/Zope 1.0.0/)).not.toBeNull();
    expect(queryAllByText(/Python 1.0.0/)).not.toBeNull();
    expect(queryAllByText(/PIL 1.0.0/)).not.toBeNull();
    expect(queryAllByText(/egg1 1.0.0/)).not.toBeNull();
    expect(queryAllByText(/egg2 2.0.0/)).not.toBeNull();
  });
});
