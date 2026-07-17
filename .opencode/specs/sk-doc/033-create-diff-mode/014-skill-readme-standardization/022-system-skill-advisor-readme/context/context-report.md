# Context Report: system-skill-advisor README rewrite

Two-iteration by-model sweep (DeepSeek v4 Pro + MiMo v2.5 Pro, read-only). Both models read the SKILL.md, README, ARCHITECTURE, INSTALL_GUIDE, the references tree, the tool descriptors, the lane registry and the freshness contract, citing file:line evidence. They converge on the nine MCP tools, the five-lane scorer with its live weights, the four-value trust model and the boundary with system-spec-kit. They diverged on one point (the embedder manifest count), which the host resolved against source. This is a voice and structure rewrite that preserves accurate facts and corrects three small stale claims.

---

## 1. PURPOSE

`system-skill-advisor` is the standalone Gate 2 routing surface for Spec Kit. It scores a non-trivial prompt against indexed skill metadata, hook signals and a SQLite skill graph through a five-lane scorer, then returns calibrated, prompt-safe recommendations the runtime can trust. It runs as its own MCP server named `mk_skill_advisor` so routing can be tuned, restarted or rolled back without touching memory or code-graph systems.

## 2. PROBLEM

When a runtime meets an ambiguous prompt like "create a new agent", it has no safe automated way to pick the skill that should handle it. Guessing without calibrated confidence silently misroutes work, sending code to a doc skill or skipping the context a task needed. A routing index that has gone stale and answers anyway is worse than no answer, because it hands back a recommendation the runtime trusts while hiding that the underlying skill metadata changed. Routing that runs inside prompt hooks also must never leak raw user text into logs. The advisor answers the "which skill" question with a score and an explicit trust state, redacts prompt content from everything it returns, and refuses to answer rather than fabricate when its state is stale or absent.

## 3. MODES & CAPABILITIES

- Five-lane scorer: fuses explicit author signals, lexical overlap, skill-graph causality, derived metadata and a semantic shadow lane into one calibrated score with per-lane attribution.
- Prompt-safe attribution: public responses report per-lane contribution and evidence labels, never raw prompt substrings, so hook telemetry is safe to log.
- Daemon-backed freshness: a watcher observes every `SKILL.md` and `graph-metadata.json`, bumps a generation counter on change and invalidates the recommendation cache. The daemon does not rebuild on its own.
- Trust-state vocabulary: every response carries `live`, `stale`, `absent` or `unavailable` so a caller knows whether to use, caveat or fall back.
- SQLite skill graph with auto-propagated enhances: cross-skill edges live in a package-local database, and a trusted-caller tool proposes missing inbound `enhances` declarations.
- Multi-runtime hooks: prompt-submit hooks for Claude, Codex, Gemini and Devin, plus an OpenCode plugin bridge, all sharing the prompt-safe output contract.
- Python compatibility shim: `skill_advisor.py` probes the native MCP path first and falls back to local scoring so scripts and hooks keep working when the server is unreachable.
- Standalone process boundary: the advisor runs as its own MCP server, so a routing failure does not cascade into memory or code-graph runtimes.

## 4. THE TOOLS (verified, 9 via mk_skill_advisor)

The MCP server is `mk_skill_advisor` and the tools namespace as `mcp__mk_skill_advisor__*`. Descriptors live in `mcp_server/tools/`. Nine tools, eight public plus one trusted-caller-gated internal tool:

| Tool | What it does |
|------|--------------|
| `advisor_recommend` | Recommend skills for a prompt. Options: `topK` (1 to 10), `includeAttribution`, `includeAbstainReasons` |
| `advisor_rebuild` | Rebuild the advisor index from checked-in metadata (`force` optional) |
| `advisor_status` | Report freshness, generation, trust state, lane weights and daemon info (`workspaceRoot` required) |
| `advisor_validate` | Run the corpus, holdout, parity, safety and latency bundle (`confirmHeavyRun: true` required) |
| `skill_graph_scan` | Index every `graph-metadata.json` into the SQLite skill graph |
| `skill_graph_query` | Traverse the graph (ten query types below) |
| `skill_graph_status` | Report graph health, counts and staleness |
| `skill_graph_validate` | Validate schema drift, broken edges, reciprocal symmetry and dependency cycles |
| `skill_graph_propagate_enhances` | Detect, propose or apply missing inbound `enhances` edges. Trusted-caller gated |

`skill_graph_query` query types (ten): `depends_on`, `dependents`, `enhances`, `enhanced_by`, `family_members`, `conflicts`, `transitive_path`, `hub_skills`, `orphans`, `subgraph`. Source: `mcp_server/tools/skill-graph-tools.ts`.

## 5. SCORER LANES & WEIGHTS (verified)

Source of truth: `mcp_server/lib/scorer/lane-registry.ts`. All five lanes are live.

| Lane | Live weight | Role |
|------|------------:|------|
| `explicit_author` | 0.42 | Author-declared skill ids and trigger metadata |
| `lexical` | 0.28 | Text overlap and lexical evidence |
| `graph_causal` | 0.13 | Skill graph relationships (depends_on, enhances) |
| `derived_generated` | 0.12 | Sanitized derived metadata from prior runs |
| `semantic_shadow` | 0.05 | Semantic embedding evidence, lowest fusion weight |

The README's existing weight table matches the registry exactly. Separate shadow weights (0.40 / 0.25 / 0.20 / 0.10 / 0.05) exist for the shadow projection. Live weights override via `SPECKIT_ADVISOR_LANE_WEIGHTS_JSON`, shadow via `SPECKIT_ADVISOR_LANE_SHADOW_WEIGHTS_JSON`.

## 6. FRESHNESS & TRUST CONTRACT (verified)

Canonical source: `references/runtime/freshness_contract.md`, implemented in `mcp_server/lib/freshness/`.

| Trust state | Meaning | Caller action |
|-------------|---------|---------------|
| `live` | Index fresh, sources unchanged since the last build | Use the recommendation directly |
| `stale` | Queryable, but a watched source changed | Use with caveat, then `advisor_rebuild` |
| `absent` | The SQLite database is missing | `advisor_rebuild`. Do not act on an empty result |
| `unavailable` | The subsystem cannot be reached | Fall back to the Python shim or keyword matching against `trigger_phrases` |

A daemon watches `.opencode/skills/*/SKILL.md` and `graph-metadata.json`, recomputes a source-hash signature on change, bumps a generation counter and invalidates the cache. It holds a single-writer lease and does not auto-rebuild. Only `advisor_rebuild` mutates the SQLite database. The advisor_validate baselines are corpus top-1 80.5% and holdout top-1 77.5% (`references/scoring/validation_baselines.md`).

## 7. KEY FILES (real, host-verified)

| Path | Role |
|------|------|
| `SKILL.md` | The runtime routing instructions, invariants and smart router |
| `ARCHITECTURE.md` | The package topology, the MCP surface and the decision records |
| `INSTALL_GUIDE.md` | Bootstrap, runtime hooks, rollback and embedder selection (§12) |
| `references/scoring/` | The scorer lanes, the lane-weight change workflow and the validation baselines |
| `references/graph/` | The query cookbook, drift reconciliation, extraction history and enhances propagation |
| `references/runtime/` | The standalone MCP shape, tool ids, freshness contract and daemon lease |
| `references/hooks/` | The prompt-time hook contract across runtimes |
| `hooks/claude/`, `hooks/codex/`, `hooks/gemini/`, `hooks/devin/` | Per-runtime prompt-submit hooks |
| `mcp_server/lib/scorer/lane-registry.ts` | The source of truth for the five lanes and their weights |
| `mcp_server/scripts/skill_advisor.py` | The Python compatibility shim (native probe, local fallback) |
| `mcp_server/database/` | The package-local SQLite skill graph and daemon lease |

## 8. BOUNDARIES

The advisor recommends a skill, it does not replace the target skill. Once it points at `sk-code`, `sk-doc`, `sk-git` or `mcp-code-mode`, that skill does the work. Memory, spec folders and continuity stay in `system-spec-kit`. Structural code search (callers, imports, blast radius) stays in `system-code-graph`. The advisor's only dependency on `system-spec-kit` is the shared embeddings stack (`@spec-kit/shared/embeddings/`) that powers the `semantic_shadow` lane and the IPC bridge (`@spec-kit/shared/ipc/socket-server.js`). All other code is isolated as of v0.2.0.

## 9. TROUBLESHOOTING & FAQ MATERIAL

- `trustState: "stale"`: a watched source changed since the last build. Call `advisor_rebuild` with `force: true`.
- `trustState: "absent"`: the SQLite database is missing or empty. Call `advisor_rebuild`, then check `MK_SKILL_ADVISOR_DB_DIR` and disk permissions.
- `trustState: "unavailable"`: the native MCP path is unreachable. Verify `mk_skill_advisor` is in `opencode.json`, fall back to `skill_advisor.py`.
- Top-2 candidates within ~0.1 of each other: the prompt is ambiguous. Surface both instead of routing silently.
- `advisor_validate` corpus top-1 below 80.5%: scorer drift or fixture drift. Inspect `perSkill[]` and `slices.corpus`.
- A new skill is missing from recommendations: the daemon has not observed the file yet. Run `advisor_rebuild` or wait for the watcher.
- The Devin hook ignores `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1`: the Devin hook checks `MK_SKILL_ADVISOR_HOOK_DISABLED` first. Set that, or set both.
- FAQ: why the advisor is a separate MCP server, whether lane weights can change (yes, with measured evidence), how it stays safe to call from hooks, its relationship to system-spec-kit, and where the runtime hooks are documented.

## 10. STALE FACTS (host-resolved)

1. Embedder manifest count. The README §5 says the `MANIFESTS` registry holds "the single shipped manifest `nomic-embed-text-v1.5`". The host check of `INSTALL_GUIDE.md` §12.2 and the shared registry confirms seven text-tuned manifests are registered today, with `nomic-embed-text-v1.5` as the local-first cascade default. DeepSeek flagged this, MiMo missed it, the host resolved it against source. The rewrite drops the brittle count and describes a pluggable registry that defaults to a local model, pointing to INSTALL_GUIDE §12.
2. `advisor_recommend` options. The README §5 lists `topK` and `includeAttribution` but the live descriptor (`mcp_server/tools/advisor-recommend.ts`) also exposes `includeAbstainReasons`. The rewrite names all three or describes them as a set.
3. Changelog link. RELATED DOCUMENTS links only to `changelog/v0.2.0.md`. The rewrite links the `changelog/` directory so it does not pin one version.

Not a defect: the README states no version line. The narrative template intentionally omits version lines, so the rewrite keeps it absent. The lane weights, the nine tools, the trust vocabulary, the baselines, the env var names and every structure path check out against source.

## 11. METHODOLOGY

Two iterations, by-model shared scope (DeepSeek v4 Pro and MiMo v2.5 Pro, read-only, `--variant high`). Iteration 1 gathered purpose, capabilities, the tools and the key files. Iteration 2 verified the nine tool descriptors, the lane weights, the trust contract and the stale facts against the live source with file:line citations. The models converged on everything except the embedder manifest count, where the host check of the shared registry confirmed DeepSeek's reading. Converged before the three-iteration ceiling.
