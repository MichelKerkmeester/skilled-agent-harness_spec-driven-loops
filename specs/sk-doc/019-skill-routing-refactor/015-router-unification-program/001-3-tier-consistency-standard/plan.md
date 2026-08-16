---
title: "Implementation Plan: Fleet-Wide Routing Consistency (3-tier standard)"
description: "Plan for converging all 49 fleet units onto one routing standard and de-skill-specifying the shared benchmark harness. The shipped slice is the deterministic route-gold gate full-fix that took 6/7 blocked hubs to 7/7 PASS across 91 scenarios; the remaining convergence and fleet-verification requirements are staged behind it."
trigger_phrases:
  - "fleet routing consistency plan"
  - "3-tier routing standard plan"
  - "route-gold gate full-fix plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/015-router-unification-program/001-3-tier-consistency-standard"
    last_updated_at: "2026-07-17T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Route-gold gate full-fix: 7/7 hubs PASS (91 scenarios), pushed to v4"
    next_safe_action: "REQ-001 harness de-skill-specific + REQ-002 convergence, then REQ-006 fleet verification"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    completion_pct: 45
    open_questions:
      - "REQ-006 fleet verification (mutation/blind-holdout/live-mode) not yet run"
    answered_questions:
      - "Route-gold reconciliation ratified as FULL-FIX hub-by-hub, done for all 7 hubs"
---
# Implementation Plan: Fleet-Wide Routing Consistency (3-tier standard)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON routing artifacts + Node/CJS benchmark harness |
| **Framework** | system-skill-advisor + the router-replay benchmark (`router-replay.cjs`) |
| **Storage** | Per-unit `leaf-manifest.json`, `hub-router.json`, `mode-registry.json`, playbook fixtures |
| **Testing** | Deterministic route-gold gate over authored playbook scenarios; strict spec validation |

### Overview

Converge every fleet unit (7 parent hubs, 37 child modes, 5 normal standalone skills) onto one routing standard, de-skill-specify the shared benchmark harness so all tiers score identically, then verify the whole fleet once it is consistent. The first delivered slice is the deterministic route-gold gate: it asserts each hub's router selects exactly the intended mode set and surfaces exactly the intended leaf set. That slice is shipped; the harness de-skill-specifying, full convergence, and teeth-proving fleet verification are staged behind it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Standard ratified (universal base + minimal per-tier delta)
- [x] Route-gold gate semantics defined (exact mode set + exact leaf set)
- [x] Anti-circularity rule stated (derive the answer from scenario prose, fix the router, then set gold)

### Definition of Done
- [x] Route-gold slice: 7/7 hubs PASS across 91 scenarios on a clean committed tree
- [ ] REQ-001 shared harness de-skill-specified (classifier + gold-derivation)
- [ ] REQ-002 every unit converged to one router shape + frontmatter typed gold
- [ ] REQ-006 fleet verification with teeth (mutation + blind holdout + live-mode)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Layered routing config with a shared, deterministic replay benchmark. Each unit exposes an in-document router; parents additionally aggregate children through hub JSONs; a single harness scores all tiers.

### Key Components

- **Universal base**: one canonical in-document router + a frontmatter typed-gold `manual_testing_playbook` on every unit.
- **Parent hub delta**: `hub-router.json` + `mode-registry.json` + one hub-level `leaf-manifest.json` rollup + one hub-level surface router.
- **Child mode delta**: a `mode-registry.json` entry in its parent; leaves roll up into the parent manifest.
- **Normal standalone delta**: a registry-less `leaf-manifest.config.json` + inline router.
- **Shared harness**: the router-replay benchmark and its scorer, which must treat every tier identically.

### Data Flow

Playbook scenario (prose + frontmatter gold) -> router-replay -> observed modes/leaves -> route-gold assertion (exact-set for frontmatter hubs, subset+forbidden for the sk-code index-table shape) -> PASS/FAIL + aggregate score.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Route-gold proof-of-recipe (DONE)
- [x] Fix sk-prompt directly to establish the exact fix + verification loop
- [x] Encode the gate semantics and the anti-circularity rule into an airtight agent brief
- [x] Validate the brief on mcp-tooling as a single dispatch before fanning out

### Phase 2: Route-gold fleet fan-out (DONE)
- [x] Dispatch the remaining 5 hubs to GPT-5.6-SOL xhigh/fast agents on disjoint trees
- [x] Remove the generic catch-all vocabulary class from specialized modes (the dominant over-emission fix)
- [x] Reconcile stale gold and correct frontmatter intent to the scenario's own prose

### Phase 3: Independent verification + convergence staging (PARTIAL)
- [x] Re-run the route-gold gate per hub, scope-check every diff, confirm manifests byte-stable
- [ ] REQ-001 de-skill-specify the shared harness so tiers score identically
- [ ] REQ-002/REQ-006 full convergence and fleet verification with teeth
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Route-gold (deterministic) | Exact mode set + exact leaf set per scenario | router-replay benchmark |
| Scope + honesty re-verify | Own-hub-only diff, byte-stable manifest, real leaf paths | `git diff`, manifest regen |
| Fleet verification (staged) | Mutation, blind holdout, live-mode with precision | REQ-006 package |
| Spec validation | Packet doc conformance | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Typed-pair recipe proven on 5 skills | Internal | Green (shipped on v4) | No proven convergence pattern |
| Shared contract v2 (roots widened) | Internal | Green (shipped on v4) | Harness cannot score new tiers |
| 3-model critical review (SOL/LUNA/Fable-5) | Internal | Captured | REQ-006 lacks its method spec |
| Shared harness (`router-replay.cjs`) | Internal | Green (frozen this slice) | Cannot score tiers uniformly |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A route-gold fix regresses another hub, or a converged unit propagates a circular gold pattern.
- **Procedure**: Each hub's fix landed as its own commit on `skilled/v4.0.0.0`; revert the offending hub commit to restore its prior router and gold. No shared-machinery edits were made in this slice, so a revert is hub-local.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
Route-gold proof (sk-prompt) ──► Fan-out (5 hubs) ──► Independent re-verify
                                                          │
                                                          ▼
                              REQ-001 harness de-skill-specific ──► REQ-002 convergence ──► REQ-006 fleet verification
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Route-gold proof | Gate semantics | Verified fix recipe | Fan-out |
| Fan-out | Proof recipe | 7/7 hubs green | Re-verify |
| Harness de-skill-specific | Frozen harness | Uniform tier scoring | Convergence |
| Fleet verification | Convergence | Teeth (precision, mutation) | Done |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Route-gold proof-of-recipe** - established the exact fix + verify loop - CRITICAL
2. **Route-gold fan-out** - 6/7 blocked hubs to 7/7 PASS - CRITICAL
3. **Harness de-skill-specific (REQ-001)** - uniform tier scoring - CRITICAL (pending)
4. **Fleet verification (REQ-006)** - proves the green has teeth - CRITICAL (pending)

**Total Critical Path**: route-gold slice complete; convergence + verification staged.

**Parallel Opportunities**:
- The 5 fanned-out hubs ran concurrently on disjoint trees.
- REQ-007 advisor coverage can proceed alongside REQ-002 convergence.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Route-gold recipe proven | sk-prompt PASS + airtight brief | DONE |
| M2 | Route-gold fleet green | 7/7 hubs PASS, 91 scenarios | DONE |
| M3 | Harness de-skill-specified | No skill-specific branch remains | Pending |
| M4 | Fleet verification with teeth | Mutation + blind holdout + live-mode | Pending |
<!-- /ANCHOR:milestones -->

---

## 8. AI EXECUTION PROTOCOL

### Pre-Task Checklist
- [ ] Read the target hub's router, `leaf-manifest.json`, and playbook scenarios before any edit.
- [ ] Confirm the fix is scope-locked to that hub (no shared benchmark machinery, no git history rewrite).
- [ ] Derive the correct answer from scenario prose first; never copy router output into gold.

### Execution Rules

| Rule | Description |
|------|-------------|
| TASK-SEQ | Fix and verify one hub before moving to the next. |
| TASK-SCOPE | Only modify the owned hub's routing artifacts; shared scorer files are frozen. |
| TASK-EVIDENCE | Re-run the route-gold gate and confirm the manifest is byte-stable before claiming a hub done. |

### Status Reporting Format

After each hub: "Hub `<name>` route-gold PASS (N/N scenarios); diff scope own-hub-only; manifest byte-stable."

### Blocked Task Protocol

If a fix cannot be made without touching shared machinery or without bending gold to a broken router, STOP, record the blocker with the scenario evidence, and escalate for an amendment decision rather than shipping a workaround.

---

<!--
LEVEL 3 PLAN
- Core + L2 + L3 addendums
- Retroactive plan reconstructed from the shipped route-gold slice and the staged remainder
-->
