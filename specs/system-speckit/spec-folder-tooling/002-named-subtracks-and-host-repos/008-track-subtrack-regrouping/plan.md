---
title: "Implementation Plan: Phase 8: track-subtrack-regrouping"
description: "Apply ten approved track maps as one-level filesystem regroupings with per-track metadata and live path updates. Require the three specified gates before each track commit, then rebuild the trigger index."
trigger_phrases:
  - "track subtrack regrouping plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 8: track-subtrack-regrouping

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Git path moves, JSON metadata, Markdown references, and Node scripts |
| **Framework** | N/A. No application framework changes. |
| **Storage** | N/A. No service data store changes. |
| **Testing** | Per-track root sweep, recursive strict validation, and Markdown link check |

### Overview
Each approved map moves active packets in ten qualifying `specs/<track>/` roots into one-level named subtracks. Each moved packet keeps its slug and receives a number from 001 in its original order, while the two pinned packets and every `z_archive/` stay in place. Per-track sweeps, strict validation, and the Markdown link checker provide the required pre-commit gates, and the trigger index is rebuilt after all tracks.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [ ] `rg -n '10 qualifying tracks|40 subtracks|about 175' spec.md` prints the approved scope.
- [ ] `rg -n 'AC-00[1-5]' acceptance-criteria.md` prints the five planned closure criteria.
- [ ] `rg -n 'refresh-track-roots|repair-derived|check-markdown-links' spec.md` prints the required per-track tooling.

### Definition of Done
- [ ] Every acceptance criterion is Met with observed evidence or has an approved decision record.
- [ ] For each track, `node .skilled/skills/system-spec-kit/runtime/cli/spec/sweep-track-roots.mjs --specs specs/<track>` prints `all track roots match`.
- [ ] Recursive strict validation is no worse than the track baseline, the link check reports 0 broken, and the trigger index is rebuilt after all tracks.
- [ ] `spec.md`, `plan.md`, `tasks.md`, and `acceptance-criteria.md` describe the same approved scope and gates.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Per-track filesystem regrouping

### Key Components
- **Approved grouping maps**: assign each active packet exactly once to one of the 40 named subtracks.
- **Path and metadata updates**: `git mv` packet folders, create subtrack descriptions, update track-root metadata, and rewrite live path locators.

### Data Flow
The approved map determines each packet's subtrack and new number. The move keeps its slug, then live locators are rewritten, track-root and derived metadata are refreshed, and each track passes the three gates before its commit.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `scripts/rotate-logs.sh`: owns the deletion. Action: update. WEAK: Various files. -->

Use this section to name the path, metadata, and locator surfaces changed by the regrouping.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `specs/<track>/<packet>/` | Holds each active packet at its current path | Move | Compare `rg --files specs/<track>` with that track's approved map. |
| `specs/<track>/<sub-track>/description.json` | Describes a named subtrack | Create | Inspect each new descriptor and confirm `level` is `sub-track`. |
| `specs/<track>/graph-metadata.json` | Declares each track root's direct children | Modify | `node .skilled/skills/system-spec-kit/runtime/cli/spec/sweep-track-roots.mjs --specs specs/<track>` prints `all track roots match`. |
| Tracked files with live moved packet paths | Locate current packet folders | Modify | `node .skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs` reports 0 broken links. |
| Historical spec docs containing a moved live locator | Preserve history while linking to a current path | Modify only the moved path | The same Markdown link check reports 0 broken links. This is the approved deviation from `rename-pattern.md` section 2, which says to preserve historical spec docs. |
| Changelogs, research and review iteration logs, `.jsonl` event streams, `scratch/`, `evidence/`, and test fixtures | Record historical events and test state | Unchanged | Confirm the excluded paths remain outside the move list. |
| Generated indexes | Derived search data | Regenerate | Run `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs` after all tracks. |

Required inventories:
- Same-class producers: N/A. No source behavior or symbols change.
- Consumers of changed symbols: N/A. No exported symbols change. Live path locators are handled above.
- Matrix axes: eligible active packets, two pinned packets, seven flat tracks, and each track's `z_archive/`.
- Algorithm invariant: each movable active packet appears exactly once under its approved named subtrack. Pinned packets and `z_archive/` remain unmoved.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup counts the archives. Implementation adds `--keep`. Verification counts 3. WEAK: See tasks. -->

Setup records the 2026-11-10 validation and link baselines and uses the ten approved maps. Implementation applies one map per track, rewrites live locators, refreshes track roots, and repairs derived metadata. Verification runs all three gates for each track before its one commit, then rebuilds the trigger index after all tracks.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation, and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | N/A. No application code behavior changes. | None |
| Integration | Each qualifying track's direct children, recursive packet validation, and repository Markdown links | `sweep-track-roots.mjs`, `validate.sh`, `check-markdown-links.cjs` |
| Manual | Compare each moved packet and preserved exception against its approved map | Approved maps and track-tree inspection |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Git and the named system-spec-kit scripts | Internal | Required, not yet run | The affected track cannot be moved, refreshed, or gated. Stop before its commit. |
| Operator-approved maps for all ten tracks | Internal input | Approved, not yet applied | The packet placement cannot be inferred or substituted. Stop the affected track. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: A later check finds a packet in the wrong subtrack, a missing live path, or incorrect track metadata after that track's commit.
- **Procedure**: Revert that track's single commit with `git revert <track-commit>`, then rerun the three gates for the resulting state.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
<!-- FILL: Draw the phase order in the fence, then fill the table with depends-on and blocks. Write `N/A` with one reason, or delete the whole section. GOOD: Setup to Implementation to Verification. Verification blocks close. WEAK: Phases depend on each other. -->

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | The approved maps and the 2026-11-10 baseline | Implementation |
| Implementation | Setup and the map for the current track | Verification for that track |
| Verification | The current track's moves, live locators, and refreshed metadata | That track's one commit and the final trigger-index rebuild |
<!-- /ANCHOR:phase-deps -->

---

