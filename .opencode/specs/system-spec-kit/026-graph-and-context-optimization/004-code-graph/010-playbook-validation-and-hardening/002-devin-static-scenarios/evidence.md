# Phase 002 — Devin Static Scenarios: Evidence Log

**Executor:** cli-devin → `--model swe-1.6 --permission-mode auto --agent-config <recipe>` (RCAF + medium pre-planning, standard bundle-gate)
**Capture:** `-p` print mode, `2>&1 </dev/null`, output in `scratch/evidence-<id>-stdout.log`
**Dispatch discipline:** sequential, SIGKILL between dispatches.

## Harness-validated facts (smoke test)

- **agent-config recipe shape accepted** by `devin` (no "Failed to parse agent config" / "untagged enum McpServer"). The 5-key read-only recipe (`system_instructions`, `allowed_tools`, `permissions.allow/deny`) parses and dispatches cleanly.
- **sequential_thinking trace not visible in `-p` output.** Devin print mode does not surface tool-call traces, so positive confirmation of the ≥5-thought call is not available from stdout (known limitation per `cli-devin/references/agent-config-recipes.md` §8). Enforcement is in place via (1) registered `sequential_thinking` MCP server in `devin mcp list` and (2) the `system_instructions` mandate.

## Findings surfaced

- **F-020-1 (playbook staleness):** scenario 020 documents an expected launcher tool count of **11**, but the actual runtime exposes **8** tools (consistent with CLAUDE.md §6 "mk_code_index, 8 tools"). The build/entry-point checks themselves PASS; the count expectation is stale. Recommend reconciling scenario 020's "Expected signals" (11 → 8) in a follow-on playbook-doc packet.
- **F-019-1 (legacy DB persists — P1, possible active misbinding):** a legacy DB at `.opencode/skills/system-code-graph/mcp_server/database/code-graph.sqlite` (106,496 B) still exists alongside the canonical 68 MB DB. The 106,496-byte size matches the runtime's reported `dbFileSize` in smoke-006 (empty graph), suggesting the MCP runtime may be reading the empty legacy DB rather than the populated canonical one — which would explain the empty-graph appearance across this run. Recommend: verify the active DB binding/config path and remove the legacy DB file. **Follow-on remediation packet, not fixed here.**
- **F-021-1 (playbook label mismatch):** the playbook index labels scenario 021 "unicode-normalization fix from 009", but the actual `unicode-normalization-fix-from-009.md` content is "root dist cleanup verification". Doc label vs content drift; recommend reconciling.
- **F-025-1 (Devin hook registration broken — P1, confirmed):** `.devin/hooks.v1.json` registers the SessionStart hook at `.opencode/skills/system-code-graph/dist/system-spec-kit/mcp_server/hooks/devin/session-start.js` — a path that does NOT exist. The actual compiled hook is at `.opencode/skills/system-spec-kit/mcp_server/dist/hooks/devin/session-start.js`. The hook code is correct (fail-open, disable-env, all sources emit context), but the broken registration path means the hook will not fire in a real Devin session. Recommend: fix the `command` path in `.devin/hooks.v1.json`. **Follow-on remediation packet, not fixed here.**

## Verdict table

| ID | Scenario | Verdict | Reason | Evidence |
|----|----------|---------|--------|----------|
| 016 | MCP tool manifest post-rename | **PASS** | Exactly 8 distinct tools, no legacy `system_code_graph` names: code_graph_scan, query, status, context, classify_query_intent, verify, apply, detect_changes. | `scratch/evidence-F-stdout.log` |
| 017 | launcher startup prefix | **PASS** | stderr shows `[mk-code-index-launcher]` prefix, no legacy prefix, no unhandled exception; `SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN` documented in 3 locations. | `scratch/evidence-F-stdout.log` |
| 018 | mcp.json server key rename | **PASS** | `.claude/mcp.json` has `mk_code_index` key, `system_code_graph` absent, command=`node` with `mk-code-index-launcher.cjs` in args. | `scratch/evidence-F-stdout.log` |
| 019 | database path verification | **FAIL** (F-019-1) | Canonical DB exists non-empty (68,464,640 B), BUT a legacy DB persists at `.opencode/skills/system-code-graph/mcp_server/database/code-graph.sqlite` (106,496 B). That size **matches the `dbFileSize` the runtime reported in smoke-006** (empty graph, `totalNodes:0`) — strong signal the runtime is bound to the empty legacy DB, not the 68 MB canonical one. Scenario requires no legacy paths active → FAIL. | `scratch/evidence-F-stdout.log`; cross-ref `001-.../scratch/evidence-006-stdout.json` |
| 020 | TypeScript build and entry point | **PASS** (w/ finding F-020-1) | Entry point exists, root-level dist absent, schema module loads → meets the literal pass/fail clause. Tool count 8 ≠ documented 11 (recorded as F-020-1, not a build failure). | `scratch/evidence-020-stdout.log` RESULT block |
| 021 | root dist cleanup (file labeled "unicode-normalization") | **PASS** | Clean `npm run clean && build` completed; `mcp_server/dist/index.js` exists, root-level `dist/` absent → build does not recreate sibling dist artifacts. (Label mismatch noted as F-021-1.) | `scratch/evidence-G-stdout.log` |
| 025 | Devin CLI SessionStart hook | **FAIL** (F-025-1) | Hook CODE works (startup/resume/clear/compact emit `## Session Context`; malformed → `{}` fail-open; disable env var respected; all exit 0). BUT registration is broken: `.devin/hooks.v1.json` cites `.opencode/skills/system-code-graph/dist/system-spec-kit/mcp_server/hooks/devin/session-start.js` which **does not exist** — actual hook is at `.opencode/skills/system-spec-kit/mcp_server/dist/hooks/devin/session-start.js`. Hook won't fire at runtime. Confirmed directly. | `scratch/evidence-G-stdout.log`; direct `jq .devin/hooks.v1.json` + `find` |

**Progress:** 7 / 7 complete — **5 PASS** (016, 017, 018, 020*, 021*), **2 FAIL** (019 F-019-1; 025 F-025-1). *020 carries F-020-1, 021 carries F-021-1.
