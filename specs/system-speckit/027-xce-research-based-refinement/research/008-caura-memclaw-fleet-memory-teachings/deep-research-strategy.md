---
title: "Deep Research Strategy — caura-memclaw (MemClaw) Fleet-Memory Teachings for Spec Kit Memory"
description: "New lineage (iters 001-020) mining the vendored caura-memclaw fleet-memory system for design teachings transferable to the LOCAL single-user Spec Kit Memory system, mapped to 027 children 002-008, with adopt/adapt/reject/defer verdicts + risk and first-class negative knowledge."
---

# Deep Research Strategy — Session Tracking

**Executor:** cli-opencode `openai/gpt-5.5-fast` --variant high / read-only / timeout 540s / orchestrator-driven parallel fan-out (width 4)
**Packet:** `research/008-caura-memclaw-fleet-memory-teachings/` (new lineage; folder-scoped iterations 001-020)
**Session:** `2026-06-06-008-caura-memclaw-teachings`
**Research target:** `external/caura-memclaw-main` (MemClaw — fleet memory for AI agents; Python; Postgres/pgvector; event-driven; MCP+REST; Apache-2.0 — design inspiration only)
**Consumer:** Spec Kit Memory — LOCAL single-user/single-tenant store (SQLite index + vector store, ollama nomic 768d); semantic+lexical triggers; importance tiers; causal edges; FSRS decay/co-activation; self-maintaining incremental index; shadow-first learning-feedback reducers; 37-tool MCP surface.

---

## 2. TOPIC

Extract concrete, evidence-cited design teachings from MemClaw that can refine the Spec Kit Memory system (027 children 002-008) or justify a new sub-packet. The central discipline: MemClaw is a **multi-tenant, fleet-scale, Postgres-backed** system; Spec Kit Memory is **single-user, local, file-based**. Every teaching must be judged for transferability under that mismatch. Per-teaching verdict in {ADOPT, ADAPT, REJECT, DEFER} with risk {LOW, MED, HIGH} and a target (027 child 002-008, or "new sub-packet"). Negative knowledge (fleet-scale features that must NOT be copied) is a first-class output.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (planned iterations 001-020)

Breadth sweep (001-012):
- [x] 001 write/save path: write-safety, dedup, idempotency, provenance, manual-edge protection -> 027/002
- [x] 002 recall/search/retrieval architecture: ranking, hybrid lexical+semantic, scope filtering -> search path
- [x] 003 governance: trust tiers, scoping (agent/fleet/cross-fleet), suppression, audit log -> tiers/multi-scope
- [x] 004 self-improving memory: outcome propagation (memclaw_evolve -> memclaw_insights), compounding loop -> 027/008
- [x] 005 indexing/embedding/enrichment pipeline: chunking, re-embed triggers, enrichment schema -> 027/003
- [x] 006 entity/relationship/graph modeling between memories -> 027/004 + 027/005
- [x] 007 lifecycle: retention, archive, purge, tombstones, idempotent lifecycle audit -> 027/004
- [x] 008 event-driven async pipeline: pubsub, publishers/handlers, reconciliation/consistency -> 027/006
- [x] 009 recall ranking / activation / decay / trust-weighted recall -> 027/007
- [x] 010 perf/latency/token-efficiency engineering (their headline axis) -> token-budget discipline
- [x] 011 MCP surface design + API surface ownership/stability governance (SemVer charter) -> mk-spec-memory 37-tool surface
- [x] 012 benchmark/eval methodology (LoCoMo/LongMemEval; what they can't measure) -> eval/ablation/dashboards

Deep second pass on highest-overlap surfaces (013-016):
- [x] 013 DEEP write-safety internals: dedup_review flow, idempotency keys, manual vs auto provenance -> 027/002
- [x] 014 DEEP self-improving loop internals: evolve->insights data model, shadow/active gating -> 027/008
- [x] 015 DEEP incremental indexing/enrichment internals: idempotent re-embed, fingerprints, change detection -> 027/003
- [x] 016 DEEP entity/relationship + lifecycle tombstone internals -> 027/004 + 027/005

Adversarial verification — refute the candidate teachings (017-020):
- [x] 017 ADVERSARIAL refute write-safety/dedup teachings (Postgres/multi-tenant vs SQLite/local mismatch)
- [x] 018 ADVERSARIAL refute self-improving/feedback teachings (fleet outcome-propagation has no single-user analog?)
- [x] 019 ADVERSARIAL refute indexing/governance/recall teachings (pgvector/scale assumptions; scope model mismatch)
- [x] 020 ADVERSARIAL refute MCP-surface/perf/benchmark teachings + finalize negative-knowledge ledger
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- No code copying from MemClaw (Apache-2.0 — design/pattern inspiration only; Spec-Kit-native re-implementation only).
- No implementation during research (report + proposal only; any code/spec change is a separate Gate-3 packet).
- No adoption of multi-tenant / fleet-scale / Postgres-specific machinery that has no meaning in a single-user local store — flag as negative knowledge instead.
- No swap of the embedding model (live = ollama nomic 768d); embedding teachings rescope TO it, never replace it.

---

## 5. STOP CONDITIONS

- Complete iterations 081-100 (>= 20), OR convergence (newInfoRatio < 0.05 across a full round), OR explicit operator stop.
- Headroom 101-104 reserved for gap-fill if adversarial round surfaces unverified high-value teachings.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
All 20 planned questions (081-100) answered. Net: caura-memclaw is fleet-shaped; most transferable signal VALIDATES existing 027 children (002-006), supplies hardening sharpenings, and confirms 008's default-off/shadow-first stance (MemClaw's direct asymmetric mutation is the anti-pattern). 14 surviving teachings (T1-T14) → see `research.md` §5; proposal → `sub-packet-proposals.md`.
<!-- /ANCHOR:answered-questions -->

---

<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[Populated by reducer from deltas]
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[Populated by reducer from deltas]
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[None yet]
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED-OUT DIRECTIONS (negative knowledge)
Do NOT port into the local single-user store (full ledger in `research.md` §6): multi-tenant scoping; fleet trust tiers; cross-agent propagation/divergence; PII quarantine; pgvector/Postgres machinery (literal); distributed workers/brokers; warm-cache/rate-limit/bulkhead; public-SemVer external-API governance; LLM-judge dedup + human review queues; **direct active weight mutation + asymmetric damping** (the 008 anti-pattern); MCP op-dispatch tool consolidation; built-in entity-graph recall (defer).
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
CONVERGED (20/20 iterations + adversarial verification + ground-truth adjudication). Deliverables written: `research.md`, `sub-packet-proposals.md`. Next is an operator decision: adopt the 008 scope-down + 002/004/005 amendments, and/or scaffold the proposed new child `009-memclaw-derived-memory-hardening`.
<!-- /ANCHOR:next-focus -->
