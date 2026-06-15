# Sweep Benchmark — Operator Quickstart

Config-driven model-benchmark sweeps. One profile drives a **framework bake-off** (many prompt frameworks, one model) OR a **model-vs-model** comparison (one framework, many models) through the same code path. Which kind of run you get is decided by your profile, not by different code: there are NO mode-specific branches. `mode` only sets sensible defaults; the swept axis is whichever profile array carries more than one value.

This sits on top of the existing Lane B model-benchmark modules and orchestrates them unchanged.

For the six situational modes (A model-vs-model, B framework bake-off, C reasoning-effort ablation, D prompt-vs-prompt, E skill-change regression, F capability profiling) as ready-to-copy profile shapes, see [`MODES.md`](./MODES.md).

---

## What it is

- **One profile, one path.** `sweep-benchmark.cjs` expands `models × variants × frameworks × fixtures × samples` into a uniform cartesian product. Any axis you omit collapses to a singleton, so a 5-framework bake-off and a 3-model head-to-head run the same `runSweep`/`expandCells` logic.
- **Correctness is a GATE, not a score.** Eligibility is gated on `pass_rate ≥ threshold` (default 1.0); survivors are then ranked on efficiency, format, and reasoning. When every cell passes correctness, the run cannot crown a "correctness winner" — the ranking key moves off correctness and the verdict can only be TIE or INCONCLUSIVE. This is the direct fix for saturated easy fixtures producing misleading winners.
- **A trust verdict you read first.** The synthesis prints the verdict and the saturation status BEFORE the leaderboard, every time, so you never see a ranked "winner" before you see whether that ranking is trustworthy.
- **Frameworks are data.** Adding a framework is a registry entry, not a code change. The slot renderer validates required slots at validate-time.

---

## The files

| File | Role |
|------|------|
| `sweep-benchmark.cjs` | CLI entry + matrix expander. Expands the profile, renders each framework prompt, dispatches each cell, scores each row, writes outputs. No mode branch. |
| `lib/framework-renderer.cjs` | Slot interpolation + required-slot validation (throws a clear error at validate-time on a missing slot). |
| `lib/profile-validator.cjs` | Dependency-free validation of the profile: enums, required keys, dimension weights sum. Rejects a bad profile before any dispatch. |
| `lib/sweep-stats.cjs` | `mean` / `median` / `mad` / `quantile` / `seededRandom` + the trust-verdict helper (with an insufficient-n floor). |
| `lib/code-task-scorer.cjs` | Code-task scoring adapter producing the per-cell dimensions the gate and reporter consume. |
| `lib/correctness-gate.cjs` | Gates eligibility on `pass_rate ≥ threshold`, ranks survivors off correctness once saturated, flags `correctness_saturated`. |
| `lib/sweep-reporter.cjs` | Builds `aggregate.json` (grouped + verdict) and `synthesis.md` (verdict + saturation, then leaderboard). |
| `../../../sk-prompt/assets/framework-registry.json` | The 5 frameworks as data: `rcaf`, `race`, `cidi`, `tidd-ec`, `costar` (id / description / applies_to / template / slots / output_contract). |
| `../../assets/model_benchmark/benchmark-profiles/framework-bakeoff.json` | Example profile — 5 frameworks × 1 model. |
| `../../assets/model_benchmark/benchmark-profiles/model-vs-model.json` | Example profile — 1 framework × 3 models. |
| `../../assets/model_benchmark/benchmark-fixtures/t3-bugfix-in-context.json` | T3 fixture (id `t3-lower-bound`), hidden deterministic oracle. |
| `../../assets/model_benchmark/benchmark-fixtures/t3-strict-acceptance.json` | T3 fixture (id `t3-compare-versions`), hidden deterministic oracle. |

Profiles reference fixtures by their internal `id`, which is not required to match the filename — the loader scans the fixture dir and indexes by parsed `id` (filename is only a fallback key).

---

## How to run

```bash
node sweep-benchmark.cjs --profile <path> [--mock] [--out-dir <dir>]
```

| Flag | Meaning |
|------|---------|
| `--profile <path>` | Required. The sweep profile JSON. |
| `--mock` | Use the dispatcher's canned output instead of real CLI calls (deterministic; no network). |
| `--mock-mode <m>` | Optional mock variant for the dispatcher. |
| `--out-dir <dir>` | Where to write `results.json` (and the report alongside it). Without it, the run stays in memory unless legacy results-write defaults apply. |
| `--no-report` | Skip the `aggregate.json` + `synthesis.md` report; write only `results.json`. |

Example — a dry, deterministic bake-off into a scratch dir:

```bash
node sweep-benchmark.cjs \
  --profile ../../assets/model_benchmark/benchmark-profiles/framework-bakeoff.json \
  --mock \
  --out-dir /tmp/sweep-out
```

(The `framework-bakeoff` example expands to 30 rows / 10 cells: 5 frameworks × 1 model × 2 fixtures × 3 samples.)

Run from this `model-benchmark/` directory so the relative `--profile` and fixture paths resolve. The registry resolves automatically from `sk-prompt/assets/framework-registry.json`.

---

## The outputs

Written to `--out-dir`:

| File | What it holds |
|------|---------------|
| `results.json` | Raw rows — one record per dispatched cell, with the scored dimensions and any reported usage. |
| `aggregate.json` | Rows grouped by the profile's `groupBy` (framework or model): per-group `n` / `mean` / `median` / saturation / top-pair delta, plus the trust `verdict`, `ranking_key`, and `correctness_saturated`. |
| `synthesis.md` | The human read. Ordered `## Trust verdict` → `## Saturation status` → `## Leaderboard` → `## Reproducibility`. |

---

## The trust verdict

The verdict is **WINNER / TIE / INCONCLUSIVE**, and it is emitted BEFORE the leaderboard.

- **WINNER** — the top-pair margin on the gate's chosen `ranking_key` clears the noise floor with enough samples. A real-winner example: a margin of 60 over a noise floor of 0 at n=3 names a trustworthy WINNER on the efficiency axis while correctness stays gated.
- **TIE** — the top survivors are within the noise floor of each other.
- **INCONCLUSIVE** — not enough signal to separate them (for example, too few samples; an insufficient-n floor blocks a single-sample WINNER).

Correctness is a **GATE**: it decides who is eligible to be ranked, but once it saturates (every cell at a perfect pass rate) it leaves the ranking entirely. A saturated run therefore cannot produce a correctness WINNER — the verdict falls to TIE or INCONCLUSIVE, and the leaderboard ranks the eligible survivors on efficiency/format/reasoning instead. That is the guard that stops a saturated easy fixture from crowning a winner the data never earned.

---

## What is NOT here yet (P1 / P2)

The MVP runs `sweep-benchmark.cjs` standalone and ships the minimum stats needed for an honest verdict. Still on the roadmap: the full stats engine (paired bootstrap confidence intervals / noise-floor gating), the normalized dispatch envelope (OpenCode JSON token/cost parsing and `model-profiles.json` capability fields), the guarded `loop-host.cjs` integration that runs the sweep inside the improvement loop, and the tiered fixture taxonomy (more T3/T4 plus long-context/agentic categories). See the roadmap: `../../../../specs/skilled-agent-orchestration/127-reusable-model-benchmark-framework/001-design-research/research/research.md`.
