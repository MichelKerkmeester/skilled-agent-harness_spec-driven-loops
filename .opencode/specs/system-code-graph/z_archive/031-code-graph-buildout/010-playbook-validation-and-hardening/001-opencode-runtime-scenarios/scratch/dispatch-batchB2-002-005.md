<!-- cli-opencode dispatch | framework: RCAF + medium pre-planning (standard bundle-gate) | CLEAR-checked | Batch B2: re-run 002 + 005 with REAL content modification -->
ROLE: You are a validation operator for the `mk-code-index` code-graph MCP runtime. You verify behavior and report evidence; you never mutate the live repository.

CONTEXT:
- Repo root: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
- Full project MCP runtime. Stable tool IDs: `code_graph_scan`, `code_graph_query`, `code_graph_verify`.
- Spec folder: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/010-playbook-validation-and-hardening/001-opencode-runtime-scenarios (pre-approved, skip Gate 3).
- Re-run of scenarios 002 (broad-stale block) and 005 (verify blocked-then-ok). Prior run used `touch` (mtime only); the runtime keys staleness on CONTENT HASH, so this run uses REAL content edits.
- CRITICAL workspace rule: the disposable workspace MUST live under `/tmp` via `mktemp -d`. Do NOT create any directory at the repo root or anywhere inside the repo tree. Do NOT use a relative path that resolves inside the repo.
- SAFETY: scans target `$WORK` under /tmp, NOT the repo. After the first scan, confirm indexed root is the /tmp `$WORK`; if it indexed the live repo, STOP, mark both SKIP "ROOTDIR_NOT_HONORED", mutate nothing.

ACTION (ordered; each step has acceptance):
1. Setup: `WORK=$(mktemp -d /tmp/cg-val-b2.XXXXXX); cp -R .opencode/skills/system-code-graph/mcp_server/lib "$WORK/lib"; cp -R .opencode/skills/system-code-graph/mcp_server/handlers "$WORK/handlers"`. Acceptance: `find "$WORK" -name '*.ts' | wc -l` > 50 AND `$WORK` starts with `/tmp/`. Full scan `code_graph_scan({"rootDir":"$WORK","incremental":false})`; verify safety guard (root is the /tmp $WORK) and record baseline node count.
2. SCENARIO 002 (broad-stale block via REAL content change): append a unique comment line to MORE THAN 50 files: `for f in $(find "$WORK" -name '*.ts' | head -60); do echo "// staleness-marker $(date +%s%N)" >> "$f"; done`. (This changes content hashes — real staleness, files stay valid TypeScript.) Call `code_graph_query({"rootDir":"$WORK","operation":"outline","subject":"<an-indexed-file>","limit":20})`. Acceptance: response is a BLOCKED payload with `requiredAction:"code_graph_scan"` (broad stale must block, not silently self-heal). 002 PASS if broad stale blocks with scan guidance; FAIL if silently repaired (`status:ok`/`inlineIndexPerformed:true`) or handler crashes.
3. SCENARIO 005 (verify blocked then ok): with broad-stale present, call `code_graph_verify({"rootDir":"$WORK"})` = call#1 (expect `status:"blocked"` + readiness). Then `code_graph_scan({"rootDir":"$WORK","incremental":false})` (files are valid TS so the scan should produce nodes and be accepted — if it is rejected as `zero_node_scan_rejected`, report that verbatim). Then `code_graph_verify({"rootDir":"$WORK"})` = call#2 (expect `status:"ok"` with `result.passed` + pass-rate). 005 PASS if call#1 blocks and call#2 returns ok with pass-rate; FAIL otherwise (report the exact blocker if the rescan is rejected).
4. Cleanup: `rm -rf "$WORK"`.

VERIFICATION: All ops confined to the /tmp `$WORK`; nothing created inside the repo tree.

FORMAT: Return EXACTLY these two blocks and nothing after:
SCENARIO_002_RESULT_START
verdict: PASS|FAIL|SKIP
reason: <one sentence>
work_dir: <the /tmp path used>
files_modified_with_content: <count>
status: <value seen>
blocked_payload: true|false
requiredAction: <value>
SCENARIO_002_RESULT_END
SCENARIO_005_RESULT_START
verdict: PASS|FAIL|SKIP
reason: <one sentence>
verify_call1_status: <value>
rescan_accepted: true|false
rescan_blocker: <value or none>
verify_call2_status: <value>
pass_rate_present: true|false
SCENARIO_005_RESULT_END
