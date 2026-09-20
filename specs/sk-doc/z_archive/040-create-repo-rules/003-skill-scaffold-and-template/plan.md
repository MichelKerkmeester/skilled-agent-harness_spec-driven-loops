---
title: "Implementation Plan: Phase 3: Skill Scaffold and Templates"
description: "Scaffold the mode packet to the documented tree, author SKILL.md to sk-create-skill section contract with the decision tests as its opening step, and write both templates from the phase-2 contract rather than from a shipped rule. The corpus is the fixture the result is checked against, never the source it is copied from."
trigger_phrases:
  - "scaffold plan"
  - "rule template authoring"
  - "router template"
  - "structural parity check"
  - "contract not corpus"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: Skill Scaffold and Templates

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown; the packet is documents, not code |
| **Framework** | `sk-create-skill`'s nested-workflow-packet contract |
| **Storage** | `.opencode/skills/sk-doc/sk-create-repo-rule/` |
| **Testing** | Generate a rule from the template, run the structural assertions the shipped rules pass, compare |

### Overview
Scaffold the tree from `target-tree.md`, author `SKILL.md` to `sk-create-skill`'s section contract with the four decision tests as its opening step, then write the two templates **from the contract documents rather than from a shipped rule**. That order is the whole point: copying a rule would reproduce the corpus while proving nothing about whether phase 2's contract is correct. The check comes after, by generating a rule and running the same assertions the corpus passes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 2 closed; four contract documents available
- [x] `sk-create-skill`'s template contract read - required sections identified
- [x] The structural assertions the shipped rules pass, restated as a runnable check

### Definition of Done
- [x] All acceptance criteria met
- [x] A rule generated from the template passes every structural assertion
- [x] The packet tree matches `target-tree.md`, deferrals included
- [x] Docs updated (spec/plan/tasks/acceptance-criteria)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Contract to template to generated artifact, checked against the corpus at the end rather than copied from it at the start. The corpus is a **fixture**, not a source.

### Key Components
- **`SKILL.md`**: decision tests first, authoring second. Most invocations end at the tests.
- **`assets/repo-rule-template.md`**: MUST elements fixed, numbered body open, placeholders self-describing.
- **`assets/repo-rules-router-template.md`**: structurally distinct - the router is a different document class.
- **`references/`**: the two contract documents, as the generation authority `SKILL.md` points at rather than embeds.

### Data Flow
A user request reaches `SKILL.md`, runs the four decision tests, and either refuses with the failed test named or proceeds. On proceed, the mode checks whether a router exists, emits one if not, then fills the rule template and reports where the wiring still has to happen - which phase 5 will contract.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

First write into `.opencode/`, so the inventory is about what the new packet could disturb.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/sk-doc/` hub | Routes to twelve modes | unchanged this phase - registration is phase 6 | `mode-registry.json` byte-unchanged |
| `repo-rules/` corpus | The fixture the template is checked against | read-only | md5 set unchanged |
| `sk-create-skill` | Owns the packet contract | read-only; followed, not modified | Its template sections present in the new `SKILL.md` |
| The new packet | Created here | create | Tree matches `target-tree.md` exactly |
| Advisor metadata | A skill root needs identity files | **not applicable to a nested mode packet** - verified against a sibling before assuming | Compare against `sk-create-changelog`, which carries none |

Required inventories:
- Same-class producers: every sibling nested mode under `sk-doc/`, to confirm what a mode packet does and does not carry at its root.
- Consumers of changed symbols: none - nothing routes to the mode until phase 6.
- Matrix axes: template (rule, router) x element class (frontmatter, triggers, binding sentence, body, self-check).
- Algorithm invariant: a file generated from the rule template satisfies every assertion the eight shipped rules satisfy.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

`tasks.md` owns the numbered task state (T001-T015); the stages below say what each one has to establish before the next can start.

### Phase 1: Scaffold
- [x] Sibling mode packet inspected, so the root carries what a nested mode carries and nothing more
- [x] Tree created to `target-tree.md`, deferrals respected

### Phase 2: Author
- [x] `SKILL.md` to `sk-create-skill`'s section contract, decision tests first
- [x] Rule template written from the anatomy contract, corpus unopened
- [x] Router template written from the router's measured structure
- [x] `references/` seeded and routed

### Phase 3: Prove
- [x] A rule generated from the template
- [x] The shipped-corpus assertions run against it, and against the corpus, with the same result
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Generation | A real rule produced from the template | Fill the template for a concrete subject |
| Structural parity | The generated rule passes what the corpus passes | The phase-2 inventory parser, run over both |
| Frontmatter | The generated rule parses as YAML with six keys | `yaml.safe_load` |
| Divider invariant | Dividers equal numbered sections | Counted, not eyeballed |
| Tree conformance | The packet matches `target-tree.md` | Directory diff against the documented tree |
| Non-disturbance | Corpus and hub unchanged | md5 set and `git diff --stat` |
| Packet gate | Spec docs validate | `validate.sh <folder> --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 2 contract documents | Internal | Green | The templates would have no source but the corpus, which proves nothing |
| `sk-create-skill` template contract | Internal | Green | The packet would not conform to its family |
| A sibling nested mode to compare root files against | Internal | Green - `sk-create-changelog` | Root metadata would be guessed |
| The phase-2 inventory parser | Internal | Green - in phase 2's `scratch/` | Structural parity would be checked by eye |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the generated rule fails structural parity, meaning the contract is wrong rather than the template.
- **Procedure**: `rm -rf` the new packet. Nothing routes to it until phase 6, so the blast radius is one directory and no consumer exists. If the contract is at fault, phase 2 reopens - which is the outcome this phase's ordering was designed to surface.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Inspect sibling --> Scaffold tree --> Author SKILL.md
                                 \--> Author rule template ---> Generate --> Structural parity
                                 \--> Author router template
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Inspect sibling | Phase 2 | Scaffold |
| Scaffold | Inspect sibling | Author |
| Author templates | Contract documents | Generate |
| Generate | Rule template | Structural parity |
| Structural parity | Generate | Phase 4 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Scaffold | Low | under an hour |
| Author | Medium | 2-3 hours - `SKILL.md` and two templates |
| Prove | Low | under an hour, the parser already exists |
| **Total** | | **half a day** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Corpus md5 set captured before the phase, so non-disturbance is provable
- [x] Hub registration files confirmed untouched at the start
- [x] No feature flag applies; nothing routes to the packet yet

### Rollback Procedure
1. `rm -rf .opencode/skills/sk-doc/sk-create-repo-rule/`
2. Confirm the hub files and the corpus are unchanged
3. If the failure was structural parity, reopen phase 2 rather than patching the template

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

