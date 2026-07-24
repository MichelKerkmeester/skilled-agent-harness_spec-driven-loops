---
title: "Cursor CLI Hooks And Spec-Gate Integration"
description: "Current-state reference for cli-cursor's shared Cursor hook surface and Gate-3 spec-gate adapters, including confirmed, dormant, and explicitly unreviewed paths."
trigger_phrases:
  - "Cursor CLI Hooks And Spec-Gate Integration"
  - "cli-cursor hook adapters"
  - "Cursor preToolUse spec gate"
  - "Cursor hooks.json shared configuration"
version: 1.2.0.0
---

# Cursor CLI Hooks And Spec-Gate Integration (cli-cursor)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

`cli-cursor` uses one hook/spec-gate surface for session lifecycle events and tool-call mutation policy. The confirmed event paths normalize Cursor payloads, delegate session work to existing adapters or the shared spec-gate core, and return Cursor-native permission responses where the event supports them.

Cursor CLI and the Cursor desktop editor read the same `.cursor/hooks.json` configuration. That makes hook registration a shared-surface change: the live event mapping is documented here, while the adapter statuses below distinguish confirmed behavior from the dormant prompt-classification path and the explicitly unreviewed prebind design.

---

## 2. HOW IT WORKS

### Event Surface

Live `cursor-agent -p` dispatches confirm that `sessionStart` fires and is handled by `session-start.ts`, `sessionEnd` fires and is handled by `session-end.ts`, and `preToolUse` fires before Cursor tool calls. The session adapters delegate to the existing session-prime and session-stop implementations. The enforce adapter observes the generic pre-tool event, including `Shell`, `Read`, `Grep`, and `Write` calls.

### Gate-3 Enforcement And Classification

`spec-gate-enforce.mjs` maps Cursor's `Shell` and `Write` tools to the shared mutation policy. Its deny path returns `permission: "deny"` and exits with code 2; live verification confirmed that this blocked the real tool call. `spec-gate-classify.mjs` is an advisory `beforeSubmitPrompt` adapter, but that event never fired across three live dispatches, including a `--continue` turn, so the adapter is documented and permanently dormant under the currently installed Cursor CLI build.

### Shared Configuration Boundary

Cursor CLI and the Cursor desktop editor consume the same `.cursor/hooks.json` file. Registering these adapters therefore affects both consumers, not only dispatched `cursor-agent` sessions. The confirmed adapters fail open on malformed or missing hook input, which limits the effect of malformed payloads but does not remove the shared-configuration blast radius.

### Unreviewed Prebind Design

`.opencode/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-prebind.mjs` was authored by a concurrent session, is uncommitted, and has not yet been reviewed or tested in this catalog work. It is designed to run at `sessionStart`, immediately satisfy the gate for a valid `MK_SPEC_FOLDER`, or open the gate when `MK_SPEC_GATE_ENFORCE=1`, because `beforeSubmitPrompt` never fires; those are design intentions read from the file, not confirmed runtime behavior.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-spec-kit/mcp-server/hooks/cursor/session-start.ts` | Handler | Confirmed fires on `sessionStart` and delegates to the existing session-prime adapter; live-verified. |
| `.opencode/skills/system-spec-kit/mcp-server/hooks/cursor/session-end.ts` | Handler | Confirmed fires on `sessionEnd` and delegates to the existing session-stop adapter; live-verified. |
| `.opencode/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-enforce.mjs` | Script | Confirmed fires on `preToolUse` and is confirmed working: its deny response and exit code 2 blocked a real Cursor tool call. |
| `.opencode/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-classify.mjs` | Script | Dormant and not wired: `beforeSubmitPrompt` was confirmed never to fire across three live dispatches, including `--continue`. |
| `.opencode/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-prebind.mjs` | Script | Authored by a concurrent session, uncommitted, and not yet reviewed or tested in this catalog work; designed to pre-bind or open Gate-3 state at `sessionStart`, with behavior unconfirmed here. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-spec-kit/mcp-server/hooks/cursor/session-start.ts` | Reference | Status anchor: confirmed-firing `sessionStart` adapter, live-verified. |
| `.opencode/skills/system-spec-kit/mcp-server/hooks/cursor/session-end.ts` | Reference | Status anchor: confirmed-firing `sessionEnd` adapter, live-verified. |
| `.opencode/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-enforce.mjs` | Reference | Status anchor: confirmed-firing and confirmed-working `preToolUse` deny path. |
| `.opencode/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-classify.mjs` | Reference | Status anchor: dormant `beforeSubmitPrompt` adapter because the event was confirmed never to fire. |
| `.opencode/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-prebind.mjs` | Reference | Status anchor: authored by a concurrent session, uncommitted, and not yet reviewed or tested in this catalog work; its intended `sessionStart` prebind behavior is unconfirmed. |
| `.opencode/skills/system-spec-kit/mcp-server/hooks/cursor/README.md` | Reference | Live event-delivery table, shared `.cursor/hooks.json` boundary, and confirmed non-delivery documentation. |
| `.opencode/skills/system-spec-kit/runtime/hooks/cursor/README.md` | Reference | Gate-3 enforce/classify status and the generic `preToolUse` rationale. |
| `.opencode/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/hooks/confirmed-fires-smoke-test.md` | Manual playbook | Reproduction anchor for confirmed `sessionStart`, `preToolUse`, and `sessionEnd` delivery. |
| `.opencode/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/hooks/confirmed-non-delivery-documentation.md` | Manual playbook | Reproduction anchor for dormant `beforeSubmitPrompt` and `stop` non-delivery. |

---

## 4. SOURCE METADATA

- Group: Cursor Hooks And Spec-Gate Integration
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `cursor-hooks-and-spec-gate/cursor-hooks-and-spec-gate.md`

Related references:
- [`confirmed-fires-smoke-test.md`](../../cli-cursor/manual-testing-playbook/hooks/confirmed-fires-smoke-test.md) — live smoke test for the three confirmed-firing events.
- [`confirmed-non-delivery-documentation.md`](../../cli-cursor/manual-testing-playbook/hooks/confirmed-non-delivery-documentation.md) — dormant classify-hook and non-delivery coverage.
- [`README.md`](../../../system-spec-kit/mcp-server/hooks/cursor/README.md) — Cursor lifecycle adapter event map and shared configuration boundary.
- [`README.md`](../../../system-spec-kit/runtime/hooks/cursor/README.md) — Cursor spec-gate adapter statuses and event rationale.
