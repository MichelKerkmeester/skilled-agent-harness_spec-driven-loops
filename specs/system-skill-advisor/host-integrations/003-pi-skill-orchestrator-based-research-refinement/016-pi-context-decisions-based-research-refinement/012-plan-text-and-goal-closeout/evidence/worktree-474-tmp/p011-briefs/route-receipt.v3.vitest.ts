// ───────────────────────────────────────────────────────────────────
// MODULE: Route Receipt Tests
// ───────────────────────────────────────────────────────────────────

import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  chmodSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  rmSync,
  symlinkSync,
  utimesSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';

import {
  FileRouteReceiptStore,
  InMemoryRouteReceiptStore,
  ROUTE_RECEIPT_VERSION,
  decideRouteReceiptGuard,
  isWeakFollowUp,
  type RouteReceipt,
  type RouteReceiptGuardInput,
} from '../../../hooks/lib/route-receipt.js';
import { MAX_DIRECTIVE_LIFECYCLE_SESSIONS } from '../../../hooks/lib/directive-lifecycle-contract.js';
import { shouldFireAdvisor, stripLeadingPastedReply } from '../../lib/prompt-policy.js';

const CLOCK = Object.freeze({ storeGeneration: 'generation-1', lifecycleEpoch: 'epoch-1' });
const FALSE_CARRY_FOLLOW_UP = 'Refactor the session store module to remove duplicated locking code';
const PASTED_FIX_THAT_TOO = 'Earlier you replied: I updated the README with sk-doc conventions and committed it with sk-git. Now: fix that too';
const BUILT_ROUTE_RECEIPT = resolve(import.meta.dirname, '../../dist/hooks/lib/route-receipt.js');

const tempDirs: string[] = [];

function tempBase(): string {
  const dir = mkdtempSync(join(tmpdir(), 'route-receipt-'));
  tempDirs.push(dir);
  return dir;
}

function receipt(overrides: Partial<RouteReceipt> = {}): RouteReceipt {
  return {
    version: ROUTE_RECEIPT_VERSION,
    sessionId: 'session-1',
    skill: 'sk-doc',
    storeGeneration: CLOCK.storeGeneration,
    lifecycleEpoch: CLOCK.lifecycleEpoch,
    transcriptBytes: 100,
    ...overrides,
  };
}

// A floored work-intent follow-up routed to another skill than the receipt's,
// the shape of "fix that too" after a documentation task.
function guardInput(overrides: Partial<RouteReceiptGuardInput> = {}): RouteReceiptGuardInput {
  const strippedPrompt = overrides.strippedPrompt ?? 'fix that too';
  return {
    receipt: receipt(),
    clock: () => CLOCK,
    transcriptBytes: 120,
    strippedPrompt,
    policyReason: shouldFireAdvisor(strippedPrompt).reason,
    topSkill: 'sk-code',
    topFloored: true,
    ...overrides,
  };
}

function receiptPath(base: string, sessionId: string): string {
  const name = `${createHash('sha256').update(sessionId).digest('hex').slice(0, 16)}.json`;
  return join(base, 'route-receipts', name);
}

afterEach(() => {
  for (const dir of tempDirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

describe('isWeakFollowUp', () => {
  it.each([
    ['fix that too', true],
    ['add one more task there', true],
    ['update it again with the new name', true],
    ['now fix the remaining ones', true],
    ['apply that change to the second file as well', false],
    ['add tests for it as well', true],
    [FALSE_CARRY_FOLLOW_UP, false],
    ['Also, create a birthday party plan', false],
    ['Create a birthday party plan too', false],
    ['Write a deploy script as well', false],
  ])('reads %j as weak: %s', (prompt, expected) => {
    expect(isWeakFollowUp(prompt)).toBe(expected);
  });

  it('reads the pasted form of a follow-up the same as the follow-up once stripped', () => {
    expect(isWeakFollowUp(stripLeadingPastedReply(PASTED_FIX_THAT_TOO))).toBe(true);
  });
});

describe('decideRouteReceiptGuard', () => {
  it('suppresses a floored weak follow-up that routes away from a current receipt', () => {
    expect(decideRouteReceiptGuard(guardInput())).toBe('suppress');
  });

  it('delivers a floored topic change that names its own work', () => {
    expect(decideRouteReceiptGuard(guardInput({ strippedPrompt: FALSE_CARRY_FOLLOW_UP }))).toBe('deliver');
  });

  it('delivers with no receipt', () => {
    expect(decideRouteReceiptGuard(guardInput({ receipt: null }))).toBe('deliver');
  });

  it('delivers when the policy reason is not work intent', () => {
    expect(decideRouteReceiptGuard(guardInput({ policyReason: 'length_and_token_threshold' }))).toBe('deliver');
  });

  it('delivers an unfloored top skill', () => {
    expect(decideRouteReceiptGuard(guardInput({ topFloored: false }))).toBe('deliver');
  });

  it('delivers when the follow-up routes to the receipt skill', () => {
    expect(decideRouteReceiptGuard(guardInput({ topSkill: 'sk-doc' }))).toBe('deliver');
  });

  it('delivers with no top skill', () => {
    expect(decideRouteReceiptGuard(guardInput({ topSkill: null }))).toBe('deliver');
  });

  it('delivers after a lifecycle boundary advanced the session epoch', () => {
    expect(decideRouteReceiptGuard(guardInput({
      clock: () => ({ ...CLOCK, lifecycleEpoch: 'epoch-2' }),
    }))).toBe('deliver');
  });

  it('delivers after the store generation moved', () => {
    expect(decideRouteReceiptGuard(guardInput({
      clock: () => ({ ...CLOCK, storeGeneration: 'generation-2' }),
    }))).toBe('deliver');
  });

  it('delivers when the clock cannot be read', () => {
    expect(decideRouteReceiptGuard(guardInput({ clock: () => null }))).toBe('deliver');
  });

  it('delivers after the transcript shrank below the receipt', () => {
    expect(decideRouteReceiptGuard(guardInput({ transcriptBytes: 50 }))).toBe('deliver');
  });

  it('suppresses when either transcript size is unknown', () => {
    expect(decideRouteReceiptGuard(guardInput({ transcriptBytes: null }))).toBe('suppress');
    expect(decideRouteReceiptGuard(guardInput({ receipt: receipt({ transcriptBytes: null }) }))).toBe('suppress');
  });

  it('reads the clock only after every cheaper check holds', () => {
    let reads = 0;
    const clock = () => {
      reads += 1;
      return CLOCK;
    };
    decideRouteReceiptGuard(guardInput({ clock, strippedPrompt: FALSE_CARRY_FOLLOW_UP }));
    decideRouteReceiptGuard(guardInput({ clock, topFloored: false }));
    expect(reads).toBe(0);
    decideRouteReceiptGuard(guardInput({ clock }));
    expect(reads).toBe(1);
  });
});

describe('InMemoryRouteReceiptStore', () => {
  it('returns the last receipt written for a session', () => {
    const store = new InMemoryRouteReceiptStore();
    expect(store.read('session-1')).toBeNull();
    store.write(receipt());
    store.write(receipt({ skill: 'system-spec-kit' }));
    expect(store.read('session-1')?.skill).toBe('system-spec-kit');
  });
});

describe('FileRouteReceiptStore', () => {
  it('round-trips a receipt', () => {
    const store = new FileRouteReceiptStore(tempBase());
    expect(store.write(receipt())).toBe(true);
    expect(store.read('session-1')).toEqual(receipt());
  });

  it('reads a missing receipt as none', () => {
    expect(new FileRouteReceiptStore(tempBase()).read('session-1')).toBeNull();
  });

  it.each([
    ['unparsable', 'not json'],
    ['wrong version', JSON.stringify({ ...receipt(), version: 2 })],
    ['another session', JSON.stringify({ ...receipt(), sessionId: 'session-2' })],
    ['an empty skill', JSON.stringify({ ...receipt(), skill: '' })],
    ['a negative transcript size', JSON.stringify({ ...receipt(), transcriptBytes: -1 })],
    ['oversized', JSON.stringify({ ...receipt(), padding: 'x'.repeat(5000) })],
  ])('reads a receipt file that is %s as none', (_label, body) => {
    const base = tempBase();
    mkdirSync(join(base, 'route-receipts'), { recursive: true, mode: 0o700 });
    writeFileSync(receiptPath(base, 'session-1'), body);
    expect(new FileRouteReceiptStore(base).read('session-1')).toBeNull();
  });

  it('refuses a symlinked receipt folder', () => {
    const base = tempBase();
    const elsewhere = tempBase();
    symlinkSync(elsewhere, join(base, 'route-receipts'));
    const store = new FileRouteReceiptStore(base);
    expect(store.write(receipt())).toBe(false);
    expect(readdirSync(elsewhere)).toEqual([]);
    expect(store.read('session-1')).toBeNull();
  });

  it('refuses a base folder other users can open', () => {
    const base = tempBase();
    chmodSync(base, 0o777);
    const store = new FileRouteReceiptStore(base);
    expect(store.write(receipt())).toBe(false);
    expect(existsSync(receiptPath(base, 'session-1'))).toBe(false);
    expect(store.read('session-1')).toBeNull();
  });

  it('refuses a receipt folder other users can open', () => {
    const base = tempBase();
    mkdirSync(join(base, 'route-receipts'), { mode: 0o700 });
    chmodSync(join(base, 'route-receipts'), 0o755);
    const store = new FileRouteReceiptStore(base);
    expect(store.write(receipt())).toBe(false);
    expect(existsSync(receiptPath(base, 'session-1'))).toBe(false);
  });

  it('leaves one valid receipt when two writers share a session', () => {
    const base = tempBase();
    const first = new FileRouteReceiptStore(base);
    const second = new FileRouteReceiptStore(base);
    for (let round = 0; round < 20; round += 1) {
      first.write(receipt({ skill: 'sk-doc' }));
      second.write(receipt({ skill: 'system-spec-kit' }));
    }
    expect(['sk-doc', 'system-spec-kit']).toContain(first.read('session-1')?.skill);
    const names = readdirSync(join(base, 'route-receipts'));
    expect(names.filter((name) => name.endsWith('.json'))).toHaveLength(1);
    expect(names.filter((name) => name.endsWith('.tmp'))).toEqual([]);
  });

  // Synchronous writes in one process never overlap, so these writers run as
  // separate processes. They load the built module, because a child process
  // cannot load the TypeScript source; build the runtime before this suite.
  it('never shows a torn or missing receipt while writers in separate processes overlap', async () => {
    expect(existsSync(BUILT_ROUTE_RECEIPT), `build the runtime first: ${BUILT_ROUTE_RECEIPT}`).toBe(true);
    const base = tempBase();
    const source = `
      const { FileRouteReceiptStore } = await import(process.env.ROUTE_RECEIPT_MODULE);
      const store = new FileRouteReceiptStore(process.env.ROUTE_RECEIPT_BASE);
      const role = process.env.ROUTE_RECEIPT_ROLE;
      let failed = 0;
      if (role === 'reader') {
        const started = Date.now();
        while (store.read('session-1') === null) {
          if (Date.now() - started > 10000) process.exit(2);
        }
        for (let round = 0; round < 2000; round += 1) {
          const seen = store.read('session-1');
          if (seen === null || !['sk-doc', 'system-spec-kit', 'sk-code'].includes(seen.skill)) failed += 1;
        }
      } else {
        const body = JSON.parse(process.env.ROUTE_RECEIPT_BODY);
        for (let round = 0; round < 300; round += 1) if (!store.write(body)) failed += 1;
      }
      process.exit(failed === 0 ? 0 : 1);
    `;
    const run = (role: string, skill: string) => new Promise<number | null>((resolveExit) => {
      const child = spawn(process.execPath, ['--input-type=module', '-e', source], {
        env: {
          ...process.env,
          ROUTE_RECEIPT_MODULE: pathToFileURL(BUILT_ROUTE_RECEIPT).href,
          ROUTE_RECEIPT_BASE: base,
          ROUTE_RECEIPT_ROLE: role,
          ROUTE_RECEIPT_BODY: JSON.stringify(receipt({ skill })),
        },
        stdio: 'ignore',
      });
      child.on('close', resolveExit);
    });
    const exits = await Promise.all([
      run('reader', ''),
      run('writer', 'sk-doc'),
      run('writer', 'system-spec-kit'),
      run('writer', 'sk-code'),
    ]);
    expect(exits).toEqual([0, 0, 0, 0]);
    const names = readdirSync(join(base, 'route-receipts'));
    expect(names.filter((name) => name.endsWith('.json'))).toHaveLength(1);
    expect(names.filter((name) => name.endsWith('.tmp'))).toEqual([]);
  }, 30_000);

  it('evicts the oldest receipt when a new session passes the bound', () => {
    const base = tempBase();
    const store = new FileRouteReceiptStore(base);
    for (let index = 0; index < MAX_DIRECTIVE_LIFECYCLE_SESSIONS; index += 1) {
      const sessionId = `session-${index}`;
      store.write(receipt({ sessionId }));
      const seconds = 1_000_000 + index;
      utimesSync(receiptPath(base, sessionId), seconds, seconds);
    }
    store.write(receipt({ sessionId: 'session-new' }));
    const files = readdirSync(join(base, 'route-receipts')).filter((name) => name.endsWith('.json'));
    expect(files).toHaveLength(MAX_DIRECTIVE_LIFECYCLE_SESSIONS);
    expect(store.read('session-0')).toBeNull();
    expect(store.read('session-1')?.sessionId).toBe('session-1');
    expect(store.read('session-new')?.sessionId).toBe('session-new');
  });

  it('removes a stale temp file and keeps a fresh one', () => {
    const base = tempBase();
    const dir = join(base, 'route-receipts');
    mkdirSync(dir, { recursive: true, mode: 0o700 });
    const stale = join(dir, '.1-stale.tmp');
    const fresh = join(dir, '.1-fresh.tmp');
    writeFileSync(stale, '{}');
    writeFileSync(fresh, '{}');
    const tenMinutesAgo = (Date.now() - 10 * 60 * 1000) / 1000;
    utimesSync(stale, tenMinutesAgo, tenMinutesAgo);
    new FileRouteReceiptStore(base).write(receipt());
    expect(existsSync(stale)).toBe(false);
    expect(existsSync(fresh)).toBe(true);
  });
});
