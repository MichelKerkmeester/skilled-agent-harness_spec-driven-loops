---
title: "Feature Specification: 027 Spec-Tree Six-Track Consolidation"
description: "027 grew to 31 flat top-level phase children, which no longer matched how the work is organized by system. This regroups every phase under six themed parents (like 026) and realigns the root tracking docs."
trigger_phrases:
  - "027 spec tree consolidation"
  - "027 six track regroup"
  - "027 phase reorganization"
  - "themed parent tracks 027"
  - "027 timeline before-after context-index"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/000-spec-tree-consolidation"
    last_updated_at: "2026-06-14T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Regroup 30 phases into six themed tracks; author parents"
    next_safe_action: "Update root tracking docs and validate recursively"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-14-027-six-track"
      parent_session_id: null
    completion_pct: 70
    open_questions: []
    answered_questions:
      - "Shape: full by-system collapse into 6 themed top-level tracks."
      - "Numbering: contiguous renumber within each new parent (026-style)."
      - "Active phases (in-progress/draft) are regrouped too; git mv preserves content + history."
---
# Feature Specification: 027 Spec-Tree Six-Track Consolidation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
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
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-06-14 |
| **Branch** | `028-mcp-to-cli-tool-transition` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `027-xce-research-based-refinement` packet accreted to 31 flat top-level phase children (`000`-`030`) as work was added over the epic. That flat list is hard to scan and no longer matches how the work is actually organized by system, the way `before-vs-after.md` already narrates it (memory store, skill-advisor, code-graph, shared infrastructure, verification/remediation).

### Purpose
Group every phase under six themed parent tracks (the `026` model), renumber children contiguously within each parent, and realign the root tracking docs so the top level is scannable and the tree resolves cleanly.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Move all 30 prior top-level phases (`001`-`030`) under six themed parents and renumber children to contiguous `001..N`.
- Author the five new themed-parent lean trios (`spec.md` + `description.json` + `graph-metadata.json`).
- Rewrite path references across canonical navigable docs; restructure `changelog/`; refresh the root `spec.md`, `graph-metadata.json`, `description.json`, `before-vs-after.md`, `context-index.md`, and regenerate `timeline.md`.

### Out of Scope
- Changing any phase's implementation content - this is a structural/metadata move only.
- Rewriting frozen research-log artifacts (`*.jsonl`, `*.out`, `*.err`) - they record what was true at audit time and are resolved via the `context-index.md` bridge.

### Files to Change
| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `001-research-and-doctrine/` … `005-verification-and-remediation/` | Create | Five themed parent folders (lean trio each) |
| `00N-track/00M-phase/**` | Move | 30 phases relocated + identity fields re-derived |
| `changelog/`, `spec.md`, `graph-metadata.json`, `description.json`, `before-vs-after.md`, `context-index.md`, `timeline.md` | Modify | Root tracking surfaces realigned to six tracks |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Top level collapses to six folders: `000-release-cleanup` + five themed tracks | `ls -d [0-9][0-9][0-9]-*/` shows exactly six entries |
| REQ-002 | Every moved phase's `graph-metadata.json` resolves: `packet_id`/`parent_id`/`children_ids` reflect the new path | `validate.sh --recursive` passes; grep finds no stale old top-level path in canonical docs |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Root tracking docs realigned (`spec.md` map, root `graph-metadata.json`, `description.json`, `before-vs-after.md`, `context-index.md`, `timeline.md`) | Each names the six tracks / new paths; `context-index.md` carries an OLD→NEW wave |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate.sh --recursive` on the 027 root returns 0 errors with all six parents recognized as phase parents.
- **SC-002**: No live reference to any old top-level `027/0NN-*` path remains in canonical navigable docs (frozen logs + the `context-index.md` history bridge excepted).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Deep path rewrites miss a nested file | Stale pointer breaks resume/traversal | Grep sweep over canonical docs as backstop; deterministic identity re-derivation |
| Risk | Shared git index across sessions | Unrelated work swept into a commit | Scoped `git commit --only -- <027 subtree>`; verify `git show --stat` |
| Dependency | `gen-timeline.py` auto-discovers the tree | `timeline.md` must regenerate post-move | Regenerate and verify before commit |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: History-preserving moves (`git mv`) so `git log --follow` continues to work.

### Security
- **NFR-S01**: No secrets introduced; move-only operation over existing tracked content.

### Reliability
- **NFR-R01**: Operation lands atomically as one reviewable scoped commit; a half-moved tree never persists.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Untracked leftovers (review/scratch artifacts): relocated to the new path alongside tracked content so no stray old dir survives.
- Frozen research logs (`*.jsonl`/`*.out`/`*.err`): left intact; they record audit-time paths.

### Error Scenarios
- `git mv` failure mid-run: script exits on first failure; partial state is recoverable (moves are reversible).

### State Transitions
- Daemon metadata re-derive churn: captured in a separate baseline commit so the reorg diff stays rename-only.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | 30 phase moves, ~1400 renames, ~850 files rewritten |
| Risk | 12/25 | Move-only; no behavior change; reversible |
| Research | 6/20 | Structure mapped against the 026 precedent |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None open; shape, numbering, and active-phase handling were settled before execution.
<!-- /ANCHOR:questions -->
