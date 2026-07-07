# Deep Review Report: system-skill-advisor migration structural audit

## Verdict: CONDITIONAL

The migration is structurally incomplete. No P0 blocker was found, and no orphaned empty shell folders remain, but active P1 metadata/path defects remain in the requested five categories: stale children_ids, stale pre-move cross references, packet_id/spec_folder mismatches, and numbered-child gaps.

## Checked Scope
- Full `.opencode/specs/system-skill-advisor` track.
- Listed touched `.opencode/specs/system-speckit` parents and their numbered children where relevant.
- `.opencode/specs/system-speckit/028-memory-search-intelligence` root plus `002-spec-data-quality`.
- Last five commits via `git diff --name-status HEAD~5..HEAD` for rename/pre-move provenance.

## Findings

### P1-001 — Stale pre-move children_ids in skill-advisor CLI parent
- File: `.opencode/specs/system-skill-advisor/008-skill-advisor-cli/graph-metadata.json:8`
- Issue: lines 8-11 still point at old `system-spec-kit/027-xce-research-based-refinement/.../003-skill-advisor-cli/...` children that do not exist on disk.
- Exact fix needed: remove lines 8-11 or replace them with the existing `system-skill-advisor/008-skill-advisor-cli/{000,001,002,003}-...` children already present at lines 12-15.

### P1-002 — Migrated research iteration metadata still declares old system-spec-kit paths
- File: `.opencode/specs/system-skill-advisor/001-skill-graph/001-skill-graph-metadata-routing-boosts/research/iterations/graph-metadata.json:3`
- Issue: `packet_id` and `spec_folder` point at `system-spec-kit/026-graph-and-context-optimization/research/011-skill-advisor-graph-pt-01/iterations`, not the actual folder.
- Exact fix needed: set both fields to `system-skill-advisor/001-skill-graph/001-skill-graph-metadata-routing-boosts/research/iterations`.
- File: `.opencode/specs/system-skill-advisor/003-skill-advisor-routing-engine/002-advisor-phrase-booster-tuning/research/iterations/graph-metadata.json:3`
- Issue: `packet_id` and `spec_folder` point at `system-spec-kit/026-graph-and-context-optimization/research/013-advisor-phrase-booster-tailoring-pt-01/iterations`, not the actual folder.
- Exact fix needed: set both fields to `system-skill-advisor/003-skill-advisor-routing-engine/002-advisor-phrase-booster-tuning/research/iterations`.

### P1-003 — Touched system-speckit parents retain non-existent system-spec-kit children_ids
- Files: `.opencode/specs/system-speckit/026-graph-and-context-optimization/002-spec-kit-internals/001-resource-map-deep-loop-fix/graph-metadata.json:6`, `.opencode/specs/system-speckit/026-graph-and-context-optimization/002-spec-kit-internals/002-template-levels/graph-metadata.json:6`, `.opencode/specs/system-speckit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/001-spec-memory-cli/graph-metadata.json:6`, `.opencode/specs/system-speckit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/graph-metadata.json:6`, and `.opencode/specs/system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/graph-metadata.json:7`.
- Issue: active `children_ids` entries point under `system-spec-kit/...`; `.opencode/specs/system-spec-kit` does not exist.
- Exact fix needed: change those child paths to the matching `system-speckit/...` folders, or remove stale duplicates where corrected `system-speckit/...` children are already present.

### P1-004 — One touched child metadata path uses the wrong track spelling
- File: `.opencode/specs/system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/002b-cocoindex-reranker-doc-prose/graph-metadata.json:3`
- Issue: `packet_id` and `spec_folder` use `system-spec-kit/...`, but the actual folder is under `system-speckit/...`.
- Exact fix needed: set both fields to `system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/002b-cocoindex-reranker-doc-prose`.

### P1-005 — Scoped docs still reference pre-renumber 028 paths
- Files: `.opencode/specs/system-skill-advisor/000-migration-from-system-speckit/spec.md:24`; `.opencode/specs/system-speckit/028-memory-search-intelligence/001-speckit-memory/031-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/013-absorb-028-004-review-remediation-closeout/plan.md:115`; `.opencode/specs/system-speckit/028-memory-search-intelligence/002-spec-data-quality/045-drift-audit-remediation/tasks.md:102-107,145-150`; `.opencode/specs/system-speckit/028-memory-search-intelligence/changelog/changelog-006-speckit-surface-alignment.md:17`; `.opencode/specs/system-speckit/028-memory-search-intelligence/changelog/changelog-028-root.md:108,138`; `.opencode/specs/system-speckit/028-memory-search-intelligence/research/iterations/iteration-006.md:12`; `.opencode/specs/system-speckit/028-memory-search-intelligence/research/research.md:104`.
- Issue: references still point at pre-move paths including `004-review-remediation`, `005-dark-flag-graduation`, `006-speckit-surface-alignment`, and `003-spec-data-quality/006-generated-metadata-build/040-flag-graduation-benchmark`.
- Exact fix needed: update each reference to the current path from the HEAD~5..HEAD rename map; e.g. old `004-review-remediation` -> current `003-review-remediation`, old `005-dark-flag-graduation` -> current `004-dark-flag-graduation`, and old `006-speckit-surface-alignment` -> current `005-speckit-surface-alignment`.

### P1-006 — Numbering gaps remain in touched parents
- File: `.opencode/specs/system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc:1`
- Issue: direct children skip `004` among `001-014`.
- Exact fix needed: restore or renumber to close `004`, then update graph metadata and references.
- File: `.opencode/specs/system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency:1`
- Issue: direct children skip `007` among `001-016`.
- Exact fix needed: restore or renumber to close `007`, then update graph metadata and references.
- File: `.opencode/specs/system-speckit/028-memory-search-intelligence/002-spec-data-quality:1`
- Issue: direct children skip `007-028` and `030-044` among `001-053`.
- Exact fix needed: restore or renumber the sequence, then update graph metadata and references.

## Clean Checks
- Category 5: no orphaned empty shell folder remained among old rename-source directories checked from the last-five-commit diff.
- No stale cross-reference finding was made for unrelated content-quality issues outside the requested structural categories.
