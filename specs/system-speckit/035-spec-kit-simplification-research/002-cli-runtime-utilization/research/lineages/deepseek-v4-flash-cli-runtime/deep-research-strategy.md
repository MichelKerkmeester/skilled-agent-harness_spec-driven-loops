---
title: Deep Research Strategy - deepseek-v4-flash-cli-runtime
description: Terminal strategy for the round-two detached lineage (remediation verification + round-one gap hunting + kept-row re-examination).
contextType: planning
version: 1.14.0.19
trigger_phrases: []
---

# Deep Research Strategy - Session Tracking

## 2. TOPIC

Round two of the @spec-kit/cli audit AFTER the 007/008 remediation. Three jobs, in priority order: (1) verify each remediation landed completely (a leftover consumer, document line, fixture or asset is a finding); (2) find what round one missed, preferring angles it covered in one pass; (3) re-examine round-one kept rows with new evidence only. Every count recounted in this tree; no validate.sh, no node tooling, no git; checked-in source only (two round-one findings were worktree artifacts).

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)

All eight resolved. Severity-weighted coverage:

- [x] Q1 removal census — landed (findings 1, 3)
- [x] Q2 008 census — landed except one doc row (finding 2)
- [x] Q3 007 fix rows — landed except two regex documents (finding 4)
- [x] Q4 round-one misses — six dead modules/dirs + one superseded row (findings 8, 9, 10, 13, 15, 16, 17)
- [x] Q5 live registry — complete in the dispatch direction; one dead unregistered check (finding 6)
- [x] Q6 zero-callers — certified set (findings 6, 7, 8, 9, 10, 11, 13, 18, 19)
- [x] Q7 sync/eval invocation — pi/ gap + CI boundary (findings 15, 16, 17, 12)
- [x] Q8 kept decisions — all held; resource-map row superseded (finding 14)

<!-- /ANCHOR:key-questions -->

## 4. NON-GOALS

- No file edits to the audited package; report findings only.
- No rewrite proposals beyond removal, merge, fix, or document.
- No evaluation of prose style or naming conventions for their own sake.
- No writes outside this lineage artifact directory.
- No execution of the repository's tooling.

## 5. STOP CONDITIONS

- Run exactly ten iterations even if convergence telemetry becomes positive; convergence is telemetry only under the max-iterations stop policy.
- The terminal synthesis record carries stopReason maxIterationsReached.
- Every no-caller claim distinguishes none-found from caller-not-checked.
- A remediation-incompleteness finding required the leftover verified in the checked-in tree with its path:line.

## 6. ANSWERED QUESTIONS

- Q1: 007/008 removals complete at file+reference level; three doc/fixture residuals (findings 1-3).
- Q2: 008 landed; one second env-document row remains (finding 1).
- Q3: 007 fix rows landed except the two looser-regex documents (finding 4).
- Q4: round-one misses = check-doc-pointers.sh, check-links.sh shim, three utils deads, core/alignment-validator twin, live-session-wrapper, pi/ syncs, optimizer/, migrate-generated-json, generate-command-routers, cli-capture-shared, validator-registry.ts, resource-map row superseded.
- Q5: registry complete (31 unique paths; all resolve; virtuals accounted); check-doc-pointers.sh is the one unregistered never-dispatched check.
- Q6: certified zero-caller set across commands/hooks/plugins/workflows/doctor/CI + sibling skills.
- Q7: mirrors run via doctor (6) + CI (5); pi/ syncs nowhere; evals gate in CI via npm run check; CI coverage boundary = cli vitest project only (finding 12).
- Q8: kept rows held; resource-map extractor wiring exists (finding 14) so lane 004 has no wiring object.

## 7. WHAT WORKED

- The script-to-registry direction (iterate rules/ and ask "is this reachable?") — found the one dead check round one's registry-direction missed.
- Per-file import census in python with both import forms (within-lib `./x.js` and cross-dir `lib/x.js`) — the single most productive method (utils/, lib/).
- Exec-vs-doc caller census (rg over commands/hooks/plugins/workflows + agent/mode dirs) — separated documented-manual tools (deploy-mcp, sweep-track-roots, retrofit) from dead entry points (pi syncs, check-links shim).
- The false-lead discipline: four candidate findings retracted on verification (ghost l.sh/l.ts, broken dist path, retrieval/retrofit duplication, lib/ census zeros) — zero wrong claims on the table.
- Tracing the OTHER direction for the resource-map row (who imports shared/synthesis/resource-map.cjs) instead of re-grepping the YAML — overturned a round-one kept row with one hop.

## 8. WHAT FAILED

- The first import-form census missed within-lib relative imports (`./phase-classifier.js`) and `.cjs` requires — corrected in iteration 9, and all false zeros verified live before any claim was filed on them.
- The iteration-4 grep-based importer "census" (iteration 2's draft) was noisy — replaced with the python pass.

## 9. EXHAUSTED APPROACHES

- Registry-driven discovery of dead checks (round one's direction) — exhausted; the opposite direction found the gap.
- Doc-row citation of manual tools as liveness evidence — exhausted; exec evidence is the rule.

## 10. RULED-OUT DIRECTIONS

- Re-listings of kept rows (all held; one superseded).
- Ghost-file and broken-path candidates (retracted).
- The worktree-scoped facts (dist/node_modules symlinks, .opencode/specs topology) as findings.

## 11. DIVERGENCE FRONTIER

- None open: all eight questions resolved; the residuals are the two dynamic-import and worktree-scope caveats, carried in the synthesis.

## 12. NEXT FOCUS

None — loop at the configured maximum; synthesis emitted.
