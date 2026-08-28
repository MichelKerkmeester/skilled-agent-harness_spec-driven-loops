---
title: "Implementation Summary"
description: "The code_mode server now launches through a shim that resolves an ABI-compatible interpreter, refuses loudly when none exists, and stays visible to every orphan sweeper."
trigger_phrases:
  - "code mode launcher summary"
  - "launcher shim shipped"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/016-code-mode-node-resolution/002-launcher-shim"
    last_updated_at: "2026-08-28T17:37:21Z"
    last_updated_by: "session"
    recent_action: "Shipped the launcher and proved protocol equivalence plus process identity"
    next_safe_action: "Execute 003-host-config-cutover, the first phase with live effect"
    blockers: []
    key_files:
      - ".opencode/bin/mcp-code-mode-launcher.cjs"
      - ".opencode/bin/mcp-code-mode-launcher.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Phase** | 2 of 4 |
| **Status** | Complete |
| **Completed** | 2026-08-28 |
| **Branch** | `skilled/v4.0.0.0` |
| **Executor** | gpt-5.6-luna, xhigh reasoning, fast tier, via the runtime's single-shot codex adapter |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

An executable that stands between a host and the MCP server, makes one decision, and gets out of the way.

It asks the resolver for an interpreter satisfying the server manifest. With an answer it spawns that interpreter against the server entrypoint with stdio inherited, so the protocol stream is untouched, then forwards termination signals and returns the server's own exit status. Without an answer it writes the required range and the resolution reason to stderr and exits non-zero, having started nothing.

Runtime dependencies are injectable, which is what lets the refusal path and the signal path be tested without a live server.

### Files Changed

| File | Change |
|------|--------|
| `.opencode/bin/mcp-code-mode-launcher.cjs` | Created - resolve, hand off, forward signals and exit status |
| `.opencode/bin/mcp-code-mode-launcher.test.cjs` | Created - four tests over handoff, identity, refusal and exit status |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Dispatched to the same external executor as the previous phase, with the code-agent persona inlined, the spec folder marked pre-approved, and the sweeper matcher locations named in the prompt so the identity constraint was a stated requirement rather than something to rediscover.

The dispatch was told not to run the workspace gate itself. The previous phase's executor had done so from inside its own live process and produced 36 phantom failures in the tests that inspect running process trees.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Hand off rather than supervise.** The two sibling MCP launchers stay resident to manage daemons and leases; this server needs neither, and an extra resident layer would have complicated signal and exit-status delivery for no gain.
- **Spawn with the entrypoint as an argument.** Nine cleanup and sweeper scripts across five runtimes identify this server by the entrypoint substring in a process command line. Spawning that path keeps every one of them working with no edit.
- **Refuse before spawning, never after.** The failure this packet exists to prevent is uncatchable, so the check has to happen while refusing is still possible.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test` on the new suite | 4 pass, 0 fail |
| Workspace node gate | 75 files, 762 pass, 0 fail |
| `node --check` on the launcher | Clean |
| Protocol equivalence | Launcher handshake returns the same initialize result as the direct launch |
| Process identity | The launcher's own child runs `/v24.9.0/bin/node …/mcp-code-mode/mcp-server/dist/index.js`, containing the sweeper substring |
| Interpreter chosen | The pinned v24.9.0, selected from the manifest rather than hardcoded |
| Blast-radius check | The operator's three long-running servers were unchanged before and after the probes |
| Comment hygiene | No spec paths or artifact ids in either file |

The identity check was run twice. The first attempt matched the first process in the sweeper's own pattern, which was a three-day-old server belonging to the operator rather than anything this phase started; it proved nothing about the launcher. The second attempt held stdin open so the launched server survived, then read the command line of the launcher's own child by parent id.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- The launcher resolves at start and does not re-check. An interpreter removed while a server is running is not noticed until the next launch.
- Signal forwarding covers the four signals a host is likely to send. A signal outside that set reaches the launcher but is not relayed.
- No host configuration points at the launcher yet, so nothing in the running system uses it until the next phase.
<!-- /ANCHOR:limitations -->

---
