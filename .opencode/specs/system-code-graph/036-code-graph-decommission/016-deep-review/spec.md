---
title: "Feature Specification: Phase 16: deep-review"
description: "Two-lane external deep review of the executed code-graph decommission: Grok 4.5 High and DeepSeek v4 Pro audit every touched surface for regressions, missed residue, and dishonest completion claims, with forced full depth and no early convergence."
trigger_phrases:
  - "code graph decommission deep review"
  - "036 deep review"
  - "grok deepseek review lanes"
  - "decommission audit"
  - "016 deep review"
importance_tier: "important"
contextType: "review"
_memory:
  continuity:
    packet_pointer: "system-code-graph/036-code-graph-decommission/016-deep-review"
    last_updated_at: "2026-07-28T09:34:43Z"
    last_updated_by: "claude-code"
    recent_action: "Remediated confirmed review findings across all workstreams"
    next_safe_action: "Validate the packet and push"
    blockers: []
    key_files:
      - "spec.md"
      - "review/review-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-28-036-016-deep-review"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 16: deep-review

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-28 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 16 of 16 |
| **Predecessor** | 015-verification-and-closeout |
| **Successor** | None |
| **Handoff Criteria** | Both lanes complete 5/5 iterations, per-lane review reports exist, and every P0/P1 finding is confirmed-or-refuted against the repository |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 16** of the code graph decommission specification.

**Scope Boundary**: Read-only audit by external model lanes; fixes for confirmed findings land in the owning surfaces, not here. Lane artifacts write only under this child's `review/` directory.

**Dependencies**:
- Phases 001–015 complete and committed.
- The `cli-cursor` and `cli-opencode` executor kinds, both wired in the deep-loop runtime.

**Deliverables**:
- Two independent 5-iteration review lineages: `grok` (cli-cursor, `cursor-grok-4.5-high`) and `deepseek` (cli-opencode, `deepseek/deepseek-v4-pro`).
- Per-lane `review-report.md` with P0/P1/P2 findings.
- A triage record: each P0/P1 confirmed against the repo before any fix (a finding is a hypothesis, not a fact).

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The decommission touched five runtimes, the memory server's session payloads, the skill router's scoring lanes, fifty-plus command files, and four agent mirrors — verified so far only by the executing session's own checks. A change this broad deserves adversarial eyes that did not write it: an operator spot-check already caught six doctor assets the executing sweep missed, which is direct evidence that residue can survive self-review.

### Purpose
Have two unrelated external models independently audit every touched surface at forced full depth, so remaining regressions, residue, or overstated completion claims are found by reviewers with no authorship bias.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- All decommission-touched surfaces: `system-spec-kit/mcp-server`, `system-skill-advisor`, deep-loop runtime, `.opencode/commands` (doctor explicitly), the four agent mirrors, hooks and lifecycle scripts, and the packet's own completion claims.
- The residual-sweep assertion that only inert string literals remain.
- Honesty of the 001–015 closeout docs against the actual diffs.

### Out of Scope
- Archived spec packets, changelogs, benchmark reports, `.worktrees/**` — historical record.
- Re-litigating the ratified decision to retire structural search.
- Unrelated concurrent-session work present in the branch history.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `review/**` | Create | Lane state, iterations, and per-lane review reports |
| `implementation-summary.md` | Modify | Triage outcomes and closeout |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Both lanes run their full 5 iterations | `--stop-policy=max-iterations`; state records show 5/5 per lane, no early convergence stop |
| REQ-002 | Lanes write only inside their lineage dirs | No out-of-scope repository edits from either lane |
| REQ-003 | Every P0/P1 finding is verified before action | Each carries a confirmed/refuted verdict with file:line evidence |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Confirmed P0/P1 findings are fixed in the owning surface | Fix commits reference the finding; suites for the touched surface stay green |
| REQ-005 | Both review reports survive to the packet | `review/lineages/{grok,deepseek}/review-report.md` present and non-empty |
| REQ-006 | Stalled lanes are requeued, not abandoned | A lane killed by watchdog/timeout is restarted until 5/5 or a hard blocker is recorded |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 10 recorded iterations total (5 grok + 5 deepseek), neither lane stopped by convergence.
- **SC-002**: Zero unresolved P0 findings at closeout; P1s fixed or explicitly deferred with reason.
- **SC-003**: The packet still validates at 0 errors after any fixes land.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Reviewer fabrication (seen in the research phase: two phantom findings) | Wasted fix work or false alarm | REQ-003 makes verification mandatory before action |
| Risk | cli-opencode lane hangs at 0% CPU | Lane never completes | Runner injects the gate-bypass env and closes stdin; watchdog + requeue per REQ-006 |
| Risk | Lane writes outside its lineage dir | Repository damage | Sibling-scope containment fix already shipped; neither kind is containment-gated, so monitor the ledger |
| Dependency | Branch synced before review | Reviewers audit a moving target | Sync/push completes before the fan-out launches |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- ~~Should confirmed P2 findings get a follow-up packet or be recorded and closed here?~~ Resolved: all three grok P2s were fixed alongside the adjacent scrub; inert residue is recorded in implementation-summary.md.
<!-- /ANCHOR:questions -->

---

<!-- SCAFFOLD_VALIDATION_COUNTS:
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
