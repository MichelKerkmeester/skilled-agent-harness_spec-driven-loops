---
title: "Implementation Plan: Phase 5: history-rewrite"
description: "Five scripts and one gated window: a frozen plan from a pinned SHA, a mirror rewrite with invariants rehearsed at full scale, a citation remap from the commit map, a branch stamper for the lines left behind, and a force-push that waits for a written rollback and a fresh yes."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5: history-rewrite

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3 for the plan, callback and remap; bash for the runner and branch stamper; git filter-repo |
| **Framework** | git filter-repo commit and message callbacks over a mirror clone |
| **Storage** | the work directory: backup.git, mirror.git, plan.jsonl, commit maps, rewrite.log |
| **Testing** | unittest suites per script, a five-commit rehearsal in the suite, a full-scale rehearsal on a mirror with six invariants |

### Overview
The plan is built once from a pinned SHA and never minted inside a callback. The runner clones a bare backup and a mirror, checks the plan covers every commit on the named refs, stamps the trailers in a commit callback, remaps hash citations in messages in a second pass, and proves six invariants. The remapper fixes citations under specs/ from the commit map. The push is a separate step behind the operator's yes, and the backup is the rollback.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Plan, rewrite, remap, publish, in that order, each a separate script

### Key Components
- **build-commit-plan.py**: ordinals by topological order and packets by the refined cascade
- **stamp-callback.py**: pure message formatting and hash remapping for the callbacks
- **rewrite-run.sh**: clones, coverage check, two passes, invariants, rehearse mode, push lines
- **remap-citations.py**: prefix-exact citation remap under specs/ with a residue check
- **stamp-branch.sh**: ordinals for a branch's unique commits after it is rebased onto the new base

### Data Flow
The pinned SHA produces plan.jsonl. The runner reads the plan and the source into a mirror and emits commit-map. The remapper reads commit-map and rewrites the documents. The operator reads the invariants and the rollback sentence, then runs the printed push lines by hand.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| origin main and skilled/v4.0.0.0 | the published lines | update by force-push, after the yes | tips recorded before and after |
| 109 tags on those lines | release markers | rewritten with the lines | tag count invariant |
| 40 tags off those lines | backup and old release tags | unchanged | listed in the record |
| 58 other branches and 28 worktrees | old ancestry | rebased or archived by their owners, stamped with stamp-branch.sh | follower sync record |
| live-sync and follow scripts | autosync | disabled for the window, live branch reset after | continuous-integration.md |

Required inventories:
- Same-class producers: `rg -n '<field|string|helper|literal|error-pattern>' <module-or-files>`.
- Consumers of changed symbols: `rg -n '<changedSymbol>|<changedConstant>|<changedPublicField>' . --glob '*.ts' --glob '*.js' --glob '*.md'`.
- Matrix axes: list every independent input axis and the required rows before implementation.
- Algorithm invariant: for path/redaction/parser/resolver/security fixes, state the invariant and adversarial cases.
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
| Unit | plan rules, callback formatting, remap rules | unittest, 8 + 12 + 4 cases |
| Integration | five-commit rehearsal in the suite; full-scale rehearsal on a mirror | rewrite-run.sh --rehearse |
| Manual | hand judgment of a 100-row plan sample | scratch/sample-judgment.md |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| git filter-repo | External | Green, installed | no rewrite |
| A quiet window with writers stopped | Operator | Yellow, the branch moved five times today | plan and map diverge |
| The operator's yes | Operator | Red until given | no push |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: any invariant fails after the push, or a follower cannot be re-pointed
- **Procedure**: stop the window, push every ref from backup.git with `git push --mirror` to origin, reset each local clone to its recorded tip, re-enable autosync, treat the old SHAs as canonical. The rewritten mirror is abandoned, not repaired.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Config) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Config |
| Config | Setup | Core |
| Core | Setup, Config | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Med | 2 hours, five scripts across four dispatches |
| Core Implementation | Med | 1 hour for the full-scale rehearsal and remap |
| Verification | High | the push window and follower sync, operator-paced |
| **Total** | | **half a day plus the window** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] backup.git is cloned before the mirror is touched, every run
- [x] rehearse mode stops before any push line is printed
- [x] rewrite.log carries every step and invariant

### Rollback Procedure
1. Stop the window and keep autosync off
2. `git push --mirror` from backup.git to origin for main, skilled/v4.0.0.0 and the tags
3. Compare every origin tip to tips-before.txt
4. Tell the operator which SHAs are canonical again

### Data Reversal
- **Has data migrations?** Yes, the citation remap under specs/
- **Reversal procedure**: `git checkout` the pre-remap commit of specs/, or rerun the remapper with the inverse map
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Phase 1   │────►│   Phase 2   │────►│   Phase 3   │
│   Setup     │     │    Core     │     │   Verify    │
└─────────────┘     └──────┬──────┘     └─────────────┘
                          │
                    ┌─────▼─────┐
                    │  Phase 2b │
                    │  Parallel │
                    └───────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Plan | pinned SHA | plan.jsonl | Rewrite |
| Rewrite | plan, source | mirror.git, commit-map, invariants | Remap, Push |
| Remap | commit-map | rewritten documents, residue 0 | Push |
| Push | invariants, rollback sentence, yes | origin updated | Followers |
| Followers | push | rebased branches, reset live branch | 006 |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Full-scale rehearsal** - about 20 minutes - CRITICAL
2. **Operator window: freeze, rerun on the pinned tip, remap, push** - operator-paced - CRITICAL
3. **Follower sync** - operator-paced - CRITICAL

**Total Critical Path**: the window, once opened, should close inside two hours

**Parallel Opportunities**:
- The branch stamper is built while the rehearsal runs
- Nothing overlaps the window
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Five scripts tested | 24 unit cases and the suite rehearsal pass | 2026-09-11 |
| M2 | Full-scale rehearsal | six invariants PASS on a mirror of 9,123 commits | 2026-09-11 |
| M3 | Published | origin tips rewritten, residue 0, followers synced | after the operator's yes |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Rewrite only the tags on the rewritten lines

**Status**: Accepted

**Context**: 109 of the 149 tags point at commits on main or skilled/v4.0.0.0. The other 40 are backup tags and old release tags on earlier lines that the operator's decision D3 leaves alone.

**Decision**: The runner rewrites a tag only when its commit is an ancestor of a rewritten ref tip. The 40 others keep pointing at their old commits, whose objects the backup and the untouched branches keep alive.

**Consequences**:
- Every release tag on the two lines follows its commit
- The mirror keeps the old ancestry the 40 tags and 58 branches still reference, until those are rebased or archived

**Alternatives Rejected**:
- Rewrite every tag: the plan covers only the two lines, and off-line tags would fail the coverage check or pull unrelated history into the rewrite

---

