---
title: "System Skill Advisor: Native Gate 2 Routing"
description: "Human-facing guide for the standalone system-skill-advisor skill, its mk_skill_advisor MCP server, scorer lanes, runtime hooks across Claude / Codex / Gemini / Devin / OpenCode plus operator workflows."
trigger_phrases:
  - "system skill advisor readme"
  - "skill advisor"
  - "mk_skill_advisor"
  - "advisor_recommend"
  - "gate 2 routing"
  - "skill advisor hook"
---

# System Skill Advisor

> Standalone Gate 2 routing for Spec Kit. Picks the right skill for a non-trivial prompt using a five-lane scorer, a SQLite-backed skill graph plus prompt-safe recommendations the runtime can trust.

<!-- sk-doc-template: skill_readme -->

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. QUICK START](#2--quick-start)
- [3. FEATURES](#3--features)
- [4. STRUCTURE](#4--structure)
- [5. CONFIGURATION](#5--configuration)
- [6. USAGE EXAMPLES](#6--usage-examples)
- [7. TROUBLESHOOTING](#7--troubleshooting)
- [8. FAQ](#8--faq)
- [9. RELATED DOCUMENTS](#9--related-documents)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

You use `system-skill-advisor` when a runtime needs to pick a skill for a non-trivial prompt. It scores the prompt against indexed skill metadata, hook signals plus graph-derived relations, then returns calibrated recommendations with attribution. The advisor runs as a standalone MCP server called `mk_skill_advisor` so you can install, tune or replace it without touching memory or code-graph systems.

Use this README for a human map of the skill. Use [SKILL.md](./SKILL.md) for runtime routing instructions and [ARCHITECTURE.md](./ARCHITECTURE.md) for system-level design.

### How This Compares

The advisor is the canonical Gate 2 routing surface. Call `advisor_recommend` to pick a skill for a prompt, `advisor_status` to inspect freshness and trust state, `advisor_rebuild` to refresh the index after metadata changes, and `advisor_validate` for release and regression validation. Query the skill graph (depends_on, dependents, enhances, conflicts, hubs, subgraph) through `skill_graph_query`. For other concerns the advisor is not the right surface: structural code search belongs to a separate code-graph skill, semantic code search belongs to a semantic-index skill, and spec-folder memory belongs to a separate memory runtime.

### Key Features

- **Five-lane scorer**. Fuses explicit author signals, lexical overlap, skill-graph causality, derived metadata, and a semantic shadow lane into a single calibrated score.
- **Prompt-safe attribution**. Returns per-lane contribution without echoing raw prompt content so hook output stays safe to log.
- **Daemon-backed freshness**. Watches `.opencode/skills/*/SKILL.md` and `graph-metadata.json` and rebuilds advisor state on change.
- **Trust-state vocabulary**. Reports `live`, `stale`, `absent` or `unavailable` so callers know when to act and when to fall back.
- **Skill graph with auto-propagated enhances**. Stores cross-skill edges in SQLite and proposes missing inbound `enhances` declarations through a trusted-caller tool.
- **Multi-runtime hooks**. Ships matching prompt-submit hooks for Claude, Codex, Gemini, Devin plus an OpenCode plugin.
- **Python compatibility shim**. `skill_advisor.py` keeps scripts and hooks working when the native MCP path is not reachable.
- **Standalone process boundary**. Runs as its own MCP server so you can stop, restart or roll back routing without touching adjacent runtimes.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:quick-start -->
## 2. QUICK START

**Step 1: Check advisor health.**

Call the standalone MCP server through the normalized namespace:

```text
mcp__mk_skill_advisor__advisor_status({})
```

Expected result: a payload with `freshness`, `generation`, `trustState`, lane weights, daemon info plus `skillCount`.

**Step 2: Ask for a recommendation.**

```text
mcp__mk_skill_advisor__advisor_recommend({ "prompt": "create a new agent" })
```

Expected result: a `recommendations[]` array of skill candidates ranked by score, plus `freshness`, `trustState` and prompt-safe attribution metadata.

**Step 3: Rebuild when status reports stale or absent.**

```text
mcp__mk_skill_advisor__advisor_rebuild({ "force": true })
```

Expected result: `rebuilt: true`, generation deltas, refreshed `skillCount`, plus diagnostics. Run only when `advisor_status` requires it or after touching skill metadata files.

**Step 4: Validate before changing behavior.**

```bash
npm --prefix .opencode/skills/system-skill-advisor/mcp_server run typecheck
npm --prefix .opencode/skills/system-skill-advisor/mcp_server run build
```

Expected result: TypeScript exits `0` and the package builds cleanly.

<!-- /ANCHOR:quick-start -->

---

<!-- ANCHOR:features -->
## 3. FEATURES

### 3.1 FEATURE HIGHLIGHTS

The advisor is strongest when intent is ambiguous. It answers "which skill should handle this?" with calibrated confidence instead of guessing. It surfaces ambiguity explicitly when two top candidates are within striking distance of each other. Public responses are prompt-safe by design so you can log them in hook telemetry without leaking user prompt content.

Routing is fail-open. When the native MCP path is unreachable the Python `skill_advisor.py` shim takes over and announces the degraded mode in its response. When freshness slips to `stale` or `absent` the advisor refuses to fabricate a recommendation and tells the caller what action to take.

### 3.2 TOOL REFERENCE

| Tool | Purpose | Primary Files |
|---|---|---|
| `advisor_recommend` | Recommend skills for a prompt using the native scorer. | `mcp_server/handlers/advisor-recommend.ts`, `mcp_server/lib/scorer/` |
| `advisor_rebuild` | Rebuild the native advisor skill graph from checked-in metadata. | `mcp_server/handlers/advisor-rebuild.ts`, `mcp_server/lib/freshness/` |
| `advisor_status` | Report advisor freshness, trust state, lane weights plus daemon info. | `mcp_server/handlers/advisor-status.ts`, `mcp_server/lib/daemon/` |
| `advisor_validate` | Run the corpus, holdout, parity, safety plus latency check bundle. | `mcp_server/handlers/advisor-validate.ts` |
| `skill_graph_scan` | Index every `graph-metadata.json` into the local SQLite skill graph. | `mcp_server/handlers/skill-graph/scan.ts`, `mcp_server/lib/skill-graph/` |
| `skill_graph_query` | Traverse the SQLite-backed skill graph. Supports `depends_on`, `dependents`, `enhances`, `enhanced_by`, `family_members`, `conflicts`, `transitive_path`, `hub_skills`, `orphans`, `subgraph`. | `mcp_server/handlers/skill-graph/query.ts` |
| `skill_graph_status` | Report skill graph health, counts plus staleness. | `mcp_server/handlers/skill-graph/status.ts` |
| `skill_graph_validate` | Validate the live skill graph for schema drift, broken edges, reciprocal symmetry, dependency cycles. | `mcp_server/handlers/skill-graph/validate.ts` |
| `skill_graph_propagate_enhances` (internal) | Detect, propose, optionally apply missing inbound `enhances` edges across skills. Trusted-caller gated. | `mcp_server/handlers/skill-graph/propagate-enhances.ts` |


### 3.3 SCORER LANES

| Lane | Live Weight | Role |
|---|---:|---|
| `explicit_author` | 0.42 | Author-declared skill ids and trigger metadata. |
| `lexical` | 0.28 | Text overlap and lexical evidence. |
| `graph_causal` | 0.13 | Skill graph relationships (depends_on, enhances). |
| `derived_generated` | 0.12 | Sanitized derived metadata from prior runs. |
| `semantic_shadow` | 0.05 | Semantic evidence lane (shadow-only, low live weight). |

Weights live in `mcp_server/lib/scorer/lane-registry.ts`. Changes require measured evidence plus synchronized doc updates across the feature catalog, manual playbook, README plus architecture.

### 3.4 FRESHNESS MODEL

| Trust State | Meaning | Caller Action |
|---|---|---|
| `live` | Index is fresh and queryable. | Use the recommendation directly. |
| `stale` | Index is queryable but sources have changed. | Use with caveat, then call `advisor_rebuild`. |
| `absent` | Index is missing. | Call `advisor_rebuild`. Do not act on an empty result. |
| `unavailable` | Subsystem cannot be reached. | Fall back to Python shim or keyword matching against frontmatter `trigger_phrases`. |

A daemon watches `.opencode/skills/*/SKILL.md` and `graph-metadata.json` files and bumps generation when sources change. The cache invalidates on generation bump.

<!-- /ANCHOR:features -->

---

<!-- ANCHOR:structure -->
## 4. STRUCTURE

```text
system-skill-advisor/
+-- SKILL.md                          # Runtime routing and invariants
+-- README.md                         # Human-facing skill overview (this file)
+-- ARCHITECTURE.md                   # System architecture, boundaries, MCP surface
+-- INSTALL_GUIDE.md                  # Install, setup, runtime hooks, rollback
+-- feature_catalog/                  # Current feature inventory across 7 groups
+-- manual_testing_playbook/          # Operator validation scenarios across 9 categories
+-- references/                       # Tool ids, scorer, lane weights, db path, hook contract
+-- hooks/                            # Per-runtime prompt-submit hooks
|   +-- claude/                       # Claude Code hook
|   +-- codex/                        # Codex hook (with optional prompt wrapper)
|   +-- gemini/                       # Gemini CLI hook
|   `-- devin/                        # Devin hook
+-- changelog/                        # Versioned changelog (v0.1.0, v0.2.0, ...)
+-- mcp_server/
    +-- advisor-server.ts             # Standalone mk_skill_advisor MCP entrypoint
    +-- tools/                        # 9 MCP tool descriptors and dispatch
    +-- handlers/                     # Advisor + skill-graph handlers
    +-- schemas/                      # Zod tool response contracts
    +-- compat/                       # Stable native compatibility entrypoint
    +-- scripts/                      # Python shim, regression, bench
    +-- bench/                        # Latency and scorer measurement helpers
    +-- data/                         # Shadow delta and diagnostic records
    +-- database/                     # Package-local SQLite runtime state
    +-- tests/                        # Vitest and Python regression coverage
    `-- lib/                          # Scorer, freshness, daemon, lifecycle, skill-graph
```

| Path | Purpose |
|---|---|
| [SKILL.md](./SKILL.md) | Runtime instruction surface for agents. |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System architecture, data flow, MCP surface, future work. |
| [INSTALL_GUIDE.md](./INSTALL_GUIDE.md) | Install, setup, runtime hooks, rollback, operator checks. |
| [feature_catalog/feature_catalog.md](./feature_catalog/feature_catalog.md) | Inventory of current runtime features. |
| [manual_testing_playbook/manual_testing_playbook.md](./manual_testing_playbook/manual_testing_playbook.md) | Manual scenario index and evidence protocol. |
| [references/tool-ids-reference.md](./references/tool-ids-reference.md) | All 9 tool ids with inputs and output shapes. |
| [references/advisor-scorer.md](./references/advisor-scorer.md) | Lane attribution model and fusion rules. |
| [references/hooks/skill-advisor-hook.md](./references/hooks/skill-advisor-hook.md) | Runtime hook contract for Claude, Codex, Gemini, Devin, OpenCode. |

<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:configuration -->
## 5. CONFIGURATION

| Setting | Default | Purpose |
|---|---|---|
| `MK_SKILL_ADVISOR_DB_DIR` | `.opencode/skills/system-skill-advisor/mcp_server/database/` | Override the SQLite database directory. Must stay inside the workspace. |
| `SYSTEM_SKILL_ADVISOR_DB_DIR` | (unset) | Legacy fallback. Same semantics as `MK_SKILL_ADVISOR_DB_DIR`. Prefer the `MK_` form. |
| `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` | `0` | Set to `1` to disable runtime hooks (Claude, Codex, Gemini, OpenCode). |
| `MK_SKILL_ADVISOR_HOOK_DISABLED` | (unset) | Devin-specific hook disable flag. Checked first by the Devin hook, then falls back to `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED`. |
| `SPECKIT_ADVISOR_SHADOW_MODE` | `0` | Set to `1` to disable the live scorer and run shadow-mode only. |
| `SKILL_ADVISOR_DEBUG` | `0` | Set to `1` to enable opt-in debug logging (v0.3.0+). |

Per-call options on `advisor_recommend` (`topK`, `includeAttribution`) override matching defaults. Use environment variables for process-wide defaults and per-call options for one request.

<!-- /ANCHOR:configuration -->

---

<!-- ANCHOR:usage-examples -->
## 6. USAGE EXAMPLES

**Pick a skill for a non-trivial prompt**

```text
User request: "Add a new feature with proper spec docs"
Tool path: mcp__mk_skill_advisor__advisor_recommend
Arguments: { "prompt": "Add a new feature with proper spec docs", "options": { "topK": 5, "includeAttribution": true } }
Expected output: recommendations[] ranked by score, with per-lane attribution, freshness plus trustState fields.
```

**Surface ambiguity explicitly**

```text
User request: "Run the regression suite"
Tool path: mcp__mk_skill_advisor__advisor_recommend
Arguments: { "prompt": "Run the regression suite" }
Expected output: top 2 or 3 candidates within 0.1 of each other, flagged as ambiguous so the caller can ask for disambiguation instead of routing silently.
```

**Trace the skill graph around a hub**

```text
User request: "What other skills depend on system-spec-kit?"
Tool path: mcp__mk_skill_advisor__skill_graph_query
Arguments: { "queryType": "dependents", "skillId": "system-spec-kit" }
Expected output: list of skill ids and edge metadata for every skill declaring system-spec-kit as a dependency.
```

**Audit cross-skill enhancement coverage (dry-run)**

```text
User request: "Which skills should declare enhances edges they currently do not?"
Tool path: mcp__mk_skill_advisor__skill_graph_propagate_enhances
Arguments: { "mode": "report", "minConfidence": 0.6 }
Expected output: candidates.detected[] with proposed inbound enhances edges, confidenceScores, dryRun=true.
```

<!-- /ANCHOR:usage-examples -->

---

<!-- ANCHOR:troubleshooting -->
## 7. TROUBLESHOOTING

| What You See | Cause | Fix |
|---|---|---|
| `trustState: "stale"` | Source skill metadata changed since the last index build. | Call `advisor_rebuild` with `force: true`. |
| `trustState: "absent"` | The advisor SQLite database is missing or empty. | Call `advisor_rebuild`. If that fails, check `MK_SKILL_ADVISOR_DB_DIR` and disk permissions. |
| `trustState: "unavailable"` | Native MCP path cannot be reached. | Verify `mk_skill_advisor` is registered in `opencode.json`. Fall back to `scripts/skill_advisor.py` if needed. |
| Top-2 candidates within 0.1 of each other | Ambiguous prompt. Two skills are equally plausible. | Surface both candidates to the user instead of routing silently. |
| `advisor_validate` baseline drift (corpus top-1 below 80.5%) | Scorer behavior changed or fixtures drifted. | Inspect `perSkill[]` and `slices.corpus` to identify regressed skills. |
| Recommendations omit a newly-added skill | The advisor reads metadata at every call, but the daemon may not have observed the new file yet. | Call `advisor_rebuild` or wait for the watcher to fire. |
| Devin hook does not disable with `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` | Devin hook checks `MK_SKILL_ADVISOR_HOOK_DISABLED` first. | Set `MK_SKILL_ADVISOR_HOOK_DISABLED=1` for Devin or set both variables. |

<!-- /ANCHOR:troubleshooting -->

---

<!-- ANCHOR:faq -->
## 8. FAQ

**Q: Why is the advisor a separate MCP server instead of part of `mk-spec-memory`?**

A: Routing is operationally distinct from memory. You may want to roll back, restart, tune the advisor without touching memory state. The standalone server boundary makes that safe.

**Q: Can I change the lane weights?**

A: Yes, but the change must come with measured evidence. The advisor exposes `advisor_validate` for corpus, holdout, parity, safety plus latency slices. Run a baseline, change weights in `lib/scorer/lane-registry.ts`, re-run validate, then ship the diff with the doc updates in `references/advisor-scorer.md` and `feature_catalog/04--scorer-fusion/`.

**Q: How does the advisor stay safe to call from hooks?**

A: Responses redact raw prompt content. Attribution is per-lane only. The recipe used by hook adapters scopes write permissions tightly, the Python shim mirrors the same redaction semantics.

**Q: What is the relationship to `system-spec-kit`?**

A: Memory, spec folders, continuity stay in `system-spec-kit`. The advisor depends on `system-spec-kit` only for the heavyweight embeddings stack used by the optional `semantic_shadow` lane. Non-embeddings code is fully isolated as of v0.2.0.

**Q: Where do I learn about the runtime hooks?**

A: See [references/hooks/skill-advisor-hook.md](./references/hooks/skill-advisor-hook.md) for the canonical hook contract across Claude, Codex, Gemini, Devin plus the OpenCode plugin.

<!-- /ANCHOR:faq -->

---

<!-- ANCHOR:related-documents -->
## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [SKILL.md](./SKILL.md) | Runtime routing, tool choice, invariants. |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System design, MCP surface, data flow, database layout. |
| [INSTALL_GUIDE.md](./INSTALL_GUIDE.md) | Setup, runtime hooks, rollback, operator checks. |
| [references/tool-ids-reference.md](./references/tool-ids-reference.md) | All 9 tool ids with input or output schemas. |
| [references/advisor-scorer.md](./references/advisor-scorer.md) | Lane attribution model and fusion rules. |
| [references/db-path-policy.md](./references/db-path-policy.md) | Package-local SQLite path policy. |
| [references/standalone-mcp-shape.md](./references/standalone-mcp-shape.md) | Standalone MCP topology (ADR-001 bridge). |
| [references/legacy-tool-bridge.md](./references/legacy-tool-bridge.md) | Stable tool id bridge policy across the standalone migration. |
| [references/propagate-enhances.md](./references/propagate-enhances.md) | Cross-skill enhances auto-propagation contract. |
| [references/skill-graph-extraction-plan.md](./references/skill-graph-extraction-plan.md) | Skill-graph extraction history and plan. |
| [references/hooks/skill-advisor-hook.md](./references/hooks/skill-advisor-hook.md) | Runtime hook contract for Claude, Codex, Gemini, Devin, OpenCode. |
| [feature_catalog/feature_catalog.md](./feature_catalog/feature_catalog.md) | Current feature inventory. |
| [manual_testing_playbook/manual_testing_playbook.md](./manual_testing_playbook/manual_testing_playbook.md) | Manual validation scenario index. |
| [changelog/v0.2.0.md](./changelog/v0.2.0.md) | v0.2.0 production isolation from system-spec-kit. |

<!-- /ANCHOR:related-documents -->
