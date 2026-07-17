import { describe, it, expect } from 'vitest';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const loader = require('../load-playbook-scenarios.cjs');

// Guards the index-table -> typed-pair derivation: an index-table skill whose
// hub has a leaf-manifest gets its packet-qualified body gold typed into
// (workflowMode, leafResourceId) pairs, while shared/preamble paths and any
// path outside the manifest are dropped, and the pair set is narrowed to the
// dominant surface mode so the typed-gold oracle stays inside its mode cap.
const byMode = new Map([
  ['code-webflow', new Set([
    'references/performance/cwv_remediation.md',
    'references/css/style_guide.md',
    'references/animation/quick_start.md',
  ])],
  ['code-opencode', new Set([
    'references/typescript/style_guide.md',
  ])],
]);

describe('deriveTypedGoldFromBodyGold', () => {
  it('types packet-qualified body gold into (mode, leaf) pairs', () => {
    const gold = loader.deriveTypedGoldFromBodyGold([
      'code-webflow/references/performance/cwv_remediation.md',
      'code-webflow/references/css/style_guide.md',
    ], byMode);
    expect(gold).not.toBeNull();
    expect(gold.workflowMode).toBe('code-webflow');
    expect(gold.pairs).toEqual([
      { workflowMode: 'code-webflow', leafResourceId: 'references/performance/cwv_remediation.md' },
      { workflowMode: 'code-webflow', leafResourceId: 'references/css/style_guide.md' },
    ]);
  });

  it('drops flat preamble/shared paths absent from the manifest', () => {
    const gold = loader.deriveTypedGoldFromBodyGold([
      'references/stack_detection.md',
      'references/universal/code_quality_standards.md',
      'shared/assets/patterns/README.md',
      'code-webflow/references/animation/quick_start.md',
    ], byMode);
    // Only the one manifest-resolvable packet-qualified leaf survives.
    expect(gold.pairs).toEqual([
      { workflowMode: 'code-webflow', leafResourceId: 'references/animation/quick_start.md' },
    ]);
  });

  it('narrows a mixed-mode set to the dominant (most-contributing) mode', () => {
    const gold = loader.deriveTypedGoldFromBodyGold([
      'code-webflow/references/performance/cwv_remediation.md',
      'code-webflow/references/css/style_guide.md',
      'code-opencode/references/typescript/style_guide.md',
    ], byMode);
    expect(gold.workflowMode).toBe('code-webflow');
    // The lone code-opencode pair is dropped so the gold declares one mode.
    expect(gold.pairs.every((p: { workflowMode: string }) => p.workflowMode === 'code-webflow')).toBe(true);
    expect(gold.pairs).toHaveLength(2);
  });

  it('returns null when nothing resolves to a manifest leaf', () => {
    expect(loader.deriveTypedGoldFromBodyGold([
      'references/stack_detection.md',
      'code-webflow/references/does_not_exist.md',
    ], byMode)).toBeNull();
    expect(loader.deriveTypedGoldFromBodyGold([], byMode)).toBeNull();
  });
});

describe('loadManifestModeLeaves', () => {
  it('returns null for a skill root with no leaf-manifest.json', () => {
    expect(loader.loadManifestModeLeaves('/nonexistent/skill/root')).toBeNull();
    expect(loader.loadManifestModeLeaves(null)).toBeNull();
  });
});
