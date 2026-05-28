<!-- cli-devin dispatch | FRAMEWORK: RCAF + medium pre-planning (standard bundle-gate) | CLEAR-checked | Batch F: 016,017,018,019 SWE-1.6 read-only infra -->
ROLE: You are a SWE-1.6 infrastructure-validation worker for the `mk-code-index` code-graph MCP server. You verify and report evidence; you modify nothing.

CONTEXT:
- Repo root: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
- Launcher: `.opencode/bin/mk-code-index-launcher.cjs`. Post-rename naming is `mk-code-index` / `mk_code_index` (legacy was `system_code_graph` / `system-code-graph`).
- Spec folder: .opencode/specs/system-spec-kit/029-code-graph-playbook-validation/002-devin-static-scenarios (pre-approved, skip Gate 3).
- READ-ONLY. Inspection commands only.

ACTION (ordered; each step has acceptance):
1. SCENARIO 016 (tool manifest): start the launcher over stdio and send `initialize` + `notifications/initialized` + `tools/list` JSON-RPC, e.g.:
   `printf '%s\n' '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"t","version":"0"}}}' '{"jsonrpc":"2.0","method":"notifications/initialized"}' '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}' | timeout 20 node .opencode/bin/mk-code-index-launcher.cjs`
   Parse the tools/list response. Acceptance: count the distinct tool names; expected **8**; verify NO name contains `system_code_graph`. 016 PASS if exactly 8 distinct tools and no legacy names; FAIL otherwise (report the actual list).
2. SCENARIO 017 (startup prefix): run `timeout 8 node .opencode/bin/mk-code-index-launcher.cjs </dev/null 2>&1 | head -10`. Acceptance: stderr shows `[mk-code-index-launcher]` prefix, NO `[system_code_graph]`/`[system-code-graph]` prefix, no unhandled exception. Then `rg -n "SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN" .opencode/skills/system-code-graph/README.md .opencode/skills/system-code-graph/mcp_server/lib/ipc/README.md` → acceptance: at least one hit. 017 PASS if prefix correct + no legacy + idle-timeout doc found.
3. SCENARIO 018 (mcp.json key): `jq '.mcpServers | keys' .claude/mcp.json` and `jq '.mcpServers.mk_code_index' .claude/mcp.json`. Acceptance: `mk_code_index` key present, `system_code_graph` key absent, command is `node`, args include `mk-code-index-launcher.cjs`. 018 PASS if all hold.
4. SCENARIO 019 (db path): `ls -la .opencode/.spec-kit/code-graph/database/code-graph.sqlite`. Acceptance: file exists, size > 0. Then confirm no legacy DB is active: check `.opencode/skills/system-code-graph/mcp_server/database/code-graph.sqlite` and `.opencode/system-code-graph/database/` are absent. 019 PASS if canonical DB exists non-empty and legacy paths absent.

VERIFICATION: Nothing modified. Each verdict cites the exact command + observed output.

FORMAT: Return EXACTLY these four blocks and nothing after:
SCENARIO_016_RESULT_START
verdict: PASS|FAIL|SKIP
reason: <one sentence>
tool_count: <int>
legacy_names_present: true|false
tool_names: <comma-separated>
SCENARIO_016_RESULT_END
SCENARIO_017_RESULT_START
verdict: PASS|FAIL|SKIP
reason: <one sentence>
prefix_ok: true|false
legacy_prefix_present: true|false
idle_timeout_doc_found: true|false
SCENARIO_017_RESULT_END
SCENARIO_018_RESULT_START
verdict: PASS|FAIL|SKIP
reason: <one sentence>
mk_code_index_present: true|false
system_code_graph_absent: true|false
command_args_ok: true|false
SCENARIO_018_RESULT_END
SCENARIO_019_RESULT_START
verdict: PASS|FAIL|SKIP
reason: <one sentence>
canonical_db_exists: true|false
db_size_bytes: <int>
legacy_paths_absent: true|false
SCENARIO_019_RESULT_END
