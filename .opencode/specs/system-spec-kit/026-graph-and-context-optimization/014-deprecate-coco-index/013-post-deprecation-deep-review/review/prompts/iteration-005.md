Framework: RCAF — SWE-1.6 deep-review iteration worker

# ROLE
Iteration 5 of up to 14 in an autonomous deep-review loop auditing the completed 014 CocoIndex/rerank deprecation. This is a DEEPER 2nd-pass on the highest-risk correctness surfaces (the cluster-level passes 1-4 found 7 items; this pass digs finer). Read-only except your two output files. Sequential_thinking (≥5 thoughts) MANDATORY before output.

# CONTEXT
STATE SUMMARY: Iteration 5 of 14 | Target: 014 deprecation arc (track) | Dimensions 4/4 covered (1 pass each) | This pass: D1 correctness DEEP | Active findings P0:1 P1:2 P2:4 | Verdict: FAIL
Known: code-graph = tree-sitter (no ccc/.venv); memory search = embedder-backed hybrid; phase 002 had a LATENT cross-skill typecheck break (memory consumers referenced cocoIndex/cocoIndexAvailable fields code-graph removed from MergeInput/StartupBriefResult) that was fixed — this pass hunts for ANY OTHER such break. Charter: READ `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-deprecate-coco-index/013-post-deprecation-deep-review/review/deep-review-strategy.md`.

# ACTION — iteration 5 = D1 CORRECTNESS, DEEP. Execute in order:
1. Cross-skill TYPE-BOUNDARY hunt (surface 15 — the latent-002-break class): grep for cross-skill type IMPORTS where one skill imports a type from another that had coco fields removed. Check `system-spec-kit/mcp_server/lib/shared/**`, `system-code-graph/mcp_server/lib/shared/code-graph-contracts.ts`, and any `import type {...} from '...system-code-graph...'` or cross-skill contract. Look for a consumer still referencing a removed field (cocoIndex/cocoIndexAvailable/cocoindexCalibration) on an imported type, or an object literal passing a now-removed field. Acceptance: each cross-skill type-consumer confirmed sound OR a break with file:line.
2. Behavioral DANGLING-REF hunt (surfaces 16-19, deeper than iter-4): read `handlers/memory-search.ts`, `handlers/session-resume.ts`, `lib/code-graph-boundary.ts`, `hooks/claude/compact-inject.ts`, `hooks/*/session-prime.ts` — search for any remaining IDENTIFIER referencing removed coco code (e.g. `probeCocoIndex`, `calibrateCoco`, `cocoIndexProbe`, `isCocoIndexAvailable`, `cocoindexCalibration`) that survives as a dangling call/read/destructure (would throw or read undefined at runtime). Acceptance: each file confirmed dangling-free OR a dangling ref with file:line.
3. Deep-loop executor integrity (surfaces 9/20): read the 4 executor YAMLs (`deep_start-{research,review}-loop_{auto,confirm}.yaml`) — confirm NO `cocoindex_code` in `mcp_servers:`/`tools:` AND that the loop's "code context bootstrap" step (if any) doesn't call a removed coco tool. Acceptance: clean or a residual call with file:line.

# FORMAT — write `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-deprecate-coco-index/013-post-deprecation-deep-review/review/iterations/iteration-005.md` EXACTLY:
```
# Iteration 5 - D1 Correctness (deep) / Cross-Skill Types & Behavioral Paths
## Dimensions Covered
- correctness
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
<what you verified sound, with the grep/read evidence — esp. the cross-skill type consumers + the behavioral files>
## Claim Adjudication
- F00N: claim "..."; evidence file:line; counterevidence sought "..."; alternative "..."; finalSeverity P{0|1}; confidence 0.NN
## Next Focus
D2/D3 deep 2nd-pass OR synthesis if clean
Review verdict: PASS|CONDITIONAL|FAIL
```
Finding lines MUST start `- **F<digits>**: ` (sequential from F008; colon required), then `<title> — \`<file:line>\` — <recommendation>`. `- none` under empty severities. Claim-adjudication for every P0/P1. If this deep pass finds NOTHING new, that is a VALID and valuable result — say so in Confirmed-Clean and set findingsNew to {P0:0,P1:0,P2:0}.

THEN append ONE JSON line to `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-deprecate-coco-index/013-post-deprecation-deep-review/review/deltas/iter-005.jsonl`:
`{"type":"iteration","iteration":5,"mode":"review","dimensions":["correctness"],"filesReviewed":["..."],"findingsSummary":{"P0":N,"P1":N,"P2":N},"findingsNew":{"P0":N,"P1":N,"P2":N},"status":"complete","findingDetails":[...],"timestamp":"<ISO8601>"}`
(findingsSummary = cumulative active incl prior 1/2/4; findingsNew = NEW this iter as {P0,P1,P2} object.)

CONSTRAINTS: read-only; do NOT fix; no sub-agents; sequential_thinking ≥5 thoughts before output.
