<!-- cli-opencode dispatch | framework: RCAF + medium pre-planning (standard bundle-gate) | CLEAR-checked | 022 transitive re-verify on a DEEP-dependency subject -->
ROLE: You are a validation operator for the `mk-code-index` code-graph MCP runtime. You verify behavior and report evidence; you never mutate live repository SOURCE files.

CONTEXT:
- Repo root (your cwd): /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
- Full project MCP runtime. Stable tool IDs: `code_graph_scan`, `code_graph_query`, `code_graph_status`.
- Spec folder: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/010-playbook-validation-and-hardening/007-followup-hook-docs-and-022 (pre-approved, skip Gate 3).
- This RE-VERIFIES scenario 022 blast_radius TRANSITIVE expansion. The prior run was PARTIAL because the chosen subject had only one importer (no multi-hop dependents), so transitive==nontransitive. This run must pick a DEEP-dependency subject.
- KNOWN RUNTIME FACT: `code_graph_scan` accepts `rootDir` only UNDER the repo workspace root (`/tmp` rejected). Use the gitignored `tmp/` dir. The parser-quarantine recovery fix is now live, so a full scan indexes normally.

ACTION (ordered; each step has acceptance):
1. Setup topology-rich workspace: `mkdir -p tmp; WORK=$(mktemp -d "$PWD/tmp/cgwork-022.XXXXXX"); cp -R .opencode/skills/system-code-graph/mcp_server/lib "$WORK/lib"; cp -R .opencode/skills/system-code-graph/mcp_server/handlers "$WORK/handlers"; cp -R .opencode/skills/system-code-graph/mcp_server/core "$WORK/core"`. Acceptance: `find "$WORK" -name '*.ts' | wc -l` ≥ 100. Full scan `code_graph_scan({"rootDir":"$WORK","incremental":false})`; confirm `freshness:"fresh"` + ≥100 files + nonzero nodes.
2. SELECT a DEEP-dependency subject: pick a FOUNDATIONAL module that many files import AND whose importers are themselves imported (multi-hop reverse-dependency chain). Strong candidates in this tree: `core/config.ts`, `lib/indexer-types.ts`, `lib/code-graph-db.ts`, or any types/util module under `lib/`. Use `code_graph_query({"operation":"blast_radius","subject":"<candidate>","limit":50})` on 2-3 candidates and choose the one with the largest non-transitive importer set (deepest reverse-dep potential). Acceptance: a subject F with ≥3 direct importers selected.
3. RUN the 4 blast_radius modes on F:
   - (a) single-subject baseline: `code_graph_query({"operation":"blast_radius","subject":"F","limit":50})` → expect non-blocked list (nontransitive_count).
   - (b) transitive: `code_graph_query({"operation":"blast_radius","subject":"F","includeTransitive":true,"maxDepth":3,"limit":200})` → expect transitive_count.
   - (c) union: add a second subject via `subjects` + `unionMode:"multi"` → expect ≥ single.
   - (d) minConfidence:0.7 → expect ≤ unfiltered.
   Acceptance: report all counts. 022 PASS if `transitive_count > nontransitive_count` (multi-hop expansion shown) AND union ≥ single AND minConfidence ≤ unfiltered AND single is non-blocked. If transitive STILL == nontransitive even on the deepest available subject, report PARTIAL with the subject's actual reverse-dep depth (documented topology limit, not a tool defect).
4. Cleanup: `rm -rf "$WORK"`. Do NOT modify any file outside `$WORK`.

VERIFICATION: All ops confined to the disposable `tmp/cgwork-022.*` workspace.

FORMAT: Return EXACTLY this block and nothing after:
SCENARIO_022_RERUN_RESULT_START
verdict: PASS|PARTIAL|FAIL
reason: <one sentence including the chosen subject>
subject: <the file F used>
single_count: <int>
nontransitive_count: <int>
transitive_count: <int>
union_count: <int>
minconfidence_count: <int>
unfiltered_count: <int>
transitive_gt_nontransitive: true|false
SCENARIO_022_RERUN_RESULT_END
