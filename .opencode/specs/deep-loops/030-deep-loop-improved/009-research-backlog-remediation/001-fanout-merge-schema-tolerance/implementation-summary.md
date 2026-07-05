---
title: "Implementation Summary: Fanout-Merge Schema Tolerance"
description: "Summary of the fanout-merge.cjs schema-tolerance fix and verification evidence."
trigger_phrases:
  - "fanout merge schema tolerance implementation summary"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-deep-loop-improved/009-research-backlog-remediation/001-fanout-merge-schema-tolerance"
    last_updated_at: "2026-07-01T07:00:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Implemented by MiMo v2.5 ultraspeed, verified by Claude Sonnet 5"
    next_safe_action: "Phase complete; move to child 002-fanout-timeout-override"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs"
      - ".opencode/skills/deep-loop-runtime/tests/unit/fanout-merge.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sonnet-009-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `deep-loops/030-deep-loop-improved/009-research-backlog-remediation/001-fanout-merge-schema-tolerance` |
| **Completed** | 2026-07-01 |
| **Level** | 1 |
| **Implemented by** | `xiaomi/mimo-v2.5-pro-ultraspeed` via `cli-opencode` |
| **Verified by** | Claude Sonnet 5 (orchestrating session) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Fixed the silent-drop bug in `fanout-merge.cjs` where `mergeResearchRegistries` and `mergeReviewRegistries` discarded an entire lineage's findings when its registry used a non-canonical schema key, with no warning. Added a `normalizeRegistrySchema(registry, {canonicalKey, aliases, lineage})` helper that coerces a known alias (`findings`) onto the canonical key (`keyFindings` for research, `openFindings` for review) when the canonical key is absent, and emits a structured `schema_mismatch` warning (to stderr and attached to the return value) in every case — whether the alias was found and coerced, or no usable array was found at all.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs` | Modified | `normalizeRegistrySchema` helper; wired into both `mergeResearchRegistries` and `mergeReviewRegistries` |
| `.opencode/skills/deep-loop-runtime/tests/unit/fanout-merge.vitest.ts` | Modified | 4 new tests: schema-tolerance (research), schema-tolerance (review), sum-invariant regression, schema_mismatch warning emission |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implementation dispatched to `xiaomi/mimo-v2.5-pro-ultraspeed` via `cli-opencode` (operator-directed executor) against the pre-authored spec/plan/tasks. The dispatched session read both merge functions, wrote RED tests, implemented the helper, wired it into both `mergeResearchRegistries` and `mergeReviewRegistries`, and added the sum-invariant regression test — matching the plan exactly, including auditing the review-mode counterpart rather than assuming parity. Verification (test re-execution, stash-based regression attribution, and real-data re-run) was performed independently by the orchestrating Claude Sonnet 5 session, not taken on the implementer's self-report.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Alias, don't reject.** A `findings`-schema registry is real, well-formed data — coercing it onto the canonical key preserves the information rather than discarding it.
- **Warn on every non-canonical hit, even when successfully tolerated.** Keeps the drift visible to operators even though it's no longer silently lossy.
- **`mergeReviewRegistries` audited, not assumed clean.** The audit (REQ-004) found the identical defect class there too (`openFindings` vs `findings`) and applied the same fix, rather than assuming parity.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

1. **Targeted test file**: `npx vitest run tests/unit/fanout-merge.vitest.ts` → **33/33 tests pass**, including all 4 new tests.
2. **Full suite regression check**: `npx vitest run` (whole `deep-loop-runtime` package) → **553/555 pass, 2 failures**. Both failures independently confirmed **pre-existing and unrelated** via `git stash push -- scripts/fanout-merge.cjs tests/unit/fanout-merge.vitest.ts` then re-running: `executor-provenance-mismatch.vitest.ts` fails identically with the fix removed; `dependency-seams.vitest.ts`'s "installs the same dependency versions system-spec-kit pins" check has no code path shared with `fanout-merge.cjs`. Stash was popped and fix restored (confirmed via `grep -c normalizeRegistrySchema` returning 4 post-restore).
3. **Real-data validation (the actual bug reproduction case)**: re-ran `node fanout-merge.cjs --loop-type research --artifact-dir .opencode/specs/deep-loops/030-deep-loop-improved/research` against the real glm/gpt lineage registries from the 2026-07-01 deep-research fan-out. stderr now emits `{"type":"schema_mismatch",...,"lineage":"glm","message":"Registry uses non-canonical key \"findings\" instead of \"keyFindings\"; coerced 18 entries."}`. The on-disk `research/deep-research-findings-registry.json` now shows **26 `keyFindings`** (previously silently 8) and carries the `schema_mismatch` field. This matches `research/research.md`'s own reported true total (18 glm + 8 gpt = 26).
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- The fix tolerates only the specific `findings` alias observed in this run's actual data. If a future lineage produces a registry under a third, different schema shape, it will still be silently skipped (with a warning noting no usable array was found) rather than tolerated — this is a targeted fix for the observed defect, not a general schema-validation framework. A more general schema-normalization/validation layer was considered (per `research/research.md` §4.1 recommendation option 1) but scoped out as beyond this bug fix's blast radius; not pursued further here.
<!-- /ANCHOR:limitations -->
