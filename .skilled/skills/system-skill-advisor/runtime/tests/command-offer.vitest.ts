// ───────────────────────────────────────────────────────────────
// MODULE: Command offer
// ───────────────────────────────────────────────────────────────

// The head is the only advisor text that names both the offered command and the
// policy, so these cases pin each shape a live head takes, a command with a
// policy, a command under an ambiguous head without one, and a head that names
// no command at all. The replay case proves a checkout without the prompt hook
// reports the miss, because a backfill off such a checkout has to stay readable
// instead of throwing away the lines around it. The delivery cases pin the two
// real answers a Claude transcript can give and the third answer a runtime with
// no confirmed delivery point must give, so a later summary never reads a
// missing record as a miss. The backfill cases pin that a line keeps its place
// when its checkout is gone, that a refused row leaves no output behind, and
// that the new log never replaces the one it reads.

import { existsSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  backfillRunLog,
  briefDelivered,
  codexHookApproval,
  parseOffer,
  replayOffer,
} from '../scripts/routing-accuracy/command-offer.mjs';

const OFFERED_HEAD = 'Advisor: live; use sk-git → /doctor:git hooks (ask) 0.82/0.12 pass.';
const BRIEF = 'Advisor: live; use sk-doc → /create:readme (start) 0.82/0.12 pass.';
const AMBIGUOUS_HEAD = 'Advisor: live; ambiguous: /doctor:git hooks 0.82/0.12 vs sk-git 0.86/0.16 pass.';
const NO_COMMAND_HEAD = 'Advisor: live; use command-speckit-plan 0.82/0.16 pass.';
const CODEX_HOOKS = {
  hooks: {
    UserPromptSubmit: [
      { hooks: [{ command: 'node x/hooks/codex/user-prompt-submit.js' }] },
    ],
  },
};

function writeTranscript(lines: unknown[]): { dir: string; transcriptPath: string } {
  const dir = mkdtempSync(join(tmpdir(), 'command-offer-'));
  const transcriptPath = join(dir, 'session.jsonl');
  writeFileSync(transcriptPath, lines.map((line) => JSON.stringify(line)).join('\n'));
  return { dir, transcriptPath };
}

function writeRunLog(dir: string, lines: unknown[]): string {
  const inPath = join(dir, 'runs.jsonl');
  writeFileSync(inPath, lines.map((line) => JSON.stringify(line)).join('\n') + '\n');
  return inPath;
}

function writeCodexRoot(withHooks: boolean): { dir: string; hooksPath: string } {
  const dir = mkdtempSync(join(tmpdir(), 'command-offer-codex-'));
  const hooksPath = join(dir, '.codex', 'hooks.json');
  if (withHooks) {
    mkdirSync(join(dir, '.codex'), { recursive: true });
    writeFileSync(hooksPath, JSON.stringify(CODEX_HOOKS));
  }
  return { dir, hooksPath };
}

function writeCodexConfig(dir: string, lines: string[]): string {
  const configPath = join(dir, 'config.toml');
  writeFileSync(configPath, lines.map((line) => `${line}\n`).join(''));
  return configPath;
}

describe('parseOffer', () => {
  it('reads the command and the policy a head offers', () => {
    expect(parseOffer(OFFERED_HEAD)).toEqual({
      offeredCommand: '/doctor:git hooks',
      offeredPolicy: 'ask',
    });
  });

  it('reads the command but no policy under an ambiguous head', () => {
    expect(parseOffer(AMBIGUOUS_HEAD)).toEqual({
      offeredCommand: '/doctor:git hooks',
      offeredPolicy: null,
    });
  });

  it('reads no command when the head names none', () => {
    expect(parseOffer(NO_COMMAND_HEAD)).toEqual({
      offeredCommand: null,
      offeredPolicy: null,
    });
  });
});

describe('replayOffer', () => {
  it('reports a checkout without the prompt hook instead of throwing', () => {
    const checkoutDir = mkdtempSync(join(tmpdir(), 'command-offer-'));
    try {
      expect(replayOffer({ checkoutDir, prompt: 'create a readme', sessionId: 'offer-test' })).toEqual({
        offeredCommand: null,
        offeredPolicy: null,
        offerError: 'hook_missing',
      });
    } finally {
      rmSync(checkoutDir, { recursive: true, force: true });
    }
  });
});

describe('codexHookApproval', () => {
  it('reports an advisor hook that no config entry approves as unapproved', () => {
    const { dir } = writeCodexRoot(true);
    try {
      const configPath = writeCodexConfig(dir, []);
      expect(codexHookApproval({ projectDir: dir, configPath })).toBe('unapproved');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('reports an advisor hook approved by a trusted hash as approved', () => {
    const { dir, hooksPath } = writeCodexRoot(true);
    try {
      const configPath = writeCodexConfig(dir, [
        `[hooks.state."${realpathSync(hooksPath)}:user_prompt_submit:0:0"]`,
        'trusted_hash = "x"',
      ]);
      expect(codexHookApproval({ projectDir: dir, configPath })).toBe('approved');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('reports a root with no hooks file as no-hooks', () => {
    const { dir } = writeCodexRoot(false);
    try {
      expect(codexHookApproval({ projectDir: dir })).toBe('no-hooks');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

describe('briefDelivered', () => {
  it('finds the advisor context in a Claude transcript attachment', async () => {
    const { dir, transcriptPath } = writeTranscript([
      { type: 'user', message: { role: 'user', content: 'create a readme' } },
      {
        type: 'attachment',
        attachment: {
          type: 'hook_additional_context',
          hookEvent: 'UserPromptSubmit',
          content: [OFFERED_HEAD],
        },
      },
    ]);
    try {
      await expect(briefDelivered({ runtime: 'claude', locator: { transcriptPath } })).resolves.toBe(true);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('returns false when the Claude transcript holds no advisor attachment', async () => {
    const { dir, transcriptPath } = writeTranscript([
      { type: 'user', message: { role: 'user', content: 'create a readme' } },
      { type: 'attachment', attachment: { type: 'hook_additional_context', hookEvent: 'SessionStart', content: ['Session ready'] } },
    ]);
    try {
      await expect(briefDelivered({ runtime: 'claude', locator: { transcriptPath } })).resolves.toBe(false);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('returns unknown for a runtime with no confirmed delivery point', async () => {
    await expect(briefDelivered({
      runtime: 'devin',
      locator: { transcriptPath: join(tmpdir(), 'command-offer-devin.jsonl') },
    })).resolves.toBe('unknown');
  });

  it('finds the advisor context in Devin injected nodes', async () => {
    await expect(briefDelivered({
      runtime: 'devin',
      locator: {},
      loadSession: async () => ({ ok: true, records: [], injected: [{ source: 'system', text: BRIEF }] }),
    })).resolves.toBe(true);
  });

  it('returns false for a DSH session whose injected context holds no brief', async () => {
    await expect(briefDelivered({
      runtime: 'dsh',
      locator: {},
      loadSession: async () => ({
        ok: true,
        records: [],
        injected: [{ source: 'repo-guards', text: 'Repository guard rules apply.' }],
      }),
    })).resolves.toBe(false);
  });

  it('stays unknown for an OpenCode session that holds the brief in its records', async () => {
    await expect(briefDelivered({
      runtime: 'opencode',
      locator: {},
      loadSession: async () => ({ ok: true, records: [{ role: 'system', content: BRIEF }], injected: [] }),
    })).resolves.toBe('unknown');
  });

  it('returns false for a Codex hook the config never approved', async () => {
    const { dir } = writeCodexRoot(true);
    try {
      const configPath = writeCodexConfig(dir, []);
      await expect(briefDelivered({
        runtime: 'codex',
        locator: { projectDir: dir },
        codexConfig: configPath,
      })).resolves.toBe(false);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

describe('backfillRunLog', () => {
  it('adds the offer and the brief to every line and warms each checkout once', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'command-offer-'));
    const outPath = join(dir, 'runs-out.jsonl');
    const inPath = writeRunLog(dir, [
      { runtime: 'claude', rowId: 'row-one', arm: 'pre', locator: { projectDir: '/checkout-one' }, exit: 0, changedPaths: [] },
      { runtime: 'claude', rowId: 'row-two', arm: 'pre', locator: { projectDir: '/checkout-one' }, exit: 0, changedPaths: [] },
    ]);
    const before = readFileSync(inPath, 'utf8');
    const warmed: string[] = [];
    const replayed: Array<{ checkoutDir: string; prompt: string; sessionId: string }> = [];
    const seen: Array<{ runtime: string; locator: unknown }> = [];
    try {
      const result = await backfillRunLog({
        inPath,
        outPath,
        promptFor: (rowId: string) => `prompt for ${rowId}`,
        warm: async (checkoutDir: string) => {
          warmed.push(checkoutDir);
        },
        replay: async ({ checkoutDir, prompt, sessionId }: { checkoutDir: string; prompt: string; sessionId: string }) => {
          replayed.push({ checkoutDir, prompt, sessionId });
          return { offeredCommand: '/doctor:git hooks', offeredPolicy: 'ask', offerError: null };
        },
        brief: async ({ runtime, locator }: { runtime: string; locator: unknown }) => {
          seen.push({ runtime, locator });
          return true;
        },
      });

      expect(result).toEqual({ ok: true, lines: 2, outPath });
      const written = readFileSync(outPath, 'utf8').trim().split('\n').map((line) => JSON.parse(line));
      expect(written).toHaveLength(2);
      expect(written[0]).toMatchObject({
        rowId: 'row-one',
        offeredCommand: '/doctor:git hooks',
        offeredPolicy: 'ask',
        offerError: null,
        briefDelivered: true,
        offerBackfilled: true,
      });
      expect(written[1].rowId).toBe('row-two');
      expect(warmed).toEqual(['/checkout-one']);
      expect(replayed.map((call) => call.sessionId)).toEqual(['backfill-row-one', 'backfill-row-two']);
      expect(replayed[0]).toMatchObject({ checkoutDir: '/checkout-one', prompt: 'prompt for row-one' });
      expect(seen).toHaveLength(2);
      expect(readFileSync(inPath, 'utf8')).toBe(before);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('recomputes only the brief when the offers are already recorded', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'command-offer-'));
    const outPath = join(dir, 'runs-out.jsonl');
    const inPath = writeRunLog(dir, [
      {
        runtime: 'claude',
        rowId: 'row-with-offer',
        arm: 'post',
        locator: { projectDir: '/checkout-one' },
        exit: 0,
        changedPaths: [],
        offeredCommand: '/create:readme',
        offeredPolicy: 'start',
        offerBackfilled: true,
      },
      { runtime: 'codex', rowId: 'row-without-offer', arm: 'post', locator: null, exit: 0, changedPaths: [] },
    ]);
    let warmed = 0;
    let replayed = 0;
    try {
      const result = await backfillRunLog({
        inPath,
        outPath,
        briefOnly: true,
        promptFor: () => 'prompt',
        warm: async () => {
          warmed += 1;
        },
        replay: async () => {
          replayed += 1;
          return { offeredCommand: '/create:readme', offeredPolicy: 'start', offerError: null };
        },
        brief: async () => true,
      });

      expect(result).toEqual({ ok: true, lines: 2, outPath });
      const written = readFileSync(outPath, 'utf8').trim().split('\n').map((line) => JSON.parse(line));
      expect(written[0]).toMatchObject({
        rowId: 'row-with-offer',
        offeredCommand: '/create:readme',
        offeredPolicy: 'start',
        briefDelivered: true,
        briefBackfilled: true,
      });
      expect(written[0]).not.toHaveProperty('offerError');
      expect(written[1]).toMatchObject({
        rowId: 'row-without-offer',
        briefDelivered: true,
        briefBackfilled: true,
      });
      expect(written[1]).not.toHaveProperty('offeredCommand');
      expect(written[1]).not.toHaveProperty('offerError');
      expect(warmed).toBe(0);
      expect(replayed).toBe(0);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('marks a line whose locator names no checkout instead of replaying it', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'command-offer-'));
    const outPath = join(dir, 'runs-out.jsonl');
    const inPath = writeRunLog(dir, [
      { runtime: 'codex', rowId: 'row-no-checkout', arm: 'pre', locator: null, exit: 0, changedPaths: [] },
    ]);
    let warmed = 0;
    let replayed = 0;
    try {
      const result = await backfillRunLog({
        inPath,
        outPath,
        promptFor: () => 'prompt',
        warm: async () => {
          warmed += 1;
        },
        replay: async () => {
          replayed += 1;
          return { offeredCommand: '/doctor:git hooks', offeredPolicy: 'run', offerError: null };
        },
        brief: async () => 'unknown',
      });

      expect(result).toMatchObject({ ok: true, lines: 1 });
      const [written] = readFileSync(outPath, 'utf8').trim().split('\n').map((line) => JSON.parse(line));
      expect(written).toMatchObject({
        offeredCommand: null,
        offeredPolicy: null,
        offerError: 'no_checkout',
        briefDelivered: 'unknown',
        offerBackfilled: true,
      });
      expect(warmed).toBe(0);
      expect(replayed).toBe(0);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('refuses a row the prompt lookup rejects before it writes anything', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'command-offer-'));
    const outPath = join(dir, 'runs-out.jsonl');
    const inPath = writeRunLog(dir, [
      { runtime: 'claude', rowId: 'row-plain', arm: 'pre', locator: { projectDir: '/checkout-one' }, exit: 0, changedPaths: [] },
      { runtime: 'claude', rowId: 'row-holdout', arm: 'pre', locator: { projectDir: '/checkout-one' }, exit: 0, changedPaths: [] },
    ]);
    let replayed = 0;
    try {
      const result = await backfillRunLog({
        inPath,
        outPath,
        promptFor: (rowId: string) => {
          if (rowId === 'row-holdout') {
            throw Object.assign(new Error(`${rowId}: a holdout row is never run`), { code: 'holdout_row' });
          }
          return 'prompt';
        },
        replay: async () => {
          replayed += 1;
          return { offeredCommand: null, offeredPolicy: null, offerError: null };
        },
        brief: async () => 'unknown',
      });

      expect(result).toMatchObject({ ok: false, code: 'holdout_row' });
      expect(existsSync(outPath)).toBe(false);
      expect(replayed).toBe(0);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('refuses to write over its own input', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'command-offer-'));
    const inPath = writeRunLog(dir, [
      { runtime: 'claude', rowId: 'row-one', arm: 'pre', locator: { projectDir: '/checkout-one' }, exit: 0, changedPaths: [] },
    ]);
    const before = readFileSync(inPath, 'utf8');
    try {
      const result = await backfillRunLog({ inPath, outPath: inPath, promptFor: () => 'prompt' });

      expect(result).toMatchObject({ ok: false, code: 'same_path' });
      expect(readFileSync(inPath, 'utf8')).toBe(before);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
