---
title: "Feature Specification: OpenCode 2 bridge delivers the tool names and session events plugins act on"
description: "Seven repository plugins load on OpenCode 2 but never act, because the v2 bridge passes v2 tool names and events through unchanged. This phase maps them to the v1 names and shapes the plugins read, and reruns the live playbook on both versions."
trigger_phrases:
  - "v2 bridge plugin effects"
  - "phase 35 v2 bridge plugin effects"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: OpenCode 2 bridge delivers the tool names and session events plugins act on

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-10-20 |
| **Branch** | `worktrees/176-v2-bridge-plugin-effects` |
| **Parent Spec** | ../spec.md |
| **Phase** | 35 of 35 |
| **Predecessor** | 034-live-plugin-playbook |
| **Successor** | None |
| **Handoff Criteria** | The live playbook shows each of the 17 plugins' checked effect on OpenCode 2, or records the root cause where it does not, and CI passes at the pushed commit |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 35** of the OpenCode v1 and v2 dual compatibility specification. It fixes the seven OpenCode 2 FAILs that phase 034's live playbook recorded, in the shared bridge rather than in each plugin, as the operator chose on 2026-10-20.

**Scope Boundary**: `.opencode/plugins/lib/v2-bridge.js`, its unit tests, the plugin-utilization playbook folder (the five review follow-ups and the results matrix), the plugin docs that describe the bridge, and this packet. The plugins themselves stay as they are.

**Dependencies**:
- `../034-live-plugin-playbook/`, whose results matrix and probe evidence name the four causes.
- `../019-plugins-compat-docs/`, which documents the bridge in `.opencode/plugins/ARCHITECTURE.md`.

**Deliverables**:
- The bridge mappings and their unit tests.
- A live rerun of all 17 plugin scenarios on both versions with a refreshed results matrix.
- The five runner follow-ups from 034's last review.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
All 17 repository plugins register as `active` on OpenCode 2.0.32, but phase 034's live runs showed only 10 of them act. A probe run on 2026-10-20 confirmed the four causes. v2 names the shell tool `shell` and the subagent tool `subagent` with an `agent` argument, while the plugins filter on `bash` and on `task` with `subagent_type`. `opencode2 run` sends no `session.created` for its own session; only a subagent session gets one. The bridge's `message.updated` carries no top-level `sessionID` and no `info.time.completed`, and v2 sends no user `message.updated` at all.

### Purpose
The bridge hands every plugin the v1 tool names, argument names and session events it reads, so each plugin's checked effect appears on OpenCode 2 as it does on OpenCode 1.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Report v2 `shell` to plugin hooks as `bash`, with a string `output` in the after hook.
- Report v2 `subagent` as `task` with `subagent_type` added beside `agent`, and map an argument change back to `agent` only.
- Deliver one `session.created` per session before its first other event or system transform, never twice.
- Add a top-level `sessionID` and `info.time.completed` (the v2 event's `created` time) to the mapped `message.updated` and `message.part.updated` events, and map a user inbox item to a user `message.updated` plus its text part.
- Unit tests for each mapping, then the live playbook on both versions.
- The five runner follow-ups from 034's last review.

### Out of Scope
- Changing any plugin file - the operator chose the shared bridge.
- OpenCode 1 behaviour - the bridge only runs on v2; the v1 rerun is the regression check.
- A v2 equivalent for `ask` in tool context - unrelated to the seven FAILs.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/plugins/lib/v2-bridge.js` | Modify | Tool aliases, synthesized `session.created`, richer message events |
| `.opencode/plugins/tests/v2-bridge.test.cjs` | Modify | A test per mapping, happy path and one edge each |
| `.opencode/plugins/ARCHITECTURE.md` and `.opencode/plugins/README.md` | Modify | Describe the new mappings where the bridge is documented |
| `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/` | Modify | The five runner follow-ups and any scenario text the fix changes |
| `035-v2-bridge-plugin-effects/` | Create | This packet, with the rerun matrix and its evidence under `scratch/live-runs/` |
| `../spec.md`, `../graph-metadata.json` | Modify | Phase map and handoff rows for 035 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Shell and subagent calls reach the plugins under their v1 names and argument names, and a plugin's argument change still reaches v2 under the v2 names. | Unit tests cover `shell` to `bash`, `subagent` to `task`, the argument write-back and an unrenamed tool. |
| REQ-002 | Each session gets exactly one `session.created`. | Unit tests cover the synthesized event, a real `session.created` that follows it, and a transform that runs before any event. |
| REQ-003 | `message.updated` carries `sessionID` and `info.time.completed`, and a user inbox item yields a user `message.updated` and its text part. | Unit tests cover the step mapping and the inbox mapping, and a non-user inbox item maps to nothing. |
| REQ-004 | The seven OpenCode 2 FAILs from 034 show their checked effect. | The live rerun matrix shows PASS on v2, or records a root cause for any that still fails. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | OpenCode 1 is unchanged. | All 17 scenarios pass on v1 in the rerun. |
| REQ-006 | The full plugin suite and the inventory and purity guards pass. | `node --test '.opencode/plugins/tests/*.test.cjs'` and the purity vitest pass. |
| REQ-007 | The five 034 review follow-ups are closed. | Each one has a change in the runner or scenario and a check that shows it. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 17 of 17 plugins show their checked effect on OpenCode 2 in the live rerun, or each exception has a recorded root cause.
- **SC-002**: The plugin tests, the dual-version battery and Spec-Kit Check pass on CI at the pushed commit.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Adding `subagent_type` to the arguments v2 receives could fail its input schema | High | The write-back removes the added field and maps a changed value to `agent` |
| Risk | A synthesized `session.created` arrives after the first system transform, so a startup warning misses the first request | Med | The transform path delivers it first when the event stream has not |
| Risk | v2 renames another tool a plugin filters on | Med | The live rerun covers every plugin on v2 |
| Dependency | v2 event envelopes carry a `created` time | Med | Confirmed in the 2026-10-20 probe; `time.completed` is left out when it is missing |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None open. The operator chose the shared bridge and the five follow-ups on 2026-10-20.
<!-- /ANCHOR:questions -->

---


