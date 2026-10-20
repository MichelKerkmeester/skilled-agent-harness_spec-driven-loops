---
title: "Feature Specification: Live plugin utilization playbook on OpenCode v1 and v2"
description: "The version battery proves every repository plugin loads on OpenCode 1 and 2, but not that a live session on either version can use it. This packet adds a playbook category with one live scenario per plugin and records what each plugin actually did on both versions."
trigger_phrases:
  - "live plugin playbook"
  - "live plugin utilization playbook on opencode v1"
  - "plugin utilization matrix"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Live plugin utilization playbook on OpenCode v1 and v2

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-10-20 |
| **Branch** | `worktrees/174-live-plugin-playbook` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The doctor's version battery reports all 17 files in `.opencode/plugins/` as loaded on OpenCode 1.19.3 and active on OpenCode 2.0.32. Being registered is not the same as working: nothing ran a live session on either version and checked that each plugin's hook fired and did its job. A plugin can register on OpenCode 2 and still never see the tool calls or events it filters on.

### Purpose
Every plugin has a live, repeatable scenario on both versions, and the packet records per plugin and per version whether the plugin produced its observable effect, with the evidence.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A new `plugin-utilization/` category in the cli-opencode manual testing playbook, with one scenario file per plugin and the root playbook updated to list it.
- Three helpers in that category: a model-request capture proxy, a stub MCP server and a scenario runner.
- Live runs of every scenario on OpenCode 1.19.3 and OpenCode 2.0.32 with DeepSeek v4.1 flash at the high effort level through llmgateway, plus one kill-switch check per version.
- A results matrix with an evidence file per run.

### Out of Scope
- Fixing a plugin that fails on a version. A fix is a separate decision for the operator.
- The doctor battery script and the CI workflows, which other work owns.
- OpenCode 2 server or TUI mode. Every v2 run uses `opencode2 run --standalone`, so the shared v2 service is never touched.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/*.md` | Create | One scenario per plugin |
| `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/{capture-proxy.mjs,mcp-stub.mjs,run-plugin-scenario.sh}` | Create | Scenario helpers |
| `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/manual-testing-playbook.md` | Modify | Register the category and its scenarios |
| `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/034-live-plugin-playbook/` | Create | Packet docs, run evidence and the results matrix |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every `.js` file in `.opencode/plugins/` has a scenario that names its trigger, the exact v1 and v2 commands, the observable check and the cleanup. |
| REQ-002 | Every scenario has been run live on both versions, and each verdict rests on evidence read from files, logs or event JSON, not on the model's own claim. |
| REQ-003 | The packet holds a plugin-by-version matrix of PASS, FAIL or NOT-TRIGGERABLE, each cell pointing at its evidence file, and every FAIL names its root cause. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | One plugin's kill switch is checked on each version, and its effect is gone with the switch on. |
| REQ-005 | The playbook's root document lists the new category and its scenario count, and the playbook checks that CI runs pass. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 17 of 17 plugins have a verdict on both versions, backed by an evidence file.
- **SC-002**: An operator can rerun any scenario with the committed runner and get the same kind of evidence.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | llmgateway with `LLMGATEWAY_API_KEY` set | No runs at all | Checked with a one-word dispatch on each version before the scenarios |
| Dependency | The Jev classifier for the injection screen | The screen stays silent | Readiness checked with `featureReady('injection-screen')` before the run |
| Risk | The model refuses a fixture it reads as a rule break | A scenario looks like a plugin failure | Prompts name the test, pre-resolve Gate 3 and use fixtures that do not read as violations |
| Risk | A side-effecting scenario changes the checkout | A stray file or commit | Side-effecting scenarios run only in the worktree, and each scenario names its cleanup |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: One scenario run finishes in under 10 minutes; the runner kills it at 600 seconds.

### Security
- **NFR-S01**: The capture proxy never writes request headers, so the API key never reaches a capture file.
- **NFR-S02**: No v2 run uses `--server` or `--attach`, so the shared v2 service is never contacted.

### Reliability
- **NFR-R01**: The proxy forwards every request unchanged, and a capture failure never breaks the run.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A plugin whose effect is a system-prompt line: the only place to see it is the model request, so the proxy captures it.
- A plugin whose effect depends on an event the version does not deliver: the run records the missing event, and the cell is FAIL with that cause.

### Error Scenarios
- The model declines the scenario's request: the run is repeated with a clearer prompt, and the refusal is not counted against the plugin.
- A dedup record suppresses a repeat advisory: the scenario clears that state before the run.

### State Transitions
- A scenario that stages, commits or writes a file: the evidence records the HEAD and the files before and after, and the cleanup restores them.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | About 22 new playbook files plus three helpers |
| Risk | 8/25 | Live runs in a worktree; no product code changes |
| Research | 14/20 | Each plugin's trigger and evidence had to be worked out |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Whether to fix the seven OpenCode 2 failures, and in which order, is the operator's call.
<!-- /ANCHOR:questions -->
