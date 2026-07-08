// ───────────────────────────────────────────────────────────────────
// MODULE: Workflow Session Id Parity Tests
// ───────────────────────────────────────────────────────────────────

import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

// ───────────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

type LoopMode = 'review' | 'research';
type ActiveFanoutMode = 'review' | 'research';

interface ModeContract {
  readonly mode: LoopMode;
  readonly fileName: string;
  readonly fallback: string;
  readonly configSessionKey: 'sessionId' | 'lineage.sessionId';
}

interface FanoutRunExports {
  readonly buildLoopPrompt: (
    loopType: ActiveFanoutMode,
    specFolder: string,
    lineageDir: string,
    sessionId: string,
    lineage: { readonly kind: 'cli-opencode'; readonly label: string; readonly model: string },
    researchTopic?: string,
  ) => string;
}

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const requireCjs = createRequire(import.meta.url);
const RUNTIME_ROOT = resolve(import.meta.dirname, '..', '..');
const ASSETS_ROOT = resolve(RUNTIME_ROOT, '..', '..', '..', 'commands', 'deep', 'assets');
const FANOUT_RUN_SCRIPT = resolve(RUNTIME_ROOT, 'scripts', 'fanout-run.cjs');

const MODE_CONTRACTS: readonly ModeContract[] = [
  {
    mode: 'review',
    fileName: 'deep_review_auto.yaml',
    fallback: '{ISO_8601_NOW}',
    configSessionKey: 'sessionId',
  },
  {
    mode: 'research',
    fileName: 'deep_research_auto.yaml',
    fallback: '{AUTO_SESSION_ID}',
    configSessionKey: 'lineage.sessionId',
  },
];

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function findBlock(source: string, key: string, mode: LoopMode, missingPiece: string): string {
  const match = new RegExp(`^(\\s*)${escapeRegExp(key)}:\\s*(?:#.*)?$`, 'm').exec(source);
  if (!match) {
    throw new Error(`${mode}: missing ${missingPiece}`);
  }

  const indent = match[1].length;
  const tail = source.slice(match.index + match[0].length);
  const blockLines: string[] = [];

  for (const line of tail.split(/\r?\n/)) {
    if (line.trim() !== '' && !line.trim().startsWith('#')) {
      const lineIndent = /^ */.exec(line)?.[0].length ?? 0;
      if (lineIndent <= indent) break;
    }
    blockLines.push(line);
  }

  return blockLines.join('\n');
}

function unquoteYamlScalar(rawValue: string): string {
  const value = rawValue.trim();
  const first = value.at(0);
  const last = value.at(-1);
  if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
    return value.slice(1, -1);
  }
  return value;
}

function readScalar(block: string, key: string, mode: LoopMode, missingPiece: string): string {
  const match = new RegExp(`^\\s*${escapeRegExp(key)}:\\s*(.+?)\\s*$`, 'm').exec(block);
  if (!match) {
    throw new Error(`${mode}: missing ${missingPiece}`);
  }
  return unquoteYamlScalar(match[1]);
}

function readWorkflow(contract: ModeContract): string {
  return readFileSync(resolve(ASSETS_ROOT, contract.fileName), 'utf8');
}

function assertSessionIdContract(contract: ModeContract): void {
  const workflow = readWorkflow(contract);
  const resolveStep = findBlock(
    workflow,
    'step_resolve_session_id',
    contract.mode,
    'step_resolve_session_id',
  );
  const ifPresentBind = findBlock(
    findBlock(resolveStep, 'if_present', contract.mode, 'if_present bind'),
    'bind',
    contract.mode,
    'if_present bind',
  );
  const ifAbsentBind = findBlock(
    findBlock(resolveStep, 'if_absent', contract.mode, 'if_absent fallback'),
    'bind',
    contract.mode,
    'if_absent fallback',
  );

  expect(
    readScalar(ifPresentBind, 'session_id_init', contract.mode, 'if_present session_id_init bind'),
    `${contract.mode}: if_present must bind session_id_init from {session_id}`,
  ).toBe('{session_id}');
  expect(
    readScalar(ifAbsentBind, 'session_id_init', contract.mode, 'if_absent session_id_init fallback'),
    `${contract.mode}: if_absent must bind session_id_init from ${contract.fallback}`,
  ).toBe(contract.fallback);

  const configPopulate = findBlock(
    findBlock(
      workflow,
      'step_create_config',
      contract.mode,
      'step_create_config',
    ),
    'populate',
    contract.mode,
    'step_create_config populate block',
  );

  expect(
    readScalar(
      configPopulate,
      contract.configSessionKey,
      contract.mode,
      `${contract.configSessionKey} config consumption`,
    ),
    `${contract.mode}: config creation must consume {session_id_init} for ${contract.configSessionKey}`,
  ).toBe('{session_id_init}');
}

// ───────────────────────────────────────────────────────────────────
// 4. TESTS
// ───────────────────────────────────────────────────────────────────

describe('deep workflow session id parity', () => {
  it('pins the auto-workflow resolve contract for review, context, and research', () => {
    for (const contract of MODE_CONTRACTS) {
      assertSessionIdContract(contract);
    }
  });

  it('renders a session_id line in fan-out lineage prompts for active fan-out loop types', () => {
    const { buildLoopPrompt } = requireCjs(FANOUT_RUN_SCRIPT) as FanoutRunExports;

    for (const { mode } of MODE_CONTRACTS.filter((contract) => contract.mode !== 'context')) {
      const sessionId = `fanout-${mode}-session`;
      const prompt = buildLoopPrompt(
        mode as ActiveFanoutMode,
        'specs/test-session-id-parity',
        `/tmp/${mode}-lineage`,
        sessionId,
        { kind: 'cli-opencode', label: `${mode}-seat`, model: 'opencode-go/glm-5.1' },
        mode === 'research' ? 'session id parity research topic' : undefined,
      );

      expect(
        prompt,
        `${mode}: fan-out prompt missing session_id line`,
      ).toContain(`\n  session_id: ${sessionId}\n`);
    }
  });
});
