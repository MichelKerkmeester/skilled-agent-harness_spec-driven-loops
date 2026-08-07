# Resource Map

## Tooling and Root Policy

| Resource | Relevance | Evidence |
|---|---|---|
| `.opencode/skills/system-spec-kit/scripts/spec/create.sh` | Default packet writer, containment, identity fallback | Iteration 1 |
| `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` | Explicit-folder validation and packet exception | Iteration 1 |
| `.opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts` | Parameterized description generation | Iteration 1 |
| `.opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts` | Scoped identity plus old-root default | Iteration 1 |
| `.opencode/skills/system-spec-kit/scripts/core/spec-root-canonical-resolver.ts` | Current canonical/legacy semantics | Iterations 1, 5 |
| `.opencode/skills/system-spec-kit/scripts/core/spec-root-registry.ts` | Inventory of 21 resolver groups | Iterations 1, 5 |

## Runtime Mirrors

| Resource | Relevance | Evidence |
|---|---|---|
| `.opencode/skills/system-spec-kit/scripts/runtime-mirrors/sync-runtime-mirrors.cjs` | Does not own specs links | Iteration 2 |
| `.claude/SYNC.md` | Stale claim of `.claude/specs` link | Iteration 2 |
| `.codex/SYNC.md`, `.cursor/SYNC.md`, `.devin/SYNC.md`, `.pi/SYNC.md` | Runtime sync declarations and generated/authored behavior | Iteration 2 |

## Git and Downstream

| Resource | Relevance | Evidence |
|---|---|---|
| `.gitignore` | Source-repository negations and path-specific exclusions | Iteration 3 |
| `~/.gitignore_global` | Downstream global exclusion of both roots | Iteration 3 |
| Git index entry `specs` | Mode 120000 and relative payload | Iteration 3 |
| `PUBLIC-RELEASE.md` | Downstream shared `.opencode` and project-spec setup | Iteration 3 |
| `.opencode/skills/system-spec-kit/scripts/references/spec-root-alias-retirement-runbook.md` | Stale absolute-link premise | Iteration 3 |

## Memory MCP

| Resource | Relevance | Evidence |
|---|---|---|
| `mcp-server/handlers/memory-index-discovery.ts` | Old-root-first document and graph discovery | Iteration 4 |
| `mcp-server/lib/search/folder-discovery.ts` | Top-level-first generic discovery | Iteration 4 |
| `mcp-server/api/indexing.ts` | Direct/discovery/fallback resolution | Iteration 4 |
| `mcp-server/startup-checks.ts` | Old-root-only drift rename containment | Iteration 4 |
| `mcp-server/context-server.ts` | Pending recovery, physical-path deletes, description refresh | Iteration 4 |
| `mcp-server/lib/resume/resume-ladder.ts` | Old-root-first packet resume | Iteration 4 |
| `mcp-server/lib/continuity/authored-continuity-snapshot.ts` | Old-root-first continuity resolution | Iteration 4 |
| `mcp-server/lib/config/spec-doc-paths.ts` | Shared root-relative spec-folder identity | Iteration 4 |
| `mcp-server/lib/parsing/memory-parser.ts` | Symlink canonicalization and folder extraction | Iteration 4 |
| `mcp-server/core/config.ts` | Database path independence | Iteration 4 |

## Migration and Verification

| Resource | Relevance | Evidence |
|---|---|---|
| `scripts/core/spec-root-migration.ts` | Quarantine, verified move, rollback | Iteration 5 |
| `scripts/core/spec-root-migration-manifest.ts` | Deterministic file-set manifest | Iteration 5 |
| `scripts/core/spec-root-write-guard.ts` | Divergent-root write blocking | Iteration 5 |
| `scripts/tests/spec-root-validation-matrix.vitest.ts` | Ten physical-root states | Iteration 5 |
| `scripts/tests/spec-root-fault-injection.vitest.ts` | Freeze, cross-device failure, rollback | Iteration 5 |
| `.github/workflows/strict-pass-freshness-sweep.yml` | Explicit old-root CI input | Iteration 5 |
| `.github/workflows/runtime-no-spec-import.yml` | Mutable-spec import guard | Iteration 5 |
| `AGENTS.md` | Current canonical path policy | Iteration 5 |

## Coverage Gaps

- Live Memory MCP reindex and drift recovery were not run.
- The migration/fault-injection suite was inspected but not executed because it writes temporary fixtures outside the lineage.
- Exact implementation edit count requires classifying each literal hit as executable, current documentation, historical evidence, or negative fixture.
- Downstream project-local specs ownership is an operator decision.
