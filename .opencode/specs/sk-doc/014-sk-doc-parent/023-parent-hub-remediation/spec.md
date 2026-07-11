---
title: "Feature Specification: Parent-hub remediation program"
description: "A prioritized, decision-forked plan to fix all 18 findings from the parent-hub deep review (022) — restoring a 4/4 canon-clean fleet, closing the advisor and one-identity enforcement gaps, and reconciling doctrine, checker, and implementations to one definition of canonical."
trigger_phrases:
  - "parent hub remediation plan"
  - "014 sk-doc phase 023"
  - "fix parent skill findings"
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/014-sk-doc-parent"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/023-parent-hub-remediation"
    last_updated_at: "2026-07-07T15:55:58.000Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored the 9-work-unit remediation plan from the 022 review"
    next_safe_action: "Operator resolves the 6 decision forks; then execute WU1 (P0) first"
    blockers: []
    key_files:
      - ".opencode/specs/sk-doc/014-sk-doc-parent/022-parent-skill-logic-review/review-report.md"
      - ".opencode/skills/sk-doc/create-skill/references/parent_skill/"
      - ".opencode/commands/doctor/scripts/parent-skill-check.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 30
    open_questions: []
    answered_questions: []
---
# Feature Specification: Parent-hub remediation program

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft (plan; execution gated on operator decisions) |
| **Created** | 2026-07-07 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Packet** | `sk-doc/014-sk-doc-parent` |
| **Depends On** | `022-parent-skill-logic-review/` |
| **Predecessor** | `022-parent-skill-logic-review/` |
| **Successor** | none (spawns per-work-unit execution) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 022 deep review found 18 defects in the parent-hub pattern: one P0 (sk-design fails the canon checker on an un-canonized `transport` axis), seven P1s (surfaceBundle doctrine fiction, unenforced one-identity ingestion, two sk-code tool-contract contradictions, two unguarded advisor command-bridge lanes, sk-design's self-contradicting routing contract), and ten P2s (doctrine/checker/template staleness and cross-hub metadata dialect drift). Doctrine, enforcement (`parent-skill-check.cjs`), and the four implementations have drifted into three different definitions of "canonical."

### Purpose
Produce an ordered, decision-forked remediation plan that fixes every finding and "perfects" the pattern: a 4/4 canon-clean fleet under default strict mode, ingestion-time one-identity enforcement, the advisor command-bridge lane brought under contract and guarded, and one reconciled canon across doctrine + checker + templates + hubs. `plan.md` holds the nine work units; execution is gated on the operator resolving six decision forks the review surfaced.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A remediation plan covering all 18 findings (PS-01…PS-18), grouped into nine ordered work units with fix approach, target files, verification gate, and the decision (if any) each requires.
- The six operator decision forks that block execution, each with a recommended default.
- The execution strategy (deterministic edits vs agent-authored content; per-WU gates) and the overall done-bar.

### Out of Scope
- Executing the fixes (this phase authors the plan; each work unit executes once its decisions are resolved).
- Re-pointing the migrated 999 parent's other phases' stale `125` frontmatter (operator's separate migration).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `023-parent-hub-remediation/plan.md` | Add | The nine-work-unit remediation program |
| `023-parent-hub-remediation/{spec,tasks,implementation-summary}.md` | Add | Level-1 packet docs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every one of the 18 findings maps to a work unit with a fix approach | plan.md's work units reference PS-01…PS-18 with no orphan |
| REQ-002 | The plan is ordered by priority + dependency | P0 (WU1) first; P1s next; P2 sweeps last; dependencies noted |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Every decision fork is surfaced with a recommended default | The 6 forks (transport shape, feature_catalog, code-review mutation, benchmark bridge, create:* bridges, family) each carry a recommendation |
| REQ-004 | The done-bar is executable | plan.md defines the 4/4-canon-clean + drift-guard + advisor-test + validate gates |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: plan.md decomposes all 18 findings into nine ordered work units with fix approach, files, gate, and decisions.
- **SC-002**: The six decision forks are listed with recommendations for the operator to resolve before execution.
- **SC-003**: `validate.sh --strict` passes for this folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Fixing hubs instead of doctrine (or vice-versa) inconsistently | New drift | Each WU names whether doctrine, checker, or hub is the source of truth to move toward |
| Risk | Advisor edits perturb the gated scorer track | Conflict | The command-bridge WU coordinates with the advisor track; guard-first, test-green |
| Dependency | Operator decisions on 6 forks | Blocks execution | Plan recommends a default for each; execution starts on resolution |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Six decision forks (see plan.md §Decisions) must be resolved before the P0/P1 work units execute; the P2 doctrine/checker/metadata sweeps can proceed on the recommended defaults.
<!-- /ANCHOR:questions -->
