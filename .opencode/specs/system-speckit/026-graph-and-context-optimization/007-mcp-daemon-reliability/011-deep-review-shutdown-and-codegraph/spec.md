---
title: "Feature Specification: opus-4.8 deep review of daemon-shutdown + code-graph fixes (10-round, workflow-executed)"
description: "A 10-iteration deep-review loop over the recent daemon-shutdown/memory-DB-lifecycle (008/009/010) and code-graph (012 + 15-bug) work, executed via the Workflow tool with opus-4.8 agents while reproducing the deep-review skill contract (4 dimensions, P0/P1/P2 + [SOURCE:file:line], adversarial P0 replay, per-iteration verdict, externalized state, 9-section report)."
trigger_phrases:
  - "opus deep review shutdown codegraph"
  - "026 007 011 deep review"
  - "workflow deep review opus 4.8"
  - "daemon shutdown deep review"
  - "deep review shutdown durability codegraph"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/011-deep-review-shutdown-and-codegraph"
    last_updated_at: "2026-05-29T14:30:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Launched 10-round opus-4.8 deep-review workflow; authoring packet"
    next_safe_action: "Reduce workflow results into canonical review state + review-report.md"
    blockers: []
    key_files:
      - "spec.md"
      - "review/review-report.md"
    completion_pct: 30
    open_questions:
      - "Will any P0 survive adversarial replay across the freshly-churned shutdown path?"
    answered_questions:
      - "Executor? Workflow tool with opus-4.8 agents (operator-directed), reproducing the deep-review contract."
      - "Scope? The recent daemon-shutdown/memory + code-graph fix surface, reviewed on-disk."
---
# Feature Specification: opus-4.8 Deep Review (Daemon-Shutdown + Code-Graph)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-29 |
| **Branch** | `main` |
| **Parent** | `system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The recent daemon-shutdown / memory-DB-lifecycle work (packets 008 checkpoint-on-close, 009 shutdown-durability, 010 at-rest-wal) and the code-graph fixes (012 empty-graph auto-establish + the 15-bug audit remediation) were shipped rapidly, partly by parallel sessions, into a safety-critical subsystem that just suffered a real data-integrity incident (026/004/012 FTS5 corruption). That surface deserves a hardening pass.

### Purpose
Run a 10-round deep review over that surface — executed via the Workflow tool with opus-4.8 agents per operator request, while faithfully reproducing the deep-review skill contract — to surface and adversarially verify any residual P0/P1/P2 issues before further work builds on it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- 10 fresh-context opus-4.8 review iterations across the four deep-review dimensions (Correctness, Security, Spec-Alignment/Traceability, Completeness/Maintainability).
- Adversarial P0 replay (refute-or-confirm) per iteration.
- Reduction into canonical deep-review state under `review/` + a 9-section `review-report.md`.

### Out of Scope
- Fixing the findings (review is read-only; remediation is a follow-up).
- The 1,379 daemon-churned `graph-metadata.json` files + a parallel session's uncommitted source edits (reviewed as on-disk WIP, not committed here).
- Subsystems outside the recent shutdown/memory/code-graph change surface.

### Files to Change
This packet changes no product code (review is read-only). It produces the review state + report below.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `review/deep-review-config.json` | Create | Run config (read-only after init) |
| `review/deep-review-state.jsonl` | Create | Config record + one record per iteration |
| `review/iterations/iteration-NNN.md` | Create | Per-iteration narrative ending in the verdict line |
| `review/deep-review-findings-registry.json` | Create | Deduped finding registry |
| `review/deep-review-strategy.md` / `deep-review-dashboard.md` | Create | Strategy + metrics |
| `review/review-report.md` | Create | 9-section release-readiness report |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every reported finding cites real `file:line` + quoted evidence; every P0 survives adversarial replay | Findings registry shows confirmed vs refuted P0s with rationale |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | 10 iterations across all 4 dimensions, fresh context each | state.jsonl has 10 iteration records; dimensions all covered |
| REQ-003 | Canonical deep-review state + 9-section review-report.md produced | `validate.sh --strict` exit 0; report carries verdict + release-readiness state |
| REQ-004 | Executed via Workflow + opus-4.8 agents while honoring the deep-review contract | iteration files end with the exact `Review verdict: PASS|CONDITIONAL|FAIL` line |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A verdict (PASS/CONDITIONAL/FAIL) + severity counts + release-readiness state recorded in `review-report.md`.
- **SC-002**: All confirmed findings carry `file:line` evidence; refuted P0s downgraded with rationale.
- **SC-003**: Packet `validate.sh --strict` exit 0; review state indexed via the live MCP.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A parallel session is actively mutating the same files | Med | Review on-disk current files, cite current lines, mark uncommitted-WIP findings (iteration 9) |
| Risk | Workflow-tool execution deviates from the deep-review command's default dispatch | Med | Reproduce the full contract (state machine, dimensions, adversarial replay, report); single state-writer = main agent (mirrors reduce-state.cjs) |
| Risk | Opus-4.8 fan-out is a large spend | Low | Operator-requested; bounded to 10 iterations + P0 replays |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Iterations run with fresh context (no accumulated-context bias); bounded ~8-11 tool calls each.

### Security
- **NFR-S01**: Read-only review; no files under review are modified.

### Reliability
- **NFR-R01**: Every P0 is adversarially replayed before confirmation; unconfirmed P0s are downgraded with rationale.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Iteration returns zero findings: recorded as PASS for that dimension.
- An iteration agent errors/drops: filtered; coverage note records the gap.

### Error Scenarios
- Moving tree (parallel edits): findings cite on-disk lines; report notes volatility.
- Uncommitted enhancements: iteration 9 reviews them and flags provenance.

### State Transitions
- Convergence may stabilize before 10 rounds; recorded honestly (no fabricated extra rounds).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | ~15 source files + 4 spec packets across 2 skills |
| Risk | 14/25 | Safety-critical surface; moving tree; large opus fan-out |
| Research | 14/20 | 10 iterations + adversarial replay |
| **Total** | **44/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Whether any confirmed P0 emerges in the freshly-churned shutdown path (resolved by the run's findings registry).
<!-- /ANCHOR:questions -->
