---
title: "SWE Lineage Synthesis — Classifier Round 3: code-level slice design"
description: "Terminal synthesis of the swe lineage in 007-classifier-deep-research: ten forced iterations on the cli-deem wire, validator residue, routing-as-code, the compaction seam, sk-prompt/sk-design routers, the cli-classifier hub, the shared probe contract, the build order and the first PR."
trigger_phrases:
  - "classifier round 3 swe lineage"
  - "classifier slice design code level"
  - "two-backend probe contract"
importance_tier: "important"
contextType: "research"
---

# SWE Lineage Synthesis — Classifier Round 3

Lineage `swe` (cli-devin, `swe-2-max`, session `fanout-swe-1790490452777-942a1f`) in `specs/cli-jev/003-cli-jev-workflow-integration/007-classifier-deep-research`. Lens: **code-level slice design** — every question answered as files, functions, switches, printed lines and rollback, not as prose recommendations. Ten forced iterations, `stopPolicy: max-iterations`, convergence off. Baselines: `../004-deep-research-expansion/research/research.md` (BASE2, R1–R22) and `../001-deep-research/research/research.md` (BASE1, rows 1–43). Every load-bearing claim names where it was opened; sibling findings are quoted as sibling.

## 1. Executive summary

- **The context-reduction answer is measurement, not a model.** The top seam is the phase-005 compaction census (226 counted boundaries, ~104 s p50 each): a zero-call script that prints a stop line *before* any deletion arm is built. A live PreCompact classifier is ruled out — 1,800 ms internal budget, deadlines already enforced. The arm is an offline amendment with `--arm-backend`, gated on the census's own printed lines (swe-04).
- **The best manual-review cut is citation drift, not goal linting.** 456 `.skilled` `file:line` citations are each a binary, locally-scoped judgment — "does line N still support the claim" — in a sibling advisory script that never touches validator exit codes. Deem preferred (local, private, free); Jev the calibrated second option; neither → `skipped: no backend`, byte-identical output (swe-02, swe-06).
- **The cli-deem backend is a thin client, not a provider.** Deem's wire (`/v1/systemone`, typed `choice`/`score`/`run`) doesn't match Jev's request shape; the smallest slice is a ~180-LOC stdlib client translating the asymmetric envelope, inside a standalone `cli-deem` leaf — *not* a `custom`-provider wrapper and *not* gated behind the `cli-classifier` hub (swe-01, swe-09).
- **Routing and the embedded sk-prompt/sk-design routers are already deterministic where it counts.** Compiled routing is authoritative behind three identity gates; `ROUTER.md` `RESOURCE_MAP`s are prose-layer mode routers. Classifier value is bounded: a leaf-route replay runner (offline comparison corpus) and a zero-score-fallback arm only where an ambiguity corpus exists — never a replacement for the compiled authority (swe-03, swe-05).
- **The two-backend probe is a contract before it is a file.** Zero built callers; extraction fires at the third *built* caller into `.skilled/bin/backend-probe.cjs`; the skip-line vocabulary and pass conditions are written once now (swe-08). The hub move is a 53-file atomic job deferred until the second transport packet exists (swe-07).
- **The first PR is 002's census slice only** — `score-jev-tiebreak.mjs` (~180 LOC) + vitest + ~20 spec lines, three pre-registered exits, `git revert` rollback. The stub-silence test it carries is the audit template every later arm on either backend inherits (swe-10).

## 2. What this lineage changes against the baselines

| Item | Change | Evidence |
|---|---|---|
| cli-deem slice shape | Thin stdlib `run`-path client (~180 LOC) + envelope translator; wrapper and transparent-provider shapes rejected | iteration 1 (both wire sides opened) |
| Validator residue | Citation-drift advisory (456 citations, binary judgment) ranked over DQI/style; validators' exit codes never touched | iterations 2, 6 |
| Routing seam | Compiled-routing authority traced (flag + manifest + policy-hash gates); `cli-jev` is stage1-only; classifier = offline replay or bounded tie-break, not replacement | iteration 3 |
| Reduction seam | Census-first ruling for 005; live-hook classifier refused (1.8 s budget); deletion arm fully specified (two `noul` per tool call, `keepThreshold`, `--arm-backend`) | iteration 4 |
| sk-prompt/sk-design | Embedded INTENT_MODEL scorers measured over scenario prompts (tie counts by name); deterministic port precedes any classifier; zero-score-fallback is the only live-shaped arm | iteration 5 |
| Hub shape | Minimal `cli-classifier/` tree (two transport modes, parent-hub contract files listed); 53-file move counted; no third abstraction tier, no global switch | iteration 7 |
| Probe contract | Parallel independent probes; Deem = `/health` + allowlist + `deem-0.8-v1` pin; Jev = REQ-002 verbatim; 2 s/500 ms budgets; per-process memo only; aligned skip-line table | iteration 8 |
| Build order | Step 0 spec text → six parallel zero-call artifacts (~1,500 LOC) → `cli-deem` leaf (~440) → six gated arms → extraction wave; ~2,600–3,100 LOC total | iteration 9 |
| First PR | Census-only slice with printed `--jev` refusal; stub-silence test as cross-backend audit template; revert-clean by REQ-006 | iteration 10 |
| Mid-run failure | `deem arm stopped: server gone` added (deem-ctl update kills mid-run); Jev's `key rejected` is the parallel | iteration 9 |

## 3. Answers to the brief, questions A–H

**A/B — Where a classifier cuts context & which seams.** Ranked: (1) 005's offline compaction census → conditional deletion arm (the only counted reduction seam); (2) citation-drift advisory (456 checks, manual-review cut); (3) leaf-route replay + ambiguity corpus (bounded routing comparison); (4) sk-prompt/sk-design zero-score fallback (smallest live-shaped arm). Ruled out: live PreCompact, hook-deadline seams, replacing compiled routing.

**C/D — Savings, cost, latency, privacy.** Savings are measured-first: every slice's own census prints the number before an arm exists. Cost is zero for all step-1 artifacts; Deem calls are free loopback (~60 ms p50 warm, LOCAL-measured); Jev calls priced by count not dollars (≤723 for 002's arm). Privacy: Deem never leaves the machine; Jev egress bounded per phase with payload-class prints before first billed call.

**E — Measurement.** Each slice self-measures: census power lines (movable rows, wins needed, true rate for 80% power), comparator MRR/right@1/right@3, per-call JSONL with `backend:`/`model:`/`latencyMs:`, flip ≤0.10 family rule.

**F/H — Order and kills.** Five steps (iteration 9): spec text → zero-call wave → cli-deem leaf → gated arms in gate-cheapness order → extraction wave on counted triggers. Kill lines all pre-registered: `baseline mismatch: comparison void`, `no headroom`, `underpowered`, `arm not built: fit_throws>=50% OR …`, `r20 jev arm not built: …`, `stop:` lines, plus the swe additions `arm not in this slice: census only` and `deem arm stopped: server gone`.

**G — The two-backend gate.** One contract, two independent probes, per-feature switches, `selected = prefer|other|null`, `skipped: no-backend` fallback byte-identical. No global backend switch anywhere.

## 4. The cli-classifier hub decision

Build-now as *architecture* (the tree is fully specified, swe-07), deferred as *execution*: the move is 53 files / 39 references / 12 generated surfaces and must be one atomic commit. Trigger: second transport packet exists (`cli-usage` + `cli-deem`). It introduces no third tier and no global switch.

## 5. Open questions carried forward

1. Whether any 005 deletion arm exists at all — the census's stop line decides (UNMEASURED by design).
2. Deem accuracy on this repository's judgment classes — unmeasured (LOCAL); every arm is a measurement arm first.
3. Whether the third built probe caller is 005's arm, a lineage slice, or 006's arm — decides extraction timing.
4. Citation-drift precision on real pairs — needs the ~30-pair label set.
5. Hub-move ordering relative to 006/003 arms — organizational, not blocking.

## 6. Artifact inventory

- `iterations/iteration-001.md` … `iteration-010.md` — ten bounded-focus iterations, each with sibling check, citations, ruled-out list, New-against-baseline table, hand-off
- `deltas/iter-001.jsonl` … `iter-010.jsonl` — finding/ruled-out records per iteration
- `deep-research-state.jsonl` — binding, phase_init, iterations 1–10, phase_main_loop, telemetry, synthesis events
- `findings-registry.json` — keyFindings, newIdeas (12), resolved/open questions
- `resource-map.md` — sources opened per iteration
- `deep-research-config.json`, `deep-research-strategy.md`, `invocation-metadata.json` — init artifacts
