---
title: "Feature Specification: Phase 8 - Webflow verification and closeout"
description: "Run recursive strict validation, hub and routing checks, a safe non-production live smoke, metadata refresh, and completion reconciliation before declaring the packet complete."
trigger_phrases: ["webflow verification", "mcp-webflow phase 8", "webflow closeout"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-mcp-webflow/008-verification-and-closeout"
    last_updated_at: "2026-08-02T16:50:00Z"
    last_updated_by: "pi"
    recent_action: "Authored the pending verification and closeout contract"
    next_safe_action: "Wait for Phase 7 verdict"
    blockers: ["Phase 7 is pending"]
    key_files: ["spec.md", "plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "019fc2a3-4f6c-7fa1-af87-b6e9f139a002"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 8 - Webflow verification and closeout

<!-- SPECKIT_LEVEL: 1 -->

<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-08-02 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 8 of 8 |
| **Predecessor** | `007-routing-benchmark-and-deep-review` |
| **Successor** | None (packet closeout) |
| **Handoff Criteria** | Recursive strict validation exits 0, hub and routing checks pass, smoke evidence is safe and honest, metadata is refreshed, and all completion claims across the packet are reconciled and evidence-backed. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context
This phase owns the packet-wide proof. It runs the mandatory gates the earlier phases set up, executes the only permitted external smoke against a disposable non-production target, and reconciles every completion claim so no document overstates reality.

**Dependencies**: completed Phases 1-7 with their evidence, and the operator-approved non-production Webflow target with a named rollback.

**Deliverables**: recursive validation results, hub check results, route/advisor regression evidence, smoke evidence, refreshed metadata, reconciled completion state, and a final handover.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
### Problem Statement
A packet with passing phases can still fail as a whole: a stale child summary, conflicting statuses, unfresh generated assets, an unvalidated doc, or an untested connection. Claiming completion without running the full gate would violate the verification rule.

### Purpose
Prove, gate by gate, that every contract authored in Phases 1-7 holds, then reconcile all completion claims so the packet closes with consistent, evidence-backed status.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
### In Scope
- Run recursive strict validation for the parent and all eight children; record every failure honestly and fix before completion.
- Run hub validation: root-metadata CI, parent-skill check, leaf-manifest and derived freshness, and compiled-routing scenario validation.
- Run route and advisor regression: Webflow intents resolve to the mode and the advisor recommends it.
- Execute the safe live smoke on the approved non-production target with named rollback; publish/delete/deploy stays tabletop unless separately approved.
- Refresh parent and child metadata through the approved system-spec-kit path.
- Reconcile completion state across `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `handover.md`, `implementation-summary.md`, and `_memory.continuity`; update the parent status only when child evidence exists.
- Confirm target-scoped git status: the 015 packet and authorized hub changes are the only task-owned delta.

### Out of Scope
- New research, registration, or feature work discovered during verification — record as findings, route through the owning phase or an amendment decision.
- Any production Webflow mutation.
- Touching `014-mcp-magnific` or unrelated dirty-worktree content.

### Files to Change
| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/mcp-tooling/015-mcp-webflow/**` | Modify | Statuses and evidence only, per phase outcomes |
| `.opencode/specs/mcp-tooling/015-mcp-webflow/{description.json,graph-metadata.json}` (parent and children) | Regenerate | Approved metadata refresh |
| `008-verification-and-closeout/` docs | Create/modify | Verification evidence and closeout record |
| `handover.md` | Modify | Final packet state |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
### P0 - Blockers
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Recursive strict validation passes | Parent and all eight children exit 0 under `validate.sh --strict` |
| REQ-002 | Hub validation passes | Root-metadata, parent-skill, freshness, and compiled-routing checks exit clean |
| REQ-003 | Route and advisor regression passes | Webflow intents resolve to `mcp-webflow`; advisor recommends it |
| REQ-004 | Safe live smoke | Smoke runs on the approved non-production target with named rollback, or is honestly marked blocked — never redirected to production |
| REQ-005 | Reconcile completion claims | No document claims a state its evidence does not support; parent status updates only with child evidence |

### P1 - Required
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Refresh metadata | Parent and child description/graph metadata regenerated via the approved path |
| REQ-007 | Scoped git status | Only the 015 packet and authorized hub changes are task-owned; sibling 014 untouched |
| REQ-008 | Record closeout | Verification evidence, changelog entries, and final handover are complete |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- **SC-001**: Every validation and check exits clean with recorded output.
- **SC-002**: No production mutation occurred; smoke evidence exists or the block is explicit and reasoned.
- **SC-003**: All packet documents agree on status; completion claims cite evidence.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 7 verdict | Closeout without independent sign-off | Block until verdict exists and P0s are resolved |
| Risk | Validator flags scaffold leftovers | Strict validation fails | Fix artifacts before any completion claim |
| Risk | No disposable Webflow target | Smoke impossible | Mark blocked with reason; never use production |
| Risk | Conflicting completion claims | False completion | Reconcile all docs against evidence |
| Risk | Broad git operations | Sibling packet contamination | Target-scoped status and staging only |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
- Which non-production Webflow workspace/site is approved for smoke, and what is its named rollback?
- Does the parent's Level 2 header require a checklist at the parent, or does the phase-parent lean trio policy govern?
<!-- /ANCHOR:questions -->
