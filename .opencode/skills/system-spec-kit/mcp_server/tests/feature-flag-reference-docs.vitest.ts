import fs from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';
import * as api from '../api';

const MCP_SERVER_ROOT = path.join(__dirname, '..');
const SKILL_ROOT = path.join(MCP_SERVER_ROOT, '..');
const FEATURE_FLAG_DOCS = path.join(SKILL_ROOT, 'feature_catalog', 'feature-flag-reference');

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function resolveSourcePath(relativePath: string): string {
  if (relativePath.startsWith('shared/')) {
    return path.join(SKILL_ROOT, relativePath);
  }
  return path.join(MCP_SERVER_ROOT, relativePath);
}

const mappingChecks = [
  {
    doc: '../feature_catalog.md',
    env: 'SPECKIT_ABLATION',
    source: 'lib/eval/ablation-framework.ts',
  },
  {
    doc: '../feature_catalog.md',
    env: 'SPECKIT_RRF',
    source: 'shared/algorithms/rrf-fusion.ts',
  },
  {
    doc: '../feature_catalog.md',
    env: 'SPECKIT_LAZY_LOADING',
    source: 'shared/embeddings.ts',
  },
  {
    doc: '../feature_catalog.md',
    env: 'SPECKIT_EAGER_WARMUP',
    source: 'shared/embeddings.ts',
  },
  {
    doc: '../feature_catalog.md',
    env: 'MEMORY_DB_PATH',
    source: 'lib/search/vector-index-store.ts',
  },
  {
    doc: '../feature_catalog.md',
    env: 'EMBEDDINGS_PROVIDER',
    source: 'shared/embeddings/factory.ts',
  },
  {
    doc: '../feature_catalog.md',
    env: 'EMBEDDING_DIM',
    source: 'lib/search/vector-index-store.ts',
  },
];

const roadmapDefaultDocs = [
  'memory-roadmap-capability-flags.md',
  '../feature_catalog.md',
] as const;

const roadmapFlagDefaults = [
  ['SPECKIT_MEMORY_LINEAGE_STATE', 'true'],
  ['SPECKIT_MEMORY_GRAPH_UNIFIED', 'true'],
  ['SPECKIT_MEMORY_ADAPTIVE_RANKING', 'false'],
] as const;

const roadmapDocsWithoutRemovedFlags = [
  '1-search-pipeline-features-speckit.md',
  '6-debug-and-telemetry.md',
  'memory-roadmap-capability-flags.md',
] as const;

function expectRoadmapFlagRow(
  docContent: string,
  env: string,
  defaultValue: string,
): void {
  const rowPattern = new RegExp(
    `\\|\\s+\`${escapeRegExp(env)}\`\\s+\\|\\s+\`${escapeRegExp(defaultValue)}\`\\s+\\|`,
  );

  expect(docContent).toMatch(rowPattern);
}

describe('Feature flag reference catalog mappings', () => {
  for (const check of mappingChecks) {
    it(`${check.env} maps to ${check.source} and the source reads the symbol`, () => {
      const docPath = path.join(FEATURE_FLAG_DOCS, check.doc);
      const docContent = fs.readFileSync(docPath, 'utf8');
      const rowPattern = new RegExp(
        `\\|\\s+\`${escapeRegExp(check.env)}\`\\s+\\|[^\\n]*\\|[^\\n]*\`${escapeRegExp(check.source)}\`[^\\n]*\\|`,
      );

      expect(docContent).toMatch(rowPattern);

      const sourcePath = resolveSourcePath(check.source);
      expect(fs.existsSync(sourcePath)).toBe(true);

      const sourceContent = fs.readFileSync(sourcePath, 'utf8');
      expect(sourceContent).toContain(check.env);
    });
  }
});

describe('Memory roadmap flag documentation', () => {
  for (const doc of roadmapDefaultDocs) {
    it(`${doc} reflects the shipped memory roadmap behavior with adaptive ranking default-off`, () => {
      const docPath = path.join(FEATURE_FLAG_DOCS, doc);
      const docContent = fs.readFileSync(docPath, 'utf8');

      expectRoadmapFlagRow(docContent, 'SPECKIT_MEMORY_ROADMAP_PHASE', 'scope-governance');
      expect(docContent).toMatch(/(?:unknown|unsupported) values fall back to `scope-governance`/i);

      for (const [env, defaultValue] of roadmapFlagDefaults) {
        expectRoadmapFlagRow(docContent, env, defaultValue);
      }
    });
  }

  for (const doc of roadmapDocsWithoutRemovedFlags) {
    it(`${doc} no longer references removed Hydra or governance compatibility flags`, () => {
      const docPath = path.join(FEATURE_FLAG_DOCS, doc);
      const docContent = fs.readFileSync(docPath, 'utf8');

      expect(docContent).not.toContain('SPECKIT_HYDRA');
      expect(docContent).not.toContain('SPECKIT_MEMORY_SCOPE_ENFORCEMENT');
      expect(docContent).not.toContain('SPECKIT_MEMORY_GOVERNANCE_GUARDRAILS');
    });
  }

  // drift: verified against shipped behavior during Unit H
  it('manual playbook 125 matches the canonical roadmap contract', () => {
    const playbookPath = path.join(SKILL_ROOT, 'manual_testing_playbook', 'manual_testing_playbook.md');
    const featureFilePath = path.join(
      SKILL_ROOT,
      'manual_testing_playbook',
      'feature-flag-reference',
      'memory-roadmap-capability-flags.md',
    );
    const playbookContent = fs.readFileSync(playbookPath, 'utf8');
    const featureFileContent = fs.readFileSync(featureFilePath, 'utf8');

    expect(playbookContent).toContain('### 125 | Memory roadmap flags');
    expect(playbookContent).toContain('adaptive ranking default-off');
    expect(playbookContent).toContain('scope-governance` phase with graph-unified metadata on and adaptive ranking off');
    expect(playbookContent).toContain('SPECKIT_MEMORY_ADAPTIVE_RANKING=false');
    expect(playbookContent).not.toContain('SPECKIT_HYDRA');

    expect(featureFileContent).toContain('scope-governance` phase with graph-unified metadata on and adaptive ranking off');
    expect(featureFileContent).toContain('SPECKIT_GRAPH_UNIFIED=false');
    expect(featureFileContent).toContain('SPECKIT_MEMORY_ROADMAP_PHASE=graph');
    expect(featureFileContent).toContain('graph` phase with graph-unified metadata off');
    expect(featureFileContent).toContain('SPECKIT_MEMORY_ADAPTIVE_RANKING=true');
    expect(featureFileContent).toContain('adaptive ranking on');
    expect(featureFileContent).not.toContain('SPECKIT_HYDRA');
  });
});

describe('Public API barrel exports', () => {
  it('exposes roadmap metadata and read-only Hybrid RAG Fusion surfaces', () => {
    expect(typeof api.getMemoryRoadmapPhase).toBe('function');
    expect(typeof api.getMemoryRoadmapCapabilityFlags).toBe('function');
    expect(typeof api.getMemoryRoadmapDefaults).toBe('function');
  });
});
