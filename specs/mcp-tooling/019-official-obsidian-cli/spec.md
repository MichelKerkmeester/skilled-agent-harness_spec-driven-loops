---
title: "Feature Specification: Official Obsidian CLI agent-usage support in mcp-obsidian"
description: "The official `obsidian` binary is already on PATH but silently unusable whenever the desktop app is down, and it reports every in-app failure with exit 0. The mcp-obsidian skill documents neither fact, so an agent reaching for the CLI cannot tell a working surface from a dead one."
trigger_phrases:
  - "official obsidian cli"
  - "obsidian cli preflight"
  - "obsidian cli exit code"
  - "obsidian app must be running"
  - "obsidian cli vs notesmd-cli"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Official Obsidian CLI agent-usage support in mcp-obsidian

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-02 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The official `obsidian` binary is already registered on this machine at `/usr/local/bin/obsidian`, symlinked into the desktop app bundle. It is not a headless tool. It is a remote control for a running Obsidian process, and it answers nothing at all when that process is down. Worse, once the app *is* running the CLI reports in-app failures on stdout with **exit status 0**, so a script that branches on `$?` treats every missing file, unknown command and unknown vault as a success.

The `mcp-obsidian` skill already names this CLI as one of its three surfaces, but it does not teach an agent the preflight that distinguishes a live surface from a dead one, does not carry the real command surface captured from the binary, and does not warn that commands default to whatever note the human currently has open.

### Purpose

An agent can decide which Obsidian CLI to reach for, prove the official one will answer before depending on it, and read its results correctly, without guessing and without trusting exit codes.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Verify the official CLI's installed state and record its real behavior from the binary, not from vendor documentation.
- Correct any existing claim in the skill that the binary contradicts.
- Add the agent-facing usage layer: surface selection, preflight, result handling, and the safety invariants that follow from the app-backed design.
- Capture the command surface from `obsidian help` as a grouped index, leaving the exhaustive per-command parameter list to the binary so no second source of truth can go stale.
- Extend `scripts/doctor.sh` so the diagnostic an agent actually runs reports the official CLI's true state.

### Out of Scope

- Installing a new binary. The CLI is already registered, so an install step would mutate the environment to reach a state that already holds. See §6 for the check that proves it.
- Replacing or deprecating any existing surface. The MCP server and `notesmd-cli` keep their roles; this packet adds a third lane beside them.
- Changing vault contents. Verification uses one scratch note, deleted before close-out.
- Wrapping the CLI in a script or MCP shim. No caller needs one today, and a wrapper that only forwards arguments is indirection with no behavior.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-tooling/mcp-obsidian/references/obsidian-cli-commands.md` | Modify | Correct claims the binary contradicts; point at the new agent-usage reference |
| `.opencode/skills/mcp-tooling/mcp-obsidian/references/official-cli-agent-usage.md` | Create | The agent-facing usage layer: selection, preflight, result contract, safety invariants, and the 106-command surface |
| `.opencode/skills/mcp-tooling/mcp-obsidian/scripts/doctor.sh` | Modify | Add an official-CLI preflight probe that distinguishes app-down from CLI-absent |
| `.opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md` | Modify | Route the new references; state the surface-selection rule; version bump |
| `.opencode/skills/mcp-tooling/mcp-obsidian/references/troubleshooting.md` | Modify | Add the two failure modes an agent will actually hit |
| `.opencode/skills/mcp-tooling/mcp-obsidian/feature-catalog/` (index + 3 cli cards) | Modify | The three official-CLI cards already existed as `VERIFY` stubs carrying the false claim; corrected rather than duplicated |
| `.opencode/skills/mcp-tooling/mcp-obsidian/manual-testing-playbook/official-cli/` (2 scenarios) | Modify | Both scenarios already existed and were built on a command form that does not work; rewritten around the preflight |
| `.opencode/skills/mcp-tooling/mcp-obsidian/changelog/v0.23.0.0.md` | Create | Version entry for this change |
| `.opencode/skills/mcp-tooling/mcp-obsidian/examples/official-cli-workflow.sh` + `examples/README.md` | Create + Modify | The contract in executable form, and its index entry |
| `.opencode/skills/mcp-tooling/mcp-obsidian/scripts/install.sh`, `mcp-servers/obsidian-cli/setup.sh` + `README.md` | Modify | Same false claim and POSIX-flag verification command |
| `.opencode/skills/mcp-tooling/mcp-obsidian/INSTALL-GUIDE.md`, `README.md` | Modify | Operator entry points repeating the corrected claims |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The skill states the preflight that proves the official CLI will answer, and the exact signal that says it will not. |
| REQ-002 | The skill states that the official CLI reports in-app failures with exit status 0, and gives the detection an agent must use instead. |
| REQ-003 | The skill gives an unambiguous rule for choosing between the official CLI, `notesmd-cli`, and the MCP server. |
| REQ-004 | Every command, flag and behavior documented for the official CLI was observed from the binary on this machine, or is marked UNKNOWN with the check that would settle it. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | `scripts/doctor.sh` reports the official CLI's state and distinguishes "not installed" from "installed but app down". |
| REQ-006 | The skill warns that commands omitting `file=`/`path=` act on the human's currently-open note. |
| REQ-007 | Claims in the existing reference that the binary contradicts are corrected, and the contradiction with the vendor page is recorded rather than silently resolved. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: An agent reading only the skill can write a correct official-CLI invocation, including the preflight and the result check, without consulting the vendor page.
- **SC-002**: `bash scripts/doctor.sh` reports the official CLI's true state in both the app-up and app-down conditions.
- **SC-003**: `validate.sh <packet> --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Obsidian desktop app, version 1.13.7 (installer 1.13.4) | Every official-CLI command fails when the app is not running | Documented as the preflight; the headless lane stays available for app-less environments |
| Dependency | CLI registration symlink at `/usr/local/bin/obsidian` | Absent registration means no binary on PATH | Verified present before writing; `doctor.sh` reports its absence |
| Risk | Vendor documentation disagrees with the binary | An agent following the vendor page writes commands that fail | Binary wins, disagreement recorded explicitly in the reference |
| Risk | Verification writes to the operator's live vault | Unwanted note left behind | One scratch note, permanently deleted, vault file count reconciled to its pre-change baseline |
| Risk | Launching the desktop app changes machine state | Operator finds an app they did not open | App was down at start, and is returned to down at close-out |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The preflight probe adds one CLI invocation, and must not block when the app is down. Observed app-down failure is immediate rather than timing out.
- **NFR-P02**: `doctor.sh` stays non-interactive and must never wait on a GUI dialog.

### Security
- **NFR-S01**: The `eval` and `dev:*` command families execute arbitrary JavaScript inside the user's running app. They are documented with that blast radius stated, not presented as ordinary commands.
- **NFR-S02**: No vault content, vault path, or note text from the operator's live vault is copied into the committed documentation.

### Reliability
- **NFR-R01**: Every documented command carries the observed exit status and output stream, so a reader can build a correct check.
- **NFR-R02**: Anything not observed on this machine is marked UNKNOWN with its settling check, rather than inferred from the vendor page.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a command with no `file=` or `path=` silently retargets the active note rather than erroring.
- Name collision: `create` against an existing name does not fail and does not overwrite. It creates a numbered sibling and reports the new name.
- Invalid format: an unknown command prints `Error: Command "<name>" not found.` on stdout and exits 0.

### Error Scenarios
- App not running: message on stderr, exit 1, and the app is **not** auto-launched.
- Unknown vault: prints `Vault not found.` on stdout and exits 0.
- Missing file: prints `Error: File "<name>" not found.` on stdout and exits 0.

### State Transitions
- Partial completion: a mutating command that reports a different filename than requested has succeeded against a different file, which a caller must detect by reading the returned name.
- Vault targeting: `vault=` is accepted both before and after the command word.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | Documentation plus one diagnostic script; no runtime code |
| Risk | 6/25 | No auth, API or schema change; one script touched; live vault touched only by a reverted scratch note |
| Research | 15/20 | The command surface and its failure contract had to be measured from the binary |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None blocking. Decisions taken autonomously are recorded in `plan.md` §Decisions.
<!-- /ANCHOR:questions -->

---
