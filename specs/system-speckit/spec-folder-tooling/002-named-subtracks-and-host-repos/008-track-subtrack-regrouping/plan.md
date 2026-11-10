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
Each approved map moves 174 active packets in ten qualifying `specs/<track>/` roots into 39 one-level named subtracks. Each moved packet keeps its slug and receives a number from 001 in its original order, while the two pinned packets and every `z_archive/` stay in place. Packet numbering and JSON metadata align with each new folder. Per-track sweeps, strict validation, and the Markdown link checker provide the required pre-commit gates, and the trigger index is rebuilt after all tracks.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [x] `rg -n 'ten approved tracks|39 named subtracks|174 active packets' spec.md` prints the approved scope. Evidence: `spec.md` names ten qualifying tracks, 39 subtracks and 174 packets.
- [x] `rg -n 'AC-00[1-6]' acceptance-criteria.md` prints the six closure criteria. Evidence: the acceptance table has one row for each requirement REQ-001 through REQ-006.
- [x] `rg -n 'refresh-track-roots|repair-derived|check-markdown-links' spec.md` prints the required per-track tooling. Evidence: all three tool names appear under REQ-002 and REQ-004.

### Definition of Done
- [x] Every acceptance criterion is Met with evidence or has an approved decision record. Evidence: AC-001 through AC-006 are Met and cite the matching task evidence.
- [x] For each track, `node .skilled/skills/system-spec-kit/runtime/cli/spec/sweep-track-roots.mjs --specs specs/<track>` prints `all track roots match their declared children`. Evidence: all ten track sweeps printed that line.
- [x] All three per-track gates passed, and the trigger index was rebuilt after all tracks. Evidence: all ten tracks validated with 224 passed and 0 failed total. Link checks printed `0 broken markdown links`. The trigger index was rebuilt in `eb512ee196` and the merge.
- [x] `spec.md`, `plan.md`, `tasks.md`, and `acceptance-criteria.md` describe the same approved scope and gates. Evidence: each records ten tracks, 39 subtracks, 174 packets, the alignment rule, and the three gates.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Per-track filesystem regrouping

### Key Components
- **Approved grouping maps**: assign each active packet exactly once to one of the 39 named subtracks.
- **Path and metadata updates**: `git mv` packet folders, create subtrack descriptions, align `specId`, `parentChain`, `packet_id`, `spec_folder`, `parent_id` and `children_ids` then rewrite live path locators.

### Data Flow
The approved map determines each packet's subtrack and new number. The move keeps its slug and aligns the packet's JSON metadata with its new folder and actual ancestors. Live locators are rewritten, track-root metadata is refreshed, and each track passes the three gates before its commit.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `scripts/rotate-logs.sh`: owns the deletion. Action: update. WEAK: Various files. -->

Use this section to name the path, metadata, and locator surfaces changed by the regrouping.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `specs/<track>/<sub-track>/<NNN>-<slug>/` | Holds each moved active packet | Move | Compare the final tree with the approved map. Numbering starts at 001 with no gaps. |
| `specs/<track>/<sub-track>/description.json` | Describes a named subtrack | Create | The 39 approved subtracks each have a descriptor. |
| `specs/<track>/<sub-track>/<NNN>-<slug>/description.json` | Stores each packet's number and parent chain | Align | 0 of 311 flat-track and 0 of 2521 regrouped packet descriptions are out of line. |
| `specs/<track>/<sub-track>/<packet>/graph-metadata.json` | Stores each packet's identity and children | Align | All 2521 files have matching `packet_id`, `spec_folder`, `parent_id` and `children_ids`. |
| `specs/<track>/graph-metadata.json` | Declares each track root's direct children | Modify | `node .skilled/skills/system-spec-kit/runtime/cli/spec/sweep-track-roots.mjs --specs specs/<track>` printed `all track roots match their declared children`. |
| Tracked files with live moved packet paths | Locate current packet folders | Modify | `node .skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs` reports 0 broken links. |
| Historical spec docs containing a moved live locator | Preserve history while linking to a current path | Modify only the moved path | The same Markdown link check reports 0 broken links. This is the approved deviation from `rename-pattern.md` section 2, which says to preserve historical spec docs. |
| Changelogs, research and review iteration logs, `.jsonl` event streams, `scratch/`, `evidence/`, and test fixtures | Record historical events and test state | Unchanged | Confirm the excluded paths remain outside the move list. |
| Generated indexes | Derived search data | Regenerate | Run `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs` after all tracks. |

Required inventories:
- Same-class producers: N/A. No source behavior or symbols change.
- Consumers of changed symbols: N/A. No exported symbols change. Live path locators are handled above.
- Matrix axes: eligible active packets, two pinned packets, seven flat tracks, and each track's `z_archive/`.
- Algorithm invariant: each movable active packet appears exactly once under its approved named subtrack. Its number and JSON metadata match its folder and actual ancestors. Pinned packets and `z_archive/` remain unmoved.
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
| Git and the named system-spec-kit scripts | Internal | Used | The affected track cannot be moved, refreshed, or gated without them. |
| Operator-approved maps for all ten tracks | Internal input | Applied | The packet placement cannot be inferred or substituted. |
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

