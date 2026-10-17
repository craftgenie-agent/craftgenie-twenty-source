// FORK: workspace-limit — see FORK.md. Exercises upstream's SignInUpService through
// the hook, so an upstream change to the check fails here rather than in production.
import { Test } from '@nestjs/testing';

import { AuthException } from 'src/engine/core-modules/auth/auth.exception';
import { SignInUpService } from 'src/engine/core-modules/auth/services/sign-in-up.service';
import { EnterprisePlanService } from 'src/engine/core-modules/enterprise/services/enterprise-plan.service';
import { TwentyConfigService } from 'src/engine/core-modules/twenty-config/twenty-config.service';

describe('FORK workspace-limit: SignInUpService.assertWorkspaceCountWithinLimit', () => {
  let service: SignInUpService;
  let configuredLimit: number;
  let isEnterpriseKeyValid: boolean;
  const configGet = jest.fn();

  beforeEach(async () => {
    configuredLimit = 5;
    isEnterpriseKeyValid = false;
    configGet.mockImplementation((key: string) =>
      key === 'MAX_WORKSPACES_WITHOUT_ENTERPRISE_KEY'
        ? configuredLimit
        : undefined,
    );

    const module = await Test.createTestingModule({
      providers: [
        SignInUpService,
        { provide: TwentyConfigService, useValue: { get: configGet } },
        {
          provide: EnterprisePlanService,
          useValue: { isValid: () => isEnterpriseKeyValid },
        },
      ],
    })
      // Every other collaborator is irrelevant to the limit check.
      .useMocker(() => ({}))
      .compile();

    service = module.get(SignInUpService);
  });

  const assertWithinLimit = (workspaceCount: number) =>
    service['assertWorkspaceCountWithinLimit'](workspaceCount);

  describe('setting unset (upstream default of 5)', () => {
    it('allows a fifth workspace', async () => {
      await expect(assertWithinLimit(4)).resolves.toBeUndefined();
    });

    it('refuses a sixth with upstream error', async () => {
      const refusal = assertWithinLimit(5);

      await expect(refusal).rejects.toThrow(AuthException);
      await expect(refusal).rejects.toThrow(
        'Cannot create more than 5 workspaces without a valid enterprise key',
      );
    });

    it('reads the limit through TwentyConfigService', async () => {
      await assertWithinLimit(1);

      expect(configGet).toHaveBeenCalledWith(
        'MAX_WORKSPACES_WITHOUT_ENTERPRISE_KEY',
      );
    });
  });

  describe('setting raised to 100', () => {
    beforeEach(() => {
      configuredLimit = 100;
    });

    it('allows workspaces beyond upstream limit', async () => {
      await expect(assertWithinLimit(5)).resolves.toBeUndefined();
      await expect(assertWithinLimit(99)).resolves.toBeUndefined();
    });

    it('refuses at the configured limit and names it', async () => {
      await expect(assertWithinLimit(100)).rejects.toThrow(
        'Cannot create more than 100 workspaces without a valid enterprise key',
      );
    });
  });

  describe('setting lowered to 2', () => {
    beforeEach(() => {
      configuredLimit = 2;
    });

    it('refuses a third workspace', async () => {
      await expect(assertWithinLimit(1)).resolves.toBeUndefined();
      await expect(assertWithinLimit(2)).rejects.toThrow(AuthException);
    });
  });

  describe('valid enterprise key (upstream path, unchanged)', () => {
    beforeEach(() => {
      isEnterpriseKeyValid = true;
    });

    it('has no limit, whatever the setting', async () => {
      await expect(assertWithinLimit(5)).resolves.toBeUndefined();
      await expect(assertWithinLimit(10_000)).resolves.toBeUndefined();

      configuredLimit = 2;
      await expect(assertWithinLimit(10_000)).resolves.toBeUndefined();
    });
  });
});
