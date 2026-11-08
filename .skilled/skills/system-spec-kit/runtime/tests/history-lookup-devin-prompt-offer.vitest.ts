// ───────────────────────────────────────────────────────────────────
// MODULE: Devin Prompt-Time History Offer
// ───────────────────────────────────────────────────────────────────
// Devin drops PostCompaction stdout, so the offer minted at compaction has to
// reach the model on the next UserPromptSubmit, exactly once.
import { spawnSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';

import { checkoutRoot } from './_support/history-fixtures.js';
import { getStatePath, loadState } from '../hooks/claude/hook-state.js';
import { composeUserPromptContext } from '../hooks/devin/user-prompt-submit.js';
import type { DevinHookInput } from '../hooks/devin/shared.js';
import type { HistoryLookupTarget } from '../hooks/lib/history/lookup-offer.js';

const require = createRequire(import.meta.url);

interface DevinLocator extends HistoryLookupTarget {
  readonly mintedAt: string;
}

interface DevinPostCompaction {
  mintHistoryLocator(sessionId: string, workspace: string, mintedAt: string): DevinLocator | null;
  persistLocator(locator: DevinLocator): boolean;
  pendingOfferPath(sessionId: string): string | null;
}

const devin = require('../hooks/devin/post-compaction.cjs') as DevinPostCompaction;
const DEVIN_PROMPT_HOOK = fileURLToPath(new URL('../dist/hooks/devin/user-prompt-submit.js', import.meta.url));
const ADVISOR_CONTEXT = 'ADVISOR CONTEXT';

const WORKSPACE = checkoutRoot();
const SESSION_PREFIX = `devin-prompt-offer-${process.pid}`;
const sessions = new Set<string>();
const tempHomes: string[] = [];
let originalCwd = process.cwd();

afterAll(() => rmSync(WORKSPACE, { recursive: true, force: true }));

beforeEach(() => {
  originalCwd = process.cwd();
  process.chdir(WORKSPACE);
});

afterEach(() => {
  for (const home of tempHomes.splice(0)) {
    rmSync(home, { recursive: true, force: true });
  }
  for (const sessionId of sessions) {
    rmSync(getStatePath(sessionId), { force: true });
    rmSync(`${getStatePath(sessionId)}.bad`, { force: true });
    const markerPath = devin.pendingOfferPath(sessionId);
    if (markerPath) rmSync(markerPath, { force: true });
  }
  sessions.clear();
  process.chdir(originalCwd);
});

function uniqueSession(label: string): string {
  const sessionId = `${SESSION_PREFIX}-${label}-${sessions.size}`;
  sessions.add(sessionId);
  return sessionId;
}

function promptInput(sessionId: string): DevinHookInput {
  return { session_id: sessionId, prompt: 'where were we?', cwd: WORKSPACE };
}

function seedLocator(sessionId: string, mintedAt = new Date().toISOString()): DevinLocator {
  const locator = devin.mintHistoryLocator(sessionId, WORKSPACE, mintedAt);
  expect(locator).not.toBeNull();
  expect(devin.persistLocator(locator as DevinLocator)).toBe(true);
  return locator as DevinLocator;
}

function advisorStub(): string {
  const home = mkdtempSync(join(tmpdir(), 'devin-advisor-stub-'));
  tempHomes.push(home);
  const stubPath = join(home, 'advisor-stub.cjs');
  writeFileSync(
    stubPath,
    `process.stdout.write(${JSON.stringify(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'UserPromptSubmit',
        additionalContext: ADVISOR_CONTEXT,
      },
    }))});\n`,
    'utf-8',
  );
  return stubPath;
}

describe('Devin one-shot history offer marker', () => {
  it('records the marker beside the state entry once the locator is persisted', () => {
    const sessionId = uniqueSession('marker');
    const locator = seedLocator(sessionId);

    const markerPath = devin.pendingOfferPath(sessionId);
    expect(markerPath).not.toBeNull();
    expect(existsSync(markerPath as string)).toBe(true);
    expect(JSON.parse(readFileSync(markerPath as string, 'utf-8'))).toEqual({
      handle: locator.handle,
      mintedAt: locator.mintedAt,
    });

    const state = loadState(sessionId);
    expect(state.ok).toBe(true);
    if (state.ok) expect(state.state.historyLocator?.handle).toBe(locator.handle);
  });
});

describe('Devin prompt-time history offer', () => {
  const deps = { runAdvisor: () => null, isHistoryReady: async () => true };

  it('prints the lookup section on the first prompt and nothing on the second', async () => {
    const sessionId = uniqueSession('once');
    const locator = seedLocator(sessionId);

    const first = await composeUserPromptContext(promptInput(sessionId), deps);
    expect(first).toContain('## History Lookup');
    expect(first).toContain(`--session '${sessionId}'`);
    expect(first).toContain(`--handle '${locator.handle}'`);
    expect(existsSync(devin.pendingOfferPath(sessionId) as string)).toBe(false);

    const second = await composeUserPromptContext(promptInput(sessionId), deps);
    expect(second).toBeNull();
  });

  it('offers a session started in a subfolder, read back from the checkout root', async () => {
    const sessionId = uniqueSession('subfolder');
    const folder = join(WORKSPACE, 'packages', 'app');
    mkdirSync(folder, { recursive: true });
    // Devin runs its hooks from the session folder, not the checkout root.
    process.chdir(folder);
    const locator = devin.mintHistoryLocator(sessionId, folder, new Date().toISOString());
    expect(locator?.workspace).toBe(WORKSPACE);
    expect(devin.persistLocator(locator as DevinLocator)).toBe(true);

    const first = await composeUserPromptContext({ session_id: sessionId, prompt: 'where were we?', cwd: folder }, deps);
    expect(first).toContain(`--handle '${(locator as DevinLocator).handle}'`);
    process.chdir(WORKSPACE);
  });

  it('prints nothing while the Devin reader is gated', async () => {
    const sessionId = uniqueSession('gated');
    seedLocator(sessionId);

    const output = await composeUserPromptContext(promptInput(sessionId), {
      runAdvisor: () => null,
      isHistoryReady: async () => false,
    });

    expect(output).toBeNull();
    expect(existsSync(devin.pendingOfferPath(sessionId) as string)).toBe(false);
  });

  it('prints nothing for a locator past the redemption window', async () => {
    const sessionId = uniqueSession('stale');
    seedLocator(sessionId, new Date(Date.now() - 31 * 60 * 1000).toISOString());

    const output = await composeUserPromptContext(promptInput(sessionId), deps);

    expect(output).toBeNull();
  });

  it('prints nothing when the marker names a different locator handle', async () => {
    const sessionId = uniqueSession('mismatch');
    seedLocator(sessionId);
    writeFileSync(
      devin.pendingOfferPath(sessionId) as string,
      `${JSON.stringify({ handle: `hl1_${'0'.repeat(32)}`, mintedAt: new Date().toISOString() })}\n`,
      'utf-8',
    );

    const output = await composeUserPromptContext(promptInput(sessionId), deps);

    expect(output).toBeNull();
  });

  it('keeps the advisor context when no compaction marker exists', async () => {
    const sessionId = uniqueSession('no-marker');

    const output = await composeUserPromptContext(promptInput(sessionId), {
      runAdvisor: () => JSON.stringify({
        hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: ADVISOR_CONTEXT },
      }),
      isHistoryReady: async () => true,
    });

    expect(output).toBe(ADVISOR_CONTEXT);
  });
});

describe('Devin built prompt hook', () => {
  it('consumes the marker and prints the offer after the advisor context', () => {
    const sessionId = uniqueSession('built');
    seedLocator(sessionId);

    const child = spawnSync(process.execPath, [DEVIN_PROMPT_HOOK], {
      cwd: WORKSPACE,
      input: JSON.stringify(promptInput(sessionId)),
      encoding: 'utf8',
      timeout: 20_000,
      env: { ...process.env, SPECKIT_USER_PROMPT_TARGET: advisorStub() },
    });

    expect(child.status).toBe(0);
    const envelope = JSON.parse(child.stdout.trim()) as {
      hookSpecificOutput?: { additionalContext?: string };
    };
    const context = envelope.hookSpecificOutput?.additionalContext ?? '';
    expect(context.startsWith(`${ADVISOR_CONTEXT}\n\n## History Lookup`)).toBe(true);
    expect(context).toContain(`--session '${sessionId}'`);
    expect(existsSync(devin.pendingOfferPath(sessionId) as string)).toBe(false);
  });
});
