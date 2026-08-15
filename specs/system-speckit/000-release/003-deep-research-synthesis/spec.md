# Phase 003 — Deep-Research Synthesis (seeded depth layer)

> Charter only. Full narrative in `../plan.md` §4 Phase 3 + §5. Deep-research state lands here.

## Goal

Cross-cutting synthesis the per-packet spine can't produce: the through-line of the skill-model
refactor, the deep-loop unification narrative, repo-wide breaking changes, migration surprises.

## Run config

- Workflow: `/deep:research` (do NOT hand-roll; read its SKILL.md first).
- Seed: `001-context-pack/context-pack.md` + packet worklist (`../plan.md` §3).
- Iterations: ~100, **no early convergence**.
- Executors: **GLM 5.2 high (cli-devin)** synthesis/depth; **DeepSeek V4 Flash (opencode-go pi)** breadth.
- State: `deep-research-state.jsonl`, `deltas/`, `logs/` under this folder.

## Gate before touching runtime

"Gather context re: all changes" = first verify `/deep:research` accepts a context seed / scope
pack. If yes → feed the seed, change no code. If not → minimal reversible change in its OWN
Gate-3 packet under `system-deep-loop`. (PLAN-WORKFLOW LOCK; see `../plan.md` §5.)

## Prerequisites

- Read `/deep:research`, `cli-devin`, `cli-opencode`/pi SKILL.md contracts first.
- opencode/pi fan-out env fix wired up front (§6).

## Exit criteria

- Themed synthesis covering all 8 sections + a breaking-changes cross-cut.
- No unseeded blind iteration (all iterations reference the pack/worklist).
