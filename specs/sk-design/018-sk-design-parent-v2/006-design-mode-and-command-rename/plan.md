---
title: "Implementation Plan: give the moved modes and commands the hub's name"
description: "Rename both moved modes and their commands to the hub they now belong to, as renames, with every live reference following and the routing re-measured."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: give the moved modes and commands the hub's name

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

Chart and diagram moved to `sk-design` in the cutover but kept `sk-create-` in their mode names and
`/create:` in their commands. Phase 004 judged the rename cost without benefit; the operator has
since decided otherwise, and the closing phase produced evidence the mismatch is not cosmetic.

249 tracked files sit inside the two mode trees. Outside them, 43 live references name the chart mode
and 122 name the diagram mode, spread across both hubs' metadata, four runtime agent mirrors, the
command surface, a hook, a Python scorer shim, and the compiled-routing inputs. Roughly 527 files
under `specs/` also name them and are historical.

### Overview

Rename both trees, sweep every live reference, move both commands onto the `/design:` surface as a
hard cut, rebind them from the markdown agent to the design agent, regenerate every generated
artifact, then rebuild and replay.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The problem statement and frozen scope are in `spec.md`
- [x] Success criteria are observable commands, not adjectives
- [x] The closing phase measured the fleet, so the rename lands on a known-good baseline

### Definition of Done
- [x] Every acceptance criterion in `acceptance-criteria.md` is `Met`, `Waived` or `Superseded`
- [x] The sixteen-phrase replay is identical to the pre-rename capture
- [x] `validate.sh --strict` prints `RESULT: PASSED` for this folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Rename plus reference sweep. Nothing about routing behaviour changes; only the names by which it is
addressed.

### Key Components

- **`sk-design-chart/`, `sk-design-diagram/`**: the renamed trees, 249 files.
- **`/design:chart`, `/design:diagram`**: the commands, with assets following the design family's
  convention of dropping the family prefix.
- **The design agent**: gains both commands and a corrected capability table.
- **The markdown agent**: loses both, in every runtime mirror.
- **Generated artifacts**: leaf manifests, derived blocks, command bridges, the trigger index, and the
  compiled-routing manifests, all regenerated rather than hand-edited.

### Data Flow

A chart request scores against the hub's `intent_signals`, the hub resolves the CHART intent, and
`sk-design-chart/SKILL.md` takes over. The rename touches the addresses, not the path.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Change |
|---------|--------|
| Both mode trees | 249 renames |
| Both commands and their six assets | 8 renames onto the `/design:` surface |
| `sk-design` registry, router, command metadata, graph and description | Mode and command names |
| The design agent, in five runtime forms | Claims four modes and both new commands |
| The markdown agent, in five runtime forms | Stops claiming chart and diagram |
| `post-edit-router.cjs` and its playbook doc | A genuine runtime path |
| The Python scorer shim and the command bridges | Regenerated |
| The compiled-routing canary fixtures | Mode names |
| Two diagram docs named for the old command | Renamed to match |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Step | What | Gate |
|------|------|------|
| 1 | Pin the pre-rename replay as the comparison target | The file exists before anything moves |
| 2 | Rename both trees | `git diff --cached -M` shows 249 renames |
| 3 | Sweep live references; leave `specs/` and historical reports alone | No live path resolves to an old name |
| 4 | Move both commands and their assets; delete the `/create:` entry points | The design family holds three commands |
| 5 | Rebind the agents across every runtime mirror | The mirror-sync checker passes |
| 6 | Regenerate every generated artifact | Leaf manifests, derived blocks, bridges, trigger index, compiled routing |
| 7 | Rebuild and replay | Identical to the pinned baseline |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Check | How |
|-------|-----|
| History preserved | `git diff --cached --name-status -M`, requiring `R` |
| Nothing stopped arriving | Sixteen-phrase replay diffed against the pinned pre-rename capture |
| The new names route | The two mode names and a command-shaped phrase, replayed |
| The hub is internally consistent | Fleet metadata audit, which checks that every choreography resource resolves |
| The skill still builds | `check-corpus.cjs --render` from the renamed path |
| The branch can be pushed | The compiled-routing guard |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Depends on | Nature |
|-----------|--------|
| `005-closure-and-routing-proof` | Supplies the measured baseline the replay is compared against |
| The agent mirror-sync checker | Five runtime forms per agent must agree |
| The compiled-routing guard | Runs on push, not in any gate sweep |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the commit, then regenerate the trigger index and rebuild the advisor. The rename is one
commit covering both trees, both commands, both agents and every generated artifact, so a single
revert restores the previous names with history intact. Nothing outside the repository is touched and
no state is stored.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| This phase | Depends on | Blocks |
|-----------|-----------|--------|
| `006-design-mode-and-command-rename` | `005` | `007` and `008`, both of which should name the final modes |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Item | Size |
|------|------|
| Files renamed | 249 mode files plus 8 command files plus 2 docs |
| Live references rewritten | 138 files |
| Historical references left alone | 527 files under `specs/`, plus 8 benchmark reports |
| Generated artifacts regenerated | 6 kinds |
| Commits | 1 |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] The pre-rename replay pinned before anything moved
- [x] Renames verified as `R` before committing
- [x] Every generated artifact regenerated by its own tool, never hand-edited
- [x] The compiled-routing guard run before pushing rather than at push time

### Rollback Procedure
1. `git revert` the rename commit
2. Regenerate the trigger index
3. Rebuild the advisor daemon and observe the generation move
4. Replay: the sixteen phrases should be unchanged, since the rename did not move them

### Data Reversal

None. This phase renames files and rewrites references. No state is stored.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
005 measured baseline
        |
        v
pin pre-rename replay (unrepeatable once names move)
        |
        v
rename 249 files -> sweep 138 live references
        |
        v
move 8 command files -> hard cut, no forwarders
        |
        v
rebind agents across 5 runtime forms each
        |
        v
regenerate: leaf manifests, derived, bridges, trigger index, compiled routing
        |
        v
rebuild (649 -> 650) -> replay -> identical to baseline
```

### Dependency Matrix

| Step | Needs | Produces |
|------|-------|----------|
| Pin | A tree nobody has renamed | The comparison target |
| Rename | The pin | Two hub-named mode trees |
| Sweep | The rename | Live references that resolve |
| Commands | The sweep | A three-command design family |
| Agents | The commands | Mirrors that agree |
| Regenerate | All of the above | Generated artifacts matching their sources |
| Replay | An explicit rebuild | Proof the rename cost nothing |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

Pinning the pre-rename replay is first because it cannot be recaptured. After that the constraint is
the single commit: both hubs, both commands, both agents and the compiled routing must land together,
because a router signal naming a packet that is not on disk fails whichever hub is wrong.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Evidence |
|-----------|----------|
| Trees renamed | 249 renames, all `R` |
| Commands moved | `/design:chart` and `/design:diagram` resolve; the `/create:` paths are gone |
| Agents rebound | Mirror-sync checker passes for both agents |
| Routing unchanged | Replay byte-identical to the pinned baseline at generation 650 |
| The new names route | `sk-design-chart` and `sk-design-diagram` at 0.9139 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Rename, reversing phase 004's ADR-002

**Status**: Accepted, superseding `004`'s ADR-002

**Context**: Phase 004 kept the `sk-create-` prefix because a rename doubles the path rewrite across
four mirrors, the scorer shim, the command bridges and the canaries, and bought nothing measurable.

**Decision**: Rename both modes and both commands, on operator instruction.

**Consequences**:
- 138 live reference files rewritten and 249 files moved, which is the cost `004` predicted.
- The measured benefit `004` could not have known: the closing phase found a compiled bundle rule and
  four playbook fixtures that survived precisely because the old name kept the old association alive.
- The new mode names score 0.9139, above the 0.82 the old ones scored.

**Alternatives Rejected**:
- Keep the prefix: leaves two modes named for a hub they left.

### ADR-002: Hard cut, no command forwarders

**Status**: Accepted

**Context**: `/create:chart` and `/create:diagram` could stay as thin routers forwarding to the new
names.

**Decision**: Remove them. One name per command.

**Consequences**:
- A caller using the old name gets a clean absence rather than a silent redirect.
- The command surface does not double across four regenerated runtime mirrors.

**Alternatives Rejected**:
- Keep forwarders: doubles a surface that is regenerated in four places, to preserve a name the
  operator asked to retire.

### ADR-003: Historical records keep the old names

**Status**: Accepted

**Context**: 527 files under `specs/` and 8 benchmark report directories name the old modes.

**Decision**: Leave every one of them. Only live references follow the rename.

**Consequences**:
- A grep for the old name still returns hits, permanently, and that is correct.
- A benchmark report from 2026-08-12 still describes the tree it actually ran against.

**Alternatives Rejected**:
- Sweep everything: was attempted mid-phase and reverted. It rewrote eight benchmark reports into
  describing a run that never happened.

---


<!-- SCAFFOLD_AI_PROTOCOL_MARKERS:
AI EXECUTION
Pre-Task Checklist
Execution Rules
Status Reporting Format
Blocked Task Protocol
-->
