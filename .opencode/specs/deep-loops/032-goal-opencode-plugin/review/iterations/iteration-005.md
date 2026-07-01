# Deep Review Iteration 005

## Dimension

Traceability: companion Finding #5 audit for the two goal-plugin manual testing playbooks, focused on whether their pass criteria exercise the newly shipped `store_health=` and `/goal set` `mutation=<created|refreshed|replaced>` status surfaces.

## Files Reviewed

- `.opencode/specs/deep-loops/032-goal-opencode-plugin/review/deep-review-state.jsonl:1-4`
- `.opencode/specs/deep-loops/032-goal-opencode-plugin/review/deep-review-strategy.md:28-34`
- `.opencode/specs/deep-loops/032-goal-opencode-plugin/review/deep-review-findings-registry.json:9-72`
- `.opencode/skills/sk-code-review/references/review_core.md:28-48`
- `.opencode/skills/deep-loop-workflows/deep-review/references/protocol/quick_reference.md:122-129`
- `.opencode/skills/system-spec-kit/manual_testing_playbook/18--ux-hooks/goal-opencode-plugin.md:1-76`
- `.opencode/skills/system-skill-advisor/manual_testing_playbook/02--cli-hooks-and-plugin/goal-opencode-plugin.md:1-145`

## Finding #5 Audit

### System Spec Kit Playbook

Verdict: confirmed as P2.

Evidence: the playbook tells the operator to validate `/goal set`, `/goal show`, `STATUS=OK ACTION=set`, `STATUS=OK ACTION=show`, `goal_prompt=`, prompt metadata, and an injection preview, but its expected signals do not include `store_health=` or `/goal set`'s `mutation=<created|refreshed|replaced>` field [SOURCE: `.opencode/skills/system-spec-kit/manual_testing_playbook/18--ux-hooks/goal-opencode-plugin.md:19-25`]. The live prompt and expected sections repeat the same older output contract: `STATUS=OK`, active status, prompt metadata, and injection preview only [SOURCE: `.opencode/skills/system-spec-kit/manual_testing_playbook/18--ux-hooks/goal-opencode-plugin.md:33-55`].

Counterevidence sought: exact sweep for `store_health`, `mutation=`, and retired `goal.md`; none appeared in either target playbook. Semantic sweep found no step in this playbook requiring a `/goal set` response-field check beyond `STATUS=OK ACTION=set`.

Final severity: P2. This is a validation-coverage gap in manual docs, not a factual claim that would misroute users or break implementation behavior.

### System Skill Advisor Playbook

Verdict: confirmed as P2, with partial counterevidence.

Evidence: this playbook is broader than the System Spec Kit playbook and asks the operator to capture `STATUS=OK` envelopes and verify mutation responses include post-mutation state [SOURCE: `.opencode/skills/system-skill-advisor/manual_testing_playbook/02--cli-hooks-and-plugin/goal-opencode-plugin.md:50-64`]. That is semantically adjacent to `/goal set` response validation, but it still does not require the literal `mutation=<created|refreshed|replaced>` enum or any `store_health=` check. Its expected signals cover routing, state isolation, passive injection, supervisor verdicts, continuation gates, and live invocation limitations, but not the new output fields [SOURCE: `.opencode/skills/system-skill-advisor/manual_testing_playbook/02--cli-hooks-and-plugin/goal-opencode-plugin.md:66-83`].

Counterevidence sought: line 60's generic "post-mutation state" criterion could catch a malformed mutation response if the operator already knew the new field exists, but it does not name the enum and therefore would not force coverage of `created`, `refreshed`, or `replaced`. No line covers `store_health=`.

Final severity: P2. The playbook partially exercises the response class, but its pass criteria can still pass without verifying the newly shipped status surfaces.

## Cross-Playbook Consistency

The two playbooks do not test the plugin the same way.

- The System Spec Kit playbook is narrower and focused on active-goal injection plus prompt metadata. It validates `/goal set`, `/goal show`, `goal_prompt=`, `prompt_framework`, `prompt_max_chars`, and injection preview [SOURCE: `.opencode/skills/system-spec-kit/manual_testing_playbook/18--ux-hooks/goal-opencode-plugin.md:19-25`].
- The System Skill Advisor playbook is broader and covers state/tool-path tests, supervisor, continuation, lifecycle, pause/complete/clear commands, `mk_goal_status`, and default-off autonomy modes [SOURCE: `.opencode/skills/system-skill-advisor/manual_testing_playbook/02--cli-hooks-and-plugin/goal-opencode-plugin.md:35-64`].
- Both omit literal `store_health=` and `mutation=` checks. The asymmetry is that only the System Skill Advisor playbook has a generic mutation-response check; neither has explicit enum coverage, and neither checks store health.

This finding is directly adjacent to P1-002 because both concern missing `store_health` and `mutation=` output coverage, but it is not a duplicate: P1-002 targets the operator hook reference, while this iteration targets manual pass/fail criteria.

## Findings By Severity

### P0

None.

### P1

None.

### P2

#### P2-001: Manual playbooks can pass without checking new goal status surfaces

- Evidence: the System Spec Kit playbook omits `store_health=` and `mutation=` from its expected signals and pass/fail criteria [SOURCE: `.opencode/skills/system-spec-kit/manual_testing_playbook/18--ux-hooks/goal-opencode-plugin.md:19-25`, `.opencode/skills/system-spec-kit/manual_testing_playbook/18--ux-hooks/goal-opencode-plugin.md:44-55`].
- Evidence: the System Skill Advisor playbook includes a generic post-mutation-state check, but not the literal mutation enum or `store_health=` [SOURCE: `.opencode/skills/system-skill-advisor/manual_testing_playbook/02--cli-hooks-and-plugin/goal-opencode-plugin.md:60-64`, `.opencode/skills/system-skill-advisor/manual_testing_playbook/02--cli-hooks-and-plugin/goal-opencode-plugin.md:66-83`].
- Scope proof: exact search for `store_health|mutation=|goal\.md` across `goal-opencode-plugin.md` files under `.opencode/skills` returned no matches; semantic search found only the System Skill Advisor generic post-mutation-state line.
- Recommendation: add explicit pass criteria requiring `/goal show` or status output to include `store_health=` and requiring `/goal set` output to include `mutation=<created|refreshed|replaced>`, including at least one refreshed/replaced scenario if the manual run can safely create it.

## Traceability Checks

- `spec_code`: partial. This iteration relied on prior state that `mk-goal.js` emits `store_health=` and `mutation=`; it did not re-review implementation code because the assigned focus was playbook coverage.
- `checklist_evidence`: not applicable. No checklist item was in scope for this batch iteration.
- `skill_agent`: pass. Deep-review and review-core severity rules were loaded before severity assignment.
- `playbook_capability`: fail-advisory. Both playbooks can pass without explicitly exercising the new output surfaces.
- `agent_cross_runtime`: not run. The focus was the two named OpenCode playbooks.
- Retired filename sanity check: no `goal.md` literal was found in the target `goal-opencode-plugin.md` playbooks during the quick negative sweep.

## Verdict

PASS with one P2 advisory. No P0 or P1 finding was confirmed in this iteration. The companion Finding #5 is confirmed as a manual validation-coverage gap, not a required release blocker by itself.

## Next Dimension

Maintainability: continue with companion Finding #6 or the pending doc-structure/delegation surfaces listed in the strategy without re-emitting P1-001 or P1-002.
Review verdict: PASS
