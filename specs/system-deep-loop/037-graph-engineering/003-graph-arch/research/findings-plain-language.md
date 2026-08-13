# Repo #3 (graph-arch / GraphARC) — All Findings & Recommendations, in Plain Terms

> Plain-language companion to `research.md` (the 20-iteration synthesis by GPT-5.6-SOL xhigh, independently verified by DeepSeek V4 Pro). Same conclusions, jargon removed. This study **builds on repo #1 (agent-swarms)** and **repo #2 (graphene-main)** — every point says whether GraphARC *confirms, sharpens, extends, or contradicts* a prior conclusion.

---

## The one-sentence takeaway

GraphARC is the **governance/permissions** reference — and its sharpest lesson is a *negative* one: **checking that a plan is well-formed ("admission") is not the same as authorizing it.** Its "this plan passed the checks" object is just ordinary data any in-process code can forge, which nails down that our 036 authority layer must **re-verify everything** and never trust a checkpoint, trace, or approval object as a permission slip.

---

## How this fits with repos #1 + #2

GraphARC is a Python wrapper that makes a model *propose* work, then deterministic code *checks* the proposal (registered node types, policy, budget, depth, no-cycles, reachability) before anything runs. It adds the one plane the prior studies were thin on: a real **organization policy** engine (immutable rules, deny→ask→allow, tenant/role scope, audit). Headline verdict: it **confirms** the "graph proposes, 036 authorizes" architecture and contributes a governance layer worth adapting — but it proves, concretely, that admission ≠ authorization.

---

## The eight governance decisions (plain terms)

1. **R1 — A "passed the checks" proof, not a permission slip.** GraphARC's admission result is forgeable in-process data. **Recommendation:** a signed `GraphAdmissionProofV1` from a *trust-separated* signer (running outside the planner's trust domain) that 036 treats as a *precondition* and then independently re-validates (actor, capability, evidence, policy, epoch, ledger head, budget, gate, fence, exact event). *(Confirms the architecture; contradicts "admission = authority.")*

2. **R2 — Seal the compiled plan so it can't be swapped mid-flight.** GraphARC's compiled graph has no durable, content-addressed manifest, so a body/argument/route can change between "checked" and "executed" (a TOCTOU seam). **Recommendation:** a content-addressed `SealedCompiledGraphV1` (all bodies, args, writes, routes, gates hashed), with live authority re-checked separately at execution.

3. **R3 — Compile the org chart into governed policy, keep the audit trail.** GraphARC's policy is good (immutable, digest-bound, deny→ask→allow, tenant/role) but its *compiled* form can drop the rule-ID and audit link. **Recommendation:** `OrganizationGraphPolicyV1` that preserves rule provenance and maps every decision to a 036 audit record; the mode-registry becomes a *ceiling* generated work can narrow but never widen.

4. **R4 — One human-gate, not three half-gates.** GraphARC has three approval styles (planner files, policy callbacks, session holds) — and a direct `graph.invoke()` can bypass all of them. **Recommendation:** unify them into one durable, fenced gate bound to the exact consequence + live dependencies (extending repo #2's gate), with the raw runnable hidden so nothing can sidestep it.

5. **R5 — Refusals that are complete and inert.** GraphARC's admission returns *all* failure reasons at once with fix hints (better than fail-fast), but a refusal must never become a partial pass or an executable patch. **Recommendation:** compile/admission variants of repo #2's `TransitionRefusalV1` — full diagnostics, zero authority, "retry = a brand-new candidate."

6. **R6 — Traces and OTel are pictures, not the source of truth.** GraphARC's replay truncates values, drops reducer identity, *guesses* fan-out parentage, and falls back to last-write-wins for unknown reducers — and its OTel SDK integration is unverified. **Recommendation:** graph events live *inside* the 036 ledger; replay is reference-closed (unknown reducer ⇒ "unavailable," never guessed); OTel is a one-way managed export with receipts.

7. **R7 — Budget as reserve→debit→settle, not a fresh counter.** GraphARC's meter can reset per-invoke on resume and can't enforce unreported provider spend. **Recommendation:** admission-estimate → authorized reservation → debit-before-dispatch → settle-from-receipts, rebuilt from durable history on resume (never a zeroed meter). Failed attempts are charged.

8. **R8 — Prove no bypass with governance mutants before cutover.** GraphARC's stage examples are good *seeds* but green tests ≠ promotion evidence. **Recommendation:** a governance mutant corpus (forged admission, policy-rename laundering, stale approval, budget double-spend, trace/audit disagreement…), each required to fail at its *earliest* owner, gated through staged promotion `G0→G7` with 036 owning the actual cutover.

---

## GraphARC's "do NOT copy" list

Forgeable admission object · compiled-policy drops rule-ID/audit · session gate bypassable by direct invoke · per-invoke budget meter resets on resume · replay guesses unknown reducers (last-write-wins) · OTel parentage inferred / SDK unverified · contradiction detection writes-then-detects · materializer has no nested-subgraph composition. Each hardens a rule for us.

---

## The honest caveats — and the verification story

- **DeepSeek V4 Pro returned REWORK** (a harsher verdict than repo #2's PASS-WITH-FIXES) — and it was right. It caught that the "admission ≠ authorization" finding was **overclaimed as "decisive"** and aimed at a *strawman* (no prior decision actually said admission *is* authorization); a **self-contradiction** about why the run stopped; a **"28 mutants" count** that didn't match the ~16 categories listed; and **missing framing** (no explicit threat model, no issuer-security or 036-capability audit). **All of it was applied** to `research.md`: the finding is recast around an explicit threat model, the stop-reason reconciled to the iteration cap, the false count dropped, the taxonomy relabeled honestly, and a new **"Unexamined Assumptions"** section added.
- **Biggest honest gap (now documented):** the design offloads a ~10-item re-validation to 036 but **assumes 036 has those primitives** rather than auditing it — if 036 doesn't, the graph adapter must build them.
- **Design-level, no measurements.** Zero latency/cost numbers; the governance adds real per-transition overhead that's currently unbounded. Next evidence = a prototype with the mutant corpus + measured baselines.
- **Stopped at the iteration cap** (novelty ~0.60), not convergence.

---

## Where repos #1 + #2 + #3 leave the program

Three reference implementations now converge on the same spine — **a graph that proposes, a 036 authority that decides/records/fences, and disposable everything-else** — approached from three angles: a product runtime (#1), a formal event-sourced belief engine (#2), and a governance/admission layer (#3). GraphARC's contribution is the *permissions* plane (org policy, admission-as-precondition, staged promotion) and a blunt reminder that **structural checks are never authority.** Repo #4 (graph-engineering-master, documentary) is the final study.
