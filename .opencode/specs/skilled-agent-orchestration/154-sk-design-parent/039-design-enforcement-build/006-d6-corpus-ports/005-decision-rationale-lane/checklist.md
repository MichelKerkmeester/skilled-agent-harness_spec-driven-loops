---
title: "Verification Checklist: DECISION RATIONALE proof lane"
description: "Verification items for the additive conditional six-field DECISION RATIONALE lane across the sk-design context loading contract, proof-of-application card, and proof_check.py: presence/consistency, validator bite, opt-in graceful degradation, fix-completeness, existing-flag no-regression, evergreen, and scope-lock."
trigger_phrases:
  - "decision rationale checklist"
  - "design rationale lane verification"
  - "proof check rationale checklist"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/006-d6-corpus-ports/005-decision-rationale-lane"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Verify every checklist item against the delivered six-field rationale lane"
    next_safe_action: "Let the parent refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/shared/context_loading_contract.md"
      - ".opencode/skills/sk-design/shared/assets/proof_of_application_card.md"
      - ".opencode/skills/sk-design/shared/scripts/proof_check.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: DECISION RATIONALE proof lane

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

- [x] CHK-001 [P0] All three targets read in full before edit, and the additive pattern to mirror confirmed (the existing `--require-application-witness` validator and the contract's conditional proof blocks are the clone template)
  - **Evidence**: the lane mirrors the existing application-witness validator and the §4 audit-evidence block; no new structural form invented
- [x] CHK-002 [P0] Required field shape matches spec exactly (decision, optionsConsidered[], evidenceSources[], tradeoffs[], validationPlan, sourceProofs[]) and the trigger set is direction / pattern-break / handoff
  - **Evidence**: contract block at line 167 lists all six fields (lines 172-182); trigger sentence at line 169; the same six names appear in the card and the validator field set

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `DECISION RATIONALE` field block present in `context_loading_contract.md` under REQUIRED PROOF FIELDS, in the same fenced form as the existing conditional proof blocks, over the six-field shape
  - **Evidence**: `### Decision Rationale` under §4 (line 167); fenced block over decision / optionsConsidered[] / evidenceSources[] / tradeoffs[] / validationPlan / sourceProofs[] (lines 172-182)
- [x] CHK-011 [P0] One conditional rationale row added to the §5 HARD GATES table; every existing gate row unchanged
  - **Evidence**: gate row at line 201 ("Any direction, pattern-break, or handoff claim before ... are recorded"); existing gate rows unchanged
- [x] CHK-012 [P0] The lane mirrored on `proof_of_application_card.md` as a conditional fillable `## 9. DECISION RATIONALE` section over the same six fields, with the opt-in gate-invocation note
  - **Evidence**: `## 9. DECISION RATIONALE` at card line 111; six-row `| Field | Value |` table; gate note at line 113
- [x] CHK-013 [P0] The checker carries the opt-in flag and validator, modeled on `--require-application-witness`
  - **Evidence**: `--require-decision-rationale` flag (line 419), `_validate_decision_rationale` (line 332), `_find_decision_rationale_rows` (line 188), `DECISION_RATIONALE_HEADING` (line 49), `DECISION_RATIONALE_FIELDS` (line 53)
- [x] CHK-014 [P1] The field set is consistent across all three homes (contract shape == card rows == validator field set, same six fields)
  - **Evidence**: the same six field names appear in the contract block, the card rows, and `DECISION_RATIONALE_FIELDS`

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] PRESENCE: the lane exists in all three files with a consistent six-field set (grep the field names across the contract, card, and checker)
  - **Evidence**: grep confirms `DECISION RATIONALE` in the contract (line 167), the card (line 111), and `proof_check.py` (heading regex line 49); the six fields match across all three
- [x] CHK-021 [P0] VALIDATOR BITE: a complete six-field section passes, a missing-field and a no-section case fail with a named gap (tested in isolation from the base gate)
  - **Evidence**: complete → `{missing:[], ok:True}`; `validationPlan` row absent → `{missing:['decision-rationale field missing: validationPlan'], ok:False}`; no section → `{missing:['decision-rationale rows missing'], ok:False}`
- [x] CHK-022 [P1] PLACEHOLDER + single-missing-field cases fail
  - **Evidence**: the live blank card (all `__________`) → `ok:False` naming every field as placeholder; a single missing `validationPlan` fails naming that field
- [x] CHK-023 [P1] OPT-IN: the flag is fully opt-in — a report without the section still passes a plain `proof_check.py` run, and the default gate is byte-behaviour-identical
  - **Evidence**: a legacy report carries no `decision_rationale` result and the same `missing` set with and without the flag; graceful degradation confirmed

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class assigned: unjustified direction/pattern-break/handoff choices are a `class-of-gap` (a verification-floor gap — significant design work could be called done with its reasoning never recorded), not a one-report omission
  - **Evidence**: the fix generalizes the floor from optional prose to a fixed, six-field, opt-in-checkable lane that gates every triggering claim the same way
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed: the contract (SSOT field shape), the proof card (end-of-work fillable), and `proof_check.py` (the enforceable validator) are the producers of the rationale lane; all three carry it consistently
  - **Evidence**: the lane lands in all three — contract §4 + §5 gate row, card `## 9`, and the `proof_check.py` validator + flag; the contract defines, the card mirrors, the checker enforces
- [x] CHK-FIX-003 [P0] Consumer inventory completed: the new lane is consumed by the opt-in `proof_check.py --require-decision-rationale` flag; the default gate does NOT consume it (legacy reports degrade gracefully), which is recorded honestly rather than overclaimed
  - **Evidence**: the enforceable consumer is the asserted flag (fail-closed on a missing/placeholder field); without the flag the base gate is unchanged
- [x] CHK-FIX-004 [P0] Adversarial cases listed for the build to exercise: complete six-field (ok), single missing field (fail naming it), no section (fail), all-placeholder (fail), and the legacy-report-no-flag case (passes)
  - **Evidence**: all five cases covered — complete→ok, missing-field→fail naming the field, no-section→fail, all-placeholder→fail, legacy-no-flag→pass
- [x] CHK-FIX-005 [P1] Matrix axes listed: field state (present / placeholder / absent) × flag (asserted / not asserted) × outcome (pass / fail) — every combination must behave per the additive contract
  - **Evidence**: every combination behaves per the additive contract; the lane only bites when the flag is asserted and a field is missing or placeholder

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] The lane binds a triggering claim to a recorded six-field rationale when asserted, not a self-attested "we thought about it" — a single missing/placeholder field fails the run closed
  - **Evidence**: the §5 HARD GATE row + the asserted validator bind a direction/pattern-break/handoff claim to a recorded rationale; a single missing or placeholder field fails the run
- [x] CHK-031 [P1] Checker performs no network or shell-exec on card content
  - **Evidence**: `_validate_decision_rationale` only reads/parses text and compares against the canonical field set; no network, no shell-exec
- [x] CHK-032 [P1] HONEST scope recorded: field presence and well-formedness are code-enforced when the flag is asserted; whether a live prompt triggers the lane is advisory NL judgment; whether the recorded reasoning is sound is advisory, never certified by the flag
  - **Evidence**: the honest split appears in `spec.md` OPEN QUESTIONS, `plan.md` §1, and the contract note (line 185); a present `validationPlan` is not certified correct

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] Evergreen [HARD]: no spec/packet/phase IDs or spec paths embedded in any of the three shipped files (grep clean)
  - **Evidence**: orchestrator evergreen scan clean across the contract, card, and checker
- [x] CHK-041 [P1] spec/plan/tasks/checklist synchronized on the six-field shape, the three homes, the opt-in graceful-degradation behaviour, and the honest presence-enforceable vs soundness-advisory split
  - **Evidence**: all four docs reflect the six fields, the three homes, opt-in degradation, and the enforceable-vs-advisory split
- [x] CHK-042 [P1] Module docstring + card gate note list the new flag, and the no-regression of existing flags is recorded
  - **Evidence**: `--require-decision-rationale` documented in the docstring usage (line 17), the usage string (line 422), and the card gate note (line 113); `--require-source-proof` / `--require-application-witness` non-regressed
- [x] CHK-043 [P2] First-of-two checker-extension note honoured
  - **Evidence**: spec OPEN QUESTIONS, plan §1, and the implementation-summary record the sibling `--require-observation-triad` as a later extension, not built or claimed this phase

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P0] Only `context_loading_contract.md`, `proof_of_application_card.md`, and `proof_check.py` modified; `audit_contract.md`, `mode-registry.json`, and `interface_preflight_card.md` untouched
  - **Evidence**: orchestrator-verified change set is the three named files; `audit_contract.md` / `mode-registry.json` / `interface_preflight_card.md` carry no decision-rationale content and are untouched
- [x] CHK-051 [P1] No temp/scratch files left outside the scratchpad; the working tree carries only the three modified skills files plus this phase folder's docs
  - **Evidence**: working tree carries the three modified skills files plus this phase folder's docs; no scratch left

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 12 | 12/12 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-06-29
**Verified By**: markdown-agent (independent re-verification of the delivered DECISION RATIONALE lane across the contract + proof card + proof_check.py, with the validator tested in isolation from the base gate)

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
