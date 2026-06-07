Now I have all the data needed. Here is the report:

---

## 1. PURPOSE

`system-skill-advisor` is the standalone Gate 2 skill-routing surface that scores a non-trivial user prompt against indexed skill metadata, hook signals, and a SQLite skill graph, then returns calibrated, prompt-safe recommendations a runtime can trust — running as its own MCP server `mk_skill_advisor`.

## 2. PROBLEM

When an agent receives an ambiguous prompt like "create a new agent," there is no safe, automated way to decide which skill should handle it. Guessing a skill without calibrated confidence silently misroutes work — sending code to a doc skill or forgetting to load required context entirely. A stale routing index that answers anyway is worse than no answer: it fabricates a recommendation the runtime trusts, hiding the fact that source metadata changed since the last build. A prompt routed through hooks must never leak raw user text into logs or telemetry, yet routing must still be explainable and auditable. The advisor solves all of these by scoring through five evidence lanes, refusing to answer when its state is stale or absent, redacting prompt content from all attribution output, and running as its own process so failures are contained and don't cascade into memory or code-graph systems.

## 3. MODES & CAPABILITIES

- **Five-lane scorer** — fuses explicit author signals, lexical overlap, skill-graph causality, derived metadata, and a semantic shadow lane into a single calibrated score with per-lane attribution.
- **Prompt-safe attribution** — all public responses redact raw prompt text; reason strings reference lane identifiers and evidence labels (e.g., `lexical=0.85`), never prompt substrings.
- **Daemon-backed freshness** — a chokidar watcher observes `.opencode/skills/*/SKILL.md` and `graph-metadata.json` files; on change it bumps a generation counter and invalidates the prompt cache.
- **Trust-state vocabulary** — every response carries one of `live`, `stale`, `absent`, or `unavailable`, forcing callers to inspect freshness before acting.
- **SQLite skill graph with auto-propagated enhances** — cross-skill edges (`depends_on`, `enhances`, `conflicts`) live in `mcp_server/database/skill-graph.sqlite`; a trusted-caller tool detects and optionally applies missing inbound `enhances` declarations.
- **Multi-runtime hooks** — ships prompt-submit hooks for Claude Code, Codex, Gemini, and Devin CLI, plus an OpenCode plugin bridge, all sharing the same prompt-safe output contract.
- **Python compatibility shim** — `mcp_server/scripts/skill_advisor.py` probes the native MCP path first and falls back to local Python scoring, keeping scripts and hooks working when the MCP server is unreachable.
- **Standalone process boundary** — the advisor runs as `mk_skill_advisor`, fully separated from `mk-spec-memory`, so it can be stopped, restarted, tuned, or rolled back without touching memory or code-graph systems.

## 4. INVOCATION

### MCP Tools

**Advisor tools (4 public):**

| Tool | Purpose |
|---|---|
| `advisor_recommend` | Recommend skills for a prompt; returns prompt-safe `recommendations[]`, `freshness`, `trustState`, attribution metadata. |
| `advisor_rebuild` | Rebuild the advisor skill graph from checked-in metadata; transitions `stale`/`absent` → `live`. |
| `advisor_status` | Report advisor freshness, generation, trust state, lane weights, daemon info. |
| `advisor_validate` | Run the regression bundle (corpus, holdout, parity, safety, latency slices); requires `confirmHeavyRun: true`. |

**Skill-graph tools (4 public + 1 internal):**

| Tool | Purpose |
|---|---|
| `skill_graph_scan` | Index every `graph-metadata.json` into the SQLite skill graph. |
| `skill_graph_query` | Traverse the graph: `depends_on`, `dependents`, `enhances`, `enhanced_by`, `family_members`, `conflicts`, `transitive_path`, `hub_skills`, `orphans`, `subgraph`. |
| `skill_graph_status` | Report graph health, counts, staleness. |
| `skill_graph_validate` | Validate for schema drift, broken edges, reciprocal symmetry, dependency cycles. |
| `skill_graph_propagate_enhances` | Detect/propose/apply missing inbound `enhances` edges. **Trusted-caller gated.** |

All tools follow the MCP namespace pattern `mcp__mk_skill_advisor__<tool_name>`. Tool IDs are stable across migrations.

### Gate 2 routing flow

```text
user prompt
  → exact skill name or explicit user direction → named skill wins
  → non-trivial or ambiguous request
      → advisor_recommend on mk_skill_advisor
      → top recommendation above confidence threshold → invoke that skill
      → ambiguous top scores (within margin) → surface candidates and ask
```

**Freshness gate (caller obligation):** Callers MUST inspect `trustState` in every response. `live` → use directly. `stale` → use with caveat, log. `absent` → call `advisor_rebuild` first. `unavailable` → fall back to Python shim or keyword matching against skill frontmatter `trigger_phrases`.

## 5. KEY FILES

| Path | Purpose |
|---|---|
| `SKILL.md` | Runtime routing instructions, tool invariant contract, resource-loading smart router (version 0.6.0). |
| `README.md` | Human-facing skill overview, quick start, features, troubleshooting, FAQ. |
| `ARCHITECTURE.md` | System architecture: package topology, continuity flows, runtime subsystems, ADR records. |
| `INSTALL_GUIDE.md` | Bootstrap, verification, runtime hooks, rollback, operator checks, embedder selection (§12). |
| `references/scoring/` | `advisor_scorer.md` (5 lanes + fusion + 16 calibration constants), `lane_weight_tuning.md` (measurement methodology + decision framework), `validation_baselines.md` (80.5% corpus / 77.5% holdout baselines + troubleshooting). |
| `references/graph/` | `skill_graph_query_cookbook.md` (10 query-type worked examples), `skill_graph_drift.md`, `skill_graph_extraction_plan.md`, `propagate_enhances.md`. |
| `references/runtime/` | `standalone_mcp_shape.md` (ADR-001 topology), `tool_ids_reference.md` (all tool schemas), `legacy_tool_bridge.md`, `freshness_contract.md` (state transitions + caller obligations), `daemon_lease_contract.md`. |
| `references/config/` | `db_path_policy.md` — package-local SQLite path at `mcp_server/database/skill-graph.sqlite`. |
| `references/hooks/` | `skill_advisor_hook.md` — operator contract for prompt-time hooks across Claude/Codex/Gemini/Devin/OpenCode. |
| `references/decisions/` | `deferred_decisions.md` — Tier D decisions: F4 Devin hook migration, F6 deprecation banners, F34–F37 structural deviations. |
| `hooks/claude/`, `hooks/codex/`, `hooks/gemini/`, `hooks/devin/` | Per-runtime prompt-submit hook TypeScript sources (compiled into `mcp_server/dist/`). |
| `mcp_server/` | Standalone MCP server root. Contains `advisor-server.ts` (transport entrypoint). |
| `mcp_server/lib/scorer/lane-registry.ts` | Source-of-truth for lane definitions and live + shadow default weights (lines 7–18). |
| `mcp_server/lib/scorer/scoring-constants.ts` | 16 confidence calibration constants under `ConfidenceCalibration` interface. |
| `mcp_server/tools/` | Tool descriptor files and dispatch (`index.ts`, `advisor-*.ts`, `skill-graph-tools.ts`). |
| `mcp_server/handlers/` | MCP tool handler implementations (advisor handlers + `skill-graph/` subdirectory). |
| `mcp_server/schemas/` | Zod tool response contracts (`advisor-tool-schemas.ts`, etc.). |
| `mcp_server/scripts/` | `skill_advisor.py` (Python compatibility shim), `skill_advisor_regression.py`, `skill_advisor_bench.py`, `skill_graph_compiler.py`, fixtures, routing-accuracy tools. |
| `mcp_server/compat/` | `index.ts` — stable native compatibility entrypoint for plugin bridges. |
| `mcp_server/plugin_bridges/` | `mk-skill-advisor-bridge.mjs` — OpenCode plugin bridge. |
| `mcp_server/database/` | Package-local SQLite runtime state (`skill-graph.sqlite` + WAL/SHM sidecars). |
| `mcp_server/lib/skill-graph/` | `skill-graph-db.ts` + `skill-graph-queries.ts` — database/query logic (fully migrated from system-spec-kit). |
| `feature_catalog/` | 7 feature groups (01–04, 06–08; gap-05 reserved) plus root `feature_catalog.md`. |
| `manual_testing_playbook/` | 9 operator scenario categories (01–08, 10) plus root `manual_testing_playbook.md`. |
| `changelog/` | Versioned changelogs: v0.1.0 through v0.6.0. |

## 6. BOUNDARIES

- The advisor **recommends** a skill; it does **not replace** the target skill. After routing, the actual work is done by the recommended skill (`sk-code`, `sk-doc`, `sk-git`, `mcp-code-mode`, `system-spec-kit`, etc.).
- Memory, spec folders, continuity, packet governance, and validation stay in `system-spec-kit`. The advisor's only dependency on `system-spec-kit` is for the shared embeddings stack (`@spec-kit/shared/embeddings/`) powering the `semantic_shadow` lane and the IPC bridge (`@spec-kit/shared/ipc/socket-server.js`). All non-embedding code is fully isolated.
- Structural code search (callers, imports, blast-radius) belongs to `system-code-graph`, never to the advisor.
- The advisor database (`skill-graph.sqlite`) must never be written by `mk-spec-memory` — only the `mk_skill_advisor` process holds the single-writer lease.

## 7. TROUBLESHOOTING & FAQ MATERIAL

### Common failure modes and gotchas

| Issue | Cause | Fix |
|---|---|---|
| `trustState: "stale"` | Source metadata changed since last rebuild. | `advisor_rebuild({ force: true })`. |
| `trustState: "absent"` | SQLite database missing or corrupt. | `advisor_rebuild`; if persistent, check `MK_SKILL_ADVISOR_DB_DIR` and disk permissions. |
| `trustState: "unavailable"` | MCP server down or unreachable. | Verify `mk_skill_advisor` is registered in `opencode.json`. Fall back to `scripts/skill_advisor.py`. |
| Top-2 candidates within 0.05 score/confidence margin | Ambiguous prompt; two skills equally plausible. | Surface both candidates explicitly; do not route silently. |
| `advisor_validate` baseline drift (corpus top-1 below 80.5%) | Scorer behavior changed or fixtures drifted. | Inspect `perSkill[]` and `slices.corpus` for regressed skills. |
| Newly-added skill not in recommendations | Daemon hasn't observed the new file yet; scan diff ≥ 2 files. | Call `advisor_rebuild` or wait for watcher to fire. |
| Devin hook doesn't disable with `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` | Devin hook checks `MK_SKILL_ADVISOR_HOOK_DISABLED` first. | Set `MK_SKILL_ADVISOR_HOOK_DISABLED=1` for Devin, or both env vars. |
| `advisor_rebuild` fails with lease-busy error | Another process holds the single-writer SQLite lease. | Wait for the current rebuild to finish, or kill the stale process. |
| `advisor_validate` errors with "confirmHeavyRun is required" | Caller didn't opt into heavy work. | Pass `confirmHeavyRun: true`. |
| MCP startup fails with `ERR_MODULE_NOT_FOUND` for `@spec-kit/shared` | Local shared package link missing from `mcp_server/node_modules`. | Run `npm install && npm run build` inside `mcp_server/`. |

### User FAQ questions

1. **Why is the advisor a separate MCP server instead of part of `mk-spec-memory`?** Routing is operationally distinct from memory. You can stop, restart, tune, or roll back the advisor without touching memory state. The standalone process boundary contains failures.

2. **Can I change the lane weights?** Yes, but it requires measured evidence: run a baseline with `advisor_validate`, edit `mcp_server/lib/scorer/lane-registry.ts`, re-run validate, and sync the five doc surfaces that carry the weight table. Changes that drop corpus top-1 below 80.5% or increase UNKNOWN count block ship.

3. **How does the advisor stay safe to call from hooks?** Responses never echo raw prompt text. Attribution uses lane identifiers and evidence labels (e.g., `lexical=0.85`). Hook adapter recipes scope write permissions tightly, and the Python shim mirrors the same redaction semantics.

4. **What is the relationship to `system-spec-kit`?** The advisor depends on it only for the shared embeddings stack and the IPC bridge. Memory, spec folders, and continuity stay in `system-spec-kit`. The advisor database, skill graph handlers, scorer code, and all other non-embedding code are fully isolated as of v0.2.0.

5. **Where do I learn about runtime hooks?** `references/hooks/skill_advisor_hook.md` documents the hook contract across Claude, Codex, Gemini, Devin, and the OpenCode plugin bridge.

## 8. STALE FACTS

1. **Embedder manifest count in README §5 ("Pluggable embedder layer"):** says the `MANIFESTS` registry contains "the single shipped manifest `nomic-embed-text-v1.5`." The actual registry (documented in `INSTALL_GUIDE.md:319-327` §12.2) lists 7 manifests: `nomic-embed-text-v1.5`, `mxbai-embed-large-v1`, `bge-small-en-v1.5`, `bge-large-en-v1.5`, `jina-embeddings-v3`, `bge-m3`, `snowflake-arctic-embed-l-v2.0`.

2. **ARCHITECTURE.md §1 and §2 show `compat/` as a top-level peer of `mcp_server/`** (both in the authored-zones prose list and the ASCII tree). The actual `compat/` directory lives at `mcp_server/compat/`, not at the skill root. The README's §4 structure tree correctly places it under `mcp_server/`.

3. **`references/runtime/tool_ids_reference.md:3` description line** says "Reference for all 9 public and 1 internal system-skill-advisor MCP tool IDs" — this claims 9 public + 1 internal = 10 tools, but the actual count is 8 public + 1 gated internal = 9 total (4 advisor + 5 skill-graph including `skill_graph_propagate_enhances` which is listed among skill-graph tools but gated as internal in §4). This is in `tool_ids_reference.md`, not directly in `README.md`, but the README links to it as the canonical tool-ID reference.