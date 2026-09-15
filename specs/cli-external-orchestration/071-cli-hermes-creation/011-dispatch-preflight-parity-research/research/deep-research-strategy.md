---
title: "Deep-Research Strategy: dispatch preflight parity and the Hermes caveat fixes"
trigger_phrases:
  - "dispatch preflight parity research"
  - "cli hard rule severity audit"
---
# Deep-Research Strategy: dispatch preflight parity and the Hermes caveat fixes

> One lineage, `deepseek-v4.1-flash` at max via cli-pi, ten iterations, stop policy max-iterations. Convergence before iteration 10 is telemetry only: broaden the angle, never synthesize early. Research only: write nothing outside this folder's `research/` tree.

## Objective

The dispatch preflight is the only surface that can force a correct `cli-*` dispatch. Four defects and two coverage gaps are already confirmed in it. Find every remaining defect, gap and open question, with `file:line` citations, and produce a ranked, phase-ready plan. Every recommendation names the file and function it changes, the failure it prevents, the test that proves it, and what it costs.

## Confirmed starting facts, not to be re-derived

These were verified live in the session that commissioned this research. Treat them as given and build on them. Contradicting evidence is a finding; re-proving them is a wasted iteration.

1. `evaluate()` maps a rule declared `severity: error` to a blocking violation and everything else to advisory. A `warn` rule never denies a dispatch.
2. Three `cli-hermes` rules block: availability, the write-toolset approval rule, the worktree ban. Five only warn, including the two below.
3. `hermes-explicit-toolsets-required` requires an explicit `-t` list excluding `delegation` and `memory`. It does not require `file`, so `-t search,todo` passes the check and then cannot read any file, exiting 0 with empty stdout.
4. `hermes-ignore-rules-required` exempts a command carrying `-s`, on the stated grounds that `--ignore-rules` suppresses the skill preload. That is false: a live A/B under `--ignore-rules` with only the `todo` toolset answered from preloaded skill text with `-s` and returned NO PRELOAD without it. The exemption therefore lets a preloading dispatch pull `SOUL.md`, memories and session search into the leaf.
5. The lint's own test asserts the exemption produces zero violations, so the test encodes the wrong behavior and must flip with the fix.
6. `AGENTS.md` carries exactly one `U+200D` joiner, in the section 7 heading emoji. Hermes's context scanner blocks the whole file on it. Removing the joiner clears the scan. There is no config knob.
7. The Claude, Codex, Devin and Pi runtimes carry a dispatch preflight adapter. Cursor carries only a post-tool-use file and OpenCode only an audit file, so neither blocks before the command runs.
8. `fanout-run.cjs` wires the Hermes read-only and spec-folder variables but not the persona variable.

## Subject

Read in this order, and cite by line:

- `.opencode/hooks/dispatch/lib/dispatch-rule-checks.mjs` (the check registry, `parseHardRules`, `evaluate`)
- `.opencode/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` (the cases that pin current behavior)
- `.opencode/hooks/dispatch/claude/dispatch-preflight-lint.mjs`, and the `codex/`, `devin/`, `pi/` siblings
- `.opencode/hooks/dispatch/cursor/post-tool-use.mjs`, `.opencode/hooks/dispatch/opencode/cli-dispatch-audit.js`
- `.opencode/hooks/dispatch/lib/dispatch-audit.mjs`, `.opencode/hooks/dispatch/README.md`
- every `hard_rules:` block under `.opencode/skills/cli-external-orchestration/cli-*/SKILL.md`
- `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` (the Hermes and Pi lineage builders)
- `.hermes/plugins/repo-guards/__init__.py` (the in-Hermes dispatch preflight bridge)
- the runtime hook registrations in `.claude/settings.json`, and the equivalents each other runtime uses

## Angles, one per iteration

| Iteration | Angle | Question the iteration must close |
|---|---|---|
| 1 | Severity audit | Inventory every `hard_rules:` entry across all seven `cli-*` skills with its severity and whether its check can actually detect the violation. Which `warn` rules describe a condition that silently ruins a run and therefore belong at `error`? Two skills declare no `error` rule at all: is that correct for them, or an oversight? Produce the full table with a recommended severity per rule and the reason. |
| 2 | The exemption defect | Trace every artifact that encodes the false preload claim: the check, the rule message, the test, the skill prose, any reference or playbook scenario, and the upstream source comment. Give the minimal correct change per artifact and the exact test case that must flip. Name any second rule resting on the same false premise. |
| 3 | Check completeness | For each `cli-*` runtime, enumerate the dispatch mistakes that produce a silent wrong result rather than an error: a missing read toolset, a wrong provider, a model outside the allowlist, a missing stdin redirect, a budget shorter than the work. Which are detectable from the command string alone? Write the check predicate for each detectable one. |
| 4 | Cursor parity | What pre-execution hook surface does the Cursor runtime actually expose in this repo, and what does its existing post-tool-use file do? Can a preflight adapter exist there, and if so what is the smallest one that reuses the shared check library unchanged? If no pre-execution surface exists, what is the next-best enforcement point and what does it cost in detection latency? |
| 5 | OpenCode parity | Same question for OpenCode, whose extension surface is a plugin rather than a hook file. Determine whether its plugin API can deny a Bash tool call before execution, cite the API, and give the smallest adapter. Compare against what its current audit file already collects. |
| 6 | Shared-library integrity | Is every `check:` named in a `cli-*` SKILL.md implemented in the registry, and is every registry check reachable from some skill? Name orphans in both directions. Does any adapter drift from the shared library by re-implementing severity, dispatch-shape detection or rule parsing locally? Quantify the drift risk and propose one guard that would catch it in CI. |
| 7 | Hermes reachability | Measure the actual character cost of the four plugin prompt sections against Hermes's per-section and total caps, and state the remaining headroom as a number. Decide whether a repo-rules digest section is worth that headroom versus simply naming the file in the dispatch prompt. Separately, confirm what else in the repo would break if the section 7 heading emoji changed, including doc validators and byte-drift checks. |
| 8 | Programmatic wiring | For every executor the fan-out runner builds, list the environment and flags the runtime needs that the builder does not currently set, Hermes persona first. Which of these belong in the builder rather than in a prompt rule, and what does each cost to add? Include the test each addition needs. |
| 9 | Fail-open posture | Every preflight approves on any internal error. Enumerate the failure paths that silently disable enforcement: a missing skill file, a parse failure, an unregistered hook, a renamed adapter, a drift sentinel. For each, say whether the operator would ever notice, and propose the cheapest detector for the ones they would not. |
| 10 | Synthesis | Rank every recommendation from iterations 1 to 9 by (failure severity x confidence) / cost. Group into: do now, do next, do not, each row citing `file:line`. Then propose the phase decomposition: for each phase a name, a one-line scope, its dependencies, and the gate that closes it. This is the plan the operator will scaffold from. |

## Evidence discipline

- Confirm by reading. Mark an inferred claim as inferred and say what would confirm it.
- Maximum twelve tool calls per iteration. No sub-dispatch. No writes outside `research/`.
- Never run `generate-context.js`, `validate.sh`, or any `git` write, checkout or commit.
- A recommendation without a `file:line` citation is not a finding.

## Deliverables in `research.md`

1. The full severity table from iteration 1, one row per rule across all seven skills.
2. A defect table: what is wrong, the line, the fix, the test that proves it.
3. A parity table for Cursor and OpenCode: surface available, adapter shape, cost, detection latency.
4. The ranked recommendation list from iteration 10.
5. The proposed phase decomposition, ready to scaffold.
