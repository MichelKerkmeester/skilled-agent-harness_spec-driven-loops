---
title: "Implementation Summary: OpenCode Bridge Native Route Fix (F4) — Pending"
description: "Planned, not yet implemented. Specifies the bridge direct-compat-import + launcher lease/socket reclaim so the native advisor route engages."
trigger_phrases:
  - "F4 implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-skill-advisor-playbook-run/005-finding-remediation/005-opencode-bridge-native-route"
    last_updated_at: "2026-05-26T20:40:00Z"
    last_updated_by: "deep-research-remediation"
    recent_action: "Specced F4; pending implementation"
    next_safe_action: "Implement via /speckit:implement"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-005-005"
      parent_session_id: null
    completion_pct: 0
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
| **Spec Folder** | 028-skill-advisor-playbook-run/005-finding-remediation/005-opencode-bridge-native-route |
| **Completed** | Pending |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Not yet implemented. Specified and ready for `/speckit:implement`. When implemented, the bridge's `loadNativeAdvisorModules()` imports `dist/mcp_server/compat/index.js` directly (using its `probeAdvisorDaemon`/`readAdvisorStatus`/`handleAdvisorRecommend`/`buildSkillAdvisorBrief`) as the primary native path, with the launcher/MCP subprocess kept only as a fallback; and the launcher treats a held lease without a live `daemon-ipc.sock` as stale/reclaimable instead of writing `LEASE_HELD_BY... (no-bridge-socket)` to the MCP client's stdout. Result: the OpenCode plugin gets `route:"native"` + an `Advisor:` brief instead of silent python fail-open.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.../mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs` | Modify (planned) | Direct compat import; launcher fallback |
| `.opencode/bin/mk-skill-advisor-launcher.cjs` / `lib/launcher-ipc-bridge.cjs` | Modify (planned) | Reclaim stale lease; stop poisoning MCP stdout |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Pending. Delivery: `/speckit:implement`, then re-run the CL-005 bridge smoke (expect `route:"native"`) and the `forceNative:true` probe.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Direct compat import as primary | Research reproduced that direct import succeeds while the launcher path fails on a stale lease |
| Keep launcher as fallback | Non-colocated callers may still need the subprocess path |
| Surface the real diagnostic | The blanket fail-open hid an actionable lease/socket bug |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| CL-005 returns route:native + Advisor brief | Pending |
| forceNative succeeds when daemon live | Pending |
| No `(no-bridge-socket)` on MCP stdout | Pending |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not yet implemented.** Root cause reproduced in `../research/research.md` §3 F4.
2. **Lease reclaim must not race a live daemon** — reclaim only when socket absent AND lease stale.
<!-- /ANCHOR:limitations -->
