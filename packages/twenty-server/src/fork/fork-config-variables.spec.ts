// FORK: fork config — see FORK.md. Runs upstream's own config validation, so the fork's
// settings are checked exactly as the server checks them at startup.
import { MAX_WORKSPACES_WITHOUT_ENTERPRISE_KEY as UPSTREAM_MAX_WORKSPACES } from 'src/engine/core-modules/auth/constants/max-workspaces-without-organization-key.constants';
import {
  ConfigVariables,
  validate,
} from 'src/engine/core-modules/twenty-config/config-variables';
import { isEnvOnlyConfigVar } from 'src/engine/core-modules/twenty-config/utils/is-env-only-config-var.util';
import { TypedReflect } from 'src/utils/typed-reflect';

describe('FORK config variables', () => {
  describe('MAX_WORKSPACES_WITHOUT_ENTERPRISE_KEY', () => {
    it('defaults to upstream limit when unset', () => {
      expect(UPSTREAM_MAX_WORKSPACES).toBe(5);
      expect(validate({}).MAX_WORKSPACES_WITHOUT_ENTERPRISE_KEY).toBe(
        UPSTREAM_MAX_WORKSPACES,
      );
      expect(new ConfigVariables().MAX_WORKSPACES_WITHOUT_ENTERPRISE_KEY).toBe(
        UPSTREAM_MAX_WORKSPACES,
      );
    });

    it('reads a raised limit from the environment', () => {
      expect(
        validate({ MAX_WORKSPACES_WITHOUT_ENTERPRISE_KEY: '100' })
          .MAX_WORKSPACES_WITHOUT_ENTERPRISE_KEY,
      ).toBe(100);
    });

    it.each(['0', '-3', '2.5', 'many', ''])(
      'refuses %p at startup',
      (value) => {
        expect(() =>
          validate({ MAX_WORKSPACES_WITHOUT_ENTERPRISE_KEY: value }),
        ).toThrow('Config variables validation failed');
      },
    );

    it('is an env-only, admin-panel-listed number', () => {
      const metadata = TypedReflect.getMetadata(
        'config-variables',
        ConfigVariables,
      );

      expect(metadata?.MAX_WORKSPACES_WITHOUT_ENTERPRISE_KEY).toMatchObject({
        type: 'number',
        isEnvOnly: true,
      });
      expect(isEnvOnlyConfigVar('MAX_WORKSPACES_WITHOUT_ENTERPRISE_KEY')).toBe(
        true,
      );
    });

    it('leaves upstream variables registered', () => {
      const metadata = TypedReflect.getMetadata(
        'config-variables',
        ConfigVariables,
      );

      expect(
        metadata?.IS_WORKSPACE_CREATION_LIMITED_TO_SERVER_ADMINS,
      ).toBeDefined();
      expect(metadata?.SERVER_URL).toBeDefined();
    });
  });
});
