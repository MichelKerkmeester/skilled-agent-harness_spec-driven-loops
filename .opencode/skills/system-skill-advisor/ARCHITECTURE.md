---
title: "Architecture: system-skill-advisor"
description: "Current package architecture for system-skill-advisor: scorer, daemon, MCP runtime, skill graph, hook integration, and validators."
trigger_phrases:
  - "system skill advisor architecture"
  - "skill advisor architecture"
  - "advisor scorer"
  - "advisor daemon"
  - "skill graph"
importance_tier: "important"
---

# Architecture: system-skill-advisor

> Current-reality architecture for the `system-skill-advisor` package. The advisor scores prompts against indexed skill metadata, exposes recommendations through a standalone MCP server, and rebuilds state through a file watcher.

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. PACKAGE TOPOLOGY](#2--package-topology)
- [3. CANONICAL CONTINUITY FLOWS](#3--canonical-continuity-flows)
- [4. RUNTIME SUBSYSTEMS](#4--runtime-subsystems)
- [5. HOOK AND PLUGIN INTEGRATION](#5--hook-and-plugin-integration)
- [6. ENFORCEMENT AND VERIFICATION](#6--enforcement-and-verification)
- [7. DECISION RECORDS](#7--decision-records)
- [8. RELATED](#8--related)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`system-skill-advisor` is the standalone routing runtime that picks the right skill for a non-trivial prompt. It runs as its own MCP server (`mk_skill_advisor`) and persists state to a local SQLite skill graph.

The package owns three authored zones:

- `mcp_server/` carries the runtime MCP server, scorer, daemon, tools, and tests.
- `compat/` carries the Python compatibility shim for legacy callers and CI scripts.
- `references/` carries operator documentation and the hook reference manual.

The recommendation surface is `advisor_recommend`. The trust surface is `advisor_status`. The refresh surface is `advisor_rebuild`. The skill-graph query surface is `skill_graph_query`. Detail per tool lives in `feature_catalog/feature_catalog.md`.

### Architecture diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                SYSTEM-SKILL-ADVISOR PACKAGE                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐     ┌──────────────────────┐              │
│  │   CLI Runtimes   │     │      AI Agents       │              │
│  │ Claude / Gemini  │────▶│  (Gate 2 routing)    │              │
│  │ Codex / OpenCode │     │                      │              │
│  └────────┬─────────┘     └──────────────────────┘              │
│           │                                                     │
│  ┌────────▼──────────────────────────────────────────────────┐  │
│  │                       mcp_server/                         │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────────────────────┐   │  │
│  │  │ scorer/  │ │handlers/ │ │           lib/           │   │  │
│  │  │ explicit │ │recommend │ │ skill-graph / freshness  │   │  │
│  │  │ lexical  │ │status    │ │ trust-state / daemon     │   │  │
│  │  │ graph    │ │rebuild   │ │                          │   │  │
│  │  │ derived  │ │validate  │ │                          │   │  │
│  │  │ semantic │ │          │ │                          │   │  │
│  │  └──────────┘ └──────────┘ └──────────────────────────┘   │  │
│  │  daemon/                tests/                            │  │
│  └─────────────────────────┬─────────────────────────────────┘  │
│                            │                                    │
│  ┌────────────────┐     ┌──┴──────────────┐                     │
│  │   compat/      │     │   database/     │                     │
│  │ skill_advisor  │────▶│ skill-graph     │                     │
│  │ .py shim       │     │ .sqlite         │                     │
│  └────────────────┘     └─────────────────┘                     │
│                                                                 │
│  Dependency direction: handlers/ ──▶ scorer/                    │
│                        scorer/ ──▶ lib/                         │
│                        lib/ ──▶ database/                       │
│                        daemon/ ──▶ lib/                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:topology -->
## 2. PACKAGE TOPOLOGY

```text
system-skill-advisor/
├── mcp_server/             # Runtime MCP server
│   ├── index.ts            # MCP transport entrypoint
│   ├── tool-schemas.ts     # Public tool schema registry
│   ├── handlers/           # MCP tool handlers
│   ├── tools/              # Tool dispatcher and group helpers
│   ├── scorer/             # 5-lane scorer + fusion
│   ├── daemon/             # Chokidar file watcher + freshness state
│   ├── lib/                # Skill graph, trust state, helpers
│   ├── database/           # Local SQLite skill graph
│   ├── tests/              # Vitest + integration coverage
│   ├── bench/              # Scorer benchmarks
│   └── scripts/            # Maintenance scripts
├── compat/                 # Python compatibility shim
├── references/             # Operator docs and hook references
├── feature_catalog/        # Current feature inventory
├── manual_testing_playbook # Operator validation scenarios
└── dist/                   # Generated build output
```

Allowed dependency direction:

- `handlers/ ──▶ scorer/`
- `scorer/ ──▶ lib/`
- `lib/ ──▶ database/`
- `daemon/ ──▶ lib/`

Reverse imports are blocked by lint and CI.

<!-- /ANCHOR:topology -->

---

<!-- ANCHOR:continuity-flows -->
## 3. CANONICAL CONTINUITY FLOWS

The advisor treats its SQLite skill graph as the durable record. Recommendations are read-only over that record; the daemon refreshes it from authored skill metadata.

**Read path (`advisor_recommend`):** input prompt enters `handlers/recommend.ts`, the scorer fuses 5 lanes, the result joins with trust-state metadata, and the handler returns a calibrated `recommendations[]` array with prompt-safe attribution.

**Write path (`advisor_rebuild`):** the rebuilder scans `.opencode/skills/*/SKILL.md` and `graph-metadata.json`, applies the affordance normalizer, persists rows to the skill graph, and bumps the generation counter. Daemon watches the same paths and triggers incremental rebuilds on file change.

**Key modules:**

- `mcp_server/handlers/recommend.ts` owns the read path.
- `mcp_server/lib/skill-graph/rebuild.ts` owns the write path.
- `mcp_server/daemon/watcher.ts` owns the file-change loop.

<!-- /ANCHOR:continuity-flows -->

---

<!-- ANCHOR:runtime-subsystems -->
## 4. RUNTIME SUBSYSTEMS

The MCP server is composed of focused subsystems that share the transport layer and the SQLite skill graph.

**Scorer.** Five lanes fuse into a single calibrated score: explicit author signals, lexical overlap, skill-graph causality, derived metadata, and a semantic shadow lane. The fusion respects per-lane weights and emits per-lane attribution alongside the final score. Tool detail and lane semantics live in `feature_catalog/feature_catalog.md`.

**Daemon and freshness.** A chokidar watcher under `daemon/` observes `.opencode/skills/*/SKILL.md` and per-skill `graph-metadata.json` files. On change, it triggers an incremental rebuild and refreshes the trust-state vocabulary: `live`, `stale`, `absent`, `unavailable`.

**Skill graph.** A SQLite database holds the cross-skill edges (depends_on, dependents, enhances, conflicts) plus per-skill metadata. The `skill_graph_query` tool exposes read-only graph traversal.

**Compatibility shim.** `compat/skill_advisor.py` keeps scripts and hooks working when the native MCP path is not reachable. The shim wraps the same recommendation logic with a Python entrypoint.

<!-- /ANCHOR:runtime-subsystems -->

---

<!-- ANCHOR:hook-integration -->
## 5. HOOK AND PLUGIN INTEGRATION

The advisor ships matching prompt-submit hooks for Claude Code, Codex, Gemini, and Devin CLI, plus an OpenCode plugin bridge. The hook payload is the same compact attribution-safe JSON across runtimes so callers can rely on consistent fields regardless of transport. The plugin bridge under `.opencode/plugins/` calls into `mcp_server/lib/hooks/` and emits the payload back to the runtime.

<!-- /ANCHOR:hook-integration -->

---

<!-- ANCHOR:enforcement -->
## 6. ENFORCEMENT AND VERIFICATION

Validation runs at two layers.

**Release validation.** `advisor_validate` runs the regression suite and reports threshold semantics (aggregate vs runtime) plus a prompt-safe `telemetry.outcomes.totals` block. Hook diagnostics persist to bounded JSONL sinks so `advisor_validate` can read them back across processes.

**Test surfaces.** Default `npm test` runs unit and integration suites under `mcp_server/tests/`. Scorer benchmarks run through `npm run bench`. Operator playbook scenarios live in `manual_testing_playbook/`.

<!-- /ANCHOR:enforcement -->

---

<!-- ANCHOR:decision-records -->
## 7. DECISION RECORDS

| ADR | Subject | Status |
|---|---|---|
| ADR-001 | Five-lane scorer with explicit weights and prompt-safe attribution | Accepted |
| ADR-002 | Daemon-backed freshness via chokidar watching SKILL.md + graph-metadata.json | Accepted |
| ADR-003 | Trust-state vocabulary (`live`, `stale`, `absent`, `unavailable`) for caller fallback decisions | Accepted |
| ADR-004 | Python compatibility shim preserves legacy callers without native MCP transport | Accepted |
| ADR-005 | Standalone MCP server boundary so routing can roll back independently | Accepted |

<!-- /ANCHOR:decision-records -->

---

<!-- ANCHOR:related -->
## 8. RELATED

- [README.md](./README.md): Human-facing package overview
- [SKILL.md](./SKILL.md): Runtime routing and invariants
- [INSTALL_GUIDE.md](./INSTALL_GUIDE.md): Native bootstrap and per-runtime configuration
- [feature_catalog/feature_catalog.md](./feature_catalog/feature_catalog.md): Current feature inventory and per-tool detail
- [manual_testing_playbook/manual_testing_playbook.md](./manual_testing_playbook/manual_testing_playbook.md): Operator validation scenarios
- [references/](./references/): Operator references including the hook reference manual

<!-- /ANCHOR:related -->
