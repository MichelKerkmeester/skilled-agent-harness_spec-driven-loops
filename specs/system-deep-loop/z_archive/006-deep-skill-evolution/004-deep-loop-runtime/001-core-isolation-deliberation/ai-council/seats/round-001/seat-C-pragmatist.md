---
round: 1
seat: 3
seat_letter: C
executor: cli-codex
lens: pragmatist
model: gpt-5.5
reasoning: high
status: complete
timestamp: 2026-05-22T17:02:44Z
---

# Seat C — Pragmatist

## Position

Split the contested files along the MCP-binding boundary: keep the MCP handlers and SQLite schema owner inside `system-spec-kit/mcp_server/`, but move the pure deep-loop runtime libraries out of the MCP server tree into an explicit deep-loop runtime home consumed by `deep-review` and `deep-research`. The dependency survey proves the code is deep-* specific, but it does not prove every file has the same owner. The honest contract is narrower: the MCP server owns tool registration, public IDs, and database lifecycle; the deep-* runtime owns executor policy, prompt rendering, validation, state repair, locking, scoring, fallback behavior, and graph interpretation helpers.

## Argument

The current debate is too binary. Seat A is right that `lib/deep-loop/` is misplaced under a generic spec-kit MCP server path. Seat B is right that MCP handlers and server-managed SQLite code should not be pulled into skill folders just because their current callers are deep-review and deep-research. Those two claims do not conflict. They define the actual boundary.

The five files in `handlers/coverage-graph/` are MCP-server code. They register and dispatch `mcp__mk_spec_memory__deep_loop_graph_*` tools, so their physical location should match the server namespace that exposes them. Keeping `convergence.ts`, `upsert.ts`, `query.ts`, `status.ts`, and `index.ts` under `system-spec-kit/mcp_server/handlers/coverage-graph/` preserves the same convention used by the other server handler families. Moving them would make the MCP server reach outward into skill-owned implementation paths for its public tool surface, which is a less honest contract.

`coverage-graph-db.ts` is also server-bound. It owns the SQLite schema and node-kind allow-list for `deep-loop-graph.sqlite`, and that database is opened, migrated, and closed as MCP-server state. The schema owner should stay with the connection lifecycle. Moving the DB file while leaving the database lifecycle in the MCP server creates a split-brain risk: future schema changes would look skill-owned, while operational responsibility would remain server-owned.

The ten files in `lib/deep-loop/` are different. `executor-config.ts`, `executor-audit.ts`, `prompt-pack.ts`, `post-dispatch-validate.ts`, `atomic-state.ts`, `jsonl-repair.ts`, `loop-lock.ts`, `permissions-gate.ts`, `bayesian-scorer.ts`, and `fallback-router.ts` do not register tools and do not need the MCP server lifecycle. They are the deep-loop execution runtime. Keeping them under `mcp_server/lib/deep-loop/` makes workflow YAML import private iteration semantics from a server package that is only incidentally hosting them.

The same logic applies to `coverage-graph-query.ts` and `coverage-graph-signals.ts`. They are not the database lifecycle owner; they are graph interpretation helpers. They can move with the deep-loop runtime while continuing to call the MCP-hosted graph tools or import the server-owned DB adapter through a narrow interface. This gives each side a cleaner contract: deep-* code computes and interprets deep-loop behavior, while the MCP server exposes stable tools and stores server-managed state.

## Risks of opposing positions

Seat A's full relocation overreaches. Moving the five coverage-graph handlers breaks the repo's MCP convention for handler placement: server-exposed tools live under the server's handler tree. Moving `coverage-graph-db.ts` also blurs database lifecycle ownership. If the MCP server owns `deep-loop-graph.sqlite`, then the schema and connection-adjacent code should remain there unless the whole DB lifecycle moves too, and that is outside the useful scope of this cleanup.

Seat B's status-quo defense is correct only for the server-bound subset. "Shared infrastructure deserves a shared host" is a reasonable argument for MCP handlers and SQLite lifecycle code, but it does not justify parking pure deep-loop libraries under `mcp_server/lib/`. Caller count is not ownership proof by itself, yet here it lines up with file responsibilities: the pure libraries are deep-review/deep-research runtime internals with zero non-deep consumers and no MCP registration role.

The cost of doing nothing is not just documentation debt. It preserves an inverted dependency where workflow code reaches into `system-spec-kit/mcp_server/lib/deep-loop/` for executor behavior and validation. An ADR can explain why server-bound files stay, but documenting the pure-library inversion would mostly memorialize a layout mistake.

## Migration outline

Keep these files in `.opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/`: `convergence.ts`, `upsert.ts`, `query.ts`, `status.ts`, and `index.ts`. They remain the registration and dispatch implementation for `mcp__mk_spec_memory__deep_loop_graph_convergence`, `mcp__mk_spec_memory__deep_loop_graph_upsert`, `mcp__mk_spec_memory__deep_loop_graph_query`, and `mcp__mk_spec_memory__deep_loop_graph_status`. MCP tool IDs are preserved because the handlers and server registration path do not move.

Keep `.opencode/skills/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts` in place. If desired, rename it locally to `db.ts` only in a later cleanup, but do not mix that rename into the ownership migration. This file remains the schema and SQLite lifecycle boundary for `deep-loop-graph.sqlite`.

Move these ten files from `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/` to a new peer runtime skill at `.opencode/skills/deep-loop-runtime/lib/deep-loop/`: `executor-config.ts`, `executor-audit.ts`, `prompt-pack.ts`, `post-dispatch-validate.ts`, `atomic-state.ts`, `jsonl-repair.ts`, `loop-lock.ts`, `permissions-gate.ts`, `bayesian-scorer.ts`, and `fallback-router.ts`.

Move these two files from `.opencode/skills/system-spec-kit/mcp_server/lib/coverage-graph/` to `.opencode/skills/deep-loop-runtime/lib/coverage-graph/`: `coverage-graph-query.ts` and `coverage-graph-signals.ts`. They should depend on the MCP-server-owned DB boundary through an explicit import or adapter, not by implying ownership of the database lifecycle.

Use Option C1: create `.opencode/skills/deep-loop-runtime/` as the shared runtime home for both `deep-review` and `deep-research`. Option C2 makes `deep-research` depend on `deep-review`, which is a false owner. Option C3 keeps the files under `system-spec-kit/shared/`, which improves the path name but still leaves deep-loop runtime semantics inside spec-kit. A peer `deep-loop-runtime` skill states the real ownership without violating the MCP server boundary.

Update deep-review and deep-research workflow YAML imports from `system-spec-kit/mcp_server/lib/deep-loop/*` to `deep-loop-runtime/lib/deep-loop/*`, and update imports for graph query/signals to `deep-loop-runtime/lib/coverage-graph/*`. Leave server handler imports pointed at the server tree. Keep `mcp_server/tests/deep-loop/` only for MCP integration and DB lifecycle behavior; move pure-library tests with the relocated runtime, or split existing tests by what they actually exercise.

## Confidence

91/100. The file responsibilities line up cleanly with the proposed boundary: six files are genuinely MCP-server-bound, while twelve are pure deep-loop runtime libraries with no server lifecycle contract.

---

Recommendation: SPLIT
