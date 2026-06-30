---
title: "Changelog: Drift Finding Fixes. Idempotent Derived Sync and 3 Catalog Alignments"
description: "Fixed a real product bug (sa-011 non-idempotent derived metadata sync) and resolved 3 catalog/test misalignments (sa-004, sa-036, sa-037). The full 56-file 159-test stress suite remained green after all 4 fixes landed."
trigger_phrases:
  - "drift finding fixes"
  - "sa-011 idempotent derived sync"
  - "derived metadata extract sync fix"
  - "skill advisor catalog alignment"
  - "FIXME sa-star stress test cleanup"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-01

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/002-audit/008-fix-audit-drift-findings` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/002-audit`

### Summary

Packets 042-044 left four `FIXME(sa-*)` markers in stress tests. One marker indicated a real product bug: `syncDerivedMetadata` was non-idempotent because prior derived state was merged back into the trigger/keyword bucket pipeline on every resync. `graph-metadata.json` was also included as a provenance dependency, causing the file's own hash to change on each write. The other three markers reflected a test misread (sa-004), a catalog count mismatch (sa-036) or a design-ceiling versus CI-gate wording ambiguity (sa-037).

The sa-011 bug was fixed with three surgical edits to `extract.ts` (stop merging prior derived into buckets, exclude `graph-metadata.json` from provenance, deduplicate the dependency list) and one edit to `sync.ts` (exclude `generated_at` from the idempotency comparison, preserve the existing derived block when content is stable). The three catalog/test items were corrected without touching product logic.

All four `FIXME(sa-*)` markers are gone. The full stress suite passes 56/56 files and 159/159 tests. The lifecycle-derived unit test recovered from 14/16 to 16/16 after the bucket pipeline change.

### Added

- None.

### Changed

- `extract.ts`: prior derived state no longer merged into trigger/keyword candidate buckets. Prior `source_docs` and `key_files` are still propagated into the output arrays but no longer feed path-ngram generation.
- `extract.ts`: `graph-metadata.json` excluded from provenance dependency collection. Dependency list is deduplicated via a Map.
- `sync.ts`: `generated_at` excluded from the idempotency comparison. Existing derived block preserved on-disk when content is stable.
- Feature catalog `08--python-compat/02-regression-suite.md`: suite count updated from 52 to 51 to match the fixture JSONL line count.
- Feature catalog `08--python-compat/03-bench-runner.md`: 50ms/60ms thresholds clarified as design ceilings on a stable workstation, not enforceable CI gates.

### Fixed

- `syncDerivedMetadata` reported `changed=true` on every call even when SKILL.md was unchanged. Root cause: bucket-merge cycle plus self-hash invalidation. Fixed by removing the cycle and excluding the auto-generated file from provenance.
- `lifecycle-derived-metadata.vitest.ts` had 2 failing cases tied to the bucket semantics change. Test updated for new bucket semantics. 16/16 now pass.
- `generation-snapshot-stress.vitest.ts` carried a FIXME claiming catalog expected `unavailable` trust state. Catalog actually accommodates both `recovered` and `unavailable`. Test anchored to the catalog quote and FIXME removed.
- `auto-indexing-derived-sync-stress.vitest.ts` FIXME for sa-011 removed. Assertion tightened to `expect(secondPass.every(r => r.changed === false)).toBe(true)`.
- `python-bench-runner-stress.vitest.ts` FIXME for sa-037 replaced with a catalog-pointer comment.

### Verification

| Check | Result |
|-------|--------|
| `auto-indexing-derived-sync-stress.vitest.ts`, second-call `changed=false` assertion | PASS. 4/4 cases. |
| `lifecycle-derived-metadata.vitest.ts` post-fix | PASS. 16/16 cases. |
| Full `npm run stress` | PASS. 56 files, 159 tests, exit 0, 47s. |
| sa-036 catalog count matches fixture line count | PASS. 51 in catalog, 51 lines in `skill_advisor_regression_cases.jsonl`. |
| `FIXME(sa-*)` markers remaining in stress tests | PASS. 0 remaining after sa-004, sa-011, sa-037 cleanup. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `mcp_server/skill_advisor/lib/derived/extract.ts` | Modified | Three surgical edits: bucket-merge removal, `graph-metadata.json` exclusion from provenance, dependency dedup via Map. |
| `mcp_server/skill_advisor/lib/derived/sync.ts` | Modified | `generated_at` excluded from idempotency hash. Existing derived block preserved when content is stable. |
| `mcp_server/skill_advisor/feature_catalog/08--python-compat/02-regression-suite.md` | Modified | Suite count corrected from 52 to 51 to match fixture. |
| `mcp_server/skill_advisor/feature_catalog/08--python-compat/03-bench-runner.md` | Modified | 50ms/60ms thresholds reframed as design ceilings rather than CI gates. FIXME removed. |
| `mcp_server/skill_advisor/tests/lifecycle-derived-metadata.vitest.ts` | Modified | Updated for new bucket semantics. 16/16 pass. |
| `mcp_server/stress_test/skill-advisor/auto-indexing-derived-sync-stress.vitest.ts` | Modified | FIXME removed. Assertion tightened to `changed=false` on second pass. |
| `mcp_server/stress_test/skill-advisor/generation-snapshot-stress.vitest.ts` | Modified | FIXME removed. Assertion anchored to catalog quote for recovered path. |
| `mcp_server/stress_test/skill-advisor/python-bench-runner-stress.vitest.ts` | Modified | FIXME replaced with catalog-pointer comment. |

### Follow-Ups

- Five pre-existing unit test failures (manual-testing-playbook content drift, advisor-corpus-parity file-content drift, advisor-graph-health workspace-state counts, plugin-bridge degraded health) were confirmed unrelated to this packet via `git stash`. They are tracked separately and should be addressed in a dedicated cleanup packet.
- Run `validate.sh --strict` for the final packet state and commit the result to close out the 045 packet checklist.
