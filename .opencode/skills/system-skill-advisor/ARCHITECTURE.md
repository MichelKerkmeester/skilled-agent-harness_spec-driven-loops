---
title: "Architecture: system-skill-advisor"
description: "Current package architecture for the standalone mk_skill_advisor MCP server, advisor routing, skill graph tools, database ownership, and pending skill-graph library extraction."
trigger_phrases:
  - "system skill advisor architecture"
  - "standalone advisor mcp"
  - "mk_skill_advisor tools"
  - "skill graph database path"
  - "advisor skill graph architecture"
importance_tier: "important"
---

# Architecture: system-skill-advisor

<!-- sk-doc-template: architecture_current_reality -->

Current-reality architecture for the standalone Skill Advisor package. The package owns the `mk_skill_advisor` MCP server, advisor routing tools, skill graph MCP tools, package-local database path, and operator docs; the `lib/skill-graph/` database/query library remains in `system-spec-kit` until packet 011 moves it.

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. BOUNDARIES](#2--boundaries)
- [3. COMPONENTS](#3--components)
- [4. DATA FLOW](#4--data-flow)
- [5. DATABASE AND STATE](#5--database-and-state)
- [6. MCP SURFACE](#6--mcp-surface)
- [7. EXTENSION POINTS](#7--extension-points)
- [8. TESTING AND VERIFICATION](#8--testing-and-verification)
- [9. FUTURE WORK](#9--future-work)
- [10. RELATED](#10--related)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`system-skill-advisor` is the standalone Gate 2 routing subsystem. It recommends the right skill for non-trivial prompts, reports advisor freshness, validates routing quality, rebuilds advisor state, and exposes the SQLite-backed skill graph through the same MCP server namespace.

The current server id is `mk_skill_advisor`. It is registered as a native MCP server and exposes **8 public tools plus 1 internal trusted-caller tool** (9 total):

| Tool family | Tools | Visibility |
|---|---|---|
| Advisor routing | `advisor_recommend`, `advisor_rebuild`, `advisor_status`, `advisor_validate` | public |
| Skill graph | `skill_graph_scan`, `skill_graph_query`, `skill_graph_status`, `skill_graph_validate` | public |
| Skill graph (trusted) | `skill_graph_propagate_enhances` | internal — trusted-caller auth (see `references/tool-ids-reference.md` §4) |

The public `advisor_*` ids remain stable from the original extraction ADR. The `skill_graph_*` ids moved under this server in packet 013/009/008. The package docs intentionally describe current state, not the early child-002 envelope.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:boundaries -->
## 2. BOUNDARIES

### Owns

- MCP tool descriptors and dispatch for `mk_skill_advisor`.
- Advisor handlers for recommendation, status, rebuild, and validation.
- Skill graph MCP handlers for scan, query, status, and validation.
- Scorer, freshness, daemon, derived metadata, lifecycle, compatibility, corpus, auth, shadow, and utility modules under `mcp_server/lib/`.
- Python compatibility shim and regression/bench scripts under `mcp_server/scripts/`.
- Package-local database directory under `mcp_server/database/`.
- Feature catalog, manual testing playbook, install/setup docs, references, and package READMEs.

### Does Not Own

- Spec folders, memory save/search, resume ladder, and packet validation. Those remain `system-spec-kit`.
- Code graph indexing and `ccc_*` semantic code search. Those remain `system-code-graph` / `mcp-coco-index`.
- Private source code rewrites outside the advisor package.
- Spec Kit Memory database, retrieval, and packet continuity internals.

<!-- /ANCHOR:boundaries -->

---

<!-- ANCHOR:components -->
## 3. COMPONENTS

```text
system-skill-advisor/
+-- SKILL.md                       # Runtime skill instructions
+-- README.md                      # Human-facing package overview
+-- ARCHITECTURE.md                # Current architecture
+-- INSTALL_GUIDE.md               # Install + setup + runtime hooks + rollback + reference commands (merged 2026-05-15)
+-- references/                    # Policy and migration references
+-- feature_catalog/               # Current capability inventory
+-- manual_testing_playbook/       # Manual validation scenarios
+-- mcp_server/
    +-- tools/                     # Eight MCP tool descriptors and dispatch
    +-- handlers/                  # Advisor and skill graph tool handlers
    +-- schemas/                   # Zod/tool response contracts
    +-- compat/                    # Stable native compatibility entrypoint
    +-- scripts/                   # Python shim, regression, bench, compiler
    +-- bench/                     # Latency and scorer measurement helpers
    +-- data/                      # Shadow delta and diagnostic records
    +-- database/                  # Package-local SQLite runtime state
    +-- tests/                     # Vitest and Python regression surfaces
    `-- lib/
        +-- scorer/                # Lane registry, fusion, projection, attribution
        +-- daemon/                # Watcher, lease, lifecycle
        +-- freshness/             # Trust state, generation, cache invalidation
        +-- derived/               # Metadata extraction, sanitizer, provenance
        +-- lifecycle/             # Age, archive, supersession, rollback
        +-- compat/                # Redirect and daemon probes
        +-- corpus/                # DF/IDF text weighting
        +-- auth/                  # Trusted caller checks
        +-- shadow/                # Shadow sink
        `-- utils/                 # Retry, JSON, path and markdown helpers
```

Key dependency direction:

| From | To | Rule |
|---|---|---|
| `tools/` | `handlers/` | Tool dispatch only |
| `handlers/` | `lib/`, `schemas/` | Handler orchestration only |
| `compat/` | public handler/lib APIs | Stable bridge surface |
| `scripts/skill_advisor.py` | native MCP/compat first, Python fallback second | Compatibility path |
| `handlers/skill-graph/` | `lib/skill-graph/` | Package-local skill graph DB/query library |

<!-- /ANCHOR:components -->

---

<!-- ANCHOR:data-flow -->
## 4. DATA FLOW

### Recommendation Flow

```text
prompt or hook request
  -> advisor_recommend tool descriptor
  -> handlers/advisor-recommend.ts
  -> status/freshness read
  -> lib/scorer/* lanes and fusion
  -> lifecycle redirect and ambiguity handling
  -> prompt-safe MCP response or hook brief
```

The scorer uses the lane registry in `lib/scorer/lane-registry.ts`. Current live weights are:

| Lane | Weight | Role |
|---|---:|---|
| `explicit_author` | 0.42 | Author-declared skill and trigger metadata |
| `lexical` | 0.28 | Text overlap and lexical evidence |
| `graph_causal` | 0.13 | Skill graph relationships |
| `derived_generated` | 0.12 | Sanitized derived metadata |
| `semantic_shadow` | 0.05 | Semantic evidence lane |

### Skill Graph Flow

```text
skill_graph_scan
  -> handlers/skill-graph/scan.ts
  -> lib/skill-graph DB/query library
  -> package-local SQLite graph state
  -> freshness/generation update

skill_graph_query/status/validate
  -> handlers/skill-graph/*
  -> lib/skill-graph DB/query library
  -> redacted MCP response
```

### Compatibility Flow

```text
Python or plugin caller
  -> compat/index.ts or scripts/skill_advisor.py
  -> daemon/native probe
  -> native advisor response when available
  -> local fallback only when native path is unavailable
```

<!-- /ANCHOR:data-flow -->

---

<!-- ANCHOR:database-and-state -->
## 5. DATABASE AND STATE

The default advisor database path is:

```text
.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite
```

SQLite sidecars live beside it:

```text
skill-graph.sqlite-wal
skill-graph.sqlite-shm
```

Tests and disposable CI runs may set `MK_SKILL_ADVISOR_DB_DIR`; `SYSTEM_SKILL_ADVISOR_DB_DIR` remains a legacy fallback for compatibility. Operator docs treat the package-local path as canonical. The advisor package should be the only runtime owner of advisor graph state once packet 011 finishes the library-location cleanup.

Runtime trust states use the shared vocabulary:

| State | Meaning |
|---|---|
| `live` | Graph state is fresh and queryable |
| `stale` | Graph state is queryable but sources changed |
| `absent` | Graph state is missing |
| `unavailable` | Subsystem cannot be reached or trusted |

<!-- /ANCHOR:database-and-state -->

---

<!-- ANCHOR:mcp-surface -->
## 6. MCP SURFACE

| Tool | Handler | Purpose |
|---|---|---|
| `advisor_recommend` | `handlers/advisor-recommend.ts` | Rank skills for a prompt with prompt-safe attribution and thresholds |
| `advisor_rebuild` | `handlers/advisor-rebuild.ts` | Rebuild advisor graph state when status is stale, absent, or explicitly forced |
| `advisor_status` | `handlers/advisor-status.ts` | Report freshness, generation, trust state, lane weights, skill count, and daemon state |
| `advisor_validate` | `handlers/advisor-validate.ts` | Run routing validation slices and surface pass/fail metrics |
| `skill_graph_scan` | `handlers/skill-graph/scan.ts` | Index skill metadata into the skill graph |
| `skill_graph_query` | `handlers/skill-graph/query.ts` | Traverse dependencies, families, subgraphs, hubs, conflicts, and related graph views |
| `skill_graph_status` | `handlers/skill-graph/status.ts` | Report graph counts, families, categories, staleness, and DB status |
| `skill_graph_validate` | `handlers/skill-graph/validate.ts` | Validate graph schema drift, broken edges, reciprocal symmetry, and dependency-cycle issues |
| `skill_graph_propagate_enhances` | `handlers/skill-graph/propagate-enhances.ts` | (Internal, trusted-caller) Detect, report, and optionally apply missing inbound `enhances` edges across skills |

`opencode.json` `_NOTE_2_TOOLS` reflects this surface as "9 tools (8 public + 1 internal trusted-caller)" — kept in sync as of packet 025. This doc follows the source surface in `mcp_server/tools/index.ts` and `mcp_server/tools/skill-graph-tools.ts`.

<!-- /ANCHOR:mcp-surface -->

---

<!-- ANCHOR:extension-points -->
## 7. EXTENSION POINTS

Safe extension points:

- Add new derived metadata extractors under `lib/derived/` when the sanitizer and provenance contracts stay intact.
- Add scorer diagnostics through `advisor_validate` rather than widening prompt-time recommendation payloads.
- Add new manual scenarios under `manual_testing_playbook/` and link them from `feature_catalog/`.
- Add compatibility behavior through `compat/index.ts` rather than importing private handler internals.

Guarded extension points:

- Changing lane weights requires measured evidence and docs updates in feature catalog, playbook, README, and architecture.
- Adding MCP tools requires updates to `tools/`, `handlers/`, schemas, install/setup docs, root README, and feature catalog.
- Moving `lib/skill-graph/` into this package belongs to packet 011, not incidental doc cleanup.

<!-- /ANCHOR:extension-points -->

---

<!-- ANCHOR:testing-and-verification -->
## 8. TESTING AND VERIFICATION

Primary verification surfaces:

| Surface | Command or path |
|---|---|
| TypeScript build/typecheck | `npm --prefix .opencode/skills/system-spec-kit/mcp_server run build` and `run typecheck` |
| Advisor Vitest suites | `.opencode/skills/system-skill-advisor/mcp_server/tests/` |
| Python regression harness | `python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor_regression.py --dataset .opencode/skills/system-skill-advisor/mcp_server/scripts/fixtures/skill_advisor_regression_cases.jsonl` |
| Feature coverage | `.opencode/skills/system-skill-advisor/feature_catalog/feature_catalog.md` |
| Manual validation | `.opencode/skills/system-skill-advisor/manual_testing_playbook/manual_testing_playbook.md` |
| Install/setup checks | `INSTALL_GUIDE.md` (install + setup merged 2026-05-15) |

Current doc-alignment note: the checked-in regression harness was run during this pass and returned failures against existing expectations. That is not changed by this documentation packet; the result is recorded as a content-discrepancy signal rather than a runtime fix.

<!-- /ANCHOR:testing-and-verification -->

---

<!-- ANCHOR:future-work -->
## 9. FUTURE WORK

- Packet 011: move or settle the `lib/skill-graph/` library location so handlers no longer depend on the `system-spec-kit` runtime tree.
- Reconcile regression-fixture totals and expected ids with the current command/skill naming model.
- Promote any lane-weight changes only with measured validation evidence and synchronized docs.

<!-- /ANCHOR:future-work -->

---

<!-- ANCHOR:related -->
## 10. RELATED

- [README.md](./README.md)
- [INSTALL_GUIDE.md](./INSTALL_GUIDE.md)
- [references/db-path-policy.md](./references/db-path-policy.md)
- [references/standalone-mcp-shape.md](./references/standalone-mcp-shape.md)
- [references/legacy-tool-bridge.md](./references/legacy-tool-bridge.md)
- [feature_catalog/feature_catalog.md](./feature_catalog/feature_catalog.md)
- [manual_testing_playbook/manual_testing_playbook.md](./manual_testing_playbook/manual_testing_playbook.md)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/006-system-skill-advisor-extraction/001-design-and-decision-record/decision-record.md`

<!-- /ANCHOR:related -->
