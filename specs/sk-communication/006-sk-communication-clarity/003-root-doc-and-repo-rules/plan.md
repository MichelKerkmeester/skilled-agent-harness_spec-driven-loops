---
title: "Implementation Plan: Phase 3: root-doc-and-repo-rules"
description: "Split the reply-shape rule in two along the sentence-mechanics seam, route both halves, and record the two baselines every later phase measures against."
trigger_phrases:
  - "repo rules plan"
  - "router trigger row"
  - "one instruction per mark"
  - "root doc clause"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: root-doc-and-repo-rules

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown governance documents with YAML front matter |
| **Framework** | The router-and-rule-file pattern: `REPO RULES.md` routes, `repo-rules/*.md` bind |
| **Storage** | Version-controlled files at the repository root and under `repo-rules/` |
| **Testing** | A pure-move check across the two halves, a trigger-table walk in both directions, and two recorded baselines |

### Overview

This phase is a move rather than an authoring pass. The reply-shape rule takes ten of the
twenty-nine adopted candidates, the largest single allocation in the program, and it already records
its own length ceiling, so it is split before anything is added to it. The seam is the unit a rule
governs: sentence and paragraph mechanics on one side, whole-reply shape on the other.

The split lands a new half under `repo-rules/`, and its trigger row and index row land in the same
change, because a file with no trigger row is a rule that never loads and a row pointing at nothing
is a broken router. No rule sentence is added, removed or reworded by the move.

Two baselines are recorded while the change is made. The first is each half's size, so phases 006
and 008 can check their own additions against the size the split produced. The second is every
mark's existing instruction, so any later phase can show that no mark gained a second instruction.
Neither baseline can be reconstructed after the edit, which is why both are captured first.

The root doc is not in this phase's diff. Phase 002 found no clause that cannot live below it, so
`AGENTS.md` keeps its two binding clauses and its three pointers to the reply-shape rule, and the
router carries the reach of the new half instead.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified
- [ ] Phase 002's decision record is present, with every decision Accepted
- [ ] The pre-change text of the reply-shape rule is read in full rather than recalled
- [ ] The split seam is stated as the unit each rule governs, not as a topical grouping

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
- [ ] Both halves exist, and every rule sentence from the pre-change file appears exactly once
- [ ] The router reaches both halves, walked in both directions
- [ ] The per-half size baseline and the per-mark instruction baseline are recorded
- [ ] `AGENTS.md` is absent from the scoped diff
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

A three-tier governance stack, ordered by reach. The root doc binds unconditionally, the rule files
bind when the router's trigger matches the action about to be taken, and general judgment fills the
rest. The split happens inside the third tier and moves nothing between tiers.

One tier-3 obligation is now carried by two files. Each half states its own scope in its own header,
so a reader who loads one half is told what the other half owns rather than left to discover it.

### Key Components

- **`repo-rules/communication.md`**: the whole-reply half after the split. The ten candidates phase
  006 writes land here, which is what the split exists to make room for.
- **A new half file under `repo-rules/`**: sentence and paragraph mechanics. It carries the standard
  routed-from line, the bounded-by statement, a fires-when list and a self-check, like every other
  rule file in the set.
- **`REPO RULES.md`**: the trigger row and the index row that make the new half reachable. Both land
  in the same change as the file they name.
- **`AGENTS.md`**: unchanged. Its absence from the diff is checked rather than assumed, because it
  names the reply-shape rule in three places.

### Data Flow

The action about to be taken selects trigger rows. Selected rows name rule files. Rule files bind,
below the root doc and below a live operator instruction. Both halves of the split are reached the
same way, and the two rows may fire on the same action, which the router allows and expects. The
split is about how much one file asks a reader to hold, not about narrowing when a file loads.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase changes shared policy, so the table applies in full rather than as a not-applicable
record. The move touches two rule files and one router, and it leaves every other surface alone.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `repo-rules/communication.md` | Reply shape, broadest trigger in the set | Keep the whole-reply rules and move the sentence and paragraph mechanics into the new half | Compare both halves against the pre-change file and confirm every sentence appears exactly once |
| The new half under `repo-rules/` | Does not exist yet | Create it with the standard header, its own fires-when list and its own self-check | Read the header and the closing self-check, and confirm the routed-from line names the router |
| `REPO RULES.md` trigger table | The only path from an action to a rule file | Add one row for the new half | Walk every row and open every file it names |
| `REPO RULES.md` index | The human-readable roster of rules | Add one row for the new half | Index row count matches the file count under `repo-rules/` |
| `AGENTS.md` | Binds when nothing loads, and names the reply-shape rule in three places | No change, because no clause cannot live below and every pointer stays true | Confirm the file is absent from the diff, then read each pointer against the router |
| Other `repo-rules/*.md` | Not part of this move | No change | Confirm they are absent from the diff |
| Phase 005's baseline | The measurement's before | Capture it during setup, before the first edit | Date the capture against the first edit rather than against the phase's close |

Required inventories:
- Same-class producers: every file that gives a punctuation or construction instruction. `rg -n 'em dash|semicolon|serial comma|colon|fragment' "AGENTS.md" "REPO RULES.md" repo-rules/`
- Consumers of changed symbols: every document that cites the reply-shape rule by name or path. `rg -n 'communication\.md' . --glob '*.md'`
- Matrix axes: governed unit by half. The required rows are the sections of the pre-change file, and each one lands on exactly one side of the seam.
- Algorithm invariant: one instruction per mark across the whole stack, unchanged by a move that relocates instruction text. Adversarial cases are a mark whose instruction is split across the seam, a mark named in one half's self-check while the other half governs it, and a header sentence in one half that restates a rule the other half owns.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase
checkboxes and task state.

Setup produces the two captures and the section-to-half assignment. Implementation produces the
split and its two router rows. Verification proves the move was pure, walks the router in both
directions and records the two baselines.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | None, these are governance documents with no executable surface | Not applicable |
| Integration | Trigger-table reachability in both directions, and a pure-move check across the two halves | `rg`, plus opening every file the table names |
| Baseline | Each half's size, and every mark's instruction before and after the move | `wc`, and a read of the pre-change file |
| Manual | Each half read for a rule that belongs on the other side of the seam | Read both halves, not a grep of them |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 002's decision record | Internal | Green, eight decisions Accepted | Without it the punctuation scope is unset, and the colon decision is what keeps a mark's instruction out of this phase's diff |
| Phase 002's allocation table | Internal | Not yet recorded | No change beyond the split and the two baselines it names is authorized, so rule content waits for phases 006, 007 and 008 |
| The pre-change text of the reply-shape rule | Internal | Green, read during setup | A split made from memory would miss a section and duplicate another |
| The rule-file shape under `repo-rules/` | Internal | Green, every file under `repo-rules/` already carries it | A new half without the standard header fails its own gate |
| Phase 005's measurement baseline | Internal | The capture is this phase's setup step | Captured after the rules change, it cannot support a regression claim, which is why the capture sits here rather than in phase 005 |
| Phases 006 and 008, as consumers of both baselines | Internal | Pending, both phases unopened | A missing baseline leaves their size claims and their no-contradiction-added claims unbacked |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A half loads on the wrong action, or the move changed the instruction for a mark rather than relocating it.
- **Procedure**: The change is one diff across two rule files plus one router. Rejoin the two halves into `repo-rules/communication.md`, and remove the new half's trigger row and index row in the same change rather than before it. Then re-run the trigger walk, so no row names a file that no longer exists. The recorded baselines are evidence rather than state, so they stay as the record of what the pre-split rule looked like.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Pre-change capture ──► Split ──► Router rows ──► Baselines recorded ──► Handoff to phases 006 and 008
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Pre-change capture | The pre-change file, read in full | The split, because a capture taken after the move is not a before |
| Split | Pre-change capture | Router rows |
| Router rows | Split | The handoff, because an unreachable half is an unfinished split |
| Baselines recorded | Router rows | Phase 006's size claim, phase 008's size claim, and phase 005's before-and-after |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1 hour, mostly reading the pre-change file end to end and taking both captures |
| Core Implementation | Medium | 2 to 4 hours, because the work is a move of existing prose rather than new rule text |
| Verification | Medium | 1 hour for the pure-move check, the trigger walk and the two baseline records |
| **Total** | | **About 4 to 6 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] The pre-change text of the reply-shape rule is frozen, with its revision recorded
- [ ] The per-mark instruction set is captured before the first edit
- [ ] The router's current trigger table and index are read, so the change is a diff against them rather than a rewrite
- [ ] The split, the new half and both router rows are staged to land as one change

### Rollback Procedure
1. Revert the router rows and the two rule files in one change, because a row kept after its file is gone names nothing
2. Re-run the trigger-table walk, so the router is confirmed to name only files that exist
3. Re-read the recorded baselines, which stay as the pre-split record rather than being reverted with the files

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Not applicable, these are version-controlled documents
<!-- /ANCHOR:enhanced-rollback -->

---
