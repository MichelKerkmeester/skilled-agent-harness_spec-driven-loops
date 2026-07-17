---
title: system-skill-advisor
description: Standalone Gate 2 routing that scores a non-trivial prompt against indexed skill metadata and a SQLite skill graph, returning calibrated recommendations the runtime can trust.
trigger_phrases:
  - "skill advisor"
  - "gate 2 routing"
  - "advisor_recommend"
  - "which skill should handle this"
  - "route this request"
---

# system-skill-advisor

> Pick the right skill for a prompt with a calibrated score, or refuse to answer when the index is stale.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Routing ambiguous prompts to the correct skill before execution begins |
| **Invoke with** | "which skill should handle this", "route this request" or auto-routing on Gate 2 keywords |
| **Works on** | Non-trivial prompts scored against skill metadata, hook signals and a SQLite skill graph |
| **Produces** | A ranked list of skill candidates with per-lane attribution and a trust state |

---

## 2. OVERVIEW

### Why This Skill Exists

When a runtime meets an ambiguous prompt like "create a new agent", it has no safe automated way to pick the skill that should handle it. Guessing without calibrated confidence silently misroutes work, sending code to a doc skill or skipping the context a task needed. A routing index that has gone stale and answers anyway is worse than no answer. It hands back a recommendation the runtime trusts while hiding that the underlying skill metadata changed. Routing that runs inside prompt hooks also must never leak raw user text into logs. The advisor answers the "which skill" question with a score and an explicit trust state, redacts prompt content from everything it returns and refuses to answer rather than fabricate when its state is stale or absent.

### What It Does

The advisor scores a prompt against indexed skill metadata through a five-lane scorer, consults a SQLite-backed skill graph and returns calibrated, prompt-safe recommendations. It runs as its own MCP server named `mk_skill_advisor` so you can install, tune or roll back routing without touching memory or code-graph systems. When the native MCP path is unreachable, a Python compatibility shim takes over and announces the degraded mode. The advisor recommends a skill. It does not replace the target skill. Once it points at `sk-code`, `sk-doc`, `sk-git` or `mcp-code-mode`, that skill does the work.

---

## 3. QUICK START

**Step 1: Check advisor health.**

```text
mcp__mk_skill_advisor__advisor_status({ "workspaceRoot": "/path/to/repo" })
```

Returns a payload with `freshness`, `generation`, `trustState` (one of `live`, `stale`, `absent`, `unavailable`), lane weights, daemon info and `skillCount`.

**Step 2: Ask for a recommendation.**

```text
mcp__mk_skill_advisor__advisor_recommend({
  "prompt": "create a new agent",
  "options": { "topK": 5, "includeAttribution": true, "includeAbstainReasons": true }
})
```

Returns a `recommendations[]` array of skill candidates ranked by score, with `freshness`, `trustState` and prompt-safe attribution metadata. The three options are `topK` (1 to 10), `includeAttribution` and `includeAbstainReasons`.

**Step 3: Rebuild when status reports stale or absent.**

```text
mcp__mk_skill_advisor__advisor_rebuild({ "force": true })
```

Returns `rebuilt: true`, generation deltas, refreshed `skillCount` and diagnostics. Run only when `advisor_status` requires it or after touching skill metadata files. Only this tool mutates the SQLite database.

---

## 4. HOW IT WORKS

### The Five-Lane Scorer

Every prompt passes through five lanes that fuse into a single calibrated score. Each lane contributes a weighted signal and the response includes per-lane attribution so you can see where the score came from.

| Lane | Live Weight | Role |
|---|---:|---|
| `explicit_author` | 0.42 | Author-declared skill ids and trigger metadata |
| `lexical` | 0.28 | Text overlap and lexical evidence |
| `graph_causal` | 0.13 | Skill graph relationships (depends_on, enhances) |
| `derived_generated` | 0.12 | Sanitized derived metadata from prior runs |
| `semantic_shadow` | 0.05 | Semantic embedding evidence |

Source of truth: `mcp_server/lib/scorer/lane-registry.ts`. Weights override via `SPECKIT_ADVISOR_LANE_WEIGHTS_JSON` for live weights and `SPECKIT_ADVISOR_LANE_SHADOW_WEIGHTS_JSON` for shadow weights.

The `semantic_shadow` lane runs against a pluggable embedder layer shared with `mk-spec-memory`. The embedder registry defaults through a local-first cascade to a local model. See [INSTALL_GUIDE.md §12](./INSTALL_GUIDE.md#12--choosing-an-embedder) for the model registry and swap workflow.

### Prompt-Safe Attribution

Public responses report per-lane contribution and evidence labels. They never echo raw prompt substrings. Hook adapters and the Python shim mirror the same redaction semantics, so hook telemetry is safe to log.

### Freshness and the Trust Contract

A daemon watches every `.opencode/skills/*/SKILL.md` and `graph-metadata.json`, recomputes a source-hash signature on change, bumps a generation counter and invalidates the recommendation cache. The daemon does not auto-rebuild. Only `advisor_rebuild` mutates the SQLite database.

Every response carries a trust state so the caller knows whether to act or fall back.

| Trust State | Meaning | Caller Action |
|---|---|---|
| `live` | Index fresh, sources unchanged since the last build | Use the recommendation directly |
| `stale` | Queryable, but a watched source changed | Use with caveat, then `advisor_rebuild` |
| `absent` | The SQLite database is missing | `advisor_rebuild`. Do not act on an empty result |
| `unavailable` | The subsystem cannot be reached | Fall back to the Python shim or keyword matching against `trigger_phrases` |

### The Skill Graph

Cross-skill edges live in a package-local SQLite database. You query it through `skill_graph_query` with ten query types: `depends_on`, `dependents`, `enhances`, `enhanced_by`, `family_members`, `conflicts`, `transitive_path`, `hub_skills`, `orphans` and `subgraph`. A trusted-caller tool, `skill_graph_propagate_enhances`, detects and proposes missing inbound `enhances` declarations across skills.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for the advisor when a runtime needs to pick a skill before execution, when an operator asks about Gate 2 routing or advisor tools, and when you need to inspect or rebuild the skill graph. Skip it for structural code search (callers, imports, blast radius), which belongs to `system-code-graph`. Skip it for memory, spec folders and continuity, which belong to `system-spec-kit`.

### Boundary With Target Skills

The advisor recommends a skill. The target skill does the work. Once routing lands on `sk-code`, `sk-doc`, `sk-git` or `mcp-code-mode`, that skill takes over with its own rules, references and verification.

### Boundary With system-spec-kit

Memory, spec folders and continuity stay in `system-spec-kit`. The advisor's only dependency on that package is the shared embeddings stack that powers the `semantic_shadow` lane and the IPC bridge re-exported from `@spec-kit/shared/ipc/socket-server.js`. All other code is isolated.

### Boundary With system-code-graph

Structural code search (callers, imports, blast radius) stays in `system-code-graph`. The advisor uses skill-graph relationships for routing, not code-graph traversal.

### MCP Tools

The `mk_skill_advisor` server exposes nine tools under the `mcp__mk_skill_advisor__*` namespace.

| Tool | Purpose |
|---|---|
| `advisor_recommend` | Recommend skills for a prompt |
| `advisor_rebuild` | Rebuild the advisor index from checked-in metadata |
| `advisor_status` | Report freshness, generation, trust state, lane weights and daemon info |
| `advisor_validate` | Run the corpus, holdout, parity, safety and latency bundle (`confirmHeavyRun: true` required) |
| `skill_graph_scan` | Index every `graph-metadata.json` into the SQLite skill graph |
| `skill_graph_query` | Traverse the skill graph (ten query types) |
| `skill_graph_status` | Report graph health, counts and staleness |
| `skill_graph_validate` | Validate schema drift, broken edges, reciprocal symmetry and dependency cycles |
| `skill_graph_propagate_enhances` | Detect, propose or apply missing inbound `enhances` edges (trusted-caller gated) |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| `trustState: "stale"` | A watched source changed since the last build | Call `advisor_rebuild` with `force: true` |
| `trustState: "absent"` | The SQLite database is missing or empty | Call `advisor_rebuild`. Check `MK_SKILL_ADVISOR_DB_DIR` and disk permissions |
| `trustState: "unavailable"` | The native MCP path is unreachable | Verify `mk_skill_advisor` is in `opencode.json`. Fall back to `skill_advisor.py` |
| Top-2 candidates within ~0.1 of each other | The prompt is ambiguous | Surface both candidates instead of routing silently |
| `advisor_validate` corpus top-1 below 80.5% | Scorer drift or fixture drift | Inspect `perSkill[]` and `slices.corpus` to identify regressed skills |
| A new skill missing from recommendations | The daemon has not observed the file yet | Call `advisor_rebuild` or wait for the watcher |
| Devin hook ignores `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` | Devin checks `MK_SKILL_ADVISOR_HOOK_DISABLED` first | Set `MK_SKILL_ADVISOR_HOOK_DISABLED=1` or set both |

---

## 7. FAQ

**Q: Why is the advisor a separate MCP server instead of part of `mk-spec-memory`?**

A: Routing is operationally distinct from memory. You may need to roll back, restart or tune the advisor without touching memory state. The standalone server boundary makes that safe.

**Q: Can I change the lane weights?**

A: Yes, with measured evidence. The advisor exposes `advisor_validate` for corpus, holdout, parity, safety and latency slices. Run a baseline, change weights in `lib/scorer/lane-registry.ts`, re-run validate and ship the diff with doc updates in `references/scoring/advisor_scorer.md`.

**Q: How does the advisor stay safe to call from hooks?**

A: Responses redact raw prompt content. Attribution is per-lane only. Hook adapters scope write permissions tightly, and the Python shim mirrors the same redaction semantics.

**Q: Where do I learn about the runtime hooks?**

A: See [references/hooks/skill_advisor_hook.md](./references/hooks/skill_advisor_hook.md) for the prompt-time hook contract across Claude, Codex, Gemini, Devin and OpenCode.

---

## 8. VERIFICATION

| Check | How to run it |
|---|---|
| Typecheck | `npm --prefix .opencode/skills/system-skill-advisor/mcp_server run typecheck` exits `0` |
| Build | `npm --prefix .opencode/skills/system-skill-advisor/mcp_server run build` exits `0` |
| Validation bundle | `advisor_validate` with `confirmHeavyRun: true` reports corpus top-1 at 80.5% and holdout top-1 at 77.5% |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [SKILL.md](./SKILL.md) | Runtime instructions, the smart router and the full rule set |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System design, MCP surface, data flow and database layout |
| [INSTALL_GUIDE.md](./INSTALL_GUIDE.md) | Setup, runtime hooks, rollback and embedder selection (§12) |
| [references/scoring/advisor_scorer.md](./references/scoring/advisor_scorer.md) | Lane attribution model and fusion rules |
| [references/scoring/lane_weight_tuning.md](./references/scoring/lane_weight_tuning.md) | Evidence requirements for lane weight changes |
| [references/scoring/validation_baselines.md](./references/scoring/validation_baselines.md) | `advisor_validate` baselines and troubleshooting |
| [references/runtime/freshness_contract.md](./references/runtime/freshness_contract.md) | Trust-state vocabulary and caller obligations |
| [references/runtime/tool_ids_reference.md](./references/runtime/tool_ids_reference.md) | All nine tool ids with input and output schemas |
| [references/runtime/standalone_mcp_shape.md](./references/runtime/standalone_mcp_shape.md) | Standalone MCP topology |
| [references/hooks/skill_advisor_hook.md](./references/hooks/skill_advisor_hook.md) | Prompt-time hook behavior for the advisor package |
| [references/graph/skill_graph_query_cookbook.md](./references/graph/skill_graph_query_cookbook.md) | Worked examples for graph query types |
| [references/graph/propagate_enhances.md](./references/graph/propagate_enhances.md) | Cross-skill enhances auto-propagation contract |
| [changelog/](./changelog/) | Version history |
