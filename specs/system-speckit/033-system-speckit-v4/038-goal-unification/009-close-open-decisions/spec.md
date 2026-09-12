---
title: "Feature Specification: Close every open goal decision"
description: "The four decisions the hardening phase left to the operator, the last review advisories, and the Devin host merge unknown, all closed and pinned by tests."
trigger_phrases:
  - "goal open decisions closed"
  - "goal criteria field"
  - "goal non-utf8 refusal"
  - "goal devin merge rule"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Close every open goal decision

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-11 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 9 |
| **Predecessor** | 008-hardening-research |
| **Successor** | None |
| **Handoff Criteria** | No open decision, no open advisory, no unknown; every change pinned by a test |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## 2. PHASE CONTEXT

The hardening phase closed its do-now list and recorded four items as decisions the operator had to
make, plus one unknown that needed a live run. This phase takes those five and closes them, together
with the last review advisories that were still only verified rather than fixed.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 3. PROBLEM

Five things were open. Completion criteria were flattened into the objective line, so a budget cut
landed mid-requirement in the part that decides when work is done. A goal document that was not valid
UTF-8 corrupted on the first log append. Claude Code and Codex had no resend signal at all. The three
lifecycle workflow files each carried the same goal contract with nothing checking they stayed the
same, and they had already drifted once. The goal contract documents sat outside the retrieval corpus.
Separately, the Devin host's rule for two hooks writing the same context field was unrecorded.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 4. SCOPE

**In scope:** the shared slice module, both renderers, the packet log append, the spec-doc validator's
binding-row rule, the three lifecycle workflow assets, the retrieval corpus roots and its coverage
table, the goal hook README, the Devin goal-hook playbook, and the tests that pin each change.

**Out of scope:** any frozen decision from the decision record. Nothing here reopens one.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 5. REQUIREMENTS

| ID | Requirement |
|----|-------------|
| REQ-001 | Completion criteria render as their own field, one per line, in both renderers and in the compact block. |
| REQ-002 | A criteria budget drops whole items and reports how many it left behind. |
| REQ-003 | The objective line names the packet only, so criteria appear once rather than twice. |
| REQ-004 | A log append refuses a goal document that is not valid UTF-8 with a named error and leaves the bytes untouched. |
| REQ-005 | The binding-row rule accepts markdown link notation and enforces real-path containment. |
| REQ-006 | Claude Code and Codex have a resend signal based on the durable-slice hash, and the workflows state the nesting rules. |
| REQ-007 | A test fails when the three lifecycle workflow goal blocks differ. |
| REQ-008 | The goal contract documents are reachable from the trigger index. |
| REQ-009 | The Devin host's context merge rule is recorded from a live run. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 6. SUCCESS CRITERIA

Every requirement above holds, each pinned by a test that fails when the behaviour is removed. The
goal hook suites, the OpenCode plugin suites, the spec-doc validator suite and the retrieval suites
all pass, and the packet validates strict with no errors.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 7. RISKS

Adding a field to the injected block changes what every runtime's adapter passes through. No adapter
parses the block's fields, so the risk is confined to the two renderers, and a parity test pins them
together. Adding a corpus root grows a committed generated artifact; the coverage table records the
reason so the growth is a decision rather than a drift.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS

None. The four decisions were put to the operator and answered, and the Devin unknown was settled by a
live run.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## 9. NON-FUNCTIONAL REQUIREMENTS

The injected block stays within its character budget with criteria included, and the compact fallback
keeps the criteria field because that is the case where losing them matters most.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 10. EDGE CASES

A plain text goal has no criteria heading, so the split returns the whole text as the headline and the
block keeps its previous shape. A criteria list that cannot fit even one item reports the count rather
than rendering an empty label. A binding row whose second cell is a table separator is not a target.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 11. COMPLEXITY

Level 1 by the recommender at 260 changed lines across 14 files, with no API, auth, database or
architectural change.
<!-- /ANCHOR:complexity -->
