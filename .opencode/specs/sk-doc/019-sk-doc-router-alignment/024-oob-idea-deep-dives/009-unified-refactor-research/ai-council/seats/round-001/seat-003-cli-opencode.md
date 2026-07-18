---
round: 1
seat: seat-003
executor: cli-opencode
lens: "Migration / adaptivity realist"
status: ok
timestamp: 2026-07-18T00:00:00.000Z
simulated: true
---

# seat-003: Migration / adaptivity realist / cli-opencode (simulated)

## Mandate
Make it shippable and make it learn — safely. Own the reversible gated migration, the real-hub falsification (sk-code bundles, deep-loop shared packets, mcp-tooling transports), the `(T,R,P)` posture, and the offline correction overlay as the fleet's only learning mechanism. Insist the design is a shadow compiler + additive gates, never a rewrite.

## Confidence
89 / 100 — high on migration; medium on the overlay's eventual payoff, which no corpus has demonstrated.

## Seat Output

### Proposed plan
Do not rewrite the router; wrap it. Compile-only first, then dual-read, shadow-evaluate, per-hub canary behind a fenced selector, then (only after the base is proven) the offline overlay, then destination transactions, then cleanup. Activate one hub at a time in increasing blast-radius order: `mcp-code-mode → sk-code → system-deep-loop → mcp-tooling`. Legacy stays serving-authoritative until an atomic activation binds the compiled tuple to its human-readable fence.

Treat `(T,R,P)` as the coordinate system that *explains* the shipped keep-1/flip-4 verdict (different hubs sit at different defensible corners) and lets each new hub pick a corner deliberately instead of inheriting one by accident. The overlay learns the **vocabulary→destination assignment** — not weights, which are a uniform, inert `4` per GLM's sourced fact — and its training signal is Idea 4's handoff records (closed-loop). But it serves only after replay + safety/parity + independent human approval, and it is off by default.

### Reasoning
The repo already has most of the safety machinery: frozen weights, an opt-in shadow sink, a bounded calibration reducer that refuses auto-promotion, atomic temp/fsync/rename, and two-phase promotion with preimage drift checks and rollback. The migration is mostly *wiring existing seams together*, which is why it is reversible and low-drama. Falsification: nine break-cases (surface bundles, same-packet deep modes, Figma judgment dependency, explicit-command-vs-lexical, advisor live/stale/absent, singleton near-tie, zero-signal, multi-leg pre-commit failure) all repair in compiled data or destination VERIFY — no hub-name conditional.

### Risks and trade-offs
I disagree with the majority on migration order: Terra put `mcp-tooling` second (transports before bundles) because a manifest-backed transport is simpler than `sk-code`'s ordered bundles. I concede the majority (mcp-tooling last) is safer because external effects + cross-hub judgment are the highest blast radius — I record this as an open question, not a settled call. I also concede the minimalist's point that the overlay contributes zero to the load-bearing N=1 case; I keep it, but last and optional.

### Assumptions and evidence gaps
- Assumes a curated, privacy-reviewed routing fixture corpus for overlay validation exists — it does not yet (open question 7).
- `(T,R,P)` provenance is single-model GLM inference with no live execution — treat `P = offline-learned` as the least-validated corner.

### Alternative challenged
Rejected big-bang migration and rollback-by-regeneration. Failure mode it prevents: unattributable regressions and a rollback that cannot guarantee restored bytes after external effects have already committed.
