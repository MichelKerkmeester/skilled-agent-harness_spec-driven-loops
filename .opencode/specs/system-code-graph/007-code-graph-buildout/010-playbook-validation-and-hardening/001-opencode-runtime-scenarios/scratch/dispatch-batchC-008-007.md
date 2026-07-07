<!-- cli-opencode dispatch | framework: RCAF + medium pre-planning (standard bundle-gate) | CLEAR-checked | Batch C: 008 then 007 (blocked-on-stale, REAL content edits, workspace UNDER repo) -->
ROLE: You are a validation operator for the `mk-code-index` code-graph MCP runtime. You verify behavior and report evidence; you never mutate live repository SOURCE files.

CONTEXT:
- Repo root (your cwd): /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
- Full project MCP runtime. Stable tool IDs: `code_graph_scan`, `code_graph_context`, `detect_changes`, `code_graph_status`.
- Spec folder: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/010-playbook-validation-and-hardening/001-opencode-runtime-scenarios (pre-approved, skip Gate 3).
- Scenarios 008 (code_graph_context blocks on broad stale) and 007 (detect_changes blocks on stale, read-only).
- KNOWN RUNTIME FACT: `code_graph_scan` only accepts a `rootDir` UNDER the repo workspace root; `/tmp` paths are REJECTED. So the disposable workspace MUST be created under the gitignored `tmp/` dir at the repo root. Staleness is keyed on CONTENT HASH, so use real content edits (append a comment line), not `touch`.
- SAFETY: the workspace is `tmp/cgwork-C.*` under the repo (gitignored, disposable). Do NOT modify any real source file outside that workspace. After setup scan, confirm the indexed root is the workspace.

ACTION (ordered; each step has acceptance):
1. Setup: `mkdir -p tmp; WORK=$(mktemp -d "$PWD/tmp/cgwork-C.XXXXXX"); cp -R .opencode/skills/system-code-graph/mcp_server/lib "$WORK/lib"; cp -R .opencode/skills/system-code-graph/mcp_server/handlers "$WORK/handlers"`. Acceptance: `find "$WORK" -name '*.ts' | wc -l` > 50. Full scan `code_graph_scan({"rootDir":"$WORK","incremental":false})`; confirm it indexed `$WORK` (nonzero nodes). Record one real indexed symbol name for step 2.
2. Broad-stale via REAL content edits: `for f in $(find "$WORK" -name '*.ts' | head -60); do echo "// staleness-$(date +%s%N)" >> "$f"; done` (changes content hashes; files stay valid TS).
3. SCENARIO 008 (context blocked): call `code_graph_context({"rootDir":"$WORK","queryMode":"neighborhood","subject":"<a-real-indexed-symbol>"})`. Acceptance: `status:"blocked"`, `graphAnswersOmitted:true`, `requiredAction:"code_graph_scan"`, plus readiness/canonicalReadiness/trustState. 008 PASS if broad stale blocks with graph omission + readiness; FAIL if it answers stale data, omits requiredAction, or drops readiness/trust.
4. SCENARIO 007 (detect_changes blocked, read-only): build a minimal unified diff for one `$WORK` file (`diff --git a/lib/<f>.ts b/lib/<f>.ts` + one changed hunk) and call `detect_changes({"diff":"<diff>","rootDir":"$WORK"})`. Acceptance: `status:"blocked"` instructing `code_graph_scan`; NO inline indexing/repair (node count unchanged). 007 PASS if stale readiness blocks with scan guidance and no inline indexing; FAIL if it repairs inline, omits required action, or returns no structured blocked payload.
5. Cleanup: `rm -rf "$WORK"`.

VERIFICATION: All edits confined to the disposable `tmp/cgwork-C.*` workspace; no real source touched.

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
