---
title: "Verification Checklist: Integration Verification + Guarded Rollout"
description: "QA checklist for the program's closing gate: pinned-corpus rerun, live-daemon reindex proof, cache invalidation, and rollback plans."
trigger_phrases:
  - "integration verification rollout checklist"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/012-integration-verification-rollout"
    last_updated_at: "2026-07-29T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored planned phase spec"
    next_safe_action: "Begin implementation per plan.md"
    blockers:
      - "Depends on every prior phase in 033-json-optimization-implementation landing first"
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "012-integration-verification-rollout"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Verification Checklist: Integration Verification + Guarded Rollout

---

<!-- ANCHOR:protocol -->
## Verification Protocol

Every item carries a command or artifact reference. All items stay `[ ]` until this phase's dependency phases land and execution runs.

| Priority | Meaning | Rule |
|----------|---------|------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [ ] CHK-001 [P0] Every dependency phase (`002`, `003`, `008`, `011`, and the rest of the program) confirmed Complete before the corpus rerun starts [evidence: phase status check against each phase's `implementation-summary.md`]
- [ ] CHK-002 [P1] The `002` pinned-corpus fixtures and `scorer-eval-baseline.json` confirmed unchanged since baseline capture (hash check) [evidence: `corpusSha256`/`holdoutSha256`/`ambiguitySha256` recomputed and compared]
- [ ] CHK-003 [P1] Real 003/008/011 diffs read before drafting rollback plans, not just the research recommendations [evidence: commit range cited per phase]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
- [ ] CHK-004 [P0] Cache-invalidation change to `executor-delegation.ts` reuses the existing `computeAdvisorSourceSignature` mechanism rather than adding a second freshness concept [evidence: diff references `mcp-server/lib/freshness.ts:205`]
- [ ] CHK-005 [P1] Any code touched in this phase stays inside the scoped surfaces (`watcher.ts`, `watcher-orchestrator.ts`, `executor-delegation.ts`, `routing-accuracy/` scripts) — no drive-by edits to unrelated scorer/projection logic [evidence: `git diff --stat` scoped to the listed paths]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing
- [ ] CHK-006 [P0] Pinned corpus rerun (full/holdout/ambiguity) under the same reproducible env as the `002` baseline; top-1 delta reported [evidence: rerun output diffed against `scorer-eval-baseline.json`]
- [ ] CHK-007 [P0] Top-3 metric added and reported for all three slices [evidence: new metric fields in the rerun output, alias-canonicalized consistently with the existing top-1 comparator]
- [ ] CHK-008 [P0] Live-daemon proof executed against both staleness seams (hash-unchanged skip; dist-load-once) with before/after `advisor_recommend` evidence [evidence: probe transcript or logged output pre/post edit]
- [ ] CHK-009 [P1] If staleness found, the reload/verification step is shipped and re-proven; if not found, the negative result is documented with evidence [evidence: either the shipped reload step's re-probe, or the documented negative finding]
- [ ] CHK-010 [P1] Cache-invalidation test proves `filesystemAliasCache` picks up a source-file change without a process restart [evidence: vitest name + pass output]
- [ ] CHK-011 [P1] Cache-invalidation test proves any 003-introduced derived cache picks up a source-file change without a process restart, OR REQ-005 is documented as satisfied without new code [evidence: vitest name + pass output, or the documented no-cache finding]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [ ] CHK-012 [P0] No unexplained top-1/top-3 regression vs the `002` baseline; any regression carries an explicit operator-approved reason [evidence: delta report + approval note if applicable]
- [ ] CHK-013 [P0] Rollback plan for the 003 `derived` schema change dry-run tested against a scratch checkout and confirmed to restore pre-change routing-accuracy numbers [evidence: scratch-checkout revert + rerun output]
- [ ] CHK-014 [P0] Rollback plan for the 008 edges change dry-run tested against a scratch checkout and confirmed to restore pre-change edges data [evidence: scratch-checkout revert + field diff]
- [ ] CHK-015 [P0] Rollback plan for the 011 command-routing rewire dry-run tested against a scratch checkout and confirmed to restore pre-change command-routing behavior [evidence: scratch-checkout revert + regression-corpus rerun]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
- [ ] CHK-016 [P1] Daemon-proof edits use scratch/test fixtures, never live operator credentials or production advisor state [evidence: proof runs against an isolated `MK_SKILL_ADVISOR_DB_DIR`]
- [ ] CHK-017 [P2] No secrets or proprietary data surfaced in the delta report or rollback documentation
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
- [ ] CHK-018 [P1] Delta report, daemon-proof conclusion, and all three rollback plans preserved under this phase's docs [evidence: `plan.md` §7 + `implementation-summary.md` verification section]
- [ ] CHK-019 [P1] Parent packet (`033-json-optimization-implementation`) completion metadata reconciled — `spec.md`/`implementation-summary.md` do not claim Complete before this checklist is green [evidence: parent doc status fields checked post-run]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
- [ ] CHK-020 [P1] All new artifacts (delta report, proof transcripts, rollback docs) scoped under this phase's folder or the touched source paths — no stray files elsewhere [evidence: `git status` scoped diff]
- [ ] CHK-021 [P2] No `.opencode/package.json` pin bump committed as a side effect of this phase's test runs
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| Pre-flight checks | 3 | 0/3 |
| Corpus rerun + top-1/top-3 delta | 2 | 0/2 |
| Daemon reindex proof | 2 | 0/2 |
| Cache invalidation | 2 | 0/2 |
| Rollback plans (003/008/011) | 3 | 0/3 |

**Verification Date**: Pending (phase Planned; verification runs after all prior phases land)
<!-- /ANCHOR:summary -->
