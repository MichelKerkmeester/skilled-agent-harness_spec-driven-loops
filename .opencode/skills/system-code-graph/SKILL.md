---
name: system-code-graph
description: "Structural code indexing and mk-code-index MCP workflows for graph readiness, impact queries, context retrieval and structural checks."
allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
version: 1.0.3.2
---

<!-- Keywords: code-graph, code graph, structural code indexing, mk-code-index, impact analysis, code_graph_scan, code_graph_query, code_graph_context, code_graph_status, code_graph_status, detect_changes -->

# System Code Graph - Structural Code Indexing and MCP Workflows

Structural AST indexing, SQLite-backed graph storage and MCP-facing code intelligence for impact analysis, neighborhood retrieval, graph readiness and change detection.

## Why structural matters

Semantic search answers "what does this code mean." Structural indexing answers "what does this code touch." When you change a function signature, semantic search finds vaguely similar functions across the codebase. Structural indexing tells you exactly which callers break, which imports lift, and which symbols a diff actually moves. Both surfaces matter at different moments, semantic for discovery and structural for blast radius.

This skill ships the structural half: a tree-sitter parser, a SQLite graph, a readiness contract that refuses stale answers, and an MCP surface that other agents can call. Use it whenever the question turns from "what is similar" to "what is connected."

## Glossary

- **Structural indexing.** AST-derived graph of files, symbols, calls, imports, and definitions. Distinct from text matching and from embedding-based semantic search.
- **Doc lane coverage.** Markdown, JSON, YAML and TOML files are included as file inventory rows only. The current parser returns clean doc rows with zero symbol nodes and zero relationship edges, so doc file counts are not structural extraction coverage.
- **Semantic search.** Vector-embedding lookup over code. Surfaces conceptually related code without requiring known names.
- **Blast radius.** Reverse impact set of a symbol or file. Answers "what depends on this if I change it."
- **Readiness.** Whether the graph reflects current workspace state. Freshness states are `fresh`, `stale`, `empty`, `error` (`absent` is not a freshness state — it is the companion trust-state projection of an `empty` graph). Read paths refuse to answer on non-fresh states.
- **Trust state.** Companion signal to readiness. Marks whether the graph passed its gold-query battery recently.
- **Scope fingerprint.** Hash of the scan inputs (include globs, env flags). When the requested scope diverges from the stored fingerprint, status returns `blocked` and recommends a full rescan.
- **False-safe.** A guarantee that the read path returns an explicit `blocked` payload rather than a silently-empty answer when the graph is not trustworthy. Prevents agents from acting on partial structural state.

## Situational triggers

Reach for this skill in these scenarios:

1. **Before a refactor that touches a critical utility.** Run `code_graph_query` with `operation:"blast_radius"` against the symbol. Surfaces every caller before edits land.
2. **After receiving a code-review patch from a non-local agent.** Run `detect_changes` with the unified diff. Returns the precise set of affected symbols and files so impact analysis stays grounded.
3. **When investigating an incident that touches multiple files.** Pull a compact graph neighborhood with `code_graph_context` around the seed file. Returns a token-budgeted snapshot that fits an LLM window without losing structural edges.

## 1. WHEN TO USE

Use this skill for:

- Structural code search where call paths, imports, containment or symbols matter.
- Blast-radius and impact preflight before risky code changes.
- Code-graph health, readiness, freshness and doctor checks.
- Gold-query verification and graph quality validation.
- MCP tool workflows using `code_graph_*` or `detect_changes`.

### When NOT to use

- Text-only exact searches: use Grep.
- Filename or path globbing: use Glob.
- Semantic concept search without known structure: use Grep for domain terms and iterate; `system-code-graph` indexes structure (callers/imports/symbols), not embeddings.

---

## 2. SMART ROUTING

This package is mandatory context for structural code-graph maintenance, readiness checks, impact queries, context retrieval, and structural tool coordination. The live tool schemas stay in `mcp_server/tool-schemas.ts`; this router controls which local documentation resources an agent should load.

Routing model:

```text
user prompt
  |
  +-- named code_graph_* or detect_changes tool -> named tool wins
  |
  +-- natural-language code-intelligence request
        |
        +-- code_graph_classify_query_intent -> structural / semantic / hybrid
        |
        +-- structural -> system-code-graph resources and readiness gate
        |
        +-- semantic -> system-code-graph resources
        |
        +-- hybrid -> semantic seeds, then code_graph_context
```

Resource domains:

- `references/runtime/` documents the tool surface, naming conventions, ownership boundary, and launcher lease.
- `references/readiness/` documents `ensureCodeGraphReady()`, readiness states, trust state, and scope fingerprints.
- `references/config/` documents database path and workspace containment policy.
- `feature_catalog/` documents current tool features and source-of-truth behavior slices.
- `manual_testing_playbook/` documents deterministic operator scenarios for status, scan, verify, query, context, change detection, structural, doctor, and launcher flows.
- `mcp_server/` owns handlers, schemas, tool registration, tests, parser, storage, readiness logic, and the SQLite-backed runtime.

### Resource Loading Levels

| Level | When to Load | Resources |
|---|---|---|
| ALWAYS | Every code-graph invocation | `references/runtime/tool_surface.md`, `references/readiness/code_graph_readiness_check.md` |
| CONDITIONAL | Intent signals match a resource domain | Matching canonical references, feature catalog slices, or playbook scenarios |
| ON_DEMAND | Explicit request or troubleshooting depth needed | Full reference folders, feature catalog families, and manual playbook categories |

### Smart Router Pseudocode

This pseudocode captures the canonical documentation resource-loading contract. The runtime schema array, not this table, remains authoritative for executable tool registration.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (
    SKILL_ROOT / "references",
    SKILL_ROOT / "feature_catalog",
    SKILL_ROOT / "manual_testing_playbook",
    SKILL_ROOT / "assets",
)
DEFAULT_RESOURCES = [
    "references/runtime/tool_surface.md",
    "references/readiness/code_graph_readiness_check.md",
]

INTENT_SIGNALS = {
    "TOOL_SURFACE": {"weight": 4, "keywords": ["tool", "schema", "tool id", "code_graph_", "detect_changes"]},
    "READINESS": {"weight": 4, "keywords": ["readiness", "fresh", "stale", "blocked", "empty", "absent", "ensurecodegraphready"]},
    "QUERY": {"weight": 4, "keywords": ["query", "blast radius", "caller", "import", "dependency", "symbol", "context"]},
    "SCAN_VERIFY": {"weight": 4, "keywords": ["scan", "verify", "gold query", "rescan", "index", "refresh"]},
    "CHANGE_DETECTION": {"weight": 3, "keywords": ["detect changes", "diff", "affected symbols", "preflight"]},
    "CONFIG": {"weight": 3, "keywords": ["database", "sqlite", "db path", "storage", "speckit_code_graph_db_dir"]},
    "NAMING": {"weight": 3, "keywords": ["name", "mk-code-index", "mk_code_index", "namespace", "launcher", "plugin"]},
    "OWNERSHIP": {"weight": 3, "keywords": ["ownership", "boundary", "spec-kit", "deep-loop", "coverage graph"]},
    "LAUNCHER": {"weight": 3, "keywords": ["launcher", "lease", "pid", "single writer", "lease_held_by"]},
    "FEATURES": {"weight": 2, "keywords": ["feature catalog", "capability", "current feature"]},
    "PLAYBOOK": {"weight": 2, "keywords": ["manual test", "playbook", "scenario", "evidence"]},
}

RESOURCE_MAP = {
    "TOOL_SURFACE": [
        "references/runtime/tool_surface.md",
        "feature_catalog/06--mcp-tool-surface/tool-registrations.md",
    ],
    "READINESS": [
        "references/readiness/code_graph_readiness_check.md",
        "references/readiness/readiness_and_scope_fingerprint.md",
        "feature_catalog/01--read-path-freshness/ensure-code-graph-ready.md",
        "feature_catalog/02--manual-scan-verify-status/code-graph-status.md",
    ],
    "QUERY": [
        "references/runtime/tool_surface.md",
        "feature_catalog/01--read-path-freshness/query-self-heal.md",
        "feature_catalog/04--context-retrieval/code-graph-context.md",
    ],
    "SCAN_VERIFY": [
        "references/readiness/readiness_and_scope_fingerprint.md",
        "feature_catalog/02--manual-scan-verify-status/code-graph-scan.md",
        "feature_catalog/02--manual-scan-verify-status/code-graph-verify.md",
    ],
    "CHANGE_DETECTION": [
        "references/runtime/tool_surface.md",
        "feature_catalog/03--detect-changes/detect-changes-preflight.md",
    ],
    "CONFIG": [
        "references/config/database_path_policy.md",
    ],
    "NAMING": [
        "references/runtime/naming_conventions.md",
    ],
    "OWNERSHIP": [
        "references/runtime/ownership_boundary.md",
    ],
    "LAUNCHER": [
        "references/runtime/launcher_lease.md",
        "manual_testing_playbook/09--post-rename-infrastructure/launcher-startup-prefix.md",
    ],
    "FEATURES": [
        "feature_catalog/feature_catalog.md",
    ],
    "PLAYBOOK": [
        "manual_testing_playbook/manual_testing_playbook.md",
    ],
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm whether the request is about tool surface, readiness, query, scan/verify, change detection, config, structural, naming, ownership, launcher, features or playbooks",
    "Confirm whether the task changes documentation only or executable code-graph behavior",
    "Provide the failing tool id, status payload, reference path, diff, or validation command",
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
            "notice": f"No knowledge base found for code-graph intent '{intent}'",
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

### Tool Dispatch Contract

The router selects from these tool intents. `mcp_server/tool-schemas.ts` `CODE_GRAPH_TOOL_SCHEMAS` is the source of truth for the schemas themselves.

| Intent | Primary Surface | Reference |
|--------|-----------------|-----------|
| Index or refresh structural graph state | `mcp__mk_code_index__code_graph_scan` | `feature_catalog/02--manual-scan-verify-status/code-graph-scan.md` |
| Query callers, imports, dependencies, symbols or blast radius | `mcp__mk_code_index__code_graph_query` | `feature_catalog/01--read-path-freshness/query-self-heal.md` |
| Classify natural-language queries into structural/semantic/hybrid intent | `mcp__mk_code_index__code_graph_classify_query_intent` | `mcp_server/lib/query-intent-classifier.ts` |
| Build compact neighborhood context around seeds | `mcp__mk_code_index__code_graph_context` | `feature_catalog/04--context-retrieval/code-graph-context.md` |
| Check readiness, freshness, graph quality or blocked-read state | `mcp__mk_code_index__code_graph_status` | `feature_catalog/02--manual-scan-verify-status/code-graph-status.md` |
| Validate graph quality with gold queries | `mcp__mk_code_index__code_graph_verify` | `feature_catalog/02--manual-scan-verify-status/code-graph-verify.md` |
| Inspect changed symbols from a diff | `mcp__mk_code_index__detect_changes` | `feature_catalog/03--detect-changes/detect-changes-preflight.md` |
| Execute verification-gated apply-mode recovery operations | `mcp__mk_code_index__code_graph_apply` | `feature_catalog/08--doctor-code-graph/doctor-apply-mode.md` |
| Review doctor code-graph apply policy | `/doctor code-graph` | `feature_catalog/08--doctor-code-graph/doctor-apply-mode.md` |

The standalone MCP server name is `mk-code-index`. Tool IDs stay stable as `code_graph_*` and `detect_changes`.

The surface is dual-stack: every tool above is also callable through the full-parity daemon-backed CLI `node .opencode/bin/code-index.cjs <tool_name> [--json '{...}' | --param value]` against the same daemon (MCP registration unchanged). MCP remains the primary in-session transport today; use the CLI when MCP transport is missing, failed or not reconnecting while the daemon is warm, and for hooks, cron, CI and operator shell diagnostics. Recovery example: `node .opencode/bin/code-index.cjs code_graph_status --format json --timeout-ms 3000 --warm-only`. Flag values are coerced against the tool's input schema. Exit taxonomy: `0` success, `1` runtime, `64` usage/schema (including `detect_changes` `parse_error` on a malformed diff), `69` protocol/dist mismatch or stale dist, `75` retryable daemon error. Blocked-read rendering is preserved: a `status:"blocked"` readiness refusal exits `0` with the `requiredAction` surfaced — an actionable answer, not a failure. Prompt-time callers must pass `--warm-only` (probe-only; exit `75` on a cold daemon); other contexts auto-spawn via `mk-code-index-launcher.cjs`. Because this CLI already has full parity, a later evolution could make it the primary or sole transport without breaking existing MCP workflows; that is a possible direction, not a committed plan. `--format jsonl` renders one complete JSON payload on one stdout line; it is not streaming JSON Lines. Full cross-daemon CLI behavior, recovery, stale-dist build commands, per-command `--help`, offline smoke, and safety rules live in [`../system-spec-kit/references/cli/daemon_cli_reference.md`](../system-spec-kit/references/cli/daemon_cli_reference.md).

### Fallback Contract

- **Low confidence:** load default runtime/readiness references, emit `UNKNOWN_FALLBACK_CHECKLIST`, and ask for the missing tool/status/path signal.
- **Ambiguous intent scores:** load the top two resource domains and disclose the ambiguity instead of picking one silently.
- **Known intent with no resources:** return a "no knowledge base found" notice naming the missing intent.
- **Unclassifiable intent:** call `code_graph_classify_query_intent` first. If the classifier returns low confidence, ask for one concrete file path, symbol or error message before proceeding.
- **`mk_code_index` MCP unavailable:** if the daemon is warm, use the daemon-backed CLI recovery path documented above. If neither MCP nor the warm CLI path is available, report the state and stop. Structural queries do not fall back to text search because ambiguous text-search results mislead more than they help.
- **Graph not ready (`status` returns `blocked`, `empty`, or `trustState: absent`):** call `code_graph_scan` first, then retry. Never return a stale or empty graph result as if it were authoritative.

### Anti-Patterns

- Static reference inventories that miss newly moved docs.
- Loading root compatibility stubs when canonical subfolder references exist.
- Compatibility stubs without `deprecated_at` and `remove_after` frontmatter, or any router target that points at a stub before the removal-window grep passes.
- Raw `load("references/file.md")` calls without `_guard_in_skill()`, inventory checks or duplicate suppression.
- Hardcoded tool lists in router code. Consult `mcp_server/tool-schemas.ts` `CODE_GRAPH_TOOL_SCHEMAS` as the source of truth.
- Using `code_graph_query` for unclassified queries. Classify intent first so the right tool runs.
- Treating `detect_changes` as a general query tool. It is diff-driven impact analysis with a fixed schema, not a query surface.

---

## 3. HOW IT WORKS

Runtime source lives under `mcp_server/{lib,handlers,tools,tests}/`. The package docs live under `feature_catalog/` and `manual_testing_playbook/`.

Read paths call `ensureCodeGraphReady()` before answering any structural query. The check enforces the false-safe contract: stale, empty, or scope-mismatched graphs return `blocked` with an explicit `requiredAction` rather than empty results. Manual maintenance tools run explicit scans, verification, status checks, and structural tool operations against the same readiness gate.

The deep-loop coverage graph tools remain in `system-spec-kit` because the research and review loop owns its state machine and the lifecycle of iteration packets. Code-graph stays focused on the structural index for everything else.

---

## 4. RULES

### ALWAYS

1. **ALWAYS register MCP tools under the standalone `mk-code-index` server.** Tool IDs (`code_graph_*`, `detect_changes`) are the stable surface contract.
2. **ALWAYS use the `mcp__mk_code_index__*` namespace** for MCP-side tool calls. Direct library consumers in `system-spec-kit` handlers and hooks use in-process imports through `system-spec-kit/mcp_server/lib/code-graph-boundary.ts`.
3. **ALWAYS check readiness before answering structural questions.** `code_graph_status` first; if `readiness !== "fresh"`, return the `blocked` payload from the tool rather than a stale result.
4. **ALWAYS treat `mcp_server/tool-schemas.ts` `CODE_GRAPH_TOOL_SCHEMAS` as the authoritative tool list.** Docs are documentation; the schema array is canonical.

### NEVER

1. **NEVER move shared lifecycle, memory, or hook surfaces into `system-code-graph`.** Those belong in `system-spec-kit`. Only code-graph-owned docs and source live here.
2. **NEVER return a stale, empty, or scope-mismatched graph answer as if it were authoritative.** Read-path tools (`code_graph_query`, `code_graph_context`, `detect_changes`) refuse with `status: "blocked"` instead of false-safe empty results — preserve that contract end-to-end.
3. **NEVER fall back to text search when MCP is unavailable.** Structural queries must report the unavailable state and stop. Ambiguous text-search results mislead more than they help.
4. **NEVER hardcode tool lists or namespace prefixes in router or caller code.** Consult `tool-schemas.ts` at runtime; rely on the `mcp__mk_code_index__` prefix from MCP discovery.

### ESCALATE IF

1. **ESCALATE IF the scope fingerprint differs from the stored baseline** and the requested scan would replace an established graph without operator opt-in. Surface the fingerprint delta and ask for confirmation (`forceScopeChange: true`).
2. **ESCALATE IF readiness is `blocked` and the required action is destructive** (zero-node reset, full re-scan on a populated graph). Ask before issuing the destructive flag.
3. **ESCALATE IF the classifier returns low-confidence intent** on a high-stakes query (refactor preflight, blast-radius audit). Request one concrete file path, symbol, or error message before guessing.

---

## 5. REFERENCES

- `feature_catalog/feature_catalog.md` is the current runtime feature inventory.
- `manual_testing_playbook/manual_testing_playbook.md` is the operator validation package.
- `mcp_server/tool-schemas.ts` defines the `mk-code-index` code graph, detect-changes and structural schemas.
- `mcp_server/tools/code-graph-tools.ts` registers and dispatches the standalone tool IDs.

---

## 6. SUCCESS CRITERIA

- `code_graph_scan` can refresh the graph and report readiness metadata.
- `code_graph_query`, `code_graph_context` and `detect_changes` refuse unsafe stale states instead of returning false-safe answers.
- `code_graph_verify` runs only against fresh graph state.
- Docs reference `mk-code-index` for live MCP namespace examples.

---

## 7. INTEGRATION POINTS

Cross-subsystem consumers use two intentional paths:

| Consumer Type | Integration |
|---------------|-------------|
| `system-spec-kit` handlers / hooks / session surfaces | Direct in-process imports from `system-code-graph/mcp_server/lib/*` for shared readiness, startup, and context helpers via `system-spec-kit/mcp_server/lib/code-graph-boundary.ts`. |
| MCP callers (agents, commands, runtimes) | Standalone `mk-code-index` MCP namespace: `mcp__mk_code_index__code_graph_*` and `mcp__mk_code_index__detect_changes`. |
| CLI callers (hooks, scripts, CI, transport-down recovery) | Daemon-backed `node .opencode/bin/code-index.cjs <tool>` over the same daemon. The Claude/Codex hook adapters fall back through `system-spec-kit/mcp_server/hooks/code-index-cli-fallback.ts` (warm-only), and the OpenCode plugin bridge (`mcp_server/plugin_bridges/mk-code-graph-bridge.mjs`) routes through the CLI with `SPECKIT_CODE_INDEX_CLI_PROMPT_TIME=1`. |

The shared SQLite file at `.opencode/skills/system-code-graph/mcp_server/database/code-graph.sqlite` remains the coordination boundary. The scan loop is the single writer.

**Naming asymmetries.** Five identifiers refer to this skill across runtime layers — skill folder slug (`system-code-graph`), MCP server name (`mk-code-index`), MCP config key (`mk_code_index`), launcher / plugin file names, and the shared data directory. Each is correct in its own scope. See [`references/runtime/naming_conventions.md`](references/runtime/naming_conventions.md) for the full map plus the rationale for the hook-location asymmetry (hooks remain under `system-spec-kit/mcp_server/hooks/`).

---

## 8. REFERENCES AND RELATED RESOURCES

### Core references (this skill)

- [`references/runtime/tool_surface.md`](references/runtime/tool_surface.md) — 8 MCP tools mapped to handler files, primary purpose, and preconditions.
- [`references/readiness/readiness_and_scope_fingerprint.md`](references/readiness/readiness_and_scope_fingerprint.md) — readiness state machine (`fresh`/`stale`/`empty`/`error` freshness, plus the `blocked` read decision and `absent` trust projection) and the scan-scope fingerprint contract.
- [`references/readiness/code_graph_readiness_check.md`](references/readiness/code_graph_readiness_check.md) — `ensureCodeGraphReady()` gates, preconditions, recovery procedures.
- [`references/config/database_path_policy.md`](references/config/database_path_policy.md) — canonical database path policy and override rules.
- [`references/runtime/naming_conventions.md`](references/runtime/naming_conventions.md) — name map across skill folder, MCP server, launcher, plugin bridge, and hook location.
- [`references/runtime/ownership_boundary.md`](references/runtime/ownership_boundary.md) — what stays in `system-spec-kit` vs `system-code-graph` after extraction.
- [`references/runtime/launcher_lease.md`](references/runtime/launcher_lease.md) — PID-file lease contract for the launcher single-writer path.

### Cross-skill references

- Shared lifecycle and context docs that stayed in `system-spec-kit`: `.opencode/skills/system-spec-kit/feature_catalog/22--context-preservation/`
- Extraction history: internal migration notes
- Latest uplift context: internal implementation notes
