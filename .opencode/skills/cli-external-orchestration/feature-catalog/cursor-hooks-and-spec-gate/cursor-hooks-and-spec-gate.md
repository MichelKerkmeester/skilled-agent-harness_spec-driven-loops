---
title: "Cursor CLI Hooks And Spec-Gate Integration"
description: "Current-state reference for cli-cursor's shared Cursor hook surface and Gate-3 adapters, including confirmed, registered-but-unconfirmed, and advisory paths."
trigger_phrases:
  - "Cursor CLI Hooks And Spec-Gate Integration"
  - "cli-cursor hook adapters"
  - "Cursor preToolUse spec gate"
  - "Cursor hooks.json shared configuration"
version: 1.4.0.0
---

# Cursor CLI Hooks And Spec-Gate Integration (cli-cursor)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

`cli-cursor` uses one hook/spec-gate surface for session lifecycle events and tool-call policy. Confirmed event paths normalize Cursor payloads, delegate shared work to existing adapters, and return Cursor-native permission responses where the event supports them.

Cursor CLI and the Cursor desktop editor read the same `.cursor/hooks.json` configuration. Registration is therefore a shared-surface change, and this catalog distinguishes live-confirmed delivery from registration-only status.

---

## 2. HOW IT WORKS

### Event Surface

Live dispatches confirm `sessionStart`, `sessionEnd`, generic `preToolUse`, `postToolUse`, and `beforeMCPExecution` delivery. The session adapters delegate to existing session-prime/session-stop implementations. The generic pre-tool event observes shell, read, grep, write, and task calls before execution.

### Gate-3 Enforcement And Classification

`spec-gate-enforce.mjs` maps Cursor's `Shell` and `Write` tools to the shared mutation policy. Its deny path returns `permission: "deny"` and exits with code 2. `spec-gate-classify.mjs` is registered on `beforeSubmitPrompt`, but delivery remains unconfirmed under the installed Cursor CLI, so it is not treated as an active classification gate.

### Current Hook Matrix

The current configuration wires repo guards on `sessionStart` and `sessionEnd`, `post-tool-use.mjs` on `postToolUse`, and `task-dispatch-guard.mjs` alongside `spec-gate-enforce.mjs` on `preToolUse`. Prompt-submit and pre-compact adapters are registered but remain unconfirmed. `mcp-route-guard.mjs` is wired on `beforeMCPExecution`; it recombines Cursor's split `mcp_server_name` and bare `tool_name` fields before forwarding to the shared warn-only guard.

### Shared Configuration Boundary

Cursor CLI and the Cursor desktop editor consume the same `.cursor/hooks.json`. Confirmed adapters fail open on malformed or missing hook input, which limits malformed-payload impact but does not remove the shared configuration blast radius.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.cursor/hooks.json` | Configuration | Current event-to-adapter registration authority, including `beforeMCPExecution`. |
| `.opencode/skills/system-spec-kit/mcp-server/hooks/cursor/session-start.ts` | Handler | Delegates confirmed `sessionStart` delivery to session priming. |
| `.opencode/skills/system-spec-kit/mcp-server/hooks/cursor/session-end.ts` | Handler | Delegates confirmed `sessionEnd` delivery to session stop. |
| `.opencode/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-enforce.mjs` | Script | Enforces Gate-3 policy on confirmed `preToolUse` delivery. |
| `.opencode/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-classify.mjs` | Script | Registered advisory classifier whose `beforeSubmitPrompt` delivery remains unconfirmed. |
| `.opencode/skills/system-spec-kit/mcp-server/hooks/cursor/post-tool-use.mjs` | Script | Runs post-edit, code-graph freshness, and dispatch-audit checks on confirmed `postToolUse` delivery. |
| `.opencode/skills/system-spec-kit/mcp-server/hooks/cursor/task-dispatch-guard.mjs` | Script | Applies the task-dispatch guard on a matched `preToolUse` entry. |
| `.opencode/skills/system-spec-kit/mcp-server/hooks/cursor/user-prompt-submit.ts` | Handler | Registered `beforeSubmitPrompt` proxy with unconfirmed delivery. |
| `.opencode/skills/system-spec-kit/mcp-server/hooks/cursor/precompact.ts` | Handler | Registered `preCompact` proxy with unconfirmed delivery. |
| `.opencode/skills/system-spec-kit/mcp-server/hooks/cursor/mcp-route-guard.mjs` | Script | Wired `beforeMCPExecution` advisory proxy that normalizes Cursor's split MCP payload. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/hooks/confirmed-fires-smoke-test.md` | Manual playbook | Reproduces confirmed session and mutation-gate event delivery. |
| `.opencode/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/hooks/confirmed-non-delivery-documentation.md` | Manual playbook | Records the prompt-classification delivery limitation. |
| `.opencode/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/hooks/task-dispatch-guard-live-fire.md` | Manual playbook | Reproduces the confirmed task-dispatch guard. |
| `.opencode/skills/mcp-code-mode/runtime/lib/mcp-route-guard.test.cjs` | Automated test | Exercises the shared allow/warn guard policy consumed by the Cursor adapter. |

---

## 4. SOURCE METADATA

- Group: Cursor Hooks And Spec-Gate Integration
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `cursor-hooks-and-spec-gate/cursor-hooks-and-spec-gate.md`

Related references:
- [`confirmed-fires-smoke-test.md`](../../cli-cursor/manual-testing-playbook/hooks/confirmed-fires-smoke-test.md) - live smoke test for confirmed session and mutation events.
- [`confirmed-non-delivery-documentation.md`](../../cli-cursor/manual-testing-playbook/hooks/confirmed-non-delivery-documentation.md) - prompt-classification non-delivery coverage.
- [`task-dispatch-guard-live-fire.md`](../../cli-cursor/manual-testing-playbook/hooks/task-dispatch-guard-live-fire.md) - live-fire smoke test for the task-dispatch guard.
