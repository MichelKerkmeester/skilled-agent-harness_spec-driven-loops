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

### Resource loading levels

| Level | When to Load | Resources |
|---|---|---|
| ALWAYS | Every advisor-maintenance invocation | `references/runtime/tool_ids_reference.md`, `references/runtime/standalone_mcp_shape.md` |
| CONDITIONAL | Intent signals match a resource domain | Matching canonical references, feature catalog slices, or playbook scenarios |
| ON_DEMAND | Explicit request or troubleshooting depth needed | Full reference folders, feature catalog families, and manual playbook categories |

### Smart router pseudocode

This pseudocode captures the canonical documentation resource-loading contract. See [`references/scoring/advisor_scorer.md`](./references/scoring/advisor_scorer.md) for the actual runtime scorer mechanics.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (
    SKILL_ROOT / "references",
    SKILL_ROOT / "feature_catalog",
    SKILL_ROOT / "manual_testing_playbook",
)
DEFAULT_RESOURCES = [
    "references/runtime/tool_ids_reference.md",
    "references/runtime/standalone_mcp_shape.md",
]

INTENT_SIGNALS = {
    "SCORING": {"weight": 4, "keywords": ["score", "scorer", "lane", "confidence", "calibration", "validate"]},
    "GRAPH": {"weight": 4, "keywords": ["skill graph", "graph", "drift", "query", "enhances", "propagate"]},
    "RUNTIME": {"weight": 4, "keywords": ["mcp", "tool id", "bridge", "standalone", "freshness", "daemon", "lease"]},
    "CONFIG": {"weight": 3, "keywords": ["database", "sqlite", "db path", "skill-graph.sqlite"]},
    "HOOKS": {"weight": 4, "keywords": ["hook", "prompt submit", "opencode", "claude", "opencode"]},
    "DECISIONS": {"weight": 3, "keywords": ["deferred", "decision", "tier d", "migration rationale"]},
    "FEATURES": {"weight": 3, "keywords": ["feature catalog", "capability", "current feature"]},
    "PLAYBOOK": {"weight": 3, "keywords": ["manual test", "playbook", "scenario", "evidence"]},
}

RESOURCE_MAP = {
    "SCORING": [
        "references/scoring/advisor_scorer.md",
        "references/scoring/lane_weight_tuning.md",
        "references/scoring/validation_baselines.md",
        "feature_catalog/04--scorer-fusion/weights-config.md",
    ],
    "GRAPH": [
        "references/graph/skill_graph_query_cookbook.md",
        "references/graph/skill_graph_drift.md",
        "references/graph/skill_graph_extraction_plan.md",
        "references/graph/propagate_enhances.md",
    ],
    "RUNTIME": [
        "references/runtime/standalone_mcp_shape.md",
        "references/runtime/tool_ids_reference.md",
        "references/runtime/legacy_tool_bridge.md",
        "references/runtime/freshness_contract.md",
        "references/runtime/daemon_lease_contract.md",
    ],
    "CONFIG": [
        "references/config/db_path_policy.md",
    ],
    "HOOKS": [
        "references/hooks/skill_advisor_hook.md",
        "manual_testing_playbook/02--cli-hooks-and-plugin/opencode-plugin-bridge.md",
    ],
    "DECISIONS": [
        "references/decisions/deferred_decisions.md",
    ],
    "FEATURES": [
        "feature_catalog/feature_catalog.md",
    ],
    "PLAYBOOK": [
        "manual_testing_playbook/manual_testing_playbook.md",
    ],
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm whether the request is about scoring, graph, runtime, config, hooks, decisions, feature catalog or playbooks",
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
    resolved.relative_to(SKILL_ROOT)
    if resolved.suffix.lower() != ".md":
        raise ValueError(f"Only markdown resources are routable: {relative_path}")
    return resolved.relative_to(SKILL_ROOT).as_posix()

def _guard_resource_map(resource_map: dict[str, list[str]]) -> None:
    for intent, resources in resource_map.items():
        for relative_path in resources:
            guarded = _guard_in_skill(relative_path)
            if guarded.startswith("references/"):
                tail = guarded.removeprefix("references/")
                if "/" not in tail and "-" in Path(tail).stem:
                    raise ValueError(f"RESOURCE_MAP must target canonical references, not compatibility stubs: {intent} -> {guarded}")

def _task_text(task) -> str:
    fields = [
        getattr(task, "prompt", ""),
        getattr(task, "intent", ""),
        getattr(task, "path", ""),
        getattr(task, "command", ""),
    ]
    return " ".join(str(field) for field in fields if field).lower()

loaded = []
seen = set()
_guard_resource_map(RESOURCE_MAP)
_guard_resource_map({"DEFAULT": DEFAULT_RESOURCES})
inventory = discover_markdown_resources()

def load_if_available(relative_path: str) -> None:
    guarded = _guard_in_skill(relative_path)
    if guarded in inventory and guarded not in seen:
        load(guarded)
        loaded.append(guarded)
        seen.add(guarded)

def score_intents(task) -> dict[str, int]:
    text = _task_text(task)
    scores = {}
    for intent, model in INTENT_SIGNALS.items():
        hits = sum(1 for keyword in model["keywords"] if keyword in text)
        if hits:
            scores[intent] = hits * model["weight"]
    return scores

for resource in DEFAULT_RESOURCES:
    load_if_available(resource)

scores = score_intents(task)
if max(scores.values() or [0]) < 3:
    return {
        "load_level": "UNKNOWN_FALLBACK",
        "needs_disambiguation": True,
        "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
        "resources": loaded,
    }

ranked = sorted(scores.items(), key=lambda item: item[1], reverse=True)
top_score = ranked[0][1]
selected = [intent for intent, score in ranked if top_score - score <= 1][:2]

for intent in selected:
    resources = RESOURCE_MAP.get(intent, [])
    if not resources:
        return {
            "notice": f"No knowledge base found for advisor intent '{intent}'",
            "resources": loaded,
        }
    for resource in resources:
        load_if_available(resource)

return {
    "intents": selected,
    "ambiguous": len(selected) > 1,
    "resources": loaded,
}
```

### Fallback contract

- **Low confidence:** load default runtime references, emit `UNKNOWN_FALLBACK_CHECKLIST`, and ask for the missing intent/path/tool signal.
- **Ambiguous intent scores:** load the top two resource domains and disclose the ambiguity instead of picking one silently.
- **Known intent with no resources:** return a "no knowledge base found" notice naming the missing intent.
- **Advisor MCP unavailable:** for normal Gate 2 routing, fall back to Python `skill_advisor.py` only when the caller needs the legacy JSON-array facade or MCP/CLI transport is unavailable. Use `node .opencode/bin/skill-advisor.cjs <tool> --format json --timeout-ms N` for operator checks, doctor routes and runtime fallbacks that have already verified a warm `mk-skill-advisor` daemon socket. Prompt-time hooks must probe the socket first, never cold-spawn the daemon, and fail open on CLI exit 75 before keyword matching against frontmatter `trigger_phrases`. Full cross-daemon CLI behavior, recovery, exit taxonomy, stale-dist build commands, per-command `--help`, offline smoke, and `jsonl` semantics live in [`../system-spec-kit/references/cli/daemon_cli_reference.md`](../system-spec-kit/references/cli/daemon_cli_reference.md).

### Gate 2 caller guidance

- Prefer `mcp__mk_skill_advisor__advisor_recommend` for live runtime routing when MCP transport is healthy.
- Use `skill_advisor.py` for the legacy facade contract: AGENTS.md fallback checks, compatibility scripts expecting the JSON-array shape, or environments without the daemon-backed CLI.
- Use `.opencode/bin/skill-advisor.cjs` for full-parity daemon-backed CLI checks and runtime fallback only after a warm-socket probe succeeds; all 9 advisor tools are reachable over the same daemon, exit 75 is retryable fail-open, and a later evolution could make the CLI the primary or sole transport without breaking existing MCP workflows.
- CLI calls are sent untrusted by default. Mutations (`advisor_rebuild`, `skill_graph_scan`, apply-mode `skill_graph_propagate_enhances`) require `--trusted` or `MK_SKILL_ADVISOR_CLI_TRUSTED=1` — the maintainer path. Read tools never need it.

### Anti-patterns

- Static reference inventories that miss newly moved docs.
- Loading root compatibility stubs when canonical subfolder references exist.
- Compatibility stubs without `deprecated_at` and `remove_after` frontmatter, or any router target that points at a stub before the removal-window grep passes.
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
