---
title: "Implementation Plan: Phase 8: series-parent-review-fixes"
description: "Fix the twelve Phase 7 review findings and the two close-out gaps: make the series parent recipe run as written, finish the doc sweep, harden the listing and the phrase source, reconcile the Phase 6 records and pass the configured reasoning effort to cli-pi."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 8: series-parent-review-fixes

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown rule docs, Bash (`create.sh`), Node ESM (`phrase-judge.mjs`) |
| **Framework** | system-spec-kit CLI and the deep-loop command contracts |
| **Storage** | Repository files, `description.json` reads, `trigger-index.json` |
| **Testing** | Vitest (`runtime/cli/tests`), `node --test` (`runtime/tests/hooks`), scratch `create.sh` runs |

### Overview
The recipe is fixed first because a reader who follows the rule as written is exactly the failure Phase 7 found. The doc sweep then makes every restatement of the phase thresholds carry the series parent exception. The listing and phrase changes remove the two silent failures, and the Phase 6 records are brought up to what that packet shipped. Every change ran as a lane with a bound write path, and the orchestrator read each diff before the next dispatch.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The Phase 7 review report and its findings are read and scoped (`../007-series-parent-review-and-hardening-research/review/review-report.md` section 3)
- [x] The baseline is recorded: three spec-kit test files at 76 tests, and the hook suite at 172 tests with 3 skipped
- [x] The write path for each finding is bound before the first edit

### Definition of Done
- [x] Every finding has its fix and its evidence recorded, and the two doc gaps are closed
- [x] The whole spec-kit CLI suite, the hook suite, the contract drift check and the deep-loop suite pass
- [ ] The committed trigger index is rebuilt and its freshness check passes
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fix phase over existing tooling. No new architecture. The rule keeps one source in `phase-definitions.md` §2, the template phrases keep one source in the `create.sh` shell list, and every other doc points at them.

### Key Components
- **`phase-definitions.md` §2**: the five-step series parent recipe.
- **`create.sh` listing**: reads each packet's metadata and strips control bytes before printing.
- **`create.sh` phrase block and `phrase-judge.mjs`**: the single four-phrase list that seeds a spec and classifies the default.
- **Deep-loop auto YAMLs**: the `if_cli_pi` blocks that pass `reasoningEffort` into the lineage and the executor.
- **Phase 6 packet records**: the tasks summary, the continuity block and the scope table.

### Data Flow
`create.sh` walks the target track, reads each packet's `description.json`, strips control bytes and prints the recent names and descriptions to stderr. The same shell list seeds a fresh `spec.md` and feeds the judge's `template-default` class. The deep-loop compiler turns each auto YAML into the contract a cli-pi run executes, and the configured effort travels from the block into the executor arguments.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Series parent recipe | Tells a reader how to create a parent and its children | Update | Two scratch runs, parent exit 0 and the child numbered 002 |
| Docs that restate the rule | Carry the old wording outside the edited set | Update | Repo-wide search for the old label, nine unrelated hits left |
| `create.sh` listing | Prints recent packets to stderr | Update | `create-track-refresh.vitest.ts` grew from 9 to 11 tests |
| `create.sh` phrase block and `phrase-judge.mjs` | Hold the four template phrases in separate literals | Update | The drift test failed on a temp copy, then passed |
| Deep-loop auto YAMLs and compiled contracts | Define what a cli-pi run executes | Update | Contract drift check OK, 22 test files and 365 tests pass |
| Phase 6 packet records | Hold scaffold rows and a stale summary | Update | Summary at P0 12/12, P1 13/13, P2 1/1, continuity refreshed |
| Gate 3 runtime menu text | Names the options | Unchanged | Phase 9 owns it, its text is byte-pinned |
| cursor and devin executor blocks | Pass no effort | Unchanged | Deliberate, Devin has no effort flag and Cursor bakes effort into the model id |

Required inventories:
- Same-class producers: a repo-wide search for the old skip label found nine hits, all meaning something else. They live in the hub architecture of `system-deep-loop` SKILL.md, legacy probe strings in `test-phase-command-workflows.js` and benchmark JSON transcripts.
- Consumers of the changed docs: the sweep covered `references/templates/`, `feature-catalog/`, the README Gate 3 diagram, `quick-reference.md` and `retrieval-conventions.md`.
- Matrix axes: the listing cases are the name and description fields by control and clean bytes, recorded by the ESC description test and the silent sub-folder test.
- Algorithm invariant: no byte below 0x20 or in the range 0x7f to 0x9f reaches the terminal from repository metadata. The adversarial case is an ESC byte in the description.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

1. Setup: read the review report, record the baseline and bind the write paths.
2. Rule docs: the recipe rewrite, the README labels, the three exception sentences and the two doc gaps.
3. Tooling: control byte stripping, the sub-folder silence test and the single phrase list with its drift test.
4. Packet records: the Phase 6 tasks summary, continuity block and scope row.
5. Close-out: `reasoningEffort` in both auto workflows, the regenerated compiled contracts and the restored executable bit.
6. Verification: two scratch runs, the full suites, the drift check and the trigger index rebuild.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The phrase drift pin, the ESC description and the sub-folder silence | Vitest |
| Integration | The whole spec-kit CLI suite and the hook suite | Vitest and `node --test` |
| Contract | The deep-loop compiled contracts against their auto YAML sources | `check-contract-drift` |
| Manual | Two scratch runs of the rewritten recipe | Shell |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 7 review report, commit `4b33313bd4c` | Internal | Green | The findings list is the source of the scope |
| Pi providers for the build lanes | External | Green | A failed lane writes nothing, each diff is read |
| `node` for `create.sh` and the retrieval tools | Internal | Green | The listing is skipped and the index check cannot run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A regression in seeding, the listing or the scaffold, or a freshness check that stays red after the rebuild
- **Procedure**: `git revert` of the phase commit, then rerun the three baseline test files (`create-track-refresh`, `create-root-numbering` and `trigger-index`)
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ─┬─► Rule docs ─► Tooling ─┬─► Verify
       └─► Records ──────────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Rule docs, Tooling, Records |
| Rule docs | Setup | Tooling, Records |
| Tooling | Rule docs | Verify |
| Records | Rule docs | Verify |
| Verify | All | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | One pass over the review report |
| Rule docs | Med | Four docs plus the README sweep |
| Tooling | Med | Listing strip, silence test and phrase pin |
| Records | Low | Three edits in the Phase 6 packet |
| Verify | Low | One full suite pass and two scratch runs |
| **Total** | | **One phase across several lanes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline recorded before the first change, and no data files are touched
- [x] No feature flag applies to a repository tooling change
- [x] No monitoring surface is touched

### Rollback Procedure
1. `git revert` the phase commit.
2. Rerun the three baseline test files and the hook suite.
3. Run one `create.sh` in a scratch track and read the listing.
4. No stakeholders to notify, the change is internal tooling.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
