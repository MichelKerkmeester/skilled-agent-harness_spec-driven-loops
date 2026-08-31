---
title: "Feature Specification: repo-rules router and rule-set routing audit and optimisation"
description: "The repo-rules router was suspected of carrying avoidable context cost. Measurement shows the router is near-optimal and the cost was measured against the wrong unit, while an em-dash sweep left silent punctuation damage in four repositories' routers and rule files."
trigger_phrases:
  - "repo rules router audit"
  - "trigger table optimisation"
  - "rule set context cost"
  - "gate 5 load measurement"
  - "router smart routing transfer"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: repo-rules router and rule-set routing audit and optimisation

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-08-31 |
| **Branch** | `skilled/v4.0.0.0` (uncommitted) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The `REPO RULES.md` router and its nine rule files were suspected of carrying avoidable
context cost and of routing imprecisely. A prior analysis concluded the router is not
where cost lives, comparing 7.4 KB loaded once against `AGENTS.md` at 51.6 KB per turn,
and that conclusion had never been tested against what Gate 5 actually loads. Separately,
an em-dash removal sweep passed over the router and rule files and left punctuation
damage that corrupted two table cells and roughly thirty label-and-gloss constructions,
replicated identically across four repositories.

### Purpose

Establish by measurement where the rule system's context cost actually sits, decide what
transfers from the skill smart-routing machinery, and repair the damage found, without
removing a single word of matching vocabulary.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Measurement of the real Gate 5 payload against a realistic action corpus.
- Comparison of the repo-rules trigger table against `hub-router.json`, root `ROUTER.md`
  and the advisor scorer, with a transfer verdict for each mechanism.
- Punctuation repair of de-em-dash residue in `REPO RULES.md` and `repo-rules/*.md`.
- Generalisation of the two-trigger load language in `AGENTS.md` Gate 5 and the router.
- The same two corrections in `repo-rules-router-template.md`, so the defect is not re-emitted.

### Out of Scope

- Shortening any trigger row, index row, or `trigger_phrases` block. The trigger table is
  the match surface and its length is the routing.
- Editing the three sibling repositories. They carry the identical defect and are named
  for follow-up, not touched.
- Any `sk-doc` hub-root file. Owned by another concurrent stream.
- Building an automated invariant checker. Proposed with evidence, deliberately not built.
- The pre-existing `missing_required_section: overview` validator error on the router
  template. Confirmed present at `HEAD` before this work; an adjacent problem, named not fixed.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `REPO RULES.md` | Modify | Repair 4 punctuation defects; generalise load rule 4 |
| `AGENTS.md` | Modify | Generalise Gate 5 step 3 and its output line |
| `repo-rules/blast-radius.md` | Modify | 3 punctuation repairs |
| `repo-rules/communication.md` | Modify | 8 punctuation repairs |
| `repo-rules/delegation-and-orchestration.md` | Modify | 1 table cell, 2 parenthetical restorations |
| `repo-rules/evidence-and-proof.md` | Modify | 8 punctuation repairs |
| `repo-rules/prevent-overengineering.md` | Modify | 1 table cell repair |
| `repo-rules/root-cause-and-debugging.md` | Modify | 9 punctuation repairs |
| `repo-rules/scope-discipline.md` | Modify | 3 punctuation repairs |
| `.opencode/skills/sk-doc/sk-create-repo-rule/assets/repo-rules-router-template.md` | Modify | Same 2 corrections plus load rule 4, so new repos start correct |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every invariant holds after the change | `scratch/invariant-check.cjs` reports 9/9/9 rows, 0 broken links, 164 phrases, 0 collisions, dividers equal numbered sections in all 10 files |
| REQ-002 | No matching vocabulary is deleted | Trigger phrase count is 164 before and after; the 37 trigger-row action clauses are unchanged |
| REQ-003 | The prior cost analysis is answered with measurement, not assertion | A token-level measurement of the real Gate 5 payload is recorded, and the prior figure is either reproduced or corrected |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Each smart-routing mechanism gets an explicit transfer verdict with a reason | `hub-router.json`, `ROUTER.md` INTENT_SIGNALS/RESOURCE_MAP and the advisor scorer are each judged, citing whether a runtime consumer exists |
| REQ-005 | Downstream effects on the three sibling repositories are stated | The symlink topology is verified by inspection and the propagation consequence of a rename is stated |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate.sh <this folder> --strict` returns an explicit `RESULT: PASSED`.
- **SC-002**: The measured mean Gate 5 payload is recorded in tokens, with the corpus that produced it.
- **SC-003**: The set is left with zero de-em-dash residue in the router and the nine rule files.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `AGENTS.md` is symlinked from three sibling repos | An edit propagates instantly to all four repositories | The only `AGENTS.md` change is a faithful generalisation of an existing instruction; it cannot invalidate a rule |
| Risk | Punctuation repair could alter a load-bearing sentence | Medium | Every repair is punctuation-only; the full diff was reviewed line by line and word counts are unchanged |
| Risk | Concurrent streams share a dirty tree | High | Only the four owned surfaces were touched; nothing was staged, stashed, reset or committed |
| Risk | The template edit sits outside the explicitly granted ownership list | Low | It is a named subject of the brief, is not a hub-root file, and no other stream is in that packet; flagged in the report |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the invariant check become an automated gate? It is proposed with a reference
  implementation in `scratch/`, and deliberately not wired, because no owner for a
  `repo-rules` checker exists today.
- The three sibling repositories carry the identical precedence-cell and load-rule
  defects. Who applies the same repair there, and when?
<!-- /ANCHOR:questions -->

---
