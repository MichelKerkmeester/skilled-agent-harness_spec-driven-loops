---
title: "Implementation Plan: Live plugin utilization playbook on OpenCode v1 and v2"
description: "Runs each repository plugin's trigger in a live OpenCode 1 and OpenCode 2 session through a proxy that records every model request, then turns the runs into a playbook category and a results matrix."
trigger_phrases:
  - "live plugin playbook plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Live plugin utilization playbook on OpenCode v1 and v2

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash, Node.js ESM, Markdown |
| **Framework** | OpenCode 1.19.3 and OpenCode 2.0.32 |
| **Storage** | None; run evidence is plain text in the packet |
| **Testing** | Live `opencode run` and `opencode2 run --standalone` sessions |

### Overview
Each plugin gets a prompt that makes a live session hit the plugin's hook, and a check read from a file, a log or the event stream. A local proxy sits between OpenCode and llmgateway and records each request's system prompt and tool results, because most plugin effects are lines added to the system prompt and never show in the event stream.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Playbook and doc checks CI runs pass locally
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Record-and-inspect: the session runs normally, and every observation comes from what it left behind.

### Key Components
- **`capture-proxy.mjs`**: forwards requests to llmgateway unchanged and appends one JSON line per chat request, never the headers.
- **`run-plugin-scenario.sh`**: points the llmgateway provider at the proxy through `OPENCODE_CONFIG_CONTENT`, runs one session on the chosen version, and reports the plugin log lines and state files the run wrote.
- **`mcp-stub.mjs`**: a one-tool stdio MCP server, so the route guard has a native MCP call to advise on.

### Data Flow
Prompt → OpenCode session (plugins hook in) → proxy → llmgateway. The runner keeps the event stream, the proxy's capture and a diff of `.skilled/logs` and `.skilled/skills/.state`; the verdict is read from those three.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not a fix packet. The OpenCode 2 failures are recorded with their causes and left for the operator to schedule.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/plugins/*.js` | The code under test | unchanged | `git diff --stat` shows no plugin change |
| cli-opencode playbook | Operator test contract | update | sk-doc and playbook contract checks |
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Live | One scenario per plugin on each version | `run-plugin-scenario.sh` |
| Probe | Which events and tool names reach a bridged plugin | A temporary probe plugin, removed after use |
| Kill switch | One plugin per version with its switch on | `SYSTEM_SKILL_ADVISOR_DISABLED=1` |
| Doc checks | The new playbook files | sk-doc script tests, playbook operator contract, link integrity |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| llmgateway (`LLMGATEWAY_API_KEY`) | External | Green | No run possible |
| Jev classifier | External | Green | The injection screen stays silent |
| OpenCode 1.19.3 and 2.0.32 installs | Internal | Green | No run possible on that version |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a playbook or doc check fails after merge.
- **Procedure**: `git revert` the merge commit; nothing outside the playbook folder and this packet changes.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (worktree, packet, helpers) ──► Live runs ──► Playbook docs ──► Review and merge
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Live runs |
| Live runs | Setup | Playbook docs |
| Playbook docs | Live runs | Review |
| Review and merge | Playbook docs | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1 hour |
| Live runs | Med | 2 hours |
| Playbook docs and review | Med | 2-3 hours |
| **Total** | | **5-6 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No product code changes
- [x] Every side-effecting scenario restored its target (no stray files, HEAD unchanged)

### Rollback Procedure
1. `git revert` the merge commit on main.
2. Rerun the playbook operator contract check to confirm the root playbook is back to its old count.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
