# Iteration 003 — Imports, shell-outs, CI, shared contracts

## Focus

Which imports, shell-outs, scripts, CI jobs, and shared contracts invoke the code-graph stack (Q3), including coverage-graph exclusion.

## Actions Taken

1. Read `.github/workflows/isolation-check.yml` code-graph isolation jobs.
2. Inspected `code-graph-boundary.ts`, `code-graph-contracts.ts`, `code-index-cli-fallback.ts`.
3. Traced consumers: `context-server.ts` import, session-cleanup, orphan sweeper, worktree-session, launcher-ipc-bridge, mk-spec-memory-launcher.
4. Checked deep-loop coverage-graph schema ownership vs mk_code_index.
5. Noted `.gitignore` DB paths, `.env.local` maintainer-mode (value redacted), mcp-route-guard allowlist, setup-maintainer-filters.sh.

## Findings

### F12 — CI isolation-check is a bidirectional hard gate
[SOURCE: .github/workflows/isolation-check.yml:19-61,110-126]
- Fails if `system-spec-kit` TS imports `system-code-graph` directly (must use boundary / shared contracts).
- Fails reverse: `system-code-graph` must not import `system-spec-kit` or `@spec-kit/*`.
**Decommission implication:** after skill removal, either delete these jobs or retarget them to assert absence of both packages / leftover imports. **Keep-until-deleted** — premature CI removal hides regressions during staged teardown.

### F13 — Spec-kit process boundary is a live IPC consumer (keep-behind-fallback candidate)
[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/code-graph-boundary.ts]
- Hard-coded relative paths to `../../../system-code-graph/mcp-server/database/` and readiness marker.
- `callCodeGraphTool('code_graph_status'|...)` via MCP client named `mk-spec-memory-code-graph-boundary`.
[SOURCE: context-server.ts:101] — `import { callCodeGraphTool } from './lib/code-graph-boundary.js'`
[SOURCE: hooks/code-index-cli-fallback.ts:65,386] — warm CLI fallback; dbDir under skill tree.
[SOURCE: shared/code-graph-contracts.ts] — neutral shared types still name `code_graph_*` operator guidance.

**Recommendation:** either stub boundary to always-unavailable (fallback Grep path) **before** deleting the skill, or delete boundary + rewrite all callers in the same change set. Prefer stub-first for rollback.

### F14 — Lifecycle scripts and sibling launchers encode service identity
| File | Touch |
|------|-------|
| `session-cleanup.sh:99-102` | Pattern-match launcher + `system-code-graph/mcp-server/dist/index.js` |
| `orphan-mcp-sweeper.sh:209-213` | Classifies `mk-code-index-launcher` / `code-graph-server` |
| `worktree-session.sh:88-89,211` | Copies/excludes skill node_modules/dist; WT DB dir |
| `launcher-ipc-bridge.cjs:89` | `serviceName === 'mk-code-index'` DB path logic |
| `mk-spec-memory-launcher.cjs:102+` | `canonicalCodeGraphDbDir` under skill; SPECKIT_CODE_GRAPH_DB_DIR messaging |
| `mcp-route-guard.cjs:49` | Allowlist entry `'mk_code_index'` |

### F15 — Coverage graph is NOT mk_code_index (negative knowledge)
[SOURCE: .opencode/skills/system-deep-loop/runtime/references/coverage-graph-schema.md:22]
Deep-loop **coverage graph** is session-scoped evidence under `runtime/lib/coverage-graph/` — distinct subsystem. Do **not** delete deep-loop coverage-graph when decommissioning `mk_code_index`.

### F16 — Local/runtime state surfaces
[SOURCE: .gitignore:165-186] — skill-local sqlite and launcher state paths.
[SOURCE: .env.local:5] — `SPECKIT_CODE_GRAPH_MAINTAINER_MODE` (gitignored; untracked) — operator-local; inventory only, do not commit edits.
[SOURCE: scripts/setup-maintainer-filters.sh:2] — git filters for maintainer-mode code-graph config hygiene.

## Questions Answered

- Q3 (substantial): CI, boundary/contracts, cleanup/sweeper/worktree/launcher bridge, route-guard.
- Q5 (partial): coverage-graph false positive ruled out; `.env.local` is local-only.

## Questions Remaining

- Q4: Full ordering + rollback risk graph.
- Doctrine/command/doc residual inventory refinements (iter 4).

## Ruled Out

- Treating deep-loop coverage-graph as part of mk_code_index decommission.
- One-sided delete of skill without stubbing/removing `code-graph-boundary` consumers (would break spec-memory MCP build/runtime).
- Editing `.env.local` as a tracked decommission task.

## Next Focus

Doctrine/doc/command residual surfaces + archival classification pass (Q5 completion), then ordering/rollback synthesis (Q4).

## SCOPE VIOLATIONS

None.
