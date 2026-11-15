---
title: "Feature Specification: Rename session relaunch to session handover"
description: "The feature is a hand-over inside a session, but every surface called it session relaunch. This phase renames every live form to session handover, accepts the in-session handover spelling for the on and off switches and routes both phrasings to /speckit:handoff, and leaves shipped history under its old name."
trigger_phrases:
  - "session handover rename"
  - "in-session handover rename"
  - "rename session relaunch"
  - "system session handover enabled"
  - "system in session handover enabled"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Rename session relaunch to session handover

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-15 |
| **Branch** | `worktrees/402-in-session-handover-rename` |
| **Parent Spec** | ../spec.md |
| **Phase** | 44 of 44 |
| **Predecessor** | 043-vibe-handover-flag-and-live-hop |
| **Successor** | None |
| **Handoff Criteria** | No live surface names session relaunch, both handover spellings switch and route, every suite matches its baseline and one live Claude Code hop runs on the renamed code |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 44** of the session handover loop. The folder keeps the name it was created under, `044-in-session-handover-rename`, because the main name changed after it was made.

**Scope Boundary**: every live form of the name: folders, file names, environment variables, the hook concern, the seed prefix, code identifiers and current docs. Plus a second spelling for the on and off switches, three routing phrases for `/speckit:handoff` and the parent goal's title. Shipped changelogs, benchmark reports, archives and spec folders keep the old name as history.

**Dependencies**:
- Phase 043 on main, so the rename starts from the Vibe fixes
- The operator's answers: session handover as the main name, the in-session spelling accepted for the switches with the main name winning, both phrasings routed, the goal retitled, the seed renamed, bare "relaunch" kept and history left as is

**Deliverables**:
- `.skilled/hooks/session-handover/` and the renamed Pi, OpenCode, playbook and catalog files
- `SYSTEM_SESSION_HANDOVER_*` and `SESSION_HANDOVER_*` in place of every `SESSION_RELAUNCH` name, with `SYSTEM_IN_SESSION_HANDOVER_*` read for the on and off switches
- "session handover", "in session handover" and "session-handover" as owned signals of `/speckit:handoff`
- Re-rendered Claude and Codex registrations, re-pointed mirror links, a regenerated trigger index
- One live Claude Code hop on the renamed code
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The operator calls the feature a session handover or an in-session handover, and the README and release notes describe it that way, but every surface a user touches said session relaunch: the hook folder `.skilled/hooks/session-relaunch/`, the switch `SYSTEM_SESSION_RELAUNCH_ENABLED`, the seed `[session-relaunch] claim and continue handoff` and the docs. A prompt that said "session handover" also reached no command.

### Purpose
Every live surface says session handover, either spelling turns it on or off, and either phrasing in a prompt leads to `/speckit:handoff`.
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
$ node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"start a session handover"}' --format json   # on main
top: system-spec-kit 0.88, sk-code 0.82, no command named
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Move `.skilled/hooks/session-relaunch/` to `.skilled/hooks/session-handover/` and rename every live file whose name holds the old form
- Rewrite every live content form: `SESSION_RELAUNCH` to `SESSION_HANDOVER`, `session-relaunch` to `session-handover`, `session_relaunch` to `session_handover`, the camel and prose forms, and the seed prefix to `[session-handover]`
- Read `SYSTEM_IN_SESSION_HANDOVER_*` for each on and off switch while the `SYSTEM_SESSION_HANDOVER_*` switch is unset or blank, in both flag readers
- Add "session handover", "in session handover" and "session-handover" to the owned signals of `/speckit:handoff`
- Retitle the parent goal and spec "Session handover loop"
- Re-point the nine mirror links, re-render the Claude and Codex registrations and regenerate the trigger index
- Run every suite that reads a renamed file against its baseline, and one live Claude Code hop

### Out of Scope
- Reading the retired `SYSTEM_SESSION_RELAUNCH_*` names. Only the in-session spelling is a second name, and only for the on and off switches.
- A second spelling for the tuning variables such as `SESSION_HANDOVER_THRESHOLD`
- Bare "relaunch", such as `relaunch-core.cjs`, `relaunch.log`, the `skilled-relaunch` state folder and the log events. It still names what the wrapper does.
- Changelogs, benchmark reports, archives and spec folders, including `002-session-relaunch-loop` and this folder. They record what shipped under the old name.
- Moving an existing `.skilled/skills/.state/session-relaunch/` folder in a checkout. It is git-ignored runtime state, moved by hand once the checkout runs the new code.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-relaunch/` | Rename | To `.skilled/hooks/session-handover/`, with `bin/`, `pi/`, `opencode/` and `tests/` files renamed inside |
| `.opencode/plugins/session-relaunch.js`, its test, `.pi/extensions/session-relaunch.ts` | Rename | The OpenCode plugin, its test and the Pi entry |
| Three playbook files, the feature catalog entry and the cli-opencode playbook file | Rename | The current docs named after the feature |
| 130 files under `.skilled/`, `.claude/`, `.codex/`, `.opencode/`, `.pi/`, `.vibe/`, `README.md`, `.env.example`, `tsconfig.pi.json` | Modify | Every live content form of the name |
| `.skilled/hooks/shared/hook-flags.cjs`, `hook-flags.sh`, `hook-flags.test.cjs` | Modify | The second switch spelling and its test |
| `.skilled/skills/system-spec-kit/command-metadata.json`, the generated command bridges | Modify | Three routing phrases for `/speckit:handoff` |
| `ENV-REFERENCE.md`, the two hook READMEs, `doctor-env.yaml` | Modify | The second spelling and its conflict rule |
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
| REQ-005 | Each `SYSTEM_SESSION_HANDOVER_*` on or off switch reads `SYSTEM_IN_SESSION_HANDOVER_*` while it is unset or blank, the same way in both flag readers, and the main name decides whenever it holds a value. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | A live Claude Code session started through `skilled-loop` hands over and the receiver claims the note on the renamed code. |
| REQ-004 | The release note tells an operator what to change after the rename: the environment names, the git-ignored state folder and the hook registrations. |
| REQ-006 | A prompt that says "session handover", "in session handover" or "session-handover" leads the skill advisor to `/speckit:handoff`. |
| REQ-007 | The parent goal and spec are titled "Session handover loop". |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The measured-behavior grep, run with the protected names excluded, prints 0.
- **SC-002**: The relaunch, Pi, goal, Vibe, doctor, spec-gate, writer and advisor suites print the baseline counts: 1,567, 67, 203, 48, 17, 107, 75 and 14. The flag suite prints 31, its 30 plus the second-spelling test.
- **SC-003**: The live hop's relaunch log shows a relaunch, and the receiver reports the code word.
- **SC-004**: The three handover phrasings name `/speckit:handoff` in the advisor result, where on main they name no command.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | An operator's own `SYSTEM_SESSION_RELAUNCH_*` setting stops working without a word | High | The env reference and release note name the new variables, and the hand-over stays on by default for Claude Code |
| Risk | Both spellings set to different values | Low | The main name wins, and `/doctor:env` names the conflict |
| Risk | An open note in an old `.state/session-relaunch/handoffs` folder can no longer be claimed | Med | The release note says to move the folder once the checkout runs the new code |
| Risk | A project that installed Skilled keeps hook registrations naming the old folder | Med | The release note gives the command that renders them again |
| Dependency | Claude Code account 1 for the live hop | Low | One short run |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Reliability
- **NFR-R01**: The rename changes no behavior: every suite prints its baseline count.
- **NFR-R02**: A switch the operator never set changes nothing, under either spelling.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a main switch set to an empty value counts as unset, so its second spelling answers.
- Maximum input: a 35,000-line generated index is regenerated, never rewritten by hand.
- Failure path: a link left pointing at the old folder is caught by the mirror sync check, which exits non-zero.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 19/25 | 150 files, 13 renamed paths, nine links, two flag readers |
| Risk | 14/25 | Breaking environment names, live registrations |
| Research | 4/20 | The inventory is a grep |
| **Total** | **37/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The operator answered the main name, the second spelling, the conflict rule, routing, the goal title, the bare word and history.
<!-- /ANCHOR:questions -->

---
