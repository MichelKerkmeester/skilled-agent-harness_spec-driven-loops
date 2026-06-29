---
title: "Verification Checklist: Variant Parameter Contract"
description: "Verification items for the shared variant_parameter_contract.md transport schema + variant_parameter_check.py gate, including existence, source-consistency, completeness/tamper, transport-conformance, evergreen, and scope-lock acceptance."
trigger_phrases:
  - "variant parameter contract checklist"
  - "variant parameter contract design build"
  - "variant_parameter_check schema gate"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/001-d1-residual-craft/012-variant-parameter-contract"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark all checklist items verified; recompute counts; set verification date"
    next_safe_action: "Run validate.sh --strict; let orchestrator regenerate description and graph metadata"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/shared/assets/variant_parameter_contract.md"
      - ".opencode/skills/sk-design/shared/scripts/variant_parameter_check.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Declaration floor is enforceable (complete cells + all three transports per knob); whether the ranges produce good variants stays advisory"
      - "Gate grades the contract table against the canonical transport set, never a renderer's runtime behavior"
---
# Verification Checklist: Variant Parameter Contract

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

- [x] CHK-001 [P0] Live owner values re-read before authoring (`register.md` density/color-dosage gating, `brief_to_dials.md` dials, `token_starter.md` §TYPE SCALE / §COLOR RAMP)
  - **Evidence**: each knob's range and owner traces to a live owner — interface owns density/structure, foundations owns type-scale/color-amount/pairing; the three numeric ranges equal the spec §4 values
- [x] CHK-002 [P0] Scope frozen to the two NEW files; no existing mode doc/register/token/script/asset/registry edited
  - **Evidence**: the change set adds only `variant_parameter_contract.md` and `variant_parameter_check.py` under `.opencode/skills/sk-design/`; sibling gates, register, and token files untouched

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `variant_parameter_contract.md` exists with the fixed knob-schema table `[Knob, Range/Values, Step, Owner Mode, Transports, Caveat]`
  - **Evidence**: the contract renders one table with the six columns in that order, plus an Overview and an Application Notes block
- [x] CHK-011 [P0] All five knobs present and fully populated — no blank/placeholder cell in any required column (`Knob`, `Range/Values`, `Owner Mode`, `Transports`, `Caveat`)
  - **Evidence**: `variant_parameter_check.py` reports "rows: 5" with zero incomplete required cells; `density`, `type-scale`, `color-amount`, `structure`, `pairing` all present
- [x] CHK-012 [P0] `variant_parameter_check.py` parses the knob table and FAILS on any incomplete required cell (not merely on a missing table)
  - **Evidence**: blanking the type-scale Range/Values cell (scratch copy) yields exit 1, "type-scale: blank range/values"
- [x] CHK-013 [P0] `variant_parameter_check.py` FAILS when a knob omits any canonical transport (`figma`, `open-design`, `live`)
  - **Evidence**: dropping `live` from the density knob (scratch copy) yields exit 1, "density: missing transport live"
- [x] CHK-014 [P1] Owner Mode values are one of `foundations` / `interface` / `motion` / `audit`; `Step` is a number or the explicit `n/a` label for categorical knobs
  - **Evidence**: owners are `interface` (density, structure) and `foundations` (type-scale, color-amount, pairing); steps are `0.1` / `n/a` / `0.05` / `n/a` / `n/a`

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] ACCEPTANCE: `variant_parameter_check.py variant_parameter_contract.md` exits 0 on the complete contract
  - **Evidence**: deterministic exit 0, "rows: 5", "PASS - all variant parameter rows are complete and transport-covered"
- [x] CHK-021 [P0] ACCEPTANCE: an incomplete row (one required cell blanked) exits non-zero
  - **Evidence**: exit 1 with "type-scale: blank range/values" identifying the knob and the empty column
- [x] CHK-022 [P0] ACCEPTANCE: a knob with a dropped canonical transport exits non-zero
  - **Evidence**: exit 1 with "density: missing transport live" identifying the knob and the missing transport
- [x] CHK-023 [P0] ACCEPTANCE: a table with no knob rows exits non-zero (`rows missing`)
  - **Evidence**: the presence guard fires before the per-row scan, emitting "variant-knob rows missing" (exit 1)
- [x] CHK-024 [P1] CONSISTENCY: the three numeric ranges equal the spec §4 values and their cited owner sources (no invented or contradictory numbers)
  - **Evidence**: `density 0.6-1.4`, `type-scale 0.85-1.3`, `color-amount 0-1 step 0.05` each match §4 and the live owner; no contradiction recorded

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
  - **Evidence**: instance-only — this phase adds one shared contract plus one stdlib gate and produces no code-defect findings
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
  - **Evidence**: instance-only; the change set is the two new files and an evergreen grep over both finds no IDs
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
  - **Evidence**: the only consumer of the knob table is `variant_parameter_check.py`; no existing mode doc, register, token file, registry, or checker reads it, so nothing downstream changes
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
  - **Evidence**: adversarial matrix executed — complete contract, blanked required cell, dropped transport, no-rows table, and a no-argument usage call all behave deterministically (0/1/1/1/2)
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
  - **Evidence**: matrix is 4 gate rows (complete / blanked-cell / dropped-transport / no-rows) yielding exits 0/1/1/1 plus usage 2, plus the consistency diff over the three numeric knob ranges
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
  - **Evidence**: not applicable; the gate reads only the target file text and no process-wide state
- [x] CHK-FIX-007 [P1] Evidence is pinned to the delivered files, not a moving branch-relative range.
  - **Evidence**: evidence pins to the knob-schema table block in `variant_parameter_contract.md` and the `check()` / `_transport_present` functions in `variant_parameter_check.py`

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Integrity: the contract is schema-only — it declares knobs, ranges, owners, and transports and does not copy or relocate any mode's rendering logic
  - **Evidence**: each knob names an owner mode that holds the semantics; no owned rendering logic is moved into the contract
- [x] CHK-031 [P1] No false trust signal: the contract is honestly labeled a transport-facing schema, never a user-facing pick-a-vibe chooser, and the gate proves declaration not runtime conformance
  - **Evidence**: the Overview labels it internal transport schema (not a pick-a-vibe menu) and states the gate proves declaration + completeness + transport coverage, not that a renderer honors a range at runtime

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] Evergreen [HARD]: no spec/packet/phase IDs or `specs/` paths embedded in the contract or the gate script
  - **Evidence**: an evergreen grep over both files returns no `specs/` paths and no packet-phase IDs; only skill-relative paths appear
- [x] CHK-041 [P1] spec/plan/tasks/checklist synchronized on the knob set, the schema columns, and the deterministic completeness + transport-conformance acceptance
  - **Evidence**: spec, plan, tasks, checklist, and implementation-summary all carry the same five knobs, the same six-column set, and the same complete/blanked-cell/dropped-transport/no-rows acceptance

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P0] Only `variant_parameter_contract.md` and `variant_parameter_check.py` added; no existing sk-design file modified and hub-route replay 23/5/0 + guard tests unchanged
  - **Evidence**: the change set is exactly those two new files under `.opencode/skills/sk-design/`; no corpus touched, so the router replay (23/5/0) and guard tests are unaffected
- [x] CHK-051 [P1] No temp/scratch files left outside the scratchpad
  - **Evidence**: the tamper/transport fixtures lived only in a `mktemp` scratch dir and were removed; the working tree carries only the two new files

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 17 | 17/17 |
| P1 Items | 8 | 8/8 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-06-29
**Verified By**: orchestrator — verified against the delivered contract + schema gate (exit 0 on the complete contract, exit 1 on a blanked cell and a dropped transport, exit 1 on a no-rows table, exit 2 on usage)

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
