Framework: RCAF — SWE-1.6 deep-review iteration worker

# ROLE
Iteration 3 of up to 14 in an autonomous deep-review loop auditing the completed 014 CocoIndex/rerank deprecation. Read-only except your two output files. Sequential_thinking (≥5 thoughts) MANDATORY before output.

# CONTEXT
STATE SUMMARY: Iteration 3 of 14 | Target: 014 deprecation arc (track) | Dimensions 2/4 (correctness+security DONE) | Next: D3 traceability | Active findings P0:1 P1:2 P2:3 | Verdict: CONDITIONAL
Prior: iter-1 found the 4 reference misses; iter-2 found 2 P2s (embedder_pluggability §3 obsolete ccc, doctor_deep-loop.yaml:97 vestigial coco glob) + confirmed the 6 MCP configs / executor YAMLs / mirrors clean. Charter + 30 surfaces: READ `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-deprecate-coco-index/013-post-deprecation-deep-review/review/deep-review-strategy.md`.

# ACTION — iteration 3 = dimension D3 TRACEABILITY over clusters B + F (cross-reference protocols + governance/decision integrity). Execute in order:
1. `agent_cross_runtime` parity: compare the 014-touched routing/agent docs across runtimes (`CLAUDE.md`/`AGENTS.md`/`.claude/CLAUDE.md`/`.gemini/GEMINI.md`/`.codex/AGENTS.md` + `{context,deep-review}` agents in `.opencode/.claude/.gemini/.codex`). The GEMINI.md P0 was one drift — find any OTHER runtime that disagrees on the post-coco HYBRID search-routing policy. Acceptance: per-runtime parity/drift with file:line.
2. `spec_code` + resource-map coverage: read `../resource-map.md` (the 014 classified touchpoint map) + the 014 phase-parent `spec.md` phase-map (002-012). Cross-check: do the resource-map's DELETE/EDIT classifications + the phase-map's "complete" claims match the actual repo state? Any touchpoint the map listed that's still live, or any "complete" phase with residue? Acceptance: matched / mismatched entries with evidence.
3. Memory/continuity accuracy: read `MEMORY.md` + the `project_014_coco_rerank_deprecation` memory entry. Flag stale claims — especially the "0 live refs" / "complete" assertions now disproven by iter-1's 4 misses + iter-2's 2 P2s. Acceptance: stale memory claims with the contradicting finding.
4. Skill-advisor routing (surface 30): read the advisor scorer fixtures/lanes (`system-skill-advisor/mcp_server/tests/scorer/fixtures/*`, `lib/scorer/lanes/*`) — for a "find code by concept / semantic code search" intent, does anything still route to the deleted `mcp-coco-index`, or correctly to code-graph/Grep? Acceptance: routing target with evidence.

# FORMAT — write `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-deprecate-coco-index/013-post-deprecation-deep-review/review/iterations/iteration-003.md` in EXACTLY this structure (a reducer parses it — deviating drops findings):
```
# Iteration 3 - D3 Traceability / Cross-Reference & Governance
## Files Reviewed
- `path:line`
## Findings
### P0
- none
### P1
- **F007**: <title> — `path:line` — <recommendation>
### P2
- **F008**: <title> — `path:line` — <recommendation>
## Confirmed-Clean Surfaces
<surfaces verified clean + the grep/read evidence>
## Claim Adjudication
- F00N: claim "..."; evidence file:line; counterevidence sought "..."; alternative "..."; finalSeverity P{0|1}; confidence 0.NN
## Next Focus
D4 Maintainability over clusters D+E
Review verdict: PASS|CONDITIONAL|FAIL
```
Finding lines MUST start `- **F<digits>**: ` (sequential IDs from F007; colon required), then `<title> — \`<file:line>\` — <recommendation>`. `- none` under empty severities. Claim-adjudication packet for every P0/P1.

THEN append ONE JSON line to `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-deprecate-coco-index/013-post-deprecation-deep-review/review/deltas/iter-003.jsonl`:
`{"type":"iteration","iteration":3,"mode":"review","dimensions":["traceability"],"filesReviewed":["..."],"findingsSummary":{"P0":N,"P1":N,"P2":N},"findingsNew":{"P0":N,"P1":N,"P2":N},"status":"complete","findingDetails":[{"id":"F007","severity":"P2","title":"...","dimension":"traceability","file":"path:line","evidence":"...","recommendation":"..."}],"timestamp":"<ISO8601>"}`
(findingsSummary = cumulative active including prior 1/2/3; findingsNew = NEW this iter, as a {P0,P1,P2} object.)

CONSTRAINTS: read-only; do NOT fix; no sub-agents; sequential_thinking ≥5 thoughts before output.
