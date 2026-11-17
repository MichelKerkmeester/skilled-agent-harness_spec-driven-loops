---
title: "Implementation Plan: Move the changelog spec-folder blockquote from under the summary to the end of the entry in the template and in every existing changelog"
description: "A script moves the blockquote to the end of 2,795 changelogs, Hy4 Flash Free moves it per section in 19 multi-block files, and the template, contract and worked example state the new position."
trigger_phrases:
  - "changelog spec folder at bottom plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Move the changelog spec-folder blockquote from under the summary to the end of the entry in the template and in every existing changelog

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3 script, Markdown |
| **Framework** | None |
| **Storage** | None |
| **Testing** | Dry run, line-multiset check, the two changelog gates |

### Overview
A Python script moves the spec-folder blockquote in every single-block changelog. Hy4 Flash Free at high thinking moves the blocks in the 19 multi-block files, on copies that are checked before copy-back. The template, the SKILL.md contract and the worked example then state the new position.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] The dry run prints `{'already last': 2796, 'spec lines': 19}` and the gate results diff clean
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One-shot document migration.

### Key Components
- **`scratch/move_spec_block.py`**: moves the blockquote that holds the spec line, plus its `>` continuation lines, to the end of the file. It skips files with several spec lines or a fenced spec line.

### Data Flow
The file list feeds the script. The script dry-runs, then writes with `--apply`. The skipped files go to Hy4 as copies, and each checked output is copied back.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

N/A. This is a format change, not a fix. The consumers were checked anyway:

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `check_changelog_shape.py` | Matches the spec line anywhere | unchanged | Same result per file before and after |
| `create-changelog-*.yaml` | Checks the blockquote is present | unchanged | `rg -n blockquote` shows no position rule |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup lists the 2,815 changelogs and records the gate baseline. Implementation runs the script, then Hy4 on the 19 skipped files, then edits the three skill docs. Verification reruns the dry run and the gates and diffs them against the baseline. The ordered tasks are in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | One sample per block shape | Dry-run diff |
| Integration | The 1,181 `.skilled` changelogs | `check_changelog_shape.py`, `validate_document.py` |
| Manual | The 19 Hy4 outputs | Line-multiset and placement check |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Python 3 | Internal | Green | The script cannot run |
| OpenCode 1 with opencode-go | External | Green | The 19 multi-block files wait |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a changelog loses or changes text beyond the moved blockquote.
- **Procedure**: `git checkout -- $(cat scratch/changelog-files.txt)` restores every changelog, and reverting the three skill docs restores the old rule.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | The gate baseline | Verification |
| Verification | The applied migration | Closure |
<!-- /ANCHOR:phase-deps -->

---
