---
title: "Feature Specification: Phase 24: dsh-docs-alignment"
description: "The release notes, the root README, the spec-kit README and the deep-loop docs still describe the state log, the loop save and the executor gate as they were before phases 019 to 023. This phase brings those docs in line with the shipped code."
trigger_phrases:
  - "dsh docs alignment"
  - "phase 24 dsh docs alignment"
  - "deep loop save full-auto docs"
  - "executor_missing failure mode docs"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 24: dsh-docs-alignment

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-15 |
| **Branch** | `worktrees/407-dsh-docs-alignment` |
| **Parent Spec** | ../spec.md |
| **Phase** | 24 of 24 |
| **Predecessor** | 023-dsh-lineage-executor-check |
| **Successor** | None |
| **Handoff Criteria** | Each edited doc validates with no new issue, the contract drift check prints OK and both spec folders validate strict |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 24** of the DeepSeek Harness creation specification. Phases 019 to 023 changed how the deep loop records its executor, saves continuity and checks each iteration. An alignment report found that the docs describing those parts still told the older story.

**Scope Boundary**: doc edits only, in the files listed under Files to Change. No code changes.

**Dependencies**:
- Phases 019 to 023, whose shipped behavior these docs now describe
- The alignment report run `20261115T095438Z`, which named each drift

**Deliverables**:
- Release notes that cover the executor row, the failure rows, the loop save and `executor_missing`
- Deep-loop protocol and skill docs that match the shipped workflows
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The open v4.0.2.1 release notes never mention the executor row, the failure rows reaching the ledger, the loop save's `--full-auto` or the `executor_missing` gate. The root README says nothing writes the state file directly, which is false for a log with no ledger. The deep-loop protocol docs show save commands that only plan or that the writer rejects.

### Purpose
Bring the release notes, the two READMEs and the deep-loop docs in line with the code that phases 019 to 023 shipped.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ grep -c "cli-deepseek-harness" .skilled/changelog/skilled/v4.0.2.1.md
0
$ grep -n "generate-context.js" .skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md
579:1. **Generate context**: `node .skilled/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js {spec_folder}`
$ grep -n "single state writer" .skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md
730:- `reduce-state.cjs` is the single state writer.
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add release-note entries for the executor row, the failure rows, the loop save and `executor_missing`, and fill the missing inventory versions
- Correct the root README's direct-write sentence
- Name the packet purpose line in the spec-kit README
- Fix the save commands, the state-writer bullet and the failure modes in the deep-loop docs
- Correct the deep-research executor-branch sentence

### Out of Scope
- Code changes - this phase edits docs only
- Other drift the report names in files outside this list - each belongs to its own owner

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/changelog/skilled/v4.0.2.1.md` | Modify | New Deep Loop item, a Smaller Fixes bullet and inventory versions |
| `README.md` | Modify | Direct-write sentence |
| `.skilled/skills/system-spec-kit/README.md` | Modify | Packet purpose line |
| `.skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md` | Modify | Save command, state writer, `executor_missing` |
| `.skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md` | Modify | Save command and verify step |
| `.skilled/skills/system-deep-loop/deep-research/SKILL.md` | Modify | Executor branch sentence |
| `.skilled/commands/deep/assets/compiled/*.contract.markdown` | Modify | Regenerated source digests |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The documented save commands match the workflow save step | `grep -c "full-auto"` on each loop protocol prints at least 1 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Each edited doc validates with no new issue | `validate_document.py` prints the same issue count as before the edit |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node scripts/check-contract-drift.cjs` in the deep-loop runtime prints `[CONTRACT DRIFT] OK commands=2`.
- **SC-002**: `validate.sh` prints `RESULT: PASSED` for this phase and its parent with `--strict`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The compiled command contracts pin the protocol docs by digest | Drift check fails after an edit | Regenerate both contracts with `compile-command-contracts.cjs --write` |
| Risk | A doc claim that does not match the code | Med | Check each claim against the workflow YAML and the runtime source before writing |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None
<!-- /ANCHOR:questions -->

---
