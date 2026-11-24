---
title: "Feature Specification: Phase 5: post-alignment-doc-fixes"
description: "Fix the two gaps the alignment review found after the cli-orca removal: the skills index still counted three cli-* skills, and the open root release notes did not record the removal."
trigger_phrases:
  - "cli orca post alignment doc fixes"
  - "skills index family counts"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 5: post-alignment-doc-fixes

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-24 |
| **Branch** | `worktrees/536-provision-dev-dependencies` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 5 |
| **Predecessor** | 004-regeneration-and-zero-reference-proof |
| **Successor** | None |
| **Handoff Criteria** | The skills index counts match `ls .skilled/skills`, and the v4.2.0.0 release notes record the removal |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A `/local-skilled-alignment` run over the removal commits found two gaps. `.skilled/skills/README.txt:24` still counted three `cli-*` skills after `cli-orca` was removed, and the same line counted two `mcp-*` skills when there are three, a count already wrong before the removal. The open root release notes, `v4.2.0.0.md`, did not mention the removal, though the Hermes removal added a section to its release notes the same day.

### Purpose
The skills index counts are correct, and the open release notes tell readers the skill is gone.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ sed -n 24p .skilled/skills/README.txt
| **Families** | Four prefix families: `cli-*` (3), `mcp-*` (2), `sk-*` (5), `system-*` (4) |
$ for p in cli mcp sk system; do echo "$p $(ls -d .skilled/skills/$p-*/ | wc -l)"; done
cli 2
mcp 3
sk 5
system 4
$ grep -ci orca .skilled/changelog/skilled/v4.2.0.0.md
0
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Correct the `cli-*` and `mcp-*` counts in the skills index.
- Record the removal in the v4.2.0.0 release notes: the summary, a breaking-change entry, two overview rows, a section, an upgrade note and the spec-folder list.

### Out of Scope
- The worktree provisioning fix's own docs, which `specs/sk-git/worktree-lifecycle/007-provision-dev-dependencies` owns. The shared release-notes section names it too.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/README.txt` | Modify | Family counts `cli-*` (2), `mcp-*` (3) |
| `.skilled/changelog/skilled/v4.2.0.0.md` | Modify | A Skills and Worktrees section and its summary, breaking-change, overview and upgrade entries |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The skills index counts match the skill folders | `sed -n 24p .skilled/skills/README.txt` shows `cli-*` (2), `mcp-*` (3), `sk-*` (5), `system-*` (4) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | The open release notes record the removal | `grep -c 'c-the-cli-orca-skill-is-removed' .skilled/changelog/skilled/v4.2.0.0.md` prints 3, and `validate_document.py` reports 0 issues |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The README family counts match `ls .skilled/skills`.
- **SC-002**: `python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/changelog/skilled/v4.2.0.0.md` prints `Total issues: 0`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The release notes are unreleased, so other work still edits them | Low | Each edit replaces text that occurs once, and the validator runs after |
| Risk | A before-and-after number the packet cannot back | Low | The Orca advisor replay row was left out, because the before value is not in the packet records |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
