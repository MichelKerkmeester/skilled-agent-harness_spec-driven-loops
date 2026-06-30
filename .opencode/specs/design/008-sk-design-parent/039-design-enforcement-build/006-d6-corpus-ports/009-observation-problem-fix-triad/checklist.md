---
title: "Verification Checklist: Observation/Problem/Fix finding triad"
description: "Priority-tagged verification for the OBSERVATION slot port across the audit schema and report skeletons and the opt-in proof_check.py --require-observation-triad gate, including a fix-completeness pass on the triad shape, the bite, the relabel additivity, the preserved D6-R6 a11y matrix, evergreen content, and no-regression of the existing flags."
trigger_phrases:
  - "observation problem fix triad checklist"
  - "audit finding triad verification"
  - "require observation triad gate checklist"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/006-d6-corpus-ports/009-observation-problem-fix-triad"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Verify every checklist item against the delivered observation-triad build"
    next_safe_action: "Let the parent refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-audit/references/audit_contract.md"
      - ".opencode/skills/sk-design/design-audit/assets/audit_report_template.md"
      - ".opencode/skills/sk-design/shared/scripts/proof_check.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Observation/Problem/Fix finding triad

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

- [x] CHK-001 [P0] All three targets read in full before edit, and the additive pattern to mirror confirmed (the existing `--require-application-witness` / `--require-decision-rationale` validators are the clone template)
  - **Evidence**: the triad validator mirrors the existing application-witness validator shape; no new structural form invented
- [x] CHK-002 [P0] Slot-label mapping decided and recorded before any edit: relabel `Impact` → `Problem`, `Recommended fix` → `Fix`, add leading `Observation`; keep `Evidence`, `Category`, `Owner`; triad shape is OBSERVATION (neutral) → PROBLEM (user fails) → FIX (the change)
  - **Evidence**: mapping recorded in spec §3 SCOPE and tasks T002; the same three slot names appear in the schema, the skeletons, and the validator field set

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] §3 Findings Schema in `audit_contract.md` carries the leading `Observation` slot, with `Impact` relabeled `Problem` and `Recommended fix` relabeled `Fix`; Evidence, Category, Owner kept
  - **Evidence**: example finding slots at lines 96-102 (Observation 96, Evidence 97, Category 98, Problem 100, Fix 101, Owner 102); neutrality note at line 92
- [x] CHK-011 [P0] The four §3 finding skeletons (P0/P1/P2/P3) in `audit_report_template.md` each carry `Observation` → `Problem` → `Fix` in order, placeholders fill-in
  - **Evidence**: P0 lines 57-63, P1 69-75, P2 81-87, P3 93-99; each skeleton carries Observation/Evidence/Category/Problem/Fix/Owner
- [x] CHK-012 [P0] `proof_check.py` carries the opt-in flag and validator, modeled on `--require-application-witness`
  - **Evidence**: `--require-observation-triad` argv (line 513), `_validate_observation_triad` (line 420), `_find_observation_triad_blocks` (line 247), `_observation_triad_value` (line 227), `_is_observation_triad_placeholder` (line 240), `OBSERVATION_TRIAD_FIELDS` (line 62)
- [x] CHK-013 [P1] Slot matchers are case-insensitive and bullet/bold tolerant, consistent with the existing matchers, and the checker targets `### P*` finding blocks, not prose
  - **Evidence**: `_observation_triad_value` uses a case-insensitive bullet/bold-tolerant regex; `_find_observation_triad_blocks` anchors on the `FINDING_HEADING` (`### P*`) blocks

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] PRESENCE: the triad exists in all three files with a consistent three-slot set (grep the slot names across the schema, skeletons, and checker)
  - **Evidence**: grep confirms `Observation`/`Problem`/`Fix` in `audit_contract.md` §3, the four `audit_report_template.md` skeletons, and `OBSERVATION_TRIAD_FIELDS` in `proof_check.py`
- [x] CHK-021 [P0] VALIDATOR BITE: a complete triad passes; a finding missing OBSERVATION and a no-finding report fail with a named gap (tested in isolation from the base gate)
  - **Evidence**: complete → `{missing:[], ok:True}`; Observation slot removed → `{missing:['P0 - ...: Observation missing'], ok:False}`; no finding block → `{missing:['observation-triad findings missing'], ok:False}`
- [x] CHK-022 [P1] PLACEHOLDER case fails: a slot present but holding `<...>` / `tbd` / `n/a` is rejected
  - **Evidence**: `_is_observation_triad_placeholder` matches `<...>`, `...`, `tbd`, `todo`, `n/a` and the base placeholder set; a placeholder slot fails the run naming it

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class assigned: a finding that collapses seeing and judging into one line is a `class-of-gap` (every audit finding could blur evidence and verdict), not a one-report omission
  - **Evidence**: the fix generalizes the floor from a two-slot Impact/Recommended-fix shape to a fixed three-slot, opt-in-checkable triad that gates every finding the same way
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed: the schema (SSOT finding shape) and the report template (fill-in skeletons) are the producers of a finding; both carry the triad consistently, and the checker enforces it
  - **Evidence**: the triad lands in both producers — `audit_contract.md` §3 and the four `audit_report_template.md` skeletons — and the `proof_check.py` validator enforces it
- [x] CHK-FIX-003 [P0] Consumer inventory completed: the new triad is consumed by the opt-in `proof_check.py --require-observation-triad` flag; the default gate does NOT consume it (legacy reports degrade gracefully), recorded honestly rather than overclaimed
  - **Evidence**: the enforceable consumer is the asserted flag (fail-closed on a missing/placeholder slot); without the flag the base gate is unchanged
- [x] CHK-FIX-004 [P0] Adversarial cases listed and exercised: complete triad (ok), single missing slot (fail naming it), no finding block (fail), placeholder slot (fail), and the legacy-report-no-flag case (passes)
  - **Evidence**: all five cases covered — complete→ok, missing-Observation→fail naming the slot, no-finding→fail, placeholder→fail, legacy-no-flag→pass
- [x] CHK-FIX-005 [P1] Relabel additivity verified: every existing finding field's content survives — Evidence, Category, Owner kept; Impact content folds into Problem and Recommended-fix into Fix; the D6-R6 7-layer a11y matrix preserved; nothing dropped
  - **Evidence**: Evidence/Category/Owner present in the §3 example; 7 `- layer:` rows (lines 49-73) + the layer-states vocabulary (line 79) + the §3 coverage line (line 99) intact

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] The triad binds a finding to a recorded three-slot shape when asserted, not a self-attested "we looked" — a single missing or placeholder slot fails the run closed
  - **Evidence**: the asserted validator fails closed on any missing or placeholder Observation/Problem/Fix slot and names it
- [x] CHK-031 [P1] Checker performs no network or shell-exec on report content
  - **Evidence**: `_validate_observation_triad` only reads/parses text and compares against `OBSERVATION_TRIAD_FIELDS`; no network, no shell-exec
- [x] CHK-032 [P1] HONEST scope recorded: slot presence and non-placeholder are code-enforced when the flag is asserted; whether the Observation is genuinely NEUTRAL and whether the critique is CORRECT stay advisory, never certified by the flag
  - **Evidence**: the honest split appears in `spec.md` OPEN QUESTIONS, `plan.md` §1, and the risks table; a grep proves the slots are filled, not that the reasoning is sound

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] Evergreen [HARD]: no spec/packet/phase IDs or spec paths embedded in any of the three shipped files (grep clean)
  - **Evidence**: orchestrator evergreen scan clean across the schema, the template, and the checker
- [x] CHK-041 [P1] spec/plan/tasks/checklist synchronized on the three-slot shape, the relabel mapping, the opt-in graceful-degradation behaviour, and the honest presence-enforceable vs neutrality/correctness-advisory split
  - **Evidence**: all four docs reflect the three slots, the Impact→Problem / Recommended-fix→Fix relabel, opt-in degradation, and the enforceable-vs-advisory split
- [x] CHK-042 [P1] Module usage + the schema neutrality note list the new flag and the preserved fields; no-regression of the existing flags recorded
  - **Evidence**: `--require-observation-triad` in the docstring usage (line 18) and the usage string (line 516); `--require-decision-rationale` / `--require-source-proof` / `--require-application-witness` non-regressed
- [x] CHK-043 [P2] Second-of-two checker-extension note honoured
  - **Evidence**: spec OPEN QUESTIONS, plan §1, and the implementation-summary record the R5 `--require-decision-rationale` flag as the first extension and this triad flag as the second, not rebuilt or claimed twice

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P0] Only the three named targets modified; `context_loading_contract.md`, `mode-registry.json`, and the proof/preflight cards untouched
  - **Evidence**: orchestrator-verified change set is the three named files; `context_loading_contract.md` / `mode-registry.json` / the cards carry no observation-triad content and are untouched
- [x] CHK-051 [P1] No temp/scratch files left outside the scratchpad; the working tree carries only the three modified skills files plus this phase folder's docs
  - **Evidence**: working tree carries the three modified skills files plus this phase folder's docs; no scratch left

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 14/14 |
| P1 Items | 8 | 8/8 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-06-29
**Verified By**: markdown-agent (independent re-verification of the delivered OBSERVATION/PROBLEM/FIX triad across the audit schema + report skeletons + proof_check.py, with the validator tested in isolation from the base gate)

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
