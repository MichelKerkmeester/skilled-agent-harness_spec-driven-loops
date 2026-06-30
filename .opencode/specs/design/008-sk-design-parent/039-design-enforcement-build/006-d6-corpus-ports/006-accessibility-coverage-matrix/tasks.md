---
title: "Tasks: D6-R6 — ACCESSIBILITY COVERAGE matrix"
description: "Task list for reshaping the single a11y dimension into a seven-layer coverage matrix in the context-loading contract and audit contract, gating WCAG/ready claims on resolved per-layer status."
trigger_phrases:
  - "accessibility coverage matrix tasks"
  - "a11y layered matrix build tasks"
  - "audit contract a11y gate tasks"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/006-d6-corpus-ports/006-accessibility-coverage-matrix"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark all build and verification tasks complete with one-line evidence"
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
# Tasks: D6-R6 — ACCESSIBILITY COVERAGE matrix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

*Context lock and vocabulary alignment (20m)*

- [x] T001 Read and locate the single `accessibility:` line under `dimensions:` in the AUDIT EVIDENCE block (`.opencode/skills/sk-design/shared/context_loading_contract.md` §4) [5m] — edit site fixed at the §4 AUDIT EVIDENCE `dimensions:` block, now the `coverage:` sub-object at contract lines 159-185
- [x] T002 Read and locate the Accessibility row + score bands in the Five-Dimension Score (`.opencode/skills/sk-design/design-audit/references/audit_contract.md` §2) [5m] — edit site fixed at the §2 Five-Dimension Score; mirror subsection landed at audit lines 41-79
- [x] T003 [P] Confirm the seven layer names against the read-only Modality Coverage table (`.opencode/skills/sk-design/design-audit/references/accessibility_performance.md`) and source corpus Test Matrix [5m] — keyboard / screen-reader / zoom-reflow / contrast / reduced-motion / assistive-tech / user-testing fixed from the precedent
- [x] T004 [P] Confirm the four-value enum (`confirmed | inferred | blocked | not-assessed`) extends the worksheet labels (`.opencode/skills/sk-design/design-audit/assets/audit_evidence_worksheet.md`) [5m] — enum confirmed; `blocked` added as the honest resolved-with-reason state alongside the worksheet labels

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

*Author the matrix into both contracts (45m)*

### Shared context-loading contract
- [x] T005 Replace the single `accessibility:` line with the seven-layer sub-object (`keyboard / screen-reader / zoom-reflow / contrast / reduced-motion / assistive-tech / user-testing`), each carrying `confirmed | inferred | blocked | not-assessed` (`.opencode/skills/sk-design/shared/context_loading_contract.md` §4) [15m] — `coverage:` sub-object at contract lines 159-185; all seven layers carry the four-state enum; `performance / responsive / theming / anti-patterns` preserved
- [x] T006 Add a gate note under the AUDIT EVIDENCE block: a WCAG/accessible/release-ready claim requires every layer resolved; `not-assessed` blocks; per-layer status presence is the checkable shape, adequacy is advisory (`.opencode/skills/sk-design/shared/context_loading_contract.md` §4) [10m] — resolution rule at contract line 194; `not-assessed` blocks WCAG/release-ready/production-ready; `blocked` distinct; truthfulness + sufficiency advisory

### Audit output contract
- [x] T007 Add an "Accessibility Coverage Matrix" subsection defining the seven layers + four-value enum and the WCAG/ready gate; tie the Accessibility `/4` rating and release-ready claims to a populated matrix (`.opencode/skills/sk-design/design-audit/references/audit_contract.md`) [15m] — "Accessibility Coverage Matrix" subsection at §2 lines 41-79; seven layers + four-state enum; resolution rule at audit line 79
- [x] T008 Verify the existing five-dimension table, severity model, findings schema, and evidence rules remain intact and consistent with the new subsection (`.opencode/skills/sk-design/design-audit/references/audit_contract.md`) [5m] — Severity §1 (line 18), Five-Dimension `/20` table §2 (line 29), Findings Schema §3 (line 88), and evidence rules all intact

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

*Structural, no-regression, evergreen, and gate checks (25m)*

### Structural and no-regression
- [x] T009 [P] Grep both files: the seven layers and the four-value enum are present (`context_loading_contract.md`, `audit_contract.md`) [5m] — seven layers present in both (contract lines 160-184, audit lines 49-73); four-state enum on every layer
- [x] T010 [P] Diff review: the four other dimensions, all proof fields, the severity table, and the evidence rules are preserved (added/expanded lines only) [5m] — `performance / responsive / theming / anti-patterns`, the Register/Dials/Contrast/Preflight proof fields, the `/20` table, and the findings schema preserved; R4 state-matrix + R5 rationale lane intact

### Evergreen and house-style
- [x] T011 [P] Evergreen lint: no spec IDs, packet numbers, ADR/REQ/finding IDs, or spec-folder paths in the shipped contract text [5m] — orchestrator evergreen scan clean across both contracts
- [x] T012 [P] House-style check: layer names and labels read consistently across both named files and the read-only precedent [5m] — layer names and four-state labels read identically in `context_loading_contract.md` §4 and `audit_contract.md` §2

### Gate and honesty
- [x] T013 Run `proof_check.py` on a sample card embedding the new matrix; confirm `AUDIT EVIDENCE` is still detected (no gate regression) [3m] — `proof_check.py` unchanged (`git diff --stat` empty); the matrix lives inside the AUDIT EVIDENCE block so the presence floor still fires
- [x] T014 Confirm the honest enforcement label is present: per-layer is contract-gated, adequacy advisory, per-layer code recompute flagged as out-of-scope follow-up (not built) [2m] — shape (layer presence + valid state + cross-doc agreement) walked by the existing audit gate; cell truthfulness + coverage sufficiency advisory; no new `.py`/`.mjs` shipped

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Seven-layer matrix + four-value enum present in both named contracts
- [x] WCAG/ready gate wired; `not-assessed` blocks; adequacy advisory
- [x] No-regression confirmed (existing dimensions, proof fields, severity, evidence rules intact)
- [x] Evergreen + house-style confirmed
- [x] Checklist.md fully verified

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS
- Core + Level 2 detail
- Effort estimates per task
- Explicit verification tasks (structural, no-regression, evergreen, gate, honesty)
-->
