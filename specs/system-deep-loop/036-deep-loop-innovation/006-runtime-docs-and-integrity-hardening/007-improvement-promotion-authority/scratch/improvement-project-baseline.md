---
title: "Improvement-project baseline and delta"
trigger_phrases: []
---
# Improvement-project baseline and delta

Captured 2026-08-18. The landed work is additive-dark, so the pre-edit side was
obtained by checking out the pre-landing commit in a throwaway worktree and
running the same command there — not by relabelling a current run as a baseline.

- **Pre-edit SHA**: `d0d8623ddf` — the parent of `0d1827eef50`, the first
  promotion-authority landing commit.
- **Post-landing SHA**: `df4259a4a2` (branch `worktrees/019-036-open-item-closeout`).
- **Command**: `vitest run --no-coverage --config ./vitest.config.mjs`, run from
  `deep-improvement/scripts/`.

## Full improvement project

| | Pre-edit `d0d8623ddf` | Post-landing | Delta |
|---|---|---|---|
| Files discovered | 48 | 53 | +5 |
| Files failed | 17 | **13** | **-4** |
| Tests discovered | 547 | 591 | +44 |
| Tests passed | 478 | **542** | **+64** |
| Tests failed | 54 | **49** | **-5** |
| Tests skipped | 15 | 0 | -15 |
| Exit code | non-zero | non-zero | unchanged |

The suite is red on both sides, but it is **less red after the change than
before it**: four fewer failing files, five fewer failing tests, sixty-four more
passing. Nothing regressed.

## Per-lane, where it matters

| Lane | Pre-edit | Post-landing |
|---|---|---|
| `agent-improvement` (this packet's lane) | 60 passed, 0 failed | **63 passed, 0 failed** |
| `shared` (its foundation) | 124 passed, **1 failed** | **159 passed, 0 failed** |
| `model-benchmark` | — | 3 files failing |
| `skill-benchmark` | — | 10 files failing |

The promotion-authority lane and the shared foundation it rests on are fully
green, and the one shared-lane failure present before the change is gone.

## What the residual red actually is

All 13 failing files sit in `model-benchmark/` and `skill-benchmark/` — sibling
benchmark lanes. The failures are skill-routing, design-token lint, parent-hub
vocabulary sync, and fan-out dispatch assertions. None touches promotion
authority, and the count went **down** across this change, so none of it is
attributable to this packet.

That red is real and worth someone's attention. It belongs to the benchmark
lanes, not to this gate.

## Bearing on the go-live decision

This baseline answers "did the additive-dark landing break anything" with a
measured no. It does not authorize the dark-to-live flip — that remains gated on
the acceptance review, which is a judgement call and not a test result.
