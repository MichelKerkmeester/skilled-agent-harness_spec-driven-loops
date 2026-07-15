# Deep Review Strategy

## Dispatcher

- Command: `/deep:review:auto`
- Target agent: `deep-review`
- Mode: `review`
- Resolved route: `/deep:review:auto -> .opencode/agents/deep-review.md`
- Agent definition loaded: true
- Review target: `.opencode/skills/sk-doc/create-manual-testing-playbook/`
- Review target type: `skill`
- Stop policy: `max-iterations`
- Max iterations: 4
- Convergence threshold: 0.10
- Lineage mode: auto

## Dimensions

- [x] correctness — iteration 003 score 8/10
- [x] security — iteration 004 score 9/10
- [x] traceability — iteration 001 score 7/10
- [x] maintainability — iteration 002 score 8/10

## Running Finding Counts

- P0: 0
- P1: 2
- P2: 4

## Completed Iterations

- Iteration 001 — traceability/template fidelity baseline; status complete; findings P0=0, P1=2, P2=1; newFindingsRatio=1.00.
- Iteration 002 — workflow self-sufficiency and duplication-boundary review; status complete; new findings P0=0, P1=0, P2=2; cumulative P0=0, P1=2, P2=3; newFindingsRatio=0.15.
- Iteration 003 — claim verification and fabricated-tool/flag risk review; status complete; new findings P0=0, P1=0, P2=1; cumulative P0=0, P1=2, P2=4; newFindingsRatio=0.0714.
- Iteration 004 — final security/coverage pass; status complete; new findings P0=0, P1=0, P2=0; cumulative P0=0, P1=2, P2=4; newFindingsRatio=0.0.

## What Worked

- Iteration 001 PRODUCTIVE: Comparing the primary workflow contract against copied scaffold assets exposed concrete status-contract and link-resolution drift.
- Iteration 002 PRODUCTIVE: Reading the route docs as a boundary map confirmed SKILL.md self-sufficiency and isolated two non-blocking duplication/status-drift issues in README/examples.
- Iteration 003 PRODUCTIVE: Script and flag verification ruled out fabricated validator/tool claims while finding one stale prompt-contract line in the root template.
- Iteration 004 PRODUCTIVE: Final coverage found no P0/security blocker and confirmed validation passes, while preserving active P1 link/status blockers for synthesis.

## What Failed

- Iteration 001 PARTIAL LIMIT: LEAF agent initialized first-run state and executed one iteration only; reducer-owned registry refresh, per-iteration deltas, final report, and iterations 2-4 remain orchestrator-owned.
- Iteration 002 LIMIT: No LEAF-owned delta artifact was written because this agent contract only permits iteration artifact, strategy update, and JSONL append under the review packet.
- Iteration 003 LIMIT: `check-markdown-links.cjs` was verified as an existing script, but CI coverage breadth was not dynamically executed in this LEAF pass.
- Iteration 004 LIMIT: LEAF contract still forbids reducer-owned registry refresh, delta JSONL, and final review report synthesis.

## Exhausted Approaches

- Iteration 001 traceability checks for status vocabulary and placeholder markdown links are complete; do not retry them except to verify fixes.
- Iteration 002 workflow self-sufficiency and route-doc duplication boundary checks are complete; do not re-open README/reference duplication unless verifying fixes or checking correctness impacts.
- Iteration 003 fabricated script/flag checks are complete; do not retry validator help and asset existence checks unless target docs change.
- Iteration 004 final P0, validation, and full relative-link coverage checks are complete; next step is orchestrator synthesis/remediation planning, not another LEAF pass.

## Edge Cases and Carry-Forward

- First-run state initialized by the LEAF iteration because dispatch explicitly authorized initialization.
- Six unresolved links are brace-placeholder markdown links in the root template; keep as active P1 unless the repository link guard explicitly ignores them.
- Asset template validator warnings are non-blocking and should be reviewed under maintainability, not promoted without stronger evidence.
- README quick start is a non-blocking duplicate-procedure risk; examples reference status for system-code-graph conflicts with the template's older-package note.
- Root template still has one stale RCAF-only prompt wording line; validator warnings remain non-blocking.
- Final active verdict basis: P0=0, P1=2, P2=4; PASS requires fixing the two P1 issues at minimum.

## Next Focus

- dimension: synthesis
- focus area: orchestrator-owned reducer refresh, final report, and remediation planning packet
- reason: All four LEAF-owned iterations are complete under max-iterations; active P1s keep the review verdict conditional until fixed.
- rotation status: traceability, maintainability, correctness, and security/final coverage complete.
- blocked/productive carry-forward: blocked — reducer/final report synthesis is outside LEAF ownership; productive — final active counts and required fixes are clear.
- required evidence: iteration artifacts 001-004, JSONL state log, strategy, validation/link-check outputs, active P1/P2 finding details
