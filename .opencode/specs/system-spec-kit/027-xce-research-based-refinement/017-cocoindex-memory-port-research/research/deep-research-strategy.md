---
title: Deep Research Strategy — cocoindex-main → spec_kit_memory port + namespace shortening
description: Session tracking for 027/013 deep research. Iteratively investigates port opportunities from upstream cocoindex-main library into non-code spec_kit_memory MCP, plus MCP tool-namespace shortening to mk_*.
---

# Deep Research Strategy — Session Tracking

## 1. OVERVIEW

### Purpose

Persistent brain for the 027/013 deep-research session investigating: (a) which features/principles/patterns from the upstream `cocoindex-main` library can be ported into the non-code `spec_kit_memory` MCP subsystems; (b) whether and how to shorten the MCP tool namespace from `mcp__mk_spec_memory__*` to a `mk_*`-style scheme.

### Usage

- Init populated: Topic, Key Questions (11 axis-derived), Non-Goals, Stop Conditions, Known Context (none yet — fresh packet), Research Boundaries.
- Per iteration: cli-codex gpt-5.5 high fast reads Next Focus, writes evidence to iteration-NNN.md and deltas/iter-NNN.jsonl, reducer refreshes machine-owned sections.
- Mutability: mutable; machine-owned sections rewritten each iteration.

---

## 2. TOPIC
cocoindex-main → spec_kit_memory MCP port (causal graph, memory database, automatic indexing, embedding pipeline) + MCP tool-namespace shortening from `mcp__mk_spec_memory__*` to `mk_*`.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] **K1.1**: Does cocoindex-main's memoization + dependency-DAG pattern (from `python/cocoindex/_internal/memo_fingerprint.py` + `rust/core/src/state/db_schema.rs` + `rust/core/src/state/stable_path.rs`) transfer cleanly to TypeScript+SQLite, or does it require a Rust-equivalent runtime / heed-style KV store?
- [x] **K1.2**: Can the `ChildExistence` + `ChildComponentTombstone` lifecycle model from `rust/core/src/state/stable_path.rs` be ported into the flat `causal_edges` table at `lib/search/vector-index-schema.ts` to give causal edges automatic lifecycle/cleanup?
- [x] **K1.3**: Can `python/cocoindex/connectorkits/statediff.py`'s `(desired, prior) → {insert, upsert, replace, delete}` model replace our ad-hoc post-mutation hooks (alias conflict detection, divergence reconciliation)?
- [x] **K1.4**: Should spec-doc embeddings be chunked (by frontmatter / H2 sections) with per-chunk fingerprint so editing one section of a long spec doesn't re-embed the whole thing? (Reference: `examples/code_embedding/`.)
- [x] **K1.5**: Can causal edges be auto-derived from spec-doc relationships (supersedes, caused-by, cited-by) using cocoindex's `conversation_to_knowledge` multi-phase extraction pattern (LLM extract → embed-dedup → canonical → graph)? How do we validate LLM-extracted edges to avoid graph pollution?
- [x] **K1.6**: Confirm query intelligence is a non-port axis — cocoindex is ingest-focused with retrieval delegated to backends. Document the negative finding.
- [x] **K2.1**: Where does the `mcp__` prefix originate (Claude Code runtime alone, or cross-runtime MCP convention)? How is the server-name segment registered across OpenCode, Codex, Gemini, Claude Code?
- [x] **K2.2**: Does `mk_*` survive the tightest known regex constraint (alphanumeric + underscore + hyphen only) plus known provider rejections (DeepSeek/Moonshot `:`, opencode-skills `@`)?
- [x] **K2.3**: After `spec_kit_memory → mk_memory`, full tool names remain redundant (`mcp__mk_memory__memory_context`). Should tools also drop `memory_*`? Or shorten server to bare `mk`?
- [x] **K2.4**: What is the total callsite count for `mcp__mk_spec_memory__*` across CLAUDE.md + all SKILL.md files + hook scripts + docs + `tool-schemas.ts`? Migration cost ceiling.
- [x] **K2.5**: What's the final naming recommendation, given chars-saved × migration-churn × runtime-risk trade-off?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- **Implementation** of any port or rename — research-only packet; downstream implementation packets will be proposed in `research.md`.
- **code_graph** + **skill_advisor** improvements — already covered by 027 phases 002–006.
- **cocoindex-code MCP wrapper** changes — that's 027/001 (complete fork).
- **Embedding-provider** changes — settled by 014/010–014/013 (EmbeddingGemma + Voyage).
- **Network operations** — research is fully read-local against `external/cocoindex-main/` and `mcp_server/`.
- **Cross-tooling impact assessment** of the rename (e.g., Linear/Notion docs) — out of scope; focus on in-repo callsites.

---

## 5. STOP CONDITIONS

- Composite convergence reached (rolling avg `newInfoRatio` < 0.05 over 3+ iterations, MAD noise floor cleared, question coverage ≥ 85%, AND graph convergence STOP_ALLOWED).
- All 11 Key Questions answered (track 1: 6 + track 2: 5).
- Max iterations = 10 reached.
- 3+ consecutive iterations with no new findings → stuck recovery, then converge.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- **K1.1**: Does cocoindex-main's memoization + dependency-DAG pattern (from `python/cocoindex/_internal/memo_fingerprint.py` + `rust/core/src/state/db_schema.rs` + `rust/core/src/state/stable_path.rs`) transfer cleanly to TypeScript+SQLite, or does it require a Rust-equivalent runtime / heed-style KV store?
- **K1.2**: Can the `ChildExistence` + `ChildComponentTombstone` lifecycle model from `rust/core/src/state/stable_path.rs` be ported into the flat `causal_edges` table at `lib/search/vector-index-schema.ts` to give causal edges automatic lifecycle/cleanup?
- **K1.3**: Can `python/cocoindex/connectorkits/statediff.py`'s `(desired, prior) → {insert, upsert, replace, delete}` model replace our ad-hoc post-mutation hooks (alias conflict detection, divergence reconciliation)?
- **K1.4**: Should spec-doc embeddings be chunked (by frontmatter / H2 sections) with per-chunk fingerprint so editing one section of a long spec doesn't re-embed the whole thing? (Reference: `examples/code_embedding/`.)
- **K1.5**: Can causal edges be auto-derived from spec-doc relationships (supersedes, caused-by, cited-by) using cocoindex's `conversation_to_knowledge` multi-phase extraction pattern (LLM extract → embed-dedup → canonical → graph)? How do we validate LLM-extracted edges to avoid graph pollution?
- **K1.6**: Confirm query intelligence is a non-port axis — cocoindex is ingest-focused with retrieval delegated to backends. Document the negative finding.
- **K2.1**: Where does the `mcp__` prefix originate (Claude Code runtime alone, or cross-runtime MCP convention)? How is the server-name segment registered across OpenCode, Codex, Gemini, Claude Code?
- **K2.2**: Does `mk_*` survive the tightest known regex constraint (alphanumeric + underscore + hyphen only) plus known provider rejections (DeepSeek/Moonshot `:`, opencode-skills `@`)?
- **K2.3**: After `spec_kit_memory → mk_memory`, full tool names remain redundant (`mcp__mk_memory__memory_context`). Should tools also drop `memory_*`? Or shorten server to bare `mk`?
- **K2.4**: What is the total callsite count for `mcp__mk_spec_memory__*` across CLAUDE.md + all SKILL.md files + hook scripts + docs + `tool-schemas.ts`? Migration cost ceiling.
- **K2.5**: What's the final naming recommendation, given chars-saved × migration-churn × runtime-risk trade-off?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[No exhausted approach categories yet]

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[None yet]

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
No prior research context for this specific port question. Closest prior work: pt-01..pt-04 under 027/research/ explored `cocoindex-code` (the MCP wrapper, NOT the upstream library) for code-search applicability. This packet is a sibling/complementary stream targeting the non-code memory subsystems with the upstream library as source-of-inspiration. Prior memory entries of relevance: `feedback_codex_cli_fast_mode`, `feedback_codex_sandbox_blocks_network`, `feedback_generate_context_regenerates_parent_metadata` (already mitigated during scaffolding).

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.opencode/skills/deep-research/assets/runtime_capabilities.json`
- Current generation: 1
- Started: 2026-05-13T07:30:00Z
- Executor: cli-codex (model=gpt-5.5, reasoning=high, service_tier=fast, sandbox=workspace-write)
