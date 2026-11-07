---
title: "Repo Guards Adapters: One Link per DSH Adapter"
description: "Relative links from the repo-guards bundle to every DSH adapter in the hook library and the owning skills."
trigger_phrases:
  - "repo guards adapters"
  - "dsh adapter links"
  - "dsh guard registration"
version: 1.0.0.0
---

# Repo Guards Adapters: One Link per DSH Adapter

---

## 1. OVERVIEW

`adapters/` holds one relative symlink per DSH adapter that the `repo-guards` bundle registers. Each link points at the real adapter in `.skilled/hooks/<concern>/dsh/` or in an owning skill's `hooks/dsh/` folder. Node resolves a link to its real path before it resolves the file's own imports, so every adapter's imports are written for its real folder. `sync-runtime-mirrors.cjs --check` expects one link here per `.mjs` file in a `dsh/` folder of the hook library.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| `classifier-injection-screen.mjs` | `tools/post-execute` on `web_fetch`, `web_search` and `mcp__*` | Screens fetched text with the shared classifier advisory and adds the warnings to the tool result. | Fails open. `ERROR_POLICY` is `fail-open`. |
| `completion-evidence.mjs` | `agent/turn-stopping` | Holds a completion claim in the ending reply to its evidence with the shared sentinel. Advisory only. | Fails open. |
| `decision-capture.mjs` | `tools/result`, `session/event`, `agent/status` | Captures `ask_user_question` answers and late replies into the record queue. | Fails open. The save-time sweep recovers missed records. |
| `dispatch-audit.mjs` | `tools/post-execute` on `bash` | Records dispatch audit rows under the checkout's log path. | Fails open. |
| `dispatch-preflight-lint.mjs` | `tools/pre-execute` on `bash` | Runs the dispatch rule checks and denies a command the core rejects. | Fails closed. A core failure denies the command. |
| `dsh-llm.mjs` | Shared loader, no event | Loads `@deepseek-ai/dsh-llm` and `@deepseek-ai/dsh-tools` from the running `dsh` binary and caches each module. | A load failure rejects to the calling adapter. |
| `git-message-gate.mjs` | `tools/pre-execute` on Bash commands covered by the message contract | Checks the commit message contract and denies on a `ContractError`. | Logs an unexpected error and continues. A `ContractError` denies. |
| `git-preflight-advisory.mjs` | `tools/post-execute` on Git Bash commands | Adds up to three Git preflight advisories to the result. | Fails open. |
| `goal-context.mjs` | `agent/created` | Injects the `DSH_SPEC_FOLDER` goal chat slice. | Fails open. |
| `goal-manage.mjs` | `agent/created`, `agent/pre-step`, `agent/turn-stopping`, `agent/status` | Registers `/goal-dsh` and `dsh_goal`, injects the goal brief, records the turn and delivers the verify note on idle. | Fails open. A fan-out leaf keeps the surface off. |
| `mcp-route-guard.mjs` | `tools/pre-execute` on `mcp__*` | Enforces MCP routing and denies a `code_mode` tool outside `call_tool_chain`, `list_tools`, `search_tools` and `tool_info`. | Fails closed. |
| `overlay-guard.mjs` | `tools/pre-execute` on `write`, `edit` and `apply_patch` | Denies a path an overlay owns and allows a path it cannot judge. | Fails open. |
| `post-edit-quality.mjs` | `tools/post-execute` on `write`, `edit` and `apply_patch` | Runs the post-edit quality router and adds its findings to the result. | Fails open. |
| `prompt-advisor.mjs` | `agent/created`, `session/event`, `agent/pre-step` | Runs the Skill Advisor and adds the brief to the step. Off unless the `promptAdvisor` row flag is true. | Fails open. |
| `session-compact-context.mjs` | `session/event` (`compaction/end`) | Re-primes the agent after a completed compaction with the session-prime `compact` source. | Fails open. A failed compaction gets nothing. |
| `session-role.mjs` | Shared helper, no event | Reads and writes the process-wide lineage-leaf marker on `Symbol.for('skilled.repo-guards.lineage-leaf')`. | No error path. A missing marker reads as false. |
| `session-start-advisories.mjs` | `agent/created` (`startup`) | Runs the warn-only session-start guards from this checkout and injects one notice with their warnings. | Fails open per guard. |
| `session-start-context.mjs` | `agent/created` | Injects `session-prime.js` output for a startup or resumed session and exports `runSessionPrime`. | Fails open. |
| `session-stop-context.mjs` | `agent/disposed` | Runs `session-stop.js` with the Stop payload and injects nothing. | Fails open. An autosave failure never blocks close. |
| `spec-gate-classify.mjs` | `agent/pre-step` | Runs the shared Gate-3 classifier on the operator prompt and adds the deferral notice to the step. | Fails open. |
| `spec-gate-enforce.mjs` | `tools/pre-execute` on `write`, `edit`, `apply_patch` and `bash` | Asks at the first undelivered write or edit and denies by the shared verdict. | Fails closed. |
| `task-dispatch-guard.mjs` | `tools/pre-execute` on `subagent` and `subagent_fork` | Records deep-loop warnings and audits, then passes the call. | Fails open. |

---

## 3. RELATED

- [`../README.md`](../README.md): the bundle, its adapter policy table and its validation commands.
- [`../index.mjs`](../index.mjs): the bundle entry that registers these adapters.
- [`../lineage-leaf.mjs`](../lineage-leaf.mjs): the marker plugin the lineage patch inserts.
- [`../../../../.skilled/hooks/README.md`](../../../../.skilled/hooks/README.md): the hook library and its coverage matrix.
