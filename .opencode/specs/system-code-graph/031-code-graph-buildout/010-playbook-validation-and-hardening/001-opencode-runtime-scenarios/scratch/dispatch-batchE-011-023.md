<!-- cli-opencode dispatch | framework: RCAF + medium pre-planning (standard bundle-gate) | CLEAR-checked | Batch E: 011 (tool-call shape validation) + 023 (code_graph_apply sub-op preflights) — NO workspace mutation -->
ROLE: You are a validation operator for the `mk-code-index` code-graph MCP runtime. You verify behavior and report evidence; you never mutate the live repository or graph state.

CONTEXT:
- Repo root (your cwd): /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
- Full project MCP runtime. Stable tool IDs: `code_graph_query`, `detect_changes`, `code_graph_verify`, `code_graph_apply`, `code_graph_status`.
- Spec folder: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/010-playbook-validation-and-hardening/001-opencode-runtime-scenarios (pre-approved, skip Gate 3).
- Scenarios 011 (malformed-call schema validation) and 023 (code_graph_apply sub-operation preflights). Both run against the CURRENT graph state with NO mutation — all 023 calls are dry-run / refusal preflights. Do NOT pass `confirm:true`, `lowTierOptIn:true`, `crashRootCauseAddressed:true`, or `dryRun:false` to any apply operation.

ACTION (ordered; each step has acceptance):
1. SCENARIO 011 (malformed calls rejected with field-specific errors):
   - Call `code_graph_query({"operation":"outline"})` (missing `subject`). Acceptance: returns `status:"error"` or schema validation error naming the missing `subject` field.
   - Call `detect_changes({})` (missing `diff`). Acceptance: validation error naming missing `diff`.
   - Call `code_graph_verify({"query":"x"})` (missing `rating`). Acceptance: validation error naming the missing `rating` field.
   - Then ONE valid-shape call (e.g. `code_graph_status({})`) to confirm valid shapes still route to the handler.
   011 PASS if each malformed call is rejected with a field-specific error AND the valid call routes; FAIL if any malformed call reaches a handler silently, errors lack field detail, or the valid call is blocked.
2. SCENARIO 023 (apply sub-operation preflights — all non-mutating):
   - `code_graph_apply({"operation":"rescan","dryRun":true})` → expect pre-battery state / `dry_run` complete, no mutation.
   - `code_graph_apply({"operation":"prune-excludes","excludePatterns":["**/__tests__/**","**/*.test.ts"],"lowTierOptIn":false})` → expect classification of patterns WITHOUT applying.
   - `code_graph_apply({"operation":"repair-nodes","quarantineOlderThanDays":7})` → expect refusal requiring `crashRootCauseAddressed:true` (`requiredAction:"set_crash_root_cause_addressed"` or equivalent).
   - `code_graph_apply({"operation":"recover-sqlite-corruption"})` → expect refusal requiring `confirm:true`.
   - `code_graph_apply({"operation":"rollback-bad-apply","dryRun":true})` → expect dry-run reporting the prior baseline (or a clean "no prior apply" message). 
   023 PASS if rescan dry-run returns pre-state w/o mutation AND prune-excludes classifies w/o applying AND repair-nodes refuses w/o crashRootCauseAddressed AND recover refuses w/o confirm AND rollback dry-run reports baseline/none; FAIL on any unexpected mutation or missing gate.

VERIFICATION: No mutation performed; all apply calls were dry-run or refusal preflights.

FORMAT: Return EXACTLY these two blocks and nothing after:
SCENARIO_011_RESULT_START
verdict: PASS|FAIL|SKIP
reason: <one sentence>
query_missing_subject_error: true|false
detect_changes_missing_diff_error: true|false
verify_missing_rating_error: true|false
valid_call_routed: true|false
SCENARIO_011_RESULT_END
SCENARIO_023_RESULT_START
verdict: PASS|FAIL|SKIP
reason: <one sentence>
rescan_dryrun_ok: true|false
prune_excludes_classify_only: true|false
repair_nodes_refused: true|false
recover_refused_without_confirm: true|false
rollback_dryrun_reports_baseline: true|false
SCENARIO_023_RESULT_END
