Framework: RCAF — SWE-1.6 deep-review iteration worker

# ROLE
Iteration 7 of up to 14 — DEEP exhaustive residue sweep of surfaces analogous to where iter-6 just found NEW residue (feature_catalog + launcher-libs). The pattern this review keeps confirming: deeper digging finds more. Read-only except your two output files. Sequential_thinking (≥5 thoughts) MANDATORY before output.

# CONTEXT
STATE SUMMARY: Iteration 7 of 14 | Target: 014 deprecation arc (track) | This pass: deep exhaustive residue | Active findings P0:1 P1:4 P2:4 | Verdict: FAIL
iter-6 found: F008 (system-code-graph feature_catalog still claims a deleted 07--ccc-integration dir + ccc tools) + F009 (.opencode/bin/lib/sidecar-env-allowlist.cjs:17 dead RERANK_ env prefix). This pass sweeps the ANALOGOUS surfaces for the same classes of residue. Charter: READ `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-deprecate-coco-index/013-post-deprecation-deep-review/review/deep-review-strategy.md`. Architecture: code-graph = tree-sitter; memory = embedder-backed hybrid.

# ACTION — iteration 7 = DEEP exhaustive residue. Execute in order:
1. The OTHER feature_catalog — `system-spec-kit/feature_catalog/**`: grep for coco/ccc/rerank/cocoindex capability claims or references to deleted dirs/tools (analogous to the code-graph catalog F008). Acceptance: stale catalog claims with file:line, or clean.
2. The OTHER launcher-libs — `.opencode/bin/**` (all `.cjs`, esp `lib/*`): grep for coco/ccc/rerank/8765/RERANK_/sidecar residue (analogous to the sidecar-env-allowlist F009). Note: is `sidecar-env-allowlist.cjs` ITSELF now vestigial (the sidecar is deleted)? Classify. Acceptance: residue with file:line per file, or clean.
3. references/ docs across skills — grep `.opencode/skills/*/references/**` (excl changelog) for live coco/ccc/rerank capability claims or "use CocoIndex"/"enable the sidecar" instructions beyond the documented embedder_pluggability §3 banner. Acceptance: misleading doc refs with file:line, or clean.
4. EXHAUSTIVE alias grep across ALL `.opencode/skills/**` + `.opencode/commands/**` (excl: `**/changelog/**`, `**/dist/**`, `**/benchmarks/**`, `**/specs/**`, and the documented exceptions — `process-memory-harness`/`process-sweep`, `embedder_pluggability.md §3`, `F-AC3-*`/`409-fixture`, cli-* `pkill ccc search`): for `cocoindex`, `mcp__cocoindex_code`, bare `ccc ` + subcommands, `ccc_status|ccc_reindex|ccc_feedback`, `rerank_sidecar`, `8765`, `SPECKIT_CROSS_ENCODER`. Acceptance: a deduped list of any remaining NEW live refs with file:line (this is the final completeness gate).

# FORMAT — write `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-deprecate-coco-index/013-post-deprecation-deep-review/review/iterations/iteration-007.md` EXACTLY:
```
# Iteration 7 - Deep Exhaustive Residue Sweep
## Dimensions Covered
- traceability
- maintainability
## Files Reviewed
- `path:line`
## Findings
### P0
- none
### P1
- **F010**: <title> — `path:line` — <recommendation>
### P2
- **F011**: <title> — `path:line` — <recommendation>
## Confirmed-Clean Surfaces
<what you verified clean, with grep evidence — esp. the exhaustive alias grep result>
## Claim Adjudication
- F0NN: claim "..."; evidence file:line; counterevidence sought "..."; alternative "..."; finalSeverity P{0|1}; confidence 0.NN
## Next Focus
Synthesis if exhausted, OR remaining gap
Review verdict: PASS|CONDITIONAL|FAIL
```
Finding lines MUST start `- **F<digits>**: ` (sequential from F010; colon required). `- none` under empty severities. If NOTHING new, say so + findingsNew {P0:0,P1:0,P2:0} (a clean exhaustive sweep is the convergence signal).

THEN append ONE JSON line to `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-deprecate-coco-index/013-post-deprecation-deep-review/review/deltas/iter-007.jsonl`:
`{"type":"iteration","iteration":7,"mode":"review","dimensions":["traceability","maintainability"],"filesReviewed":["..."],"findingsSummary":{"P0":N,"P1":N,"P2":N},"findingsNew":{"P0":N,"P1":N,"P2":N},"status":"complete","findingDetails":[...],"timestamp":"<ISO8601>"}`
(findingsSummary = cumulative active incl prior 1/4/4; findingsNew = NEW this iter as {P0,P1,P2} object.)

CONSTRAINTS: read-only; do NOT fix; no sub-agents; sequential_thinking ≥5 thoughts before output.
