// ───────────────────────────────────────────────────────────────────
// MODULE: Resource Map Extractor tests
// ───────────────────────────────────────────────────────────────────

import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);

const fixtureRepos: string[] = [];

// A consuming repository with its own git store, nested in a workspace that holds the
// runtime marker, so a resolver that looks for the marker walks past the repository.
function makeFixtureRepo(): string {
  const workspaceRoot = mkdtempSync(join(tmpdir(), 'resource-map-workspace-'));
  fixtureRepos.push(workspaceRoot);
  mkdirSync(join(workspaceRoot, '.skilled', 'skills', 'system-spec-kit'), { recursive: true });
  writeFileSync(join(workspaceRoot, '.skilled', 'skills', 'system-spec-kit', 'SKILL.md'), '# Fixture runtime marker\n', 'utf8');
  const repoRoot = join(workspaceRoot, 'consumer');
  mkdirSync(join(repoRoot, '.git'), { recursive: true });
  return repoRoot;
}

afterEach(() => {
  while (fixtureRepos.length > 0) {
    const repoRoot = fixtureRepos.pop();
    if (repoRoot) {
      rmSync(repoRoot, { recursive: true, force: true });
    }
  }
});

type Shape = 'review' | 'research';
type EmitArgs = {
  shape: Shape;
  deltas: unknown[];
  packet?: Record<string, unknown>;
  scope?: string;
  createdAt?: string;
};

const { emitResourceMap } = require('../cli/resource-map/extract-from-evidence.cjs') as {
  emitResourceMap(args: EmitArgs): string;
};

function findLine(markdown: string, prefix: string): string {
  const line = markdown.split('\n').find((entry) => entry.startsWith(prefix));
  if (!line) {
    throw new Error(`Expected to find line starting with "${prefix}"`);
  }
  return line;
}

function headings(markdown: string): string[] {
  return markdown.split('\n').filter((line) => /^## \d+\./.test(line));
}

describe('resource-map extractor', () => {
  it('renders a review-shaped resource map with all ten categories and severity counts', () => {
    const markdown = emitResourceMap({
      shape: 'review',
      createdAt: '2026-04-24T12:00:00.000Z',
      scope: 'review convergence output for packet 003',
      packet: {
        title: 'Resource Map Deep Loop Integration',
        specFolder: '.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-resource-map-template/003-resource-map-deep-loop-integration',
      },
      deltas: [
        [
          { iteration: 1, event: 'new_finding', finding_id: 'F-README', severity: 'P2', file: 'docs/resource-map/README.md' },
          { iteration: 1, event: 'new_finding', finding_id: 'F-DOC', severity: 'P1', file: 'docs/resource-map-contract.unknownext' },
          { iteration: 1, event: 'new_finding', finding_id: 'F-CMD', severity: 'P1', file: '.skilled/commands/speckit/deep-review.md' },
          { iteration: 1, event: 'new_finding', finding_id: 'F-AGENT', severity: 'P2', file: '.skilled/agents/deep-review.toml' },
          { iteration: 1, event: 'new_finding', finding_id: 'F-SKILL', severity: 'P0', file: '.skilled/skills/system-deep-loop/deep-review/SKILL.md' },
          { iteration: 1, event: 'new_finding', finding_id: 'F-SPEC', severity: 'P1', file: '.opencode/specs/system-spec-kit/demo/spec.md' },
          { iteration: 1, event: 'new_finding', finding_id: 'F-SCRIPT', severity: 'P2', file: 'tools/resource-map-emit.cjs' },
          { iteration: 1, event: 'new_finding', finding_id: 'F-TEST', severity: 'P2', file: 'tests/resource-map-extractor.vitest.ts' },
          { iteration: 1, event: 'new_finding', finding_id: 'F-CONFIG', severity: 'P1', file: 'config/resource-map.yaml' },
          { iteration: 1, event: 'new_finding', finding_id: 'F-META', severity: 'P2', file: 'AGENTS.md' },
          { iteration: 2, event: 'adjudication', finding_id: 'F-SKILL', severity_after: 'P1', file: '.skilled/skills/system-deep-loop/deep-review/SKILL.md' },
          { iteration: 2, event: 'adjudication', finding_id: 'F-CLEAN', severity_after: 'NEGATIVE', file: '.opencode/specs/system-spec-kit/demo/checklist.md' },
        ],
      ],
    });

    expect(findLine(markdown, '- **By category**:')).toBe(
      '- **By category**: READMEs=1, Documents=1, Commands=1, Agents=1, Skills=1, Specs=2, Scripts=1, Tests=1, Config=1, Meta=1',
    );
    // Missing-on-disk is a live count against the real repo tree (categorization
    // above is not), so it tracks actual file presence rather than a frozen
    // snapshot; re-verify against disk if a referenced fixture path is renamed.
    expect(findLine(markdown, '- **Missing on disk**:')).toBe('- **Missing on disk**: 9');
    expect(headings(markdown)).toMatchInlineSnapshot(`
      [
        "## 1. READMEs",
        "## 2. Documents",
        "## 3. Commands",
        "## 4. Agents",
        "## 5. Skills",
        "## 6. Specs",
        "## 7. Scripts",
        "## 8. Tests",
        "## 9. Config",
        "## 10. Meta",
      ]
    `);
    expect(markdown).toContain(
      '| docs/resource-map/README.md | Analyzed | MISSING | Findings P0=0 P1=0 P2=1; Iterations=1 |',
    );
    expect(markdown).toContain(
      '| .skilled/skills/system-deep-loop/deep-review/SKILL.md | Analyzed | OK | Findings P0=0 P1=1 P2=0; Iterations=2 |',
    );
    expect(markdown).toContain(
      '| .opencode/specs/system-spec-kit/demo/checklist.md | Validated | MISSING | Findings P0=0 P1=0 P2=0; Iterations=1 |',
    );
  });

  it('renders a research-shaped resource map with per-iteration citation counts', () => {
    const markdown = emitResourceMap({
      shape: 'research',
      createdAt: '2026-04-24T12:30:00.000Z',
      scope: 'research convergence output for packet 003',
      packet: {
        title: 'Resource Map Deep Loop Integration',
      },
      deltas: [
        [
          {
            iteration: 1,
            type: 'finding',
            source_paths: [
              '.skilled/commands/agent-router.md',
              '.skilled/skills/system-deep-loop/deep-research/references/convergence.md',
            ],
            citations: [
              { path: '.skilled/skills/system-deep-loop/deep-research/SKILL.md' },
              { path: '.opencode/specs/system-spec-kit/demo/research.md' },
            ],
          },
          {
            iteration: 2,
            type: 'finding',
            source_paths: ['.skilled/commands/agent-router.md'],
            citations: [
              { path: '.skilled/skills/system-deep-loop/deep-research/SKILL.md' },
              { path: '.skilled/skills/system-spec-kit/runtime/cli/resource-map/extract-from-evidence.cjs' },
            ],
          },
          {
            iteration: 3,
            type: 'finding',
            source_paths: ['.skilled/commands/agent-router.md'],
            citations: [
              { path: '.skilled/skills/system-deep-loop/deep-research/SKILL.md' },
              { path: 'notes/research-support.txt' },
            ],
          },
        ],
      ],
    });

    expect(findLine(markdown, '- **By category**:')).toBe(
      '- **By category**: READMEs=0, Documents=1, Commands=1, Agents=0, Skills=3, Specs=1, Scripts=0, Tests=0, Config=0, Meta=0',
    );
    expect(findLine(markdown, '- **Missing on disk**:')).toBe('- **Missing on disk**: 3');
    expect(headings(markdown)).toMatchInlineSnapshot(`
      [
        "## 2. Documents",
        "## 3. Commands",
        "## 5. Skills",
        "## 6. Specs",
      ]
    `);
    expect(markdown).toContain(
      '| .skilled/commands/agent-router.md | Cited | OK | Citations=3; Iterations=3 |',
    );
    expect(markdown).toContain(
      '| .skilled/skills/system-deep-loop/deep-research/SKILL.md | Cited | OK | Citations=3; Iterations=3 |',
    );
    expect(markdown).toContain(
      '| .opencode/specs/system-spec-kit/demo/research.md | Cited | MISSING | Citations=1; Iterations=1 |',
    );
  });

  it('strips `:line` and `:line-range` suffixes from review evidence before classification and status checks', () => {
    const markdown = emitResourceMap({
      shape: 'review',
      createdAt: '2026-04-24T13:00:00.000Z',
      scope: 'F001 regression — canonical file:line shape per prompt-pack contract',
      packet: {
        title: 'Line-anchor normalization regression',
      },
      deltas: [
        [
          {
            iteration: 1,
            event: 'new_finding',
            finding_id: 'F-LINE',
            severity: 'P1',
            file: '.skilled/skills/system-deep-loop/deep-review/SKILL.md:250',
          },
          {
            iteration: 1,
            event: 'new_finding',
            finding_id: 'F-RANGE',
            severity: 'P2',
            file: '.skilled/commands/agent-router.md:10-20',
          },
        ],
      ],
    });

    // Paths with :line suffixes resolve to real files on disk → status OK, not MISSING.
    expect(markdown).toContain('| .skilled/skills/system-deep-loop/deep-review/SKILL.md | Analyzed | OK |');
    expect(markdown).toContain('| .skilled/commands/agent-router.md | Analyzed | OK |');
    // The suffix must be stripped — no leaked `:250` or `:10-20` anywhere.
    expect(markdown).not.toContain(':250');
    expect(markdown).not.toContain(':10-20');
    // Categorization still works (SKILL.md → Skills, deep-review.md → Commands).
    expect(findLine(markdown, '- **By category**:')).toContain('Commands=1');
    expect(findLine(markdown, '- **By category**:')).toContain('Skills=1');
    expect(findLine(markdown, '- **Missing on disk**:')).toBe('- **Missing on disk**: 0');
  });

  it('resolves citations against the repository that holds the packet, not the runtime repository', () => {
    const repoRoot = makeFixtureRepo();
    const citedDir = join(repoRoot, 'cited');
    mkdirSync(join(citedDir, 'folder'), { recursive: true });
    writeFileSync(join(citedDir, 'existing.md'), '# Existing\n', 'utf8');
    writeFileSync(join(citedDir, 'lines.md'), '# Lines\n', 'utf8');
    writeFileSync(join(citedDir, 'anchored.md'), '# Anchored\n\n## Section\n', 'utf8');
    const packetDir = join(repoRoot, 'specs', '999-fixture-packet');
    mkdirSync(packetDir, { recursive: true });

    const markdown = emitResourceMap({
      shape: 'research',
      createdAt: '2026-04-24T14:00:00.000Z',
      scope: 'fixture packet in a repository other than the runtime repository',
      packet: {
        title: 'Fixture packet',
        specFolder: packetDir,
      },
      deltas: [[{
        iteration: 1,
        type: 'finding',
        sources: [
          'cited/existing.md',
          'cited/lines.md:10-20',
          'cited/anchored.md#section',
          'cited/folder',
          'cited/absent.md',
        ],
      }]],
    });

    expect(findLine(markdown, '- **Missing on disk**:')).toBe('- **Missing on disk**: 1');
    expect(markdown).toContain('| cited/existing.md | Cited | OK |');
    expect(markdown).toContain('| cited/lines.md | Cited | OK |');
    expect(markdown).toContain('| cited/anchored.md | Cited | OK |');
    expect(markdown).toContain('| cited/folder | Cited | OK |');
    expect(markdown).toContain('| cited/absent.md | Cited | MISSING |');
    expect(markdown).not.toContain(':10-20');
    expect(markdown).not.toContain('#section');
  });
});
