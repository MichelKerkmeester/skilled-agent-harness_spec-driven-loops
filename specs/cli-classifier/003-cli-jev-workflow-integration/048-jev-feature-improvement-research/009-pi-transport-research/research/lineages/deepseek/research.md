---
title: "Research: Improve, refine and expand the Jev Pi native classifier transport (deepseek lineage)"
trigger_phrases: []
---
# Research: Improve, refine and expand the Jev Pi native classifier transport

DeepSeek V4.1 Flash (`cli-pi`, max effort), lineage `fanout-deepseek-1790986325077-da6hri`,
5 iterations, 2026-10-03. Every claim below cites a file:line, a recorded run, or a recomputation over
the recorded calls. The lineage wrote only inside its artifact directory.

**Measured result under study** (`037-pi-native-classifier-transport/scratch/live-run.stdout.txt`):

```
verdict pi-transport: adopt K=111 M=111 coverage=100.0 agreement=95.5 median_abs_dp=0.0100
p95_ms=340/387 cost_per_100=0.0022
```

## 1. The Five Questions in Brief

- **What drove it (Q1):** the keep rule's agreement bound, reached at 106/111 rows on a 3-order mean,
  one row above failure. All five disagreements are near-ties; 99 decisive rows agree 100 percent; two
  of the five are metric artifacts rather than model disagreement.
- **Accuracy or cost (Q2):** accuracy-ranking levers are a margin-gated CLI escalation (simulated 99.1
  percent agreement at 104/111 Pi-served rows) and metric/tie fairness; cost is already tiny ($0.0022
  per 100 calls, ~$0.0075 per replay) so the real lever is call count and wall time, and the three
  rotations are load-bearing for the verdict (1 call = 92.8, 2 = 94.6, 3 = 95.5).
- **Trustworthiness (Q3):** the verdict is statistically indistinguishable from its opposite at n=111
  ([89.8, 98.5] vs [88.6, 98.0]); the latency pair is recorded-vs-fresh; cost is unreproducible; input
  drift is undetectable; the Pi identity is unpinned; there is no repeat run and no ground truth.
- **Where else (Q4):** seven `choice` call sites, at least seven `noul` and one `score` across
  `.skilled`; the routing-accuracy harnesses own the volume (333 calls/replay), the deep-loop runtime
  scorers sit on critical paths but need `bool`/`score` measurement, and the payoff is operational
  (latency, fewer processes, credential unity), never epistemic.
- **Default-on (Q5):** needs measurement repair, per-process runtime/gate caching, an identity pin, quiet
  fallback semantics, and backend/usage observability first; it moves all prompts to OpenRouter, doubles
  worst-case latency on failure, and must be staged as an `auto` mode and a monitored commitment.

## 2. Ranked Recommendations

Ranking combines evidence strength, blast radius and effort. R1–R4 are ready for a build phase; R5–R7
are research/measurement work; R8 is a decision gate.

| # | Recommendation | Why (evidence) | Effort | Risk |
|---|----------------|----------------|--------|------|
| **R1** | **Repair the measurement before reusing it**: run the `--pi --cli` same-day paired replay; record per-call `usage` (tokens + cost), `backend`, prompt digest and per-row top-2 margins in `calls.jsonl`; report raw `agreeing/measured` counts and excluded ids; add a second replay for variance | Latency pair is recorded-vs-fresh (037 L2); cost unreproducible (iter 1 F-7, iter 3 F-4); input drift invisible (iter 3 F-5); rounded percentages (iter 3 F-2); no repeats (iter 3 F-7) | S | none — pure measurement |
| **R2** | **Harden the transport before any wider use**: cache `ModelRuntime` + model + availability per process; pin the Pi version in the gate (0.99.1) with a rerun trigger; make fallback quiet or preflight the route once per process | Runtime rebuilt per call (jev-transport.mjs:349-366); Pi gate resolves any version (iter 5 F-3); skip-line spam on a default path (iter 5 F-4); transport never live-called (038 L5) | S/M | low |
| **R3** | **Add a margin-gated escalation to the transport**: keep Pi for rows whose top-2 mean margin >= 0.10, defer sub-0.10 rows to the CLI | Simulated on the recorded calls: 99.1 percent agreement while Pi still serves 104/111 rows; all five disagreements live in the sub-0.10 pool (iter 2 F-4) | M | medium — needs a rerun to verify; adds CLI calls on ambiguous rows |
| **R4** | **Adopt the transport in the remaining `choice` harnesses** (opt-in first): `score-suggested-order.mjs`/`score-jev-tiebreak.mjs` by volume, then `score-debug-next-check.mjs:733`, `score-track-narrowing.mjs:1327`, `score-alignment-suggestion.ts:1083`, `score-verdict-fallback.cjs:783`, `score-severity-replay.cjs:1070` | Inventory with file:line in iter 4 F-1; per-caller change is one call site (038 D3 shape contract); 333-call replay saves ~25 s and $0.0075 | S per caller | low — CLI remains fallback |
| **R5** | **Measure `bool`/`noul` and `score` arms under the keep rule**, then adopt in the deep-loop runtime scorers and sk-doc `noul` callers | `choice`-only is the transport's fixed boundary (REQ-003); fanout-pairs, residue-flagger, completion-claims, stop-rater are blocked by type (iter 4 F-4); sk-doc noul callers are cheapest early adopters (iter 4 F-10) | M/L | medium — new runs need operator yes and ~$0.01 each |
| **R6** | **Keep the call policy as measured**: 3 rotations for verdict-bearing runs; do not early-stop; use codemode's 4-way parallelism only for batch harnesses; consider free/cheaper arms only after their own keep-rule run | 1/2/3-call agreement 92.8/94.6/95.5 (iter 2 F-1); early stop 94.6 at 228 calls (iter 2 F-2); catalog prices (iter 2 F-5); codemode 4-way (iter 2 F-7) | S/M | low |
| **R7** | **Run the variance and fairness experiments**: test alternate state wrappers; repeats for run-to-run drift; tie-aware agreement metric; labeled subset on the 12-row ambiguous pool | CLI raw stdin vs Pi `{request}` (iter 2 F-8); no sampling control (iter 2 F-9); artifacts move the number 95.2–95.5 (iter 3 F-9); no labels (iter 3 F-8) | M | low |
| **R8** | **Default-on only as a monitored commitment**: an `auto` mode that prefers Pi when gates pass and is quiet otherwise, identity reruns on any Pi/Jev change, CLI fallback and escape value kept forever, backend/usage auditable, data-path sign-off | One-row margin with overlapping CIs (iter 3 F-1); unpinned Pi identity (iter 5 F-3); OpenRouter data path (iter 5 F-9); blast radius grows with adoption (iter 5 F-10) | M | high — decision-grade |

## 3. Q1 — What Drove the Measured Result

- The verdict is arithmetic on the keep rule's three fixed bounds (coverage >= 90, agreement >= 95,
  Pi p95 <= 1.5x CLI p95), judged in order; `adopt` needs all three
  [.skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs:70-73, 1075-1081].
  106/111 = 95.5; one more disagreement = 94.6 and `keep-cli` (round1 at :992-993, :1054-1055).
- Full reproduction from the two recorded `calls.jsonl` files: 106/111 agreement, median absolute
  difference exactly 0.0100 over 1,689 order-key differences, p50/p95 249/340 vs 326/387 ms, coverage
  total (excluded 0, unmeasured 0, timeouts 0) [037 scratch/live-run/{calls.jsonl,report.json};
  019 scratch/w4-session/jev-run/calls.jsonl].
- Anatomy of the five disagreements (iter 1 F-3): all inside the 12 rows with either side's top-2 mean
  margin < 0.10; the other 99 rows agree 100 percent. `rr-iter3-071` (Pi sk-doc 0.517 vs CLI
  system-spec-kit 0.557), `rr-iter3-081` (Pi system-spec-kit 0.527 vs CLI sk-prompt 0.503),
  `rr-iter3-125` (Pi system-spec-kit 0.340 vs CLI system-deep-loop/none 0.3167/0.3167), `rr-iter3-127`
  (Pi system-deep-loop 0.343 vs CLI system-spec-kit 0.320), `P1-MCP-002` (Pi mcp-code-mode 0.550 vs CLI
  sk-code 0.497).
- Two flips are metric artifacts: `rr-iter3-127` has identical per-order picks on both sides and counts
  as a disagreement only because averaged means cross; `rr-iter3-125`'s CLI top is an exact tie settled
  by submitted option order (`topKey` keeps the earlier key;
  score-suggested-order.mjs:118-124; `none` is appended last, score-pi-transport.mjs:586-589).
- Agreement is a mean-of-orders construct: per-order agreement is 317/333 = 95.2 percent; the mean and
  2-of-3 majority both give 106/111. Both sides show rotation sensitivity (9 Pi rows, 12 CLI rows split
  across orders).
- The cost number is the mean of in-process `usage.cost.total` x 100 (score-pi-transport.mjs:616-618,
  756-758); no usage field is recorded, so 0.0022 survives only in `report.json`.
- The same nominal model answered through different providers (OpenRouter `typesafe/jev-1.13` vs
  official `jev-1.13.0`), so 95.5 is cross-provider agreement of one model family.

## 4. Q2 — How to Raise Accuracy or Lower Cost

- **Rotation count is load-bearing.** Against the CLI 3-order mean: 1 call 103/111 = 92.8 percent, fixed
  2 calls 105/111 = 94.6, current 3 calls 106/111 = 95.5 (iter 2 F-1). Early stop when orders 0+1 agree
  spends 228 of 333 calls but lands at 94.6 (iter 2 F-2). Neither cut preserves the verdict.
- **The one agreement-raising policy on record is margin-gated escalation.** Deferring the 7 rows with
  Pi top-2 mean margin < 0.10 to the CLI gives 110/111 = 99.1 percent while Pi answers 104/111; a 0.05
  gate defers 2 rows and gives 96.4 (iter 2 F-4). It is a hybrid response to ambiguity, not a model
  improvement, and it must be verified by a rerun before shipping (R3).
- **Cost is small and metered.** `typesafe/jev-1.13` prices at $0.042 per 1M input tokens, output $0;
  the recorded cost implies ~533 input tokens per call and ~$0.0075 for the 333-call replay. Available
  alternatives: `respan/span-01` $0.02, `respan/span-01-lite`/`:free` $0, `upstage/solar-decide` $0.05,
  `~typesafe/jev-latest` $0.042; `opencode/jev-1.13-free` $0 but needs a Zen credential (current one is
  Go); direct TypeSafe `jev-latest` reports no cost but needs `TYPESAFE_API_KEY`
  (catalog `cost` fields, chunk-3YAHQSW6.js; docs/models.md:106-112).
- **Wall time is the real cost.** 333 sequential calls run ~1 min 29 s at mean 260 ms; codemode runs up
  to four classifier calls at a time per script (docs/cli.md:178), a ~4x wall-time lever for batch
  harnesses. The SDK path stays sequential.
- **Fairness repairs raise the reported number without touching the model**: tie-aware agreement and
  top-2 overlap accounting would remove the two artifact flips (iter 3 F-9). This is metric repair and
  belongs with Q3, not accuracy improvement.
- **Untested cheap experiments**: match the input shape (CLI raw stdin vs Pi `state:{request}`); keep the
  three rotations (no sampling control exists — `classify()` takes a signal only).

## 5. Q3 — Make the Measurement More Trustworthy

- **Power.** The exact 95 percent CI is [89.8, 98.5] for 106/111 and [88.6, 98.0] for 105/111; adopt and
  keep-cli are indistinguishable at this sample. A trustworthy rule needs a stated stability margin, a
  wider/repeated measurement, or an explicit "within noise" outcome (iter 3 F-1).
- **Same-day pairing.** The Pi column is 2026-09-30 and the CLI column is the 2026-09-29 recording; the
  `--pi --cli` path records `replay: 'fresh'` and has never run (score-pi-transport.mjs:1304-1340;
  037 L2).
- **Record what is claimed.** Store per-call usage/cost; store `excluded` ids; store per-row margins and
  order picks; judge on raw counts, not `round1` percentages (iter 3 F-2, F-4, F-9).
- **Prove the inputs.** The replay plan checks only the option key set and then sends the current census
  prompt; neither side stores a prompt digest, so prompt drift between recording and replay is
  undetectable (iter 3 F-5). `state_sha12` proves Pi's input alone.
- **Pin identities.** The CLI gate pins `jev 0.6.2` and skips on mismatch; the Pi gate resolves any
  version (score-jev-tiebreak.mjs:25, 1119-1124; iter 3 F-6). The verdict is scoped to Pi 0.99.1 +
  jev-1.13 and requires a full rerun for any new identity (037 L5).
- **Repeat runs and labels.** There is one run and no ground truth; a labeled subset on the 12-row
  ambiguous pool would convert "the sides differ" into "which side is right", and two more replays
  (~$0.015, ~3 min) would bound run-to-run drift (iter 3 F-7, F-8).
- **Mechanical completeness.** Timeout and unclassified jev exits should print their own lines;
  instrumented callers must stop writing `backend: "jev"` when Pi answered (037 P2-3/P2-4; 038 L1).

## 6. Q4 — Where Else in `.skilled` the Same Judgment Would Pay Off

- **`choice` call sites (transport-admissible today)**: `score-verdict-fallback.cjs:783`,
  `score-severity-replay.cjs:1070`, `score-jev-tiebreak.mjs:1005` (and its harness
  `score-suggested-order.mjs`), `score-debug-next-check.mjs:733`, `score-track-narrowing.mjs:1327`,
  `score-alignment-suggestion.ts:1083`; plus the two wired sk-doc harnesses.
- **`noul` callers**: `cite-drift-scan.mjs:1081`, `score-goal-lint.cjs:313`,
  `score-severity-replay.cjs:1118`, `score-fanout-pairs.cjs:985`, `score-residue-flagger.cjs:1093`,
  `score-completion-claims.mjs:784`, `score-jev-tiebreak.mjs:928`, `score-d4-agreement.cjs`.
  **`score` caller**: `score-stop-rater.cjs:1090`.
- **Volume and position.** The routing-accuracy harnesses own the volume (333 calls per 111-row
  replay); the deep-loop runtime scorers sit on workflow critical paths but are `noul`/`score`; the
  sk-doc `noul` callers are the cheapest early adopters if a `bool` arm is measured (iter 4 F-3, F-4,
  F-9, F-10).
- **The payoff is operational.** Same model family on both routes; latency ~22 percent better on mean,
  one fewer child process, and a route that works without the `jev` binary when a Pi credential exists.
  No surface gains accuracy (iter 4 F-5).
- **Observability caveat.** `dispatch-audit.mjs:236-241` classifies `jev choice|noul|score|run` as
  `cli-classifier` dispatches; a Pi-native call is invisible to that audit, so adoption changes the
  audit's observation surface (iter 4 F-6).
- **Native surfaces for Pi workers** are documented (codemode `models.classify()` up to 4 concurrent,
  extensions, SDK; cli-pi/SKILL.md:165-176, rule 13), yet the only native-classify code in `.skilled` is
  the benchmark and the transport itself (iter 4 F-7).

## 7. Q5 — What a Default-On Integration Would Need, Cost and Risk

**Needs, in order.** (1) R1's measurement repairs and R2's hardening — before a default, not after.
(2) The identity pin and a rerun trigger. (3) Quiet fallback or a once-per-process preflight, because a
default path would otherwise print a skip line per call on machines without Pi credentials (iter 5 F-4).
(4) Backend/usage observability so the default is auditable (iter 5 F-7). (5) A decision about the data
path: OpenRouter vs the `official` provider for every prompt (iter 5 F-9). (6) An `auto` mode and a
staged rollout — the switch flip changes the module contract, the doc table and the two callers'
switch-off baseline at once, and the blast radius grows with adoption (iter 5 F-1, F-10).

**Cost.** Per-call dollars are trivial ($0.0022 per 100 calls; ~$0.0075 per 333-call replay; $0 at the
free arm, unmeasured). The costs that matter: worst-case latency doubles on a failed Pi attempt (the
full CLI call follows the failed attempt — no circuit breaker); identity reruns cost a replay plus
operator time; the default moves spend from an unrecorded CLI cost to a metered OpenRouter cost
(iter 5 F-5, F-6).

**Risks.** One-row margin and overlapping CIs underpin the whole verdict (iter 3 F-1, iter 5 F-8);
unpinned Pi identity silently rides upgrades (iter 5 F-3); per-call runtime construction is unmeasured
overhead on the default path — the 260 ms figure is the benchmark's once-per-run runtime, and the
transport has never made a live call (iter 5 F-2; 038 L5); observability gaps become the normal case
(iter 5 F-7); the data path changes for every prompt (iter 5 F-9). Default-on is defensible only as a
monitored commitment with the escape value, fallback and per-call audit records kept forever
(iter 5 F-11).

## 8. Ruled-Out Directions

- **1-call or 2-call policies for verdict-bearing runs** — 92.8 and 94.6 percent against the 95 bound
  (iter 2 F-1); early stop reaches only 94.6 (iter 2 F-2).
- **Free/cheaper model arms as a free win** — no keep-rule run exists for any alternate arm; the
  verdict's scope requires a full rerun for any new identity (iter 2 F-5, F-6; 037 L5).
- **Treating agreement as accuracy** — there are no gold labels; on the five flips either side could be
  right (iter 3 F-8).
- **Declaring the measurement trustworthy because the numbers reproduce** — they reproduce, but the
  verdict is one row from failure with overlapping intervals, and its biggest figures (cost, latency
  pairing) are not verifiable from the record (iter 1, iter 3).
- **A hard default flip today** — three independent thin spots: one-row margin, never-live transport,
  unpinned identity (iter 5 Ruled Out).

## 9. Open Questions for the Next Phase

- Does the operator accept a 95.5-on-one-row margin as sufficient for wider adotion, or does the corpus
  need same-day, repeated, or labeled measurement first? (R1, R7)
- Is the OpenRouter data path (vs `official`) acceptable for every caller, and who owns that decision?
  (R8)
- Which is the first production adopter: the routing-accuracy harnesses (volume), the deep-loop runtime
  scorers (critical path, blocked by type), or the sk-doc `noul` callers (cheapest, blocked by type)?
  (R4, R5)
- Does the escalation threshold ship as 0.10 (7 rows deferred, 99.1 percent simulated) or is a 0.05
  gate (2 rows, 96.4 percent) the preferred cost/consistency point? (R3)

## 10. Method and Provenance

- Iterations 1–5 in `iterations/`, deltas in `deltas/`, state in `deep-research-state.jsonl`; all in
  this lineage directory. Recomputations over the recorded calls used the scorer's own definitions
  (`nearestRank`, `topKey`, mean-over-orders) imported in spirit from
  `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-suggested-order.mjs`.
- Primary sources: `037-pi-native-classifier-transport/scratch/live-run/{calls.jsonl,report.json,live-run.stdout.txt}`,
  `019-advisor-suggested-order/scratch/w4-session/jev-run/calls.jsonl`,
  `.skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs`,
  `.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs`,
  `037`/`038` phase docs, the installed Pi package docs and catalog.
- Convergence telemetry (max-iterations policy; informational only): newInfoRatio 0.85, 0.80, 0.75,
  0.70, 0.65. The ratio declined as intended while each iteration stayed above the 0.05 threshold; no
  early stop was taken and the loop ran its full five iterations.
