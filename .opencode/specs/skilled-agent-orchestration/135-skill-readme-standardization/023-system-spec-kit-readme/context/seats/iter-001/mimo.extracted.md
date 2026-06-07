# Reference Inventory: system-spec-kit README Restyle

## 1. PURPOSE

System Spec Kit orchestrates mandatory spec-folder documentation for every file-modifying conversation (Levels 1–3+), enforces template-backed structure and validation, and preserves session context across tools and models through the `mk-spec-memory` MCP server's hybrid search, causal graph, decay, constitutional memory, and continuity surfaces.

## 2. PROBLEM

Ad-hoc undocumented file changes leave no paper trail: a feature gets built, the session ends, and the reasoning behind every decision vanishes. AI assistants have amnesia—every conversation starts from a blank slate, so architecture explained on Monday is forgotten by Wednesday. Without an enforced documentation level and template structure, the quality and completeness of whatever notes do survive is inconsistent and unauditable. When work resumes across sessions, models, or tools, memory of prior decisions, touched files, and open questions is critical to avoid re-discovery, contradictory choices, or lost context.

## 3. CAPABILITY SURFACE (the depth)

- **Documentation Levels (1, 2, 3, 3+)** — Level 1 (<100 LOC): `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`. Level 2 (100–499 LOC): adds `checklist.md`. Level 3 (500+ LOC): adds `decision-record.md`. Level 3+ (complexity 80+): adds extended governance, approval workflow, compliance, stakeholders. LOC is guidance; risk and complexity can override.
- **Phase Parent** — Lean trio only (`spec.md`, `description.json`, `graph-metadata.json`); heavy docs live in child phase folders matching `^[0-9]{3}-[a-z0-9-]+$`. `graph-metadata.json` carries `derived.last_active_child_id` pointer. Detection via `is_phase_parent()` (shell) and `isPhaseParent()` (ESM JS).
- **Template Enforcement** — Manifest template architecture with Level contract resolver; `create.sh` scaffolds from contract-backed templates; `inline-gate-renderer` expands sections per level. ANCHOR markers (`<!-- ANCHOR:section -->`) enforce required anchors, section ordering, and template version alignment.
- **Validation (`validate.sh`)** — 20+ rules checking required files, template compliance, placeholder detection, anchor markers, cross-reference consistency, continuity freshness, strict EVIDENCE-marker linting, and `PHASE_PARENT_CONTENT` rule (forbids migration-history tokens in phase-parent `spec.md`). Exit codes: 0 success, 1 user error, 2 validation error, 3 system error. Flags: `--strict`, `--verbose`, `--recursive`.
- **Spec Folder Lifecycle** — Gate 3 asks "Which spec folder?" (A/B/C/D/E) before any file modification. `create.sh` scaffolds; `upgrade-level.sh` renders additional level sections; `check-placeholders.sh` verifies no remaining placeholders; `calculate-completeness.sh` scores completeness; `check-completion.sh` verifies all completion criteria; `archive.sh` archives completed folders; `recommend-level.sh` analyzes scope/risk to suggest level.
- **Checklist Priority System (Level 2+)** — P0 (hard blocker, cannot defer), P1 (required, needs approval to defer), P2 (optional, can defer).
- **Packet-Local Changelog** — Packet roots and direct child phases produce `changelog/` entries beside the packet via `templates/changelog/` and the nested changelog workflow.
- **mk-spec-memory MCP Server** — 37-tool MCP server providing persistent semantic memory across sessions, models, and tools. Local SQLite storage. Tool families: memory_search, memory_context, memory_save, memory_health, memory_stats, memory_index_scan, memory_embedding_reconcile, memory_checkpoint, memory_retention_sweep, memory_bulk_delete, memory_match_triggers, memory_ontology, session_bootstrap, and more.
- **Hybrid Retrieval (5 channels)** — Vector (embeddings, `nomic-embed-text-v1.5` 768d local default), FTS5 (full-text search on exact words), BM25 (keyword relevance scoring), Causal Graph (cause-and-effect links), Degree (graph connectivity weighted by edge type). Combined via Reciprocal Rank Fusion (RRF) with per-intent K selection.
- **Search Pipeline (4 stages)** — Gather (parallel candidates from active channels + constitutional injection) → Score (RRF fusion + 8 post-fusion signals: co-activation boost, FSRS decay, interference penalty, cold-start boost, session recency, causal 2-hop, intent weights, channel min-representation) → Rerank (MMR diversity reranking, chunk collapse) → Filter (score immutability, state filtering, confidence labels, confidence-gap truncation).
- **Query Intelligence** — Complexity routing (2/4/all channels), intent classification (7 task types with channel weight profiles), query decomposition (multi-topic splitting without LLM), HyDE fallback (hypothetical document embeddings), LLM reformulation (corpus-grounded), concept expansion (alias matching).
- **Decay / FSRS** — FSRS power-law decay tuned by content type and importance. Six importance tiers: Constitutional (3.0x boost, never decays), Critical (never or 2x slower decay), Important (1.5x slower), Normal (standard FSRS), Temporary (fast decay), Deprecated (fastest decay). Four cognitive states: HOT, WARM, COLD, DORMANT. Promotion through positive feedback.
- **Constitutional Memory** — Always-surface rules with 3.0x boost that never decay. Managed via `/memory:learn` (create, list, edit, remove). Stored in `constitutional/` directory (14 rule files).
- **Save Intelligence** — Prediction Error gating with 4 outcomes: CREATE, REINFORCE, UPDATE, SUPERSEDE. Three quality gates: structure check, semantic sufficiency, duplicate detection. Short decision-type bypass when `SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS=true`. 3-layer save gate: intake validation, content router, post-save quality review (DQI scoring).
- **Continuity and Handover** — `/speckit:resume` is the canonical recovery surface; rebuilds from `handover.md` → `_memory.continuity` (frontmatter in `implementation-summary.md`) → canonical spec docs. `generate-context.js` writes continuity on `/memory:save`. `session_bootstrap()` bundles resume context, health, and structural readiness.
- **Checkpoints** — `memory_checkpoint` creates/restores DB snapshots. Checkpoint-v2 uses `VACUUM ... INTO` file snapshots. `.needs-rebuild` sentinel triggers derived-index rebuild after restore.
- **Causal Graph** — 6 relationship types: `caused`, `enabled`, `supersedes`, `contradicts`, `derived_from`, `supports`. Louvain community detection. Trust badges per result (confidence, extractionAge, lastAccessAge, orphan, weightHistoryChanged).
- **Importance Tiers and Promotion** — 6 tiers (Constitutional through Deprecated). Memories earn promotions: 5 thumbs-up promotes normal→important, 10 promotes to critical.
- **Shared Memory** — Controlled knowledge sharing with deny-by-default access for teams and multi-agent setups.
- **Evaluation Infrastructure** — Ablation studies (turn off one component at a time), 12-metric computation (MRR, NDCG, MAP, etc.), synthetic ground truth corpus (110 test questions), reporting dashboard.
- **Code Graph Integration** — `code_graph_scan`, `code_graph_query`, `code_graph_context`, `code_graph_status`, `detect_changes` under MCP namespace `mcp__mk_code_index__*` (owned by `system-code-graph` skill). Graph-first routing is default query dispatch order.
- **Deep-Loop Integration** — `/deep:start-research-loop` anchors research to `spec.md` through `spec_check_protocol.md`. `/deep:start-review-loop` for autonomous code review. Deep-context, deep-improvement loops also integrate.
- **Index Schema History** — v28 (active-row partial unique index), v29 (checkpoint-v2 metadata columns), v30 (enrichment marker columns). Migrations applied automatically at server boot.
- **MCP Front-Proxy and Daemon Recycle** — Session proxy keeps stable client-facing stdio while backend can be recycled in place. Read-only replayable tools retried across recycle. Error codes: E429 (legacy, coalesced), -32001 (retryable recycle), -32002 (protocol mismatch, terminal).
- **Embedding Providers** — Local-first cascade (ADR-014): Ollama → hf-local (HuggingFace transformers HTTP model server) → OpenAI → Voyage. Circuit breaker for failures. Persistent embedding cache with per-profile and per-query caps.
- **Hook and Plugin Integration** — Per-runtime startup, prompt-submit, and compact-context hooks for Claude Code, Gemini CLI, Codex CLI, Copilot CLI, OpenCode plugin bridge. Shared compact JSON payload shape.
- **Feature Flags** — 141 unique environment variables documented in `ENV_REFERENCE.md`. Graduated semantics (default ON, disable with `=false`) and opt-in (default OFF, enable with `=true`). Runtime-resolved, no module reload needed.
- **Scripts** — 12 spec management scripts, 10 memory scripts, 3 validation helper scripts, plus `check-api-boundary.sh`, `doctor.sh`, template composition, core library (17 modules), extractors (12), utilities (20).
- **Feature Catalog** — 294 implemented features across 24 categories in `feature_catalog/`.
- **Manual Testing Playbook** — 316 scenario files across 24 categories in `manual_testing_playbook/`.
- **Remediation-Packet Naming** — Slugs follow `NNN-fix-<source>-for-<target>` pattern; source names WHERE work comes from, target names WHAT is being fixed.
- **ToC Policy** — Only `research/research.md` may include a Table of Contents; remove ToC headings from standard spec artifacts.
- **Literal Naming for AI-Derived Slugs** — Must include specific subject token; forbidden standalone: `remediation`, `cleanup`, `fix`, `phase-N`, `review-remediation`, `round-N`.
- **Dynamic Token Budget** — Tier-based budgets: Working 3,500 tokens, Core 3,500 tokens, Constitutional 4,000 tokens.
- **Distributed Governance** — Agents writing spec-docs must use contract-backed templates; `@deep-research` owns `research/research.md`; `@debug` owns `debug-delegation.md`; `@deep-review` owns `review-report.md`.
- **Worktree Isolation** — `.opencode/bin/worktree-session.sh` creates per-session git worktrees with isolated `SPEC_KIT_DB_DIR` / `SPECKIT_CODE_GRAPH_DB_DIR` / `SPECKIT_IPC_SOCKET_DIR`.

## 4. THE MCP SURFACE

**mk-spec-memory** exposes approximately 37 tools organized into these families:

| Family | Approximate Count | Purpose |
|--------|-------------------|---------|
| **Search & Retrieval** (~13) | `memory_search`, `memory_context`, `memory_match_triggers`, `session_bootstrap`, plus intent-classified search variants | Hybrid 5-channel retrieval with RRF fusion, query intelligence, and session-aware context |
| **Save & Mutation** (~4) | `memory_save`, `memory_bulk_delete` | Canonical save with 3-layer quality gate, prediction-error arbitration |
| **Index & Scan** (~2) | `memory_index_scan`, `memory_embedding_reconcile` | Self-maintaining index scan, vector reconciliation |
| **Health & Stats** (~3) | `memory_health`, `memory_stats`, `memory_ontology` | Index health, row counts, ontology inspection |
| **Checkpoint & Lifecycle** (~3) | `memory_checkpoint`, `memory_retention_sweep` | DB snapshots, governed retention sweeps |
| **Constitutional Memory** (~6) | via `/memory:learn` command surface | Create, list, edit, remove always-surface rules |
| **Evaluation** (~varies) | ablation, reporting dashboard, eval logging | Search quality measurement and benchmarking |

**Canonical entry commands:**

| Command | Purpose |
|---------|---------|
| `/memory:save` | Update packet continuity surfaces via `generate-context.js` |
| `/memory:search` | Search, retrieve, analyze knowledge (auto-detects 7 intent types) |
| `/memory:manage` | DB maintenance: stats, scan, cleanup, bulk-delete, checkpoints, ingest |
| `/memory:learn` | Constitutional memory manager |
| `/speckit:resume` | Resume from `handover.md` → `_memory.continuity` → canonical spec docs |
| `validate.sh` | 20-rule spec folder validation |
| `generate-context.js` | Canonical continuity write path (`scripts/dist/memory/generate-context.js`) |

Note: exact tool count is drift-prone as features are added/removed per roadmap phase. The README currently claims 37 tools; SKILL.md does not state a count.

## 5. KEY FILES & DIRECTORIES

| Path | Purpose |
|------|---------|
| `SKILL.md` | AI agent instructions: routing, gates, validation, template application, rules (526 lines, version 3.4.1.0) |
| `README.md` | Human/AI-facing overview: what it does, quick start, features, commands, configuration, examples, troubleshooting, FAQ (1084 lines) |
| `ARCHITECTURE.md` | Boundary contract between `scripts/`, `mcp_server/`, and `shared/`; canonical continuity flows; runtime subsystems; hook matrix; ADRs (199 lines) |
| `templates/` | Manifest template source with Level contract resolver; subdirs: `manifest/`, `changelog/`, `examples/`, `scratch/`, `stress_test/` |
| `references/` | Reference documentation organized by domain: `memory/`, `templates/`, `validation/`, `structure/`, `workflows/`, `debugging/`, `config/`, `hooks/`, `cli/` |
| `scripts/` | CLI tools: `spec/` (12 scripts), `memory/` (10 scripts), `validation/` (3 helpers), `core/` (17 modules), `extractors/` (12), `utils/` (20), `dist/` (compiled JS) |
| `mcp_server/` | Spec Kit Memory MCP server: `context-server.ts` (entry), `handlers/`, `lib/`, `formatters/`, `hooks/`, `matrix_runners/`, `stress_test/`, `tests/`, `schemas/`, `configs/`, `scripts/`, `shared/`, `tools/` |
| `mcp_server/ENV_REFERENCE.md` | All 141 `SPECKIT_*` environment variables organized by subsystem with defaults, types, and source references (571 lines) |
| `mcp_server/README.md` | Full MCP architecture: 37-tool API reference, search pipeline, graph intelligence, configuration |
| `mcp_server/INSTALL_GUIDE.md` | Step-by-step installation with embedding providers and environment |
| `shared/` | Neutral modules importable by both scripts and runtime: `algorithms/`, `contracts/`, `embeddings/`, chunker, scoring, parsing, utilities |
| `assets/` | Decision matrices and YAML configs: `complexity_decision_matrix.md`, `level_decision_matrix.md`, `parallel_dispatch_config.md`, `template_mapping.md` |
| `config/` | Runtime config: `config.jsonc`, `filters.jsonc`, `README.md` |
| `constitutional/` | 14 always-surface rule files (never decay): comment-hygiene, gate-enforcement, verify-before-completion, etc. |
| `feature_catalog/` | 294 implemented features across 24 categories; `feature_catalog.md` is the master index |
| `manual_testing_playbook/` | 316 manual validation scenario files across 24 categories; `manual_testing_playbook.md` is the master index |
| `changelog/` | Packet-local changelog entries |

## 6. SECTION MAP OF THE CURRENT README

| # | Section Title | Reference Content It Holds |
|---|---------------|---------------------------|
| 1 | **OVERVIEW** | What Spec Kit does (two problems: no paper trail + AI amnesia), how it compares to manual docs/basic RAG, key features at a glance (8 bullets), requirements (Node >= 20.11, TS 5.0+, Bash 4.0+), embedding provider cascade (local-first ADR-014), workspace module profile (ESM packages) |
| 2 | **QUICK START** | 6 walkthroughs: create first spec folder (`create.sh`), save context (`generate-context.js` / `/memory:save`), resume work (`/speckit:resume`), search for context (`/memory:search`), validate a spec folder (`validate.sh`), verify MCP is running (`memory_health`); Codex CLI note on `SPEC_KIT_DB_DIR` |
| 3 | **FEATURES** (4 subsections) | 3.1 Spec Folder Workflows: what spec folders are, documentation levels table (1/2/3/3+/Phase Parent), folder structure tree, checklist priority (P0/P1/P2), phase decomposition, validation (20+ rules, exit codes). 3.2 Memory System: hybrid search (5 channels table), search pipeline (4 stages), query intelligence (complexity routing, intent classification, query decomposition, HyDE fallback), memory lifecycle (FSRS tiers table, 4 cognitive states), causal graph (6 relationship types, Louvain), causal trust badges, save intelligence (4 outcomes, 3 quality gates), embedding reconciliation, index scan self-maintaining, index schema history (v28→v30), MCP front-proxy and daemon recycle (E429/-32001/-32002), evaluation infrastructure (ablation, 12 metrics, 110 ground truth, dashboard). 3.3 Commands: 4 `/speckit:*` commands with steps table, mode suffixes (`:auto`, `:confirm`, `:with-phases`, `:with-research`), 4 `/memory:*` commands with tool counts, command source file locations. 3.4 Templates: manifest architecture, Level contract resolver, `create.sh` CLI, `SPECKIT_POST_VALIDATE`, path traversal rejection, advisory lock on description.json writes, template compliance (ANCHOR markers). 3.5 Scripts and Validation: 12 spec management scripts table, 10 memory scripts table, 3 validation helper scripts table, template rendering |
| 4 | **STRUCTURE** | Full directory tree of the skill (26 top-level entries), key files table (9 entries), "How the Pieces Connect" narrative (filing system + librarian metaphor), lifecycle flow diagram (Gate 3 → modify → generate-context.js → MCP reindex → /speckit:resume → session_bootstrap), packet lifecycle description with `/speckit:plan --intake-only`, `/deep:start-research-loop`, `/speckit:plan`, `/speckit:complete` |
| 5 | **CONFIGURATION** | Embedding providers table (4 tiers: Ollama, HuggingFace Local, OpenAI, Voyage), environment variables table (8 core vars), MCP server configuration (generic JSON config block for Claude Desktop), feature flags table (5 groups), dynamic token budget table (3 tiers) |
| 6 | **USAGE EXAMPLES** | 5 worked examples: start a new feature (Level 2), resume work, save context, create phase decomposition, run validation. Common patterns table (9 patterns with commands) |
| 7 | **TROUBLESHOOTING** | 8 failure modes: MCP tools return "Tool Not Found", memory save fails/empty file, memory save rejected by quality gate, validation fails "missing required files", memory search returns poor results, `memory_health` reports corrupt/FTS5 integrity failure, memory save fails while live daemon running, quick fixes table (7 entries), diagnostic commands (4 commands) |
| 8 | **FAQ** | 8 Q&A pairs: mandatory for every file change?, Level 2 vs Level 1?, when Level 3?, how spec folders and memory work together?, can I use memory without spec folders?, difference between this README and MCP server README?, difference between SKILL.md and this README?, what is Constitutional Memory?, how to upgrade level after the fact? |
| 9 | **RELATED DOCUMENTS** | Internal documentation table (17 entries with paths), cross-skill alignment table (sk-doc, sk-code, sk-git), project-level references table (4 entries), external resources table (3: MCP spec, FSRS, sqlite-vec). Footer with documentation version, last updated date, and coverage summary |

## 7. TROUBLESHOOTING & FAQ MATERIAL

**Troubleshooting failure modes (from section 7):**

1. **MCP Tools Return "Tool Not Found"** — Server not running or not registered in MCP config. Fix: check `node` version >= 20.11, verify `mk-spec-memory` in `opencode.json`.
2. **Memory Save Fails or Creates an Empty File** — Invalid JSON input, missing explicit spec-folder target, or TS not compiled to `dist/`. Fix: `npm run build`, retry with valid structured payload.
3. **Memory Save Rejected by Quality Gate** — Content too thin or missing required structure. Fix: add more detail, use `dryRun: true` to preview, check post-save quality review.
4. **Validation Fails "Missing Required Files"** — Folder created manually without `create.sh`, or wrong level templates. Fix: `ls` the folder, run `recommend-level.sh`, run `upgrade-level.sh`.
5. **Memory Search Returns Poor Results** — Stale embedding index or vague query. Fix: `memory_index_scan`, `memory_health`, use more specific query with intent hints.
6. **`memory_health` Reports Corrupt or FTS5 Integrity Failure** — Unclean shutdown crash marker present. Fix: restart server to trigger auto-heal (`SPECKIT_BOOT_FTS_AUTOHEAL`), then `memory_embedding_reconcile({ mode: "apply" })` if `degraded_needs_repair`.
7. **Memory Save Fails While Live Daemon Is Running** — Single-writer lease conflict between standalone script and live daemon. Fix: use `/memory:save` MCP tool path instead of `generate-context.js` directly.
8. **Quick Fixes table** — `generate-context.js` not found (run build), validation fails (run `--verbose`), memory context wrong (check `memory_stats`), session context lost after crash (`/speckit:resume`), placeholder check fails (`check-placeholders.sh`), stale results after save (`memory_index_scan`), too many near-duplicates (check interference penalty flag).

**FAQ questions (from section 8):**

1. Is System Spec Kit mandatory for every file change? (Yes, exempt only <5 char single-file fixes)
2. When do I need Level 2 instead of Level 1? (Multi-file, testing, edge cases)
3. When do I need Level 3? (Architecture, trade-offs, 500+ LOC, "why?" decisions)
4. How do spec folders and memory work together? (Spec folders capture, memory retrieves)
5. Can I use memory without spec folders? (Yes for indexing, but Gate 3 still asks for file modifications)
6. Difference between this README and the MCP server README? (This = whole skill; MCP README = deep memory reference)
7. Difference between SKILL.md and this README? (SKILL.md = employee handbook for AI agents; README = product brochure for humans/AI)
8. What is Constitutional Memory? (Always-surface rules, 3.0x boost, never decay, managed via `/memory:learn`)
9. How do I upgrade a Level 1 folder to Level 2 after the fact? (`upgrade-level.sh` + `check-placeholders.sh`)

## 8. STALE FACTS

1. **Version mismatch in README footer**: The README footer (line 1084) states `Skill version: 3.4.0.0` while `SKILL.md` frontmatter (line 5) states `version: 3.4.1.0`. The README is stale by one patch version.
2. **Changelog path reference**: README section 9 (line 1055) links to `../../changelog/system-spec-kit/v3.4.2.0.md` which references a version (v3.4.2.0) newer than both the README's self-declared version (3.4.0.0) and SKILL.md's version (3.4.1.0). This is likely correct for the latest release but creates a three-way version inconsistency across the files.
3. **ARCHITECTURE.md ADR-007 cascade order**: Line 187 of `ARCHITECTURE.md` states the embedding cascade as `Voyage → OpenAI → ollama → hf-local`, which is the **old** order. The current cascade per SKILL.md, README.md, and ENV_REFERENCE.md is `Ollama → hf-local → OpenAI → Voyage` (local-first, ADR-014). The ADR table is stale.
4. **README tool count**: README section 3.2 (line 256) and section 9 (line 1038) claim "37-tool MCP server". The MCP server README and ENV_REFERENCE.md may reflect a different current count as features are added per roadmap phases. This is flagged as potentially drift-prone but matches the current README claim.

All other checked facts (file paths, command names, exit codes, variable names, script counts, feature descriptions) are consistent across SKILL.md, README.md, ARCHITECTURE.md, and ENV_REFERENCE.md.