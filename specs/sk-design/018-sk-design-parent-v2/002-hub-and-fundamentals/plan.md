---
title: "Implementation Plan: reinstate the sk-design parent hub"
description: "Convert the sk-design root from a standalone skill to a parent hub, move its content down into sk-design-fundamentals as the first mode, and measure the routing effect rather than assume it."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: reinstate the sk-design parent hub

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

`sk-design` is a standalone skill: a 501-line root `SKILL.md` doing both the routing and the work,
with `leaf-manifest.config.json` and `leaf-aliases.json` as its standalone identity files. The
metadata contract makes hub and standalone two classes, not two configurations of one class, so this
is a class change. Three files are required on a hub and forbidden on a standalone
(`description.json`, `mode-registry.json`, `hub-router.json`); `leaf-manifest.config.json` is the
mirror and must go.

### Overview

Convert the root, move today's content down into `sk-design-fundamentals/` as renames, and land it
as one commit so the shared branch never shows a hub root without its `SKILL.md`. Capture the
sixteen-phrase routing baseline **before** anything moves, because it cannot be recaptured
afterwards.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The problem statement and frozen scope are in `spec.md`
- [x] Success criteria are observable commands, not adjectives
- [x] The sixteen-phrase baseline is captured and committed to `scratch/routing-baseline.txt`

### Definition of Done
- [x] Every acceptance criterion in `acceptance-criteria.md` is `Met`, `Waived` or `Superseded`
- [x] The fleet metadata gate classifies `sk-design` class H with no forbidden file
- [x] `validate.sh --strict` prints `RESULT: PASSED` for this folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Two-stage hub routing. The advisor scores the hub as one identity; the hub's `hub-router.json`
and root `ROUTER.md` then pick the mode. Modes with `routingClass: "metadata"` are resolved by hub
membership and reach the advisor only through the hub's `graph-metadata.json`.

### Key Components

- **`ROUTER.md`**: the hub's intent model. Needs `router_state`, `version` and `skill_pointer` in
  frontmatter, `## OVERVIEW` and `## INTENT MODEL` sections, and `INTENT_SIGNALS` and `RESOURCE_MAP`
  as dictionaries whose paths resolve to declared leaves.
- **`mode-registry.json`**: declares which modes exist below the hub.
- **`hub-router.json`**: stage-two routing from an intent to a mode.
- **`description.json`**: the hub's advisor identity record.
- **`sk-design-fundamentals/`**: the former root content, moved down intact.

### Data Flow

A request is scored against the hub's `graph-metadata.json` `intent_signals`. If the hub wins,
`hub-router.json` and `ROUTER.md` resolve an intent to a mode, and the mode's own `SKILL.md` takes
over. Keywords in `description.json` play no part in the score.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Change | Why it must move with the rest |
|---------|--------|-------------------------------|
| `.opencode/skills/sk-design/SKILL.md` | Reduced to routing | A hub root that still does the work is not a hub |
| `.opencode/skills/sk-design/ROUTER.md` | Created | Required for an active hub root |
| `description.json`, `mode-registry.json`, `hub-router.json` | Created | Required on a hub |
| `leaf-manifest.config.json`, `leaf-aliases.json` | Deleted | Forbidden and generated, respectively |
| `leaf-manifest.json` | Regenerated | Must list the new mode's leaves |
| `sk-design-fundamentals/**` | 28 renames | The work the root used to do |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Step | What | Gate |
|------|------|------|
| 1 | Capture the sixteen-phrase baseline before touching anything | The file exists and is committed |
| 2 | Move the root content into `sk-design-fundamentals/` | `git diff --cached -M` shows renames |
| 3 | Author the hub root: `SKILL.md`, `ROUTER.md`, the three identity files | Fleet gate class H |
| 4 | Delete the standalone identity files, regenerate the leaf manifest | Fleet gate reports no forbidden file |
| 5 | Replay the sixteen phrases and diff against the baseline | Every phrase accounted for |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Check | How |
|-------|-----|
| Class contract | The fleet metadata audit, class H for `sk-design` |
| Stage-two resolution | `mode-registry.json` plus the regenerated `leaf-manifest.json` |
| Routing effect | Sixteen-phrase replay diffed against `scratch/routing-baseline.txt` |
| History preserved | `git diff --cached --name-status -M`, requiring `R` status |

A registry row is not proof a request arrives. Every routing claim comes from the replay.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Depends on | Nature |
|-----------|--------|
| The metadata contract in `sk-create-skill/references/shared/skill-root-metadata-contract.md` | Defines which files are required and forbidden per class |
| `016-deprecate-sk-design-interface` | This packet reverses its hub decision and keeps its scope decisions |
| Nothing else in this packet | This is step one; every other phase lands on what it leaves |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert `112d5471f4`. The commit is self-contained: the hub files it created, the standalone files
it deleted and the 28 renames all move together, so a single revert restores the standalone skill
with its history intact. Nothing outside `.opencode/skills/sk-design/` and this packet is touched.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| This phase | Blocks | Reason |
|-----------|--------|--------|
| `002-hub-and-fundamentals` | `003`, `004`, `001`, `005` | Nothing can be a mode of a hub that does not exist |

It depends on nothing. It is the first step by construction.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Item | Size |
|------|------|
| Files moved | 28, as renames |
| Files created | 5 |
| Files deleted | 2 |
| Commits | 1 |

The cost is concentrated in the root `SKILL.md` rewrite, not in the move.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] The routing baseline is captured and committed; it cannot be recaptured later
- [x] Renames verified with `git diff --cached --name-status -M` before committing
- [x] No intermediate state leaves the hub root without a `SKILL.md`

### Rollback Procedure
1. `git revert 112d5471f4`
2. Rebuild the advisor daemon and observe its generation move
3. Replay the sixteen phrases; they should match the baseline exactly

### Data Reversal

None. This phase moves and rewrites files. It stores no state and migrates no data.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
routing baseline (captured first, unrepeatable)
        |
        v
move root content -> sk-design-fundamentals (28 renames)
        |
        v
author hub root: SKILL.md, ROUTER.md, 3 identity files
        |
        v
delete standalone identity files, regenerate leaf manifest
        |
        v
replay 16 phrases, diff against baseline
```

### Dependency Matrix

| Step | Needs | Produces |
|------|-------|----------|
| Baseline | A tree nobody has touched | `scratch/routing-baseline.txt` |
| Move | Baseline captured | `sk-design-fundamentals/` |
| Hub root | The move | A class H root |
| Cleanup | The hub root | A gate that passes |
| Replay | All of the above | The regression this packet owns, named |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

The baseline is the critical step and it is first, because it is the only one that cannot be redone.
Everything after it is recoverable by revert. The single commit is the second constraint: on a shared
branch, an intermediate state without a root `SKILL.md` would break other sessions.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Evidence |
|-----------|----------|
| Baseline captured | `scratch/routing-baseline.txt` committed |
| Hub exists | Fleet gate class H |
| Fundamentals routes | Non-empty leaf set for the mode |
| Effect measured | Replay diffed; 15 of 16 unchanged, 1 regression named |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Convert the class rather than add hub files

**Status**: Accepted

**Context**: `sk-design` is a standalone skill. The metadata contract treats hub and standalone as
two classes with mirrored required and forbidden file sets, and the fleet gate enforces both halves.

**Decision**: Treat the conversion as a class change: add the three hub-required files and delete
`leaf-manifest.config.json` in the same commit.

**Consequences**:
- The gate passes on the first run rather than reporting a mixed class.
- The standalone identity is gone, so a revert is the only way back; that is acceptable because the
  commit is self-contained.

**Alternatives Rejected**:
- Add hub files and leave the standalone ones: fails the forbidden-file half of the gate.

### ADR-002: Leave the regressed phrase for phase 003

**Status**: Accepted

**Context**: The conversion creates a second identity carrying design vocabulary, and
`validate this design.md` drops below the bar because the phrase splits between them.

**Decision**: Record it as an acceptance criterion of phase 003 rather than tuning keywords here.

**Consequences**:
- One phrase is knowingly broken between two commits on a shared branch.
- No tuning work is done twice, because phase 003 merges the identities and would undo it.

**Alternatives Rejected**:
- Trim keywords now: the next phase makes the tuning meaningless.

---


<!-- SCAFFOLD_AI_PROTOCOL_MARKERS:
AI EXECUTION
Pre-Task Checklist
Execution Rules
Status Reporting Format
Blocked Task Protocol
-->
