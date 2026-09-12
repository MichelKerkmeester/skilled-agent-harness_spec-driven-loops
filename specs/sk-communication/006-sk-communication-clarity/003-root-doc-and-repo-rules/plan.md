---
title: "Implementation Plan: Phase 3: root-doc-and-repo-rules"
description: "Apply the adopted allocations surface by surface, landing each rule file together with its router row, and verify one instruction per mark afterwards."
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
| **Testing** | A trigger-table walk and a per-mark contradiction scan |

### Overview

Work one surface at a time, in reach order: the rule files first, then the router rows that make
them reachable, then the root doc last and only for clauses that cannot live below. A new rule file
and its router row land in the same change, because a file with no trigger row is a rule that never
loads and a trigger row pointing at nothing is a broken router.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

A three-tier governance stack, ordered by reach. The root doc binds unconditionally, the rule files
bind when the router's trigger matches the action about to be taken, and general judgment fills the
rest. A clause belongs on the highest tier whose reach it actually needs, and no higher.

### Key Components
- **`AGENTS.md` §8 and §3**: the clauses that must bind when no rule file loads.
- **`REPO RULES.md`**: the trigger table, the index and the scope statement. It holds no rules.
- **`repo-rules/communication.md`**: reply shape, fires on every substantive reply.
- **`repo-rules/presenting-decisions.md`**: the shape of a handed-over decision.
- **`repo-rules/handoff-and-questions.md`**: the handback and the question surface.
- **New rule files**: one per recommendation cluster no existing file owns.

### Data Flow

The action about to be taken selects trigger rows. Selected rows name rule files. Rule files bind,
below the root doc and below a live operator instruction. Nothing else discovers a rule file, so
the router is the single reachability path and the thing to verify.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase changes shared policy, so the table applies in full rather than as a not-applicable
record.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `REPO RULES.md` trigger table | The only path from an action to a rule file | Update, one row per new or renamed rule | Walk every row and open every file it names |
| `REPO RULES.md` index | The human-readable roster of rules | Update alongside the trigger table | Row count matches the file count under `repo-rules/` |
| `repo-rules/communication.md` | Reply shape, broadest trigger in the set | Update with adopted bans | Read the file end to end, and check its length discipline |
| `repo-rules/presenting-decisions.md` | Decision shape | Update where allocated, otherwise unchanged | Diff review against the allocation table |
| `repo-rules/handoff-and-questions.md` | Handback and question surface | Update where allocated, otherwise unchanged | Diff review against the allocation table |
| `AGENTS.md` §3 and §8 | Binds when nothing loads | Update only for clauses that cannot live below | Each added clause states why it cannot live below |
| Other `repo-rules/*.md` | Not communication-shaped | Not a consumer | Confirm they are absent from the diff |

Required inventories:
- Same-class producers: every file that gives a punctuation or construction instruction. `rg -n 'em dash|semicolon|serial comma|colon|fragment' AGENTS.md 'REPO RULES.md' repo-rules/`
- Consumers of changed symbols: every document that cites a changed rule file by name or path. `rg -n 'communication\.md|presenting-decisions\.md|handoff-and-questions\.md' . --glob '*.md'`
- Matrix axes: surface tier and adopted recommendation. The required rows are the adopted rows of the allocation table.
- Algorithm invariant: one instruction per mark across the whole stack. Adversarial cases are a mark named in two files, a mark named in a rule and in the root doc, and a mark whose instruction differs between its ban and its suggested replacement.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | None, these are governance documents with no executable surface | Not applicable |
| Integration | Trigger-table reachability both ways, and one instruction per mark | `rg`, plus opening every file the table names |
| Manual | Each added paragraph names a failure specific enough to argue with | Read the diff, not a grep of it |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 002 allocation table | Internal | Red until phase 002 closes | No authorized scope, the phase cannot open |
| Operator approval for a root-doc change | External | Yellow | Rule-file changes still land, the root-doc clauses wait |
| The rule-authoring contract for a new rule file | Internal | Green | A new file ships without its standard header and fails its own gate |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A landed clause degrades replies, or two rules are found to disagree after the change.
- **Procedure**: Each surface is one file, so reverting is per file. Revert the root doc first, because its reach is widest, then the rule file, then the router row that named it. A new rule file is removed together with its trigger and index rows, never before them.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Rule files ──► Router rows ──► Contradiction scan ──► Root doc clauses ──► Handoff to 004
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Rule files | Phase 002 allocation table | Router rows |
| Router rows | Rule files | Contradiction scan |
| Contradiction scan | Router rows | Root doc clauses |
| Root doc clauses | Contradiction scan, operator approval | Handoff to 004 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 30 minutes re-reading the current text of each surface |
| Core Implementation | High | 4 to 8 hours, because rule prose is the product here |
| Verification | Medium | 1 hour for the trigger walk and the contradiction scan |
| **Total** | | **About 6 to 10 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes)
- [ ] Feature flag configured
- [ ] Monitoring alerts set

### Rollback Procedure
1. Revert `AGENTS.md` first, because its reach is widest and its effect is immediate
2. Revert the affected rule file
3. Remove the router trigger and index rows that named a removed file
4. Re-run the trigger-table walk, so the router does not name a file that no longer exists

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Not applicable, these are version-controlled documents
<!-- /ANCHOR:enhanced-rollback -->

---

