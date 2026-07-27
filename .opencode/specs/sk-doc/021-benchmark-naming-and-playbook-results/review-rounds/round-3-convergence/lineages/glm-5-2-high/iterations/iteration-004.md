# Iteration 4: Maintainability — regression coverage and operational clarity

## Dispatcher

- Budget profile: verify.
- Resolved route: mode=review target_agent=deep-review.

## Files Reviewed

- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/run-storage-convention.vitest.ts:1-181`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:94-143,388-402,539-578`
- `.opencode/skills/sk-doc/create-benchmark/SKILL.md:455-536`
- `.opencode/skills/sk-doc/create-benchmark/scripts/render-serving-snapshot.cjs:121-170`
- `.opencode/specs/sk-doc/021-benchmark-naming-and-playbook-results/checklist.md:39-46,57-77,109-118`
- `.opencode/specs/sk-doc/021-benchmark-naming-and-playbook-results/tasks.md:35-73`

## Findings - New

### P0 Findings

- None.

### P1 Findings

- None new. The three active P1 findings (P1-001, P1-002, P1-003) remain. This iteration confirms a maintainability consequence: the focused regression suite passes alongside all three drifts.

### P2 Findings

- None.

## Traceability Checks

| Protocol | Status | Gate | Evidence | Notes |
|---|---|---|---|---|
| `spec_code` | fail | hard | `run-storage-convention.vitest.ts:71-105,107-121`; `run-skill-benchmark.cjs:398-402,539-563`; `render-serving-snapshot.cjs:121-134` | The focused test covers companion emitter shape, naming pattern, index behavior, and Python/JS index parity. It does not assert the same-day collision behavior (P1-001), the six-vs-seven file contract (P1-002), or the dated parity-baseline discovery (P1-003). All three drifts pass through the suite untested. |
| `checklist_evidence` | fail | hard | `checklist.md:57-77` (CHK-008 through CHK-017); `tasks.md:51` (T-019) | CHK-008 reports `259 passed, 11 failed, the same 11 as baseline` and CHK-009 reports `Tests 10 passed (10)`. T-019 asserts "A run with no `--outputs-dir` lands in the dated reports path with six files and an index row." The "six files" claim matches the owner's contract but not the writer's seven-file emission, so the completion evidence asserts a contract the runtime does not produce. |
| `playbook_capability` | partial | advisory | `create-manual-testing-playbook/SKILL.md:250-256` | The local playbook contract is readable and self-consistent with the writer; it conflicts with the owner's contract (P1-002) but is internally maintainable. |

## Integration Evidence

- The focused test (`run-storage-convention.vitest.ts`) is well-named and well-scoped for what it covers: companion emitter shape across both row types (lines 71-105), the dated grammar pattern (lines 107-121), index refresh-vs-duplicate behavior (lines 123-167), and Python/JS index parity (lines 169-181). It is a correct test for the contract it asserts; the defect is that the contract it asserts is narrower than the active drifts.
- CHK-008 (`259 passed, 11 failed, the same 11 as baseline`) is a baseline-comparison gate, which is the right pattern. The 11 pre-existing failures are not regressions. The gate gives false confidence only because the active drifts are not in the failure set — they are in the untested set.
- The packet's own `implementation-summary.md:118-135` (Known Limitations) honestly records the two defects the gate caught during the migration (the bare-label rewrite and the base-name mapping) and the concurrent-session edit. It does not record the three drifts this review found, which is consistent — those drifts were not caught by the gate.

## Edge Cases

- A future test that asserts the six-file contract would FAIL against the current writer (which emits seven), and a future test that asserts the seven-file contract would FAIL against the owner's documented contract. Either alignment path requires a test change, not just a code change.

## Confirmed-Clean Surfaces

- The test suite that DOES exist is well-structured and uses real `execFileSync` for the Python/JS parity check rather than a mock, so the parity claim is load-bearing.
- The Lane C baseline-comparison gate (CHK-008) is the right pattern; it correctly distinguishes regressions from pre-existing failures.

## Ruled Out

- No separate maintainability-only issue was found beyond the existing contract and regression-coverage consequences. The maintainability defect is the gap between the test surface and the active drifts, not a new defect in the test surface itself.

## Next Focus

- Dimension: adversarial replay
- Focus area: re-read the cited evidence for all three active P1 findings and attempt to downgrade each; broaden the review angle to look for any P0 the prior passes missed.
- Reason: max-iterations policy retains convergence as telemetry; the final pass should adversarially confirm or refute the active findings rather than synthesize early.
- Rotation status: expansion pass (adversarial replay).
- Required evidence: re-reads of every cited file:line, plus a search for any path-handling, secret, or boundary defect that could elevate P1-001 to P0.

Review verdict: CONDITIONAL
