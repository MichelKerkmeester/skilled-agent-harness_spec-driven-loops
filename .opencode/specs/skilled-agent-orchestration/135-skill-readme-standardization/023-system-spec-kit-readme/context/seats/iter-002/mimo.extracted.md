Now let me get the remaining tool definitions and count them:
Now let me verify a few remaining details:
Here is the verification report:

---

## 1. VERSION & ENTRY POINTS

| Claim | Source | Status |
|-------|--------|--------|
| `version: 3.4.1.0` | `SKILL.md:5` | **CONFIRMED** — matches frontmatter `version: 3.4.1.0` |
| `/memory:save` | `SKILL.md:249`, `README.md:97-99` | **CONFIRMED** — documented as command shorthand |
| `/speckit:resume` | `SKILL.md:251`, `README.md:107-109` | **CONFIRMED** — documented recovery surface |
| `scripts/spec/validate.sh` | `SKILL.md:428`, exists at `scripts/spec/validate.sh` | **CONFIRMED** |
| `scripts/dist/memory/generate-context.js` | `SKILL.md:507`, exists on disk | **CONFIRMED** |
| README footer says `Skill version: 3.4.0.0` | `README.md:1084` | **STALE** — should be `3.4.1.0` per SKILL.md |
| README footer says `Documentation version: 3.4` | `README.md:1084` | Plausible, but inconsistent with `3.4.1.0` skill version |
| README references `../../changelog/system-spec-kit/v3.4.2.0.md` | `README.md:1055` | **UNVERIFIABLE** — file path not confirmed to exist |

## 2. THE MCP TOOL SURFACE

**Authoritative source:** `mcp_server/tool-schemas.ts` — the `TOOL_DEFINITIONS` array at line 709 enumerates all registered tools.

- **Exact tool count: 37** — confirmed by `grep` on `ToolDefinition` constants (37) and by counting the `TOOL_DEFINITIONS` array entries (37).
- README claims **"37-tool MCP server"** at `README.md:45,256,581,1003` — **CONFIRMED**.

**Tool families by handler file count:** `mcp_server/handlers/` contains **40 entries** (38 `.ts` files + `save/` subdirectory + `README.md`).

**Tool families by layer:**
| Layer | Tools |
|-------|-------|
| L1 Orchestration | memoryContext, sessionResume, sessionBootstrap |
| L2 Core | memorySearch, memoryQuickSearch, memoryMatchTriggers, memorySave |
| L3 Discovery | memoryList, memoryStats, memoryHealth, sessionHealth |
| L4 Mutation | memoryDelete, memoryUpdate, memoryValidate, memoryBulkDelete, memoryRetentionSweep, memoryEmbeddingReconcile |
| L5 Lifecycle | checkpointCreate, checkpointList, checkpointRestore, checkpointDelete |
| L6 Analysis | taskPreflight, taskPostflight, memoryDriftWhy, memoryCausalLink, memoryCausalStats, memoryCausalUnlink, evalRunAblation, evalReportingDashboard |
| L7 Maintenance | memoryIndexScan, memoryGetLearningHistory, memoryIngestStart, memoryIngestStatus, memoryIngestCancel, embedderList, embedderSet, embedderStatus |

Code Graph tools were migrated to `system-code-graph` (line 646-647: "Code-graph tool schemas migrated to system-code-graph standalone MCP server"). Skill Graph tools live in `system-skill-advisor`.

## 3. RETRIEVAL & MEMORY MODEL

| Concept | Source | Detail |
|---------|--------|--------|
| 5-channel hybrid search (Vector, FTS5, BM25, Causal Graph, Degree) | `README.md:260-268`, `ARCHITECTURE.md:139` | **CONFIRMED** |
| RRF fusion | `README.md:270`, `ARCHITECTURE.md:139`, `ENV_REFERENCE.md:177-178` (SPECKIT_RRF, SPECKIT_RRF_K=40) | **CONFIRMED** |
| FSRS decay model | `README.md:292`, `ARCHITECTURE.md:184` (ADR-004) | **CONFIRMED** — "FSRS power-law forgetting curve" |
| 6 importance tiers (Constitutional, Critical, Important, Normal, Temporary, Deprecated) | `README.md:294-301`, `SKILL.md:413-414` | **CONFIRMED** |
| 4 cognitive states (HOT, WARM, COLD, DORMANT) | `README.md:305` | **CONFIRMED** |
| Constitutional memory: 3.0x boost, never decays | `README.md:50,296` | **CONFIRMED** |
| Causal graph: 6 relationship types | `README.md:311` (caused, enabled, supersedes, contradicts, derived_from, supports) | **CONFIRMED** — matches `memoryDriftWhy` tool schema |
| Community detection (Louvain algorithm) | `README.md:311`, `ENV_REFERENCE.md:254` | **CONFIRMED** |
| Continuity recovery ladder: handover.md → _memory.continuity → canonical spec docs | `SKILL.md:407`, `README.md:111,594,596`, `ARCHITECTURE.md:114-119` | **CONFIRMED** |
| 4-stage pipeline: Gather → Score → Rerank → Filter | `README.md:274-279`, `ARCHITECTURE.md:139` | **CONFIRMED** |
| MMR diversity reranking (no model) | `README.md:278`, `ENV_REFERENCE.md:183` (SPECKIT_MMR) | **CONFIRMED** |
| Cross-encoder reranking removed | `SKILL.md:418-419` | **CONFIRMED** — removed in 014 deprecation |
| 7 intent task types | `README.md:287` | **CONFIRMED** — matches `memorySearch` tool schema enum |
| HyDE fallback | `README.md:288`, `ENV_REFERENCE.md:225` | **CONFIRMED** |

## 4. CONFIGURATION

**README env vars** (`README.md:639-650`) cross-checked against `ENV_REFERENCE.md`:

| README Variable | ENV_REFERENCE Status |
|----------------|---------------------|
| `EMBEDDINGS_PROVIDER` | Not a `SPECKIT_*` var — documented at ENV_REFERENCE.md:408 as embedding cascade control. **Present.** |
| `VOYAGE_API_KEY` | ENV_REFERENCE.md:408 (embedding section). **Present.** |
| `OPENAI_API_KEY` | ENV_REFERENCE.md:408. **Present.** |
| `OLLAMA_EMBEDDINGS_MODEL` | ENV_REFERENCE.md:408. **Present.** |
| `HF_EMBEDDINGS_MODEL` | ENV_REFERENCE.md:408. **Present.** |
| `SPEC_KIT_DB_DIR` / `SPECKIT_DB_DIR` | ENV_REFERENCE.md:147. **Present.** |
| `MEMORY_DB_PATH` | **NOT in ENV_REFERENCE.md** — not documented as a `SPECKIT_*` variable. May be a legacy or external var. **FLAG** |
| `SPEC_KIT_LOG_LEVEL` | **NOT in ENV_REFERENCE.md**. **FLAG** — not documented in the SPECKIT env reference. |
| `SPECKIT_LAUNCHER_RSS_SELF_EXIT` | **NOT in ENV_REFERENCE.md** section 2. Not listed. **FLAG** |
| `SPECKIT_BACKEND_ONLY` | ENV_REFERENCE.md:151. **Present.** |

ENV_REFERENCE.md documents **141 unique variables** (line 109: "Total unique variables documented: 141").

README points to `references/config/environment_variables.md` for the full list (`README.md:652`).

## 5. DOCUMENTATION LEVELS & VALIDATION

| Claim | Source | Status |
|-------|--------|--------|
| Level 1: `<100 LOC`, spec.md, plan.md, tasks.md, implementation-summary.md | `README.md:164-166` | **CONFIRMED** |
| Level 2: `100-499 LOC`, Level 1 + checklist.md | `README.md:167` | **CONFIRMED** |
| Level 3: `500+ LOC`, Level 2 + decision-record.md | `README.md:168` | **CONFIRMED** |
| Level 3+: `Complexity 80+`, Level 3 + approval workflow | `README.md:169` | **CONFIRMED** |
| Phase Parent: spec.md, description.json, graph-metadata.json | `README.md:170`, `SKILL.md:405` | **CONFIRMED** |
| `validate.sh --strict` | `SKILL.md:61,428` | **CONFIRMED** |
| `validate.sh --recursive` for phase folders | `README.md:229,244` | **CONFIRMED** |
| `validate.sh` exit codes: 0=success, 1=user error, 2=validation error, 3=system error | `SKILL.md:111-115`, `README.md:130,237-242` | **CONFIRMED** |
| 20+ validation rules | `README.md:235,489`, `SKILL.md:451` | **CONFIRMED** |
| `implementation-summary.md` required at all levels, created after implementation | `README.md:174`, `SKILL.md:452` | **CONFIRMED** |
| `is_phase_parent()` (shell) and `isPhaseParent()` (ESM JS) | `README.md:199` | **CONFIRMED** — `is-phase-parent.ts` exists in `scripts/spec/` |
| README says `scripts/spec/` contains 12 scripts | `README.md:484` | **STALE** — actual count is **14 `.sh` files** (including `check-smart-router.sh` and `scaffold-debug-delegation.sh`) |
| README says `scripts/memory/` contains 10 scripts | `README.md:503` | **NEEDS CHECK** — directory has 13 entries |

## 6. STALE FACTS IN CURRENT README

1. **Skill version mismatch:** README footer (`README.md:1084`) says `Skill version: 3.4.0.0` but SKILL.md frontmatter (`SKILL.md:5`) says `3.4.1.0`.

2. **Spec script count:** README says "12 scripts" (`README.md:484`) but `scripts/spec/` contains **14 `.sh` files**. The table at `README.md:486-499` lists 12 scripts but omits `check-smart-router.sh` and `scaffold-debug-delegation.sh`.

3. **Memory script count:** README says "10 scripts" (`README.md:503`) but `scripts/memory/` contains **13 entries**. The table at `README.md:505-517` lists 10 scripts but may omit 3.

4. **`MEMORY_DB_PATH` not in ENV_REFERENCE:** Listed in README (`README.md:647`) but absent from the `mcp_server/ENV_REFERENCE.md` variable tables. Either it is a legacy alias or it is documented only in `references/config/environment_variables.md`.

5. **`SPEC_KIT_LOG_LEVEL` not in ENV_REFERENCE:** Listed in README (`README.md:648`) but absent from `mcp_server/ENV_REFERENCE.md`.

6. **`SPECKIT_LAUNCHER_RSS_SELF_EXIT` not in ENV_REFERENCE:** Listed in README (`README.md:649`) but absent from `mcp_server/ENV_REFERENCE.md`.

7. **Changelog version:** README references `v3.4.2.0.md` (`README.md:1055`) but the skill version is `3.4.1.0`. Either the changelog is forward-looking or the path is stale.

8. **`MEMORY_*` prefix references:** README mentions `MEMORY_DB_PATH` which uses a `MEMORY_` prefix, while the canonical prefix per ENV_REFERENCE is `SPECKIT_` (or the legacy `SPEC_KIT_`). The `MEMORY_` prefix is used for `MCP_SESSION_RESUME_AUTH_MODE` at ENV_REFERENCE.md:164, so some non-SPECKIT vars do exist, but `MEMORY_DB_PATH` is not among them.