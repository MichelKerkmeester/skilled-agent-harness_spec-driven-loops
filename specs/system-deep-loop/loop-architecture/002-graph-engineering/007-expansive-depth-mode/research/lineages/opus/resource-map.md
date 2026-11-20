---
title: "Resource Map — What changes would make the deep-loop fan-out orchestration trustworthy and identical across CLI runtimes, ranked by value over effort, given what the last two expansive dogfood runs taught? Read the code at HEAD b8003a7df42. The spec folder is specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode (SPEC below). Inputs: SPEC/scratch/dogfood-review-gen2.md and SPEC/scratch/dogfood-research-gen3.md (the conductor logs of the previous fan-out review and research), and the previous research with its improvement-backlog.md, now the newest folder under SPEC/research_archive/. Commits adade6c293e..07cf5f92b61 built backlog rows 1-11, 14, 16b, 18a and 19-26: build on them and do not re-report them. Every recommendation names one concrete change, cites file:line (or a source URL for prior art), and states value, effort (S/M/L) and risk. Q1 Lineage honesty: one lineage wrote 9 of 12 review passes 20-60 s apart, most with zero findings, and reported newInfoRatio 1.0 on all 10 research passes; model-written timestamps were placeholders, whole minutes or future-dated. Which runner-side signals (pass duration, cited locations, tool calls, repeated sources, gateway receipt time) would detect an unexamined pass or a false stamp without trusting the model, and how should convergence and fanout-merge.cjs weigh such a pass? Q2 Cross-CLI execution contract: across native, cli-claude-code, cli-opencode, cli-codex, cli-pi, cli-devin, cli-cursor, cli-deepseek-harness and cli-mistral-vibe, where do permission and sandbox, effort, output format (cli-claude-code still uses --output-format text, so it reports no tokens or cost), session resume, failure classes, log shape and prompt channel still differ in fanout-run.cjs LINEAGE_COMMAND_ADAPTERS, runtime/lib/deep-loop/executor-config.ts and dispatch-iteration.cjs (runClaude, runCodex)? What single adapter contract and conformance test would remove the differences, including the agent and command mirrors (.claude .codex .pi .dsh .vibe .opencode against .skilled)? Q3 Orchestration robustness: process tree and kill semantics (the runner re-executes itself, so killing the runner pid misses the lineage CLIs), mid-run provider quota and --only-lineage reruns, re-entrancy, the ledger as the only live view, capability-aware dealing of frontier nodes (a web question to a lineage with web tools) and a root dashboard for a fan-out. Q4 Frontier economics: the node cap and growth slots (5 of 7 proposals pruned at iteration 1 last run), the depth-band split, duplicate work, and whether and in which order to build the held backlog rows 12 (one projectFrontier), 13 (one executor path), 29 (alias and dead-probe deletion) and 30 (per-node research dashboard). Q5 Prior art: how multi-agent orchestrators and eval harnesses (for example Inspect eval sets, OpenHands, LangGraph, the Claude Agent SDK, AutoGen) verify worker honesty, normalize heterogeneous executors and rerun partial failures. This is the only question that needs the web; cite source URLs, and never put personal data such as an email address in a search query or request. Q6 Bookkeeping that fires on a healthy run: the synthesis_incomplete alarm when a finding is refined into an earlier id (runtime/scripts/synthesis-closeout.cjs:373), the research commit step that fails on an ignored pathspec exclude (deep-research.yaml:2158), the closeout lineageId taken from the parent session, and any other invariant or warning this run shows firing without a real fault. Report only: change no code or doc outside your own lineage directory."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 28
- **By category**: READMEs=0, Documents=0, Commands=2, Agents=1, Skills=14, Specs=11, Scripts=0, Tests=0, Config=0, Meta=0
- **Missing on disk**: 0
- **Scope**: research convergence output for 007-expansive-depth-mode
- **Generated**: 2026-11-20T13:16:32.771Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 3. Commands

> `.skilled/commands/**` and any runtime-specific command surfaces.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/commands/deep/assets/deep-research.yaml | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs | Cited | OK | Citations=1; Iterations=1 |

---

## 4. Agents

> `.skilled/agents/**`, `.claude/agents/**`, `.skilled/agents/**`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .claude/agents/deep-research.md | Cited | OK | Citations=1; Iterations=1 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/lib/deep-loop/lineage-timestamp-window.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-deep-loop/runtime/lib/result-envelopes/legacy-shadow.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs | Cited | OK | Citations=4; Iterations=4 |
| .skilled/skills/system-deep-loop/runtime/scripts/fanout-salvage.cjs | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-deep-loop/runtime/scripts/status.cjs | Cited | OK | Citations=1; Iterations=1 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research_archive/20261120T125555Z/lineages/deepseek/deep-research-state.jsonl | Cited | OK | Citations=1; Iterations=1 |
| specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research_archive/20261120T125555Z/lineages/deepseek/iterations/iteration-001.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research_archive/20261120T125555Z/lineages/deepseek/logs/fanout-lineage.out | Cited | OK | Citations=1; Iterations=1 |
| specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research/lineages/opus/.executor-state/calibrate.cjs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research/lineages/opus/.executor-state/honesty-probe.cjs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research/orchestration-status.log | Cited | OK | Citations=1; Iterations=1 |
| specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/review/fanout-config-recovery.json | Cited | OK | Citations=1; Iterations=1 |
| specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/review/lineages/deepseek/deep-review-state.jsonl | Cited | OK | Citations=2; Iterations=2 |
| specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/review/lineages/deepseek/logs/fanout-lineage.out | Cited | OK | Citations=1; Iterations=1 |
| specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/scratch/dogfood-research-gen3.md | Cited | OK | Citations=3; Iterations=3 |
| specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/scratch/dogfood-review-gen2.md | Cited | OK | Citations=1; Iterations=1 |

---
