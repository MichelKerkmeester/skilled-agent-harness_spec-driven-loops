<!-- cli-opencode dispatch | framework: RCAF + medium pre-planning (standard bundle-gate) | CLEAR-checked | Batch D: 024 (detect_changes multi-file) + 022 (blast_radius) on a FRESH topology-rich workspace -->
ROLE: You are a validation operator for the `mk-code-index` code-graph MCP runtime. You verify behavior and report evidence; you never mutate live repository SOURCE files.

CONTEXT:
- Repo root (your cwd): /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
- Full project MCP runtime. Stable tool IDs: `code_graph_scan`, `detect_changes`, `code_graph_query`, `code_graph_status`.
- Spec folder: .opencode/specs/system-spec-kit/029-code-graph-playbook-validation/001-opencode-runtime-scenarios (pre-approved, skip Gate 3).
- Scenarios 024 (detect_changes with a multi-file unified diff) and 022 (code_graph_query blast_radius single/union/transitive/confidence). Both need a FRESH graph with real import topology.
- KNOWN RUNTIME FACT: `code_graph_scan` accepts `rootDir` only UNDER the repo workspace root (`/tmp` rejected). Use the gitignored `tmp/` dir. Use ACTUAL `$WORK` file paths as subjects/diffs (NOT the example repo paths in the playbook).
- SAFETY: workspace `tmp/cgwork-D.*` under the repo. Keep the graph FRESH (do not mutate files after the scan, except the deliberate out-of-workspace diff entry in 024 which is input-only).

ACTION (ordered; each step has acceptance):
1. Setup (topology-rich): `mkdir -p tmp; WORK=$(mktemp -d "$PWD/tmp/cgwork-D.XXXXXX"); cp -R .opencode/skills/system-code-graph/mcp_server/lib "$WORK/lib"; cp -R .opencode/skills/system-code-graph/mcp_server/handlers "$WORK/handlers"; cp -R .opencode/skills/system-code-graph/mcp_server/core "$WORK/core"`. Acceptance: `find "$WORK" -name '*.ts' | wc -l` ≥ 100. Full scan `code_graph_scan({"rootDir":"$WORK","incremental":false})`; confirm `code_graph_status({})` (or scan payload) shows `freshness:"fresh"` and ≥100 files. Pick TWO real indexed `.ts` files (call them F1, F2) for the steps below.
2. SCENARIO 024 (multi-file diff): build a unified diff touching F1 and F2 (git `a/`,`b/` prefixes, one hunk each within real line ranges). Call `detect_changes({"diff":"<diff>","rootDir":"$WORK"})`. Acceptance checks: `status` != "blocked"; `affectedFiles` length == 2 covering F1 and F2; paths canonicalized (no `a/`/`b/` prefix); `affectedSymbols` ≥ 1. Then two sub-cases: (a) add a fake `/tmp/outside/x.ts` entry to the diff → verify it is omitted or flagged out-of-workspace; (b) call `detect_changes({"diff":""})` → verify an explicit validation error (not silent empty). 024 PASS if multi-file mapping + canonicalization + out-of-workspace handling + empty-diff error all hold; FAIL on any miss.
3. SCENARIO 022 (blast_radius): with the FRESH graph, call `code_graph_query` blast_radius four ways on F1: (a) single-subject baseline (expect non-blocked list); (b) multi-subject `unionMode:"multi"` + `subjects:[F2]` (expect count ≥ baseline); (c) `includeTransitive:true,maxDepth:3` (expect count > non-transitive baseline); (d) `minConfidence:0.7` (expect count ≤ unfiltered). 022 PASS if single non-blocked AND union ≥ single AND transitive > non-transitive AND minConfidence ≤ unfiltered; FAIL on any inequality violation or unexpected block. (If the graph has too little topology to show union>/transitive> differences, report the actual counts and mark PARTIAL in the reason.)
4. Cleanup: `rm -rf "$WORK"`.

VERIFICATION: All operations confined to the disposable `tmp/cgwork-D.*` workspace.

FORMAT: Return EXACTLY these two blocks and nothing after:
SCENARIO_024_RESULT_START
verdict: PASS|FAIL|SKIP
reason: <one sentence>
status_not_blocked: true|false
affectedFiles_count: <int>
paths_canonicalized: true|false
affectedSymbols_count: <int>
out_of_workspace_handled: true|false
empty_diff_error: true|false
SCENARIO_024_RESULT_END
SCENARIO_022_RESULT_START
verdict: PASS|FAIL|SKIP
reason: <one sentence>
single_count: <int>
union_count: <int>
transitive_count: <int>
nontransitive_count: <int>
minconfidence_count: <int>
unfiltered_count: <int>
SCENARIO_022_RESULT_END
