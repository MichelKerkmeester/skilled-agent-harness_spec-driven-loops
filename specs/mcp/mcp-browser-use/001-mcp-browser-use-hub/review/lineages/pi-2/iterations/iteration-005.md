# Review Iteration 005 - mcp-browser-use hub

## Dispatcher

- Mode: review (LEAF, single iteration)
- Run: fanout-pi-2-1795511024070-2cuwlj, generation 4, lineageMode new
- Iteration: 5 of 7
- Dimension: correctness
- Operator review focus: every phase's shipped work against its goal criteria. This iteration closes the evidence loop: it populates the lineage's coverage graph that the first four iterations left empty, re-derives the finding-to-file evidence from the iteration deltas, checks that every registered finding still points at the text it cites, and re-runs the stop decision so the run's terminal state rests on a real graph rather than on a missing database.

## Files Reviewed

- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/review/lineages/pi-2/{deep-review-findings-registry.json,deep-review-config.json,deltas/iter-001..004.jsonl}`
- `.skilled/skills/mcp-browser-use/{SKILL.md,README.md,mcp-chrome-devtools/scripts/install.sh}` (cited finding lines)
- `.skilled/skills/system-deep-loop/runtime/scripts/{upsert.cjs,convergence.cjs}` (invoked, not audited)
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/review/lineages/pi-2/graph-db/deep-loop-graph.sqlite` (written by the workflow's own upsert step)

## Findings

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None new. The four open findings from iterations 1 to 4 stand, and this iteration adds no fifth.

## Coverage Graph Reconciliation

The workflow's seed and per-iteration upsert steps had not run, so `graph-db/` held no database: the stop decision reported `Graph is empty; insufficient data for convergence assessment` and the hotspot gate could not be evaluated. Both steps were run this iteration, exactly as the workflow runs them, with `DEEP_LOOP_COVERAGE_DB_DIR` bound to the lineage's own `graph-db`:

- Seed: `upsert.cjs --seed-source scope_discovery --seed-confidence 0.50` with 526 nodes (522 `FILE` nodes, one per pre-bound scope path, and 4 `DIMENSION` nodes) and 52 `COVERS` edges, one per dimension-to-file pair actually read in iterations 1 to 4.
- Per-iteration: `upsert.cjs --state-log ... --delta-dir ... --iteration N` for N in 1 to 4, which derived one `FINDING` node and one `EVIDENCE_FOR` edge per finding from the delta rows and the record's `findingDetails`. Each call reported `insertedNodes: 1, insertedEdges: 1, rejectedEdges: 0`.

Re-running the stop decision against the populated graph changed three things and nothing else:

| Signal or gate | Before the seed | After the seed |
|---|---|---|
| Graph decision | CONTINUE, "Graph is empty" | STOP_ALLOWED, score 1 |
| `hotspotSaturationGate` | fail (`hotspotSaturated` null) | pass |
| `dimensionCoverageGate` | fail (coverageAge 0) | fail (coverageAge 0) |
| Stop decision | CONTINUE / `noStopCandidate` | CONTINUE / `noStopCandidate` |

The remaining block is arithmetic, not missing evidence: the weighted stop score is 0.584 against a 0.60 bar, and the dimension-coverage gate needs one more iteration after the iteration that completed all four dimensions, which is what iteration 4 did. Both are expected to move on the next evaluation; no gate is blocked by a defect.

## Registry Integrity

Every registered finding was re-checked against its cited file and line, and every one resolves:

| Finding | Citation | Line content |
|---|---|---|
| PI2-D1-P2-001 | `.skilled/skills/mcp-browser-use/SKILL.md:62` | "Take the mode from the compiled front door first, `node .skilled/bin/compiled-route.cjs --hub mcp-browser-use ...`" |
| PI2-D2-P2-001 | `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/install.sh:30` | `readonly MCP_PACKAGE="browser-debugger-cli@0.6.10"` |
| PI2-D3-P2-001 | `.skilled/skills/mcp-browser-use/README.md:70` | `| 1.1.1.0 | [\`changelog/v1.1.1.0.md\`](./changelog/v1.1.1.0.md) |` |
| PI2-D4-P2-001 | `.skilled/skills/mcp-browser-use/README.md:68` | `| Release | Entry |` -- the section's table header; the format sentence the finding is about is at line 66 |

One correction, recorded here so the remediation does not have to rediscover it: PI2-D4-P2-001's substance is README line 66 ("Each entry opens with the release title and the reason, then lists what changed and the files changed"), and line 68 is the table header that locating the section anchored on. The defective sentence and the incomplete table sit three lines apart, so one edit closes both.

Registry state after the reducer: 4 open findings, 0 resolved, `P0 0 / P1 0 / P2 4`, `dimensionCoverage` true for all four dimensions, and the traceability ledger at 2 required protocols, 2 executed, 2 pass, 0 fail, 1 notApplicable.

## Edge Cases

- The seed's 522 `FILE` nodes give the graph a nominal scope of the whole packet while only about forty files were read. That is the intended shape -- the seed records the frontier, not the coverage -- and the hotspot gate reads the coverage edges, not the node count.
- Two `DIMENSION` nodes carry a `COVERS` edge to the same file where two dimensions read it (for example `README.md` under traceability and again under maintainability). The upsert deduplicated by edge id per dimension, so the second edge adds a parallel relation rather than rewriting the first.
- The per-iteration upsert read iteration records whose `findingDetails` carry a `file` of the form `path:line`; `parseFindingRef` dropped the line and attached the `EVIDENCE_FOR` edge to the file node, which is why the graph's evidence edges are per file rather than per line.
- `graphConvergenceScore` was 0 before the seed and 1 after it; neither number is a review result, both describe the graph's completeness, so no verdict term is derived from them.

## Confirmed-Clean Surfaces

- All four finding citations resolve to existing files, and three of the four point at the exact defective line.
- The graph now carries one `FINDING` node per open finding with an `EVIDENCE_FOR` edge to the cited file, so the synthesis invariant that each structured finding is represented in the graph holds.
- `rejectedEdges: 0` on every upsert call, so no edge named a node the batch or the graph did not declare.
- No reducer corruption warnings and no search debt after the run: `corruptionCount: 0`, `searchDebtCount: 0`.

## Ruled Out

- "The stop decision is CONTINUE because the review found too much": ruled out -- the graph decision is STOP_ALLOWED, the only failing gates are the two the arithmetic above explains, and no gate names a missing artifact or an unresolved finding.
- "The registry lost the finding metadata": ruled out -- `findingClass` and `scopeProof` are null in the reducer's view but present in the iteration records and deltas, which is where the remediation reads them.

## Next Focus

- Dimension: maintainability and security, second pass
- Focus area: the in-scope surfaces no iteration has opened yet -- the Chrome DevTools shared helper script, the hub `shared/` folder, the feature-catalog and playbook claims that assert counts, and the mode safety contracts the hub delegates to.
- Reason: evidence density is the one thing this run can still improve honestly; the four findings are all documentation-level, and the unread half of the scope is where a behavioural defect would hide.
- Required evidence: file:line for anything raised, and one command per asserted count.
- Rotation status: D1 to D4 covered; this is depth, not rotation.

Review verdict: PASS
