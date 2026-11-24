# Review Iteration 007

## Dispatcher

- Route: `Resolved route: mode=review target_agent=deep-review`
- Executor: `cli-pi` model `deepseek-v4.1-flash-1017`, run inline by lineage `deepseek-max-2` (generation 1, lineage mode `new`).
- Iteration 7 of 7, the last the run was given (`stopPolicy: max-iterations`).
- Dimension: **traceability**, closing the run. Operator focus applied: every dimension covered before the last iteration, findings only on review-scope files with full repo-relative paths, no `gateClass` on protocol results, no `terminal_gates` row.

## Files Reviewed

- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:711-719,923,1224-1228` (re-read to confirm finding R2-P1-001)
- `.skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts:189-197` (re-read to confirm finding R3-P1-001)
- `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1560-1568` (counterevidence read)
- `.skilled/skills/system-skill-advisor/runtime/tests/brief-command-owner-check.vitest.ts:96-121` (counterevidence read)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:74,76,77,136` (tracked policies)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:66,87,94,99,123` and `.skilled/changelog/skilled/v4.2.0.0.md:759` (the two carried count findings)
- `.skilled/skills/system-skill-advisor/runtime/lib/README.md:146` (the carried doc finding)

## Findings - New

### P0 Findings

None. No finding of this run was ever a P0 candidate, so no Hunter/Skeptic/Referee pass was owed for one.

### P1 Findings

None new. The two active P1 findings are carried with their evidence re-confirmed on a fresh read:

- **R2-P1-001** -- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:713`. Re-read confirms the registry builds `findingClass`, `scopeProof` and `affectedSurfaceHints` from the delta row only; the narrative parser at `:923` still reads title, file, line and description only; the skip at `:1224` still makes the whole narrative yield once a run has delta rows. Counterevidence re-sought: a later merge could restore the fields, and it cannot, because the narrative finding is skipped before any merge. **Referee: keep P1.**
- **R3-P1-001** -- `.skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts:191`. Re-read confirms the brief returns the child's row unchanged when the command is tracked, while the CLI path at `:1566` and `:1567` prints the tracked policy and owner. Counterevidence re-sought in the ownership test: `brief-command-owner-check.vitest.ts:96` asserts a kept row's policy, but its row is `/create:readme` with child policy `start`, which is also the tracked policy (`command-attach.ts:136`), so the assertion passes under either behavior and the test is blind to the difference. **Referee: keep P1.**

### P2 Findings

None new. Three carried and re-confirmed:

- **R1-P2-001** -- `acceptance-criteria.md:66` (AC-009, AC-030, AC-037, AC-042 state `cases=359`; the fixture holds 368).
- **R4-P2-001** -- `lib/README.md:146` (the stuck-run doctor rule is stated without the run-refusing exception).
- **R5-P2-001** -- `.skilled/changelog/skilled/v4.2.0.0.md:759` (the row quotes 3,518 passed and 359 cases; the tree reads 3,557 and 368).

## Traceability Checks

| Protocol | Level | Status | Evidence | Summary |
|---|---|---|---|---|
| `spec_code` | core | pass | `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:202]`, `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:313]`, `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1285]`, `[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:227]` | Finished. Every REQ-001 to REQ-059 row that names a symbol resolves to that symbol at its cited line, every waived or superseded row names an ADR that exists, and the newest nine requirements (REQ-053 to REQ-059) are implemented in both gate copies as their sentences state. |
| `checklist_evidence` | core | partial | `[SOURCE: specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:66]`, `[SOURCE: .skilled/changelog/skilled/v4.2.0.0.md:759]` | Finished as a sweep: 121 of 122 tasks are ticked and every re-checkable tick names an artefact that exists, every evidence tail resolves, the run-record rows reproduce against their artefacts, and the scope is 77 clean paths. It cannot read `pass` while two count classes in the record are stale, and those are R1-P2-001 and R5-P2-001. |

## Integration Evidence

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:136` is the tracked row for `/create:readme` (`policy: 'start'`), which is what makes the brief's ownership test blind to finding R3-P1-001.
- `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1566` and `:1567` are the counterexample path for the same finding: one shared helper, two different consumers.
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1224` is the skip that makes finding R2-P1-001 unrecoverable from the narrative, and `:713` is the only place the three fields survive.

## Edge Cases

- **The run's own coverage story.** `spec_code` is `pass` and `checklist_evidence` is `partial` with two named defects. That is the honest closure state for AC-040: the protocol was run to completion and found something, which is not the same as passing.
- **`gateClass`.** No protocol result written by this lineage carries a `gateClass`, as the focus asks; the reducer assigned the classification, and it reads both core protocols as gating.
- **`terminal_gates`.** None was written by this lineage; the orchestrator computes the row after the run.
- **Findings outside the scope.** The delta-row schema gap that produced finding R2-P1-001 lives partly in `prompt-pack-iteration.md.tmpl`, which is not a review-scope file; it is recorded as an edge case in iteration 2 and not as a finding.

## Confirmed-Clean Surfaces

- Every dimension has at least one full iteration: correctness (2), security (3), maintainability (4), traceability (1, 5, 6, 7).
- Both core traceability protocols have at least one result in the run, and `spec_code` reaches `pass` with evidence rather than assertion.
- No finding of this run rests on inference alone; every one cites a review-scope file and a line read during the iteration that filed it.
- The 77-file scope is intact and no finding lands outside it.

## Ruled Out

- **A P0 behind the two P1s** -- ruled out on re-read: neither defect can produce a wrong command, a lost run or a security breach in one step; both degrade a record or a rendering.
- **A blind test that would catch finding R3-P1-001** -- ruled out: the one ownership test uses a row whose child policy equals the tracked policy.
- **A later merge that restores finding R2-P1-001's fields** -- ruled out: the narrative finding is skipped before any merge runs.

## Next Focus

- None. The run reached its seventh and final iteration. The active set is two P1 and three P2 findings, so the run's verdict is `CONDITIONAL` and the next step is remediation, not another review angle.

## Dimension Expansion Map

- Dimensions covered: correctness, security, traceability, maintainability (4 of 4).
- Saturated directions: the gate's word rules (three passes, no new defect after iteration 4), the drift guard's coverage (read in both directions), the run-record acceptance rows (all reproduce).
- Remaining frontier: none claimed; this run used no expansive frontier.

## Search Ledger

- `requiredBugClasses`: stale_count, dangling_reference, unbacked_waiver, contract_drift, state_transition, boundary, trust_boundary, policy_escalation, injection, guard_gap, duplication, tick_without_evidence.
- `covered`: all of the above across iterations 1 to 7.
- `ruledOut`: state_transition, boundary, injection, guard_gap, duplication, tick_without_evidence, dangling_reference, unbacked_waiver.
- `deferred`: execution-dependent counts (a test-suite rerun and the mirror/reference scripts), which a review does not execute.
- `searchDebt`: empty; no direction was left unread for lack of budget.

Review verdict: CONDITIONAL
