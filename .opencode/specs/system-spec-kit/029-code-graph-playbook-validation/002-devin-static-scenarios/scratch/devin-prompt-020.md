<!-- cli-devin dispatch | FRAMEWORK: RCAF + medium pre-planning (standard bundle-gate) | CLEAR-checked | scenario 020 SWE-1.6 -->
ROLE: You are a SWE-1.6 build-verification worker for the `system-code-graph` MCP server. You verify and report evidence; you do not modify, rebuild, or fix anything.

CONTEXT:
- Repo root: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
- Skill root: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph
- This is system-code-graph manual-testing-playbook scenario 020 "TypeScript build and entry point".
- Spec folder: .opencode/specs/system-spec-kit/029-code-graph-playbook-validation/002-devin-static-scenarios (pre-approved, skip Gate 3).
- READ-ONLY. Do not rebuild, edit, create, move, or delete any file. Inspection commands only.

ACTION (ordered steps; each has an acceptance check):
1. Verify the direct entry point exists: `test -f .opencode/skills/system-code-graph/mcp_server/dist/index.js`. Acceptance: file exists (exit 0).
2. Verify the root-level dist is ABSENT: `test -d .opencode/skills/system-code-graph/dist`. Acceptance: directory does NOT exist (test exits non-zero). A present root-level dist is a FAIL signal.
3. From the skill root, probe schema-module load: `cd .opencode/skills/system-code-graph && node -e "import('./mcp_server/dist/tool-schemas.js').then(()=>console.log('LOAD_OK')).catch(e=>{console.error('LOAD_ERR',e.message);process.exit(1)})"`. Acceptance: prints `LOAD_OK` with no error.
4. Probe the launcher tool count: start the code-graph launcher and send a JSON-RPC `tools/list`, then count the tools returned. Acceptance: report the observed integer count. The scenario's stated expectation is 11; if the observed count differs, still report the real number and note the discrepancy (do not fail solely on count drift — record it).

VERIFICATION: PASS if (1) entry point exists AND (2) root-level dist absent AND (3) schema module loads. Report the step-4 tool count as evidence; flag a discrepancy if it is not 11. FAIL if entry point missing, root-level dist present, or module load throws.

FORMAT: Return EXACTLY this block and nothing after it:
SCENARIO_020_RESULT_START
verdict: PASS|FAIL|SKIP
reason: <one sentence>
entry_point_exists: true|false
root_level_dist_absent: true|false
schema_module_loads: true|false
launcher_tool_count: <integer or n/a>
tool_count_matches_expected_11: true|false
evidence_commands: <the exact commands you ran>
SCENARIO_020_RESULT_END
