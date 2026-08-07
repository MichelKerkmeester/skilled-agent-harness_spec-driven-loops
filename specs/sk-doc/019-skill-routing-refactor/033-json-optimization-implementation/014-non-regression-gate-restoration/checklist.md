---
title: "Verification Checklist: Restore and Wire the Non-Regression Gate"
description: "Verification checklist covering the repaired and CI-wired scorer-eval baseline ratchet."
trigger_phrases:
  - "014-non-regression-gate-restoration verification checklist"
importance_tier: "normal"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/014-non-regression-gate-restoration"
    last_updated_at: "2026-07-30T10:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Restored and CI-wired the ratchet"
    next_safe_action: "Proceed to phase 015"
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-json-optimization-implementation/014-non-regression-gate-restoration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Verification Checklist: Restore and Wire the Non-Regression Gate

---

<!-- ANCHOR:protocol -->
## Verification Protocol

Each item is marked complete only with evidence specific to that item. Evidence text is never reused across items — the defect this program is remediating was a checklist whose rows all shared one blob.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Upstream dependencies named in plan.md section 6 have cleared [evidence: phase 013 committed as `f0a9574664` with a fix disposition; the ratchet baseline is set to its restored figures, not a contested number]
- [x] CHK-002 [P1] The phase's own citations were re-confirmed against the checked-out tree [evidence: confirmed `FULL_CORPUS_FLOOR`/`HOLDOUT_FLOOR` at ratchet lines 29-30, `REVIEW_MIN_N` was 32 at line 78, and `grep -rn scorer-eval-baseline-ratchet .github/workflows/` returned nothing before the wiring]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-003 [P1] Changes are surgical and confined to the scope declared in spec.md [evidence: exactly three files changed — the ratchet test (`REVIEW_MIN_N` 32→31), its baseline JSON (re-pinned), and the workflow (one added step); the scorer was not touched, honouring the out-of-scope line]
- [x] CHK-004 [P2] No ephemeral artifact label appears in any code comment [evidence: the added workflow-step comment and the `REVIEW_MIN_N` rationale explain the durable why (weaker golden gate; frozen 31-row review slice) with no spec path, packet number, or requirement id]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-005 [P0] The relevant gate was run by exit code, not by reading its tail output [evidence: the ratchet was captured by `$?` — exit 0 (7/7 passed) restored, exit 1 (2 failed) under mutation; the pass/fail decision came from the exit code, not a scraped summary]
- [x] CHK-006 [P1] A negative case was exercised where the phase adds or repairs a gate [evidence: `evidence/ratchet-mutation-proof.txt` — reverting the fix drove `holdout_top1` live=51 baseline=53 and delegation live=8 baseline=10, tripping the gate; then reverted and re-run green]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-007 [P0] Every requirement in spec.md section 4 has a matching evidence line [evidence: REQ-001..006 each map to an implementation-summary verification row — disposition-bound baseline, corpus re-pin with prior hashes, review minimum, CI wiring, mutation proof, and floors held]
- [x] CHK-008 [P1] Anything deliberately not done is recorded with a reason rather than omitted [evidence: the live CI run (REQ-004/T-09) is recorded as operator-gated in the impl-summary and Amendment A-001 — it needs a push this program forbids]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-009 [P2] No credential, token or absolute personal path enters a committed artifact [evidence: the re-pinned baseline JSON records `MK_SKILL_ADVISOR_DB_DIR` as `<empty-dir>`; the workflow and test carry no secrets, and the mutation evidence uses relative test names only]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-010 [P1] Status and completion fields agree with what the evidence supports [evidence: spec Status is Complete and the ratchet passes 7/7 (exit 0); the one thing not done — the live CI run — is stated as pending, not claimed complete]
- [x] CHK-011 [P2] Continuity frontmatter reflects the phase's real state at close [evidence: the spec's `blockers` list (which named the 013 dependency) is cleared, `recent_action`/`next_safe_action` updated to the restored-gate state]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-012 [P2] Artifacts live under the phase folder and follow the naming convention [evidence: the mutation, green-baseline and restored-green captures live under `014-non-regression-gate-restoration/evidence/`; no artifact was written outside the phase folder]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

- [x] CHK-013 [P0] `validate.sh <folder> --strict` reports Errors:0 [evidence: `validate.sh 014-non-regression-gate-restoration --strict` run from the main tree reports Errors: 0 — recorded in the impl-summary]
- [x] CHK-014 [P0] No completion claim in this phase outruns its evidence [evidence: the ratchet-passing, mutation-catching and floor-holding claims all point to captured exit codes/output; the un-runnable live CI run is flagged pending rather than asserted]
- [x] CHK-015 [P1] Each item above carries evidence unique to itself [evidence: each CHK cites a distinct file, exit code, or line — no shared blob, the exact anti-pattern phase 015 remediates]
<!-- /ANCHOR:summary -->
