---
title: "Feature Specification: Phase 3: packet-125-126-refinements"
description: "5 advisory clarity/completeness refinements (WS-B) to the 125-cli-external-parent and 126-mcp-tooling-parent planning packets, surfaced by a whole-program deep review: a deferred ClickUp auth/config drift with no cutover-visibility gate, a grep-string (not resolution-based) move gate, an implicit scaffold/scorer ordering invariant, a buried ADR-005 carve-out exception, and an implicit phase-001 write boundary. Both packets stay Planned; only their spec/plan/tasks docs change."
trigger_phrases:
  - "packet 125 126 refinements"
  - "WS-B advisory refinements"
  - "clickup drift cutover visibility"
  - "resolution-based move gate"
  - "phase 003 packet refinements"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/skilled-agent-orchestration/127-deep-review-remediation/003-packet-125-126-refinements"
    last_updated_at: "2026-07-10T05:15:00Z"
    last_updated_by: "claude"
    recent_action: "5 WS-B refinements landed; both packets still 0/0 strict"
    next_safe_action: "None - phase complete"
    blockers: []
    key_files:
      - ".opencode/specs/skilled-agent-orchestration/125-cli-external-parent/spec.md"
      - ".opencode/specs/skilled-agent-orchestration/125-cli-external-parent/003-scaffold-hub/spec.md"
      - ".opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/004-onboard-chrome-devtools/spec.md"
      - ".opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/005-foldin-clickup-and-figma/spec.md"
      - ".opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/006-advisor-and-integration/spec.md"
      - ".opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/008-cutover-and-rollout/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "127-deep-review-remediation-003-packet-125-126-refinements"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "All 5 WS-B findings verified against live files before editing; R5's target line already had partial (no writes) prose, strengthened to explicitly say read-only"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: packet-125-126-refinements

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
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-10 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 3 |
| **Predecessor** | 002-sk-prompt-124-remediation |
| **Successor** | None |
| **Handoff Criteria** | All 5 WS-B refinements land in 125/126 phase docs; both packets stay Planned (nothing marked Complete); `validate.sh --recursive --strict` stays 0/0 for both packets and this phase folder validates `--strict` 0/0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Fix all open deep-review findings across cli-opencode, the sk-prompt 124 hub, and the 125/126 planning packets specification.

**Scope Boundary**: Strictly the two planning packets' spec-kit docs - `125-cli-external-parent/**` and `126-mcp-tooling-parent/**` `spec.md`/`plan.md`/`tasks.md` prose only. No change to any locked decision, ADR conclusion, or either packet's `Status` field; both packets remain Planned throughout. No change to `cli-opencode` or the sk-prompt 124 hub (sibling phases 001/002 of this same parent packet own those trees).

**Dependencies**:
- The whole-program deep review (`125-cli-external-parent/review/review-report.md` §3 WS-B) that surfaced all 5 findings.
- The fix manifest `phase3-packets.md` (scratchpad input) with exact file:line targets and fix instructions for each refinement.

**Deliverables**:
- All 5 WS-B refinements landed across the two packets' phase docs (6 target phase folders, 13 file edits total).
- `description.json` and `graph-metadata.json` regenerated for every edited phase folder (5 phase folders plus the 125 parent root).
- This Level 1 spec-kit packet, validated `--strict` 0/0, plus both target packets re-confirmed `--recursive --strict` 0/0.

**Changelog**:
- N/A - this phase edits planning-packet spec-kit docs only; neither 125 nor 126 has shipped code requiring a skill changelog entry, and neither packet phase closes (both stay Planned).
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A whole-program deep review of the 125-cli-external-parent and 126-mcp-tooling-parent merge plans found 5 advisory clarity/completeness gaps (WS-B, P1×3 + P2×2), none blocking: a deferred ClickUp auth/config drift with no cutover-visibility gate, a move-gate verification that greps for the absence of old paths but never confirms rewritten relative links actually resolve on disk, an implicit "no advisor graph rebuild before phase 006" safety invariant that a reader of phase 003 alone could not see, a scope-boundary line that flatly denied touching `mcp-code-mode` while burying its own documented ADR-005 exception, and a parent phase map whose phase-001 write boundary was only partially explicit.

### Purpose
Every WS-B finding is fixed as a documentation-only clarity/completeness refinement, verified against file:line evidence before and after, without altering either packet's locked decisions, ADR conclusions, or Planned status.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- R1: `126.../008-cutover-and-rollout` - cutover-visibility gate for the deferred ClickUp auth/config drift.
- R2: `126.../004-onboard-chrome-devtools` and `126.../005-foldin-clickup-and-figma` - resolution-based move-gate hardening.
- R3: `126.../006-advisor-and-integration` - ADR-005 carve-out cross-reference at the scope-boundary line.
- R4: `125.../003-scaffold-hub` - explicit "no advisor graph rebuild before phase 006" invariant.
- R5: `125-cli-external-parent/spec.md` - explicit phase-001 read-only marker in the parent phase map.

### Out of Scope
- Any change to `cli-opencode` or the sk-prompt 124 hub - owned by sibling phases 001/002 of this same parent packet.
- Any change to a locked decision, ADR conclusion, or either packet's `Status` field - both packets stay Planned throughout this phase.
- Actually fixing the pre-existing ClickUp OAuth-vs-`@clickup/mcp-server` drift itself - stays a documented deferral; R1 only adds cutover visibility, it does not resolve the drift.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `126-mcp-tooling-parent/008-cutover-and-rollout/{spec,plan,tasks}.md` | Modify | R1: cutover-visibility gate for the deferred ClickUp drift |
| `126-mcp-tooling-parent/004-onboard-chrome-devtools/{spec,plan,tasks}.md` | Modify | R2: resolution-based move gate (chrome-devtools tree) |
| `126-mcp-tooling-parent/005-foldin-clickup-and-figma/{spec,plan,tasks}.md` | Modify | R2: resolution-based move gate (click-up + figma trees) |
| `126-mcp-tooling-parent/006-advisor-and-integration/spec.md` | Modify | R3: ADR-005 carve-out cross-reference |
| `125-cli-external-parent/003-scaffold-hub/spec.md` | Modify | R4: explicit no-rebuild-before-006 invariant |
| `125-cli-external-parent/spec.md` | Modify | R5: explicit phase-001 read-only marker |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Both target packets keep passing strict recursive validation after every edit. | `validate.sh --recursive --strict` on `125-cli-external-parent` and on `126-mcp-tooling-parent` both report 0 errors / 0 warnings, re-run after all 5 refinements land. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | R1: ClickUp drift stays visible at cutover, not silently dropped. | `126.../008-cutover-and-rollout/spec.md` Deliverables, In Scope, and a new REQ-004 explicitly require confirming the drift is still deferred; `plan.md` and `tasks.md` carry matching checkable items. |
| REQ-003 | R2: Move gates verify link resolution, not just grep-absence. | `126.../004-onboard-chrome-devtools` and `126.../005-foldin-clickup-and-figma` `spec.md` REQ-002, `plan.md`, and `tasks.md` each add a disk-resolution check for rewritten relative links. |
| REQ-004 | R3: The ADR-005 carve-out is cross-referenced at the scope-boundary line. | `126.../006-advisor-and-integration/spec.md`'s Scope Boundary sentence (Phase Context) names the ADR-005 exception in place, not only in the detailed Scope section further down. |
| REQ-005 | R4: The no-advisor-rebuild-before-006 invariant is explicit in phase 003. | `125.../003-scaffold-hub/spec.md`'s In Scope bullet and Files to Change row for `graph-metadata.json` both state the invariant explicitly. |
| REQ-006 | R5: Phase 001's read-only boundary is explicit in the parent phase map. | `125-cli-external-parent/spec.md`'s PHASE DOCUMENTATION MAP row for phase 1 states "read-only" explicitly, not only "(no writes)". |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 5 WS-B findings verified against live files with file:line evidence, fixed, and re-verified after editing.
- **SC-002**: Both 125 and 126 packets remain `Status: Planned` throughout; no locked decision, ADR conclusion, or ADR file is altered.
- **SC-003**: `validate.sh --recursive --strict` returns 0/0 for both `125-cli-external-parent` and `126-mcp-tooling-parent`, and this phase folder itself validates `--strict` 0/0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Whole-program review report (`125-cli-external-parent/review/review-report.md` §3 WS-B) plus the fix manifest `phase3-packets.md` | High - both fully specify each finding's target and fix | Verified every finding's cited file:line against the live file before editing, not the manifest's approximate line numbers alone |
| Risk | An advisory edit accidentally reopens a locked ADR decision or flips a `Status` field | High if it happened | Every edit is additive prose only; no `decision-record.md` touched, no `Status` field changed in either packet |
| Risk | Inserting a new task mid-list collides with an existing task ID | Medium | Renumbered `126.../008-cutover-and-rollout/tasks.md` Phase 3 (T007→T008, T008→T009, T009→T010) after inserting the new T007 in Phase 2; other insertions were appended at the end of their phase, needing no renumber |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. All 5 findings were fully specified in the fix manifest with file:line targets. One nuance surfaced during verification - R5's cited line already carried partial "(no writes)" prose before this phase's edit - is recorded as a Key Decision in `implementation-summary.md`, not left open.
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
