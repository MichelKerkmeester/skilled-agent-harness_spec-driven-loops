#!/usr/bin/env node
/**
 * Source-of-truth generator for the 026 wave-4 reorg rename-plan.json.
 * Paths are relative to the 026 spec root.
 * Run: node build-rename-plan.js > rename-plan.json
 */
'use strict';

const SPEC_ROOT = 'system-spec-kit/026-graph-and-context-optimization';
const ARCHIVE = 'z_archive/wave-4-2026-05-26-reorg';

// --- whole-folder moves (git mv of entire subtree) ---------------------------
// kind: move | rename | nest | sub-nest | archive
const moves = [
  // A. top-level rename
  { kind: 'rename', old: '000-release-cleanup', new: '000-release-and-program-cleanup', theme: 'release' },

  // B. 002-spec-kit-internals wrapper (new) <- 002,006,008,012
  { kind: 'nest', old: '002-resource-map-deep-loop-fix', new: '002-spec-kit-internals/001-resource-map-deep-loop-fix', theme: 'spec-kit-internals' },
  { kind: 'nest', old: '006-skill-advisor',             new: '002-spec-kit-internals/002-skill-advisor', theme: 'spec-kit-internals' },
  { kind: 'nest', old: '008-template-levels',           new: '002-spec-kit-internals/003-template-levels', theme: 'spec-kit-internals' },
  { kind: 'nest', old: '012-literal-spec-folder-names', new: '002-spec-kit-internals/004-literal-spec-folder-names', theme: 'spec-kit-internals', status: 'deferred' },

  // C. 003-memory-and-causal-runtime wrapper (new) <- 003,009,013
  { kind: 'nest', old: '003-continuity-memory-runtime',          new: '003-memory-and-causal-runtime/001-continuity-memory-runtime', theme: 'memory' },
  { kind: 'nest', old: '009-causal-graph-channel-routing',       new: '003-memory-and-causal-runtime/002-causal-graph-channel-routing', theme: 'memory' },
  { kind: 'nest', old: '013-embedder-testing-and-architecture',  new: '003-memory-and-causal-runtime/003-embedder-testing-and-architecture', theme: 'memory' },

  // D. 004-code-graph wrapper <- rename 005, then nest 011,014,016
  { kind: 'rename', old: '005-code-graph', new: '004-code-graph', theme: 'code-graph' },
  { kind: 'nest', old: '011-mcp-shared-dependency-startup-fix', new: '004-code-graph/001-mcp-shared-dependency-startup-fix', theme: 'code-graph' },
  { kind: 'nest', old: '014-deprecate-coco-index',             new: '004-code-graph/002-deprecate-coco-index', theme: 'code-graph' },
  { kind: 'nest', old: '016-code-graph-workspace-root-fix',    new: '004-code-graph/003-code-graph-workspace-root-fix', theme: 'code-graph' },

  // E. 006-operator-tooling wrapper (new) <- 007,010,015
  { kind: 'nest', old: '007-hook-parity',                        new: '006-operator-tooling/001-hook-parity', theme: 'tooling' },
  { kind: 'nest', old: '010-doctor-update-orchestrator',        new: '006-operator-tooling/002-doctor-update-orchestrator', theme: 'tooling' },
  { kind: 'nest', old: '015-install-scripts-doctor-realignment',new: '006-operator-tooling/003-install-scripts-doctor-realignment', theme: 'tooling', status: 'deferred' },

  // F. 004-external-project-adoption SPLIT (children out BEFORE shell archive)
  { kind: 'sub-nest', old: '004-external-project-adoption/001-clean-room-license-audit',                       new: '000-release-and-program-cleanup/007-clean-room-license-audit', theme: 'release', status: 'deferred' },
  { kind: 'sub-nest', old: '004-external-project-adoption/006-docs-and-catalogs-rollup',                       new: '000-release-and-program-cleanup/008-docs-and-catalogs-rollup', theme: 'release', status: 'deferred' },
  { kind: 'sub-nest', old: '004-external-project-adoption/002-code-graph-phase-runner-and-detect-changes',     new: '005-graph-impact-and-affordance/001-code-graph-phase-runner', theme: 'graph-impact', status: 'deferred' },
  { kind: 'sub-nest', old: '004-external-project-adoption/003-code-graph-edge-explanation-and-impact-uplift',  new: '005-graph-impact-and-affordance/002-edge-explanation-impact-uplift', theme: 'graph-impact', status: 'deferred' },
  { kind: 'sub-nest', old: '004-external-project-adoption/004-skill-advisor-affordance-evidence',             new: '005-graph-impact-and-affordance/003-skill-advisor-affordance-evidence', theme: 'graph-impact', status: 'deferred' },
  { kind: 'sub-nest', old: '004-external-project-adoption/005-memory-causal-trust-display',                    new: '005-graph-impact-and-affordance/004-memory-causal-trust-display', theme: 'graph-impact', status: 'deferred' },
  { kind: 'sub-nest', old: '004-external-project-adoption/007-fix-external-project-adoption-deep-review-findings', new: '005-graph-impact-and-affordance/005-deep-review-findings', theme: 'graph-impact', status: 'abandoned' },
  { kind: 'sub-nest', old: '004-external-project-adoption/008-deep-research-review',                           new: '005-graph-impact-and-affordance/006-deep-research-review', theme: 'graph-impact', status: 'abandoned' },
  { kind: 'archive', old: '004-external-project-adoption', new: ARCHIVE + '/004-external-project-adoption-dissolved', theme: 'graph-impact', note: 'dissolved wrapper shell (spec/metadata); children redistributed' },

  // G. 005-code-graph 22 children regroup (AFTER D rename; paths under 004-code-graph)
  //   010-runtime-and-scan
  { kind: 'sub-nest', old: '004-code-graph/001-code-graph-runtime-upgrades',        new: '004-code-graph/010-runtime-and-scan/001-code-graph-runtime-upgrades', theme: 'code-graph' },
  { kind: 'sub-nest', old: '004-code-graph/002-fix-stale-highlights-and-scan-scope',new: '004-code-graph/010-runtime-and-scan/002-fix-stale-highlights-and-scan-scope', theme: 'code-graph' },
  { kind: 'sub-nest', old: '004-code-graph/003-resolver-and-hook-improvements',     new: '004-code-graph/010-runtime-and-scan/003-resolver-and-hook-improvements', theme: 'code-graph' },
  { kind: 'sub-nest', old: '004-code-graph/008-end-user-scope-default-and-opt-in',  new: '004-code-graph/010-runtime-and-scan/004-end-user-scope-default-and-opt-in', theme: 'code-graph' },
  { kind: 'sub-nest', old: '004-code-graph/010-broader-excludes-and-granular-skills',new: '004-code-graph/010-runtime-and-scan/005-broader-excludes-and-granular-skills', theme: 'code-graph' },
  //   011-resilience-and-advisor
  { kind: 'sub-nest', old: '004-code-graph/004-research-and-fix-code-graph-advisor-refinement', new: '004-code-graph/011-resilience-and-advisor/001-code-graph-advisor-refinement', theme: 'code-graph' },
  { kind: 'sub-nest', old: '004-code-graph/006-code-graph-resilience-research',                 new: '004-code-graph/011-resilience-and-advisor/002-code-graph-resilience-research', theme: 'code-graph' },
  { kind: 'sub-nest', old: '004-code-graph/007-code-graph-backend-resilience-implementation',   new: '004-code-graph/011-resilience-and-advisor/003-code-graph-backend-resilience-implementation', theme: 'code-graph' },
  { kind: 'sub-nest', old: '004-code-graph/009-fix-iteration-quality-meta-research',            new: '004-code-graph/011-resilience-and-advisor/004-iteration-quality-meta-research', theme: 'code-graph' },
  { kind: 'sub-nest', old: '004-code-graph/012-doctor-apply-mode-implementation',               new: '004-code-graph/011-resilience-and-advisor/005-doctor-apply-mode-implementation', theme: 'code-graph' },
  //   012-extraction-and-isolation
  { kind: 'sub-nest', old: '004-code-graph/013-system-code-graph-extraction',     new: '004-code-graph/012-extraction-and-isolation/001-system-code-graph-extraction', theme: 'code-graph' },
  { kind: 'sub-nest', old: '004-code-graph/014-extraction-design-and-decision-record', new: '004-code-graph/012-extraction-and-isolation/002-extraction-design-and-decision-record', theme: 'code-graph' },
  { kind: 'sub-nest', old: '004-code-graph/015-standalone-mcp-topology-pivot',    new: '004-code-graph/012-extraction-and-isolation/003-standalone-mcp-topology-pivot', theme: 'code-graph' },
  { kind: 'sub-nest', old: '004-code-graph/018-three-way-isolation-finalize',     new: '004-code-graph/012-extraction-and-isolation/004-three-way-isolation-finalize', theme: 'code-graph' },
  //   013-docs-and-readmes
  { kind: 'sub-nest', old: '004-code-graph/005-doctor-diagnostic-command-phase-a',new: '004-code-graph/013-docs-and-readmes/001-doctor-diagnostic-command-phase-a', theme: 'code-graph' },
  { kind: 'sub-nest', old: '004-code-graph/016-system-code-graph-readmes-update', new: '004-code-graph/013-docs-and-readmes/002-system-code-graph-readmes-update', theme: 'code-graph' },
  { kind: 'sub-nest', old: '004-code-graph/017-code-folder-readmes-poc',          new: '004-code-graph/013-docs-and-readmes/003-code-folder-readmes-poc', theme: 'code-graph' },
  { kind: 'sub-nest', old: '004-code-graph/020-doc-drift-alignment',              new: '004-code-graph/013-docs-and-readmes/004-doc-drift-alignment', theme: 'code-graph' },
  { kind: 'sub-nest', old: '004-code-graph/021-cross-skill-doc-polish',           new: '004-code-graph/013-docs-and-readmes/005-cross-skill-doc-polish', theme: 'code-graph' },
  { kind: 'sub-nest', old: '004-code-graph/022-reference-template-alignment',     new: '004-code-graph/013-docs-and-readmes/006-reference-template-alignment', theme: 'code-graph' },
  //   keep two nested-parents as direct children, renumber to avoid 011-prefix clash (depth held at 5)
  { kind: 'sub-nest', old: '004-code-graph/011-real-world-usefulness-test-planning', new: '004-code-graph/014-real-world-usefulness-test-planning', theme: 'code-graph' },
  { kind: 'sub-nest', old: '004-code-graph/019-system-code-graph-uplift-phase-parent', new: '004-code-graph/015-system-code-graph-uplift-phase-parent', theme: 'code-graph' },
];

// Folders untouched (no move)
const untouched = [
  '001-research-and-baseline',
  '017-phase-reorg-and-renumber (this meta-packet; archived to z_archive at close)',
  'changelog/',
  'z_archive/',
];

// scratch/ -> archived at Stage 4/7 (working files), recorded separately
const scratchDisposition = { old: 'scratch', new: ARCHIVE + '/scratch-pre-reorg', kind: 'archive', note: 'leftover codex/reorg working files' };

// Build substitutions_ordered (longest-prefix-first) for Stage 3 live-ref rewrite.
// Each entry rewrites old repo-relative path prefix -> new, scoped to LIVE surfaces only.
const subs = moves
  .filter(m => m.kind !== 'archive') // archives handled separately (historical)
  .map(m => ({ from: `${SPEC_ROOT}/${m.old}`, to: `${SPEC_ROOT}/${m.new}` }))
  .sort((a, b) => b.from.length - a.from.length); // longest prefix first

const plan = {
  session: '026-wave-4-reorg-2026-05-26',
  purpose: 'Close 026: consolidate 17 top-level phases into 7 themed parents (000-006), clean renumber, defer-in-place unfinished work, rewrite root docs compliant. See spec.md of 017-phase-reorg-and-renumber.',
  spec_root: SPEC_ROOT,
  worktree: 'Public-026-reorg (branch 026-reorg)',
  target_top_level: [
    '000-release-and-program-cleanup',
    '001-research-and-baseline',
    '002-spec-kit-internals',
    '003-memory-and-causal-runtime',
    '004-code-graph',
    '005-graph-impact-and-affordance',
    '006-operator-tooling',
  ],
  untouched,
  scratchDisposition,
  moves,
  substitutions_ordered: [
    'Order: longest-prefix-first. Apply in sequence to LIVE surfaces only; do not reorder.',
    ...subs.map(s => `${s.from}  ->  ${s.to}`),
  ],
  skip_paths: [
    '**/z_archive/**',
    '**/research/iterations/**',
    '**/review/iterations/**',
    '**/research/deltas/**',
    '**/changelog/**',
    '**/*.jsonl',
    '**/raw.txt',
    'scratch/reorg-2026-04-25/**',
  ],
  skip_reason: 'Historical/frozen surfaces: past-tense provenance is preserved verbatim per rename_pattern.md.',
  preserve_exception: 'Child spec/plan/tasks/implementation-summary docs of moved phases are PRESERVED; only graph-metadata/description regenerate paths. Deferred/abandoned status set via derived.status only.',
};

process.stdout.write(JSON.stringify(plan, null, 2) + '\n');
