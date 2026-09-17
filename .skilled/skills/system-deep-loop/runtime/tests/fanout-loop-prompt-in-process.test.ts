// MODULE: fan-out lineage prompt — in-process execution directive
//
// A CLI lineage subprocess is itself the executor for every iteration of the
// loop it was handed. A leaf that reads the workflow YAML's per-iteration
// executor-dispatch step literally will spawn a nested CLI from inside its own
// sandbox, where nested dispatch is denied; the lineage then spends every
// iteration on dispatch failures and produces no findings. These cells pin the
// directive that removes that ambiguity: present for CLI lineage kinds, ahead of
// the "Read <skill>" instruction so it cannot be skimmed past, absent for native
// lineages (whose executor is already bound by the command host), and additive
// only — the existing write-containment sentence must survive unchanged.

import { describe, expect, it } from 'vitest';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const requireCjs = createRequire(import.meta.url);
const fanoutRunScript = join(dirname(fileURLToPath(import.meta.url)), '..', 'scripts', 'fanout-run.cjs');

type LineageKind = 'native' | 'cli-codex' | 'cli-opencode' | 'cli-pi' | 'cli-cursor' | 'cli-devin';

const { buildLoopPrompt } = requireCjs(fanoutRunScript) as {
  buildLoopPrompt: (
    loopType: 'research' | 'review',
    specFolder: string,
    lineageDir: string,
    sessionId: string,
    lineage: { kind: LineageKind; label: string; model?: string; iterations?: number },
    researchTopic?: string,
    options?: { stopPolicy?: string; convergenceThreshold?: number },
  ) => string;
};

const DIRECTIVE_HEADLINE = 'EXECUTION MODE (read this first): THIS process is the executor for EVERY iteration.';
const DIRECTIVE_PROHIBITION = 'NEVER spawn a nested CLI, agent, or subprocess to run an iteration';
const CONTAINMENT_SENTENCE = 'Write EVERY file you create or modify inside';

function researchPrompt(kind: LineageKind): string {
  return buildLoopPrompt(
    'research',
    'specs/test-fanout-in-process',
    '/tmp/fanout-in-process-lineage',
    'fanout-in-process-session',
    { kind, label: `${kind}-seat`, model: 'gpt-5.6-codex', iterations: 5 },
    'in-process execution directive topic',
  );
}

describe('fanout-run.cjs — buildLoopPrompt in-process execution directive', () => {
  it('states the directive before the skill-read instruction for a cli-codex research lineage', () => {
    const prompt = researchPrompt('cli-codex');

    expect(prompt).toContain(DIRECTIVE_HEADLINE);
    expect(prompt).toContain(DIRECTIVE_PROHIBITION);
    expect(prompt).toContain("no 'codex exec'");

    const directiveIndex = prompt.indexOf(DIRECTIVE_HEADLINE);
    const readIndex = prompt.indexOf('Read .opencode/skills/system-deep-loop/deep-research/SKILL.md');
    expect(directiveIndex).toBeGreaterThanOrEqual(0);
    expect(readIndex).toBeGreaterThanOrEqual(0);
    expect(directiveIndex).toBeLessThan(readIndex);
  });

  it('renders the directive for every non-native lineage kind', () => {
    for (const kind of ['cli-codex', 'cli-opencode', 'cli-pi', 'cli-cursor', 'cli-devin'] as const) {
      const prompt = researchPrompt(kind);
      expect(prompt, `${kind} carries the in-process directive`).toContain(DIRECTIVE_HEADLINE);
      expect(prompt, `${kind} forbids nested dispatch`).toContain(DIRECTIVE_PROHIBITION);
    }
  });

  it('omits the directive for a native lineage', () => {
    const prompt = researchPrompt('native');

    expect(prompt).not.toContain(DIRECTIVE_HEADLINE);
    expect(prompt).not.toContain(DIRECTIVE_PROHIBITION);
    expect(prompt).toContain(
      "This is an explicit native fan-out adapter running through the command host's OpenCode CLI surface.",
    );
  });

  it('leaves the write-containment sentence intact for cli and native lineages alike', () => {
    for (const kind of ['cli-codex', 'cli-opencode', 'native'] as const) {
      expect(researchPrompt(kind), `${kind} keeps write containment`).toContain(CONTAINMENT_SENTENCE);
    }
  });
});
