---
title: "Implementation Plan: the sk-design root router reads like its peers"
description: "Move the intent-model code block into its own machine-readable section, declare DEFAULT_RESOURCE, renumber, and rewrite the closing section as the bulleted contract every peer carries."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: the sk-design root router reads like its peers

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

The root-router contract validator reports zero issues for all six hubs. `sk-design` still reads
differently from every one of them: no machine-readable section, no `DEFAULT_RESOURCE`, closing
section numbered 3 instead of 4, and a prose paragraph where the peers carry a bulleted contract.
The convention lives in the template and in what the peers do, and no gate encodes it.

### Overview

Rewrite the router to the peer skeleton without touching a keyword or a resource path.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The problem statement and frozen scope are in `spec.md`
- [x] Success criteria are observable commands, not adjectives
- [x] The mode rename landed, so the intent table can name final mode names

### Definition of Done
- [x] Every acceptance criterion in `acceptance-criteria.md` is `Met`, `Waived` or `Superseded`
- [x] The sixteen-phrase replay is byte-identical after the rewrite
- [x] `validate.sh --strict` prints `RESULT: PASSED` for this folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Conform to an existing shape rather than invent one. Two peers plus the template agree on it.

### Key Components

- **`## 3. MACHINE-READABLE ROUTER`**: the code block with the replay note the peers carry.
- **`DEFAULT_RESOURCE`**: declared empty, with the reason written down.
- **An intent table**: five intents, four modes, and what each request is asking for.
- **`## 4. HOW TO READ THIS`**: dominant intent, near-ties, same-mode ties, UNKNOWN fallback.

### Data Flow

Unchanged. The block stays the byte-for-byte replay source; only its placement and framing move.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Change |
|---------|--------|
| `.opencode/skills/sk-design/ROUTER.md` | Section skeleton, `DEFAULT_RESOURCE`, intent table, closing contract, H1 aligned to the frontmatter title |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Step | What | Gate |
|------|------|------|
| 1 | Read two peers and the template to find the actual convention | The three agree |
| 2 | Split the code block into its own numbered section with the replay note | Skeleton matches |
| 3 | Declare `DEFAULT_RESOURCE` and add the intent table | Both present |
| 4 | Renumber and rewrite the closing section | Four bullets covering the routing rules |
| 5 | Replay | Byte-identical |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Check | How |
|-------|-----|
| Contract | The root-router validator, which passed before and therefore proves only that nothing broke |
| Paths | Every `RESOURCE_MAP` entry resolved against disk |
| Routing | Sixteen-phrase replay diffed against the closing-phase capture |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Depends on | Nature |
|-----------|--------|
| `006` | The router should name final mode names |
| The peer routers | They are the convention this conforms to |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the file. Nothing generated depends on it and no cache needs refreshing.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| This phase | Depends on | Blocks |
|-----------|-----------|--------|
| `009-router-conformance` | `006` | Nothing |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Item | Size |
|------|------|
| Files | 1 |
| Lines | 80 to 115 |
| Commits | shared with `010` |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No keyword or resource path edited
- [x] Replay compared byte for byte
- [x] Every path resolved against disk

### Rollback Procedure
1. Revert the file
2. Replay; the sixteen phrases were unchanged either way

### Data Reversal

None. Prose and structure only.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
006 renames landed
        |
        v
read two peers + template -> find the real convention
        |
        v
split code block -> declare DEFAULT_RESOURCE -> add intent table
        |
        v
renumber -> rewrite closing contract -> replay (identical)
```

### Dependency Matrix

| Step | Needs | Produces |
|------|-------|----------|
| Read peers | Two conformant routers | The convention, written nowhere |
| Rewrite | The convention | A router shaped like its peers |
| Replay | A rebuild | Proof nothing moved |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

Reading the peers first. The validator passes either way, so the only way to find the convention is to read what conforms to it.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Evidence |
|-----------|----------|
| Peer skeleton | Four numbered sections matching the peers |
| Paths resolve | 14 of 14 |
| Routing unchanged | Replay byte-identical at generation 653 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Conform to the peers, not to the validator

**Status**: Accepted

**Context**: The root-router contract validator reports zero issues for `sk-design` both before and
after this rewrite. It checks frontmatter, required sections and path resolution, not the section
skeleton the template and every peer share.

**Decision**: Treat the template plus two conformant peers as the standard, and rewrite to match.

**Consequences**:
- A reader who knows one hub's router can read this one.
- A replay tool finds the machine-readable block where it finds every other hub's.
- Nothing enforces this, so it can drift again. Recorded as an open question rather than solved.

**Alternatives Rejected**:
- Leave it: it passes its gate and reads unlike every peer, which is how it went unnoticed.

---


<!-- SCAFFOLD_AI_PROTOCOL_MARKERS:
AI EXECUTION
Pre-Task Checklist
Execution Rules
Status Reporting Format
Blocked Task Protocol
-->
