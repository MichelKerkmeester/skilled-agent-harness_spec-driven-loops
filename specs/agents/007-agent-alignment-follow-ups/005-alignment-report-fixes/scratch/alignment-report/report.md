# Alignment report: 57531ae8bc..869d4391bf

Report-only run: every check ran in its read-only form, and this command writes only into its run folder.

## Scope

- Kind: range, file set first-parent
- Target: `57531ae8bc..869d4391bf`
- Commits: `57531ae8bccf526cda34683c9c260d5928852243` to `869d4391bf9441c09ff1e5be713135f59caf43ed`, 7 first-parent commits
- Files: 81, of which 0 uncommitted or untracked
- Owners: 10
- Findings: 11 (P0 0, P1 2, P2 9), 3 literal, 0 inferred, 4 outside the scope; 1 more overturned by the critic and not counted
- Lanes: A, B, C, D
- Fix plan: [fix-plan.md](fix-plan.md)

## Surfaces

| Surface | Title | Fired | Files | Checks |
|---|---|---|---|---|
| S1 | Code aligns with sk-code | no | 0 | 3 |
| S2 | Skill docs match sk-create-skill | yes | 7 | 7 |
| S3 | Feature catalog entries | yes | 7 | 1 |
| S4 | Playbooks match sk-create-manual-testing-playbook | yes | 7 | 2 |
| S5 | READMEs match sk-create-readme, root included | yes | 9 | 3 |
| S6 | Changelogs updated or created | yes | 8 | 1 |
| S7 | Skill routing is right | yes | 2 | 6 |
| S8 | Skill integrated in system-skill-advisor | yes | 2 | 1 |
| S9 | Commands aligned | no | 0 | 3 |
| S10 | Agents aligned | yes | 4 | 1 |
| S11 | Runtime mirrors | yes | 5 | 7 |
| S12 | AGENTS.md and repo rules | no | 0 | 2 |
| S13 | Env docs list every operator-settable variable | no | 0 | 1 |
| S14 | Spec packets validate (changed-packet-validation replay) | yes | 28 | 1 |
| S15 | CI parity | yes | 0 | 21 |

## Battery

pass 58, fail 1, cannot run 0, not applicable 2

Grading: P0 when a CI step in a workflow that fires for the scope runs the same command; P1 for a skill package gate; P2 otherwise.

Failures are not compared against the scope's start point in this version, so a failing row may be debt that predates the scope. Re-running a check at the start point needs a second checkout, which a report-only run does not create.

| Status | Severity | CI-gated | Check | Exit | ms |
|---|---|---|---|---|---|
| pass | P1 | no | `S2-skill-package:.skilled/skills/sk-doc/sk-create-agent` | 0 | 178 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-spec-kit` | 0 | 937 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/sk-doc/sk-create-agent` | 0 | 62 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-spec-kit` | 0 | 62 |
| pass | P0 | yes | `S2-skill-root-metadata` | 0 | 4516 |
| pass | P0 | yes | `S2-skill-derived-freshness` | 0 | 32 |
| pass | P0 | yes | `S2-leaf-manifest-freshness` | 0 | 4463 |
| pass | P2 | no | `S2-frontmatter-version:.skilled/skills/sk-doc` | 0 | 126 |
| pass | P2 | no | `S2-frontmatter-version:.skilled/skills/system-spec-kit` | 0 | 113 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-doc/sk-create-agent/SKILL.md` | 0 | 168 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/sk-doc/sk-create-agent/changelog/v1.0.8.0.md` | 0 | 163 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-spec-kit/changelog/v2.13.1.0.md` | 0 | 162 |
| pass | P0 | yes | `S3-catalog-package` | 0 | 1067 |
| pass | P0 | yes | `S4-playbook-package:.skilled/skills/sk-doc` | 0 | 39 |
| pass | P0 | yes | `S4-playbook-package:.skilled/skills/system-spec-kit` | 0 | 197 |
| pass | P2 | no | `S4-playbook-topology:.skilled/skills/sk-doc` | 0 | 37 |
| pass | P2 | no | `S5-audit-readmes` | 0 | 68678 |
| pass | P2 | no | `S5-derived-counts` | 0 | 145 |
| pass | P2 | no | `S5-readme-references` | 0 | 3568 |
| fail | P2 | no | `S6-release-coverage` | 1 | 40 |
| pass | P0 | yes | `S7-skill-graph-freshness` | 0 | 29 |
| pass | P0 | yes | `S7-parent-skill-check:.skilled/skills/sk-doc` | 0 | 1278 |
| pass | P0 | yes | `S7-router-intent-signals:.skilled/skills/sk-doc` | 0 | 26 |
| pass | P2 | no | `S7-router-vocabulary-reach:.skilled/skills/sk-doc` | 0 | 23984 |
| pass | P0 | yes | `S7-compiled-route-guard` | 0 | 87 |
| pass | P0 | yes | `S7-compiled-route-admission` | 0 | 203 |
| pass | P2 | no | `S8-advisor-status` | 0 | 98 |
| pass | P0 | yes | `S10-agent-roster` | 0 | 31 |
| pass | P0 | yes | `S11-runtime-mirrors` | 0 | 302 |
| pass | P0 | yes | `S11-codex-agents` | 0 | 45 |
| pass | P0 | yes | `S11-codex-prompts` | 0 | 44 |
| pass | P0 | yes | `S11-pi-agents` | 0 | 43 |
| pass | P0 | yes | `S11-pi-prompts` | 0 | 39 |
| pass | P0 | yes | `S11-hook-registrations` | 0 | 37 |
| pass | P2 | no | `S11-codex-hooks-install` | 0 | 55 |
| pass | P0 | yes | `S14-packet-validate:specs/agents/007-agent-alignment-follow-ups` | 0 | 1448 |
| pass | P0 | yes | `S14-packet-validate:specs/agents/007-agent-alignment-follow-ups/001-fanout-persona-tool-mapping` | 0 | 1485 |
| pass | P0 | yes | `S14-packet-validate:specs/agents/007-agent-alignment-follow-ups/002-deepseek-harness-persona-probe` | 0 | 1482 |
| pass | P0 | yes | `S14-packet-validate:specs/agents/007-agent-alignment-follow-ups/003-orchestrate-task-package-agent-names` | 0 | 1480 |
| pass | P0 | yes | `S14-packet-validate:specs/agents/007-agent-alignment-follow-ups/004-agent-authoring-registry-step` | 0 | 1795 |
| not_applicable | P2 | no | `S15-workflow-shape` | - | 0 |
| pass | P2 | no | `S15-workflow-select` | 0 | 0 |
| pass | P2 | no | `S15-ci-report` | 0 | 111 |
| not_applicable | P2 | no | `S15-ci-contract-drift` | - | 0 |
| pass | P0 | yes | `S15-ci-divergence-ratchet` | 0 | 5999 |
| pass | P0 | yes | `S15-ci-routing-drift-guard` | 0 | 1915 |
| pass | P0 | yes | `S15-ci-deep-loop-admission` | 0 | 47 |
| pass | P0 | yes | `S15-ci-skill-graph-compiler` | 0 | 44 |
| pass | P0 | yes | `S15-ci-router-intent-signals` | 0 | 28 |
| pass | P0 | yes | `S15-ci-no-spec-imports` | 0 | 43 |
| pass | P0 | yes | `S15-ci-message-contract` | 0 | 1661 |
| pass | P0 | yes | `S15-ci-gate-inputs` | 0 | 507 |
| pass | P0 | yes | `S15-ci-rule-canary` | 0 | 32 |
| pass | P0 | yes | `S15-ci-prompt-card-sync` | 0 | 158 |
| pass | P0 | yes | `S15-ci-skill-doc-frontmatter` | 0 | 36 |
| pass | P0 | yes | `S15-ci-markdown-links` | 0 | 1662 |
| pass | P0 | yes | `S15-ci-dispatch-rules` | 0 | 3345 |
| pass | P0 | yes | `S15-ci-command-tree-parity` | 0 | 282 |
| pass | P0 | yes | `S15-ci-playbook-operator-contract` | 0 | 1246 |
| pass | P0 | yes | `S15-ci-catalog-fixtures` | 0 | 521 |
| pass | P0 | yes | `S15-ci-agent-mirror-sync` | 0 | 141 |

## Checks that could not run

None.

## CI workflows this scope triggers

- `advisory-checks.yml`: push: no path filter
- `agent-mirror-sync.yml`: pull_request: paths match .claude/agents/orchestrate.md
- `changed-packet-validation.yml`: push: no path filter
- `command-tree-parity.yml`: pull_request: paths match .claude/agents/orchestrate.md
- `comment-hygiene.yml`: pull_request: no path filter
- `dependabot-auto-merge.yml`: pull_request: no path filter
- `dispatch-enforcement-guard.yml`: pull_request: no path filter
- `gate-inputs.yml`: push: no path filter
- `hook-vitest-suites.yml`: pull_request: no path filter
- `markdown-link-integrity.yml`: pull_request: paths match .claude/agents/orchestrate.md
- `message-contract.yml`: push: no path filter
- `naming-standard-guard.yml`: pull_request: no path filter
- `opencode-dual-version.yml`: pull_request: paths match .skilled/agents/orchestrate.md
- `opencode-plugin-tests.yml`: pull_request: paths match .claude/agents/orchestrate.md
- `playbook-operator-contract.yml`: pull_request: no path filter
- `prompt-card-sync.yml`: pull_request: no path filter
- `routing-registry-drift.yml`: push: paths match .skilled/skills/sk-doc/sk-create-agent/SKILL.md
- `rule-canary-sync.yml`: pull_request: no path filter
- `runtime-no-spec-import.yml`: push: paths match .skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-doc/manifest.json
- `sk-doc-script-tests-filtered.yml`: pull_request: paths match .skilled/skills/sk-doc/sk-create-agent/SKILL.md
- `sk-doc-script-tests.yml`: pull_request: no path filter
- `skill-doc-frontmatter.yml`: pull_request: paths match .skilled/skills/sk-doc/sk-create-agent/SKILL.md
- `spec-kit-check.yml`: push: paths match .claude/agents/orchestrate.md
- `trigger-index-rebuild.yml`: push: no path filter

## Findings by surface

### S2 Skill docs match sk-create-skill

- **B-1** P1 literal `.skilled/skills/sk-doc/sk-create-agent/SKILL.md:197`: Step 13 orders a registry record for every new agent with no directory qualifier, but `.skilled/bin/sync-agent-roster.cjs` enumerates only `.skilled/agents` (line 416) and fails every registry record whose name has no file there. The skill supports authoring a single `.claude/agents/` file (output table at SKILL.md:69-73, Claude schema at 124-132), and the repo has a live one: `.claude/agents/Expl...
  - Evidence: `node $SCRATCH/fake/.skilled/bin/sync-agent-roster.cjs --check # scratch copy of .skilled/agents with a claude-only-persona record and no .skilled/agents/claude-only-persona.md; same tree without the r...` exit 1: registry record without an agent file: claude-only-persona agent-roster: FAIL (5 problem(s))
- **CR-1** P2 literal `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/references/guards-and-hooks.md:61`: The harness reference presents the model-facing tool list as complete: `bash`, `write`, `edit` and `subagent`. The phase 2 control run in this change called a `read` tool, recorded as the one `tool_call` in `scratch/dsh-control-events.jsonl`. The phase 2 implementation summary calls this a documentation defect and hands it to a harness owner, but no lane reported it and the change files no follow-...
  - Evidence: `rg -n 'Harness tool names are lowercase' .skilled/skills/cli-external-orchestration/cli-deepseek-harness/references/guards-and-hooks.md && rg -n -o '"tool":"read"' specs/agents/007-agent-alignment-fol...` exit 0: 61:Harness tool names are lowercase (`bash`, `write`, `edit`, `subagent`), so a matcher written for capitalized tool names selects nothing. 5:"tool":"read"

### S6 Changelogs updated or created

- **C-1** P1 judgment `.skilled/skills/sk-doc/sk-create-agent/changelog/v1.0.8.0.md:17`: The new entry fails sk-create-changelog's shape gate four times, and the standard's §9 says exit 1 blocks the write: line 17 keeps `(Level 1)` on the spec-folder line where §5 item 4 allows the path only, line 15 runs 26 words and line 23 runs 34 against the 22-word ceiling, and the prose averages 13.4 words a sentence against the 10-word ceiling. Fix: delete ` (Level 1)` from line 17, split line ...
  - Evidence: `python3 .skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py .skilled/skills/sk-doc/sk-create-agent/changelog/v1.0.8.0.md` exit 1: ...evel 1) label, the line carries paths only [sentence-max] line 15: a sentence of 26 words, ceiling 22. Split it [sentence-max] line 23: a sentence of 34 words, ceiling 22. Split it [sentence-mean] 13.4 words a sentence on average, ceiling 10. Use more, shorter sentences SUMMARY files=1 pass=0 fail=1
- **BAT-01** P2 judgment: S6-release-coverage failed (exit 1).
  - Evidence: `node .skilled/commands/assets/local-skilled-alignment/check-release-coverage.cjs --scope /Users/michelkerkmeester/.local/state/local-skilled-alignment/384-agent-alignment-follow-ups/20261114T170403Z/s...` exit 1: MISSING release-notes sk-create-agent required by .skilled/skills/sk-doc/sk-create-agent/changelog/v1.0.8.0.md STATUS=FINDINGS check-release-coverage: required=1 missing=1 notes=.skilled/changelog/skilled/v4.0.2.1.md
- **C-2** P2 literal `.skilled/skills/sk-doc/sk-create-agent/changelog/v1.0.8.0.md:25`: Line 25 says both later steps moved down "with their wording unchanged", but the diff shows the old step 13 became step 14 and gained the `agent file without a registry record: <name>` sentence. The bullet directly above already reports that added error, so the entry contradicts itself and misdescribes what shipped. Only delivery (old 14, new 15) kept its wording.
  - Evidence: `git -c core.fsmonitor=false diff 57531ae8bc..869d4391bf -- .skilled/skills/sk-doc/sk-create-agent/SKILL.md` exit 0: ...every agent's outline with that list. A new agent file with no registry record fails it with `agent file without a registry record: <name>`. -14. Deliver only after validation passes or after reporting the exact blocker. +15. Deliver only after validation passes or after reporting the exact blocker.

### S8 Skill integrated in system-skill-advisor

- **CR-2** P2 judgment `.skilled/skills/sk-doc/sk-create-agent/SKILL.md:28`: The new registry step is absent from the packet's routing vocabulary. The `Keyword triggers:` line and the derived `create-agent-aliases` and hub `intent_signals` carry no `agent registry`, `registry record`, `roster check` or `sync-agent-roster` phrase. The supplied probes P02 and P03 pass only because they also say `new agent` or `agent file`. A user asking the step's own question does not reach...
  - Evidence: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"add my agent to the agent registry"}' --format json` exit 0: recommendations: sk-code 0.233, sk-doc 0.221, mcp-tooling 0.198. The prompt "the agent registry needs a record for my new persona" returns an empty recommendations list.

### S15 CI parity

- **A-1** P2 judgment `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/corpus-manifest.json:2`: HEAD's corpus no longer matches the committed trigger-index outputs. The head commit edited a corpus document (.skilled/skills/system-spec-kit/changelog/v2.13.1.0.md) after the last regeneration, so a fresh generation writes a different manifestHash/corpusHash into all four tracked outputs (trigger-index.json, corpus-manifest.json, generation-diagnostics.json, phrase-variants.json). `--check` stil...
  - Evidence: `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --check (plus a fresh generation to a scratch --out and byte comparison of the four committed outputs)` exit 0: ... hash differs (index 53dd18fad3acccb6f60e5548a6b066cb2c4eb9cd50ee594ca39184be86b64966, corpus adfb1d11a4f3cd4f2cf24e75f348cccb127b263b42fa7ee22d76635076e1843e); no lookup answer depends on it DIFF trigger-index.json DIFF corpus-manifest.json DIFF generation-diagnostics.json DIFF phrase-variants.json

## Findings outside the scope

A lane or the critic reported these on files that are not in scope.json, so they are not attributed to this range. "merged-in" means the file changed between the merge base and the head only through a merge the first-parent scope leaves out; "unchanged in range" means the range never touched it, which is usually a cause a lane traced from an in-scope change. "pre-existing (critic)" means the critic showed the finding predates the scope, whatever file it names. A finding here can still block CI; its severity stands.

### unchanged in range

- **D-1** P2 judgment `.skilled/agents/markdown.md:34`: The new registry step (sk-create-agent/SKILL.md:197) requires the author to write .skilled/agents/agent-registry.json and run `node .skilled/bin/sync-agent-roster.cjs`, which rewrites .skilled/agents/orchestrate.md and .skilled/agents/README.txt. The preferred `/create:agent` entry point runs its own six-step YAML and never names the registry or the roster script (rg exit 1, no matches). The execu... [S10, D]
  - Evidence: `rg -n "agent-registry|sync-agent-roster|roster" .skilled/commands/create/assets/create-agent-auto.yaml .skilled/commands/create/assets/create-agent-confirm.yaml .skilled/commands/create/assets/create-...` exit 1: 
- **B-3** P2 judgment `.skilled/skills/sk-doc/sk-create-agent/manual-testing-playbook/manual-testing-playbook.md:31`: The playbook's opening blockquote promises coverage of `delivery checks` (line 9), but the six scenarios cover component choice, runtime contract and body validation only (line 31), and no scenario file mentions the registry record or `sync-agent-roster.cjs`. The change made the registry record a mandatory pre-delivery step (SKILL.md:197-198), yet AGV-001, the validation scenario, still stops at `... [S4, B]
  - Evidence: `grep -rn "registry\|roster\|sync-agent" .skilled/skills/sk-doc/sk-create-agent/manual-testing-playbook/` exit 1: (no matches)
- **C-4** P2 judgment `.skilled/skills/sk-doc/sk-create-agent/README.md:132`: The skill README still describes the output as one validated agent file (frontmatter description line 3, Produces row line 25) and its verification as `validate_document.py` plus the naming checks (lines 132-136). SKILL.md step 13 now requires a record in `.skilled/agents/agent-registry.json`, and step 14 makes `sync-agent-roster.cjs --check` mandatory with `agent file without a registry record: <... [S5, C]
  - Evidence: `grep -n "sync-agent-roster\|agent-registry" .skilled/skills/sk-doc/sk-create-agent/README.md` exit 1: (no match)
- **C-3** P2 judgment `.skilled/changelog/skilled/v4.0.2.1.md:273`: The branch ships sk-create-agent v1.0.8.0 (SKILL.md bumped plus a new skill changelog), but the newest root release note never names `sk-create-agent`; the component paragraph at line 273 lists the skills that have an entry for the release and omits this one, so check-release-coverage exits 1. v4.0.2.1 is tagged on origin (`refs/tags/v4.0.2.1` resolves, exit 0), so the route is a new `skilled` ent... [S6, C]
  - Evidence: `node .skilled/commands/assets/local-skilled-alignment/check-release-coverage.cjs --scope /Users/michelkerkmeester/.local/state/local-skilled-alignment/384-agent-alignment-follow-ups/20261114T170403Z/s...` exit 1: MISSING release-notes sk-create-agent required by .skilled/skills/sk-doc/sk-create-agent/changelog/v1.0.8.0.md STATUS=FINDINGS check-release-coverage: required=1 missing=1 notes=.skilled/changelog/skilled/v4.0.2.1.md

## Overturned by the critic

The critic refuted these or showed they repeat another finding, so they are left out of every count above. Each keeps the severity its lane gave it.

### duplicate

- **B-2** P2 judgment `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/corpus-manifest.json:2`: Commit 869d4391bf added `version: 2.13.1.0` to `.skilled/skills/system-spec-kit/changelog/v2.13.1.0.md`, a document inside the retrieval corpus, but the committed fixtures were not regenerated. `corpusHash` still hashes the tree before that edit: substituting the pre-fix bytes reproduces the committed `6e395dc4...` exactly, while the current tree hashes to `9b36f10b...`. Regeneration changes only ... [S2, B]
  - Evidence: `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --out $SCRATCH/gen2/trigger-index.json --quiet; then compare the four generated files with the committed ones` exit 0: ...00af0787d3c2e74219b196 committed corpusHash: 6e395dc41c892399a2635c6eb934bc674a76ab932775409a4dddd1da096d3979 paths identical: True | counts: 26965 26965 manifestHash: adfb1d11a4f3cd4f2cf24e75f348cccb127b263b42fa7ee22d76635076e1843e vs 53dd18fad3acccb6f60e5548a6b066cb2c4eb9cd50ee594ca39184be86b64966
  - Critic override: duplicate, lane severity P2. B-2 reports the same stale retrieval snapshot as A-1: both name `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/corpus-manifest.json:2` and the same four outputs to regenerate. A-1 also records the post-merge trigger-index rebuild consequence, so B-2 is the duplicate.

## Probes

| Probe | Expected | Top-1 | Status |
|---|---|---|---|
| P01 | sk-doc/sk-create-agent | sk-doc/sk-create-agent | pass |
| P02 | sk-doc/sk-create-agent | sk-doc/sk-create-agent | pass |
| P03 | sk-doc/sk-create-agent | sk-doc/sk-create-agent | pass |
| P04 | sk-doc/sk-create-agent | sk-doc/sk-create-agent | pass |
| P05 | sk-doc/sk-create-agent | sk-doc/sk-create-agent | pass |
| P06 | sk-doc/sk-create-agent | sk-doc/sk-create-agent | pass |
| P07 | sk-git | sk-git | pass |
| P08 | sk-code/sk-code-review | sk-code/sk-code-review | pass |
| P09 | sk-code/sk-code-frontend | sk-code/sk-code-frontend | pass |
| P10 | sk-doc/sk-create-skill | sk-doc/sk-create-skill | pass |
| P11 | sk-doc/sk-create-changelog | sk-doc/sk-create-changelog | pass |
| P12 | sk-design/sk-design-md-generator | sk-design/sk-design-md-generator | pass |
| P13 | sk-prompt | sk-prompt | pass |

## Probes awaiting the critic

None.

## Files no lane reviewed

- `specs/agents/007-agent-alignment-follow-ups/001-fanout-persona-tool-mapping/scratch/.gitkeep`
- `specs/agents/007-agent-alignment-follow-ups/001-fanout-persona-tool-mapping/scratch/after.txt`
- `specs/agents/007-agent-alignment-follow-ups/001-fanout-persona-tool-mapping/scratch/baseline.txt`
- `specs/agents/007-agent-alignment-follow-ups/001-fanout-persona-tool-mapping/scratch/codex-probe-prompt.txt`
- `specs/agents/007-agent-alignment-follow-ups/001-fanout-persona-tool-mapping/scratch/codex-run-1.txt`
- `specs/agents/007-agent-alignment-follow-ups/001-fanout-persona-tool-mapping/scratch/codex-run-2.txt`
- `specs/agents/007-agent-alignment-follow-ups/001-fanout-persona-tool-mapping/scratch/codex-run-3.txt`
- `specs/agents/007-agent-alignment-follow-ups/001-fanout-persona-tool-mapping/scratch/codex-run-exits.txt`
- `specs/agents/007-agent-alignment-follow-ups/001-fanout-persona-tool-mapping/scratch/decision.md`
- `specs/agents/007-agent-alignment-follow-ups/002-deepseek-harness-persona-probe/scratch/.gitkeep`
- `specs/agents/007-agent-alignment-follow-ups/002-deepseek-harness-persona-probe/scratch/baseline.txt`
- `specs/agents/007-agent-alignment-follow-ups/002-deepseek-harness-persona-probe/scratch/dsh-control-events.jsonl`
- `specs/agents/007-agent-alignment-follow-ups/002-deepseek-harness-persona-probe/scratch/dsh-control-prompt.txt`
- `specs/agents/007-agent-alignment-follow-ups/002-deepseek-harness-persona-probe/scratch/dsh-control-report.txt`
- `specs/agents/007-agent-alignment-follow-ups/002-deepseek-harness-persona-probe/scratch/dsh-probe-events.jsonl`
- `specs/agents/007-agent-alignment-follow-ups/002-deepseek-harness-persona-probe/scratch/dsh-probe-prompt.txt`
- `specs/agents/007-agent-alignment-follow-ups/002-deepseek-harness-persona-probe/scratch/dsh-probe-report.txt`
- `specs/agents/007-agent-alignment-follow-ups/002-deepseek-harness-persona-probe/scratch/verdict.md`
- `specs/agents/007-agent-alignment-follow-ups/003-orchestrate-task-package-agent-names/scratch/.gitkeep`
- `specs/agents/007-agent-alignment-follow-ups/003-orchestrate-task-package-agent-names/scratch/after.txt`
- `specs/agents/007-agent-alignment-follow-ups/003-orchestrate-task-package-agent-names/scratch/baseline.txt`
- `specs/agents/007-agent-alignment-follow-ups/003-orchestrate-task-package-agent-names/scratch/dispatch-briefs/claude.allowed`
- `specs/agents/007-agent-alignment-follow-ups/003-orchestrate-task-package-agent-names/scratch/dispatch-briefs/i-orchestrate.txt`
- `specs/agents/007-agent-alignment-follow-ups/003-orchestrate-task-package-agent-names/scratch/dispatch-briefs/p3-claude.brief`
- `specs/agents/007-agent-alignment-follow-ups/003-orchestrate-task-package-agent-names/scratch/dispatch-briefs/p3-claude.prompt.txt`
- `specs/agents/007-agent-alignment-follow-ups/003-orchestrate-task-package-agent-names/scratch/dispatch-briefs/p3-skilled.brief`
- `specs/agents/007-agent-alignment-follow-ups/003-orchestrate-task-package-agent-names/scratch/dispatch-briefs/p3-skilled.prompt.txt`
- `specs/agents/007-agent-alignment-follow-ups/003-orchestrate-task-package-agent-names/scratch/dispatch-briefs/skilled.allowed`
- `specs/agents/007-agent-alignment-follow-ups/004-agent-authoring-registry-step/scratch/.gitkeep`
- `specs/agents/007-agent-alignment-follow-ups/004-agent-authoring-registry-step/scratch/after.txt`
- `specs/agents/007-agent-alignment-follow-ups/004-agent-authoring-registry-step/scratch/baseline.txt`
- `specs/agents/007-agent-alignment-follow-ups/004-agent-authoring-registry-step/scratch/dispatch-briefs/changelog.allowed`
- `specs/agents/007-agent-alignment-follow-ups/004-agent-authoring-registry-step/scratch/dispatch-briefs/i-skill.txt`
- `specs/agents/007-agent-alignment-follow-ups/004-agent-authoring-registry-step/scratch/dispatch-briefs/p4-changelog.brief`
- `specs/agents/007-agent-alignment-follow-ups/004-agent-authoring-registry-step/scratch/dispatch-briefs/p4-changelog.prompt.txt`
- `specs/agents/007-agent-alignment-follow-ups/004-agent-authoring-registry-step/scratch/dispatch-briefs/p4-skill.brief`
- `specs/agents/007-agent-alignment-follow-ups/004-agent-authoring-registry-step/scratch/dispatch-briefs/p4-skill.prompt.txt`
- `specs/agents/007-agent-alignment-follow-ups/004-agent-authoring-registry-step/scratch/dispatch-briefs/skill.allowed`
- `specs/agents/007-agent-alignment-follow-ups/004-agent-authoring-registry-step/scratch/probe.txt`
- `specs/agents/graph-metadata.json`

