---
title: "Implementation Plan: OpenCode Bridge Native Route Fix (F4)"
description: "Direct compat import in the bridge (launcher fallback) + launcher lease/socket reclaim; verify CL-005 returns route:native."
trigger_phrases:
  - "F4 plan bridge native"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/009-playbook-run-and-remediation/005-finding-remediation/005-opencode-bridge-native-route"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "scorer-remediation"
    recent_action: "Shipped bridge direct compat import; cold-env residual flagged"
    next_safe_action: "Optional: close the cold-env daemon-freshness residual"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-005-005"
      parent_session_id: null
    completion_pct: 85
    open_questions: []
    answered_questions: []
---
# Implementation Plan: OpenCode Bridge Native Route Fix (F4)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ESM (bridge) + CJS (launcher) |
| **Framework** | system-skill-advisor plugin bridge + launcher IPC |
| **Storage** | daemon-ipc.sock + lease file |
| **Testing** | CL-005 bridge smoke + forceNative probe |

### Overview
Two coordinated fixes: (1) the bridge imports the compat module directly and uses its helpers as the primary native path, keeping the launcher/MCP subprocess as a fallback; (2) the launcher treats a held lease without a live socket as stale/reclaimable and stops writing the `(no-bridge-socket)` line to MCP stdout.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Root cause reproduced (research §3 F4): direct compat import succeeds; launcher path emits no-bridge-socket
- [x] Target files + helper names identified

### Definition of Done
- [ ] CL-005 returns route:native + Advisor brief
- [ ] Genuine-down case fails open with accurate diagnostic
- [ ] No `(no-bridge-socket)` line on MCP stdout
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Primary path = in-process compat import; fallback = launcher/MCP subprocess.

### Key Components
- **mk-skill-advisor-bridge.mjs**: `loadNativeAdvisorModules()`
- **compat/index.js**: `probeAdvisorDaemon`, `readAdvisorStatus`, `handleAdvisorRecommend`, `buildSkillAdvisorBrief`
- **launcher + launcher-ipc-bridge.cjs**: lease/socket lifecycle

### Data Flow
Bridge → import compat → probe/status/recommend → brief. Only if the import fails: spawn launcher MCP child. Launcher: held lease + no socket → reclaim, do not poison stdout.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `mk-skill-advisor-bridge.mjs` loadNativeAdvisorModules | spawns launcher MCP child | import compat first; launcher fallback | CL-005 route:native |
| `mk-skill-advisor-launcher.cjs` / `launcher-ipc-bridge.cjs` | lease/socket | reclaim stale lease w/o socket; no stdout poison | launcher run clean |
| `.opencode/plugins/mk-skill-advisor.js` | plugin host | unchanged (consumer) | smoke via OpenCode |

Inventory: confirm compat exports the four helpers the bridge needs; grep other launcher callers before changing lease semantics.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm compat/index.js exports probeAdvisorDaemon/readAdvisorStatus/handleAdvisorRecommend/buildSkillAdvisorBrief
- [ ] Trace the launcher lease/socket guard that emits `(no-bridge-socket)`

### Phase 2: Core Implementation
- [ ] Rewrite `loadNativeAdvisorModules()` to import compat directly; keep launcher as fallback
- [ ] Fix launcher: held lease without daemon-ipc.sock → stale/reclaimable; never write the no-bridge-socket line to MCP stdout
- [ ] Replace the blanket fail-open catch with an accurate diagnostic

### Phase 3: Verification
- [ ] Re-run CL-005 bridge smoke → route:native + Advisor brief
- [ ] forceNative:true succeeds when daemon live; genuine-down fails open with real reason
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Smoke | bridge native route | CL-005 invocation |
| Probe | forceNative path | bridge forceNative:true |
| Plugin | OpenCode plugin status | spec_kit_skill_advisor_status (when available) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| compat/index.js helpers | Internal | Green | Native path source |
| launcher lease/socket layout | Internal | Yellow | Lease reclaim must not race a live daemon |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Direct import regresses non-colocated callers, or lease reclaim races a live daemon.
- **Procedure**: Revert the bridge to launcher-first (fallback path preserved); revert lease-reclaim change independently.
<!-- /ANCHOR:rollback -->
