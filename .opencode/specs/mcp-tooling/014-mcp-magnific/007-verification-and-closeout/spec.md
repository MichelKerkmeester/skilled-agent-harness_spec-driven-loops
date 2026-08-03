---
title: "Feature Specification: Phase 7 — Magnific verification and closeout"
description: "Verify the complete mcp-magnific integration across spec validation, package and hub checks, advisor routing, no-cost live discovery, controlled paid smoke, and completion metadata."
trigger_phrases:
  - "verify mcp-magnific"
  - "magnific mcp smoke test"
  - "magnific closeout"
  - "mcp-magnific phase 7"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/014-mcp-magnific/007-verification-and-closeout"
    last_updated_at: "2026-08-02T13:36:52Z"
    last_updated_by: "spec-author"
    recent_action: "Define Magnific closeout phase"
    next_safe_action: "Run all gates after Phases 1–6 complete"
    blockers:
      - "Phases 1–6 must be complete"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "014-mcp-magnific-007"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Will the operator approve a bounded paid smoke?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 7 — Magnific verification and closeout

<!-- SPECKIT_LEVEL: 1 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-08-02 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 7 of 7 |
| **Predecessor** | `006-hub-registration-and-advisor` |
| **Successor** | None |
| **Handoff Criteria** | All strict, package, hub, route, advisor, and no-cost live checks pass; paid smoke is consented and passed or explicitly deferred; metadata is reconciled. |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:phase-context -->
## Phase Context

This phase proves the mode is structurally valid, routable, authenticated, safe around credits, and usable against the official endpoint. It owns final evidence and status reconciliation.

**Scope Boundary**: Verification and closeout only. Failures route back to their owning phase rather than being patched silently here.

**Dependencies**:
- Completed Phases 1–6.
- Optional paid account and explicit budget approval for mutation smoke.
- Spec, skill, hub, route, advisor, and Code Mode validators.

**Deliverables**:
- Full verification transcript or concise evidence table.
- Final implementation summary and reconciled packet statuses.
- Explicit limitations and deferred paid smoke if consent or credits are unavailable.
<!-- /ANCHOR:phase-context -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A registered remote MCP can appear complete while authentication fails, schemas drift, routing selects the wrong mode, credits are spent without consent, outputs cannot be retrieved, or packet metadata remains stale.

### Purpose
Run the whole-system gate and close only the claims that current evidence supports.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Recursive strict packet validation.
- Nested package, hub structure, registry/router, leaf, compiled-routing, advisor, and link checks.
- No-cost live checks: auth, discovery, balance/history/browse where supported.
- Optional bounded paid generation/transformation smoke after explicit approval.
- Output retrieval, asynchronous completion, cleanup, and metadata reconciliation.

### Out of Scope
- Unbounded generation batches.
- Subscription or credit purchases.
- New features discovered during closeout.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `implementation-summary.md` | Modify | Final evidence and limitations |
| `spec.md`, `plan.md`, `tasks.md` across child phases | Modify | Reconcile actual status and evidence |
| Parent `spec.md`, `description.json`, `graph-metadata.json` | Modify | Roll up completion state |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Pass recursive strict validation | Parent and all children exit 0 with no blocking warnings |
| REQ-002 | Pass package and hub checks | Nested mode and parent hub validators exit 0 |
| REQ-003 | Prove route and advisor behavior | Given narrow Magnific prompts, advisor selects hub and hub selects mode |
| REQ-004 | Prove no-cost live path | Authenticated discovery and at least one confirmed free/read operation succeed without credit spend |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Verify a bounded paid path or defer honestly | Explicit operator approval and budget precede the call; otherwise limitation records the deferral |
| REQ-006 | Reconcile all metadata | Specs, tasks, summaries, descriptions, graphs, and parent phase map agree on status |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Structural and routing gates are green with recorded command evidence.
- **SC-002**: No-cost verification proves the official endpoint is usable in the target runtime.
- **SC-003**: Any paid claim is backed by explicit consent and observable output; otherwise it remains unproven.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Paid-plan account | Paid smoke may be unavailable | Keep no-cost verification mandatory and defer paid claim |
| Risk | Smoke spends more than expected | Financial impact | Fix model/count/resolution/duration and budget before call |
| Risk | Remote output processing is slow | False timeout | Follow discovered job polling and bounded retry rules |
| Risk | External service changes after validation | Future drift | Require live discovery on each use and date the evidence |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What maximum credit budget will the operator authorize for the paid smoke?
- Which generated artifact type provides the smallest reliable end-to-end test?
<!-- /ANCHOR:questions -->
