---
title: "Feature Specification: MCP daemon reliability — root-cause recurring disconnects/OOM and design durable fixes"
description: "The mk-spec-memory and mk_code_index MCP daemons repeatedly die/disconnect during sessions (OOM ~1-2GB RSS, no auto-restart, bridge-to-dead-socket on reconnect, rebuild-while-running crashes), forcing constant /mcp reconnects. This packet root-causes the pattern and specifies durable fixes."
trigger_phrases:
  - "mcp daemon reliability spec"
  - "daemon disconnect oom root cause"
  - "mcp auto-respawn watchdog spec"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/007-mcp-daemon-reliability/003-daemon-reliability-research"
    last_updated_at: "2026-05-28T18:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Root-caused recurring daemon failures via parallel fan-out + convergence"
    next_safe_action: "Plan/implement ranked fixes F1-F5 (RSS watchdog + auto-respawn first)"
    blockers: []
    key_files:
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
      - ".opencode/skills/system-spec-kit/shared/embeddings.ts"
      - ".opencode/bin/lib/launcher-ipc-bridge.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000301"
      session_id: "030-spec"
      parent_session_id: null
    completion_pct: 60
    open_questions: []
    answered_questions:
      - "Root causes identified with file:line; fixes ranked in research/research.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: MCP daemon reliability — root-cause recurring disconnects/OOM and design durable fixes

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Research complete (fixes not yet implemented) |
| **Created** | 2026-05-28 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
During sessions the MCP daemons repeatedly die or disconnect, forcing constant `/mcp` reconnects: mk-spec-memory grows to ~1–2 GB RSS and gets OOM-killed, nothing auto-restarts it, reconnects "succeed" into a dead socket, and rebuilding the server crashes the running daemon.

### Purpose
Root-cause the recurring failures and specify durable fixes so the daemons stay healthy and self-recover. Full analysis + ranked fixes: `research/research.md`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root-cause the recurring daemon failures (memory/OOM, supervision, IPC bridge, rebuild fragility, IPC leaks).
- Specify ranked, evidence-backed durable fixes.

### Out of Scope
- Implementing the fixes (follow-on packet/phase; this packet is research + specification).
- The mk_code_index socket-dir `-32000` (already fixed in packet 029).

### Files to Change
| File Path | Change Type | Description |
|-----------|-------------|-------------|
| (none in this packet) | N/A | Research/spec only; fixes land in a follow-on |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Identify the dominant OOM driver with evidence | research/research.md names the native ONNX/ORT memory + undisposed provider swaps with file:line |

### P1 - Required (complete OR user-approved deferral)
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Produce a ranked durable-fix set | research/research.md §3 lists ranked fixes F1-F6 with files + impact/effort |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each recurring failure mode has a root cause with file:line evidence (research/research.md §2).
- **SC-002**: A ranked, sequenced durable-fix plan exists that, if implemented, removes the manual-reconnect loop (F1+F3) and the OOM driver (F1+F2).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Fixes touch the launcher + embedding singleton (critical paths) | Med | Sequence F2→F1→F3; test each; respawn must preserve the single-writer lease |
| Dependency | Implementation is a follow-on packet | Low | This packet hands off research/research.md as the plan source |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking. Implementation sequencing is recommended in research/research.md §3.
<!-- /ANCHOR:questions -->
