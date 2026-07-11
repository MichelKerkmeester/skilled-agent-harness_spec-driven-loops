---
title: "Feature Specification: Phase 11: command-surface-normalization [template:level_1/spec.md]"
description: "Stop the /goal command's filename churn (renamed twice already) and sweep every stale reference across code, phase docs, catalogs, and playbooks; fix two smaller config-contract gaps."
trigger_phrases:
  - "goal command rename"
  - "command surface normalization"
  - "goal_opencode filename"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/032-goal-opencode-plugin/011-command-surface-normalization"
    last_updated_at: "2026-07-01T10:04:52Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored spec from review DR-002/004-P2/007-P1/008/010 + research F-005-F-009"
    next_safe_action: "Run /speckit:plan or /speckit:implement on this phase"
    blockers:
      - "Live command filename must be re-verified at execution time — it has changed twice already (opencode_goal.md -> goal_opencode.md) and may move again"
    key_files:
      - ".opencode/commands/goal_opencode.md"
    session_dedup:
      fingerprint: "sha256:decb316f0132fdf9c5a15bcd7cb7fc1a9956366e7da9f4b71459c657c6d92ce3"
      session_id: "scaffold-032-011"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 11: command-surface-normalization

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-01 |
| **Branch** | `032-goal-opencode-plugin` |
| **Parent Spec** | ../spec.md |
| **Phase** | 11 |
| **Predecessor** | 010-security-and-correctness-fixes (code-stable first; this phase touches naming/docs only) |
| **Successor** | 012-regression-test-backfill |
| **Handoff Criteria** | Exactly one canonical command filename exists; grep for both retired names across the whole repo returns zero stale references outside historical changelogs/research archives |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This phase closes the single most corroborated finding from this packet's dual audit: both deep-research (F-005 through F-009) and deep-review (DR-002/DR-007-P1/DR-008) independently found that the `/goal` command's file has never had a stable name, and it changed a **second time during the review itself** (a concurrent session working on phase 009 renamed it `opencode_goal.md` → `goal_opencode.md`).

**Scope Boundary**: naming and documentation only. Zero `mk-goal.js` runtime logic changes for the rename itself (that's phase 010, already independent). Two small config-contract fixes (DR-004-P2, DR-010) are bundled here because they're doc/contract-reconciliation work of the same character, not because they're related to the naming issue.

**Dependencies**: run after phase 010 lands so the renamed file's content reflects the corrected code, not a stale snapshot (avoids re-touching the same lines twice).

**Deliverables**: one canonical command filename, every referencing surface updated to match, two config-contract reconciliations.

**Changelog**: refresh `../changelog/changelog-032-011-command-surface-normalization.md` when this phase closes.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 003's docs mandated `.opencode/commands/goal.md`. Git history shows the command was added as `goal.md`, renamed to `goal_opencode.md`, renamed back to `goal.md` during this phase, then amended back to `goal_opencode.md`; `opencode_goal.md` was never a committed path. Research (iteration 3) proved via a `strings` search of the opencode 1.17.11 binary that **no built-in `/goal` command exists**, so there was never a real namespace collision forcing a prefix — this is unforced drift, and every doc, catalog, and playbook that references the command surface needed a final sweep.

### Purpose
Pick one canonical name backed by the confirmed no-collision evidence, sweep every referencing surface in one pass, and stop the churn.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Re-verify the live command filename at execution time (do not trust this spec's own snapshot — it has already changed twice).
- Rename to the evidence-backed canonical name (plain `goal.md` (later amended by the operator to `goal_opencode.md`), per research's confirmed no-built-in-collision finding) unless the live file has moved again, in which case re-derive fresh.
- Sweep all referencing surfaces: phase 003/007/008 `spec.md`/`plan.md`/`tasks.md`/`implementation-summary.md`; `graph-metadata.json` `key_files` (also strip non-deliverable files per DR-007-P2 while touching this); both feature catalogs (`system-skill-advisor` + `system-spec-kit`, `hooks-and-plugin`/`ux-hooks` paths); both manual-testing playbooks; `mcp_server/ENV_REFERENCE.md`.
- DR-004-P2: reconcile the command doc's claim that unknown verbs fail with actual dispatch behavior (currently any text coerces to `set`).
- DR-010-P1: decide and implement `MK_GOAL_PLUGIN_DISABLED`'s true contract (fail-closed on manual mutations, or narrow the docs to say it only disables injection/autonomy).
- DR-010-P2: add a `mutation=created|replaced|refreshed` field to `/goal set` output.

### Out of Scope
- `mk-goal.js` security/correctness fixes — phase 010 (already landed by the time this phase starts).
- New regression tests for the command/overlay-doc contract — phase 012.
- The `usage_limited` enum decision and packet-wide metadata cleanup — phase 013.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/commands/{current-live-name}.md` | Rename | To the evidence-backed canonical name (re-verify at execution time) |
| `032-goal-opencode-plugin/003-goal-command/{spec,plan,tasks,implementation-summary}.md` | Modify | Fix filename references |
| `032-goal-opencode-plugin/007-sk-prompt-goal-enhancement/tasks.md` | Modify | Fix the `goal_opencode.md` cross-reference (research F-009) |
| `032-goal-opencode-plugin/008-system-spec-kit-integration/{spec,tasks}.md` | Modify | Fix filename references |
| `032-goal-opencode-plugin/004-lifecycle-tracking/graph-metadata.json` | Modify | Strip non-deliverable files from `key_files` (DR-007-P2) |
| `.opencode/skills/system-skill-advisor/feature_catalog/hooks-and-plugin/goal-opencode-plugin.md` | Modify | Fix stale command path (DR-008) |
| `.opencode/skills/system-spec-kit/feature_catalog/ux-hooks/goal-opencode-plugin.md` | Modify | Fix stale command path (DR-008) |
| `.opencode/skills/system-skill-advisor/manual_testing_playbook/cli-hooks-and-plugin/goal-opencode-plugin.md` | Modify | Fix stale command path (DR-008) |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/ux-hooks/goal-opencode-plugin.md` | Modify | Fix stale command path (DR-008) |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modify | Fix `MK_GOAL_PLUGIN_DISABLED` contract description (DR-010-P1) |
| `.opencode/plugins/mk-goal.js` | Modify | `MK_GOAL_PLUGIN_DISABLED` fail-closed fix, `/goal set` mutation-status field, unknown-verb reconciliation |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Re-verify the live command filename before touching anything (it has changed twice already). | `ls .opencode/commands/*goal*.md` run at execution time; the plan below adapts to whatever it shows rather than assuming this spec's snapshot is current. |
| REQ-002 | One canonical command filename exists, backed by research's confirmed no-built-in-`/goal`-collision finding. | Exactly one `*goal*.md` file exists under `.opencode/commands/`; its name and its own body heading agree with each other. |
| REQ-003 | Every referencing surface listed in §3 Files to Change is updated to match the final filename. | `grep -rn` for both retired filenames (`opencode_goal.md`, `goal_opencode.md`) across the whole repo returns zero hits outside `changelog/`, `research/`, and other historical/archival paths. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | DR-004-P2: reconcile the command contract's unknown-verb-fails claim with actual dispatch behavior. | Either the dispatch code is changed to fail on truly unknown verbs, or the command doc is corrected to describe the actual coerce-to-`set` behavior — pick one and make code and doc agree. |
| REQ-005 | DR-010-P1: `MK_GOAL_PLUGIN_DISABLED` has one true, documented contract. | Either `executeGoalAction`/`executeGoalStatus` fail closed when the flag is set (manual mutations also blocked), or `ENV_REFERENCE.md` is corrected to say the flag only disables passive injection/autonomy — pick one and make code and doc agree. |
| REQ-006 | DR-010-P2: `/goal set` output reports mutation type. | Output includes a field distinguishing `created` vs `replaced` vs `refreshed` (same-objective re-set). |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `ls .opencode/commands/*goal*.md` shows exactly one file, and its body heading matches its filename's intended invocation.
- **SC-002**: `grep -rn "opencode_goal\|goal_opencode" .` (excluding `changelog/`, `research/`, `.git/`) returns zero hits.
- **SC-003**: REQ-004/005/006 each land with code and docs in agreement (no new contradiction introduced).
- **SC-004**: Existing 6-file test suite still passes after the `MK_GOAL_PLUGIN_DISABLED`/`/goal set` output changes (they touch `mk-goal.js`).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The command filename may have changed again since this spec was written — the concurrent phase-009 session is still active. | High — the entire rename plan hinges on this. | REQ-001 makes live re-verification the mandatory first step; do not proceed on this document's filename assumption. |
| Dependency | Phase 010 should land first so the renamed file's content reflects the corrected code. | Low — not a hard blocker, just avoids redundant edits. | If phase 010 hasn't landed yet, this phase can still proceed; just expect to re-touch a few lines once 010 lands. |
| Risk | Choosing "fail closed" for `MK_GOAL_PLUGIN_DISABLED` (REQ-005) is a behavior change, not just a doc fix. | Medium | Confirm with existing tests that no current behavior relies on manual mutations working while disabled; if any does, prefer the doc-narrowing resolution instead. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- REQ-002: if the live file has moved to a *third* name by execution time, is `goal.md` (this phase's original choice, later amended by the operator to `goal_opencode.md`) still the right target, or has the concurrent phase-009 session established a different convention that should be respected instead? Check phase 009's own scope/handover before renaming, to avoid a fourth rename.
<!-- /ANCHOR:questions -->
