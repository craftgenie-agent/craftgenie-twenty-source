// FORK: source-link — see FORK.md. Renders upstream's Settings drawer and clicks the item
// as a user would, so an upstream change that drops, hides or unwires it fails here.
import { MockedProvider } from '@apollo/client/testing/react';
import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider as JotaiProvider } from 'jotai';
import { type ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { SOURCE_LOCALE } from 'twenty-shared/translations';
import { ToastProvider } from 'twenty-ui/components';

import { currentUserState } from '@/auth/states/currentUserState';
import { billingState } from '@/client-config/states/billingState';
import { SettingsNavigationDrawerItems } from '@/settings/components/SettingsNavigationDrawerItems';
import { useSettingsNavigationItems } from '@/settings/hooks/useSettingsNavigationItems';
import { usePermissionFlagMap } from '@/settings/roles/hooks/usePermissionFlagMap';
import {
  jotaiStore,
  resetJotaiStore,
} from '@/ui/utilities/state/jotai/jotaiStore';
import { FORK_SOURCE_CODE_URL } from '~/fork/source-link/forkSourceCodeNavigationItems';
import { type Billing, OnboardingStatus } from '~/generated-metadata/graphql';
import { messages } from '~/locales/generated/en';

i18n.load({ [SOURCE_LOCALE]: messages });
i18n.activate(SOURCE_LOCALE);

jest.mock('@/settings/roles/hooks/usePermissionFlagMap', () => ({
  usePermissionFlagMap: jest.fn(),
}));

jest.mock('@/domain-manager/hooks/useRedirectToWorkspaceDomain', () => ({
  useRedirectToWorkspaceDomain: jest.fn().mockImplementation(() => ({
    redirectToWorkspaceDomain: jest.fn(),
  })),
}));

const Wrapper = ({ children }: { children: ReactNode }) => (
  <MockedProvider>
    <JotaiProvider store={jotaiStore}>
      <MemoryRouter>
        <I18nProvider i18n={i18n}>
          <ToastProvider>{children}</ToastProvider>
        </I18nProvider>
      </MemoryRouter>
    </JotaiProvider>
  </MockedProvider>
);

const billing: Billing = {
  isBillingEnabled: false,
  billingUrl: '',
  trialPeriods: [],
  __typename: 'Billing',
};

describe('FORK source-link: Settings navigation', () => {
  beforeEach(() => {
    resetJotaiStore();
    jotaiStore.set(currentUserState.atom, {
      id: 'user-id',
      email: 'member@example.com',
      supportUserHash: null,
      canAccessFullAdminPanel: false,
      canImpersonate: false,
      onboardingStatus: OnboardingStatus.COMPLETED,
      userVars: {},
      firstName: 'Member',
      lastName: 'Without permissions',
      hasPassword: true,
    });
    jotaiStore.set(billingState.atom, billing);
    // A member with no permission flags at all must still see it (AGPL §13: every user).
    (usePermissionFlagMap as jest.Mock).mockImplementation(() => ({}));
  });

  it('shows every member a Source code entry in the Settings drawer', () => {
    render(<SettingsNavigationDrawerItems />, { wrapper: Wrapper });

    expect(screen.getByText('Source code')).toBeVisible();
  });

  it('opens the public source repository in a new tab when clicked', async () => {
    const open = jest.spyOn(window, 'open').mockImplementation(() => null);
    render(<SettingsNavigationDrawerItems />, { wrapper: Wrapper });

    await userEvent.click(screen.getByText('Source code'));

    expect(open).toHaveBeenCalledTimes(1);
    expect(open).toHaveBeenCalledWith(
      'https://github.com/craftgenie-agent/craftgenie-twenty-source',
      '_blank',
      'noopener,noreferrer',
    );
    expect(FORK_SOURCE_CODE_URL).toBe(
      'https://github.com/craftgenie-agent/craftgenie-twenty-source',
    );
    open.mockRestore();
  });

  it('sits next to Documentation, before Logout', () => {
    const { result } = renderHook(() => useSettingsNavigationItems(), {
      wrapper: Wrapper,
    });
    const labels = result.current
      .flatMap((section) => section.items)
      .map((item) => item.label);

    expect(labels.indexOf('Source code')).toBe(
      labels.indexOf('Documentation') + 1,
    );
    expect(labels.indexOf('Logout')).toBe(labels.indexOf('Source code') + 1);
  });
});
