---
title: "Verification Checklist: Close retirement residue + finish interrupted design-interface leaf docs"
description: "Verification checklist for the two tracks: vocabulary-residue fixes and evidence-backed leaf documentation reconciliation."
trigger_phrases:
  - "retirement residue checklist"
  - "audit foundations vocabulary cleanup checklist"
  - "design-interface leaf docs finish checklist"
importance_tier: "important"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/011-retirement-residue"
    last_updated_at: "2026-07-27T12:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored verification checklist, no item checked yet"
    next_safe_action: "Verify CHK-001 once Track A sites are re-confirmed"
    blockers: []
    key_files:
      - ".opencode/specs/sk-design/014-template-conformance/002-design-interface/006-scripts/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Close retirement residue + finish interrupted design-interface leaf docs
<!-- SPECKIT_LEVEL: 2 -->

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

- [ ] CHK-001 [P0] All five Track A sites re-confirmed present with a fresh `rg` before editing
  - **Evidence (planned):** `rg -n "foundations|audit"` per site
- [ ] CHK-002 [P0] Each of `006-009`'s `spec.md` requirements read in full before its on-disk state is inspected
  - **Evidence (planned):** per-leaf read confirmation noted in `implementation-summary.md`
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality [Track A residue]

- [ ] CHK-010 [P0] `design-md-generator/SKILL.md:246` no longer lists `foundations`/`audit`
  - **Evidence (planned):** `rg -n "foundations|audit" design-md-generator/SKILL.md`
- [ ] CHK-011 [P0] `canary-cases.v1.json`'s `foundations`/`audit` test cases retired or updated
  - **Evidence (planned):** `rg -n "\"foundations\"|\"audit\"" .../canary-cases.v1.json`
- [ ] CHK-012 [P1] `install-guides/README.md`'s sk-design row reflects current modes/commands
  - **Evidence (planned):** row diff
- [ ] CHK-013 [P1] `command-contract.json:81`'s `invocation_aliases` drops retired aliases
  - **Evidence (planned):** `rg -n "foundations|audit" command-contract.json`
- [ ] CHK-014 [P1] `shared-base-not-workflow.md:34`'s mode-count claim updated
  - **Evidence (planned):** line diff
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing [Track B leaf verification]

- [ ] CHK-020 [P0] `006-scripts`'s on-disk `design-interface/scripts/` state verified against its `spec.md` requirements, with a genuine pass/fail note
  - **Evidence (planned):** `002-design-interface/006-scripts/implementation-summary.md` verification note
- [ ] CHK-021 [P0] `007-feature-catalog`'s on-disk state verified against its `spec.md` requirements
  - **Evidence (planned):** `002-design-interface/007-feature-catalog/implementation-summary.md` verification note
- [ ] CHK-022 [P0] `008-manual-testing-playbook`'s on-disk state verified against its `spec.md` requirements
  - **Evidence (planned):** `002-design-interface/008-manual-testing-playbook/implementation-summary.md` verification note
- [ ] CHK-023 [P0] `009-changelog`'s on-disk state verified against its `spec.md` requirements
  - **Evidence (planned):** `002-design-interface/009-changelog/implementation-summary.md` verification note
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness [doc reconciliation, no rubber-stamping]

- [ ] CHK-030 [P0] Every `checklist.md` mark for `006-009` cites real evidence, not a copy of the `005-corpus` pattern
  - **Evidence (planned):** per-leaf checklist evidence lines
- [ ] CHK-031 [P1] `design-motion/`-internal residue (`README.md`, `corpus-map.md`) is explicitly named as deferred to `010-motion-merge`, not fixed here
  - **Evidence (planned):** this packet's spec.md Out of Scope section
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security [n/a]

- [ ] CHK-040 [P2] No secrets or credentials touched by this packet
  - **Evidence (planned):** diff review confirms markdown/JSON content only
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-050 [P1] `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` describe the same two-track scope
  - **Evidence (planned):** cross-read of all five packet files
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization [final sweep]

- [ ] CHK-060 [P0] `rg -n "foundations|audit"` across all five Track A sites returns nothing
  - **Evidence (planned):** command output attached to `implementation-summary.md`
- [ ] CHK-061 [P1] `006-009`'s checklist and implementation-summary agree with each other and with the real on-disk state
  - **Evidence (planned):** cross-read per leaf
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 0/8 |
| P1 Items | 5 | 0/5 |
| P2 Items | 1 | 0/1 |

**Verification Date**: TBD (packet authored 2026-07-27; no work started, nothing verified yet)
<!-- /ANCHOR:summary -->
