# Study #5 (NOOA paper + blog theory) — All Findings & Recommendations, in Plain Terms

> Plain-language companion to `research.md` (the 20-iteration synthesis by GPT-5.6-SOL xhigh, independently verified by DeepSeek V4 Pro). This is the **loop/harness-layer** study — the counterpart to the four *graph-layer* studies. Subject: NVIDIA's "Object-Oriented Agents" (NOOA) research paper (primary) + the 12 blogs' loop/harness first principles.

---

## The one-sentence takeaway

Where the four graph studies asked *"how should agents be wired together and who's allowed to change state,"* this one asks *"how should a single iteration of our own loop actually work"* — and the answer, borrowed from NVIDIA's NOOA paper, is: **make each iteration a typed, self-checking call** (a bad result becomes precise feedback, not a silent failure), **let the agent curate its own working memory** (safely), and **give the worker a small set of read-only ways to ask about state** instead of dumping everything into the prompt — all of it staying *below* the authority layer.

---

## What NOOA is (and its one big honest limit)

NOOA treats an agent as a plain Python object: methods are actions, fields are state, type annotations are contracts. Its standout ideas: **validated LLM loops** (the return type is *executable* — an invalid answer is fed back as a specific error and the loop retries; only a valid value returns), and **agent-curated long-term memory** (the agent deliberately remembers/searches/forgets, with background reflection that merges duplicates, abstracts, and prunes). It's benchmarked (SWE-bench, Terminal-Bench, ARC-AGI-3).

**The limit that shapes everything:** NOOA is a *single agent, in-process, and not authority-aware*. Its ideas are useful, but none can become permission — so every recommendation below is a *proposal beneath our 036 authority layer*, never a bypass.

---

## The six things to adopt (all subordinate to 036)

1. **A typed per-iteration result with local repair (`IterationResultV1`).** Each iteration returns a checked envelope; a malformed result gets ≤2 shape-repair turns *before* anything is written, then falls back to the existing redispatch. Crucially: **type-valid ≠ evidence-accepted ≠ converged ≠ authorized** — four different gates.
2. **Three separated evaluation layers.** (A) is the return the right *shape*? (B) is the *evidence* real and the trajectory honest? (C — 036 only) may this *transition* happen? Plus the existing convergence vote as a separate stop decision. No single score or judge is allowed to do all of them.
3. **Prompt-pack → a small read-only "ask about state" facade.** Keep deterministic rendering, but let the worker call bounded, pinned, audited reads (`state_summary()`, `open_questions()`, `coverage_gaps()`, `recall_continuity()`…) instead of pre-stuffing everything. These *reveal* state; they can't change control, scope, or authority.
4. **Agent-curated continuity as a non-authoritative projection.** Let an iteration propose `remember`/`associate`/`abstract`/`suppress-from-working-set`; the reducer owns acceptance. "Forget" = retrieval suppression/decay, **never deletion**. Hard never-forget classes (source assertions, contradictions, decisions, refusals, budgets, receipts, rejected approaches) — and authoritative history is always *read through* from its real log, never cached as authoritative in the memory view.
5. **Programmable tactics inside a *fixed* LEAF.** A worker may run helper code, batch, retry, query events — but may **not** spawn its own lineages, widen permissions, change the executor, or touch the lock. Bigger needs become typed escalation the workflow decides on.
6. **Evaluate the harness, not just the research.** Ship a pinned mutant corpus *first* (stale recall, reflection blur, runaway repair, context pollution, capability-escalation attempts), each required to fail at the right layer with zero forbidden effects.

---

## The honest caveats — and the program-level correction

- **DeepSeek V4 Pro returned PASS-WITH-FIXES, and its biggest catch corrects the whole program:** the synthesis (inheriting the framing from studies 1–4) described **036 as an *existing, operational* authority** — but 036 actually **runs dark today** (`Status: In Progress`; its ledger authorizes *after* the legacy result is already final and returns the legacy result unchanged; cutover is *planned*). So "only 036 may admit a transition" is a **target-state invariant the whole design is written toward — not something the runtime currently enforces.** Corrected here; worth keeping in mind for studies 1–4 too, which used the same framing.
- **Data-integrity flag DeepSeek caught:** the run's novelty score fell in a *suspiciously perfect* line (0.96→0.03 in regular ~0.05 steps), which looks executor-generated rather than genuinely measured — so "the run converged" is trajectory metadata, not proof. (Same family as the synthetic-timestamp quirk from repo #1 — the leaf models sometimes emit plausible-but-fabricated telemetry.)
- **External research, author-reported.** NOOA's benchmarks weren't reproduced here; the paper is an idea source, not a dependency we control. Type validation proves *shape*, not truth; memory curation is *loop-learning*, not truth or authority.
- **Design-level, zero measurements.** The prototype must measure repair budgets, memory recall/precision, context-API token/latency, and harness mutant kill-rate.

---

## Where this leaves the program

Five studies, two layers: the **graph layer** (studies 1–4: orchestration, belief, governance, knowledge doctrine) and now the **loop/harness layer** (study 5: validated iterations, agent-curated memory, model-callable context, programmable-but-bounded tactics). Together they describe a complete agent-loop engine — *a graph that proposes, a loop that self-checks and learns, and a 036 authority that (once cut over) decides and records.* The single remaining evidence class is unchanged: **a mutant-driven shadow prototype with measured baselines** — and study 5 is explicit that P7 (the test corpus) should land *before* any of the features.
