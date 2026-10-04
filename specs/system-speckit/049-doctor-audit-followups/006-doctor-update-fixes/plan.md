---
title: "Implementation Plan: Doctor update fixes"
description: "Fixes all 26 /doctor:update findings in four ordered phases: engine integrity, the copied-tree journey, approval and recovery, then contract hygiene. Each phase changes the engine, workflows and presentation together, adds a test that fails on the old code, and keeps the 56 existing engine tests green."
trigger_phrases:
  - "doctor update fix plan"
  - "release-update engine plan"
  - "prefill consent decision"
  - "copied tree support decision"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Doctor update fixes

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js 20 CommonJS engine, YAML workflow contracts, a plain-text presentation asset, Markdown router |
| **Framework** | The sk-create-command subaction route-manifest topology (`command-contract.json:192`) |
| **Storage** | Git object store and worktree, plus `.skilled/release/base.json`, `divergence.json`, run directories and the apply lock |
| **Testing** | `node:test` suites over throwaway git repositories, run alone and through `run-all.sh` |

### Overview

The fixes land in four phases, A to D, one at a time. Each phase changes the engine first, then the workflow and presentation text that describes it, then adds tests that fail on the old engine. The engine stays the only writer of release-managed files, and every new behaviour that writes anything sits behind an approval in a workflow.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (`spec.md` Sections 2 and 3)
- [x] Success criteria measurable (`spec.md` Section 5)
- [x] Dependencies identified, and the four open questions decided (Section 3 below)

### Definition of Done
- [ ] All acceptance criteria met (`acceptance-criteria.md`)
- [ ] Engine suite 71 of 71 and `run-all.sh` exit 0
- [ ] Docs updated (spec/plan/tasks), and `validate.sh --strict` prints `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

A thin router (`update.md`) selects one action and loads that action's workflow YAML. The workflow calls one engine (`release-update.cjs`) and renders every visible line from the presentation asset. The engine owns behaviour and refusals. The workflows own approvals, path validation and state logs. The presentation owns wording.

### Key Components

- **Engine** (`.skilled/commands/doctor/scripts/release-update.cjs`, 2,214 lines): check, align, decide, apply, rollback, record-base, and in phase A a new `unlock`.
- **Workflows**: check, align and apply today. Phase C adds `doctor-update-rollback.yaml` and `doctor-update-record-base.yaml`.
- **Presentation** (`doctor-update-presentation.txt`): the only home for prompts, dashboards, templates and next steps (`sk-create-command/SKILL.md:354`).
- **Contracts**: `command-contract.json` (doctor block at `:191-250`) and `_routes.yaml` (standalone `/doctor:update` at `:241-259`).
- **Tests**: `release-update.test.cjs` (56 tests at baseline) and, in phase D, `doctor-update-contract.test.cjs`.

### Data Flow

`check` builds a report from the release tags, the recorded base and the worktree. `align` writes that report as `plan.json` and `decisions.json` in a run directory, and `decide` records operator answers there. `apply --dry-run` prepares the writes and returns the plan. After one approval, `apply` takes the lock, writes `rollback.json`, writes the files and the base and divergence records, and releases the lock. `rollback` restores from `rollback.json` under the same lock.

### Review verdicts

Each finding was re-checked against the code at commit `506bc5a10c`. Verdicts and fix decisions:

| ID | Verdict | Evidence | Fix decision |
|----|---------|----------|--------------|
| DU-01 | CONFIRMED | `prepareWrites` applies a unit once any file is decided (`release-update.cjs:1691-1718`) and records the release tree as its base (`:1728-1731`) | Amend. Count only operator decisions, per decision (a). Keep reason `no decisions` when none exist, add `undecided files` with the paths when some are missing |
| DU-02 | CONFIRMED, temp-file sub-claim NARROWED | Lock written at `:1775-1795`, refused at `:1782` and `:1834-1836`, removed only in `finally` (`:1903-1905`, `:2057-2059`). The only process listener is for stdout (`:2178`) | Amend. Record `command` and `runDir` in the owner, report a dead owner as stale with its recovery, add an `unlock` subcommand instead of a `--break-stale-lock` flag, defer signals while the lock is held, ship the ignore rule (B), route recovery through rollback (C). Drop the `git status` batching |
| DU-03 | CONFIRMED | Default remote `origin` (`:2073`). No action routes `--remote` (`update.md:36-38`). A tagless remote gives `status unknown` with `error null` (`:771-773`) | Adopt the routed flag and the persisted remote. Add one guard: refuse a remote that starts with `-`, because `base.json` is a shared tracked file and git would read such a value as an option |
| DU-04 | CONFIRMED | `recordBase` fingerprints the named release without comparing it to the local tree (`:1996-2001`) and writes without the lock (`:2003`) | Adopt. Share one distance rule with check's inference (`:820-835`), override with `--trust-release`, refuse when release tags cannot be listed unless overridden |
| DU-05 | CONFIRMED | The dry-run result has no `release` or `runDir` (`:1860-1873`). A no-run apply re-plans (`:1566-1568`) | Amend. The digest covers target writes with before and after states, metadata writes by path only, applied and skipped units, release and release commit. It excludes the run directory, whose name carries a timestamp |
| DU-06 | CONFIRMED | `base.json` is always written (`:1733-1737`) and dirty-checked (`:1755-1760`) | Adopt. Name the commit remedy when the dirty path is a release record |
| DU-07 | CONFIRMED | The only rule is the root `.gitignore:256`. No `.skilled/release/` file is tracked | Amend. Ship `.skilled/release/.gitignore` and also give the preflights an exact-lines template, because DU-08 keeps apply from ever delivering that file to an existing install |
| DU-08 | CONFIRMED | Every top-level directory becomes a unit (`:535`). `baseRecording` lists any inferred or unrecorded unit (`:1102-1111`). The test expects the new unit (`release-update.test.cjs:569`) | Adopt |
| DU-09 | CONFIRMED and WIDENED | Reuse empties decisions and deferrals (`:1566-1571`). Deferral is honoured only from `run.decisions` (`:1666`), so a bare apply can also write an update unit the operator deferred | Amend. Refuse on any operator decision or deferred unit |
| DU-10 | CONFIRMED | The router accepts only three actions (`update.md:35`) | Amend. Add both actions. Add `rollback --dry-run` for the affected-state preview that `sk-create-command/SKILL.md:370-378` requires. The routed rollback never runs `git restore` itself, because the commit state is unknown after the session |
| DU-11 | CONFIRMED | An unedited file reads `take-release` (`:647`) and the unit `update` (`:919`). Nothing compares the release with the base release | Amend. Report and skip `downgrade`. No override flag |
| DU-12 | CONFIRMED | `followUps.regenerate` is never read by a battery step (`doctor-update-apply.yaml:133-176`) | Amend. Add `trigger_index` and `compiled_routes` steps, widen `leaf_manifests`. The always-run derived-metadata step already covers the graph-metadata generator |
| DU-13 | CONFIRMED, all six items | `doctor-update-check.yaml:79`, `:148-151`, `release-update.cjs:2060`, `:1946` against `doctor-update-apply.yaml:137-138`, `update.md:38`, `doctor-update-presentation.txt:44` against `release-update.cjs:841` | Adopt, split across B, C and D by the file each phase already edits |
| DU-14 | CONFIRMED | Mappings exist (`doctor-update-align.yaml:53`, `doctor-update-apply.yaml:51-52`) without inputs (`:33-38`, `:37-42`) | Adopt, moved to B, which edits the same input blocks |
| DU-15 | CONFIRMED | Prefill at `:1277-1279`, consumed at `:1691-1703`, asserted at `release-update.test.cjs:832-838` | Adopt, per decision (a) |
| DU-16 | NARROWED | Phase 002 weighed both candidates and kept them authored on purpose (`002-.../scratch/generated-inventory.md:12-19`, `002-.../implementation-summary.md:117`). The trigger-index test gap is real (no `trigger-index` string in the suite) | Replace, per decision (c). One new pattern, two recorded exclusions, one test |
| DU-17 | CONFIRMED | Reports join base, local and release by exact path (`:1020-1057`) | Amend. Link through git rename detection. No similarity code and no edit migration. DU-01 already closes the dropped-addition case |
| DU-18 | CONFIRMED | Cancellation maps to `DECLINED` (`doctor-update-presentation.txt:212`, `doctor-update-apply.yaml:197-203`) against `sk-create-command/SKILL.md:379` | Adopt. An ambiguous answer stays `DECLINED` |
| DU-19 | CONFIRMED | `dry_run_writes_nothing: true` (`doctor-update-apply.yaml:33`) beside a dry-run state log (`:111`, `:195`). Align writes none (`doctor-update-align.yaml:72`) | Adopt the drop-the-log option, which matches align |
| DU-20 | CONFIRMED. The research's guess that the router generator compares hints is REFUTED | `generate-command-routers.cjs:11-14` checks asset paths only | Adopt, with a 128-character summarized hint |
| DU-21 | CONFIRMED | `update.md:68` against `sk-create-command/SKILL.md:354` | Adopt |
| DU-22 | CONFIRMED | Reclassification covers `local-only` and `conflict` only (`release-update.cjs:703`) | Adopt |
| DU-23 | CONFIRMED | `update.md:16`, `doctor-update-presentation.txt:23-31` | Adopt |
| DU-24 | CONFIRMED | `update.md:4`. No Grep or Glob use in the router, workflows or presentation | Adopt |
| DU-25 | CONFIRMED | A record without `tree` is accepted (`:806`). Every current writer records one (`:1730`, `:1997-2000`) | Adopt. Test 684 holds such a record, so its assertion changes |
| DU-26 | CONFIRMED | The index stops at `v4.0.0.2.md` (`.skilled/changelog/skilled/README.md:23-25`). `v4.0.0.3.md` exists, `v4.0.0.2` is tagged and `v4.0.0.3` is not (`git tag -l`) | Fix here, per decision (d) |

No finding was refuted. No finding was dropped or merged. Sub-recommendations dropped with their reason are listed in `spec.md` Section 3, Out of Scope.

### Decisions on the open questions

**(a) A prefilled decision is not consent.** Align pre-fills `adopt-release` for the take-release files of a customized unit and marks each record `source: 'prefilled'` (`release-update.cjs:1277-1279`). Both routed contracts require the operator to confirm every file: the align workflow says "Call decide for every file answer, including answers that match an initial engine suggestion" (`doctor-update-align.yaml:123`) and "Require an answer for every presented file or allow defer for the whole unit" (`:111`), and the presentation says "Do not infer an answer from silence or from the recommendation" (`doctor-update-presentation.txt:162`). Only the engine test at `release-update.test.cjs:822-839` asserts the opposite, and it tests the prefill path, not a contract. The engine marked the record as a suggestion itself, so treating it as undecided makes the engine enforce what both workflows already promise, and it fails closed. Consequence: DU-01's completeness rule and DU-09's reuse guard count only records without `source: 'prefilled'`, and that one test is rewritten.

**(b) Copied and vendored trees are supported.** The engine is built for them: `record-base` exists "for a copied or fresh install" (`release-update.cjs:67`), base inference compares upstream tags because "a vendored tree has no tags" (`:793-796`), the check workflow names "a copied or vendored tree" (`doctor-update-check.yaml:20-21`, `:140`), the presentation calls an inferred base "normal right after copying or installing .skilled/" (`doctor-update-presentation.txt:85`), phase 002 made copied-tree base recording a requirement (`002-.../spec.md:63`, `:91`), and four engine tests use a vendored tree (`release-update.test.cjs:541-574`, `:1194-1214`). `PUBLIC-RELEASE.md` describes how the Public repository's own projects link to it (`PUBLIC-RELEASE.md:3`, `:76`). A symlinked consumer has no `.skilled/` of its own to update, so that document does not describe the audience of `/doctor:update`. Consequence: DU-03, DU-04, DU-07 and DU-08 are fixed in full in phase B, and the presentation documents the copied-tree route.

**(c) Generator ownership of the DU-16 candidates.**
- Compiled-route activation `manifest.json` (seven tracked files under `.skilled/bin/lib/compiled-routing/013-live-activation/activation/<hub>/`): generator-owned. The minting CLI writes the whole file atomically (`.skilled/bin/lib/compiled-route-manifest.cjs:772-777`). The pre-commit route-remint gate re-mints it whenever a hub's routing inputs are committed (`.skilled/scripts/git-hooks/pre-commit:323-470`), and where it cannot it tells the operator to run `compiled-route-manifest.cjs refresh` (`pre-commit:435`). So operator trees regenerate it in place. It belongs to `directory:bin`, so as authored it would make the whole bin unit customized after any hub edit. Phase C adds a whole-file pattern for it.
- `fence-state.json` (seven files beside those manifests): not generator-owned. No operator-side writer exists. Only the program build harnesses (`.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/*/harness/build-artifacts.cjs`) and the developer promotion tool (`.skilled/bin/compiled-route-sync.cjs:809-818`) write it, and the minting library never does. It changes only when a release changes it, which `take-release` already handles.
- `intent_signals` in a hub's `graph-metadata.json`: not generator-owned. `generate-router-intent-signals.cjs:64-66` appends to the authored list and keeps its order, so the key mixes authored and generated entries and no rule can split them. Its input is the hub's authored `ROUTER.md`, and an edit there already customizes the same unit, so leaving it authored adds no new false customization.

**(d) The release-note index is fixed here.** The edit is two lines in one Markdown file that no engine path reads (`release-update.cjs:389-392`), and no workflow regenerates it (`/create:changelog` writes entries only). Line 23 gains `v4.0.0.3.md`, and line 25 names `v4.0.0.3.md` as the entry whose tag does not exist yet. The task re-checks `git tag -l` first, because the sentence must name whichever entry is untagged at build time.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This addendum applies because the fixes touch path handling, persistence, a shared contract and public responses.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `prepareWrites` and `resolveApplyRun` | Choose writes and the reusable run | Update (A, C) | New engine tests for partial sets, prefills and bare-apply reuse |
| `acquireLock`, the apply pre-check, `rollbackPlan`, `recordBase` | Own the lock | Update (A, B) | Signal and stale-lock tests, plus the two existing lock tests at `release-update.test.cjs:1017-1043` and `:1073-1087` |
| `releaseContext`, `parseArgs`, `runCommand` | Resolve the remote and options | Update (B) | Copied-tree remote test, parser tests at `:1246-1265` |
| `buildReport`, `baseForUnit`, `enumerateUnits` | Classify units and base sources | Update (B, C, D) | Base-recording, downgrade, unverified-base and rename tests |
| `GENERATED_ARTIFACTS` and `regenerateFollowUps` | Generated class and follow-ups | Update (C) | Trigger-index and activation-manifest test |
| `applyPlan` dry-run result | Public JSON of the plan | Update (C) | Digest test, existing dry-run tests at `:795-820`, `:841-872` |
| Three workflows and the presentation | Describe the engine to the executor | Update (A to D) | Contract test (D) |
| `command-contract.json`, `_routes.yaml`, catalog lines | Register the command | Update (C, D) | `generate-command-routers.cjs --check`, `route-validate.sh`, `command-catalog-mirror-check.cjs` |
| Mirrored prompts `.codex/`, `.pi/`, `.hermes/prompts/doctor-update.md` | Point at `update.md` by path only | Unchanged | The three `sync-prompts*.cjs --check` commands stay PASS |

Required inventories:
- Same-class producers: `rg -n "apply lock already exists|source: 'prefilled'|baseSource|remote" .skilled/commands/doctor/scripts/release-update.cjs`.
- Consumers of changed symbols: `rg -n "skippedUnits|baseRecording|upstream_status|STATUS=DECLINED|dry_run_writes" .skilled/commands/doctor`.
- Matrix axes: decision source (operator, prefilled, none) by file class (take-release, conflict, local-only, generated) by unit status (update, customized, conflict, removed). Lock owner state (absent, live, stale, unreadable) by command (apply, apply dry-run, rollback, record-base, unlock).
- Algorithm invariant: apply never advances a unit's base unless every file that would change has an operator decision, and the engine never removes a lock whose owner pid is running.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

The build phases run in this order, each in a fresh context:

1. **Phase A, engine integrity** (DU-01, DU-15, engine half of DU-02). First because these defects lose release changes silently or block recovery, and every later phase builds on the decision rule and the lock owner record.
2. **Phase B, copied-tree journey** (DU-03, DU-04, DU-07, DU-08, DU-14, DU-25, DU-13 item 5). Fixing DU-03 exposes DU-04, DU-07 and DU-08 to more operators, so the four ship together. It needs phase A's lock helpers, because `record-base` now takes the lock.
3. **Phase C, approval, recovery and journey** (DU-05, DU-06, DU-09, DU-10, DU-11, DU-12, DU-16, workflow half of DU-02, DU-13 items 3 and 4). The routed rollback needs `unlock` (A), and the routed record-base needs `--remote` and `--trust-release` (B). DU-12 and DU-16 land together so the battery covers the new generated pattern.
4. **Phase D, contract hygiene** (DU-13 items 1, 2 and 6, DU-17 to DU-24, DU-26). Last, because its contract test checks the final text of every file the earlier phases edit.

Each phase is verified by its checklist in `tasks.md` Phase 3 before the next phase starts.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Pure helpers stay covered by the existing version and enumeration tests | `node:test` |
| Integration | Every engine change, driven through the CLI against throwaway git repositories made by the suite's fixture helpers | `node --test .skilled/commands/doctor/scripts/tests/release-update.test.cjs` |
| Contract | Router, workflows, presentation, engine vocabulary and command contract agree | `node --test .skilled/commands/doctor/scripts/tests/doctor-update-contract.test.cjs` (phase D) |
| Regression | All doctor suites | `bash .skilled/commands/doctor/scripts/tests/run-all.sh` |
| Fail-first | Each new engine test fails against the old engine | Copy the old engine with `git show 506bc5a10c:.skilled/commands/doctor/scripts/release-update.cjs` into `<scratch>/old/scripts/release-update.cjs`, copy the new test file into `<scratch>/old/scripts/tests/`, and run it there with `--test-name-pattern`. Never use `git stash`, whose stack other sessions share |

Baseline, measured on 2026-10-03: the engine suite reported `tests 56`, `pass 56`, `fail 0`, exit 0, in 91 seconds. `run-all.sh` reported 8 suites passed and 0 failed, exit 0, with 183 node:test tests across 9 files.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Git 2.x with rename detection and `check-ignore` | External | Green | DU-17 links and the DU-07 test need it |
| Node.js 20 or later | External | Green | Every test runs on it |
| Python 3 with PyYAML | External | Green | YAML parse checks in the verification lists |
| Compiled-route guard and minting CLI | Internal | Green, guard exit 0 on this tree | The DU-12 battery step calls them |
| Phase 002 generated inventory | Internal | Green | Records why each candidate is kept or excluded |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a phase's verification checklist fails and three fix attempts for the same symptom do not clear it, or a change breaks an invariant listed in `spec.md` Section 2.
- **Procedure**: revert that phase's file changes with `git checkout <base-sha> -- <files of the phase>` after recording the failure, then reopen the phase. Phases are independent commits, so one phase reverts without touching the others.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase A (engine integrity) --> Phase B (copied tree) --> Phase C (approval, recovery) --> Phase D (contract hygiene)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| A | None | B, C, D |
| B | A (lock helpers for record-base) | C |
| C | A (`unlock`, operator-decision helper), B (`--remote`, `--trust-release`) | D |
| D | A, B, C (final text for the contract test) | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| A, engine integrity | Med | 3 to 4 hours |
| B, copied-tree journey | High | 5 to 6 hours |
| C, approval and recovery | High | 6 to 8 hours |
| D, contract hygiene | Med | 3 to 4 hours |
| **Total** | | **17 to 22 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline captured: engine suite counts and `run-all.sh` exit, recorded before each phase
- [ ] No engine command is run against this repository itself, only in throwaway fixtures
- [ ] The phase's verification checklist passed from the final state

### Rollback Procedure
1. Stop the phase and record the failing check, its output and its exit status.
2. Revert the phase's files to the commit that preceded it with `git checkout <base-sha> -- <files>`.
3. Rerun the engine suite and `run-all.sh` and confirm the baseline counts.
4. Report the reverted phase and the evidence to the operator before reopening it.

### Data Reversal
- **Has data migrations?** No. `base.json` gains an optional `remote` key that older engines ignore, because they read only `units` (`release-update.cjs:968`).
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
