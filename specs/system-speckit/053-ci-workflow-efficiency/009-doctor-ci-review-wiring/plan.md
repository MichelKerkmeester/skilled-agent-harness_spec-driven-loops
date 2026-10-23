---
title: "Implementation Plan: Phase 9: doctor-ci-review-wiring"
description: "Probe whether the owner's token can write a repository variable, then build /doctor:ci as three manifest routes: a read-only report over every workflow's switch state and newest non-rebuild SHA, a confirmed scaffold that reads the sk-code-ci templates, and a toggle shaped by the probe. Register the three advisor bridges and add the CI surface value to the shared detection contract, with a regression test that pins the three existing surfaces."
trigger_phrases:
  - "doctor ci review wiring plan"
  - "phase 9 doctor ci review wiring plan"
  - "ci workflow report command plan"
  - "ci surface detection plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 9: doctor-ci-review-wiring

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown command routers, YAML workflow assets, Node.js CommonJS scripts, Python 3 inside the sk-code-review router, and GitHub Actions workflow YAML as data |
| **Framework** | The doctor route manifest and its `route-validate` rules, the skill-advisor bridge deriver and phrase probe, and the sk-code hub's shared detection contract |
| **Storage** | None shipped. `scratch/` holds the R28 probe record, the pre-phase inventory, the live report and the phase result |
| **Testing** | `node:test` fixture trees for the report and the contract, `route-validate.sh`, `derive-command-bridges.cjs --check`, `doctor-phrase-reach.cjs`, the sk-code `*.test.cjs` glob, the drift-guard runner and `validate.sh --strict` |

### Overview
The phase is three moves in a fixed order. R28 writes one throwaway repository variable, reads it back, deletes it and records the four exit codes, which answers D9 and fixes the toggle's shape. R29 then writes the `/doctor:ci` command: a read-only report that resolves each job's switch from its `if:` line and the repository's variable values, a confirmed scaffold that reads the `sk-code-ci` templates, and a toggle that either writes or prints the exact `gh variable` command. R30 adds `CI` as the fifth `detect_surface_evidence` value and pins the three existing surfaces in a regression test, so a workflow diff loads the `sk-code-ci` evidence packet.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified: `006-sk-code-ci-surface` and `007-workflow-hygiene-on-off-control` landed, the R28 probe approved, `gh` with `repo` and `workflow` scopes, and the Node and Python installs the doctor tests need

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `route-validate.sh` exits 0 with `17 routes validated`; the bridge deriver is fresh; `doctor-phrase-reach.cjs` prints `STATUS=OK` with `bridges=21`
- [ ] `ci-report.cjs --json` lists every workflow in the tree with a switch state, and the live report names a non-rebuild SHA
- [ ] `surface-detection.test.cjs` passes with the three existing surfaces unchanged and `CI` added; the sk-code test glob and the drift-guard runner pass
- [ ] Docs updated: the command assets, the `/doctor:setup` row, the shared detection contract, the review router and the five hub restatements
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Manifest-driven router plus a read-only evidence script plus one shared contract value. The doctor command family owns the mutation boundary; the sk-code-ci packet owns the standards; the sk-code hub owns detection. Nothing in the phase keeps a second copy of a rule it can read from the packet or from the workflow tree.

### Component Responsibilities

| Component | Owns | Reads | Writes | Failure mode |
|-----------|------|-------|--------|--------------|
| `ci-report.cjs` | The inventory, the switch resolver, the drift flags and the N17 SHA resolution | `.github/workflows/*.yml`, `.github/workflows/README.md`, `gh variable list`, `gh run list`, `gh api` | Nothing | Exits 1 on a YAML parse error and names the file; degrades to `unknown` when `gh` fails |
| `ci.md` | The target table, the argument failure and the asset routing | `_routes.yaml`, the presentation contract | Nothing | Fails before YAML load on an unknown target or flag |
| `doctor-ci-report.yaml` | The read-only execution contract and the table columns | `ci-report.cjs` | Nothing | Route validator K1 rejects a write phrase |
| `doctor-ci-scaffold.yaml` | The proposed-file plan, the template reads and the yes gate | The two `sk-code-ci` templates and `protected-set.md` | One new `.github/workflows/` file, after a yes | Refuses an existing path and a protected name |
| `doctor-ci-toggle.yaml` | The six-name allow-list, the message-contract refusal and the read-back | `.github/workflows/README.md`, `gh variable list` | One repository variable, after a yes, under the write answer | Refuses an unknown name and `SKILLED_CI_MESSAGES=off` |
| `_routes.yaml` | Each route's mutation class, flags, gate location and trigger phrases | Nothing | The manifest | `route-validate.sh` fails on a missing asset or a read-only route that declares a write |
| `scoring-compatibility.json` | Which doctor bridges the advisor may route | Nothing | Three activation entries | A bridge without an entry stays inactive |
| `derive-command-bridges.cjs` | The four generated projections | `_routes.yaml`, `scoring-compatibility.json` | `command-bridges.generated.json`, `projection.ts`, `skill_advisor.py`, `render.ts` | `--check` reports `"status": "stale"` |
| `stack-detection.md` | The five-value contract and the precedence | Nothing | The contract | The drift guard reports a surface-count mismatch |
| `detect_surface_evidence` in `sk-code-review/SKILL.md` | The inline restatement the review router calls | The contract | Nothing | Returns `UNKNOWN` when no branch matches |
| `surface-detection.test.cjs` | The five fixtures and the contract/review agreement | Both copies of the contract | Nothing | Fails on a changed existing surface or a drifted precedence |

### Data Flow
The operator types `/doctor:ci` with a target. The router reads `_routes.yaml`, resolves the target's flags, and loads the target YAML. The report YAML runs `ci-report.cjs`, which reads the workflow tree and the repository variables and prints one row per workflow; it writes nothing. The scaffold YAML reads the two `sk-code-ci` templates, prints the proposed file, and writes only after a yes. The toggle YAML prints the exact `gh variable` command, asks for a yes, runs it only under D9's write answer, and reads the state back. Separately, the bridge deriver reads the manifest and the compatibility file, regenerates the four projections, and the phrase probe scores every admitted phrase against the built advisor. The sk-code review router calls `detect_surface_evidence`; a `.github/workflows` path returns `CI`, and the hub bundles `sk-code-ci` as evidence.

### Route State Machine

```
/doctor:ci
   │
   ├─ no target ──────────────► report (default), read-only
   ├─ report ─────────────────► read-only; exits 0 on success, 1 on a parse error, 2 on a bad flag
   ├─ scaffold ─── plan ──► yes ──► write one new file ──► re-read and print line 1
   │                    └─► no ──► stop, write nothing, exit 0
   ├─ toggle ───── plan ──► no ──► stop, write nothing, exit 0
   │                    └─► yes ─► D9=write: run gh, read back
   │                              D9=print: print the command, stop
   └─ unknown target or flag ─► argument failure before any YAML load, exit 2
```

### Invariants
- `detect_surface_evidence` returns exactly one of `SKILLED`, `CI`, `OBSIDIAN`, `WEBFLOW` or `UNKNOWN`, and no later branch overwrites an earlier match.
- A read-only route declares no write and grants no mutating advisor command, which `route-validate.sh` enforces at K1 and K2.
- Every script a route declares in `script_invocations` is named by a value in that route's workflow YAML, which `route-validate.sh` enforces at L1.
- The report never prints a variable value; it prints one of five states.
- No generated file is written by hand: the deriver owns the four bridge files and `compiled-route-manifest.cjs refresh` owns the compiled manifest.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/commands/doctor/_routes.yaml` | Producer of every doctor route, its mutation class and its trigger phrases; 14 routes today | update: three `/doctor:ci` routes appended after the `/doctor:setup` block at `:297-317` | `route-validate.sh` reports `17 routes validated` (T012, T027) |
| `.skilled/commands/doctor/ci.md` | New router; producer of the target table the validator reads | create: `report`, `scaffold`, `toggle` | J1 target parity passes and the router carries `<!-- skill_agent: sk-code -->` (T008, T012) |
| `.skilled/commands/doctor/assets/doctor-ci-*.yaml` | Producers of the three workflows | create: report read-only, scaffold confirmed, toggle shaped by D9 | D1, K1 and L1 pass; `doctor-ci-contract.test.cjs` asserts the templates, the confirmation and the prohibition (T007, T010, T011, T016) |
| `.skilled/commands/doctor/scripts/ci-report.cjs` | Producer of the report | create: inventory, switch resolver, drift flags and N17 resolution | `ci-report.test.cjs` passes on a fixture tree and a `gh` stub (T005, T006) |
| `.skilled/commands/doctor/assets/doctor-setup-presentation.txt` | Consumer that lists every doctor command | update: one `/doctor:ci report` row after `:25` | `grep -cF '\| `/doctor:ci report` \|'` returns 1 (T015) |
| `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json` | Producer of bridge activation; 18 doctor activations in each list today | update: three entries in both lists | `derive-command-bridges.cjs --check` prints `"status": "fresh"` (T013, T014, T027) |
| `command-bridges.generated.json`, `projection.ts`, `skill_advisor.py`, `render.ts` | Consumers generated from the manifest | regenerate only | the deriver names them in `changed` on the write run and `[]` on the check run (T014, T027) |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json` and its authored twin | Consumer generated from the hub policy, which covers `SKILL.md` | regenerate only after the R30 doc edit and version bump | `compiled-route-guard.cjs` reports `sk-code fresh` and `compiled-route-sync.cjs --check` reports every served copy matching (T023) |
| `.skilled/skills/sk-code/shared/references/stack-detection.md` | Producer of the shared detection contract | update: CI row, precedence, block and test cases | `grep -c 'SKILLED > CI > OBSIDIAN > WEBFLOW > UNKNOWN'` returns 1 and the test passes (T018, T024) |
| `.skilled/skills/sk-code/sk-code-review/SKILL.md` | Consumer that restates the contract in `detect_surface_evidence` | update: precedence, `CI_PATH_MARKERS`, branch and docstring | the test's five fixtures pass and `grep -c 'CI_PATH_MARKERS'` returns 2 (T019, T024) |
| `.skilled/skills/sk-code/SKILL.md:74`, `:139` | Consumers that restate the tie-break and the detection values | update: `:139` names CI in the precedence; `:74` separates the bundle order from that precedence | `grep -c 'SKILLED > CI' .skilled/skills/sk-code/SKILL.md` returns 1 and `:74` names `stack-detection.md` as the owner (T020) |
| `.skilled/skills/sk-code/ROUTER.md:112`, `code-quality-standards.md:56`, `design-restraint-ladder.md:13` | Consumers that restate the precedence | update: name CI | `grep -L 'SKILLED > CI'` returns nothing for the three files (T021) |
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs:497-506` | Benchmark replay heuristic over task text; it mirrors an older two-surface contract and already omits OBSIDIAN | unchanged; it is not the review router's surface selector, and adding CI there would create a third copy of the contract | `rg -n 'function detectSurface'` shows the function unchanged and `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs` passes (T025) |
| `006-sk-code-ci-surface` packet | Producer of the templates, the protected set and the rule index; absent today | unchanged; read by the report and the scaffold | `test -f .skilled/skills/sk-code/sk-code-ci/assets/workflow-template.yml` and the report's `not checked` line names the prose rules (T003, T005) |
| `007-workflow-hygiene-on-off-control` switch line | Producer of the six variable names, the job `if:` shape and the README `### On/off switches` section; absent today | unchanged; read by the report and the toggle | the live report resolves `on`/`off` and `doctor-ci-contract.test.cjs` asserts the six names (T003, T028) |

Required inventories:
- Same-class producers: `rg -n 'detectSurface|detect_surface_evidence|SKILLED > OBSIDIAN|surface_evidence' .skilled/skills/sk-code --glob '*.md' --glob '*.py' --glob '*.cjs'` finds the shared contract, the review router, the hub restatements and the benchmark replay heuristic; `rg -n 'command-doctor-' .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json` finds the 18 existing activations in each list.
- Consumers of changed symbols: `rg -n 'SKILLED_CI|ci-report|doctor:ci' .skilled .github --glob '!**/node_modules/**'` finds the phase 007 switch lines, the new command, the bridge data and the `/doctor:setup` row. No runtime code reads a workflow's switch except the new report.
- Matrix axes: surface (SKILLED, CI, OBSIDIAN, WEBFLOW, UNKNOWN) x input (target path, file content, prompt text) x expected value, with five required rows; route (report, scaffold, toggle) x mutation class (read-only, mutates) x D9 (write, print), with the four valid combinations named in the contract test.
- Algorithm invariant: `detect_surface_evidence` returns exactly one of the five values; SKILLED wins for a resolved `.skilled/` path, CI wins for a `.github/workflows/` or `.github/actions/` path segment, and no later branch overwrites an earlier match. Adversarial cases: a `.skilled/` path plus a workflow path; a workflow path plus a Webflow marker; a prompt saying `not webflow` plus a workflow path; a symlinked path that resolves outside the hub; a file named `workflows-notes.md` that is not under `.github/workflows/`.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

### Implementation Notes

- **D9 is the only operator decision, and the probe is the decision.** The R28 probe runs first because the toggle's mutation class, gate location and write step all depend on its answer. The default is write when `gh variable set` exits 0: the account reports `viewerPermission: ADMIN` and the token scopes `gist, read:org, repo, workflow`, and the earlier "admin token" claim was inferred, not exercised (`research.md:174-178`). The alternative, in one line, is print-only: the route prints the exact `gh variable set`/`gh variable delete` command and writes nothing, which makes it `mutating: read-only` and gives it an `n/a` gate location. T001 writes the answer as a single `D9: write` or `D9: print` line in this section, and every later task that reads it greps for that anchored line.
- **Internal order is R28, then R29, then R30.** The probe fixes the toggle before the command is written, the command's report reads the six switch names before the review surface is wired to them, and R30 goes last because a detection regression would otherwise be confused with a command failure (`final-review.md:602`).
- **The report reads the switch expression, not a second group table.** Phase 007 writes `if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_* != 'off'` on every job except Dependabot's two, where the asterisk is one of the five group names (`007-workflow-hygiene-on-off-control/plan.md:65`). The report parses the two variable names out of each job's `if:` string and resolves the values through `gh variable list --json name,value`; it never reads `007`'s `scratch/switch-groups.md`, because a shipped command must not depend on a mutable spec folder; the `if:` line is the durable source.
- **A switch state is five values, not two.** `on` means the master and the group are both set to something other than `off`, or unset; `off` means either is exactly `off`; `partial` means some jobs in one workflow are off and others are on; `missing` means no job carries a switch; `unknown` means `gh` could not be read. `dependabot-auto-merge.yml` has no switch by design, so its jobs report `on` and never raise `switch-missing`. The report prints the state, never the variable value.
- **The newest non-rebuild SHA is resolved by commit message, not by workflow name.** A rebuild SHA carries its downstream runs as well as the rebuild run, so excluding runs whose workflow is `trigger-index-rebuild.yml` does not exclude the SHA. The report reads `gh api repos/{owner}/{repo}/commits/CANDIDATE_SHA --jq .commit.message` for each candidate and excludes a SHA whose last non-empty line is `Trigger-Index-Rebuild: ci` (`final-review.md:186`).
- **The report's drift flags are the syntactic subset of the sk-code-ci rule index.** It checks a timeout on every job, a `permissions:` block, a `concurrency:` block, a switch on every job except Dependabot's two, a 40-hex SHA on every `uses:` that is not a local action, a README row, no `pull_request_target`, and no `${{ github.event` inside a `run:` block. The prose rules - path parity, `set -euo pipefail`, matrix guidance - are named in the report's `notChecked` list, because a prose rule cannot be parsed without inventing a second copy of it. The scaffold and the review surface remain the places that read the full packet.
- **The scaffold creates, it never overwrites.** The final review's R29 names `report` and `scaffold`; a `customize` route for an existing workflow is out of scope. The scaffold refuses an existing path and refuses a name that matches the protected set, so a protected guard cannot be replaced by the template. The operator sees the whole file before the yes.
- **The toggle's prohibition is read from the workflows README.** Phase 007 writes `SKILLED_CI_MESSAGES must stay unset` in the `### On/off switches` section (`007-workflow-hygiene-on-off-control/tasks.md:2092`). The toggle greps that section before it sets `off`; the rule is documented where a clone reads it, and the command enforces it where a clone acts.
- **The bridge phrases are new and CI-specific.** `doctor-phrase-reach.cjs` admits a phrase only when it reaches its bridge as the top pick, or as the second line behind a non-doctor top pick (`doctor-phrase-reach.cjs:212-241`). A generic phrase such as `ci workflow` would displace an existing skill; every phrase here is three or more words and names a doctor action (`ci workflow status report`, `scaffold a github actions workflow`, `turn off a ci workflow`). A failed phrase is replaced; an existing phrase is never edited.
- **The CI surface sits second, after SKILLED.** A resolved `.skilled/` target is hub work and must keep winning, which is the symlink guard's purpose (`stack-detection.md:67-75`). CI follows because a `.github/workflows/` path is as explicit as a `.skilled/` path and must not be outvoted by a Webflow or Obsidian marker in the same diff. The hub's `routerPolicy.tieBreak` is a bundle order, not this single-surface precedence: phase 006 inserts `sk-code-ci` before `sk-code-skilled` there to satisfy the hub's own check 5l (`006-sk-code-ci-surface/spec.md:122`), and `sk-code/SKILL.md:74` is reworded so the two are no longer described as the same order.
- **The compiled route's bundle is phase 006's registration.** `compiled-route.cjs` selects a surface from the hub's mode registry and an optional `--surface-hint`; it does not run `detect_surface_evidence`. Today a workflow prompt returns `"selectionKind":"single"` with only `sk-code-review`. After phase 006 registers `sk-code-ci` as a surface mode with its prompt terms, the same prompt should return `surfaceBundle`. T026 records the observed output and does not edit phase 006.
- **Every changed skill doc raises its version.** `skill-doc-frontmatter.yml`'s `doc-version-raise` job fails a pull request whose changed doc body keeps its version (`skill-doc-frontmatter.yml:48-78`). T022 runs `frontmatter-version.mjs bump` after the six doc edits and adds the two changelog entries the bumped versions name. The tool needs `@spec-kit/shared`, which T002 builds; a version edited by hand instead of by the tool is the one outcome the gate cannot distinguish from a correct bump.
- **The sk-code-obsidian packet's own docs are left alone.** They restate the old precedence, but they are that packet's release documents, and this phase changes the hub's shared contract and review selection. The packet's next release can adopt the new string; this phase records the decision rather than editing a sibling packet.
- **No ephemeral ids in code.** No R-id, D-id or phase number enters a command asset, a script comment, a YAML asset, a test name, a commit message or a skill doc. The ids live in these spec documents; a code comment carries the durable reason, such as why the toggle refuses the message-contract variable.
- **The workflow count is read, never hard-coded.** The tree holds 33 files and 44 jobs today; phase 004's D5 removes `hooks-node-tests.yml`, leaving 32 files, and phase 008's D8 merge leaves 25 files on the D5-approved tree or 26 on the D5-rejected one. The report enumerates `glob('.github/workflows/*.yml')` and the acceptance checks the count against the same glob, so the report is correct in every state.
- **The build is a prerequisite, not an afterthought.** This worktree has no `node_modules`: `derive-command-bridges.cjs` fails with `Cannot find module 'yaml'` and `doctor-phrase-reach.cjs` prints `advisor runtime is not built` until `.skilled` and the advisor runtime are installed and built. T002 runs the same install set the doctor CI job runs (`spec-kit-check.yml:205-215`), then the advisor build.
- **The R28 probe is a repository-settings write and a stop-for-yes.** It uses a name no workflow reads, reads the value back, deletes it, reads the deletion back, and records all four exit codes. A failed delete is a blocker, not a note; the rollback is the delete itself.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The report on a two-workflow fixture tree: switch on/off/missing, timeout/permissions/concurrency flags, a rebuild SHA excluded, a non-rebuild SHA selected, a malformed YAML | `node --test .skilled/commands/doctor/scripts/tests/ci-report.test.cjs` |
| Contract | The three routes, their mutation classes, the target table, the presentation displays, the template paths, the toggle prohibition and the no-ephemeral-id rule | `node --test .skilled/commands/doctor/scripts/tests/doctor-ci-contract.test.cjs` |
| Integration | The manifest against its assets, router, presentation and script invocations | `bash .skilled/commands/doctor/scripts/route-validate.sh` |
| Integration | The bridge projection is current, and every admitted phrase reaches its bridge | `node .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs --check` and `node .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs` |
| Unit | The five surface fixtures, the precedence and the contract/review agreement | `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/surface-detection.test.cjs` |
| Integration | Every sk-code script test and the four drift guards | `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/*.test.cjs` and `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` |
| Integration | Every changed skill doc raises its version and its changelog matches | `node .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs bump --check --base origin/main` |
| Manual | The R28 probe: set, get, delete, get | `gh variable set/get/delete SKILLED_CI_PROBE` |
| Manual | The live report and the compiled route for a workflow prompt | `node .skilled/commands/doctor/scripts/ci-report.cjs --json` and `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "review the GitHub Actions workflow diff in .github/workflows/spec-kit-check.yml"` |
| Validation | The packet | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `006-sk-code-ci-surface` | Internal | Pending | No templates, no protected set and no rule index; the scaffold and the drift half of the report are blocked |
| `007-workflow-hygiene-on-off-control` | Internal | Pending | No switch line, no six names and no README section; the report shows `switch: missing` and the switch-state criterion stays `Unmet` |
| `002-rebuild-fanout-removal` | Internal | Pending | N17 is the condition the resolution handles; the report resolves the newest non-rebuild SHA before and after R1, so this dependency does not block the phase |
| Operator decision D9 | Internal | Yellow until the R28 probe runs | The probe is pre-approved (scratch/r28-probe-approval.md); T001 runs it first, and its outcome writes the D9 line the toggle route reads |
| `gh` with `repo` and `workflow` scopes | External | Green | `gh variable list --json name,value` exits 0 with the scopes `gist, read:org, repo, workflow` and `viewerPermission: ADMIN`; without it the report degrades to `unknown` and the probe cannot run |
| `.skilled` and advisor runtime installs | External | Yellow until installed | `derive-command-bridges.cjs` cannot parse the manifest and `doctor-phrase-reach.cjs` cannot load the built scorer; T002 installs and builds both |
| `008-consolidation-decision` | Internal | Not a hard dependency | Phase order only; no file this phase reads is written by 008 |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The R28 probe leaves a variable behind, the report misreads a switch, a new bridge phrase displaces an existing doctor phrase, the scaffold writes without a yes, or the CI surface changes an existing detection result.
- **Procedure**: Revert the commit for the failing concern. T031 commits four concerns: the report, the scaffold and toggle, the sk-code surface with its version bump and compiled-route refresh, and the `/doctor:setup` row. Reverting the report commit leaves the command folder and its routes absent together; reverting the sk-code commit restores the four-value contract. The R28 probe's rollback is `gh variable delete SKILLED_CI_PROBE`, run before any other work if the probe fails.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
006 packet ──┐
007 switches ─┼──► Setup (D9, build, inventory) ──► R29 command ──► R29 bridges ──► R30 surface ──► Verify
002 (N17) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | `006`, `007`, D9, the installs | R29 command |
| R29 command | Setup | R29 bridges |
| R29 bridges | R29 command | Verify |
| R30 surface | R29 command (the report reads the switch names) | Verify |
| Verify | R29 bridges and R30 surface | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | ~1.5 hours: the probe, the installs, the dependency check and the baseline |
| R29 report | High | ~4 hours: the script, its fixture test, the report YAML and the presentation |
| R29 scaffold and toggle | Medium | ~3 hours: two workflows, the template reads and the confirmation gates |
| R29 registration | Medium | ~2 hours: three routes, six activation entries, the deriver, the setup row and the contract test |
| R30 surface | Medium | ~3 hours: the contract, the review router, five restatements, the version and compiled-route refresh and the fixture test |
| Verify | Low | ~1.5 hours: the gates, the live report, the compiled route and the phase result |
| **Total** | | **~15 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes) - not applicable; the probe's variable is created and deleted in one task, and the tree is version-controlled
- [ ] Feature flag configured - the command is additive and the CI surface value is a pure function; the switch variables it reads already default to on
- [ ] Monitoring alerts set - the doctor script suite, the phrase probe and the sk-code test glob are the monitors

### Rollback Procedure
1. Immediate action - if the probe's delete failed, run `gh variable delete SKILLED_CI_PROBE` before any other work.
2. Revert code - `git revert` the command commit, then the R30 commit; do not hand-delete the command folder while `_routes.yaml` still names it.
3. Verify rollback - `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0 with `14 routes validated`, `node .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs` exits 0 with `bridges=18`, and `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/*.test.cjs` passes.
4. Notify stakeholders - if the command was already handed to a clone, tell that clone the `/doctor:ci` row is gone.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A. The probe's variable is deleted in the task; the scratch records stay as the evidence of what was measured.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
   006 templates ──┐
   007 switches ───┤
   gh ADMIN ───────┼──► ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
   002 (N17) ──────┘    │    Setup     │───►│  R29 command │───►│  R29 bridges │
                        │  T001-T004   │    │  T005-T012   │    │  T013-T017   │
                        └──────┬───────┘    └──────────────┘    └──────┬───────┘
                               │                                       │
                               │            ┌──────────────┐           │
                               └───────────►│  R30 surface │◄──────────┘
                                            │  T018-T026   │
                                            └──────┬───────┘
                                                   ▼
                                            ┌──────────────┐
                                            │    Verify    │
                                            │  T027-T033   │
                                            └──────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| D9 answer (T001) | Operator yes, `gh` admin | `scratch/r28-probe.md`, the `D9:` line | T011, T016 |
| Toolchain (T002) | None | `yaml`, PyYAML, the built advisor runtime and `@spec-kit/shared` | T004, T006, T014, T022 |
| Inventory (T003) | `006`, `007` | `scratch/inventory.md` | T005, T010, T011, T028 |
| Baseline (T004) | T002 | `scratch/pre-phase.md` | T027, T030 |
| Report script (T005) | T002, T003 | `ci-report.cjs` | T006, T007, T028 |
| Report fixture test (T006) | T005 | `ci-report.test.cjs` | T017, T030 |
| Report workflow (T007) | T005 | `doctor-ci-report.yaml` | T012, T016 |
| Router (T008) | Nothing | `ci.md` | T012, T016 |
| Presentation (T009) | T008 | `doctor-ci-presentation.txt` | T012, T016 |
| Scaffold (T010) | T003 | `doctor-ci-scaffold.yaml` | T012, T016 |
| Toggle (T011) | T001, T003 | `doctor-ci-toggle.yaml` | T012, T016 |
| Route manifest (T012) | T007 to T011 | three `/doctor:ci` routes | T013, T027 |
| Bridge activations (T013) | T012 | `scoring-compatibility.json` | T014, T027 |
| Projections (T014) | T013, T002 | four generated files | T027, T030 |
| Setup row (T015) | T008 | `doctor-setup-presentation.txt` | T030 |
| Contract test (T016) | T007 to T012 | `doctor-ci-contract.test.cjs` | T017, T030 |
| Doctor suite (T017) | T006, T016 | `scratch/doctor-suite.md` | T030 |
| Shared contract (T018) | Nothing | the CI row and precedence | T019, T024 |
| Review router (T019) | T018 | the CI branch and `CI_PATH_MARKERS` | T020, T024 |
| Hub restatements (T020, T021) | T019 | four docs that name CI | T022, T025 |
| Version and changelog (T022) | T020, T021, T002 | bumped versions, two changelog files | T023, T030 |
| Compiled manifest (T023) | T022 | the refreshed manifest and its twin | T025, T030 |
| Surface test (T024) | T018, T019 | `surface-detection.test.cjs` | T025, T030 |
| Sk-code gates (T025) | T023, T024 | `scratch/sk-code-gates.md` | T030 |
| Compiled-route observation (T026) | T023 | `scratch/compiled-route.md` | T030 |
| Verification (T027 to T033) | every task above | `scratch/phase-result.md`, the closed criteria | Phase 008 follow-up and the parent packet |
<!-- /ANCHOR:dependency-graph -->

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **T001 - the R28 probe and D9** - operator latency, then minutes - CRITICAL, because the toggle's mutation class, gate location and write step cannot be written before the answer exists.
2. **T003 - the dependency check and inventory** - 1 hour - CRITICAL, because the template paths, the six variable names and the workflow count every later task cites come from this record.
3. **T005 - the report script** - 3 hours - CRITICAL, because the report workflow, the contract test and the live report all read it.
4. **T006 - the report fixture test** - 2 hours - CRITICAL, because the switch parser and the SHA resolution have no other proof.
5. **T012 - the three routes** - 1 hour - CRITICAL, because `route-validate.sh`, the bridge deriver and the phrase probe all read the manifest.
6. **T014 - the bridge projections** - 30 minutes - CRITICAL, because the advisor cannot route a bridge the projection does not carry.
7. **T018 and T019 - the shared contract and the review router** - 2 hours - CRITICAL, because every restatement and the regression test copy their string from these two files.
8. **T022 - the version bump and changelog** - 1 hour - CRITICAL, because the pull-request gate fails a changed doc that keeps its version.
9. **T030 - the full gate and phase result** - 1 hour - CRITICAL, because a green gate is the only closure evidence.

**Total Critical Path**: 12 hours plus operator latency on T001 and the 24-hour wait for a fresh run-data snapshot in the parent packet.

**Parallel Opportunities**:
- T005 (the report script) and T008 (the router) can run beside each other, because the router names the report YAML but does not read the script.
- T018 (the shared contract) can start once T003 confirms phase 006's packet, in parallel with T005 to T012, because it touches no doctor file.
- T020 and T021 (the four hub restatements) can run in any order once T019 lands, because each edits a different file.
- T024 (the surface test) can be written while T022 runs, because it reads the two contract files rather than the versions.
- T015 (the `/doctor:setup` row) can run any time after T008, because it edits one line of a different file.
<!-- /ANCHOR:critical-path -->

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Probe answered and setup recorded | T001 to T004 done; `scratch/r28-probe.md` holds four `exit=` lines, `plan.md` holds one `D9:` line, `scratch/inventory.md` names the workflow and job counts and the six variables, and `scratch/pre-phase.md` records `14 routes validated`, a fresh projection and `bridges=18` | Phase 1 exit |
| M2 | Report working | T005 to T007 done; `node --test .skilled/commands/doctor/scripts/tests/ci-report.test.cjs` exits 0 with at least 5 passing subtests, and the report YAML parses with `read_only True` | Phase 2 exit |
| M3 | Command complete | T008 to T012 done; `route-validate.sh` prints `17 routes validated` and the three `/doctor:ci` targets appear in the manifest | Phase 3 exit |
| M4 | Bridges and registration live | T013 to T017 done; the deriver prints `"status": "fresh"`, the phrase probe prints `STATUS=OK` with `bridges=21`, and the doctor suite exits 0 | Phase 4 exit |
| M5 | CI surface landed | T018 to T026 done; the contract and the review router carry `SKILLED > CI > OBSIDIAN > WEBFLOW > UNKNOWN`, the surface test exits 0 with at least 9 assertions, the drift guards print `all 4 guards PASSED`, and the compiled manifest is fresh | Phase 5 exit |
| M6 | Closed | T027 to T033 done; the live report lists every workflow and a non-rebuild SHA, the strict validator prints `RESULT: PASSED`, and every acceptance row carries evidence | Phase 6 exit |
<!-- /ANCHOR:milestones -->

## L3: ARCHITECTURE DECISION RECORD

The formal records, with context, constraints, alternatives, five checks and the tasks each choice gates, are `decision-record.md` ADR-001 to ADR-012. This table is the one-screen index.

| ADR | Decision | Rationale |
|-----|----------|-----------|
| ADR-001 | D9 is answered by the R28 probe; write is the default and print is the alternative | The probe is the only evidence that the token may write repository variables, and the toggle's mutation class follows from the answer |
| ADR-002 | A declined probe selects print and waives the probe criterion | A repository-settings write is a stop-for-yes step, and the command still works when it prints the command instead |
| ADR-003 | The report resolves a switch from the job `if:` expression and `gh variable list` | The `if:` line is the durable source; a spec folder is mutable and must not be a runtime dependency |
| ADR-004 | The newest non-rebuild SHA is excluded by commit-message trailer | A rebuild SHA carries downstream runs, so a workflow-name filter cannot exclude it |
| ADR-005 | The scaffold creates new files only and refuses a protected name | A template must not replace a protected guard, and the final review names no customize route |
| ADR-006 | `CI` sits second in the surface precedence, after `SKILLED` | A resolved `.skilled/` path is hub work; a workflow path is the next strongest explicit marker |
| ADR-007 | The toggle reads the message-contract prohibition from the workflows README | The rule is documented where a clone reads it, so the command enforces the same sentence |
| ADR-008 | The report checks the syntactic rule subset and names the prose rules `notChecked` | A parsed prose rule would become a second copy of the packet |
| ADR-009 | The report is a standalone Node script, not inline router prose | The switch parser and the SHA resolution need a fixture test with a `gh` stub |
| ADR-010 | The compiled-route bundle proof is an observation, not a build task | Phase 006 owns the surface registration; editing it here would cross the phase boundary |
| ADR-011 | No ephemeral id enters code, an asset or a test name | A spec id in code goes stale; the durable reason belongs in the comment |
| ADR-012 | New CI trigger phrases are replaced when they fail, never an existing phrase | A new command must not make an existing doctor route harder to reach |

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist
- [ ] Read `tasks.md` and confirm the task id, its file, its quoted anchor and its line number.
- [ ] Re-read the file the task edits; confirm the quoted anchor is still on the named line and belongs to the route, table or block the task names.
- [ ] Confirm the task is not blocked; if it is, record the blocker in `scratch/phase-result.md` and stop before editing.
- [ ] Confirm the task's commands are run from the repository root and that `PHASE` is set in the same block when the command uses it.
- [ ] Confirm the task's cited acceptance criterion exists in `acceptance-criteria.md`.

### Execution Rules
| Rule | Description |
|------|-------------|
| TASK-SEQ | Run T001 to T033 in order. T001 gates T011; T003 gates T010 and T011; T012 gates T013 and T014. |
| TASK-SCOPE | Write only the paths named in `spec.md`'s Files to Change table and this phase's `scratch/`. Every other path is read-only. |
| TASK-PROOF | Run the task's check and read both its output and its exit status before marking the task `[x]`. |
| TASK-ANCHOR | Locate the quoted text. A moved line is not a changed edit; an absent anchor is a stop, not a nearby edit. |
| TASK-COMMENT | No command asset, script comment, YAML asset, test name or commit message added by this phase carries an R-id, a D-id or a phase number. |
| TASK-GATE | No toggle task runs before the `D9:` line exists in `plan.md`; no scaffold task runs before the `006` templates exist. |
| TASK-GENERATED | Write no generated file by hand. The bridge deriver owns four of them and `compiled-route-manifest.cjs refresh` owns the compiled manifest. |

### Status Reporting Format
After each task: `Task T### complete. Files: <paths>. Proof: <command> -> <observed output/exit>.` At a phase boundary, report the task range, the files changed and the gate that passed.

### Blocked Task Protocol
If a task cannot run, stop and record the blocker in `scratch/phase-result.md` with the task id, the command that failed and its output. Do not substitute a different file, a different number or a different command. A blocked task stays blocked until its dependency's proof exists; a failed gate is repaired, not waived.
