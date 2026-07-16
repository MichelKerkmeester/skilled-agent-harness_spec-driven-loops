<!-- cli-devin dispatch | FRAMEWORK: RCAF + medium pre-planning (standard bundle-gate) | CLEAR-checked | Batch G: 021 (clean build) + 025 (Devin SessionStart hook) SWE-1.6 -->
ROLE: You are a SWE-1.6 build-and-hook validation worker. You verify and report evidence; you do not edit source files (writes limited to /tmp).

CONTEXT:
- Repo root: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
- Spec folder: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/010-playbook-validation-and-hardening/002-devin-static-scenarios (pre-approved, skip Gate 3).
- Scenario 021: clean code-graph build must not recreate root-level dist. Scenario 025: Devin SessionStart hook emits kind=startup structural-context, fails open, respects disable env var.

ACTION (ordered; each step has acceptance):
1. SCENARIO 021 (clean build): run `npm --prefix .opencode/skills/system-code-graph run clean && npm --prefix .opencode/skills/system-code-graph run build`. Then: `test -f .opencode/skills/system-code-graph/mcp_server/dist/index.js` (must exist) and `test -d .opencode/skills/system-code-graph/dist` (must NOT exist — root-level dist absent). 021 PASS if direct entry point exists AND root-level dist is absent after a clean build; FAIL if root-level dist reappears or entry point missing. (Note: dist/ is gitignored build output — rebuilding is safe.)
2. SCENARIO 025 (Devin SessionStart hook): 
   a. `ls .opencode/skills/system-spec-kit/mcp_server/dist/system-spec-kit/mcp_server/hooks/devin/session-start.js` (artifact exists) and `jq '.SessionStart[0].hooks[0].command' .devin/hooks.v1.json` (registration cites the compiled-hook path).
   b. `mkdir -p /tmp/devin-session-playbook`; for SRC in startup resume clear compact: `printf '%s' "{\"source\":\"$SRC\",\"session_id\":\"025-$SRC\",\"cwd\":\"$PWD\"}" | node <hook-path> > /tmp/devin-session-playbook/025-$SRC.stdout.json 2> /tmp/devin-session-playbook/025-$SRC.stderr`. Acceptance: each exits 0; startup/resume/compact stdout has `hookSpecificOutput.hookEventName=="SessionStart"` and `additionalContext` containing a `## Session Context` block; clear may emit startup payload or `{}`.
   c. Malformed: `printf '%s' 'not-json' | node <hook-path>` → expect `{}`, exit 0, stderr mentions fail-open.
   d. Disabled: `SPECKIT_CODE_GRAPH_DEVIN_HOOK_DISABLED=1 printf '{"source":"startup","session_id":"x","cwd":"."}' | node <hook-path>` (set the env var on the node invocation) → expect `{}`, exit 0, stderr "hook disabled via env var".
   025 PASS if all 6 runs exit 0, active sources emit the structural-context block, malformed/disabled emit `{}` with fail-open diagnostics, and registration cites the compiled-hook path; FAIL otherwise.

VERIFICATION: No source files edited; writes confined to /tmp/devin-session-playbook; dist rebuild is gitignored output.

FORMAT: Return EXACTLY these two blocks and nothing after:
SCENARIO_021_RESULT_START
verdict: PASS|FAIL|SKIP
reason: <one sentence>
entry_point_exists: true|false
root_level_dist_absent: true|false
SCENARIO_021_RESULT_END
SCENARIO_025_RESULT_START
verdict: PASS|FAIL|SKIP
reason: <one sentence>
artifact_exists: true|false
registration_cites_compiled_path: true|false
active_sources_emit_context: true|false
malformed_fails_open: true|false
disable_env_var_respected: true|false
all_exit_0: true|false
SCENARIO_025_RESULT_END
