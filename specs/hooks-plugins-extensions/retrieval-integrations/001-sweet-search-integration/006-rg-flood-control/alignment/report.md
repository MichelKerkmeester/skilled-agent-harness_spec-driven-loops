# Alignment report: HEAD

Report-only run: every check ran in its read-only form, and this command writes only into its run folder.

## Scope

- Kind: branch, file set first-parent
- Target: `HEAD`, base `214ad8b5cb`
- Commits: `214ad8b5cb71e19f9240b036172caef7e3749a79` to `214ad8b5cb71e19f9240b036172caef7e3749a79`, 0 first-parent commits
- Files: 18, of which 18 uncommitted or untracked
- Owners: 3
- Findings: 10 (P0 0, P1 1, P2 9), 6 literal, 0 inferred, 2 outside the scope; 2 more overturned by the critic and not counted
- Lanes: A, B, C, D
- Fix plan: [fix-plan.md](fix-plan.md)

## Surfaces

| Surface | Title | Fired | Files | Checks |
|---|---|---|---|---|
| S1 | Code aligns with sk-code | yes | 4 | 3 |
| S2 | Skill docs match sk-create-skill | yes | 9 | 7 |
| S3 | Feature catalog entries | yes | 13 | 1 |
| S4 | Playbooks match sk-create-manual-testing-playbook | yes | 13 | 2 |
| S5 | READMEs match sk-create-readme, root included | yes | 15 | 3 |
| S6 | Changelogs updated or created | yes | 15 | 1 |
| S7 | Skill routing is right | yes | 1 | 6 |
| S8 | Skill integrated in system-skill-advisor | yes | 1 | 1 |
| S9 | Commands aligned | yes | 2 | 3 |
| S10 | Agents aligned | no | 0 | 1 |
| S11 | Runtime mirrors | yes | 3 | 7 |
| S12 | AGENTS.md and repo rules | no | 0 | 2 |
| S13 | Env docs list every operator-settable variable | yes | 4 | 1 |
| S14 | Spec packets validate (changed-packet-validation replay) | no | 0 | 1 |
| S15 | CI parity | yes | 0 | 21 |

## Battery

pass 56, fail 1, cannot run 0, not applicable 7

Grading: P0 when a CI step in a workflow that fires for the scope runs the same command; P1 for a skill package gate; P2 otherwise.

Failures are not compared against the scope's start point in this version, so a failing row may be debt that predates the scope. Re-running a check at the start point needs a second checkout, which a report-only run does not create.

| Status | Severity | CI-gated | Check | Exit | ms |
|---|---|---|---|---|---|
| pass | P2 | no | `S1-quality-gate` | 0 | 702 |
| pass | P0 | yes | `S1-comment-hygiene` | 0 | 91 |
| pass | P0 | yes | `S1-package-check:.skilled/skills/system-spec-kit/runtime/cli` | 0 | 3859 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-spec-kit` | 0 | 917 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-spec-kit` | 0 | 33 |
| pass | P0 | yes | `S2-skill-root-metadata` | 0 | 4187 |
| pass | P0 | yes | `S2-skill-derived-freshness` | 0 | 31 |
| pass | P0 | yes | `S2-leaf-manifest-freshness` | 0 | 3959 |
| pass | P2 | no | `S2-frontmatter-version:.skilled/skills/system-spec-kit` | 0 | 79 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-spec-kit/SKILL.md` | 0 | 163 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-spec-kit/changelog/v2.12.42.0.md` | 0 | 151 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md` | 0 | 156 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-spec-kit/feature-catalog/retrieval/rg-flood-control.md` | 0 | 151 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md` | 0 | 160 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-spec-kit/manual-testing-playbook/retrieval/rg-flood-control.md` | 0 | 154 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md` | 0 | 156 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-spec-kit/runtime/cli/retrieval/README.md` | 0 | 157 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/README.md` | 0 | 158 |
| pass | P0 | yes | `S3-catalog-package` | 0 | 1152 |
| pass | P0 | yes | `S4-playbook-package:.skilled/skills/system-spec-kit` | 0 | 174 |
| not_applicable | P2 | no | `S4-playbook-topology` | - | 0 |
| pass | P2 | no | `S5-audit-readmes` | 0 | 47588 |
| pass | P2 | no | `S5-derived-counts` | 0 | 90 |
| pass | P2 | no | `S5-readme-references` | 0 | 2945 |
| pass | P2 | no | `S6-release-coverage` | 0 | 36 |
| pass | P0 | yes | `S7-skill-graph-freshness` | 0 | 27 |
| not_applicable | P2 | no | `S7-parent-skill-check` | - | 0 |
| not_applicable | P2 | no | `S7-router-intent-signals` | - | 0 |
| not_applicable | P2 | no | `S7-router-vocabulary-reach` | - | 0 |
| pass | P0 | yes | `S7-compiled-route-guard` | 0 | 84 |
| pass | P0 | yes | `S7-compiled-route-admission` | 0 | 169 |
| pass | P2 | no | `S8-advisor-status` | 0 | 70 |
| pass | P0 | yes | `S9-command-catalog` | 0 | 36 |
| fail | P2 | no | `S9-command-references` | 1 | 54 |
| pass | P2 | no | `S9-doctor-routes` | 0 | 310 |
| pass | P0 | yes | `S11-runtime-mirrors` | 0 | 214 |
| pass | P0 | yes | `S11-codex-agents` | 0 | 34 |
| pass | P0 | yes | `S11-codex-prompts` | 0 | 31 |
| pass | P0 | yes | `S11-pi-agents` | 0 | 35 |
| pass | P0 | yes | `S11-pi-prompts` | 0 | 30 |
| pass | P0 | yes | `S11-hook-registrations` | 0 | 27 |
| pass | P2 | no | `S11-codex-hooks-install` | 0 | 49 |
| pass | P2 | no | `S13-env-tokens` | 0 | 97 |
| not_applicable | P2 | no | `S15-workflow-shape` | - | 0 |
| pass | P2 | no | `S15-workflow-select` | 0 | 0 |
| pass | P2 | no | `S15-ci-report` | 0 | 84 |
| not_applicable | P2 | no | `S15-ci-contract-drift` | - | 0 |
| pass | P0 | yes | `S15-ci-divergence-ratchet` | 0 | 4533 |
| pass | P0 | yes | `S15-ci-routing-drift-guard` | 0 | 1494 |
| pass | P0 | yes | `S15-ci-deep-loop-admission` | 0 | 42 |
| pass | P0 | yes | `S15-ci-skill-graph-compiler` | 0 | 37 |
| pass | P0 | yes | `S15-ci-router-intent-signals` | 0 | 26 |
| not_applicable | P2 | no | `S15-ci-no-spec-imports` | - | 0 |
| pass | P0 | yes | `S15-ci-message-contract` | 0 | 1341 |
| pass | P0 | yes | `S15-ci-gate-inputs` | 0 | 443 |
| pass | P0 | yes | `S15-ci-rule-canary` | 0 | 29 |
| pass | P0 | yes | `S15-ci-prompt-card-sync` | 0 | 137 |
| pass | P0 | yes | `S15-ci-skill-doc-frontmatter` | 0 | 36 |
| pass | P0 | yes | `S15-ci-markdown-links` | 0 | 1506 |
| pass | P0 | yes | `S15-ci-dispatch-rules` | 0 | 3694 |
| pass | P0 | yes | `S15-ci-command-tree-parity` | 0 | 222 |
| pass | P0 | yes | `S15-ci-playbook-operator-contract` | 0 | 1181 |
| pass | P0 | yes | `S15-ci-catalog-fixtures` | 0 | 332 |
| pass | P0 | yes | `S15-ci-agent-mirror-sync` | 0 | 110 |

## Checks that could not run

None.

## CI workflows this scope triggers

- `advisory-checks.yml`: push: no path filter
- `agent-mirror-sync.yml`: pull_request: paths match .skilled/skills/system-spec-kit/SKILL.md
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
- `skill-doc-frontmatter.yml`: pull_request: paths match .skilled/skills/system-spec-kit/SKILL.md
- `spec-kit-check.yml`: push: paths match .skilled/commands/speckit/README.txt
- `trigger-index-rebuild.yml`: push: no path filter

## Findings by surface

### S1 Code aligns with sk-code

- **A1** P2 literal `.skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs:304`: Case: invoke `structured` with `--limit` followed by a 400-digit decimal. The digit check accepts it, but `Number.parseInt` returns `Infinity`; JSON output then reports `limit: null` in a successful no-match record. Reject values that are not safe integers so the reported limit stays valid.
  - Evidence: `node --input-type=module -e 'import { main } from "./.skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs"; main(["structured", "codex-review-limit-probe-no-match-58f2c", "--limit", "9...` exit 0: "limit": null
- **CC-2** P2 judgment `.skilled/skills/system-spec-kit/runtime/cli/tests/retrofit-convention-pipeline.vitest.ts:169`: AC-003 says the retrofit test file proves the baseline resultCount equals record.matchCount, but the only baseline test checks recipe names, exitCode and outcome; it never reads resultCount. The default probe is 'grep convention' and the seeded corpus declares 'retrofit pipeline stage'/'task breakdown', so the structured baseline is a clean miss and the count is 0 under either the old results.leng...
  - Evidence: `nl -ba .skilled/skills/system-spec-kit/runtime/cli/tests/retrofit-convention-pipeline.vitest.ts | sed -n '169,180p'; grep -n 'DEFAULT_PROBE' .skilled/skills/system-spec-kit/runtime/cli/ops/retrofit-co...` exit 0: 169-180: test asserts recipe names, exitCode and outcome only; no resultCount read. DEFAULT_PROBE = 'grep convention'. Seed phrases: 'retrofit pipeline stage' (line 49), 'task breakdown' (lines 60, 208). The structured baseline is a clean miss.
- **CC-3** P2 literal `.skilled/skills/system-spec-kit/runtime/cli/tests/rg-wrapper-recipes.vitest.ts:340`: The new Number.isSafeInteger guard at rg-wrapper.mjs:305-306 rejects the A1 case (a 400-digit --limit) but the invalid-limit test covers only -1, 2junk and 1.9. The guard has no regression test, and the error text still says 'requires a non-negative integer' while the feature catalog says any non-negative whole decimal is accepted. Add the 400-digit value and align the message/catalog with the saf...
  - Evidence: `nl -ba .skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs | sed -n '300,307p'; nl -ba .skilled/skills/system-spec-kit/runtime/cli/tests/rg-wrapper-recipes.vitest.ts | sed -n '337,344...` exit 0: 305-306: safe-integer check. 340: test loop covers only -1/2junk/1.9. CLI on the 400-digit value prints '--limit requires a non-negative integer' and exits 2.
- **CC-5** P2 literal `specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/006-rg-flood-control/benchmark/run.mjs:178`: The 006 benchmark runner records only the index sha256; plan section 5 and T002b require the git status --porcelain count in both JSON files, and the 004/005 runners record it. before.json's state has only indexSha256, so the before/after fixed-state record is incomplete and the after run will also omit it.
  - Evidence: `nl -ba specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/006-rg-flood-control/benchmark/run.mjs | sed -n '178p'; python3 -c 'import json; print("before_state_keys", list(json.load(open("spec...` exit 0: 178: const state = { indexSha256: ... } only. before_state_keys ['indexSha256'] 006 run.mjs: no gitStatusCount. 005 run.mjs: gitStatusCount at 228.

### S5 READMEs match sk-create-readme, root included

- **CC-1** P2 literal `.skilled/skills/system-spec-kit/README.md:81`: The skill README still describes free-text retrieval as only 'literal ripgrep recipes ... ordered by a caller-side ranking tuple', and its frontmatter version remains 2.7.31.0. The new wrapper behavior (one highest-ranked row per file, --limit default 20 with 0 uncapped, hidden file/match counts) is a user-visible capability of this skill; T022 names this README, and phases 004 and 005 both bumped...
  - Evidence: `nl -ba .skilled/skills/system-spec-kit/README.md | sed -n '13p;81p'` exit 0: 13 version: 2.7.31.0 81 | **Free-text retrieval** | literal ripgrep recipes scoped by track and packet, ordered by a caller-side ranking tuple |

### S9 Commands aligned

- **S9-free-text-execution-mismatch** P1 judgment `.skilled/commands/speckit/assets/search-presentation.txt:121`: Case: a normal /speckit:search request for a common phrase reaches the command’s raw ripgrep recipe at search.md:105-107. That path does not invoke rg-wrapper, so it cannot cap the streamed results before they reach the command. The updated presentation promises one row per file and a 20-file default cap, leaving the primary search route inconsistent with the new behavior. Connect the structured l...
  - Evidence: `rg -n -- 'rg --no-config|rg-wrapper|--limit|record\.hidden|moreInFile' .skilled/commands/speckit/search.md .skilled/commands/speckit/assets/search-presentation.txt .skilled/skills/system-spec-kit/runt...` exit 0: search.md:105 invokes raw rg --json; it has no rg-wrapper invocation. search-presentation.txt:121 promises per-file shaping and a 20-file default cap. rg-wrapper.mjs:31 documents --limit and lines 257, 297 implement hidden counts and limit handling.
- **BAT-01** P2 judgment: S9-command-references failed (exit 1).
  - Evidence: `node .skilled/commands/scripts/validate-command-references.cjs` exit 1: FAIL 1 unresolved command reference(s): .skilled/commands/doctor/assets/doctor-deep-loop.yaml:96 [skill-asset] .skilled/skills/system-deep-loop/runtime/database/deep-loop-graph.sqlite - path does not exist on disk
- **CC-4** P2 literal `.skilled/commands/speckit/README.txt:91`: The command-family README now says 'Structured free-text results keep the highest-ranked row per file' and describes the wrapper's --limit, but the same table defines /speckit:search's free-text lane as the raw Section 2.1 recipe, and search.md:105 runs raw rg with no rg-wrapper. The D fix added the raw-recipe caveat only to search-presentation.txt; this sibling command doc still implies the comma...
  - Evidence: `nl -ba .skilled/commands/speckit/README.txt | sed -n '84,91p'; grep -n 'rg --no-config' .skilled/commands/speckit/search.md` exit 0: ...text evidence | default | Structured JSONL recipe, retrieval-conventions.md Section 2.1 | 91: Structured free-text results keep the highest-ranked row per file. The wrapper's `--limit` defaults to 20 files... search.md:105: rg --no-config --hidden --json --fixed-strings --ignore-case (no rg-wrapper)

## Findings outside the scope

A lane or the critic reported these on files that are not in scope.json, so they are not attributed to this range. "merged-in" means the file changed between the merge base and the head only through a merge the first-parent scope leaves out; "unchanged in range" means the range never touched it, which is usually a cause a lane traced from an in-scope change. "pre-existing (critic)" means the critic showed the finding predates the scope, whatever file it names. A finding here can still block CI; its severity stands.

### pre-existing (critic)

- **C-002** P2 judgment `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/rg-lane.mjs:88`: `SPECKIT_RG_BIN` is an operator-settable ripgrep executable override: the code reads it and its error message tells callers to set it. Neither `.env.example` nor `ENV-REFERENCE.md` lists it. The token already existed at baseline commit `3378c36a06`, so this is pre-existing env-documentation debt, not a variable introduced by this change. [S13, C]
  - Evidence: `python3 -c 'from pathlib import Path; import subprocess; token="SPECKIT_RG_BIN"; docs=[Path(".env.example"),Path(".skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md")]; print("docs",[(str(path),...` exit 0: ...V-REFERENCE.md', False)] current ["88:export const RIPGREP_BIN_ENV = 'SPECKIT_RG_BIN';", "187:const override = env[RIPGREP_BIN_ENV];", "239:if (run.error) return `unavailable: ${run.error.message}; set ${RIPGREP_BIN_ENV} to the binary`;'] baseline ["export const RIPGREP_BIN_ENV = 'SPECKIT_RG_BIN';"]
  - Critic override: pre-existing, lane severity P2. SPECKIT_RG_BIN exists at base 3378c36a06 (C-002's own evidence); the S13 env-token battery reports no new unlisted token. It predates this change.

### reason unknown

- **C-001** P2 literal `README.md:798`: The root system-spec-kit summary mentions trigger-index changes but omits the new structured ripgrep behavior: one highest-ranked row per file, the default 20-file limit, `--limit 0`, and hidden-result counts. The skill README and v2.12.41 changelog cover it, but the root summary does not. [S5, C]
  - Evidence: `nl -ba README.md | sed -n '796,800p'` exit 0: ... reports the full candidate count before `--limit`, marks truncated results, and on a zero-hit checks spec docs the index does not list yet. It also manages the manifest template source, 42 validation rules, the spec-kit script suite and the feature-catalog / testing-playbook documentation surfaces.

## Overturned by the critic

The critic refuted these or showed they repeat another finding, so they are left out of every count above. Each keeps the severity its lane gave it.

### refuted

- **B-1** P1 judgment `.skilled/skills/system-spec-kit/manual-testing-playbook/retrieval/rg-flood-control.md:65`: Case: the assistant replies that “the three qm7-* files” have one match each, without naming any individual file. The check searches all of history.txt after the prompt, including the shell’s table of tool output, so those filenames satisfy the reply assertion and the scenario passes despite missing its stated user-facing behavior. [S4, B]
  - Evidence: `nl -ba .skilled/skills/system-spec-kit/manual-testing-playbook/retrieval/rg-flood-control.md | sed -n '65p'; nl -ba specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/006-rg-flood-control/ben...` exit 0: ...ter the prompt. history.txt lines 35-39 show the tool-output table naming qm7-a.md, qm7-b.md and qm7-c.md; line 42's assistant reply names only qm7-*. result.json records PASS. The requested git show for this new scenario path at 3378c36a06 exited 128 because the path did not exist at that baseline.
  - Critic override: refuted, lane severity P1. The table at history.txt:30-42 is the assistant's own Markdown answer, not tool output; the only tool lines are the two check-mark rows at 27-28. It names qm7-a.md, qm7-b.md and qm7-c.md, so the reply assertion matches the scenario's stated expected behavior. The PASS is valid; the check-mark filter only strips tool-call lines.

### duplicate

- **C-003** P2 judgment `.skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs:304`: The digit-only check accepts arbitrarily long `--limit` values, but `Number.parseInt` converts a 400-digit decimal to `Infinity`. The structured JSON serializer then emits `limit: null`, contrary to the documented effective integer limit. Reject values outside the safe integer range or preserve and handle the decimal value without numeric overflow. [S5, C]
  - Evidence: `node -e 'const digits = "9".repeat(400); const parsed = Number.parseInt(digits, 10); console.log(JSON.stringify({inputDigits: digits.length, parsedIsFinite: Number.isFinite(parsed), serializedLimit: J...` exit 0: {"inputDigits":400,"parsedIsFinite":false,"serializedLimit":"{\"limit\":null}"}
  - Critic override: duplicate, lane severity P2. Duplicate of A1: both describe the same Number.parseInt Infinity case; A1's safe-integer fix covers it. No separate defect.

## Env tokens

0 variables read in changed code, 0 not in .env.example.

## Probes

| Probe | Expected | Top-1 | Status |
|---|---|---|---|
| P01 | system-spec-kit | sk-doc | fail |
| P02 | system-spec-kit | sk-code | fail |

## Probes awaiting the critic

- P01: Search the spec and skill docs for a common phrase and return one highest-ranked row per file, capped at 20 files by default, with hidden-result counts and an option to remove the cap.; expected system-spec-kit; actual skill sk-doc
- P02: Update spec search's retrofit audit to count every matching line even when results are grouped to one ranked row per file.; expected system-spec-kit; actual skill sk-code

## Files no lane reviewed

- `specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/006-rg-flood-control/benchmark/before.json`
- `specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/006-rg-flood-control/benchmark/queries.txt`
- `specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/006-rg-flood-control/benchmark/run.mjs`

