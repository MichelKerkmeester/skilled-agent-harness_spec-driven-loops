---
title: "Fix 007: Topology and Build/Dist Boundary Remediation"
description: "Six surgical fixes close P2 findings F-019-D4-02 through F-020-D5-04 from packet 046 deep research. Covers phase-path grammar documentation, a manifest-size health helper for phase parents, a kebab-to-snake cache-signature correction in the OpenCode plugin, a broadened source/dist alignment checker, an orphan dist artifact deletion plus a smoke-tested MJS plugin bridge."
trigger_phrases:
  - "topology build dist boundary remediation"
  - "assessPhaseParentHealth"
  - "dist alignment checker orphan"
  - "F-019-D4-03 phase parent health"
  - "F-020-D5-01 cache signature snake case"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-01

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/006-research/004-fix-deep-research-findings/007-fix-topology-build-boundary` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/006-research/004-fix-deep-research-findings`

### Summary

Six P2 findings from the packet 046 deep-research investigation (D4 phase-topology, D5 build/dist boundary) left topology drift, a stale cache-signature path plus orphaned dist artifacts that the existing tooling could not detect. The implement-workflow YAML documented only a two-level path pattern even though the runtime parser supports arbitrary depth. Large phase parents had no programmatic size check. The OpenCode plugin hashed a kebab-case dist path that never existed on disk, so cache invalidation never reacted to compat-module changes. The source/dist alignment checker covered only two subtrees, letting orphans in the remaining runtime-critical directories pass silently.

Six surgical edits landed in a single commit on 2026-05-01. A `phase_path_grammar` block was added to the implement-workflow YAML (documentation-only, no parser change). An `assessPhaseParentHealth` helper was exported from both `is-phase-parent.ts` mirrors with 20/40 thresholds plus a CLI entrypoint wired into `check-phase-parent-content.sh`. The OpenCode plugin's `ADVISOR_SOURCE_PATHS` entry was corrected from kebab to snake case. The alignment checker's `DIST_TARGETS` grew from 2 to 17 entries. Missing roots now `continue` instead of exiting. A 3-entry time-bounded allowlist covers the remaining D5-03 siblings. The orphan `harness.js` plus its companions were deleted after confirming no live imports. The MJS plugin bridge received a decision-record header plus a 5-case subprocess smoke test.

### Added

- `assessPhaseParentHealth(folder)` exported from both `mcp_server/lib/spec/is-phase-parent.ts` and `scripts/spec/is-phase-parent.ts` returning `{ childCount, status, recommendation }` with thresholds at 20 (warning) and 40 (error)
- CLI entrypoint `health <folder>` on `scripts/spec/is-phase-parent.ts` so shell rules can shell-out for the advisory
- `phase_path_grammar` documentation block under `phase_folder_awareness` in the implement-workflow YAML listing flat, two-level, three-level plus deep path shapes
- Decision-record header on the MJS plugin bridge explaining why it lives outside the TypeScript build tree
- 9-case vitest for `assessPhaseParentHealth` covering ok/warning/error buckets, threshold boundaries plus non-NNN children (`mcp_server/tests/phase-parent-health.vitest.ts` NEW)
- 5-case subprocess smoke test for the MJS bridge asserting file existence, valid JSON envelope shape plus fail-open paths (`mcp_server/skill_advisor/tests/compat/plugin-bridge-smoke.vitest.ts` via `system-skill-advisor` mirror NEW)
- 6-case vitest for the broadened alignment checker covering scope, optional-root soft-fail, allowlist honoring plus harness.js deletion (`scripts/tests/check-source-dist-alignment-orphans.vitest.ts` NEW)

### Changed

- `ADVISOR_SOURCE_PATHS` in the OpenCode plugin corrected from kebab-case `dist/skill-advisor/compat/index.js` to snake-case `dist/skill_advisor/compat/index.js` so the cache signature hashes a real on-disk file
- `DIST_TARGETS` in the alignment checker broadened from 2 entries to 17 entries covering every runtime-critical `mcp_server` dist subtree
- Missing-dist-root handling in the alignment checker changed from `process.exit(2)` to `continue` so optional subtrees do not fail the build
- `mapDistFileToSource` segment derivation fixed to derive from the dist-root prefix instead of a hardcoded `target.label` match
- `check-phase-parent-content.sh` updated to call the dist CLI entrypoint and append a manifest-size advisory when the helper reports warning or error, soft-failing when node or the dist artifact is unavailable

### Fixed

- OpenCode plugin cache signature always recorded a missing-file hash for the compat module because the kebab-case path never existed on disk. Corrected to snake-case path.
- Alignment checker silently ignored orphan dist artifacts in runtime-critical subtrees outside `dist/lib` and `scripts/dist`. Broadened scope now flags those subtrees.
- `mcp_server/dist/tests/search-quality/harness.js` and its three companions were orphaned when the source moved to `stress_test/search-quality/harness.ts`. Deleted after confirming no live imports.
- Phase parents with 20 or more children had no programmatic health check. The new `assessPhaseParentHealth` helper surfaces warning and error tiers.

### Verification

| Check | Result |
|-------|--------|
| Targeted vitest (3 new test files) | 20/20 tests passed (9 phase-parent-health + 5 plugin-bridge-smoke + 6 alignment-orphans) |
| `npx tsx evals/check-source-dist-alignment.ts` | exit 0. 643 dist files scanned. 640 aligned. 3 allowlisted (D5-03 siblings). 0 violations. |
| `npm run stress` | 57 passed + 1 pre-existing code_graph failure from a parallel track. Stash diff confirmed the failure pre-existed this packet's edits. Per user policy on parallel tracks: not a blocker. |
| Orphan harness.js deletion | Verified absent on disk. Siblings (corpus, measurement-fixtures, metrics) flagged but allowlisted. |
| Inline finding markers | 21 markers found across 7 files via grep. |
| `validate.sh --strict` (this packet) | Pending at commit finalization per spec.md success criteria. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/commands/speckit/assets/speckit_implement_auto.yaml` | Modified | F-019-D4-02: additive `phase_path_grammar` documentation block under `phase_folder_awareness`. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/spec/is-phase-parent.ts` | Modified | F-019-D4-03: `assessPhaseParentHealth` export plus warning and error threshold constants. |
| `.opencode/skills/system-spec-kit/scripts/spec/is-phase-parent.ts` | Modified | F-019-D4-03: mirror health helper export plus CLI entrypoint for shell-out use. |
| `.opencode/skills/system-spec-kit/scripts/rules/check-phase-parent-content.sh` | Modified | F-019-D4-03: append manifest-size advisory line via dist CLI. Soft-fails when node or dist artifact is unavailable. |
| `.opencode/plugins/mk-skill-advisor.js` | Modified | F-020-D5-01: kebab to snake case correction in `ADVISOR_SOURCE_PATHS` cache-signature entry. |
| `.opencode/skills/system-spec-kit/scripts/evals/check-source-dist-alignment.ts` | Modified | F-020-D5-02: broaden `DIST_TARGETS` to 17 entries. Soften missing-root to `continue`. Fix `mapDistFileToSource` segment derivation. Add 3-entry allowlist. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/phase-parent-health.vitest.ts` (NEW) | Created | F-019-D4-03: 9 cases covering thresholds and edge cases. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/compat/plugin-bridge-smoke.vitest.ts` (NEW) | Created | F-020-D5-04: 5 cases covering subprocess contract. |
| `.opencode/skills/system-spec-kit/scripts/tests/check-source-dist-alignment-orphans.vitest.ts` (NEW) | Created | F-020-D5-02: 6 cases covering broadened scope, allowlist plus harness deletion. |

### Follow-Ups

- Consolidate the dual `is-phase-parent.ts` mirrors (`mcp_server/lib/spec/` and `scripts/spec/`) into a single source-of-truth. The dual ownership was retained in scope to keep this packet small.
- Delete the three remaining D5-03 sibling dist orphans (`corpus.js`, `measurement-fixtures.js`, `metrics.js`) once the follow-on dist-cleanup packet is scoped.
- Migrate the MJS plugin bridge to TypeScript when a build-step decision for that single file is made in a future packet.
- Confirm `validate.sh --strict` exits 0 on this packet during final commit.
