---
title: "009 — cocoindex-main → spec_kit_memory port + MCP namespace shortening (research)"
description: "Investigate which features, principles, patterns, and code from the upstream cocoindex-main library can be ported into our non-code spec_kit_memory MCP subsystems (causal graph, memory database, automatic indexing, query intelligence, embedding pipeline); evaluate shortening the MCP tool namespace from `mcp__mk_spec_memory__*` to a `mk_*`-style scheme."
trigger_phrases:
  - "cocoindex memory port research"
  - "cocoindex-main non-code port"
  - "spec_kit_memory cocoindex port"
  - "causal graph stable-path port"
  - "memory database memoization port"
  - "automatic indexing dependency dag"
  - "mcp tool namespace shortening"
  - "mk_memory prefix"
  - "mcp__mk_spec_memory__ rename"
  - "027/013"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-code-graph-and-cocoindex/009-cocoindex-memory-port-research"
    last_updated_at: "2026-05-13T07:30:00Z"
    last_updated_by: "claude-opus-4-7-plan-mode"
    recent_action: "Scaffolded packet, restored parent metadata, authored research scope"
    next_safe_action: "Dispatch /deep:start-research-loop:auto with cli-codex gpt-5.5 high fast"
    blockers: []
    key_files:
      - "spec.md"
      - "../external/cocoindex-main/"
      - "../../../skills/system-spec-kit/mcp_server/handlers/memory-index.ts"
      - "../../../skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts"
      - "../../../skills/system-spec-kit/mcp_server/lib/search/query-router.ts"
      - "../../../skills/system-spec-kit/mcp_server/tool-schemas.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "system-spec-kit/028-code-graph-and-cocoindex/009-cocoindex-memory-port-research"
      parent_session_id: null
    completion_pct: 5
    open_questions:
      - "Q1: Which cocoindex-main patterns transfer cleanly to TS/SQLite vs require Rust-equivalent runtime?"
      - "Q2: Does `mk_*` server-name shortening survive across all 4 runtimes and provider regex constraints?"
      - "Q3: Should tools also drop the redundant `memory_*` prefix when the server is renamed to `mk_memory`?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: 009 — cocoindex-main → spec_kit_memory port + MCP namespace shortening (research)

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 (research packet — depth lives in `research/`) |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-13 |
| **Branch** | `main` (no feature branch per project policy) |
| **Parent Spec** | ../spec.md |
| **Phase** | 13 of 13 |
| **Predecessor** | 027/002-feedback-p0-correctness |
| **Successor** | None (downstream implementation packets will be created from research findings) |
| **Handoff Criteria** | `research/research.md` produced with per-axis findings, cross-axis recommendations, and concrete proposed implementation packets ranked by ROI × effort |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 009** of the 027 XCE Research-Based Refinement packet. Prior phases (001–012) focused on the **code_graph + skill_advisor** subsystems and on the **cocoindex-code** MCP wrapper as a code-search vehicle. Phase 009 opens a NEW research stream targeting the **non-code spec_kit_memory** subsystems and using the **upstream `cocoindex-main`** library (not the wrapper) as the source-of-inspiration.

**Scope Boundary**: research-only. No implementation. Downstream implementation packets will be created (e.g., 028, 029, …) after research convergence.

**Dependencies**:
- `external/cocoindex-main/` already cloned under parent 027.
- `.opencode/skills/system-spec-kit/mcp_server/` is the target system.
- `/deep:start-research-loop` skill workflow + `@deep-research` agent.
- Executor: `cli-codex` with `model=gpt-5.5`, `reasoning=high`, `service-tier=fast`.

**Deliverables**:
- `research/research.md` (final synthesis, 17 sections per skill contract)
- `research/iterations/iteration-NNN.md` (one per iteration, workflow-exempt from strict-validate)
- `research/deep-research-state.jsonl` (externalized state)
- `research/resource-map.md` (final resource map)
- Continuity refresh in `implementation-summary.md._memory.continuity` and indexed DB entries via `/memory:save`

**Changelog**:
- When this phase closes, refresh `../changelog/009-cocoindex-memory-port-research.md` and synthesize per-axis findings into the parent 027 root.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Our `spec_kit_memory` MCP currently runs a **single-pass linear scan with content-hash skip** for automatic indexing (`handlers/memory-index.ts`), maintains causal edges as a **flat relational table with no lifecycle/cleanup model** (`causal_edges` in `vector-index-schema.ts`), and exposes 45 tools under a **22-character prefix** (`mcp__mk_spec_memory__*`). The upstream `cocoindex-main` library — a general-purpose ingestion/transformation framework — solved closely-adjacent problems with **canonical-fingerprint memoization**, **stable-path component tracking**, **state-diff reconciliation**, and **dependency-DAG incremental updates**. We have not systematically evaluated whether those patterns transfer to our non-code memory subsystems. Separately, the long MCP tool-name prefix adds noise to every tool reference across CLAUDE.md, all SKILL.md files, hook scripts, and docs.

### Purpose
Produce a research synthesis that (a) identifies concrete, ranked port opportunities from cocoindex-main into the spec_kit_memory MCP's causal graph, memory database, automatic indexing, and embedding pipeline subsystems, with explicit non-port findings for query intelligence; and (b) delivers a go/no-go decision and migration plan for shortening the MCP tool namespace to a `mk_*`-style scheme.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

**Track 1 — cocoindex-main → spec_kit_memory port opportunities** (6 axes):

- **Axis 1.1**: Memoization + dependency-DAG indexing — port from `python/cocoindex/_internal/memo_fingerprint.py` + `rust/core/src/state/db_schema.rs` + `rust/core/src/state/stable_path.rs` into `handlers/memory-index.ts`'s linear-scan path.
- **Axis 1.2**: Stable-path tracking for causal graph — port the `ChildExistence` + `ChildComponentTombstone` lifecycle model from `rust/core/src/state/stable_path.rs` into the `causal_edges` table at `lib/search/vector-index-schema.ts`.
- **Axis 1.3**: State-diff reconciliation for derived state — port `python/cocoindex/connectorkits/statediff.py`'s `(desired, prior) → {insert, upsert, replace, delete}` model to replace ad-hoc post-mutation hooks.
- **Axis 1.4**: Incremental embedding (chunk-level fingerprint) — study `examples/code_embedding/` and recommend whether spec-doc embeddings should chunk by frontmatter / H2 sections with per-chunk re-embed.
- **Axis 1.5**: Multi-phase entity resolution → auto causal-edge derivation — study `examples/conversation_to_knowledge/` and recommend whether causal edges can be auto-derived from spec-doc relationships (supersedes, caused-by, cited-by) via multi-phase extraction.
- **Axis 1.6**: Query intelligence — confirm NON-PORT finding (cocoindex is ingest-focused, retrieval delegated to backends) and document so we don't revisit.

**Track 2 — MCP tool-namespace shortening** (5 axes):

- **Axis 2.1**: Prefix construction mechanism — verify where `mcp__` comes from across the 4 runtimes (Claude Code, OpenCode, Codex, Gemini) and how server-name segment is registered.
- **Axis 2.2**: Provider regex constraints — validate `mk_*` against `^[a-zA-Z0-9_-]+$` and known provider rejections (memory: DeepSeek/Moonshot `:` rejection; opencode-skills `@` issue).
- **Axis 2.3**: Per-tool prefix redundancy — decide whether to drop `memory_*` from individual tool names when server renames to `mk_memory`.
- **Axis 2.4**: Migration cost — count callsites across CLAUDE.md, all SKILL.md files, hook scripts, docs, `tool-schemas.ts`. Per project policy: no backwards-compat shim — straight rename + delete legacy.
- **Axis 2.5**: Recommendation matrix — final naming proposal with chars-saved × migration-churn × runtime-risk trade-off.

### Out of Scope

- **Implementation** of any port or rename — that's downstream packet territory (will be proposed in `research.md` final synthesis, not executed here).
- **code_graph** + **skill_advisor** improvements — already covered by 027 phases 002, 003, 004, 005, 006.
- **cocoindex-code MCP wrapper** changes — that's 028/005-cocoindex-complete-fork.
- **Embedding-provider** changes — settled by 014/010–014/013 (EmbeddingGemma + Voyage).
- **Network operations** — research is fully read-local against `external/cocoindex-main/`; no API calls needed.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/research.md` | Create | Final synthesis (17 sections per `/deep:start-research-loop` contract) |
| `research/iterations/iteration-NNN.md` | Create | Per-iteration findings (workflow-exempt) |
| `research/deep-research-state.jsonl` | Create | Externalized iteration state |
| `research/deep-research-dashboard.md` | Create | Progress dashboard (auto-generated) |
| `research/resource-map.md` | Create | Resource map at convergence |
| `research/deep-research-config.json` | Create | Skill config (executor + thresholds) |
| `implementation-summary.md` | Modify | Update `_memory.continuity` block at convergence |
| `description.json` | Modify (auto via generate-context.js) | Refresh after `/memory:save` |
| `graph-metadata.json` | Modify (auto) | Refresh derived state |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Track 1: each of axes 1.1–1.6 receives at least 1 dedicated iteration with concrete file-path citations from `external/cocoindex-main/` and `mcp_server/`. | `research.md` per-axis section ≥ 200 words, ≥ 3 file:line citations each. |
| REQ-002 | Track 2: each of axes 2.1–2.5 receives at least 1 dedicated iteration with concrete runtime evidence (regex testing, callsite count). | `research.md` namespace section includes runtime compat matrix + callsite count from `rg` output. |
| REQ-003 | Convergence detection halts iterations when delta score ≤ `0.05` (default). | `deep-research-state.jsonl` final row shows `converged=true` OR iteration count = max-iterations. |
| REQ-004 | Each iteration uses `cli-codex` with `model=gpt-5.5`, `reasoning=high`, `service-tier=fast` (explicit `-c service_tier="fast"` per memory `feedback_codex_cli_fast_mode`). | Dispatch logs in `research/logs/` show `service_tier=fast` in the codex exec args. |
| REQ-005 | `/memory:save` at convergence indexes the synthesis into the canonical continuity DB. | `memory_match_triggers("cocoindex memory port")` returns 013 packet. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | `research.md` final section proposes ≥ 3 concrete downstream implementation packets ranked by (ROI × effort) score. | Each proposal includes: packet title, scope summary, primary file(s), estimated LOC, dependencies. |
| REQ-007 | Track 2 produces a final naming recommendation with concrete examples (e.g., `mcp__mk_memory__context` vs `mcp__mk__memory_context`). | Decision matrix in `research.md` namespace section. |
| REQ-008 | Negative knowledge (ruled-out directions) captured as first-class research output. | `research.md` "Non-Port Findings" section ≥ 1 axis (expected: axis 1.6 query intelligence). |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Research converges within `maxIterations=10` (default; can extend via `--max-iterations`) with `convergenceThreshold=0.05`.
- **SC-002**: `research.md` is comprehensive enough to drive `/spec_kit:plan` for at least one downstream implementation packet without re-reading `external/cocoindex-main/`.
- **SC-003**: Final synthesis recommends a final `mk_*`-style namespace OR documents a defensible no-go decision; no deferred-question outcome on Track 2.
- **SC-004**: Memory recall test: `memory_match_triggers("cocoindex memory port research")` returns 013 within the same session after `/memory:save`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Iteration cost (10 × cli-codex gpt-5.5 high fast over deep cocoindex source) | Medium | `:auto` convergence stops early when evidence plateaus; per-iteration scoping keeps token footprint bounded. |
| Risk | cocoindex-main is large (Rust + Python + 20+ examples) — iteration may drift | Medium | Each iteration must be axis-scoped; the deep-research skill enforces this internally via strategy.md. |
| Risk | Track 2 (namespace) converges faster than Track 1 (port) | Low | Convergence detection is per-axis evidence; Track 2 stops shifting once decisions are made. Acceptable. |
| Risk | Parent metadata regeneration overwrote parts of 027 description.json | Resolved | Manually restored per memory `feedback_generate_context_regenerates_parent_metadata`. Validated at scaffold time. |
| Dependency | `/deep:start-research-loop` skill must be present | High if broken | Verified at `.opencode/commands/deep/start-research-loop.md`. |
| Dependency | cli-codex must accept `service_tier=fast` | High if broken | Verified pattern in memory; passes `-c service_tier="fast"` via skill config. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **Q1**: For Axis 1.1 (memoization + dependency-DAG indexing), is cocoindex's stable-path identity model viable on top of SQLite-only storage (no heed-style KV store), or would porting require a new storage backend?
- **Q2**: For Axis 2.1, does the `mcp__` prefix originate from the Claude Code runtime alone, or is it a cross-runtime MCP convention? (If runtime-specific, server-name shortening yields different savings per runtime.)
- **Q3**: For Axis 2.3, the redundancy of `memory_*` after `spec_kit_memory → mk_memory` is unavoidable unless individual tool names also change. Should we rename all 45 tools, or only the server?
- **Q4**: For Axis 1.5 (multi-phase entity resolution → auto causal-edge derivation), how should LLM-extracted relationships be validated to avoid polluting the causal graph with low-confidence edges?
- **Q5**: How tightly should the synthesis pre-commit to packet boundaries? (E.g., one "memoization + stable-path" packet vs separate "indexing memoization" + "causal-graph stable-paths" packets.)
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
