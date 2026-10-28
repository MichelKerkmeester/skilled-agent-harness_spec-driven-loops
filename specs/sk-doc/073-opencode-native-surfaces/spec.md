---
title: "Feature Specification: Move goal-opencode command into .opencode only and remove the .skilled/plugins symlink"
description: "The OpenCode-only goal command and the OpenCode plugins physically live in the shared .skilled tree. Move goal-opencode.md into a real .opencode/commands directory and delete the .skilled/plugins link so both live only under .opencode."
trigger_phrases:
  - "opencode native surfaces"
  - "move goal opencode command into opencode only"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Move goal-opencode command into .opencode only and remove the .skilled/plugins symlink

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-28 |
| **Branch** | `worktrees/265-opencode-native-surfaces` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
`/goal-opencode` works only in OpenCode, yet its file sits at `.skilled/commands/goal-opencode.md` because `.opencode/commands` is one symlink to the whole shared command tree. The OpenCode plugins are authored in `.opencode/plugins`, but a second link, `.skilled/plugins`, exposes them inside the shared tree too, so 400 references across about 100 files name them through `.skilled/plugins`.

### Purpose
Both OpenCode-only surfaces live only under `.opencode/`: the goal command as a real file in a real `.opencode/commands` directory, and the plugins with no `.skilled/plugins` link.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
$ readlink .opencode/commands; readlink .skilled/plugins; ls .skilled/commands/goal-opencode.md
../.skilled/commands
../.opencode/plugins
.skilled/commands/goal-opencode.md
$ node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check
[runtime-mirror-sync] PASS: 193 mirrors across 8 trees are in sync.
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Turn `.opencode/commands` into a real directory of per-entry relative links into `.skilled/commands`, generated and checked by `sync-runtime-mirrors.cjs`
- Move `goal-opencode.md` to `.opencode/commands/goal-opencode.md` as the one real file there, registered as an OpenCode-native command in `command-scope.cjs`
- Delete the `.skilled/plugins` link
- Repoint every live reference to `.skilled/plugins` and `.skilled/commands/goal-opencode.md` at the `.opencode/` paths, and update `.opencode/SYNC.md` and its layout test

### Out of Scope
- Released changelogs, benchmark reports and old spec packets - they are history
- Generic link handling in `sk-code-quality`'s gate beyond the plugins folder - the gate now reads `.opencode/plugins` directly, so its F21 tests were rewritten to that layout and no link fixture remains

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/goal-opencode.md` | Move | To `.opencode/commands/goal-opencode.md` |
| `.opencode/commands` | Modify | Whole-tree link becomes a real directory of per-entry links |
| `.skilled/plugins` | Delete | Link to `../.opencode/plugins` |
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/{command-scope,sync-runtime-mirrors}.cjs` | Modify | Generate and check the OpenCode command tree; register the native command |
| `.gitignore` | Modify | Ignore private `local-*` links in `.opencode/commands` |
| `.opencode/SYNC.md`, `.skilled/bin/tests/opencode-compat-layout.test.cjs` | Modify | New inventory rows and layout test |
| About 100 docs, tests, workflows and plugin comments | Modify | Path references |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `.opencode/commands` is a real directory; `goal-opencode.md` is a real file there and absent from `.skilled/commands` |
| REQ-002 | `.skilled/plugins` does not exist |
| REQ-003 | `sync-runtime-mirrors.cjs --check` passes and reports drift if an `.opencode/commands` link is missing |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | No live file outside specs, changelogs and benchmark reports names `.skilled/plugins` or `.skilled/commands/goal-opencode.md` |
| REQ-005 | The plugin, layout, mirror and command-catalog test suites pass |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: `test -L .skilled/plugins || test -e .skilled/commands/goal-opencode.md` fails, and `test -f .opencode/commands/goal-opencode.md -a ! -L .opencode/commands` succeeds
- **SC-002**: OpenCode still lists `/goal-opencode` and every shared command through `.opencode/commands`
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | OpenCode follows symlinked entries inside its commands directory | High: commands vanish if not | `opencode-version-battery.cjs` and a live command listing after the change |
| Risk | Private `local-*` commands stop showing in OpenCode | Med | Gitignore `.opencode/commands/local-*`, so worktree provisioning links them from the primary checkout |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->
<!-- /ANCHOR:nfr -->

N/A: this is a file-layout change with no running service.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: an empty `logs/archive/` deletes nothing and exits 0. Maximum: `--keep 3` over 10,000 archives keeps the newest 3. Failure path: a missing `--keep` value exits 2 with usage. WEAK: Handle edge cases. -->

- Empty input: a new top-level entry in `.skilled/commands` gets its `.opencode/commands` link on the next sync run, and `--check` reports it MISSING until then.
- Maximum input: N/A, the command tree has about ten top-level entries.
- Failure path: an `.opencode/commands` that is still a whole-tree link makes `--check` exit 1 with a STALE line.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 6/25: one option in `scripts/rotate-logs.sh`. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | About 100 files, mostly one-line path swaps; two scripts change |
| Risk | 10/25 | Command discovery in OpenCode; no API change |
| Research | 4/20 | Layout already mapped |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

None. Approach and workspace were chosen by the operator on 2026-10-28: per-entry links, a git worktree.
<!-- /ANCHOR:questions -->

---


