---
title: "Implementation Summary: Observation/Problem/Fix finding triad"
description: "Post-build record for the additive OBSERVATION/PROBLEM/FIX triad across three sk-design design-audit homes: the audit_contract.md §3 Findings Schema (relabel Impact→Problem and Recommended-fix→Fix, add the leading Observation slot, keep Evidence/Category/Owner), the audit_report_template.md §3 P0-P3 skeletons, and an opt-in --require-observation-triad flag with _validate_observation_triad + _find_observation_triad_blocks + helpers in proof_check.py, with the slot-presence-enforceable vs neutrality/correctness-advisory split, the opt-in graceful-degradation default-gate-unchanged fact, the preserved D6-R6 a11y matrix, and the second-of-two checker-extensions note (R5 --require-decision-rationale landed first)."
trigger_phrases:
  - "d6-r9 observation triad implementation summary"
  - "observation problem fix triad record"
  - "proof check require observation triad summary"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/006-d6-corpus-ports/009-observation-problem-fix-triad"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Record the 3-home observation triad and the presence-enforced vs neutrality-advisory split"
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
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-observation-problem-fix-triad |
| **Completed** | 2026-06-29 |
| **Level** | 2 |
| **Deliverable** | The OBSERVATION/PROBLEM/FIX triad in three homes: `audit_contract.md` (§3 Findings Schema — relabel Impact→Problem, Recommended-fix→Fix, add Observation), `audit_report_template.md` (the four §3 P0-P3 finding skeletons), and `proof_check.py` (opt-in `--require-observation-triad` flag + `_validate_observation_triad` + `_find_observation_triad_blocks` + helpers) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

An audit finding used to collapse seeing and judging into one blurry line: the schema went straight from Evidence to Impact to a Recommended fix, with no slot for the neutral, factual thing the auditor actually saw. This phase splits that line into three checked slots. Every finding now carries a neutral OBSERVATION (what was seen), the user-facing PROBLEM (how a real user fails or is blocked), and the FIX (the change, not the implementation) as distinct slots, so a finding can no longer fuse its evidence and its verdict. The triad is the observation-first shape from designer-skills-main's critique-composition skill, ported into the design-audit surface.

The whole change is additive at the information level, and the new gate is opt-in: legacy reports and the default proof gate see no new requirement.

### The three-slot triad in three homes

The triad lands in the two producers of an audit finding plus the shared checker that enforces it:

- **Schema (single source of truth)** — `audit_contract.md` §3 Findings Schema relabels `Impact` to `Problem` and `Recommended fix` to `Fix`, and adds a leading `Observation` slot. `Evidence`, `Category`, and `Owner` are kept verbatim, and a one-line house-style note states that Observation is neutral and factual and records what was seen before the report states the problem or the fix. The §3 accessibility-coverage line and the D6-R6 7-layer a11y matrix elsewhere in the contract are untouched.
- **Report template (fill-in skeletons)** — `audit_report_template.md` §3 gives the four finding skeletons operators copy (P0/P1/P2/P3). Each now carries the same `Observation` → `Evidence` → `Category` → `Problem` → `Fix` → `Owner` slots in order, with placeholders fill-in, so a filled report carries the triad per finding.
- **Checker (the enforceable form)** — `proof_check.py` gains `_find_observation_triad_blocks` (a finding-heading-scoped block reader keyed off the `### P*` `FINDING_HEADING`), `_validate_observation_triad` (presence + non-placeholder over `OBSERVATION_TRIAD_FIELDS = ("Observation", "Problem", "Fix")`), the `_observation_triad_value` / `_is_observation_triad_placeholder` slot helpers, and an opt-in `--require-observation-triad` flag threaded through `check()`, `main()`, the usage string, and the non-JSON print row.

### The relabel is additive at the information level

The relabel drops nothing. The Impact content folds into Problem and the Recommended-fix content folds into Fix; Evidence, Category, and Owner are kept verbatim; and the leading Observation slot is the only genuinely new field. The D6-R6 7-layer accessibility coverage matrix (its `- layer:` rows and the layer-states vocabulary) is preserved unchanged.

### Opt-in, fail-closed when asserted

The flag is off by default, so the base proof gate is byte-behaviour-identical to before and a legacy report without the triad passes a plain run. When the caller asserts `--require-observation-triad`, the validator merges its `missing` into the result and the run fails closed unless every finding block carries all three slots, non-placeholder. This is the second of two `proof_check.py` extensions in the corpus-port set; the R5 `--require-decision-rationale` flag landed first.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/design-audit/references/audit_contract.md` | Modified | §3 Findings Schema: relabel Impact→Problem and Recommended-fix→Fix, add the leading Observation slot and the neutrality note; Evidence/Category/Owner and the D6-R6 a11y matrix preserved |
| `.opencode/skills/sk-design/design-audit/assets/audit_report_template.md` | Modified | §3 P0/P1/P2/P3 finding skeletons each carry the Observation/Problem/Fix slots in order, placeholders fill-in |
| `.opencode/skills/sk-design/shared/scripts/proof_check.py` | Modified | Add the opt-in `--require-observation-triad` flag, `_validate_observation_triad`, `_find_observation_triad_blocks`, and the `_observation_triad_value` / `_is_observation_triad_placeholder` helpers; default gate unchanged |

`context_loading_contract.md`, `mode-registry.json`, and the proof/preflight cards were left untouched. `audit_contract.md` is shared with the D6-R6 accessibility-coverage-matrix phase (which landed first on that file), and `proof_check.py` is shared with the R5 decision-rationale phase (which landed first on that file); this phase edits the schema's §3 only and appends the triad validator after the existing ones.

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementer (`cli-codex gpt-5.5 xhigh fast`) relabeled the §3 schema (`Impact` → `Problem`, `Recommended fix` → `Fix`), added the leading `Observation` slot and the neutrality note, mirrored the three slots into the four §3 report skeletons, and extended `proof_check.py` with the opt-in `--require-observation-triad` flag plus `_validate_observation_triad`, `_find_observation_triad_blocks`, and the two slot helpers, modeled on the existing `--require-application-witness` validator, keeping every change additive. The orchestrator then verified the result independently, testing the validator in isolation from the full base gate so no pipe-masking could hide a failure: a complete finding (`### P0 - <title>` with Observation/Problem/Fix bullets) returned `{missing:[], ok:True}`; a finding missing the Observation slot returned `{missing:['P0 - ...: Observation missing'], ok:False}` and named the slot; a report with no finding block returned `{missing:['observation-triad findings missing'], ok:False}`. The default gate is unchanged — a legacy report carries no `observation_triad` result and the same `missing` set with and without the build, so the flag degrades gracefully; the existing `--require-decision-rationale`, `--require-source-proof`, and `--require-application-witness` paths still behave; and `py_compile` passes. The D6-R6 7-layer accessibility coverage matrix is preserved (the seven `- layer:` rows and the layer-states vocabulary), Evidence/Category/Owner are kept, `context_loading_contract.md` / `mode-registry.json` / the cards are untouched, and the evergreen scan is clean. This documentation independently re-ran the isolated bite, the `py_compile`, and the preserved-matrix checks; it writes only the phase-folder docs and touches no live skill, template, or script file.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Clone the application-witness validator instead of inventing a new mechanism | `proof_check.py` already carries three conditional validators with a proven shape — a heading/block reader, a presence/non-placeholder validator, and an opt-in `--require-*` flag. The triad is the next instance of that pattern, so it adds no new machinery and stays trivially reviewable against the prior three |
| Relabel Impact→Problem and Recommended-fix→Fix rather than add Problem/Fix alongside them | Two slots already carried the diagnosis and the change. Relabeling keeps the finding at the same field count plus one new Observation slot, so the schema gains a neutral slot without duplicating the verdict; the content folds across cleanly and nothing is dropped |
| Make the flag opt-in rather than a default gate | A required triad gate would fail every legacy report lacking the slots. An opt-in flag lets the caller assert it for audits that want the triad enforced, and legacy reports degrade gracefully |
| Enforce slot presence and non-placeholder, leave neutrality and correctness advisory | A checker can prove the three slots are present and non-placeholder; it cannot prove the Observation is genuinely neutral or the critique is correct. A grep proves the slots are filled, not that the reasoning is sound, so both stay review judgments, never certified by the flag |
| Preserve the D6-R6 a11y matrix and edit only §3 | `audit_contract.md` is shared with the accessibility-coverage-matrix phase, which landed first. Scoping this phase to the §3 Findings Schema keeps the 7-layer matrix and its vocabulary intact and avoids any overwrite |
| Ship the triad flag only; name the rationale flag as the first extension | This is the second of two `proof_check.py` corpus-port extensions. The R5 `--require-decision-rationale` flag is recorded honestly as the first, landed by a sibling, rather than rebuilt or claimed here |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Triad present in the schema | PASS, `audit_contract.md` §3 carries the Observation note (line 92) and the example finding with Observation/Evidence/Category/Problem/Fix/Owner (lines 96-102) |
| Triad present in the report skeletons | PASS, the four §3 skeletons each carry Observation/Problem/Fix in order — P0 lines 57-63, P1 69-75, P2 81-87, P3 93-99 |
| Checker flag + validator + helpers present | PASS, `--require-observation-triad` (argv line 513), `_validate_observation_triad` (line 420), `_find_observation_triad_blocks` (line 247), `_observation_triad_value` (line 227), `_is_observation_triad_placeholder` (line 240), `OBSERVATION_TRIAD_FIELDS` (line 62), threaded through `check()` and `main()` |
| Validator bite — complete | PASS, complete finding → `{missing:[], ok:True}` (tested in isolation from the base gate) |
| Validator bite — missing Observation | PASS, Observation slot removed → `{missing:['P0 - ...: Observation missing'], ok:False}`, names the slot |
| Validator bite — no finding block | PASS, report with no `### P*` block → `{missing:['observation-triad findings missing'], ok:False}` |
| Default gate unchanged (graceful degradation) | PASS, `require_observation_triad` defaults False; a legacy report carries no `observation_triad` result and the same `missing` set with/without the flag |
| Existing flags non-regressed | PASS, `_validate_source_proof` (line 278), `_validate_application_witness` (line 335), and `_validate_decision_rationale` (line 378) still present and behave identically; their flags untouched |
| `py_compile` | PASS, `python3 -m py_compile proof_check.py` clean |
| Slot set consistent across the three homes | PASS, `Observation` / `Problem` / `Fix` appear in the schema example, the four skeletons, and `OBSERVATION_TRIAD_FIELDS` |
| Relabel additive — Evidence/Category/Owner kept | PASS, all three fields present in the §3 example (Evidence line 97, Category line 98, Owner line 102); Impact folded into Problem, Recommended-fix into Fix, nothing dropped |
| D6-R6 7-layer a11y matrix preserved | PASS, seven `- layer:` rows (lines 49-73) + the layer-states vocabulary (line 79) + the §3 coverage line (line 99) intact |
| Scope: only the three named files edited | PASS, `context_loading_contract.md`, `mode-registry.json`, and the cards carry no observation-triad content and are untouched |
| Evergreen: no spec/packet/phase IDs | PASS, orchestrator evergreen scan clean across all three files |
| `validate.sh --strict` (phase folder) | PASS for all non-generated checks; see GENERATED_METADATA residual below |
| GENERATED_METADATA residual (`description.json` level, `graph-metadata.json` status + source_fingerprint) | EXPECTED, the orchestrator regenerates these; the level/status/fingerprint drift is not hand-written |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Slot presence is enforceable; observation neutrality is not.** When `--require-observation-triad` is asserted, the validator fails closed on a missing or placeholder slot — presence and non-placeholder are code-enforced. Whether the Observation is genuinely neutral, recording what was seen without judging it, stays advisory: a grep proves the slot is filled, not that it is free of judgment.
2. **Critique correctness is not enforceable.** A present Problem and Fix are not, by their presence, a sound diagnosis or the right change. The flag certifies the three slots exist; whether the critique is correct stays a review judgment.
3. **The triad is opt-in, so it only bites when asserted.** The default gate is unchanged and a legacy report passes a plain run; the triad gate fires only when a build, delivery, or CI step passes `--require-observation-triad`. This is graceful degradation by design, not a gap.
4. **The decision-rationale flag is a sibling's work.** This phase ships the observation-triad flag only. The `--require-decision-rationale` extension to `proof_check.py` is the first of the two corpus-port checker extensions and was added by the R5 lane, recorded honestly rather than claimed here.
5. **GENERATED_METADATA stays stale until the orchestrator regenerates it.** `description.json` (`level: "1"`) and `graph-metadata.json` (`status: "planned"`, `source_fingerprint`) are generated artifacts; this phase does not hand-write them, so `validate.sh --strict` reports them as an expected residual until a metadata save runs.

<!-- /ANCHOR:limitations -->

---

<!--
LEVEL 2 IMPLEMENTATION SUMMARY
- Additive OBSERVATION/PROBLEM/FIX triad across the audit schema (§3: relabel Impact→Problem, Recommended-fix→Fix, add Observation; Evidence/Category/Owner kept), the report template (four §3 P0-P3 skeletons), and proof_check.py (opt-in --require-observation-triad flag + _validate_observation_triad + _find_observation_triad_blocks + helpers)
- Honest split: slot presence + non-placeholder code-enforced when the flag is asserted; observation neutrality + critique correctness advisory
- Opt-in graceful degradation: default gate unchanged, legacy reports pass a plain run; existing flags + py_compile non-regressed; D6-R6 a11y matrix preserved
- Second of two proof_check.py extensions (R5 --require-decision-rationale landed first); scope clean (3 files); GENERATED_METADATA regenerated by the orchestrator
-->
