---
title: Deep Loop Runtime Integration Points
description: Consumer catalog for deep-review, deep-research, doctor, system-code-graph, tests, and script call shapes that depend on deep-loop-runtime.
trigger_phrases:
  - "deep-loop runtime integration"
  - "deep-review deep-loop-runtime"
  - "deep-research deep-loop-runtime"
  - "doctor deep-loop"
importance_tier: normal
contextType: implementation
---

# Deep Loop Runtime Integration Points

Consumer catalog for the shared runtime boundary owned by `.opencode/skills/deep-loop-runtime/`.

---

## 1. OVERVIEW

`deep-loop-runtime` is not a direct user command. It is a peer skill consumed by workflow YAMLs, tests, and operational diagnostics.

Integration surfaces:

- TypeScript imports from `lib/deep-loop/`.
- TypeScript imports from `lib/coverage-graph/`.
- Direct JSON stdout scripts under `scripts/`.
- Runtime SQLite storage under `database/`.

The removed MCP tool surface is not an integration point.

---

## 2. DEEP-REVIEW CONSUMER

| Surface | Call Shape | Purpose |
|---|---|---|
| `deep_review_auto.yaml` | `node .opencode/skills/deep-loop-runtime/scripts/convergence.cjs --spec-folder "{spec_folder}" --loop-type "review" --session-id "{session_id}"` | Graph convergence before stop decision. |
| `deep_review_auto.yaml` | `node .opencode/skills/deep-loop-runtime/scripts/upsert.cjs --spec-folder "{spec_folder}" --loop-type "review" --session-id "{session_id}" --nodes '{graph_nodes_json}' --edges '{graph_edges_json}'` | Persist reducer graph events. |
| `deep_review_confirm.yaml` | Same script family with confirm-mode sequencing. | Checkpointed graph upsert and convergence. |
| `deep-review/assets/prompt_pack_iteration.md.tmpl` | Optional `graphEvents` array in iteration JSONL. | Produces coverage graph source events. |
| `deep-review/scripts/reduce-state.cjs` | Imports coverage-graph runtime. | Consumes moved runtime helpers. |

Review graph semantics: `loopType` is `review`; node kinds include `DIMENSION`, `FILE`, `FINDING`, `EVIDENCE`, `REMEDIATION`, `BUG_CLASS`, `INVARIANT`, `PRODUCER`, `CONSUMER`, and `TEST`.

---

## 3. DEEP-RESEARCH CONSUMER

| Surface | Call Shape | Purpose |
|---|---|---|
| `deep_research_auto.yaml` | `node .opencode/skills/deep-loop-runtime/scripts/convergence.cjs --spec-folder "{spec_folder}" --loop-type "research" --session-id "{config.lineage.sessionId}"` | Graph convergence before inline stop vote. |
| `deep_research_auto.yaml` | `node .opencode/skills/deep-loop-runtime/scripts/upsert.cjs --spec-folder "{spec_folder}" --loop-type "research" --session-id "{config.lineage.sessionId}" --nodes '{graph_upsert_nodes_json}' --edges '{graph_upsert_edges_json}'` | Persist research graph events. |
| `deep_research_confirm.yaml` | Same script family with confirm-mode sequencing. | Checkpointed graph upsert and convergence. |
| `deep-research/assets/prompt_pack_iteration.md.tmpl` | Optional `graphEvents` array in iteration JSONL. | Produces research coverage graph source events. |

Research graph semantics: `loopType` is `research`; node kinds include `QUESTION`, `FINDING`, `CLAIM`, and `SOURCE`.

---

## 4. DOCTOR CONSUMER

`/doctor deep-loop` treats the runtime SQLite store as a mutating diagnostic route.

| Route | Target | Mutation class |
|---|---|---|
| `deep-loop` | `.opencode/skills/deep-loop-runtime/database/deep-loop-graph.sqlite` | `mutates` |

Doctor integration patterns:

- Run status-style probes against the graph.
- Snapshot or VACUUM the DB before mutating repairs.
- Rebuild graph rows from existing iteration markdown when lazy-init is available.
- Use upsert semantics rather than inventing graph state.
- Report empty graph with no sources as degraded, not repaired.

---

## 5. SYSTEM-CODE-GRAPH CONSUMER

`system-code-graph` no longer owns the deep-loop coverage graph, but it retains catalog and playbook references that point operators to current script paths.

Relevant references:

- `system-code-graph/feature_catalog/feature_catalog.md` says deleted `deep_loop_graph_*` MCP tools now live as direct `.cjs` scripts.
- `system-code-graph/feature_catalog/05--coverage-graph/deep-loop-graph-query.md` points to `scripts/query.cjs`.
- `system-code-graph/feature_catalog/05--coverage-graph/deep-loop-graph-status.md` points to `scripts/status.cjs`.
- `system-code-graph/feature_catalog/05--coverage-graph/deep-loop-graph-upsert.md` points to `scripts/upsert.cjs`.
- `system-code-graph/feature_catalog/05--coverage-graph/deep-loop-graph-convergence.md` points to `scripts/convergence.cjs`.

---

## 6. SYSTEM-SPEC-KIT TEST DISCOVERY

The runtime tests are discovered from the system-spec-kit MCP server Vitest config:

```text
.opencode/skills/system-spec-kit/mcp_server/vitest.config.ts
  '../deep-loop-runtime/tests/**/*.{vitest,test}.ts'
```

Production imports resolve from this skill's own `node_modules` via bare specifiers — no reach-in to a sibling skill's installed packages:

- `executor-config.ts` and `prompt-pack.ts` import `zod` (declared in this skill's `package.json`).
- `coverage-graph-db.ts`, `coverage-graph-signals.ts`, and `council/council-graph-db.ts` import `better-sqlite3` (declared here; pinned to the same version `system-spec-kit` uses so the native binding stays ABI-compatible).
- The `*.cjs` scripts boot the tsx loader through `require.resolve('tsx')`, which resolves from this skill's own `node_modules`.

The dependency versions are kept in lockstep with `system-spec-kit` (see `package.json`), which is why graph metadata still lists `system-spec-kit` under `depends_on`. The standalone suite runs via `npm test` (local `vitest.config.ts`); the combined CI run still discovers these tests through the `system-spec-kit` MCP server config above.

---

## 7. DIRECT OPERATOR CALLS

### Status

```bash
node .opencode/skills/deep-loop-runtime/scripts/status.cjs \
  --spec-folder ".opencode/specs/example" \
  --loop-type review \
  --session-id example-session
```

### Query

```bash
node .opencode/skills/deep-loop-runtime/scripts/query.cjs \
  --spec-folder ".opencode/specs/example" \
  --loop-type review \
  --session-id example-session \
  --query-type coverage_gaps
```

### Upsert

```bash
node .opencode/skills/deep-loop-runtime/scripts/upsert.cjs \
  --spec-folder ".opencode/specs/example" \
  --loop-type review \
  --session-id example-session \
  --nodes '[{"id":"dim-correctness","kind":"DIMENSION","name":"Correctness"}]' \
  --edges '[]'
```

### Convergence

```bash
node .opencode/skills/deep-loop-runtime/scripts/convergence.cjs \
  --spec-folder ".opencode/specs/example" \
  --loop-type review \
  --session-id example-session \
  --iteration 3 \
  --persist-snapshot true
```

---

## 7.1 ADDITIONAL CONSUMERS

The following consumers were surfaced by a deep-research audit and were absent from §2-§7 above:

| # | Consumer | Path | Integration Shape |
|---|----------|------|-------------------|
| 1 | `/deep:ai-council` command | `.opencode/commands/deep/assets/deep_ai-council_{auto,confirm}.yaml` | Loads 3 `lib/council/*.cjs` modules via require() for multi-seat dispatch + round-state JSONL + adjudicator scoring |
| 2 | `deep-ai-council` orchestration | `.opencode/skills/deep-loop-workflows/ai-council/scripts/orchestrate-{session,topic}.cjs` | 8 require() calls across all 5 `lib/council/*.cjs` modules |
| 3 | `/doctor` route manifest | `.opencode/commands/doctor/_routes.yaml:88-104` | gate3_location + 4 script_invocations + 4 trigger_phrases routing operator commands to deep-loop-runtime scripts |
| 4 | `/doctor` update command | `.opencode/commands/doctor/update.md:28, :220, :272` | References deep-loop scripts plus the `.pre-doctor-update.*.bak` backup-pattern reads |
| 5 | `system-code-graph` playbook | `.opencode/skills/system-code-graph/manual_testing_playbook/05--coverage-graph/009-*.md` + `010-*.md` | Operator scenarios exercising the coverage-graph scripts end-to-end |
| 6 | Legacy MCP server READMEs | `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/README.md:25-68` + `.../handlers/coverage-graph/README.md` | Original-location stubs documenting the runtime move |
| 7 | Doctor + deep-improvement | `.opencode/commands/doctor/assets/doctor_deep-loop.yaml` + `doctor_update.yaml` + `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/lib/README.md:26` | Cross-references to deep-loop runtime from doctor command assets and the deep-improvement script-lib documentation |

### Note: cross-package test discovery

`.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/review-depth-reducer.vitest.ts:9` imports `'../../../../deep-review/scripts/reduce-state.cjs'` - the test file lives in `mcp_server` but exercises `deep-review` code, and is discovered via deep-loop-runtime's vitest glob in `vitest.config.ts:20`. Effective SC-007 boundary for any deep-loop-runtime change is therefore tighter than the literal directory listing: changes to `deep-review/scripts/reduce-state.cjs` ALSO re-validate through deep-loop-runtime's test surface.

---

## 8. INTEGRATION RISKS

| Risk | Consequence | Guard |
|---|---|---|
| Script stdout stops being JSON-only | YAML output bindings break. | Preserve stdout contract. |
| Session id omitted | Graph state can bleed across lineages. | All scripts require `--session-id`. |
| MCP tools reintroduced | Runtime boundary regresses. | Follow `SKILL.md` NEVER rule. |
| DB not closed | SQLite handles remain open. | Keep `closeDb()` in `finally`. |
| Consumer YAML uses old MCP names | Graph integration fails. | Grep YAML for `deep-loop-runtime/scripts`. |

---

## 9. SOURCE ANCHORS

| Path | Role |
|---|---|
| `SKILL.md` | Runtime boundary and rules. |
| `README.md` | Human-facing layout and quick start. |
| `scripts/*.cjs` | Direct integration entry points. |
| `lib/deep-loop/*.ts` | Shared executor, validation, state, scoring, and permission primitives. |
| `lib/coverage-graph/*.ts` | Graph storage, query, and signal primitives. |
| `.opencode/commands/deep/assets/deep_review_auto.yaml` | Review auto consumer. |
| `.opencode/commands/deep/assets/deep_research_auto.yaml` | Research auto consumer. |
| `.opencode/commands/doctor/speckit.md` | Doctor route boundary. |
| `.opencode/skills/system-spec-kit/mcp_server/vitest.config.ts` | Runtime test discovery. |

