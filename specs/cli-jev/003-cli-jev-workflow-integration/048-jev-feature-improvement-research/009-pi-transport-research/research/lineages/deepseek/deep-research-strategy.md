---
title: "Deep Research Strategy — Jev Pi native classifier transport (deepseek lineage)"
trigger_phrases: []
---
# Deep Research Strategy — Jev Pi native classifier transport (deepseek lineage)

<!-- MACHINE-OWNED (detached lineage: no reducer runs here; this file was authored in full) -->

## Research Charter

**Topic:** Improve, refine and expand the Jev Pi native classifier transport (cli-jev feature 037). The
transport is `.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs`; the comparison scorer is
`.skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs`. Recorded measurement
(2026-09-30): `verdict pi-transport: adopt K=111 M=111 coverage=100.0 agreement=95.5 median_abs_dp=0.0100
p95_ms=340/387 cost_per_100=0.0022`. Shipped as an opt-in transport in phase 038; two callers
(`leaf-route-replay.cjs`, `score-clarify-default.cjs`) use it, `choice` only, off while `JEV_TRANSPORT` is
unset.

**Five questions**
1. What drove the measured result.
2. How to raise its accuracy or lower its cost.
3. How to make the measurement more trustworthy.
4. Where else in `.skilled` the same judgment would pay off.
5. What a default-on integration would need, cost and risk.

**Non-Goals:** editing any scorer, transport, caller or live workflow; re-measuring with new model calls;
implementation work of any kind. This lineage writes only inside its own artifact directory.

## Known Context

- Fixture population: the 019 advisor run (`019-advisor-suggested-order/scratch/w4-session/jev-run/calls.jsonl`)
  holds 334 lines: one `auth_test` and 333 `choice` calls over 111 rows on `official` provider
  `jev-1.13.0`, 3 cyclic orders per row, every call `measured` on attempt 1 with full probability maps.
- The 037 live run (`037-pi-native-classifier-transport/scratch/live-run/calls.jsonl`, `report.json`)
  replayed those 111 rows through Pi `ModelRuntime.classify()` on `openrouter` `typesafe/jev-1.13`:
  333 calls + 1 model_check, all measured, 0 timeouts, 0 excluded, in ~1 min 29 s.
- The keep rule is fixed in `037/spec.md` section 4: coverage >= 90, agreement >= 95, Pi p95 <= 1.5x CLI
  p95; adopted at one-row margin (106/111 rows; a second disagreement would be 94.6).
- The 5 recorded disagreements are near ties (037 `implementation-summary.md` Known Limitations): rr-iter3-071,
  rr-iter3-081, rr-iter3-125, rr-iter3-127, P1-MCP-002.
- The latency pair is not same-day: Pi fresh vs CLI recorded 2026-09-29. The `--pi --cli` both-sides path
  exists behind its own switch and was never run.
- The transport module gates: package / model / credential / backend; one skip line each, then the CLI.
  It never handles credentials; credentials live in Pi's store. `choice` only; `auth`, `noul`, `score`,
  `run` stay on the CLI; the CLI is the default and the fallback.
- The callers write `backend: "jev"` even when Pi answers; no Pi version is pinned in the transport gate.
- The 038 follow-up list names 13 runtime-tree callers (system-deep-loop, system-skill-advisor,
  system-spec-kit) that still spawn `jev` directly, with their question types.
- The measured census: 12 classifier models known, 7 available, all through `openrouter`; the free
  `opencode/jev-1.13-free` was not available because the OpenCode credential is Go, not Zen.

## Key Questions

- [x] Q1 What drove the measured result.
- [x] Q2 How to raise its accuracy or lower its cost.
- [x] Q3 How to make the measurement more trustworthy.
- [x] Q4 Where else in `.skilled` the same judgment would pay off.
- [x] Q5 What a default-on integration would need, cost and risk.

## What Worked

- 2026-10-03 iteration 1: recomputing the comparison from the two `calls.jsonl` files reproduced every
  headline metric exactly (106/111, median_abs_dp 0.0100, p50/p95 249/340 vs 326/387) and exposed the
  two artifact disagreements and the margin containment of all five flips.
- 2026-10-03 iteration 2: simulating call policies on the recorded data showed the three rotations are
  load-bearing (1 call 92.8, 2 calls 94.6, 3 calls 95.5) and that a margin gate at 0.10 is the only
  agreement-raising policy on record (99.1 percent at 104/111 Pi-served rows).
- 2026-10-03 iteration 3: exact confidence intervals (106/111 -> [89.8, 98.5]) turned the one-row
  margin into a stated power problem, and the audit found the input-drift blindness and one-sided
  version pin.
- 2026-10-03 iteration 4: the whole `.skilled` judgment inventory by subcommand gave a concrete adopter
  ranking (routing-accuracy volume vs deep-loop critical path vs sk-doc noul callers) and exposed the
  dispatch-audit visibility gap.
- 2026-10-03 iteration 5: the default-on audit produced a needs/cost/risk register whose first entry is
  the verdict's own one-row margin, plus the per-call runtime/gate overhead and the OpenRouter data-path
  change.
- 2026-10-03 synthesis: five iterations merged into `research.md` with a ranked R1-R8 recommendation
  list, `findings-registry.json` with 12 key findings, and `resource-map.md`.

## What Failed

- 2026-10-03 iteration 2: no call-count reduction survives the keep rule (1 call 92.8, 2 calls / early
  stop 94.6 against the 95 bound), so the "cheaper route" direction bottoms out at the measured policy.

## Exhausted

- 1-call and 2-call policies for verdict-bearing runs; early stop by first-two-order agreement (all
  measured below the bound).
- Free/cheaper arms as unmeasured wins: no keep-rule run exists for any alternate arm.
- Treating agreement as accuracy: no gold labels exist for this corpus.

## Next Focus

None — all five iterations ran under the max-iterations policy (5/5). Synthesis is complete in
`research.md`; stopReason `maxIterationsReached` recorded in `deep-research-state.jsonl`. Convergence was
telemetry only (newInfoRatio 0.85 -> 0.65).
