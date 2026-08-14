# Study #6 (Cross-Study Integration Capstone) — The Whole Design in Plain Terms

> Plain-language companion to `research.md` (the 10-round SOL-xhigh integration synthesis, independently verified by DeepSeek V4 Pro). This study does **not** research a new repo. It takes the five prior studies (S1 agent-swarms, S2 graphene, S3 graph-arch, S4 graph-engineering-master, S5 NOOA + blog theory) and welds them into **one coherent design** for turning `system-deep-loop` into a graph-based agent-loop engine.

---

## The one-sentence takeaway

The five studies describe **one system, not five** — a **graph decides what work is eligible and in what order; a bounded loop does each unit of work; typed evidence stacks up; and nothing anywhere becomes permission to change real state except one final authority (036), which today is switched off**.

---

## The single idea that ties everything together

Across all five studies, the same rule appears in five different vocabularies:

> **A proposal is never permission.**

A graph edge, a passing test, a confident memory, a settled belief, a policy "allow," even a human's approval — none of them, by themselves, changes protected state. Each is a *typed input* that must be re-checked at one authority boundary before anything real happens. That boundary is **036**. Everything else proposes; only 036 disposes.

This is what makes the five studies **one acyclic system** instead of five overlapping ones: they all feed the same funnel, and the funnel has exactly one exit.

---

## The honest headline you must keep in mind

**036 runs dark today.** It is the *designated* authority, but it is not switched on. The legacy runtime is still the real writer; 036 currently just watches after the fact and hands back the legacy result unchanged. So every "036 authorizes this" sentence in the design is a **target-state contract, not a live guarantee**. The whole design is coherent on paper; none of its authority claims are enforced yet. Getting there needs a measured, operator-gated, one-mode-at-a-time cutover.

DeepSeek's biggest confirmation was that this caveat is carried *consistently* through the whole document — and its biggest correction was to stop the design from calling its paper schemas "concrete artifacts." They are **proposed schemas, unimplemented**. That honesty is now baked in.

---

## How the two layers fit together (graph + loop = composition)

The most important structural insight: **graph and loop are not alternatives — they compose.**

- **The graph (S1–S4) owns the outside.** It decides which work is ready, how work branches and fans out, how results fan back in, what policies and budgets apply, and when a subgraph has converged.
- **The loop/harness (S5) owns the inside of one node.** Given a bounded, pinned context, it does *one attempt*: calls a model or tool, forms a typed result, proposes a memory update, and returns. It cannot spawn new work, mint permissions, or change the graph.

Think of the graph as the org chart and dependency plan, and the loop as one worker doing one ticket — a worker who can ask for more but can't promote themselves.

---

## The eight interconnection results (P1–P8), in plain terms

Each of these is a **proposed schema that only exists because you combine two or more studies** — none of them lives in any single study. All are design-level, none is shipped code.

1. **P1 — One authority contract with two modes.** A single table describing "how it works today (legacy is boss, 036 watches dark)" and "how it works after cutover (036 is boss)," plus ten no-bypass rules (no edge authorizes, no score hides missing evidence, no `ASK` defaults to allow, no dark output changes the real result, etc.). *Connects S1+S2+S3+S5.*

2. **P2 — One promotion-evidence bundle.** Before any candidate can be promoted, six independent evidence families must all pass: **D**ata quality, **C**ausal-prefix/replay correctness, **G**overnance-mutant survival, **H**arness-mutant survival, **R**ecovery/rollback drills, **M**easured baselines-and-deltas. Any one missing or failing blocks. A pretty summary score can never paper over a missing family. *Connects all five.*

3. **P3 — Memory, knowledge, and belief that never collide.** Three layers with strict jobs: **memory** finds and ranks things (but can't decide truth), **knowledge** produces provenance-bearing assertions (but can't decide if they're usable for *this* decision), **belief** decides usability-for-a-purpose (but can't authorize a mutation). "Forget" means hide-from-working-set, never delete; authoritative history is always read live from its real log, never cached as if authoritative. *Connects S2+S4+S5.*

4. **P4 — An inventory of what 036 already has vs. what's missing.** Each assumed capability is tagged **Present** (authority ledger, head/epoch checks, replay, budgets, receipts, rollback windows — all exist in source), **Shadow-only** (dark adapter, shadow parity, per-mode flip — exist but inert), **Missing** (graph compiler, belief reducer, policy compiler, durable gate/refusal journal), or **Adapter-owned** (graph semantics you must build outside the authority core). The minimum build to cut over is a six-piece adapter slice, *not* a second authority system. **Honest limit: this is a static file inventory, not proof anything is deployed or works.** *Connects S1+S2+S3+S5.*

5. **P5 — A clean boundary between graph, subgraph, and worker.** A fixed vocabulary of what a worker (LEAF) may do (`READ_CONTEXT`, `CALL_MODEL`, `CALL_TOOL`, `EMIT_ARTIFACT`, `REQUEST_SUBGRAPH`, `RETURN_RESULT`) and how it escalates (`ASK_HUMAN`, `REQUEST_BUDGET`, `REQUEST_CAPABILITY`, `REPORT_BLOCKER`, `ABSTAIN`). A child subgraph can only *narrow* its parent's budget/policy/deadline, never widen them, and can't outlive its parent. *Connects S1+S3+S5, hardened by S2 fencing.*

6. **P6 — One typed state machine for the whole gate stack.** Return-admission → evidence → belief → convergence → org-policy → human-gate → authority, each a typed outcome with a reason code and an owner. Monotonic: an early failure can't be rescued by a late score, and an early success grants no late authority. Every block records who blocked, why, and against what digests. **Reconciled:** the target graph "convergence reducer" governs only terminal eligibility; S5's shipped `StopDecision` still owns per-loop stopping today and is kept, not replaced. *Connects all five.*

7. **P7 — One rollout/rollback dependency graph.** Not five separate stage lists glued together — one 13-step DAG (freeze baselines → freeze contracts → build mutants → reuse 036 dark adapters → build graph/harness/knowledge in parallel → join → fenced writes → parity → recovery drills → promotion certificate → per-mode reversible cutover → rollback-window watch → retire legacy). Every stage leaves behind its own rollback assets. *Connects all five.*

8. **P8 — One measurement + disagreement-arbitration protocol.** Seven measurement families (correctness, epistemics, harness, governance, performance, recovery, rollout), each metric bound to its population, exclusions, digests, and mode — a missing baseline blocks promotion, it never silently becomes zero. When owners disagree, the *earliest* jurisdiction wins, policies compose as `DENY > ASK > ALLOW`, a human can't override `DENY`, and unresolved conflicts stay `blocked_disagreement`. *Connects all five.*

---

## The six tensions between studies, and how they resolve

1. **Curated memory vs. settled belief** → memory only reshapes *retrieval*; it can't rewrite assertions, resolve contradictions, or authorize a stop. Belief stays a deterministic fold over reference-closed assertions.
2. **Programmable worker vs. typed subgraph** → a worker adapts *within* a closed local vocabulary; anything bigger (parallelism, new capability, topology change) returns as a typed proposal to the graph.
3. **"Prefer newer" vs. semantic supersession** → recency only breaks ties *after* provenance, contradiction, and supersession are processed. Newer never means truer.
4. **Many projections vs. one truth** → every view (memory, metrics, checkpoints, parity results) declares its owner, source cut, and freshness and is rebuildable; authoritative records stay in their owning ledgers.
5. **Target authority vs. 036-dark reality** → current and target modes share the same evidence trace but have different final owners; the design never lets target doctrine be misreported as current enforcement.
6. **Completeness vs. bounded autonomy** → "complete" means accounting for every obligation *including* blockers and dead ends; a bounded loop may honestly end `abstain`/`blocked`/`exhausted` without faking a success.

---

## What is genuinely settled vs. what is still open

**Settled at design level:** proposal-vs-authority separation; the two-mode authority contract; stable-org-graph vs. per-run-work-graph; typed compiled IR + sealing; graph/loop composition; ledger-derived replay with disposable projections; claimant fencing; prospective-truth admission; durable context-sensitive gates; authority-zero refusal; memory/knowledge/belief non-collision; the closed LEAF/escalation boundary; typed gate states + jurisdictional arbitration; conjunctive promotion evidence; shadow-first, mutant-gated, reversible rollout.

**Still open (the honest gaps):** an *operational* audit of 036 (not just a file inventory); graph identity/evidence-resolver implementation; durable gate/refusal persistence; recursive sealed-subgraph implementation; multi-host fencing; **issuer/trust-root security** (who may mint capabilities and compile policy — S3's threat-model hole); concurrency-under-contention behavior; belief calibration and retention policy; per-mode cutover ordering; every numeric threshold; and every production-fitness claim.

---

## What actually comes next (the one real recommendation)

No amount of further design closes the gap. The next evidence class is **one mutant-driven shadow vertical slice**:

1. Freeze a representative deep-research corpus and the exact legacy build.
2. Record legacy behavior fully (outcomes, causal prefixes, replay hashes, p50/p95 latency, token/tool/cost, receipts, recovery time, gate timing).
3. Compile *one* typed graph and run its sealed nodes through the whole return → evidence → belief → policy machine.
4. Fire the 036 dark adapter only *after* the legacy result, and prove **zero externally visible difference**.
5. Inject ~15 mutants (wrong identity, unknown action, budget widening, malformed return, missing evidence, causal reorder, stale belief, premature convergence, policy bypass, stale gate/head/epoch/fence, lost never-forget refs, receipt loss, rollback crash) and require **each to fail at its expected earliest owner**.
6. Require deterministic replay, zero unauthorized appends, complete reference closure, passed recovery drills, and fully reported performance deltas.

Even a perfect run of this **would not** authorize production cutover — it moves the program from *integrated design* to *implementation-qualification*, one measurable step, reversibly.

---

## The convergence story (and its honest caveat)

Ten forced xhigh rounds, stop reason `maxIterationsReached`. Recorded novelty: `0.88 → 0.82 → 0.76 → 0.91 → 0.72 → 0.66 → 0.63 → 0.69 → 0.04 → 0.03`. The spike at round 4 (0.91) is real signal — that round replaced *assumed* 036 capabilities with the four-state inventory and the six-piece minimum build (P4), the single most information-dense move in the run. The collapse to 0.04/0.03 at rounds 9–10 came from finding no new component and converting the last uncertainty into the measurable shadow experiment above. **Caveat:** this novelty series is executor-generated telemetry, not an independent measurement — it describes a trajectory of declining conceptual novelty, not a proof of completeness or correctness.
