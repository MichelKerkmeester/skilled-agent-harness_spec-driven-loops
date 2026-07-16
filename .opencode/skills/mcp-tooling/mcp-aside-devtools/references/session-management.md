---
title: Aside Session Management
description: Three-layer session model (task continuation, REPL persistence, browser-profile binding), daemon lifecycle, permission modes, and concurrency posture for Aside.
trigger_phrases:
  - "aside session model"
  - "aside profile binding"
  - "aside daemon lifecycle"
  - "aside permission modes"
  - "aside concurrency"
importance_tier: normal
contextType: reference
version: 1.0.0.0
---

# Aside Session Management

The state model behind every Aside operation: which layer holds the state, how long it lives, which permissions gate it, and what is safe to run in parallel.

---

## 1. THREE-LAYER SESSION MODEL

| Layer | Carrier | Lifetime | Notes |
|---|---|---|---|
| Agent-task continuation | `--session <id>` on `aside` / `aside exec` | Account-scoped, persists across CLI invocations | Transcripts live in the task folder; generated files persist; tasks can pause for input/approval/notification and resume |
| REPL persistence | `aside repl` / the MCP `repl` tool | While the owning process is alive | Persistent JavaScript context (variables survive between evaluations in one process) |
| Browser-profile binding | Aside browser task/profile | Bound per task | Browser operations require a binding; a fresh `aside mcp` process is transport-healthy but browser-unbound |

Do not mix the layers: `--session` continues an agent task; it does not select an MCP browser target. The MCP surface exposes no session selector.

**UNKNOWN**: where and how `--session` state is persisted (storage backend) is not publicly documented.

---

## 2. TASK MODES AND PERMISSIONS

- Task modes: `Default` (normal browser profile) or `Incognito`.
- Permission modes: **Read only / Guard (default for new tasks) / Full access**. Full access never exposes saved password values to the agent.
- Layered rules: agent-level plus session-level overrides with values `Allow` / `Ask` / `Deny`; Deny takes precedence. Permission areas cover sandbox, readable/writable file roots, reads/writes outside roots, and tool/browser/network rules.
- Password boundary: Aside can sign in via password-manager autofill, but saved password values stay hidden from the agent; Aside checks password-access policy and the target URL before building an autofill payload. MFA, passkeys, CAPTCHA, and vault unlock remain human-only boundaries.

**UNKNOWN**: which permission/task mode `aside mcp` inherits, and whether MCP activity is auditable in the Aside UI, is not published. Apply caller-owned read/action/sensitive policy on top.

Data egress: selected prompts, tool results, snapshots, screenshots, and files may reach hosted model providers — "local-first" is not "never leaves device". Redact sensitive material from default logs.

---

## 3. UNATTENDED USE

"Unattended" is best-effort after a signed-in profile and permission policy are prepared, never a guarantee. MFA, CAPTCHA, identity verification, vault unlock, and approvals can pause a task and require the user to resume. Design workflows for **resumable waiting**, not bypasses: detect the pause, report what the task is waiting on, and hand control to the operator.

---

## 4. DAEMON AND PROCESS LIFECYCLE

The MCP child fronts a separate local daemon-backed service (idle-survival and daemon-outage fixes appear in the vendor changelog; connection failures preserve stderr and timeout details). A wrapper must distinguish:
- a **dead stdio child** (process exited; respawn is reasonable), from
- an **unavailable/incompatible Aside daemon or browser** (respawning the child will not help; escalate).

The public CLI exposes no `daemon`, `status`, or `stop` command and no MCP session-selection command. Rely only on the supported stdio process lifecycle: spawn `aside mcp`, speak JSON-RPC over stdio, and close the process for cleanup.

Observed idle telemetry on `1.26.626.1517`: `discoveryIdleTimeoutMs: 300000` (5 min), `replIdleTimeoutMs: 1800000` (30 min). These are diagnostic observations; their stability across releases is UNKNOWN.

---

## 5. CONCURRENCY POSTURE

There is no public guarantee for concurrent mutating MCP clients on one profile. Aside routines avoid overlap, and Aside has no documented equivalent of Chrome DevTools' `--isolated=true`.

Default posture:
- **Single-writer lock keyed by account/profile.**
- Enable read-only concurrency only after a controlled multi-client test proves isolation.
- Do not register parallel UTCP manuals (`aside_1`/`aside_2`) — the strategy is an unresolved open question pending that isolation test.

---

## 6. REFERENCES AND RELATED RESOURCES

- [aside-cli-reference.md](./aside-cli-reference.md) — command surface for tasks, REPL, and accounts.
- [mcp-wiring.md](./mcp-wiring.md) — transport, handshake, binding error, registration posture.
- [troubleshooting.md](./troubleshooting.md) — recovery flows for daemon, binding, and sign-out states.
- Primary sources: https://docs.aside.com/help/tasks, https://docs.aside.com/help/security, https://docs.aside.com/help/automation, https://docs.aside.com/changelog/components.md.
