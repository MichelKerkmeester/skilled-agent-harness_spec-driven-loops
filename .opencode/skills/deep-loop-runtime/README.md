---
title: "deep-loop-runtime: Shared Deep-Loop Runtime Infrastructure"
description: "Shared runtime home for deep-review and deep-research loop infrastructure. Houses executor config, prompt-pack rendering, post-dispatch validation, atomic state, coverage-graph schema/query/signals, .cjs script entry points (replacing removed deep_loop_graph_* MCP tools), and runtime-owned SQLite storage + tests."
trigger_phrases:
  - "deep-loop runtime"
  - "deep-loop-runtime skill"
  - "executor config"
  - "convergence detection"
  - "coverage-graph schema"
  - "deep-loop runtime scripts"
---

# deep-loop-runtime

> Shared runtime infrastructure for the deep-review + deep-research loop workflows. Houses the executor + state + scoring + coverage-graph runtime moved out of `system-spec-kit/mcp_server/` by the 118 FULL_ISOLATE_NO_MCP arc.

---

<!-- ANCHOR:toc -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. QUICK START](#2--quick-start)
- [3. FEATURES](#3--features)
- [4. STRUCTURE](#4--structure)
- [5. INTEGRATION POINTS](#5--integration-points)
- [6. RELATED DOCUMENTS](#6--related-documents)
<!-- /ANCHOR:toc -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

`deep-loop-runtime` is the shared runtime home for the deep-review and deep-research loop infrastructure. The 118 FULL_ISOLATE_NO_MCP arc moved executor config, prompt-pack rendering, post-dispatch validation, state safety primitives, permissions, Bayesian scoring, fallback routing, coverage-graph logic, script entry points, storage, and runtime tests out of the MCP server surface and into this peer skill. The 4 `mcp__mk_spec_memory__deep_loop_graph_*` MCP tools were deleted; their behavior moved to `scripts/*.cjs` direct-invocation entry points.

### Usage

This README orients contributors and operators to the skill's layout, integration surface, and version history. The full operational contract — when to use, smart routing, rules, runtime architecture — lives in [`SKILL.md`](SKILL.md).

### Key Statistics

| Field | Value |
|-------|-------|
| Version | 1.0.0 |
| Library modules | 13 (10 deep-loop + 3 coverage-graph) |
| Script entry points | 4 (`convergence`, `upsert`, `query`, `status`) |
| Storage | `storage/deep-loop-graph.sqlite` (runtime-owned) |
| Tests | 21 vitest files + 1 shared helper |
| Predecessor ADRs | 117 SPLIT (superseded), 118 FULL_ISOLATE_NO_MCP (current) |
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:quick-start -->
## 2. QUICK START

### Invoke from a workflow YAML

```yaml
bash: 'node .opencode/skills/deep-loop-runtime/scripts/convergence.cjs --spec-folder "{spec_folder}" --loop-type "review" --session-id "{session_id}"'
outputs:
  - graph_decision
  - graph_signals_json
  - graph_blockers_json
  - graph_blockers_csv
  - graph_stop_blocked
```

### Invoke a script directly (operator)

```bash
node .opencode/skills/deep-loop-runtime/scripts/status.cjs \
  --spec-folder ".opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution" \
  --loop-type review \
  --session-id phase-006-smoke
```

Stdout is JSON. Exit codes: 0=ok, 1=script error, 2=DB error, 3=input validation error.

### Import a lib module (TypeScript)

```typescript
import { acquireLoopLock, releaseLoopLock } from '../../deep-loop-runtime/lib/deep-loop/loop-lock.js';
```
<!-- /ANCHOR:quick-start -->

---

<!-- ANCHOR:features -->
## 3. FEATURES

| Feature | Module | Purpose |
|---------|--------|---------|
| Executor config | `lib/deep-loop/executor-config.ts` | Schema + parsing for per-iteration executor settings |
| Executor audit | `lib/deep-loop/executor-audit.ts` | Appends `executor` block to iteration JSONL for non-native executor provenance |
| Prompt-pack rendering | `lib/deep-loop/prompt-pack.ts` | Renders the iteration prompt template |
| Post-dispatch validation | `lib/deep-loop/post-dispatch-validate.ts` | Validates iteration outputs (markdown + JSONL + delta) |
| Atomic state | `lib/deep-loop/atomic-state.ts` | Atomic state-log writes |
| JSONL repair | `lib/deep-loop/jsonl-repair.ts` | Recovers corrupt JSONL state lines |
| Loop lock | `lib/deep-loop/loop-lock.ts` | Single-writer locking |
| Permissions gate | `lib/deep-loop/permissions-gate.ts` | Permission scope checks |
| Bayesian scoring | `lib/deep-loop/bayesian-scorer.ts` | Convergence scoring |
| Fallback router | `lib/deep-loop/fallback-router.ts` | Executor fallback decision matrix |
| Coverage-graph DB | `lib/coverage-graph/coverage-graph-db.ts` | SQLite schema + node-kind allow-list + connection lifecycle |
| Coverage-graph query | `lib/coverage-graph/coverage-graph-query.ts` | Query builders |
| Coverage-graph signals | `lib/coverage-graph/coverage-graph-signals.ts` | Convergence signal extraction |
<!-- /ANCHOR:features -->

---

<!-- ANCHOR:structure -->
## 4. STRUCTURE

```text
.opencode/skills/deep-loop-runtime/
├── SKILL.md                              # operational contract (when to use, rules, routing)
├── README.md                             # this file
├── changelog/
│   └── v1.0.0.md                         # initial shipped release
├── lib/
│   ├── deep-loop/                        # 10 TS modules (executor, state, scoring, routing)
│   └── coverage-graph/                   # 3 TS modules (DB, query, signals)
├── scripts/                              # 4 .cjs entry points replacing the deleted MCP tools
│   ├── convergence.cjs
│   ├── upsert.cjs
│   ├── query.cjs
│   └── status.cjs
├── storage/
│   └── deep-loop-graph.sqlite            # runtime-owned SQLite
└── tests/
    ├── unit/                             # 13 per-module tests
    ├── integration/                      # 7 script + review-depth tests
    ├── lifecycle/                        # 1 DB lifecycle test
    └── _helpers/
        └── spawn-cjs.ts                  # shared test helper
```
<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:integration -->
## 5. INTEGRATION POINTS

| Consumer | How it integrates |
|----------|-------------------|
| `deep-review` workflow YAML | `bash: node .../scripts/<name>.cjs` invocations in `spec_kit_deep-review_{auto,confirm}.yaml` |
| `deep-research` workflow YAML | Mirror invocations in `spec_kit_deep-research_{auto,confirm}.yaml` |
| `deep-review/scripts/reduce-state.cjs` | TS imports from `lib/coverage-graph/` |
| `/doctor` command | Health checks via `scripts/status.cjs` invocation |
| `system-code-graph` playbook | Scenario 009 references the new script paths |
| `system-spec-kit/mcp_server/vitest.config.ts` | Cross-package test discovery via `'../deep-loop-runtime/tests/**/*.{vitest,test}.ts'` |

The 4 deleted `mcp__mk_spec_memory__deep_loop_graph_*` MCP tools have no replacement in the MCP layer — direct script invocation is now canonical.
<!-- /ANCHOR:integration -->

---

<!-- ANCHOR:related -->
## 6. RELATED DOCUMENTS

| Document | Purpose |
|----------|---------|
| [`SKILL.md`](SKILL.md) | Operational contract: when to use, smart routing, runtime architecture, RULES (ALWAYS / NEVER / ESCALATE IF) |
| [`changelog/v1.0.0.md`](changelog/v1.0.0.md) | Initial shipped release notes |
| `.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/spec.md` | Phase parent for the FULL_ISOLATE_NO_MCP arc |
| `.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/003-deep-loop-runtime/004-script-shim-db-relocation/decision-record.md` | ADR-001: script interface contract + DB lifecycle ownership transfer |
| `.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/003-deep-loop-runtime/005-mcp-tool-surface-removal/decision-record.md` | ADR-001: MCP tool surface removal rationale |
| `.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/003-deep-loop-runtime/001-core-isolation-deliberation/decision-record.md` | 117 council ruling (SPLIT, superseded by 118) |
| `.opencode/skills/deep-review/SKILL.md` | Consumer skill — deep-review (v1.4.0.0 depends on this runtime) |
| `.opencode/skills/deep-research/SKILL.md` | Consumer skill — deep-research |
<!-- /ANCHOR:related -->
