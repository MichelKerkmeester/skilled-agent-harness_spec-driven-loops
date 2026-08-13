# Repo #2 (graphene-main) — All Findings & Recommendations, in Plain Terms

> Plain-language companion to `research.md` (the 20-iteration synthesis, written by GPT-5.6-SOL xhigh and independently verified by DeepSeek V4 Pro). Same conclusions, translated out of the technical vocabulary. This study **builds on repo #1 (agent-swarms)** — every point says whether graphene *confirms, sharpens, extends, or contradicts* a repo-#1 conclusion.

---

## The one-sentence takeaway

Repo #1 gave us the *blueprint* for a graph-based deep-loop; **graphene gives us the working machinery for the four hardest parts** — a real "what do we still believe?" engine, a clean "rebuild graph state from the ledger" recipe, a rigorous way to prove two engines behave identically, and the exact rule that stops a stale worker from corrupting state — while its *own bugs* double as warnings about what our authority layer must do better.

---

## How this fits with repo #1

graphene is a small, purpose-built Rust engine that coordinates a work-graph through an append-only event log plus a "fold" (replay the events to compute current state), with a built-in **belief/truth-maintenance** layer. It executes no work itself — it just records and reasons. That makes it a much closer model for what we'd actually build than agent-swarms (a full product). The headline verdict: **graphene confirms repo #1's architecture and hardens seven under-specified parts into concrete (proposed) contracts** — it does *not* justify replacing repo #1's design or our 036 authority layer.

---

## The seven design decisions (plain terms)

### P1 — A real "what do we still believe?" engine
Today our loop decides it's "done" partly by counting how many contradictions exist. That's crude. graphene shows a better way: every fact has a **truth state** — `IN` (believed), `OUT` (withdrawn), `BOTH` (contested), or `NEITHER` (unsupported) — and when one fact gets contested, that automatically ripples out to everything built on it. **Recommendation:** give our convergence a `BeliefProjectionV1` that blocks "done" when a *load-bearing* premise is contested/stale/unsupported — not merely when global contradiction-count is high. Crucial caveat graphene taught us: only publish this answer once it has provably **settled** (reached a stable fixed point); graphene's own version can stop early with changes still pending, which we must not copy. *(Sharpens repo #1's knowledge-graph + loop-convergence ideas into runnable code.)*

### P2 — A clean recipe for "rebuild the graph from the ledger"
graphene's fold is the concrete model repo #1 wanted: graph state is *derived* from the event log and is therefore disposable — lose it, rebuild it. **Recommendation:** a `GraphProjectionReducerV1` that reads only 036-authorized events and produces throwaway graph/belief/claim views, with checkpoints that are just speed-ups (verify or discard). **The big contradiction:** graphene's `compact` command *deletes* old events once current state matches — fine for a disposable cache, **fatal for an authority ledger** (it erases audit history, denials, provenance). Our 036 ledger must never do that. *(Sharpens repo #1's "graph is a projection over 036, checkpoints aren't authority.")*

### P3 — A rigorous way to prove two engines behave identically
Repo #1 said "test old-vs-new engine on golden cases." graphene shows both the right primitive (compare exact replayed state, byte-for-byte) **and the trap**: many of its own golden tests only check that a *file exists*, not that the *behavior* happened. **Recommendation:** parity must compare the whole **causal sequence** (each step's request → authorization → outcome → resulting state), not just the final snapshot — "the endings match" can hide a divergence in the middle. Include a fixed set of adversarial cases (A1–A7): stale workers, non-settling beliefs, open ledger cuts, truth-admission races, refusals mistaken for successes, stale human approvals — each with a *required* earliest point it must fail. *(Extends repo #1's parity decision into a much stronger contract.)*

### P4 — The exact rule that stops a stale worker corrupting state
This is graphene's sharpest lesson. Its claim/lease system is stronger than agent-swarms' — but its "mark this node done" call **only checks that *some* claim is active, not *which* worker owns it.** So a revoked worker can still commit its stale result under a successor's claim. **Recommendation:** every state-changing commit must carry the **claimant's identity + a monotonic fence token + the expected version**, and the store must atomically re-check all three. This *confirms* repo #1's rule that "leases alone are insufficient," and it means graphene does **not** unblock our rejected parallel-write "waves" — waves still need full conflict analysis + fences. *(Confirms + sharpens repo #1's scheduler/waves decision; contradicts graphene's own safety claim.)*

### P5 — Handling "this fact replaced that one" and "these can't all be true"
graphene has the right ideas — order facts by *when they were observed* (not when they were recorded), and mark impossible combinations ("nogoods") — but its production code **skips its own time-ordering helper** and only detects impossible sets *after* admitting them. **Recommendation:** order successors by `(observed-at, authorized-sequence)`; and **preview every truth-changing write to a settled fixed point *before* committing it**, rejecting anything that creates a cycle, a competing successor, or a completed impossible set. Run all truth-writers through one serializable admission point (relax only with proof they're truly independent). *(Extends repo #1's hybrid-retrieval decision; contradicts graphene's weak production paths.)*

### P6 — Refusals that tell you how to recover
graphene makes "no" a **structured result** — a stable code, a typed reason, and a *mandatory suggested alternative* — instead of an exception. Much better for automated recovery. **Recommendation:** a `TransitionRefusalV1` with a stable code, the boundary that refused (compile / auth / claim / fence / budget / belief / human-gate / effect), and advice on how to form a valid next request — but it carries **zero authority** (no capability, no patch, no bearer token). Advice describes a future request; it never *is* one. *(Extends repo #1's failure-path handling.)*

### P7 — Human approvals that know their context is stale
graphene's human gates are strong locally (options, consequences, explicit timeout, silence ≠ approval) but don't bind the decision to the *world-state it was made in*. **Recommendation:** when a gate opens, snapshot the exact context (the load-bearing beliefs + their truth states, topology, policy, version, fence, expiry); when the human's choice is committed, atomically re-check that nothing load-bearing moved. If it did, **invalidate and re-open at a higher version** — never re-interpret an old "yes" against new facts. Timeout is a fenced system event, not a fake human answer. *(Extends repo #1's durable-human-gates decision.)*

---

## graphene's own gaps — the "do NOT copy" list

The research was honest about graphene's defects, and each one sharpens a rule for us:

- **`compact` deletes committed history** → never compact the 036 authority ledger; only disposable projections.
- **Supersession ignores its own time-ordering rule** → we order strictly by observed-time then sequence.
- **Impossible sets caught *after* admission** → we preview-to-fixed-point *before* committing.
- **Golden tests are "file exists," not "behavior happened"** → our parity asserts event shapes + intermediate states + negative controls.
- **"Done" doesn't check *which* worker** → we require claimant-ID + fence + expected-version on every mutation.
- **Human approvals lack live-context fencing** → we re-validate the decision's dependencies at commit.

---

## The honest caveats

- **Design-level, not proven.** Like repo #1, this is a blueprint. The next real evidence is executable adversarial tests (the A1–A7 mutants), race tests, shadow traces, rollback drills, and measured cost/latency/quality baselines — not more reading.
- **The run hit its iteration cap, not convergence.** It stopped at 20 iterations with novelty still at ~0.46 (not fully converged), so "no open conflicts" means "none found within the budget," not "proven none exist."
- **Independently verified.** DeepSeek V4 Pro reviewed the synthesis against the actual repo and returned **PASS-WITH-FIXES** — it caught real overclaims ("settles," "concrete contracts," "none"), a mislabeled verdict, and a mis-cited rollout table. **All of its fixes were applied** to `research.md` before this summary (grounding block added, claims hedged, verdict corrected, numbering disambiguated, the staged-delivery table marked as a reconstruction).

---

## Where repo #1 + repo #2 leave the program

We now have: the **architecture** (repo #1) + the **executable machinery for beliefs, ledger-fold, parity, and fencing** (repo #2), plus a hard list of anti-patterns from graphene's own bugs. Two reference implementations agree on the core: **a graph that proposes, a 036 authority layer that decides and records, and disposable everything-else.** Repo #3 (graph-arch, Python) and repo #4 (graph-engineering-master) will test whether that consensus holds or gets challenged.
