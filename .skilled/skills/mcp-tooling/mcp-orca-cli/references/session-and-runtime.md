---
title: Orca Session and Runtime Boundaries
description: "Executable resolution, runtime readiness, handoff and terminal-receipt boundaries for Orca sessions."
trigger_phrases:
  - "orca runtime"
  - "orca full handoff"
  - "orca terminal receipt"
  - "orca cli only backend"
importance_tier: important
contextType: implementation
version: 0.1.0.0
---

# Orca Session and Runtime Boundaries

Session contract for one Orca executable, one runtime and one handoff path. Selection, recovery and receipt rules here outrank convenience retries.

---

## 1. OVERVIEW

### Purpose

This reference fixes the session-level decisions that the command reference leaves open: which executable to use, when a runtime must exist, what proves a handoff completed and what a terminal receipt does and does not prove. It also records the negative claim that the packet is CLI-only.

### When to Use

- Resolving the executable for a session and deciding when the selection is terminal.
- Deciding whether a requested operation may run without a connected runtime.
- Distinguishing a full handoff from supervised orchestration.
- Interpreting `input_accepted`, `turn_started`, retry requests and `unverifiable` terminal receipts.
- Answering whether this packet registers an Orca MCP backend.

### Core Principle

An execution error is terminal for the selected executable. Do not silently retry another executable because that can change the runtime, account, worktree or permission context.

---

## 2. EXECUTABLE SELECTION

Use one selected executable for the session:

1. `ORCA_CLI_COMMAND` when present.
2. `orca-dev` in a development checkout with `ORCA_DEV_REPO_ROOT`.
3. `orca-ide` on Linux outside an Orca-managed terminal.
4. `orca` otherwise.

Capture the resolved path and version. An execution error is terminal for that selection. Do not silently retry another executable because that can change the runtime, account, worktree or permission context.

---

## 3. LOCAL SCHEMA READS

`orca agent-context --json` reads the version-matched command registry locally and works without a running Orca app. It is the safe headless and SSH preflight. `orca skills get orca-cli` reads the bundled guide locally. These reads do not prove that a runtime operation is available.

---

## 4. RUNTIME STATE

Commands that inspect or change worktrees, terminals, agents, browser tabs, automations or publishing state may require a running connected runtime. If the runtime is stopped, use only the documented read-only recovery path when the user authorized it. Do not start or authenticate a runtime as a hidden side effect of another request.

---

## 5. FULL HANDOFF VERSUS ORCHESTRATION

A full handoff transfers ownership to another agent or worktree and stops the original agent. Completion proof is the new worktree id, the receiving handle and a prompt receipt with `accepted: true`. Do not wait for the receiving agent to finish.

Supervised orchestration is a different workflow. It may use task DAGs, dispatches, inboxes, replies or coordinator loops. Do not use those commands to implement a full handoff unless the user explicitly requested supervision.

---

## 6. TERMINAL RECEIPTS

Terminal input has more than one state:

- `input_accepted` means the request was accepted by the transport.
- `turn_started` means the receiving agent turn has begun.
- A timeout from `--wait-submit` is not permission to resend.
- An ambiguous transport failure must be replayed with the exact command and the reported retry request.
- A bulk close is `unverifiable` when the host cannot confirm every PTY stopped.

Preserve the receipt and warnings in evidence. Do not turn an unproven state into a success claim.

---

## 7. NO NATIVE MCP CLAIM

The local 1.4.205 command registry had no Orca-native MCP command. The official documentation's separate MCP integration context is not a discovered CLI callable, server name, transport or schema. The current packet is therefore `cli-only`. If a future version exposes a verified MCP surface, update the registry and packet from that evidence rather than adding a speculative manual.

---

## 8. RELATED RESOURCES

| Document | Relationship |
|---|---|
| [`../SKILL.md`](../SKILL.md) | Runtime contract and routing boundary for this packet |
| [`orca-cli-reference.md`](./orca-cli-reference.md) | The commands whose selection and receipt rules this file constrains |
| [`mutation-and-browser-boundaries.md`](./mutation-and-browser-boundaries.md) | Authorization gates for the state-changing lanes above |
| [`troubleshooting.md`](./troubleshooting.md) | Recovery rows for selection and receipt failures |
