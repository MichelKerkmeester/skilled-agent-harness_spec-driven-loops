---
title: "Implementation Plan: Phase 2 — register leaves + wire pointers + fix smart-routing"
description: "Regenerate the leaf manifest so the six new catalogs are advisor-routable, and expand the stale 3-mode surface router to cover all six modes plus a model-selection intent."
trigger_phrases:
  - "register cli reference leaves plan"
  - "leaf manifest regeneration plan"
  - "smart-routing three to six modes plan"
  - "cli catalog wiring approach"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/033-per-mode-provider-model-reference/002-register-and-wire"
    last_updated_at: "2026-07-29T09:18:38Z"
    last_updated_by: "implementer"
    recent_action: "Regenerated leaf-manifest and expanded smart-routing to six modes"
    next_safe_action: "Trim duplicated enumerations (phase 003)"
    blockers: []
    key_files:
      - "leaf-manifest.json"
      - "shared/references/smart-routing.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-033-002"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2 — register leaves + wire pointers + fix smart-routing

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON manifest + Markdown surface router |
| **Framework** | `generate-leaf-manifest.cjs` generator; advisor leaf registration |
| **Storage** | `leaf-manifest.json`, `shared/references/smart-routing.md` |
| **Testing** | `generate-leaf-manifest.cjs --check`; `parent-skill-check.cjs`; on-disk path resolution |

### Overview
Make the six phase-1 catalogs both advisor-routable and reader-discoverable. The leaf manifest is regenerated through the canonical generator (never hand-edited) so each mode's `references/providers-and-models.md` registers as a leaf, and the hub surface router — which had silently covered only three of six modes — is expanded to all six plus a model-selection intent.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Generated-manifest registration + surface-router expansion. The manifest is a build artifact regenerated from disk; the router is a hand-maintained INTENT_SIGNALS/RESOURCE_MAP doc.

### Key Components
- **`leaf-manifest.json`**: canonical advisor leaf index, regenerated to include six new catalog leaves.
- **`shared/references/smart-routing.md`**: hub surface router — INTENT_SIGNALS + RESOURCE_MAP grown 3→6 modes, model-selection intent added, version bumped.

### Data Flow
Disk `references/providers-and-models.md` → generator → `leaf-manifest.json`; a provider/model-named prompt → smart-routing INTENT_SIGNALS → RESOURCE_MAP path → the mode's catalog leaf.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase repairs a stale router (a real doc defect: only 3 of 6 modes enumerated), so the affected-surface inventory applies.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `leaf-manifest.json` | Advisor leaf index (generated) | regenerate via `--write` | `--check` reports fresh, six new leaves |
| `shared/references/smart-routing.md` | Hub surface router | update 3→6 modes + model intent + version bump | INTENT_SIGNALS has 6 modes; RESOURCE_MAP paths resolve + manifest-registered |
| Compiled-routing / benchmark contracts | Consume first-slice leaf sets | unchanged (catalog kept on-demand, not first-slice) | two leaves per mode preserved |
| Advisor-routing JSON model tokens | Functional routing signal | unchanged | not edited this phase |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm phase 1 complete (six files exist on disk)
- [x] Locate the `generate-leaf-manifest.cjs` generator and current `smart-routing.md` state

### Phase 2: Core Implementation
- [x] Regenerate `leaf-manifest.json` via `generate-leaf-manifest.cjs --write` (six new leaves)
- [x] Expand `smart-routing.md` INTENT_SIGNALS + RESOURCE_MAP from 3 to 6 modes; add a model-selection intent; fix the 3-mode prose
- [x] Keep the catalog an on-demand deeper reference (not first-slice) so router-replay/benchmark contracts stay stable; bump version 1.0.0.1 → 1.0.0.2

### Phase 3: Verification
- [x] `generate-leaf-manifest.cjs --check` — fresh, six new leaves present
- [x] All RESOURCE_MAP paths resolve on disk and are manifest-registered (18/18)
- [x] `parent-skill-check.cjs` router invariants pass
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Freshness | Manifest matches a clean regeneration | `generate-leaf-manifest.cjs --check` |
| Integration | RESOURCE_MAP paths resolve + registered | on-disk + manifest cross-check |
| Invariant | Hub router structure | `parent-skill-check.cjs` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 1 catalogs on disk | Internal | Green | Nothing to register |
| `generate-leaf-manifest.cjs` | Internal | Green | Cannot regenerate manifest |
| `parent-skill-check.cjs` | Internal | Green | Cannot verify router invariants |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Manifest freshness or router invariants fail, or the catalog is promoted to first-slice by mistake (perturbing benchmark contracts).
- **Procedure**: Revert `leaf-manifest.json` and `smart-routing.md` to their pre-phase state via `git checkout`, then re-run `generate-leaf-manifest.cjs --check` to confirm the baseline is restored.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
