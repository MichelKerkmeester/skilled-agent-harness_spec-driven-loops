# Alignment report: HEAD

Report-only run: every check ran in its read-only form, and this command writes only into its run folder.

## Scope

- Kind: branch, file set first-parent
- Target: `HEAD`, base `3378c36a06`
- Commits: `3378c36a064da59e1ec6da406da1d2b999e671e8` to `3378c36a064da59e1ec6da406da1d2b999e671e8`, 0 first-parent commits
- Files: 30, of which 30 uncommitted or untracked
- Owners: 2
- Findings: 11 (P0 4, P1 2, P2 5), 3 literal, 0 inferred, 2 outside the scope; 1 more overturned by the critic and not counted
- Lanes: A, B, C, D
- Fix plan: [fix-plan.md](fix-plan.md)

## Surfaces

| Surface | Title | Fired | Files | Checks |
|---|---|---|---|---|
| S1 | Code aligns with sk-code | yes | 3 | 3 |
| S2 | Skill docs match sk-create-skill | yes | 9 | 7 |
| S3 | Feature catalog entries | yes | 12 | 1 |
| S4 | Playbooks match sk-create-manual-testing-playbook | yes | 12 | 2 |
| S5 | READMEs match sk-create-readme, root included | yes | 12 | 3 |
| S6 | Changelogs updated or created | yes | 12 | 1 |
| S7 | Skill routing is right | yes | 1 | 6 |
| S8 | Skill integrated in system-skill-advisor | yes | 1 | 1 |
| S9 | Commands aligned | no | 0 | 3 |
| S10 | Agents aligned | no | 0 | 1 |
| S11 | Runtime mirrors | yes | 1 | 7 |
| S12 | AGENTS.md and repo rules | no | 0 | 2 |
| S13 | Env docs list every operator-settable variable | yes | 3 | 1 |
| S14 | Spec packets validate (changed-packet-validation replay) | yes | 12 | 1 |
| S15 | CI parity | yes | 0 | 21 |

## Battery

pass 52, fail 4, cannot run 1, not applicable 7

Grading: P0 when a CI step in a workflow that fires for the scope runs the same command; P1 for a skill package gate; P2 otherwise.

Failures are not compared against the scope's start point in this version, so a failing row may be debt that predates the scope. Re-running a check at the start point needs a second checkout, which a report-only run does not create.

| Status | Severity | CI-gated | Check | Exit | ms |
|---|---|---|---|---|---|
| pass | P2 | no | `S1-quality-gate` | 0 | 1119 |
| pass | P0 | yes | `S1-comment-hygiene` | 0 | 71 |
| cannot_run | P0 | yes | `S1-package-check:.skilled/skills/system-spec-kit/runtime/cli` | - | 0 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-spec-kit` | 0 | 1693 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-spec-kit` | 0 | 43 |
| pass | P0 | yes | `S2-skill-root-metadata` | 0 | 6080 |
| pass | P0 | yes | `S2-skill-derived-freshness` | 0 | 36 |
| pass | P0 | yes | `S2-leaf-manifest-freshness` | 0 | 5992 |
| pass | P2 | no | `S2-frontmatter-version:.skilled/skills/system-spec-kit` | 0 | 155 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-spec-kit/README.md` | 0 | 311 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-spec-kit/SKILL.md` | 0 | 218 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-spec-kit/changelog/v2.12.39.0.md` | 0 | 194 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md` | 0 | 192 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-spec-kit/feature-catalog/retrieval/trigger-lookup-total-candidates.md` | 0 | 179 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md` | 0 | 185 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-spec-kit/manual-testing-playbook/retrieval/trigger-lookup-total-candidates.md` | 0 | 192 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md` | 0 | 199 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-spec-kit/runtime/cli/retrieval/README.md` | 0 | 199 |
| fail | P0 | yes | `S3-catalog-package` | 1 | 2018 |
| pass | P0 | yes | `S4-playbook-package:.skilled/skills/system-spec-kit` | 0 | 220 |
| not_applicable | P2 | no | `S4-playbook-topology` | - | 0 |
| pass | P2 | no | `S5-audit-readmes` | 0 | 60186 |
| pass | P2 | no | `S5-derived-counts` | 0 | 130 |
| pass | P2 | no | `S5-readme-references` | 0 | 3956 |
| pass | P2 | no | `S6-release-coverage` | 0 | 43 |
| pass | P0 | yes | `S7-skill-graph-freshness` | 0 | 31 |
| not_applicable | P2 | no | `S7-parent-skill-check` | - | 0 |
| not_applicable | P2 | no | `S7-router-intent-signals` | - | 0 |
| not_applicable | P2 | no | `S7-router-vocabulary-reach` | - | 0 |
| pass | P0 | yes | `S7-compiled-route-guard` | 0 | 95 |
| pass | P0 | yes | `S7-compiled-route-admission` | 0 | 191 |
| pass | P2 | no | `S8-advisor-status` | 0 | 80 |
| pass | P0 | yes | `S11-runtime-mirrors` | 0 | 268 |
| pass | P0 | yes | `S11-codex-agents` | 0 | 43 |
| pass | P0 | yes | `S11-codex-prompts` | 0 | 38 |
| pass | P0 | yes | `S11-pi-agents` | 0 | 40 |
| pass | P0 | yes | `S11-pi-prompts` | 0 | 34 |
| pass | P0 | yes | `S11-hook-registrations` | 0 | 31 |
| pass | P2 | no | `S11-codex-hooks-install` | 0 | 56 |
| pass | P2 | no | `S13-env-tokens` | 0 | 120 |
| fail | P0 | yes | `S14-packet-validate:specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/004-total-candidate-count` | 1 | 1837 |
| fail | P0 | yes | `S14-packet-validate:specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/005-stale-index-fallback` | 1 | 1718 |
| fail | P0 | yes | `S14-packet-validate:specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/006-rg-flood-control` | 1 | 1863 |
| not_applicable | P2 | no | `S15-workflow-shape` | - | 0 |
| pass | P2 | no | `S15-workflow-select` | 0 | 0 |
| pass | P2 | no | `S15-ci-report` | 0 | 194 |
| not_applicable | P2 | no | `S15-ci-contract-drift` | - | 0 |
| pass | P0 | yes | `S15-ci-divergence-ratchet` | 0 | 6189 |
| pass | P0 | yes | `S15-ci-routing-drift-guard` | 0 | 2232 |
| pass | P0 | yes | `S15-ci-deep-loop-admission` | 0 | 58 |
| pass | P0 | yes | `S15-ci-skill-graph-compiler` | 0 | 69 |
| pass | P0 | yes | `S15-ci-router-intent-signals` | 0 | 38 |
| not_applicable | P2 | no | `S15-ci-no-spec-imports` | - | 0 |
| pass | P0 | yes | `S15-ci-message-contract` | 0 | 1875 |
| pass | P0 | yes | `S15-ci-gate-inputs` | 0 | 615 |
| pass | P0 | yes | `S15-ci-rule-canary` | 0 | 38 |
| pass | P0 | yes | `S15-ci-prompt-card-sync` | 0 | 194 |
| pass | P0 | yes | `S15-ci-skill-doc-frontmatter` | 0 | 44 |
| pass | P0 | yes | `S15-ci-markdown-links` | 0 | 1813 |
| pass | P0 | yes | `S15-ci-dispatch-rules` | 0 | 3738 |
| pass | P0 | yes | `S15-ci-command-tree-parity` | 0 | 292 |
| pass | P0 | yes | `S15-ci-playbook-operator-contract` | 0 | 1732 |
| pass | P0 | yes | `S15-ci-catalog-fixtures` | 0 | 454 |
| pass | P0 | yes | `S15-ci-agent-mirror-sync` | 0 | 161 |

## Checks that could not run

- `S1-package-check:.skilled/skills/system-spec-kit/runtime/cli`: precondition missing: .skilled/skills/system-spec-kit/runtime/cli/node_modules

## CI workflows this scope triggers

- `advisory-checks.yml`: push: no path filter
- `agent-mirror-sync.yml`: pull_request: paths match .skilled/skills/system-spec-kit/README.md
- `changed-packet-validation.yml`: push: no path filter
- `command-tree-parity.yml`: pull_request: paths match .skilled/skills/system-spec-kit/README.md
- `comment-hygiene.yml`: pull_request: no path filter
- `dependabot-auto-merge.yml`: pull_request: no path filter
- `dispatch-enforcement-guard.yml`: pull_request: no path filter
- `gate-inputs.yml`: push: no path filter
- `markdown-link-integrity.yml`: pull_request: paths match .skilled/skills/system-spec-kit/README.md
- `message-contract.yml`: push: no path filter
- `naming-standard-guard.yml`: pull_request: no path filter
- `opencode-plugin-tests.yml`: pull_request: paths match .skilled/skills/system-spec-kit/README.md
- `playbook-operator-contract.yml`: pull_request: no path filter
- `prompt-card-sync.yml`: pull_request: no path filter
- `routing-registry-drift.yml`: push: paths match .skilled/skills/system-spec-kit/SKILL.md
- `rule-canary-sync.yml`: pull_request: no path filter
- `sk-doc-script-tests.yml`: pull_request: no path filter
- `skill-doc-frontmatter.yml`: pull_request: paths match .skilled/skills/system-spec-kit/README.md
- `spec-kit-check.yml`: push: paths match .skilled/skills/system-spec-kit/README.md
- `trigger-index-rebuild.yml`: push: no path filter

## Findings by surface

### S1 Code aligns with sk-code

- **E-3** P2 literal `specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/004-total-candidate-count/benchmark/run.mjs:222`: The new benchmark harness shells out to a plain `git status --porcelain`. In this checkout a plain git call can block for minutes when `core.fsmonitor` is enabled (this review ran every git command with `-c core.fsmonitor=false`), so re-running the published benchmark can hang before it records a row. Add `-c core.fsmonitor=false` or `--no-optional-locks` to the child invocation.
  - Evidence: `nl -ba specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/004-total-candidate-count/benchmark/run.mjs | sed -n '220,228p'` exit 0: 222: const status = spawnSync('git', ['status', '--porcelain'], {

### S3 Feature catalog entries

- **BAT-01** P0 judgment: S3-catalog-package failed (exit 1).
  - Evidence: `python3 .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py` exit 1: ...validation-rule-engine.md:29: prose path is absent and ignored by a repository .gitignore: .skilled/hooks/hook-flags.env - [note] [ignored_path_absent] system-spec-kit/ask-surface-guard.md:38: prose path is absent and ignored by a repository .gitignore: .skilled/skills/.state/ask-surface/fires.jsonl
  - CI runs this command: sk-doc-script-tests.yml > catalog-packages > Validate every feature catalog package

### S4 Playbooks match sk-create-manual-testing-playbook

- **B-1** P2 judgment `.skilled/skills/system-spec-kit/manual-testing-playbook/retrieval/trigger-lookup-total-candidates.md:62`: The check passes if the omitted count appears anywhere after the prompt, without confirming the response describes it as omitted. For example, if the CLI reports 1,936 total candidates and the response incorrectly says “1,934 total candidates,” the check still passes although the user asked how many were left out.
  - Evidence: `nl -ba .skilled/skills/system-spec-kit/manual-testing-playbook/retrieval/trigger-lookup-total-candidates.md | sed -n '60,64p'` exit 0: Line 62 computes totalCandidates - 2, then grep checks only whether that number appears in the screen text after the prompt.

### S9 Commands aligned

- **E-1** P1 literal `.skilled/commands/speckit/assets/search-presentation.txt:62`: The /speckit:search trigger lane still maps only `results.length` to `CANDIDATES` and never renders `totalCandidates` or `truncated`. The lookup defaults to a 20-result limit (`lookup-trigger-index.mjs:21`), so a query with more than 20 candidates renders `CANDIDATES=20` with no hint that the rest were hidden, which is the exact blind spot this change removes from the CLI. `search.md:81` runs the ...
  - Evidence: `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs --json -- "trigger index" | node -e 'let s="";process.stdin.on("data",d=>s+=d);process.stdin.on("end",()=>{const a=J...` exit 0: {"results":20,"totalCandidates":801,"truncated":true}

### S14 Spec packets validate (changed-packet-validation replay)

- **BAT-02** P0 judgment `specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/004-total-candidate-count`: S14-packet-validate failed for specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/004-total-candidate-count (exit 1).
  - Evidence: `node ../../../MEGA/Development/Skilled/.skilled/commands/assets/local-skilled-alignment/validate-packet.cjs specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/004-total-candidate-count` exit 1: ...idate-count' drifted from fresh 'The trigger lookup reports only a `truncated` boolean when it cuts results to `--limit`' FAIL specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/004-total-candidate-count: error rules GENERATED_METADATA_DRIFT,GENERATED_METADATA_INTEGRITY (validate.sh exit 2)
  - CI runs this command: changed-packet-validation.yml > changed-packets > Validate the packets this PR changed
- **BAT-03** P0 judgment `specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/005-stale-index-fallback`: S14-packet-validate failed for specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/005-stale-index-fallback (exit 1).
  - Evidence: `node ../../../MEGA/Development/Skilled/.skilled/commands/assets/local-skilled-alignment/validate-packet.cjs specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/005-stale-index-fallback` exit 1: ...rigger index is committed and rebuilt by hand, so a packet created or edited since the last build is invisible to the Gate FAIL specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/005-stale-index-fallback: error rules GENERATED_METADATA_DRIFT,GENERATED_METADATA_INTEGRITY (validate.sh exit 2)
  - CI runs this command: changed-packet-validation.yml > changed-packets > Validate the packets this PR changed
- **BAT-04** P0 judgment `specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/006-rg-flood-control`: S14-packet-validate failed for specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/006-rg-flood-control (exit 1).
  - Evidence: `node ../../../MEGA/Development/Skilled/.skilled/commands/assets/local-skilled-alignment/validate-packet.cjs specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/006-rg-flood-control` exit 1: ...Phase 6: rg-flood-control' drifted from fresh 'The ripgrep wrapper ranks every match and only slices the first 20 for display' FAIL specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/006-rg-flood-control: error rules GENERATED_METADATA_DRIFT,GENERATED_METADATA_INTEGRITY (validate.sh exit 2)
  - CI runs this command: changed-packet-validation.yml > changed-packets > Validate the packets this PR changed
- **E-2** P1 judgment `specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/004-total-candidate-count/acceptance-criteria.md:90`: The packet that defines this change still records it as unstarted: every acceptance row is `Unmet` and the closure says `Closeable: No` and 'Nothing is built yet' (`acceptance-criteria.md:90-92`); the build/document/benchmark tasks T003-T006, T020-T023 and T033 are unchecked (`tasks.md:45-52,63`); the goal log says `Build | Pending` (`goal.md:83`); and the implementation summary says `Not built ye...
  - Evidence: `rg -n "Nothing is built yet|Not built yet|Pending|T003|T020" specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/004-total-candidate-count/acceptance-criteria.md specs/hooks-plugins-extensions...` exit 0: ...:90:**Closeable:** No; acceptance-criteria.md:92:Nothing is built yet, so every criterion is unmet; goal.md:83:| Build | Pending |; implementation-summary.md:50:Not built yet; implementation-summary.md:60:| lookup-trigger-index.mjs | Modified (planned); tasks.md:45:- [ ] T003; tasks.md:49:- [ ] T020
- **E-4** P2 judgment `specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/004-total-candidate-count/scenario-489/matrix.md:1`: The scenario run tree is untracked at the packet root (`scenario-489/` with `result.json`, `actions.jsonl`, `checkpoints.tsv`, `tmux.conf` and the turn's `screen/check/history`). The packet's own file-organization check says temp files live in `scratch/` and only benchmark and alignment evidence live beside them (`tasks.md:157`), and the scenario's command section says to run with scratch and evid...
  - Evidence: `git -c core.fsmonitor=false ls-files --others --exclude-standard | rg 'scenario-489'` exit 0: ...nts.tsv; scenario-489/devin/result.json; scenario-489/devin/tmux.conf; scenario-489/devin/turns/trigger-lookup-total-candidates/check.txt; scenario-489/devin/turns/trigger-lookup-total-candidates/history.txt; scenario-489/devin/turns/trigger-lookup-total-candidates/screen.txt; scenario-489/matrix.md

## Findings outside the scope

A lane or the critic reported these on files that are not in scope.json, so they are not attributed to this range. "merged-in" means the file changed between the merge base and the head only through a merge the first-parent scope leaves out; "unchanged in range" means the range never touched it, which is usually a cause a lane traced from an in-scope change. "pre-existing (critic)" means the critic showed the finding predates the scope, whatever file it names. A finding here can still block CI; its severity stands.

### pre-existing (critic)

- **B-2** P2 judgment `.skilled/skills/cli-external-orchestration/feature-catalog/deepseek-harness-dispatch-mode/deepseek-harness-dispatch-mode.md:3`: The reported S3 catalog-package failure predates this change. The baseline leaf description does not match the root catalog H3 “DeepSeek Harness Dispatch Mode”; both package files are unchanged from the baseline, so this is not a regression from lane B. [S3, B]
  - Evidence: `git show 3378c36a06:.skilled/skills/cli-external-orchestration/feature-catalog/deepseek-harness-dispatch-mode/deepseek-harness-dispatch-mode.md; git show 3378c36a06:.skilled/skills/cli-external-orches...` exit 0: Baseline leaf description: “cli-deepseek-harness is the eighth workflow mode…”; baseline root heading: “### DeepSeek Harness Dispatch Mode”; diff --quiet returned 0.
  - Critic override: pre-existing, lane severity P2. The S3 catalog-package failure is in .skilled/skills/cli-external-orchestration/feature-catalog/deepseek-harness-dispatch-mode/deepseek-harness-dispatch-mode.md and its root catalog; both files are unchanged from the baseline, so it is not a finding for this change.

### reason unknown

- **C-1** P2 literal `README.md:796`: An operator reading the root README’s system-spec-kit summary learns that it owns the trigger index, but not that lookup reports the full candidate count or marks truncated results. The skill README documents this new behavior, while the root summary does not. [S5, C]
  - Evidence: `if rg -n -i "totalCandidates|candidates : [0-9]+ of|trigger[- ]index candidate|trigger lookup truncat" README.md .skilled/changelog/skilled/v4.0.2.0.md; then :; else rc=$?; if [ "$rc" -eq 1 ]; then ec...` exit 0: NO_MATCH_IN_ROOT_RELEASE_OR_ROOT_SKILL_SECTION

## Overturned by the critic

The critic refuted these or showed they repeat another finding, so they are left out of every count above. Each keeps the severity its lane gave it.

### refuted

- **C-2** P2 judgment `.skilled/changelog/skilled/v4.0.2.0.md:56`: The newest root release notes’ “What’s New at a Glance” list does not mention the new trigger lookup candidate count and truncation behavior. Readers using the open release notes will miss this user-visible capability. [S6, C]
  - Evidence: `if rg -n -i "totalCandidates|candidates : [0-9]+ of|trigger[- ]index candidate|trigger lookup truncat" README.md .skilled/changelog/skilled/v4.0.2.0.md; then :; else rc=$?; if [ "$rc" -eq 1 ]; then ec...` exit 0: NO_MATCH_IN_ROOT_RELEASE_OR_ROOT_SKILL_SECTION
  - Critic override: refuted, lane severity P2. v4.0.2.0 is tagged at 5474fd96 on origin/main; the release notes are closed. The copy at this branch's HEAD is a pre-tag draft, so new user-visible changes belong in the next release notes, not the tagged file.

## Env tokens

0 variables read in changed code, 0 not in .env.example.

## Probes

| Probe | Expected | Top-1 | Status |
|---|---|---|---|
| P01 | system-spec-kit | command-doctor-helper | fail |
| P02 | system-spec-kit | command-doctor-helper | fail |
| P03 | sk-code | sk-code/sk-code-skilled | pass |

## Probes awaiting the critic

- P01: Limit a trigger-index search to two results, then tell me how many total documents matched and whether the results were truncated.; expected system-spec-kit; actual skill command-doctor-helper
- P02: Explain which research run-output files the trigger index omits and which of those ripgrep still searches.; expected system-spec-kit; actual skill command-doctor-helper

## Files no lane reviewed

- `specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/004-total-candidate-count/benchmark/after.json`
- `specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/004-total-candidate-count/benchmark/before.json`
- `specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/004-total-candidate-count/benchmark/queries.txt`
- `specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/004-total-candidate-count/benchmark/results.md`

