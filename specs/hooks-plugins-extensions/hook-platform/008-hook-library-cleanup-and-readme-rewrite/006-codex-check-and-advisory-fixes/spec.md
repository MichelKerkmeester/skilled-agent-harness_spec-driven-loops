---
title: "Feature Specification: Phase 6: codex-check-and-advisory-fixes"
description: "The Codex hook check refuses to run in a linked worktree, so every worktree session starts with a false drift warning. Pi and DSH show the check's OK line as a warning on every start, and two spec-kit Vitest configs keep an alias nothing may need."
trigger_phrases:
  - "codex check and advisory fixes"
  - "phase 6 codex check and advisory fixes"
  - "codex hook check worktree"
  - "session start advisory ok line"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 6: codex-check-and-advisory-fixes

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-16 |
| **Branch** | `worktrees/411-hook-library-cleanup` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 6 |
| **Predecessor** | 005-closeout-follow-up-fixes |
| **Successor** | None |
| **Handoff Criteria** | Every requirement below has its command output recorded in `implementation-summary.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the hook library cleanup. Phase 5 left three findings that change hook behavior or need a test run to settle. The operator chose to fix the Codex check in a worktree, to fix the Pi and DSH OK-line warning once a run confirmed it, and to remove the spec-kit Vitest alias only if the suites prove it unused.

**Scope Boundary**: The installer's worktree guard for `--check`, the Pi and DSH session-start advisories for the Codex check, the two spec-kit Vitest alias blocks, and the tests and docs for each. No registered command, kill switch or concern key changes.

**Dependencies**:
- The operator kept the OpenCode plugin names as they are, so no plugin id changes here.

**Deliverables**:
- The three fixes listed under In Scope, each with its test or suite output.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
`install-codex-hooks.mjs --check` refuses to run in a linked worktree and exits 1, so Claude, Cursor, Devin, OpenCode, Pi and DSH report Codex hook drift at the start of every worktree session while the target file is clean. Pi shows the check's `OK` line as a warning, and DSH injects it into the session, on every start in the primary checkout too. Two spec-kit Vitest configs still hold the alias phase 5 removed from the hooks config.

### Purpose
A session warns about Codex hook drift only when the check finds drift.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
# In the linked worktree, before the fix (follow-up investigation run)
$ node .skilled/bin/install-codex-hooks.mjs --check
Refusing to anchor hooks at linked worktree ... Pass --allow-worktree to override.   (exit 1)

# The real DSH and Pi adapters, run against the primary checkout with only the Codex check on
$ node advisory-probe-dsh.mjs <dsh adapter> <primary>
DSH injected: ["install-codex-hooks: install-codex-hooks: OK /Users/.../.codex/hooks.json"]
$ node advisory-probe-pi.mjs <pi adapter> <pi exec.js> <primary>
Pi notified: [["warning","install-codex-hooks: OK /Users/.../.codex/hooks.json"]]
$ node .skilled/bin/install-codex-hooks.mjs --check
install-codex-hooks: OK /Users/.../.codex/hooks.json   (exit 0)
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Let `--check` pass the worktree guard, because it writes nothing. A run that writes still refuses.
- Show the Codex check's output on Pi and DSH only when it exits non-zero. Other advisory checks keep their current output.
- Run both spec-kit Vitest suites with the alias removed, and remove it only when the counts match the baseline.
- Update the Codex check README, the session-lifecycle READMEs and the watchdog comment that described the old behavior.

### Out of Scope
- `--dry-run` from a worktree - the operator approved the change for `--check` only.
- The OpenCode plugin name prefixes - the operator kept them.
- Cursor's handling of the `OK` line on stdout - not part of the reported finding.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/bin/install-codex-hooks.mjs` | Modify | `--check` passes the worktree guard |
| `.skilled/bin/tests/install-codex-hooks-source-root.test.cjs` | Modify | A linked-worktree test |
| `.skilled/skills/system-spec-kit/runtime/hooks/dsh/session-start-advisories.mjs` | Modify | `quietOnSuccess` for the Codex check |
| `.skilled/skills/system-spec-kit/runtime/hooks/pi/session-start-advisories.ts` | Modify | `quietOnSuccess` for the Codex check |
| `.skilled/hooks/session-lifecycle/tests/dsh-session-lifecycle.test.mjs` | Modify | A test through the real check runner |
| `.skilled/hooks/session-lifecycle/tests/pi-session-start-advisories.test.ts` | Create | The Pi advisory tests |
| `.skilled/skills/system-spec-kit/vitest.config.ts`, `.skilled/skills/system-spec-kit/runtime/vitest.config.ts` | Modify | The alias block, if the suites prove it unused |
| `.skilled/hooks/codex-global-hooks-check/README.md`, `.skilled/hooks/session-lifecycle/README.md`, `.skilled/hooks/session-lifecycle/tests/README.md`, `.opencode/plugins/codex-hooks-watchdog.js` | Modify | Docs and one comment |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A run that writes still refuses a linked worktree | The worktree test sees exit 1 and `Refusing to anchor hooks at linked worktree` for a plain run, and the target file is unchanged |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | `--check` runs in a linked worktree | `node .skilled/bin/install-codex-hooks.mjs --check` in this worktree prints `install-codex-hooks: OK` with exit 0, and the worktree test sees `DRIFT` with exit 1 for a dirty target |
| REQ-003 | Pi and DSH show the Codex check only when it fails | The advisory probes print `DSH injected: []` and `Pi notified: []` in the primary checkout and the worktree, and the new tests fail against the old adapters |
| REQ-004 | The spec-kit alias goes only if unused | Both spec-kit Vitest suites report the same pass and fail counts with and without the alias |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: `node .skilled/bin/install-codex-hooks.mjs --check` in a linked worktree with a clean target exits 0.
- **SC-002**: A Pi or DSH session start with a clean target shows no Codex check line.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The installer's `OK` line is a documented contract in tests and playbooks | Silencing it breaks them | Leave the installer output alone and decide in the adapters |
| Risk | A worktree on an older branch judges orphans against its own tree | Med | The check only reports; the worktree test proves drift is still found |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- None
<!-- /ANCHOR:questions -->

---
