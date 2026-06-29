---
title: "D6-R6 — ACCESSIBILITY COVERAGE matrix"
description: "Reshape the single a11y dimension under AUDIT EVIDENCE into a seven-layer keyboard/screen-reader/zoom-reflow/contrast/reduced-motion/assistive-tech/user-testing coverage matrix, each layer carrying a confirmed/inferred/blocked/not-assessed state, mirrored into audit_contract.md so a WCAG/ready claim must walk every resolved layer; no new checker — the existing audit gate walks the matrix."
trigger_phrases:
  - "d6-r6 accessibility coverage matrix"
  - "accessibility coverage design build"
  - "seven layer a11y matrix contract"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/006-d6-corpus-ports/006-accessibility-coverage-matrix"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Upgrade spec to Level 2; record 7-layer a11y matrix and shape-vs-truthfulness split"
    next_safe_action: "Let the parent refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/shared/context_loading_contract.md"
      - ".opencode/skills/sk-design/design-audit/references/audit_contract.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# D6-R6 — ACCESSIBILITY COVERAGE matrix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Enforcement class** | hybrid |
| **Dimension** | D6 — Corpus Ports |
| **Feeds** | D4 |
| **Completed** | 2026-06-29 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Accessibility used to collapse into a single field. In the AUDIT EVIDENCE proof block, `accessibility:` was one line under `dimensions:`, and in the audit output contract it was one row of a five-dimension `/20` score. A WCAG, accessible, release-ready, or production-ready claim could therefore pass with a single vague checkbox standing in for keyboard support, screen-reader behaviour, zoom/reflow, contrast, reduced motion, assistive technology, and real user testing all at once. Partial or unverified coverage was hidden behind that one cell. The external corpus `accessibility-test-plan` already defines a layered test matrix, but sk-design had no per-layer ledger that forced each accessibility layer to declare its own honest coverage state.

### Purpose
Reshape the single a11y dimension into a **seven-layer ACCESSIBILITY COVERAGE MATRIX** — keyboard, screen-reader, zoom-reflow, contrast, reduced-motion, assistive-tech, user-testing — where every layer carries one of four honest coverage states: **confirmed | inferred | blocked | not-assessed**. Replace the single vague field with a per-layer ledger that makes partial or unverified coverage legible instead of letting it hide behind one checkbox. Mirror the same matrix into the audit findings/score contract so a WCAG/ready claim must walk every layer as a resolved state. Ship no new checker: the matrix lives inside the existing AUDIT EVIDENCE block, so the existing audit gate walks it — its shape is provable, its honesty is not.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Reshape the single `accessibility:` line under `dimensions:` in the AUDIT EVIDENCE block (`context_loading_contract.md` §4) **in place** into a seven-layer `coverage:` sub-object — keyboard / screen-reader / zoom-reflow / contrast / reduced-motion / assistive-tech / user-testing — each layer carrying a `confirmed | inferred | blocked | not-assessed` state plus `evidence` and `blocker/what would confirm` lines
- Add the resolution rule under the block: a layer is resolved only when `confirmed`, `inferred`, or `blocked` with a reason; any `not-assessed` layer blocks WCAG / accessible / release-ready / production-ready claims; `blocked` is an honest resolved-with-reason state, not a pass
- Mirror the same seven-layer matrix and four-state vocabulary into the audit findings/score contract (`audit_contract.md` §2 Five-Dimension Score) as an "Accessibility Coverage Matrix" subsection that the Accessibility `/4` rating and any WCAG/ready claim must carry

### Out of Scope
- Any new checker — **no new `.py` or `.mjs` is added.** The matrix lives inside the existing AUDIT EVIDENCE block, so the existing audit gate walks it; `proof_check.py` is not modified and does not parse per-layer state
- `proof_check.py`, `audit_report_template.md`, `mode-registry.json`, and the proof/pre-flight cards — not touched by this phase
- R4's INTERACTION STATE MATRIX lane and R5's DECISION RATIONALE lane in the shared contract — preserved, not edited
- The router, scorer, and benchmark fixtures — untouched; `hubRoute 34/29/5/0` is unaffected

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/shared/context_loading_contract.md` | Modify | Reshape the single `accessibility:` line in the §4 AUDIT EVIDENCE block **in place** into the seven-layer `coverage:` matrix with the four-state enum and the resolution rule; `performance / responsive / theming / anti-patterns` and the four target/source-evidence lines preserved |
| `.opencode/skills/sk-design/design-audit/references/audit_contract.md` | Modify | Add an "Accessibility Coverage Matrix" subsection under §2 mirroring the seven layers + four-state vocabulary and the WCAG/ready resolution rule; the five-dimension `/20` table, severity model, findings schema, and evidence rules preserved |
| `.opencode/skills/sk-design/shared/scripts/proof_check.py` | Unchanged | No new checker; the existing AUDIT-EVIDENCE presence floor still fires because the matrix lives inside that block |
| `.opencode/skills/sk-design/design-audit/assets/audit_report_template.md` | Unchanged | Out of scope; not edited |
| `.opencode/skills/sk-design/mode-registry.json` | Unchanged | Out of scope; not edited |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Reshape the AUDIT EVIDENCE a11y field in place into the seven-layer matrix | `context_loading_contract.md` §4 carries all seven layers (keyboard / screen-reader / zoom-reflow / contrast / reduced-motion / assistive-tech / user-testing) under `dimensions: accessibility: coverage:`, each with the `confirmed | inferred | blocked | not-assessed` state; the single `accessibility:` line is gone, replaced in place |
| REQ-002 | Mirror the matrix into the audit contract | `audit_contract.md` §2 carries an "Accessibility Coverage Matrix" subsection with the same seven layers + four-state vocabulary, tying the Accessibility `/4` rating and any WCAG/ready claim to a populated matrix |
| REQ-003 | Wire the resolution rule so `not-assessed` blocks | Both docs state that a layer is resolved only when `confirmed`, `inferred`, or `blocked` with a reason; any `not-assessed` layer blocks WCAG / accessible / release-ready / production-ready claims; `blocked` is distinct from `not-assessed` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Seven layers + four states agree across both docs | The seven layer names and the four-state vocabulary read identically in `context_loading_contract.md` and `audit_contract.md`; cross-doc agreement is structurally checkable |
| REQ-005 | No-regression, no new checker, evergreen + scope clean | `performance / responsive / theming / anti-patterns` and the five-dimension `/20` table intact; R4 state-matrix + R5 rationale lane preserved; no new `.py`/`.mjs`; `proof_check.py` / `audit_report_template.md` / `mode-registry.json` / cards untouched; `hubRoute 34/29/5/0` unaffected; no spec/packet/phase IDs in shipped text |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All seven layers (keyboard / screen-reader / zoom-reflow / contrast / reduced-motion / assistive-tech / user-testing) and the four-state vocabulary (`confirmed | inferred | blocked | not-assessed`) are present in both `context_loading_contract.md` §4 and `audit_contract.md` §2; the AUDIT EVIDENCE a11y field was reshaped in place (the single `accessibility:` line is gone).
- **SC-002**: The resolution rule bites at the contract level — a layer is resolved only when `confirmed`, `inferred`, or `blocked` with a reason; any `not-assessed` layer blocks WCAG / accessible / release-ready / production-ready claims; `blocked` reads as an honest resolved-with-reason state, not a pass. No new checker ships: the existing audit gate walks the matrix; the existing AUDIT-EVIDENCE presence floor still fires because the matrix lives inside that block.
- **SC-003**: No-regression and scope clean — `performance / responsive / theming / anti-patterns` and the five-dimension `/20` table preserved; R4's INTERACTION STATE MATRIX (5 refs) and R5's DECISION RATIONALE lane (5 refs) in the shared contract preserved; no new `.py`/`.mjs` added; `proof_check.py`, `audit_report_template.md`, `mode-registry.json`, and the cards untouched; `hubRoute 34/29/5/0` unaffected (touches no router/scorer/fixture); the evergreen scan is clean.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Whether a `confirmed` cell is TRUTHFULLY confirmed is not machine-checkable | A `confirmed` keyboard layer is not a tested one | **Recorded as advisory.** The shape — seven layers present, one valid state each, cross-doc agreement — is checkable; the honesty of each cell stays audit judgment |
| Risk | Whether the chosen coverage is SUFFICIENT for the specific surface is not machine-checkable | A matrix can be fully resolved yet still under-test the surface | **Recorded as advisory.** Sufficiency of the covered behaviour for the surface stays audit judgment; only the ledger's shape is provable |
| Risk | The reshape edits a field shared with R5's rationale lane and other proof fields | An overwrite could drop a preserved field | **Reshape was in-place and scoped.** Only the single `accessibility:` line became the `coverage:` sub-object; `performance / responsive / theming / anti-patterns`, the target/source-evidence lines, and the R4/R5 lanes are preserved |
| Dependency | The existing AUDIT EVIDENCE block + its HARD GATE | Green | The matrix lives inside the block, so the existing audit gate walks it and the AUDIT-EVIDENCE presence floor still fires — no new checker needed |
| Dependency | The `accessibility_performance.md` Modality Coverage table + `audit_evidence_worksheet.md` labels (read-only) | Green | Source of the layer names and the confirmed/inferred/not-assessed vocabulary; read, not edited |
| Dependency | `audit_contract.md` is shared with sibling 009 (D6-R9 observation/problem/fix triad) | Pending | **This R6 lands first** in §2 (the score contract); sibling 009 later appends to §3 (the findings schema). Distinct sections make the coexistence clean with no overwrite |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Integrity
- **NFR-I01**: The change is a scoped in-place reshape plus one mirrored subsection — the single `accessibility:` line becomes the seven-layer `coverage:` matrix, and the audit contract gains one "Accessibility Coverage Matrix" subsection; no other proof field, dimension, severity row, or evidence rule is altered.
- **NFR-I02**: No new code ships. The matrix is walked by the existing audit gate; `proof_check.py` is unchanged and still detects AUDIT EVIDENCE presence because the matrix is nested inside that block.

### Consistency
- **NFR-C01**: The seven layer names and the four-state vocabulary are identical across `context_loading_contract.md` and `audit_contract.md`, and align with the read-only Modality Coverage / evidence-worksheet precedent, so the ledger reads the same wherever it appears.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Matrix resolution
- **Every layer confirmed/inferred/blocked-with-reason**: the matrix is resolved; a WCAG/ready claim may proceed on it as the evidence basis.
- **Any layer `not-assessed`**: the matrix is unresolved; WCAG / accessible / release-ready / production-ready claims are blocked.
- **`blocked` layer**: an honest "could not assess" state (no AT available, no real users) — counts as resolved-with-reason, distinct from `not-assessed`, and not a pass.

### No-regression
- **Other dimensions**: `performance / responsive / theming / anti-patterns` and the five-dimension `/20` table behave exactly as before.
- **Existing gate**: `proof_check.py` still detects the AUDIT EVIDENCE field on a card embedding the new matrix; the presence floor is unchanged because no parser was added.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

- **Surface count**: Two documentation contracts — the shared context-loading contract (one field reshaped in place) and the audit output contract (one mirrored subsection). No script, no schema, no new file.
- **Risk concentration**: The only judgment-bearing surfaces are whether a `confirmed` cell is truthfully confirmed and whether the chosen coverage is sufficient for the surface; both stay advisory. Everything structural — presence of all seven layers, a valid four-state per layer, and cross-doc agreement — is checkable, and the existing audit gate walks it. The blast radius is the design audit-evidence surface only; the router, scorer, and benchmark fixtures stay untouched, so `hubRoute 34/29/5/0` is unaffected.

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Is the matrix shape checkable? **RESOLVED: Yes.** Presence of all seven layers, one valid four-state value per layer, and cross-doc agreement between the two contracts are structural facts. The matrix lives inside the existing AUDIT EVIDENCE block, so the existing audit gate walks it and the AUDIT-EVIDENCE presence floor still fires — no new checker was needed (walked, not parsed).
- Was a new checker added? **RESOLVED: No.** No new `.py` or `.mjs` ships. `proof_check.py` is unchanged; it detects AUDIT EVIDENCE presence as before but does not parse per-layer state. The per-layer ledger is enforced by the existing audit gate walking the block, not by a new parser.
- Is a `confirmed` cell guaranteed truthful? **RESOLVED: No — advisory.** The shape is provable; whether a layer marked `confirmed` was actually tested cannot be proven by walking the matrix. Truthfulness of each cell stays audit judgment.
- Is the chosen coverage guaranteed sufficient? **RESOLVED: No — advisory.** A fully resolved matrix can still under-test a specific surface. Whether the coverage is sufficient for that surface stays audit judgment; only the ledger's shape is provable.
- Was the reshape in place or append-only? **RESOLVED: In place.** The single `accessibility:` line under `dimensions:` was replaced in place by the seven-layer `coverage:` sub-object; `performance / responsive / theming / anti-patterns`, the target/source-evidence lines, and the R4 state-matrix + R5 rationale lanes are preserved with nothing dropped.
- Does this collide with sibling 009? **RESOLVED: No — R6 lands first.** `audit_contract.md` is shared with sibling 009 (D6-R9); this phase reshapes §2 (the score contract) first, and 009 later appends to §3 (the findings schema). Distinct sections keep the coexistence clean.

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
- In-place reshape of the single AUDIT EVIDENCE a11y field into a seven-layer keyboard/screen-reader/zoom-reflow/contrast/reduced-motion/assistive-tech/user-testing coverage matrix with a confirmed/inferred/blocked/not-assessed state per layer, mirrored into audit_contract.md §2
- Honest split: layer presence + state validity + cross-doc agreement are checkable (the existing audit gate walks the matrix); cell truthfulness + coverage sufficiency stay advisory
- No new checker (walked, not parsed); proof_check.py / audit_report_template.md / mode-registry.json / cards untouched; R4 state-matrix + R5 rationale lane preserved
- audit_contract.md shared with sibling 009 (R6 lands first in §2; 009 appends to §3); hubRoute 34/29/5/0 unaffected; GENERATED_METADATA regenerated by the orchestrator
-->
