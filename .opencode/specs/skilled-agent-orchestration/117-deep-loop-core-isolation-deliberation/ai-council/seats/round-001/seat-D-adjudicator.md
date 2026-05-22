---
round: 1
seat: 4
seat_letter: D
executor: cli-codex
lens: adjudicator
model: gpt-5.5
reasoning: xhigh
status: complete
timestamp: 2026-05-22T17:05:21Z
advocates_summary:
  seat_a: ISOLATE
  seat_b: KEEP
  seat_c: SPLIT
convergence: "3-way-split-no-advocate-majority"
final_ruling: SPLIT
override_advocate_majority: false
---

# Seat D — Adjudicator

## Convergence Application

The council rule is 2-of-3 convergence among Seats A, B, and C. No such majority exists: Seat A recommends ISOLATE, Seat B recommends KEEP, and Seat C recommends SPLIT. Because this is a genuine 3-way split, Seat D adjudicates independently and the ruling is decisive. No OVERRIDE flag applies because there was no advocate majority to override.

## Strongest Argument Audit

Seat A's strongest point is the ownership inversion in `mcp_server/lib/deep-loop/`: executor policy, prompt rendering, post-dispatch validation, locking, state repair, scoring, and fallback routing are deep-loop runtime semantics with 100% deep-* consumption and no public MCP registration role. Its weakest point is treating the coverage-graph handlers and schema owner as equally movable; MCP tool dispatch and server-managed SQLite lifecycle are stronger ownership signals than caller count.

Seat B's strongest point is DB lifecycle coherence. If `deep-loop-graph.sqlite` is opened, migrated, and served by the `mk_spec_memory` MCP server, the schema-owner code must not drift into a skill folder without also moving lifecycle responsibility. Its weakest point is using that server-bound argument to defend the pure runtime libraries as well; those files do not need the MCP host to own them.

Seat C's strongest point is the MCP-binding boundary. It separates files by responsibility instead of by the current directory name: public tool handlers and SQLite schema stay with the server, while pure deep-loop runtime and interpretation helpers move to a shared runtime home. Its weakest point is that it introduces a new inter-skill dependency and requires careful import hygiene, but that is narrower and easier to test than a full relocation.

The strongest single argument across the three seats is the DB lifecycle point paired with MCP tool ownership: stable public tools and the single SQLite connection owner are hard contracts, while physical placement of pure libraries is an internal organization choice.

## Hidden Agreements

All seats agree that the current contested files are consumed only by deep-review and deep-research, and that there are no known non-deep production callers.

All seats agree that `deep-review` should not become the false owner of shared runtime code used by `deep-research`; any moved shared code needs a neutral deep-loop runtime home.

All seats agree that MCP tool IDs must remain stable. No valid ruling may rename `mcp__mk_spec_memory__deep_loop_graph_convergence`, `mcp__mk_spec_memory__deep_loop_graph_upsert`, `mcp__mk_spec_memory__deep_loop_graph_query`, or `mcp__mk_spec_memory__deep_loop_graph_status`.

All seats agree that partial relocation can be harmful if it crosses the wrong boundary. The disagreement is where the right boundary sits.

## Final Ruling

SPLIT. This aligns with Seat C. The decisive distinction is not "deep-specific" versus "spec-kit-specific"; it is MCP-bound versus pure runtime. Keep public MCP handlers and the SQLite schema/lifecycle owner in `system-spec-kit/mcp_server/` because those files define the server contract and state boundary. Move the pure deep-loop runtime libraries, plus graph query/signals helpers that interpret loop state rather than own the DB connection, into a peer `.opencode/skills/deep-loop-runtime/` skill. This preserves non-negotiable tool ID stability, keeps the DB owner coherent, and removes the clearest ownership inversion with less irreversible churn than full isolation.

## Risk Register

| Risk | Severity | Owner | Mitigation |
|------|----------|-------|------------|
| MCP tool ID stability | Critical | `system-spec-kit` MCP host | Keep `mcp_server/tools/index.ts`, tool schemas, and public names unchanged; add or retain regression coverage proving all `mcp__mk_spec_memory__deep_loop_graph_*` tool IDs still register. |
| DB lifecycle coherence | High | `system-spec-kit` MCP server | Keep `coverage-graph-db.ts` with the server-owned SQLite lifecycle; do not move schema-owner code unless a later packet also moves open/close/migration responsibility. |
| PR churn / merge conflicts | Medium | Migration implementer | Move pure runtime files in one scoped packet; avoid opportunistic renames; update YAML imports and tests mechanically with reviewable file maps. |
| Future cross-consumer use cases | Medium | Deep-loop runtime owner | Define `.opencode/skills/deep-loop-runtime/SKILL.md` as shared runtime infrastructure, not deep-review-specific code, so later deep-loop consumers can depend on it directly. |
| Reversibility | Medium | Packet owner | SPLIT is more reversible than ISOLATE: server-bound files remain stable, and moved runtime libraries can be re-exported or moved again without changing MCP public IDs or DB ownership. |
| Import boundary drift | Medium | Deep-loop runtime owner and `system-spec-kit` owner | Expose narrow imports from the runtime skill; keep server handlers from reaching into workflow-only assets; document allowed dependency direction. |
| Test coverage gaps | High | Migration implementer | Split tests by responsibility: runtime unit tests move with runtime files, while MCP registration, handler, and DB lifecycle tests stay under `system-spec-kit`. |

## Migration Outline

Keep these MCP-bound handler files in `.opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/`:

- `convergence.ts`
- `upsert.ts`
- `query.ts`
- `status.ts`
- `index.ts`

Keep this DB lifecycle and schema-owner file in `.opencode/skills/system-spec-kit/mcp_server/lib/coverage-graph/`:

- `coverage-graph-db.ts`

Move these pure deep-loop runtime files from `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/` to `.opencode/skills/deep-loop-runtime/lib/deep-loop/`:

- `executor-config.ts`
- `executor-audit.ts`
- `prompt-pack.ts`
- `post-dispatch-validate.ts`
- `atomic-state.ts`
- `jsonl-repair.ts`
- `loop-lock.ts`
- `permissions-gate.ts`
- `bayesian-scorer.ts`
- `fallback-router.ts`

Move these graph interpretation helpers from `.opencode/skills/system-spec-kit/mcp_server/lib/coverage-graph/` to `.opencode/skills/deep-loop-runtime/lib/coverage-graph/`:

- `coverage-graph-query.ts`
- `coverage-graph-signals.ts`

Preserve these host-facing MCP contract files in `.opencode/skills/system-spec-kit/mcp_server/`:

- `tools/index.ts`
- `tool-schemas.ts`
- `schemas/tool-input-schemas.ts`

Preserve the public tool names exactly:

- `mcp__mk_spec_memory__deep_loop_graph_convergence`
- `mcp__mk_spec_memory__deep_loop_graph_upsert`
- `mcp__mk_spec_memory__deep_loop_graph_query`
- `mcp__mk_spec_memory__deep_loop_graph_status`

Update these workflow YAML references from `system-spec-kit/mcp_server/lib/deep-loop/*` to `deep-loop-runtime/lib/deep-loop/*`:

- `.opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml`
- `.opencode/commands/spec_kit/assets/spec_kit_deep-review_confirm.yaml`
- `.opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- `.opencode/commands/spec_kit/assets/spec_kit_deep-research_confirm.yaml`

Update graph helper imports from `system-spec-kit/mcp_server/lib/coverage-graph/{coverage-graph-query,coverage-graph-signals}` to `deep-loop-runtime/lib/coverage-graph/{coverage-graph-query,coverage-graph-signals}` where used. Keep direct DB imports server-local unless an explicit adapter is introduced.

Move or split tests by ownership:

- Runtime unit tests for executor config, executor audit, prompt packs, validation, atomic state, JSONL repair, locks, permissions, Bayesian scoring, fallback routing, query helpers, and signal helpers move to `.opencode/skills/deep-loop-runtime/tests/`.
- MCP integration, handler dispatch, tool registration, schema, migration, and DB lifecycle tests remain under `.opencode/skills/system-spec-kit/mcp_server/tests/`.

Add `.opencode/skills/deep-loop-runtime/SKILL.md` declaring scope: shared deep-loop execution, validation, state-file safety, scoring, fallback routing, and graph interpretation infrastructure for deep-review and deep-research. It must also state that `system-spec-kit` remains the MCP host and owner of public `deep_loop_graph_*` tool IDs and SQLite lifecycle.

## Plan Confidence

92/100. The file responsibilities divide cleanly enough to act, and SPLIT preserves the two hardest constraints: stable MCP tool IDs and a single DB lifecycle owner.

## Council Composition

| Seat | Strategy Lens | AI Vantage Target | Distinct Mandate | Confidence |
|------|---------------|-------------------|------------------|------------|
| seat-A | Isolation Architect | cli-codex gpt-5.5 xhigh | Advocate for full relocation | 94/100 |
| seat-B | Status-Quo Defender | cli-codex gpt-5.5 xhigh | Advocate for current placement | 88/100 |
| seat-C | Pragmatist | cli-codex gpt-5.5 high | Advocate for MCP-binding split | 91/100 |
| seat-D | Adjudicator | cli-codex gpt-5.5 xhigh | Synthesize + rule | 92/100 |

## Recommended Plan

- Record the ADR direction as SPLIT, explicitly rejecting any rename of `mcp__mk_spec_memory__deep_loop_graph_*` tools.
- Create `.opencode/skills/deep-loop-runtime/` with a minimal `SKILL.md` and runtime/test folders.
- Move the ten `lib/deep-loop/` runtime files to `.opencode/skills/deep-loop-runtime/lib/deep-loop/`.
- Move `coverage-graph-query.ts` and `coverage-graph-signals.ts` to `.opencode/skills/deep-loop-runtime/lib/coverage-graph/`.
- Keep `handlers/coverage-graph/*`, `coverage-graph-db.ts`, `tools/index.ts`, `tool-schemas.ts`, and `schemas/tool-input-schemas.ts` in `system-spec-kit`.
- Update deep-review and deep-research YAML imports to the runtime skill paths.
- Split tests along the same boundary: pure runtime tests with `deep-loop-runtime`, MCP registration/handler/DB lifecycle tests with `system-spec-kit`.
- Add verification gates for MCP tool registration, SQLite lifecycle, workflow YAML path validity, and runtime unit tests.

---

Recommendation: SPLIT
