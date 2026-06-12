---
title: system-skill-advisor
description: Standalone Gate 2 routing surface that picks the right skill for a non-trivial prompt with a calibrated, prompt-safe score the runtime can trust.
trigger_phrases:
  - "skill advisor"
  - "gate 2 routing"
  - "advisor_recommend"
  - "which skill should handle this"
  - "route this request"
---

# system-skill-advisor

> Pick the right skill for any prompt with a calibrated score you can trust, and refuse to answer when the routing index goes stale rather than fabricate a recommendation.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Deciding which skill should handle a non-trivial prompt with calibrated confidence |
| **Invoke with** | "which skill should handle this", "route this request", "advisor_recommend" or automatic Gate 2 routing |
| **Works on** | Non-trivial prompts, scored against indexed skill metadata and a SQLite skill graph |
| **Produces** | Ranked skill recommendations with per-lane attribution, a trust state and prompt-safe output |

---

## 2. OVERVIEW

### Why This Skill Exists

When a runtime meets an ambiguous prompt, guessing which skill to dispatch silently misroutes work. A routing index that answers while stale is worse than no answer. The runtime trusts the recommendation while the underlying metadata has changed, and no signal warns the caller. Hook code that echoes the user prompt into logs creates a privacy problem that scales with every invocation.

The advisor answers the "which skill" question with a calibrated score and an explicit trust state. It redacts raw prompt content from every response. When the index is stale or absent it refuses to answer rather than fabricate a recommendation the runtime would trust.

### What It Does

system-skill-advisor is the standalone Gate 2 routing surface for Spec Kit. It runs as its own MCP server, `mk_skill_advisor`, so routing can be tuned, restarted or rolled back without touching memory or code-graph systems. It fuses five scoring lanes into one calibrated recommendation, returns per-lane attribution without leaking prompt content and surfaces a trust state on every response so the caller knows whether to use the result, caveat it or fall back.

---

## 3. QUICK START

**Step 1: Check advisor health.**

```
mcp__mk_skill_advisor__advisor_status({ "workspaceRoot": "<repo-root>" })
```

Expected result: a payload with `freshness`, `generation`, `trustState`, lane weights and `skillCount`. A `trustState` of `live` means the index is fresh and you can trust the next recommendation.

**Step 2: Ask for a recommendation.**

```
mcp__mk_skill_advisor__advisor_recommend({ "prompt": "create a new agent" })
```

Expected result: a `recommendations[]` array of skill candidates ranked by score, with `freshness`, `trustState` and prompt-safe attribution metadata. Public responses never echo raw prompt content.

**Step 3: Rebuild when status reports stale or absent.**

```
mcp__mk_skill_advisor__advisor_rebuild({ "force": true })
```

Expected result: `rebuilt: true`, generation deltas, refreshed `skillCount` and diagnostics. Run only when `advisor_status` reports `stale` or `absent`.

### Gate 2 Caller Guidance

Use the MCP tools as the primary Gate 2 path when `mk_skill_advisor` is registered and reachable. Keep `mcp_server/scripts/skill_advisor.py` for legacy scripts and runtimes that still expect the Python facade's JSON-array output.

Use `.opencode/bin/skill-advisor.cjs` for daemon-backed runtime integrations such as hook fallback, doctor health checks and automation that needs explicit JSON plus exit codes. The CLI has full parity with the MCP surface: all 9 tools are reachable this way over the same daemon the MCP registration uses (dual-stack; the MCP registration is unchanged), and `list-tools` enumerates them offline. Exit taxonomy: `0` success, `1` runtime error, `64` usage/schema error, `69` protocol/dist mismatch, `75` retryable daemon error.

Two guardrails apply. First, prompt-time callers must probe the advisor IPC socket first (or pass `--warm-only`) and call the CLI only when the daemon is already warm; a cold daemon under warm-only exits `75` instead of cold-starting, and hooks fail open on that. Second, CLI calls are sent untrusted by default: the mutation tools `advisor_rebuild`, `skill_graph_scan` and apply-mode `skill_graph_propagate_enhances` require `--trusted` (or `MK_SKILL_ADVISOR_CLI_TRUSTED=1`), which is the maintainer path. Because the CLI already has full parity, a later evolution could make it the primary or sole transport without breaking existing MCP workflows; that is a possible direction, not a committed plan.

```bash
node .opencode/bin/skill-advisor.cjs advisor_status --workspace-root "$PWD" --format json
node .opencode/bin/skill-advisor.cjs advisor_rebuild --trusted --force true
```

---

## 4. HOW IT WORKS

### The Five-Lane Scorer

The advisor scores every prompt against five independent lanes, each producing its own evidence, then fuses them into one calibrated ranking. Public responses include per-lane contribution labels so hook telemetry stays safe to log without revealing the user's prompt text.

| Lane | Live Weight | Role |
|---|---|---|
| `explicit_author` | 0.42 | Author-declared skill ids and trigger metadata |
| `lexical` | 0.28 | Text overlap and lexical evidence |
| `graph_causal` | 0.13 | Skill graph relationships, including depends_on and enhances edges |
| `derived_generated` | 0.12 | Sanitized derived metadata from prior runs |
| `semantic_shadow` | 0.05 | Semantic embedding evidence, lowest fusion weight |

The lane weights live in `mcp_server/lib/scorer/lane-registry.ts`. The scorer reads `SPECKIT_ADVISOR_LANE_WEIGHTS_JSON`, and the launcher allowlist passes it through to the daemon child (an env change needs a daemon restart to apply). Use it for experiments; durable tuning is editing `lane-registry.ts` with measured evidence. Run `advisor_validate` before and after the change, and ship the diff with doc updates across the feature catalog and the advisor scorer reference.

`advisor_recommend` accepts three options: `topK` sets how many candidates to return (1 to 10), `includeAttribution` adds per-lane score breakdowns and `includeAbstainReasons` surfaces why lower-ranked candidates were not selected. `advisor_validate` requires `confirmHeavyRun: true` because it executes the full corpus, holdout, parity, safety and latency bundle.

### Prompt-Safe Attribution

Every public response strips raw prompt content. Attribution is per-lane only. The same safety contract applies to all runtime hooks and to the Python compatibility shim, so hook telemetry and script output stay safe to log at any scale.

### Freshness and the Trust Contract

A daemon watches every `SKILL.md` and `graph-metadata.json` under `.opencode/skills/`. When a watched source changes, the daemon schedules an incremental reindex, publishes a fresh generation after the rebuild, and invalidates the recommendation cache. It still holds a single-writer lease; explicit trusted mutation paths remain `advisor_rebuild` and `skill_graph_scan`, and corrupt-database recovery may also move aside and recreate the database during lazy initialization.

Every response carries a trust state so the caller knows what to do next.

| Trust State | Meaning | Caller Action |
|---|---|---|
| `live` | Index is fresh and queryable | Use the recommendation directly |
| `stale` | Index is queryable but a source changed since the last build | Use with caveat, then call `advisor_rebuild` |
| `absent` | The SQLite database is missing | Call `advisor_rebuild`. Do not act on an empty result |
| `unavailable` | The subsystem cannot be reached | Fall back to `skill_advisor.py` or keyword matching against frontmatter `trigger_phrases` |

### The SQLite Skill Graph

The advisor ships a package-local SQLite database that stores cross-skill edges extracted from every skill's `graph-metadata.json`. The graph supports ten query types through `skill_graph_query`: `depends_on`, `dependents`, `enhances`, `enhanced_by`, `family_members`, `conflicts`, `transitive_path`, `hub_skills`, `orphans` and `subgraph`. A trusted-caller tool, `skill_graph_propagate_enhances`, detects and proposes missing inbound `enhances` declarations across skills.

### Doc-Frontmatter Trigger Harvest (Flag-Gated)

With `SPECKIT_ADVISOR_DOC_TRIGGERS=true`, `skill_graph_scan` also harvests frontmatter (`title`, `description`, `trigger_phrases`, `importance_tier`, `contextType`) from every markdown file under each skill's `references/` and `assets/` (READMEs excluded) into a `skill_docs` table, and the watcher registers those docs so edits re-index the owning skill. Doc phrases score inside the `derived_generated` lane — top-3 docs per skill, tier-weighted, contribution capped at 0.45 — so they assist ranking but cannot hard-route alone. Matching recommendations carry an optional `matchedDocs` field (max 3 sanitized skill-relative paths) pointing at the exact doc to open. Flag unset (the default) changes nothing: no harvest, no watch targets, identical scoring. Deployment note: the launcher forwards only allowlisted env to the daemon child, so the flag works because it sits in `CHILD_ENV_ALLOWLIST` (`mk-skill-advisor-launcher.cjs`) — any future advisor env flag needs the same entry.

### The Embedder

The `semantic_shadow` lane runs against a pluggable embedder layer shared with `mk-spec-memory`. The registry holds text-tuned embedding models and defaults through a local-first cascade to a local model when no embedder is explicitly set. For the full model registry, the cascade tier table and the swap workflow, see `INSTALL_GUIDE.md` §12.

### The Nine Tools

The `mk_skill_advisor` server exposes nine tools under the `mcp__mk_skill_advisor__*` namespace, eight public plus one trusted-caller-gated internal tool. You have already met the first three in Quick Start.

| Tool | Purpose |
|---|---|
| `advisor_recommend` | Recommend skills for a prompt (`topK`, `includeAttribution`, `includeAbstainReasons`) |
| `advisor_rebuild` | Rebuild the advisor index from checked-in metadata |
| `advisor_status` | Report freshness, generation, trust state, lane weights and daemon info |
| `advisor_validate` | Run the corpus, holdout, parity, safety and latency bundle (`confirmHeavyRun: true` required) |
| `skill_graph_scan` | Index every `graph-metadata.json` into the SQLite skill graph |
| `skill_graph_query` | Traverse the skill graph (the ten query types above) |
| `skill_graph_status` | Report graph health, counts and staleness |
| `skill_graph_validate` | Validate schema drift, broken edges, reciprocal symmetry and dependency cycles |
| `skill_graph_propagate_enhances` | Detect, propose or apply missing inbound `enhances` edges (trusted-caller gated) |

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for the advisor when a runtime needs to pick a skill for a non-trivial prompt and guessing is not safe. The advisor answers the question and gets out of the way. It does not own the work the target skill performs.

Skip the advisor for trivial queries where the intent is obvious, for structural code search where `system-code-graph` owns the answer and for spec-folder operations where `system-spec-kit` handles memory, continuity and validation.

### Related Skills

| Skill | Relationship |
|---|---|
| `system-spec-kit` | Owns memory, spec folders and continuity. The advisor depends on it for the shared embeddings stack and the IPC bridge. All other code is isolated. |
| `system-code-graph` | Owns structural code search: callers, imports, blast radius. The advisor does not search code. |
| `sk-code`, `sk-doc`, `sk-git`, `mcp-code-mode` | Target skills the advisor recommends. Once the advisor points at one, that skill owns the work. |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| `trustState: "stale"` | A watched source changed since the last index build | Call `advisor_rebuild` with `force: true` |
| `trustState: "absent"` | The advisor SQLite database is missing or empty | Call `advisor_rebuild`. If that fails, check `MK_SKILL_ADVISOR_DB_DIR` and disk permissions |
| `trustState: "unavailable"` | The native MCP path cannot be reached | Verify `mk_skill_advisor` is registered in `opencode.json`. Fall back to `skill_advisor.py` |
| Top-2 candidates within 0.1 of each other | Ambiguous prompt. Two skills are equally plausible | Surface both candidates instead of routing silently |
| `advisor_validate` corpus top-1 below 80.5% | Scorer behavior changed or fixtures drifted | Inspect `perSkill[]` and `slices.corpus` |
| Recommendations omit a newly-added skill | The daemon has not observed the new file yet | Call `advisor_rebuild` or wait for the watcher to fire |
| CLI reports a mutation `requires --trusted` (exit 64) | The trusted-mutation gate fails closed on untrusted calls | Re-run with `--trusted` or set `MK_SKILL_ADVISOR_CLI_TRUSTED=1` if you are the maintainer |
| A native MCP mutation is rejected as untrusted | The daemon fails closed when transport `_meta` is absent | Verify `MK_SKILL_ADVISOR_TRUST_DEFAULT=trusted` is set in the MCP registration env block (it cannot be forged by callers) |

---

## 7. FAQ

**Q: Why is the advisor a separate MCP server?**

A: Routing is operationally distinct from memory. You can roll back, restart or tune the advisor without touching memory state. The standalone server boundary makes that safe.

**Q: Can I change the lane weights?**

A: Yes, with measured evidence. `SPECKIT_ADVISOR_LANE_WEIGHTS_JSON` is allowlisted through the launcher for experiments (daemon restart required); the durable path is a source edit in `mcp_server/lib/scorer/lane-registry.ts`. Run `advisor_validate` to capture a baseline, change the weights, re-run validate and ship the diff with doc updates in `references/scoring/advisor_scorer.md` and the feature catalog.

**Q: How does the advisor stay safe to call from hooks?**

A: Responses redact raw prompt content. Attribution is per-lane only. Every runtime hook and the Python compatibility shim follow the same redaction contract, so telemetry stays safe at any call volume.

**Q: What is the relationship to system-spec-kit?**

A: Memory, spec folders and continuity stay in `system-spec-kit`. The advisor depends on it for the shared embeddings stack and the IPC bridge. All other code is isolated.

**Q: Where are the runtime hooks documented?**

A: `references/hooks/skill_advisor_hook.md` covers the prompt-time hook contract across Claude, Codex and the OpenCode plugin bridge. Per-runtime hook files live under `hooks/claude/` and `hooks/codex/`.

---

## 8. VERIFICATION

| Check | How to run it |
|---|---|
| README structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-skill-advisor/README.md --type readme` reports zero issues |
| TypeScript build | `npm --prefix .opencode/skills/system-skill-advisor/mcp_server run typecheck && npm --prefix .opencode/skills/system-skill-advisor/mcp_server run build` exits 0 |
| Playbook | Run the manual testing playbook scenarios under `manual_testing_playbook/` in a live session |
| Validation battery | `mcp__mk_skill_advisor__advisor_validate({ "confirmHeavyRun": true })` reports corpus top-1 at 80.5% and holdout top-1 at 77.5% |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime routing instructions, invariants and the smart router |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | System design, MCP surface, data flow and database layout |
| [`INSTALL_GUIDE.md`](./INSTALL_GUIDE.md) | Setup, runtime hooks, rollback and embedder selection |
| [`references/runtime/tool_ids_reference.md`](./references/runtime/tool_ids_reference.md) | All nine tool ids with inputs and output shapes |
| [`references/scoring/advisor_scorer.md`](./references/scoring/advisor_scorer.md) | Lane attribution model and fusion rules |
| [`references/scoring/lane_weight_tuning.md`](./references/scoring/lane_weight_tuning.md) | Evidence requirements for lane weight changes |
| [`references/scoring/validation_baselines.md`](./references/scoring/validation_baselines.md) | Validation baselines and troubleshooting |
| [`references/runtime/freshness_contract.md`](./references/runtime/freshness_contract.md) | Trust-state vocabulary and caller obligations |
| [`references/runtime/daemon_lease_contract.md`](./references/runtime/daemon_lease_contract.md) | Single-writer daemon lease semantics |
| [`references/runtime/standalone_mcp_shape.md`](./references/runtime/standalone_mcp_shape.md) | Standalone MCP topology |
| [`references/graph/skill_graph_query_cookbook.md`](./references/graph/skill_graph_query_cookbook.md) | Worked examples for all query types |
| [`references/graph/skill_graph_drift.md`](./references/graph/skill_graph_drift.md) | Detect and reconcile SQLite drift from source files |
| [`references/hooks/skill_advisor_hook.md`](./references/hooks/skill_advisor_hook.md) | Prompt-time hook contract across runtimes |
| [`feature_catalog/feature_catalog.md`](./feature_catalog/feature_catalog.md) | Current feature inventory |
| [`manual_testing_playbook/manual_testing_playbook.md`](./manual_testing_playbook/manual_testing_playbook.md) | Manual validation scenario index |
| [`changelog/`](./changelog/) | Versioned changelogs |
