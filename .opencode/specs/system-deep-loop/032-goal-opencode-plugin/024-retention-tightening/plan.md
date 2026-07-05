---
title: "Implementation Plan: Phase 24: retention-tightening"
description: "Flip one constant plus its two doc mirrors, then run a one-time, word-split-safe archive migration over the existing .goal-state backlog scoped to files older than the new 2-day threshold."
trigger_phrases:
  - "goal state retention tightening plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/032-goal-opencode-plugin/024-retention-tightening"
    last_updated_at: "2026-07-04T19:00:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored plan and executed both deliverables"
    next_safe_action: "Phase complete"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-goal.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "032-phase-024-retention-tightening-20260704"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 24: retention-tightening

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ESM plugin (`mk-goal.js`) + two markdown env-var reference tables + one-time filesystem data migration |
| **Framework** | None |
| **Storage** | `.opencode/skills/.goal-state/*.json` (runtime data, not source) |
| **Testing** | `node --test .opencode/plugins/tests/*.test.cjs`; manual count verification for the migration |

### Overview
No new logic. A single numeric literal changes, its two documented mirrors change to match, and the pre-existing backlog is reconciled once by hand using the exact same staleness boundary the code now enforces automatically going forward.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Constant flip + one-time data migration; no new abstraction.

### Key Components
- **`DEFAULT_ACTIVE_RETENTION_DAYS` (mk-goal.js:34)**: `30` -> `2`. Consumed unchanged by `sweepOrphanedActiveStates` and `countOrphanCandidates` via `retentionDaysFromEnv(ACTIVE_RETENTION_DAYS_ENV, DEFAULT_ACTIVE_RETENTION_DAYS)`.
- **Doc mirrors**: `ENV_REFERENCE.md:683` and `goal_plugin.md:61` default columns updated to `2` to match.
- **Manual migration**: `find .opencode/skills/.goal-state -maxdepth 1 -name "*.json" ! -newermt "<cutoff>" -print0 | xargs -0 -I{} mv {} .opencode/skills/.goal-state/.archive/`, matching the plugin's own filename scheme (state files are already named `${sessionKeyForSession(id)}.json`, identical to what `archiveGoalStateFile` targets) and the archive directory's `0700` mode.

### Data Flow
No change to any function's logic. The migration only relocates files the way the code's own sweep would, at the moment of execution instead of on the next `session.created` event.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `DEFAULT_ACTIVE_RETENTION_DAYS` (:34) | 30-day default | 2-day default | Full suite green; grep confirms no test hardcodes the literal |
| `ENV_REFERENCE.md` / `goal_plugin.md` | State the old default | State the new default | Grep for `30` in the relevant rows returns nothing; `2` present |
| `.goal-state/*.json` backlog | 43 active files | 26 moved to `.archive/`, 17 left active | Post-move counts (26/17) match the pre-computed cutoff split |

Required inventories:
- `rg -n "DEFAULT_ACTIVE_RETENTION_DAYS\|ACTIVE_RETENTION_DAYS" .opencode/plugins/tests/*.test.cjs` returned no hits, confirming no test pins the literal default.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Baseline
- [x] Run the full plugin suite fresh (110/110 baseline)
- [x] Confirm no test hardcodes the retention-days default

### Phase 2: Core Implementation
- [x] Flip the constant; update both doc mirrors
- [x] Run the full suite again (110/110, unchanged)
- [x] Confirm operator's exact archive scope via `AskUserQuestion` before touching runtime data
- [x] Execute the migration with a word-split-safe pipeline (first attempt failed safely; redone with `-print0`/`xargs -0`)

### Phase 3: Verification
- [x] `node --check`, comment hygiene, alignment drift on `mk-goal.js`
- [x] Post-move counts (26 archived / 17 active) verified; archive dir mode `0700` confirmed; oldest surviving active file confirmed within the 2-day window
- [x] Write `implementation-summary.md`; set this phase's spec.md Status to Complete
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Regression | Full existing plugin suite (constant change only) | `node --test .opencode/plugins/tests/*.test.cjs` |
| Static | No literal-default assertions broken | `rg` |
| Manual | Migration count reconciliation | `find` + `ls` counts before/after |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| None | — | — | — |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any regression in the plugin suite after the constant change
- **Procedure**: Revert the single-line constant and the two doc rows via targeted `git checkout`. For the migration, every moved file is still present (relocated, not deleted) at `.opencode/skills/.goal-state/.archive/`; moving them back is a plain `mv` from `.archive/` to the parent directory
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:sequencing -->
## 8. SEQUENCING

Single small change, code-and-docs first (verified green), migration second (only after the operator's scope decision), verification last.
<!-- /ANCHOR:sequencing -->
