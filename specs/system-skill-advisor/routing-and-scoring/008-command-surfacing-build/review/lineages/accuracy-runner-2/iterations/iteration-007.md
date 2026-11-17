# Review Iteration 007

## Dispatcher

- Mode: review (fan-out lineage `accuracy-runner-2`, pass two)
- Session: `fanout-accuracy-runner-2-1794570021136-noekp0`, generation 1, lineage mode `new`
- Dimension: adjudication across all four dimensions
- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder)
- Budget profile: adjudicate (9 review actions)
- Operator review focus bound as `review_focus`: pass-two review of command surfacing in the `accuracy-runner` area; confirm the final severity and wording of every active finding, and make sure no P0 or P1 is hidden behind an advisory.
- How this iteration addressed the focus: it re-read every active P2's case and evidence, checked that no finding sits outside the declared area or depends on inference alone, confirmed the pass-one deferred and refuted items were not re-reported, and evaluated the stop condition. The loop reaches `maxIterations=7` without a legal graph-backed STOP, exactly as the pass-one lineages did, so the stop reason is `maxIterationsReached`.
- `steer.md`: absent before this iteration; no lead rulings to apply.

## Files Reviewed

- All twelve active finding lines, re-read at iteration 6 and cross-checked here against the finding text.
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-routing-baseline.json` (counts only)
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/review-report-pass-1.md:394-404` (deferred items, checked for non-duplication)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None new. Twelve P2s are active from iterations 1 to 5; their adjudication is below.

## Adjudication of Active P2s

All twelve are confirmed at P2 with `file:line` evidence and a concrete case. None is inference-only, none sits outside the area, and none is a re-report of a pass-one finding whose fix holds or of a section-8 deferred item.

| # | Finding | Evidence | Case check | Severity check |
|---|---|---|---|---|
| 1 | `iter3-P2-phase007-open-evidence` | `spec.md:122`; `007/tasks.md:141` | Parent-map reader cannot tell why 007 is open | P2: navigation, not a wrong result |
| 2 | `iter2-P2-g2-row-id-arm-mislabel` | `run-command-behaviour.mjs:974,1232` | `--row-id g2-...` logs arm `pre` | P2: a mislabeled measurement, no data loss |
| 3 | `iter2-P2-backfill-fixture-mismatch` | `run-command-behaviour.mjs:793-803,1213-1220` | custom `--fixture` replays the default path | P2: backfill is a diagnostic path |
| 4 | `iter2-P2-capture-env-not-restored` | `capture-command-routing-baseline.mjs:361-377,662-668` | second in-process score inherits a deleted db dir | P2: in-process harness only |
| 5 | `iter2-P2-cost-script-child-brief` | `measure-brief-cost.mjs:167`; `render.ts:533` | `AI_SESSION_CHILD=1` measures the child brief | P2: dispatched-worker context |
| 6 | `iter3-P2-backfill-log-code-execution` | `command-offer.mjs:333,406-428` | crafted log's `projectDir` runs its hook | P2: needs an untrusted log and a crafted directory |
| 7 | `iter4-P2-playbook-inventory-note` | `manual-testing-playbook.md:40` | reader sees 41 `NNN-*.md` against 50 files | P2: documentation drift |
| 8 | `iter4-P2-playbook-persistence-path` | `manual-testing-playbook.md:30` | `benchmark/reports/` does not exist under the skill | P2: documentation drift |
| 9 | `iter4-P2-tests-readme-description` | `runtime/tests/README.md:154` | table misdescribes the inventory test | P2: maintainer navigation |
| 10 | `iter4-P2-row-id-session-mode` | `README.md:112`; `score-command-transcripts.mjs:1455` | `--row-id` accepted and ignored in session mode | P2: silent flag |
| 11 | `iter5-P2-quoted-path-restore` | `worktree-restore.mjs:54,79` | a file with a space cannot be restored, arm stops | P2: fails safe, blocks the next arm |
| 12 | `iter5-P2-scorer-header-ordered-report` | `score-command-transcripts.mjs:5-9` | header promises an ordered report the CLI never prints | P2: maintainer time |

Severity checks applied: none of the twelve crosses a trust boundary in a default path (findings 6 and 11 are the closest, and both need a non-default input), none leaves a wrong score silently (11 fails the arm; 6 is a local backfill tool), and none blocks release by itself. Finding 2 is the only one that can put a wrong number in front of a reader on a default path **if** the operator selects a g2 row by id, which the CLI documents as supported; it still mislabels rather than fails, so P2 stands.

## Pass-One Non-Duplication Check

- No re-report of a pass-one finding whose fix holds: the fix replay in iteration 1 covers all nine items and only the phase-map partial is reported.
- No report of section-8 deferred items: the `run`-writes decision, the dsh install path, the sandboxed-runtime reach, the DSH `source` reach and the third no-edit pattern are untouched.
- No report of `R4-P2-003` (the AGENTS.md edit that waits on the operator) or of the refuted finding.
- The four doc findings are new; none of them is a rewrite of a pass-one item.

## Stop Evaluation

- Iterations dispatched: 7. `maxIterations=7` is reached, so the workflow's hard stop applies with `stopReason: maxIterationsReached`.
- The coverage graph is unavailable for this lineage (`graphCoverageMode: graphless_fallback`), so the graph prerequisite cannot return `STOP_ALLOWED`; a legal graph-backed STOP is not claimed.
- Dimension coverage: correctness (iterations 1-2), security (3), traceability (4), maintainability (5), stabilization (6), adjudication (7). Required traceability protocols: `spec_code` pass, `checklist_evidence` partial with a named packet gap, overlays recorded.
- Active findings: P0=0, P1=0, P2=12. The verdict mapping is therefore PASS with `hasAdvisories=true`.

## Traceability Checks

- `spec_code`: pass. Five floors and the pinned clock re-derived.
- `checklist_evidence`: partial. Phase 007's T020/T046 and AC-004/005/007 remain open; the parent map note is finding 1.
- `skill_agent`: notApplicable.
- `agent_cross_runtime`: partial. Read evidence for six runtimes; live proof stays phase 007's.
- `feature_catalog_code`: pass.
- `playbook_capability`: partial. NC-011 holds; the root playbook carries findings 7 and 8.

## Integration Evidence

- The terminal record and this narrative agree on counts (12 active P2, 0 P0, 0 P1) and on the stop reason; the reducer's registry is the record the merge reads.
- The synthesis report will restate the same counts from the registry, not from this prose.

## Edge Cases

- **The loop stops at the cap, not at legal convergence.** Pass one did the same for every lineage because the graph was unavailable; the report must say so rather than claim convergence.
- **Findings 2-6 and 11 are code-shaped and cheap to fix**, but this review changes no code; they stay advisories for the remediation owner.
- **No live arm and no graph.** Both limits are recorded on every iteration that depended on them.

## Confirmed-Clean Surfaces

- The verdict mapping: no active P0 or P1, so PASS with advisories.
- The finding registry's counts match the iteration records.
- No file outside the lineage was modified by this review; the only writes are the iteration, delta, strategy, registry/dashboard, and report artifacts inside the lineage.

## Ruled Out

- **Holding a P2 as a P1 to make the report look thorough.** Rejected: every P2's reach was tested, and the two closest (log-path execution, quoted-path restore) need a non-default input.
- **Calling the run converged.** Rejected: the graph-backed STOP was unavailable and the cap was reached.
- **Re-opening the pass-one credential and holdout items at P1.** Rejected: the fixes hold and the replay rows pass with evidence.

## Next Focus

- Dimension: synthesis
- Focus area: compile the lineage report from the registry and the seven iteration files, then let the cross-lineage merge recompute the merged verdict
- Reason: the cap is reached; no further iteration can change the active set without new evidence
- Rotation status: all dimensions complete, stabilization and adjudication done
- Blocked/productive carry-forward: blocked (no live arm, no graph); productive (fix replay, doc/tree comparison, restore probe)
- Required evidence: the report's counts equal the registry's, and the final line is exactly one verdict

Review verdict: PASS
