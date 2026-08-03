# Iteration 012 — Exact advisor-index handoff commands

## Focus

Determine the exact CLI forms `/create:skill-parent` and `/doctor:skill-advisor` should print for graph refresh, graph validation, and advisor rebuild, while keeping all index mutations operator-owned.

## Actions Taken

- Read the current iteration state, strategy, configuration, and iteration-011 narrative before selecting this focus. The prior conclusion that create and doctor should expose a shared handoff, without auto-running index mutations, remains in force.
- Re-ran `node .opencode/bin/install-codex-hooks.mjs --check`. It exited 1 at the linked-worktree guard and identified `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public` as the primary checkout. The check did not write anything. [SOURCE: command result; `.opencode/bin/install-codex-hooks.mjs:286-317`]
- Read the live `skill-advisor` CLI help, parser, tool handlers, tests, MCP-surface references, and the doctor route/workflow. [SOURCE: `.opencode/skills/system-skill-advisor/mcp-server/skill-advisor-cli.ts:382-535,688-725`; `.opencode/commands/doctor/_routes.yaml:99-116`; `.opencode/commands/doctor/assets/doctor-skill-advisor.yaml:318-326`]

## Findings

1. **F12-01 — The three commands have different argument and trust contracts (P1).** The executable forms are:

   ```bash
   # Run these from the selected canonical checkout.
   cd "<selected_repo>"

   # Graph refresh; mutation, therefore trusted.
   node .opencode/bin/skill-advisor.cjs skill_graph_scan --trusted --skills-root .opencode/skills --format json

   # Graph integrity validation; read-only and takes no tool arguments.
   node .opencode/bin/skill-advisor.cjs skill_graph_validate --format json

   # Native advisor refresh; mutation, therefore trusted.
   node .opencode/bin/skill-advisor.cjs advisor_rebuild --trusted --workspace-root "$PWD" --force true --format json
   ```

   `skill_graph_scan` accepts `skillsRoot` and defaults to `.opencode/skills`; `skill_graph_validate` has an empty input schema; `advisor_rebuild` accepts `workspaceRoot` and `force`. The CLI accepts both kebab-case flags and their schema property names, but the explicit kebab-case forms above match the existing doctor conventions. [SOURCE: `.opencode/skills/system-skill-advisor/mcp-server/handlers/skill-graph/scan.ts:18-55`; `.opencode/skills/system-skill-advisor/mcp-server/handlers/skill-graph/validate.ts:42-110`; `.opencode/skills/system-skill-advisor/mcp-server/handlers/advisor-rebuild.ts:46-115`; `.opencode/skills/system-skill-advisor/mcp-server/skill-advisor-cli.ts:382-535,688-725`; `.opencode/skills/system-skill-advisor/mcp-server/tests/skill-advisor-cli-job-semantics.vitest.ts:83-91`]

2. **F12-02 — The checkout change is part of the command contract (P1).** The scan handler resolves `skillsRoot` relative to its process workspace and rejects a path outside that workspace. Passing the primary checkout's absolute `.opencode/skills` path while still standing in a linked worktree will therefore fail the workspace escape guard. The handoff must show `selected_repo` and start with `cd "<selected_repo>"`; `--allow-worktree` is unrelated and remains ruled out as source selection. [SOURCE: `.opencode/skills/system-skill-advisor/mcp-server/handlers/skill-graph/scan.ts:39-47`; `.opencode/skills/system-skill-advisor/mcp-server/skill-advisor-cli.ts:1235-1258`; prior linked-worktree check result]

3. **F12-03 — Scan and rebuild should not be printed as an unconditional three-command chain (P1).** Both operations index checked-in skill metadata into the live graph, but they are separate maintenance paths: scan also refreshes skill embeddings and publishes a `skill_graph_scan` generation, while rebuild indexes the workspace's `.opencode/skills` tree and publishes an `advisor_rebuild` generation. The handoff should present one explicit refresh choice, followed by `skill_graph_validate`; it should label every mutation `NOT RUN` until the operator invokes it. Use `skill_graph_scan` for a graph-specific refresh, or `advisor_rebuild` for the native advisor freshness repair. [SOURCE: `.opencode/skills/system-skill-advisor/mcp-server/handlers/skill-graph/scan.ts:49-63`; `.opencode/skills/system-skill-advisor/mcp-server/handlers/advisor-rebuild.ts:70-115`; `.opencode/skills/system-skill-advisor/feature-catalog/mcp-surface/advisor-rebuild.md`]

4. **F12-04 — The current doctor route does not expose `skill_graph_validate` in its declared MCP surface (P1).** `/doctor:skill-advisor` declares `mutating: mutates`, lists `skill_graph_scan` and `advisor_rebuild`, but omits `skill_graph_validate` from `mcp_tools`. Its Phase 4 rebuild is correctly gated behind the doctor workflow's prior approval and runs `advisor_rebuild({ force: true })` after approved scorer or metadata edits; that is not a general post-create diagnostic. The shared handoff therefore needs either a CLI fallback for `skill_graph_validate` or a later route metadata/allowlist alignment change. [SOURCE: `.opencode/commands/doctor/_routes.yaml:99-116`; `.opencode/commands/doctor/assets/doctor-skill-advisor.yaml:318-326`; `.opencode/skills/system-skill-advisor/mcp-server/skill-advisor-cli.ts:688-725`]

5. **F12-05 — The minimal presentation contract is now precise (P1).** Both create and doctor should render the same fields: `selected_repo`, `current_checkout`, `primary_checkout`, `hub_identity`, `generated_metadata`, `graph_refresh: NOT RUN`, `advisor_rebuild: NOT RUN`, and `validation: NOT RUN`. The operator handoff should then print the selected-checkout block and the two refresh alternatives, with graph validation after the chosen refresh. This keeps source selection, generated-file validation, graph mutation, and advisor mutation as separate statuses. [INFERENCE: based on findings F12-01 through F12-04 and `.opencode/commands/create/skill-parent.md:65-78`]

## Questions Answered

- **Exact CLI forms:** use `skill_graph_scan --trusted --skills-root .opencode/skills`, `skill_graph_validate` with no input flags, and `advisor_rebuild --trusted --workspace-root "$PWD" --force true`; all use `--format json` in a machine-readable handoff.
- **Canonical checkout handling:** print and select the checkout first, then run the commands from that checkout. Do not use `--allow-worktree` as a source selector.
- **Ordering and ownership:** print one operator-selected refresh (`skill_graph_scan` or `advisor_rebuild`), then `skill_graph_validate`; create and the read-only portion of doctor report `NOT RUN` and do not invoke either mutation automatically.
- **Doctor gap:** `skill_graph_validate` is live in the CLI/tool registry but absent from the `/doctor:skill-advisor` route's declared MCP tool list.

## Questions Remaining

- Should the shared handoff be implemented as one reusable formatter consumed by create and doctor, or as duplicated presentation fields guarded by a contract test?
- Should `doctor:skill-advisor` add `skill_graph_validate` to its route metadata, or should the route keep validation CLI-only while its MCP allowlist remains mutation-focused?
- Should the doctor warn on `description.json` vocabulary divergence from registry/graph vocabulary, or only report the existing structural checks?

## Next Focus

Compare the create and doctor presentation assets field-by-field and determine the smallest reusable handoff contract/test that can carry the selected-checkout, hub-identity, generated-metadata, refresh, and validation statuses without changing mutation ownership.

## Sources Consulted

- `.opencode/bin/install-codex-hooks.mjs`
- `.opencode/commands/doctor/_routes.yaml`
- `.opencode/commands/doctor/assets/doctor-skill-advisor.yaml`
- `.opencode/commands/create/skill-parent.md`
- `.opencode/skills/system-skill-advisor/mcp-server/skill-advisor-cli.ts`
- `.opencode/skills/system-skill-advisor/mcp-server/handlers/skill-graph/scan.ts`
- `.opencode/skills/system-skill-advisor/mcp-server/handlers/skill-graph/validate.ts`
- `.opencode/skills/system-skill-advisor/mcp-server/handlers/advisor-rebuild.ts`
- `.opencode/skills/system-skill-advisor/feature-catalog/mcp-surface/{skill-graph-scan,skill-graph-validate,advisor-rebuild}.md`
- `.opencode/skills/system-skill-advisor/mcp-server/tests/skill-advisor-cli-job-semantics.vitest.ts`

## Assessment

- New information ratio: 0.86
- Status: insight
- No researched target files were modified.

