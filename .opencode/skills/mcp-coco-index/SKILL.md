---
name: mcp-coco-index
description: "Semantic code search via vector embeddings. Natural-language discovery of code, patterns, implementations. CLI + MCP search."
allowed-tools: [Bash, Read, Grep, Glob]
version: 1.2.0
---

<!-- Keywords: cocoindex-code, semantic-search, vector-embeddings, code-search, mcp-server, ccc, codebase-indexing, voyage-code-3, embeddinggemma-300m, hybrid-search, bm25, fts5, rrf-fusion, cross-encoder-reranker, jina-embeddings-v3 -->

# CocoIndex Code - Semantic Code Search via Vector Embeddings

Natural language code search through two complementary approaches: CLI (ccc) for speed and one-off queries, MCP server tools (`search`, `cocoindex_refresh_index`) for AI agent integration via stdio transport.

## 1. WHEN TO USE

> **Forked From**: This skill bundles a soft-fork of [cocoindex-code](https://github.com/cocoindex-io/cocoindex-code) (Apache 2.0). Upstream version forked: 0.2.3. Current fork version: 0.2.3+spec-kit-fork.0.2.0. Patches: REQ-001..006 (mirror dedup + path-class reranking) from the spec packet at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/003-mcp-runtime-stress-remediation/004-cocoindex-overfetch-dedup/` (currently numbered `004`; tracked as `009` during research and in commit history). See NOTICE and changelog/CHANGELOG.md for the full attribution and modification list.

> **v1.2.0 retrieval-quality features (opt-in, default OFF)**: Hybrid search (SQLite FTS5 + RRF fusion) and cross-encoder rerank (GTE multilingual) are env-flag enabled and mirror the proven retrieval stack used by `mk-spec-memory`. Production search behavior is unchanged unless `COCOINDEX_HYBRID=1` or `COCOINDEX_RERANK=1` is set. Chunking defaults were also retuned (CHUNK_SIZE 1000 → 1500) for better function-boundary preservation. See [INSTALL_GUIDE.md §4 "Tuning + optional retrieval features"](INSTALL_GUIDE.md) for the full env-var matrix.

### Activation Triggers

**Use when**:
- User asks to "find code that does X" or "search for implementations of Y"
- User needs to discover code by concept or intent rather than exact text
- User wants to find similar code patterns across the codebase
- Grep/Glob exact matching is insufficient and fuzzy or semantic matching is needed
- User mentions "semantic search", "code search", "find similar code"
- User needs to locate logic handling a specific concern (e.g., "where is the retry logic")
- User wants to understand how a concept is implemented across multiple files
- User asks "how is X implemented" or "what handles Y"
- User wants to understand architecture or module relationships
- Starting work on an unfamiliar part of the codebase (onboarding queries)
- @context agent is exploring code structure and needs concept-based discovery
- Any exploration task where the exact function/class name is unknown

**Automatic Triggers**:
- "semantic search", "find code that", "search for implementations"
- "similar code", "code that handles", "where is the logic for"
- "cocoindex", "ccc", "vector search"
- "find similar", "code search", "search codebase"
- "how is", "what handles", "where does", "understand the"
- "explore", "architecture", "module relationships"
- "onboarding", "unfamiliar code", "new to this"

### When NOT to Use

**Do not use for**:
- Exact text or regex search (use Grep instead)
- File name or path search (use Glob instead)
- Reading known files (use Read instead)
- The codebase has not been indexed yet (run `ccc index` first)
- Simple string matching where the exact token is known
- Non-code files (semantic search is optimized for source code)

## Canonical Resource Paths

Some paths in the workspace are EXPLICITLY canonical — official authoring checklists, recipes, and skill references that should always be ingested AND should outrank generic matches. mcp-coco-index ships with a default `CANONICAL_RESOURCE_PATHS` list and a per-project `canonical_resource_paths` setting.

### Default Canonical Patterns (mcp-coco-index 1.1.0+)

| Pattern | Why |
|---|---|
| `.opencode/skills/*/assets/opencode/**` | sk-code OpenCode authoring checklists + recipes (sk-code v3.2.0.0+) |
| `.opencode/skills/*/assets/<library>/**` | Library-specific assets (sk-code v3.1.0.0+) |
| `.opencode/skills/*/references/**` | Skill reference docs (broadly canonical) |

### Behavior

1. **Bypass exclusion**: A path matching `canonical_resource_paths` is ALWAYS ingested even if matched by `exclude_patterns` (specifically `**/.*` hidden-directory exclusion).
2. **Rank boost**: In `_ranked_result`, canonical paths receive a +0.10 score boost and emit a `canonical_resource_boost` ranking_signal.

### Opt-in / Opt-out

Override via `ccc_settings.yaml` `project.canonical_resource_paths`:
- Empty list `[]` opts out entirely (no canonical bypass, no rank boost).
- Add patterns to extend the default set.
- Replace the default list to scope canonical handling to specific projects.

This contract is the indexing-layer counterpart to system-spec-kit/SKILL.md §17 cross-skill authoring-time load and sk-code/SKILL.md "Cross-Skill Consumption" block (packet 078/002).

---

## 2. SMART ROUTING


### Resource Loading Levels

| Level       | When to Load             | Resources                                   |
| ----------- | ------------------------ | ------------------------------------------- |
| ALWAYS      | Every skill invocation   | references/tool_reference.md                |
| CONDITIONAL | If intent signals match  | references/search_patterns.md, references/cross_cli_playbook.md |
| ON_DEMAND   | Only on explicit request | Full troubleshooting and configuration docs |

### Smart Router Pseudocode

The authoritative routing logic for scoped loading, weighted intent scoring, and ambiguity handling.

- Pattern 1: Runtime Discovery - `discover_markdown_resources()` recursively inventories `references/` and `assets/`.
- Pattern 2: Existence-Check Before Load - `load_if_available()` uses `_guard_in_skill()`, `inventory`, and `seen`.
- Pattern 3: Extensible Routing Key - intent labels select search, index, setup, status, and cross-CLI guidance.
- Pattern 4: Multi-Tier Graceful Fallback - `UNKNOWN_FALLBACK` requests search/index disambiguation and missing intent routes return a "no knowledge base" notice.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/tool_reference.md"

INTENT_SIGNALS = {
    "SEARCH": {"weight": 4, "keywords": ["search", "find", "where", "similar", "semantic", "code that"]},
    "INDEX": {"weight": 4, "keywords": ["index", "reindex", "update index", "build index", "refresh"]},
    "INSTALL": {"weight": 4, "keywords": ["install", "setup", "configure", "ccc not found"]},
    "STATUS": {"weight": 3, "keywords": ["status", "stats", "how many files", "indexed"]},
    "TROUBLESHOOT": {"weight": 3, "keywords": ["error", "failed", "not working", "empty results"]},
    "CROSS_CLI": {"weight": 3, "keywords": ["copilot", "gemini", "claude", "codex", "cross cli", "multi query"]},
    "CONCURRENCY": {"weight": 3, "keywords": ["refresh_index", "concurrency", "concurrent", "follow-up query"]},
}

RESOURCE_MAP = {
    "SEARCH": ["references/search_patterns.md", "references/cross_cli_playbook.md", "references/tool_reference.md"],
    "INDEX": ["references/tool_reference.md"],
    "INSTALL": ["references/tool_reference.md"],
    "STATUS": ["references/tool_reference.md"],
    "TROUBLESHOOT": ["references/tool_reference.md", "references/cross_cli_playbook.md", "references/search_patterns.md"],
    "CROSS_CLI": ["references/cross_cli_playbook.md", "references/tool_reference.md"],
    "CONCURRENCY": ["references/cross_cli_playbook.md", "references/tool_reference.md"],
}

LOADING_LEVELS = {
    "ALWAYS": [DEFAULT_RESOURCE],
    "ON_DEMAND_KEYWORDS": ["full troubleshooting", "all commands", "configuration guide", "cross cli playbook", "semantic code search", "semantic search", "vector-search blending", "before grep", "find code that"],
    "ON_DEMAND": ["references/tool_reference.md", "references/search_patterns.md", "references/cross_cli_playbook.md"],
}

def _task_text(task) -> str:
    parts = [
        str(getattr(task, "text", "")),
        str(getattr(task, "query", "")),
        " ".join(getattr(task, "keywords", []) or []),
    ]
    return " ".join(parts).lower()

def _guard_in_skill(relative_path: str) -> str:
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)
    if resolved.suffix.lower() != ".md":
        raise ValueError(f"Only markdown resources are routable: {relative_path}")
    return resolved.relative_to(SKILL_ROOT).as_posix()

def discover_markdown_resources() -> set[str]:
    docs = []
    for base in RESOURCE_BASES:
        if base.exists():
            docs.extend(p for p in base.rglob("*.md") if p.is_file())
    return {doc.relative_to(SKILL_ROOT).as_posix() for doc in docs}

def score_intents(task) -> dict[str, float]:
    """Weighted intent scoring from request text and routing signals."""
    text = _task_text(task)
    scores = {intent: 0.0 for intent in INTENT_SIGNALS}
    for intent, cfg in INTENT_SIGNALS.items():
        for keyword in cfg["keywords"]:
            if keyword in text:
                scores[intent] += cfg["weight"]
    if getattr(task, "has_error", False):
        scores["TROUBLESHOOT"] += 4
    if getattr(task, "index_missing", False):
        scores["INDEX"] += 5
    return scores

def select_intents(scores: dict[str, float], ambiguity_delta: float = 1.0, max_intents: int = 2) -> list[str]:
    ranked = sorted(scores.items(), key=lambda item: item[1], reverse=True)
    if not ranked or ranked[0][1] <= 0:
        return ["SEARCH"]
    selected = [ranked[0][0]]
    if len(ranked) > 1 and ranked[1][1] > 0 and (ranked[0][1] - ranked[1][1]) <= ambiguity_delta:
        selected.append(ranked[1][0])
    return selected[:max_intents]

def route_cocoindex_code_resources(task):
    inventory = discover_markdown_resources()
    scores = score_intents(task)
    intents = select_intents(scores, ambiguity_delta=1.0)
    loaded = []
    seen = set()

    def load_if_available(relative_path: str) -> None:
        guarded = _guard_in_skill(relative_path)
        if guarded in inventory and guarded not in seen:
            load(guarded)
            loaded.append(guarded)
            seen.add(guarded)

    for relative_path in LOADING_LEVELS["ALWAYS"]:
        load_if_available(relative_path)

    if max(scores.values() or [0]) < 0.5:
        return {
            "routing_key": "cocoindex-code",
            "intents": intents,
            "intent_scores": scores,
            "load_level": "UNKNOWN_FALLBACK",
            "needs_disambiguation": True,
            "disambiguation_checklist": ["Confirm search vs index/setup/status", "Confirm exact code-search goal", "Provide language/path filters if known"],
            "resources": loaded,
        }

    matched_intents = []
    for intent in intents:
        before_count = len(loaded)
        for relative_path in RESOURCE_MAP.get(intent, []):
            load_if_available(relative_path)
        if len(loaded) > before_count:
            matched_intents.append(intent)

    text = _task_text(task)
    if any(keyword in text for keyword in LOADING_LEVELS["ON_DEMAND_KEYWORDS"]):
        for relative_path in LOADING_LEVELS["ON_DEMAND"]:
            load_if_available(relative_path)

    if not loaded:
        load_if_available(DEFAULT_RESOURCE)

    result = {"routing_key": "cocoindex-code", "intents": intents, "intent_scores": scores, "resources": loaded}
    if not matched_intents:
        result["notice"] = f"No knowledge base found for intent(s): {', '.join(intents)}"
    return result
```

---

## 3. HOW IT WORKS

### Two Approaches

CocoIndex Code provides two access patterns for semantic code search:

1. **CLI (ccc)** - Direct terminal usage, fastest for one-off searches
2. **MCP server** - AI agent integration via `ccc mcp` (stdio mode)

### CLI Approach

Use `ccc status`, `ccc index`, `ccc search "query" --lang <language> --path "<glob>" --limit <n>`, and `ccc reset` only with explicit confirmation. If `ccc` is not on PATH, use `.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc`.

### MCP Approach

The MCP server exposes `search` and `cocoindex_refresh_index`. Index/status/reset operations remain CLI-only unless routed through the Spec Kit Memory `ccc_*` tools. `search` defaults `refresh_index=false`; call `cocoindex_refresh_index` when the codebase changed, or pass `refresh_index=true` for backward-compatible one-shot refresh-before-search behavior.

### MCP Tool Coverage

The MCP server exposes a SUBSET of CocoIndex Code's CLI surface. Maintenance operations (init, index, status, reset, daemon) are CLI-only by design -- they're operator-facing and should not be invoked by AI agents during automated workflows.

| Operation | CLI | MCP |
|---|---|---|
| `search` | ✓ (`ccc search`) | ✓ (`mcp__cocoindex_code__search`) |
| `refresh index` | ✓ (`ccc index`) | ✓ (`mcp__cocoindex_code__cocoindex_refresh_index`) |
| `index lifecycle` | ✓ (`ccc index`) | ✗ (operator-only) |
| `init` | ✓ (`ccc init`) | ✗ (operator-only) |
| `status` | ✓ (`ccc status`) | ✗ (operator-only) |
| `reset` | ✓ (`ccc reset`) | ✗ (operator-only) |
| `daemon` | ✓ (`ccc daemon`) | ✗ (operator-only) |

If you need to refresh the index from an AI agent, call `cocoindex_refresh_index()` explicitly. `search(refresh_index=true)` still works for backward compatibility, but the default search path no longer refreshes first.

This split is intentional: index lifecycle is operator territory, explicit refresh is a bounded AI-callable maintenance hook, and search should stay predictable by default.

### Embedding Models

CocoIndex Code defaults to local `jinaai/jina-embeddings-v2-base-code` (768d code-tuned, Metal/MPS auto-detected on Apple Silicon) and supports alternate embedding models configured via `~/.cocoindex_code/global_settings.yml` or the `COCOINDEX_CODE_EMBEDDING_MODEL` env var. Full vetted registry at `mcp_server/cocoindex_code/registered_embedders.py`; swap runbook in [INSTALL_GUIDE.md §4 "Choosing an embedder"](INSTALL_GUIDE.md). Default ratified per packet 018.

| Model | Type | Dimensions | API Key | Best For |
| ----- | ---- | ---------- | ------- | -------- |
| `jinaai/jina-embeddings-v2-base-code` | Local via sentence-transformers | 768 | None | **Default.** Code-tuned, multi-language, Metal-accelerated |
| `google/embeddinggemma-300m` | Local via sentence-transformers | 768 | None | Pre-018 baseline. Kept for benchmark comparisons |
| `nomic-ai/CodeRankEmbed` | Local via sentence-transformers | 768 | None | Alternative code-tuned. Python-leaning training data |
| `BAAI/bge-code-v1` | Local via sentence-transformers | 768 | None | Multilingual code coverage emphasis |
| `voyage/voyage-code-3` | Cloud via LiteLLM | 1024 | `VOYAGE_API_KEY` required | Cloud alternative requiring a rebuild |

**CRITICAL**: Changing the embedding model requires `ccc reset && ccc index` because different models produce vectors with different dimensions. Mixing dimensions corrupts the index.

See `references/settings_reference.md` for full configuration details.

### Root Path Discovery

CocoIndex Code resolves the project root in this order:

1. `COCOINDEX_CODE_ROOT_PATH` environment variable (explicit override)
2. Nearest parent directory containing `.cocoindex_code/` directory
3. Nearest parent directory with project markers (`.git`, `pyproject.toml`, `package.json`, `Cargo.toml`, `go.mod`)
4. Current working directory (fallback)

### Daemon Architecture

The CocoIndex Code daemon manages background indexing and serves search requests:

- **Auto-start**: Starts automatically on the first CLI or MCP command
- **Auto-restart**: Restarts on version mismatch or settings change
- **Multi-project**: ProjectRegistry supports multiple projects simultaneously
- **Background indexing**: Continues after client disconnect
- **Search during indexing**: Search waits for indexing to complete (streams `IndexWaitingNotice`)
- **IPC**: Binary msgpack over Unix socket (`~/.cocoindex_code/daemon.sock`)
- **Logs**: `~/.cocoindex_code/daemon.log`
- **PID file**: `~/.cocoindex_code/daemon.pid`

### How Indexing Works

Indexing scans project files, splits language-aware chunks, embeds each chunk with the configured model, stores vectors in SQLite, and searches by query-vector similarity with language/path filtering.

### Search Result Interpretation

Each result includes:
- **File path** - Location of the matching code
- **Chunk content** - The code fragment that matched
- **Similarity score** - Cosine similarity (0.0 to 1.0, higher is better; this is the post-rerank value, see fork-specific telemetry below)
- **Language** - Detected programming language
- **Line range** - Start and end lines within the file

Scores above 0.5 typically indicate strong semantic relevance. Always verify results with the Read tool since semantic search can surface false positives.

> **Fork-specific telemetry (skill bundles a soft-fork at `0.2.3+spec-kit-fork.0.2.0`).** Result rows carry seven additional fields that vanilla upstream cocoindex-code does NOT emit: `source_realpath` and `content_hash` (canonical chunk identity), `path_class` (taxonomy: implementation / tests / docs / spec_research / generated / vendor), `dedupedAliases` and `uniqueResultCount` (mirror-folder dedup signals), `raw_score` (pre-rerank score, preserved for audit), and `rankingSignals` (per-result rerank breakdown). Implementation-intent queries get a bounded `±0.05` rerank toward `path_class == implementation`. Full schema, types, examples, and reading guidance live in [`references/tool_reference.md` §7 Fork-Specific Output Telemetry](references/tool_reference.md#-7-fork-specific-output-telemetry); the canonical field-to-REQ mapping lives in [`changelog/CHANGELOG.md`](changelog/CHANGELOG.md).

---

## 4. RULES

### ✅ ALWAYS

**ALWAYS do these without asking:**

1. **ALWAYS check index status before searching**
   - Run `ccc status` before the first search in a session
   - Confirm files are indexed and the index is not stale

2. **ALWAYS use language filters when the target language is known**
   - `--lang typescript` narrows results and improves relevance
   - Reduces false positives from similar patterns in other languages

3. **ALWAYS use path filters to narrow scope**
   - `--path "src/**"` focuses on application code
   - Avoids noise from test files, vendor directories, or build output

4. **ALWAYS verify search results with the Read tool**
   - Semantic search can return false positives
   - Read the actual file to confirm the match before acting on it

5. **ALWAYS suggest reindexing if the codebase has changed significantly**
   - After major refactors, branch switches, or large merges
   - Run `ccc index` from the project root to refresh the index

6. **ALWAYS use the full binary path if ccc is not on PATH**
   - `.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc`

7. **ALWAYS use the helper scripts when readiness is unclear**
   - `bash .opencode/skills/mcp-coco-index/scripts/doctor.sh --strict --require-config`
   - `bash .opencode/skills/mcp-coco-index/scripts/ensure_ready.sh --strict --require-config`

### Query Optimization

Use short, focused 2-5 word concept queries. Add language/path filters to narrow scope instead of stuffing more keywords into one query. Run multiple focused searches for broad investigations.

### Concurrent Query Sessions

When sending multiple searches in sequence (e.g., exploring a codebase):
- Keep searches on the default `refresh_index=false` path after any explicit refresh
- Call `cocoindex_refresh_index` once before the search batch when code changed
- The daemon has a known concurrency issue where simultaneous `refresh_index=true` requests can cause `ComponentContext` errors
- CLI equivalent: queries are sequential by nature, so this only applies to MCP usage

### ❌ NEVER

**NEVER do these:**

1. **NEVER assume semantic search is 100% accurate**
   - Vector similarity is approximate, not exact
   - Always cross-reference results with Grep for confirmation

2. **NEVER run `ccc reset` without user confirmation**
   - This destroys the entire index
   - Rebuilding requires a full reindex which takes time

3. **NEVER use semantic search for exact string matching**
   - Use Grep for known tokens, function names, or exact patterns
   - Semantic search is for conceptual or intent-based queries

4. **NEVER skip the index status check before first search**
   - An empty or missing index returns no results silently
   - Always verify with `ccc status` first

5. **NEVER ignore low similarity scores**
   - Results below 0.3 are likely noise
   - Focus on results above 0.5 for actionable matches

### ⚠️ ESCALATE IF

**Ask user when:**

1. **ESCALATE IF index is empty or missing**
   - Guide user through `ccc index` to build the initial index
   - Check if the binary is installed with `command -v ccc`

2. **ESCALATE IF search returns no results for reasonable queries**
   - Index may be stale - suggest `ccc index`
   - Query may need rephrasing with different terminology

3. **ESCALATE IF binary not found**
   - Run the install script: `bash .opencode/skills/mcp-coco-index/scripts/install.sh`
   - Verify Python 3.11+ is available

4. **ESCALATE IF index build fails**
   - Check Python version (requires 3.11+)
   - Check disk space for SQLite database
   - Review error output for missing dependencies

5. **ESCALATE IF results seem irrelevant despite high scores**
   - The embedding model may not capture domain-specific terminology well
   - Suggest combining semantic search with Grep for better coverage

---

## 5. REFERENCES

Attribution: upstream `cocoindex-io/cocoindex-code`, local license/notice/changelog files, and helper scripts under `scripts/`. The router discovers detailed references dynamically.

Companion recovery: use `/spec_kit:resume` first, then use CocoIndex when `handover.md -> _memory.continuity -> spec docs` cannot answer the question.

### Supported Languages

CocoIndex Code supports 28+ source/config languages with language-aware chunk splitting. Use `--lang` when the target language is known.

### Decision Tree

Exact token: Grep. File name/path: Glob. Concept or intent: CocoIndex.

---

## 6. SUCCESS CRITERIA

### Semantic Search Completion Checklist

**Search workflow complete when:**

- Index status verified (`ccc status` shows files indexed)
- Search returns relevant results for the natural language query
- Results verified via Read tool match the semantic intent
- Language and path filters applied where appropriate
- False positives identified and filtered out
- User receives actionable file paths and code locations

### Quality Targets

- **Search relevance**: Top 3 results contain at least one true match
- **Response time**: Search returns results within 5 seconds
- **Filter accuracy**: Language/path filters narrow results to target scope
- **Verification rate**: All suggested matches confirmed via Read tool

---

## 7. INTEGRATION POINTS

### Framework Integration

This skill operates within the behavioral framework defined in [AGENTS.md](../../../AGENTS.md).

Key integrations:
- **Gate 2**: Skill routing via `skill_advisor.py`
- **Tool Routing**: Per AGENTS.md Section 6 decision tree
- **Memory**: Context preserved via Spec Kit Memory MCP

### Complements Grep and Glob

Use CocoIndex to find candidate files by concept, Grep to confirm exact patterns, and Read to verify implementation details.

Tool usage: Bash for `ccc`, Read for result verification, Grep for exact confirmation, and Glob for file names.

---

## 8. REFERENCES AND RELATED RESOURCES

The router discovers reference, asset, and script docs dynamically. Start with `references/search_patterns.md`, `references/tool_reference.md`, `references/cross_cli_playbook.md`, `references/downstream_adoption_checklist.md`, `references/settings_reference.md`, `assets/config_templates.md`, then load task-specific resources from `references/`, templates from `assets/`, and automation from `scripts/` when present.

Scripts: `scripts/common.sh`, `scripts/doctor.sh`, `scripts/ensure_ready.sh`, `scripts/install.sh`, `scripts/update.sh`.

Related skills: `mcp-code-mode` for external MCP integrations and `system-spec-kit` for saving search findings into packet continuity.

Install guide: [INSTALL_GUIDE.md](INSTALL_GUIDE.md).
