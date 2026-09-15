# Deep-Research Dashboard (lineage `deepseek`)

> Auto-generated view of `deep-research-state.jsonl`. Agent-authored edits here are discarded on refresh.

## Run

| Field | Value |
|---|---|
| Topic | Runtime surface parity across the seven runtimes: commands, skills, agents, goal and hooks |
| Session | `fanout-deepseek-1789487610012-kymuxs` |
| Executor | `cli-pi` / `deepseek-v4.1-flash` / max |
| Stop policy | `max-iterations` (10) |
| Convergence threshold | 0.05 (telemetry only in this lineage) |
| Resource map | absent — coverage gate skipped |

## Iteration Table

| # | Focus | Status | Findings | newInfoRatio |
|---|---|---|---|---|
| 1 | Command census | complete | 9 | 0.90 |
| 2 | Devin command surface | complete | 8 | 0.85 |
| 3 | Skills surface | complete | 9 | 0.80 |
| 4 | Goal parity | complete | 7 | 0.75 |
| 5 | Agents parity | complete | 8 | 0.85 |
| 6 | Generator coverage | complete | 8 | 0.90 |
| 7 | Hook parity | complete | 7 | 0.80 |
| 8 | Devin boundary | complete | 7 | 0.85 |
| 9 | Drift detection | complete | 7 | 0.85 |
| 10 | Synthesis | complete | 26 | 0.95 |

## Question Status

| # | Question | State |
|---|---|---|
| 1 | Command matrix / exclusion rule | **answered** (iteration 1) |
| 2 | Devin command surface | **answered** (iteration 2) — no loader; mirror was skill-shaped and operator-retired |
| 3 | Skills surface for Devin/Cursor/Codex | **answered** (iteration 3) — Devin/Cursor/Codex correct by nature; Hermes 61/68 loadable |
| 4 | Goal parity | **answered** (iteration 4) — full: OpenCode/Pi; injection-only: Cursor/Devin; Hermes undocumented; Claude/Codex host-native |
| 5 | Agents mirror sync | **answered** (iteration 5) — in sync under a token-set gate; semantic drift invisible; Pi ungated |
| 6 | Generator coverage and gate wiring | **answered** (iteration 6) — 4 unwired `--check` modes; hook configs are generated, not hand-authored |
| 7 | Hook parity | **answered** (iteration 7) — no unported hooks; Pi's layer is hand-authored with no checker |
| 8 | What Devin can carry | **answered** (iteration 8) — boundary enumerated with proof; hook mirror 21/21 verified |
| 9 | Drift detection | **answered** (iteration 9) — no single gate; coverage assertion is the cheapest detector |
| 10 | Ranked recommendations + phases | **answered** (iteration 10) — R1–R7 do now, R8–R12 do next, D1–D7 do not; P1–P6 |

## Convergence Trend

| Iter | newInfoRatio | Rolling |
|---|---|---|
| 1 | 0.90 | 0.90 |
| 2 | 0.85 | 0.88 |
| 3 | 0.80 | 0.85 |
| 4 | 0.75 | 0.82 |
| 5 | 0.85 | 0.83 |
| 6 | 0.90 | 0.84 |
| 7 | 0.80 | 0.84 |
| 8 | 0.85 | 0.84 |
| 9 | 0.85 | 0.84 |
| 10 | 0.95 | 0.85 |

No stop candidate. This lineage will not stop before iteration 10 regardless of the ratio trail.

## Dead Ends

- Mirroring the 35 commands into `.devin/commands/`: no Devin loader consumes a command tree, and
the retired mirror was `.devin/skills/<cmd>/SKILL.md` (iterations 1–2).
- Adding `.cursor/skills/` (user-level, Cursor-managed) — iterations 3.
- Adding goal adapters for Cursor/Devin management (host identity limit) — iteration 4.
- Automating semantic agent-body comparison (needs a reviewer, not a score) — iteration 5.
- A `.codex/config.toml` generator (no clean merge analogue) — iteration 6.
- A Pi hook-drift checker ranked as a *parity* fix rather than a detection improvement — iteration 7.

## Blocked Stops

None. No recovery was required; no iteration failed a guard or hit a stuck condition.

## Next Focus

**Complete.** Stop reason: `maxIterationsReached` (10/10). Synthesis in `research.md`; evidence index in
`resource-map.md`.

## Outcome Summary

| Metric | Value |
|---|---|
| Iterations completed | 10 / 10 |
| Stop reason | `maxIterationsReached` |
| Average newInfoRatio | 0.85 (trend 0.90 → 0.95) |
| Angle questions closed | 10 / 10 |
| Sub-questions left open with confirming checks | 6 |
| Charter corrections | 4 |
| Manifest claims falsified | 3 |
| Documentation drifts found | 8 |
| Recommendations | 7 do-now, 5 do-next, 7 do-not |
| Proposed phases | 6 (P1 gate close-out, P2 silent-failure guard, P3 coverage assertion, P4 doc reconciliation, P5 Cursor routing, P6 host probes) |

**Headline result:** every runtime carries every surface it can load — no runtime is missing a surface
it could use. The gaps are in *maintenance coverage*: four working `--check` modes no gate invokes, one
ungated generated agent tree and one ungated hand-authored hook layer (both Pi), a hand-maintained router
list that names 8 of 13 skill packets, seven Hermes skills a runtime-side scanner refuses to load, and no
checker anywhere that asks whether a runtime has a surface at all — which is the only reason Devin's
35-command removal could look like drift instead of a decision.

## Charter Corrections

| # | Chartered | Corrected | Evidence |
|---|---|---|---|
| 1 | 46 authored command files | 35 authored commands; 46 raw `*.md` count includes 11 non-command files | `deltas/iter-001.jsonl` `d1` |
| 2 | Devin carries zero commands (framed as gap) | zero by documented operator decision; replacement affordance is skill discovery | `file:.devin/SYNC.md:20` |

## Deviations

The skill's canonical state writer is the append gateway
(`append-mode-event.cjs --run-directory <spec folder>`). This lineage is a fan-out child whose write
surface is bounded to `.../research/lineages/deepseek`, so state records are appended in place and
the gateway is deliberately not invoked. Recorded so a later reader does not mistake the JSONL for
gateway-receipted evidence.
