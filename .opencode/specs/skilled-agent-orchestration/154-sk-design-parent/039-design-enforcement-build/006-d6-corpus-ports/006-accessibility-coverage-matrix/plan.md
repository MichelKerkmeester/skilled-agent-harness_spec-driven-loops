---
title: "Implementation Plan: D6-R6 — ACCESSIBILITY COVERAGE matrix"
description: "Reshape the single a11y dimension under AUDIT EVIDENCE into a seven-layer keyboard/screen-reader/zoom-reflow/contrast/reduced-motion/assistive-tech/user-testing coverage matrix with a confirmed/inferred/blocked/not-assessed state per layer, mirrored into audit_contract.md §2, gating WCAG/ready claims on resolved layers; no new checker — the existing audit gate walks it."
trigger_phrases:
  - "accessibility coverage matrix plan"
  - "seven layer a11y coverage design build"
  - "audit contract accessibility gate plan"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/006-d6-corpus-ports/006-accessibility-coverage-matrix"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark plan Definition of Done complete after the verified 7-layer a11y matrix build"
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
# Implementation Plan: D6-R6 — ACCESSIBILITY COVERAGE matrix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Surface** | sk-design shared context-loading contract + design-audit output contract |
| **Change kind** | Documentation contract edit (markdown), in-place reshape of one field + one mirrored subsection |
| **Target files** | `.opencode/skills/sk-design/shared/context_loading_contract.md`; `.opencode/skills/sk-design/design-audit/references/audit_contract.md` |
| **Enforcement class** | hybrid — layer presence + state validity + cross-doc agreement are a checkable shape; cell truthfulness + coverage sufficiency stay advisory |
| **Code gate touched** | none — no new `.py`/`.mjs`; `proof_check.py` is unchanged and the existing audit gate walks the matrix |

### Overview

Accessibility used to collapse into a single field. In `context_loading_contract.md` §4 the AUDIT EVIDENCE block listed `accessibility:` as one line under `dimensions:`, and in `audit_contract.md` §2 accessibility was one row of a five-dimension `/20` score. A WCAG/ready claim could pass with one vague checkbox covering keyboard, screen-reader, zoom/reflow, contrast, reduced motion, assistive tech, and user testing all at once.

This phase reshapes that single dimension **in place** into a **seven-layer ACCESSIBILITY COVERAGE MATRIX** — keyboard, screen-reader, zoom-reflow, contrast, reduced-motion, assistive-tech, user-testing — each layer carrying a four-value state: **confirmed | inferred | blocked | not-assessed**. The matrix replaces the single field where it lived (the AUDIT EVIDENCE block), and the same matrix is mirrored into `audit_contract.md` §2 as an "Accessibility Coverage Matrix" subsection. A layer is resolved only when `confirmed`, `inferred`, or `blocked` with a reason; any `not-assessed` layer blocks WCAG / accessible / release-ready / production-ready claims. `blocked` is the honest "could not assess" state, distinct from `not-assessed` and not a pass.

No new checker ships. The matrix lives inside the existing AUDIT EVIDENCE block, so the existing audit gate walks it and `proof_check.py`'s AUDIT-EVIDENCE presence floor still fires — the per-layer ledger is walked, not parsed by a new script. The shape (seven layers present, one valid state each, cross-doc agreement) is checkable; whether a `confirmed` cell is truthful and whether the chosen coverage is sufficient for the surface stay advisory. The layer names and the confirmed/inferred/not-assessed labels are aligned with the read-only `accessibility_performance.md` Modality Coverage table and the `audit_evidence_worksheet.md` vocabulary so the ledger reads consistently across the skill.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Target files and the exact edit sites identified (`context_loading_contract.md` §4 AUDIT EVIDENCE single `accessibility:` line; `audit_contract.md` §2 Five-Dimension Score)
- [x] The seven layers and four-value state vocabulary fixed from the spec and the source corpus
- [x] Read-only precedent (Modality Coverage, evidence worksheet) reviewed for vocabulary alignment
- [x] No-new-checker boundary stated honestly — the existing audit gate walks the matrix; no parser ships

### Definition of Done
- [x] The seven-layer matrix with the four-value state exists in both named contracts — `context_loading_contract.md` §4 (lines 158-187) and `audit_contract.md` §2 (lines 41-79)
- [x] A WCAG/ready claim is gated on resolved layers; `not-assessed` blocks; `blocked` distinct; adequacy stays advisory — resolution rule present in both docs (contract line 194, audit line 79)
- [x] No new checker — no `.py`/`.mjs` added; `proof_check.py` unchanged; existing audit gate walks the matrix
- [x] Existing dimensions, severity model, evidence rules, and the R4/R5 lanes preserved — `performance/responsive/theming/anti-patterns` + `/20` table intact; R4 state-matrix + R5 rationale lane preserved
- [x] Shipped contract text is evergreen — no spec IDs, packet numbers, finding IDs, or spec-folder paths
- [x] Checklist items verified with evidence

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
In-place field reshape plus one mirrored subsection. Expand one existing line (`accessibility:`) into a structured seven-layer sub-object inside the shared contract's AUDIT EVIDENCE block, and mirror that matrix into the audit output contract. No new file, no script, no schema migration.

### Key Components
- **AUDIT EVIDENCE block** (`context_loading_contract.md` §4) — the proof-field shape an agent fills before any audit/score/accessibility/release claim. Now owns the seven-layer matrix data shape in place of the single `accessibility:` line.
- **Five-Dimension Score** (`audit_contract.md` §2) — the `/20` audit output contract. Now carries the "Accessibility Coverage Matrix" subsection: how the matrix conditions a WCAG/ready/release-ready claim and the Accessibility `/4` rating.
- **proof_check.py** (unchanged this phase) — the existing deterministic floor that requires the AUDIT EVIDENCE field present and the verdict READY. The matrix lives inside that block, so the floor still fires; it does not parse per-layer state, and no parser was added.
- **Read-only precedents** — `accessibility_performance.md` Modality Coverage (five-row precedent) and `audit_evidence_worksheet.md` (label vocabulary). Source of layer names and labels; NOT edited.

### Data Flow
1. An agent fills the AUDIT EVIDENCE block before an audit/score/accessibility/release claim.
2. Under `dimensions: accessibility: coverage:` the agent now fills seven layer rows, each with a four-value state.
3. Any layer left `not-assessed` is unresolved.
4. The audit contract's rule reads: a WCAG / accessible / release-ready / production-ready claim requires every layer resolved; an unresolved layer blocks the claim.
5. `blocked` is the honest "could not assess" state (no AT available, no real users) and counts as resolved-with-reason, not a pass.
6. The Accessibility `/4` rating and the ready verdict carry the matrix as their evidence basis; truthfulness of each `confirmed` cell and sufficiency of the covered behaviour stay advisory.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Context lock and vocabulary alignment
- [x] Read both target files and locate the exact edit sites — the single `accessibility:` line in §4; the Accessibility row + score bands in §2
- [x] Confirm the seven layer names and the four-value state against the source corpus and the read-only Modality Coverage / evidence-worksheet precedent
- [x] Confirm `proof_check.py` keys off the literal AUDIT EVIDENCE block so the in-place reshape preserves the existing floor

### Phase 2: Reshape the matrix into both contracts (in place)
- [x] In `context_loading_contract.md` §4, replace the single `accessibility:` line with the seven-layer `coverage:` sub-object (keyboard / screen-reader / zoom-reflow / contrast / reduced-motion / assistive-tech / user-testing), each with `confirmed | inferred | blocked | not-assessed`; preserve `performance / responsive / theming / anti-patterns` and every other proof field — done (lines 158-187), siblings preserved (lines 188-191)
- [x] Add the resolution rule under the block: a WCAG/accessible/release-ready claim requires every layer resolved; `not-assessed` blocks; presence + state validity is the checkable shape, truthfulness + sufficiency advisory — done (contract line 194)
- [x] In `audit_contract.md` §2, add an "Accessibility Coverage Matrix" subsection mirroring the seven layers + four-state vocabulary and the WCAG/ready rule; tie the Accessibility `/4` rating to it; preserve the five-dimension table, severity model, findings schema, and evidence rules — done (lines 41-79), `/20` table + findings schema intact

### Phase 3: Verification
- [x] Structural presence: the seven layers and the four-value state appear in both files — confirmed (contract §4, audit §2)
- [x] No-regression: the four other dimensions, the severity table, the findings schema, and the evidence rules are intact; R4 state-matrix + R5 rationale lane preserved — confirmed
- [x] Evergreen scan: no spec IDs, packet numbers, ADR/REQ/finding IDs, or spec-folder paths in the shipped text — clean
- [x] House-style: layer names and labels consistent across both named files and the read-only precedent — confirmed
- [x] Gate `proof_check.py` still detects the AUDIT EVIDENCE field on a card carrying the new matrix — confirmed (no parser added; presence floor unchanged)
- [x] Honest enforcement label present: shape is contract-gated and walked by the existing audit gate; cell truthfulness + coverage sufficiency advisory; no new checker built — confirmed

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Seven layers + four-value state present in both contracts | `rg` over the two files |
| No-regression | Four other dimensions, `/20` table, severity model, findings schema, evidence rules, R4/R5 lanes preserved | `git diff` review (reshaped/added lines only) |
| Evergreen lint | No IDs, packet numbers, finding IDs, or spec-folder paths in shipped text | `rg` for forbidden patterns over the diff |
| Gate smoke | AUDIT EVIDENCE still detected on a card embedding the new matrix | `proof_check.py` on a sample card (unchanged) |
| Manual | Resolution rule reads as a gate; `blocked` distinct from `not-assessed`; truthfulness + sufficiency advisory | Read-through of both edited sections |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `context_loading_contract.md` §4 AUDIT EVIDENCE | Internal (edit) | Green | Matrix has no home in the shared contract |
| `audit_contract.md` §2 Five-Dimension Score | Internal (edit) | Green | Gate cannot be mirrored into the audit output |
| `accessibility_performance.md` Modality Coverage | Internal (read-only) | Green | Lose the five-row layer-name precedent |
| `audit_evidence_worksheet.md` label vocabulary | Internal (read-only) | Green | Lose the confirmed/inferred/not-assessed precedent |
| `accessibility-test-plan` SKILL "Test Matrix" | External corpus (read-only) | Green | Lose the source matrix shape |
| `proof_check.py` | Internal (NOT modified) | Green | Existing presence floor unchanged; per-layer recompute stays a follow-up |
| `audit_contract.md` shared with sibling 009 (D6-R9) | Internal | Pending | R6 lands first in §2; 009 appends to §3 — distinct sections, no overwrite |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The matrix breaks an existing audit/score/ready flow, or the resolution rule over-blocks legitimate claims.
- **Procedure**: Restore the two markdown files to their prior revision (`git restore` / revert the doc commit). No data, no migration, no script change to unwind — `proof_check.py` was never touched.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Context lock) ──> Phase 2 (Reshape matrix) ──> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Context lock | None | Reshape matrix |
| Reshape matrix | Context lock | Verify |
| Verify | Reshape matrix | None |

**Cross-phase shared-file sequencing (must read before editing):**
- `audit_contract.md` is a shared target with sibling 009 (D6-R9 observation/problem/fix triad). This phase reshapes §2 (the Five-Dimension Score); 009 appends the OBSERVATION slot to §3 (the Findings Schema). **This R6 lands first**; distinct sections make the coexistence clean with no overwrite.
- `context_loading_contract.md` already carries R4's INTERACTION STATE MATRIX lane and R5's DECISION RATIONALE lane. The reshape edits only the single `accessibility:` line inside the AUDIT EVIDENCE block; both prior lanes and every other proof field are preserved with nothing dropped.
- **Honest scope flag:** this phase touches no router, scorer, or benchmark fixture, so `hubRoute 34/29/5/0` is unaffected. No new `.py`/`.mjs` ships; `proof_check.py`, `audit_report_template.md`, `mode-registry.json`, and the cards are untouched.

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Context lock and alignment | Low | 20 minutes |
| Reshape matrix into both contracts | Low | 45 minutes |
| Verification | Low | 25 minutes |
| **Total** | | **~1.5 hours** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Both target files captured at their prior revision before editing — reshape site fixed at the §4 single `accessibility:` line and the §2 score table
- [x] Feature flag configured (N/A — documentation contract change)
- [x] No downstream script or schema depends on the single-line `accessibility:` field shape — `proof_check.py` keys off AUDIT EVIDENCE presence, not the inner a11y line

### Rollback Procedure
1. **Immediate**: Revert the edits to the two markdown contracts.
2. **Verify**: `proof_check.py` still detects AUDIT EVIDENCE; the five-dimension table and proof fields read as before.
3. **Notify**: Flag in the build phase parent if the resolution-rule wording needed revision, so siblings know the contract baseline.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: None required — markdown-only revert; no script was changed.

<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN
- In-place reshape of the single AUDIT EVIDENCE a11y field into a seven-layer coverage matrix with a four-value state per layer, mirrored into audit_contract.md §2
- Hybrid enforcement; no new checker — the existing audit gate walks the matrix (walked, not parsed)
- Shape (layer presence + state validity + cross-doc agreement) checkable; cell truthfulness + coverage sufficiency advisory
- audit_contract.md shared with sibling 009 (R6 first in §2; 009 appends §3); hubRoute 34/29/5/0 unaffected
-->
