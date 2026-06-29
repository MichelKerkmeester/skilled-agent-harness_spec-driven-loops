---
title: "Implementation Summary: DECISION RATIONALE proof lane"
description: "Post-build record for the additive six-field DECISION RATIONALE lane across three sk-design homes: the context loading contract field shape + one §5 HARD GATE row, the proof-of-application card ## 9 conditional fillable section, and an opt-in --require-decision-rationale flag with _validate_decision_rationale + _find_decision_rationale_rows in proof_check.py, with the presence-enforceable vs rationale-soundness-advisory split, the opt-in graceful-degradation default-gate-unchanged fact, and the first-of-two checker extensions note (sibling adds --require-observation-triad later)."
trigger_phrases:
  - "d6-r5 decision rationale implementation summary"
  - "decision rationale proof lane record"
  - "proof check require decision rationale summary"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/006-d6-corpus-ports/005-decision-rationale-lane"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Record the 3-home rationale lane, the opt-in flag, and the enforce-presence vs soundness split"
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
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-decision-rationale-lane |
| **Completed** | 2026-06-29 |
| **Level** | 2 |
| **Deliverable** | The six-field DECISION RATIONALE lane in three homes: `context_loading_contract.md` (§4 field shape + one §5 HARD GATE row), `proof_of_application_card.md` (`## 9` conditional fillable section), and `proof_check.py` (opt-in `--require-decision-rationale` flag + `_validate_decision_rationale` + `_find_decision_rationale_rows`) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

"Why did we choose this" used to be optional prose that vanished the moment a direction hardened. This phase turns it into a checked, opt-in contract: when a direction, pattern-break, or handoff report is gated with `--require-decision-rationale`, it must carry six well-formed fields — what was decided, what options were weighed, what evidence informed it, the trade-offs accepted, a validation plan, and cited source proofs — or the checker fails it closed. The lane is the third conditional proof lane in sk-design, modeled directly on the existing application-witness lane, so it reuses a proven shape rather than inventing a new mechanism.

The whole change is additive across three files, and the flag is opt-in: legacy reports and non-triggering work see no new gate.

### The six-field rationale lane in three homes

The lane lands in the three producers of the design proof surface, each in the form that home already uses:

- **Contract (single source of truth)** — `context_loading_contract.md` gains a `### Decision Rationale` field shape under §4 REQUIRED PROOF FIELDS, a fenced block over the fixed six fields (`decision`, `optionsConsidered[]`, `evidenceSources[]`, `tradeoffs[]`, `validationPlan`, `sourceProofs[]`), in the same form as the existing `Audit Evidence` conditional block. The trigger — work that sets direction, breaks an established pattern, or hands rationale to another worker or context — is named inline, and non-triggering work marks the lane N/A.
- **Proof-of-application card (end-of-work)** — `proof_of_application_card.md` gains a conditional fillable `## 9. DECISION RATIONALE` section over the same six fields as a `| Field | Value |` table, with a note that it is filled only for triggering work and the opt-in gate invocation `python3 ../scripts/proof_check.py --require-decision-rationale <this-file>.md`.
- **Checker (the enforceable form)** — `proof_check.py` gains `_find_decision_rationale_rows` (a heading-scoped table reader keyed off a `DECISION_RATIONALE_HEADING` regex), `_validate_decision_rationale` (presence + non-placeholder over the canonical six-field set), and an opt-in `--require-decision-rationale` flag threaded through `check()`, `main()`, the usage string, and the non-JSON print row.

### The §5 HARD GATE row

The contract §5 HARD GATES table gains one conditional rationale row: any direction, pattern-break, or handoff claim is blocked before the decision, considered options, evidence sources, trade-offs, validation plan, and source proofs are recorded. Every existing gate row is unchanged.

### Opt-in, fail-closed when asserted

The flag is off by default, so the base proof gate is byte-behaviour-identical to before and a legacy report without the section passes a plain run. When the caller asserts `--require-decision-rationale` for triggering work, the validator merges its `missing` into the result and the run fails closed unless all six fields are present and non-placeholder. This is the first of two `proof_check.py` extensions in the corpus-port set; a sibling appends `--require-observation-triad` after it.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/shared/context_loading_contract.md` | Modified | Add the `### Decision Rationale` six-field shape under §4 and one conditional row to the §5 HARD GATES table; additive, no existing field removed |
| `.opencode/skills/sk-design/shared/assets/proof_of_application_card.md` | Modified | Add the conditional fillable `## 9. DECISION RATIONALE` section over the six fields, with the opt-in gate-invocation note |
| `.opencode/skills/sk-design/shared/scripts/proof_check.py` | Modified | Add the opt-in `--require-decision-rationale` flag, `_validate_decision_rationale`, and `_find_decision_rationale_rows`, cloning the application-witness validator; default gate unchanged |

`audit_contract.md`, `mode-registry.json`, and `interface_preflight_card.md` were left untouched, and the contract and card edits are append-only — R4's interaction-state-matrix lane and every existing field are preserved with 0 removed.

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementer (`cli-codex gpt-5.5 xhigh fast`) appended the six-field shape and the §5 gate row to the contract, mirrored the lane as the `## 9` conditional fillable section on the proof card, and extended `proof_check.py` with the opt-in `--require-decision-rationale` flag plus `_validate_decision_rationale` and `_find_decision_rationale_rows`, modeled on the existing `--require-application-witness` validator, keeping every change additive. The orchestrator then verified the result independently, testing the validator in isolation from the full base gate so no pipe-masking could hide a failure: a complete six-field table returned `{missing:[], ok:True}`; a table whose `validationPlan` row is absent returned `{missing:['decision-rationale field missing: validationPlan'], ok:False}`; a report with no rationale section returned `{missing:['decision-rationale rows missing'], ok:False}`. The default gate is unchanged — a legacy report carries no `decision_rationale` result and the same `missing` set with and without the build, so the flag degrades gracefully; the existing `--require-source-proof` and `--require-application-witness` paths still behave; and `py_compile` passes. The contract and card are append-only (R4's interaction-state-matrix lane and existing fields preserved, 0 removed), `audit_contract.md` / `mode-registry.json` / `interface_preflight_card.md` are untouched, and the evergreen scan is clean. This documentation records and re-verifies that work; it writes only the phase-folder docs and touches no live skill, card, or script file.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Clone the application-witness lane instead of inventing a new mechanism | `proof_check.py` already carries two conditional validators with a proven shape — a heading regex, a row finder, a validator, and an opt-in flag. The rationale lane is the third instance of that exact pattern, so it adds no new machinery and stays trivially reviewable against the prior two |
| Make the flag opt-in rather than a default gate | A direction/pattern-break/handoff lane does not apply to most reports. Gating it by default would fail every legacy report lacking the section; an opt-in flag lets the caller assert it only for triggering work, and legacy reports degrade gracefully |
| Enforce field presence and well-formedness, leave soundness advisory | A checker can prove the six fields are present and non-placeholder; it cannot prove the recorded options, trade-offs, or validation plan are correct. A present `validationPlan` is not a correct one, so soundness is honestly recorded as a review judgment, never certified by the flag |
| Keep the contract and card append-only | The contract and card are shared with sibling lanes (R4's interaction-state-matrix landed first). Appending the new field block, gate row, and card section after what exists preserves every prior field with 0 removed and avoids any overwrite |
| Ship the rationale flag only; name the observation-triad as a sibling | This is the first of two `proof_check.py` extensions in the corpus-port set. The `--require-observation-triad` flag is a sibling's work, recorded honestly as a later extension rather than bundled or claimed here |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Six-field shape present in the contract | PASS, `### Decision Rationale` under §4 (contract line 167); the fenced block lists `decision`, `optionsConsidered[]`, `evidenceSources[]`, `tradeoffs[]`, `validationPlan`, `sourceProofs[]` (lines 172-182) |
| §5 HARD GATE row present | PASS, Decision Rationale gate row at contract line 201 ("Any direction, pattern-break, or handoff claim before ... are recorded"); existing gate rows unchanged |
| Proof card mirror | PASS, `## 9. DECISION RATIONALE` at card line 111; conditional fillable `| Field | Value |` table over the six fields with the opt-in gate-invocation note |
| Checker flag + validator present | PASS, `--require-decision-rationale` flag, `_validate_decision_rationale` (line 332), and `_find_decision_rationale_rows` (line 188) present in `proof_check.py`, threaded through `check()` and `main()` |
| Validator bite — complete | PASS, complete six-field table → `{missing:[], ok:True}` (tested in isolation from the base gate) |
| Validator bite — missing field | PASS, `validationPlan` row absent → `{missing:['decision-rationale field missing: validationPlan'], ok:False}` |
| Validator bite — no section | PASS, report with no rationale section → `{missing:['decision-rationale rows missing'], ok:False}` |
| Default gate unchanged (graceful degradation) | PASS, a legacy report carries no `decision_rationale` result and the same `missing` set with/without the flag; the base gate is byte-behaviour-identical |
| Existing flags non-regressed | PASS, `--require-source-proof` and `--require-application-witness` validators and wiring untouched; `_validate_source_proof` / `_validate_application_witness` still present and behave identically |
| `py_compile` | PASS, `python3 -m py_compile proof_check.py` clean |
| Field set consistent across the three homes | PASS, the same six field names appear in the contract shape, the proof-card rows, and the validator's `DECISION_RATIONALE_FIELDS` set |
| Append-only (R4 preserved) | PASS, `interaction state matrix` still present in the contract (3 mentions) and the proof card (`## 8`); the rationale additions follow it with 0 lines removed |
| Scope: only the three named files edited | PASS, `audit_contract.md`, `mode-registry.json`, and `interface_preflight_card.md` carry no decision-rationale content and are untouched |
| Evergreen: no spec/packet/phase IDs | PASS, orchestrator evergreen scan clean across all three files |
| `validate.sh --strict` (phase folder) | PASS for all non-generated checks; see GENERATED_METADATA residual below |
| GENERATED_METADATA residual (`description.json` level, `graph-metadata.json` source_fingerprint + status) | EXPECTED, the orchestrator regenerates these; the level/fingerprint/status drift is not hand-written |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Field presence is enforceable; rationale soundness is not.** When `--require-decision-rationale` is asserted, the validator fails closed on a missing or placeholder field — presence and well-formedness are code-enforced. Whether the recorded options, trade-offs, and validation plan are correct stays advisory: a present `validationPlan` is not a correct one, and no checkbox certifies the quality of the reasoning.
2. **Live triggering is caller judgment.** Whether a given prompt is a direction, pattern-break, or handoff one is not inferred by the checker; the flag is asserted by the caller for triggering work. The contract documents the trigger cues, but live triggering is advisory.
3. **The lane is opt-in, so it only bites when asserted.** The default gate is unchanged and a legacy report passes a plain run; the rationale gate fires only when a build, delivery, or CI step passes `--require-decision-rationale`. This is graceful degradation by design, not a gap.
4. **The observation-triad flag is a sibling's work.** This phase ships the decision-rationale flag only. The `--require-observation-triad` extension to `proof_check.py` is the second of the two corpus-port checker extensions and is added by a sibling lane, recorded honestly rather than claimed here.
5. **GENERATED_METADATA stays stale until the orchestrator regenerates it.** `description.json` (`level: "1"`) and `graph-metadata.json` (`source_fingerprint`, `status: "planned"`) are generated artifacts; this phase does not hand-write them, so `validate.sh --strict` reports them as an expected residual until a metadata save runs.

<!-- /ANCHOR:limitations -->

---

<!--
LEVEL 2 IMPLEMENTATION SUMMARY
- Additive six-field DECISION RATIONALE lane across the contract (§4 field shape + one §5 HARD GATE row), the proof card (## 9 conditional fillable), and proof_check.py (opt-in --require-decision-rationale flag + _validate_decision_rationale + _find_decision_rationale_rows)
- Honest split: field presence + well-formedness code-enforced when the flag is asserted; rationale soundness + live triggering advisory
- Opt-in graceful degradation: default gate unchanged, legacy reports pass a plain run; existing flags + py_compile non-regressed
- First of two proof_check.py extensions (sibling adds --require-observation-triad later); scope clean (3 files, append-only); GENERATED_METADATA regenerated by the orchestrator
-->
