---
title: "Feature Specification: Phase 6: integration-validation"
description: "The sk-design family is fully authored but never validated as a whole. This terminal phase rebuilds advisor + skill-graph, runs routing and backward-compat regression, and validates the family recursively so nothing broke when the children were added."
trigger_phrases:
  - "sk-design integration validation"
  - "sk-design family routing regression"
  - "validate sk-design family recursive"
  - "sk-design backward compat check"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/006-integration-validation"
    last_updated_at: "2026-06-25T12:41:18Z"
    last_updated_by: "claude-opus"
    recent_action: "Populated the Level-1 spec for the terminal integration-validation phase"
    next_safe_action: "Rebuild advisor + skill-graph, then run the family routing/regression and backward-compat sweep"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
      - "../005-build-subskills/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "skilled-agent-orchestration/154-sk-design-parent/006-integration-validation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "This is the terminal phase; no successor follows"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 6: integration-validation

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-25 |
| **Branch** | `skilled-agent-orchestration/154-sk-design-parent/006-integration-validation` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 6 |
| **Predecessor** | ../005-build-subskills/spec.md |
| **Successor** | None |
| **Handoff Criteria** | Terminal phase. Advisor + skill-graph rebuilt clean; every design query routes to the right child and `sk-design-interface` still resolves directly; mcp-open-design's mandatory design-judgment pairing still fires; `validate.sh --recursive` on the 154 parent passes; changelog entries exist for new + changed skills; all checks green. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the Build the sk-design umbrella family from the corpus research specification.

This is the **terminal phase**. By now the umbrella (003), the two onboarded children (004), and the three net-new children (005) all exist and each validated in isolation. What has never happened is validating the family as one integrated unit: that the advisor and skill-graph see every child, that design queries route to the *right* child, that the existing `sk-design-interface` contract (especially mcp-open-design's mandatory design-judgment pairing) still fires, and that nothing that names `sk-design-interface` broke. This phase ties the family together and proves it.

**Scope Boundary**: Validation, regression, and discovery-rebuild only. This phase does NOT author new skill content or change child scope; if a check fails, the fix is scoped back to the owning phase/child, not done here. The only writes here are the family-wide rebuild outputs and the changelog entries for the new + changed skills.

**Dependencies**:
- `../005-build-subskills/spec.md` - all three net-new children must exist and pass their own `validate.sh --strict` before the family sweep can be meaningful.
- 003 umbrella router and 004 onboarded children (`sk-design-interface`, `sk-design-spec`) - the full family must be present.
- skill-advisor and skill-graph subsystems - required for the rebuild + routing checks.

**Deliverables**:
- A clean advisor + skill-graph rebuild that includes all five children.
- A passing routing/regression suite: each design domain routes to its child; `sk-design-interface` resolves directly; mcp-open-design's mandatory pairing still fires.
- A passing `validate.sh --recursive` run on the 154 parent.
- Changelog entries for the new and changed skills.
- A backward-compat regression confirming every reference that names `sk-design-interface` still resolves.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sk-design family has been built up phase by phase, but each piece was validated alone. The family has never been exercised as one integrated unit, so there is no proof that the advisor routes design queries to the *correct* child, that adding three new children did not steal traffic from `sk-design-interface`, or that the references across the repo that name `sk-design-interface` (including mcp-open-design's mandatory design-judgment co-load) still resolve. Without this proof, the migration is not safe to call done.

### Purpose
Validate the assembled sk-design family end to end - advisor/skill-graph rebuilt, every query routing to the right child, the existing interface contract intact, and `validate.sh --recursive` green on the parent - so the migration ships with no regressions.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rebuild the skill-advisor and run a skill-graph scan/validate so all five children are discoverable and the graph is clean.
- Run routing/regression tests: a representative query for each design domain routes to the right child; `sk-design-interface` still resolves directly; mcp-open-design's MANDATORY design-judgment pairing still fires.
- Run `validate.sh --recursive` on the 154 parent to validate the family as one integrated unit.
- Add changelog entries for the new children and the changed (onboarded) skills.
- Run a backward-compat regression across every reference that names `sk-design-interface` (mcp-open-design, mcp-figma, sk-code, sk-code-review, CLAUDE.md gates) and confirm each still resolves.

### Out of Scope
- Authoring or re-scoping any skill content - that belongs to 003/004/005. If a check fails, the fix routes back to the owning phase/child.
- Adding new children (e.g. the deferred `sk-design-output`) - not part of validation.
- Changing the umbrella structural model or the locked taxonomy - frozen since 002.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `validate.sh --recursive` (run against `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/`) | Run | Family-wide recursive validation of the 154 parent and all phase children |
| skill-advisor index (rebuild) | Modify | Rebuild so all five sk-design children are discoverable at the right confidence |
| skill-graph (scan/validate) | Modify | Re-scan so family nodes/edges are present and clean |
| `.opencode/skills/sk-design-foundations/changelog/` | Modify | Changelog entry for the new foundations child |
| `.opencode/skills/sk-design-motion/changelog/` | Modify | Changelog entry for the new motion child |
| `.opencode/skills/sk-design-audit/changelog/` | Modify | Changelog entry for the new audit child |
| `.opencode/skills/sk-design-interface/changelog/` | Modify | Changelog entry noting the interface child's family onboarding |
| `.opencode/skills/sk-design-spec/changelog/` | Modify | Changelog entry noting the spec child (folded md-generator) onboarding |
| `.opencode/skills/sk-design/changelog/` | Modify | Changelog entry for the umbrella router reaching full family coverage |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The advisor and skill-graph are rebuilt and include all five sk-design children. | `advisor_rebuild` + `skill_graph_scan`/`advisor_validate` run clean; all five children appear as discoverable nodes. |
| REQ-002 | Each design domain routes to the correct child. | A representative query per domain (color/type/layout, motion, critique/a11y, DESIGN.md extract/author, interface direction) resolves to its child at confidence >=0.8 with no cross-child misroute. |
| REQ-003 | `sk-design-interface` still resolves directly and its mandatory pairing still fires. | A direct interface query resolves to `sk-design-interface`; the mcp-open-design MANDATORY design-judgment co-load with `sk-design-interface` still triggers per the CLAUDE.md dispatch rule. |
| REQ-004 | The family validates as one integrated unit. | `validate.sh --recursive` on `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/` exits 0. |
| REQ-005 | Backward-compat holds for every reference naming `sk-design-interface`. | A regression sweep of mcp-open-design, mcp-figma, sk-code, sk-code-review, and CLAUDE.md gates confirms each reference still resolves unchanged. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Changelog entries exist for the new and changed skills. | Changelog entries are present for `sk-design-foundations`, `sk-design-motion`, `sk-design-audit` (new) and for `sk-design-interface`, `sk-design-spec`, `sk-design` (changed). |
| REQ-007 | Any failed check is routed back to its owning phase rather than patched here. | If a routing/validation check fails, the failure and its owning phase/child are recorded; no skill content is re-authored inside this validation phase. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate.sh --recursive` on the 154 parent exits 0 and every design-domain routing query resolves to the right child at >=0.8.
- **SC-002**: `sk-design-interface` still resolves directly, mcp-open-design's mandatory pairing still fires, and every reference naming `sk-design-interface` still resolves - zero regressions.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 005 net-new children complete | If any child is missing or fails its own validation, the family sweep is meaningless | Treat per-child `validate.sh --strict` (005 gate) as a hard precondition before starting this phase |
| Risk | New children steal routing traffic from `sk-design-interface` (generic "make this look good" misroutes) | High | REQ-002/REQ-003 routing tests catch misroutes; keep the strong default-to-interface route; tighten child trigger phrases and re-run rather than weakening interface |
| Risk | A reference to `sk-design-interface` silently breaks | High | REQ-005 backward-compat sweep across mcp-open-design, mcp-figma, sk-code, sk-code-review, CLAUDE.md; flat names were kept precisely to make this zero-rewrite |
| Risk | `validate.sh --recursive` surfaces a child-level defect | Med | Route the fix back to the owning child/phase (REQ-007); do not patch content inside this validation phase |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- If routing telemetry after launch shows mostly-generic entry ("make this look good"), should the family flip toward a stronger default-to-interface route or revisit the hub model? Out of scope for this phase; recorded for post-launch review (the rejected hub alternative is documented in 002).
- Should `validate.sh --recursive` warnings (exit 1) block this terminal phase, or only errors (exit 2)? Resolve at execution: under `--strict` treat the parent gate as exit 0 required; triage any warnings before calling the migration done.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
