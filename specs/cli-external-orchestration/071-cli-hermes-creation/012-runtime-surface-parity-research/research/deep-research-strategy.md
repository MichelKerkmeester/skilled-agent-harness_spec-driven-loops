---
title: "Deep-Research Strategy: runtime surface parity across the seven runtimes"
trigger_phrases:
  - "runtime surface parity research"
  - "devin commands gap"
---
# Deep-Research Strategy: runtime surface parity across the seven runtimes

> One lineage, `deepseek-v4.1-flash` at max via cli-pi, ten iterations, stop policy max-iterations. Convergence before iteration 10 is telemetry only: broaden the angle, never synthesize early. Research only: write nothing outside this folder's `research/` tree.

## Objective

The repo authors commands, agents, skills, goal state and hooks once and mirrors them into each runtime's dotfolder. The mirrors have drifted, and one runtime has no command surface at all. Map every surface against every runtime, find each gap, decide which gaps are real versus correct-by-nature, and produce a ranked, phase-ready plan. Every recommendation names the file and generator it changes, the gap it closes, the test that proves it, and what it costs.

## Confirmed starting facts, not to be re-derived

Counted live in the commissioning session. Treat as given; contradicting evidence is a finding.

1. `.opencode/commands` holds 46 authored markdown command files. The mirrors hold: Claude 33, Codex 33, Cursor 35, Pi 35, Hermes 33, **Devin 0**. Devin has no `commands/` or `prompts/` directory at all.
2. Skills mirrors: Claude 14, Pi 14, Hermes 68, and **zero** for Devin, Cursor and Codex.
3. Agents: all seven runtimes carry an `agents/` directory. `.opencode/agents` is the authored source.
4. Goal adapters exist under `.opencode/hooks/goal/` for cursor, devin, opencode and pi only. Claude Code uses its native goal command, Hermes binds through the repo plugin's session-start hook. Codex has no adapter identified.
5. Every runtime dotfolder carries `SYNC.md` except `.opencode`, which is the source.
6. Hermes proved that a mirror's shape is runtime-constrained: a whole-tree symlink triggered its security scanner for ten minutes and quarantined every skill, so it ships generated markdown-only copies instead. A parity recommendation must respect each runtime's own loader.

## Subject

Read in this order, and cite by line:

- every runtime's `SYNC.md`, which states what that runtime mirrors and by which mechanism
- `.opencode/commands/**` (the authored source) and each mirror directory
- the sync generators under `.opencode/skills/system-spec-kit/runtime/cli/`, including the Hermes prompt and skill generators and their `--check` drift modes
- `.opencode/hooks/goal/` (`bin/`, `lib/`, and the per-runtime adapters), plus the Hermes binding in `.hermes/plugins/repo-guards/__init__.py`
- `.devin/` in full: `SYNC.md`, `hooks.v1.json`, `hooks/`, `config.local.json`, `mcp_config.json`
- `.opencode/skills/cli-external-orchestration/cli-devin/` for what the Devin CLI actually supports
- the per-runtime hook directories under `.opencode/hooks/**`

## Angles, one per iteration

| Iteration | Angle | Question the iteration must close |
|---|---|---|
| 1 | Command census | Build the exact matrix: each of the 46 authored commands against each of the six mirrors, marking present, absent or renamed. Explain every count difference (why 33 versus 35 versus 46) as either a deliberate exclusion rule or drift. Name the generator that produces each mirror and whether it has a `--check` mode. |
| 2 | Devin command surface | What does the Devin CLI actually load: slash commands, prompt files, a template flag, nothing? Cite the CLI reference and the installed binary's help. Decide whether a Devin command mirror is loadable at all, and if it is, what shape it must take. If it is not, say what the equivalent affordance is and what it costs. |
| 3 | Skills surface | Why do Devin, Cursor and Codex carry no skills mirror? For each, determine whether the runtime has a skill loader at all, whether the repo could feed it, and whether the absence is correct by nature or an unclosed gap. Cite each runtime's own loading contract. |
| 4 | Goal parity | For all seven runtimes, state how a packet goal reaches a session, by which file and hook, and what happens when it does not. Identify the runtimes with no path and decide whether each needs an adapter, a native equivalent, or nothing. Include what a missing adapter costs an operator mid-session. |
| 5 | Agents parity | Verify the agents mirrors are actually in sync with the authored source, not merely present. Name the gate that keeps them in sync and whether it covers every runtime. Report any runtime whose agent files have drifted, with the diff shape. |
| 6 | Generator coverage | Which mirrors are generated and which are hand-maintained? For each generated one, does a `--check` drift mode exist and is it wired into a gate that runs? For each hand-maintained one, estimate the drift already present and what a generator would cost to write. |
| 7 | Hook parity | Inventory the repo's hook packages against each runtime's hook surface. Which packages reach which runtimes, which are runtime-specific by nature, and which are simply unported? Reconcile this against the Hermes hook-parity work, which already answered the question for one runtime. |
| 8 | What Devin can carry | Read `.devin/` in full and the Devin CLI contract. Enumerate every repo-carriable surface Devin supports and every one it does not, with the config file or flag that proves each. This is the boundary any Devin parity work must respect. |
| 9 | Drift detection | Is there a single gate that would notice a runtime falling behind on any surface? If several partial gates exist, name each and its blind spot. Propose the cheapest detector that would have caught the Devin command gap, and say what it would cost to run on every commit. |
| 10 | Synthesis | Rank every recommendation from iterations 1 to 9 by (operator impact x confidence) / cost. Group into: do now, do next, do not, each row citing `file:line`. Then propose the phase decomposition: for each phase a name, a one-line scope, its dependencies, and the gate that closes it. This is the plan the operator will scaffold from. |

## Evidence discipline

- Confirm by reading. Mark an inferred claim as inferred and say what would confirm it.
- Maximum twelve tool calls per iteration. No sub-dispatch. No writes outside `research/`.
- Never run `generate-context.js`, `validate.sh`, or any `git` write, checkout or commit.
- A recommendation without a `file:line` citation is not a finding.
- A gap is only a gap once the runtime's own loader is shown to support the surface. Absence that the runtime cannot load is a correct absence, and saying so is a finding.

## Deliverables in `research.md`

1. The command matrix from iteration 1, plus the rule explaining every exclusion.
2. A surface parity table: runtime by surface, with present, absent-correct, or absent-gap per cell.
3. The Devin boundary from iteration 8: what it can and cannot carry, with proof per row.
4. The ranked recommendation list from iteration 10.
5. The proposed phase decomposition, ready to scaffold.
