---
title: "Feature Specification: Phase 8: claude-hook-tree-guard"
description: "Every Skilled Claude hook copied into the user settings fails in a home folder that keeps a .skilled data directory, because the guard tests for any .skilled path. Sessions started there print a hook drift notice on every Stop and tool call."
trigger_phrases:
  - "claude hook tree guard"
  - "phase 8 claude hook tree guard"
  - "mk claude hook could not resolve home folder"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 8: claude-hook-tree-guard

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-16 |
| **Branch** | `worktrees/432-claude-hook-tree-guard` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 8 |
| **Predecessor** | 007-review-doc-reconciliation |
| **Successor** | None |
| **Handoff Criteria** | Every requirement below has its command output recorded in `implementation-summary.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the hook library cleanup. The operator reported a session that still printed `mk claude hook could not resolve` on its Stop hooks. The cause sits in the user-level hook sync that commit `eddeda8b1b2` added on main, so this phase is built in worktree 432 from main while the phase 7 review runs in worktree 411.

**Scope Boundary**: The `requireTree` value for Claude in `hook-registry.json`, the registrations it generates, the two tests that pin the guard and the three comments and README lines that describe it. No hook adapter, kill switch or concern key changes.

**Dependencies**:
- Phase 7 lives uncommitted in worktree 411, so this phase takes the number 8 and the parent's phase counts are reconciled when the two branches meet.

**Deliverables**:
- The guard fix, its regression test and the regenerated Claude settings.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
Every rendered Claude hook starts with `{ [ -e .skilled ] || exit 0; }`, and the user-level copy of the hooks runs in every folder a Claude session starts in. The home folder keeps `~/.skilled/.labels`, the Jev label store, so the guard passes there, the adapter path does not exist and each hook prints the drift notice.

### Purpose
A Skilled hook copied into the user settings stays silent in any folder that is not a Skilled checkout, and still reports drift inside one.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
$ ls -la ~/.skilled
drwx------  19 ... .labels
$ ls ~/.skilled/skills/system-spec-kit/runtime/dist/hooks/claude/session-stop.js
ls: ...: No such file or directory

# Count of drift lines per adapter in session transcripts from the last four hours
  31 mk-hook-drift host=claude event=Stop adapter=ask-surface-stop.cjs
  25 mk-hook-drift host=claude event=Stop adapter=session-stop.js
  25 mk-hook-drift host=claude event=Stop adapter=completion-evidence-stop.cjs
  22 mk-hook-drift host=claude event=Stop adapter=handover-stop-arm.mjs
# The session with the most Stop drift lines (81) has cwd /Users/michelkerkmeester

# The first Stop command from .claude/settings.json, run in a temp folder holding only .skilled/.labels
$ bash -c "$CMD"
Error: Cannot find module '/private/var/folders/.../.skilled/skills/system-spec-kit/runtime/dist/hooks/claude/session-stop.js'
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Change Claude's `requireTree` from `.skilled` to `.skilled/hooks`, a path every Skilled checkout and vendored install holds.
- Regenerate the registrations with `sync-hook-registrations.cjs`.
- Extend the registry test with a folder that holds only `.skilled/.labels`, and update the pinned guard string in the user-hook sync test.
- Correct the generator comment, the sync script header and the `.skilled/bin/README.md` row that describe the guard.

### Out of Scope
- Rewriting `~/.claude/settings.json` - it lives outside the repository. The session-start sync refreshes it when `SYSTEM_CLAUDE_USER_HOOK_SYNC_ENABLED` is set, or the operator runs the sync by hand.
- Sessions started before phase 3 that still run renamed adapter names - a restart fixes them, and no file change can.
- Moving `~/.skilled/.labels` - it is the operator's Jev data.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json` | Modify | `requireTree` is `.skilled/hooks` |
| `.claude/settings.json` | Modify | Regenerated: 36 guarded commands |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/hook-registration-sync.vitest.ts` | Modify | The data-only `.skilled` case |
| `.skilled/bin/tests/sync-claude-user-hooks.test.cjs` | Modify | The pinned guard string |
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs`, `.skilled/bin/sync-claude-user-hooks.mjs`, `.skilled/bin/README.md` | Modify | Comments and one README row |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A guarded Claude hook is silent in a folder whose `.skilled` is not a Skilled checkout | The first Stop command from `.claude/settings.json`, run in a temp folder holding only `.skilled/.labels`, exits 0 and prints nothing |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Drift is still reported inside a Skilled checkout | The same command in a temp folder holding `.skilled/hooks` without the adapter prints the drift envelope |
| REQ-003 | The registrations match the registry | `sync-hook-registrations.cjs --check` and `sync-runtime-mirrors.cjs --check` print PASS, and `.claude/settings.json` holds no `[ -e .skilled ]` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: `hook-registration-sync.vitest.ts` passes 9 of 9 with the data-only case, and failed on the old registry.
- **SC-002**: `sync-claude-user-hooks.test.cjs` passes 8 of 8.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The user file keeps the old guard until the sync rewrites it | The home-folder notice continues until then | Name the sync command in the close-out |
| Risk | A Skilled install without `.skilled/hooks` would lose every Claude hook | High | Every adapter path in the registry sits under `.skilled/`, and the checkout and the vendored `barter/ai-speckit` install both hold `.skilled/hooks` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- None
<!-- /ANCHOR:questions -->

---
