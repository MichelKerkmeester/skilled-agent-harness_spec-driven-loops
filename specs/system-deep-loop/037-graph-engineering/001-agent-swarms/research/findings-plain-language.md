# Repo #1 (agent-swarms) — All Findings & Recommendations, in Plain Terms

> Plain-language companion to `research.md` (the 20-iteration synthesis). Same conclusions, translated out of the technical vocabulary. Where this doc says "the design says," the authoritative, citation-backed version is the correspondingly-named section of `research.md`.

---

## The one-sentence takeaway

Turn `system-deep-loop` into a graph **gradually**, and make the graph a **planner that only proposes** the next steps — while the security-and-bookkeeping layer we're already building (the "036" work) stays the *only* thing allowed to actually approve, record, and undo those steps.

---

## Part A — The core idea: the graph *proposes*, 036 *authorizes*

Right now our deep-loop is basically a **line**: do iteration 1, then 2, then 3… A graph would let us describe work as **boxes and arrows** — boxes are units of work, arrows are "this feeds into that" — so independent work can run side by side, decisions can branch, and quality checks can gate what happens next.

The single most important finding: **the graph must never become the source of truth.** In agent-swarms, the graph's saved state (its "checkpoint") is treated as authoritative, and that's their weak spot. Our design flips it: the graph is a *suggestion engine*. Every time it wants to actually commit a step, it has to ask the 036 layer for permission, and 036 writes the permanent record. If the graph's memory is ever lost or corrupted, we can rebuild it from 036's permanent log — never the other way around.

Second most important: **don't start by letting the system invent its own graphs.** Start with hand-written, predictable graphs, prove they behave exactly like today's line-based loop, and only much later allow auto-generated workflows.

---

## Part B — The seven layers, kept deliberately separate

The design insists on **seven distinct layers** that people usually smush together. Keeping them apart is what makes it safe:

1. **Authority layer (036)** — the bouncer + ledger. Approves each step, records history, tracks side-effects, budgets, and sign-offs. The only source of truth.
2. **Organization graph** — the stable "org chart": which roles/agents exist, what each is allowed to touch, trust levels, budgets. Changes rarely. *Decides who may act — schedules nothing.*
3. **Work graph** — the plan for *one specific job*. Can add/split/cancel steps as evidence comes in, but can never grant itself new powers.
4. **Compiled execution graph** — the frozen, checked, runnable version of a work graph (like compiled code vs source).
5. **Ledger + checkpoint** — the ledger is the real history; a checkpoint is just a disposable "fast-resume" snapshot pinned to a point in the ledger.
6. **Evidence graph** — a read-only map connecting claims → sources → findings → verdicts, for explanation and coverage. Never controls execution.
7. **Knowledge graph** — a retrieval structure (facts and their relationships) for *finding* information. Can suggest evidence; can never approve an action.

Plain version: **who's allowed to act (2), what we're doing now (3), the safe runnable form (4), what actually happened (1, 5), and two "look-things-up" helpers (6, 7) — all separate, so a lookup tool can never accidentally authorize a real action.**

---

## Part C — The eight design decisions (one per research angle)

### 1. A strict, versioned blueprint format ("typed graph IR")
Define one fixed vocabulary for describing workflows: box types, arrow types, inputs/outputs, how results merge, retry/timeout/budget rules, whether a box has side-effects. The compiler **rejects** anything malformed — unknown box types, mismatched connections, loops that weren't declared, dead-ends, ambiguous routing. You *can* run arbitrary code inside a box, but the arbitrary code is hidden behind a declared, versioned interface — so the workflow itself stays inspectable and replayable. **Every step the graph wants to take becomes a permission request to 036; the graph can't mark its own work "done."**

### 2. Smarter scheduling: barriers, pipelines, and safe parallel writes
Separate two questions: *"is this step ready to run?"* from *"how many run at once?"* An arrow can say it needs **all**, **any**, **a quorum**, or **a stream** of its inputs. Only force everyone to wait at a "barrier" when a step genuinely needs the complete set (e.g. comparing all results); otherwise let finished items flow ahead so one slow worker doesn't stall everything. agent-swarms does the good part — it merges parallel results in a *fixed order* (not whoever-finishes-first), which keeps runs reproducible — but it over-uses barriers. **For parallel writes specifically**, require an explicit plan that declares what each writer touches, checks for conflicts up front, and — critically — validates a "fence" at write time so a stale worker can't sneak in a late write. (This is what unblocks the "waves" feature our runtime currently refuses to do because it isn't safe yet.)

### 3. Quality checks that actually steer the run ("eval verdicts as edges")
Make evaluation results *control flow*, not just reports. A verdict carries a clear enum (pass/fail/escalate), the deterministic check results, which judges voted, confidence, how risky the action is, and a certificate. **Rule of thumb: a verdict that doesn't pick which arrow to follow is just a report, not a gate.** Run cheap deterministic checks first; use independent/diverse AI judges only for genuinely fuzzy criteria; require blinded, higher-bar review for irreversible/high-stakes steps. And **confidence alone can never authorize an irreversible production write** — no matter how sure the model is. Before trusting any gate, shadow-test it, pin its version, and feed it known-bad cases to confirm it actually catches them.

### 4. Crash-safe resume, real-world effects, and human approvals
The permanent ledger is history; a checkpoint is just a speed-up. If a checkpoint is missing or corrupt, throw it away and rebuild from the ledger. **A missing checkpoint must never be read as "the effect didn't happen."** For steps that touch the outside world (send an email, write a file), record intent → do it → confirm, so that on resume you can classify each as *not-done / done / unsure / conflict* and only safely retry with an idempotency key. **Human approvals are first-class ledger events**: an approval is tied to an exact workflow version and evidence; a stale or expired approval is rejected; timeouts and reassignments are new events, never silent edits. (agent-swarms parks a run waiting for human approval — good — but its checkpoint saves can silently fail, which we fix by making the ledger authoritative.)

### 5. Loops become well-defined mini-workflows ("typed subgraphs")
Today agent-swarms' loops stop when the model literally writes the word "DONE" — self-declared and unreliable. Replace that with loops that are **proper mini-workflows** with a typed exit: `converged`, `exhausted`, `blocked`, `failed`, or `cancelled`. Text like "DONE" can be *input* to a judge, but never the authority. Each mode gets its **own** loop profile: research stops on evidence novelty/coverage, review on verified-finding closure, improvement on evaluator-approved gains, council on quorum. Their scratch work stays isolated; they hand each other only clean, typed results. **And dedupe "have we seen this before?" against everything ever observed — including rejected ideas — or the loop rediscovers the same dead ends forever.**

### 6. Prove the new engine behaves identically before trusting it ("parity")
Before any switch-over, build a library of **golden test workflows** and run both the old and new engines on them, comparing the *meaningful* outcomes (which steps ran, how results merged, which branches were taken, budgets charged, effects, checkpoints, final certificates) — while ignoring cosmetic differences like timestamps or exact wording. The test set must include the nasty cases: unknown routes, out-of-order merges, missing inputs, write conflicts, retry exhaustion, judges disagreeing, stale approvals, lost/corrupt checkpoints, cancellation, mid-run topology changes, budget exhaustion. **This matters because agent-swarms' own parity test only checks that the code *looks* similar, not that it *behaves* the same** — a real gap we shouldn't copy.

### 7. Two kinds of graph: the stable "org chart" vs the per-job plan
Keep a **stable organization graph** (roles, permissions, budgets — our existing mode-registry is basically the seed of this; compile it into one versioned source instead of duplicating it) separate from **per-run work graphs** that are generated fresh for each job. A generator may *propose* a work graph, but a deterministic compiler checks it against the org rules — schema, cycles, permissions, budgets, gates — before sealing it to run. **The generator can never mint new tools, data access, authority, or budget.** Mid-run changes are proposed as patches with a new version; already-completed steps keep the version they ran under. (agent-swarms' separate "draft vs published" graph is the real-world proof this works.)

### 8. Smarter information retrieval ("hybrid knowledge/evidence routing")
Add a simple classifier that routes each lookup to the right method: exact IDs/symbols → keyword search; fuzzy meaning → vector search; relationship/multi-hop/"what contradicts what"/"what superseded what" → graph search; mixed → do several and re-rank by source quality. Store facts with controlled relationship types, a source pointer, a confidence, and *time validity* (valid-from/until) so **contradictions keep both sides and supersession closes the old one instead of deleting history.** Auto-linking two records as "the same entity" is gated: exact curated IDs can link automatically, but fuzzy merges stay proposals needing review (a wrong merge compounds across hops). **Retrieved paths are evidence candidates — never authorization.**

---

## Part D — When NOT to use a graph (the guardrails)

Just as important as where to use graphs is where **not** to:

- **One quick deterministic command or small transform?** Keep it a plain direct action. No graph.
- **Every step depends on the previous one, or you're still exploring and don't know the shape yet, or a human wants to approve each step?** Keep it a single loop.
- **An ordinary bounded retry** (no independent state, roles, gates, or convergence)? Don't dress it up as a subgraph.
- **Don't use a barrier** where streaming would do; **don't parallelize writes** with unknown conflicts or without the write-time fence.
- **Don't use graph-only retrieval** for simple lookups, and don't build a knowledge graph where exact curated IDs already solve identity.
- **Never give an autonomous gate authority over irreversible production writes** — regardless of confidence.
- **Never let a dynamically generated graph expand its own powers, data access, or budgets, or skip gates.**
- **Don't adopt graphs for novelty or because a diagram looks neat.** Require either two genuinely independent jobs, or a real branch/gate/subgraph need — *plus* a measurable expected benefit and a simpler fallback.

---

## Part E — The rollout order (safest first, riskiest last)

A concrete 9-step path where nothing changes who's in charge until it's proven:

1. **Shadow only:** emit the graph blueprint + normalized traces from today's modes; the old code still runs everything. Zero risk.
2. Run **pure, side-effect-free steps** in the new engine and diff their traces against the old.
3. Add **read-only parallelism** (fan-out with proper readiness + deterministic merge) — more speed, no external writes.
4. Add **safe parallel writes** (conflict admission + fences + effect intents).
5. Add **typed quality gates, certificates, durable human approvals, and effect recovery**.
6. Add **mode-specific loops** (the typed subgraphs).
7. Add **generated work graphs + mid-run patches** (highest topology risk — only after the compiler and parity are mature).
8. Add the **hybrid knowledge/evidence retrieval** as a non-authoritative helper.
9. **Only now** cut each mode over one at a time — and only after that mode passes golden-trace parity, known-bad-case tests, a rollback drill, a cost/latency baseline, effect-recovery proof, and a sign-off certificate.

---

## Part F — The honest bottom line

- **This is a design, not a finished decision.** The research is explicit and honest about it: no amount of *further reading* can prove the graph engine is actually faster/cheaper/better. **The next real evidence is a small shadow prototype run against golden traces with measured baselines.** Until that passes, treat everything above as a well-argued blueprint, not a green light to switch anything.
- **What agent-swarms gave us:** proof that the good primitives work in a real product — fixed-order result merging, fail-closed branching, pinned draft/published graphs, human-approval parking, nested sub-workflows, knowledge-graph retrieval. **What it warned us about:** its weak spots (self-declared "DONE" loops, best-effort checkpoints treated as truth, look-alike-not-behave-alike parity tests) are exactly the places our 036 authority layer has to stay stronger.
