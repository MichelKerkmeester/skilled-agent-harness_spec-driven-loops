---
title: "Verification Checklist: Scouted Bugfix Batch 2"
description: "QA verification for the verify-first deep-dive -> implement workflow and the 13 confirmed + partial defect fixes across 22 files."
trigger_phrases:
  - "scouted bugfix batch 2 checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/000-release-and-program-cleanup/010-scouted-bugfix-train/002-scouted-bugfix-batch-2"
    last_updated_at: "2026-06-03T07:31:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Verification items confirmed via per-fix regression tests + builds + node --check"
    next_safe_action: "Validate --strict and reconcile"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embeddings/auto-select.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/storage/vector-index-schema.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scouted-bugfix-batch-2-session"
      parent_session_id: null
    completion_pct: 92
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Scouted Bugfix Batch 2

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001..006)
- [x] CHK-002 [P0] Technical approach defined in plan.md (verify-first deep-dive → implement over the remaining 15 targets)
- [x] CHK-003 [P1] Remaining 15 carried over from the 20-target scout; disjoint file partition defined
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Fixes are defect-driven; only the REAL part of each confirmed/partial target fixed (no scope creep into refuted headlines)
- [x] CHK-011 [P0] No spec-path/packet-id introduced into any edited source file as a tracking artifact
- [x] CHK-012 [P1] auto-select drops the legacy `HF_LOCAL_MODEL` env alias so the persisted model name matches what the provider loads (no behavior drift)
- [x] CHK-013 [P1] 13 implement agents touched disjoint file sets (22 files = sources + tests, no overlap)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Each headline confirmed/partially-confirmed/refuted by a gpt-5.5-fast deep-dive before any edit
- [x] CHK-021 [P0] The 2 REFUTED headlines NOT acted on (hook-tests `specs/` path is a symlink to `.opencode/specs/`; reconsolidation env-leak does not leak)
- [x] CHK-022 [P1] gpt-5.5's cloud-fallback magic-number refactor in auto-select SKIPPED as a behavior-neutral no-op (documented)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] Fix — chunking.ts: `maxLength<=0` guard + `remainingBudget<=0` break + code-point-safe truncation; regression test passes
- [x] CHK-031 [P1] Fix — coverage-graph-signals.ts: claimVerificationRate vacuous-pass 1.0 with no CLAIM nodes (was 0 → perpetual CONTINUE); regression test passes
- [x] CHK-032 [P1] Fix — fanout-run.cjs: gemini fallback `gemini-2.5-pro` → `gemini-3.1-pro-preview`; regression test passes; `node --check` OK
- [x] CHK-033 [P2] Fix — fanout-merge.cjs: `resolvedQuestionsById` Map mirroring `openQuestionsById`; regression test passes; `node --check` OK
- [x] CHK-034 [P2] Fix — spec-doc-health.ts: local `isPhaseParent()` (advisory-only); regression test passes
- [x] CHK-035 [P2] Fix — rrf-fusion.ts: two-list `fuseResults` normalization parity with `fuseResultsMulti`; regression test passes
- [x] CHK-036 [P2] Fix — auto-select.ts: hf-local dim contract (canonical=768, custom=0) + drop env alias; regression test passes
- [x] CHK-037 [P2] Fix — semantic-shadow.ts: shadowOnly true→false (inert for public scoring); regression test passes
- [x] CHK-038 [P1] Fix — vector-index-schema.ts: `idx_memory_logical_key_active_unique` added to REQUIRED_INDEXES; regression test passes
- [x] CHK-039 [P2] Fix — readiness-marker.ts: workspace-root base dir (mirrors core/config.ts); regression test passes
- [x] CHK-040 [P2] Fix — dispatch-minimax.cjs: conditional `--agent` (drop unconditional `--agent general`); regression test passes; `node --check` OK
- [x] CHK-041 [P2] Fix — test-opencode-plugins.ts runner: import `spec-kit-skill-advisor.js` → `mk-skill-advisor.js`; regression test passes
- [x] CHK-042 [P0] 13 fixes applied across 22 files; 0 skipped (of the confirmed + partial set)
- [x] CHK-043 [P0] system-spec-kit + skill-advisor + code-graph mcp_server `npm run build` exit 0; deep-loop `.cjs` `node --check` OK
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-050 [P1] No new attack surface introduced; fixes are correctness/concurrency-class, scope-locked to the confirmed defects
- [x] CHK-051 [P2] readiness-marker resolves its base dir from a workspace-root helper, not an attacker-influenceable `process.cwd()`
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-060 [P1] spec/plan/tasks/implementation-summary synchronized to shipped state
- [x] CHK-061 [P2] Partial-vs-refuted rationale recorded per target (REAL part fixed; refuted headline not acted on)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-070 [P1] No temp/scratch artifacts introduced into the repo; edits land only in the 22 confirmed/partial-defect files (sources + added regression tests)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 9 | 9/9 |
| P2 Items | 12 | 12/12 |

**Verification Date**: 2026-06-03

### Ship status

- [x] CHK-080 [P1] description.json + graph-metadata.json present
- [ ] CHK-081 [P0] `validate.sh --strict` → Errors 0
- [ ] CHK-082 [P1] Completion metadata reconciled across packet docs
<!-- /ANCHOR:summary -->
</content>
