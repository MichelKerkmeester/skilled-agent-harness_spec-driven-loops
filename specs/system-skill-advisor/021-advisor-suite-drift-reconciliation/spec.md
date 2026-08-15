---
title: "Feature Specification: Advisor Suite Drift Reconciliation"
description: "Reconcile the ~32 advisor test failures left by concurrent skill renames, retirements, new hubs, and hook rewiring — regenerate baselines and update corpus/fixtures/skill-list copies to LEGITIMATE current behavior, without weakening any gate."
trigger_phrases:
  - "advisor suite drift reconciliation"
  - "advisor parity baseline regen"
  - "advisor corpus expectation update"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/021-advisor-suite-drift-reconciliation"
    last_updated_at: "2026-08-15T17:14:48Z"
    last_updated_by: "claude-code"
    recent_action: "LUNA-MAX reconciled 6 clusters; default suite 40->4 failures; diff reviewed clean"
    next_safe_action: "Owner decision on the 4 residual reds (2 real regressions, corpus floor, env)"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Advisor Suite Drift Reconciliation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-15 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Concurrent work — retiring the code-graph skill, renaming skills, adding hubs (Figma, mcp-tooling, CLI-hub, sk-communication), and rewiring hooks — legitimately shifted advisor behavior but left ~32 tests red across six clusters: frozen output baselines, routing-corpus expectations, cross-language skill-list agreement, hook-settings shape, launcher env fixtures, and stress simulations. These are guardrail tests holding stale snapshots; the code moved, the expectations did not.

### Purpose

Reconcile each failing test to the LEGITIMATE current behavior — regenerate baselines via their own tooling, update corpus/fixtures/skill-list copies to the post-merge reality — without weakening a single gate. Any failure that is a real regression, or whose delta cannot be confirmed as legitimate current behavior, stays red and is reported.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The ~32 failing advisor tests and the baselines / ledgers / corpus / fixtures / skill-list copies they consume.
- Regeneration via each artifact's own tooling; targeted fixture/expectation updates for legitimate behavior changes.

### Out of Scope

- Loosening any gate, threshold, ratchet, or assertion to force a pass.
- Reversing the concurrent renames/retirements/hub additions.
- Non-advisor subsystems.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `system-skill-advisor/mcp-server/**/{baselines,fixtures,ledgers,corpus}` | Modify | Regenerate/update derived artifacts to legitimate current behavior |
| `system-skill-advisor/mcp-server/tests/**` | Modify | Update stale expectations only where the new behavior is confirmed legitimate |
| `system-skill-advisor/mcp-server/lib/**` | Inspect | Sync cross-language skill-list copies if a rename left them inconsistent |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:evidence -->
## 4. VERIFIED EVIDENCE

Baseline (pre-reconciliation): ~32 failing across six clusters after the code-graph crash and launcher-wipe fixes landed.

### The six clusters

- **Frozen baselines (~12):** `policy-plan-serializer-parity`, `local-native-divergence-ratchet`, `scorer-eval-baseline-ratchet`, `python-ts-parity` — output no longer matches saved bytes.
- **Routing corpus (~7):** `executor-delegation`, `advisor-validate`, `bm25-lexical-shadow`, `advisor-corpus-parity`, `lane-weight-sweep` — expected top-1 / floors changed.
- **Cross-language agreement (~4):** `vocabulary-agreement`, `advisor-graph-health`, `skill-advisor-cli-parity` — skill-list copies out of sync.
- **Hook settings (3):** `settings-driven-invocation-parity` — matcher-group count changed.
- **Launcher env fixtures (~4):** `launcher-bootstrap`, `skill-advisor-launcher-orphan-reaping` — `createChildEnv` now derives `SPECKIT_IPC_SOCKET_DIR` (launcher-derived, not a parent passthrough).
- **Stress (2):** lifecycle-routing active-entry count; plugin-bridge directive expectation.
<!-- /ANCHOR:evidence -->

---

<!-- ANCHOR:requirements -->
## 5. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Baselines/artifacts regenerated only via their own tooling | No hand-edited baseline bytes; regen commands recorded |
| REQ-002 | No gate weakened | No threshold, ratchet, floor, or assertion loosened to force a pass |
| REQ-003 | The security no-leak fixture stays a real check | Only launcher-derived vars added to expected env; untrusted parent vars still asserted absent |
| REQ-004 | Real regressions are reported, not masked | Any failure not confirmed as legitimate current behavior is left red with a written reason |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The suite returns to green for the reconcilable subset | `vitest run` failures drop to the residual set, each documented |
| REQ-006 | Typecheck stays clean | `tsc --noEmit` exit 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 6. SUCCESS CRITERIA

- **SC-001**: Every reconciled test is green because its expectation now matches confirmed-legitimate behavior, not a loosened gate.
- **SC-002**: The diff review shows regenerated artifacts + justified expectation updates only — no threshold/ratchet weakening.
- **SC-003**: Residual reds (if any) are documented as real regressions or unattributable deltas, left for their owner.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Regenerating a baseline blesses a real bug as normal | High | Regenerate only when the delta is cleanly attributable to landed concurrent work; flag polluted deltas |
| Risk | Editing a security/ratchet test weakens it | High | Guardrail: only add provably-legitimate expectations; parent reviews every test/baseline edit |
| Risk | Concurrent churn invalidates the reconciliation | Medium | Verify the full suite immediately before commit; re-run if the tree moved |
| Dependency | Each artifact's regeneration tool | Green | Under `scripts/routing-accuracy/` and per-test regen paths |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS

- Which residuals are genuine regressions vs. unattributable deltas? Resolved per-cluster during reconciliation and recorded.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Sibling packets**: `019-code-graph-retirement-drift`, `020-launcher-test-bootstrap-guard`
