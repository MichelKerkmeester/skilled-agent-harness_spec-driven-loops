---
title: "Feature Specification: Phase 7: compiled-routing-withdrawal"
description: "Withdraw sk-prompt from the compiled-routing serving closure and live-activation fence, and restore every remaining hub to fresh."
trigger_phrases:
  - "008 phase 007"
  - "sk-prompt compiled-routing-withdrawal"
  - "compiled-routing-withdrawal"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 7: compiled-routing-withdrawal

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-28 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 8 |
| **Predecessor** | 006-standalone-conversion |
| **Successor** | 008-docs-and-final-gate |
| **Handoff Criteria** | The guard reports all five hubs fresh and exits 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the sk-prompt standalone conversion.

**Scope Boundary**: The compiled-routing engine itself, which is unchanged

**Dependencies**:
- The refresh and mint verbs are provided by the compiled-route manifest tool; the authored tree location was taken from an earlier commit that fixed the same drift class.

**Deliverables**:
- Remove sk-prompt from the serving closure's hub list and file set
- Delete its rollout bundle and activation fence from the runtime tree
- Delete the same artifacts from the authored source tree

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Compiled routing serves six parent hubs from a promoted closure with a per-hub activation fence. A root that no longer declares a mode registry cannot compile, so it reports as broken rather than absent, and the guard that blocks merges cannot distinguish 'deliberately retired' from 'silently drifted'.

### Purpose
Compiled routing knows about five hubs, sk-prompt is absent rather than broken, and the guard reports every remaining hub fresh from both its runtime and its authored source.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Remove sk-prompt from the serving closure's hub list and file set
- Delete its rollout bundle and activation fence from the runtime tree
- Delete the same artifacts from the authored source tree
- Remove the hardcoded hub entries from the guard, the sync tool and the runtime engine
- Re-mint the hubs whose routing inputs this program legitimately edited

### Out of Scope
- The compiled-routing engine itself, which is unchanged
- The five surviving hubs' policies, which are re-minted but not redesigned

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `serving-closure.manifest.json` | Modify | Hub list 6 to 5; file set 55 to 48 |
| `009-parent-hub-rollout/005-sk-prompt/**` | Delete | Runtime rollout bundle |
| `013-live-activation/activation/sk-prompt/**` | Delete | Runtime activation fence |
| `compiled-route-guard.cjs`, `compiled-route-sync.cjs` | Modify | Remove the hardcoded hub entry |
| `014-runtime-engine/lib/{resolve,compiled-route}.cjs` | Modify | Remove the hub entry and its bundle mapping |
| `.../015-router-unification-program/**` | Delete | The same artifacts in the authored source tree |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Compiled routing no longer references the retired hub | A search across the runtime and the closure manifest returns nothing |
| REQ-002 | Every remaining hub reports fresh | `compiled-route-guard.cjs` exits 0 with no hub named |
| REQ-003 | The runtime matches its authored source | The guard's drift comparison passes for every hub |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The closure file count matches its file list | `fileCount` equals the length of `files` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The guard reports all five hubs fresh and exits 0
- **SC-002**: Withdrawal is total - no runtime list, closure entry or authored artifact still names the hub
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A refresh writes the runtime copy but not the authored one | The hub flips from stale to drifted and a rebuild would silently revert it | Followed the established pattern: refresh the runtime, then carry the resulting hash into the authored manifest so a rebuild is a no-op |
| Risk | Editing a hub's routing inputs silently drops it to legacy routing | No error and no log; found only by accident | This is exactly what the freshness guard blocks, and it was run after every change until clean |
| Dependency | Two hubs had their routing inputs edited by earlier phases | They report stale through no fault of this phase | Re-minted both as part of the withdrawal rather than leaving the guard red |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None; the phase closed against its recorded acceptance checks.
<!-- /ANCHOR:questions -->
