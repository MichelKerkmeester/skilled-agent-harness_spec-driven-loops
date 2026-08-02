---
title: "Implementation Plan: Phase 8 - Webflow verification and closeout"
description: "Run the full packet gate: recursive strict validation, hub checks, route/advisor regression, safe non-production smoke, metadata refresh, and completion reconciliation."
trigger_phrases: ["webflow verification plan", "webflow closeout plan"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-mcp-webflow/008-verification-and-closeout"
    last_updated_at: "2026-08-02T19:04:17Z"
    last_updated_by: "pi"
    recent_action: "Created the verification and closeout plan"
    next_safe_action: "Wait for Phase 7"
    blockers: ["Phase 7 verdict is pending"]
    key_files: ["spec.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "019fc2a3-4f6c-7fa1-af87-b6e9f139a002"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 8 - Webflow verification and closeout

<!-- SPECKIT_LEVEL: 1 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY
| Aspect | Value |
|--------|-------|
| **Workflows** | system-spec-kit validation and metadata path; hub validation scripts |
| **Inputs** | All phase evidence, registered hub surface, approved smoke target |
| **Outputs** | Exit-0 validation, clean hub checks, smoke evidence, refreshed metadata, reconciled completion state |
| **Safety** | Smoke restricted to the approved non-production target with named rollback; no publish/delete/deploy without separate approval |

Verify in layers — packet docs, then hub surface, then live smoke — and reconcile documents only after every gate passes. Completion is claimed only when the evidence exists.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
### Definition of Ready
- [ ] Phase 7 verdict exists with zero unresolved P0s.
- [ ] Approved non-production target and rollback are named.
- [ ] All phase artifacts are present and statuses are current.

### Definition of Done
- [ ] `validate.sh <folder> --strict` exits 0 for the parent and every child.
- [ ] Hub, freshness, and compiled-routing checks exit clean.
- [ ] Smoke evidence recorded or block is explicit; no production mutation.
- [ ] Metadata refreshed; all completion claims reconciled.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
### Pattern
Layered gate: static validation -> hub integrity -> routing regression -> live smoke -> metadata and claims reconciliation.

### Key Components
- **Recursive strict validation**: parent plus eight children through `validate.sh --strict`.
- **Hub suite**: `ci-skill-root-metadata.cjs`, `parent-skill-check.cjs`, leaf-manifest and derived freshness, compiled-routing scenarios.
- **Regression probes**: router resolution and advisor recommendation for Webflow intents.
- **Smoke harness**: disposable target, named rollback, confirmation gate, evidence capture.
- **Reconciliation**: status consistency across all canonical docs and continuity blocks.

### Data Flow
Validate docs -> validate hub -> probe routing/advisor -> smoke -> refresh metadata -> reconcile claims -> final handover.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Packet docs (parent + children) | Contracts and status | Update status/evidence only | Recursive strict validation |
| Hub manifests and generated assets | Registered surface | Read-only unless a check fails | Hub validation suite |
| Metadata files | Continuity | Regenerate via approved path | Graph-metadata and description refresh |
| `handover.md` | Continuity artifact | Finalize packet state | No stale claims |
| Webflow target | External fixture | Smoke under approved contract | Evidence and rollback log |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
### Phase 1: Static Gate
- [ ] Run recursive strict validation; record all failures.
- [ ] Fix artifacts the validator flags; re-run to exit 0.
- [ ] Run the hub validation suite and compiled-routing scenarios.

### Phase 2: Regression and Smoke
- [ ] Probe router resolution and advisor recall.
- [ ] Run the safe live smoke on the approved target with named rollback and confirmation.
- [ ] Record evidence; mark blocked explicitly if the target is unavailable.

### Phase 3: Closeout
- [ ] Refresh parent and child metadata via the approved path.
- [ ] Reconcile all completion claims and statuses.
- [ ] Confirm scoped git status; finalize the handover.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | All packet docs | `validate.sh --strict` recursive |
| Hub integrity | Metadata, manifest, derived assets | Hub CI scripts |
| Routing | Resolution and recall | Router/advisor probes |
| Live | Approved non-production behaviors | Smoke harness with rollback |
| Consistency | Status claims across docs | Reconciliation audit |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 7 verdict | Internal | Pending | Closeout cannot start |
| Smoke target | External | Unknown | Smoke blocked; mark honestly |
| Metadata scripts | Internal | Available | Continuity stays stale |
| Hub validators | Internal | Available | Registration cannot be proven |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
- **Trigger**: Any gate fails or a smoke step threatens external content.
- **Procedure**: Execute the smoke's named rollback first, then revert the failing artifact through its owning phase, re-run the gate, and restart reconciliation. Never complete with a failing gate or an unresolved production-risk finding.
<!-- /ANCHOR:rollback -->
