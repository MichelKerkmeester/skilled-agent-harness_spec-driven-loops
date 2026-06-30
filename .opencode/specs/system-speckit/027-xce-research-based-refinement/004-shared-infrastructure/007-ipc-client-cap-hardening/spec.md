---
title: "Feature Specification: IPC Client Cap Hardening and Silent Bridge Skip"
description: "The shared daemon IPC socket server capped concurrent clients at 8 and refused extras by accept-then-close, so multi-session fan-outs saturated the cap and every fresh probe failed instantly with exit 75; the plugin then wrote its skip banner to raw stderr, which the opencode TUI renders into the input field. Raise the cap to 64 everywhere and silence the banner by default."
trigger_phrases:
  - "ipc client cap hardening"
  - "max secondary clients 64"
  - "bridge skipped banner silenced"
importance_tier: "important"
contextType: "implementation"
status: "completed"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/007-ipc-client-cap-hardening"
    last_updated_at: "2026-06-11T17:40:00Z"
    last_updated_by: "claude-fable"
    recent_action: "Shipped cap raise (sources + 9 config env blocks) + banner suppression"
    next_safe_action: "None; complete. New daemon spawns and new sessions adopt automatically"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/shared/ipc/socket-server.ts"
      - ".opencode/plugins/mk-code-graph.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-11-026-ipc-cap-hardening"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Root cause established empirically by a fresh Fable 5 debug seat (slot-cap refusal, not daemon health)."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: IPC Client Cap Hardening and Silent Bridge Skip

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-11 |
| **Branch** | `028-mcp-to-cli-tool-transition` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-spec-kit/027-xce-research-based-refinement |
| **Predecessor** | 025-code-mode-orphan-lifecycle |
| **Successor** | None |
| **Handoff Criteria** | New sessions show no bridge banner; daemons spawned with the new config accept more clients than any realistic session fleet |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A fresh Fable 5 debug seat root-caused the persistent `[mk-code-graph] Bridge skipped … (exit=75)` banner empirically: the shared daemon IPC socket server caps concurrent clients at 8 (`DEFAULT_MAX_SECONDARY_CLIENTS`) and refuses excess connections by accepting then immediately closing them. Every live session's launcher holds one persistent slot, so a multi-seat fan-out (10+ sessions) saturates the cap and every fresh short-lived connection — the plugin's warm probe, the inner CLI call — dies with EPIPE in about 2ms, mapped to exit 75. Measured directly: with the cap saturated, 10 parallel connections produced 1 reply (3ms) and 9 instant EPIPEs; the daemon itself was healthy throughout. Worse, an at-cap refusal is byte-for-byte indistinguishable from a dead daemon to probes, so a healthy daemon can be falsely reaped by a new launcher. Separately, the plugin wrote its skip diagnostic to raw stderr while the opencode TUI was active, which renders the banner into the user's input field.

### Purpose
Make the client cap exceed any realistic session fleet (64) across all daemons and runtime configs, and make the plugin's bridge-skip path silent by default so a transient skip can never pollute the input field.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Raise `DEFAULT_MAX_SECONDARY_CLIENTS` from 8 to 64 in the canonical shared IPC module and the code-graph local copy (the spec-kit and advisor servers consume the shared module through re-export shims).
- Pin `SPECKIT_MAX_SECONDARY_CLIENTS=64` in all three daemons' env blocks across all three runtime configs (opencode, claude, codex).
- Silence the mk-code-graph plugin's bridge-skip stderr banner by default; `MK_CODE_GRAPH_DEBUG=1` re-enables it; the diagnostic stays inspectable via the plugin's status tool.
- Update the ENV_REFERENCE row for the knob.
- Rebuild local dists (gitignored) so new daemon spawns adopt the new default.

### Out of Scope
- Touching live daemons or sessions (adoption happens on natural respawn).
- The two filed follow-ons: a "busy" reply before closing refused connections so probes can distinguish at-cap from dead, and a configurable bridge warm-probe budget (hardcoded 100ms today).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/shared/ipc/socket-server.ts` | Modify | Default cap 8 to 64 with the durable rationale |
| `.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts` | Modify | Same bump in the local copy |
| `.opencode/plugins/mk-code-graph.js` | Modify | Debug-gated banner emission |
| `opencode.json`, `.claude/mcp.json`, `.codex/config.toml` | Modify | Knob pinned to 64 for all three daemons |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modify | Knob row updated |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)
- **REQ-001**: The effective client cap exceeds any realistic concurrent-session fleet on every daemon, via both the pinned env knob and the compiled default.
- **REQ-002**: No bridge-skip text reaches stderr by default; failures still no-op gracefully.

### P1 - Required (complete OR user-approved deferral)
- **REQ-003**: The diagnostic remains available on demand (status tool field plus the debug env gate).
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Both real module copies and their compiled dists carry 64; the knob appears in all nine env blocks (3 daemons by 3 runtimes).
- Fresh sessions show no banner regardless of bridge outcome (verified against sweep seats' stderr before/after).
- ENV_REFERENCE documents the new default and the reasoning.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Higher cap resource cost**: each slot is one Unix-socket connection; 64 is still trivial for the daemons.
- **Silent skip hides real failures**: mitigated by the status-tool diagnostic and the debug env gate; the skip was always non-fatal (injection no-op only).
- **Adoption timing**: live daemons keep the old cap until their next natural respawn; the pinned env applies on next spawn from any runtime config.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Follow-ons (busy-reply on refusal, probe budget flag) are filed in the implementation summary.
<!-- /ANCHOR:questions -->
