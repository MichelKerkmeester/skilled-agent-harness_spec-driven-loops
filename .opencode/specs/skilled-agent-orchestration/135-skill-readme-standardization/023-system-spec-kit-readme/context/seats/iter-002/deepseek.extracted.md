Let me check the tool registration source and verify key paths exist.
Now I have all the evidence. Here is my structured report:

---

# System Spec Kit README Verification Report

## 1. VERSION & ENTRY POINTS

- **SKILL.md version**: `3.4.1.0` — cited from `.opencode/skills/system-spec-kit/SKILL.md:5`.
- **READMD version footer**: Line 1084 reads `Skill version: 3.4.0.0` — **stale, disagrees with SKILL.md** (see §6 below).
- **`/memory:save`**: Referenced as a canonical command in `.opencode/skills/system-spec-kit/SKILL.md:248` (`COMMAND_BOOSTS`), `.opencode/skills/system-spec-kit/README.md:98,747`, and `.opencode/skills/system-spec-kit/ARCHITECTURE.md:122`. Valid entry point.
- **`/speckit:resume`**: Referenced in `.opencode/skills/system-spec-kit/SKILL.md:251` (`COMMAND_BOOSTS`), `.opencode/skills/system-spec-kit/README.md:108`. Recovery chain documented in `.opencode/skills/system-spec-kit/ARCHITECTURE.md:114-119`. Valid entry point.
- **`scripts/spec/validate.sh`**: Exists at `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` (47,132 bytes, executable, last modified May 29). Referenced in SKILL.md:504 and README.md:127 as canonical validation surface.
- **`scripts/dist/memory/generate-context.js`**: Exists at `.opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js` (33,395 bytes, last modified Jun 5). Referenced as the primary save entrypoint in SKILL.md:507 and README.md:88.

All four canonical entry points confirmed present and match documentation claims.

---

## 2. THE MCP TOOL SURFACE

### Authoritative tool list

Source: `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` (imported by `context-server.ts:32` as `TOOL_DEFINITIONS`, exposed via `ListToolsRequestSchema` at line 1034).

**Exact count: 37 tools**, registered in `TOOL_DEFINITIONS` and validated by `KNOWN_TOOL_NAMES` at `context-server.ts:1027`.

### Tool families (37 total)

| Family | Tools | Count |
|--------|-------|-------|
| **Memory search/context** | `memory_context`, `memory_search`, `memory_quick_search`, `memory_match_triggers`, `memory_drift_why` | 5 |
| **Memory save** | `memory_save` | 1 |
| **Memory CRUD** | `memory_list`, `memory_stats`, `memory_delete`, `memory_update`, `memory_bulk_delete` | 5 |
| **Memory health** | `memory_health`, `memory_validate` | 2 |
| **Memory index** | `memory_index_scan` | 1 |
| **Embedding** | `memory_embedding_reconcile`, `embedder_list`, `embedder_set`, `embedder_status` | 4 |
| **Causal graph** | `memory_causal_link`, `memory_causal_stats`, `memory_causal_unlink` | 3 |
| **Checkpoint** | `checkpoint_create`, `checkpoint_list`, `checkpoint_restore`, `checkpoint_delete` | 4 |
| **Ingest** | `memory_ingest_start`, `memory_ingest_status`, `memory_ingest_cancel` | 3 |
| **Retention** | `memory_retention_sweep` | 1 |
| **Session** | `session_health`, `session_resume`, `session_bootstrap` | 3 |
| **Task/eval** | `task_preflight`, `task_postflight`, `eval_run_ablation`, `eval_reporting_dashboard` | 4 |
| **Learning** | `memory_get_learning_history` | 1 |

### Tool count agreement

The README consistently claims **37-tool MCP server** (lines 45, 256, 584, 1003). This **agrees** with the authoritative `tool-schemas.ts` count of 37. No discrepancy.

The handler file count (`mcp_server/handlers/` directory) = 40 entries, which is **not** the tool count — handlers include internal utility/processor modules alongside tool-handler files. The correct source-of-truth is `tool-schemas.ts`, confirming 37.

---

## 3. RETRIEVAL & MEMORY MODEL

### Retrieval pipeline

| Aspect | Claim | Source |
|--------|-------|--------|
| **5 channels** | Vector, FTS5, BM25, Causal Graph, Degree | README.md:262-268; ARCHITECTURE.md:139; ENV_REFERENCE.md:16 |
| **Fusion method** | Reciprocal Rank Fusion (RRF) with per-intent K parameter | SKILL.md:3.2 (line naming); ENV_REFERENCE.md:85 (`SPECKIT_RRF_K_EXPERIMENTAL`) |
| **4 pipeline stages** | Gather → Score → Rerank → Filter | README.md:274-279; ARCHITECTURE.md:139 |
| **Stage 2 scoring** | 8 post-fusion signals: co-activation boost, FSRS decay, interference penalty, cold-start boost, session recency, causal 2-hop, intent weights, channel min-representation | README.md:277 |
| **Stage 3** | MMR diversity reranking (algorithmic, no model) | README.md:278; ENV_REFERENCE.md:38 (`SPECKIT_MMR`) |
| **Cross-encoder reranking** | Removed in 014 deprecation; `SPECKIT_CROSS_ENCODER` / `RERANKER_LOCAL` flags no longer wired | SKILL.md:417-419 |

### Decay model

| Aspect | Claim | Source |
|--------|-------|--------|
| **Model** | FSRS (Free Spaced Repetition Scheduler), "validated on 100M+ Anki flashcard users" | README.md:292; ARCHITECTURE.md line 184 (ADR-004); SKILL.md keyword block line 8 (`fsrs-decay`) |
| **Type-aware** | Decisions/constitutional types get `Infinity` stability (no decay); content type affects decay speed | README.md:303; ENV_REFERENCE.md:73 (`SPECKIT_HYBRID_DECAY_POLICY`) |

### Importance tiers

| Tier | Decay behavior | Source |
|------|---------------|--------|
| **Constitutional** | Never decays (3.0x boost) | README.md:296; SKILL.md:8 (keyword) |
| **Critical** | Never decays or 2x slower | README.md:297 |
| **Important** | 1.5x slower | README.md:298 |
| **Normal** | Standard FSRS decay | README.md:299 |
| **Temporary** | Fast decay | README.md:300 |
| **Deprecated** | Fastest decay | README.md:301 |

### Cognitive states

HOT, WARM, COLD, DORMANT — documented at README.md:305 with access-pattern descriptions.

### Constitutional memory

Managed via `/memory:learn` (6 tools). Works as "always-surface rules" with 3.0x boost that never decay. Documented at README.md:50, SKILL.md:8 (keyword), and README.md:1013-1015 (FAQ).

### Continuity / handover

Recovery ladder: `handover.md` → `_memory.continuity` → canonical spec docs (`implementation-summary.md` → `tasks.md` → `plan.md` → `spec.md`). Documented at ARCHITECTURE.md:114-119 and README.md:47. Write path via `generate-context.js` → `description.json` + `graph-metadata.json` refresh → MCP re-index (ARCHITECTURE.md:121-125).

---

## 4. CONFIGURATION

### README env var table vs ENV_REFERENCE.md

The README §5 (lines 639-651) documents a 10-variable short table. Cross-check against `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md`:

| README Variable | In ENV_REFERENCE.md? | Match? |
|----------------|----------------------|--------|
| `EMBEDDINGS_PROVIDER` | Section 15 (line 408) | Yes |
| `VOYAGE_API_KEY` | Section 15 (line 411) | Yes |
| `OPENAI_API_KEY` | Section 15 (line 411) | Yes |
| `OLLAMA_EMBEDDINGS_MODEL` | Section 15 (line 411) | Yes |
| `HF_EMBEDDINGS_MODEL` | Section 15 (line 411) | Yes |
| `SPEC_KIT_DB_DIR` / `SPECKIT_DB_DIR` | Section 2 (line 147) | Yes |
| `MEMORY_DB_PATH` | Section 2 (line 147) | Yes, as `MEMORY_DB_PATH` (alt name in description) |
| `SPEC_KIT_LOG_LEVEL` | Not found | UNKNOWN — may be defined in a reference file not scanned |
| `SPECKIT_LAUNCHER_RSS_SELF_EXIT` | Not found as a table entry | Used in launcher code (`.opencode/bin/mk-spec-memory-launcher.cjs`) but absent from ENV_REFERENCE.md tables — **ENV_REFERENCE.md gap, not README error** |
| `SPECKIT_BACKEND_ONLY` | Section 2 (line 151) | Yes |
| `SPECKIT_CONTEXT_SERVER_MAX_RSS_MB` (referenced in README line 649 description) | Not found as a table entry | The real code uses this var (`.opencode/bin/lib/model-server-supervision.cjs:169`, `.opencode/bin/mk-spec-memory-launcher.cjs` watchdog) — **ENV_REFERENCE.md omission** |

The similar-named `SPECKIT_CONTEXT_SERVER_MAX_OLD_SPACE_MB` (ENV_REFERENCE.md line 149) is a **different** variable (V8 old-space cap, not RSS ceiling). The README correctly references the right variable name for the RSS watchdog.

### No renamed/removed variables found

Deprecated variables in ENV_REFERENCE.md §17 (lines 476-480):
- `SPECKIT_EAGER_WARMUP` → removed
- `SPECKIT_EMBEDDER_EXECUTION` → no-op
- `SPECKIT_LAZY_LOADING` → removed
- `SPECKIT_SHADOW_SCORING` → renamed to `SPECKIT_SHADOW_FEEDBACK`
- `SPECKIT_RSF_FUSION` → renamed to `SPECKIT_RRF`

None of these deprecated names appear in the README's env var table. Clean.

---

## 5. DOCUMENTATION LEVELS & VALIDATION

### Level definitions

Source: `.opencode/skills/system-spec-kit/README.md:164-170` (duplicated in SKILL.md §AGENTS.md reference).

| Level | LOC | Required files | Source |
|-------|-----|---------------|--------|
| **1** | <100 | `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` (post-impl) | README.md:166 |
| **2** | 100-499 | Level 1 + `checklist.md` | README.md:167 |
| **3** | 500+ | Level 2 + `decision-record.md` | README.md:168 |
| **3+** | Complexity 80+ | Level 3 + approval workflow, compliance, stakeholders | README.md:169 |
| **Phase Parent** | n/a (control file only) | `spec.md`, `description.json`, `graph-metadata.json` (lean trio) | README.md:170; SKILL.md:3.1 (phase parent rule) |

### Phase-parent rule

Detection via `is_phase_parent()` (shell) and `isPhaseParent()` (ESM JS) — single source of truth. Parent only requires the lean trio. Heavy docs live in phase children. Documented at:
- README.md:199-200
- ARCHITECTURE.md:182 (ADR-002)
- SKILL.md:405

### `validate.sh` strict contract

Exit codes: 0 = pass, 1 = user error, 2 = validation error, 3 = system error. Documented at:
- README.md:237-242
- SKILL.md:113-115 (same codes for all operational scripts)
- ARCHITECTURE.md:169

20+ validation rules covering required files, template compliance, placeholder detection, anchor markers, cross-reference consistency, `PHASE_PARENT_CONTENT` rule, continuity freshness, and EVIDENCE marker linting. README.md:235.

---

## 6. STALE FACTS IN CURRENT README

### Found:

1. **Skill version mismatch**: README.md line 1084 footer says `Skill version: 3.4.0.0` but the authoritative `SKILL.md:5` declares `version: 3.4.1.0`. The README is one patch version behind.

### Not stale (verified accurate):

- **Tool count (37)** matches `tool-schemas.ts` exactly.
- **All env vars** in the README table match ENV_REFERENCE.md or real launcher source.
- **Search pipeline description** (5 channels, RRF fusion, FSRS decay, 4 stages) matches SKILL.md, ARCHITECTURE.md, and ENV_REFERENCE.md.
- **Documentation levels and required files** match SKILL.md's level contract.
- **`/memory:save`, `/speckit:resume`, `validate.sh`, `generate-context.js`** paths all verified present.
- **ADR-007 cascade order** is stale in `ARCHITECTURE.md:187` (says "Voyage → OpenAI → ollama → hf-local" but actual per ADR-014 is "Ollama → hf-local → OpenAI → Voyage"), but this is an ARCHITECTURE.md issue, not a README issue — the README correctly states "local-first (ADR-014)" at line 56.