1. **PURPOSE** — `system-skill-advisor` scores non-trivial user prompts against indexed skill metadata through a five-lane scorer and a SQLite skill graph, then returns calibrated, prompt-safe skill recommendations via its standalone `mk_skill_advisor` MCP server so the runtime can route to the correct skill without guessing.

2. **PROBLEM** — An agent guessing which skill to use is unreliable because ambiguous prompts silently mis-route to the wrong skill without any confidence signal, wasting cycles on misaligned execution. Without calibrated confidence, hooks that log routing decisions have no way to distinguish a strong match from a coin flip, making telemetry untrustworthy. Routing metadata that goes stale yet continues answering is dangerous because it confidently recommends skills whose metadata has changed, producing correct-looking but wrong routing. A centralized routing surface that has gone stale and answers anyway is dangerous because callers trust its output as authoritative and will act on outdated skill graph edges and lane scores without any staleness signal.

3. **MODES & CAPABILITIES**
   - **Five-lane scorer** — fuses explicit_author (0.42), lexical (0.28), graph_causal (0.13), derived_generated (0.12), and semantic_shadow (0.05) into a single calibrated score per `mcp_server/lib/scorer/lane-registry.ts`.
   - **Prompt-safe attribution** — returns per-lane contribution without echoing raw prompt content so hook output is safe to log in telemetry.
   - **Daemon-backed freshness** — a chokidar watcher observes `.opencode/skills/*/SKILL.md` and `graph-metadata.json` and triggers incremental rebuilds on change.
   - **Trust-state vocabulary** — reports `live`, `stale`, `absent`, or `unavailable` so callers know when to act, caveat, or fall back.
   - **SQLite skill graph with auto-propagated `enhances`** — stores cross-skill edges (depends_on, dependents, enhances, conflicts) in SQLite and proposes missing inbound `enhances` declarations through a trusted-caller tool.
   - **Multi-runtime hooks** — ships prompt-submit hooks for Claude, Codex, Gemini, and Devin, plus an OpenCode plugin bridge.
   - **Python compatibility shim** — `skill_advisor.py` keeps scripts and hooks working when the native MCP path is unreachable, probing native first and falling back to local Python scoring.
   - **Standalone process boundary** — runs as its own MCP server (`mk_skill_advisor`) so routing can be stopped, restarted, or rolled back without touching memory or code-graph systems.

4. **INVOCATION**
   The skill exposes **nine MCP tools** on the `mk_skill_advisor` server:
   - **Four advisor tools:** `advisor_recommend` (score and rank skills for a prompt), `advisor_rebuild` (rebuild index from skill metadata), `advisor_status` (report freshness, trust state, lane weights, daemon info, skill count), `advisor_validate` (run corpus, holdout, parity, safety, and latency check bundle).
   - **Five skill-graph tools:** `skill_graph_scan` (index all `graph-metadata.json` into SQLite), `skill_graph_query` (traverse edges: depends_on, dependents, enhances, enhanced_by, family_members, conflicts, transitive_path, hub_skills, orphans, subgraph), `skill_graph_status` (report graph health, counts, staleness), `skill_graph_validate` (validate schema drift, broken edges, reciprocal symmetry, dependency cycles), `skill_graph_propagate_enhances` (detect and optionally apply missing inbound `enhances` edges; internal, trusted-caller gated).
   - **Gate 2 routing flow:** `advisor_recommend` scores the prompt → top recommendation above confidence threshold → invoke that skill. When top-2 candidates are within 0.1 of each other, surface ambiguity explicitly instead of routing silently. **Freshness gate:** if `advisor_status` reports `stale` or `absent`, call `advisor_rebuild` before trusting recommendations; if `unavailable`, fall back to the Python `skill_advisor.py` shim or keyword matching against frontmatter `trigger_phrases`.

5. **KEY FILES**

   | Path | Purpose |
   |---|---|
   | `SKILL.md` | Runtime routing instructions, invariants, and activation signals for agents. |
   | `README.md` | Human-facing skill overview, quick start, tool reference, configuration, FAQ. |
   | `ARCHITECTURE.md` | System architecture, package topology, data flow, decision records. |
   | `INSTALL_GUIDE.md` | Install, setup, runtime hooks, rollback, embedder selection, operator checks. |
   | `references/scoring/advisor_scorer.md` | Lane attribution model, fusion rules, and confidence calibration. |
   | `references/scoring/lane_weight_tuning.md` | Measured lane-weight change workflow and evidence requirements. |
   | `references/scoring/validation_baselines.md` | `advisor_validate` baselines and troubleshooting. |
   | `references/graph/skill_graph_query_cookbook.md` | Worked examples for `skill_graph_query` types. |
   | `references/graph/skill_graph_drift.md` | Detect and reconcile SQLite drift from source files. |
   | `references/graph/skill_graph_extraction_plan.md` | Skill-graph extraction history and completion record. |
   | `references/graph/propagate_enhances.md` | Cross-skill `enhances` auto-propagation contract. |
   | `references/runtime/standalone_mcp_shape.md` | Standalone MCP topology (ADR-001 bridge). |
   | `references/runtime/tool_ids_reference.md` | All 9 tool ids with inputs and output shapes. |
   | `references/runtime/legacy_tool_bridge.md` | Stable tool id bridge policy across the standalone migration. |
   | `references/runtime/freshness_contract.md` | Trust-state vocabulary and caller obligations. |
   | `references/runtime/daemon_lease_contract.md` | Single-writer daemon lease semantics. |
   | `references/config/db_path_policy.md` | Package-local SQLite path policy. |
   | `references/hooks/skill_advisor_hook.md` | Prompt-time hook behavior for Claude, Codex, Gemini, Devin, OpenCode. |
   | `references/decisions/deferred_decisions.md` | Tier D decision records (F4 Devin hooks, F6 deprecation banners). |
   | `hooks/claude/` | Claude Code prompt-submit hook. |
   | `hooks/codex/` | Codex CLI prompt-submit hook (with optional prompt wrapper). |
   | `hooks/gemini/` | Gemini CLI prompt-submit hook. |
   | `hooks/devin/` | Devin CLI prompt-submit hook via `.devin/hooks.v1.json`. |
   | `mcp_server/advisor-server.ts` | Standalone `mk_skill_advisor` MCP entrypoint. |
   | `mcp_server/tools/` | 9 MCP tool descriptors and dispatch (`index.ts`, `skill-graph-tools.ts`, per-tool files). |
   | `mcp_server/handlers/` | Advisor handlers (recommend, rebuild, status, validate) and `skill-graph/` sub-handlers. |
   | `mcp_server/lib/scorer/lane-registry.ts` | Canonical lane weights and lane definitions. |
   | `mcp_server/lib/scorer/` | Full scorer implementation: fusion, attribution, projection, lanes, aliases, ambiguity, age-policy. |
   | `mcp_server/lib/skill-graph/` | SQLite skill-graph database/query logic (fully migrated to this package). |
   | `mcp_server/lib/freshness.ts` | Freshness and trust-state logic. |
   | `mcp_server/lib/daemon/` | Chokidar file watcher and daemon lease management. |
   | `mcp_server/lib/embedders/` | Thin re-export shims of `@spec-kit/shared/embeddings/` plus `schema.ts` for local SQLite integration. |
   | `mcp_server/database/` | Package-local SQLite runtime state (`skill-graph.sqlite`). |
   | `mcp_server/scripts/skill_advisor.py` | Python compatibility shim (native probe + local fallback). |
   | `mcp_server/scripts/skill_advisor_regression.py` | Python regression harness. |
   | `mcp_server/scripts/skill_advisor_bench.py` | Python benchmark harness. |
   | `mcp_server/schemas/` | Zod tool response contracts. |
   | `mcp_server/compat/` | Stable native compatibility entrypoint for plugin consumers. |
   | `mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs` | OpenCode plugin bridge entrypoint. |
   | `mcp_server/tests/` | Vitest and Python regression coverage. |
   | `feature_catalog/feature_catalog.md` | Current feature inventory across 7 groups (01–08, no 05). |
   | `manual_testing_playbook/manual_testing_playbook.md` | Operator validation scenarios across 9 categories (01–08, 10). |
   | `changelog/` | Versioned changelogs: v0.1.0 through v0.6.0. |

6. **BOUNDARIES** — The advisor **recommends** a skill; it does not replace the target skill. Code implementation stays in `sk-code`, documentation in `sk-doc`, git work in `sk-git`, MCP orchestration in `mcp-code-mode`. Memory, spec folders, continuity, and the memory MCP server stay in `system-spec-kit`. Structural code indexing and impact analysis stay in `system-code-graph`. The advisor depends on `system-spec-kit` only for the heavyweight embeddings stack (`@spec-kit/shared/embeddings/` used by the optional `semantic_shadow` lane) and the canonical IPC bridge re-exported from `@spec-kit/shared/ipc/socket-server.js`. All other non-embeddings code is fully isolated as of v0.2.0.

7. **TROUBLESHOOTING & FAQ MATERIAL**
   - **Stale trust state** (`trustState: "stale"`): source skill metadata changed since last index build. Fix: call `advisor_rebuild` with `force: true`.
   - **Absent trust state** (`trustState: "absent"`): advisor SQLite database is missing or empty. Fix: call `advisor_rebuild`; if that fails, check `MK_SKILL_ADVISOR_DB_DIR` and disk permissions.
   - **Unavailable trust state** (`trustState: "unavailable"`): native MCP path cannot be reached. Fix: verify `mk_skill_advisor` is registered in `opencode.json`; fall back to `scripts/skill_advisor.py`.
   - **Ambiguous top-2 candidates** (within 0.1 of each other): two skills are equally plausible for the prompt. Fix: surface both candidates to the user instead of routing silently.
   - **`advisor_validate` baseline drift** (corpus top-1 below 80.5%): scorer behavior changed or fixtures drifted. Fix: inspect `perSkill[]` and `slices.corpus` to identify regressed skills.
   - **Newly-added skill not yet picked up**: the advisor reads metadata at every call, but the daemon may not have observed the new file yet. Fix: call `advisor_rebuild` or wait for the watcher to fire.
   - **Devin hook does not disable with `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1`**: the Devin hook checks `MK_SKILL_ADVISOR_HOOK_DISABLED` first. Fix: set `MK_SKILL_ADVISOR_HOOK_DISABLED=1` for Devin or set both variables.
   - **Missing `@spec-kit/shared` link** (`ERR_MODULE_NOT_FOUND` at startup): the advisor package was built but its local shared package link is missing from `mcp_server/node_modules/`. Fix: run `npm --prefix .opencode/skills/system-skill-advisor/mcp_server install && npm --prefix .opencode/skills/system-skill-advisor/mcp_server run build`.
   - **User asks: "Why is the advisor a separate MCP server instead of part of `mk-spec-memory`?"** Routing is operationally distinct from memory; you may want to roll back, restart, or tune the advisor without touching memory state.
   - **User asks: "Can I change the lane weights?"** Yes, but the change must come with measured evidence via `advisor_validate` (corpus, holdout, parity, safety, latency slices).
   - **User asks: "How does the advisor stay safe to call from hooks?"** Responses redact raw prompt content; attribution is per-lane only; the Python shim mirrors the same redaction semantics.
   - **User asks: "What is the relationship to `system-spec-kit`?"** Memory and spec folders stay in `system-spec-kit`; the advisor depends on it only for the embeddings stack and the IPC bridge.
   - **User asks: "Where do I learn about the runtime hooks?"** See `references/hooks/skill_advisor_hook.md`.

8. **STALE FACTS** — The current `README.md` contains the following inaccuracies versus `SKILL.md` and the real files:
   - **Version not mentioned**: `SKILL.md` frontmatter declares `version: 0.6.0`; the `README.md` does not display or reference the current version anywhere. The changelog directory contains `v0.1.0.md` through `v0.6.0.md` but the Related Documents table only links to `changelog/v0.2.0.md`.
   - **Changelog link incomplete**: Related Documents links only to `changelog/v0.2.0.md` instead of the current `changelog/v0.6.0.md` or the `changelog/` directory as a whole.
   - **Feature catalog group count is accurate** ("7 groups" matches the 7 numbered subdirectories: 01, 02, 03, 04, 06, 07, 08). **Manual testing playbook category count is accurate** ("9 categories" matches 01–08 and 10).
   - **Tool count is accurate**: README documents 9 tools (8 public + 1 internal) matching SKILL.md.
   - **Lane weights are accurate**: the five lanes and their weights (0.42, 0.28, 0.13, 0.12, 0.05) match across README §3.3 and SKILL.md.
   - **Env var names are accurate**: `MK_SKILL_ADVISOR_DB_DIR`, `SYSTEM_SKILL_ADVISOR_DB_DIR`, `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED`, `MK_SKILL_ADVISOR_HOOK_DISABLED`, `SPECKIT_ADVISOR_LANE_SHADOW_WEIGHTS_JSON`, `SKILL_ADVISOR_DEBUG`, `SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN` all match README §5 and INSTALL_GUIDE.
   - **`advisor_validate` corpus baseline**: README §7 and INSTALL_GUIDE §5 both state 80.5% top-1 — consistent.
   - **Embedder details**: README §5 documents the pluggable embedder layer, cascade tiers, `nomic-embed-text-v1.5` default at 768 dim, `setActiveEmbedder()` 3-arg signature, and the `'auto'` sentinel — all consistent with INSTALL_GUIDE §12.
   - **Paths are accurate**: `mcp_server/lib/scorer/lane-registry.ts`, `mcp_server/scripts/skill_advisor.py`, `mcp_server/database/`, hooks directories all verified against the real filesystem.
   - **Minor structural note**: README §4 Structure shows `scripts/` inside `mcp_server/` but the real `scripts/` at the skill root level (containing `doctor.sh`) is not listed. The `mcp_server/scripts/` directory does exist and contains Python shims, so the tree is not wrong but omits the root-level `scripts/` directory.