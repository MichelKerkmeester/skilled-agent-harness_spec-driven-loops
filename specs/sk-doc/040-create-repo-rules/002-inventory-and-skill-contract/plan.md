---
title: "Implementation Plan: Phase 2: Inventory and Skill Contract"
description: "Read the nine-file corpus structurally into an element table, then turn it into an anatomy contract where every element cites a rule that uses it. Separately recover the tests that decide whether a rule may exist from the six phase records that established them. The test of the output is that phase 3 can build a template without re-reading the corpus."
trigger_phrases:
  - "rule inventory plan"
  - "anatomy contract"
  - "decision test recovery"
  - "mode boundary"
  - "element traceability"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: Inventory and Skill Contract

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown; a throwaway parser in `scratch/` for the structural inventory |
| **Framework** | The eight shipped rules and `REPO RULES.md` are the entire input corpus |
| **Storage** | Four contract documents inside this phase folder |
| **Testing** | Traceability audit (every element cites a rule), coverage audit (every rule element appears), and `validate.sh --strict` |

### Overview
Read nine files structurally rather than semantically: extract frontmatter keys, section headings, divider placement, self-check shape and cross-reference style into a table, then find what all eight agree on. Separately, recover the decisions that govern whether a rule may exist from the six phase records that established them, citing each. The output is four documents, and the test of them is that phase 3 can build a template without re-reading the corpus.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 1 closed and validating, so the corpus is stable
- [x] The six phase implementation summaries identified as the source for decision-test recovery

### Definition of Done
- [x] All acceptance criteria met
- [x] Every anatomy element cites a shipped rule
- [x] Every divergence classified as permitted variant or forbidden defect
- [x] Docs updated (spec/plan/tasks/acceptance-criteria)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Inventory then contract, as two separate passes with a written artifact between them. The inventory is mechanical and reproducible; the contract is judgment applied to it. Keeping them apart is what lets a reader check whether a contract element is supported by the corpus or asserted over it.

### Key Components
- **Structural extractor** (`scratch/`): parses the nine files into a per-file element table. Throwaway - the table is the artifact, not the script.
- **`rule-anatomy.md`**: MUST-carry and MAY-carry elements, each with citations.
- **`decision-tests.md`**: the gate on existence, recovered from the phase records.
- **`mode-boundary.md`**: ownership against sibling modes.
- **`target-tree.md`**: the packet layout, justified against a sibling mode's tree.

### Data Flow
Nine files to an element table, table to anatomy contract, phase records to decision tests, sibling modes to the boundary, sibling tree to the target tree. Phase 3 consumes the anatomy and the target tree; phase 4 consumes the decision tests; phase 5 consumes the integration surface.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase writes only inside its own folder, so the inventory is about what it reads and must not disturb.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `repo-rules/*.md` (8 files) | The corpus being inventoried | read-only | `git diff --stat -- repo-rules/` empty after the phase |
| `REPO RULES.md` | Router; inventoried separately from the rules | read-only | Unchanged |
| Phase 1's six implementation summaries | The record the decision tests are recovered from | read-only | Each recovered test cites its phase |
| Sibling `sk-doc` modes | The boundary is drawn against them | read-only | Named in `mode-boundary.md`, not modified |
| This phase folder | The only write target | create | Four contract documents present |

Required inventories:
- Same-class producers: every file under `repo-rules/` plus the router - nine, no sampling, because a contract built from a sample is the failure the delegation rule names.
- Consumers of changed symbols: none - this phase changes nothing outside itself.
- Matrix axes: 9 files x element class (frontmatter, triggers, binding sentence, body, self-check, cross-references); every cell either has a value or an explicit absence.
- Algorithm invariant: an element appears in the contract if and only if at least one shipped rule uses it.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

`tasks.md` owns the numbered task state (T001-T014); the stages below say what each one has to establish before the next can start.

### Phase 1: Inventory
- [x] All nine files parsed into a per-file element table
- [x] Divergences identified mechanically rather than by impression

### Phase 2: Contract
- [x] `rule-anatomy.md` written with per-element citations, MUST and MAY separated
- [x] Each divergence classified as permitted variant or forbidden defect
- [x] `decision-tests.md` recovered from the phase records, each test citing its source

### Phase 3: Boundary and tree
- [x] `mode-boundary.md` names what the mode does not own and who does
- [x] `target-tree.md` justified against a sibling mode's actual layout
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Traceability | Every anatomy element cites a shipped rule | Resolve each citation to file and section |
| Coverage | Every element the corpus uses appears in the contract | Diff the element table against the contract |
| Recovery | Every decision test cites the phase that established it | Open each cited phase record |
| Non-disturbance | The corpus is unchanged | `git diff --stat -- repo-rules/ 'REPO RULES.md'` |
| Usability | The decision tests work without reading the rules | Apply them to the ten candidates phase 1 refused; the same ten should fail |
| Packet gate | Spec docs validate | `validate.sh <folder> --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The eight rules and the router | Internal | Green - shipped and validating | No corpus, no contract |
| Phase 1's six implementation summaries | Internal | Green | The decision tests would be restated from memory instead of recovered |
| A sibling mode's tree to inherit from | Internal | Green - `sk-create-changelog` and `sk-create-diagram` both available | The target tree would be invented |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: phase 3 finds the contract does not describe the corpus, or a decision test refuses a rule the shipped set contains.
- **Procedure**: the phase writes only inside its own folder, so `git checkout` of this directory reverts everything. Nothing downstream exists yet to unwind.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Parse the corpus --> Element table --> Anatomy contract
                                   \--> Divergence classification
Phase records ------------------------> Decision tests
Sibling modes -------------------------> Boundary + target tree
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Inventory | Phase 1 closed | Anatomy contract |
| Anatomy contract | Inventory | Phase 3 template |
| Decision tests | Phase records | Phase 4 standards |
| Boundary and tree | Sibling modes | Phase 3 scaffold |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Inventory | Low | under an hour, mostly mechanical |
| Contract | Medium | 2-3 hours - the cost is citation discipline, not writing |
| Boundary and tree | Low | under an hour |
| **Total** | | **half a day** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Corpus confirmed unchanged before the phase starts, so non-disturbance is provable after
- [x] The element table captured before any contract prose is written
- [x] No feature flag or monitoring applies - these are documents

### Rollback Procedure
1. `git checkout -- <this phase folder>`
2. Confirm `repo-rules/` and `REPO RULES.md` are untouched
3. Nothing downstream to unwind

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

