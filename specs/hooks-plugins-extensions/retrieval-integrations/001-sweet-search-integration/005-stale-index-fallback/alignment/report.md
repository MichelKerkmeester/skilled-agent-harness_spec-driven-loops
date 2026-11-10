# Alignment report: HEAD

Report-only run: every check ran in its read-only form, and this command writes only into its run folder.

## Scope

- Kind: branch, file set first-parent
- Target: `HEAD`, base `fcab2a3c33`
- Commits: `fcab2a3c33c79210f8f6e61f8adaa0d197453f06` to `fcab2a3c33c79210f8f6e61f8adaa0d197453f06`, 0 first-parent commits
- Files: 24, of which 24 uncommitted or untracked
- Owners: 4
- Findings: 7 (P0 0, P1 4, P2 3), 2 literal, 0 inferred, 1 outside the scope; 9 more overturned by the critic and not counted
- Lanes: A, B, C, D
- Fix plan: [fix-plan.md](fix-plan.md)

## Surfaces

| Surface | Title | Fired | Files | Checks |
|---|---|---|---|---|
| S1 | Code aligns with sk-code | yes | 4 | 3 |
| S2 | Skill docs match sk-create-skill | yes | 9 | 7 |
| S3 | Feature catalog entries | yes | 13 | 1 |
| S4 | Playbooks match sk-create-manual-testing-playbook | yes | 13 | 2 |
| S5 | READMEs match sk-create-readme, root included | yes | 16 | 3 |
| S6 | Changelogs updated or created | yes | 15 | 1 |
| S7 | Skill routing is right | yes | 1 | 6 |
| S8 | Skill integrated in system-skill-advisor | yes | 1 | 1 |
| S9 | Commands aligned | yes | 2 | 3 |
| S10 | Agents aligned | no | 0 | 1 |
| S11 | Runtime mirrors | yes | 3 | 7 |
| S12 | AGENTS.md and repo rules | no | 0 | 2 |
| S13 | Env docs list every operator-settable variable | yes | 4 | 1 |
| S14 | Spec packets validate (changed-packet-validation replay) | yes | 4 | 1 |
| S15 | CI parity | yes | 0 | 21 |

## Battery

pass 55, fail 3, cannot run 0, not applicable 7

Grading: P0 when a CI step in a workflow that fires for the scope runs the same command; P1 for a skill package gate; P2 otherwise.

Failures are not compared against the scope's start point in this version, so a failing row may be debt that predates the scope. Re-running a check at the start point needs a second checkout, which a report-only run does not create.

| Status | Severity | CI-gated | Check | Exit | ms |
|---|---|---|---|---|---|
| pass | P2 | no | `S1-quality-gate` | 0 | 968 |
| pass | P0 | yes | `S1-comment-hygiene` | 0 | 79 |
| pass | P0 | yes | `S1-package-check:.skilled/skills/system-spec-kit/runtime/cli` | 0 | 4785 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-spec-kit` | 0 | 1177 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-spec-kit` | 0 | 37 |
| pass | P0 | yes | `S2-skill-root-metadata` | 0 | 5257 |
| pass | P0 | yes | `S2-skill-derived-freshness` | 0 | 28 |
| pass | P0 | yes | `S2-leaf-manifest-freshness` | 0 | 5068 |
| pass | P2 | no | `S2-frontmatter-version:.skilled/skills/system-spec-kit` | 0 | 79 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-spec-kit/README.md` | 0 | 159 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-spec-kit/SKILL.md` | 0 | 201 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-spec-kit/changelog/v2.12.41.0.md` | 0 | 168 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md` | 0 | 176 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-spec-kit/feature-catalog/retrieval/stale-index-fallback.md` | 0 | 173 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md` | 0 | 160 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-spec-kit/manual-testing-playbook/retrieval/stale-index-fallback.md` | 0 | 177 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md` | 0 | 162 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-spec-kit/runtime/cli/retrieval/README.md` | 0 | 160 |
| pass | P0 | yes | `S3-catalog-package` | 0 | 1673 |
| pass | P0 | yes | `S4-playbook-package:.skilled/skills/system-spec-kit` | 0 | 231 |
| not_applicable | P2 | no | `S4-playbook-topology` | - | 0 |
| pass | P2 | no | `S5-audit-readmes` | 0 | 55348 |
| pass | P2 | no | `S5-derived-counts` | 0 | 133 |
| pass | P2 | no | `S5-readme-references` | 0 | 4234 |
| pass | P2 | no | `S6-release-coverage` | 0 | 42 |
| pass | P0 | yes | `S7-skill-graph-freshness` | 0 | 34 |
| not_applicable | P2 | no | `S7-parent-skill-check` | - | 0 |
| not_applicable | P2 | no | `S7-router-intent-signals` | - | 0 |
| not_applicable | P2 | no | `S7-router-vocabulary-reach` | - | 0 |
| pass | P0 | yes | `S7-compiled-route-guard` | 0 | 157 |
| pass | P0 | yes | `S7-compiled-route-admission` | 0 | 207 |
| fail | P2 | no | `S8-advisor-status` | 75 | 75 |
| pass | P0 | yes | `S9-command-catalog` | 0 | 39 |
| fail | P2 | no | `S9-command-references` | 1 | 71 |
| pass | P2 | no | `S9-doctor-routes` | 0 | 376 |
| pass | P0 | yes | `S11-runtime-mirrors` | 0 | 286 |
| pass | P0 | yes | `S11-codex-agents` | 0 | 45 |
| pass | P0 | yes | `S11-codex-prompts` | 0 | 39 |
| pass | P0 | yes | `S11-pi-agents` | 0 | 38 |
| pass | P0 | yes | `S11-pi-prompts` | 0 | 35 |
| pass | P0 | yes | `S11-hook-registrations` | 0 | 30 |
| pass | P2 | no | `S11-codex-hooks-install` | 0 | 53 |
| pass | P2 | no | `S13-env-tokens` | 0 | 121 |
| fail | P0 | yes | `S14-packet-validate:specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/005-stale-index-fallback` | 1 | 1842 |
| not_applicable | P2 | no | `S15-workflow-shape` | - | 0 |
| pass | P2 | no | `S15-workflow-select` | 0 | 0 |
| pass | P2 | no | `S15-ci-report` | 0 | 208 |
| not_applicable | P2 | no | `S15-ci-contract-drift` | - | 0 |
| pass | P0 | yes | `S15-ci-divergence-ratchet` | 0 | 4974 |
| pass | P0 | yes | `S15-ci-routing-drift-guard` | 0 | 1522 |
| pass | P0 | yes | `S15-ci-deep-loop-admission` | 0 | 41 |
| pass | P0 | yes | `S15-ci-skill-graph-compiler` | 0 | 40 |
| pass | P0 | yes | `S15-ci-router-intent-signals` | 0 | 28 |
| not_applicable | P2 | no | `S15-ci-no-spec-imports` | - | 0 |
| pass | P0 | yes | `S15-ci-message-contract` | 0 | 1424 |
| pass | P0 | yes | `S15-ci-gate-inputs` | 0 | 470 |
| pass | P0 | yes | `S15-ci-rule-canary` | 0 | 29 |
| pass | P0 | yes | `S15-ci-prompt-card-sync` | 0 | 137 |
| pass | P0 | yes | `S15-ci-skill-doc-frontmatter` | 0 | 42 |
| pass | P0 | yes | `S15-ci-markdown-links` | 0 | 1597 |
| pass | P0 | yes | `S15-ci-dispatch-rules` | 0 | 3394 |
| pass | P0 | yes | `S15-ci-command-tree-parity` | 0 | 245 |
| pass | P0 | yes | `S15-ci-playbook-operator-contract` | 0 | 1176 |
| pass | P0 | yes | `S15-ci-catalog-fixtures` | 0 | 341 |
| pass | P0 | yes | `S15-ci-agent-mirror-sync` | 0 | 114 |

## Checks that could not run

None.

## CI workflows this scope triggers

- `advisory-checks.yml`: push: no path filter
- `agent-mirror-sync.yml`: pull_request: paths match .skilled/skills/system-spec-kit/README.md
- `changed-packet-validation.yml`: push: no path filter
- `command-tree-parity.yml`: pull_request: paths match .skilled/commands/speckit/README.txt
- `comment-hygiene.yml`: pull_request: no path filter
- `dependabot-auto-merge.yml`: pull_request: no path filter
- `dispatch-enforcement-guard.yml`: pull_request: no path filter
- `gate-inputs.yml`: push: no path filter
- `markdown-link-integrity.yml`: pull_request: paths match .skilled/commands/speckit/README.txt
- `message-contract.yml`: push: no path filter
- `naming-standard-guard.yml`: pull_request: no path filter
- `opencode-plugin-tests.yml`: pull_request: paths match .skilled/commands/speckit/README.txt
- `playbook-operator-contract.yml`: pull_request: no path filter
- `prompt-card-sync.yml`: pull_request: no path filter
- `routing-registry-drift.yml`: push: paths match .skilled/skills/system-spec-kit/SKILL.md
- `rule-canary-sync.yml`: pull_request: no path filter
- `sk-doc-script-tests.yml`: pull_request: no path filter
- `skill-doc-frontmatter.yml`: pull_request: paths match .skilled/skills/system-spec-kit/README.md
- `spec-kit-check.yml`: push: paths match .skilled/commands/speckit/README.txt
- `trigger-index-rebuild.yml`: push: no path filter

## Findings by surface

### S2 Skill docs match sk-create-skill

- **CR-1** P1 judgment `.skilled/skills/system-spec-kit/SKILL.md:129`: `SKILL.md` still describes Gate 1 as resolving only against the committed trigger index (line 129) and never names the zero-hit fallback, `staleFallback` or `--no-stale-fallback`; the only change in this file is the version bump. The skill's own contract therefore does not describe the shipped behavior, even though the README, retrieval conventions, catalog entry and changelog do.
  - Evidence: `nl -ba .skilled/skills/system-spec-kit/SKILL.md | sed -n '127,131p'; rg -n -i 'stale ?index|unindexed|no-stale-fallback|staleFallback' .skilled/skills/system-spec-kit/SKILL.md` exit 1: Line 129 says Gate 1 resolves a prompt against the committed trigger index; the fallback search returns no matches (exit 1), so the new zero-hit path is absent from the skill contract.

### S5 READMEs match sk-create-readme, root included

- **CR-2** P1 literal `.skilled/skills/system-spec-kit/README.md:171`: The exit contract still says exit 0 means the index resolved candidates. A zero-hit fallback hit exits 0 with `staleFallback.matches: 5` while the same query with `--no-stale-fallback` returns no scored result and exits 1, so the sentence is false for the new path and misleads anyone branching on the exit code.
  - Evidence: `nl -ba .skilled/skills/system-spec-kit/README.md | sed -n '171,173p'; node .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs --json --scoring-only --no-stale-fallback -- '...` exit 0: Line 171 says exit 0 means the index resolved candidates. Index-only run: 0 results, exit 1. Fallback run: 5 results, staleFallback.matches 5, exit 0.
- **CR-5** P2 literal `README.md:1194`: The root README's `/speckit:search` section still says only 'trigger-index lookup with `--triggers`, ripgrep recipes otherwise' and does not mention the zero-hit fallback. The command README and presentation asset were updated, but this user-facing command summary was not, so a root-README reader cannot learn the new behavior.
  - Evidence: `nl -ba README.md | sed -n '1192,1194p'; rg -n -i 'staleFallback|zero-hit|unindexed' README.md` exit 0: Line 1194 describes two lanes and trigger-index lookup with --triggers. The fallback is mentioned only at lines 521, 527 and 798, not in the /speckit:search section.

### S8 Skill integrated in system-skill-advisor

- **PRB-01** P1 judgment: Probe P02 "Look up a trigger phrase already in the index, and scan unindexed spec documents only if the index has no scored match." expected system-spec-kit; top-1 was command-doctor-helper.
  - Evidence: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"Look up a trigger phrase already in the index, and scan unindexed spec documents only if the index has no scored match."}' --fo...` exit 0: top-1 was command-doctor-helper

### S12 AGENTS.md and repo rules

- **CR-3** P2 judgment `AGENTS.md:49`: Gate 1's universal contract still says the lookup reads the committed index (line 49) and answers from the committed trigger index (line 214), but the new default zero-hit fallback also reads unindexed spec docs in the working tree. The generated Cursor pointer repeats line 49. The plan's affected-surface row checked only exit-1 semantics, so this wording was never reviewed.
  - Evidence: `nl -ba AGENTS.md | sed -n '49p;214p'; nl -ba .cursor/rules/skill-routing.md | sed -n '25p'; rg -n -i 'staleFallback|no-stale-fallback|unindexed spec' AGENTS.md` exit 1: Line 49: It reads the committed index; exit 1 with no rows is a clean no-hit. Line 214: Gate 1 answers from the committed trigger index. The Cursor mirror repeats line 49. The fallback search finds no mention.

### S14 Spec packets validate (changed-packet-validation replay)

- **CR-4** P1 judgment `specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/005-stale-index-fallback/acceptance-criteria.md:93`: The packet still reports itself unbuilt: every acceptance row is `Unmet`, `Closeable` is `No` with 'Nothing is built yet', `tasks.md` and the goal completion list are unchecked, `implementation-summary.md:50` says 'Not built yet' and lists a planned `lib/changed-docs.mjs` that does not exist (the module shipped as `lib/unindexed-docs.mjs`), and `benchmark/after.json` and `benchmark/results.md` are...
  - Evidence: `nl -ba specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/005-stale-index-fallback/acceptance-criteria.md | sed -n '59,67p;93,95p'; nl -ba specs/hooks-plugins-extensions/028-sweet-search-inte...` exit 0: ...C-001..AC-009 all Unmet; line 93 Closeable: No; line 95 'Nothing is built yet...'; implementation-summary line 50 'Not built yet' and line 60 planned lib/changed-docs.mjs; that path is missing. benchmark/ holds before.json, queries.txt, run.mjs and scenario-490; after.json and results.md are absent.

## Findings outside the scope

A lane or the critic reported these on files that are not in scope.json, so they are not attributed to this range. "merged-in" means the file changed between the merge base and the head only through a merge the first-parent scope leaves out; "unchanged in range" means the range never touched it, which is usually a cause a lane traced from an in-scope change. "pre-existing (critic)" means the critic showed the finding predates the scope, whatever file it names. A finding here can still block CI; its severity stands.

### pre-existing (critic)

- **BAT-02** P2 judgment: S9-command-references failed (exit 1). [S9, battery]
  - Evidence: `node .skilled/commands/scripts/validate-command-references.cjs` exit 1: FAIL 1 unresolved command reference(s): .skilled/commands/doctor/assets/doctor-deep-loop.yaml:96 [skill-asset] .skilled/skills/system-deep-loop/runtime/database/deep-loop-graph.sqlite - path does not exist on disk
  - Critic override: pre-existing, lane severity P2. The check needs the generated deep-loop sqlite, which is gitignored and absent in this fresh worktree; the baseline YAML already referenced it and this change does not touch it.

## Overturned by the critic

The critic refuted these or showed they repeat another finding, so they are left out of every count above. Each keeps the severity its lane gave it.

### refuted

- **BAT-03** P0 judgment `specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/005-stale-index-fallback`: S14-packet-validate failed for specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/005-stale-index-fallback (exit 1). [S14, battery]
  - Evidence: `node ../../../MEGA/Development/Skilled/.skilled/commands/assets/local-skilled-alignment/validate-packet.cjs specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/005-stale-index-fallback` exit 1: ...rigger index is committed and rebuilt by hand, so a packet created or edited since the last build is invisible to the Gate FAIL specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/005-stale-index-fallback: error rules GENERATED_METADATA_DRIFT,GENERATED_METADATA_INTEGRITY (validate.sh exit 2)
  - CI runs this command: changed-packet-validation.yml > changed-packets > Validate the packets this PR changed
  - Critic override: refuted, lane severity P0. validate.sh --strict on the packet now prints RESULT: PASSED with 0 errors; the battery row predates the repair-derived repair.
- **A-1** P1 judgment `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/unindexed-docs.mjs:70`: The `--spec-folder` input `specs/../../tmp/probe` passes the `startsWith('specs/')` check, then line 76 joins it to `repoRoot` and walks outside the repository. This violates the stated scope boundary and can read matching trigger phrases from outside `specs/`. Canonicalize the requested path and reject it unless it remains within the repository’s `specs/` tree; add a traversal case to the fallbac... [S1, A]
  - Evidence: `node --input-type=module -e 'import path from "node:path"; const root="/repo"; const input="specs/../../tmp/probe"; console.log(JSON.stringify({input, startsWithSpecsSlash: input.startsWith("specs/"),...` exit 0: {"input":"specs/../../tmp/probe","startsWithSpecsSlash":true,"joined":"/tmp/probe"}
  - Critic override: refuted, lane severity P1. Fixed in the current tree: resolveWalkStart normalizes the requested scope and requires its real path to stay under the real specs/ directory; two regression tests cover specs/../outside and a linked subfolder, and the CLI no longer returns outside matches.
- **B1** P1 judgment `.skilled/skills/system-spec-kit/manual-testing-playbook/retrieval/stale-index-fallback.md:49`: The setup copies only `.skilled` and `.devin` into the scratch project, but the conversation’s target packet is under `specs/`. The check then changes to `$CONVERSATION_REPO_ROOT` and runs against the source checkout, so its fallback assertions can pass while the subject in scratch cannot access the target. Seed a controlled Git work tree and unindexed target packet in scratch, then run the assert... [S4, B]
  - Evidence: `nl -ba .skilled/skills/system-spec-kit/manual-testing-playbook/retrieval/stale-index-fallback.md | sed -n '47,50p;60,63p'; nl -ba .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-c...` exit 0: ...led` and `.devin` only (line 49); its check runs `cd "$CONVERSATION_REPO_ROOT"` (line 62). The runner executes checks with `cwd: ctx.project` and sets `CONVERSATION_REPO_ROOT: ctx.repoRoot` (lines 2607–2615); the conversation subject runs in a scratch project (conversation-scenarios.md lines 35–36).
  - Critic override: refuted, lane severity P1. Fixed in the current tree: the scenario setup runs git init and seeds specs/demo/001-zr7-ledger/spec.md inside the scratch project; scenario 490's evidence records PASS.
- **C1** P1 literal `README.md:521`: The default zero-hit fallback reads unindexed spec docs from the current Git working tree, including untracked docs. This paragraph says both retrieval lanes read only committed files, so it misstates which files a lookup can return. [S5, C]
  - Evidence: `nl -ba README.md | sed -n '519,528p'; nl -ba .skilled/skills/system-spec-kit/runtime/cli/tests/stale-fallback.vitest.ts | sed -n '141,151p'` exit 0: README.md:521 says both lanes read committed files; README.md:527 describes the working-tree fallback. The test at lines 142–150 creates an untracked spec doc and asserts the CLI returns it.
  - Critic override: refuted, lane severity P1. Fixed: root README.md:521 now says the zero-hit fallback reads unindexed spec docs in the working tree.
- **C2** P1 literal `.skilled/skills/system-spec-kit/README.md:329`: This overview also says retrieval runs over committed files. The default zero-hit fallback can return a matching untracked spec doc, so this statement gives readers the wrong retrieval boundary. [S5, C]
  - Evidence: `nl -ba .skilled/skills/system-spec-kit/README.md | sed -n '329,334p'; nl -ba .skilled/skills/system-spec-kit/runtime/cli/tests/stale-fallback.vitest.ts | sed -n '141,151p'` exit 0: README.md:329 says both lanes use committed files. The test at lines 142–150 creates an untracked spec doc and asserts the CLI returns it.
  - Critic override: refuted, lane severity P1. Fixed: .skilled/skills/system-spec-kit/README.md:329 now says the fallback checks unindexed working-tree docs.
- **C3** P1 judgment `.skilled/changelog/skilled/v4.0.2.0.md:222`: The newest root release notes list system-spec-kit among the skills with changelog entries, but do not describe the new zero-hit fallback. The capability appears in the per-skill changelog, but the root release notes still omit this user-visible change. [S6, C]
  - Evidence: `nl -ba .skilled/changelog/skilled/v4.0.2.0.md | sed -n '218,224p'; rg -n -i 'stale index fallback|unindexed spec doc fallback|zero-hit lookup|zero-hit fallback|staleFallback' .skilled/changelog/skille...` exit 1: Line 222 only lists system-spec-kit as having a changelog entry. The search found no mention of the fallback in the root release notes.
  - Critic override: refuted, lane severity P1. v4.0.2.0 is the newest tagged root release (the tag exists) and is not open; the open artifact for this change is the per-skill v2.12.41.0 changelog. There is no open root release note to edit.
- **C4** P2 judgment `README.md:798`: The root README’s dedicated system-spec-kit summary still mentions candidate counts and truncation but omits the new default zero-hit scan of unindexed spec docs. The retrieval walkthrough describes the capability elsewhere in the README, but this skill summary’s feature list is incomplete. [S5, C]
  - Evidence: `nl -ba README.md | sed -n '524,528p'; nl -ba README.md | sed -n '796,799p'` exit 0: Line 527 describes the zero-hit fallback in the retrieval walkthrough. Line 798’s system-spec-kit summary mentions candidate counts and truncation but not the fallback.
  - Critic override: refuted, lane severity P2. Fixed: root README.md:798 now says trigger lookup checks spec docs the index does not list.
- **BAT-01** P2 judgment: S8-advisor-status failed (exit 75). [S8, battery]
  - Evidence: `node .skilled/bin/skill-advisor.cjs advisor_status --workspace-root /Users/michelkerkmeester/worktrees/public/335-sweet-search-retrieval-build --format json --warm-only` exit 75: { "status": "error", "error": "backend unavailable: connect ENOENT /tmp/system-skill-advisor/ed057096c383/daemon-ipc.sock", "exitCode": 75 }
  - Critic override: refuted, lane severity P2. The exit-75 row was the cold daemon IPC socket; the status path is unchanged and a rerun passes. The P01 probe also passes.

### duplicate

- **D-1** P1 judgment `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/unindexed-docs.mjs:70`: A caller can pass `--spec-folder 'specs/../.skilled/skills'`; the prefix-only check accepts it, and the subsequent walk reads outside `specs/`. The CLI returned 16 matches from skill templates after scanning 372 documents, contradicting the helper’s stated contract to refuse scopes outside the spec tree. Enforce canonical path containment under the repository’s `specs` directory and prevent a star... [S9, D]
  - Evidence: `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs --spec-folder 'specs/../.skilled/skills' --limit 5 --json -- 'user authentication'` exit 0: staleFallback.files=372, staleFallback.matches=16; returned specs/../.skilled/skills/system-spec-kit/templates/examples/level-1/spec.md among the matches.
  - Critic override: duplicate, lane severity P1. Same traversal issue as A-1; the current tree has the normalization plus realpath containment and the CLI returns no outside matches.

## Env tokens

0 variables read in changed code, 0 not in .env.example.

## Probes

| Probe | Expected | Top-1 | Status |
|---|---|---|---|
| P01 | system-spec-kit | system-spec-kit | pass |
| P02 | system-spec-kit | command-doctor-helper | fail |

## Probes awaiting the critic

None.

## Files no lane reviewed

- `specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/005-stale-index-fallback/benchmark/before.json`
- `specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/005-stale-index-fallback/benchmark/queries.txt`
- `specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/005-stale-index-fallback/benchmark/run.mjs`

