---
title: "Verification Checklist: Phase 3: remediation-doctor"
description: "QA verification items mapped to DR-01..DR-06; all applicable items verified with evidence after tasks.md T001-T021 executed (CHK-042 deferred to sibling Phase 5)."
trigger_phrases:
  - "verification"
  - "checklist"
  - "doctor remediation checklist"
  - "route-validate verification"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/132-command-agent-conformance-audit/003-remediation-doctor"
    last_updated_at: "2026-07-11T06:45:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "25/26 items [x] with evidence; CHK-042 deferred to Phase 5"
    next_safe_action: "006-validation-closeout: run read-only /doctor target proof"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "conformance-audit-132"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Phase 3: remediation-doctor

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

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

- [x] CHK-001 [P0] Requirements documented in spec.md
  - **Evidence**: spec.md §4 (`spec.md:149-163`) carries REQ-001..REQ-006, one per DR-01..DR-06 finding-group
- [x] CHK-002 [P0] Technical approach defined in plan.md
  - **Evidence**: plan.md §4 (`plan.md:131-163`) defines Phase 1-4 with the DR-04-before-DR-02/DR-03 sequencing constraint; execution followed it exactly
- [x] CHK-003 [P1] Dependencies identified and available
  - **Evidence**: `python3 -c 'import yaml; print("pyyaml OK")'` → `pyyaml OK` (re-confirmed live); `route-validate.sh` ran successfully throughout implementation
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks
  - **Evidence**: `route-validate.sh --self-test` → `INFO: All self-tests passed.`, exit 0, all 6 fixtures correctly rejected
- [x] CHK-011 [P0] No console errors or warnings
  - **Evidence**: post-fix `route-validate.sh` → `OK: route-validate — 10 routes validated, 3 warnings`, exit 0; the 3 warnings are pre-existing informational H1 flag-collision notices unrelated to this phase
- [x] CHK-012 [P1] Error handling implemented
  - **Evidence**: I/J/K each call `R.fail(...)` with a specific message on violation (mirroring D/E/F/G); confirmed non-zero exit + printed `FAIL:` lines in the pre-fix proof run (tasks.md T013)
- [x] CHK-013 [P1] Code follows project patterns
  - **Evidence**: assertions I/J/K use the same lettered-section-comment, `R.fail`/`R.passed`/`R.warn` reporting pattern as existing A-H (`route-validate.py`)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met
  - **Evidence**: REQ-001 through REQ-006 (spec.md §4) each verified via grep + `route-validate.sh`, see tasks.md T003/T005/T008/T013/T018 and implementation-summary.md Verification table
- [x] CHK-021 [P0] Manual testing complete
  - **Evidence**: each of the 6 findings manually grep-verified against the fixed files per its REQ-00N acceptance criteria, see `tasks.md:T003,T005,T008,T013,T018`
- [x] CHK-022 [P1] Edge cases tested
  - **Evidence**: menu renumbering verified complete and consistent — Accepted-answers table, Help Block, and "Press 1-11, 0, or X." prompt all renumbered together (`doctor_speckit_presentation.txt`); all 4 reclassified routes' `gate3_location` confirmed non-`n/a` after `add-only` (tasks.md T014)
- [x] CHK-023 [P1] Error scenarios validated
  - **Evidence**: PyYAML confirmed available (CHK-003), so `route-validate.sh` exit-3 path was not exercised live; the DR-04 pre-fix proof run (assertion K FAILING for `memory`/`causal-graph`/`code-graph`/`deep-loop` on the unfixed manifest, tasks.md T013) captured and reproduced inline as the required "would have caught it" evidence
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
  - **Evidence**: all six findings are `class-of-bug` (doc/manifest/schema drift, not a single typo) — DR-01 spans 3 displays, DR-02 spans 4 routes, DR-06 spans a 10-sibling schema
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
  - **Evidence**: DR-02's 4-route write pattern and DR-06's 10-of-10-routed-sibling `mutation_boundaries` pattern confirmed by direct read of every route block/YAML during implementation; DR-04's assertion K then independently reproduced the same 4-route finding programmatically (pre-fix proof, tasks.md T013)
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
  - **Evidence**: `rg -n 'skill-graph-freshness' .opencode/commands/doctor/` → 8 hits, all expected (manifest, target YAML, script comment, speckit.md, all 3 presentation displays); `rg -n 'memory_index_scan' .opencode/commands/doctor/` → remaining hits are `doctor_update.yaml` (legit), `update.md`/`doctor_update_presentation.txt` (companion command, out of scope), `doctor_memory.yaml` prose (not a grant), and the new `route-validate.py` constant (intentional regression guard) — no missed consumer
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
  - **N/A — documented reason**: no path/parser/redaction logic is touched by DR-01..DR-06; DR-03 is a least-privilege tool-grant removal, verified by `grep -n memory_index_scan _routes.yaml` absence, not an adversarial input table
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
  - **Evidence**: 6 findings × {doc/YAML edit, validator coverage, re-validate} listed in `plan.md:105-124` FIX ADDENDUM table; realized 1:1 in implementation-summary.md's Files Changed + Verification tables
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
  - **N/A — documented reason**: `route-validate.py` reads only local YAML/Markdown files; no process-wide or shared global state is read
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
  - **Evidence**: evidence in tasks.md/implementation-summary.md is pinned to the concrete `git diff` for this phase's uncommitted working-tree changes to `.opencode/commands/doctor/**` (10 files, +245/-36 lines per `git diff --stat`), not a moving branch-relative range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
  - **N/A — documented reason**: doc/YAML/validator changes carry no secrets; confirmed by reading every diff hunk in `git diff -- .opencode/commands/doctor/`
- [x] CHK-031 [P0] Input validation implemented
  - **Evidence**: `route-validate.py`'s existing PyYAML parse + schema checks (A-E) remain the input-validation layer, unmodified; new I/J/K checks add coverage on top, confirmed by full-suite PASS
- [x] CHK-032 [P1] Auth/authz working correctly
  - **Evidence**: DR-03 verified — `grep -n memory_index_scan _routes.yaml` → 0 matches in the `memory` route; `grep -c memory_index_scan speckit.md` → 0; `doctor_update.yaml:399` retains the legitimate grant untouched
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
  - **Evidence**: spec.md REQ-001..006, plan.md Phase 1-4, and `tasks.md:T001-T021` all reference the same DR-01..DR-06 finding IDs; tasks.md is now fully marked complete with implementation evidence matching spec.md's acceptance criteria
- [x] CHK-041 [P1] Code comments adequate
  - **Evidence**: `_routes.yaml`'s rewritten header comment (DR-05) and `route-validate.py`'s new I/J/K sections carry accurate inline comments matching the existing lettered-section style; `route-validate.sh`'s 3 new fixtures carry explanatory comments including the J-parity-collateral note
- [x] CHK-042 [P2] README updated (if applicable)
  - **Deferred — documented reason**: no README references the `/doctor` route count; README alignment is owned by sibling Phase 5 (`005-readme-alignment`), out of this phase's scope
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
  - **Evidence**: the one temp file created during implementation (`pre-fix-K-proof.txt`, the DR-04 pre-fix proof capture) was written to `scratch/` only
- [x] CHK-051 [P1] scratch/ cleaned before completion
  - **Evidence**: `scratch/` contains only `.gitkeep`; `pre-fix-K-proof.txt` removed after its content was captured inline in tasks.md T013 and implementation-summary.md
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 0/1 (deferred, documented reason) |

**Verification Date**: 2026-07-11 — all applicable items verified after tasks.md T001-T021 executed; CHK-042 (README) intentionally deferred to sibling Phase 5 with a documented reason, not a gap.
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
Finding-driven (DR-01..DR-06), authored before implementation — all items intentionally unchecked
-->
