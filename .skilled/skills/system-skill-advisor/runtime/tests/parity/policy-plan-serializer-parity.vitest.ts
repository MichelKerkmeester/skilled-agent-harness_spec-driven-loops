// ───────────────────────────────────────────────────────────────────
// MODULE: Shadow Policy Planner Serializer Parity Tests
// ───────────────────────────────────────────────────────────────────

import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import {
  GATE_SPEC_FOLDER_QUESTION_ID,
  POLICY_BLOCK_REGISTRY,
} from '../../lib/policy-plan.js';
import {
  renderAdvisorBrief,
  renderAdvisorFallbackDirective,
} from '../../lib/render.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

type ContextName = 'advisor' | 'fallback' | 'gate' | 'readOnly';
type RuntimeName = 'claude' | 'codex' | 'devin' | 'cursor' | 'opencode' | 'pi';

interface ParityCase {
  readonly name: string;
  readonly context: ContextName;
  readonly inputText: string;
}

interface RuntimeFixture {
  readonly runtime: RuntimeName;
  readonly serializer: string;
  readonly cases: readonly ParityCase[];
}

interface BaselineContexts {
  readonly advisor: string;
  readonly fallback: string;
  readonly gate: string;
  readonly readOnly: null;
}

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const FIXTURE_DIRECTORY = fileURLToPath(new URL('./fixtures/policy-plan/', import.meta.url));
const BASELINE_CONTEXTS = JSON.parse(
  readFileSync(`${FIXTURE_DIRECTORY}/baseline-contexts.json`, 'utf8'),
) as BaselineContexts;

const ADVISOR_RESULT = {
  status: 'ok' as const,
  freshness: 'live' as const,
  recommendations: [{
    skill: 'sk-code',
    kind: 'skill' as const,
    confidence: 0.95,
    uncertainty: 0.2,
    passes_threshold: true,
  }],
};

const FIXTURE_FILES = readdirSync(FIXTURE_DIRECTORY)
  .filter((fileName) => fileName.endsWith('.json') && fileName !== 'baseline-contexts.json')
  .sort();

const RUNTIME_FIXTURES = FIXTURE_FILES.map((fileName) => JSON.parse(
  readFileSync(`${FIXTURE_DIRECTORY}/${fileName}`, 'utf8'),
) as RuntimeFixture);

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────

function baselineContext(name: ContextName): string | null {
  return BASELINE_CONTEXTS[name];
}

function currentContext(name: ContextName): string | null {
  switch (name) {
    case 'advisor':
      return renderAdvisorBrief(ADVISOR_RESULT);
    case 'fallback':
      return renderAdvisorFallbackDirective();
    case 'gate': {
      const definition = POLICY_BLOCK_REGISTRY.find((candidate) => (
        candidate.id === GATE_SPEC_FOLDER_QUESTION_ID
      ));
      const content = definition?.content();
      if (typeof content !== 'string') {
        throw new Error('The Gate owner did not expose its current question text');
      }
      return content;
    }
    case 'readOnly':
      return null;
  }
}

function serializeNative(runtime: RuntimeName, context: string | null, inputText: string): string {
  switch (runtime) {
    case 'claude':
    case 'codex':
    case 'devin':
      return JSON.stringify(context === null
        ? {}
        : {
          hookSpecificOutput: {
            hookEventName: 'UserPromptSubmit',
            additionalContext: context,
          },
        });
    case 'cursor':
      return JSON.stringify(context === null
        ? { permission: 'allow' }
        : { permission: 'allow', agent_message: context });
    case 'opencode':
      return JSON.stringify({ system: context === null ? [] : [context] });
    case 'pi':
      return context === null ? inputText : `${inputText}\n\n${context}`;
  }
}

function firstByteDiff(expected: Uint8Array, actual: Uint8Array): string {
  const length = Math.max(expected.length, actual.length);
  for (let index = 0; index < length; index += 1) {
    if (expected[index] !== actual[index]) {
      return `offset=${index} expected=${expected[index] ?? 'EOF'} actual=${actual[index] ?? 'EOF'}`;
    }
  }
  return '';
}

function diffForCase(fixture: RuntimeFixture, parityCase: ParityCase): string {
  const baseline = serializeNative(
    fixture.runtime,
    baselineContext(parityCase.context),
    parityCase.inputText,
  );
  const current = serializeNative(
    fixture.runtime,
    currentContext(parityCase.context),
    parityCase.inputText,
  );
  return firstByteDiff(Buffer.from(baseline, 'utf8'), Buffer.from(current, 'utf8'));
}

// ───────────────────────────────────────────────────────────────────
// 4. TESTS
// ───────────────────────────────────────────────────────────────────

describe('policy planner native serializer parity', () => {
  it('loads the complete six-runtime, five-case fixture matrix', () => {
    expect(RUNTIME_FIXTURES.map((fixture) => fixture.runtime)).toEqual([
      'claude',
      'codex',
      'cursor',
      'devin',
      'opencode',
      'pi',
    ]);
    expect(RUNTIME_FIXTURES.map((fixture) => fixture.serializer)).toEqual([
      'claude-derived-envelope',
      'claude-derived-envelope',
      'cursor-beforeSubmitPrompt',
      'claude-derived-envelope',
      'opencode-output.system',
      'pi-input-transform',
    ]);
    expect(RUNTIME_FIXTURES.every((fixture) => fixture.cases.length === 5)).toBe(true);
  });

  for (const fixture of RUNTIME_FIXTURES) {
    for (const parityCase of fixture.cases) {
      it(`${fixture.runtime}/${parityCase.name}: emitted bytes match the captured baseline`, () => {
        expect(diffForCase(fixture, parityCase), `${fixture.runtime}/${parityCase.name} byte diff`).toBe('');
      });
    }
  }

  it('reports an empty byte diff across the complete fixture matrix', () => {
    const differences = RUNTIME_FIXTURES.flatMap((fixture) => fixture.cases.map((parityCase) => ({
      name: `${fixture.runtime}/${parityCase.name}`,
      diff: diffForCase(fixture, parityCase),
    }))).filter((entry) => entry.diff !== '');

    expect(differences).toEqual([]);
    console.log(`SC-001 byte-diff: empty; rows=${RUNTIME_FIXTURES.reduce((total, fixture) => total + fixture.cases.length, 0)}`);
  });
});
