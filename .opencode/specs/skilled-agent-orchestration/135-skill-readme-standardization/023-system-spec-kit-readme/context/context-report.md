# Context Report: system-spec-kit README restyle (keep depth)

Two-iteration by-model sweep (DeepSeek v4 Pro + MiMo v2.5 Pro, read-only). The current README is a 1084-line reference manual and the locked decision is to restyle it into the narrative voice while keeping its reference depth. The gather verified the deep facts against source and found the README remarkably accurate: the only material correction is the version footer, plus a few drift-prone counts to soften and a stale "latest changelog" link. This is a reframe-the-top plus voice-sweep plus preserve-the-body restyle, not a regenerate.

---

## 1. PURPOSE

`system-spec-kit` enforces template-backed spec-folder documentation for every file-modifying AI conversation, backed by the `mk-spec-memory` MCP server that preserves decisions, context and session continuity across models and tools in a local SQLite index.

## 2. PROBLEM

AI conversations that modify files leave no durable reasoning trail, so the why behind a change evaporates when the session ends. AI assistants also start every session from a blank slate, so the architecture you explained on Monday is gone by Wednesday. Without an enforced documentation level and a contract-backed template, one session's spec folder is empty and another's is a free-form paragraph, and neither can be validated or resumed against. Spec Kit fixes both halves: a spec folder captures what changed and why, and a persistent local memory makes it searchable so the next session rebuilds context from packet-local sources before any deeper retrieval.

## 3. CAPABILITY SURFACE (the depth to preserve)

The restyle keeps every topic the current README documents. The inventory:

- Four documentation levels (1, 2, 3, 3+) with LOC guidance and per-level required files, plus phase parents (lean trio, child phase folders, `is_phase_parent()` / `isPhaseParent()` agreement).
- Template enforcement (manifest source plus Level contract resolver, ANCHOR markers) and `validate.sh` (20+ rules, exit codes 0/1/2/3, `--strict` / `--verbose` / `--recursive`, the `PHASE_PARENT_CONTENT` rule, EVIDENCE marker linting, continuity freshness).
- Spec-folder lifecycle scripts (create, validate, upgrade-level, recommend-level, calculate-completeness, check-completion, check-placeholders, archive, and more).
- The `mk-spec-memory` MCP server: 37 tools (verified against `mcp_server/tool-schemas.ts` `TOOL_DEFINITIONS` / `KNOWN_TOOL_NAMES`).
- Hybrid retrieval: five channels (Vector via `nomic-embed-text-v1.5` 768d, FTS5, BM25, Causal Graph, Degree) fused with Reciprocal Rank Fusion, per-intent K.
- Search pipeline: four stages (Gather, Score with 8 post-fusion signals, Rerank with MMR, Filter) and query intelligence (complexity routing, 7 intent types, decomposition, HyDE fallback).
- Memory lifecycle: FSRS decay, six importance tiers (Constitutional 3.0x never-decay through Deprecated fastest), four cognitive states (HOT, WARM, COLD, DORMANT).
- Causal graph: six relationship types, Louvain community detection, trust badges.
- Save intelligence: CREATE / REINFORCE / UPDATE / SUPERSEDE arbitration, three quality gates.
- Index internals: self-maintaining `memory_index_scan`, embedding reconciliation, schema history v28 to v30, the `.needs-rebuild` sentinel, the MCP front-proxy in-place daemon recycle with error codes E429 / -32001 / -32002.
- Continuity and handover: `generate-context.js` routing, the `handover.md` then `_memory.continuity` then canonical-docs recovery ladder, `session_bootstrap()`.
- Constitutional memory, checkpoints, evaluation infrastructure (ablation, 12 IR metrics, ground-truth corpus, dashboard), feature flags, embedding providers (4-tier local-first cascade, ADR-014).

## 4. THE MCP SURFACE (verified: 37 tools)

Source of truth: `mcp_server/tool-schemas.ts` (`TOOL_DEFINITIONS`, validated by `KNOWN_TOOL_NAMES` in `context-server.ts`). Exactly 37 tools. The handler directory has 40 entries because it includes non-tool processors, so the tool count comes from the schema file, not the directory. The README's repeated "37-tool" claim is accurate. Tool families: memory search and context, save, CRUD, health, index, embedding, causal graph, checkpoint, ingest, retention, session, task and eval, learning. Canonical entry surfaces: `/memory:save`, `/speckit:resume`, `validate.sh`, `generate-context.js`.

## 5. SECTION MAP (preserve each block, reframe the wrapper)

1 OVERVIEW (two-problem framing, How This Compares, key features, requirements). 2 QUICK START (create, save, resume, search, validate, verify MCP). 3 FEATURES (3.1 spec workflows, 3.2 memory system, 3.3 commands, 3.4 templates, 3.5 scripts). 4 STRUCTURE (tree, key files, how the pieces connect). 5 CONFIGURATION (embedding providers, env vars, MCP config, feature flags, token budget). 6 USAGE EXAMPLES (5 walkthroughs plus common patterns). 7 TROUBLESHOOTING (7 scenarios, quick fixes, diagnostics). 8 FAQ (9 Q&A). 9 RELATED DOCUMENTS. The reference depth in sections 3, 5, 7 is the part the keep-depth decision protects.

## 6. STALE FACTS (host-resolved)

1. Version footer. The footer (current line 1084) says "Skill version: 3.4.0.0" but SKILL.md is 3.4.1.0, and the changelog dir already has v3.5.0.2. The narrative voice omits version lines, so the restyle DROPS the footer entirely. Resolves by removal.
2. Latest-changelog link. RELATED DOCUMENTS links `../../changelog/system-spec-kit/v3.4.2.0.md` as "latest", but the latest on disk is `v3.5.0.2.md`. The restyle links the `../../changelog/system-spec-kit/` directory so it does not pin a version.
3. Script counts. "12 scripts" (spec) is actually 14 and "10 scripts" (memory) is actually 13. The restyle drops the pinned numbers and describes the script groups, since the tables list them anyway.
4. Drift-prone totals. "294 features", "22 categories", "316 scenario files" and per-namespace command counts (the "8 commands" versus "4 commands" inconsistency, "3 /doctor:*") are softened to descriptions rather than pinned numbers.

Verified accurate and preserved: 37 tools, the five channels and RRF, FSRS and the six tiers, the four levels and required files, every env var (the three the gather flagged as absent from ENV_REFERENCE are real in launcher source, an ENV_REFERENCE gap not a README error), and the entry-point paths. The ARCHITECTURE.md ADR-007 cascade-order staleness is an ARCHITECTURE.md issue, not a README issue, so it is out of scope here.

## 7. APPROACH

Keep-depth means preserve, not regenerate. The host reframes the top (frontmatter, blockquote, a new AT A GLANCE table, a problem-first OVERVIEW) with a dual-model draft, then restyles the body in place: sweep the 27 double-hyphen separators and 1 em-dash to commas or periods in prose (preserving CLI flags, arrows, table rules and code blocks), drop the version footer, fix the changelog link, soften the drift-prone counts, and keep every reference block. A full from-scratch regenerate was rejected because it risks both output truncation and silent depth loss across 750-plus lines, which the keep-depth decision forbids.

## 8. METHODOLOGY

Two iterations, by-model shared scope (DeepSeek v4 Pro and MiMo v2.5 Pro, read-only, `--variant high`). Iteration 1 inventoried the full depth and the section map. Iteration 2 verified the tool count against `tool-schemas.ts`, the env vars against `ENV_REFERENCE.md`, the levels and the entry points. DeepSeek confirmed 37 tools from source; MiMo caught the script-count drift and the stale changelog link. The models converged on the version footer as the one material stale fact. The reframed top is dual-drafted; the body restyle is host-applied to preserve the verified content.
