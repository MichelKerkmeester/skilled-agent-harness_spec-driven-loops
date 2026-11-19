# Alignment report: topic expansive-depth

Report-only run: every check ran in its read-only form, and this command writes only into its run folder.

## Scope

- Kind: topic, file set doc-set
- Target: `topic expansive-depth`
- Commits: `32fec82b0e461fc0094cd4524db4a87636a61649` to `32fec82b0e461fc0094cd4524db4a87636a61649`, 0 first-parent commits
- Files: 87, of which 0 uncommitted or untracked
- Owners: 6
- Findings: 25 (P0 0, P1 1, P2 24), 8 literal, 6 inferred, 0 outside the scope; 0 more overturned by the critic and not counted
- Open findings: 25 (0 handed off, 0 rebutted)
- Lanes: L1, L2, L3, L4, L5, L6, L7, L8
- Fix plan: [fix-plan.md](fix-plan.md)

## Surfaces

| Surface | Title | Fired | Files | Checks |
|---|---|---|---|---|
| D1 | Docs match the topic's current code | yes | 87 | lens only |
| D2 | Topic checks pass | yes | 0 | 2 |

## Battery

pass 2, fail 0, cannot run 0, not applicable 0

Grading: topic checks from topics.json; a doc-alignment run has no change-scoped battery.

Failures are not compared against the scope's start point in this version, so a failing row may be debt that predates the scope. Re-running a check at the start point needs a second checkout, which a report-only run does not create.

| Status | Severity | CI-gated | Check | Exit | ms |
|---|---|---|---|---|---|
| pass | P1 | no | `D2-contract-drift` | 0 | 50 |
| pass | P1 | no | `D2-doc-facts` | 0 | 154 |

## Checks that could not run

None.

## Findings by surface

### D1 Docs match the topic's current code

- **L5-1** P1 judgment `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/review-pivot-gates-on-terminal-frontier.md:56`: The doc says "Command 1 prints `Tests 4 passed` (the rest of the file skipped). Its four passing cases are ..." and names four cases. The current suite has five cases under the describe 'review divergent pivot under the expansive depth mode'. The fifth is 'still rejects a frontier seed whose free-text scope asks for a change'. Command 1 now prints `Tests 5 passed | 23 skipped (28)`. The Pass rule ...
  - Evidence: `cd .skilled/skills/system-deep-loop/runtime && npx vitest run divergent-pivot.vitest -t "review divergent pivot under the expansive depth mode" --reporter=verbose | grep -E "✓|×|Tests"` exit 0: ...ens to name a mutation verb; ✓ still rejects a frontier seed whose free-text scope asks for a change; ✓ leaves a default run untouched even when the registry still carries an open frontier node; Tests 5 passed | 23 skipped (28). (Exit 0 is grep's status through the pipe. No failed case was printed.)
- **C-1** P2 judgment `.skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:464`: This is the review copy of the gap L4-6 found in the research loop-protocol. The Expansive Depth Frontier paragraph says only that 'the seed step prints the derived budget'. It never names step_frontier_budget, the step that runs `frontier-admit.cjs budget --target review` and writes the derived maxIterations into deep-review-config.json (deep-review.yaml:930-943). It also leaves out that the step...
  - Evidence: `grep -n "step_frontier_budget:\|frontier-admit.cjs budget\|skip_when: \"extension_pending" .skilled/commands/deep/assets/deep-review.yaml | sed -n 1,3p; grep -c 'step_frontier_budget' .skilled/skills/...` exit 0: 930: step_frontier_budget: 933: skip_when: "extension_pending == true or config.fanout_lineage_artifact_dir is present" 943: command: 'node .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs budget --target review --artifact-dir "{artifact_dir}"' 0
- **C-2** P2 judgment `.skilled/skills/system-deep-loop/deep-review/references/state/state-format.md:305`: This is the review copy of the gap L4-1 found in the research state-format. The doc gives the reducer's projection as `registry.frontier`: nodes, stats, budget, activeNodeId and activeNextDimension. The review reducer also skips a frontier-nodes.jsonl row it cannot parse. It adds a `warnings` array to the projection when it skips one, and prints each skipped row on stderr as `[deep-review] warning...
  - Evidence: `rg -n "function readReviewFrontierStore|warnings: storeData.warnings|warning: skipped" .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` exit 0: 1908:function readReviewFrontierStore(storePath) { 2055: ...(Array.isArray(storeData?.warnings) && storeData.warnings.length > 0 ? { warnings: storeData.warnings } : {}), 3031: process.stderr.write(`[deep-review] warning: skipped ${warning.file} line ${warning.line}: ${warning.error}\n`);
- **L3-1** P2 literal `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/entry-points-and-modes/expansive-depth-flag-and-default-identity.md:59`: The Expected section says command 1 (`rg -n -- '--depth-mode' .skilled/commands/deep/research.md`) prints two lines. It prints three. The argument-hint at research.md line 3 also contains `--depth-mode=default|expansive`, along with the preflight binding at line 41 and the flag row at line 107. An operator who checks the line count would wrongly mark the step as failed.
  - Evidence: `rg -n -- '--depth-mode' .skilled/commands/deep/research.md | cut -c1-80` exit 0: 3:argument-hint: "&lt;topic&gt; [:auto|:confirm] [--spec-folder=PATH] [--max-iteration 41:&gt; - `depth_mode` (default `default` unless `--depth-mode=expansive` is pre 107:| `--depth-mode` | `default` \| `expansive` | `default`, the value when the
- **L3-2** P2 judgment `.skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/expansive-depth-mode.md:59`: The Source Files row for frontier-admit.cjs reads as a full list of what the script does: 'Seeds, admits and closes frontier nodes. Its `graph` command builds the frontier graph events through `buildFrontierGraphEvents`.' The script now accepts six commands: seed, admit, close, graph, block and budget (frontier-admit.cjs:1111-1112). The row leaves out the new `budget` command, which step_frontier_...
  - Evidence: `rg -n "expected seed, admit, close, graph, block or budget|command === 'budget'" .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs` exit 0: 1112: throw new Error(`unknown command: ...; expected seed, admit, close, graph, block or budget`); 1118: if (command === 'budget') return writeSeedBudget({ artifactDir, target });
- **L4-1** P2 judgment `.skilled/skills/system-deep-loop/deep-research/references/state/state-format.md:85`: The doc gives the reducer's frontier projection as `registry.frontier {nodes, stats, budget}`. The code also adds a `warnings` array when a frontier-nodes.jsonl row is torn and cannot be parsed. buildFrontierProjection adds it at deep-research/scripts/reduce-state.cjs:2473, and the reducer prints each skipped row on stderr as `[deep-research] skipped <file> line <n>: <error>` (reduce-state.cjs:341...
  - Evidence: `rg -n "warnings: frontierInput.warnings|console.warn\(`\[deep-research\] skipped" .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs` exit 0: 2473: ...(Array.isArray(frontierInput.warnings) && frontierInput.warnings.length > 0 ? { warnings: frontierInput.warnings } : {}), 3412: console.warn(`[deep-research] skipped ${warning.file} line ${warning.line}: ${warning.error}`);
- **L4-2** P2 judgment `.skilled/skills/system-deep-loop/deep-research/README.md:108`: The packet-file table lists four frontier files an expansive run writes: frontier-nodes.jsonl, frontier-seed.json, frontier-focus.txt and frontier-graph-events.json. It leaves out frontier-known-texts.json. step_frontier_admit writes that file in the research packet on every expansive iteration and passes it to `frontier-admit.cjs admit --known-texts` (deep-research.yaml:1848 and 1856).
  - Evidence: `rg -n "frontier-known-texts.json" .skilled/commands/deep/assets/deep-research.yaml` exit 0: 1848: array of strings to {artifact_dir}/frontier-known-texts.json holding every 1856: command: '... frontier-admit.cjs admit ... --known-texts "{artifact_dir}/frontier-known-texts.json"'
- **L4-3** P2 judgment `.skilled/skills/system-deep-loop/deep-research/references/state/state-format.md:81`: The Frontier Node Store paragraph lists every extra file an expansive run writes: frontier-seed.json, frontier-focus.txt and frontier-graph-events.json. It leaves out frontier-known-texts.json, the JSON array of known question texts that step_frontier_admit writes before each admission and passes as --known-texts (deep-research.yaml:1848 and 1856). (inferred)
- **L4-4** P2 judgment `.skilled/skills/system-deep-loop/deep-research/references/guides/quick-reference.md:107`: The state-file table lists frontier-nodes.jsonl, frontier-seed.json and frontier-focus.txt for an expansive run. It leaves out frontier-graph-events.json, which step_frontier_graph_upsert writes each iteration (deep-research.yaml:1899). It also leaves out frontier-known-texts.json, which step_frontier_admit writes each iteration (deep-research.yaml:1848). (inferred)
- **L4-5** P2 judgment `.skilled/skills/system-deep-loop/deep-research/SKILL.md:169`: The state-file list names only frontier-nodes.jsonl, frontier-seed.json and frontier-focus.txt as the extra files of an expansive run. The workflow also writes frontier-graph-events.json (step_frontier_graph_upsert, deep-research.yaml:1899) and frontier-known-texts.json (step_frontier_admit, deep-research.yaml:1848) in the research packet. (inferred)
- **L4-6** P2 judgment `.skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md:409`: The Expansive Depth Frontier section walks through the frontier steps: seed, block, admit, close and the fan-out deal. On the budget it says only that "the seed step prints the derived budget". It never names step_frontier_budget, the step that runs `frontier-admit.cjs budget` and writes the derived maxIterations into deep-research-config.json (deep-research.yaml:775-793). It also leaves out that ...
  - Evidence: `rg -n "frontier-admit.cjs budget" .skilled/commands/deep/assets/deep-research.yaml` exit 0: 788: command: 'node .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs budget --artifact-dir "{artifact_dir}"'
- **L4-7** P2 judgment `.skilled/skills/system-deep-loop/deep-research/references/guides/quick-reference.md:61`: The `--extend-minutes` row gives the new budget as `max(prior, elapsed) + M`, with M defaulting to the prior budget. That formula does not hold for a run with no duration budget. When the prior maxDurationMinutes is 0 and --extend-minutes is not passed, the extension keeps no budget (0) instead of setting it to the elapsed minutes. The code: `newMaxDurationMinutes = priorMaxDurationMinutes > 0 || ... (inferred)
- **L5-2** P2 literal `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/review-pivot-gates-on-terminal-frontier.md:31`: The Expected signals line says 'The four pivot cases pass.' The pivot describe block now holds five cases. The added case checks that a frontier seed whose free-text scope asks for a change is still rejected.
  - Evidence: `cd .skilled/skills/system-deep-loop/runtime && npx vitest run divergent-pivot.vitest -t "review divergent pivot under the expansive depth mode" | grep Tests` exit 0: Tests 5 passed | 23 skipped (28) (exit 0 is grep's status through the pipe)
- **L5-3** P2 literal `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md:615`: The DRV-081 summary says 'The four review pivot cases pass'. The review pivot describe block in divergent-pivot.vitest now holds five cases, and all five pass.
  - Evidence: `cd .skilled/skills/system-deep-loop/runtime && npx vitest run divergent-pivot.vitest -t "review divergent pivot under the expansive depth mode" | grep Tests` exit 0: Tests 5 passed | 23 skipped (28) (exit 0 is grep's status through the pipe)
- **L5-4** P2 literal `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/entry-points-and-modes/expansive-depth-flag-and-default-identity.md:59`: In the Expected section the doc says "Command 1 prints two lines: the preflight `depth_mode` binding note and the flag row." Command 1 is `rg -n -- '--depth-mode' .skilled/commands/deep/review.md`, and it prints three lines. The first is the frontmatter argument-hint on line 3, which contains `[--depth-mode=default|expansive]`. The other two are the binding note on line 41 and the flag row on line...
  - Evidence: `rg -n -- '--depth-mode' .skilled/commands/deep/review.md | cut -c1-120` exit 0: ...et> [:auto|:confirm] [--spec-folder=PATH] [--max-iterations=N] [--depth-mode=default|expansive] [ 41:> - `depth_mode` (default `default` unless `--depth-mode=expansive` is present) 100:| `--depth-mode` | `default` \| `expansive` | `default`, the value when the flag is absent, runs exactly as before.
- **L5-5** P2 judgment `.skilled/skills/system-deep-loop/deep-review/README.md:141`: The 'File under {spec_folder}/review/' table lists the files an expansive run adds: `frontier-nodes.jsonl` and `frontier-seed.json`. It leaves out `frontier-known-texts.json`. On every expansive iteration, step_frontier_admit writes that JSON array to {artifact_dir}/frontier-known-texts.json and passes it to `frontier-admit.cjs admit --known-texts`, so the file also sits in the review folder of an...
  - Evidence: `rg -n 'frontier-known-texts.json' .skilled/commands/deep/assets/deep-review.yaml` exit 0: 2020: JSON array of strings to {artifact_dir}/frontier-known-texts.json holding every 2026: command: 'node .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs admit --target review --artifact-dir "{artifact_dir}" ... --known-texts "{artifact_dir}/frontier-known-texts.json"'
- **L6-1** P2 literal `.skilled/skills/system-deep-loop/feature-catalog/deep-loop-mode-classification/depth-mode-flag.md:48`: The frontier-admit.cjs role row lists the CLI commands as seed, admit, close, block and graph. It leaves out the new `budget` command. runCli accepts six commands (frontier-admit.cjs:1110-1112), and `budget` routes to writeSeedBudget (frontier-admit.cjs:1118), which rewrites maxIterations in the config. Both workflows' step_frontier_budget calls it.
  - Evidence: `rg -n "expected seed, admit, close, graph, block or budget|command === 'budget'" .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs` exit 0: 1112: throw new Error(`unknown command: ...; expected seed, admit, close, graph, block or budget`); 1118: if (command === 'budget') return writeSeedBudget({ artifactDir, target });
- **L6-2** P2 literal `.skilled/skills/system-deep-loop/feature-catalog/deep-loop-mode-classification/depth-mode-flag.md:51`: The deep-research.yaml row says it owns step_frontier_seed and step_frontier_admit. The workflow also owns step_frontier_budget (deep-research.yaml:775), which runs `frontier-admit.cjs budget` (deep-research.yaml:788) to size a defaulted expansive budget from the seed.
  - Evidence: `grep -n "step_frontier_budget:\|frontier-admit.cjs budget" .skilled/commands/deep/assets/deep-research.yaml` exit 0: 775: step_frontier_budget: 788: command: 'node .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs budget --artifact-dir "{artifact_dir}"'
- **L6-3** P2 literal `.skilled/skills/system-deep-loop/feature-catalog/deep-loop-mode-classification/depth-mode-flag.md:52`: The deep-review.yaml row says it owns step_frontier_seed and step_frontier_admit. The workflow also owns step_frontier_budget (deep-review.yaml:930), which runs `frontier-admit.cjs budget --target review` (deep-review.yaml:943).
  - Evidence: `grep -n "step_frontier_budget:\|frontier-admit.cjs budget" .skilled/commands/deep/assets/deep-review.yaml` exit 0: 930: step_frontier_budget: 943: command: 'node .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs budget --target review --artifact-dir "{artifact_dir}"'
- **L6-4** P2 judgment `.skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:470`: The admission paragraph says what relevance includes ('a node's scope sitting inside a file-list review target'). It does not say that relevance now also prunes a proposal whose question, or any scope entry, is over 500 characters. Control characters are first replaced with spaces. An operator who sees a `relevance` prune on an in-target proposal gets no hint that length is the cause. Code: MAX_PR...
  - Evidence: `rg -n "MAX_PROPOSAL_TEXT_LENGTH = 500|isOverLength\(proposal.question\)|some\(isOverLength\)" .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs` exit 0: 54:const MAX_PROPOSAL_TEXT_LENGTH = 500; 583: if (isOverLength(proposal.question)) return 'relevance'; 584: if ((Array.isArray(proposal.scope) ? proposal.scope : [proposal.scope]).some(isOverLength)) return 'relevance';
- **L6-5** P2 judgment `.skilled/skills/system-deep-loop/deep-review/references/state/state-format.md:34`: The doc says an expansive run 'adds two more' state files, frontier-nodes.jsonl and frontier-seed.json, and the table (lines 47-48) lists only those two. step_frontier_admit also writes {artifact_dir}/frontier-known-texts.json before every admission and passes it as --known-texts (deep-review.yaml:2019-2026). No step deletes it, so an expansive run leaves a third file, the per-iteration dedupe inp...
  - Evidence: `grep -n "frontier-known-texts" .skilled/commands/deep/assets/deep-review.yaml` exit 0: 2020: JSON array of strings to {artifact_dir}/frontier-known-texts.json holding every 2026: command: '... frontier-admit.cjs admit --target review ... --known-texts "{artifact_dir}/frontier-known-texts.json"'
- **L6-6** P2 judgment `.skilled/skills/system-deep-loop/deep-review/references/state/state-outputs.md:44`: The state-output table lists frontier-nodes.jsonl and frontier-seed.json as the expansive-only outputs. It leaves out frontier-known-texts.json, which step_frontier_admit writes to the artifact dir on every expansive iteration as the --known-texts input and never removes (deep-review.yaml:2019-2026).
  - Evidence: `grep -n "frontier-known-texts" .skilled/commands/deep/assets/deep-review.yaml` exit 0: 2020: JSON array of strings to {artifact_dir}/frontier-known-texts.json holding every 2026: command: '... --known-texts "{artifact_dir}/frontier-known-texts.json"'
- **L7-1** P2 literal `.skilled/skills/system-deep-loop/runtime/feature-catalog/script-entry-points/frontier-admit-script.md:42`: The doc says readNodeStore 'skips a torn or malformed line, reports its file and line on stderr'. That holds only for a line that fails to parse as JSON (frontier-admit.cjs:283-287). A line that parses but is not a plain object, or has no nodeId, is skipped with no warning (frontier-admit.cjs:289). Line 38 of the same doc gets this right. Line 42 overstates it.
  - Evidence: `store lines: valid node, '{not json', '{"depth":1}'; node -e 'require("./scripts/frontier-admit.cjs").readNodeStore(...)'` exit 0: [frontier-admit] warning: skipped frontier-nodes.jsonl line 2: Expected property name or '}' in JSON at position 1 (line 1 column 2) 1
- **L7-2** P2 judgment `.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/script-entry-points/frontier-admit-script.md:65`: Command 1 is 'cd .skilled/skills/system-deep-loop/runtime && npx vitest run ...'. Commands 2 to 5 then use the repo-root path 'node .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs'. An operator who runs them in order in one shell is still inside runtime/ after command 1, so commands 2 to 5 fail with module-not-found. The playbook does not say that each command starts from the r... (inferred)
- **L7-3** P2 judgment `.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/fanout/fanout-expansive-lineage-budget.md:50`: Same working-directory problem as L7-2. Command 1 cds into .skilled/skills/system-deep-loop/runtime. Command 2, 'rg -n ... .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs', uses a repo-root path, so in the same shell it finds no file and prints nothing instead of the expected default of 12 and the two function names (the code itself is at fanout-run.cjs:339, 356 and 677). (inferred)

## Findings outside the scope

A lane or the critic reported these on files that are not in scope.json, so they are not attributed to this range. "merged-in" means the file changed between the merge base and the head only through a merge the first-parent scope leaves out; "unchanged in range" means the range never touched it, which is usually a cause a lane traced from an in-scope change. "pre-existing (critic)" means the critic showed the finding predates the scope, whatever file it names. A finding here can still block CI; its severity stands.

None.

## Overturned by the critic

The critic refuted these or showed they repeat another finding, so they are left out of every count above. Each keeps the severity its lane gave it.

None.

## Probes awaiting the critic

None.

## Files no lane reviewed

None.

