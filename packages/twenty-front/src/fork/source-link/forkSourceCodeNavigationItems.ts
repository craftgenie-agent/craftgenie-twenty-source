// FORK: source-link — see FORK.md, "AGPL: source for users".
// AGPL §13: a modified Twenty served over the network must prominently offer every user
// its source. Every image CraftGenie publishes has its source in this public repository,
// one tag per image, and the Settings sidebar is where every workspace member can find it.
import { t } from '@lingui/core/macro';
import { IconCode } from 'twenty-ui/icon';

import { type SettingsNavigationItem } from '@/settings/hooks/useSettingsNavigationItems';

export const FORK_SOURCE_CODE_URL =
  'https://github.com/craftgenie-agent/craftgenie-twenty-source';

export const forkSourceCodeNavigationItems = (): SettingsNavigationItem[] => [
  {
    label: t`Source code`,
    onClick: () =>
      window.open(FORK_SOURCE_CODE_URL, '_blank', 'noopener,noreferrer'),
    Icon: IconCode,
  },
];
