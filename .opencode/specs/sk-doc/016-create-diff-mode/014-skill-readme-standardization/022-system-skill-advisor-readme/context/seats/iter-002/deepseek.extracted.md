Now let me read the tool descriptors and key reference files:
Now let me check one more thing — whether the embedder manifest claim in the README is stale compared to the INSTALL_GUIDE:
I now have all the data needed to produce the report.

---

# Verification Report: `.opencode/skills/system-skill-advisor`

## 1. EXACT TOOLS & INVOCATION

The MCP server `mk_skill_advisor` registers **9 total tools** — 8 public + 1 internal trusted-caller gated. Source of truth for live registration: `mcp_server/tools/index.ts:37-43` and `mcp_server/tools/skill-graph-tools.ts:85-91`.

### Four Advisor Tools (L8:Skill Advisor)

| Tool | Key Inputs | Source |
|---|---|---|
| `advisor_recommend` | `prompt` (required, 1–10000 chars, HMAC-keyed, never echoed), `options.topK` (number 1–10), `options.includeAttribution` (boolean), `options.includeAbstainReasons` (boolean) | `mcp_server/tools/advisor-recommend.ts:25-34` |
| `advisor_rebuild` | `force` (boolean, default false), `workspaceRoot` (optional string) | `mcp_server/tools/advisor-rebuild.ts:8-19` |
| `advisor_status` | `workspaceRoot` (required, min 1 char) | `mcp_server/tools/advisor-status.ts:7-18` |
| `advisor_validate` | `confirmHeavyRun` (required, const true), `skillSlug` (optional `string \| null`) | `mcp_server/tools/advisor-validate.ts:16-25` |

Parameter key sources of truth: `ADVISOR_RECOMMEND_PARAMETER_KEYS = ['prompt', 'options']` and `ADVISOR_VALIDATE_PARAMETER_KEYS = ['confirmHeavyRun', 'skillSlug']` in `mcp_server/tools/advisor-contract-keys.ts:19-32`.

### Five Skill-Graph Tools (L7:Maintenance / L6:Analysis)

| Tool | Key Inputs | Source |
|---|---|---|
| `skill_graph_scan` | `skillsRoot` (optional string) | `mcp_server/tools/skill-graph-tools.ts:21-32` |
| `skill_graph_query` | `queryType` (required, enum), `skillId`, `sourceSkillId`, `targetSkillId`, `family`, `minInbound`, `depth`, `limit` | `mcp_server/tools/skill-graph-tools.ts:34-52` |
| `skill_graph_status` | (none) | `mcp_server/tools/skill-graph-tools.ts:54-58` |
| `skill_graph_validate` | (none) | `mcp_server/tools/skill-graph-tools.ts:60-64` |
| `skill_graph_propagate_enhances` | `skillsRoot`, `mode` (report/propose/apply, default report), `minConfidence` (0–1, default 0.75), `targetSkillIds`, `sourceSkillIds`, `applyCandidateIds`, `applyAllHighConfidence`, `dryRun` (default true) | `mcp_server/tools/skill-graph-tools.ts:66-83` |

### `skill_graph_query` queryTypes (10 values)

Literal enum from `mcp_server/tools/skill-graph-tools.ts:41` and `mcp_server/handlers/skill-graph/query.ts:15-25`:

`depends_on`, `dependents`, `enhances`, `enhanced_by`, `family_members`, `conflicts`, `transitive_path`, `hub_skills`, `orphans`, `subgraph`

### `advisor_recommend` options (3 fields)

From `mcp_server/tools/advisor-recommend.ts:18-21`:

- `topK` — number, 1–10, "Maximum number of recommendations to return."
- `includeAttribution` — boolean, "Include per-lane score breakdown and evidence snippets."
- `includeAbstainReasons` — boolean, "Include prompt-safe abstain reasons when no recommendation passes thresholds."

### Trusted-caller gate on `skill_graph_propagate_enhances`

Confirmed at `mcp_server/handlers/skill-graph/propagate-enhances.ts:40-43`: `requireTrustedCaller(callerContext)` is called; if `!ok`, the handler returns an error response. This gate rejects untrusted callers before any detection runs (`mcp_server/references/runtime/tool_ids_reference.md:68-70`).

## 2. SCORER LANES & WEIGHTS

Source: `mcp_server/lib/scorer/lane-registry.ts:7-13`.

| Lane ID | Live Weight | Shadow Weight | Live |
|---|---|---|---|
| `explicit_author` | **0.42** | 0.40 | Yes |
| `lexical` | **0.28** | 0.25 | Yes |
| `graph_causal` | **0.13** | 0.20 | Yes |
| `derived_generated` | **0.12** | 0.10 | Yes |
| `semantic_shadow` | **0.05** | 0.05 | Yes |

All five lanes are `live: true`. The `LIVE_SCORER_LANE_IDS` export at `lane-registry.ts:83-85` confirms all five pass the `live` filter.

Live weights resolve at runtime via `resolveLaneWeightsOverride('SPECKIT_ADVISOR_LANE_WEIGHTS_JSON', DEFAULT_WEIGHTS)` (`lane-registry.ts:56-59`). Shadow weights resolve via `SPECKIT_ADVISOR_LANE_SHADOW_WEIGHTS_JSON` (`lane-registry.ts:60-63`).

**README match:** The README table at `README.md:109-115` (explicit_author 0.42, lexical 0.28, graph_causal 0.13, derived_generated 0.12, semantic_shadow 0.05) **exactly matches** `lane-registry.ts`. No discrepancy.

## 3. FRESHNESS & TRUST CONTRACT

Canonical source: `references/runtime/freshness_contract.md`.

### Trust-state vocabulary (§2, lines 48-53)

| State | Meaning |
|---|---|
| `live` | Index is fresh. Source SKILL.md + graph-metadata.json have not changed since last build. |
| `stale` | Index is queryable but source files changed since last build. |
| `absent` | SQLite database file missing or deleted. No recommendation computable. |
| `unavailable` | Advisor subsystem unreachable (MCP server down, daemon failed, or hard error). |

### State transitions (§3, lines 59-94)

- `live → stale`: daemon detects hash mismatch on any `.opencode/skills/*/SKILL.md` or `graph-metadata.json`
- `stale → live`: `advisor_rebuild` succeeds + generation counter advances
- `live → absent`: SQLite deleted or fails integrity check
- `absent → live`: `advisor_rebuild` runs from scratch + succeeds
- `* → unavailable`: MCP server refused, daemon not running, or unrecoverable error

### Daemon responsibilities (§5, lines 122-127)

The daemon (`mcp_server/lib/daemon/`):
- Watches `.opencode/skills/*/SKILL.md` and `.opencode/skills/*/graph-metadata.json` for mtime changes
- Recomputes source-hash signature on any file change
- Bumps generation counter when signature changes
- Invalidates prompt cache on generation bump
- Holds a single-writer lease (`mcp_server/lib/daemon/lease.ts`)

The daemon does NOT automatically rebuild the index — only `advisor_rebuild` mutates the SQLite database.

### Note on INSTALL_GUIDE §9

The INSTALL_GUIDE operator checks table (§9) lists six states including `degraded` and `quarantined`. These are operational states that map to OP-001/OP-002 in the manual playbook, NOT additional trust states in the freshness contract. The canonical trust-state vocabulary is the four states above.

## 4. KEY FILES

| Path | Role |
|---|---|
| `SKILL.md` | Runtime routing instructions, invariants, smart router pseudocode, version 0.6.0 |
| `README.md` | Human-facing package overview, quick start, feature highlights, troubleshooting |
| `ARCHITECTURE.md` | System architecture, MCP surface, data flow, decision records (ADR-001 through ADR-005) |
| `INSTALL_GUIDE.md` | Bootstrap, verification, runtime hooks, rollback, embedder selection |
| `graph-metadata.json` | Skill graph edges (enhances 17 skills), intent_signals, derived metadata |
| `hooks/claude/` | Claude Code prompt-submit hook |
| `hooks/codex/` | Codex CLI prompt-submit hook + prompt-wrapper fallback |
| `hooks/gemini/` | Gemini CLI prompt-submit hook |
| `hooks/devin/` | Devin CLI prompt-submit hook via `.devin/hooks.v1.json` |
| `mcp_server/advisor-server.ts` | Standalone `mk_skill_advisor` MCP entrypoint |
| `mcp_server/tools/` | 9 tool descriptors: 4 advisor + 5 skill-graph (index.ts, advisor-*.ts, skill-graph-tools.ts, advisor-contract-keys.ts, types.ts) |
| `mcp_server/handlers/` | Advisor handlers (recommend, rebuild, status, validate) + `skill-graph/` subfolder (query, scan, status, validate, propagate-enhances) |
| `mcp_server/schemas/` | Zod response contracts: advisor-tool-schemas.ts, daemon-status.ts, generation-metadata.ts, skill-derived-v2.ts, compat-contract.json |
| `mcp_server/lib/scorer/lane-registry.ts` | Five-lane definition with live weights (0.42/0.28/0.13/0.12/0.05) and shadow weights (0.40/0.25/0.20/0.10/0.05) |
| `mcp_server/scripts/skill_advisor.py` | Python compatibility shim preserving legacy CLI callers; probes native advisor first, falls back to local Python scorer |
| `mcp_server/database/` | Package-local SQLite state: `skill-graph.sqlite`, `skill-graph-daemon-lease.sqlite`, `skill-graph.json` |
| `references/scoring/` | advisor_scorer.md, lane_weight_tuning.md, validation_baselines.md |
| `references/graph/` | skill_graph_query_cookbook.md, skill_graph_drift.md, skill_graph_extraction_plan.md, propagate_enhances.md |
| `references/runtime/` | standalone_mcp_shape.md, tool_ids_reference.md, legacy_tool_bridge.md, freshness_contract.md, daemon_lease_contract.md |
| `references/config/` | db_path_policy.md |
| `references/hooks/` | skill_advisor_hook.md |
| `references/decisions/` | deferred_decisions.md |
| `feature_catalog/` | 7 feature groups: 01-daemon, 02-auto-indexing, 03-lifecycle-routing, 04-scorer-fusion, 06-mcp-surface, 07-hooks-and-plugin, 08-python-compat + feature_catalog.md |
| `manual_testing_playbook/` | 9 scenario categories: 01-native-mcp-tools through 10-python-compat + manual_testing_playbook.md |
| `mcp_server/lib/` | Scorer, freshness, daemon, lifecycle, skill-graph, embedders, cross-skill-edges, context, auth |
| `mcp_server/compat/` | Stable native compatibility entrypoint (used by OpenCode bridge & Python shim) |
| `mcp_server/plugin_bridges/` | OpenCode cross-process gateway (`mk-skill-advisor-bridge.mjs`) |
| `changelog/` | Versioned changelogs |

## 5. TROUBLESHOOTING & FAQ

### Concrete failure modes (from `README.md:252-260` and `freshness_contract.md` §6)

| Failure | Trust State | Action |
|---|---|---|
| Source metadata changed since last index build | `stale` | Call `advisor_rebuild` with `force: true` |
| SQLite database missing or empty | `absent` | Call `advisor_rebuild`; if that fails, check `MK_SKILL_ADVISOR_DB_DIR` and disk permissions |
| Native MCP path unreachable | `unavailable` | Verify `mk_skill_advisor` is registered in `opencode.json`; fall back to `scripts/skill_advisor.py` |
| Top-2 candidates within ~0.1 of each other | (ambiguous) | Surface both candidates instead of routing silently |
| `advisor_validate` corpus top-1 below **80.5%** | scorer drift | Inspect `perSkill[]` and `slices.corpus` to identify regressed skills. Baseline: Full corpus top-1 **80.5%**, Holdout top-1 **77.5%** (`INSTALL_GUIDE.md:117-119`) |
| Newly-added skill not picked up | daemon hasn't observed new file | Call `advisor_rebuild` or wait for watcher |
| Devin hook not disabled by `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` | Devin hook checks `MK_SKILL_ADVISOR_HOOK_DISABLED` first | Set `MK_SKILL_ADVISOR_HOOK_DISABLED=1` for Devin, or set both variables (`INSTALL_GUIDE.md:198`) |
| Daemon dies | `advisor_status.daemon = "down"` | Restart MCP server (`mk_skill_advisor` restarts daemon on boot) |
| Lease contention | `advisor_rebuild` fails with lease-busy | Wait for current rebuild, retry; kill holder if stuck |
| SQLite corruption | trustState stays `absent` after rebuild | Delete `skill-graph.sqlite{,-wal,-shm}`, run `advisor_rebuild --force` |

### FAQ — 5 most likely user questions (from `README.md:264-285`)

**Q1: Why is the advisor a separate MCP server instead of part of `mk-spec-memory`?**
A: Routing is operationally distinct from memory. The standalone server boundary allows rollback, restart, and tuning of the advisor without touching memory state.

**Q2: Can I change the lane weights?**
A: Yes, but with measured evidence: run `advisor_validate` baseline, change weights in `lib/scorer/lane-registry.ts`, re-run validate, then ship with doc updates.

**Q3: How does the advisor stay safe to call from hooks?**
A: Responses redact raw prompt content; attribution is per-lane only; hook adapters scope write permissions tightly; the Python shim mirrors the same redaction semantics.

**Q4: What is the relationship to `system-spec-kit`?**
A: `system-spec-kit` owns memory, spec folders, and continuity. The advisor depends on `system-spec-kit` for the embeddings stack used by the `semantic_shadow` lane and the IPC bridge. Other non-embeddings code is fully isolated as of v0.2.0.

**Q5: Where do I learn about runtime hooks?**
A: `references/hooks/skill_advisor_hook.md` covers the hook contract across Claude, Codex, Gemini, Devin plus the OpenCode plugin.

## 6. STALE FACTS IN CURRENT README

**1. Embedder manifest count** — `README.md:200`, the "Pluggable embedder layer" section states:

> "...a frozen `MANIFESTS` registry containing the **single shipped manifest** `nomic-embed-text-v1.5`..."

The INSTALL_GUIDE (`INSTALL_GUIDE.md:318-327`, §12.2 "Registered alternatives") lists **seven** registered manifests:
- `nomic-embed-text-v1.5`
- `mxbai-embed-large-v1`
- `bge-small-en-v1.5`
- `bge-large-en-v1.5`
- `jina-embeddings-v3`
- `bge-m3`
- `snowflake-arctic-embed-l-v2.0`

The README claim of "single shipped manifest" is stale. The registry now contains seven manifests.

---

*No other stale facts detected.* The README lane weight table (0.42/0.28/0.13/0.12/0.05) matches `lane-registry.ts`. All 9 tool names match the live tool descriptors. The trust-state vocabulary (live/stale/absent/unavailable) matches `freshness_contract.md`. The corpus baseline of 80.5% matches `INSTALL_GUIDE.md` §5. The Devin hook disable variable precedence (`MK_SKILL_ADVISOR_HOOK_DISABLED` over `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED`) matches `INSTALL_GUIDE.md` §8. All file paths in the structure tree are verified present.