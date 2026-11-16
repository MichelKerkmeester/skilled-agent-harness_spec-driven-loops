// ───────────────────────────────────────────────────────────────────
// MODULE: Session Start Advisories Pi Extension Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';
import type { ExecResult, ExtensionAPI } from '@earendil-works/pi-coding-agent';
import sessionStartAdvisories from '../pi/session-start-advisories';

type Handler = (event: { reason: string }, ctx: unknown) => Promise<void>;

// Each check's command line maps to the result the fake exec returns, so no script runs.
async function startSession(resultFor: (args: string[]) => Partial<ExecResult>): Promise<string[]> {
  let handler: Handler | undefined;
  sessionStartAdvisories({ on: (_event: string, fn: Handler) => { handler = fn; } } as unknown as ExtensionAPI);
  const warnings: string[] = [];
  await handler?.({ reason: 'startup' }, {
    cwd: '/fixture/checkout',
    exec: async (_command: string, args: string[]) => ({ stdout: '', stderr: '', code: 0, killed: false, ...resultFor(args) }),
    ui: { notify: (message: string) => warnings.push(message) },
  });
  return warnings;
}

const isInstaller = (args: string[]) => args.some((arg) => arg.endsWith('install-codex-hooks.mjs'));
const isWorktreeGuard = (args: string[]) => args.some((arg) => arg.endsWith('worktree-guard.sh'));

describe('Pi session-start advisories', () => {
  it('stays quiet when the codex hook check passes and prints its OK line', async () => {
    const warnings = await startSession((args) => (
      isInstaller(args) ? { stdout: 'install-codex-hooks: OK /home/.codex/hooks.json\n', code: 0 } : {}
    ));
    expect(warnings).toEqual([]);
  });

  it('warns when the codex hook check fails', async () => {
    const warnings = await startSession((args) => (
      isInstaller(args) ? { stderr: 'install-codex-hooks: DRIFT /home/.codex/hooks.json (duplicate=1)\n', code: 1 } : {}
    ));
    expect(warnings).toEqual(['install-codex-hooks: DRIFT /home/.codex/hooks.json (duplicate=1)']);
  });

  it('still warns on what another check prints with a clean exit', async () => {
    const warnings = await startSession((args) => (
      isWorktreeGuard(args) ? { stdout: 'You are on the primary checkout.\n', code: 0 } : {}
    ));
    expect(warnings).toEqual(['You are on the primary checkout.']);
  });
});
