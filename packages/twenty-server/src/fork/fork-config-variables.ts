// FORK: fork config — CraftGenie's server settings, see FORK.md.
// Upstream's ConfigVariables extends this class (one hook in config-variables.ts), so these
// settings are validated at startup, typed in TwentyConfigService.get() and listed in the
// admin panel exactly like upstream's own, without editing upstream's class body.
import { IsInt, Min } from 'class-validator';

import { MAX_WORKSPACES_WITHOUT_ENTERPRISE_KEY as UPSTREAM_MAX_WORKSPACES_WITHOUT_ENTERPRISE_KEY } from 'src/engine/core-modules/auth/constants/max-workspaces-without-organization-key.constants';
import { ConfigVariablesMetadata } from 'src/engine/core-modules/twenty-config/decorators/config-variables-metadata.decorator';
import { ConfigVariableType } from 'src/engine/core-modules/twenty-config/enums/config-variable-type.enum';
import { ConfigVariablesGroup } from 'src/engine/core-modules/twenty-config/enums/config-variables-group.enum';

export class ForkConfigVariables {
  // FORK: workspace-limit
  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.ADVANCED_SETTINGS,
    description:
      'How many workspaces this server allows without a valid enterprise key (CraftGenie fork). Defaults to upstream limit of 5; a valid enterprise key still removes the limit.',
    type: ConfigVariableType.NUMBER,
    isEnvOnly: true,
  })
  @IsInt()
  @Min(1)
  MAX_WORKSPACES_WITHOUT_ENTERPRISE_KEY: number =
    UPSTREAM_MAX_WORKSPACES_WITHOUT_ENTERPRISE_KEY;
}
