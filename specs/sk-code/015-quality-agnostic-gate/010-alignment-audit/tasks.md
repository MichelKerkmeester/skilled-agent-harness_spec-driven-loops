---
title: "Tasks: Phase 10: alignment-audit"
description: "The finding ledger for the alignment audit: setup, the four audit lanes, one task per fix group with its verify command and evidence, the release work, the open items and the final-state gates."
trigger_phrases:
  - "alignment audit tasks"
  - "alignment audit finding ledger"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.3 -->
# Tasks: Phase 10: alignment-audit

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

Shell variables for every command in this list. Run each command from the repository root, which is the worktree `.worktrees/218-ci-efficiency-build`. Prefix every git command with `GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=core.fsmonitor GIT_CONFIG_VALUE_0=false`.
- `H=.skilled/skills/sk-code`
- `Q=.skilled/skills/sk-code/sk-code-quality`
- `R=specs/sk-code/015-quality-agnostic-gate`
- `P=$R/010-alignment-audit`

Evidence labels. "Re-run 2026-10-26" means this phase ran the command on the final tree. "Reported" means a fix batch or the re-audit recorded the output and no later command contradicts it. A row is ticked only where a re-run or the re-audit confirms it. Readings before the commit were taken on HEAD `6d6e82c269` plus the working tree, which landed on main as `7d6474c602` (this folder), `f431355ac2` (the fixes) and `554c8c8f78` (the version name), with the CI repairs `c1fe3ae9b4` and `8c760290ff`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Build the scope file from the two packets' commits, symlinks resolved. Verify: `wc -l < scratchpad/audit-scope-real.txt` prints `705`. Re-run 2026-10-26: it printed `705`, and the code-and-config subset in `align/q1/code.txt` printed `405`.
- [x] T002 Record the audit-time readings that the fixes are measured against. Reported 2026-10-26: `quality-gate.cjs` over the 405 code files exited 0 with `NO_BLOCKER_FOUND`, 390 checked, 15 skipped as generated output and 0 findings. `actionlint` over 32 workflows exited 0. `shellcheck -S warning` over 12 shell files gave one real warning. `run-all-drift-guards.sh` passed 4 of 4. `validate_skill_package.py --strict` over 23 packets gave 21 PASS and 2 FAIL. `validate_document.py --blocking-only` over 1202 documents gave 28 failures.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Audit lanes

- [x] T003 [P] CODE lane, question 1 (REQ-001). Findings CODE-01 to CODE-08, one P1 and seven P2. Reported: nothing the checkers cover failed, and the findings came from the contract text, a workflow rule check and `shellcheck`.
- [x] T004 [P] DOCS lane, questions 2 and 3 (REQ-002, REQ-003). Findings SKILL-01 to SKILL-12, four P1 and eight P2. Reported: the playbook corpus check had 0 violations before the fixes, so the findings came from the contract text and the feature coverage read.
- [x] T005 [P] READ lane, questions 4, 5 and 8 (REQ-004, REQ-005, REQ-008). Findings README-01 to README-11 and CHANGELOG-01, five P1 and seven P2. Reported: 142 READMEs passed `validate_document.py` before the fixes, so the findings came from reading the READMEs against the tree.
- [x] T006 [P] ROUT lane, questions 6, 7, 9 and 10 (REQ-006, REQ-007, REQ-009, REQ-010). Findings ROUTE-01, ROUTE-02, ADV-01, CMD-01, CMD-02 and AGT-01, all P2. Reported: every routing and mirror leg of the CI gate script exited 0 before the fixes.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Fix round 1 (28 batches)

### Code (question 1)
- [x] T007 CODE-01 and CODE-02, six test files placed beside their source (REQ-001) (batches b1, b2). Batch b1 moved `post-edit-router.test.cjs` and b2 moved the other five under `tests/`, with their callers repointed in the workflow, the quality `SKILL.md`, two scripts READMEs, two playbooks and the hook README. Verify: `node --test .skilled/hooks/post-edit-quality/tests/*.test.cjs` and the three bash suites exit 0. Re-run 2026-10-26: the hook suite printed `# tests 13`, `# pass 13`, `# fail 0`, and `ceiling-report.test.sh`, `check-comment-hygiene.test.sh` and `check-rule-copies.test.sh` each exited 0 from their new `tests/` folders.
- [x] T008 CODE-03 and CODE-04, standard headers (REQ-001) (batches b2, b3). A COMPONENT divider header went on six bash scripts and one Python script, and a MODULE header on `router-replay-lib.cjs`. Verify: `head -5` of each shows the divider, and `run-all-drift-guards.sh` exits 0. Re-run 2026-10-26: `check-gate-inputs.sh` printed `files=45 ... failures=0` and `RESULT: PASSED`, `check-gate-inputs.test.sh` exited 0, and the guards printed `all 4 guards PASSED, 10 non-blocking warning(s)`.
- [x] T009 CODE-05, CODE-06 and CODE-07, workflow strictness (REQ-001) (batches b4, b5, b6). `set -euo pipefail` is the first line of three `run:` blocks, one comment states why `spec-kit-check.yml` runs `set -uo pipefail`, and the `ci-workflow-standards.md` row now counts 29 of 30 workflow files and names all eight deliberate `-uo` steps. Verify: `actionlint .github/workflows/*.yml` exits 0. Re-run 2026-10-26: `actionlint` printed nothing and exited 0. The re-audit counted the `-uo` steps in `advisory-checks.yml`, `spec-kit-check.yml`, `strict-pass-freshness-report.yml` and `trigger-index-rebuild.yml` and got the same eight.
- [x] T010 CODE-08, an unquoted glob in `test-dist-freshness.sh` (REQ-001) (batch b7). `CACHE_DIR` replaces `CACHE_GLOB`, and lines 44 and 82 quote it. Verify: `shellcheck -S warning` on the file prints nothing. Re-run 2026-10-26: it printed nothing and exited 0, and the test exited 0.

### Skill documents (question 2)
- [x] T011 SKILL-05, two skills over the word cap (REQ-002) (batch b10). The cli-opencode `SKILL.md` went from 5216 to 4979 words by moving the single-dispatch text to a new section of `references/integration-patterns.md`, and the sk-git `SKILL.md` from 5026 to 4964 by moving a known-gap note to a troubleshooting entry. Verify: `validate_skill_package.py --strict` on each. Re-run 2026-10-26: both printed `package_skill.py --check --strict: PASS (exit 0)`.
- [x] T012 SKILL-11, `ROUTER.md` numbered 1, 2, 3, 6 to 12 (REQ-002) (batches b16, c2). Sections renumbered 1 to 10, the inner citations and the `SKILL.md:66` pointer moved to section 9, and `verify-router-sync.cjs` now matches its heading by pattern. Verify: `parent-skill-check.cjs` and `verify-router-sync.cjs` exit 0 and `compiled-route-guard.cjs` exits 0. Reported by b16: the renumber verified except the guard, which waited on the manifest. Re-run 2026-10-26: the guard exited 0 with every hub fresh, and the drift guards, which run `verify-router-sync`, passed 4 of 4.
- [x] T013 SKILL-14 and ROUTE-03, citations to the old section 11 (REQ-002) (batch c4). `README.md:124` and `:135` and `restraint-prompt.md:102` now cite section 9. Verify: `! rg -n 'section 11' $H/README.md`. Reported by c4: no match and exit 0.

### Playbooks (question 3)
- [x] T014 SKILL-01, SKILL-02 and SKILL-03, three shipped features with no scenario (REQ-003) (batch b8). New scenarios `untrusted-config.md`, `scoped-checklist-faults.md` and `parallel-syntax-pool.md` under `quality-gate/`, indexed in the root playbook. Verify: `validate-playbook-package.cjs --package sk-code/sk-code-quality`. Re-run 2026-10-26: `PASS ... scenarios=11 ... operator=11 ... violations=0 warnings=11`. The 11 warnings are `BACKTICK_PATH_UNRESOLVED` on fixture paths, and existing scenarios carry the same warning.
- [x] T015 SKILL-04, `/doctor:ci` scaffold and toggle had no scenario (REQ-003) (batch b9). New `doctor-ci-scaffold.md` and `doctor-ci-toggle.md` scenarios, root playbook section 14 and index rows. Verify: `validate-playbook-package.cjs --package sk-code`. Re-run 2026-10-26: `PASS ... scenarios=28 categories=9 operator=20 routing_gold_excluded=8 violations=0 warnings=0`.
- [x] T016 SKILL-13, the doctor-commands category README still counted three scenarios (REQ-003) (batch c3). Line 18 now names five scenarios and line 32 their environment. Verify: `grep -c DOC-393` on the README. Reported by c3: the README validated with 0 issues.
- [x] T017 SKILL-06 and SKILL-10, scenario files outside the five-section shape (REQ-003) (batches b11, b15). Five sk-code compiled-routing scenarios and two ordered-bundle scenarios use TEST EXECUTION, SOURCE FILES and SOURCE METADATA, and one doctor scenario got its missing separator. Verify: `validate_document.py --blocking-only` over the eight sk-code compiled-routing files and the other three prints no FAIL, and the topology validator passes. Re-run 2026-10-26: `validate-playbook-topology.cjs --skill-dir .skilled/skills/sk-code --strict` printed `verdict=PASS valid=14 blocked=0 unenrolled=15 total=29`.
- [x] T018 SKILL-07, SKILL-08 and SKILL-12, root playbook shape (REQ-003) (batches b12, b13, b17). The sk-code-skilled root has the eleven numbered sections, the sk-code-ci root has review protocol, orchestration and feature-index sections, and the cli-cursor stress matrix reads section 16. Verify: `validate_document.py --type reference` on the two roots prints `Total issues: 0`. Reported by the re-audit: both roots printed `Total issues: 0`, and the cli-cursor root printed 0 `non_sequential_numbering` hits. Re-run 2026-10-26: `validate-playbook-package.cjs` printed `PASS ... sk-code/sk-code-skilled ... violations=0` and `PASS ... sk-code/sk-code-ci ... violations=0`.
- [x] T019 SKILL-09 and SKILL-15, the 14 fanout-stress files and the cli playbook root (REQ-003) (batches b14, c5). The 14 hermetic scenarios were rewritten into the five numbered sections, `routingGoldRoots` in `playbook-corpus-manifest.json` was narrowed to the routing-gold subfolders, and the root playbook gained the result-persistence marker. Verify: `validate-playbook-package.cjs --package cli-external-orchestration`. Re-run 2026-10-26: `PASS ... scenarios=24 categories=4 operator=14 routing_gold_excluded=10 violations=0 warnings=0`.

### READMEs (questions 4 and 5)
- [x] T020 README-01 and README-02, the doctor scripts READMEs (REQ-004, REQ-005) (batches b18, b19). `ci-report.cjs` and `orphan-process-check.cjs` joined the tree and key files, the trust state joined the config rows, and five suites joined the tests README. Verify: a loop over the folder files prints no `MISSING`. Reported by the re-audit: the loops printed nothing and both files validated with 0 issues.
- [x] T021 README-03, README-04, README-06, README-08 and README-12, the source-folder READMEs (REQ-004) (batches b2, b20, b22, c8). The quality scripts, lib and hooks READMEs list their real files and the trust and pool behavior, drop the migration history and the false "only place" claim, and the review and skilled scripts READMEs gained their directory tree and contents table. The quality README's semicolon and run-on sentence from the first edit were fixed in c8. Verify: `validate_document.py --type code_folder` and the file-name loops. Reported by the re-audit: README-03, 04, 06 and 08 each printed `Total issues 0` on `code_folder`, and c8 printed 0 for the two defect patterns.
- [x] T022 README-10, README-11 and README-13, the Devin hooks and plugin tests READMEs (REQ-004, REQ-005) (batches b23, b24, c9). A broken link to an archived spec was removed, and the plugin tests README lists `opencode-goal-handover.test.cjs` in its inventory, its tree and its count of nine. Verify: `check_readme_references.py .devin/hooks/README.md | grep -c "link '"` and `ls .opencode/plugins/tests | grep -c 'opencode-goal-.*test.cjs'`. Reported: the first printed `0` and the second printed `9`, matching the README.
- [x] T023 README-05, README-07, README-09 and CMD-01, the root README and the commands index (REQ-005, REQ-009) (batch b21). The root README names the quality runner, `.sk-code/quality.json`, the trust grant and `SKIPPED_UNTRUSTED`, and its OpenCode line reads `OPENCODE_BIN=opencode1`. Both indexes list `/doctor:sk-code [setup|quality] [--prompt=<text>] [--dry-run]`. The commands index lost its table of contents and anchor comments. Verify: `validate_document.py` on both and `command-catalog-mirror-check.cjs`. Reported by the re-audit: `README.md` printed `Total issues: 0`, `.skilled/commands/README.txt` printed `VALID` under `--type readme`, and the catalog check printed `STATUS=OK`.

### Changelogs (question 8)
- [x] T024 CHANGELOG-01, the class of internal ids and test counts in a changelog entry went undetected (REQ-008) (batch c7). `validate_document.py` gained `validate_changelog_omissions()` in the changelog branch. It warns on an internal id and on a test count, and it skips the frontmatter and spec-folder blockquote lines. Verify: `validate_document.py --type changelog` on `v1.4.0.0.md`. Re-run 2026-10-26: it printed `VALID`, `Total issues: 1` and `[changelog_internal_id] Changelog prose names an internal id (ADR-004, TH-002)`, with exit 0. The check warns and does not block, so the two released entries stay valid and unedited.

### Routing, advisor, commands and agents (questions 6, 7, 9, 10)
- [x] T025 ROUTE-01, clear GitHub Actions requests defer or reach the review mode (REQ-006) (batches b16, c2, the release, then a conductor fix). Six phrases joined the CI vocabulary in round 2, which left `add concurrency to the deploy workflow` deferring and `turn off the CI review workflows` reaching the review mode. The conductor then added `deploy workflow`, `release workflow`, `turn off the ci`, `turn on the ci` and `ci review workflow` to the `sk-code-ci` keywords in `hub-router.json`, `mode-registry.json` and both CI_WORKFLOW rows of `ROUTER.md`, and narrowed the round-2 keyword `github actions` to `github actions permissions`, because the bare phrase also counted inside `github actions workflow` and `github actions yaml` and pushed the review workflow out of the CI surface bundle (two surface-hint tests read `single` instead of `surfaceBundle`). The manifest was re-minted with `compiled-route-manifest.cjs refresh --hub sk-code --skill-root .skilled/skills/sk-code` and copied over the authored twin, and `LIVE_CORPUS_SIZE` in `compiled-route-admission.test.cjs` went from 93 to 95 for the two new `/doctor:ci` scenarios. Verify: `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt '<prompt>'`. Evidence 2026-10-26: `harden the GitHub Actions permissions`, `add concurrency to the deploy workflow`, `turn off the CI review workflows` and `add a timeout to the CI job` each route `single` to `sk-code-ci`, `review the github actions workflow yaml` routes `surfaceBundle` to `sk-code-review` and `sk-code-ci`, `review my pull request` routes to `sk-code-review` and `run the quality gate on my change` routes to `sk-code-quality`. `compiled-route-guard.cjs` printed `All hubs fresh or excused`, `compiled-route-admission.cjs --all` printed `Every hub passes the admission check`, and `node --test .skilled/bin/tests/compiled-route-*.test.cjs` printed `tests 94`, `pass 94`, `fail 0`. The sk-code v3.9.1.0 changelog notes the routing change.
- [x] T026 ROUTE-02, quality-config and trust vocabulary fell through to the skilled fallback (REQ-006) (batch b16). Seven trust and quality-config terms joined the quality classes. Verify: `compiled-route.cjs --hub sk-code --prompt 'why is my repository check SKIPPED_UNTRUSTED'`. Re-run 2026-10-26: it printed `selectionKind: surfaceBundle` with targets `sk-code-quality` and `sk-code-skilled`, so the quality mode is reached. `run the quality gate on my change` routes `single` to `sk-code-quality`.
- [x] T027 ADV-01, a bare `/doctor:ci` reached no advisor recommendation (REQ-007) (batch b26). `_routes.yaml` gained a `default_target` flag on three routes, `derive-command-bridges.cjs` emits the bare command as a keyword and slash marker, and `route-validate.py` checks the flag. Verify: `skill-advisor.cjs advisor_recommend --json '{"prompt":"/doctor:ci"}'`. Re-run 2026-10-26: it returned `command-doctor-ci-report` with confidence `0.82`.
- [x] T028 ADV-02, the bridge README described the old derivation (REQ-007) (batch c11). Line 60 of the command-bridges README now says a `default_target` route also gets the bare command as a keyword and marker and surfaces after the typed target on other `<command> <target>` prompts. Verify: `rg -n default_target` on the README. Reported by c11: it printed line 60 and the README validated with 0 issues.
- [x] T029 CMD-02, the `/doctor:setup` playbook expected an 18-row table (REQ-009) (batch b27). Lines 22, 29 and 71 now say 19 rows and line 29 includes `/doctor:sk-code quality`. Verify: `rg -n '19' doctor-setup-run.md`. Reported by the re-audit: the finding's test exited 0.
- [x] T030 AGT-01, `@code` cited `SKILL.md:62` for its Iron Law (REQ-010) (batches b28, c10). The citation now reads `.skilled/skills/sk-code/shared/references/workflow-verify.md` (Iron Law section) in the source, `.claude/agents/code.md` by hand, and the codex, pi, opencode and hermes copies by their generators. Verify: `rg -n 'sk-code/SKILL.md:62' .skilled/agents .claude/agents` finds none and the mirror checks exit 0. Re-run 2026-10-26: `check-agent-mirror-sync.cjs --all` printed `11 agent(s) checked - all mirrors in sync - OK`, `sync-agents.cjs --check` printed `PASS: 11 agents are in sync` and `sync-agents-pi.cjs --check` printed the same.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Re-audit and fix round 2 (11 batches)

- [x] T031 Re-audit the 38 fixes with four reviewers. Reported: 33 `fixed` and 5 `not_fixed` (SKILL-11, CHANGELOG-01, ROUTE-01, ROUTE-02 and AGT-01), plus 9 new findings. The `not_fixed` verdicts for SKILL-11, ROUTE-02 and AGT-01 were stale manifests and mirrors that round 2 and the release regenerated, as T012, T026 and T030 show.
- [x] T032 CODE-R01, the test move left the Hermes copy of sk-code-quality pointing at deleted paths (REQ-011) (batch c1). `sync-skills-hermes.cjs` wrote five copies. Verify: `sync-skills-hermes.cjs --check` and `! grep -nE 'scripts/(ceiling-report|check-comment-hygiene)\.test\.sh' .hermes/skills/sk-code-quality/SKILL.md`. Re-run 2026-10-26: the check printed `PASS: 67 Hermes skill copies in sync` and exited 0.
- [x] T033 SKILL-16, two hubs held stale route manifests (REQ-011) (batch c6 declined, then the release stage). Batch c6 left it open because its rules barred generators. The release stage refreshed the manifests of cli-external-orchestration, sk-code, sk-doc and system-deep-loop. Verify: `node .skilled/bin/compiled-route-guard.cjs`. Re-run 2026-10-26: it printed `All hubs fresh or excused` with seven hubs `fresh`, exit 0. `compiled-route-admission.cjs --all` printed `Every hub passes the admission check` with sk-code at `13 pass, 0 drift, 0 stale, 1 n/a`, and `compiled-route-sync.cjs --check` printed `all 55 served copies match their authored files`.
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Release

- [x] T034 Raise fifteen versions at patch level, one segment up each (REQ-011). sk-code 3.9.1.0, sk-code-ci 1.1.2.0, sk-code-quality 1.13.1.0, sk-code-review 1.9.1.0, sk-code-skilled 2.1.3.0, cli-external-orchestration 1.7.4.0, cli-opencode 1.5.1.0, cli-cursor 1.5.3.0, sk-doc 2.3.14.0, sk-create-repo-rule 1.1.2.0, sk-create-manual-testing-playbook 1.0.4.0, sk-git 1.9.6.0, system-deep-loop 1.6.8.0, system-skill-advisor 0.17.3.0 and system-spec-kit 2.12.3.0. Verify: each `SKILL.md` version has a `changelog/v<version>.md`. Re-run 2026-10-26: a loop over the fifteen packets printed `ok` for each, none `MISSING`.
- [x] T035 Write fifteen changelog entries and keep the symlinks (REQ-011). Reported by the release stage: all fifteen pass `validate_document.py --type changelog` and the voice scan with 0 hard blockers, the 15 `.skilled/changelog/` symlinks already resolved to the new files, and no released entry was touched. Re-run 2026-10-26: `git status --short --untracked-files=all | grep -c 'changelog/v'` printed `15`.
- [x] T036 Run the generators in write mode (REQ-011). Reported by the release stage: the Hermes sync wrote 15 copies and the manifest refresh ran for four hubs. The runtime-mirror, codex agent and prompt, Hermes prompt and hook-registration syncs wrote 0 files. Re-run 2026-10-26: the Hermes, codex and pi `--check` runs and the guard all exited 0 (T030, T032, T033).
- [x] T037 One extra fix: the toggle scenario's prompt did not route (REQ-003, REQ-006). The release stage changed `doctor-ci-toggle.md` to "Turn the SKILLED_CI_REPORTS CI switch off". Verify: `compiled-route-admission.cjs --all`. Re-run 2026-10-26: sk-code printed `13 pass, 0 drift`.
- [x] T038 Raise the per-document edition of every markdown file edited after the last staging (REQ-011). Closed 2026-10-27 at commit: the pre-commit gate raised each staged document, and `frontmatter-version.mjs bump --check --base 4b15bdcc11` on main `8c760290ff` printed `51 changed docs | every changed body raised its version` and exited 0. Before the commit: Re-run 2026-10-26: `bump --check --base a506589406^` printed `207 changed docs | every changed body raised its version` and exited 0, but that compares committed history, and `bump --check --base HEAD` printed `0 changed docs` because the audit's edits are uncommitted, so it proves nothing about them. `frontmatter-version.mjs verify` printed `5517 files | ok=2920 skip-no-frontmatter=2597`.
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:phase-6 -->
## Phase 6: Open items and final-state gates

- [x] T039 ADV-02, the bare-command keyword also matches other typed targets of the same command (REQ-007). Resolved 2026-10-27 on the operator's instruction to fix it. The explicit lane in `system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts` now blanks every known `<command> <target>` phrase before it tests a bare slash-command keyword, so the longer typed phrase wins. The same pass found doctor routing-slice row `doctor-a-08` failing on main, because CI does not run that suite, and gave the `/doctor:git hooks` route the lead phrase `disable comment hygiene gate`. Evidence: `/doctor:git hooks` returned `command-doctor-git-hooks`, `sk-git`; `/doctor:git` returned `command-doctor-git-setup`, `sk-git`; `vitest run tests/doctor-routing-slice.vitest.ts tests/doctor-command-bridges.vitest.ts` passed every case, `doctor-phrase-reach.cjs` printed `STATUS=OK phrases=118 bridges=22` and `route-validate.sh` printed `18 routes validated`. The full advisor suite printed `1 failed | 1245 passed`; the one failure is the chokidar newborn-skill timing case, which failed 2 of 3 times alone and touches no scorer code.
- [x] T040 CHANGELOG-01 residual, two released entries still carry an internal id and test counts (REQ-008). Resolved 2026-10-27 on the operator's instruction. No CI check guards released entries; the rule is the frozen-history convention, which protects facts, so the two entries were reworded without changing a fact: `v1.4.0.0.md` names the comment-hygiene hook playbook scenario in words, and `v1.5.0.0.md` drops the suite counts. `validate_document.py` now ignores ids inside inline code spans, since a span quotes a literal such as the comment a fix stopped accepting. Evidence: both entries printed `VALID` with no warning, and `test_changelog_validator.py` printed `13 passed`.
- [x] T041 Decide whether a code folder without a README is a rule (REQ-004). Resolved 2026-10-27: the rule already exists as `sk-create-readme/scripts/audit_readmes.py`, which derives every durable directory and exempts parent-documented tests, single-file zones and equivalent-orientation folders. Evidence: a repo-wide run printed `manifest_derived_count 781` and `manifest_gaps 0`, so none of the 15 folders the ad-hoc verifier flagged is a gap; `.skilled/commands/doctor/scripts` carries `README.markdown`.
- [x] T042 Re-run the code gates on the final tree (REQ-001). Re-run 2026-10-26: `quality-gate.cjs --lines file --format json --files <421 files>` exited 0 with gate `NO_BLOCKER_FOUND`, `p0_blocking 0`, `p1_open 0`, `p2_open 0` and 0 findings. `comment-hygiene` was `RAN_CLEAN` over 347 files, `secrets` and `debug-leftovers` over 406, `syntax-json` over 59, `syntax-cjs` over 42, `syntax-node` over 42, `syntax-python` over 11, `syntax-shell` over 9 and `syntax-yaml` over 64.
- [x] T043 Re-run the suites on the final tree (all REQs). Re-run 2026-10-26: the quality suite printed `# tests 123`, `# pass 123`, `# fail 0`, the hook suite `# tests 13`, `# pass 13`, `# fail 0`, the sk-code-skilled suite `# tests 31`, `# pass 31`, `# fail 0` and the doctor suite `# tests 470`, `# pass 470`, `# fail 0`. `test-dist-freshness.sh` and `check-gate-inputs.test.sh` exited 0.
- [x] T044 Re-run the document gate on the final tree (REQ-004, REQ-005). Re-run 2026-10-26: `validate_document.py --blocking-only` over 86 changed or new markdown files printed no `FAIL`, after skipping the `.hermes` copies, the agent mirrors and benchmark reports as the gate script does. `validate_document.py --type agent .skilled/agents/code.md` printed one `non_sequential_numbering` warning for the template's section 0, which the agent template allows.
- [x] T045 Commit the working tree. Landed 2026-10-27 on main as `7d6474c602` (this folder), `f431355ac2` (the fixes) and `554c8c8f78` (the version name), with the CI repairs `c1fe3ae9b4` and `8c760290ff`. The rebase onto `4b15bdcc11` renumbered the system-spec-kit patch to 2.12.3.0, and every CI run on `8c760290ff` passed (18 of 18).
<!-- /ANCHOR:phase-6 -->

---

<!-- ANCHOR:phase-7 -->
## Phase 7: Packet records

- [x] T046 Add row 10 to the parent phase map and the handoff table, and bind the phase in the parent goal (`specs/sk-code/015-quality-agnostic-gate/spec.md`, `goal.md`). Verify: `rg -n '010-alignment-audit' $R/spec.md $R/goal.md` prints the map row, the handoff row and the binding row. Evidence 2026-10-26: see CHK-040.
- [x] T047 Run the derived-metadata repair and both strict validators (`$R`). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --roots $R --apply`, then `validate.sh $P --strict` and `validate.sh $R --recursive --strict`, each last line `RESULT: PASSED`. Evidence 2026-10-26: `repair-derived.cjs` printed `inspected=11 repaired=3 failed=0`, and both validators printed `Summary: Errors: 0  Warnings: 0` and `RESULT: PASSED`.
- [x] T048 Write the packet changelog (`$R/changelog/changelog-015-010-alignment-audit.md`). Verify: `ls $R/changelog/changelog-015-010-alignment-audit.md` lists the file. Evidence 2026-10-26: `nested-changelog.js ... --write` exited 0 and `ls` lists the file. No Files Changed row held command text, and the ids and counts the generator copied from the tasks were scrubbed so the changelog validator reads clean.
<!-- /ANCHOR:phase-7 -->

---

<!-- ANCHOR:phase-8 -->
## Phase 8: Repo-rules audit and closeout

- [x] T049 [P] Audit `AGENTS.md`, `REPO RULES.md` and the 13 `.skilled/repo-rules/` files on the operator's request ("Also check agents md and repo rules") (REQ-012). Two Opus medium lenses, contract and accuracy, read the files and a refute pass checked each finding. Evidence 2026-10-26: reported by the conductor, 9 findings raised and 5 survived. The refute pass rejected CONTRACT-04 (the cards check), CONTRACT-05 (the `validate_document` README fallback on rule files) and CONTRACT-06, and CONTRACT-02 duplicated ACCURACY-01.
- [x] T050 ACCURACY-01 (P2), `REPO RULES.md` section 4 cited `AGENTS.md` section 8 for the two clauses (REQ-012). It now says `AGENTS.md` section 4, under Reply Rules and Mandates, keeps them. Verify: `rg -n 'Reply Rules and Mandates' 'REPO RULES.md'`. Evidence 2026-10-26: it printed line 87.
- [x] T051 ACCURACY-02 (P2), the `repo-rules-corpus.yml` comments said no `.opencode/repo-rules` tree exists (REQ-012). They now say it is a tracked symlink to `.skilled/repo-rules`, so git reports no changes beneath it. Verify: `actionlint .github/workflows/repo-rules-corpus.yml` and `check-gate-inputs.sh`. Evidence 2026-10-26: `actionlint` exited 0, `check-gate-inputs.sh` printed `RESULT: PASSED`, and the new comment reads at lines 9 and 21.
- [x] T052 CONTRACT-03 and CONTRACT-07 (P2), the sk-create-repo-rule template and `rule-anatomy.md` gave one link form and quoted corpus counts (REQ-012). `references/rule-anatomy.md` and `assets/repo-rule-template.md` now give `../../REPO%20RULES.md` for `.skilled/repo-rules/` and `../REPO%20RULES.md` for a root `repo-rules/`, and they point at `check-repo-rules.cjs` in place of the counts (eight, nine, 9/9, four inter-rule links). Verify: `check-repo-rules.cjs`. Evidence 2026-10-26: it printed `RESULT: PASSED (11/11 checks)`.
- [x] T053 CONTRACT-01 (P1), `agents-md-integration.md` claimed two to four governed-section pointers per rule (REQ-012). Resolved by amending the contract: section 1 now says the trigger and index rows are required and checked, and the governed-section pointer is the default where an `AGENTS.md` section expands the rule. The measured corpus had 3 rules with 0 pointers and 8 with 1, so the old claim was stale. On 2026-10-27 the operator asked for the pointers, so `AGENTS.md` section 10 now points at `skill-hub-routing.md`, `delegation-and-orchestration.md` and `evidence-and-proof.md`, and the operator's global `CLAUDE.md` was copied from it, byte-identical. The pointers sit in section 10 because the rule canary requires the Blast-Radius heading inside the 16,384-byte delivery prefix and HEAD left two bytes; `check-rule-copies.js` exited 0 and `check-repo-rules.cjs` printed `RESULT: PASSED (11/11 checks)`. Verify: `python3 -m pytest -q .skilled/skills/sk-doc/scripts/tests/test_check_repo_rules.py`. Evidence 2026-10-26: it printed `6 passed`. Reported by the conductor: `validate_document.py` on the edited docs printed 0 errors, the only warnings being the section-0 numbering every sk-create-repo-rule reference carries at HEAD, and the release stage raised sk-create-repo-rule to 1.1.2.0 with a changelog covering these edits.
- [x] T054 Confirm that CI still runs the tests CODE-01 and CODE-02 moved (REQ-001). Verify: `rg -n 'tests/.*\.test\.sh' .github/workflows/sk-code-script-tests.yml` and `rg -n 'find .skilled/hooks' .github/workflows/opencode-plugin-tests.yml`. Evidence 2026-10-26: reported by the conductor, the hook suite passed 13 of 13 and the three moved `.sh` tests exited 0. Re-read here: `sk-code-script-tests.yml` lines 83 and 84 name `sk-code-quality/scripts/tests/check-comment-hygiene.test.sh` and `tests/ceiling-report.test.sh`, and `opencode-plugin-tests.yml:112` runs `find .skilled/hooks -type f`, which reaches the moved hook test.
- [x] T055 Clear the Dependabot alerts on the operator's request ("fix dependabot"). The 23 alerts on deleted lockfiles were dismissed as not used. The live ones were fixed at source: zod went to 4.6.7 in every package that pins it, with the deep-loop pin test raised to match, vitest went to 4.1.12, the `.skilled` and `.opencode` packages override the toml and zod copies nested under `@opencode-ai/plugin`, `npm audit fix` raised undici, vite, hono, body-parser, ip-address and fast-uri, and the three action pins Dependabot proposed (setup-node 7.1.0, setup-python 7.1.0, upload-artifact 7.0.2) replaced 47 old pins across 28 workflows and one test. The mcp-code-mode server stays on zod 3, because `@utcp/sdk` 1.2.0, its latest release, requires zod 3, so that alert was dismissed as a tolerable risk. Evidence 2026-10-27: `npm audit` printed 0 vulnerabilities in the six changed npm roots, `actionlint` exited 0, the advisor suite printed `1238 passed | 8 skipped`, the deep-loop suite `2823 passed | 8 skipped`, the sk-design backend suite `176 passed`, the spec-kit typecheck exited 0 and the trigger-index workflow test passed.
<!-- /ANCHOR:phase-8 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`. T039, T040 and T041 closed on 2026-10-27 on the operator's instruction.
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed. The final-state gates pass, and the CI prompts from T025 route to `sk-code-ci`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decisions**: See `decision-record.md`
- **Closure gate**: See `acceptance-criteria.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A row is ticked only where a command was run and its output read. A finding that stays open is left unticked with its reason.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The twelve requirements are in `spec.md` section 4: `rg -c '^\| REQ-0' $P/spec.md` prints `12`. Evidence 2026-10-26: after REQ-012 was added, the command printed `12`.
- [x] CHK-002 [P0] The scope file holds 705 files. Evidence 2026-10-26: see T001.
- [x] CHK-003 [P1] The ledger holds 47 findings: 38 in T003 to T006 and 9 in T031. Evidence 2026-10-26: the ids CODE-01 to CODE-08, SKILL-01 to SKILL-12, README-01 to README-11, CHANGELOG-01, ROUTE-01, ROUTE-02, ADV-01, CMD-01, CMD-02 and AGT-01 make 38, and CODE-R01, SKILL-13 to SKILL-16, README-12, README-13, ROUTE-03 and ADV-02 make 9.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `quality-gate.cjs` over the final code set reads no finding. Evidence 2026-10-26: see T042.
- [x] CHK-011 [P0] `actionlint` over all workflows exits 0 and `shellcheck -S warning` over the dist-freshness test is clean. Evidence 2026-10-26: see T009 and T010.
- [x] CHK-012 [P1] The code and config files in scope carry no spec path, packet number or finding id in a comment. Evidence 2026-10-26: `comment-hygiene` was `RAN_CLEAN` over 347 files in T042, and `check-comment-hygiene.sh` over the 405 audit files printed nothing before the fixes.
- [x] CHK-013 [P1] The moved tests and the new header lines follow the code style guide. Evidence 2026-10-26: see T007 and T008.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence 2026-10-26: all eighteen rows read `Met`, AC-006 after T025 and AC-017 and AC-018 after T049 to T054.
- [x] CHK-021 [P0] The routing and advisor probes were run by hand. Evidence 2026-10-26: see T025 to T027.
- [x] CHK-022 [P1] Edge cases tested: a bare typed command and prompts that sit near two modes. Evidence 2026-10-26: `/doctor:ci` returned the report bridge, `turn off the CI review workflows` reaches `sk-code-ci` and not the review mode, and `review the github actions workflow yaml` keeps its `surfaceBundle` of review and CI (T025).
- [x] CHK-023 [P1] Error scenarios validated: a fix that broke another gate was found twice. Evidence 2026-10-26: CODE-R01 (T032) and the stale manifests (T033) were caught by the re-audit and fixed.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. Evidence 2026-10-26: placement and header findings are `class-of-bug`, the stale citations and mirrors are `cross-consumer`, the router vocabulary is `algorithmic`, and the missing scenarios are `matrix/evidence`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed. Evidence 2026-10-26: the test-placement class was searched across three scripts folders (seven files, T007) and the numbering-citation class across the sk-code hub (T013).
- [x] CHK-FIX-003 [P0] Consumer inventory completed for the changed paths. Evidence 2026-10-26: the moved test paths were grepped across tracked non-spec files, and the one stale consumer, the Hermes copy, was regenerated (T032).
- [x] CHK-FIX-004 [P0] The one parser-adjacent change, the changelog omission check, has a positive and a negative case. Evidence 2026-10-26: `pytest .skilled/skills/sk-doc/scripts/tests/test_changelog_validator.py` printed `12 passed`, with one case that warns on an internal id and a test count and one that leaves a spec-folder blockquote and clean prose alone, and `v1.4.0.0.md` shows the live warning (T024).
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed. Evidence 2026-10-26: `plan.md` section FIX ADDENDUM lists three axes and 47 rows.
- [x] CHK-FIX-006 [P1] N/A for the process-wide state variant. Evidence 2026-10-26: no change reads process-wide state.
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range. The working tree the readings were taken on landed as `7d6474c602` (this folder), `f431355ac2` (the fixes) and `554c8c8f78` (the version name), with the CI repairs `c1fe3ae9b4` and `8c760290ff`, and the phase gate re-ran green on the rebased tree before the push (T045).
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence 2026-10-26: `secrets` was `RAN_CLEAN` over 406 files in T042.
- [x] CHK-031 [P0] No private skill name is written into a tracked file by this phase. Evidence 2026-10-26: `rg -l 'local-webflow|local-obsidian'` over the working-tree files found one file, `.skilled/scripts/git-hooks/tests/pre-commit.test.sh`, where `git show HEAD:` counts 6 earlier hits for a private-skill refusal fixture and the phase's diff adds only a three-line header.
- [x] CHK-032 [P1] N/A for auth. The audit adds no authentication path.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` agree on the 47 findings, the 39 batches, the five repo-rules findings of T049 and the five open tasks. Evidence 2026-10-26: the parent `spec.md` phase map, handoff table and `goal.md` binding row name `010-alignment-audit`.
- [x] CHK-041 [P1] Code comments added by the fixes state the durable reason. Evidence 2026-10-26: the one new comment, in `spec-kit-check.yml`, says why `-e` is off.
- [x] CHK-042 [P2] The README set describes what ships. Evidence 2026-10-26: see T020 to T023.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temporary files live outside the repository. Evidence 2026-10-26: every scan list and log went to the session scratchpad.
- [x] CHK-051 [P1] `scratch/` holds no task output. Evidence 2026-10-26: `ls -la $P/scratch` lists only `.gitkeep`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 12/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-26, on HEAD `6d6e82c269` plus the working tree, pinned 2026-10-27 to main `8c760290ff`. T039, T040 and T041 closed 2026-10-27, each with its evidence above.
<!-- /ANCHOR:summary -->

---
