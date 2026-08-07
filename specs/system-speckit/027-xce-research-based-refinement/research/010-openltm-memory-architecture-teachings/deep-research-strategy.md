---
title: "Deep Research Strategy — OpenLTM Memory-Architecture Teachings for system-spec-kit Memory"
description: "New lineage (iters 001-010) mining the vendored OpenLTM long-term-memory plugin (Bun/TS/SQLite/FTS5; MIT) for design teachings transferable to the LOCAL single-user system-spec-kit Memory system, with adopt/adapt/reject/defer verdicts + risk and first-class negative knowledge."
---

# Deep Research Strategy — Session Tracking

**Executor:** cli-opencode `openai/gpt-5.5-fast` --variant xhigh / read-only / timeout 1200s / orchestrator-driven parallel fan-out (width 5)
**Packet:** `research/010-openltm-memory-architecture-teachings/` (new lineage; folder-scoped iterations 001-010)
**Session:** `2026-06-08-010-openltm-teachings`
**Research target:** `external/OpenLtm-main` (OpenLTM — open-source long-term-memory plugin for AI coding agents; Bun + TypeScript; SQLite WAL + FTS5 BM25 + optional sqlite-vec; pluggable embedding providers; 4 lifecycle hooks; janitor maintenance; typed knowledge graph; ~29K LOC; MIT — design inspiration only)
**Consumer:** system-spec-kit Memory — LOCAL single-user/single-tenant store (SQLite index + separate vector store, ollama nomic 768d); semantic+lexical triggers; importance tiers; causal edges; FSRS decay/co-activation; self-maintaining incremental index; shadow-first learning-feedback reducers; spec-folder continuity ladder; 37-tool MCP surface.

---

## 2. TOPIC

Extract concrete, evidence-cited design teachings from OpenLTM that can refine the system-spec-kit Memory system, or justify a new sub-packet. The central question the operator asked: **what does OpenLTM do DIFFERENTLY than us, and what could we copy / learn from to improve system-spec-kit memory (or related systems)?** Both are local SQLite-backed single-user memory systems, so the architecture mismatch is SMALL (unlike fleet-scale studies 006/008) — which raises the bar: a teaching only survives if it is a genuine DELTA over our existing FSRS decay, causal edges, trigger matching, and self-maintaining index. Per-teaching verdict in {ADOPT, ADAPT, REJECT, DEFER} with risk {LOW, MED, HIGH} and a target surface (or "new sub-packet"). Negative knowledge (what NOT to copy) is a first-class output.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (planned iterations 001-010)

Breadth sweep — one OpenLTM subsystem per iteration (read-only, narrow scope to fit the xhigh timeout):
- [x] 001 hybrid recall + blended scoring + explainability: FTS5(BM25)-primary -> semantic-fallback, blended 40/35/15/10 score, deterministic `why_ranked` breakdown -> `db.ts:recall()`, `recall/explainer.ts`, `recall/categorise.ts`
- [x] 002 importance-weighted decay: half-life tiers (14/30/90/180/immortal), materialized `decay_score` column, soft-deprecate-but-retain @0.25 -> `janitor/decay.ts`, `migrations/011`, `022` vs our FSRS
- [x] 003 janitor maintenance pipeline: ordered embed -> decay -> archive -> promote -> dedup; `context_items -> memories` promotion tier; dedup staging (no auto-merge) -> `janitor/` vs our self-maintaining index
- [x] 004 lifecycle hooks + injection envelope: SessionStart/UpdateContext/EvaluateSession/PreCompact; <=60-line injection envelope; PreCompact markdown snapshot fallback; auto-extraction -> `hooks/src/*.ts`, `context.ts` vs our SessionStart + handover ladder
- [x] 005 typed knowledge graph + BFS conflict detection: 6 edge types incl. `contradicts`/`supersedes`; recall-time conflict/reinforcement detection -> `graph.ts`, `db.ts:relate()`, `migrations/004`, `018` vs our causal edges
- [x] 006 secret redaction before write: pattern-matched API-key/JWT/AWS scrub at `learn()` -> `secretsScrubber.ts` vs our memory write safety
- [x] 007 provenance + audit chain: append-only `memory_audit` (who/what/when/before/after) + `memory_provenance` source kinds -> `dao/provenanceAudit.ts`, `migrations/008`, `009` vs our continuity provenance
- [x] 008 embedding provider abstraction + graceful degradation: pluggable OpenAI/Gemini/Ollama/Cohere; degrade-to-FTS5; split `memory_embeddings` table to avoid MCP bloat -> `providers/`, `dao/embeddings.ts`, `migrations/010`, `vec/` vs our ollama-nomic embedder
- [x] 009 schema/DB design + migration discipline: FTS5 triggers, WAL, `schema_migrations`, numbered backwards-compatible migrations -> `schema.sql`, `migrations/*`, `src/migrate.ts`, `docs/internal/DB-SPEC.md` vs our index schema
- [x] 010 `learn()` idempotency + cross-plugin contract: `dedup_key` normalized hash, `created|reinforced`, `confirm_count`; adapter packages; Phase-5 cross-plugin write surface -> `db.ts:learn()`, `queue/`, `packages/adapter-*`, `docs/internal/{PRD,ROADMAP}.md` vs our memory_save + 37-tool MCP

Synthesis + adversarial verification (post-pass, after 001-010): cross-compare per subsystem; stress every ADOPT-verdict teaching for genuine novelty/transfer vs our FSRS + causal + single-user design; write `research.md` + `sub-packet-proposals.md`.
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- No code copying from OpenLTM (MIT — design/pattern inspiration only; system-spec-kit-native re-implementation only).
- No implementation during research (report + proposal only; any code/spec change is a separate Gate-3 packet).
- No swap of the embedding model (live = ollama nomic 768d); embedding teachings rescope TO it, never replace it.
- No adoption of anything our FSRS decay / causal edges / self-maintaining index already cover or supersede — flag as negative knowledge instead.

---

## 5. STOP CONDITIONS

- Complete iterations 001-010, OR convergence (newInfoRatio < 0.05 across a full round), OR explicit operator stop.
- Synthesis + adversarial pass runs after the breadth sweep regardless (it consumes, not extends, the 10 iterations).

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
All 10 planned questions (001-010) answered. Net: OpenLTM is a single-user local store like us, so the gap is design not scale. Our retrieval (fused vector/BM25/FTS/graph/trigger + FSRS + co-activation) and decay already SUPERSEDE OpenLTM's FTS-primary recall and fixed half-lives. OpenLTM's real transferable value is concentrated in **write-path safety, observability, and propose-don't-mutate discipline**. 54 raw teachings → 11 ADOPT / 29 ADAPT / 9 REJECT / 5 DEFER; after adversarial review the standout is **pre-index secret redaction (#1, ADOPT)**, with ~10 genuine ADAPT deltas. See `research.md` §0/§3/§5 and `sub-packet-proposals.md`.

**Continuation (iterations 011-015) — spec-doc-fit correction.** The operator flagged that our memory is spec-documentation-based (authored docs = truth, DB = index) while OpenLTM is row-based (the `learn()` row IS the memory; its `context-summary.md` is "never the source of truth"). Re-classifying every teaching as TRANSFERS / DOC-ANALOG / ROW-COUPLED materially corrected the picture: the **write-side row mechanics (`learn/reinforce`/`confirm_count`, per-row provenance, per-row content audit, row dedup/merge, git-diff-to-memory) are ROW-COUPLED → REJECT for us** (docs + git + continuity ladder already cover them). **Secret scrubbing stays #1 (storage-agnostic).** Newly surfaced high-fit wins: **per-doc content-fingerprint indexing, FTS-trigger sync, a bounded startup restore panel, PreCompact snapshots that refresh *authored* continuity, and proposal queues reshaped to suggest handover/continuity doc-patches (never silent memory rows).** Full re-tiering in `research.md` §8; corrected priorities in `sub-packet-proposals.md`.
<!-- /ANCHOR:answered-questions -->

---

<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Narrow per-subsystem scoping kept every breadth dispatch under the xhigh timeout (29-61 tool calls each, 0 timeouts in rounds 1-2 breadth).
- Orchestrator-writes pattern: read-only executor analysis + orchestrator-authored iteration/delta/state — Gate-3-safe, race-safe, compaction-safe.
- Parallel fan-out in batches of ~5 completed all 10 breadth iterations in ~10 min wall-clock.
- The constructive synthesis pass produced an excellent verified cross-comparison + ranked-teaching table.
- Spot-checking high-stakes citations against source confirmed grounding (decay formula, secret scrubber, explainer blend, and the decay_score sort-key all verified).
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- The independent gpt-5.5 **adversarial-verify** dispatch was reproducibly SIGKILLed (exit 137) at 1-3 min across 3 attempts — the heavy "refute every teaching" reasoning ballooned the opencode process and macOS jetsam reaped it (system memory stayed >50% free; the constructive synthesis on the same inputs succeeded). Mitigation: adversarial verification was performed by the orchestrator (Opus 4.8) instead — see `research.md` §1 note + §5.
- The first concurrent round-2 attempt (synthesis + adversarial together) lost both to a transient memory-pressure kill; sequential retry recovered synthesis.
- `reduce-state.cjs` CLI could not target this named-phase layout (its resolver expects `<specFolder>/research[/pt-NN]`, not `research/010-name/`); the dashboard + findings-registry were orchestrator-generated deterministically from the state log instead (same inputs/shape as phase 008).
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[None yet]
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED-OUT DIRECTIONS (negative knowledge)
Do NOT copy (full ledger in `research.md` §6): OpenLTM's FTS-primary recall wholesale; display-only blended ranking score (it sorts by `decay_score`, not the explained score); fixed importance half-lives (FSRS supersedes); hard `confirm_count` immortality; fail-open secret scrubbing/audit; content-only redaction; direct git-diff auto-learn into durable memory; flat goal/progress store replacing spec folders; `relate()` `INSERT OR IGNORE` semantics; unused edge weights / graph-UI machinery; embedding-provider proliferation; single-file DB backup (index + vector shard must be paired); 200-char normalized text dedupe; exposing the whole MCP/admin surface as the cross-plugin contract.
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
CONVERGED (15/15 iterations: 10 breadth + 5 spec-doc-fit re-examination + synthesis + orchestrator adversarial verification). Deliverables written: `research.md` (incl. §8 corrected re-tiering), `sub-packet-proposals.md` (incl. continuation-correction priority table), `deep-research-dashboard.md`, `findings-registry.json`. **Corrected operator decision order:** (1) pre-index secret redaction → amend `027/002-memory-write-safety`; (2) per-doc content-fingerprint indexing + FTS-trigger sync; (3) retrieval/memory observability keyed to doc-anchor; (4) continuity/session resilience (restore panel + authored-continuity PreCompact snapshot); (5) reshaped opt-in capture (handover/continuity doc-patch proposals only). **Do NOT build:** the row-coupled write mechanics (`learn/reinforce`, per-row provenance/audit, row dedup) — REJECT for a doc-based store. Optional: re-run the §5 adversarial pass independently on a less memory-pressured host (it was orchestrator-performed after 3 jetsam kills).
<!-- /ANCHOR:next-focus -->
