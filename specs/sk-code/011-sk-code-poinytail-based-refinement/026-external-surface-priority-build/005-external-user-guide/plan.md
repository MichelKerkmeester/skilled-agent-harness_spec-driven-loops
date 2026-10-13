---
title: "Implementation Plan: External user guide"
description: "Merge phases 001 to 004 into an integration worktree, rewrite the README adaptation block as the guide, mark OpenCode native in the canonical inventories, write the next release note, and prove the guide with a fresh agent in a fresh full-tree copy."
trigger_phrases:
  - "external user guide plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: External user guide

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown |
| **Framework** | None |
| **Storage** | None |
| **Testing** | A fresh-agent run in a full-tree copy; `validate_document.py`; the live gates |

### Overview
Doc edits on top of the merged behavior of 001 to 004. The proof is a reader test: a fresh DeepSeek agent gets only the adaptation block and a copy of the tree, and must reach the green battery and the tied route without help.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One guide where users already start, with the canonical sentence pointing the same way

### Key Components
- **README adaptation block**: the external user's first adaptation doc
- **`SKILL.md:40`**: the surface list every sk-code doc defers to
- **The next Skilled release note**: where the operator's users learn the rule

### Data Flow
The user reads the block, edits the hub, commits with hooks (re-mint and manifest copy), and runs the battery the block lists.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `README.md` | First doc and adaptation guide | Update | Criteria 1 and 2; P11-1 to P11-4 |
| `.skilled/skills/sk-code/SKILL.md` | Canonical surface sentence | Update | Criterion 1 |
| `.skilled/skills/sk-code/README.md` | Hub inventory | Update | Criterion 1 |
| `.skilled/changelog/skilled/` | Release notes | Add the next note | Criterion 3 |

Required inventories:
- Same-class claims: `grep -rnE "Three ready surfaces|exactly three surfaces|Replace the (shipped|surface)" README.md .skilled/skills/sk-code/*.md` lists every sentence that presents three peer surfaces or tells the user to replace OpenCode; each is changed or shown to be out of the R4 set.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Reader test: build a fresh full-tree copy by research run V0's recipe under the session scratchpad. Dispatch a fresh DeepSeek agent (cli-devin or cli-pi, as `goal.md` says) with its working directory in the copy and a prompt that holds the adaptation block verbatim and the task: remove both example surfaces, add a surface `sk-code-acme` whose vocabulary holds `acme`, then run the block's verification list. Record the dispatch command and the prompt (P11-4), then rerun the five gates and the tie prompt yourself (P11-1 to P11-3). When the agent fails, fix the block, not the agent's prompt, and rerun in a fresh copy.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Reader test | The guide end to end | A fresh agent in a full-tree copy |
| Integration | Live gates on the merged tree | Drift wrapper, doctor, guard, sync `--check`, CI metadata |
| Doc | Every touched doc | `validate_document.py` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 001 to 004 finished branches | Internal | Upstream | The reader test fails on the old behavior |
| DeepSeek executor | External | Available | Fall back from Devin to cli-pi |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The reader test cannot pass with any wording.
- **Procedure**: Revert this phase's commits and report which step blocks, with the copy's output.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | 001 to 004 | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Med | Integration merges and live gates |
| Core Implementation | Med | Guide, markers, release note |
| Verification | High | Reader test and a five-iteration review |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Live gates recorded on the merged tree before any doc edit

### Rollback Procedure
1. Revert the phase commits.
2. Rerun the live gates.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A; every change is a tracked file
<!-- /ANCHOR:enhanced-rollback -->
