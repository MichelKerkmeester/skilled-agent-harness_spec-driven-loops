# Research: Loop-Systems Improvement Backlog (mined from loop-cli-main + kasper)

> Ranked, deduplicated, actionable improvement backlog for OUR deep-loop systems, synthesized from a 51-iteration deep-research run that mined two vendored reference codebases.
> Reference paths below are relative to the packet root `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/`, i.e. `external/loop-cli-main/...` and `external/kasper/...`. OUR target paths are repo-absolute from `.opencode/`.

---

## 1. Executive Summary

Across 51 proper iterations we mined `external/loop-cli-main` (a TS daemon+CLI cadence runner: pause/resume/stop state machine, persisted remaining-delay crash-resume, abortable chunked sleep, force-trigger, byte-offset log slicing, fixed-rate overrun catch-up, socket single-flight, typed IPC, `/ob-autopilot` + WAVE MODEL) and `external/kasper` (an opencode observe→evaluate→improve→measure loop: causal score-delta, LLM-judge hardening, observation-threshold/decay/rejected-cache convergence, fuzzy finding-merge, atomic state with lock+merge+integrity, stuck-watchdog, provenance-stamped reversible mutation, layered config + sparkline UX). ~221 raw findings (476 registry rows incl. graph nodes) consolidate to **40 distinct backlog items**.

Headline opportunities, by theme:
- **Resilience** — persisted-wait crash-resume, abortable sleep primitive, atomic-state serialize-diff + debounced writer + SHA-256 integrity, lock-held JSONL read-merge-write, loop-lock heartbeat hardening + optional socket single-flight, stall-watchdog abort/requeue.
- **Convergence quality** — current-vs-prior score-delta ("looping without improving"), observation-threshold actionability guard, time-decay evidence weighting, fuzzy finding-merge, anti-convergence floors (`minIterations`/`convergenceMode`), and a unified convergence-profile ADR.
- **Observability / UX** — dashboard sparkline + in-progress banner, single-loop telemetry heartbeat, one unified observability event envelope, byte-offset transcript regions, run-now sentinel, loop-wide dry-run.
- **Safety / automation** — typed outcome-routed fallback, per-iteration memory upsert, speckit unattended/autopilot (branch-preserved clean-failure), deep-improvement candidate-accepted-vs-shipped split, meta-loop self-improvement packaging.
- **Interconnection** — advisor routing projection generated from `mode-registry.json` + published `workflowMode`, code-graph→coverage-graph init bridge.
- **Testing** — hermetic HOME/temp-dir isolation (the dependency floor for every state/lock/fan-out change) and a record-replay cassette harness for convergence regression.

The biggest leverage sits where a cheap change touches core resilience/convergence/observability: serialize-diff + integrity helpers, score-delta, observation-threshold, sparkline, hermetic tests, heartbeat hardening.

---

## 2. Method

51 proper iterations (completion gate `proper_count >= 50`, cap 58), executor cli-codex gpt-5.5 xhigh fast, per-iteration budget 12 tool calls / 10 min. Anti-convergence was enforced by **segment progression** (S1 mine loop-cli → S2 mine kasper → S3 map→runtime → S4 map→workflows/speckit → S5 cross-cutting → S6 synthesis), a **novelty monitor** injecting fresh angles, **dimension rotation** (D1 source-mining / D2 target-mapping / D3 cross-cutting / D4 synthesis), and **wildcards** (W-06 record-replay, W-10 meta-loop); convergence was a trigger to broaden, never to stop — **zero early stops** (final convergenceScore 0.66, terminated on the proper-count gate). This is **research only**: every backlog item below becomes its own follow-up implementation spec — none of these are implemented here, and each carries a difficulty/risk tag rather than an approved design.

---

## 3. Top Quick-Wins (ranked ~15)

Easy/med + high-leverage. Ranked by leverage × low-cost, with resilience/convergence/observability weighted highest.

| Rank | Improvement | OUR target file | Reference evidence | Difficulty | Why it matters |
|---|---|---|---|---|---|
| 1 | Hermetic test isolation (`HOME`/temp-dir + child env) | `.opencode/skills/deep-loop-runtime/tests/helpers/spawn-cjs.ts` | `external/loop-cli-main/src/config/paths.ts:5-8`; `tests/background-cli.test.ts:13-23` | easy/quick-win | Dependency floor: every state/lock/crash-resume/fan-out change needs hermetic tests first (iter 42). |
| 2 | atomic-state serialize-diff (write-only-on-change) | `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts` | `external/loop-cli-main/src/daemon/manager.ts:23,279,281` | easy/quick-win | Suppresses duplicate whole-snapshot rewrites across reducers/fan-out without per-caller hacks (iter 8). |
| 3 | atomic-state SHA-256 integrity helpers (`stamp`/`verify`, warn-first) | `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts` | `external/kasper/src/state.ts:150-177,1048-1059`; `CHANGELOG.md:34-35` | easy/quick-win | Detects registry/config tamper between iterations on resume; tiny surface (iters 19, 43). |
| 4 | Abortable chunked sleep primitive (new `sleep.ts`, `SLEEP_CHUNK_MS`) | `.opencode/skills/deep-loop-runtime/lib/deep-loop/sleep.ts` | `external/loop-cli-main/src/shared/sleep.ts:1`; `src/config/constants.ts:13` | easy/quick-win | One cancellation-safe wait primitive instead of scattered `setTimeout` cleanup; enables crash-resume/backoff (iter 2). |
| 5 | Convergence score-delta / improvement-effect signal | `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs` | `external/kasper/src/evaluate.ts:308,319,345`; `src/state.ts:378,381`; `handlers.ts:283-292` | easy-med/quick-win | Detects "novel but not getting better"; `momentum` is one snapshot behind today (iters 9, 22). |
| 6 | Observation-threshold actionability guard (`min_observations`, default 2) | `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs` | `external/kasper/src/types.ts:48`; `config.ts:46`; `evaluate.ts:1657,1675,1682` | easy-med/quick-win | Blocks STOP/auto-promote on single-confirmation evidence; record but don't act (iter 11). |
| 7 | Dashboard sparkline + trend (newInfoRatio / score history) | `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs` | `external/kasper/src/utils.ts:172-184`; `handlers.ts:262-270` | easy/quick-win | Makes "novelty decaying / flatlining / recovery spike" visible at a glance; pure reducer change (iters 34, 42). |
| 8 | Loop-lock heartbeat cadence hardening (owner-scoped driver) | `.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts` | `external/loop-cli-main/src/core/loop-controller.ts:266,333,451`; `manager.ts:257` | easy/quick-win | `refreshLoopLock` exists but no caller during long dispatch → live-but-slow loop wrongly judged stale (iters 17, 47). |
| 9 | Time-decay half-life evidence weighting (`0.5^(ageDays/decayDays)`) | `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts` | `external/kasper/src/state.ts:74,79,82`; `config.ts:227` | med/quick-win | Old FINDING/SOURCE nodes stop counting full convergence force → prevents premature stop (iter 12). |
| 10 | Anti-convergence floor (`minIterations` + `convergenceMode:"off"`) + YAML guard | `.opencode/skills/deep-loop-workflows/deep-research/assets/deep_research_config.json`; `.opencode/commands/deep/assets/deep_research_auto.yaml` | `external/kasper/src/config.ts:46`; `external/loop-cli-main/src/loop-config.ts:22-32` | med/quick-win | First-class "don't stop too early" — exactly this run's anti-convergence need, encoded in config (iters 26, 27). |
| 11 | Typed outcome-routed fallback + route-trace + preflight | `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts` | `external/loop-cli-main/src/core/loop-controller.ts:394,444`; `external/kasper/src/evaluate.ts:1689,1733` | med/quick-win (deep for multi-hop) | Failed executor routes to a typed next-hop by failure kind, with auditable trace, not a flat retry (iters 7, 23). |