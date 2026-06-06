---
title: "Architecture: system-spec-kit"
description: "Current package architecture for system-spec-kit: scripts, MCP runtime, shared modules, canonical continuity flows, hook matrix, validators."
trigger_phrases:
  - "system spec kit architecture"
  - "spec kit architecture"
  - "canonical continuity architecture"
  - "resume ladder"
  - "spec-kit runtime subsystems"
importance_tier: "important"
---

# Architecture: system-spec-kit

> Current-reality architecture for the `system-spec-kit` package. Authored code lives in `scripts/`, `mcp_server/`, and `shared/`. Continuity is rebuilt through `/spec_kit:resume` and canonical spec documents.

---

## 1. OVERVIEW

`system-spec-kit` is split into three authored zones plus generated build output:

- `scripts/` owns CLI generation, validation, indexing, evals, and packet tooling. TypeScript and shell.
- `mcp_server/` owns the runtime MCP server, handlers, storage, search, hooks, and matrix runners. TypeScript.
- `shared/` owns neutral modules imported by both scripts and runtime. TypeScript.
- `dist/` carries generated JavaScript entrypoints only. Not authored.

The package's operator-facing recovery surface is `/spec_kit:resume`. The recovery chain reads `handover.md`, then `_memory.continuity`, then canonical spec docs (`implementation-summary.md`, `tasks.md`, `plan.md`, `spec.md`). Generated memory artifacts are supporting context only, not the primary continuity record.

### Architecture diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                  SYSTEM-SPEC-KIT PACKAGE                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐     ┌──────────────────────┐              │
│  │   CLI Runtimes   │     │      AI Agents       │              │
│  │ Claude / Gemini  │────▶│  (Gate 1/2/3 flow)   │              │
│  │ Copilot / Codex  │     │                      │              │
│  └────────┬─────────┘     └──────────────────────┘              │
│           │                                                     │
│  ┌────────▼──────────────────────────────────────────────────┐  │
│  │                       mcp_server/                         │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────────────────────┐   │  │
│  │  │ hooks/   │ │handlers/ │ │           lib/           │   │  │
│  │  │ claude/  │ │save/     │ │ search / resume / merge  │   │  │
│  │  │ gemini/  │ │resume/   │ │ graph / continuity       │   │  │
│  │  │ copilot/ │ │search/   │ │                          │   │  │
│  │  │ codex/   │ │context/  │ │                          │   │  │
│  │  └──────────┘ └──────────┘ └──────────────────────────┘   │  │
│  │  matrix_runners/        stress_test/                      │  │
│  └─────────────────────────┬─────────────────────────────────┘  │
│                            │                                    │
│  ┌────────────────┐     ┌──┴──────────────┐                     │
│  │   scripts/     │     │    shared/      │                     │
│  │ create.sh      │────▶│ embeddings.ts   │                     │
│  │ validate.sh    │     │ trigger-extract │                     │
│  │ generate-      │     │ chunking.ts     │                     │
│  │ context.ts     │     │ algorithms/     │                     │
│  │ evals/         │     │ scoring/        │                     │
│  └────────────────┘     └─────────────────┘                     │
│                                                                 │
│  Dependency direction: scripts/ ──▶ mcp_server/api/             │
│                        mcp_server/ ──▶ shared/                  │
│                        scripts/ ──▶ shared/                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. PACKAGE TOPOLOGY

```text
system-spec-kit/
├── scripts/                # CLI generation, validation, indexing, evals
├── mcp_server/             # Runtime MCP server
│   ├── context-server.ts   # MCP transport entrypoint
│   ├── tool-schemas.ts     # Public tool schema registry
│   ├── handlers/           # Top-level MCP tool handlers
│   ├── tools/              # Tool dispatcher and group helpers
│   ├── schemas/            # Zod input schemas
│   ├── lib/                # Search, scoring, context, continuity, resume
│   ├── hooks/              # Startup / prompt / compact-context hook payload builders
│   ├── formatters/         # MCP response shaping
│   ├── shared/             # Shared algorithms inside the runtime
│   ├── configs/            # Runtime tuning data
│   ├── scripts/            # Maintenance and evaluation scripts
│   ├── database/           # Local SQLite stores
│   ├── tests/              # Vitest + integration coverage
│   ├── matrix_runners/     # Packet-036 F1-F14 x CLI adapter manifest
│   └── stress_test/        # Opt-in stress / load / degraded-state suites
├── shared/                 # Neutral modules importable by scripts + runtime
├── dist/                   # Generated build output
└── tests/                  # Spec-folder test fixtures
```

Allowed dependency direction:

- `scripts/ ──▶ mcp_server/api/`
- `mcp_server/ ──▶ shared/`
- `scripts/ ──▶ shared/`
- `mcp_server/ ──▶ database/`

Reverse imports are blocked by lint and CI.

---

## 3. CANONICAL CONTINUITY FLOWS

Spec-kit treats canonical spec documents as the durable continuity record. Generated memory indexes are search/recall surfaces over that record, not the record itself.

**Read path (`/spec_kit:resume`):**

1. Look for `handover.md` at the spec folder root.
2. Fall back to `_memory.continuity` frontmatter blocks inside `implementation-summary.md`.
3. Fall back to canonical spec docs in this order: `implementation-summary.md`, `tasks.md`, `plan.md`, `spec.md`.
4. Surface graph-metadata pointers (`derived.last_active_child_id`, `derived.last_active_at`) for phase parents.

**Write path (`/memory:save`):**

1. AI composes structured JSON describing session context.
2. `generate-context.js` routes content into the right canonical doc (`implementation-summary.md`, `decision-record.md`, `handover.md`) and refreshes `description.json` + `graph-metadata.json`.
3. The indexed-continuity store re-indexes the touched docs for hybrid retrieval.

**Key modules:**

- `mcp_server/lib/resume/` owns the read path.
- `scripts/dist/memory/generate-context.js` owns the write path.
- `mcp_server/lib/continuity/` owns the indexing layer.

---

## 4. RUNTIME SUBSYSTEMS

The MCP server is composed of focused subsystems that share the transport layer and the SQLite store.

**Search.** The 5-channel hybrid retrieval pipeline (Vector, FTS5, BM25, Causal Graph, Degree) lives in `lib/search/`. The four pipeline stages are Gather → Score → Rerank → Filter. Reciprocal Rank Fusion combines channel outputs. Response shaping happens in `formatters/`.

**Memory and continuity.** `lib/memory/` owns the indexed-continuity store schema and persistence. `lib/continuity/` owns the canonical-doc routing. `database/` carries the SQLite files (`memory.db`, `embeddings.db`, plus auxiliary stores).

**Save pipeline.** `handlers/save/` runs the 3-layer save gate (intake validation, content router, post-save quality review). DQI scoring runs on every save.

**Hook orchestrator.** `hooks/{claude,gemini,copilot,codex}/` produce per-runtime startup, prompt-submit, and compact-context payloads. The payloads share a common builder in `lib/hooks/`.

**Matrix runners.** `matrix_runners/` houses the F1-F14 evaluation harness and per-CLI adapters used by the quality matrix.

**Stress tests.** `stress_test/` carries opt-in load + degraded-state suites, excluded from default `npm test` and run through `npm run stress`.

---

## 5. HOOK AND PLUGIN INTEGRATION

Spec-kit ships a runtime hook surface that wires into each AI client's session lifecycle. The hooks emit compact context payloads at `SessionStart`, `UserPromptSubmit`, and (where supported) `Compact`.

**Hook matrix.** Claude Code and Gemini CLI inject prompt-time briefs directly. Codex CLI supports native `SessionStart` and `UserPromptSubmit` hooks when `[features].codex_hooks = true` in `~/.codex/config.toml` and `~/.codex/hooks.json` is wired. OpenCode delivers context through a plugin bridge under `.opencode/plugins/`. Copilot CLI refreshes a managed block in `$HOME/.copilot/copilot-instructions.md` because Copilot hook stdout is not prompt-mutating.

**Plugin bridges.** OpenCode plugin entrypoints live under `.opencode/plugins/`. Each plugin imports a thin bridge that calls into `mcp_server/lib/hooks/` and emits a payload back to the runtime.

**Payload shape.** Hooks share the same compact JSON payload (`bootstrap.json` style) across runtimes so callers can rely on consistent fields regardless of transport.

---

## 6. ENFORCEMENT AND VERIFICATION

Spec-kit's quality gates run at three layers.

**Spec folder validation.** `scripts/spec/validate.sh` enforces 20 rules across required files, anchor structure, frontmatter shape, template source markers, continuity freshness, and phase-parent detection. Strict mode treats warnings as failures.

**Save gate.** Every `/memory:save` runs through 3 layers: intake validation (input schema + duplicate detection), content router (places content in the right canonical doc), and post-save quality review (DQI scoring + structural lint).

**Test surfaces.** Default `npm test` runs unit + integration suites under `mcp_server/tests/` and `scripts/tests/`. Stress suites are opt-in via `npm run stress`. Matrix runner evaluation is opt-in via the runner-specific commands under `matrix_runners/`.

---

## 7. DECISION RECORDS

| ADR | Subject | Status |
|---|---|---|
| ADR-001 | Canonical continuity surfaces own the durable record; generated memory is search-only | Accepted |
| ADR-002 | Phase parents validate as the lean trio (spec + description + graph-metadata) | Accepted |
| ADR-003 | Hybrid retrieval fuses 5 channels via Reciprocal Rank Fusion | Accepted |
| ADR-004 | FSRS power-law forgetting curve, tuned by content type and importance | Accepted |
| ADR-005 | 4-level documentation contract (Levels 1, 2, 3, 3+) with manifest templates | Accepted |
| ADR-006 | Save gate runs 3 layers (intake, router, quality review) on every save | Accepted |
| ADR-007 | Embedding provider auto-cascade: Voyage → OpenAI → ollama → hf-local | Accepted |

---

## 8. RELATED

- [README.md](./README.md): Human-facing package overview
- [SKILL.md](./SKILL.md): Runtime routing and invariants
- [INSTALL_GUIDE.md](mcp_server/INSTALL_GUIDE.md): Native bootstrap and per-runtime configuration
- [feature_catalog/feature_catalog.md](./feature_catalog/feature_catalog.md): Current feature inventory
- [manual_testing_playbook/manual_testing_playbook.md](./manual_testing_playbook/manual_testing_playbook.md): Operator validation scenarios
- [mcp_server/README.md](./mcp_server/README.md): MCP server package details
- [references/](./references/): Workflow contracts, hook references, validation playbooks
