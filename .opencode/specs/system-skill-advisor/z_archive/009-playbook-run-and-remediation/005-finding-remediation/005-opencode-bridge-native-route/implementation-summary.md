---
title: "Implementation Summary: OpenCode Bridge Native Route (F4) — Partial"
description: "Shipped the bridge direct compat import (route:native verified); a daemon-freshness/cold-env residual where the bridge still falls to python remains flagged."
trigger_phrases:
  - "F4 implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/009-playbook-run-and-remediation/005-finding-remediation/005-opencode-bridge-native-route"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "scorer-remediation"
    recent_action: "Shipped bridge direct compat import (route:native); cold-env residual flagged"
    next_safe_action: "Optional follow-up: close the cold-env daemon-freshness residual"
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
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-playbook-run-and-remediation/005-finding-remediation/005-opencode-bridge-native-route |
| **Completed** | Partial (2026-05-27) |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The bridge's `loadNativeAdvisorModules()` now imports `dist/mcp_server/compat/index.js` directly as the primary native path (launcher/MCP subprocess kept only as fallback), and `probeNativeAdvisor` is gated on a reader-usable trustState so a usable-but-degraded daemon still serves a native route. With this, the OpenCode plugin returns `route:"native"` + an `Advisor:` brief instead of the silent python fail-open (verified).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.../mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs` | Modify | Direct compat import; reader-usable trustState gate; launcher fallback |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Shipped in the remediation commit; verified the bridge returns `route:"native"` + brief via the direct compat path. The launcher lease/socket reclaim and the cold-environment daemon-freshness path were not fully closed — see limitations.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Direct compat import as primary | Research reproduced that direct import succeeds while the launcher path fails on a stale lease |
| Gate the probe on reader-usable trustState | A live/stale-but-usable daemon should still serve a native route instead of failing open to python |
| Keep launcher as fallback | Non-colocated callers may still need the subprocess path |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Bridge returns `route:"native"` + brief (warm path) | pass |
| Direct compat import + status succeeds | pass |
| Cold-environment daemon-freshness path | RESIDUAL — can still fall to python; flagged |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Cold-env residual (why this phase is Partial).** In a cold environment where the daemon is not yet reader-usable, the bridge can still return `route:"python"`. The warm/direct-import path is fixed and verified; closing the cold-start daemon-freshness availability gate (and the launcher stale-lease reclaim) is an optional follow-up.
<!-- /ANCHOR:limitations -->
