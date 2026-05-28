<!-- cli-opencode dispatch | framework: RCAF + medium pre-planning (standard bundle-gate) | CLEAR-checked | Batch B: scenarios 001, 002, 005 -->
ROLE: You are a validation operator for the `mk-code-index` code-graph MCP runtime. You verify behavior and report evidence; you never mutate the live repository.

CONTEXT:
- Repo root: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
- Full project MCP runtime available. Stable tool IDs: `code_graph_scan`, `code_graph_query`, `code_graph_verify`, `code_graph_status`.
- Spec folder: .opencode/specs/system-spec-kit/029-code-graph-playbook-validation/001-opencode-runtime-scenarios (pre-approved, skip Gate 3).
- Scenarios 001 (single-file selective reindex / self-heal), 002 (broad-stale block), 005 (verify blocked on stale then ok). All in ONE disposable `$WORK`.
- SAFETY (critical): scans/queries target `$WORK`, NOT the repo. After the first scan, confirm the indexed root reflects `$WORK`. If it indexed the live repo, STOP, mark all three SKIP "ROOTDIR_NOT_HONORED — aborted to avoid live-repo side effects", mutate nothing.

ACTION (ordered; each step has acceptance):
1. Setup: `WORK=$(mktemp -d /tmp/cg-val-batchB.XXXXXX); cp -R .opencode/skills/system-code-graph/mcp_server/lib "$WORK/lib"`. Acceptance: `find "$WORK" -name '*.ts' | wc -l` > 50 (need >50 files for scenario 002; if fewer, also copy `cp -R .opencode/skills/system-code-graph/mcp_server/handlers "$WORK/handlers"`). Then full scan: `code_graph_scan({"rootDir":"$WORK","incremental":false})`. Verify safety guard (root is `$WORK`).
2. SCENARIO 001 (single-file self-heal): `touch` exactly ONE indexed `.ts` file under `$WORK`. Call `code_graph_query({"operation":"outline","subject":"<touched-file>","limit":20})`. Acceptance: response `status:"ok"` with self-heal/readiness evidence (`inlineIndexPerformed:true` OR `selfHealResult:"ok"` OR readiness fields), and NO unrequested full `code_graph_scan` was triggered. 001 PASS if the single stale file is repaired/answered with readiness metadata and no hidden full scan; FAIL if it blocks unexpectedly, performs an unrequested full scan, or omits readiness.
3. SCENARIO 002 (broad-stale block): modify MORE THAN 50 tracked files under `$WORK` (e.g. `find "$WORK" -name '*.ts' | head -60 | xargs touch`). Call `code_graph_query({"operation":"outline","subject":"<some-file>","limit":20})`. Acceptance: response is a BLOCKED payload with `requiredAction:"code_graph_scan"` (or equivalent fallback decision). 002 PASS if broad stale state blocks with scan guidance; FAIL if broad state is silently repaired or the handler crashes.
4. SCENARIO 005 (verify blocked then ok): with broad-stale still present, call `code_graph_verify({"rootDir":"$WORK"})` — capture call #1. Then `code_graph_scan({"rootDir":"$WORK","incremental":false})`. Then `code_graph_verify({"rootDir":"$WORK"})` — capture call #2. Acceptance: call #1 returns `status:"blocked"` with readiness; call #2 returns `status:"ok"` with `result.passed` and pass-rate fields. 005 PASS if stale verify blocks and post-scan verify returns ok with pass-rate; FAIL if verify runs on stale state, stays blocked after rescan, or omits readiness/pass-rate.
5. Cleanup: `rm -rf "$WORK"`.

VERIFICATION: All operations confined to `$WORK`; live repo untouched.

FORMAT: Return EXACTLY these three blocks and nothing after:
SCENARIO_001_RESULT_START
verdict: PASS|FAIL|SKIP
reason: <one sentence>
work_dir_confirmed: true|false
self_heal_evidence: <inlineIndexPerformed/selfHealResult/readiness value seen>
hidden_full_scan: true|false
SCENARIO_001_RESULT_END
SCENARIO_002_RESULT_START
verdict: PASS|FAIL|SKIP
reason: <one sentence>
files_modified: <count>
blocked_payload: true|false
requiredAction: <value seen>
SCENARIO_002_RESULT_END
SCENARIO_005_RESULT_START
verdict: PASS|FAIL|SKIP
reason: <one sentence>
verify_call1_status: <value>
verify_call2_status: <value>
pass_rate_present: true|false
SCENARIO_005_RESULT_END
