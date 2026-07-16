---
title: "Task"
description: "Outcome-oriented browser-agent work through the aside CLI: natural-language tasks, session continuation, explicit exec with provider/model controls, and account selection — approval-gated, mutating on the browser side."
trigger_phrases:
  - "aside agent task"
  - "aside browser task"
  - "aside exec"
  - "aside session continuation"
version: 1.0.0.0
---

# Task (agent-task lane over the aside CLI)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Carries goal-driven, multi-step browser work: "sign in and download", "compare and book", "fill the form" — jobs where the outcome matters more than the steps. The lane is the primary surface of the skill: `aside "<task>"` starts a natural-language browser-agent task under the signed-in account, `aside exec` adds explicit provider/model controls, `--session <id>` continues prior account-scoped task state, and `--account <id>` selects the account for a direct task.

The capabilities are MUTATING on the browser side (navigation, form actions, downloads, autofill sign-in) with hard human-only boundaries: MFA, CAPTCHA, identity checks, vault unlock, and approval gates pause the task and require the operator to resume.

---

## 2. HOW IT WORKS

Run the preflight first (`command -v aside`, `aside --version 2>&1`, `aside --help 2>&1` as a fixture — the command surface is version-pinned). Then hand the goal to the agent: `aside "Open https://example.com and summarize the page"`. Documented agent capabilities cover navigation, page/DOM inspection, screenshots, downloads, file use, approval requests, and password-manager autofill sign-in (saved password values are never exposed to the agent). Continuation uses `aside --session <id> "<follow-up>"`; the state is account-scoped and tasks can pause for input or approval and resume.

Boundary rules: `--account` is documented for direct tasks and `exec` only — never `aside mcp --account` or `aside repl --account`. `--session` is agent-task continuation, not an MCP browser selector. **UNKNOWN — model-flag spelling**: docs show `-m provider/model` while the installed help shows separate `--model` and `--provider`; capture the installed version's help before using either. **UNKNOWN — session storage backend**: where `--session` state persists is not publicly documented.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/aside-cli-reference.md` | Shared | Verified command surface, options, and boundary rules |
| `references/session-management.md` | Shared | Three-layer session model and the pause/resume approval lifecycle |
| `examples/agent-task-session.sh` | Example | Agent-task workflow with session continuation |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/agent-task/direct-task.md` | Manual playbook | ASD-004 direct natural-language task end-to-end |
| `manual_testing_playbook/agent-task/session-continuation.md` | Manual playbook | ASD-005 session continuation with prior context |

---

## 4. SOURCE METADATA

- Group: Task
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `task/agent-tasks.md`

Related references:
- [repl-evidence-capture.md](../repl/repl-evidence-capture.md) covers the deterministic lane when the steps ARE the deliverable
- [troubleshooting-recipes.md](../troubleshoot/troubleshooting-recipes.md) covers signed-out and pause-state recovery
