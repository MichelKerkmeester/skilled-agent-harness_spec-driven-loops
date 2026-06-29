---
title: "D6-R9 — Observation/Problem/Fix finding triad"
description: "Add a neutral OBSERVATION slot ahead of PROBLEM and FIX across three sk-design design-audit homes — the audit_contract.md §3 Findings Schema (relabel Impact→Problem, Recommended-fix→Fix, add Observation; keep Evidence/Category/Owner), the audit_report_template.md §3 P0-P3 finding skeletons, and an opt-in proof_check.py --require-observation-triad flag with a validator that fails closed on a missing or placeholder slot — so an audit finding can no longer collapse seeing and judging into one blurry line."
trigger_phrases:
  - "d6-r9 observation problem fix triad"
  - "observation triad design build"
  - "proof check observation triad flag"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/006-d6-corpus-ports/009-observation-problem-fix-triad"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Upgrade spec to Level 2; record opt-in triad + presence-enforced vs neutrality-advisory split"
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
# D6-R9 — Observation/Problem/Fix finding triad

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Enforcement class** | enforceable |
| **Dimension** | D6 — Corpus Ports |
| **Feeds** | D4 |
| **Completed** | 2026-06-29 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
An audit finding used to jump straight to the diagnosis and the fix. The schema carried an Impact slot and a Recommended-fix slot, but nothing recorded the neutral, factual thing the auditor actually saw before judging it. designer-skills-main's critique-composition skill separates a neutral observation from the problem and the fix; sk-design audits had no such slot, so seeing and judging collapsed into one blurry line and a finding's evidence and its verdict were impossible to tell apart.

### Purpose
Port the observation-first finding shape into the design-audit proof surface as a three-slot triad — OBSERVATION (neutral, factual: what was seen) → PROBLEM (how a real user fails or is blocked) → FIX (the change, not the implementation). The triad lands in the two producers of an audit finding (the schema contract and the report template) and is bound to delivery through an opt-in `proof_check.py --require-observation-triad` flag that fails closed on a missing or placeholder slot when asserted, while leaving legacy reports and the default gate untouched.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Relabel and extend the §3 Findings Schema in `audit_contract.md`: `Impact` → `Problem`, `Recommended fix` → `Fix`, and ADD a leading `Observation` slot, keeping `Evidence`, `Category`, and `Owner`; add a one-line house-style note that Observation is neutral and factual and precedes judgment
- Mirror the three slots, in the same order, into the four §3 P0/P1/P2/P3 finding skeletons in `audit_report_template.md`, keeping placeholders fill-in
- Extend `proof_check.py` with an opt-in `--require-observation-triad` flag plus `_validate_observation_triad`, `_find_observation_triad_blocks`, and the `_observation_triad_value` / `_is_observation_triad_placeholder` helpers, with `OBSERVATION_TRIAD_FIELDS = ("Observation", "Problem", "Fix")`; default gate unchanged

### Out of Scope
- The default proof gate behaviour — unchanged; the new flag is opt-in and legacy reports degrade gracefully
- `context_loading_contract.md`, `mode-registry.json`, and the proof/preflight cards — not touched by this triad
- The D6-R6 7-layer accessibility coverage matrix in `audit_contract.md` — preserved unchanged, not extended
- The R5 `--require-decision-rationale` lane — a sibling added it to `proof_check.py` first; this is the second of the two corpus-port checker extensions and does not rebuild the first

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/design-audit/references/audit_contract.md` | Modify | §3 Findings Schema: relabel Impact→Problem and Recommended-fix→Fix, add the leading Observation slot, add the neutrality note; Evidence/Category/Owner and the §3 a11y coverage line preserved |
| `.opencode/skills/sk-design/design-audit/assets/audit_report_template.md` | Modify | §3 P0/P1/P2/P3 finding skeletons each carry the Observation/Problem/Fix slots in order; placeholders stay fill-in |
| `.opencode/skills/sk-design/shared/scripts/proof_check.py` | Modify | Add the opt-in `--require-observation-triad` flag, `_validate_observation_triad`, `_find_observation_triad_blocks`, and helpers; default gate unchanged |
| `.opencode/skills/sk-design/shared/context_loading_contract.md` | Unchanged | Out of scope; not edited |
| `.opencode/skills/sk-design/mode-registry.json` | Unchanged | Out of scope; not edited |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Add the Observation/Problem/Fix triad to the findings schema | `audit_contract.md` §3 carries an `Observation` slot ahead of `Problem` and `Fix`; `Impact` is relabeled `Problem` and `Recommended fix` is relabeled `Fix`; `Evidence`, `Category`, and `Owner` are preserved; a one-line note states Observation is neutral and precedes judgment |
| REQ-002 | Mirror the three slots into the report skeletons | The four §3 finding skeletons (P0/P1/P2/P3) in `audit_report_template.md` each carry `Observation` → `Problem` → `Fix` in order, with fill-in placeholders, so a filled report carries the triad per finding |
| REQ-003 | Add the opt-in flag + validator to the checker, fail-closed when asserted | `proof_check.py --require-observation-triad` fails closed on a finding missing or placeholdering any of the three slots and names the slot; a complete triad passes; the default gate (no flag) is byte-behaviour-identical to before |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Slot labels consistent across the schema, template, and checker | The same three slot names (`Observation`, `Problem`, `Fix`) appear in the schema example, the report skeletons, and the validator's `OBSERVATION_TRIAD_FIELDS` set |
| REQ-005 | Existing flags + base gate non-regressed; R6 a11y matrix + scope clean | `--require-decision-rationale`, `--require-source-proof`, and `--require-application-witness` behave identically before and after; `py_compile` passes; the D6-R6 7-layer accessibility coverage matrix is preserved; no spec/packet/phase IDs in shipped files; only the three named files modified |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The triad is present in `audit_contract.md` §3 (Observation note + the Observation/Evidence/Category/Problem/Fix/Owner example) and in the four §3 skeletons of `audit_report_template.md`; `proof_check.py` carries the opt-in `--require-observation-triad` flag, `_validate_observation_triad`, `_find_observation_triad_blocks`, the `_observation_triad_value` / `_is_observation_triad_placeholder` helpers, and `OBSERVATION_TRIAD_FIELDS = ("Observation", "Problem", "Fix")`.
- **SC-002**: Asserted, the validator bites (tested in isolation from the base gate) — a complete finding (`### P0 - <title>` with Observation/Problem/Fix bullets) returns `{missing:[], ok:True}`; a finding missing the Observation slot returns `{missing:['P0 - ...: Observation missing'], ok:False}` and names the slot; a report with no finding block returns `{missing:['observation-triad findings missing'], ok:False}`.
- **SC-003**: The flag is opt-in and the default gate is unchanged — a legacy report passes a plain run exactly as before; the R5 `--require-decision-rationale` and the `--require-source-proof` / `--require-application-witness` flags are non-regressed; the D6-R6 7-layer accessibility coverage matrix is preserved; `context_loading_contract.md`, `mode-registry.json`, and the cards are untouched; the evergreen scan is clean.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Whether the recorded Observation is genuinely NEUTRAL is not machine-checkable | A grep proves the slot is filled, not that it is free of judgment | **Recorded as advisory.** The validator enforces slot presence and non-placeholder only; observation neutrality stays a review judgment |
| Risk | Whether the critique is CORRECT is not machine-checkable | A present Problem/Fix is not a sound one | **Recorded as advisory.** Slot presence is code-enforced; the soundness of the reasoning stays a review judgment |
| Risk | A new required gate could break legacy reports | A non-opt-in gate would fail every report lacking the triad | **Opt-in by design.** `--require-observation-triad` is off by default; a legacy report degrades gracefully and passes a plain run unchanged |
| Risk | The relabel (Impact→Problem, Recommended-fix→Fix) could silently drop a field | Lost evidence or owner routing | **Additive at the information level.** The Impact and Recommended-fix content folds into Problem and Fix; Evidence, Category, and Owner are kept verbatim; nothing is dropped |
| Dependency | The existing `--require-application-witness` / `--require-decision-rationale` validators | Green | The clone template for `_validate_observation_triad` and the opt-in flag wiring through `check()` / `main()` |
| Dependency | Shared file `audit_contract.md` (also home of the D6-R6 a11y matrix) | Yellow | The R6 accessibility-coverage-matrix phase landed first on `audit_contract.md`; this phase edits §3 only and preserves the a11y matrix |
| Dependency | Shared file `proof_check.py` (also home of the R5 rationale flag) | Yellow | The R5 decision-rationale phase landed first on `proof_check.py`; this is the second of two extensions and appends the triad flag without altering the first |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Integrity
- **NFR-I01**: The port is additive at the information level — the schema gains the Observation slot and relabels two existing slots, the template gains the three slots per skeleton, and the checker gains one validator and one opt-in flag; Evidence, Category, Owner, and the D6-R6 a11y coverage matrix are preserved, and no existing validator or flag is altered.
- **NFR-I02**: For a legacy report the triad is simply absent and the default gate behaves exactly as before; the flag is asserted only when a caller wants the triad enforced.

### Consistency
- **NFR-C01**: The three slot names are identical across the three homes — the schema example, the report skeletons, and the validator's `OBSERVATION_TRIAD_FIELDS` set all read `Observation`, `Problem`, `Fix`.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Validator behaviour (asserted flag)
- **Complete triad** (`### P0 - <title>` with Observation/Problem/Fix bullets, all non-placeholder): → `ok:True`, `missing:[]`.
- **Single slot absent** (Observation bullet removed): → `ok:False`, `missing` names the slot (`P0 - ...: Observation missing`).
- **Slot present but placeholder** (`<...>`, `tbd`, `n/a`): → `ok:False`, the slot is named as a placeholder.
- **No finding block at all**: → `ok:False`, `missing:['observation-triad findings missing']`.

### No-regression
- **Default gate (no flag)**: a legacy report carries no `observation_triad` result and its `missing` set is unchanged; behaviour is identical pre- and post-build.
- **Existing flags**: `--require-decision-rationale`, `--require-source-proof`, and `--require-application-witness` validators and their wiring are untouched and behave identically.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

- **Surface count**: Three artifacts — one schema contract (relabel two slots + add one + a note), one report template (three slots across four skeletons), and one Python checker (one validator, one block finder, two helpers, one opt-in flag threaded through `check()` and `main()`).
- **Risk concentration**: The only judgment-bearing surfaces are whether the Observation is genuinely neutral and whether the critique is correct; both stay advisory. Everything structural — slot presence, non-placeholder, cross-home label consistency, and fail-closed-when-asserted — is checkable by the validator. The blast radius is the design-audit finding surface plus the shared checker; `context_loading_contract.md`, `mode-registry.json`, the cards, and the D6-R6 a11y matrix stay untouched, and the default gate is unchanged.

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Is slot presence enforceable? **RESOLVED: Yes, when the flag is asserted.** `proof_check.py --require-observation-triad` fails closed on a missing or placeholder Observation/Problem/Fix slot and names it; a complete triad passes. Presence and non-placeholder are code-enforced.
- Is Observation NEUTRALITY enforceable? **RESOLVED: No — advisory.** A grep proves the Observation slot is filled, not that it records what was seen without judging it. Whether the Observation is genuinely neutral stays a review judgment.
- Is critique CORRECTNESS enforceable? **RESOLVED: No — advisory.** A present Problem and Fix are not, by their presence, a sound diagnosis or the right change. Soundness stays a review judgment, never certified by the flag.
- Does the relabel drop any field? **RESOLVED: No — additive at the information level.** Impact folds into Problem, Recommended-fix folds into Fix, and Evidence, Category, and Owner are kept verbatim; nothing is dropped.
- Does the triad break legacy reports? **RESOLVED: No — opt-in, graceful degradation.** The flag is off by default; the default gate is byte-behaviour-identical, and a legacy report passes a plain run unchanged.
- Is this the only checker extension? **RESOLVED: No — second of two.** The R5 `--require-decision-rationale` lane landed on `proof_check.py` first; this phase adds the triad flag as the second corpus-port checker extension and does not rebuild the first.

<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`

---

<!--
LEVEL 2 SPEC
- Additive Observation/Problem/Fix triad across the audit schema (§3: relabel Impact→Problem, Recommended-fix→Fix, add Observation; Evidence/Category/Owner kept), the report template (four §3 P0-P3 skeletons), and proof_check.py (opt-in --require-observation-triad flag + _validate_observation_triad + _find_observation_triad_blocks + helpers)
- Honest split: slot presence + non-placeholder code-enforced when the flag is asserted; observation neutrality + critique correctness advisory
- Opt-in by design: default gate unchanged and legacy reports degrade gracefully; second of two proof_check.py extensions (R5 --require-decision-rationale landed first); D6-R6 a11y matrix preserved
- Scope clean (3 files); context_loading_contract.md / mode-registry.json / the cards untouched; GENERATED_METADATA regenerated by the orchestrator
-->
