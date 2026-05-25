Framework: RCAF — SWE-1.6 deep-review iteration worker

# ROLE
Iteration 4 of up to 14 in an autonomous deep-review loop auditing the completed 014 CocoIndex/rerank deprecation. Read-only except your two output files. Sequential_thinking (≥5 thoughts) MANDATORY before output.

# CONTEXT
STATE SUMMARY: Iteration 4 of 14 | Target: 014 deprecation arc (track) | Dimensions 3/4 (correctness+security+traceability DONE) | Next: D4 maintainability | Active findings P0:1 P1:3 P2:3 | Verdict: CONDITIONAL
Prior findings F001-F007: GEMINI.md P0; skill-graph.json/memory:manage-ccc/phase-map-accuracy P1; gitignore/embedder_pluggability-ccc/doctor_deep-loop-glob P2. Charter + 30 surfaces: READ `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-deprecate-coco-index/013-post-deprecation-deep-review/review/deep-review-strategy.md`.
Architecture: code-graph = tree-sitter (no ccc); memory = embedder-backed hybrid. This is a READ-ONLY review — you cannot run builds/tests; reason about behavioral correctness STATICALLY from the code.

# ACTION — iteration 4 = dimension D4 MAINTAINABILITY over clusters D + E (behavior + incidents + kept exceptions). Execute in order:
1. Kept "documented exceptions" — are they justified + inert, or actually a LIVE coupling that should have been removed? Examine: `process-memory-harness.ts` + `process-sweep.vitest.ts` coco/rerank kill-classes (RM-8 — confirm they only pattern-MATCH, never spawn), cli-* `pkill ccc search` cleanup lines, `embedder_pluggability.md §3` banner, test-query fixtures (`F-AC3-*.json`, `409-fixture.json` — coco as search-term data). Acceptance: each classified justified-inert OR flagged as live coupling, with file:line.
2. Static behavioral review (surfaces 16-20) — read (do NOT execute): `handlers/memory-search.ts` (coco calibration/daemon-probe removed — does the fused hybrid path still return results without a dangling reference?), `lib/code-graph-boundary.ts` + `hooks/compact-inject.ts` + `hooks/*/session-prime.ts` (the removed `cocoIndex`/`cocoIndexAvailable` fields — any remaining reader that would read undefined?), `handlers/session-resume.ts` (heavy coco removal — resume path intact?). Acceptance: any logical break or dangling-reference path with file:line, else confirm sound.
3. Incident-revert cleanliness (maintainability lens, surfaces 21-22): grep for any leftover `codeGraph-*` rename artifact (009 incident) or `rerank-rerank-consumer`/`code_graph-complete-fork` falsification (010 incident-#3) outside frozen benchmark data. Acceptance: clean or residue with file:line.
4. Doc-prose accuracy (surface 29): any remaining "enable the sidecar" / "use CocoIndex" misleading INSTRUCTION (the GEMINI.md class) in live docs (excluding the embedder_pluggability §3 banner already noted as F005). Acceptance: misleading-instruction list or clean.

# FORMAT — write `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-deprecate-coco-index/013-post-deprecation-deep-review/review/iterations/iteration-004.md` in EXACTLY this structure (a reducer parses it):
```
# Iteration 4 - D4 Maintainability / Behavior, Incidents & Exceptions
## Dimensions Covered
- maintainability
## Files Reviewed
- `path:line`
## Findings
### P0
- none
### P1
- **F008**: <title> — `path:line` — <recommendation>
### P2
- **F009**: <title> — `path:line` — <recommendation>
## Confirmed-Clean Surfaces
<surfaces verified clean + evidence — esp. the kept-exceptions classified justified-inert>
## Claim Adjudication
- F00N: claim "..."; evidence file:line; counterevidence sought "..."; alternative "..."; finalSeverity P{0|1}; confidence 0.NN
## Next Focus
Synthesis (all 4 dimensions covered) OR remaining gaps
Review verdict: PASS|CONDITIONAL|FAIL
```
Finding lines MUST start `- **F<digits>**: ` (sequential from F008; colon required), then `<title> — \`<file:line>\` — <recommendation>`. `- none` under empty severities. Claim-adjudication for every P0/P1.

THEN append ONE JSON line to `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-deprecate-coco-index/013-post-deprecation-deep-review/review/deltas/iter-004.jsonl`:
`{"type":"iteration","iteration":4,"mode":"review","dimensions":["maintainability"],"filesReviewed":["..."],"findingsSummary":{"P0":N,"P1":N,"P2":N},"findingsNew":{"P0":N,"P1":N,"P2":N},"status":"complete","findingDetails":[{"id":"F008","severity":"P2","title":"...","dimension":"maintainability","file":"path:line","evidence":"...","recommendation":"..."}],"timestamp":"<ISO8601>"}`
(findingsSummary = cumulative active incl prior 1/3/3; findingsNew = NEW this iter as {P0,P1,P2} object.)

CONSTRAINTS: read-only; do NOT fix; no sub-agents; sequential_thinking ≥5 thoughts before output.
