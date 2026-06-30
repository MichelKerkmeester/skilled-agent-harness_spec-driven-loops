import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../');
const require = createRequire(import.meta.url);

const capabilityModulePath = path.join(
  WORKSPACE_ROOT,
  '.opencode/skills/deep-loop-workflows/deep-research/scripts/runtime-capabilities.cjs',
);
const capabilityModule = fs.existsSync(capabilityModulePath) ? require(capabilityModulePath) as {
  listRuntimeCapabilityIds: () => string[];
  loadRuntimeCapabilities: () => { matrix: { runtimes: Array<{ id: string; mirrorPath: string; commandWrapperPath?: string }> } };
} : null;

function readWorkspaceFile(relativePath: string): string {
  return fs.readFileSync(path.join(WORKSPACE_ROOT, relativePath), 'utf8');
}

(capabilityModule ? describe : describe.skip)('deep-research contract parity', () => {
  const primaryDocs = [
    '.opencode/skills/deep-loop-workflows/deep-research/SKILL.md',
    '.opencode/skills/deep-loop-workflows/deep-research/README.md',
    '.opencode/skills/deep-loop-workflows/deep-research/references/state/state_format.md',
    '.opencode/skills/deep-loop-workflows/deep-research/references/protocol/loop_protocol.md',
    '.opencode/skills/deep-loop-workflows/deep-research/references/guides/quick_reference.md',
    '.opencode/skills/deep-loop-workflows/deep-research/references/guides/capability_matrix.md',
    '.opencode/skills/deep-loop-workflows/deep-research/assets/deep_research_config.json',
  ];

  const runtimeMirrors = [
    '.opencode/agents/deep-research.md',
    '.claude/agents/deep-research.md',
    '.opencode/agents/deep-research.toml',
  ];

  const commandAssets = [
    '.opencode/commands/deep/assets/deep_research_auto.yaml',
    '.opencode/commands/deep/assets/deep_research_confirm.yaml',
  ];

  it('keeps primary docs aligned on canonical artifacts and the machine-readable capability source', () => {
    const content = primaryDocs.map((docPath) => readWorkspaceFile(docPath)).join('\n');

    expect(content, 'primary docs should mention the canonical state log').toContain('deep-research-state.jsonl');
    expect(content, 'primary docs should mention the findings registry').toContain('findings-registry.json');
    expect(content, 'primary docs should mention the canonical pause sentinel').toContain('.deep-research-pause');
    expect(content, 'primary docs should mention completed-continue').toContain('completed-continue');
    expect(content, 'primary docs should mention the runtime capability matrix').toMatch(/runtime[_ -]?capabilit/i);
  });

  it('keeps runtime mirrors aligned on reducer-owned boundaries', () => {
    for (const docPath of runtimeMirrors) {
      const content = readWorkspaceFile(docPath);

      expect(content, `${docPath} should read the canonical state log`).toContain('research/deep-research-state.jsonl');
      expect(content, `${docPath} should read the findings registry`).toContain('findings-registry.json');
      expect(content, `${docPath} should mention reducer ownership`).toContain('workflow reducer');
      expect(content, `${docPath} should mention local-owner packet resolution`).toContain('local-owner research packet');
      expect(content, `${docPath} should not mention root-level packet ownership`).not.toContain('resolved root-level `research/` packet');
      expect(content, `${docPath} should mention completed-continue`).toContain('completed-continue');
      expect(content, `${docPath} should not claim direct strategy writes in the completion report`).not.toContain(
        'research/deep-research-strategy.md (updated)',
      );
    }
  });

  it('keeps command assets aligned on reducer execution and lifecycle controls', () => {
    for (const docPath of commandAssets) {
      const content = readWorkspaceFile(docPath);

      expect(content, `${docPath} should write the findings registry`).toContain('findings-registry.json');
      expect(content, `${docPath} should mention completed-continue`).toContain('completed-continue');
      expect(content, `${docPath} should invoke the reducer script`).toContain(
        'node .opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs {spec_folder}',
      );
    }
  });

  it('never eagerly creates the archive root at init and archives lazily on restart (121/006)', () => {
    for (const docPath of commandAssets) {
      const content = readWorkspaceFile(docPath);
      // Regression: step_create_directories must NOT pre-create
      // {state_paths.archive_root}. Doing so left empty research_archive/ dirs
      // on every fresh run, since restart (the only legitimate archiver) is rare.
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

  it('uses the same canonical agent_file path in both auto and confirm YAMLs', () => {
    const canonicalAgentPath = '.opencode/agents/deep-research.md';

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

  it('exposes a machine-readable capability matrix for every supported runtime surface', () => {
    const runtimeIds = capabilityModule!.listRuntimeCapabilityIds();
    expect(runtimeIds).toEqual(['opencode', 'claude', 'opencode']);

    const matrix = capabilityModule!.loadRuntimeCapabilities().matrix;
    for (const runtime of matrix.runtimes) {
      expect(fs.existsSync(path.join(WORKSPACE_ROOT, runtime.mirrorPath)), `${runtime.id} mirror should exist`).toBe(true);
      if (runtime.commandWrapperPath) {
        expect(
          fs.existsSync(path.join(WORKSPACE_ROOT, runtime.commandWrapperPath)),
          `${runtime.id} command wrapper should exist`,
        ).toBe(true);
      }
    }
  });
});
