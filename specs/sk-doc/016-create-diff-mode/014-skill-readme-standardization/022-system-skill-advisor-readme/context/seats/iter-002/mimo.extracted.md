Now let me check a couple more files for completeness.
Here is the verification report.

---

## 1. EXACT TOOLS & INVOCATION

**Total tools: 9** (8 public + 1 internal trusted-caller). Confirmed across `SKILL.md:278-294`, `mcp_server/tools/` directory listing, and tool descriptors.

**Four advisor tools:**
- `advisor_recommend` — `mcp_server/tools/advisor-recommend.ts:25-34`. Required: `prompt` (string, 1-10000). Options object: `topK` (1-10), `includeAttribution` (boolean), `includeAbstainReasons` (boolean).
- `advisor_rebuild` — `mcp_server/tools/advisor-rebuild.ts:8-19`. Optional: `force` (boolean, default false), `workspaceRoot` (string).
- `advisor_status` — `mcp_server/tools/advisor-status.ts:7-18`. Required: `workspaceRoot` (string).
- `advisor_validate` — `mcp_server/tools/advisor-validate.ts:16-25`. Required: `confirmHeavyRun` (boolean, const true). Optional: `skillSlug` (string|null).

**Five skill-graph tools:**
- `skill_graph_scan` — `mcp_server/tools/skill-graph-tools.ts:21-32`. Optional: `skillsRoot` (string).
- `skill_graph_query` — `mcp_server/tools/skill-graph-tools.ts:34-52`. Required: `queryType`. Enum values: `depends_on`, `dependents`, `enhances`, `enhanced_by`, `family_members`, `conflicts`, `transitive_path`, `hub_skills`, `orphans`, `subgraph`. Optional: `skillId`, `sourceSkillId`, `targetSkillId`, `family` (enum: `cli`, `mcp`, `sk-code`, `deep-loop`, `sk-util`, `system`), `minInbound` (0-200, default 2), `depth` (1-10, default 2), `limit` (1-200, default 50).
- `skill_graph_status` — `mcp_server/tools/skill-graph-tools.ts:54-58`. No required params.
- `skill_graph_validate` — `mcp_server/tools/skill-graph-tools.ts:60-64`. No required params.
- `skill_graph_propagate_enhances` — `mcp_server/tools/skill-graph-tools.ts:66-83`. Optional: `skillsRoot`, `mode` (enum: `report`, `propose`, `apply`, default `report`), `minConfidence` (0-1, default 0.75), `targetSkillIds`, `sourceSkillIds`, `applyCandidateIds`, `applyAllHighConfidence`, `dryRun` (default true). **Trusted-caller gated** per `SKILL.md:293` and the tool descriptor's caller-context parameter in `skill-graph-tools.ts:139`.

`advisor_recommend` options confirmed from descriptor: `topK`, `includeAttribution`, `includeAbstainReasons`. Note: `includeAbstainReasons` exists in the live descriptor but is **not listed** in the README's options description (README only mentions `topK` and `includeAttribution`).

---

## 2. SCORER LANES & WEIGHTS

Source: `mcp_server/lib/scorer/lane-registry.ts:7-18`.

| Lane | Live Weight | Shadow Weight | Live? |
|---|---:|---:|---|
| `explicit_author` | 0.42 | 0.40 | yes |
| `lexical` | 0.28 | 0.25 | yes |
| `graph_causal` | 0.13 | 0.20 | yes |
| `derived_generated` | 0.12 | 0.10 | yes |
| `semantic_shadow` | 0.05 | 0.05 | yes |

**All five lanes are live** (`live: true` on every entry, `lane-registry.ts:8-12`).

Shadow weights exist separately and are overridable via `SPECKIT_ADVISOR_LANE_SHADOW_WEIGHTS_JSON` (`lane-registry.ts:60-63`). Live weights are overridable via `SPECKIT_ADVISOR_LANE_WEIGHTS_JSON` (`lane-registry.ts:56-59`).

**README weight table match:** The README's table (`README.md:109-116`) lists `explicit_author 0.42`, `lexical 0.28`, `graph_causal 0.13`, `derived_generated 0.12`, `semantic_shadow 0.05`. These **match** the live weights in `lane-registry.ts` exactly. The README does not document the shadow weights.

---

## 3. FRESHNESS & TRUST CONTRACT

**Trust-state vocabulary** — confirmed from `references/runtime/freshness_contract.md:42-51` and `SKILL.md` §3:

| State | Meaning | Caller Action |
|---|---|---|
| `live` | Index is fresh and source files unchanged since last build. | Use recommendation directly. |
| `stale` | Index is queryable but source files have changed since last build. | Use with caveat, then call `advisor_rebuild`. |
| `absent` | SQLite database missing or deleted. | Call `advisor_rebuild`. Do not act on empty result. |
| `unavailable` | MCP server down, daemon failed, or hard error blocks reads. | Fall back to Python shim or keyword matching against `trigger_phrases`. |

State source-of-truth: `mcp_server/lib/freshness/trust-state.ts` + `mcp_server/lib/freshness/trust-state-values.ts` (`freshness_contract.md:53`).

**Daemon behavior** — `freshness_contract.md:120-133`:
- Watches `.opencode/skills/*/SKILL.md` + `.opencode/skills/*/graph-metadata.json` for mtime changes.
- Recomputes source-hash signature on watched-file change.
- Bumps generation counter when signature changes.
- Invalidates prompt cache on generation bump.
- Holds a single-writer lease via `mcp_server/lib/daemon/lease.ts`.
- Daemon does **NOT** auto-rebuild; only `advisor_rebuild` mutates SQLite.

Daemon implementation lives under `mcp_server/lib/daemon/` and `mcp_server/lib/freshness/`.

---

## 4. KEY FILES

| Path | Role |
|---|---|
| `SKILL.md` | Runtime routing instructions, invariants, smart router pseudocode. |
| `README.md` | Human-facing skill overview, quick start, feature highlights, FAQ. |
| `ARCHITECTURE.md` | System architecture, data flow, MCP surface, decision records. |
| `INSTALL_GUIDE.md` | Install, setup, runtime hooks, rollback, embedder layer, operator checks. |
| `references/scoring/` | `advisor_scorer.md` (lane attribution, fusion), `lane_weight_tuning.md` (weight change workflow), `validation_baselines.md` (corpus/holdout/latency baselines). |
| `references/graph/` | `skill_graph_query_cookbook.md`, `skill_graph_drift.md`, `skill_graph_extraction_plan.md`, `propagate_enhances.md`. |
| `references/runtime/` | `standalone_mcp_shape.md`, `tool_ids_reference.md`, `legacy_tool_bridge.md`, `freshness_contract.md`, `daemon_lease_contract.md`. |
| `references/config/` | `db_path_policy.md` — package-local SQLite path policy. |
| `references/hooks/` | `skill_advisor_hook.md` — per-runtime hook contract. |
| `references/decisions/` | `deferred_decisions.md` — Tier D decision records. |
| `hooks/claude/` | Claude Code prompt-submit hook. |
| `hooks/codex/` | Codex CLI hook (+ prompt-wrapper fallback, codex-hook-policy). |
| `hooks/gemini/` | Gemini CLI hook. |
| `hooks/devin/` | Devin hook (via `.devin/hooks.v1.json`). |
| `mcp_server/advisor-server.ts` | Standalone `mk_skill_advisor` MCP entrypoint. |
| `mcp_server/tools/` | 9 MCP tool descriptors: `advisor-recommend.ts`, `advisor-rebuild.ts`, `advisor-status.ts`, `advisor-validate.ts`, `skill-graph-tools.ts`, `index.ts`, `types.ts`, `advisor-contract-keys.ts`. |
| `mcp_server/handlers/` | `advisor-recommend.ts`, `advisor-rebuild.ts`, `advisor-status.ts`, `advisor-validate.ts`, `skill-graph/` (scan, query, status, validate, propagate-enhances). |
| `mcp_server/schemas/` | `advisor-tool-schemas.ts`, `compat-contract.json`, `daemon-status.ts`, `generation-metadata.ts`, `skill-derived-v2.ts`. |
| `mcp_server/lib/scorer/lane-registry.ts` | Live and shadow lane weights. |
| `mcp_server/lib/freshness/` | `trust-state.ts`, `trust-state-values.ts`, `generation.ts`, `cache-invalidation.ts`, `rebuild-from-source.ts`, `sqlite-integrity.ts`. |
| `mcp_server/scripts/skill_advisor.py` | Python compatibility shim (native probe + local fallback). |
| `mcp_server/database/` | Package-local SQLite runtime state (`skill-graph.sqlite`). |
| `feature_catalog/` | 7 feature groups: daemon-freshness, auto-indexing, lifecycle-routing, scorer-fusion, mcp-surface, hooks-and-plugin, python-compat. |
| `manual_testing_playbook/` | 10 categories: native-mcp-tools, cli-hooks-and-plugin, compat-and-disable, operator-h5, auto-update-daemon, auto-indexing, lifecycle-routing, scorer-fusion, python-compat. |

---

## 5. TROUBLESHOOTING & FAQ

### Failure Modes

| Failure Mode | Source | Concrete Detail |
|---|---|---|
| `trustState: "stale"` | `README.md:254`, `freshness_contract.md:49` | Source skill metadata changed since last index build. Fix: `advisor_rebuild` with `force: true`. |
| `trustState: "absent"` | `README.md:255`, `freshness_contract.md:50` | SQLite DB missing or empty. Fix: `advisor_rebuild`; check `MK_SKILL_ADVISOR_DB_DIR` and disk permissions. |
| `trustState: "unavailable"` | `README.md:256`, `freshness_contract.md:51` | MCP server unreachable. Fix: verify `mk_skill_advisor` registered in `opencode.json`; fall back to `skill_advisor.py`. |
| Ambiguous top-2 | `README.md:257` | Top 2 candidates within 0.1 of each other. Fix: surface both to user instead of routing silently. |
| `advisor_validate` baseline drift | `README.md:258`, `validation_baselines.md:47` | Corpus top-1 baseline is **80.5%** (from `validation_baselines.md:47`). Holdout top-1 is **77.5%** (`validation_baselines.md:48`). Below these is a hard regression that blocks ship. |
| Newly-added skill not picked up | `README.md:259` | Daemon may not have observed the new file yet. Fix: `advisor_rebuild` or wait for watcher. |
| Devin hook disable precedence | `README.md:260` | Devin checks `MK_SKILL_ADVISOR_HOOK_DISABLED` first, then falls back to `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED`. (`INSTALL_GUIDE.md:198` confirms.) |

### Top User Questions (grounded)

1. **Why is the advisor a separate MCP server?** Routing is operationally distinct from memory. You can roll back/restart/tune the advisor without touching memory state. Standalone boundary makes that safe. (`README.md:266-268`)

2. **Can I change lane weights?** Yes, but requires measured evidence. Run `advisor_validate` baseline, change weights in `lib/scorer/lane-registry.ts`, re-run validate, ship with doc updates. (`README.md:270-272`)

3. **How does the advisor stay safe to call from hooks?** Responses redact raw prompt content; attribution is per-lane only. Python shim mirrors the same redaction. (`README.md:274-276`)

4. **What is the relationship to `system-spec-kit`?** Memory, spec folders, continuity stay in `system-spec-kit`. Advisor depends on `system-spec-kit` for the heavyweight embeddings stack used by the `semantic_shadow` lane and the canonical IPC bridge re-exported from `@spec-kit/shared/ipc/socket-server.js`. Other non-embeddings code is fully isolated as of v0.2.0. (`README.md:280`)

5. **Where do I learn about runtime hooks?** `references/hooks/skill_advisor_hook.md` for the hook contract across Claude, Codex, Gemini, Devin, OpenCode. (`README.md:282-284`)

---

## 6. STALE FACTS IN CURRENT README

| Claim in README | Actual Source | Stale? |
|---|---|---|
| `advisor_recommend` options: `topK`, `includeAttribution` (README.md:194) | Live descriptor at `mcp_server/tools/advisor-recommend.ts:18-21` also includes `includeAbstainReasons` | **STALE** — README omits `includeAbstainReasons` |
| Version `0.6.0` (SKILL.md:5) | SKILL.md frontmatter says `version: 0.6.0` | Consistent (but verify if README ever states a different version — it does not explicitly state one) | 
| Trust states: `live`, `stale`, `absent`, `unavailable` (README.md:122-126) | `freshness_contract.md:42-51` — same four states | Clean |
| Lane weights table (README.md:109-116) | `lane-registry.ts:8-12` — identical values | Clean |
| `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` and `MK_SKILL_ADVISOR_HOOK_DISABLED` (README.md:188-189) | `compat-contract.json:3` (`disabledEnv: "SPECKIT_SKILL_ADVISOR_HOOK_DISABLED"`), `INSTALL_GUIDE.md:198` (Devin checks `MK_` first) | Clean |
| 8 public + 1 internal = 9 tools (README.md:95-106) | `SKILL.md:278-294`, tool descriptors in `mcp_server/tools/` | Clean |
| `skill_graph_query` queryTypes: `depends_on`, `dependents`, `enhances`, `enhanced_by`, `family_members`, `conflicts`, `transitive_path`, `hub_skills`, `orphans`, `subgraph` (README.md:102) | `skill-graph-tools.ts:41` — identical list | Clean |
| Daemon watches `.opencode/skills/*/SKILL.md` and `graph-metadata.json` (README.md:128) | `freshness_contract.md:122` — same | Clean |
| `advisor_validate` corpus top-1 baseline: "below 80.5%" (README.md:258) | `validation_baselines.md:47` — `80.5%` | Clean |
| Hooks directory listing: `claude/`, `codex/`, `gemini/`, `devin/` (README.md:153) | `hooks/` directory — contains `claude/`, `codex/`, `devin/`, `gemini/` | Clean |
| OpenCode plugin at `.opencode/plugins/mk-skill-advisor.js` (README.md:153 tree omits this) | `INSTALL_GUIDE.md:136` references `.opencode/plugins/mk-skill-advisor.js` | README structure tree at line 153 does not list an `opencode/` hook under `hooks/` — this is accurate since OpenCode uses a plugin bridge, not a hooks/ subdir. Clean. |

**One stale fact found:** `README.md:194` lists `advisor_recommend` per-call options as `(topK, includeAttribution)` but the live tool descriptor at `mcp_server/tools/advisor-recommend.ts:20` also exposes `includeAbstainReasons` as an option.