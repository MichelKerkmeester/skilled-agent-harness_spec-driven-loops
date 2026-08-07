Now let me quickly verify a few details - the scripts count and a few reference files:
# Reference Inventory: `system-spec-kit` README (Depth-Preserving Restyle)

---

## 1. PURPOSE

The `system-spec-kit` skill enforces mandatory, template-backed spec-folder documentation for every file-modifying AI conversation, backed by a persistent, hybrid-search MCP memory server (`mk-spec-memory`) that preserves decisions, context, and session continuity across models and tools.

---

## 2. PROBLEM

AI conversations that modify files leave no durable reasoning trail — decisions evaporate when the session ends, forcing every new session to start from a blank slate. Without an enforced documentation level and contract-backed templates, one session's spec folder might be empty, another's might be a free-form paragraph, and neither can be validated or resumed against. When an operator returns days later, there is no canonical recovery surface to recall *what was decided*, *what was touched*, and *what comes next*. Persistent semantic memory solves this by storing context locally in a SQLite-backed index that survives across sessions, models, and tools, so the next session can rebuild context from packet-local sources (`handover.md` → `_memory.continuity` → canonical spec docs) before any deeper retrieval is needed.

---

## 3. CAPABILITY SURFACE (the depth)

Every topic documented in the current README and its supporting files, one or two lines each:

- **Four documentation levels (1, 2, 3, 3+)** with LOC guidance (<100, 100–499, 500+, complexity 80+) and per-level required files. Level 1: `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`. Level 2 adds `checklist.md`. Level 3 adds `decision-record.md`. Level 3+ adds approval workflow, compliance, and stakeholder sections.
- **Phase Parent mode** — lean parent folders carry only `spec.md`, `description.json`, `graph-metadata.json`; heavy docs (`plan.md`, `tasks.md`, etc.) live in numbered child phase folders (`001-name/`). The parent `graph-metadata.json` stores `derived.last_active_child_id` + `last_active_at` pointers. `/speckit:resume` follows the pointer for fresh parents, otherwise lists children with statuses. Detection: `is_phase_parent()` (shell) and `isPhaseParent()` (ESM JS) must agree.
- **Template enforcement** — manifest template architecture where `create.sh` + the Level contract resolver (`mcp_server/lib/templates/level-contract-resolver.ts`) render level-appropriate files and sections. ANCHOR markers delimit logical sections. Placeholder detection and upgrade-level injection via `upgrade-level.sh` + `check-placeholders.sh`.
- **Validation** — `validate.sh` runs 20+ rules (required files, template compliance, placeholder detection, anchor markers, cross-reference consistency, `PHASE_PARENT_CONTENT` rule, `EVIDENCE` marker linting, continuity freshness checks). Exit codes: 0=pass, 1=user error, 2=validation error, 3=system error. Flags: `--strict`, `--verbose`, `--recursive`.
- **Spec-folder lifecycle** — `create.sh` scaffolds from templates; `validate.sh` gates completion; `archive.sh` archives completed folders; `upgrade-level.sh` adds higher-level content; `calculate-completeness.sh` returns a percentage; `check-completion.sh` verifies criteria; `recommend-level.sh` analyses scope/risk; `progressive-validate.sh` handles in-progress folders; `quality-audit.sh` runs content quality checks.
- **Checklist priority system (Level 2+)** — P0 (hard block, cannot defer), P1 (required, deferrable only with user approval), P2 (optional).
- **`mk-spec-memory` MCP server** — 37-tool TypeScript MCP server with local SQLite persistence. Subsystem families: context retrieval, semantic search, save + quality gate, continuity routing, checkpoint create/restore, health monitoring, index scan (self-maintaining), embedding reconciliation, ingestion (async), bulk delete, causal graph linking, evaluation/ablation, reporting dashboard, memory validation, retention sweep, session bootstrap/resume, epistemic preflight/postflight learning history, and embedder management. All tools gated by `sp:*` or equivalent permission labels.
- **Hybrid retrieval** — 5-channel pipeline (Vector via `nomic-embed-text-v1.5` 768d default, FTS5, BM25, Causal Graph, Degree). Results fused via Reciprocal Rank Fusion with per-intent K selection. Four pipeline stages: Gather → Score (8 post-fusion scoring signals) → Rerank (MMR diversity + chunk collapse) → Filter (confidence truncation + state filtering).
- **Query intelligence** — complexity routing (simple/moderate/deep), intent classification (7 types: `add_feature`, `fix_bug`, `refactor`, `security_audit`, `understand`, `find_spec`, `find_decision`), query decomposition (splits multi-topic queries into focused sub-queries), HyDE fallback (hypothetical document embeddings).
- **FSRS decay** — Free Spaced Repetition Scheduler power-law forgetting curve tuned by content type and importance. Six importance tiers: Constitutional (never decays, 3.0x boost), Critical (never or 2x slower), Important (1.5x slower), Normal (standard), Temporary (fast decay), Deprecated (fastest decay). Four cognitive states: HOT, WARM, COLD, DORMANT — with tiered content injection (HOT=full, WARM=summary).
- **Constitutional memory** — always-surface rules that never decay, injected at the top of every retrieval result. Managed via `/memory:learn` (create, list, edit, remove, budget). Carries a 3.0x boost.
- **Causal graph** — 6 relationship types (`caused`, `enabled`, `supersedes`, `contradicts`, `derived_from`, `supports`) with community detection via Louvain algorithm. Trust badges (`confidence`, `extractionAge`, `lastAccessAge`, `orphan`, `weightHistoryChanged`) surfaced per result envelope.
- **Save intelligence** — 3-layer save gate (intake validation, content router, post-save quality review) with DQI scoring. Prediction Error gating: CREATE, REINFORCE, UPDATE, SUPERSEDE outcomes. Short decision bypass via `SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS`.
- **Continuity and handover** — `generate-context.js` routes structured JSON into canonical docs (`implementation-summary.md`, `decision-record.md`, `handover.md`), refreshes `description.json` and `graph-metadata.json`. `/speckit:resume` rebuilds context from `handover.md` → `_memory.continuity` frontmatter → canonical spec docs. `session_bootstrap()` bundles resume context, health, and structural readiness.
- **Checkpoints** — named checkpoints of the indexed-continuity store state, with optional embedding inclusion. Restore, delete, list operations. Checkpoint-v2 supports `VACUUM ... INTO` file snapshots.
- **Code graph integration** — `mk-code-index` MCP tools (`code_graph_scan`, `code_graph_query`, `code_graph_context`, `code_graph_status`, `detect_changes`) share a readiness contract with the spec-kit launcher. Stale graph returns blocked/degraded payloads rather than silent empty answers.
- **Deep-loop integration** — `/deep:start-research-loop` anchors research to `spec.md` under `spec_check_protocol.md`. `/deep:start-review-loop` runs iterative code review with convergence detection. `/deep:start-context-loop` gathers codebase context.
- **Index schema migrations (v28→v30)** — active-row unique index (v28), checkpoint-v2 metadata columns (v29), post-insert enrichment marker columns (v30). Applied automatically at server boot.
- **MCP front-proxy daemon recycle** — the launcher front-proxy (`bridgeStdioThroughSessionProxy`) keeps one stable client-facing stdio session while the backend daemon can be recycled in-place (RSS ceiling watchdog, rebuild). Retryable read-only tools auto-retry across a recycle. Three operator-visible error codes: legacy `E429`, `-32001` (RETRYABLE_RECYCLE_ERROR), `-32002` (PROTOCOL_MISMATCH_ERROR).
- **Index scan self-maintenance** — overlapping scan calls return a `coalesced:true` envelope. Rows are BM25/FTS-searchable immediately as `pending` while vectors drain. Move reconciliation heals renamed spec folders by packet identity. Bounded global orphan sweep per scan. `memory_health` index block reports a summary enum (`healthy_fresh`, `healthy_lagging_vectors`, `stale_needs_scan`, `degraded_needs_repair`, `unavailable`).
- **Embedding reconciliation** — `memory_embedding_reconcile` converges `embedding_status` for stale vector-present rows and resets missing-vector retry rows in one `BEGIN IMMEDIATE` transaction. Defaults to dry-run; `mode: "apply"` to commit.
- **`.needs-rebuild` sentinel** — after a checkpoint restore that swaps DB files, a sentinel ensures derived indexes (FTS5/BM25 shadow, vector profile) are rebuilt at next boot before serving.
- **Evaluation infrastructure** — ablation studies (turn off one channel at a time), 12-metric IR computation (MRR, NDCG, MAP, etc.), synthetic ground-truth corpus (~110 test questions), reporting dashboard.
- **Feature flags** — runtime-resolved flags rather than import-time snapshots. Groups: Search Pipeline, Session and Cache, Memory and Storage, Embedding and API, Evaluation and Telemetry. All flags use graduated semantics (default ON, disable with `=false`) or opt-in (default OFF).
- **Hook system** — per-runtime session lifecycle hooks (Claude Code, Gemini, Codex, Copilot) emit compact JSON bootstrap payloads at `SessionStart`, `UserPromptSubmit`, and (where supported) `Compact`. OpenCode uses a plugin bridge.
- **Embedding providers** — 4-tier auto-cascade (ADR-014, local-first): Ollama (768d default) → hf-local (launcher-supervised HTTP model server) → OpenAI (1536d) → Voyage (1024d).
- **Session cleanup** — `.opencode/scripts/session-cleanup.sh` resolves PIDs across claude/opencode/codex/gemini runtimes.
- **Worktree isolation** — `.opencode/bin/worktree-session.sh` creates per-session git worktrees with isolated `SPEC_KIT_DB_DIR`, `SPECKIT_CODE_GRAPH_DB_DIR`, and `SPECKIT_IPC_SOCKET_DIR`.
- **Packet-local changelogs** — `/speckit:implement` and `/speckit:complete` can write changelog entries into a local `changelog/` directory for packet roots and child phases. Nested changelog workflow at `references/workflows/nested_changelog.md`.
- **Shared memory / governance** — deny-by-default membership for teams and multi-agent setups. Governed ingest with tenant/user/agent/session boundaries, retention policies, and provenance tracking.
- **Commands** — 4 `/speckit:*` commands (`plan`, `plan --intake-only`, `implement`, `complete`, `resume`), 4 `/memory:*` commands (`save`, `search`, `manage`, `learn`), plus 6 `/deep:*` commands, 7 `/create:*` commands, 3 `/doctor:*` commands. Mode suffixes: `:auto`, `:confirm`, `:with-phases`, `:with-research`.
- **Distributed governance rule** — any agent writing authored spec docs MUST use contract-backed templates and must run `validate.sh --strict` before completion claims. Deep-research workflow-owned packet markdown is exempt from the generic per-write rule but must run targeted strict validation after every `spec.md` mutation.

---

## 4. THE MCP SURFACE

The `mk-spec-memory` MCP server exposes **37 tools** organized into these families (exact individual tool count is drift-prone; describe families):

| Tool Family | Approx. Count | Purpose |
|---|---|---|
| **Orchestration / session** (`session_bootstrap`, `session_resume`, `session_health`, `memory_context`) | 4 | Startup recovery, unified context retrieval with intent-aware routing, health checks |
| **Search / retrieval** (`memory_search`, `memory_quick_search`, `memory_match_triggers`) | 3 | Hybrid 5-channel search with RRF fusion, trigger-phrase matching with cognitive features |
| **Save / write** (`memory_save`, `memory_update`, `memory_delete`, `memory_bulk_delete`, `memory_ingest_start`, `memory_ingest_status`, `memory_ingest_cancel`) | 7 | Index spec docs, update/delete records, async batch ingestion, retention sweep |
| **Browse / list** (`memory_list`, `memory_stats`) | 2 | Paginated browsing, folder-level statistics with composite ranking |
| **Causal graph** (`memory_causal_link`, `memory_causal_unlink`, `memory_causal_stats`, `memory_drift_why`) | 4 | Create/delete causal edges, stats with backfill, lineage tracing ("why" questions) |
| **Checkpoints** (`checkpoint_create`, `checkpoint_restore`, `checkpoint_delete`, `checkpoint_list`) | 4 | Named store-state snapshots with optional embeddings |
| **Maintenance / health** (`memory_health`, `memory_index_scan`, `memory_embedding_reconcile`) | 3 | Health reports with auto-repair, self-maintaining index scan, embedding reconciliation |
| **Validation / feedback** (`memory_validate`, `memory_retention_sweep`) | 2 | Confidence scoring via user validation, governed retention cleanup |
| **Learning / telemetry** (`task_preflight`, `task_postflight`, `memory_get_learning_history`) | 3 | Epistemic state snapshots, learning index deltas |
| **Evaluation / reporting** (`eval_run_ablation`, `eval_reporting_dashboard`) | 2 | Channel ablation studies, sprint/channel trend dashboards |
| **Embedder management** (`embedder_list`, `embedder_set`, `embedder_status`) | 3 | Registered embedding backend management and re-index job monitoring |

**Canonical entry commands/surfaces:**
- `/memory:save` — update continuity surfaces via `generate-context.js` + semantic indexing
- `/speckit:resume` — canonical operator-facing recovery surface
- `validate.sh --strict` — pre-completion validation gate
- `generate-context.js` — structured JSON → canonical doc routing

---

## 5. KEY FILES & DIRECTORIES

| Path | Purpose |
|---|---|
| `SKILL.md` | AI agent runtime instructions: when to activate, routing rules, gates, validation procedures, template application (526 lines) |
| `ARCHITECTURE.md` | Boundary contract between `scripts/` and `mcp_server/`; package topology, canonical continuity flows, runtime subsystems, hook matrix, ADRs |
| `README.md` | Human + AI-facing overview: what it does, how to use it, where to find things (1084 lines) |
| `templates/` | Manifest template source (`manifest/` subdir) rendered by Level contract resolver; also `changelog/`, `examples/`, `scratch/`, `stress_test/` |
| `references/` | 27+ reference docs across 9 subfolders: `cli/`, `config/`, `debugging/`, `hooks/`, `memory/` (7 files: embedder architecture, resilience, pluggability, epistemic vectors, memory system, save workflow, trigger config), `structure/`, `templates/`, `validation/`, `workflows/` (8 files: quick reference, intake contract, nested changelog, rename pattern, rollback runbook, worked examples, auto mode contract, execution methods) |
| `scripts/` | 55+ entries across ~20 subfolders. Key subfolders: `spec/` (16 scripts: create, validate, upgrade-level, recommend-level, calculate-completeness, check-completion, check-placeholders, check-template-staleness, progressive-validate, quality-audit, archive, test-validation, scaffold-debug-delegation, check-smart-router, README, is-phase-parent.ts), `memory/` (13 scripts including `generate-context.ts`, `rank-memories.ts`, `reindex-embeddings.ts`, `cleanup-orphaned-vectors.ts`, `backfill-frontmatter.ts`, `fix-memory-h1.mjs`), `validation/` (continuity-freshness, evidence-marker-audit, evidence-marker-lint), `core/` (17 modules), `extractors/` (12 extractors), `utils/` (20 utilities), `dist/` (compiled JS output) |
| `assets/` | Decision matrices, YAML configs (workflow automation specs) |
| `config/` | Runtime configuration reference (launcher lease contract) |
| `constitutional/` | Always-surface constitutional memory rules (never decay) |
| `feature_catalog/` | Feature documentation: 22 categories, 294 features cataloged in `feature_catalog.md` |
| `manual_testing_playbook/` | Operator validation scenarios: 22 categories, 316 scenario files |
| `mcp_server/` | Full MCP runtime: `context-server.ts` (entry point), `handlers/` (tool handlers, save pipeline, response assembly), `lib/` (search pipeline, cognitive engine, graph, governance, continuity, resume, embedders), `hooks/` (per-runtime hook payload builders), `formatters/` (response shaping), `schemas/` (Zod input schemas), `tools/` (dispatcher), `core/` (DB state), `database/` (local SQLite), `matrix_runners/` (F1-F14 evaluation harness), `stress_test/` (opt-in load suites), `plugin_bridges/`, `tests/`, `scripts/`, `shared/`, plus `README.md`, `INSTALL_GUIDE.md`, and `ENV_REFERENCE.md` (571 lines, all `SPECKIT_*` env vars organized by subsystem) |
| `shared/` | Neutral modules importable by both `scripts/` and `mcp_server/`: `algorithms/` (RRF fusion, adaptive fusion), `contracts/` (typed trace/envelope), `embeddings/` (provider implementations), chunker, scoring, parsing, utilities |
| `changelog/` | Packet-local changelog entries for system-spec-kit releases |
| `graph-metadata.json` | Skill-level metadata: derived status, version tracking |
| `package.json`, `tsconfig.json`, `vitest.config.ts` | Build, TypeScript, and test configuration |

---

## 6. SECTION MAP OF THE CURRENT README

| Section | Current Title | Reference Content Held |
|---|---|---|
| 1 | **OVERVIEW** | What it does (two-problem framing: no paper trail + AI amnesia), how it compares to manual docs and basic RAG, key features at a glance (8 bullets), requirements (Node.js >= 20.11, TypeScript 5.0+, Bash 4.0+, local-first embeddings), workspace module profile (ESM + NodeNext) |
| 2 | **QUICK START** | Create first spec folder (`create.sh`), save context (`generate-context.js` / `/memory:save`), resume work (`/speckit:resume`), search (`/memory:search`), validate (`validate.sh`), verify MCP is running (`memory_health`), Codex CLI DB-dir note |
| 3 | **FEATURES** (5 subsections) | 3.1 Spec Folder Workflows: folder definition, levels table, structure diagram, checklist priority system, phase decomposition, validation (exit codes, flags). 3.2 Memory System: hybrid search (5 channels), search pipeline (4 stages), query intelligence, memory lifecycle (FSRS tiers + cognitive states), causal graph (6 relation types + trust badges + Louvain), save intelligence (4 outcomes + 3 quality gates), embedding reconciliation, index scan self-maintenance, index schema history v28→v30 + `.needs-rebuild` sentinel, MCP front-proxy daemon recycle, evaluation infrastructure. 3.3 Commands: 4 `/speckit:*` commands table + 4 `/memory:*` commands table + mode suffixes + deep commands. 3.4 Templates: manifest architecture, template compliance (ANCHOR markers). 3.5 Scripts and Validation: 16 spec management scripts table, 13 memory scripts table, validation helper scripts table |
| 4 | **STRUCTURE** | Full directory tree diagram, key files table (9 entries), "how the pieces connect" narrative flow diagram showing session lifecycle from Gate 3 through save to next-session resume |
| 5 | **CONFIGURATION** | Embedding providers table (4-tier ADR-014 cascade), environment variables table, MCP server config JSON block, feature flags groups table, dynamic token budget table |
| 6 | **USAGE EXAMPLES** | 5 walkthrough examples (new feature Level 2, resume work, save context, phase decomposition, run validation) + common patterns table (9 rows) |
| 7 | **TROUBLESHOOTING** | 6 error scenarios with cause/diagnosis/fix: MCP tools not found, memory save fails/empty, save rejected by quality gate, validation missing files, search returns poor results, `memory_health` reports corrupt/FTS5 integrity failure, save conflicts with live daemon. Plus quick fixes table (7 rows) and diagnostic commands block |
| 8 | **FAQ** | 9 Q&A pairs: mandatory for every file change? Level 2 vs Level 1? Level 3 when? Spec folders + memory relationship? Memory without spec folders? README vs MCP server README? SKILL.md vs README? What is Constitutional Memory? How to upgrade Level 1 → Level 2? |
| 9 | **RELATED DOCUMENTS** | Internal docs table (18 entries with file paths), cross-skill alignment table (sk-doc, sk-code, sk-git), project-level references (AGENTS.md, `.opencode/specs/`, commands), external resources (MCP spec, FSRS, sqlite-vec) |

---

## 7. TROUBLESHOOTING & FAQ MATERIAL

**Troubleshooting scenarios (Section 7):**

1. **MCP Tools Return "Tool Not Found"** — MCP server not running or not registered; check Node.js version (>= 20.11), verify `mk-spec-memory` in MCP config
2. **Memory Save Fails or Creates an Empty File** — invalid JSON input, missing spec-folder target, or uncompiled TypeScript; rebuild with `npm run build`, retry with valid payload
3. **Memory Save Rejected by Quality Gate** — content too thin or missing required structure; add more detail, use `dryRun: true` to preview gate results
4. **Validation Fails With "Missing Required Files"** — spec folder created manually without `create.sh`; check file listing, run `recommend-level.sh`, use `upgrade-level.sh`
5. **Memory Search Returns Poor Results** — stale embedding index or vague query; force `memory_index_scan`, check `memory_health`, use more specific query with intent hints
6. **`memory_health` Reports `corrupt` or FTS5 Integrity Failure** — crash marker at boot triggers `PRAGMA quick_check` (hard fail → `.needs-rebuild` sentinel, refuses to start) and FTS5 shadow check (detect-only, server continues degraded); restart to trigger auto-heal, then run `memory_embedding_reconcile({ mode: "apply" })` if `degraded_needs_repair`
7. **Memory Save Fails While a Live Daemon Is Running** — standalone script and live MCP daemon conflict on the single-writer lease; use `/memory:save` (MCP handler path) instead of `generate-context.js` directly when daemon is active

**Quick fixes table (7 rows):** `generate-context.js` not found → `npm run build`; spec folder fails validation → `--verbose`; memory context seems wrong → `memory_stats({})`; session context lost after crash → `/speckit:resume`; placeholder check fails → `check-placeholders.sh`; stale results after save → `memory_index_scan`; too many near-duplicate results → check interference penalty flag

**FAQ questions (Section 8, 9 entries):**
1. Is System Spec Kit mandatory for every file change? (Yes, except <5 char typo/whitespace)
2. When do I need Level 2 instead of Level 1? (Multi-file, testing verification, edge cases; LOC guidance 100-499 but risk matters more)
3. When do I need Level 3? (Architecture decisions, trade-offs, 500+ LOC across systems)
4. How do spec folders and memory work together? (Spec folders capture structured docs; `generate-context.js` updates continuity; `/speckit:resume` rebuilds from packet-local sources; MCP indexes for deeper retrieval)
5. Can I use memory without spec folders? (Yes, for any markdown file, but Gate 3 still asks for a spec folder on file modifications)
6. What is the difference between this README and the MCP server README? (This covers the whole skill; `mcp_server/README.md` goes deep on the 37-tool API, search pipeline, graph intelligence)
7. What is the difference between SKILL.md and this README? (SKILL.md = employee handbook for AI agents; README = product brochure for humans + AI)
8. What is Constitutional Memory? (Always-surface rules with 3.0x boost, never decay; managed via `/memory:learn`)
9. How do I upgrade a Level 1 folder to Level 2 after the fact? (`upgrade-level.sh` followed by `check-placeholders.sh`)

---

## 8. STALE FACTS

1. **Version mismatch** — `README.md:1084` says `Skill version: 3.4.0.0` but `SKILL.md` frontmatter at line 5 declares `version: 3.4.1.0`. The README is one patch version behind.
2. **Documentation version is imprecise** — `README.md:1084` says `Documentation version: 3.4` (no patch component) while the SKILL.md carries a full `3.4.1.0` four-segment version. If the doc version intends to track the skill version, it should read `3.4.1`.
3. **Changelog reference is ahead of SKILL.md version** — `README.md:1055` references `../../changelog/system-spec-kit/v3.4.2.0.md`, which is one patch ahead of both the README's declared `3.4.0.0` and SKILL.md's `3.4.1.0`. This reference may be forward-looking or drift-prone; UNKNOWN whether that changelog file exists on disk today.
4. **Tool count is unverifiable from static files** — The README claims "37-tool MCP server" at lines 45, 586, and 1003. No static reference file independently corroborates the exact count of 37. The count is drift-prone by nature — tools are registered in TypeScript source under `mcp_server/context-server.ts` and `tool-schemas.ts`. Mark this as UNKNOWN (plausible but unverifiable without running the server or counting registration calls in source).
5. **ENV_REFERENCE.md variable count** — `mcp_server/ENV_REFERENCE.md:109` says "Total unique variables documented: 141 (legacy HYDRA aliases removed in commit 6f2c2c939)." The README does not repeat this count; UNKNOWN whether this count is accurate post-generation (the file was last updated 2026-05-23 per its footer).
6. **ARCHITECTURE.md ADR-007 is stale** — `ARCHITECTURE.md:187` states ADR-007: "Embedding provider auto-cascade: Voyage → OpenAI → ollama → hf-local" but this contradicts both the README (Section 5) and `mcp_server/ENV_REFERENCE.md` (Section 15) which declare the ADR-014 local-first cascade: Ollama → hf-local → OpenAI → Voyage. ADR-014 (2026-05-19) superseded ADR-007's cloud-first ordering; the ADR table in ARCHITECTURE.md was not updated to reflect this.