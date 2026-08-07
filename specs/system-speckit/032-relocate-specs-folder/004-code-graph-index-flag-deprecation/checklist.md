---
title: "Verification Checklist: Deprecate SPECKIT_CODE_GRAPH_INDEX_* Flag Remnants"
description: "Verification Date: pending execution"
trigger_phrases:
  - "code graph index flag deprecation checklist"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/032-relocate-specs-folder/004-code-graph-index-flag-deprecation"
    last_updated_at: "2026-08-07T10:47:41Z"
    last_updated_by: "claude-code"
    recent_action: "Checklist scoped, awaiting execution"
    next_safe_action: "Execute plan.md steps, then verify each item"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-07-system-speckit-032-relocate-004"
      parent_session_id: null
    completion_pct: 20
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Deprecate SPECKIT_CODE_GRAPH_INDEX_* Flag Remnants

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

- [x] CHK-001 [P0] Requirements documented in spec.md [evidence: `spec.md` REQ-001 through REQ-004]
- [x] CHK-002 [P0] Technical approach defined in plan.md [evidence: `plan.md` §4, 5 literal steps with commands and checks]
- [x] CHK-003 [P1] Dependencies identified and available [evidence: `plan.md` §6 — none, self-contained]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks [evidence: `tsc --noEmit` exit 0, no output]
- [x] CHK-011 [P0] No console errors or warnings [evidence: `npx vitest run tests/index-scope.vitest.ts` — 8/8 passed, no warnings]
- [ ] CHK-012 [P1] Error handling implemented [deferred: N/A — pure deletion/simplification, no new error paths introduced]
- [x] CHK-013 [P1] Code follows project patterns [evidence: simplified `resolveIncludedSkillsList`/`resolveIndexScopePolicy` keep the same per-call-override shape as the surrounding module, just with the dead env-var branch removed]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met [evidence: REQ-001 — `git grep -l "SPECKIT_CODE_GRAPH_INDEX" -- . ':!specs' ':!.opencode/specs'` empty; REQ-002 — `index-scope.vitest.ts` 8/8 passed unchanged]
- [x] CHK-021 [P0] Manual testing complete [evidence: `git grep -l "SPECKIT_CODE_GRAPH_INDEX"` run before deletion (found the 3 in-scope files + 2 previously-unscoped manifest refs, fixed via regeneration) and after (empty)]
- [x] CHK-022 [P1] Edge cases tested [evidence: `spec.md` §8's "explicit `env.SPECKIT_CODE_GRAPH_INDEX_SKILLS` input" edge case — confirmed no test or caller ever exercised that path (`grep -rn "resolveIndexScopePolicy\|IndexScopePolicySource"` outside `dist/` returns only `index-scope.ts` itself), so silently ignoring it now is safe]
- [ ] CHK-023 [P1] Error scenarios validated [deferred: N/A — no new runtime error paths]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. [deferred: N/A — this phase deletes dead infrastructure and removes unreachable code branches, it is not a bug fix with a finding-class taxonomy]
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. [deferred: N/A — no bug-class producers involved; the repo-wide grep in T001/T008 is the equivalent completeness proof for a removal task]
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. [evidence: consumer inventory done via `grep -rn "resolveIndexScopePolicy\|IndexScopePolicySource"` outside `dist/`, confirmed zero external callers before removing the `env` field]
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. [deferred: N/A — no security/path/parser/redaction surface touched, this is a dead-code deletion]
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. [deferred: N/A — no test matrix applies to a deletion task]
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. [deferred: N/A — the whole point of this change is removing the process-wide env-var read, there is no remaining global-state path to stress]
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. [deferred: N/A — not yet committed at authoring time; the commit SHA will be the pin once this lands]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets [deferred: N/A — no secrets involved in this change]
- [ ] CHK-031 [P0] Input validation implemented [deferred: N/A — no user input surface touched]
- [ ] CHK-032 [P1] Auth/authz working correctly [deferred: N/A — not applicable to this change]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized [evidence: `spec.md` METADATA status updated to Complete, `tasks.md` T001-T008 all `[x]` with evidence, `plan.md`'s Definition of Done items all satisfied]
- [x] CHK-041 [P1] Code comments adequate [evidence: no stale comments left referencing the removed env-var mechanism; `.gitattributes`' own explanatory header is gone with the file]
- [ ] CHK-042 [P2] README updated (if applicable) [deferred: N/A — no user-facing README exists for this packet]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only [evidence: `scratch/.gitkeep` is the only file under `scratch/`, created by `create.sh`]
- [x] CHK-051 [P1] scratch/ cleaned before completion [evidence: `ls -la scratch/` shows only `.gitkeep`, nothing to clean]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 7/12 (5 deferred N/A, documented — Fix Completeness items that don't apply to a dead-code deletion task) |
| P1 Items | 13 | 7/13 (6 deferred N/A, documented) |
| P2 Items | 1 | 0/1 (deferred N/A, documented) |

**Verification Date**: 2026-08-07
<!-- /ANCHOR:summary -->
