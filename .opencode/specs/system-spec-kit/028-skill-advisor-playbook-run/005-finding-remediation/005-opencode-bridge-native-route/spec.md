---
title: "Feature Specification: OpenCode Bridge Native Route Fix (F4)"
description: "Make the OpenCode plugin bridge use the native advisor via a direct compat import (launcher/MCP only as fallback) and fix the launcher lease/socket staleness that breaks the MCP handshake."
trigger_phrases:
  - "opencode bridge native route fix"
  - "F4 mk-skill-advisor-bridge"
  - "launcher lease no-bridge-socket"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-skill-advisor-playbook-run/005-finding-remediation/005-opencode-bridge-native-route"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "scorer-remediation"
    recent_action: "Shipped bridge direct compat import; cold-env residual flagged"
    next_safe_action: "Optional: close the cold-env daemon-freshness residual"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-005-005"
      parent_session_id: null
    completion_pct: 85
    open_questions: []
    answered_questions: []
---
# Feature Specification: OpenCode Bridge Native Route Fix (F4)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Partial |
| **Created** | 2026-05-26 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`mk-skill-advisor-bridge.mjs` fails open to the python route (`route:"python"`, `SYSTEM_SKILL_ADVISOR_UNAVAILABLE`) even though `dist/mcp_server/compat/index.js` exists. Root cause (reproduced): the bridge does NOT import compat directly — it spawns `bin/mk-skill-advisor-launcher.cjs` as an MCP stdio child and calls `advisor_status`; a stale/unusable launcher lease with a missing IPC socket makes the launcher write `LEASE_HELD_BY... (no-bridge-socket)` to stdout, so `StdioClientTransport` cannot complete the MCP handshake, and a fail-open catch hides the diagnostic. Direct compat import + status succeeds; `forceNative:true` returns `NATIVE_PROBE_FAILED`.

### Purpose
Make the native route engage reliably: import compat directly (launcher only as fallback) and stop the lease/socket staleness from breaking the handshake — so the OpenCode plugin gets native advisor briefs (`route:"native"` + `Advisor:` brief) instead of silent python fail-open.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Change `loadNativeAdvisorModules()` in the bridge to first `import('../dist/mcp_server/compat/index.js')` and use its `probeAdvisorDaemon`/`readAdvisorStatus`/`handleAdvisorRecommend`/`buildSkillAdvisorBrief`; keep the launcher/MCP subprocess as a fallback only.
- Fix the launcher (`.opencode/bin/mk-skill-advisor-launcher.cjs` / `lib/launcher-ipc-bridge.cjs`) so a held lease without `daemon-ipc.sock` is treated as stale/reclaimable rather than emitting `LEASE_HELD_BY... (no-bridge-socket)` to an MCP client's stdout.
- Surface the real diagnostic instead of a blanket fail-open.

### Out of Scope
- Rewriting the launcher/daemon IPC design.
- Changing advisor scoring or the compat API surface.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs` | Modify | Direct compat import; launcher as fallback |
| `.opencode/bin/mk-skill-advisor-launcher.cjs` (or `lib/launcher-ipc-bridge.cjs`) | Modify | Reclaim stale lease w/o socket; don't poison MCP stdout |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Native route engages | Bridge returns `route:"native"` + an `Advisor:` brief for a substantive prompt when the daemon is live |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Fail-open still safe | On genuine unavailability, bridge still fails open prompt-safe but surfaces the real reason (not a hidden lease bug) |
| REQ-003 | Lease staleness handled | A held lease without `daemon-ipc.sock` is reclaimed; no `(no-bridge-socket)` line on MCP stdout |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Re-running CL-005 (bridge smoke) returns `metadata.route:"native"` + an `Advisor:` brief with the 0.8/0.35/false thresholds, not `route:"python"`/`SYSTEM_SKILL_ADVISOR_UNAVAILABLE`.
- **SC-002**: `forceNative:true` succeeds (no `NATIVE_PROBE_FAILED`) when the daemon is reachable; genuine-down case fails open with an accurate diagnostic.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Direct compat import couples bridge to dist layout | Path drift | Use a stable relative URL import; fallback to launcher preserved |
| Risk | Lease reclaim races a live daemon | Double-writer | Reclaim only when socket absent AND lease stale; keep advisory semantics |
| Dependency | compat/index.js exported helpers | Must exist | Verified present in research (direct import succeeds) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the launcher/MCP subprocess path be kept at all, or fully replaced by the direct compat import? (Recommend keep as fallback for non-colocated callers.)
<!-- /ANCHOR:questions -->
