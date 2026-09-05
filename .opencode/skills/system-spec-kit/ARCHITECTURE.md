---
title: "Architecture: system-spec-kit"
description: "Current package architecture for system-spec-kit: scripts, runtime engine, shared modules, canonical continuity flows, hook matrix, validators."
trigger_phrases:
  - "system spec kit architecture"
  - "spec kit architecture"
  - "canonical continuity architecture"
  - "resume ladder"
  - "spec-kit runtime subsystems"
importance_tier: "important"
---

# Architecture: system-spec-kit

> Current-reality architecture for the `system-spec-kit` package. Authored code lives in `scripts/`, `runtime/`, and `shared/`. Continuity is rebuilt through `/speckit:resume` and canonical spec documents.

---

## 1. OVERVIEW

`system-spec-kit` is split into three authored zones plus generated build output:

- `scripts/` owns CLI generation, validation, indexing, evals, and packet tooling. TypeScript and shell.
- `runtime/` owns the spec-kit engine: spec folder validation, generated packet metadata, description generation, and the per-runtime hook adapters. It is consumed as a library, not run as a service. TypeScript.
- `shared/` owns neutral modules imported by both scripts and the engine. TypeScript.
- Each zone carries its own generated `dist/`, gitignored and rebuilt from source. Not authored.

The package's operator-facing recovery surface is `/speckit:resume`. The recovery chain reads `handover.md`, then `_memory.continuity`, then canonical spec docs (`implementation-summary.md`, `tasks.md`, `plan.md`, `spec.md`). Generated memory artifacts are supporting context only, not the primary continuity record.

### Architecture diagram

```text
┌─────────────────────────────────────────────────────────────────┐
│                  SYSTEM-SPEC-KIT PACKAGE                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐     ┌──────────────────────┐              │
│  │   CLI Runtimes   │     │      AI Agents       │              │
│  │ Claude / OpenCode   │────▶│  (Gate 1/2/3 flow)   │               │
│  │ OpenCode         │     │                      │              │
│  └────────┬─────────┘     └──────────────────────┘              │
│           │                                                     │
│  ┌────────▼──────────────────────────────────────────────────┐  │
│  │                       runtime/                         │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────────────────────┐   │  │
│  │  │ hooks/   │ │handlers/ │ │           lib/           │   │  │
│  │  │ claude/  │ │discovery │ │ validation / graph       │   │  │
│  │  │ codex/   │ │save/     │ │ description / continuity │   │  │
│  │  │ cursor/  │ │          │ │ resume / search          │   │  │
│  │  │ devin/pi │ │          │ │                          │   │  │
│  │  └──────────┘ └──────────┘ └──────────────────────────┘   │  │
│  │  api/                   stress-test/                      │  │
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
│  Dependency direction: scripts/ ──▶ runtime/api/             │
│                        runtime/ ──▶ shared/                  │
│                        scripts/ ──▶ shared/                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. PACKAGE TOPOLOGY

```text
system-spec-kit/
├── scripts/                # CLI generation, validation, indexing, evals
├── runtime/             # Spec-kit engine, consumed as a library
│   ├── api/                # Public barrel for the scripts workspace
│   ├── handlers/           # Spec-document discovery and the save-path folder mutex
│   ├── lib/                # Validation, graph metadata, description, continuity, resume
│   ├── hooks/              # Per-runtime hook adapters and the shared spec-gate core
│   ├── core/               # Runtime path and config resolution
│   ├── data/               # Committed trigger index the Gate 1 lookup reads
│   ├── scripts/            # Build finalizer, metadata repair, test runners
│   ├── tests/              # Vitest coverage
│   └── stress-test/        # Opt-in load and contention suites
├── shared/                 # Neutral modules importable by scripts + engine
├── templates/              # Level contract and document templates
├── references/             # Workflow contracts and playbooks
└── feature-catalog/        # Capability inventory
```

Allowed dependency direction:

- `scripts/ ──▶ runtime/api/`
- `runtime/ ──▶ shared/`
- `scripts/ ──▶ shared/`

Reverse imports are blocked by lint and CI. Imports that reach past `runtime/api/` into `lib/`, `core/` or `handlers/` are rejected by the import-policy checks in `scripts/evals/` unless they carry a governed allowlist entry.

---

## 3. CANONICAL CONTINUITY FLOWS

Spec-kit treats canonical spec documents as the durable continuity record. The generated trigger index is a lookup surface over that record, not the record itself.

**Read path (`/speckit:resume`):**

1. Resolve the requested spec folder, following a valid phase-parent `derived.last_active_child_id` into a child before reading continuity.
2. Look for `handover.md` at the resolved folder root.
3. Fall back to `_memory.continuity` frontmatter blocks inside `implementation-summary.md`.
4. Fall back to canonical spec docs in this order: `implementation-summary.md`, `tasks.md`, `plan.md`, `spec.md`.

**Write path (`/speckit:save`):**

1. AI composes structured JSON describing session context.
2. `generate-context.js` routes content into the right canonical doc (`implementation-summary.md`, `decision-record.md`, `handover.md`) and refreshes `description.json` + `graph-metadata.json`.
3. There is no second write lane. `generate-context.js` is the only writer of `_memory.continuity`, and it keeps the atomic same-directory update and lock semantics that made a separate indexing call unnecessary.
4. Regenerate `runtime/data/trigger-index.json` when a document's `trigger_phrases` changed; nothing else is indexed.

**Key modules:**

- `/speckit:resume` owns the read path, walking the continuity ladder above.
- `scripts/dist/memory/generate-context.js` owns the write path.
- `scripts/retrieval/generate-trigger-index.mjs` builds the lookup surface; `scripts/retrieval/lookup-trigger-index.mjs` reads it.

---

## 4. RUNTIME SUBSYSTEMS

The engine is composed of focused subsystems that share a public barrel and a filesystem contract.

**Validation.** `lib/validation/orchestrator.ts` owns every spec folder rule verdict. `scripts/spec/validate.sh` is a thin front end over its compiled output and implements no rules of its own; it refuses to run against a stale build rather than returning a stale verdict. `lib/templates/level-contract-resolver.ts` supplies the per-level document contract, and `lib/spec/is-phase-parent.ts` is the single detection rule for phase parents.

**Generated packet metadata.** `lib/graph/` and `lib/description/` derive, merge, validate and serialize the two generated JSON files a spec folder carries — `description.json` and `graph-metadata.json`. Reads and writes stay split: the parser writes, while the integrity and drift gates only report, so a check cannot dirty the files it exists to keep clean. `lib/description/packet-synopsis.ts` is the one shared extractor behind both generated summary fields, so they cannot drift from the same `spec.md`.

**Discovery and continuity.** `handlers/spec-doc-discovery.ts` walks the filesystem for canonical spec documents and detects a folder's level; `lib/discovery/` re-exports it as a seam so `lib/` code depends inward rather than reaching sideways. `lib/continuity/` owns the bounded continuity record and `lib/resume/` builds the ladder a resume walks.

**Hook adapters.** `hooks/{claude,codex,cursor,devin,pi}/` translate each runtime's payload onto shared implementations and emit that runtime's own envelope shape. Policy stays in `hooks/lib/spec-gate/spec-gate-core.mjs`, so the core never changes for a new runtime, and `lib/hooks/completion-evidence-sentinel.cjs` holds the runtime-neutral completion-evidence decision.

**Public surface.** `api/index.ts` is the supported import surface. Every export has a named caller in the scripts workspace.

**Stress tests.** `stress-test/` carries opt-in load and contention suites, excluded from the default test config and run through `vitest.stress.config.ts`.

### Ownership of the surfaces the memory store used to touch

The retired store left names behind that now mean different things. This table is the
single answer to "who owns this now"; a producer, test, doctor route or gate that
disagrees with it is the thing to fix.

| Surface | Owner today | What it is |
|---------|-------------|------------|
| `runtime/data/trigger-index.json` | `scripts/retrieval/generate-trigger-index.mjs` (writer), `lookup-trigger-index.mjs` (reader) | The committed Gate 1 retrieval index over author-declared trigger phrases |
| `runtime/database/` | The HF model server in `.opencode/bin` | Its sockets, leases and logs; no index, no database of ours |
| `MEMORY_DB_PATH`, `SPEC_KIT_DB_DIR` | `shared/paths.ts` and `shared/embeddings/` for the skill advisor | The advisor's own embedding store location; nothing in this skill opens a database |
| `.opencode/skills/system-skill-advisor/mcp-server/database/` | The skill advisor | Its routing graph and doctor state; the only MCP daemon this repository still runs |
| `.opencode/skills/system-deep-loop/runtime/database/` | The deep-loop runtime | Coverage and council graphs for research, review and council loops |
| `scripts/dist/memory/generate-context.js`, `/speckit:save`, `/speckit:search` | The scripts workspace | The continuity writer and the retrieval commands; "memory" here is the command family's literal name, not a store |
| `shared/ipc/`, `@modelcontextprotocol/sdk` in `shared/` | The skill advisor daemon through `shared/ipc` | The IPC seam the advisor's MCP transport is built on |

---

## 5. HOOK AND PLUGIN INTEGRATION

Spec-kit ships a runtime hook surface that wires into each AI client's session lifecycle. The hooks emit compact context payloads at `SessionStart`, `UserPromptSubmit`, and (where supported) `Compact`.

**Hook matrix.** Claude Code injects prompt-time briefs directly. OpenCode supports native `SessionStart` and `UserPromptSubmit` hooks when `[features].opencode_hooks = true` in `~/opencode.json` and `~/.opencode/hooks.json` is wired. OpenCode delivers context through local plugins under `.opencode/plugins/`.

**Plugin bridges and local plugins.** Bridge-backed OpenCode plugin entrypoints live under `.opencode/plugins/` and import thin helpers that call into `runtime/lib/hooks/` or sibling daemon surfaces. Standalone local plugins such as `.opencode/plugins/opencode-goal.js` stay in the same plugin directory but own their state and hooks directly instead of using a daemon bridge.

**Payload shape.** Hooks share the same compact JSON payload (`bootstrap.json` style) across runtimes so callers can rely on consistent fields regardless of transport.

---

## 6. ENFORCEMENT AND VERIFICATION

Spec-kit's quality gates run at three layers.

**Spec folder validation.** `scripts/spec/validate.sh` enforces 20 rules across required files, anchor structure, frontmatter shape, template source markers, continuity freshness, and phase-parent detection. Strict mode treats warnings as failures.

**Save gate.** Every `/speckit:save` runs through 3 layers: intake validation (input schema + duplicate detection), content router (places content in the right canonical doc), and post-save quality review (DQI scoring + structural lint).

**Test surfaces.** Default `npm test` runs the engine suites through the bounded runner in `runtime/scripts/run-tests.mjs` and, through `runtime/package.json` `test:spec-validation`, the tracked spec-validation shell suites. Stress suites are opt-in via `vitest run --config vitest.stress.config.ts`.

---

## 7. DECISION RECORDS

| ADR | Subject | Status |
|---|---|---|
| ADR-001 | Canonical continuity surfaces own the durable record; generated memory is search-only | Accepted |
| ADR-002 | Phase parents validate as the lean trio (spec + description + graph-metadata) | Accepted |
| ADR-005 | 4-level documentation contract (Levels 1, 2, 3, 3+) with manifest templates | Accepted |
| ADR-006 | Save gate runs 3 layers (intake, router, quality review) on every save | Accepted |
| ADR-007 | Embedding provider auto-cascade is local-first (Ollama → hf-local → OpenAI → Voyage), per ADR-014 | Accepted |

---

## 8. RELATED

- [README.md](./README.md): Human-facing package overview
- [SKILL.md](./SKILL.md): Runtime routing and invariants
- [feature-catalog/feature-catalog.md](./feature-catalog/feature-catalog.md): Current feature inventory
- [manual-testing-playbook/manual-testing-playbook.md](./manual-testing-playbook/manual-testing-playbook.md): Operator validation scenarios
- [runtime/README.md](./runtime/README.md): Runtime package details
- [references/](./references/): Workflow contracts, hook references, validation playbooks
