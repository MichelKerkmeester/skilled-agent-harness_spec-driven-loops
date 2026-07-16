---
title: "Follow-Ups: 002-spec-memory-stack"
description: "Six concrete follow-ups surfaced by the consolidated changelog. Each entry names what stalled or remained open, why it matters and the next concrete action with enough detail for a future operator to pick up cold."
trigger_phrases:
  - "002-spec-memory-stack follow-ups"
  - "spec-memory stack remaining work"
  - "mk-spec-memory open items"
  - "embedder stack follow-ups"
importance_tier: "normal"
contextType: "implementation"
---

# Follow-Ups: 002-spec-memory-stack

> Six open follow-ups surfaced by the consolidated [CHANGELOG.md](./CHANGELOG.md). Read the changelog for the shipped work. Read this file for what remains.
>
> **Spec folder:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/`
>
> **Source:** [CHANGELOG.md](./CHANGELOG.md) Follow-Ups section.

---

## 1. Phase 005 – context-server memory reduction research re-frame

**What happened:** Deep-research ran for 8 of 10 allocated iterations and stopped without producing actionable recommendations. The packet shipped only `research/research.md`, `research/deep-research-state.jsonl` and 8 iteration files. No spec, no plan, no implementation summary.

**Why it stalled (read between the lines):** The trigger scope ("context-server memory reduction") was wide open. No feature gate, no embedder gate, no measurement target. Deep-research iterations diverged across V8 heap, embedding cache, BM25 residency and SQLite page cache without converging on a single load-bearing source.

**Why it matters:** The stack ended up addressing the same problem space through phases 008 (byte-aware telemetry), 009 (byte-bounded cache), 010 (sidecar execution), 011 (lazy startup gating) and 012 (canonical vector shard split). Those landed without ever closing the 005 research question explicitly. The original investigation is unfinished work-in-progress that masks whether more memory wins remain.

**Concrete next action:** Open a new packet that re-frames the question with a measurable target. Suggested scope: "Reduce idle daemon RSS below N MB within K seconds of last tool call". The phases 008-012 evidence becomes the baseline. The deliverable is either "no more wins below N MB" or a ranked list of remaining levers.

---

## 2. Phase 011 – lazy startup gating handler verification

**What happened:** The packet's `spec.md` PHASE MAP marks it `Implemented - Handler Verification Blocked`. Code, tests and typecheck all pass. The blocker is a live-daemon smoke that confirms the first memory-owning tool call still works after lazy startup.

**Why it matters:** Lazy startup is a runtime invariant. If the guard's single-flight semantics break under real load the first tool call hangs or double-initialises. Unit tests cover the guard logic but not the actual MCP child-process bootstrap path.

**Concrete next action:** Restart the daemon cold and run a single `memory_search` or `memory_save` MCP call. Confirm three things. (a) First call latency is acceptable, target under 2 s including DB open and BM25 warmup. (b) A `context-server.vitest.ts`-equivalent live probe sees the same 42 tools registered. (c) A second concurrent call does not trigger a second init, which verifies single-flight semantics. Mark the spec status `Verified` afterwards.

---

## 3. Phase 015 – cascade reorder grep sweep

**What happened:** The packet description notes "one partial edit landed pre-scaffold". Some files were touched before the spec folder existed, then the formal packet was scaffolded around them. The risk is that cloud-first phrasing (Voyage first, OpenAI second) leaked into docs that were not touched in the formal phase.

**Why it matters:** New users following stale install guides will set API keys they do not need or skip Ollama installation thinking it is optional. Hurts onboarding and clouds the all-local default story.

**Concrete next action:** Run case-insensitive grep across `INSTALL_GUIDE.md`, `README.md`, `onboarding/`, `docs/` and any AI-facing skill references for the strings: "Voyage first", "cloud-first", "Voyage is the default", "Voyage takes priority", "API key required for embeddings". Use `rg -il` (case-insensitive), not `rg -l`, so UPPERCASE and Title-Case literals are caught. Replace any hit with the local-first cascade language.

---

## 4. Phase 007 – operator migration retention guidance

**What happened:** The packet documents an explicit migration path: "keep the legacy database and GGUF artifacts until the new auto-selected database is verified and reindexed". No deletion guidance was added.

**Why it matters:** Operators reading the install guide today have no signal for "when can I safely delete the old `.gguf` model files and the legacy embeddings DB?". Disk waste at best, doubt-driven indecision at worst. The artifacts are typically 500 MB to 2 GB combined.

**Concrete next action:** Add a short retention block to `mcp_server/INSTALL_GUIDE.md` after the migration section. Suggested template: "After your first successful `memory_search` against the new embedder the legacy `embeddings.gguf` and `vec_memories` rows tagged `embeddinggemma-300m` are safe to remove. Run `find ~/.local/share/mk-spec-memory -name '*.gguf' -delete` and the equivalent `sqlite3 ... DELETE` for legacy rows." Include exact commands so operators do not guess.

---

## 5. Phase 013 + 014 – second parity test for RRF under SQLite engine

**What happened:** Phase 013 (research) identified golden-query parity tests as the guardrail for the BM25-to-FTS5 swap. Phase 014 (implementation) shipped exactly one such test: `lexical-overlap-quality-gate.vitest.ts` with 30 queries across 6 categories asserting `overlap@5 >= 0.8`.

**Why it matters:** RRF (reciprocal rank fusion) combines BM25 and dense rankings. The 014 test asserts lexical overlap is preserved but does not assert the fused output is preserved. If FTS5 returns the same hits in a different order RRF gives different final rankings and search results shift. The current gate would not catch this.

**Concrete next action:** Add a second vitest file (`rrf-parity-quality-gate.vitest.ts`) that runs the same 30 queries through the full hybrid pipeline (BM25 lane plus dense lane plus RRF fusion) under both the legacy in-memory and SQLite engines. Assert `overlap@10` on the final fused rankings is `>= 0.8`. This closes the RRF behaviour gap that 014 left open.

---

## 6. Phase 019 – manual triage of 3 residual scan failures

**What happened:** The repair runner reduced 503 scan failures to 3. The runner's target classes (E_LINEAGE, invalid schema, tier check, V8) all hit zero. The 3 residuals are outside those classes.

**Why it matters:** Three is a small number but the runner is now idempotent, so re-running will not touch them. If they represent a real issue (corrupted memory file, broken graph edge, stale embedding) they will surface as background noise on every future scan and may degrade `memory_search` quality. If they are benign (legacy test fixtures) they should be allow-listed so future scans report 0.

**Concrete next action:** Run `memory_index_scan --verbose --show-failures` and capture the 3 failure records. For each one: identify the memory ID, read the file and classify as (a) real corruption then repair manually, (b) benign legacy then add to the runner's allow-list with a comment or (c) needs a new repair class then extend the runner. The post-triage scan should report 0 failures.

---

## Related

- [CHANGELOG.md](./CHANGELOG.md) – consolidated changelog covering all 19 phase children.
- [spec.md](./spec.md) – phase parent overview and phase map.
- [graph-metadata.json](./graph-metadata.json) – machine-readable status pointers.
