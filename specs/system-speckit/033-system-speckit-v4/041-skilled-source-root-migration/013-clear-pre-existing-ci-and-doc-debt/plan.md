---
title: "Implementation Plan: Phase 13: clear-pre-existing-ci-and-doc-debt"
description: "Root-cause each red workflow from its failure log, fix the cause rather than the check, add the Hermes mirror comparison to a workflow that already installs its dependencies, and remove the retired lane by following every reference to what it deletes."
trigger_phrases:
  - "pre-existing ci debt plan"
  - "per-row routing dump"
  - "skill-benchmark removal plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 13: clear-pre-existing-ci-and-doc-debt

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON, GitHub Actions YAML, Python (skill scaffolder), Node (advisor scorer, sync scripts) |
| **Framework** | None |
| **Storage** | None |
| **Testing** | vitest (scorer ratchet, routing suites), `node --test` runner, playbook and hub validators |

### Overview
Each red workflow is read from its failure log, not from memory, and each failure is traced to the change that caused it. The routing regression is found by dumping the route of every labeled prompt at the last green commit and at the tip, then diffing the two. The retired lane is removed by listing every file that names a deleted path before the deletion, so nothing is left pointing at a file that is gone.
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
- [x] Tests passing, with the baseline delta reported
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fix at the producer. A hub's routing vocabulary lives in its `SKILL.md` keyword block, its version in `SKILL.md` as the release authority, and a Hermes copy in its sync script, so each fix goes there and the generated files follow through their generators.

### Key Components
- **Per-row routing dump**: one line per prompt with its top skill and score, written at the last green commit and at the tip. The diff names the prompt that moved.
- **`hermes-mirror` job**: added to Command Tree Parity, which already runs on every push and pull request and already installs the spec-kit package the sync scripts need.
- **Reference census for deletions**: `rg` for every path about to be deleted, so each live pointer is removed or rewritten in the same commit.

### Data Flow
Hub `SKILL.md` edit, then the pre-commit gate re-mints the compiled route manifest, then the advisor scorer reads the new vocabulary.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| system-deep-loop hub keywords | Advisor routing vocabulary | Update: add `iteration-files`, `iteration-history` | Scorer ratchet and the 289-row dump |
| sk-design `ROUTER.md` | States the router version | Update to the release authority's version | `parent-skill-check` on the hub |
| Five playbook scenarios | Operator contract | Update | `validate-playbook-package.cjs --strict` |
| Command Tree Parity workflow | Runs on every push and pull request | Update: add a job | YAML parse and a local run of both `--check` commands |
| sk-create-benchmark packet and sk-doc hub | Offer the retired lane | Delete and update | `rg` census, hub checks, node gate |
| Ledger schemas, reducers, sealed-artifact types | Persist the mode id | Unchanged | Out of scope as a data contract |
| Write-set conflict census and its tests | Declare the retired workstream | Unchanged, reported | Out of scope as a typed contract |

Required inventories:
- Same-class producers: `rg -n 'skill-benchmark|skill_benchmark|SKILL_BENCHMARK' .skilled --glob '!**/changelog/**'`.
- Consumers of deleted files: `rg -n 'archive-compiled-routing|render-serving-snapshot|skill-benchmark-storage-guide|serving-snapshot-schema|skill-benchmark-readme-template'`.
- Matrix axes: prompt bucket (full, ambiguity, holdout, review, memory-save, delegation) by commit (last green, tip).
- Invariant: no prompt changes its top skill between the last green commit and the tip.
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
| Routing | Scorer ratchet, routing suites, per-row dump of 289 prompts | vitest, a dump script in the session scratchpad |
| Contract | Playbook fleet, hub structure, leaf manifests, skill metadata | `validate-playbook-package.cjs --strict`, `parent-skill-check`, generator `--check` modes |
| Regression | Node runner and spec-kit vitest at `d10ec9d549` and at the tip | Same commands both times |
| CI | The three target workflows on the pushed tip | `gh run list` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Operator choice on the retired lane | Internal | Given 2026-09-18: remove, and delete the archive docs | Without it the lane's docs would be rewritten, not removed |
| Main checkout fast-forward | Internal | The main checkout moved to `6cbaf58d3b` after phase 012 | The phase commits are rebased onto it before the fast-forward |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A prompt routes differently, a hub fails its check, or a workflow this phase changed turns red for a new reason.
- **Procedure**: `git revert` the commit that caused it on the branch, then fast-forward both remote branches and the main checkout.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Routing fix ──┐
Playbook fix ─┼──► Retired-lane removal ──► Verify ──► Push + CI
Hermes job ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Routing, playbook and Hermes fixes | Baseline captured | Removal |
| Retired-lane removal | The routing dump, so its hub edits are measured against it | Verify |
| Verify | All above | Push |
| Push and CI | Verify, and the operator's go-ahead | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Routing root cause and fix | Med | 1-2 hours |
| Playbook and Hermes | Low | 1 hour |
| Retired-lane removal | Med | 2-3 hours |
| **Total** | | **4-6 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline numbers captured at `d10ec9d549`
- [x] Every commit passed the git hooks with no bypass variable
- [x] No data migration

### Rollback Procedure
1. `git revert <sha>` on `worktrees/055-skilled-source-root-migration`.
2. Fast-forward `skilled/v4.0.0.0` and `main`, then the main checkout.
3. Rerun the scorer ratchet and the playbook validator.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A. The deleted files stay in history at `c4b83f6648`.
<!-- /ANCHOR:enhanced-rollback -->

---
