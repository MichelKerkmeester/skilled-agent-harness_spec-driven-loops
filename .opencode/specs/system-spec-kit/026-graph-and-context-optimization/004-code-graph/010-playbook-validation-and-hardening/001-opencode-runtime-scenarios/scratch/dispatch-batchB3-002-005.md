<!-- cli-opencode dispatch | framework: RCAF + medium pre-planning (standard bundle-gate) | CLEAR-checked | Batch B3: 002 + 005 (workspace UNDER repo, REAL content edits) -->
ROLE: You are a validation operator for the `mk-code-index` code-graph MCP runtime. You verify behavior and report evidence; you never mutate live repository SOURCE files.

CONTEXT:
- Repo root (your cwd): /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
- Full project MCP runtime. Stable tool IDs: `code_graph_scan`, `code_graph_query`, `code_graph_verify`.
- Spec folder: .opencode/specs/system-spec-kit/029-code-graph-playbook-validation/001-opencode-runtime-scenarios (pre-approved, skip Gate 3).
- Scenarios 002 (broad-stale block on query) and 005 (verify blocked-then-ok).
- KNOWN RUNTIME FACT: `code_graph_scan` only accepts `rootDir` UNDER the repo workspace root (`/tmp` is REJECTED). Create the disposable workspace under the gitignored `tmp/` dir at the repo root. Staleness keys on CONTENT HASH — use real content edits (append a line), not `touch`.
- SAFETY: workspace is `tmp/cgwork-B3.*` under the repo (gitignored, disposable). Do NOT modify any real source file outside it.

ACTION (ordered; each step has acceptance):
1. Setup: `mkdir -p tmp; WORK=$(mktemp -d "$PWD/tmp/cgwork-B3.XXXXXX"); cp -R .opencode/skills/system-code-graph/mcp_server/lib "$WORK/lib"; cp -R .opencode/skills/system-code-graph/mcp_server/handlers "$WORK/handlers"`. Acceptance: `find "$WORK" -name '*.ts' | wc -l` > 50. Full scan `code_graph_scan({"rootDir":"$WORK","incremental":false})`; confirm indexed `$WORK` with nonzero nodes; record baseline node count.
2. SCENARIO 002 (broad-stale block via REAL content edits): `for f in $(find "$WORK" -name '*.ts' | head -60); do echo "// staleness-$(date +%s%N)" >> "$f"; done`. Call `code_graph_query({"rootDir":"$WORK","operation":"outline","subject":"<an-indexed-file>","limit":20})`. Acceptance: BLOCKED payload with `requiredAction:"code_graph_scan"`. 002 PASS if broad stale blocks with scan guidance; FAIL if silently repaired (`status:ok`/`inlineIndexPerformed:true`) or handler crashes.
3. SCENARIO 005 (verify blocked then ok): with broad-stale present, `code_graph_verify({"rootDir":"$WORK"})` = call#1 (expect `status:"blocked"` + readiness). Then `code_graph_scan({"rootDir":"$WORK","incremental":false})` (files are valid TS so scan should produce nodes; if rejected `zero_node_scan_rejected`, report verbatim). Then `code_graph_verify({"rootDir":"$WORK"})` = call#2 (expect `status:"ok"` with `result.passed` + pass-rate). 005 PASS if call#1 blocks and call#2 returns ok with pass-rate; FAIL otherwise (report exact blocker).
4. Cleanup: `rm -rf "$WORK"`.

VERIFICATION: All edits confined to the disposable `tmp/cgwork-B3.*` workspace; no real source touched.

FORMAT: Return EXACTLY these two blocks and nothing after:
SCENARIO_002_RESULT_START
verdict: PASS|FAIL|SKIP
reason: <one sentence>
work_dir_confirmed: true|false
files_modified_with_content: <count>
status: <value>
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
