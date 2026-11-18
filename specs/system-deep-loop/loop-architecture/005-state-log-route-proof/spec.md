---
title: "Feature Specification: Keep route-proof fields in the deep-research state log and keep the pre-dispatch audit path inside the packet"
description: "Keeps route-proof fields in the deep-research state log. Resolves a relative state-log path against the caller's working directory before the append gateway runs."
trigger_phrases:
  - "state log route proof"
  - "keep route proof fields in the deep research"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Keep route-proof fields in the deep-research state log and keep the pre-dispatch audit path inside the packet

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-17 |
| **Branch** | `worktrees/470-surfacing-scorer-follow-ups` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A project that vendors Skilled runs a correct deep-research pass, and the command's route-proof check fails. Each iteration's delta file carries `target_agent`, `resolved_route`, `agent_definition_loaded` and `mode`, but the state log keeps only `mode`. A relative state-log path passed to `pre_dispatch_audit` also resolves inside the Skilled checkout when `.skilled` is a symlink, so the write lands outside the caller's packet.

### Purpose
A correct run passes the route-proof check, and a relative state-log path writes where the caller's working directory points.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
N/A: No command output from before the change was captured. The before-state is traced in code, and Problem Statement describes it. Capturing that output would mean reverting the change, which is outside this packet.
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Carry `target_agent`, `agent_definition_loaded` and `resolved_route` through the ledger schema, the legacy conversion and the state-log projection. Today the state log keeps only `mode`.
- Export `gatewayRunDirectory` and use it in `appendThroughGateway`. Today a relative state-log path resolves inside the Skilled checkout.
- Add a route-proof test to `deep-research-ledger-schema.vitest.ts`, and add `executor-audit-run-directory.vitest.ts` with two tests for the run directory.

### Out of Scope
- Items 1 to 8 of the source report - They concern skill and command routing, not the state log. They are tracked in `specs/system-skill-advisor/routing-and-scoring/011-surfacing-scorer-follow-ups`.
- Migrating older ledgers - The three fields are optional. Older ledgers project as before.
- Files that earlier runs already wrote inside the Skilled checkout - The fix changes where a path resolves. It does not move files that earlier runs wrote.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-schema.ts` | Modify | Adds the optional `targetAgent`, `agentDefinitionLoaded` and `resolvedRoute` fields to `deep_research.iteration_completed` |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts` | Modify | Copies the three fields from a legacy record when their types are valid |
| `.skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-research-contract.ts` | Modify | Writes the fields to the state log as `target_agent`, `agent_definition_loaded` and `resolved_route` when present |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` | Modify | Exports `gatewayRunDirectory` and uses it in `appendThroughGateway` |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-ledger-schema.vitest.ts` | Modify | Adds the test "keeps the route-proof fields of a completed iteration in the state log" |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-audit-run-directory.vitest.ts` | Create | Two tests for the run directory of a relative state-log path and of an absolute one |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The state log keeps `target_agent`, `agent_definition_loaded` and `resolved_route` for a completed iteration. | Run `npx vitest run tests/unit/deep-research-ledger-schema.vitest.ts` in the runtime folder. It prints `Tests  58 passed (58)`, and the test "keeps the route-proof fields of a completed iteration in the state log" passes. |
| REQ-002 | A relative state-log path resolves against the caller's working directory before the gateway spawns. | Run `npx vitest run tests/unit/executor-audit-run-directory.vitest.ts` in the runtime folder. It prints `Tests  2 passed (2)`. |
| REQ-003 | The runtime typechecks after the change. | `npm run typecheck` in the runtime folder exits 0. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | An absolute state-log path keeps its directory as given. | The test "keeps an absolute state-log path as given" passes in `executor-audit-run-directory.vitest.ts`. |
| REQ-005 | The rest of the deep-loop suite keeps passing. | `npm test` in the runtime folder reports zero failed files and zero failed tests. It prints `Test Files  186 passed (186)`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A completed iteration keeps all three route-proof fields in the state log. The ledger suite prints `Tests  58 passed (58)`.
- **SC-002**: A relative state-log path resolves against the caller's working directory. The run-directory suite prints `Tests  2 passed (2)`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The append gateway, `.skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs`, which `appendThroughGateway` runs with `--run-directory` | If the gateway changes how it reads `--run-directory`, the fix may stop working. | Rerun the three executor-audit suites after any gateway change. |
| Risk | Older ledgers do not carry the three fields | Low. Those ledgers would show no route-proof fields. | The fields are optional, and the projection writes them only when present. |
| Risk | Files that earlier runs wrote inside the Skilled checkout stay there | Low. The change does not move them. | Review those files by hand and move any that belong to a packet. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None block closure. The deep-loop suite has no pre-change baseline, so its zero-failure result is not a measured change. See `implementation-summary.md`, Known Limitations.
<!-- /ANCHOR:questions -->

---

