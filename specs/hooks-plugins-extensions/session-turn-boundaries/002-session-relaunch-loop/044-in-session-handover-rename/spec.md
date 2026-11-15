---
title: "Feature Specification: Rename session relaunch to in-session handover"
description: "The feature people use is a hand-over inside a session, but every surface calls it session relaunch: the hook folder, the plugin files, 25 environment variables and the docs. This phase renames every live form to in-session handover with no aliases, and leaves shipped history under its old name."
trigger_phrases:
  - "in-session handover rename"
  - "rename session relaunch"
  - "system in session handover enabled"
  - "in-session-handover hook folder"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Rename session relaunch to in-session handover

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-11-15 |
| **Branch** | `worktrees/402-in-session-handover-rename` |
| **Parent Spec** | ../spec.md |
| **Phase** | 44 of 44 |
| **Predecessor** | 043-vibe-handover-flag-and-live-hop |
| **Successor** | None |
| **Handoff Criteria** | No live surface names session relaunch, every suite matches its baseline and one live Claude Code hop runs on the renamed code |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 44** of the session relaunch loop.

**Scope Boundary**: every live form of the name: folders, file names, environment variables, the hook concern, the seed prefix, code identifiers and current docs. Shipped changelogs, benchmark reports, archives and spec folders keep the old name as history.

**Dependencies**:
- Phase 043 on main, so the rename starts from the Vibe fixes
- The operator's answers: full conversion with no aliases, the seed prefix renamed, bare "relaunch" kept, history left as is

**Deliverables**:
- `.skilled/hooks/in-session-handover/` and the renamed Pi, OpenCode, playbook and catalog files
- `SYSTEM_IN_SESSION_HANDOVER_*` and `IN_SESSION_HANDOVER_*` in place of every `SESSION_RELAUNCH` name
- Re-rendered Claude and Codex registrations, re-pointed mirror links, a regenerated trigger index
- One live Claude Code hop on the renamed code
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The operator calls the feature an in-session handover, and the README and release notes describe it that way, but every surface a user touches says session relaunch: the hook folder `.skilled/hooks/session-relaunch/`, the switch `SYSTEM_SESSION_RELAUNCH_ENABLED`, the seed `[session-relaunch] claim and continue handoff` and the docs. The two names make the feature harder to find and to talk about.

### Purpose
Every live surface says in-session handover, and nothing outside history still says session relaunch.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ git grep -l -I -i -E "session[-_ ]?relaunch" -- . ':!specs/**' ':!**/changelog/**' ':!**/benchmark/reports/**' ':!**/z_archive/**' | wc -l
135
$ git ls-files | grep -i -E "session[-_]?relaunch" | grep -v -E "^specs/|/changelog/|/benchmark/reports/|/z_archive/" | wc -l
67
$ git grep -o -h -E "\b(SYSTEM_)?SESSION_RELAUNCH_[A-Z_]+" -- . ':!specs/**' | sort -u | wc -l
25
$ git ls-files -s | awk '$1=="120000"{print $4}' | xargs -n1 readlink | grep -c session-relaunch
9
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Move `.skilled/hooks/session-relaunch/` to `.skilled/hooks/in-session-handover/` and rename every live file whose name holds the old form
- Rewrite every live content form: `SESSION_RELAUNCH` to `IN_SESSION_HANDOVER`, `session-relaunch` to `in-session-handover`, `session_relaunch` to `in_session_handover`, the camel and prose forms, and the seed prefix to `[in-session-handover]`
- Re-point the nine mirror links, re-render the Claude and Codex registrations and regenerate the trigger index
- Run every suite that reads a renamed file against its baseline, and one live Claude Code hop

### Out of Scope
- Aliases for the old environment names, folder or seed - the operator chose a full conversion with no aliases
- Bare "relaunch", such as `relaunch-core.cjs`, `relaunch.log`, the `skilled-relaunch` state folder and the log events - it still names what the wrapper does
- Changelogs, benchmark reports, archives and spec folders, including `002-session-relaunch-loop` - they record what shipped under the old name
- Moving an existing `.skilled/skills/.state/session-relaunch/` folder in a checkout - it is git-ignored runtime state the operator moves by hand

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-relaunch/` | Rename | To `.skilled/hooks/in-session-handover/`, with `bin/`, `pi/`, `opencode/` and `tests/` files renamed inside |
| `.opencode/plugins/session-relaunch.js`, its test, `.pi/extensions/session-relaunch.ts` | Rename | The OpenCode plugin, its test and the Pi entry |
| Three playbook files, the feature catalog entry and the cli-opencode playbook file | Rename | The current docs named after the feature |
| 130 files under `.skilled/`, `.claude/`, `.codex/`, `.opencode/`, `.pi/`, `.vibe/`, `README.md`, `.env.example`, `tsconfig.pi.json` | Modify | Every live content form of the name |
| `.claude/hooks/*.mjs`, `.codex/hooks/*.mjs`, the OpenCode link | Modify | The nine links re-pointed at the new folder |
| Trigger index and its three fixtures | Regenerate | The index over the renamed docs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | No live file or path names session relaunch in any form, except protected spec-folder and benchmark-report names. |
| REQ-002 | Every suite that reads a renamed file passes with the same counts as its baseline, and the registration, mirror and drift checks pass. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | A live Claude Code session started through `skilled-loop` hands over and the receiver claims the note on the renamed code. |
| REQ-004 | The docs tell an operator what to change after the rename: the environment names and the git-ignored state folder. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The measured-behavior grep, run with the protected names excluded, prints 0.
- **SC-002**: The relaunch, flag, Pi, goal, Vibe, doctor, spec-gate, writer and advisor suites print the baseline counts: 1,567, 30, 67, 203, 48, 17, 107, 75 and 14.
- **SC-003**: The live hop's relaunch log shows a relaunch, and the receiver reports the code word.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | An operator's own `SYSTEM_SESSION_RELAUNCH_*` setting stops working without a word | High | The env reference and release note name the new variables, and the hand-over stays on by default for Claude Code |
| Risk | An open note in an old `.state/session-relaunch/handoffs` folder can no longer be claimed | Med | The docs tell the operator to move the folder, and the merge waits for the operator |
| Risk | A project that installed Skilled keeps hook registrations naming the old folder | Med | Its hooks fail open with the drift notice until the registrations are re-rendered, which the release note says |
| Dependency | Claude Code account 1 for the live hop | Low | One short run |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Reliability
- **NFR-R01**: The rename changes no behavior: every suite prints its baseline count.
- **NFR-R02**: A hook registration that names a missing file fails open, as it does today.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a file that names the old form only inside a protected spec-folder name is left unchanged.
- Maximum input: a 35,000-line generated index is regenerated, never rewritten by hand.
- Failure path: a link left pointing at the old folder is caught by the mirror sync check, which exits non-zero.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | 145 files, 13 renamed paths, nine links |
| Risk | 14/25 | Breaking environment names with no aliases, live registrations |
| Research | 4/20 | The inventory is a grep |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The operator answered scope, the bare word, history and aliases before the work began.
<!-- /ANCHOR:questions -->

---
