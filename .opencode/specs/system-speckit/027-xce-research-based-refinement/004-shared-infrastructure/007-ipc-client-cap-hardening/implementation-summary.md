---
title: "Implementation Summary: IPC Client Cap Hardening and Silent Bridge Skip"
description: "Shipped the cap raise to 64 (two source modules, both dists, nine config env blocks) and the debug-gated banner suppression, after a fresh Fable 5 seat empirically proved the slot-cap refusal root cause."
trigger_phrases:
  - "ipc cap hardening summary"
  - "max clients 64 shipped"
  - "bridge banner silenced summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/004-shared-infrastructure/007-ipc-client-cap-hardening"
    last_updated_at: "2026-06-11T17:40:00Z"
    last_updated_by: "claude-fable"
    recent_action: "Shipped cap raise + banner suppression; follow-ons filed"
    next_safe_action: "None; complete. Adoption on next daemon spawn / new sessions"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Complete |
| **Level** | 1 |
| **Parent** | `../spec.md` (027 phase parent) |
| **Branch** | `028-mcp-to-cli-tool-transition` |
| **Completed** | 2026-06-11 |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The daemon IPC client cap was raised from 8 to 64 in both real copies of the socket-server module (the canonical `@spec-kit/shared` one consumed by the spec-memory and skill-advisor daemons via re-export shims, and the code-graph local copy), both gitignored dists were rebuilt, and `SPECKIT_MAX_SECONDARY_CLIENTS=64` was pinned in all nine daemon env blocks (3 daemons by 3 runtime configs: opencode.json, .claude/mcp.json, .codex/config.toml). The ENV_REFERENCE row now documents the new default and the reasoning.

The mk-code-graph plugin's bridge-skip diagnostic no longer writes to stderr by default — raw stderr while the opencode TUI is active renders into the user's input field, which is where the persistent banner was coming from. `MK_CODE_GRAPH_DEBUG=1` re-enables the line, and the diagnostic stays inspectable through the plugin's status tool (`last_runtime_error`).

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A fresh Fable 5 xhigh debug seat (no prior assumptions) root-caused the failure empirically: at slot saturation, 10 parallel connections yielded 1 served reply in 3ms and 9 instant EPIPEs; lsof showed the healthy daemon holding listener plus exactly 8 accepted connections; the lease was fresh and the socket path matched on both sides. Every alternative theory (dead daemon, stale lease, path mismatch, machine load) was directly disproven. The orchestrator then applied the config and source changes, rebuilt the dists, and verified the compiled output and config knob counts.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- Defense in depth: pin the env knob in configured environments AND bump the compiled default for unconfigured ones.
- 64 chosen as comfortably above any realistic concurrent-session fleet while still trivial resource-wise (one Unix-socket connection per slot).
- Banner suppressed rather than rerouted: the skip is non-fatal by design, and the sibling plugins are already silent.
- No live process touched: daemons adopt the cap on natural respawn; sessions adopt the silent plugin on start.

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Root cause | PASS: empirical (1 reply + 9 instant EPIPEs at cap; flip with slot occupancy); refusal code path explicit in the socket server |
| Sources + dists | PASS: both modules and both compiled dists carry 64 |
| Config knobs | PASS: 3 occurrences in each of the three runtime configs |
| Banner | PASS: present in pre-fix sweep seats' stderr, absent for sessions started after the gate |
| Spec validation | PASS: strict, 0 errors / 0 warnings |

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- Live daemons keep the old cap until their next natural respawn; the running fleet drains as sessions end.
- Follow-on filed: refused connections should receive a one-line "busy" JSON-RPC error before close, so probes can distinguish an at-cap daemon from a dead one (today they cannot, which can cause a healthy daemon to be falsely reaped under fan-out).
- Follow-on filed: the plugin bridge's warm-probe budget is hardcoded at 100ms and under-provisioned under load; it should accept a probe-budget flag.

<!-- /ANCHOR:limitations -->
