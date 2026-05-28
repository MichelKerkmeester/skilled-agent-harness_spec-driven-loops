<!-- cli-opencode dispatch | framework: RCAF + medium pre-planning (standard bundle-gate) | CLEAR-checked | Batch C: scenarios 008 then 007 (blocked-on-stale) -->
ROLE: You are a validation operator for the `mk-code-index` code-graph MCP runtime. You verify behavior and report evidence; you never mutate the live repository.

CONTEXT:
- Repo root: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
- Full project MCP runtime. Stable tool IDs: `code_graph_scan`, `code_graph_context`, `detect_changes`.
- Spec folder: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/010-playbook-validation-and-hardening/001-opencode-runtime-scenarios (pre-approved, skip Gate 3).
- Scenarios 008 (code_graph_context blocks on broad stale) and 007 (detect_changes blocks on stale, read-only). ONE disposable `$WORK`.
- SAFETY: scans target `$WORK`, NOT the repo. After the first scan, confirm indexed root is `$WORK`; if it indexed the live repo, STOP, mark both SKIP "ROOTDIR_NOT_HONORED", mutate nothing.

ACTION (ordered; each step has acceptance):
1. Setup: `WORK=$(mktemp -d /tmp/cg-val-batchC.XXXXXX); cp -R .opencode/skills/system-code-graph/mcp_server/lib "$WORK/lib"; cp -R .opencode/skills/system-code-graph/mcp_server/handlers "$WORK/handlers"`. Acceptance: `find "$WORK" -name '*.ts' | wc -l` > 50. Then full scan `code_graph_scan({"rootDir":"$WORK","incremental":false})`; verify safety guard (root=$WORK). Note one real indexed symbol name from the scan (e.g. a function/class in handlers) for step 2.
2. SCENARIO 008 (context blocked on broad stale): modify MORE THAN 50 tracked files (`find "$WORK" -name '*.ts' | head -60 | xargs touch`). Call `code_graph_context({"rootDir":"$WORK","queryMode":"neighborhood","subject":"<a-real-indexed-symbol>"})` (use `handleCodeGraphQuery` if present, else any symbol you indexed). Acceptance: response `status:"blocked"`, `graphAnswersOmitted:true`, `requiredAction:"code_graph_scan"`, plus readiness / canonicalReadiness / trustState fields. 008 PASS if broad stale blocks with graph omission + readiness metadata; FAIL if it answers stale graph data, omits requiredAction, or drops readiness/trust.
3. SCENARIO 007 (detect_changes blocked, read-only): with the graph still broad-stale, build a minimal unified diff for one `$WORK` file (e.g. `diff --git a/lib/<f>.ts b/lib/<f>.ts` with one changed line) and call `detect_changes({"diff":"<diff>","rootDir":"$WORK"})`. Acceptance: response `status:"blocked"` instructing `code_graph_scan`; NO inline indexing/repair occurred (graph node count unchanged; confirm via a quick `code_graph_status({})` if useful). 007 PASS if stale readiness blocks with scan guidance and no inline indexing; FAIL if it repairs inline, omits required action, or returns no structured blocked payload.
4. Cleanup: `rm -rf "$WORK"`.

VERIFICATION: All ops confined to `$WORK`; live repo untouched.

FORMAT: Return EXACTLY these two blocks and nothing after:
SCENARIO_008_RESULT_START
verdict: PASS|FAIL|SKIP
reason: <one sentence>
work_dir_confirmed: true|false
status: <value>
graphAnswersOmitted: <value>
requiredAction: <value>
readiness_fields_present: true|false
SCENARIO_008_RESULT_END
SCENARIO_007_RESULT_START
verdict: PASS|FAIL|SKIP
reason: <one sentence>
status: <value>
required_action_scan: true|false
inline_index_occurred: true|false
SCENARIO_007_RESULT_END
