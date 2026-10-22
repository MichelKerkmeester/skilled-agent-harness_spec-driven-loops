---
title: "Feature Specification: Phase 56: command-folder-guard-and-readme-baseline"
description: "Phase 055 left three Known Limitations. The `.markdown` suffix that keeps 12 non-command files out of both OpenCode versions' listings rests on an upstream glob with nothing watching it, the command proof was two command lists with no per-file check, and seven tracked READMEs were missing from the README verdict baseline. This phase adds a per-file command-folder guard to the battery's `command-listed` leg, rebuilds the verdict baseline from the tracked set, and leaves the suffix guard to the CI workflow that runs the leg on both versions."
trigger_phrases:
  - "command folder guard and readme baseline"
  - "phase 56 command folder guard and readme baseline"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 56: command-folder-guard-and-readme-baseline

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-10-22 |
| **Branch** | `worktrees/201-command-folder-guard-and-readme-baseline` |
| **Parent Spec** | ../spec.md |
| **Phase** | 56 of 56 |
| **Predecessor** | 055-command-support-into-commands |
| **Successor** | None |
| **Handoff Criteria** | The operator asked on 2026-10-22 to close 055's three Known Limitations: the battery unit tests cover the per-file check, the live battery passes every leg on both versions, and the README verdict parity diff is 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 56** of the OpenCode v1 and v2 dual compatibility packet. It closes the three gaps phase 055 recorded, without reopening the layout 055 settled.

**Scope Boundary**: the battery's `command-listed` leg and its unit tests, the README verdict baseline fixture, and the record of both in this packet. No command, agent, config, plugin or hook changes shape, and the `.skilled/commands/` layout stays exactly as 055 left it.

**Dependencies**:
- `../055-command-support-into-commands/`, whose Known Limitations name the three gaps this phase closes and whose `.markdown` layout the guard protects.
- `.skilled/commands/doctor/scripts/opencode-version-battery.cjs`, which owns the `command-listed` leg and the command allowlist it reads.
- Both installed OpenCode versions, 1.19.3 and 2.0.32, for the live battery run.
- The tracked README set, which is what the verdict baseline is rebuilt from.

**Deliverables**:
- `listNonCommandFiles` in the battery, a `nonCommand` field from `allowedCommandSources`, and the check inside `legCommandListed` that fails a listed name a non-command file in the command folder could produce.
- Four new battery tests, C14 to C17.
- `baseline-readme-verdicts.json` rebuilt from the tracked set, 978 to 985 entries.
- `scratch/verification.txt` and `scratch/battery-live.txt`.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name. The v4.0.0.13 changelog and its related docs are a later task in this phase and are still pending.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 055 proved the `.markdown` suffix works by reading two command lists on each version. That proof inherits its own weakness: a list only shows that nothing changed, so a host that later widened its glob would keep the files out of the list only until it did not, and no per-file check existed to say which file produced a listed name. The README verdict baseline carried the matching gap from the other side, missing seven tracked READMEs while still holding one entry for a file that had been deleted.

### Purpose
Make the command folder guarded per file rather than per list, and make the README verdict baseline match the tracked set exactly, so the next change to either surface fails a named check instead of passing quietly.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The `command-listed` leg of the version battery and the four unit tests that cover the new check.
- The README verdict baseline fixture, rebuilt from the tracked set.
- The live battery run on both versions, and the record of it in `scratch/`.

### Out of Scope
- The `.markdown` suffix itself - it stays an upstream fact about what both hosts glob, now guarded in CI rather than replaced.
- The `.skilled/commands/` layout and the 12 non-command files - 055 settled both and this phase does not move them.
- Any change to a real command, agent, config, plugin or hook.
- The v4.0.0.13 changelog and its related docs - a later task in this phase, still pending, so the packet does not claim it.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/scripts/opencode-version-battery.cjs` | Modify | `listNonCommandFiles`, the `nonCommand` field on `allowedCommandSources`, and the non-command check in `legCommandListed` |
| `.skilled/commands/doctor/scripts/tests/opencode-version-battery.test.cjs` | Modify | C14 to C17 |
| `.skilled/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json` | Modify | Rebuilt from the tracked set: 978 to 985 entries |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Modify | This phase's packet, filled from the scaffold |
| `../spec.md` | Modify | The phase map row for 056 and the 055 to 056 handoff row |
| `../055-command-support-into-commands/implementation-summary.md` | Modify | One sentence per Known Limitation saying how this phase closes it |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A listed name that a non-command file in the command folder could produce fails, even when a global or inherited folder owns that name. A missing `.md` command keeps failing. | C14 fails on the old behaviour and passes on the new one; the revert proof in `scratch/verification.txt` shows C14 red with the check removed. |
| REQ-002 | The check exempts what a host lists whatever the files are: v2 built-ins and configured MCP prompts. | C16: a v2 built-in beside a non-command file sharing its stem passes, a configured MCP prompt passes, and the same stem stays a stray on v1. |
| REQ-003 | The README verdict baseline is rebuilt from the tracked set and the parity check is clean. | `baseline-readme-verdicts.json` reads 985 entries, and the parity rerun reports `baseline_files=985 diff_entries=0 PASS`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The live battery passes every leg on both versions with the new check in place. | `scratch/battery-live.txt`: all eight legs PASS, with the v2 read taken on a private `serve`. |
| REQ-005 | The tracked suites that cover the touched files do not regress. | Battery unit tests 55/55, sk-doc script tests 38 PASS and 0 FAIL, plugins 533/533, hook node tests 914/914 over 30 files. |
| REQ-006 | A separate read-only review confirms the change, and every finding is either fixed or recorded. | Round 1 FAIL with 1 P1 and 3 P2s, the P1 fixed; round 2 PASS with 5 P2s, where the stale comment above `legCommandListed` and a symlinked command folder test (C17) were fixed and the rest are listed in `scratch/verification.txt` as recorded, not fixed. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The command proof names files, not just counts: a non-command file that a host starts listing fails the `command-listed` leg on that file, while a global or inherited folder owning the name no longer hides it.
- **SC-002**: Both versions pass every battery leg with the new check, so the guard did not itself break a legitimate listing.
- **SC-003**: The README verdict baseline matches the tracked set: 978 to 985 entries, 0 existing verdicts changed, and a parity diff of 0.
- **SC-004**: No suite regressed, and the review's findings are all fixed or recorded rather than lost.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Both OpenCode versions answering a command listing, without touching the shared OpenCode 2 service | High | The battery reads v1 from a private data home and v2 through a private `serve`, which is how the live run was taken |
| Dependency | The tracked README set being complete enough to rebuild the baseline from | Med | The fixture was rebuilt with `test_readme_verdict_parity.py --write`, and the parity rerun compares against the tracked set |
| Risk | The new check fails a legitimate listing and turns both versions red | High | v2 built-ins and configured MCP prompts are exempt (C16), and the live battery passes every leg on both versions |
| Risk | A global or inherited folder owning the same name keeps a non-command file passing | High | The check runs before the allowlist skip, and C14 asserts the failure with a real global `.md` command owning `deep/README` |
| Risk | The baseline rebuild is done wholesale and hides unrelated drift | Med | Only 8 entries were added and 1 stale entry removed, with 0 existing verdicts changed |
| Risk | A non-command file name a configured MCP prompt produces still passes | Low | Recorded as a P2 in `scratch/verification.txt` rather than fixed: a prompt is listed whatever the files are, so the exemption is deliberate |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None for this phase. The operator asked on 2026-10-22 to close the three Known Limitations 055 recorded, and the packet records what that left open as P2s rather than as questions.
<!-- /ANCHOR:questions -->

---
