# Review Iteration 5 — Maintainability: frozen card and playbook alignment

## Dispatcher

- Session: fanout-luna-1792949481267-fym7sk, generation 1, lineage mode new.
- Focus: compare the frozen card copy with the shipped card, then trace the S8 playbook recipe against the current card and its amendment.
- Review target: specs/system-speckit/054-weak-model-spec-authoring.
- Route proof: Resolved route: mode=review target_agent=deep-review.
- The lineage steer.md was absent before this iteration.
- This was a static document and source review. No tests or scaffold commands were run.

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The S8 playbook overrides the card's current scaffold command** — specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/plan.md:559-563

   - Case: the S8 brief tells the worker to run exactly a create.sh command that omits --with-goal. The current authoring card's scaffold command includes --with-goal, and create.sh defaults WITH_GOAL to false. The run therefore checks a Level 1 packet without exercising the card's current goal.md scaffold path.
   - Evidence: plan.md lines 559-563 and tasks.md line 451 supply the command; the captured worker brief repeats it at lines 18-22. The live card includes --with-goal at line 54, while create.sh initializes WITH_GOAL=false at lines 53-55. The implementation summary calls S8 a packet authored from the card and records a strict pass, but this path does not test the card's updated scaffold command.
   - User impact: the S8 pass leaves the amended goal-file path outside the playbook evidence.
   - Recommendation: add --with-goal to the S8 scaffold command, or narrow the S8 claim to the card steps that the scenario actually exercises.
   - Finding class: playbook-card-alignment.
   - Scope proof: the phase 005 card is a named input to phase 008's S8 scenario, which claims a Level 1 packet was authored from that card.
   - Affected surfaces: S8 command brief, goal.md scaffold path, authoring-card conformance evidence.

## Clean Checks

- Frozen plan block versus shipped card: PASS. Both contain 172 lines; after normalizing the documented frontmatter version bump, the comparison produced zero content differences.
- Executor takeover: PASS as a documented deviation. The phase goal records the approved cli-devin fallback and explains that older DeepSeek/Task wording remains as history.
- S8 strict result: PASS for the packet and command that ran. The card-specific goal.md scaffold path remains outside that result's coverage.

## Review Depth and Search Ledger

- Scope class: complex; strict review-depth enforcement.
- Coverage mode: graphless_fallback. Direct reads and an in-memory text comparison supplied the evidence.
- Required and covered bug classes: frozen_card_content_sync; s8_scaffold_command_alignment; executor_override_documentation.
- Deferred or blocked classes: none.
- SL-001: frozen_card_content_sync — ruled out. The plan's frozen card and live card match after the documented version normalization.
- SL-002: s8_scaffold_command_alignment — finding R5-P2-001. The S8 command omits the flag used by the live card, and create.sh defaults the associated goal-file option to false.
- SL-003: executor_override_documentation — ruled out. The phase goal records the approved cli-devin fallback and marks the earlier model wording as history.

## Edge Cases

- The card frontmatter versions differ because the commit hook bumped the live card version; the phase summary records this difference, and the card body matches the frozen block.
- The phase 008 run used cli-devin swe-2-max under a documented D8 fallback. This is not treated as an unexplained execution mismatch.
- The S8 worker task asks for four Level 1 documents and strict validation; its result does not establish that the card's goal-file step is covered.

## Files Reviewed

- specs/system-speckit/054-weak-model-spec-authoring/005-weak-model-authoring-card/plan.md:67-244
- .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:1-172
- specs/system-speckit/054-weak-model-spec-authoring/005-weak-model-authoring-card/goal.md:118
- specs/system-speckit/054-weak-model-spec-authoring/005-weak-model-authoring-card/implementation-summary.md:118
- specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/spec.md:22,52,80-84
- specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/plan.md:65-70,129,149-150,559-566
- specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/tasks.md:431-432,451
- specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/goal.md:51,87,104-105,111-112
- specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/implementation-summary.md:50-65,102-111
- specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/scratch/runs/483.worker-1/brief.txt:18-23
- specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/scratch/runs/483.txt:3-10
- .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:53-55
- specs/system-speckit/054-weak-model-spec-authoring/review/lineages/luna/steer.md: absent before iteration 5

Review verdict: CONDITIONAL
