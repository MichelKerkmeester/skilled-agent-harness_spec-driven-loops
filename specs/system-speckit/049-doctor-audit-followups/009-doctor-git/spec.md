---
title: "Feature Specification: Phase 9: doctor-git"
description: "The shipped git hooks could only be skipped one command at a time, and the commit, PR and branch rules could only be changed by hand-editing a JSON block whose mistakes block every commit. This phase adds /doctor:git to save hook gate settings in git config and to change the rules in the repository's own .sk-git/ copies."
trigger_phrases:
  - "doctor git command"
  - "git hook gate settings"
  - "sk-git standards override"
  - "speckit.hooks git config"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 9: doctor-git

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-04 |
| **Branch** | `worktrees/079-doctor-command-audit` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 9 |
| **Predecessor** | 008-doctor-ownership-split |
| **Successor** | None |
| **Handoff Criteria** | `route-validate.sh` passes across five routed commands, and the hook and doctor suites pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the doctor audit follow-ups. During phase 008 the operator asked for a doctor command that lets someone adjust the git hooks and the sk-git commit and PR standards the framework ships.

**Scope Boundary**: The git hook scripts and a new helper and registry beside them, a new `/doctor:git` router with two workflows, a presentation and two scripts, the command contract's doctor entry, the generated runtime mirrors, and the docs that describe hook switches and doctor commands. The sk-git skill itself is not edited.

**Dependencies**:
- sk-git's `message-contract.mjs`, whose lookup already reads `.sk-git/` before the shipped templates and whose shape check the new standards script reuses
- The runtime mirror and prompt sync scripts, which regenerate the per-runtime command copies

**Deliverables**:
- Persistent hook gate settings: `lib/gate-config.sh` and the `lib/gates.tsv` registry, read by `pre-commit`, `prepare-commit-msg` and `pre-push`
- `/doctor:git hooks` and `/doctor:git standards`, each behind an approval per change and a dry run

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Every optional gate in the shipped hooks had a `SPECKIT_SKIP_*` variable, and a variable lasts one command. Someone who never wanted the comment-hygiene or mirror-parity check had to export it in every shell or prefix every commit. `/doctor:env` deliberately never saves these, because it treats them as one-run switches. The commit, PR and branch rules live in a JSON block inside each sk-git template, and sk-git already reads a repository's own copies from `.sk-git/`. Nothing helped anyone use that: editing the shipped templates is lost on the next update, and a hand-edited block that breaks its shape blocks every commit.

### Purpose
An operator can see every shipped hook gate and keep any optional one off for good, and a repository can own and change its commit, PR and branch rules without editing sk-git and without being able to break them.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A gate registry and a helper that turns a saved `speckit.hooks.<key>` value of off into the gate's variable, wired into the three hooks that have optional gates
- `/doctor:git hooks`: list the gates with saved values and the hook install state, and set or unset one key in local or global config
- `/doctor:git standards`: show the active rules and their source, copy the shipped templates into `.sk-git/`, change or remove a rules-block setting, stop enforcing a kind, and check prose against rules
- Tests for the helper, both scripts and the registry's parity with the hooks
- Route manifest, command contract, mirrors, and the hook, doctor, environment and command index docs

### Out of Scope
- An off switch for `commit-msg` - the message contract has no bypass by design; its rules change through `standards`, and removing a kind's rules section switches it off
- Saving the per-push approvals `SPECKIT_ALLOW_REMOTE_PUSH` and `SPECKIT_ALLOW_MASS_DELETION` - a saved approval would approve every later push
- Moving the whole-hook kill switches out of `/doctor:env` - `hooks` shows them and hands off
- Editing the sk-git skill, its templates or its docs - the operator chose the override folder so sk-git stays untouched

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/scripts/git-hooks/lib/{gate-config.sh,gates.tsv}` | Create | The helper and the gate registry |
| `.skilled/scripts/git-hooks/{pre-commit,prepare-commit-msg,pre-push}` | Modify | Read the saved gate settings in a trusted toolchain repository |
| `.skilled/scripts/git-hooks/tests/gate-config.test.sh` | Create | Helper, parity and installed-hook cases |
| `.skilled/commands/doctor/git.md` and `assets/doctor-git-{presentation.txt,hooks.yaml,standards.yaml}` | Create | The router, presentation and two workflows |
| `.skilled/commands/doctor/scripts/{git-hook-gates,git-standards}.cjs` and their tests | Create | The scripts the workflows call |
| `.skilled/commands/doctor/_routes.yaml` | Modify | Two `/doctor:git` routes |
| `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` | Modify | Doctor router list, hints, targets, loader rules and destructive operations |
| `.skilled/commands/doctor/assets/doctor-env{.yaml,-presentation.txt}`, `ENV-REFERENCE.md` | Modify | Point a saved gate setting at `/doctor:git hooks` |
| Hook, doctor script and command READMEs, the root README | Modify | Describe the new command and settings |
| Runtime mirrors under `.claude`, `.cursor`, `.codex`, `.pi`, `.hermes` | Regenerate | Through their sync scripts |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A `speckit.hooks.<key>` value of `off`, `false`, `no` or `0` in local or global git config makes the matching optional gate run as if its `SPECKIT_SKIP_*` variable were set; command-line config never counts, and only a trusted toolchain repository reads any setting. |
| REQ-002 | Every `SPECKIT_SKIP_*` and `SPECKIT_ALLOW_*` variable the hooks read has exactly one registry row, and the per-push approvals are marked non-persistable and never read from config. |
| REQ-003 | `/doctor:git hooks` lists every gate with its saved values and effective state, and sets or unsets one key at the chosen scope only after an approved plan; it refuses unknown keys and the per-push approvals. |
| REQ-004 | `/doctor:git standards` never writes the shipped sk-git templates, copies them into `.sk-git/` without overwriting, and refuses any rules-block change sk-git's own shape check rejects, writing nothing. |
| REQ-005 | `route-validate.sh` passes with `/doctor:git` in parity across its router and presentation, and the hook and doctor test suites pass. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | A rules change reports the rules it switches on or off and the template prose it leaves stating the old rule, and a change touches only the edited lines when the block keeps the shipped layout. |
| REQ-007 | The command contract validates against its schema and the router generator reports every router clean. |
| REQ-008 | The runtime mirror, prompt and command-catalog checks pass, and `/doctor:env` points a lasting gate setting at `/doctor:git hooks`. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `route-validate.sh` reports 11 routes across 5 commands with no failure.
- **SC-002**: A commit through the linked `prepare-commit-msg` with `speckit.hooks.prepareCommitMsg off` prints the gate notice, and removing the helper call makes that test fail.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | sk-git's `message-contract.mjs` | The standards script cannot validate without it | It is imported from the toolchain beside the script, and every change is rechecked with the same validator the gates call |
| Risk | A cloned repository switches gates off for itself | Low | Local config is never cloned, command-line config is ignored, and an untrusted repository reads no setting |
| Risk | The installed hooks link to another checkout that predates this change | Med | `hooks` shows `install-git-hooks.sh --status` and names a shadowed hook; the troubleshooting row says to update that checkout |
| Risk | A rules edit leaves the template prose stating the old rule | Low | The plan lists each drift line and the workflow offers to fix that prose after the write |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The helper adds one `git config` read per persistable gate to a hook run, and only in a trusted toolchain repository.

### Security
- **NFR-S01**: No approval can be saved: the per-push approvals stay one-command variables, and a `git -c` or `GIT_CONFIG_*` value never switches a gate.

### Reliability
- **NFR-R01**: A missing helper or registry changes nothing: every gate runs as before.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Global off with local on: local wins, and `set ... on` in local scope writes an explicit `on` rather than unsetting.
- `.sk-git/` already holds a modified template: `init` keeps it and reports it.

### Error Scenarios
- A rules change the validator rejects, such as `warnLength` at or above `maxLength`: refused, nothing written.
- `skgit.contractDir` is set: `init` says it outranks `.sk-git/`.

### State Transitions
- A kind switched off: delete its `.sk-git/` file and run `init` again to restore the shipped rules.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | About 35 files across hooks, doctor, contract, mirrors and docs |
| Risk | 12/25 | Touches three machine-wide hooks; every change fails open and is test-proven through a linked hook |
| Research | 6/20 | The contract lookup and every gate variable were traced first |
| **Total** | **33/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. The operator chose the command shape, git config keys for persistence and the `.sk-git/` override folder before work began.
<!-- /ANCHOR:questions -->

---
