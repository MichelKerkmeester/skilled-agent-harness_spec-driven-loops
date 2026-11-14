# Review Iteration 004

## Dispatcher

- Mode: review (fan-out lineage `render-hooks-plugin-4`, pass four)
- Session: `fanout-render-hooks-plugin-4-1794669272137-9v23rz`, generation 1, lineage mode `new`
- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build`
- Area: `render-hooks-plugin` — the seven rows of `review/review-scope-4.txt` for this area, plus the shared docs that state their contract.
- Operator review focus addressed this iteration: the brief's full check list has now been run across the changed set. This is the required coverage-stabilization pass after iteration 3 completed the fourth dimension: it re-reads each active finding at its current site, rechecks the changed tests that pin it, and confirms the registry still agrees with the three iteration files. No new review direction is opened.
- Budget profile: `scan` (9 analysis actions)

## Files Reviewed

- `.skilled/hooks/shared/session-readers/codex.mjs:142-192` — R4-P2-001 recheck, containment/read split
- `.skilled/hooks/shared/tests/session-readers/codex.test.mjs:28-100` — the pinned custom-body, function-argument and outside-store cases
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:452-494` — R4-P2-002 recheck, the top-only index branch
- `.opencode/plugins/system-skill-advisor.js:607-616`, `:848-862` — R4-P2-002 recheck, first-passing selection and request
- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:514-616` — head/companion labels and R4-P2-003 evidence
- `.skilled/skills/system-skill-advisor/README.md:121` — R4-P2-003 recheck
- `.skilled/skills/system-skill-advisor/runtime/tests/doctor-brief-render.vitest.ts:52-187` — policy, child and sanitizer pins
- `.opencode/plugins/tests/system-skill-advisor.test.cjs:519-607` — first-passing and top-only pins
- `.skilled/skills/system-skill-advisor/runtime/tests/command-brief-golden.vitest.ts:170-254` — ambiguous head pins

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None new. The three active findings below were re-read at their current lines and remain as recorded; none moved, changed severity, or gained a counterexample.

| Id | Severity | Site | Current evidence |
|---|---|---|---|
| R4-P2-001 | P2 | `.skilled/hooks/shared/session-readers/codex.mjs:167` | `storePath` is assigned at `:163` and reported at `:188`, while the bytes are read from `transcriptPath` at `:167`; the other path-locator readers still read `storePath`. |
| R4-P2-002 | P2 | `.opencode/plugins/system-skill-advisor.js:858` | The top-only request still skips index > 0 in `advisor-recommend.ts:462`, while `render.ts:530-540` leads with the first passing row. |
| R4-P2-003 | P2 | `.skilled/skills/system-skill-advisor/README.md:121` | The README still names only run/start/ask, while `render.ts:216` prints `parent-named only` for a child and `doctor-brief-render.vitest.ts:84` pins that form. |

## Traceability Checks

| Protocol | Level | Status | Notes |
|---|---|---|---|
| `spec_code` | core | partial | R4-P2-002 is the one open requirement gap (head command when row 0 fails); R4-P2-003 is the one open doc/code gap. Both are active P2, not blockers. |
| `checklist_evidence` | core | notApplicable | Code pass; the phase 021 task evidence is the change record. |
| `skill_agent` | overlay | notApplicable | No agent definition changed in this area. |
| `agent_cross_runtime` | overlay | pass | The shared renderer, the plugin's request shape and the child rule agree across claude, codex, opencode, pi, devin and dsh; the one reader path finding is R4-P2-001. |
| `feature_catalog_code` | overlay | partial | `advisor-recommend.md`'s top-only sentence is the open phase 025 item; no new mismatch was found. |
| `playbook_capability` | overlay | notApplicable | No playbook surface changed. |

## Integration Evidence

- Dispatcher: `.skilled/commands/deep/review.md`; this lineage writes only under `review/lineages/render-hooks-plugin-4/`.
- Append gateway: iteration-3 receipt `event-6ed6a43c-e40c-4411-9033-5f0db0064af9`; the projection refreshed.
- Reducer: the iteration-3 reduce reported 3 open P2, `corruptionCount: 0`, `strategyWarning: null`, all four dimensions covered.
- Registry agreement: `deep-review-findings-registry.json` lists `R4-P2-001`, `R4-P2-002` and `R4-P2-003` as open P2, matching the three iteration files and their deltas.
- Changed tests: the first-passing case, top-only request case, custom-body/function-argument cases, and the policy/child/repeat renderer cases all still pin the branches their iteration reviewed.

## Edge Cases

- **R4-P2-002 is documented as a known limitation.** Phase 021 implementation-summary Known Limitation 1 and the phase 025 top-only doc task both name the behaviour. The finding records the reachable input; it does not ask for a new design decision.
- **R4-P2-001 is pre-existing but in the changed file.** The Codex reader entered this pass's changed set through the custom-body change; the containment split predates it and is the same class pass two fixed in the other readers. The finding is correctly scoped to the file under review.
- **R4-P2-003 is a documentation gap, not a wrong example.** The README's two examples are parent-session examples and remain correct; only the policy-set clause omits the child form.
- **No holdout or prompt-corpus path was read.** The changed-file search is clean for the fourth pass.

## Confirmed-Clean Surfaces

- The head and companion labels use one policy function (`render.ts:240`, `:264`), and the child matrix is pinned by `doctor-brief-render.vitest.ts:70-85` and `render-child-session.vitest.ts:146-153`.
- The plugin's first-passing-row case and top-only request case still pass their assertions at the current lines (`system-skill-advisor.test.cjs:519-607`).
- The Codex custom-body and function-argument cases still pin both record shapes (`codex.test.mjs:28-76`).
- The ambiguous head still prints both labels through the same `recommendationLabel` path and passes the golden head cap (`command-brief-golden.vitest.ts:246-254`).
- The registry, dashboard, strategy anchors and state projection agree on three open P2 and zero P0/P1.

## Ruled Out

- **A fourth new finding exists in the remaining generated files.** The changed set's remaining files are tests and docs already read; no unread production file carries this area's changes. No new direction.
- **The three P2s should be raised to P1.** None crosses a trust boundary on a default path, none causes data loss or a blocked prompt, and each has a named concrete input; the highest-impact one (R4-P2-002) leaves a passing skill named. P2 stands.
- **R4-P2-001 is only a doc issue.** The read split is a code path; the README line is evidence for the contract it breaks. The code finding stands.
- **The registry disagrees with the narratives.** It does not: three open P2, zero resolved, all four dimensions covered.

## Next Focus

- Dimension: synthesis
- Focus area: compile the lineage report from the registry and the four iterations; no further code review.
- Reason: all four dimensions are covered, the stabilization pass is complete, and the latest new-findings ratio is 0.0.
- Rotation status: all four dimensions complete; stabilization pass 1 of 1.
- Blocked/productive carry-forward: R4-P2-001, R4-P2-002 and R4-P2-003 are active.
- Required evidence: the reducer-owned registry, the four iteration files, and their deltas.

Review verdict: PASS
