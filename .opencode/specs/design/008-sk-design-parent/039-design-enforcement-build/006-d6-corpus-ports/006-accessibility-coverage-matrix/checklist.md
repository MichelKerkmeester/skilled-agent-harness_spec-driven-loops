---
title: "Verification Checklist: D6-R6 — ACCESSIBILITY COVERAGE matrix"
description: "Verification checklist for the in-place reshape of the single a11y dimension into a seven-layer coverage matrix across the context-loading and audit contracts, with fix-completeness, no-regression, and enforcement-honesty evidence."
trigger_phrases:
  - "accessibility coverage matrix checklist"
  - "a11y layered matrix verification"
  - "audit contract a11y gate checklist"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/006-d6-corpus-ports/006-accessibility-coverage-matrix"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Verify every checklist item against the delivered seven-layer a11y matrix"
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
# Verification Checklist: D6-R6 — ACCESSIBILITY COVERAGE matrix

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

- [x] CHK-001 [P0] Both target files and the exact edit sites identified
  - **Evidence**: `context_loading_contract.md` §4 AUDIT EVIDENCE single `accessibility:` line (now the `coverage:` sub-object at lines 159-185); `audit_contract.md` §2 Five-Dimension Score (mirror at lines 41-79)
- [x] CHK-002 [P1] Seven layers and four-value enum fixed from spec + source corpus
  - **Evidence**: keyboard / screen-reader / zoom-reflow / contrast / reduced-motion / assistive-tech / user-testing; `confirmed | inferred | blocked | not-assessed`
- [x] CHK-003 [P1] Read-only precedent reviewed for vocabulary alignment
  - **Evidence**: `accessibility_performance.md` Modality Coverage + `audit_evidence_worksheet.md` labels read, not edited

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Matrix present in the shared contract
  - **Evidence**: `context_loading_contract.md` §4 lists all seven layers under `dimensions: accessibility: coverage:` (lines 159-185), each with the four-value enum
- [x] CHK-011 [P0] Matrix mirrored into the audit contract
  - **Evidence**: `audit_contract.md` §2 carries an "Accessibility Coverage Matrix" subsection (lines 41-79) with the seven layers + enum
- [x] CHK-012 [P0] WCAG/ready gate bites at the contract level
  - **Evidence**: a WCAG/accessible/release-ready claim requires every layer resolved; any `not-assessed` layer blocks the ready-claim (contract line 194; audit line 79)
- [x] CHK-013 [P1] `blocked` is distinct from `not-assessed`
  - **Evidence**: `blocked` reads as a resolved-with-reason "could not assess" state, not a pass and not an unfilled layer
- [x] CHK-014 [P1] The single `accessibility:` line was reshaped in place (no orphan, no half-port)
  - **Evidence**: the single line is gone, replaced in place by the `coverage:` sub-object; `performance / responsive / theming / anti-patterns` and the target/source-evidence lines preserved

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Grep both files: the seven layers and the four-value enum are present
  - **Evidence**: contract lines 160-184 and audit lines 49-73 list all seven layers; the four-state enum appears on every layer
- [x] CHK-021 [P0] Existing dimensions preserved
  - **Evidence**: `performance / responsive / theming / anti-patterns` intact in §4; the five-dimension `/20` table intact in `audit_contract.md` (§2 line 29)
- [x] CHK-022 [P1] Existing proof fields and the R4/R5 lanes preserved
  - **Evidence**: Register/Dials, Contrast Pairs, Interface Preflight, Audit Evidence, and the HARD GATES table unchanged except the expanded accessibility sub-object; R4 Interaction State Matrix (lines 117/122/226) + R5 Decision Rationale (lines 196/201/230) preserved
- [x] CHK-023 [P1] Existing deterministic floor unaffected
  - **Evidence**: `proof_check.py` is unchanged (`git diff --stat` empty) and still detects the `AUDIT EVIDENCE` field on a card embedding the new matrix

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class assigned: a single-cell accessibility collapse is a `class-of-gap` (a WCAG/ready claim could pass with one vague checkbox standing in for seven layers), not a one-doc omission
  - **Evidence**: the fix generalizes the floor from one `accessibility:` field to a seven-layer per-layer ledger that every WCAG/ready claim must walk
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed: the shared context-loading contract (SSOT field shape) and the audit output contract (score + findings) are the producers of the a11y proof surface; both carry the matrix consistently
  - **Evidence**: the matrix lands in the contract §4 `coverage:` sub-object and the audit §2 subsection, and is mirrored into the findings-schema example (audit line 96)
- [x] CHK-FIX-003 [P0] Consumer inventory completed: the matrix is walked by the existing audit gate; no new parser consumes per-layer state, recorded honestly rather than overclaimed
  - **Evidence**: `proof_check.py`'s AUDIT-EVIDENCE presence floor is unchanged and still fires; per-layer code recompute is recorded as an out-of-scope follow-up
- [x] CHK-FIX-004 [P0] Resolution cases listed for the gate to exercise: every-layer-resolved (claim proceeds), any-layer-`not-assessed` (claim blocked), `blocked`-with-reason (resolved, not a pass)
  - **Evidence**: the resolution rule covers all three states identically in both docs (contract line 194; audit line 79)
- [x] CHK-FIX-005 [P1] Cross-doc agreement axis listed: the seven layer names × the four-state vocabulary read identically across both contracts
  - **Evidence**: structural cross-doc agreement is checkable; both docs carry the same seven layers and the same four states

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] The gate binds a WCAG/accessible/release-ready claim to a resolved seven-layer matrix, not a single self-attested checkbox
  - **Evidence**: contract line 194 + audit line 79 block the claim on any `not-assessed` layer; one vague checkbox can no longer stand in for seven layers
- [x] CHK-031 [P1] No overclaim of code enforcement
  - **Evidence**: the contract does not imply a script recomputes per-layer state this phase; the only code floor is `proof_check.py` AUDIT-EVIDENCE presence
- [x] CHK-032 [P2] Per-layer code recompute flagged as follow-up
  - **Evidence**: a future `proof_check.py` per-layer parser is noted as out-of-scope, not built here

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] Evergreen [HARD]: no spec/packet/phase IDs or spec paths embedded in the shipped contract text
  - **Evidence**: orchestrator evergreen scan clean across both `context_loading_contract.md` and `audit_contract.md`
- [x] CHK-041 [P1] spec/plan/tasks/checklist synchronized on the seven layers, the four states, the in-place reshape, and the shape-checkable vs truthfulness-advisory split
  - **Evidence**: all four docs reflect the same matrix shape, the resolution rule, and the honest enforcement split
- [x] CHK-042 [P1] House-style content-first
  - **Evidence**: layer names and labels consistent across both named files and the read-only precedent; matches the existing table/proof-field voice
- [x] CHK-043 [P2] Layer naming aligned with the Modality Coverage precedent
  - **Evidence**: the five shared layers (keyboard, screen-reader, zoom-reflow, contrast, reduced-motion) read identically across the contract and the read-only reference

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P0] Only `context_loading_contract.md` and `audit_contract.md` modified; `proof_check.py` / `audit_report_template.md` / `mode-registry.json` / the cards untouched; no new `.py`/`.mjs`
  - **Evidence**: `git status` shows the two named docs modified; `git diff --stat` for `proof_check.py` is empty; no new or changed `.py`/`.mjs` near sk-design
- [x] CHK-051 [P1] `hubRoute 34/29/5/0` unaffected; no router/scorer/fixture touched
  - **Evidence**: the change is two documentation contracts only; no router, scorer, or benchmark fixture was edited
- [x] CHK-052 [P1] No temp/scratch files left; the working tree carries only the two modified skill docs plus this phase folder's docs
  - **Evidence**: working tree carries the two modified skills files plus this phase folder's docs; no scratch left

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 13/13 |
| P1 Items | 12 | 12/12 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-06-29
**Verified By**: markdown-agent (independent re-verification of the delivered seven-layer ACCESSIBILITY COVERAGE matrix across `context_loading_contract.md` §4 and `audit_contract.md` §2, with the no-new-checker boundary confirmed against `git diff --stat`)

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
Fix-completeness, no-regression, evergreen, and enforcement-honesty dimensions
-->
