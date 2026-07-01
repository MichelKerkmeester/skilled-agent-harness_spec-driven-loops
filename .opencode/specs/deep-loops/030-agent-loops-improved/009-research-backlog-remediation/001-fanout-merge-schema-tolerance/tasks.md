---
title: "Tasks: Fanout-Merge Schema Tolerance"
description: "Task list for the fanout-merge.cjs schema-tolerance fix."
trigger_phrases:
  - "fanout merge schema tolerance tasks"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-agent-loops-improved/009-research-backlog-remediation/001-fanout-merge-schema-tolerance"
    last_updated_at: "2026-07-01T07:00:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Implemented by MiMo v2.5 ultraspeed, verified by Claude Sonnet 5"
    next_safe_action: "Move to child 002-fanout-timeout-override"
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
    answered_questions:
      - "mergeReviewRegistries had the identical defect (openFindings vs findings) and was fixed with the same normalizeRegistrySchema helper, aliases: {findings: openFindings}"
---
# Tasks: Fanout-Merge Schema Tolerance

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`[x]` complete, `[ ]` pending. Task IDs are stable references used in the implementation summary and changelog.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read `fanout-merge.cjs` `mergeResearchRegistries` (line ~467) and `mergeReviewRegistries` (line ~558) in full
- [x] T002 Write a RED test proving the current bug (a `findings`-schema lineage's data is silently dropped from the merge)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add `normalizeRegistrySchema` helper aliasing `findings` → `keyFindings` when the latter is absent
- [x] T004 Wire the helper into `mergeResearchRegistries` before its existing dedup loop
- [x] T005 Emit a structured `schema_mismatch` warning (lineage label + affected/skipped count) whenever normalization is applied or a registry is still unusable
- [x] T006 Audit `mergeReviewRegistries` for the identical defect class; apply the same fix if present, or document why it's not needed — same defect confirmed present (`openFindings` vs `findings`), fixed identically
- [x] T007 Add the sum-invariant regression test (`sum(per-lineage finding counts) == merged finding count`, dedup-aware)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Confirm T002's RED test now passes (GREEN) — verified via `npx vitest run tests/unit/fanout-merge.vitest.ts`, 33/33 pass
- [x] T009 Run the full `deep-loop-runtime` Vitest suite; confirm no regressions — 553/555 pass; 2 failures (`dependency-seams.vitest.ts`, `executor-provenance-mismatch.vitest.ts`) independently confirmed pre-existing via `git stash` diff (identical failure with the fix removed)
- [x] T010 Manually re-run the merge against the real `research/lineages/{glm,gpt}/deep-research-findings-registry.json` fixtures and confirm the true combined count is produced — re-ran `fanout-merge.cjs --loop-type research`, on-disk `research/deep-research-findings-registry.json` now shows 26 `keyFindings` (was 8), with a `schema_mismatch` warning logging "coerced 18 entries" for the glm lineage
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All 10 tasks complete; targeted and full-suite tests pass with no new regressions; real-data re-run confirms the fix.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `./spec.md`
- Plan: `./plan.md`
- Implementation summary: `./implementation-summary.md`
- Source finding: `../../research/research.md` §4.1, §6
<!-- /ANCHOR:cross-refs -->
