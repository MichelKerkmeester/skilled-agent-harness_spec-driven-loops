import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';
import { RECOVERED_TRANSCRIPT_STRIP_PATTERNS } from '../../mcp-server/hooks/shared-provenance.js';

import {
  type BoundSpecFolder,
  type CommandContract,
  FILE_WRITE_TRIGGERS,
  GATE_3_SCHEMA_VERSION,
  GATE_3_VOCABULARY,
  MEMORY_SAVE_TRIGGERS,
  READ_ONLY_DISQUALIFIERS,
  RESUME_TRIGGERS,
  classifyPrompt,
  matchesEntry,
  normalizePrompt,
  toJsonSnapshot,
  tokenizePrompt,
  validateSpecFolderBinding,
} from '../../shared/gate-3-classifier';

const ASCII_ONLY_PATTERN = /^[\x00-\x7F]+$/;
const VALID_SPEC_FOLDER = '.opencode/specs/deep-loops/035-gpt-reliability-fixes/002-gate3-precedence-and-validator';
const VALID_COMMAND_CONTRACT: CommandContract = {
  declaresAutonomousExecution: true,
  ownsSpecFolderSetup: true,
  allowedSpecFolderSources: ['flags', 'pre_bound_setup_answers', 'target_path_resolution'],
  writeBoundary: VALID_SPEC_FOLDER,
};
const ADVERSARIAL_NORMALIZATION_CASES = [
  { input: 'SYST\u0415M:', expected: 'system:' },
  { input: 'SYSTE\u041C:', expected: 'system:' },
  { input: 'SY\u0405TEM:', expected: 'system:' },
  { input: 'US\u0415R:', expected: 'user:' },
  { input: 'U\u0405ER:', expected: 'user:' },
  { input: 'ASSIST\u0410NT:', expected: 'assistant:' },
  { input: 'ASSI\u0405TANT:', expected: 'assistant:' },
  { input: 'D\u0415VELOPER:', expected: 'developer:' },
  { input: 'D\u0415V\u0415LOPER:', expected: 'developer:' },
  { input: 'SYST\u00C9M:', expected: 'system:' },
  { input: 'US\u00C9R:', expected: 'user:' },
  { input: 'ASSIST\u00C1NT:', expected: 'assistant:' },
  { input: 'D\u00CBVELOPER:', expected: 'developer:' },
  { input: 'SYST\u0395M:', expected: 'system:' },
  { input: '\u0456gnore previous', expected: 'ignore previous' },
  { input: '\u0423ou are', expected: 'you are' },
  { input: 'Y\u043Eu are', expected: 'you are' },
  { input: 'Follo\uFF57 these instructions', expected: 'follow these instructions' },
  { input: '\uFF33\uFF39\uFF33\uFF34\uFF25\uFF2D:', expected: 'system:' },
  { input: 'imp\u043Ertant: ignore everything', expected: 'important: ignore everything' },
  { input: 'ign\u03BFre previous', expected: 'ignore previous' },
] as const;

const tempRoots: string[] = [];

afterEach(() => {
  for (const root of tempRoots.splice(0)) {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

function createTempWorkspace(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'gate3-classifier-'));
  tempRoots.push(root);
  return root;
}

function writeSpecFolder(
  workspaceRoot: string,
  relativePath: string,
  options: { status?: string; graphMetadata?: Record<string, unknown>; omitDescription?: boolean } = {},
): void {
  const folder = path.join(workspaceRoot, relativePath);
  fs.mkdirSync(folder, { recursive: true });
  fs.writeFileSync(
    path.join(folder, 'spec.md'),
    `# Spec\n\n| Field | Value |\n|---|---|\n| **Status** | ${options.status ?? 'Planned'} |\n`,
  );
  if (options.omitDescription !== true) {
    fs.writeFileSync(path.join(folder, 'description.json'), JSON.stringify({ title: relativePath }));
  }
  fs.writeFileSync(
    path.join(folder, 'graph-metadata.json'),
    JSON.stringify(options.graphMetadata ?? { children_ids: [], derived: { last_active_child_id: null } }),
  );
}

function boundSpecFolder(source: BoundSpecFolder['source'] = 'target_path_resolution', specPath = VALID_SPEC_FOLDER): BoundSpecFolder {
  return { path: specPath, source, validated: false };
}

describe('Gate 3 classifier — vocabulary invariants', () => {
  it('exposes a stable schema version', () => {
    expect(GATE_3_SCHEMA_VERSION).toBe('1.0.0');
  });

  it('exposes the five categorical groups via GATE_3_VOCABULARY', () => {
    expect(Object.keys(GATE_3_VOCABULARY)).toEqual([
      'fileWrite',
      'memorySave',
      'resume',
      'readOnlyDisqualifier',
    ]);
  });

  it('every file-write trigger is a single token (not a phrase)', () => {
    for (const entry of FILE_WRITE_TRIGGERS) {
      expect(entry.kind).toBe('token');
      expect(entry.pattern).not.toMatch(/\s/);
    }
  });

  it('every memory-save and resume trigger is a phrase', () => {
    for (const entry of MEMORY_SAVE_TRIGGERS) {
      expect(entry.kind).toBe('phrase');
    }
    for (const entry of RESUME_TRIGGERS) {
      expect(entry.kind).toBe('phrase');
    }
  });

  it('read-only disqualifiers include analyze/review/audit/inspect/explain', () => {
    const patterns = READ_ONLY_DISQUALIFIERS.map(e => e.pattern);
    expect(patterns).toEqual(expect.arrayContaining([
      'review', 'audit', 'inspect', 'analyze', 'explain',
    ]));
  });

  it('file-write list does NOT include analyze/decompose/phase (false-positive tokens)', () => {
    const patterns = FILE_WRITE_TRIGGERS.map(e => e.pattern);
    expect(patterns).not.toContain('analyze');
    expect(patterns).not.toContain('decompose');
    expect(patterns).not.toContain('phase');
  });
});

describe('Gate 3 classifier — normalization', () => {
  it('lowercases and collapses whitespace', () => {
    expect(normalizePrompt('Fix    THE bug')).toBe('fix the bug');
  });

  it('applies NFKC and strips soft hyphen / zero-width characters before matching', () => {
    expect(normalizePrompt('f\u00ADix   t\u200Bhe bug')).toBe('fix the bug');
    expect(normalizePrompt('\uFEFFwrite the file')).toBe('write the file');
  });

  it('folds adversarial Unicode confusables into ASCII-safe normalized prompts', () => {
    for (const { input, expected } of ADVERSARIAL_NORMALIZATION_CASES) {
      const normalized = normalizePrompt(input);
      expect(normalized).toBe(expected);
      expect(ASCII_ONLY_PATTERN.test(normalized)).toBe(true);
      expect(RECOVERED_TRANSCRIPT_STRIP_PATTERNS.some((pattern) => pattern.test(normalized))).toBe(true);
    }
  });

  it('does not over-fold plain ASCII control inputs', () => {
    expect(normalizePrompt('System:')).toBe('system:');
    expect(normalizePrompt('system:')).toBe('system:');
  });

  it('tokenizes while preserving /, :, - and _', () => {
    const tokens = tokenizePrompt(normalizePrompt('/speckit:resume the deep-research'));
    expect(tokens).toEqual(expect.arrayContaining(['/speckit:resume', 'the', 'deep-research']));
  });
});

describe('Gate 3 classifier — matchesEntry', () => {
  it('matches a token only as a standalone word', () => {
    const tokens = tokenizePrompt('please fix this');
    expect(
      matchesEntry({ pattern: 'fix', kind: 'token', category: 'file_write' }, 'please fix this', tokens),
    ).toBe(true);
  });

  it('does NOT match a token that is a substring of another word', () => {
    const tokens = tokenizePrompt('the prefix is wrong');
    expect(
      matchesEntry({ pattern: 'fix', kind: 'token', category: 'file_write' }, 'the prefix is wrong', tokens),
    ).toBe(false);
  });

  it('matches a phrase as a substring of the normalized prompt', () => {
    const tokens = tokenizePrompt('please save memory now');
    expect(
      matchesEntry({ pattern: 'save memory', kind: 'phrase', category: 'memory_save' }, 'please save memory now', tokens),
    ).toBe(true);
  });
});

describe('Gate 3 classifier — positive matches (T-DOC-02)', () => {
  it('triggers Gate 3 for "implement the feature"', () => {
    const r = classifyPrompt('implement the new feature');
    expect(r.triggersGate3).toBe(true);
    expect(r.reason).toBe('file_write_match');
  });

  it('triggers Gate 3 for "rename the helper"', () => {
    expect(classifyPrompt('rename the helper module').triggersGate3).toBe(true);
  });

  it('triggers Gate 3 for "fix the bug"', () => {
    expect(classifyPrompt('please fix the bug in session-stop').triggersGate3).toBe(true);
  });

  it('triggers Gate 3 when soft hyphen hides a file-write token', () => {
    const r = classifyPrompt('f\u00ADile write');
    expect(r.triggersGate3).toBe(true);
    expect(r.reason).toBe('file_write_match');
  });

  it('triggers Gate 3 when zero-width space hides a file-write token', () => {
    const r = classifyPrompt('wr\u200Bite the packet');
    expect(r.triggersGate3).toBe(true);
    expect(r.reason).toBe('file_write_match');
  });

  it('triggers Gate 3 when soft hyphen and zero-width space appear together', () => {
    const r = classifyPrompt('wr\u00ADi\u200Bte the packet');
    expect(r.triggersGate3).toBe(true);
    expect(r.reason).toBe('file_write_match');
  });
});

describe('Gate 3 classifier — read-only disqualifiers (T-DOC-02)', () => {
  it('does NOT trigger Gate 3 for "analyze the phase transition"', () => {
    const r = classifyPrompt('analyze the phase transition');
    expect(r.triggersGate3).toBe(false);
    expect(r.reason).toBe('no_match');
  });

  it('does NOT trigger Gate 3 for "review the decomposition phase"', () => {
    const r = classifyPrompt('review the decomposition phase');
    expect(r.triggersGate3).toBe(false);
  });

  it('does NOT trigger Gate 3 for "audit the synthesis phase"', () => {
    const r = classifyPrompt('audit the synthesis phase');
    expect(r.triggersGate3).toBe(false);
  });

  it('suppresses Gate 3 when "review" co-occurs with a file-write verb', () => {
    // e.g., "review the changes I want to update" — read-only framing dominates
    const r = classifyPrompt('review the changes I want to update');
    expect(r.triggersGate3).toBe(false);
    expect(r.reason).toBe('read_only_override');
  });

  it('recovers mixed read-only prompts with an explicit write tail', () => {
    for (const prompt of [
      'review the routing corpus and update the mislabeled prompts',
      'audit the packet docs, then generate a corrected iteration stub',
      'analyze the current error classes and patch the obvious trigger gap',
      'explain the taxonomy, then rewrite the weak prompts',
    ]) {
      const r = classifyPrompt(prompt);
      expect(r.triggersGate3).toBe(true);
      expect(r.reason).toBe('file_write_match');
    }
  });

  it('does NOT suppress Gate 3 for a save-memory trigger even with "review"', () => {
    const r = classifyPrompt('review and save memory for the packet');
    expect(r.triggersGate3).toBe(true);
    expect(r.reason).toBe('memory_save_match');
  });
});

describe('Gate 3 classifier — save/resume/continue (T-DOC-03)', () => {
  it('triggers Gate 3 for "save context"', () => {
    const r = classifyPrompt('save context for the current spec');
    expect(r.triggersGate3).toBe(true);
    expect(r.reason).toBe('memory_save_match');
  });

  it('triggers Gate 3 for "save memory"', () => {
    expect(classifyPrompt('save memory now').triggersGate3).toBe(true);
  });

  it('triggers Gate 3 for "/memory:save"', () => {
    const r = classifyPrompt('please run /memory:save on the 016 packet');
    expect(r.triggersGate3).toBe(true);
    expect(r.reason).toBe('memory_save_match');
  });

  it('triggers Gate 3 for "/speckit:resume"', () => {
    const r = classifyPrompt('/speckit:resume the 016 packet');
    expect(r.triggersGate3).toBe(true);
    expect(r.reason).toBe('resume_match');
  });

  it('triggers Gate 3 for "resume deep research"', () => {
    expect(classifyPrompt('resume deep research loop').triggersGate3).toBe(true);
  });

  it('triggers Gate 3 for "continue iteration"', () => {
    expect(classifyPrompt('continue iteration 42').triggersGate3).toBe(true);
  });

  it('triggers Gate 3 for broader resume/context continuity markers', () => {
    for (const prompt of [
      'resume the packet and reconstruct continuity from implementation-summary.md',
      'resume the phase folder and rebuild context from continuity',
    ]) {
      const r = classifyPrompt(prompt);
      expect(r.triggersGate3).toBe(true);
      expect(r.reason).toBe('resume_match');
    }
  });

  it('triggers Gate 3 for direct speckit deep-research command prompts', () => {
    const r = classifyPrompt('run /deep:start-research-loop :auto for the routing packet');
    expect(r.triggersGate3).toBe(true);
    expect(r.reason).toBe('resume_match');
    expect(r.matched.map((entry) => entry.pattern)).toEqual(expect.arrayContaining([
      '/deep:start-research-loop',
      ':auto',
    ]));
  });

  it('triggers Gate 3 for direct speckit deep-review command prompts', () => {
    const r = classifyPrompt('/deep:start-review-loop :auto the current packet for 10 iterations');
    expect(r.triggersGate3).toBe(true);
    expect(r.reason).toBe('resume_match');
  });

  it('triggers Gate 3 for deep-loop natural-language markers', () => {
    for (const prompt of [
      'run a deep research pass over the packet',
      'continue the active deep-research lineage',
      'start a deep review loop with convergence tracking',
      'kick off another deep-review wave for packet docs',
      'continue the iteration loop and append artifacts',
      'begin a 10-iteration research sweep over routing prompts',
      'autoresearch the routing accuracy packet',
    ]) {
      const r = classifyPrompt(prompt);
      expect(r.triggersGate3).toBe(true);
      expect(r.reason).toBe('resume_match');
    }
  });

  it('only treats :auto as deep-loop write marker when paired with speckit', () => {
    expect(classifyPrompt('explain the :auto suffix in isolation').triggersGate3).toBe(false);
    expect(classifyPrompt('run speckit:deep-review :auto on the packet').triggersGate3).toBe(true);
  });
});

describe('Gate 3 classifier — negative baselines', () => {
  it('does NOT trigger Gate 3 for pure greetings', () => {
    expect(classifyPrompt('hello, what is the current status').triggersGate3).toBe(false);
  });

  it('does NOT trigger Gate 3 for pure question prompts', () => {
    expect(classifyPrompt('what files live in the shared folder?').triggersGate3).toBe(false);
  });

  it('does NOT trigger Gate 3 for "show me" reads', () => {
    expect(classifyPrompt('show me the recent commits').triggersGate3).toBe(false);
  });

  it('keeps historical false-positive tokens read-only when no write tail exists', () => {
    for (const prompt of [
      'analyze the routing phase',
      'decompose the planning phase at a high level',
      'explain the phase taxonomy',
      'analyze whether phase causes confusion, but do not change anything',
    ]) {
      expect(classifyPrompt(prompt).triggersGate3).toBe(false);
    }
  });

  it('does NOT trigger Gate 3 for prompt-only generation in chat', () => {
    for (const prompt of [
      'create a sharper prompt for the next routing run',
      'generate a better prompt package, but do not save it anywhere',
      'build a better phrasing for the deep-review dispatch and keep it in chat only',
    ]) {
      expect(classifyPrompt(prompt).triggersGate3).toBe(false);
    }
  });

  it('does NOT trigger Gate 3 for read-only deep-loop references', () => {
    for (const prompt of [
      'inspect the deep-research state log and summarize progression',
      'review the deep-research instructions and confirm scope',
      'explain why deep-loop prompts matter',
    ]) {
      expect(classifyPrompt(prompt).triggersGate3).toBe(false);
    }
  });

  it('confusable-folds Cyrillic homoglyphs into a file-write token', () => {
    const r = classifyPrompt('d\u0435lete the helper');
    expect(r.triggersGate3).toBe(true);
    expect(r.reason).toBe('file_write_match');
  });

  it('confusable-folds Greek epsilon into a file-write token', () => {
    const r = classifyPrompt('\u0395dit the helper');
    expect(r.triggersGate3).toBe(true);
    expect(r.reason).toBe('file_write_match');
  });

  it('accent-folds Latin characters into a file-write token', () => {
    const r = classifyPrompt('cr\u00E9ate the helper');
    expect(r.triggersGate3).toBe(true);
    expect(r.reason).toBe('file_write_match');
  });
});

describe('Gate 3 classifier — satisfaction and spec-folder binding validation', () => {
  it('keeps no-options triggering prompts backward compatible while surfacing prompt state', () => {
    const result = classifyPrompt('implement the validator');
    expect(result.triggersGate3).toBe(true);
    expect(result.reason).toBe('file_write_match');
    expect(result.satisfiedBy).toBeNull();
    expect(result.requiresGate3Prompt).toBe(true);
    expect(result.writeBoundary).toBeNull();
  });

  it('satisfies an autonomous triggered prompt with a valid pre-bound spec folder', () => {
    const result = classifyPrompt('/deep:review specs/123-x :auto', {
      executionMode: 'AUTONOMOUS',
      boundSpecFolder: boundSpecFolder('target_path_resolution'),
      commandContract: VALID_COMMAND_CONTRACT,
    });

    expect(result.triggersGate3).toBe(true);
    expect(result.requiresGate3Prompt).toBe(false);
    expect(result.satisfiedBy).toBe('prebound_spec_folder');
    expect(result.writeBoundary).toBe(VALID_SPEC_FOLDER);
  });

  it('does not satisfy an autonomous triggered prompt without a bound spec folder', () => {
    const result = classifyPrompt('/deep:review :auto', {
      executionMode: 'AUTONOMOUS',
      boundSpecFolder: null,
      commandContract: VALID_COMMAND_CONTRACT,
    });

    expect(result.triggersGate3).toBe(true);
    expect(result.requiresGate3Prompt).toBe(true);
    expect(result.satisfiedBy).toBeNull();
  });

  it('keeps an interactive write prompt gated without a prior answer', () => {
    const result = classifyPrompt('fix the parser bug', { executionMode: 'INTERACTIVE' });
    expect(result.triggersGate3).toBe(true);
    expect(result.requiresGate3Prompt).toBe(true);
    expect(result.satisfiedBy).toBeNull();
  });

  it('keeps read-only research ungated even when options are present', () => {
    const result = classifyPrompt('READ-ONLY RESEARCH TASK: analyze Gate 3; no file writes', {
      executionMode: 'INTERACTIVE',
    });

    expect(result.triggersGate3).toBe(false);
    expect(result.requiresGate3Prompt).toBe(false);
    expect(result.satisfiedBy).toBeNull();
  });

  it('satisfies an interactive prior answer after validating the bound folder', () => {
    const result = classifyPrompt('save context', {
      executionMode: 'INTERACTIVE',
      boundSpecFolder: boundSpecFolder('prior_answer'),
    });

    expect(result.triggersGate3).toBe(true);
    expect(result.requiresGate3Prompt).toBe(false);
    expect(result.satisfiedBy).toBe('prior_answer');
    expect(result.writeBoundary).toBe(VALID_SPEC_FOLDER);
  });

  it('does not treat an interactive pre-bound confirm marker as a prior answer', () => {
    const result = classifyPrompt(`/deep:review:confirm PRE-BOUND SETUP ANSWERS:\n  spec_folder: ${VALID_SPEC_FOLDER}`, {
      executionMode: 'INTERACTIVE',
      boundSpecFolder: boundSpecFolder('pre_bound_setup_answers'),
      commandContract: VALID_COMMAND_CONTRACT,
    });

    expect(result.triggersGate3).toBe(true);
    expect(result.matched.map((entry) => entry.pattern)).toContain(':confirm');
    expect(result.requiresGate3Prompt).toBe(true);
    expect(result.satisfiedBy).toBeNull();
  });

  it('satisfies an autonomous :confirm prompt when the bound folder and contract are valid', () => {
    const result = classifyPrompt(`/deep:review:confirm PRE-BOUND SETUP ANSWERS:\n  spec_folder: ${VALID_SPEC_FOLDER}`, {
      executionMode: 'AUTONOMOUS',
      boundSpecFolder: boundSpecFolder('pre_bound_setup_answers'),
      commandContract: VALID_COMMAND_CONTRACT,
    });

    expect(result.triggersGate3).toBe(true);
    expect(result.matched.map((entry) => entry.pattern)).toContain(':confirm');
    expect(result.requiresGate3Prompt).toBe(false);
    expect(result.satisfiedBy).toBe('prebound_spec_folder');
  });

  it('keeps child-agent re-classification satisfied when the contract is propagated', () => {
    const result = classifyPrompt('child agent re-classify: implement the validator', {
      executionMode: 'AUTONOMOUS',
      boundSpecFolder: boundSpecFolder('flags'),
      commandContract: VALID_COMMAND_CONTRACT,
    });

    expect(result.triggersGate3).toBe(true);
    expect(result.requiresGate3Prompt).toBe(false);
    expect(result.satisfiedBy).toBe('prebound_spec_folder');
    expect(result.writeBoundary).toBe(VALID_SPEC_FOLDER);
  });

  it('does not trust caller-supplied validation for an out-of-tree flags path', () => {
    const result = classifyPrompt('fix the parser bug', {
      executionMode: 'AUTONOMOUS',
      boundSpecFolder: { path: 'flags', source: 'flags', validated: true },
      commandContract: { ...VALID_COMMAND_CONTRACT, writeBoundary: 'flags' },
    });
    const validation = validateSpecFolderBinding({ path: 'flags', source: 'flags', validated: true });

    expect(validation.valid).toBe(false);
    expect(result.triggersGate3).toBe(true);
    expect(result.requiresGate3Prompt).toBe(true);
    expect(result.satisfiedBy).toBeNull();
  });

  it('requires a non-empty autonomous write boundary', () => {
    const contractWithoutBoundary: CommandContract = {
      declaresAutonomousExecution: true,
      ownsSpecFolderSetup: true,
      allowedSpecFolderSources: ['flags', 'pre_bound_setup_answers', 'target_path_resolution'],
    };
    const result = classifyPrompt('fix the parser bug', {
      executionMode: 'AUTONOMOUS',
      boundSpecFolder: boundSpecFolder('flags'),
      commandContract: contractWithoutBoundary,
    });

    expect(result.triggersGate3).toBe(true);
    expect(result.requiresGate3Prompt).toBe(true);
    expect(result.satisfiedBy).toBeNull();
    expect(result.writeBoundary).toBeNull();
  });

  it('rejects an ambiguous target-path binding with more than one candidate', () => {
    const workspaceRoot = createTempWorkspace();
    writeSpecFolder(workspaceRoot, '.opencode/specs/123-ambiguous');
    writeSpecFolder(workspaceRoot, 'specs/123-ambiguous');

    const validation = validateSpecFolderBinding(
      { path: '123-ambiguous', source: 'target_path_resolution', validated: true },
      { workspaceRoot },
    );

    expect(validation.valid).toBe(false);
    expect(validation.reason).toBe('ambiguous_target_path');
  });

  it('rejects metadata-missing and deprecated spec-folder bindings', () => {
    const workspaceRoot = createTempWorkspace();
    writeSpecFolder(workspaceRoot, '.opencode/specs/123-missing-metadata', { omitDescription: true });
    writeSpecFolder(workspaceRoot, '.opencode/specs/124-deprecated', { status: 'Deprecated' });

    expect(validateSpecFolderBinding(
      { path: '.opencode/specs/123-missing-metadata', source: 'flags', validated: true },
      { workspaceRoot },
    ).reason).toBe('missing_metadata');
    expect(validateSpecFolderBinding(
      { path: '.opencode/specs/124-deprecated', source: 'flags', validated: true },
      { workspaceRoot },
    ).reason).toBe('deprecated_or_superseded');
  });

  it('resolves a bare phase parent to last_active_child_id when available', () => {
    const workspaceRoot = createTempWorkspace();
    writeSpecFolder(workspaceRoot, '.opencode/specs/200-parent', {
      graphMetadata: {
        children_ids: ['200-parent/001-child'],
        derived: { last_active_child_id: '200-parent/001-child' },
      },
    });
    writeSpecFolder(workspaceRoot, '.opencode/specs/200-parent/001-child');

    const validation = validateSpecFolderBinding(
      { path: '.opencode/specs/200-parent', source: 'flags', validated: true },
      { workspaceRoot },
    );

    expect(validation.valid).toBe(true);
    expect(validation.resolvedPath).toBe('.opencode/specs/200-parent/001-child');
  });

  it('rejects a bare phase parent when no last_active_child_id is available', () => {
    const workspaceRoot = createTempWorkspace();
    writeSpecFolder(workspaceRoot, '.opencode/specs/201-parent');
    writeSpecFolder(workspaceRoot, '.opencode/specs/201-parent/001-child');

    const validation = validateSpecFolderBinding(
      { path: '.opencode/specs/201-parent', source: 'flags', validated: true },
      { workspaceRoot },
    );

    expect(validation.valid).toBe(false);
    expect(validation.reason).toBe('phase_parent_without_active_child');
  });
});

describe('Gate 3 classifier — JSON snapshot', () => {
  it('emits a structurally valid snapshot', () => {
    const snap = toJsonSnapshot();
    expect(snap.version).toBe(GATE_3_SCHEMA_VERSION);
    expect(snap.fileWrite.length).toBe(FILE_WRITE_TRIGGERS.length);
    expect(snap.memorySave.length).toBe(MEMORY_SAVE_TRIGGERS.length);
    expect(snap.resume.length).toBe(RESUME_TRIGGERS.length);
    expect(snap.readOnlyDisqualifier.length).toBe(READ_ONLY_DISQUALIFIERS.length);
    for (const entry of snap.fileWrite) {
      expect(entry.kind).toBe('token');
    }
  });
});
