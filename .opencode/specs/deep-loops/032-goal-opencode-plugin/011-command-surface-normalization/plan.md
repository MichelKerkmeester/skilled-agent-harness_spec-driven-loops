---
title: "Implementation Plan: Phase 11: command-surface-normalization"
description: "Rename the /goal command to one evidence-backed canonical name and sweep all referencing surfaces; reconcile two config-contract gaps."
trigger_phrases:
  - "implementation"
  - "plan"
  - "command surface normalization"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/032-goal-opencode-plugin/011-command-surface-normalization"
    last_updated_at: "2026-07-01T10:04:52Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored plan from deep-review + deep-research findings"
    next_safe_action: "Run /speckit:implement on this phase"
    blockers:
      - "Live command filename must be re-verified at execution time"
    key_files:
      - ".opencode/commands/goal_opencode.md"
    session_dedup:
      fingerprint: "sha256:1a51b870376748c8d6f592aa3a2df352d14e9b1b107da76d42456165248d6c1e"
      session_id: "scaffold-032-011"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 11: command-surface-normalization

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown command router (`.opencode/commands/`), JSON graph metadata, `mk-goal.js` (Node/ESM) |
| **Framework** | OpenCode command-file naming convention (filename → slash invocation) |
| **Storage** | N/A (documentation + one small `mk-goal.js` behavior change) |
| **Testing** | Repo-wide `grep`/`rg` sweep + existing `mk-goal-*.test.cjs` suite for the code-touching requirements (REQ-005/006) |

### Overview
A `git mv` (or `mv` + doc updates) of the command file to its final name, followed by a mechanical grep-and-fix sweep across ~9 referencing surfaces, plus two small `mk-goal.js` contract reconciliations.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md)
- [x] Success criteria measurable (grep returns zero stale hits)
- [ ] Live filename re-verified at execution time (REQ-001 — must happen at the START of implementation, not during planning)

### Definition of Done
- [ ] All acceptance criteria (REQ-001–006) met
- [ ] Existing test suite still green after the `mk-goal.js` touches
- [ ] `implementation-summary.md` cites the fresh `grep` sweep output
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Mechanical rename + reference sweep (no new architecture).

### Key Components
- **Command file** (`.opencode/commands/{live-name}.md`): the file being renamed.
- **Phase 003/007/008 docs**: the specs that originally mandated the now-corrected name.
- **`graph-metadata.json` (phase 004)**: `key_files` array needing both the rename fix and the DR-007-P2 non-deliverable-file cleanup.
- **Feature catalogs / manual-testing playbooks**: operator-facing docs pointing at the command.
- **`ENV_REFERENCE.md`**: the `MK_GOAL_PLUGIN_DISABLED` contract description (REQ-005).
- **`mk-goal.js`**: `executeGoalAction` (REQ-004/005 dispatch logic), `/goal set` output builder (REQ-006).

### Data Flow
No runtime data-flow change beyond REQ-005/006 (both small, additive `mk-goal.js` behaviors). The bulk of this phase is static reference correction.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Planning from a deep-review CONDITIONAL verdict (`review/review-report.md`) and deep-research's confirmed no-collision finding (iteration 3). This is the canonical remediation for the packet's single most corroborated finding.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/commands/{live-name}.md` | The command file itself, renamed twice already | Rename to final canonical name (re-verify live name first) | `ls .opencode/commands/*goal*.md` shows exactly one file |
| `003-goal-command/{spec,plan,tasks,implementation-summary}.md` | Original (never-realized) mandate for `goal.md` | Update to reference the final live filename (`goal_opencode.md`) | `grep -n "goal.md\|opencode_goal\|goal_opencode"` in each file |
| `007-sk-prompt-goal-enhancement/tasks.md` | Cross-references `goal.md` (research F-009) | Update to final filename (`goal_opencode.md`) | Same grep |
| `008-system-spec-kit-integration/{spec,tasks}.md` | References the command surface for doc-routing purposes | Update to final filename | Same grep |
| `004-lifecycle-tracking/graph-metadata.json` `key_files` | Lists the command file plus non-deliverable files (DR-007-P2) | Update filename reference AND strip non-deliverables | `cat graph-metadata.json \| jq .key_files` |
| Feature catalogs (`system-skill-advisor` 07--hooks-and-plugin, `system-spec-kit` 18--ux-hooks) | Operator-facing "how to use this" docs (DR-008) | Update stale command path | Read + grep both files |
| Manual-testing playbooks (`system-skill-advisor` 02--cli-hooks-and-plugin, `system-spec-kit` 18--ux-hooks) | Manual test scenario instructions (DR-008) | Update stale command path | Read + grep both files |
| `ENV_REFERENCE.md` `MK_GOAL_PLUGIN_DISABLED` entry | Documents the kill-switch contract (DR-010-P1) | Correct to match the chosen implementation (fail-closed or injection/autonomy-only) | Diff doc wording against `mk-goal.js` behavior post-fix |
| `mk-goal.js` `executeGoalAction` | Unknown-verb dispatch + mutation status (DR-004-P2, DR-010-P2) | Add mutation-status field; reconcile unknown-verb behavior with the command doc's claim | Existing test suite green + manual `/goal set` invocation showing the new field |

Required inventories:
- Same-class producers: `rg -n 'opencode_goal|goal_opencode|commands/goal\.md' .` (excluding `.git/`, `changelog/`, `research/`) to build the complete reference list before editing anything.
- Consumers of changed symbols: N/A for the rename itself (pure string/path references); for REQ-005/006, `rg -n 'MK_GOAL_PLUGIN_DISABLED|executeGoalAction' .opencode/plugins/mk-goal.js .opencode/plugins/tests/*.test.cjs` to find every consumer of the changed behavior.
- Matrix axes: (a) command file itself, (b) phase docs that specified it, (c) generated metadata (`graph-metadata.json`), (d) operator-facing discovery docs (catalogs/playbooks), (e) env-reference docs, (f) the two small code behaviors (REQ-005/006).
- Algorithm invariant: after this phase, a `grep -rn "opencode_goal\|goal_opencode"` across the whole repo (excluding historical/archival paths) must return **zero** hits — that is the single verifiable invariant this phase exists to establish.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] REQ-001: re-verify the live command filename (`ls .opencode/commands/*goal*.md`) — do not proceed on this document's assumption.
- [ ] Build the complete reference inventory via the repo-wide grep in the Affected Surfaces section.

### Phase 2: Core Implementation
- [ ] Rename the command file to the final canonical name.
- [ ] Update all ~9 referencing surfaces identified in the inventory.
- [ ] REQ-004: reconcile the unknown-verb-fails claim with actual dispatch behavior.
- [ ] REQ-005: fix `MK_GOAL_PLUGIN_DISABLED`'s contract (code or docs, whichever direction is chosen).
- [ ] REQ-006: add the mutation-status field to `/goal set` output.

### Phase 3: Verification
- [ ] Repo-wide grep for both retired filenames returns zero hits outside historical/archival paths.
- [ ] Existing 6-file test suite still passes, freshly executed.
- [ ] Manual `/goal set` invocation shows the new mutation-status field.
- [ ] `implementation-summary.md` filled with fresh evidence.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static sweep | Repo-wide stale-reference check | `grep -rn`/`rg -n` for both retired filenames |
| Regression (existing) | `mk-goal.js` changes from REQ-004/005/006 must not break the existing suite | `node --test` / direct execution, all 6 files |
| Manual | `/goal set` shows mutation status; `MK_GOAL_PLUGIN_DISABLED` behaves per the chosen contract | `node -e` ad hoc invocation against the live module |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| Phase 010 (security-and-correctness-fixes) | Internal | Should land first (soft dependency) | If not yet landed, proceed anyway; expect to re-touch a few `mk-goal.js` lines once it does |
| Phase 009 (owned by a separate in-flight session) | External/concurrent | Unknown — actively causing the filename churn this phase fixes | Check phase 009's own scope/handover before renaming, per spec.md's Open Question |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the rename or doc sweep breaks command discoverability, or the `mk-goal.js` contract changes (REQ-005/006) regress an existing test.
- **Procedure**: the rename is a single `git mv` — revertible via `git mv` back; doc edits are isolated per-file and revertible via `git checkout -- <files>`; `mk-goal.js` changes are isolated to `executeGoalAction` and revertible the same way as phase 010's rollback.
<!-- /ANCHOR:rollback -->
