---
title: "Feature Specification: Phase 9: doctor-ci-review-wiring"
description: "A clone can switch workflows off with the vars.SKILLED_CI* variables, but nothing shows which jobs a given tree has switched off, and nothing scaffolds a new workflow to the CI standard. A .github/workflows diff also reviews as UNKNOWN, because sk-code has no CI surface value. This phase probes whether the owner's token can write repository variables, then builds /doctor:ci (report, scaffold, toggle), registers its advisor bridges, and adds the CI surface value to the shared detection contract with regression tests for the three existing surfaces."
trigger_phrases:
  - "doctor ci review wiring"
  - "phase 9 doctor ci review wiring"
  - "ci workflow status report"
  - "ci workflow surface detection"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 9: doctor-ci-review-wiring

<!-- SPECKIT_LEVEL: 3 -->
---

<!-- ANCHOR:metadata -->
## EXECUTIVE SUMMARY

The repository can switch its workflows off through six repository variables, but no command reports which jobs a tree has switched off, and no command creates a new workflow with the timeout, permissions, concurrency and switch shape the CI standard requires. A review of a `.github/workflows` change also has no surface value, so it loads none of the CI evidence the sk-code hub is about to own. This phase answers the one open question first - whether the owner's token may write a repository variable - then builds `/doctor:ci` as a read-only report, a confirmed scaffold and a toggle shaped by that answer, registers its three advisor bridges, and adds `CI` as the fifth surface value with a regression test that pins the three existing surfaces.

**Key Decisions**: D9 selects the toggle shape from the R28 probe, with write as the default and print as the fallback; the report resolves the newest non-rebuild SHA by commit-message trailer rather than by workflow name; the scaffold creates new files only and refuses a protected workflow name; `CI` sits second in the surface precedence, after `SKILLED`.

**Critical Dependencies**: `006-sk-code-ci-surface` supplies the two scaffold templates, the protected set and the rule index; `007-workflow-hygiene-on-off-control` supplies the six variable names and the job `if:` shape the report reads; the operator's explicit yes gates the R28 probe.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-10-23 |
| **Branch** | `worktrees/214-ci-efficiency-phase-plans` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 9 |
| **Predecessor** | 006-sk-code-ci-surface (with 007-workflow-hygiene-on-off-control) |
| **Successor** | None |
| **Handoff Criteria** | `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0 with `17 routes validated`; `node .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs --check` prints `"status": "fresh"`; `node .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs` prints `STATUS=OK` with `bridges=21`; `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/surface-detection.test.cjs` exits 0; `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring --strict` prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the CI hygiene, consolidation and doctor specification. It carries R28, R29 and R30 of `001-research/research/synthesis-reviews/final-review.md` (`:504-532`) and the phase-009 gate in that review's phase plan (`:600-607`). Its internal order is R28, then R29, then R30: the probe decides the toggle shape before the command is written, and the command's report reads the switch names before the review surface is wired to them.

**Scope Boundary**: The doctor command family, the advisor bridge data and its generated outputs, the sk-code shared detection contract and review selection, and this phase's `scratch/`. No `.github/workflows` file change during the phase build, no workflow run, no repository variable except the probe's own `SKILLED_CI_PROBE`, and no change to a skill runtime's behaviour outside the review surface value.

**Dependencies**:
- `006-sk-code-ci-surface`: the `sk-code-ci` packet supplies the four rule references, the protected set and the two scaffold templates (`workflow-template.yml`, `job-block-template.yml`). The report's drift flags restate the packet's machine-checkable rules; the scaffold reads its templates. If the packet is absent, the scaffold and drift tasks are blocked.
- `007-workflow-hygiene-on-off-control`: it writes the six `vars.SKILLED_CI*` names, the `if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_* != 'off'` line this phase's report resolves, and the `### On/off switches` section of `.github/workflows/README.md` that the toggle reads. If it has not landed, every workflow reports `switch: missing` and the switch-state criterion stays `Unmet`; the command still builds and its fixtures still pass.
- `002-rebuild-fanout-removal`: its R1 creates the N17 condition the report must handle, because a rebuild commit's SHA carries no statuses of its own. The report resolves the newest non-rebuild SHA whether or not R1 has landed.
- Operator decision D9 (`final-review.md:622`): the toggle writes the variable or prints the command. The R28 probe answers it, and the probe itself needs an explicit operator yes because it changes repository settings.

**Deliverables**:
- `.skilled/commands/doctor/ci.md` and its three workflow assets, with `report` read-only, `scaffold` confirmed and `toggle` shaped by D9.
- `.skilled/commands/doctor/scripts/ci-report.cjs`, which lists every workflow with its switch state, trigger, filters, purpose and drift flags, and resolves the newest non-rebuild SHA.
- Three `_routes.yaml` routes, three advisor bridge activations in both scorers, the regenerated bridge projection and a `/doctor:setup` row.
- The CI surface value in `stack-detection.md` and `sk-code-review`'s `detect_surface_evidence`, with a regression test that keeps the three existing surfaces unchanged.
- `scratch/`: the R28 probe record, the pre-phase inventory, the command contract results, the live report and the phase result.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The on/off control lands six repository variables, but a clone cannot see which jobs a tree has switched off without reading every `if:` line, and there is no command that creates a new workflow with the timeout, permissions, concurrency and switch shape the standard requires. A `.github/workflows` diff also has no surface value: `detect_surface_evidence` returns `SKILLED`, `OBSIDIAN`, `WEBFLOW` or `UNKNOWN`, so a workflow review loads no CI evidence. Finally, the earlier research inferred that writing a repository variable needs an admin token, and that inference has never been tested, so the toggle's shape is still unknown.

### Purpose
Give the operator one read-only report of every workflow's switch state and one confirmed way to scaffold a workflow or toggle a switch, and make a workflow diff select a CI surface that loads `sk-code-ci` evidence.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The R28 probe on one throwaway repository variable, with the operator's explicit yes.
- The `/doctor:ci` router, its presentation contract and its three workflow assets.
- The read-only report script and its fixtures, including the newest non-rebuild SHA resolution.
- The `_routes.yaml` routes, the advisor bridge activations, the regenerated projection and the `/doctor:setup` row.
- The CI surface value in the shared detection contract and in `sk-code-review`'s surface selection, plus the hub prose that restates the precedence.
- The regression test for the three existing surfaces and the new CI case.

### Out of Scope
- Any `.github/workflows` edit - the phase adds a command that writes one on request, never a workflow itself.
- Any workflow run or repository variable write during the phase build beyond the R28 probe - the report is read-only, and the toggle acts only when an operator runs it and answers yes.
- A `customize` route for an existing workflow - the final review's R29 names `report` and `scaffold` only; a protected workflow is never edited by this command.
- A new `sk-code-ci` packet, rule data or template - phase 006 owns them, and this phase only reads them.
- The `sk-code-obsidian` packet's own restatement of the old precedence - that packet owns its release, and this phase changes the hub's shared contract and review selection.
- The benchmark replay heuristic in `router-replay-lib.cjs` - it is a replay aid, not the review router's surface selector, and it already omits OBSIDIAN.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/ci.md` | Create | The `/doctor:ci` router with `report`, `scaffold` and `toggle` targets |
| `.skilled/commands/doctor/_routes.yaml` | Modify | Three routes with mutation classes, flags, gate locations and trigger phrases |
| `.skilled/commands/doctor/assets/doctor-ci-presentation.txt` | Create | The argument error, target menu, per-route result templates and troubleshooting |
| `.skilled/commands/doctor/assets/doctor-ci-report.yaml` | Create | The read-only report workflow that runs `ci-report.cjs` |
| `.skilled/commands/doctor/assets/doctor-ci-scaffold.yaml` | Create | The confirmed scaffold workflow that reads the `sk-code-ci` templates |
| `.skilled/commands/doctor/assets/doctor-ci-toggle.yaml` | Create | The confirmed toggle workflow shaped by D9 |
| `.skilled/commands/doctor/scripts/ci-report.cjs` | Create | The workflow inventory, switch resolver, drift flags and N17 SHA resolution |
| `.skilled/commands/doctor/scripts/tests/ci-report.test.cjs` | Create | Fixture-tree tests for the report, with a `gh` stub |
| `.skilled/commands/doctor/scripts/tests/doctor-ci-contract.test.cjs` | Create | Contract tests for the three routes, assets and the no-ephemeral-id rule |
| `.skilled/commands/doctor/assets/doctor-setup-presentation.txt` | Modify | One `/doctor:ci report` row in the doctor target list |
| `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json` | Modify | Three `command-doctor-ci-*` activations in the TypeScript and Python lists |
| `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json` | Modify | Regenerated by the bridge deriver |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts` | Modify | Regenerated by the bridge deriver |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` | Modify | Regenerated by the bridge deriver |
| `.skilled/skills/system-skill-advisor/runtime/lib/render.ts` | Modify | Regenerated by the bridge deriver |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json` | Modify | Regenerated by the compiled-route refresh after the hub `SKILL.md` change |
| `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-code/manifest.json` | Modify | Authored twin copied from the runtime manifest |
| `.skilled/skills/sk-code/shared/references/stack-detection.md` | Modify | The CI surface row, precedence, detection block and test cases |
| `.skilled/skills/sk-code/sk-code-review/SKILL.md` | Modify | The precedence restatement, `CI_PATH_MARKERS` and the `detect_surface_evidence` branch |
| `.skilled/skills/sk-code/SKILL.md` | Modify | The tie-break sentence and the surface-detection sentence name CI |
| `.skilled/skills/sk-code/ROUTER.md` | Modify | The SURFACE row names CI detection |
| `.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md` | Modify | The precedence restatement names CI |
| `.skilled/skills/sk-code/manual-testing-playbook/design-restraint/design-restraint-ladder.md` | Modify | The precedence restatement names CI |
| `.skilled/skills/sk-code/sk-code-skilled/scripts/tests/surface-detection.test.cjs` | Create | The five-value fixture test, including the three existing surfaces |
| `specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring/scratch/` | Create | Probe, inventory, contract, report and phase-result records |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### Functional requirements by R-id

| R-id | What the phase must make true | Requirements | Tasks |
|------|-------------------------------|--------------|-------|
| R28 | One throwaway repository variable proves whether the owner's token may write repository settings, the four exit codes and both read-backs are recorded, the variable is deleted in the same task, and the answer selects the toggle's shape | REQ-001 | T001, T004, T030 |
| R29 | `/doctor:ci` lists every workflow with its switch state and resolves the newest non-rebuild SHA, scaffolds a new workflow from the `sk-code-ci` templates after an explicit yes, toggles one of six named switches in the shape D9 selects, registers three routes and three advisor bridges, and appears in the `/doctor:setup` list | REQ-002, REQ-003, REQ-004, REQ-005 | T005 to T017, T027, T028 |
| R30 | `CI` is the fifth `detect_surface_evidence` value, sits second in the precedence, is restated by every hub document that carries the order, and a regression test pins the three existing surfaces and the mixed and near-miss paths | REQ-006, REQ-007 | T018 to T026 |
| Cross-cutting | The report writes nothing, no ephemeral id enters code or a command asset, the packet passes the strict validator, and the phase result records every gate | REQ-008, REQ-009, REQ-010, REQ-011 | T029 to T033 |

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | **R28.** With an explicit operator yes, `gh variable set SKILLED_CI_PROBE --body x`, read it back with `gh variable get SKILLED_CI_PROBE --json name,value`, `gh variable delete SKILLED_CI_PROBE`, and read the state back again. Record all four exit codes and both read-backs in `scratch/r28-probe.md`. The probe runs in this repository, on a name no workflow reads, and the variable is deleted in the same task |
| REQ-002 | **R29.** `.skilled/commands/doctor/ci.md` owns a `report` route whose workflow is read-only and whose `ci-report.cjs` lists every `.github/workflows/*.yml` file with its switch state (resolved from the job `if:` expression and `gh variable list`), trigger events, path filters, purpose from the README row, and the missing-timeout, missing-permissions, missing-concurrency and missing-switch flags. The report resolves the newest non-rebuild SHA: it excludes a SHA whose commit message's last non-empty line is `Trigger-Index-Rebuild: ci` (N17) |
| REQ-003 | **R29.** `.skilled/commands/doctor/ci.md` owns a `scaffold` route that is `mutating: mutates`, prints the proposed file content under `.github/workflows/` before writing, reads `.skilled/skills/sk-code/sk-code-ci/assets/workflow-template.yml` and `job-block-template.yml`, refuses an existing target or a protected workflow name, and writes only after an explicit yes |
| REQ-004 | **R29.** `.skilled/commands/doctor/ci.md` owns a `toggle` route shaped by D9. It accepts only the six documented names (`SKILLED_CI`, `SKILLED_CI_TESTS`, `SKILLED_CI_REPORTS`, `SKILLED_CI_REVIEW`, `SKILLED_CI_FRESHNESS`, `SKILLED_CI_MESSAGES`), prints the exact `gh variable set NAME --body off` or `gh variable delete NAME` command, refuses `SKILLED_CI_MESSAGES=off` while the workflows README carries the prohibition, and reads the state back. Under D9's write answer it runs the command after a yes and is `mutating: mutates`; under the print answer it writes nothing and is `mutating: read-only` |
| REQ-005 | **R29.** `_routes.yaml` registers the three routes; `scoring-compatibility.json` activates `command-doctor-ci-report`, `command-doctor-ci-scaffold` and `command-doctor-ci-toggle` in both the TypeScript and Python lists; the bridge deriver regenerates `command-bridges.generated.json`, `projection.ts`, `skill_advisor.py` and `render.ts`; and `doctor-setup-presentation.txt` lists `/doctor:ci report` |
| REQ-006 | **R30.** `stack-detection.md` gains a `CI` surface row and the precedence `SKILLED > CI > OBSIDIAN > WEBFLOW > UNKNOWN`, a `.github/workflows/` and `.github/actions/` detection step, and CI rows in its test cases. `sk-code-review/SKILL.md` restates the same precedence and its `detect_surface_evidence` returns `CI` for a workflow path. The hub's restatements are updated: `.skilled/skills/sk-code/SKILL.md:139`, `ROUTER.md:112`, `code-quality-standards.md:56` and `design-restraint-ladder.md:13` name CI, and `.skilled/skills/sk-code/SKILL.md:74` separates the bundle order from the single-surface precedence. Every changed skill doc raises its frontmatter version through `frontmatter-version.mjs bump`, and each bumped packet gains a changelog entry at the new version. The compiled route for `sk-code` is refreshed after the `SKILL.md` change, because the hub policy hash covers that file |
| REQ-007 | **R30.** `surface-detection.test.cjs` exercises the inline `detect_surface_evidence` block from `sk-code-review/SKILL.md` against five fixtures: SKILLED, OBSIDIAN and WEBFLOW keep their current expected values, CI is new, and UNKNOWN stays the fallback. It also asserts the shared contract and the inline copy carry the same precedence |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-008 | No R-id, D-id or phase number enters a command asset, a script comment, a YAML asset, a test name, a commit message or a skill doc changed by this phase. The ids stay in these spec documents; the durable WHY stays in the code |
| REQ-009 | The report writes nothing: `git status --porcelain -- .github .skilled` is identical before and after a report run. The scaffold and toggle print their plan first, write only after an explicit yes, and write nothing on no |
| REQ-010 | The phase packet passes `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring --strict` with `RESULT: PASSED` |
| REQ-011 | `scratch/phase-result.md` records every gate command, its exit status and its last line, the R28 probe, the live report's workflow count and newest non-rebuild SHA, and the D9 answer |

### Edge cases by R-id

| R-id | Edge case | Handling |
|------|-----------|----------|
| R28 | The operator declines the probe | Record the decline in `scratch/r28-probe.md`, write `D9: print`, and continue; the toggle prints the command and writes nothing. AC-001 is `Waived` by ADR-002 |
| R28 | `gh variable set` exits non-zero | Record the exit code and its stderr, choose `D9: print`, and run the delete anyway to prove the name is absent; a non-zero delete after a failed set is recorded, not repaired |
| R28 | The delete succeeds but the post-delete read-back exits 0 | Stop: a variable that survives its delete is a repository-settings fault. Run `gh variable delete SKILLED_CI_PROBE` once more and record both results before any other work |
| R29 | The variable list is empty | Every switch reads `on`, because an unset variable runs the job; the report prints `variables: none` rather than an empty table |
| R29 | A job's `if:` is a quoted `${{ }}` string, a `>-` block, or a condition with the switch ANDed | The parser reads the whole string and looks for the two variable names, not for an exact shape |
| R29 | A workflow with no jobs | List it with `jobs: 0` and `switch: missing`; do not crash on an empty `jobs` map |
| R29 | A YAML parse error in one workflow | Name the file and the parser message, exit 1, and still list the other files in the JSON `errors` array |
| R29 | No non-rebuild SHA in the last 100 `main` runs | `newestNonRebuildSha: null` with the reason `no non-rebuild SHA in the last 100 runs`; do not guess a SHA |
| R29 | A scaffold target that already exists, or a protected workflow name | `REFUSE: the target path already exists; scaffold creates new workflows only` or `REFUSE: <name> is a protected workflow`, exit 1, no write |
| R29 | A toggle of `SKILLED_CI_MESSAGES` to `off` while the README carries the prohibition | `REFUSE: SKILLED_CI_MESSAGES must stay unset while the ruleset requires that context`, exit 1, no write |
| R29 | A trigger phrase that displaces an existing doctor phrase | `doctor-phrase-reach.cjs` fails that row; replace the new phrase, never an existing one, and re-run |
| R30 | A `.skilled/` path and a workflow path in the same change | `SKILLED` wins, because the SKILLED branch returns first |
| R30 | A workflow path and a Webflow marker in the same change | `CI` wins, because the CI branch sits before the non-Webflow guard and the WEBFLOW branch |
| R30 | A file named `workflows-notes.md` outside `.github/workflows/` | `UNKNOWN`; the marker test reads path segments, not a substring anywhere in the path |
| R30 | An explicit non-Webflow prompt that also names a workflow file | `CI`, because a path marker is stronger evidence than prompt wording; the non-Webflow guard only blocks WEBFLOW promotion |

### Risks by R-id

| R-id | Risk | Mitigation |
|------|------|------------|
| R28 | The probe leaves a variable behind | Delete it in the same task, record the post-delete read-back, and treat a surviving variable as a blocker |
| R28 | The probe's success is read as a licence to write variables during the build | Only the toggle route writes, and only after an operator yes; the phase build writes nothing else |
| R29 | The report's switch parser misreads an ANDed condition | Test the parser against the three ANDed shapes phase 007 writes and against a quoted `${{ }}` string |
| R29 | The report reads `main`'s HEAD and shows an empty status set after R1 | Resolve the newest non-rebuild SHA by trailer and record the excluded SHA |
| R29 | A new trigger phrase steals an existing doctor bridge's top pick | Every phrase is CI-specific and three or more words; a failed phrase is replaced, never an existing one |
| R29 | The scaffold writes a file that already exists | Refuse an existing path before printing the plan; the contract test asserts the refusal string |
| R29 | The toggle disables the only required context | Refuse `SKILLED_CI_MESSAGES=off` while the README states the prohibition |
| R30 | The CI value changes an existing detection result | Fix the three existing fixtures in the test and put `SKILLED` first and `CI` second in the precedence |
| R30 | The precedence string drifts between the contract and its restatements | The test asserts the contract and the inline copy carry the same string, and every restatement is grepped |
| R30 | A version bump is hand-edited and the gate cannot tell | Run `frontmatter-version.mjs bump`; never edit a version by hand |

### Rollback by R-id

| R-id | Rollback |
|------|----------|
| R28 | `gh variable delete SKILLED_CI_PROBE`. If the set failed, run the delete anyway and record its exit code; the probe record stays as evidence |
| R29 | `git revert <command-commit>` removes `ci.md`, the three assets, the two test files, the report script, the three route entries, the three bridge activations and the regenerated projection together, because they are one commit. The `/doctor:setup` row is its own commit and reverts alone |
| R30 | `git revert <sk-code-commit>` restores the four-value contract, the old precedence string in all six docs, the previous versions, the previous changelog set and the previous compiled manifest |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The R28 probe records a set exit code, a read-back value, a delete exit code and a post-delete read-back, and D9 names the toggle shape that follows from them.
- **SC-002**: `node .skilled/commands/doctor/scripts/ci-report.cjs --json` lists every workflow file in the tree - 33 today, 32 after phase 004's D5 removes `hooks-node-tests.yml`, 25 after a phase 008 D8 merge on the D5-approved tree and 26 on the D5-rejected tree - and every row carries a switch state of `on`, `off`, `partial`, `missing` or `unknown`, and `dependabot-auto-merge.yml` reports `on` because it has no switch by design.
- **SC-003**: The report names the newest non-rebuild SHA, and that SHA's commit message does not end with `Trigger-Index-Rebuild: ci`.
- **SC-004**: `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0 with `17 routes validated`; the bridge deriver is fresh; `doctor-phrase-reach.cjs` exits 0 with `bridges=21`; and the `/doctor:setup` list names `/doctor:ci report`.
- **SC-005**: A `.github/workflows` diff reviews as `CI`, the compiled route for a workflow prompt bundles `sk-code-ci`, and the three existing surface cases return exactly what they returned before.
- **SC-006**: The full doctor script suite, the sk-code script-test glob, the drift-guard runner and the packet validator all pass.
- **SC-007**: Every changed sk-code doc carries a higher frontmatter version than its base, each bumped packet carries a changelog entry at the new version, and the compiled `sk-code` manifest is fresh.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `006-sk-code-ci-surface` | The scaffold has no templates and the report's drift rules have no source; REQ-003 and the drift half of REQ-002 stay blocked | The phase reads the packet's file paths and refuses to scaffold when a template is absent; the report still runs and marks the drift check `not checked` |
| Dependency | `007-workflow-hygiene-on-off-control` | Every job reports `switch: missing`, so SC-002's state column is not meaningful | The report parses whatever `if:` line the tree carries and treats a missing switch as a flag, not a crash; the switch-state criterion waits for 007 |
| Dependency | `002-rebuild-fanout-removal` (N17) | After R1 a rebuild SHA carries no meaningful status of its own - only the rebuild run's skipped row, or no runs - so a report that reads `main`'s HEAD shows an empty status set | The report resolves the newest non-rebuild SHA and records the excluded SHA; the criterion is checked against the live `gh api` commit message |
| Dependency | Operator decision D9 | The toggle route's mutation class, gate location and behaviour are undecided | The R28 probe is a pre-build task with an explicit yes, a unique variable and a delete; the default is write when the probe exits 0, and the alternative is print only |
| Dependency | `gh` with `repo` and `workflow` scopes | The report cannot resolve variable state or the newest SHA; the probe cannot run | `gh variable list --json name,value` already exits 0 with the scopes `gist, read:org, repo, workflow`; the report degrades to `unknown` and still lists the tree |
| Risk | A new trigger phrase steals an existing doctor bridge's top pick | `doctor-phrase-reach.cjs` fails, and an existing doctor route becomes harder to reach | Every new phrase is CI-specific and multi-word; a failed phrase is replaced, never an existing phrase |
| Risk | The report's switch parser misreads a condition that ANDs the switch with an existing expression | A switched-off job reports `on`, or a running job reports `off` | The parser looks for `vars.SKILLED_CI` and the group variable anywhere in the expression and is tested against the three ANDed conditions phase 007 writes (`trigger-index-rebuild.yml:33`, `:186`, `skill-doc-frontmatter.yml:52`) |
| Risk | The CI surface value changes an existing detection result | A SKILLED, OBSIDIAN or WEBFLOW task routes to CI | The test fixes the three existing fixtures and the precedence puts SKILLED first and CI second; a `.skilled/` path still returns SKILLED |
| Risk | The R28 probe leaves a variable behind | A stray repository variable is visible to every workflow | The probe deletes the variable in the same task and records the post-delete read-back; a failed delete is a blocker, not a note |
| Risk | A generated file is hand-edited after the deriver runs | The next `--check` reports a drift the phase cannot explain | Only the deriver writes the four bridge files and only `compiled-route-manifest.cjs refresh` writes the manifest; the check task runs both `--check` forms |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The report reads the workflow tree (33 files today, 32 after phase 004's D5, 25 after a phase 008 D8 merge on the D5-approved tree and 26 on the D5-rejected tree) and makes one `gh variable list` call plus at most a handful of `gh api` commit reads; it completes in under 5 seconds on a warm `gh` session.
- **NFR-P02**: The phase saves 0 runner-minutes. Its value is operator visibility and a shorter path from a workflow idea to a compliant file.
- **NFR-P03**: The new test files run inside the existing doctor and sk-code script suites; they add no new workflow job and no new runner-minute line.

### Security
- **NFR-S01**: The report prints only `on`, `off`, `partial`, `missing` or `unknown` for a variable, never its value, and never a token; `dependabot-auto-merge.yml` prints `on` and is named as exempt.
- **NFR-S02**: The R28 probe uses a name no workflow reads, writes only after an explicit operator yes, and deletes the variable in the same task.
- **NFR-S03**: The scaffold refuses to overwrite an existing file and refuses a protected workflow name, so a protected guard cannot be replaced by a template.
- **NFR-S04**: The toggle refuses `SKILLED_CI_MESSAGES=off` while the workflows README states the prohibition, because a skipped job reports Success and would stop the only required context from blocking.

### Reliability
- **NFR-R01**: A missing `gh`, an unauthenticated `gh` or an empty variable list never fails the report; the affected column reads `unknown` and the workflow inventory still prints.
- **NFR-R02**: An unparseable workflow is reported by file and parse error, and the report exits 1 rather than silently omitting the file.
- **NFR-R03**: `detect_surface_evidence` returns exactly one of `SKILLED`, `CI`, `OBSIDIAN`, `WEBFLOW` or `UNKNOWN`; no branch overwrites an earlier match.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- Empty variable list: every switch reads `on`, because an unset variable runs the job; the report prints `variables: none` rather than an empty table.
- A workflow with no jobs: the report lists it with `jobs: 0` and `switch: missing`, and does not crash on an empty `jobs` map.
- A job whose `if:` is a quoted `${{ }}` string, a `>-` block or a condition with the switch ANDed: the parser reads the whole string and looks for the two variable names, not for an exact shape.
- A variable value other than `off`: the job stays `on`, because `off` is the only disable token.
- A `.github/workflows` path reached through the `.opencode` symlink: the surface is still `CI`, because the marker test reads the repository-relative path after resolution.

### Error Scenarios
- `gh` unavailable or unauthenticated: `variableState: unknown`, `newestNonRebuildSha: null`, exit 0, and the reason on stderr.
- No non-rebuild SHA in the last 100 `main` runs: `newestNonRebuildSha: null` with the reason `no non-rebuild SHA in the last 100 runs`; the report does not guess.
- A YAML parse error in one workflow: the report names the file and the parser message and exits 1; the other files are still listed in the JSON `errors` array.
- A scaffold target that already exists: `REFUSE: the target path already exists; scaffold creates new workflows only`, exit 1, no write.
- A toggle of `SKILLED_CI_MESSAGES` to `off`: `REFUSE: SKILLED_CI_MESSAGES must stay unset while the ruleset requires that context`, exit 1, no write.
- The R28 probe's delete fails: the task stops, records the failure, and the operator deletes the variable by hand before any further work.

### State Transitions
- Partial completion: the report route can land before the scaffold and toggle routes, because the report needs no template and no variable write; the registration and bridge tasks run only after all three routes exist.
- D9 flips after the command is written: the toggle task re-reads the answer, changes only the route's `mutating` value, its `gate3_location` and the YAML's write step, and re-runs `route-validate.sh`.
- Rollback: the command folder, its routes, its bridge activations and the regenerated projection are one commit; a revert removes them together. The R30 changes are a second commit and revert together with the test.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | 7 created command assets, 2 test files, 3 route entries, 3 bridge activations, 4 generated files, 7 sk-code docs, 1 test |
| Risk | 14/25 | A repository-settings write, a confirmed workflow scaffold, a shared detection contract, and a bridge vocabulary that can steal an existing phrase |
| Research | 8/20 | The final review fixes the shape; this phase reads the doctor validators, the bridge deriver, the phrase probe and the inline review router in full |
| Multi-Agent | 6/15 | One executor, no parallel workstreams; the only coordination is the operator yes on the probe and the two dependency phases |
| Coordination | 7/15 | Four inputs must land before the phase can close: the `006` templates, the `007` switch names and README section, the `gh` scopes, and D9 |
| **Total** | **53/100** | **Level 3** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | The R28 probe leaves `SKILLED_CI_PROBE` behind, or its delete fails | H | L | Delete in the same task, record the post-delete read-back, and stop on a surviving variable |
| R-002 | The report's switch parser misreads an ANDed `if:` and reports a switched-off job as `on` | M | M | Parse the whole expression for both variable names; test the three ANDed shapes and a quoted `${{ }}` string |
| R-003 | A new CI trigger phrase displaces an existing doctor phrase in the advisor's top pick | M | M | Three-or-more-word CI-specific phrases; replace the new phrase, never the existing one |
| R-004 | The scaffold writes over an existing workflow or a protected guard | H | L | Refuse an existing path and a protected name before the plan is printed; assert both refusals in the contract test |
| R-005 | The toggle sets `SKILLED_CI_MESSAGES=off` and the only required context stops blocking | H | L | Refuse it while the README carries the prohibition; assert the refusal string |
| R-006 | The `CI` value changes a SKILLED, OBSIDIAN or WEBFLOW detection result | H | M | Precedence puts SKILLED first and CI second; the test pins the three existing fixtures |
| R-007 | The precedence string drifts between `stack-detection.md` and `sk-code-review/SKILL.md` | M | M | The test asserts both carry the same string; every restatement is grepped |
| R-008 | A generated bridge file or the compiled manifest is hand-edited and the next check reports drift | M | L | Only the deriver and the manifest refresh write them; both `--check` forms run before the phase closes |
| R-009 | `006` or `007` has not landed, so the templates or the switch names are absent | H | M | The dependency task marks the affected tasks blocked and records the blocker; no template or name is substituted |
| R-010 | A changed skill doc keeps its version and the pull-request gate fails | M | L | Run `frontmatter-version.mjs bump`; never edit a version by hand |

## 11. USER STORIES

### US-001: The operator sees every workflow's switch state in one read-only report (Priority: P0)

**As an** operator running this repository on a fork or a clone, **I want** one command that lists every workflow with its switch state, trigger, filters and drift flags, **so that** I can tell which jobs a tree has switched off without reading 33 `if:` lines.

**Acceptance criteria:** see `acceptance-criteria.md` AC-003, AC-004, AC-005, AC-015, AC-020.

---

### US-002: The operator scaffolds a compliant workflow, or toggles a switch, only after seeing the exact change (Priority: P0)

**As an** operator adding a workflow or turning a group off, **I want** the command to print the whole proposed file or the exact `gh variable` command and wait for a yes, **so that** a protected guard cannot be replaced and a required context cannot be disabled by accident.

**Acceptance criteria:** see `acceptance-criteria.md` AC-006, AC-007, AC-010, AC-021.

---

### US-003: A workflow diff reviews with the CI evidence loaded (Priority: P1)

**As a** reviewer of a `.github/workflows` change, **I want** surface detection to return `CI` and the hub to bundle the `sk-code-ci` packet, **so that** the review applies the timeout, permissions, concurrency and switch rules instead of the generic baseline.

**Acceptance criteria:** see `acceptance-criteria.md` AC-012, AC-013, AC-014, AC-016, AC-018, AC-022.

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `decision-record.md`

---

## 12. OPEN QUESTIONS

- Can the owner's token write a repository variable? The R28 probe answers it with four exit codes and two read-backs; the answer decides D9. The account reports `viewerPermission: ADMIN` and the token scopes `gist, read:org, repo, workflow`, which is the expected success path, and the probe is still the only proof.
- Do the new trigger phrases reach their bridges without displacing an existing doctor phrase? `doctor-phrase-reach.cjs` answers it, and a failed new phrase is replaced rather than an existing one.
- Which sk-code-ci rules can the report check syntactically, and which stay prose? The report implements the eight checkable flags (timeout, permissions, concurrency, switch, SHA pin, README row, `pull_request_target`, and `github.event` in `run:`) and names the prose rules, path parity among them, as `notChecked`.
- Should `toggle` be a third route or a printed command inside `scaffold`? D9 and the route validator answer it: a read-only route cannot declare a write, so a writing toggle needs its own route, and a printing toggle can be a third read-only route.
- Does the compiled route bundle `sk-code-ci` for a workflow prompt? Phase 006's registration supplies the prompt terms and the surface mode; this phase records the observation and does not edit that registration.
<!-- /ANCHOR:questions -->

