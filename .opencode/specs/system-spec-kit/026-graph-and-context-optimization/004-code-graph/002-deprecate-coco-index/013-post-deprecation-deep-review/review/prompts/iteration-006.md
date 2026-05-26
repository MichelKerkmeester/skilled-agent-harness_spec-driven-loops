Framework: RCAF — SWE-1.6 deep-review iteration worker

# ROLE
Iteration 6 of up to 14 — DEEP 2nd-pass on the surfaces the cluster-level passes treated only summarily (doctor assets, feature_catalog, install_guides, launchers, config-note dead flags). Read-only except your two output files. Sequential_thinking (≥5 thoughts) MANDATORY before output.

# CONTEXT
STATE SUMMARY: Iteration 6 of 14 | Target: 014 deprecation arc (track) | Dimensions 4/4 + deep correctness (iter-5: 0 new) | This pass: deep D2 Security + D3 Traceability | Active findings P0:1 P1:3 P2:3 | Verdict: FAIL
Prior passes confirmed: configs/mirrors/executor-YAMLs clean (iter-2), cross-skill types + behavioral paths clean (iter-5). A dead `SPECKIT_RERANK_LAYER` flag was found+removed from 4 MCP configs' notes during this review. Charter: READ `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-deprecate-coco-index/013-post-deprecation-deep-review/review/deep-review-strategy.md`. Architecture: code-graph = tree-sitter; memory = embedder-backed hybrid.

# ACTION — iteration 6 = DEEP D2 Security + D3 Traceability over under-covered surfaces. Execute in order:
1. Doctor command surface (deeper than iter-2's executor-YAML check): grep ALL `.opencode/commands/doctor/**` (`.md` + `assets/*.yaml`) for coco/ccc/rerank/8765 — any other vestigial route, forbidden-target glob (like the doctor_deep-loop.yaml:97 one already found as F006), or stale doctor-cocoindex reference beyond the deleted playbooks. Acceptance: clean or residue with file:line.
2. feature_catalog + install_guides traceability: grep `system-code-graph/feature_catalog/**`, `system-spec-kit/feature_catalog/**`, `.opencode/install_guides/**` for live coco/ccc/rerank capability claims or install steps (excl changelog). A catalog entry claiming a removed capability is a P2 traceability finding. Acceptance: stale catalog/install claims with file:line, or clean.
3. Launcher + script residue (security/maintainability): grep `.opencode/bin/*.cjs` (the mk-*-launcher.cjs) + `.opencode/scripts/**` for coco/ccc/rerank/8765/ensure-rerank residue beyond the documented orphan-sweep exceptions. Acceptance: clean or residue with file:line.
4. Other dead config flags: beyond the removed `SPECKIT_RERANK_LAYER`, scan the MCP config `_NOTE_*` blocks + env for any OTHER flag/note referencing a removed coco/rerank capability. Acceptance: clean or other dead-flag with file:line.

# FORMAT — write `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-deprecate-coco-index/013-post-deprecation-deep-review/review/iterations/iteration-006.md` EXACTLY:
```
# Iteration 6 - D2/D3 Deep / Doctor, Catalog, Launchers, Config Flags
## Dimensions Covered
- security
- traceability
## Files Reviewed
- `path:line`
## Findings
### P0
- none
### P1
- none
### P2
- **F008**: <title> — `path:line` — <recommendation>
## Confirmed-Clean Surfaces
<what you verified clean, with grep evidence>
## Claim Adjudication
- F00N: claim "..."; evidence file:line; counterevidence sought "..."; alternative "..."; finalSeverity P{0|1}; confidence 0.NN
## Next Focus
Synthesis (stabilized) OR remaining gap
Review verdict: PASS|CONDITIONAL|FAIL
```
Finding lines MUST start `- **F<digits>**: ` (sequential from F008; colon required). `- none` under empty severities. If this pass finds NOTHING new, that is a valid stabilization result — say so and set findingsNew {P0:0,P1:0,P2:0}.

THEN append ONE JSON line to `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-deprecate-coco-index/013-post-deprecation-deep-review/review/deltas/iter-006.jsonl`:
`{"type":"iteration","iteration":6,"mode":"review","dimensions":["security","traceability"],"filesReviewed":["..."],"findingsSummary":{"P0":N,"P1":N,"P2":N},"findingsNew":{"P0":N,"P1":N,"P2":N},"status":"complete","findingDetails":[...],"timestamp":"<ISO8601>"}`
(findingsSummary = cumulative active incl prior 1/3/3; findingsNew = NEW this iter as {P0,P1,P2} object.)

CONSTRAINTS: read-only; do NOT fix; no sub-agents; sequential_thinking ≥5 thoughts before output.
