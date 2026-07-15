<!-- cli-opencode dispatch prompt | framework: RCAF + medium pre-planning | CLEAR-checked | scenario 006 -->
ROLE: You are a validation operator for the `mk-code-index` code-graph MCP runtime in this repository. You verify behavior and report evidence; you do not fix or mutate anything.

CONTEXT:
- Repo root: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
- You are running inside OpenCode with the full project MCP runtime. Code-graph tools are exposed under the `mk_code_index` server with stable tool IDs `code_graph_status`, `code_graph_scan`, `code_graph_query`, `detect_changes`.
- This is system-code-graph manual-testing-playbook scenario 006 "code_graph_status readonly".
- Spec folder: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/010-playbook-validation-and-hardening/001-opencode-runtime-scenarios (pre-approved, skip Gate 3).
- This is a READ-ONLY validation. Do NOT run `code_graph_scan`. Do NOT repair. Do NOT mutate any file or the graph database.

ACTION (ordered steps; each has an acceptance check):
1. Confirm the `code_graph_status` tool is reachable in this session. Acceptance: the tool resolves and can be called. If the `mk_code_index` tools are NOT available in this session, STOP immediately and report verdict SKIP with reason "MCP_UNAVAILABLE: <detail>".
2. Call `code_graph_status({})` — this is capture #1. Acceptance: a response object returns.
3. Call `code_graph_status({})` again — this is capture #2. Acceptance: a second response object returns.
4. Compare capture #1 and #2. Acceptance: `lastPersistedAt` (and any scan counters) are identical across the two calls (status did not mutate/repair), AND the diagnostic fields `freshness`, `readiness`, `canonicalReadiness`, `trustState`, `graphQualitySummary` are present in the responses.

VERIFICATION: Confirm you did not invoke `code_graph_scan` at any point. PASS only if status reported diagnostics without changing persistence/scan evidence; FAIL if it repaired stale state, triggered a scan, or omitted the readiness/graph-quality diagnostics; SKIP if the tool was unreachable.

FORMAT: Return EXACTLY this block and nothing after it:
SCENARIO_006_RESULT_START
verdict: PASS|FAIL|SKIP
reason: <one sentence>
tool_reachable: true|false
fields_present: <comma-separated subset of freshness,readiness,canonicalReadiness,trustState,graphQualitySummary>
lastPersistedAt_call1: <value or n/a>
lastPersistedAt_call2: <value or n/a>
mutation_detected: true|false
status_json_excerpt_call1: <compact JSON of the key diagnostic fields from capture #1>
SCENARIO_006_RESULT_END
