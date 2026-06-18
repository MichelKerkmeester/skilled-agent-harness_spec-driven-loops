import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../');
const require = createRequire(import.meta.url);

// Import deep-review runtime-capabilities resolver for executable coverage
const reviewCapabilityModulePath = path.join(
  WORKSPACE_ROOT,
  '.opencode/skills/deep-loop-workflows/deep-review/scripts/runtime-capabilities.cjs',
);
const reviewCapabilityModule = fs.existsSync(reviewCapabilityModulePath) ? require(reviewCapabilityModulePath) as {
  listRuntimeCapabilityIds: () => string[];
  loadRuntimeCapabilities: () => { matrix: { runtimes: Array<{ id: string; mirrorPath: string }> } };
  resolveRuntimeCapability: (id: string) => { capabilityPath: string; runtime: { id: string; mirrorPath: string } };
} : null;

function readWorkspaceFile(relativePath: string): string {
  return fs.readFileSync(path.join(WORKSPACE_ROOT, relativePath), 'utf8');
}

(reviewCapabilityModule ? describe : describe.skip)('deep-review contract parity', () => {
  const primaryDocs = [
    '.opencode/skills/deep-loop-workflows/deep-review/SKILL.md',
    '.opencode/skills/deep-loop-workflows/deep-review/README.md',
    '.opencode/skills/deep-loop-workflows/deep-review/references/state/state_format.md',
    '.opencode/skills/deep-loop-workflows/deep-review/references/protocol/loop_protocol.md',
    '.opencode/skills/deep-loop-workflows/deep-review/references/protocol/quick_reference.md',
    '.opencode/skills/deep-loop-workflows/deep-review/assets/review_mode_contract.yaml',
  ];

  const runtimeMirrors = [
    '.opencode/agents/deep-review.md',
    '.claude/agents/deep-review.md',
    '.codex/agents/deep-review.toml',
  ];

  const commandAssets = [
    '.opencode/commands/deep/assets/deep_review_auto.yaml',
    '.opencode/commands/deep/assets/deep_review_confirm.yaml',
  ];

  it('keeps primary deep-review docs aligned on canonical artifacts and lifecycle terms', () => {
    const content = primaryDocs.map((docPath) => readWorkspaceFile(docPath)).join('\n');

    expect(content, 'primary docs should mention the canonical config file').toContain('deep-review-config.json');
    expect(content, 'primary docs should mention the canonical state log').toContain('deep-review-state.jsonl');
    expect(content, 'primary docs should mention the findings registry').toContain('deep-review-findings-registry.json');
    expect(content, 'primary docs should mention the pause sentinel').toContain('.deep-review-pause');
    expect(content, 'primary docs should mention completed-continue').toContain('completed-continue');
    expect(content, 'primary docs should mention release readiness').toContain('releaseReadinessState');
  });

  it('keeps all runtime mirrors aligned on lifecycle and reducer boundaries', () => {
    for (const docPath of runtimeMirrors) {
      const content = readWorkspaceFile(docPath);

      expect(content, `${docPath} should read the canonical state log`).toContain('review/deep-review-state.jsonl');
      expect(content, `${docPath} should mention the reducer-owned registry`).toContain('review/deep-review-findings-registry.json');
      expect(content, `${docPath} should mention local-owner packet resolution`).toContain('local-owner review packet');
      expect(content, `${docPath} should not mention root-level packet ownership`).not.toContain('resolved root-level `review/` packet');
      expect(content, `${docPath} should mention completed-continue`).toContain('completed-continue');
      expect(content, `${docPath} should mention lineageMode`).toContain('lineageMode');
      expect(content, `${docPath} should mention releaseReadinessState`).toContain('releaseReadinessState');
      expect(content, `${docPath} should not reference review/deep-research config paths anymore`).not.toContain(
        'review/deep-research-config.json',
      );
      expect(content, `${docPath} should not reference review/deep-research state paths anymore`).not.toContain(
        'review/deep-research-state.jsonl',
      );
      expect(content, `${docPath} should not reference the old review pause sentinel anymore`).not.toContain(
        'review/.deep-research-pause',
      );
    }
  });

  it('keeps command assets aligned on lifecycle controls and dual-read single-write migration', () => {
    for (const docPath of commandAssets) {
      const content = readWorkspaceFile(docPath);

      expect(content, `${docPath} should expose lifecycle mode input`).toContain('lineage_mode');
      expect(content, `${docPath} should write the canonical config file`).toContain('review/deep-review-config.json');
      expect(content, `${docPath} should write the canonical state log`).toContain('review/deep-review-state.jsonl');
      expect(content, `${docPath} should write the findings registry`).toContain('review/deep-review-findings-registry.json');
      expect(content, `${docPath} should mention completed-continue`).toContain('completed-continue');
      expect(content, `${docPath} should carry release readiness state`).toContain('releaseReadinessState');
      expect(content, `${docPath} should keep legacy deep-research reads in scratch only`).toContain(
        'scratch/deep-research-config.json',
      );
      expect(content, `${docPath} should keep legacy deep-research reads in scratch only`).toContain(
        'scratch/deep-research-state.jsonl',
      );
      expect(content, `${docPath} should keep legacy pause migration in scratch only`).toContain(
        'scratch/.deep-research-pause',
      );
      expect(content, `${docPath} should not write review/deep-research config paths anymore`).not.toContain(
        'review/deep-research-config.json',
      );
      expect(content, `${docPath} should not write review/deep-research state paths anymore`).not.toContain(
        'review/deep-research-state.jsonl',
      );
      expect(content, `${docPath} should not write the old review pause sentinel anymore`).not.toContain(
        'review/.deep-research-pause',
      );
    }

    // Retraction (042 closing audit, F010/F011/F012): the runtime
    // only persists lineage events for `resume` and `restart`. `fork` and
    // `completed-continue` are deferred with an explicit note. The parity
    // test mirrors the shipped contract by asserting the live branches exist
    // and the retraction note is present, rather than pinning the legacy
    // four-option list.
    const autoContent = readWorkspaceFile(commandAssets[0]);
    expect(autoContent).toContain('on_restart:');
    expect(autoContent).toContain('note_deferred_branches:');
    expect(autoContent).not.toContain('on_fork:');

    const confirmContent = readWorkspaceFile(commandAssets[1]);
    expect(confirmContent).toContain('options: [resume, restart, cancel]');
    expect(confirmContent).toContain('fork and completed-continue branches are deferred');
  });

  it('never eagerly creates the archive root at init and archives lazily on restart (121/006)', () => {
    for (const docPath of commandAssets) {
      const content = readWorkspaceFile(docPath);
      // Regression: step_create_directories must NOT pre-create
      // {state_paths.archive_root}. Review init has never done so; this locks the
      // invariant alongside deep-research (which previously did) and asserts the
      // lazy, guarded restart move shared by both loops.
      expect(content, `${docPath} init mkdir must not pre-create the archive root`).not.toMatch(
        /step_create_directories:[\s\S]*?command: "mkdir -p [^"]*\{state_paths\.archive_root\}/,
      );
      // The archive root is created lazily, guarded on an existing packet,
      // immediately before the restart move.
      expect(content, `${docPath} restart must archive lazily + guarded`).toContain(
        'if [ -d {state_paths.packet_dir} ]; then mkdir -p {state_paths.archive_root} && mv {state_paths.packet_dir} {state_paths.archive_root}/{timestamp_slug}; fi',
      );
    }
  });

  it('keeps the generated review contract aligned on artifact_dir semantics', () => {
    const content = readWorkspaceFile('.opencode/skills/deep-loop-workflows/deep-review/assets/review_mode_contract.yaml');

    expect(content).toContain('{artifact_dir}/deep-review-config.json');
    expect(content).toContain('{artifact_dir}/deep-review-state.jsonl');
    expect(content).toContain('{artifact_dir}/deep-review-findings-registry.json');
    expect(content).toContain('{artifact_dir}/deep-review-dashboard.md');
    expect(content).toContain('{artifact_dir}/review-report.md');
    expect(content).toContain('{artifact_dir}/.deep-review-pause');
    expect(content).not.toContain('{spec_folder}/review/deep-review-config.json');
  });

  it('uses the same canonical agent_file path in both auto and confirm YAMLs', () => {
    const canonicalAgentPath = '.opencode/agents/deep-review.md';

    for (const docPath of commandAssets) {
      const content = readWorkspaceFile(docPath);
      expect(content, `${docPath} should reference the canonical agent path`).toContain(
        `agent_file: "${canonicalAgentPath}"`,
      );
      // Must NOT reference .claude/agents/ as the agent_file (that is a mirror, not canonical)
      expect(content, `${docPath} should not use .claude/agents/ as agent_file`).not.toMatch(
        /agent_file:\s*["']?\.claude\/agents\//,
      );
    }

    // Both YAMLs must agree on the same path
    const autoContent = readWorkspaceFile(commandAssets[0]);
    const confirmContent = readWorkspaceFile(commandAssets[1]);
    const autoMatch = autoContent.match(/agent_file:\s*"([^"]+)"/);
    const confirmMatch = confirmContent.match(/agent_file:\s*"([^"]+)"/);
    expect(autoMatch, 'auto YAML should have agent_file').not.toBeNull();
    expect(confirmMatch, 'confirm YAML should have agent_file').not.toBeNull();
    expect(autoMatch![1]).toBe(confirmMatch![1]);
  });

  it('command doc dimension list matches the supported dimension taxonomy', () => {
    const canonicalDimensions = ['correctness', 'security', 'traceability', 'maintainability'];

    for (const docPath of commandAssets) {
      const content = readWorkspaceFile(docPath);
      // The user_inputs section should list all 4 canonical dimensions
      for (const dim of canonicalDimensions) {
        expect(content, `${docPath} should mention dimension "${dim}"`).toContain(dim);
      }
      // The dimensionCoverage init in findings registry should track all 4
      for (const dim of canonicalDimensions) {
        expect(
          content,
          `${docPath} findings registry should track dimension "${dim}"`,
        ).toContain(`"${dim}":false`);
      }
    }
  });

  // Add executable coverage for deep-review runtime-capabilities.cjs
  it('exposes a machine-readable capability matrix for every supported deep-review runtime', () => {
    const runtimeIds = reviewCapabilityModule!.listRuntimeCapabilityIds();
    expect(runtimeIds).toEqual(['opencode', 'claude', 'codex']);

    const matrix = reviewCapabilityModule!.loadRuntimeCapabilities().matrix;
    for (const runtime of matrix.runtimes) {
      expect(
        fs.existsSync(path.join(WORKSPACE_ROOT, runtime.mirrorPath)),
        `${runtime.id} mirror should exist at ${runtime.mirrorPath}`,
      ).toBe(true);
    }
  });

  it('resolves individual deep-review runtime capabilities by ID', () => {
    const { runtime } = reviewCapabilityModule!.resolveRuntimeCapability('claude');
    expect(runtime.id).toBe('claude');
    expect(runtime.mirrorPath).toContain('.claude/agents/deep-review');
  });

  it('throws for unknown deep-review runtime IDs', () => {
    expect(() => reviewCapabilityModule!.resolveRuntimeCapability('nonexistent')).toThrow(/Unknown deep-review runtime/);
  });
});
