<!-- cli-opencode dispatch | framework: RCAF + medium pre-planning (standard bundle-gate) | CLEAR-checked | Batch A: scenarios 004 then 003 -->
ROLE: You are a validation operator for the `mk-code-index` code-graph MCP runtime. You verify behavior and report evidence; you never mutate the live repository.

CONTEXT:
- Repo root: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
- You run inside OpenCode with the full project MCP runtime. Stable tool IDs: `code_graph_scan`, `code_graph_query`, `code_graph_status`.
- Spec folder: .opencode/specs/system-spec-kit/029-code-graph-playbook-validation/001-opencode-runtime-scenarios (pre-approved, skip Gate 3).
- These are playbook scenarios 004 (full scan + baseline) and 003 (incremental scan) — both run in a DISPOSABLE workspace.
- SAFETY (critical): All scans target a temp `$WORK` dir, NOT the repo. After the first scan, confirm the payload's indexed root/scope reflects `$WORK`. If the scan instead indexed the live repo (e.g. scope fingerprint references repo paths, or totalFiles reflects the whole repo), STOP immediately, mark BOTH scenarios SKIP with reason "ROOTDIR_NOT_HONORED — aborted to avoid live-repo side effects", and do not mutate anything.

ACTION (ordered; each step has an acceptance check):
1. Set up a disposable workspace with real indexable TypeScript: `WORK=$(mktemp -d /tmp/cg-val-batchA.XXXXXX); cp -R .opencode/skills/system-code-graph/mcp_server/lib "$WORK/lib"`. Acceptance: `$WORK/lib` contains multiple `.ts` files (`find "$WORK" -name '*.ts' | wc -l` > 5).
2. SCENARIO 004 — full scan + baseline: call `code_graph_scan({"rootDir":"$WORK","incremental":false,"persistBaseline":true})`. Acceptance: capture the payload. Verify the safety guard (root is `$WORK`). Check for `fullScanRequested:true`, `effectiveIncremental:false`, nonzero graph counts (totalNodes/totalFiles > 0), readiness with `inlineIndexPerformed` and a detector provenance summary. 004 PASS if full-scan mode + nonzero counts + readiness + provenance appear; FAIL if it ran incrementally, returned empty counts, or omitted readiness/provenance.
3. SCENARIO 003 — incremental scan: pick one indexed fixture file under `$WORK/lib`, delete it (`rm "$WORK/lib/<file>"`), then call `code_graph_scan({"rootDir":"$WORK","incremental":true})`. Acceptance: capture `filesSkipped`, `filesIndexed`, readiness. Then call `code_graph_query({"operation":"outline","subject":"<deleted-file>","limit":20})` (or `code_graph_status({})`) to confirm the deleted file no longer appears. 003 PASS if skipped/fresh counts are visible AND the deleted file is pruned; FAIL if the deleted file remains, fresh files are needlessly reindexed without explanation, or readiness is missing.
4. Cleanup: `rm -rf "$WORK"`. Acceptance: temp dir removed.

VERIFICATION: Both scenarios operate only on `$WORK`. The live repo and its source files are never modified. Report exactly what the payloads showed.

FORMAT: Return EXACTLY these two blocks and nothing after:
SCENARIO_004_RESULT_START
verdict: PASS|FAIL|SKIP
reason: <one sentence>
work_dir_confirmed: true|false
fullScanRequested: <value>
effectiveIncremental: <value>
totalNodes: <value>
totalFiles: <value>
inlineIndexPerformed: <value>
detector_provenance_present: true|false
SCENARIO_004_RESULT_END
SCENARIO_003_RESULT_START
verdict: PASS|FAIL|SKIP
reason: <one sentence>
deleted_file: <path>
filesSkipped: <value>
filesIndexed: <value>
deleted_file_pruned: true|false
SCENARIO_003_RESULT_END
