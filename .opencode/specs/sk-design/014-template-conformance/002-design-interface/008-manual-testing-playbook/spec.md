---
title: "Feature Specification: design-interface manual-testing-playbook conformance"
description: "Audit the 20 category subdirectories under design-interface/manual-testing-playbook/ against manual-testing-playbook-template.md; confirmed likely mode-consolidation residue in procedure-card-contract/ and a scenario coupled to sibling packet 001-apache-devendoring."
trigger_phrases:
  - "design-interface manual-testing-playbook conformance"
  - "playbook template audit"
  - "foundations scenario residue"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/002-design-interface/008-manual-testing-playbook"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Found probable foundations-mode residue in procedure-card-contract"
    next_safe_action: "Read remaining foundations-* files, then audit the other 19 categories"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-interface/manual-testing-playbook/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: design-interface manual-testing-playbook conformance

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Packet** | `sk-design/014-template-conformance/002-design-interface` |
| **Predecessor** | `007-feature-catalog` |
| **Successor** | `009-changelog` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`manual-testing-playbook/` has **20** category subdirectories (a `find -maxdepth 1 -type d` count; the dispatching brief cited 21 — corrected here to the measured count). Scenario IDs follow `{PREFIX}-{NNN}` and every scenario row must use exactly 9 columns per `manual-testing-playbook-template.md` §3-§4. The `procedure-card-contract/` category holds 6 files, 3 of them prefixed `foundations-` (`foundations-card-selection-proof.md`, `foundations-direct-fallback-without-subagents.md`, `foundations-no-card-fallback.md`) alongside 3 unprefixed siblings covering the same shape (`card-selection-proof.md` = `ID-018`, `direct-fallback-without-subagents.md`, `no-card-fallback.md`). Reading both `card-selection-proof.md` and `foundations-card-selection-proof.md` in full: the unprefixed file is genuinely `design-interface`'s own `ID-018` scenario, citing `design-interface`'s own 6 aesthetic-direction procedure cards. The `foundations-` file is titled "Foundations Procedure Card Selection Proof Scenario" and references `procedures/tweakable-design-controls.md`, `procedures/component-system-inventory.md`, `procedures/hierarchy-rhythm-review.md` — three files that physically live in this same `design-interface/procedures/` folder. A sibling changelog entry (`changelog/v1.0.0.0-foundations.md`, audited by `009-changelog`) describes a `foundations` mode with its own `references/` under `color/`, `type/`, `layout/` — the same subfolder names now living inside `design-interface/references/foundations/`. This is strong circumstantial evidence that `foundations` was a separate mode later consolidated into `design-interface`, and the 3 `foundations-`-prefixed scenario files are leftover residue from that merge rather than intentionally scoped design-interface content — but the merge history itself has not been confirmed (e.g., via `git log` or a mode-consolidation spec folder), so this is recorded as a strong hypothesis, not a settled fact.

### Purpose
Confirm the mode-consolidation hypothesis (or find a different explanation), then decide whether the 3 `foundations-`-prefixed files should be renamed to drop the stale prefix (if they are now legitimately part of design-interface's own coverage), merged into their unprefixed siblings, or removed as duplicates — and separately run the exhaustive §3/§4/§5 template audit across all 20 categories.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- All 20 category subdirectories and their scenario files under `manual-testing-playbook/`.
- The `procedure-card-contract/` cross-mode-residue question.
- The root `manual-testing-playbook.md`.

### Out of Scope
- `manual-testing-playbook/licensing-and-provenance/licensing-and-provenance-integrity.md` (scenario `ID-007`) — the dispatching brief notes this will be deleted or inverted by sibling packet `001-apache-devendoring`; do not modify it here, only note its coupling.
- `references/`, `assets/`, `procedures/`, `corpus/`, `scripts/`, `feature-catalog/`, `changelog/` — sibling children.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `procedure-card-contract/foundations-card-selection-proof.md` | Audit/Modify | Probable mode-consolidation residue; disposition pending root-cause confirmation |
| `procedure-card-contract/foundations-direct-fallback-without-subagents.md` | Audit/Modify | Same category of finding |
| `procedure-card-contract/foundations-no-card-fallback.md` | Audit/Modify | Same category of finding |
| `licensing-and-provenance/licensing-and-provenance-integrity.md` (ID-007) | No change | Explicitly excluded — owned by `001-apache-devendoring` |
| Remaining 19 categories | Audit | Not yet exhaustively read against §3-§5 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Confirm or refute the mode-consolidation hypothesis for the 3 `foundations-*` files | Root cause documented with evidence (git history, spec-folder trail, or content comparison) |
| REQ-002 | Every scenario row in every category audited for the 9-column contract and `{PREFIX}-{NNN}` ID format, with no renumbering of published IDs | Verdict recorded per category |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Disposition decided for the 3 `foundations-*` files (rename / merge / remove) | Operator sign-off recorded before any deletion |
| REQ-004 | `licensing-and-provenance/` `ID-007` left untouched, coupling noted in `implementation-summary.md` | No edit made to that file by this child |
| REQ-005 | Root `manual-testing-playbook.md` re-read against `manual-testing-playbook-template.md` §5-§6 directory/review-protocol requirements | Verdict recorded |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The `foundations-*` residue question has a confirmed root cause and an operator-approved disposition, not a guess acted on unilaterally.
- **SC-002**: All 20 categories pass the 9-column scenario contract and ID-format check, with `ID-007` explicitly excluded from this child's edits.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Deleting the `foundations-*` files without confirming they are truly redundant could remove real coverage for the 3 procedure cards they reference | Silent test-coverage loss | Confirm whether `component-system-inventory.md`, `hierarchy-rhythm-review.md`, `tweakable-design-controls.md` already have equivalent unprefixed scenario coverage before removing anything |
| Dependency | Sibling packet `001-apache-devendoring` | Editing `ID-007` here would conflict with that packet's ownership | Do not touch `licensing-and-provenance-integrity.md` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Was `foundations` a standalone mode later merged into `design-interface`? If confirmed, should the 3 `foundations-*` scenario files be renamed (drop the stale prefix) or merged into their unprefixed `procedure-card-contract/` siblings, given the underlying procedure cards they test already live in `design-interface/procedures/`?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- **Parent Spec**: `../spec.md`
- **Governing template**: `.opencode/skills/sk-doc/create-manual-testing-playbook/assets/manual-testing-playbook-template.md`
- **Related finding**: `../009-changelog/spec.md` (the `foundations` changelog entry sharing the same residue hypothesis)
- **Excluded scenario**: `licensing-and-provenance/licensing-and-provenance-integrity.md` (`ID-007`, owned by sibling `001-apache-devendoring`)
