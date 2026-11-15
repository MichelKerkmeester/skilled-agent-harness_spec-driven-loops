---
title: "Feature Specification: Vibe handover switch and live hop"
description: "Mistral Vibe joined the relaunch loop on the command-only tier, but the flag readers never learned its name, so SYSTEM_SESSION_RELAUNCH_VIBE_ENABLED does nothing and only the global switch turns Vibe on. The interactive Vibe hop has also never run live. This phase teaches both flag readers the Vibe switch and runs one hop in a real terminal."
trigger_phrases:
  - "vibe handover flag and live hop"
  - "vibe relaunch enable switch"
  - "system session relaunch vibe enabled"
  - "vibe live hop"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Vibe handover switch and live hop

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-15 |
| **Branch** | `worktrees/400-vibe-handover-flag-and-live-hop` |
| **Parent Spec** | ../spec.md |
| **Phase** | 43 of 43 |
| **Predecessor** | 042-handover-gap-closure |
| **Successor** | None |
| **Handoff Criteria** | The Vibe switch resolves in both readers and one live Vibe hop is recorded |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 43** of the session relaunch loop.

**Scope Boundary**: The Vibe name in the two flag readers, the docs that list the per-runtime switches, and one live Vibe hop. The automatic Vibe tier stays out, as the Vibe packet's relaunch phase decided.

**Dependencies**:
- Vibe on the command-only tier in `relaunch-core.cjs` and `skilled-loop`, already on main
- The phase 042 probe, `042-handover-gap-closure/scratch/harness/probe.sh`

**Deliverables**:
- `vibe` in `RUNTIMES` in `hook-flags.cjs` and in the runtime case in `hook-flags.sh`
- A test that keeps the flag readers' runtime list in step with the relaunch loop's
- The Vibe switch in the env templates, the env reference and the doctor env flow
- A live Vibe hop run under `scratch/runs/`
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The relaunch loop accepts `--runtime vibe`, but `hook-flags.cjs` and `hook-flags.sh` list only six runtimes, so a Vibe caller gets the global-only answer and `SYSTEM_SESSION_RELAUNCH_VIBE_ENABLED=1` is ignored without a word. The Vibe packet's relaunch phase also records the interactive hop as blocked, because its worker had no terminal, so no Vibe hop has ever run end to end.

### Purpose
An operator can turn the Vibe hand-over on with its own switch, and a live run shows whether a Vibe session started through `skilled-loop vibe` hands its note to a fresh Vibe session that claims it.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node -e 'const f=require("./.skilled/hooks/shared/hook-flags.cjs"); for (const env of [{}, {SYSTEM_SESSION_RELAUNCH_VIBE_ENABLED:"1"}, {SYSTEM_SESSION_RELAUNCH_ENABLED:"1"}]) console.log(JSON.stringify(env), JSON.stringify(f.hookFlagDecision("session-relaunch", env, undefined, {runtime:"vibe"})))'
{} {"enabled":false,"key":"SYSTEM_SESSION_RELAUNCH_ENABLED","reason":"global"}
{"SYSTEM_SESSION_RELAUNCH_VIBE_ENABLED":"1"} {"enabled":false,"key":"SYSTEM_SESSION_RELAUNCH_ENABLED","reason":"global"}
{"SYSTEM_SESSION_RELAUNCH_ENABLED":"1"} {"enabled":true,"key":"SYSTEM_SESSION_RELAUNCH_ENABLED","reason":"global"}
$ grep -n "const RUNTIMES" .skilled/hooks/shared/hook-flags.cjs .skilled/hooks/session-relaunch/lib/relaunch-core.cjs
.skilled/hooks/shared/hook-flags.cjs:113:const RUNTIMES = Object.freeze(["claude", "codex", "pi", "opencode", "cursor", "devin"]);
.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:35:const RUNTIMES = Object.freeze(['claude', 'pi', 'opencode', 'codex', 'cursor', 'devin', 'vibe']);
$ head -3 specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/019-vibe-relaunch-command-tier/scratch/manual-hop.md
# Manual Vibe hop record

Status: **BLOCKED** for the interactive half. This worker is non-interactive and has no
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `vibe` to `RUNTIMES` in `hook-flags.cjs` and to the runtime case in `hook-flags.sh`
- Add a test that fails when the relaunch loop names a runtime the flag readers do not, and a Vibe row in every reader
- List the Vibe switch wherever the other per-runtime switches are listed: both env templates, the env reference and the doctor env flow
- Run one interactive Vibe hop live through `skilled-loop vibe` and record it
- Name Vibe in the handoff command's session-id rule, runtime lists and printed-command table, and let the continuity writer accept `--runtime vibe`. The live run showed both: the sender searched the disk and Vibe's log folder for a session id, and the writer refuses `vibe`. Added after the run

### Out of Scope
- A hook part that tells a Vibe model its own session id - `uuidgen` already gives Devin and Cursor a working id, so the same rule covers Vibe
- The automatic Vibe tier, a context nudge, a stop arm and a killer - the Vibe packet's relaunch phase left it out because Vibe runs mostly as a headless child
- Turning Vibe on by default - only Claude Code is on by default, and Vibe's tier ends no session by itself
- Editing the Vibe packet's own phase docs - another session owns that packet, so this phase records its live run here

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/shared/hook-flags.cjs` | Modify | `vibe` in `RUNTIMES` |
| `.skilled/hooks/shared/hook-flags.sh` | Modify | `vibe` in the session-relaunch runtime case |
| `.skilled/hooks/shared/hook-flags.test.cjs` | Modify | The runtime-list parity test and the Vibe rows |
| `.env.example`, `.skilled/hooks/hook-flags.env.example` | Modify | The Vibe per-runtime switch line |
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md`, `.skilled/commands/doctor/assets/doctor-env.yaml`, `.skilled/hooks/session-relaunch/tests/README.md` | Modify | The Vibe switch in the per-runtime lists, and the count of per-runtime flags |
| `.skilled/commands/speckit/handoff.md`, `.skilled/commands/speckit/save.md`, `.skilled/commands/speckit/assets/speckit-save-context-tail.yaml`, `.skilled/hooks/session-relaunch/README.md` | Modify | Vibe in the `uuidgen` rule, the runtime lists and the printed-command table |
| `.skilled/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts` | Modify | `vibe` in `KNOWN_RUNTIMES` and the help text |
| `runtime/cli/tests/generate-context-help.vitest.ts`, `runtime/cli/tests/save-continuity-write.vitest.ts` | Modify | Vibe accepted, and a Vibe save mints a `transcript_path` pointer |
| `scratch/harness/probe.sh` | Create | The phase 042 probe with a Vibe case, `HOP_ENVS`, `VIBE_HOME` and `HOP_CODE` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `SYSTEM_SESSION_RELAUNCH_VIBE_ENABLED` decides the relaunch flag for a Vibe caller in every reader | `hookFlagDecision` with `{SYSTEM_SESSION_RELAUNCH_VIBE_ENABLED:"1"}` and runtime `vibe` returns `enabled: true` with `reason: "runtime"`, and `hook_enabled session-relaunch vibe` in the shell gives the same answer |
| REQ-002 | The flag readers' runtime list covers every runtime the relaunch loop accepts | A test compares `RUNTIMES` in `hook-flags.cjs` with `RUNTIMES` in `relaunch-core.cjs` and fails on the old code |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Every doc that lists the per-runtime switches names the Vibe switch | `rg -c SYSTEM_SESSION_RELAUNCH_VIBE_ENABLED` finds it in both env templates, the env reference and the doctor env flow |
| REQ-004 | One live Vibe hop is recorded | `scratch/runs/` holds the run's relaunch log and screen captures, and the implementation summary says whether the receiver claimed the note |
| REQ-005 | The continuity writer accepts `--runtime vibe` and mints its pointer | `generate-context` parses `--runtime vibe`, and a full-auto save with a session id writes a `session_ref` with `runtime: vibe` and `locatorKind: transcript_path`. Both tests fail on the old code |
| REQ-006 | The handoff command tells a Vibe session how to get its id | `handoff.md` names Vibe in the `uuidgen` rule and lists `vibe` wherever it lists the relaunch runtimes |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: With only `SYSTEM_SESSION_RELAUNCH_VIBE_ENABLED=1` set, `session-relaunch.cjs prepare --runtime vibe` prepares a record instead of refusing.
- **SC-002**: The flag suite passes with no test lost against its 29, and the relaunch and plugin suites pass against 1,564.
- **SC-003**: A live Vibe receiver started from the printed claim command claims the sender's note and marks it done.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The Mistral API key and the Vibe CLI 3.1.2 | Without them the live hop cannot run | Both are present. A credential failure stops the run and is recorded, never routed to another provider |
| Risk | The Vibe TUI may not exit on the keys the probe sends | Med | The probe records the screen at each step, so a stuck exit shows in the run and is reported as a finding |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None
<!-- /ANCHOR:questions -->

---
