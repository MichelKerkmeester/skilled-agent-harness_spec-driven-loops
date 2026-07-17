---
name: system-skill-advisor
description: Routes non-trivial requests to matching skills through standalone MCP metadata and stable advisor tool ids.
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
version: 0.9.0.0
trigger_phrases:
  - "skill advisor"
  - "gate 2 routing"
  - "advisor_recommend"
  - "advisor_status"
  - "which skill should handle this"
  - "route this request to a skill"
  - "system skill advisor"
keywords:
  - skill-routing
  - gate-2
  - advisor-mcp
  - legacy-tool-bridge
  - skill-graph
  - semantic-lane
intent_signals:
  - "Gate 2 skill routing"
  - "advisor_recommend native MCP routing"
  - "advisor_status freshness check"
  - "which skill should handle this request"
  - "run the skill advisor hook"
---

<!-- Keywords: system-skill-advisor, skill-advisor, advisor_recommend, advisor_status, advisor_rebuild, advisor_validate, skill_graph_scan, skill_graph_query, skill_graph_status, skill_graph_validate, skill_graph_propagate_enhances, cross-skill-edges, gate-2-routing, standalone-mcp, legacy-tool-bridge, skill-graph -->

# System Skill Advisor

<!-- sk-doc-template: skill_md -->

Routes non-trivial user requests to the right skill through the standalone Skill Advisor MCP package.

---

## 1. WHEN TO USE

Use this skill when the work is about skill selection, Gate 2 routing, advisor MCP tools, prompt-time skill-advisor hooks, skill graph freshness or the standalone advisor package.

Activation signals:

- A request asks which skill should handle a task.
- A runtime hook needs a skill recommendation before execution.
- An operator asks about `advisor_recommend`, `advisor_status`, `advisor_rebuild`, `advisor_validate`, `skill_graph_scan`, `skill_graph_query`, `skill_graph_status`, `skill_graph_validate` or `skill_graph_propagate_enhances`.
- A packet touches the skill graph, skill metadata, advisor scorer, advisor feature catalog or manual testing playbook.
- A migration step references ADR-001: `<spec-folder>`.

Do not use this skill as a replacement for the recommended target skill. For example, route code implementation to `sk-code`, documentation authoring to `sk-doc`, git work to `sk-git` and MCP orchestration to `mcp-code-mode` after the advisor has made the recommendation.

---

## 2. SMART ROUTING

This package is mandatory context for non-trivial Gate 2 routing. The live advisor scores prompts through `mk_skill_advisor`; this smart router controls which local documentation resources an agent should load while maintaining the advisor package.

Routing model:

```text
user prompt
  |
  +-- exact skill name or explicit user direction -> named skill wins
  |
  +-- non-trivial or ambiguous request
        |
        +-- advisor_recommend on mk_skill_advisor MCP
        |
        +-- top recommendation above confidence threshold -> invoke that skill
        |
        +-- ambiguous top scores -> surface top candidates and ask or route with caveat
```

Resource domains:

- `references/scoring/` documents scorer lanes, lane weight tuning, calibration and validation baselines.
- `references/graph/` documents skill graph queries, drift reconciliation, graph extraction status and `enhances` propagation.
- `references/runtime/` documents standalone MCP topology, stable tool ids, bridge policy, freshness and daemon lease behavior.
- `references/config/` documents package-local database path policy.
- `references/hooks/` documents prompt-time hook behavior across runtimes.
- `references/decisions/` documents deferred decision records and historical rationale that still affects operators.
- `feature_catalog/` documents current advisor capabilities and source-of-truth feature references.
- `manual_testing_playbook/` documents deterministic operator scenarios for advisor tools, hooks, compatibility, daemon behavior and skill graph flows.
- `mcp_server/` owns handlers, schemas, tools, scripts, tests, library modules and the package-local SQLite database.

**Typed leaf projection (fleet routing standard).** system-skill-advisor is a normal, standalone single-mode skill whose sole workflow mode is `system-skill-advisor` (there is no `mode-registry.json`). Every routable leaf under `references/`, `feature_catalog/` and `manual_testing_playbook/` is enumerated in `leaf-manifest.json`, generated from `leaf-manifest.config.json` (regenerate with `generate-leaf-manifest.cjs --write .opencode/skills/system-skill-advisor`; it must stay byte-stable under `--check`). `leaf-aliases.json` binds each router-emitted root-relative path (e.g. `references/scoring/advisor_scorer.md`) to its typed `(system-skill-advisor, leafResourceId)` identity, so a deterministic router replay recovers real typed pairs against the manifest. The `RESOURCE_MAP` below emits those exact leaf paths; the feature-catalog and manual-testing-playbook package indexes are navigation only and are never routed as typed leaves. Regenerate `leaf-manifest.json` and keep `leaf-aliases.json` in sync whenever the corpus changes. The `mcp_server/` advisor engine (`skill-graph.json`, scorer/prompt-policy config, handlers) is the runtime, not a routable documentation leaf — it is intentionally outside every `leafRoot` and never appears in the manifest.

### Resource loading levels

| Level | When to Load | Resources |
|---|---|---|
| FALLBACK | Request too weak to score | The two `DEFAULT_RESOURCES` runtime references, offered with the disambiguation checklist (fallback-only: never unioned into a scored route) |
| SELECTED | An intent scores | The exact `RESOURCE_MAP[intent]` leaf(s) for the selected intent(s), emitted as typed `(WORKFLOW_MODE, leafResourceId)` pairs |
| NAVIGATION | Broad "list the features / playbook" browse | A `PACKAGE_INDEXES` index doc — navigation only, never a typed leaf |

### Smart router pseudocode

This pseudocode is the canonical resource-routing contract. The router is a singleton-mode selector: it scores the request against `INTENT_SIGNALS`, keeps the intents within the ambiguity delta of the top score (at most two), and resolves each to its exact `RESOURCE_MAP` leaf path — no directory prefixes, filename stems, or globs. Every selected leaf projects to a typed `(WORKFLOW_MODE, leafResourceId)` pair against `leaf-manifest.json` via `leaf-aliases.json`; package indexes and fallback defaults ride their own channels and never become typed leaves. The live `mk_skill_advisor` scorer, not this router, remains authoritative for runtime skill scoring — see [`references/scoring/advisor_scorer.md`](./references/scoring/advisor_scorer.md).

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (
    SKILL_ROOT / "references",
    SKILL_ROOT / "assets",
    SKILL_ROOT / "feature_catalog",
    SKILL_ROOT / "manual_testing_playbook",
)

# This standalone skill emits exactly one workflow mode. Every routed leaf is a
# (WORKFLOW_MODE, leafResourceId) pair. leaf-manifest.json is the authorized
# leaf inventory; leaf-aliases.json binds each router-emitted path to its typed
# identity so a deterministic benchmark replay recovers real pairs.
WORKFLOW_MODE = "system-skill-advisor"

# Always-relevant runtime references offered when a request is too weak to
# score. DEFAULT_RESOURCE_SEMANTICS = "fallback-only": the defaults are a
# defer-time suggestion surfaced with the disambiguation checklist, never
# unioned into a scored route's typed leaves, so selected-leaf precision holds.
DEFAULT_RESOURCES = [
    "references/runtime/tool_ids_reference.md",
    "references/runtime/standalone_mcp_shape.md",
]
DEFAULT_RESOURCE_SEMANTICS = "fallback-only"

# Navigation indexes: loadable for browsing, deliberately excluded from typed
# leaves and from leaf-manifest.json. A broad "list the features / playbook"
# request loads these; they never become a (mode, leaf) pair.
PACKAGE_INDEXES = {
    "FEATURES": "feature_catalog/feature_catalog.md",
    "PLAYBOOK": "manual_testing_playbook/manual_testing_playbook.md",
}

# Intent -> weighted keyword signals. Keys are honest documentation-topic
# vocabulary drawn from what each reference/feature doc is ABOUT, not reverse
# engineered from any scenario prompt. A distinctive doc phrase scores weight 3;
# there are no per-scenario exact-match keys, so measured routing recall stays
# an honest reflection of natural topic overlap rather than a tuned number.
INTENT_SIGNALS = {
    "SCORER": {"weight": 3, "keywords": ["scorer", "lane fusion", "five-lane", "confidence calibration", "lane attribution", "ambiguous brief", "ambiguity window"]},
    "LANE_TUNING": {"weight": 3, "keywords": ["lane weight tuning", "reweight lane", "lane weight change"]},
    "VALIDATION_BASELINES": {"weight": 3, "keywords": ["validation baseline", "advisor_validate baseline", "validate slice bundle"]},
    "GRAPH_QUERY": {"weight": 3, "keywords": ["skill graph query", "skill_graph_query", "graph query cookbook", "skill graph status", "skill graph validate", "relationship read"]},
    "GRAPH_DRIFT": {"weight": 3, "keywords": ["skill graph drift", "reconcile graph drift", "sqlite drift"]},
    "GRAPH_EXTRACTION": {"weight": 3, "keywords": ["graph extraction plan", "extraction history", "extraction completion"]},
    "ENHANCES": {"weight": 3, "keywords": ["propagate enhances", "enhances propagation", "skill_graph_propagate_enhances"]},
    "MCP_SHAPE": {"weight": 3, "keywords": ["standalone mcp shape", "mcp topology", "server shape", "standalone advisor mcp"]},
    "TOOL_IDS": {"weight": 3, "keywords": ["tool id", "stable tool id", "tool ids reference"]},
    "LEGACY_BRIDGE": {"weight": 3, "keywords": ["legacy tool bridge", "compatibility bridge", "bridge policy"]},
    "FRESHNESS": {"weight": 3, "keywords": ["freshness contract", "trust state", "trust-state vocabulary", "degraded daemon", "quarantined daemon", "unavailable daemon"]},
    "DAEMON_LEASE": {"weight": 3, "keywords": ["daemon lease", "single-writer lease", "lease contract", "chokidar watcher", "daemon lifecycle"]},
    "DB_PATH": {"weight": 3, "keywords": ["database path policy", "sqlite path", "db path"]},
    "HOOK": {"weight": 3, "keywords": ["skill advisor hook", "prompt-time hook", "userpromptsubmit", "opencode plugin bridge", "goal opencode plugin"]},
    "DECISIONS": {"weight": 3, "keywords": ["deferred decision", "tier d", "deprecation banner"]},
    "RECOMMEND": {"weight": 3, "keywords": ["advisor_recommend", "recommend happy path"]},
    "STATUS": {"weight": 3, "keywords": ["advisor_status", "status transition", "status and rebuild"]},
    "REBUILD": {"weight": 3, "keywords": ["advisor_rebuild", "rebuild from source"]},
    "VALIDATE_TOOL": {"weight": 3, "keywords": ["advisor_validate"]},
    "CLI": {"weight": 3, "keywords": ["skill-advisor cli", "daemon-backed cli", "cli fallback"]},
}

# Intent -> exact leaf path(s). No prefixes, stems, or globs: every value is a
# concrete markdown leaf that exists in leaf-manifest.json (package indexes are
# intentionally absent — they live in PACKAGE_INDEXES). Several intents share a
# reference leaf on purpose; the many feature-catalog and playbook leaves that
# no intent maps stay reachable only via PACKAGE_INDEXES or a full-inventory
# browse. That unmapped remainder is expected, not a gap to be closed by tuning.
RESOURCE_MAP = {
    "SCORER": ["references/scoring/advisor_scorer.md"],
    "LANE_TUNING": ["references/scoring/lane_weight_tuning.md"],
    "VALIDATION_BASELINES": ["references/scoring/validation_baselines.md"],
    "GRAPH_QUERY": ["references/graph/skill_graph_query_cookbook.md"],
    "GRAPH_DRIFT": ["references/graph/skill_graph_drift.md"],
    "GRAPH_EXTRACTION": ["references/graph/skill_graph_extraction_plan.md"],
    "ENHANCES": ["references/graph/propagate_enhances.md"],
    "MCP_SHAPE": ["references/runtime/standalone_mcp_shape.md"],
    "TOOL_IDS": ["references/runtime/tool_ids_reference.md"],
    "LEGACY_BRIDGE": ["references/runtime/legacy_tool_bridge.md"],
    "FRESHNESS": ["references/runtime/freshness_contract.md"],
    "DAEMON_LEASE": ["references/runtime/daemon_lease_contract.md"],
    "DB_PATH": ["references/config/db_path_policy.md"],
    "HOOK": ["references/hooks/skill_advisor_hook.md"],
    "DECISIONS": ["references/decisions/deferred_decisions.md"],
    "RECOMMEND": ["feature_catalog/mcp_surface/advisor_recommend.md"],
    "STATUS": ["feature_catalog/mcp_surface/advisor_status.md"],
    "REBUILD": ["feature_catalog/mcp_surface/advisor_rebuild.md"],
    "VALIDATE_TOOL": ["feature_catalog/mcp_surface/advisor_validate.md"],
    "CLI": ["feature_catalog/mcp_surface/skill_advisor_cli.md"],
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm whether the request is about scoring, skill graph, runtime/mcp, config, hooks, decisions, an MCP tool surface, features or playbooks",
    "Confirm whether the task changes documentation only or executable advisor behavior",
    "Provide the failing tool id, hook runtime, reference path or validation command",
    "Confirm the verification command set before completion",
]

def discover_markdown_resources() -> set[str]:
    docs = []
    for base in RESOURCE_BASES:
        if base.exists():
            docs.extend(path for path in base.rglob("*.md") if path.is_file())
    return {doc.relative_to(SKILL_ROOT).as_posix() for doc in docs}

def _guard_in_skill(relative_path: str) -> str:
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)  # fail closed on any escape
    if resolved.suffix.lower() != ".md":
        raise ValueError(f"Only markdown resources are routable: {relative_path}")
    return resolved.relative_to(SKILL_ROOT).as_posix()

def _task_text(task) -> str:
    fields = [
        getattr(task, "prompt", ""),
        getattr(task, "intent", ""),
        getattr(task, "path", ""),
        getattr(task, "command", ""),
    ]
    return " ".join(str(field) for field in fields if field).lower()

def score_intents(task) -> dict[str, int]:
    text = _task_text(task)
    scores = {}
    for intent, model in INTENT_SIGNALS.items():
        hits = sum(1 for keyword in model["keywords"] if keyword in text)
        if hits:
            scores[intent] = hits * model["weight"]
    return scores

def typed_leaves(paths: list[str]) -> list[dict]:
    # Project selected leaf paths into deduped (workflowMode, leafResourceId)
    # pairs. Package indexes are never present (they are not in RESOURCE_MAP);
    # a path that is not a real manifest leaf is dropped, never emitted as an
    # invented pair.
    seen, pairs = set(), []
    index_paths = set(PACKAGE_INDEXES.values())
    for path in paths:
        if path in index_paths or (WORKFLOW_MODE, path) in seen:
            continue
        seen.add((WORKFLOW_MODE, path))
        pairs.append({"workflowMode": WORKFLOW_MODE, "leafResourceId": path})
    return pairs

inventory = discover_markdown_resources()
scores = score_intents(task)

# Too weak to score: offer the fallback defaults + disambiguation and assemble
# no typed leaves. DEFAULT_RESOURCE_SEMANTICS = "fallback-only" is exactly what
# makes the defaults a suggestion here rather than an assembled route.
if max(scores.values() or [0]) < 3:
    return {
        "workflowMode": WORKFLOW_MODE,
        "load_level": "UNKNOWN_FALLBACK",
        "needs_disambiguation": True,
        "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
        "supportResources": [p for p in DEFAULT_RESOURCES if p in inventory],
        "leafResources": [],
    }

# Keep intents within the ambiguity delta of the top score (at most two). A
# genuine tie between equally weighted keys surfaces both; otherwise the single
# top intent resolves to exactly its own leaf.
ranked = sorted(scores.items(), key=lambda item: item[1], reverse=True)
top_score = ranked[0][1]
selected = [intent for intent, score in ranked if top_score - score <= 1][:2]

resources = []
for intent in selected:
    for path in RESOURCE_MAP.get(intent, []):
        guarded = _guard_in_skill(path)
        if guarded in inventory and guarded not in resources:
            resources.append(guarded)

return {
    "workflowMode": WORKFLOW_MODE,
    "intents": selected,
    "ambiguous": len(selected) > 1,
    # Compatibility flat list: selected leaves only. Fallback defaults are NOT
    # unioned in (fallback-only semantics), so a scored route carries exactly
    # its intents' leaves.
    "resources": resources,
    # Typed projection every benchmark/replay consumer compares byte-for-byte.
    "leafResources": typed_leaves(resources),
    # Support defaults and navigation indexes ride their own channels so they
    # never inflate selected-leaf precision.
    "supportResources": DEFAULT_RESOURCES,
    "navigationResources": PACKAGE_INDEXES,
}
```

### Fallback contract

- **Low confidence:** load default runtime references, emit `UNKNOWN_FALLBACK_CHECKLIST`, and ask for the missing intent/path/tool signal.
- **Ambiguous intent scores:** load the top two intents' exact leaves and disclose the ambiguity instead of picking one silently.
- **Known intent with no mapped leaf:** return a "no knowledge base found" notice naming the missing intent; never invent a typed pair for a path outside `leaf-manifest.json`.
- **Advisor MCP unavailable:** for normal Gate 2 routing, fall back to Python `skill_advisor.py` only when the caller needs the legacy JSON-array facade or MCP/CLI transport is unavailable. Use `node .opencode/bin/skill-advisor.cjs <tool> --format json --timeout-ms N` for operator checks, doctor routes and runtime fallbacks that have already verified a warm `mk-skill-advisor` daemon socket. Prompt-time hooks must probe the socket first, never cold-spawn the daemon, and fail open on CLI exit 75 before keyword matching against frontmatter `trigger_phrases`. Full cross-daemon CLI behavior, recovery, exit taxonomy, stale-dist build commands, per-command `--help`, offline smoke, and `jsonl` semantics live in [`../system-spec-kit/references/cli/daemon_cli_reference.md`](../system-spec-kit/references/cli/daemon_cli_reference.md).

### Gate 2 caller guidance

- Prefer `mcp__mk_skill_advisor__advisor_recommend` for live runtime routing when MCP transport is healthy.
- Use `skill_advisor.py` for the legacy facade contract: AGENTS.md fallback checks, compatibility scripts expecting the JSON-array shape, or environments without the daemon-backed CLI.
- Use `.opencode/bin/skill-advisor.cjs` for full-parity daemon-backed CLI checks and runtime fallback only after a warm-socket probe succeeds; all 9 advisor tools are reachable over the same daemon, exit 75 is retryable fail-open, and a later evolution could make the CLI the primary or sole transport without breaking existing MCP workflows.
- CLI calls are sent untrusted by default. Mutations (`advisor_rebuild`, `skill_graph_scan`, apply-mode `skill_graph_propagate_enhances`) require `--trusted` or `MK_SKILL_ADVISOR_CLI_TRUSTED=1` — the maintainer path. Read tools never need it.

### Anti-patterns

- Directory prefixes, filename stems, or globs in `RESOURCE_MAP`. Every value is an exact leaf path that exists in `leaf-manifest.json`.
- Tuning `INTENT_SIGNALS` keywords to make individual scenario prompts hit their own leaf. Keys are documentation-topic vocabulary; a low honest routing recall is expected, not a defect to be inflated.
- A hand-maintained resource inventory that drifts from `leaf-manifest.json`. Regenerate the manifest (and keep `leaf-aliases.json` in sync) from the on-disk corpus instead.
- Raw `load("references/file.md")` calls without `_guard_in_skill()`, inventory checks or duplicate suppression.
- Hardcoded tool IDs in caller code. Consult the live registration in `mcp_server/tools/index.ts` and `mcp_server/tools/skill-graph-tools.ts`.

---

## 3. HOW IT WORKS

ADR-001 locks the target shape as **Standalone Advisor MCP With Legacy Tool Bridge**.

The package owns a dedicated MCP server named `mk_skill_advisor`. It lists all **9 tools** on the MCP surface. The tool ids stay stable:

Tools (9):

- `advisor_recommend`
- `advisor_rebuild`
- `advisor_status`
- `advisor_validate`
- `skill_graph_scan`
- `skill_graph_query`
- `skill_graph_status`
- `skill_graph_validate`
- `skill_graph_propagate_enhances`

`skill_graph_propagate_enhances` is trust-gated only for real apply writes (`mode=apply` with `dryRun` not `true`); report, propose and dry-run apply calls remain read-safe.

The stable tool ids matter because live consumers already call them from hooks, Python compatibility shims, plugin bridges, doctor workflows, install guides and MCP clients. Server-level namespacing supplies the boundary, so callers use the standalone server without learning a new advisor vocabulary.

The surface is dual-stack: the same 9 tools are callable through the full-parity daemon-backed CLI `node .opencode/bin/skill-advisor.cjs <tool_name>` over the same daemon (the MCP registration is unchanged). MCP remains the primary in-session transport today; use the CLI when MCP transport is missing, failed or not reconnecting while the daemon is warm, and for hooks, cron, CI and operator shell diagnostics. Recovery example: `node .opencode/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"<request>"}' --warm-only --format json --timeout-ms 3000`. CLI exit taxonomy: `0` success, `1` runtime, `64` usage/schema or trusted-mutation refusal, `69` protocol/dist mismatch or stale dist, `75` retryable daemon error. Because this CLI already has full parity, a later evolution could make it the primary or sole transport without breaking existing MCP workflows; that is a possible direction, not a committed plan. `--format jsonl` renders one complete JSON payload on one stdout line; it is not streaming JSON Lines. Trust resolution fails closed: the daemon treats a caller as untrusted when transport `_meta` is absent or unknown, the CLI sends `callerAuthority: untrusted` unless `--trusted`/`MK_SKILL_ADVISOR_CLI_TRUSTED=1` is supplied, and native MCP surfaces whose clients send no `_meta` are re-granted default trust only through `MK_SKILL_ADVISOR_TRUST_DEFAULT=trusted` in the daemon's own environment (set in the committed MCP registrations: `.mcp.json`, `opencode.json`, `opencode.json`), which callers cannot forge. An env-gated tri-daemon drill (`SPECKIT_RUN_TRI_DAEMON_DRILL=1`, `mcp_server/tests/tri-daemon-drill.vitest.ts`) exercises all three daemon-backed CLIs together.

The advisor implementation, skill-graph library and package-local database now live under this skill package, while memory remains focused on memory tools.

---

## 4. RULES

Always:

- Treat ADR-001 as the source of truth for standalone MCP topology and bridge behavior.
- Keep the advisor database under `.opencode/skills/system-skill-advisor/mcp_server/database/`.
- Keep public advisor and skill graph tool ids stable unless a later ADR explicitly changes them.
- Preserve prompt-safety boundaries. Advisor metadata and lane attribution must not echo raw prompt text.
- Keep `lib/skill-graph/` package-local to `system-skill-advisor`.

Never:

- Store `skill-graph.sqlite` under `.opencode/skills/system-spec-kit/mcp_server/database/` after the runtime move.
- Let both memory and advisor MCP servers write the same advisor SQLite database.
- Rename `advisor_*` or `skill_graph_*` public tools as part of documentation work.
- Move `lib/skill-graph/` during a doc-only pass.

Escalate if:

- A caller requires renamed public tools.
- The standalone advisor cannot build without a broader shared-runtime extraction.
- Any migration step would create competing writers for `skill-graph.sqlite`.

---

## 5. REFERENCES

Primary contract:

- ADR-001: internal design notes
- Extraction survey: internal design notes
- Standalone MCP discussion: internal design notes

Package references:

- `references/scoring/advisor_scorer.md` — lane attribution, fusion and confidence calibration.
- `references/scoring/lane_weight_tuning.md` — measured lane-weight change workflow.
- `references/scoring/validation_baselines.md` — `advisor_validate` baselines and troubleshooting.
- `references/graph/skill_graph_query_cookbook.md` — worked `skill_graph_query` examples.
- `references/graph/skill_graph_drift.md` — detect and reconcile SQLite drift from source files.
- `references/graph/skill_graph_extraction_plan.md` — extraction history and completion record.
- `references/graph/propagate_enhances.md` — internal `enhances` propagation contract.
- `references/runtime/standalone_mcp_shape.md` — standalone MCP topology.
- `references/runtime/tool_ids_reference.md` — stable public and internal tool ids.
- `references/runtime/legacy_tool_bridge.md` — compatibility bridge policy.
- `references/runtime/freshness_contract.md` — trust-state vocabulary and caller obligations.
- `references/runtime/daemon_lease_contract.md` — single-writer daemon lease behavior.
- `references/config/db_path_policy.md` — package-local SQLite path policy.
- `references/hooks/skill_advisor_hook.md` — prompt-time hook behavior.
- `references/decisions/deferred_decisions.md` — Tier D decision records (F6 deprecation banners).
- `ARCHITECTURE.md`
- `mcp_server/README.md`
- `mcp_server/tools/README.md`

---

## 6. SUCCESS CRITERIA

This skill is healthy when:

- `SKILL.md` frontmatter and `graph-metadata.json` parse cleanly.
- Skill discovery sees `system-skill-advisor` as a first-class critical system skill.
- Advisor routing requests resolve to this package without displacing target execution skills such as `sk-code`, `sk-doc` or `system-spec-kit`.
- `advisor_*` and `skill_graph_*` public ids remain documented as stable.
- The package-local database path is documented consistently.

---

## 7. INTEGRATION POINTS

Current package state:

- `mk_skill_advisor` is registered as a standalone MCP server.
- Advisor handlers, schemas, tools, scripts, tests, docs and database path ownership live under this package.
- `skill_graph_*` MCP handlers and tool descriptors live under this package.
- `lib/skill-graph/` database/query logic is fully migrated to `system-skill-advisor` (extraction complete).

Expected consumers:

- Prompt-time hooks for Claude, OpenCode and OpenCode. The Claude/OpenCode hooks share the warm-only CLI fallback helper `hooks/lib/skill-advisor-cli-fallback.ts`; the OpenCode plugin bridge (`mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs`) falls back to `node .opencode/bin/skill-advisor.cjs --warm-only` when its bridge path is unavailable.
- MCP clients that call `advisor_recommend`, `advisor_status`, `advisor_rebuild`, `advisor_validate`, `skill_graph_scan`, `skill_graph_query`, `skill_graph_status`, `skill_graph_validate` or `skill_graph_propagate_enhances`.
- Daemon-backed CLI callers (`node .opencode/bin/skill-advisor.cjs <tool>`) for doctor routes, scripts and CI — untrusted by default, `--trusted` for maintainer mutations.
- Doctor workflows that validate advisor health and rebuild state.
- Skill graph indexers and routing accuracy checks.

---

## 8. REFERENCES AND RELATED RESOURCES

Related skills:

- `system-spec-kit` owns spec folders, memory, validation and packet governance.
- `sk-doc` owns skill documentation, feature catalogs, install guides and playbooks.
- `sk-code` owns implementation once routing selects a code surface.
- `mcp-code-mode` owns external MCP orchestration workflows.
- `system-code-graph` owns structural code indexing, graph readiness and impact-analysis workflows.

The advisor should recommend these skills. It should not absorb their implementation rules.
