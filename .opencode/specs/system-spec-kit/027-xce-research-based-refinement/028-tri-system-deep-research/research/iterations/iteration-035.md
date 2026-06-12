# Iteration 035 — Angle 35

**Angle:** Cross-system linking: code-graph key_files vs spec-memory COVERED_BY edges — is the join surfaced anywhere useful?

**Summary:** The join is not surfaced anywhere useful today. The closest implementation is deep-context slice coverage, but spec-memory has no COVERED_BY relation and no crosswalk links graph-metadata key_files to coverage edges.

**Findings kept:** 3

## [P2][DOC-DRIFT] COVERED_BY is not a spec-memory edge

- Evidence: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/028-tri-system-deep-research/research/deep-research-strategy.md:51 names "spec-memory COVERED_BY edges"; .opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:21-28 allows only caused/enabled/supersedes/contradicts/derived_from/supports; .opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts:57-68 defines COVERED_BY only for context coverage graphs.
- Detail: The code does not support a spec-memory COVERED_BY relation. COVERED_BY belongs to the deep-loop/deep-context coverage graph, so any design expecting to join spec-memory causal edges on COVERED_BY is using the wrong graph vocabulary.
- Fix sketch: Rename the concept to deep-context coverage-graph COVERED_BY, or explicitly add a governed spec-memory relation if that is the intended model.

## [P3][NEW-FEATURE] No surfaced key_files to COVERED_BY join

- Evidence: Command: rg -n 'key_files[\\s\\S]{0,200}COVERED_BY|COVERED_BY[\\s\\S]{0,200}key_files' .opencode --glob '*.{ts,js,cjs,mjs,md,yaml,json}' -> only .opencode/specs/system-spec-kit/027-xce-research-based-refinement/028-tri-system-deep-research/research/deep-research-strategy.md:51 and research/prompts/iter-35.md:10; .opencode/commands/deep/assets/deep_start-context-loop_auto.yaml:473-498 builds graph_nodes_json/graph_edges_json from merged findings, not graph-metadata key_files.
- Detail: key_files are derived and stored in graph metadata, while COVERED_BY is emitted as deep-context coverage state. I found no runtime path that reads graph-metadata derived.key_files, maps them into FILE/SLICE nodes, or exposes a joined "this spec/key file is covered by this context edge" view.
- Fix sketch: Add a read-only crosswalk from graph-metadata derived.key_files to deep-context FILE/SLICE coverage nodes and surface it in context reports or session bootstrap.

## [P3][REFINEMENT] COVERED_BY is useful only as internal convergence telemetry

- Evidence: .opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts:612-632 computes sliceCoverage from COVERED_BY source IDs; .opencode/skills/deep-loop-runtime/scripts/convergence.cjs:262-290 surfaces only threshold traces/blocker counts; .opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-query.ts:130-168 finds uncovered SLICE nodes without consulting key_files.
- Detail: The COVERED_BY edge is surfaced enough to block or allow deep-context convergence, but not enough to answer cross-system traceability questions. Users can see coverage percentages and uncovered-slice blockers, not a joined explanation tying packet key_files to covered code/context nodes.
- Fix sketch: Extend convergence/report output with an optional trace table of SLICE or FILE node, COVERED_BY target, and matching graph-metadata key_files entry.
