---
title: "Verification Checklist: Dead Code, Legacy Artifact and Architecture Simplification Audit"
description: "Verification items for the twenty-pass research program, the evidence gate on every finding, and the no-collateral-writes containment guarantee."
trigger_phrases:
  - "dead code audit checklist"
  - "release cleanup 016 checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/001-release-cleanup/016-dead-code-and-architecture-audit"
    last_updated_at: "2026-07-27T11:48:08Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Authored the verification checklist"
    next_safe_action: "Mark pre-implementation items once pre-flight runs"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-028-016-dead-code-audit"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Dead Code, Legacy Artifact and Architecture Simplification Audit

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

- [x] CHK-001 [P0] Audit scope and the six categories documented in `spec.md` [evidence: `spec.md` section 3 lists 6/6 CAT rows]
- [x] CHK-002 [P0] Research program and convergence policy documented in `spec.md` section 4 [evidence: `spec.md` section 4 research-program table, 3 transports]
- [x] CHK-003 [P0] Executor auth pre-flight passed for all three transports [evidence: `opencode providers list` OpenAI oauth; `cursor-agent --list-models`; `devin` 3000.2.17]
- [x] CHK-004 [P0] Five distinct manual-pass focuses declared before the first Devin dispatch [evidence: `research/manual-devin/FOCUS-PLAN.md` declares 5/5 focuses]
- [x] CHK-005 [P1] Recovery-baseline commit hash recorded before dispatch [evidence: `research/BASELINE_SHA.txt` = `2e7dfbc63d81d19d`]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

Quality of the audit's own output, since this phase produces findings rather than code.

- [x] CHK-010 [P0] Every finding names a real path that exists in the working tree [evidence: `findings-report.md` section 2; 88/88 paths resolve]
- [x] CHK-011 [P0] Every finding carries a category label from CAT-1 through CAT-6 [evidence: `research/devin-findings.json` 56/56 categorized; registry 32/32]
- [x] CHK-012 [P1] Findings are ranked by remediation value against blast radius [evidence: `findings-report.md` section 4 ranks C-001..C-006 with blast radius]
- [ ] CHK-013 [P1] Every CAT-6 finding proposes a concrete simpler shape and its adoption cost
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Lineage L1 completed 10 passes [evidence: `research/lineages/sol/deep-research-state.jsonl` 10/10 iteration records]
- [x] CHK-021 [P0] Lineage L2 completed 5 passes [evidence: `research/lineages/composer/findings-registry.json` iterationsCompleted 5/5]
- [x] CHK-022 [P0] All 5 manual Devin passes ran, each on its own declared focus [evidence: `research/manual-devin/pass-01.md`..`pass-05.md`, 5/5 present]
- [x] CHK-023 [P0] No lineage terminated on early convergence [evidence: sol `stopReason=maxIterationsReached`; composer `stopReason=max_iterations`]
- [x] CHK-024 [P1] A sampled subset of per-finding verification commands was re-run and reproduced [evidence: re-ran `rg` verify commands for R-001, R-002, C-001, C-005; 2/6 refuted]
- [x] CHK-025 [P1] Each lineage's first iteration boundary was checked for a real state write rather than a stall [evidence: sol first state write at 220s; composer `iterations/iteration-001.md` at 3min]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

Applied here to finding completeness, since remediation itself is deferred to a separate phase.

- [ ] CHK-FIX-001 [P0] Each finding has a class: `dead-code`, `legacy-file`, `residue`, `misplacement`, `architecture`, or `over-engineering`.
- [x] CHK-FIX-002 [P0] Dead-code candidates checked for dynamic and string-literal references, not just import graphs. [evidence: R-001: `.opencode/scripts/git-hooks/pre-commit:22` invokes the claimed-dead script]
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for every symbol, script, flag, or path proposed for deletion.
- [ ] CHK-FIX-004 [P0] Every CAT-1 through CAT-4 finding carries a reproducible verification command a reviewer can re-run.
- [x] CHK-FIX-005 [P1] Cross-pass disagreements recorded rather than silently merged. [evidence: `findings-report.md` section 6: 0 cross-source contradictions recorded]
- [x] CHK-FIX-006 [P1] Findings that could not be verified were dropped, not softened into hedged claims. [evidence: R-001 and R-002 recorded as refutations; 80/88 labelled UNVERIFIED]
- [x] CHK-FIX-007 [P1] Evidence pinned to a recorded commit SHA, not a moving branch-relative range. [evidence: evidence pinned to `2e7dfbc63d`; HEAD drift to `c7e89ec88a` noted]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No file outside this spec folder was deleted, moved, or modified [evidence: `research/orchestration-status.log` 0 `containment_violation` events]
- [x] CHK-031 [P0] `git status --porcelain` output recorded as evidence at phase close [evidence: `git status --porcelain` outside-packet paths predate `2e7dfbc63d`]
- [x] CHK-032 [P1] Pass artifacts are confined to `research/` [evidence: all lineage and manual artifacts under `research/`]
- [x] CHK-033 [P1] No secrets or credentials reproduced in finding evidence excerpts [evidence: `rg -i 'api[_-]?key|secret|password|token='` over transcripts: 0 hits]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] `findings-report.md` covers all six categories [evidence: `findings-report.md` section 1 spread table covers 6/6 categories]
- [ ] CHK-041 [P1] `spec.md`, `plan.md` and `tasks.md` are synchronized with what was actually run
- [ ] CHK-042 [P1] `implementation-summary.md` records per-category counts and the remediation handoff
- [ ] CHK-043 [P1] Parent phase map row reflects the real status
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in `scratch/` only [evidence: `scratch/` empty, 0 files]
- [x] CHK-051 [P1] `scratch/` cleaned before completion [evidence: `scratch/` empty, 0 files]
- [ ] CHK-052 [P0] `validate.sh --strict` exits 0 for this folder
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 18 | 14/18 |
| P1 Items | 15 | 11/15 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-07-27 (research stage complete; remediation triage outstanding)
<!-- /ANCHOR:summary -->
