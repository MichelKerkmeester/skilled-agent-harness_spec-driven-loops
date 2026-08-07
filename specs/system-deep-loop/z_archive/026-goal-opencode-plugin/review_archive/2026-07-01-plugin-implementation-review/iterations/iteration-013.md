# Deep Review Iteration 013

## Dimension

FINAL CLOSING PASS: phase 006 completion-claim empirical spot-check plus findings-registry consistency check.

Dimensions covered: correctness, traceability, maintainability.

## Files Reviewed

- `.opencode/skills/sk-code-review/references/review_core.md:28` - severity definitions and evidence requirements.
- `.opencode/specs/deep-loops/032-goal-opencode-plugin/review/deep-review-state.jsonl:25` - iteration 12 empirical test execution baseline.
- `.opencode/specs/deep-loops/032-goal-opencode-plugin/review/deep-review-strategy.md:126` - prior ruled-out phase completion overclaim note.
- `.opencode/specs/deep-loops/032-goal-opencode-plugin/review/deep-review-findings-registry.json:9` - active findings registry shape.
- `.opencode/specs/deep-loops/032-goal-opencode-plugin/review/deep-review-findings-registry.json:486` - registry severity totals.
- `.opencode/specs/deep-loops/032-goal-opencode-plugin/006-active-continuation/spec.md:46` - phase status claim.
- `.opencode/specs/deep-loops/032-goal-opencode-plugin/006-active-continuation/spec.md:112` - live recursive idle behavior explicitly out of scope.
- `.opencode/specs/deep-loops/032-goal-opencode-plugin/006-active-continuation/spec.md:165` - live serve smoke recorded as residual validation gap.
- `.opencode/specs/deep-loops/032-goal-opencode-plugin/006-active-continuation/plan.md:63` - definition of done claims implementation/unit/spec gates, not live smoke.
- `.opencode/specs/deep-loops/032-goal-opencode-plugin/006-active-continuation/plan.md:153` - runtime idle observability marked unproven.
- `.opencode/specs/deep-loops/032-goal-opencode-plugin/006-active-continuation/tasks.md:91` - task completion criteria.
- `.opencode/specs/deep-loops/032-goal-opencode-plugin/006-active-continuation/tasks.md:93` - verification explicitly excludes the live serve/TUI idle-smoke gap.
- `.opencode/specs/deep-loops/032-goal-opencode-plugin/006-active-continuation/implementation-summary.md:104` - completed verification table.
- `.opencode/specs/deep-loops/032-goal-opencode-plugin/006-active-continuation/implementation-summary.md:119` - known limitation for live idle smoke.
- `.opencode/plugins/mk-goal.js:1236` - continuation helper entry point.
- `.opencode/plugins/mk-goal.js:1302` - smoke mode returns `would_fire` without prompt dispatch.
- `.opencode/plugins/mk-goal.js:1574` - `session.idle` hook wiring.

## Findings By Severity

### P0

None.

### P1

#### DR-013-P1-001 [P1] Findings registry drops claim-adjudication fields for active findings

- File: `.opencode/specs/deep-loops/032-goal-opencode-plugin/review/deep-review-findings-registry.json:10`
- Claim: The findings registry cannot satisfy the final-pass claim-adjudication contract because `openFindings` entries omit `claim`, `evidenceRefs`, `counterevidenceSought`, `alternativeExplanation`, `finalSeverity`, `confidence`, and `downgradeTrigger` for all 16 active findings.
- Evidence: The registry's first active finding contains `findingId`, severity, title, file, line, status, transitions, dimensions, and `mergedFindingIds`, but no claim-adjudication block at `.opencode/specs/deep-loops/032-goal-opencode-plugin/review/deep-review-findings-registry.json:10` through `.opencode/specs/deep-loops/032-goal-opencode-plugin/review/deep-review-findings-registry.json:37`. A representative active P2 has the same shallow shape at `.opencode/specs/deep-loops/032-goal-opencode-plugin/review/deep-review-findings-registry.json:359` through `.opencode/specs/deep-loops/032-goal-opencode-plugin/review/deep-review-findings-registry.json:385`. The registry totals confirm 16 active findings at `.opencode/specs/deep-loops/032-goal-opencode-plugin/review/deep-review-findings-registry.json:486` through `.opencode/specs/deep-loops/032-goal-opencode-plugin/review/deep-review-findings-registry.json:491`. A JSON parse check found all 16 registry `openFindings` missing the seven required fields; it also found the state log P1 `findingDetails` retain those fields, making this a registry-projection loss rather than absence of original adjudication.
- Counterevidence sought: Searched the registry for the required field names and parsed both `openFindings` and state-log `findingDetails`. `evidenceRefs` appears in `ruledOutCandidates` and `cleanSearchProof`, not in `openFindings`; P1 state-log details are complete, while three P2 state-log details also lack the full adjudication set.
- Alternative explanation: The reducer may intentionally keep the registry shallow and rely on JSONL state records for full adjudication. That does not satisfy this iteration's explicit registry consistency check, and it leaves synthesis/review handoff dependent on a non-registry source for adjudication details.
- Final severity: P1.
- Confidence: 0.91.
- Downgrade trigger: Downgrade to P2 or close if the reducer contract is clarified that `deep-review-findings-registry.json` is intentionally shallow and synthesis always joins against `deep-review-state.jsonl`, or if the registry is enriched before synthesis.
- Finding class: matrix/evidence.
- Scope proof: Parsed 16 active registry entries; all 16 are missing the seven required adjudication fields. Parsed state-log `findingDetails`; active P1 details exist there, so the issue is specifically the registry projection used by the final pass.
- Affected surface hints: `review synthesis`, `findings registry`, `claim adjudication gate`.
- Risk score: 5, advisory only.
- Recommendation: Before synthesis, enrich active registry entries with the seven adjudication fields or make the synthesis contract explicitly join active finding IDs to the source `findingDetails` records and report that registry-only adjudication is intentionally unsupported.

### P2

None.

## Traceability Checks

| Check | Result | Evidence |
|-------|--------|----------|
| Phase 006 completion claim | PASS | `spec.md` says status complete, but also marks live recursive behavior out of scope and records live serve smoke as residual validation gap at `spec.md:112` and `spec.md:165`; `tasks.md:93` says verification passed except the live serve/TUI gap; `implementation-summary.md:119` repeats the same limitation. |
| Continuation code shape | PASS | `maybeContinueGoal` exists at `.opencode/plugins/mk-goal.js:1236`, smoke mode returns `would_fire` at `.opencode/plugins/mk-goal.js:1302`, and `session.idle` invokes verifier then continuation at `.opencode/plugins/mk-goal.js:1574` through `.opencode/plugins/mk-goal.js:1597`. No live idle event was triggered in this read-only pass. |
| Registry claim-adjudication fields | FAIL | Registry `openFindings` entries are shallow; all 16 lack the seven requested fields. See `DR-013-P1-001`. |
| Duplicate/overlap review | PASS with related clusters | Related but non-duplicate clusters were identified: command surface drift (`DR-002`, `DR-007`, `DR-008`, plus `DR-009-P1-003` as coverage), RICCE metadata (`DR-004-P1-001`, `DR-009-P1-002`), graph metadata (`DR-007-P2-001`, `DR-009-P2-001`), and known-finding regression coverage (`DR-009-P1-001` covers DR-001/DR-003/DR-005/DR-006). These should be noted as related in synthesis, not merged as duplicate findings. |
| Phase 009 exclusion | PASS | No file under `032-goal-opencode-plugin/009-speckit-command-goal-prompt-offer/**` was read or modified. |

## SCOPE VIOLATIONS

None.

## Verdict

CONDITIONAL. This iteration found no new phase 006 runtime or completion-claim defect, but it found one new P1 registry consistency defect that should be addressed or explicitly contracted before synthesis.

## Next Dimension

Synthesis should proceed only after deciding how to handle `DR-013-P1-001`: enrich the registry, or make the synthesis join against state-log `findingDetails` an explicit and validated contract. If the loop continues to iteration 14, focus on replaying this registry issue against the reducer/schema path rather than re-reviewing phase 006 behavior.

Review verdict: CONDITIONAL
