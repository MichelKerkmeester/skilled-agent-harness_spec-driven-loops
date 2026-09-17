---
title: "Architecture: system-skill-advisor"
description: "Current package architecture for system-skill-advisor: CLI front door, daemon, scorer, skill graph, hook integration, and validators."
trigger_phrases:
  - "system skill advisor architecture"
  - "skill advisor architecture"
  - "advisor scorer"
  - "advisor daemon"
  - "skill graph"
importance_tier: "important"
---

# Architecture: system-skill-advisor

> Current-reality architecture for the `system-skill-advisor` package. The advisor scores prompts against indexed skill metadata and serves recommendations through one daemon-backed CLI front door.

---

## 1. OVERVIEW

`system-skill-advisor` is the standalone routing runtime that picks the right skill for a non-trivial prompt. Its single front door is `node .opencode/bin/skill-advisor.cjs`, a nine-command CLI that reaches the resident daemon over a unix socket. The daemon holds the scorer, the embedder and the SQLite skill graph, and a file watcher keeps that graph fresh. No MCP transport ships: no stdio server, no SDK, no plugin bridge and no server declaration in any runtime config.

The package owns three authored zones:

- `runtime/` carries the daemon, CLI, scorer, handlers, tools, tests and the package-local database.
- `hooks/` carries the prompt-time adapters and the hook reference manual.
- `references/` carries operator documentation, including the CLI front-door contract.

The recommendation command is `advisor_recommend`. The trust surface is `advisor_status`. The refresh surface is `advisor_rebuild`. The skill-graph query surface is `skill_graph_query`. The full nine-command contract, output envelope and exit taxonomy live in `references/runtime/cli-front-door-contract.md`.

### Architecture diagram

```text
┌─────────────────────────────────────────────────────────────────┐
│                SYSTEM-SKILL-ADVISOR PACKAGE                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐          ┌──────────────────────┐         │
│  │  Prompt hooks    │─────────▶│      AI Agents       │         │
│  │  plugin / CLI    │          │  (Gate 2 routing)    │         │
│  └────────┬─────────┘          └──────────────────────┘         │
│           │                                                     │
│  ┌────────▼──────────────────────────────────────────────────┐  │
│  │   Front door: node .opencode/bin/skill-advisor.cjs        │  │
│  │   nine commands, JSON envelope, exit codes 0/1/64/69/75   │  │
│  └────────┬───────────────────────────────┬──────────────────┘  │
│           │ unix socket:                  │ unreachable         │
│           │ initialize + advisor.call     ▼                     │
│  ┌────────▼──────────────────────┐  ┌───────────────────────┐   │
│  │  runtime/advisor-server.ts    │  │  Local scorer         │   │
│  │  daemon: IPC and lifecycle    │  │  runtime/scripts/     │   │
│  │  handlers/ ──▶ lib/           │  │  skill_advisor.py     │   │
│  │  lib/ ──▶ database/           │  │  (result degraded)    │   │
│  └────────────────┬──────────────┘  └───────────────────────┘   │
│                   ▼                                             │
│          ┌─────────────────┐                                    │
│          │ database/       │                                    │
│          │ skill-graph     │                                    │
│          │ .sqlite         │                                    │
│          └─────────────────┘                                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. PACKAGE TOPOLOGY

```text
system-skill-advisor/
├── runtime/                 # The package runtime
│   ├── advisor-server.ts    # Daemon entrypoint: IPC server and lifecycle
│   ├── skill-advisor-cli.ts # Nine-command CLI over the daemon IPC
│   ├── handlers/            # Command handlers
│   ├── tools/               # Command definitions and dispatcher
│   ├── lib/                 # scorer, daemon, freshness, skill-graph, embedders, ipc
│   ├── scripts/             # skill_advisor.py, graph compiler, guards
│   ├── database/            # Local SQLite skill graph
│   ├── tests/               # Vitest and integration coverage
│   ├── bench/               # Scorer benchmarks
│   └── dist/                # Generated build output
├── hooks/                   # Prompt-time adapters and hook references
├── references/              # Operator documentation
├── feature-catalog/         # Current feature inventory
├── manual-testing-playbook/ # Operator validation scenarios
└── changelog/               # Versioned changelogs
```

Allowed dependency direction:

- `handlers/ ──▶ lib/`
- `lib/ ──▶ database/`
- `lib/daemon/ ──▶ lib/`

---

## 3. CANONICAL CONTINUITY FLOWS

The advisor treats its SQLite skill graph as the durable record. Recommendations are read-only over that record; the daemon refreshes it from authored skill metadata.

**Read path (`advisor_recommend`):** input prompt enters the CLI, crosses the unix socket, and lands in `runtime/handlers/advisor-recommend.ts`; the scorer fuses 5 lanes; the result joins with trust-state metadata; the handler returns a calibrated `recommendations[]` array with prompt-safe attribution.

**Write path (`advisor_rebuild`):** the rebuilder scans `.opencode/skills/*/SKILL.md` and `graph-metadata.json`, applies the affordance normalizer, persists rows to the skill graph, and bumps the generation counter. The daemon watches the same paths and triggers incremental rebuilds on file change.

**Key modules:**

- `runtime/handlers/advisor-recommend.ts` owns the read path.
- `runtime/lib/freshness/rebuild-from-source.ts` owns the write path.
- `runtime/lib/daemon/watcher.ts` owns the file-change loop.

---

## 4. RUNTIME SUBSYSTEMS

The daemon is composed of focused subsystems that share the IPC layer and the SQLite skill graph.

**Scorer.** Five lanes fuse into a single calibrated score: explicit author signals, lexical overlap, skill-graph causality, derived metadata, and a semantic shadow lane. The fusion respects per-lane weights and emits per-lane attribution alongside the final score. Command detail lives in `references/runtime/cli-front-door-contract.md`, and lane semantics live in `references/scoring/advisor-scorer.md`.

**Shadow-delta sink.** `advisor_recommend` returns shadow comparison data without writing by default. Durable JSONL deltas are recorded only when `SPECKIT_ADVISOR_SHADOW_DELTA_PATH` points to a workspace-contained file or `SPECKIT_ADVISOR_SHADOW_DELTA_ENABLED=1` / `true` enables the default sink; the launcher allowlist forwards both env names to the daemon child.

**Daemon and freshness.** A chokidar watcher under `lib/daemon/` observes `.opencode/skills/*/SKILL.md` and per-skill `graph-metadata.json` files. On change, it triggers an incremental rebuild and refreshes the trust-state vocabulary: `live`, `stale`, `absent`, `unavailable`.

**Skill graph.** A SQLite database holds the cross-skill edges (depends_on, dependents, enhances, conflicts) plus per-skill metadata. The `skill_graph_query` command exposes read-only graph traversal.

**Doc-trigger harvest (flag-gated).** With `SPECKIT_ADVISOR_DOC_TRIGGERS=true`, the scan harvests reference/asset doc frontmatter into a `skill_docs` table, the watcher tracks those docs for freshness, and the derived lane scores their trigger phrases (top-3 per skill, tier-weighted, 0.45 contribution cap), surfacing sanitized `matchedDocs` paths on recommendations. Default-off with byte-identical flag-off behavior; the Python shim harvests the same phrases under the same flag, and the launcher's `CHILD_ENV_ALLOWLIST` must carry the flag for it to reach the daemon child.

**Local scorer.** `runtime/scripts/skill_advisor.py` is called in production. The CLI runs it when the daemon is unreachable, marks the response `degraded` and reports `source: local-scorer`, so a caller gets a stale route rather than no route. The same script keeps the JSON-array facade working for direct callers.

---

## 5. HOOK AND PLUGIN INTEGRATION

The advisor ships prompt-submit adapters for Claude, Codex, Cursor, Devin and Pi, plus the OpenCode plugin at `.opencode/plugins/system-skill-advisor.js`. The native adapters and Pi resolve the same brief builder, scorer and renderer, and the OpenCode plugin invokes the CLI. Every adapter bounds its advisor call with a timeout and fails open: a timeout, a scoring error or a missing graph yields no brief, never a blocked prompt. The Claude adapter applies `SPECKIT_CLAUDE_HOOK_TIMEOUT_MS` to its advisor subprocess. The plugin appends the brief to the system prompt and exposes the advisor status tool.

---

## 6. ENFORCEMENT AND VERIFICATION

Validation runs at two layers.

**Release validation.** `advisor_validate` runs the regression suite and reports threshold semantics (aggregate vs runtime) plus a prompt-safe `telemetry.outcomes.totals` block. Hook diagnostics persist to bounded JSONL sinks so `advisor_validate` can read them back across processes.

**Test surfaces.** Default `npm test` runs unit and integration suites under `runtime/tests/`. Scorer benchmarks live under `runtime/bench/`. Operator playbook scenarios live in `manual-testing-playbook/`.

---

## 7. DECISION RECORDS

| ADR | Subject | Status |
|---|---|---|
| ADR-001 | Five-lane scorer with explicit weights and prompt-safe attribution | Accepted |
| ADR-002 | Daemon-backed freshness via chokidar watching SKILL.md + graph-metadata.json | Accepted |
| ADR-003 | Trust-state vocabulary (`live`, `stale`, `absent`, `unavailable`) for caller fallback decisions | Accepted |
| ADR-004 | Python local scorer keeps routing answers flowing when the daemon is unreachable | Accepted |
| ADR-005 | Standalone MCP server boundary so routing can roll back independently | Superseded: the CLI front door (`runtime/` daemon over unix-socket IPC) is now the only surface |

---

## 8. RELATED

- [README.md](./README.md): Human-facing package overview
- [SKILL.md](./SKILL.md): Runtime routing and invariants
- [INSTALL-GUIDE.md](./INSTALL-GUIDE.md): Bootstrap, build and operator checks
- [feature-catalog/feature-catalog.md](./feature-catalog/feature-catalog.md): Current feature inventory and per-tool detail
- [manual-testing-playbook/manual-testing-playbook.md](./manual-testing-playbook/manual-testing-playbook.md): Operator validation scenarios
- [references/](./references/): Operator references including the hook reference manual
