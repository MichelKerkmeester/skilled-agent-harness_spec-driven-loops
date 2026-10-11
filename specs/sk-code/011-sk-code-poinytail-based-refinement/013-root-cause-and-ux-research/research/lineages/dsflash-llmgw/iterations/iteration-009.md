# Iteration 9: Known-Limitations sweep, resolved exclusions and current residuals

## Focus

The brief orders the packet mined: "every child implementation-summary.md Known Limitations and Deviations". This iteration completes that sweep across all children 002 to 011, separates limitations that later rounds resolved from those that are still current, re-confirms one earlier claim by a fresh run, and checks that each of the ten brief parts now carries evidence.

## Actions Taken

1. Extracted the Known Limitations section from every child implementation summary (002 to 011) and triaged each against the later rounds' records.
2. Verified two commonly cited exclusions in the current tree: the excluded sixteenth stdin reader and the review skip-status bypass.
3. Counted the live sk-code canary fixture against its archived `route-gold.typed.json` copy.
4. Searched the quality packet's playbook for Obsidian coverage.
5. Re-ran the state-count check on this lineage (fresh confirmation): the gateway-owned state log holds one config row plus eight iteration rows at this point.

## Findings

1. **Two exclusions from earlier rounds are verified resolved in the current tree, and the sweep confirms no child's "pending orchestrator" item is silently open.** The excluded sixteenth reader now carries its own bound — `STDIN_DEADLINE_MS = 500` in `claude/user-prompt-submit.ts:27` with its inlined reader and a comment explaining why it cannot import the shared helper — and the review skip-status bypass is closed: the checker accepts `skipped:` only when it is the whole output ("skip status must be the whole output"). Every `PENDING-ORCHESTRATOR` marker in the children's logs was cleared by the orchestrator's per-round generator runs, which the same logs record. [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:27] [SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/check-review-final-line.js:20] [SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/check-review-final-line.js:65] — **CONFIRMED** (read the current code). **P2**. **Smallest fix**: none — recorded so the synthesis does not re-raise stale limitations.

2. **One current residual from the parser child remains: an `F###` finding restated under a different id still counts twice.** The final yield rule matches a narrative `F###` finding against the structured rows' ids, so a restated finding whose row carries another id (for example `P1-001`) is not recognized as the same finding; the child records one folder keeping three such duplicates. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1003] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/006-deep-loop-findings-parser/implementation-summary.md:1] — **CONFIRMED** (read the rule and the record). **P2**: incorrect open counts survive in at least one folder. **Smallest fix**: none now — matching across id schemes needs a rule the schema does not define; the honest fix is the changelog note the child already wrote, plus a reader-side tolerance when a restatement cites its original id in the bullet text.

3. **The archived sk-code `route-gold.typed.json` holds 9 cases while the live fixture holds 18, so the archive understates the canary set.** The round-four precedence child recorded the stale archive; counting both files confirms it (archived copy 9 cases, live `canary-cases.v1.json` 18 cases after rounds two to four added cases). Router-sync check 3 reads only the archived destinations, so nothing fails, but a reader comparing the two sees a stale artifact. [SOURCE: specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/001-sk-code/compiled/route-gold.typed.json] [SOURCE: .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/003-hub-surface-precedence/implementation-summary.md:1] — **CONFIRMED** (counted both). **P2**. **Smallest fix**: refresh the archive copy with the fixture's own harness once, or mark it as a frozen snapshot in the archive's own README; no new tool.

4. **The quality packet's playbook still carries no Obsidian scenario.** A case-insensitive search over `.skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/` returns no file mentioning Obsidian, matching the round-four child's deliberate exclusion; the review-mode and Obsidian packets gained coverage in later rounds, so this is a remaining gap in one mode's playbook only. [SOURCE: .skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/004-quality-obsidian-coverage/implementation-summary.md:3] — **CONFIRMED** (searched). **P2**: an adopter verifying quality-mode routing has no scenario for a routed surface. **Smallest fix**: one playbook scenario file following the existing quality-gate shape; no code.

5. **The restraint aliases still capture non-code phrases, by explicit decision.** The round-two routing child recorded three out-of-domain phrases routing to `sk-code-quality` (a tax return, a packing list, a grocery budget) and kept the aliases because narrowing them needed an operator yes that was not given. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/008-round-two-recommendations/001-restraint-routing/implementation-summary.md:1] — **CONFIRMED** (read). **P2**: a user asking a non-code simplification question gets a code-quality route. **Smallest fix**: keep as-is unless a user reports it; narrowing aliases without a signal would trade this for missed code prompts — the decision not to act is correct today.

## Ruled Out

- **Re-raising every residual as a phase.** Rejected under `.skilled/repo-rules/prevent-overengineering.md` and the phase budget: five residuals here are P2 with no user-blocking failure, and the synthesis ranks by external-user impact; only items whose failure a user can observe become phases.
- **A residual tracker file.** Rejected: the packet's own implementation summaries and this lineage's synthesis already hold the list; a tracker would be a second copy that drifts.

## Dead Ends

- No remaining child Known Limitation names a P1 that a later round did not resolve; the sweep found no untriaged item.

## Edge Cases

- Ambiguous input: "Known Limitations" could include operator decisions vs defects; each row is classified by whether the current tree would behave differently for a user, and decisions are recorded as decisions.
- Contradictory evidence: none; the two resolved exclusions show the later rounds' records were accurate.
- Missing dependencies: none.
- Partial success: the sweep is complete for children 002 to 011; the r1/r2/r3 research lineages' own limitations were covered in iterations 1 to 6. `Status: complete`.

## Questions Answered

- (No new key question; this iteration closes the brief's mining instruction and supplies the Q10 input.)

## Questions Remaining

- Q10.

## Sources Consulted

- All child implementation summaries under specs/sk-code/011-sk-code-poinytail-based-refinement/002-surface-contract-alignment through 011-round-four-remediation (Known Limitations sections)
- .skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:27
- .skilled/skills/sk-code/sk-code-review/scripts/check-review-final-line.js:20,65
- .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1003
- specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/001-sk-code/compiled/route-gold.typed.json
- .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json
- .skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/ (search)
- specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/006-deep-loop-findings-parser/implementation-summary.md:1
- specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/003-hub-surface-precedence/implementation-summary.md:1
- specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/004-quality-obsidian-coverage/implementation-summary.md:3
- specs/sk-code/011-sk-code-poinytail-based-refinement/008-round-two-recommendations/001-restraint-routing/implementation-summary.md:1
- command: `grep -c '"type":"iteration"' .../deep-research-state.jsonl` -> 8

## Assessment

- New information ratio: 0.7
- Questions addressed: none new; brief-coverage closure
- Questions answered: none

## Reflection

- What worked and why: a mechanical sweep of every Known Limitations section against the current tree separated resolved exclusions from live residuals in one pass, which is exactly what the brief asked for and what later phases would otherwise repeat.
- What did not work and why: two residuals (F### id-scheme matching, archived route-gold) have no consumer-visible failure, so their "fix" is documentation or a one-off refresh; forcing them into phases would violate the restraint rule.
- What I would do differently: run this sweep in iteration 1 to build the residual list up front, then spend later iterations confirming the P1s only.

## Recommended Next Focus

Iteration 10: consolidation — assemble the external-user impact ranking for every confirmed finding, apply the prevent-overengineering check to each proposed fix, name the one file and one proving command per candidate phase, and prepare the synthesis inputs while the loop's last iteration still has budget for gap checks.
