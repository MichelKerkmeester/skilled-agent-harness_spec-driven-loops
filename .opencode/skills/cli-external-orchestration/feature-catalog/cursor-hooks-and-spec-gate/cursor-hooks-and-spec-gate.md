---
title: "Cursor CLI Hooks And Spec-Gate Integration"
description: "Current-state reference for cli-cursor's shared Cursor hook surface and Gate-3 adapters, including confirmed, registered-but-unconfirmed, and advisory paths."
trigger_phrases:
  - "Cursor CLI Hooks And Spec-Gate Integration"
  - "cli-cursor hook adapters"
  - "Cursor preToolUse spec gate"
  - "Cursor hooks.json shared configuration"
version: 1.5.0.0
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

`spec-gate-prebind.mjs` runs on confirmed `sessionStart` delivery. It satisfies a filesystem-validated `MK_SPEC_FOLDER`, or opens state only when `MK_SPEC_GATE_ENFORCE=1` is explicitly set for an identifiable top-level session. Disabled sessions, dispatched children, malformed input, and missing session identities write no state. `spec-gate-enforce.mjs` consumes that state on `preToolUse`; `spec-gate-classify.mjs` remains registered on the undelivered prompt event for forward compatibility.

### Current Hook Matrix

The current configuration wires startup priming, spec-gate prebinding, and repo guards on `sessionStart`; cleanup on `sessionEnd`; post-tool checks on `postToolUse`; and dispatch plus mutation guards on `preToolUse`. Prompt-submit and pre-compact adapters are registered but remain unconfirmed. `mcp-route-guard.mjs` is wired on `beforeMCPExecution`.

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
| `.opencode/skills/system-spec-kit/mcp-server/hooks/cursor/spec-gate-prebind.mjs` | Script | Initializes validated or explicitly enforced state on confirmed `sessionStart` delivery. |
| `.opencode/skills/system-spec-kit/mcp-server/hooks/cursor/spec-gate-enforce.mjs` | Script | Enforces Gate-3 policy on confirmed `preToolUse` delivery. |
| `.opencode/skills/system-spec-kit/mcp-server/hooks/cursor/spec-gate-classify.mjs` | Script | Registered advisory classifier whose `beforeSubmitPrompt` delivery remains unconfirmed; on emission it records post-emission Gate-3 question delivery (observed receipt, `lifecycleEpoch >= 1`) feeding the default-off `MK_SPEC_GATE_3_DELIVERY_SUPPRESSION` shadow. |
| `.opencode/skills/system-spec-kit/mcp-server/hooks/cursor/post-tool-use.mjs` | Script | Runs post-edit, code-graph freshness, and dispatch-audit checks on confirmed `postToolUse` delivery. |
| `.opencode/hooks/task-dispatch/cursor/task-dispatch-guard.mjs` | Script | Applies the task-dispatch guard on a matched `preToolUse` entry. |
| `.opencode/skills/system-spec-kit/mcp-server/hooks/cursor/user-prompt-submit.ts` | Handler | Registered `beforeSubmitPrompt` proxy with unconfirmed delivery. Directive delivery is lifecycle-deduped via the shared compiled shim (full on first message + lifecycle boundaries, route-only on repeats; `SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP=0` restores always-full). |
| `.opencode/skills/system-spec-kit/mcp-server/hooks/cursor/precompact.ts` | Handler | Registered `preCompact` proxy with unconfirmed delivery. |
| `.opencode/hooks/mcp-route-guard/cursor/mcp-route-guard.mjs` | Script | Wired `beforeMCPExecution` advisory proxy that normalizes Cursor's split MCP payload. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/hooks/confirmed-fires-smoke-test.md` | Manual playbook | Reproduces confirmed session and mutation-gate event delivery. |
| `.opencode/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/hooks/confirmed-non-delivery-documentation.md` | Manual playbook | Records the prompt-classification delivery limitation. |
| `.opencode/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/hooks/task-dispatch-guard-live-fire.md` | Manual playbook | Reproduces the confirmed task-dispatch guard. |
| `.opencode/hooks/mcp-route-guard/lib/mcp-route-guard.test.cjs` | Automated test | Exercises the shared allow/warn guard policy consumed by the Cursor adapter. |
| `.opencode/skills/system-spec-kit/mcp-server/hooks/cursor/spec-gate-prebind.test.mjs` | Automated test | Exercises startup identity, environment, binding, terminal-state, and enforce-consumer behavior. |

---

## 4. SOURCE METADATA

- Group: Cursor Hooks And Spec-Gate Integration
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `cursor-hooks-and-spec-gate/cursor-hooks-and-spec-gate.md`

Related references:
- [`confirmed-fires-smoke-test.md`](../../cli-cursor/manual-testing-playbook/hooks/confirmed-fires-smoke-test.md) - live smoke test for confirmed session and mutation events.
- [`confirmed-non-delivery-documentation.md`](../../cli-cursor/manual-testing-playbook/hooks/confirmed-non-delivery-documentation.md) - prompt-classification non-delivery coverage.
- [`task-dispatch-guard-live-fire.md`](../../cli-cursor/manual-testing-playbook/hooks/task-dispatch-guard-live-fire.md) - live-fire smoke test for the task-dispatch guard.
