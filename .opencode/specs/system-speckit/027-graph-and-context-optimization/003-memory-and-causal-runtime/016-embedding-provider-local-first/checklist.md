---
title: "Verification Checklist: Embedding Provider Local-First Resolution"
description: "QA verification for the local-first resolveProvider reorder and stale-fixture repair."
trigger_phrases:
  - "embedding local-first checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/016-embedding-provider-local-first"
    last_updated_at: "2026-06-02T21:05:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Verification items confirmed via embedder test gate"
    next_safe_action: "Commit"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/shared/embeddings/factory.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "embedding-localfirst-session"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Embedding Provider Local-First Resolution

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

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001..005)
- [x] CHK-002 [P0] Technical approach defined in plan.md (resolveProvider reorder + cascade trigger)
- [x] CHK-003 [P1] All three provider-order definitions traced; only resolveProvider was non-local-first
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] No `isPlaceholderKey` references remain; no dead code introduced
- [x] CHK-011 [P0] No packet-id/spec-path in any edited code comment (removed the legacy `post-016` comment)
- [x] CHK-012 [P1] `tsc --build` (shared) clean
- [x] CHK-013 [P1] Stale fixtures repaired faithfully (vec_memories_rowids = real source requirement, not a mask)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] 6 embedder test files green: 62 passed | 5 skipped | 0 failed
- [x] CHK-021 [P0] Isolation: tests use throwaway DBs (vitest-setup); production DB untouched
- [x] CHK-022 [P1] Pre-existing-failure isolation proven (stash factory.ts → same 2 failures)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] REQ-001 Auto mode prefers local over cloud — `T513-01b/c` assert `hf-local` even with valid Voyage + OpenAI keys → pass
- [x] CHK-031 [P0] REQ-002 Persisted-ollama + explicit unchanged — `factory-auto-resolution` (ollama) pass; `T513-01a` explicit pass
- [x] CHK-032 [P0] REQ-003 hf-local hard failure cascades to cloud — catch trigger includes hf-local; provider-flap recovery tests pass
- [x] CHK-033 [P1] REQ-004 All three order definitions agree on `ollama → hf-local → openai → voyage`
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] No hardcoded secrets introduced
- [x] CHK-041 [P0] Local-first reduces unintended cloud egress (no silent OpenAI/Voyage calls in auto mode)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] spec/plan/tasks/implementation-summary synchronized to shipped state
- [x] CHK-051 [P2] Downstream doc `131-doctor-install-alignment` consumes this change as ground truth
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] No temp/scratch artifacts introduced (single-file code change + tests)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 7 | 7/7 |
| P2 Items | 2 | 1/2 |

**Verification Date**: 2026-06-02

### Ship status

- [x] CHK-070 [P1] description.json + graph-metadata.json present
- [x] CHK-071 [P0] `validate.sh --strict` → Errors 0 (re-run: PASSED, Errors: 0)
- [x] CHK-072 [P1] Committed to main with explicit pathspec (no `-A`) (commit 79cb4e4d21)
- [ ] CHK-073 [P2] (deferred, user-gated) daemon recycle to deploy live
<!-- /ANCHOR:summary -->
