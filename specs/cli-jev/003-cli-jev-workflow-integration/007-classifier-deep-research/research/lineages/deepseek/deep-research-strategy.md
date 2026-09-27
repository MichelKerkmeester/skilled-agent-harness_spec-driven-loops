---
title: Deep Research Strategy — Classifier Round 3, DeepSeek Lineage
description: Detached ten-iteration research strategy for the DeepSeek lineage (seams, gating and failure paths, including the two-backend gate) on classifier context and review-work reduction.
trigger_phrases: []
---

# Deep Research Strategy — Classifier Round 3, DeepSeek Lineage

## 1. Overview

This is the persistent state for detached lineage `deepseek` (cli-pi, `deepseek-v4.1-flash`, max) in `007-classifier-deep-research`, round 3 of the Jev/classifier research. The loop is forced to ten iterations by `stopPolicy: max-iterations`; convergence before iteration 10 is telemetry only. The lens is **seams, gating and failure paths**, per `context/research-angles.md` section 2; this lineage owns the two-backend gate and its failure paths.

## 2. Topic

Find where a classifier model, Jev hosted or local Deem 0.8B, cuts the main AI's context and manual review work in this repository. Brief, questions A to H and answer shape are in `spec.md` (Research Brief). Baselines: `../004-deep-research-expansion/research/research.md` (BASE2, R1 to R22, rows 44 to 72) and `../001-deep-research/research/research.md` (BASE1, rows 1 to 43). Round 3 adds a second backend (Deem local), a served model measured in `context/deem-local.md` (LOCAL) and new ground in questions C, D, E and F.

## 3. Angle Assignments (deepseek, 10 forced iterations)

- `deepseek-01` (W1): The two-backend gate as code: what "Deem is available" means — A, H.
- `deepseek-02` (W1): The `cli-deem` lifecycle: install, start, health, update and rollback — A, G.
- `deepseek-03` (W1): Validators as gates: spec-kit's rules and `check-goal.cjs` — D.
- `deepseek-04` (W2): Context-reduction seams and their deadlines — C, B.
- `deepseek-05` (W2): The flip set, seam side: frozen contracts and callers — B.
- `deepseek-06` (W2): `cli-deem` through the `custom` provider: the failure side — A.
- `deepseek-07` (W3): Moving `cli-jev` under `cli-classifier`: the blast radius — G.
- `deepseek-08` (W3): A live Deem seam: warm or cold, and the precompute route — C, G.
- `deepseek-09` (W4): Failure modes and kill criteria on both backends — H.
- `deepseek-10` (W4): The two-backend amendments to 002, 003, 005 and 006 — H.

## 4. Non-Goals

- No build of any recommendation; research only.
- No live `jev` call of either package: no judgment, no `jev auth test`, no `jev auth status`.
- No call, start, stop or update of the local Deem server; only the orchestrator calls it.
- No `.env` file opened, vendored or not.
- No write outside `research/lineages/deepseek/`; no spec, continuity, memory, git, parent or shared telemetry write.
- No repository module, test suite, `validate.sh`, `generate-context.js`, eval script or install run.
- No transcript or reply text copied into any artifact; counts, lengths, field names and record types only.
- The Python `jev-cli` 0.6.2 and the npm `jevctl` 0.2.3 stay apart in every sentence. The served 0.8B, the MCP server, the Rust server and the documented 9B stay apart in every Deem sentence.

## 5. Stop Conditions

- Complete exactly ten evidence iterations under `stopPolicy: max-iterations`.
- Treat convergence before iteration ten as telemetry and continue; never synthesize early.
- Stop at iteration ten with `maxIterationsReached`, retaining explicit unknowns.

## 6. Progress

- init: binding, config, strategy and state log written. Angle assignments fixed above.

<!-- ANCHOR:key-questions -->
## 7. Key Questions (lineage-level, remaining)

- [x] What exactly does "Deem is available" mean as a check: request, fields, timeout, pass condition, model id pin? (iteration 1: GET /health; status ok + backend != stub + model == deem-0.8-v1; 500 ms hook budget; four skip lines)
- [x] What does the built `deem-ctl` plus launchd update schedule already cover, and what does it leave open? (iteration 2: full lifecycle audited; gaps = no model pin, no smoke on stopped-server update, no wait-for-exit)
- [x] Which spec-kit and `check-goal.cjs` rules leave a judgment residue a classifier could judge? (iteration 3: 40-rule map; six pattern proxies; separate advisory only)
- [x] Which reduction seams have deadline headroom for a ~60 ms local call plus spawn/connect cost? (iteration 4: advisor 2200ms / PreCompact 1800ms; two paths; routing CLIs no clock)
- [x] Which flips survive frozen contracts and callers? (iteration 5: only row 1 conditionally, Node path, gated by R1 + measured p95)
- [x] Does the `custom` provider path work against Deem at all, and where does it fail? (iteration 6: refuted as a wrapper; exit map; separate client verdict)
- [x] What is the counted blast radius of moving `cli-jev` under `cli-classifier`? (iteration 7: 92 files / 927 refs; five-step move; alias cannot carry a metadata hub)
- [x] Does a live Deem seam need a warm server, or does precompute move it off the critical path? (iteration 8: warm or skip; host precompute contract read; background pass only)
- [x] What prints per failure on both backends, and what kill criterion ends each survivor? (iteration 9: combined table, four kill lines, no default)
- [x] What exact two-backend amendments do 002, 003, 005 and 006 need, and in what build order? (iteration 10: line map, gate text, six-step order)
<!-- /ANCHOR:key-questions -->

## 8. What Worked

- Iteration 4 (deepseek-04): the steer's two-path split changed the whole headroom analysis; hook sources opened directly gave exact budget chains.
- Iteration 5 (deepseek-05): searching owners/callers found the test pins and the advisor's own compiled-route shell-out - both invisible from the seam list alone.
- Iteration 7 (deepseek-07): counting first, then classifying by surface, made the move tractable; the alias answer fell straight out of the routingClass.
- Iteration 8 (deepseek-08): opening the vendored host types settled the precompute question instead of guessing; the "still leads" clause became the cache rule.

## 9. What Failed

- (filled per iteration)

## 10. Exhausted / Ruled Out

- (filled per iteration)

## 11. Next Focus

- Synthesis complete at iteration 10/10 (`maxIterationsReached`). No further iterations; the terminal artifacts are `research.md`, `findings-registry.json` and `resource-map.md`.
