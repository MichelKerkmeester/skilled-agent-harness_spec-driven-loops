---
title: "Implementation Summary"
description: "Compiled routing now serves five hubs instead of six, sk-prompt is absent rather than broken, and the guard reports every remaining hub fresh in both its runtime and its authored copy."
trigger_phrases:
  - "008 phase 007 summary"
  - "compiled-routing-withdrawal results"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-prompt/008-sk-prompt-standalone-conversion/007-compiled-routing-withdrawal"
    last_updated_at: "2026-08-28T12:00:00Z"
    last_updated_by: "claude"
    recent_action: "Phase 7 complete; acceptance checks recorded"
    next_safe_action: "Execute 008-docs-and-final-gate"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "008-007-compiled-routing-withdrawal"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Remove the hub rather than mark it excused"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-compiled-routing-withdrawal |
| **Completed** | 2026-08-28 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Compiled routing now serves five hubs instead of six, sk-prompt is absent rather than broken, and the guard reports every remaining hub fresh in both its runtime and its authored copy.

### Withdrawal had to happen in two trees

Serving reads a promoted runtime closure, but a rebuild restores from an authored source tree under the routing program's spec folder. Removing the hub from only one leaves the other to reinstate it. The same duality applies to a refresh: updating the runtime manifest alone flips a hub from reported-stale to reported-drifted, because the guard compares the pair byte-for-byte.

### Two hubs needed re-minting through no fault of their own

Editing a hub's routing inputs invalidates its compiled policy silently - nothing errors and nothing logs, which is precisely the drift the guard exists to catch. This program edited documentation inside two hubs, so both were re-minted and their new hashes carried into the authored manifests.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `serving-closure.manifest.json` | Modify | Hub list 6 to 5; file set 55 to 48 |
| `009-parent-hub-rollout/005-sk-prompt/**` | Delete | Runtime rollout bundle |
| `013-live-activation/activation/sk-prompt/**` | Delete | Runtime activation fence |
| `compiled-route-guard.cjs`, `compiled-route-sync.cjs` | Modify | Remove the hardcoded hub entry |
| `014-runtime-engine/lib/{resolve,compiled-route}.cjs` | Modify | Remove the hub entry and its bundle mapping |
| `.../015-router-unification-program/**` | Delete | The same artifacts in the authored source tree |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The guard was run first to establish which hubs were affected and why, and its three distinct failure states were used as the working signal throughout: broken inputs for the retired hub, stale manifest for the two edited ones, and authored drift after a runtime-only refresh. Each surface was removed and immediately re-checked, so the final clean run reflects the whole withdrawal rather than the last step of it.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Remove the hub rather than mark it excused | The excusal path exists for a hub mid-restructure that will return. This one is retired, so absence is the honest representation. |
| Re-mint the two edited hubs inside this phase | Leaving the guard red with a known cause would have made it useless as the acceptance signal for everything after it. |
| Carry each refreshed hash into the authored manifest | Without it a rebuild reinstates the old hash and silently undoes the refresh. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Compiled-routing freshness guard | PASS - all five hubs fresh, runtime matches authored source |
| Retired-hub residue across runtime and closure | PASS - no reference in the guard, sync tool, runtime engine or manifest |
| Closure manifest self-consistency | PASS - file count 48 matches the file list length |
| Authored tree | PASS - five hubs in both the activation and rollout directories |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Compiled-routing benchmark reports for the retired hub remain on disk.** They are write-once evidence of runs that happened and are not part of the serving closure.
2. **Prompt-engineering requests now resolve through legacy routing.** That is the intended end state for a standalone skill, which the advisor reaches directly by identity rather than through a hub's two-stage resolution.
<!-- /ANCHOR:limitations -->

---
