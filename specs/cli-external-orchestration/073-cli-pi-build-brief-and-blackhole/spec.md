---
title: "Feature Specification: Tell cli-pi dispatchers to scope build briefs to one change and to switch off pi-blackhole in children"
description: "A DeepSeek build dispatched through Pi read for forty minutes and never edited: its brief carried five changes, and pi-blackhole compacted it mid-run. The cli-pi skill named neither risk."
trigger_phrases:
  - "cli-pi one change per brief"
  - "pi-blackhole dispatched child"
  - "pi blackhole passive"
  - "pi child compaction loop"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Tell cli-pi dispatchers to scope build briefs to one change and to switch off pi-blackhole in children

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-09-19 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
On 2026-09-19 a DeepSeek V4.1 Flash build of `specs/system-deep-loop/050-spec-protocol-ledger-events`, dispatched through `pi -p`, ran for 41 minutes and made no edit. Its brief carried five changes across five runtime files, so it read about 995,000 characters first. At 273,996 tokens pi-blackhole, the operator's observational-memory package, compacted the session mid-run and replaced the file contents with a structural summary, and the child started reading again. The cli-pi skill covered stdin, `--offline`, exit codes and the child waiver, but not brief scope or global packages in a child.

### Purpose
A dispatcher reading the cli-pi skill learns to send one change per build brief and to switch pi-blackhole off in the child.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A new ALWAYS rule in `cli-pi/SKILL.md`: one change per build brief.
- A new dispatch gotcha in `cli-pi/SKILL.md`: pi-blackhole and `PI_BLACKHOLE_PASSIVE=true`.
- The packet version and its changelog.

### Out of Scope
- The child envelope in `cli-pi/references/providers-and-models.md` - that file holds another session's uncommitted edits.
- Changing the operator's pi-blackhole config.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/cli-external-orchestration/cli-pi/SKILL.md` | Modify | Rule 12, one gotcha, version 1.5.4.0 |
| `.skilled/skills/cli-external-orchestration/cli-pi/changelog/v1.5.4.0.md` | Create | Changelog |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The skill says to send one change per build brief and to set `PI_BLACKHOLE_PASSIVE=true` in the child. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | Both changed files pass `validate_document.py`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The next build dispatched through Pi edits within its first brief.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | pi-blackhole honors `PI_BLACKHOLE_PASSIVE` | Med | Its README documents the variable; the next dispatch is the check |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- When the other session lands `references/providers-and-models.md`, should its child envelope carry the variable too?
<!-- /ANCHOR:questions -->
