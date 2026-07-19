---
name: system-code-graph
description: "Structural code indexing and mk-code-index MCP workflows for graph readiness, impact queries, context retrieval/structural checks."
allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
version: 1.3.0.0
---

<!-- Keywords: code-graph, code graph, structural code indexing, mk-code-index, impact analysis, code_graph_scan, code_graph_query, code_graph_context, code_graph_status, code_graph_status, detect_changes -->

# System Code Graph - Structural Code Indexing and MCP Workflows

Structural AST indexing, SQLite-backed graph storage and MCP-facing code intelligence for impact analysis, neighborhood retrieval, graph readiness and change detection.

## Why structural matters

Semantic search answers "what does this code mean." Structural indexing answers "what does this code touch." When you change a function signature, semantic search finds vaguely similar functions across the codebase. Structural indexing tells you exactly which callers break, which imports lift, and which symbols a diff actually moves. Both surfaces matter at different moments, semantic for discovery and structural for blast radius.

This skill ships the structural half: a tree-sitter parser, a SQLite graph, a readiness contract that refuses stale answers, and an MCP surface that other agents can call. Use it whenever the question turns from "what is similar" to "what is connected."

## Glossary

- **Structural indexing.** AST-derived graph of files, symbols, calls, imports, and definitions. Distinct from text matching and from embedding-based semantic search.
- **Doc lane coverage.** Default scans include config formats (`JSON`, `JSONC`, `YAML`, `YML`, `TOML`) and deliberately omit Markdown/prose docs unless they are re-added with explicit scan `includeGlobs`. The doc lane now performs lightweight structural extraction: config files produce `key` symbol nodes, Markdown files produce `heading` symbol nodes when included, and nesting is recorded with `CONTAINS` edges. Treat doc-lane counts as doc-structure coverage, not full source-code AST coverage.
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

This package is mandatory context for structural code-graph maintenance, readiness checks, impact queries, context retrieval, and structural tool coordination. The live tool schemas stay in `mcp-server/tool-schemas.ts`; this router controls which local documentation resources an agent should load.

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
- `feature-catalog/` documents current tool features and source-of-truth behavior slices.
- `manual-testing-playbook/` documents deterministic operator scenarios for status, scan, verify, query, context, change detection, structural, doctor, and launcher flows.
- `mcp-server/` owns handlers, schemas, tool registration, tests, parser, storage, readiness logic, and the SQLite-backed runtime.

### Resource Loading Levels

| Level | When to Load | Resources |
|---|---|---|
| FALLBACK | Request too weak to score | The two `DEFAULT_RESOURCES` references, offered with the disambiguation checklist (fallback-only: never unioned into a scored route) |
| SELECTED | An intent scores | The exact `RESOURCE_MAP[intent]` leaf(s) for the selected intent(s), emitted as typed `(WORKFLOW_MODE, leafResourceId)` pairs |
| NAVIGATION | Broad "list the features / playbook" browse | A `PACKAGE_INDEXES` index doc — navigation only, never a typed leaf |

### Smart Router Pseudocode

This pseudocode is the canonical resource-routing contract. The router is a singleton-mode selector: it scores the request against `INTENT_SIGNALS`, keeps the intents within the ambiguity delta of the top score (at most two), and resolves each to its exact `RESOURCE_MAP` leaf path — no directory prefixes, filename stems, or globs. Every selected leaf projects to a typed `(WORKFLOW_MODE, leafResourceId)` pair against `leaf-manifest.json` (the authorized 53-leaf inventory) via `leaf-aliases.json`; package indexes and fallback defaults ride their own channels and never become typed leaves. The runtime schema array, not this router, remains authoritative for executable tool registration.

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
# 53-leaf inventory; leaf-aliases.json binds each router-emitted path to its
# typed identity so a deterministic benchmark replay recovers real pairs.
WORKFLOW_MODE = "system-code-graph"

# Always-relevant references offered when a request is too weak to score.
# DEFAULT_RESOURCE_SEMANTICS = "fallback-only": the defaults are a defer-time
# suggestion surfaced with the disambiguation checklist, never unioned into a
# scored route's typed leaves, so selected-leaf precision is not diluted.
DEFAULT_RESOURCES = [
    "references/runtime/tool-surface.md",
    "references/readiness/code-graph-readiness-check.md",
]
DEFAULT_RESOURCE_SEMANTICS = "fallback-only"

# Navigation indexes: loadable for browsing, deliberately excluded from typed
# leaves and from leaf-manifest.json. A broad "list the features / playbook"
# request loads these; they never become a (mode, leaf) pair.
PACKAGE_INDEXES = {
    "FEATURES": "feature-catalog/feature-catalog.md",
    "PLAYBOOK": "manual-testing-playbook/manual-testing-playbook.md",
}

# Intent -> weighted keyword signals. Generic documentation keys score at
# weight 3 on distinctive doc phrases; exact scenario keys score at weight 5 on
# a phrase unique to one manual-testing scenario, so an exact scenario request
# clears the ambiguity delta over any generic key and resolves to exactly its
# own leaf while a plain doc lookup still routes to the reference.
INTENT_SIGNALS = {
    "TOOL_SURFACE": {"weight": 3, "keywords": ["tool surface reference", "mcp tool inventory", "tool id map"]},
    "READINESS": {"weight": 3, "keywords": ["readiness check reference", "ensurecodegraphready", "readiness gate doc"]},
    "READINESS_SCOPE": {"weight": 3, "keywords": ["scope fingerprint", "readiness state machine", "scan-scope contract"]},
    "QUERY": {"weight": 3, "keywords": ["blast radius reference", "caller lookup doc", "dependency query surface"]},
    "SCAN_VERIFY": {"weight": 3, "keywords": ["rescan scope", "gold-query battery reference", "scan scope refresh"]},
    "CHANGE_DETECTION": {"weight": 3, "keywords": ["detect_changes preflight feature", "affected-symbol preflight", "diff impact preflight"]},
    "CONFIG": {"weight": 3, "keywords": ["database path policy", "db path override", "sqlite path policy"]},
    "NAMING": {"weight": 3, "keywords": ["naming conventions map", "namespace asymmetry", "name map across layers"]},
    "OWNERSHIP": {"weight": 3, "keywords": ["ownership boundary", "what stays in system-spec-kit", "extraction boundary"]},
    "LAUNCHER": {"weight": 3, "keywords": ["launcher lease contract", "pid-file lease", "single-writer lease"]},
    "CODE_INDEX_CLI": {"weight": 3, "keywords": ["code-index cli reference", "daemon-backed cli surface", "cli parity reference"]},
    "TOOL_REGISTRATIONS": {"weight": 3, "keywords": ["tool registrations", "tool registration wiring", "server registration list"]},
    "QUERY_SELF_HEAL": {"weight": 3, "keywords": ["query self-heal feature", "read-path self-heal design", "self-heal handler slice"]},
    "CODE_GRAPH_CONTEXT": {"weight": 3, "keywords": ["context feature slice", "neighborhood context feature", "context handler design"]},
    "ENSURE_READY_SELECTIVE_REINDEX": {"weight": 5, "keywords": ["repair a single stale tracked file", "selectively reindex", "unrequested full scan"]},
    "QUERY_SELF_HEAL_STALE_FILE": {"weight": 5, "keywords": ["self-heals a single stale file", "refuses broad stale state", "blocked-scan path"]},
    "SCAN_INCREMENTAL": {"weight": 5, "keywords": ["incremental code_graph_scan skips unchanged", "removes deleted tracked files", "deleted-file pruning"]},
    "SCAN_FULL": {"weight": 5, "keywords": ["full code_graph_scan", "persists the edge baseline", "reparses candidates"]},
    "VERIFY_BLOCKED_ON_STALE": {"weight": 5, "keywords": ["code_graph_verify blocks on stale", "passes through to verification after", "explicit rescan before verify"]},
    "STATUS_READONLY": {"weight": 5, "keywords": ["code_graph_status around a stale-file fixture", "diagnostics without repairing", "read-only status diagnostics"]},
    "DETECT_CHANGES_NO_INLINE_INDEX": {"weight": 5, "keywords": ["detect_changes refuses stale graph state", "instead of repairing inline", "no inline index"]},
    "CONTEXT_READINESS_BLOCK": {"weight": 5, "keywords": ["code_graph_context blocks broad stale", "returns readiness metadata", "context readiness block"]},
    "DEEP_LOOP_GRAPH_CONVERGENCE": {"weight": 5, "keywords": ["graph convergence is called before stop voting", "convergence before stop voting", "auto yaml convergence"]},
    "DEEP_LOOP_GRAPH_UPSERT": {"weight": 5, "keywords": ["graph upsert only fires when graphevents", "conditional graph upsert", "graphevents are present"]},
    "TOOL_CALL_SHAPE_VALIDATION": {"weight": 5, "keywords": ["malformed code_graph mcp calls", "schema validation reports the missing fields", "tool call shape validation"]},
    "DOCTOR_APPLY_MODE_POLICY": {"weight": 5, "keywords": ["doctor-code-graph routing and yaml", "diagnostic-only despite mutating route metadata", "apply-mode policy"]},
    "MCP_MANIFEST_POST_RENAME": {"weight": 5, "keywords": ["advertises the expected 8 tools", "tool manifest after rename", "8 tools with correct tool ids"]},
    "LAUNCHER_STARTUP_PREFIX": {"weight": 5, "keywords": ["mk-code-index-launcher prefix on stderr", "idle-timeout guardrail", "launcher startup prefix"]},
    "MCP_SERVER_KEY_RENAME": {"weight": 5, "keywords": ["mk_code_index server key", "no system_code_graph key", "mcp.json server key"]},
    "DATABASE_PATH_VERIFICATION": {"weight": 5, "keywords": ["code-graph.sqlite is at the documented path", "no legacy database files", "canonical sqlite path check"]},
    "TYPESCRIPT_ENTRY_POINT": {"weight": 5, "keywords": ["dist is built and the entry point exists", "tool-schemas module loads", "built entry point check"]},
    "UNICODE_DIST_CLEANUP": {"weight": 5, "keywords": ["does not recreate sibling dist folders", "root dist absence", "clean build dist cleanup"]},
    "CLI_FALLBACK_SURFACE": {"weight": 5, "keywords": ["cli enumerates 8 tools", "exits 75 warm-only against an absent daemon", "cli fallback surface"]},
    "QUERY_ASOF_TIME_TRAVEL": {"weight": 5, "keywords": ["as-of query parameter", "bitemporal-reads flag", "historical edge set"]},
    "QUERY_BM25_RESOLVER": {"weight": 5, "keywords": ["bm25 symbol resolver", "near-miss subject", "candidate symbols for disambiguation"]},
    "CONTEXT_EDGE_CONFIDENCE": {"weight": 5, "keywords": ["edge_confidence_differentiation", "calls confidence tiers", "flat 0.8 default"]},
    "CONTEXT_SEEDED_PPR": {"weight": 5, "keywords": ["seeded-ppr ranking", "multi-hop edgechain", "cut verdict"]},
}

# Intent -> exact leaf path(s). No prefixes, stems, or globs: every value is a
# concrete markdown leaf that exists in leaf-manifest.json (package indexes are
# intentionally absent — they live in PACKAGE_INDEXES). Two reference leaves are
# reused by more than one intent; 18 authorized leaves (13 feature slices + the
# 5 non-routing scenarios) stay intentionally unmapped and reachable only via
# PACKAGE_INDEXES or a full-inventory browse.
RESOURCE_MAP = {
    "TOOL_SURFACE": ["references/runtime/tool-surface.md"],
    "READINESS": ["references/readiness/code-graph-readiness-check.md"],
    "READINESS_SCOPE": ["references/readiness/readiness-and-scope-fingerprint.md"],
    "QUERY": ["references/runtime/tool-surface.md"],
    "SCAN_VERIFY": ["references/readiness/readiness-and-scope-fingerprint.md"],
    "CHANGE_DETECTION": ["feature-catalog/detect-changes/detect-changes-preflight.md"],
    "CONFIG": ["references/config/database-path-policy.md"],
    "NAMING": ["references/runtime/naming-conventions.md"],
    "OWNERSHIP": ["references/runtime/ownership-boundary.md"],
    "LAUNCHER": ["references/runtime/launcher-lease.md"],
    "CODE_INDEX_CLI": ["feature-catalog/mcp-tool-surface/code-index-cli.md"],
    "TOOL_REGISTRATIONS": ["feature-catalog/mcp-tool-surface/tool-registrations.md"],
    "QUERY_SELF_HEAL": ["feature-catalog/read-path-freshness/query-self-heal.md"],
    "CODE_GRAPH_CONTEXT": ["feature-catalog/context-retrieval/code-graph-context.md"],
    "ENSURE_READY_SELECTIVE_REINDEX": ["manual-testing-playbook/read-path-freshness/ensure-ready-selective-reindex.md"],
    "QUERY_SELF_HEAL_STALE_FILE": ["manual-testing-playbook/read-path-freshness/query-self-heal-stale-file.md"],
    "SCAN_INCREMENTAL": ["manual-testing-playbook/manual-scan-verify-status/code-graph-scan-incremental.md"],
    "SCAN_FULL": ["manual-testing-playbook/manual-scan-verify-status/code-graph-scan-full.md"],
    "VERIFY_BLOCKED_ON_STALE": ["manual-testing-playbook/manual-scan-verify-status/code-graph-verify-blocked-on-stale.md"],
    "STATUS_READONLY": ["manual-testing-playbook/manual-scan-verify-status/code-graph-status-readonly.md"],
    "DETECT_CHANGES_NO_INLINE_INDEX": ["manual-testing-playbook/detect-changes/detect-changes-no-inline-index.md"],
    "CONTEXT_READINESS_BLOCK": ["manual-testing-playbook/context-retrieval/code-graph-context-readiness-block.md"],
    "DEEP_LOOP_GRAPH_CONVERGENCE": ["manual-testing-playbook/coverage-graph/deep-loop-graph-convergence-yaml-fire.md"],
    "DEEP_LOOP_GRAPH_UPSERT": ["manual-testing-playbook/coverage-graph/deep-loop-graph-upsert-conditional.md"],
    "TOOL_CALL_SHAPE_VALIDATION": ["manual-testing-playbook/mcp-tool-surface/tool-call-shape-validation.md"],
    "DOCTOR_APPLY_MODE_POLICY": ["manual-testing-playbook/doctor-code-graph/doctor-apply-mode-policy.md"],
    "MCP_MANIFEST_POST_RENAME": ["manual-testing-playbook/mcp-tool-surface/mcp-tool-manifest-post-rename.md"],
    "LAUNCHER_STARTUP_PREFIX": ["manual-testing-playbook/post-rename-infrastructure/launcher-startup-prefix.md"],
    "MCP_SERVER_KEY_RENAME": ["manual-testing-playbook/post-rename-infrastructure/mcp-json-server-key-rename.md"],
    "DATABASE_PATH_VERIFICATION": ["manual-testing-playbook/post-rename-infrastructure/database-path-verification.md"],
    "TYPESCRIPT_ENTRY_POINT": ["manual-testing-playbook/post-rename-infrastructure/typescript-build-and-entry-point.md"],
    "UNICODE_DIST_CLEANUP": ["manual-testing-playbook/post-rename-infrastructure/unicode-normalization-fix-from-009.md"],
    "CLI_FALLBACK_SURFACE": ["manual-testing-playbook/mcp-tool-surface/code-index-cli-fallback-surface.md"],
    "QUERY_ASOF_TIME_TRAVEL": ["manual-testing-playbook/mcp-tool-surface/code-graph-query-asof-time-travel.md"],
    "QUERY_BM25_RESOLVER": ["manual-testing-playbook/mcp-tool-surface/code-graph-query-bm25-symbol-resolver.md"],
    "CONTEXT_EDGE_CONFIDENCE": ["manual-testing-playbook/context-retrieval/code-graph-context-edge-confidence-differentiation.md"],
    "CONTEXT_SEEDED_PPR": ["manual-testing-playbook/context-retrieval/code-graph-context-seeded-ppr-ranking.md"],
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

# Keep intents within the ambiguity delta of the top score (at most two). An
# exact scenario key (weight 5) beats any generic doc key (weight 3) by more
# than the delta, so a scenario request resolves to exactly its own leaf; a
# genuine tie between equally weighted keys still surfaces both.
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

### Tool Dispatch Contract

The router selects from these tool intents. `mcp-server/tool-schemas.ts` `CODE_GRAPH_TOOL_SCHEMAS` is the source of truth for the schemas themselves.

| Intent | Primary Surface | Reference |
|--------|-----------------|-----------|
| Index or refresh structural graph state | `mcp__mk_code_index__code_graph_scan` | `feature-catalog/manual-scan-verify-status/code-graph-scan.md` |
| Query callers, imports, dependencies, symbols or blast radius | `mcp__mk_code_index__code_graph_query` | `feature-catalog/read-path-freshness/query-self-heal.md` |
| Classify natural-language queries into structural/semantic/hybrid intent | `mcp__mk_code_index__code_graph_classify_query_intent` | `mcp-server/lib/query-intent-classifier.ts` |
| Build compact neighborhood context around seeds | `mcp__mk_code_index__code_graph_context` | `feature-catalog/context-retrieval/code-graph-context.md` |
| Check readiness, freshness, graph quality or blocked-read state | `mcp__mk_code_index__code_graph_status` | `feature-catalog/manual-scan-verify-status/code-graph-status.md` |
| Validate graph quality with gold queries | `mcp__mk_code_index__code_graph_verify` | `feature-catalog/manual-scan-verify-status/code-graph-verify.md` |
| Inspect changed symbols from a diff | `mcp__mk_code_index__detect_changes` | `feature-catalog/detect-changes/detect-changes-preflight.md` |
| Execute verification-gated apply-mode recovery operations | `mcp__mk_code_index__code_graph_apply` | `feature-catalog/doctor-code-graph/doctor-apply-mode.md` |
| Review doctor code-graph apply policy | `/doctor code-graph` | `feature-catalog/doctor-code-graph/doctor-apply-mode.md` |

The standalone MCP server name is `mk-code-index`. Tool IDs stay stable as `code_graph_*` and `detect_changes`.

The surface is dual-stack: every tool above is also callable through the full-parity daemon-backed CLI `node .opencode/bin/code-index.cjs <tool_name> [--json '{...}' | --param value]` against the same daemon (MCP registration unchanged). MCP remains the primary in-session transport today; use the CLI when MCP transport is missing, failed or not reconnecting while the daemon is warm, and for hooks, cron, CI and operator shell diagnostics. Recovery example: `node .opencode/bin/code-index.cjs code_graph_status --format json --timeout-ms 3000 --warm-only`. Flag values are coerced against the tool's input schema. Exit taxonomy: `0` success, `1` runtime, `64` usage/schema (including `detect_changes` `parse_error` on a malformed diff), `69` protocol/dist mismatch or stale dist, `75` retryable daemon error. Blocked-read rendering is preserved: a `status:"blocked"` readiness refusal exits `0` with the `requiredAction` surfaced — an actionable answer, not a failure. Prompt-time callers must pass `--warm-only` (probe-only; exit `75` on a cold daemon); other contexts auto-spawn via `mk-code-index-launcher.cjs`. Because this CLI already has full parity, a later evolution could make it the primary or sole transport without breaking existing MCP workflows; that is a possible direction, not a committed plan. `--format jsonl` renders one complete JSON payload on one stdout line; it is not streaming JSON Lines. Full cross-daemon CLI behavior, recovery, stale-dist build commands, per-command `--help`, offline smoke, and safety rules live in [`../system-spec-kit/references/cli/daemon-cli-reference.md`](../system-spec-kit/references/cli/daemon-cli-reference.md).

### Fallback Contract

- **Low confidence:** load default runtime/readiness references, emit `UNKNOWN_FALLBACK_CHECKLIST`, and ask for the missing tool/status/path signal.
- **Ambiguous intent scores:** load the top two resource domains and disclose the ambiguity instead of picking one silently.
- **Known intent/key with no resources:** return a "no knowledge base found" notice naming the missing intent and reference key.
- **Unclassifiable intent:** call `code_graph_classify_query_intent` first. If the classifier returns low confidence, ask for one concrete file path, symbol or error message before proceeding.
- **`mk_code_index` MCP unavailable:** if the daemon is warm, use the daemon-backed CLI recovery path documented above. If neither MCP nor the warm CLI path is available, report the state and stop. Structural queries do not fall back to text search because ambiguous text-search results mislead more than they help.
- **Graph not ready (`status` returns `blocked`, `empty`, or `trustState: absent`):** call `code_graph_scan` first, then retry. Never return a stale or empty graph result as if it were authoritative.

### Anti-Patterns

- Static reference inventories that miss newly moved docs.
- Empty keyword filters that return no paths instead of returning the unfiltered discovered resource list.
- Loading root compatibility stubs when canonical subfolder references exist.
- Compatibility stubs without `deprecated_at` and `remove_after` frontmatter, or any router target that points at a stub before the removal-window grep passes.
- Raw `load("references/file.md")` calls without `_guard_in_skill()`, inventory checks or duplicate suppression.
- Hardcoded tool lists in router code. Consult `mcp-server/tool-schemas.ts` `CODE_GRAPH_TOOL_SCHEMAS` as the source of truth.
- Using `code_graph_query` for unclassified queries. Classify intent first so the right tool runs.
- Treating `detect_changes` as a general query tool. It is diff-driven impact analysis with a fixed schema, not a query surface.

---

## 3. HOW IT WORKS

Runtime source lives under `mcp-server/{lib,handlers,tools,tests}/`. The package docs live under `feature-catalog/` and `manual-testing-playbook/`.

Read paths call `ensureCodeGraphReady()` before answering any structural query. The check enforces the false-safe contract: stale, empty, or scope-mismatched graphs return `blocked` with an explicit `requiredAction` rather than empty results. Manual maintenance tools run explicit scans, verification, status checks, and structural tool operations against the same readiness gate.

The deep-loop coverage graph tools remain in `system-spec-kit` because the research and review loop owns its state machine and the lifecycle of iteration packets. Code-graph stays focused on the structural index for everything else.

---

## 4. RULES

### ✅ ALWAYS

1. **ALWAYS register MCP tools under the standalone `mk-code-index` server.** Tool IDs (`code_graph_*`, `detect_changes`) are the stable surface contract.
2. **ALWAYS use the `mcp__mk_code_index__*` namespace** for MCP-side tool calls. Direct library consumers in `system-spec-kit` handlers and hooks use in-process imports through `system-spec-kit/mcp-server/lib/code-graph-boundary.ts`.
3. **ALWAYS check readiness before answering structural questions.** `code_graph_status` first; if `readiness !== "fresh"`, return the `blocked` payload from the tool rather than a stale result.
4. **ALWAYS treat `mcp-server/tool-schemas.ts` `CODE_GRAPH_TOOL_SCHEMAS` as the authoritative tool list.** Docs are documentation; the schema array is canonical.

### ⛔ NEVER

1. **NEVER move shared lifecycle, memory, or hook surfaces into `system-code-graph`.** Those belong in `system-spec-kit`. Only code-graph-owned docs and source live here.
2. **NEVER return a stale, empty, or scope-mismatched graph answer as if it were authoritative.** Read-path tools (`code_graph_query`, `code_graph_context`, `detect_changes`) refuse with `status: "blocked"` instead of false-safe empty results — preserve that contract end-to-end.
3. **NEVER fall back to text search when MCP is unavailable.** Structural queries must report the unavailable state and stop. Ambiguous text-search results mislead more than they help.
4. **NEVER hardcode tool lists or namespace prefixes in router or caller code.** Consult `tool-schemas.ts` at runtime; rely on the `mcp__mk_code_index__` prefix from MCP discovery.

### ⚠️ ESCALATE IF

1. **ESCALATE IF the scope fingerprint differs from the stored baseline** and the requested scan would replace an established graph without operator opt-in. Surface the fingerprint delta and ask for confirmation (`forceScopeChange: true`).
2. **ESCALATE IF readiness is `blocked` and the required action is destructive** (zero-node reset, full re-scan on a populated graph). Ask before issuing the destructive flag.
3. **ESCALATE IF the classifier returns low-confidence intent** on a high-stakes query (refactor preflight, blast-radius audit). Request one concrete file path, symbol, or error message before guessing.

---

## 5. REFERENCES

- `feature-catalog/feature-catalog.md` is the current runtime feature inventory.
- `manual-testing-playbook/manual-testing-playbook.md` is the operator validation package.
- `mcp-server/tool-schemas.ts` defines the `mk-code-index` code graph, detect-changes and structural schemas.
- `mcp-server/tools/code-graph-tools.ts` registers and dispatches the standalone tool IDs.

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
| `system-spec-kit` handlers / hooks / session surfaces | Direct in-process imports from `system-code-graph/mcp-server/lib/*` for shared readiness, startup, and context helpers via `system-spec-kit/mcp-server/lib/code-graph-boundary.ts`. |
| MCP callers (agents, commands, runtimes) | Standalone `mk-code-index` MCP namespace: `mcp__mk_code_index__code_graph_*` and `mcp__mk_code_index__detect_changes`. |
| CLI callers (hooks, scripts, CI, transport-down recovery) | Daemon-backed `node .opencode/bin/code-index.cjs <tool>` over the same daemon. The Claude/OpenCode hook adapters fall back through `system-spec-kit/mcp-server/hooks/code-index-cli-fallback.ts` (warm-only), and the OpenCode plugin bridge (`mcp-server/plugin-bridges/mk-code-graph-bridge.mjs`) routes through the CLI with `SPECKIT_CODE_INDEX_CLI_PROMPT_TIME=1`. |

The shared SQLite file at `.opencode/skills/system-code-graph/mcp-server/database/code-graph.sqlite` remains the coordination boundary. The scan loop is the single writer.

**Naming asymmetries.** Five identifiers refer to this skill across runtime layers — skill folder slug (`system-code-graph`), MCP server name (`mk-code-index`), MCP config key (`mk_code_index`), launcher / plugin file names, and the shared data directory. Each is correct in its own scope. See [`references/runtime/naming-conventions.md`](references/runtime/naming-conventions.md) for the full map plus the rationale for the hook-location asymmetry (hooks remain under `system-spec-kit/mcp-server/hooks/`).

---

## 8. REFERENCES AND RELATED RESOURCES

### Core references (this skill)

- [`references/runtime/tool-surface.md`](references/runtime/tool-surface.md) — 8 MCP tools mapped to handler files, primary purpose, and preconditions.
- [`references/readiness/readiness-and-scope-fingerprint.md`](references/readiness/readiness-and-scope-fingerprint.md) — readiness state machine (`fresh`/`stale`/`empty`/`error` freshness, plus the `blocked` read decision and `absent` trust projection) and the scan-scope fingerprint contract.
- [`references/readiness/code-graph-readiness-check.md`](references/readiness/code-graph-readiness-check.md) — `ensureCodeGraphReady()` gates, preconditions, recovery procedures.
- [`references/config/database-path-policy.md`](references/config/database-path-policy.md) — canonical database path policy and override rules.
- [`references/runtime/naming-conventions.md`](references/runtime/naming-conventions.md) — name map across skill folder, MCP server, launcher, plugin bridge, and hook location.
- [`references/runtime/ownership-boundary.md`](references/runtime/ownership-boundary.md) — what stays in `system-spec-kit` vs `system-code-graph` after extraction.
- [`references/runtime/launcher-lease.md`](references/runtime/launcher-lease.md) — PID-file lease contract for the launcher single-writer path.

### Cross-skill references

- Shared lifecycle and context docs that stayed in `system-spec-kit`: `.opencode/skills/system-spec-kit/feature-catalog/context-preservation/`
- Extraction history: internal migration notes
- Latest uplift context: internal implementation notes
