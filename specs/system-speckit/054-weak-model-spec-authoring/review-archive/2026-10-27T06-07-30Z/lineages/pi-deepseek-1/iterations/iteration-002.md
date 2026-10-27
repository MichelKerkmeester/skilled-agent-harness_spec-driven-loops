# Iteration 2: Security - destructive authority in the packet's own runbooks

## Dimension

Security. The packet ships repeatable procedures that delete branches, remove worktrees, and dispatch writers with the framework gates switched off. The question is whether each procedure executes inside the authority its operator actually granted, and whether its Pass criteria can tell an escaped run from a contained one.

## Files Reviewed

- `specs/system-speckit/054-weak-model-spec-authoring/goal.md:166`
- `specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/tasks.md:825-874`
- `specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/plan.md:394-395`
- `specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/acceptance-criteria.md:62`
- `.skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/level-1-packet-authored-from-card.md:45-135`
- `.skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/example-drift-guard-catches-leak.md:45-84`

## Findings by Severity

### P0 Findings

None.

### P1 Findings

1. **The removal block deletes the branch without the branch-tip condition its operator approved** - `specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/tasks.md:868` - The pre-approval in [SOURCE: specs/system-speckit/054-weak-model-spec-authoring/goal.md:166] lists four conditions, the fourth being "the branch holds no commit beyond BASE_REF". The executed block checks three of them and then runs the destructive pair: `git -C "$RUNROOT" worktree remove --force "$WT"` and `git -C "$RUNROOT" branch -D "$WT_BRANCH"` ([SOURCE: specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/tasks.md:868-869]). No `git rev-list BASE_REF..$WT_BRANCH` or equivalent appears anywhere in the block ([SOURCE: specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/tasks.md:828-874]). The block also chooses `branch -D`, which is precisely the flag that suppresses git's own refusal to delete an unmerged branch, so the omitted condition is not enforced a second time at the tool layer. `plan.md` states the same two commands with no tip check ([SOURCE: specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/plan.md:394-395]). The recorded run was harmless - the phase goal records the deleted tip as `95abd302c8`, equal to `BASE_REF` - but the artifact a weak model re-runs carries the wider authority.
   Finding class: unguarded-destructive-operation
   Scope proof: the four-condition pre-approval and the executed block were both read directly; the absence of a tip comparison was checked over the whole T016 block, not in one line.
   Affected surface hints: phase 008 T016 removal block, phase 008 plan removal procedure, operator pre-approval record
   Case: a re-run on a branch carrying one commit past `BASE_REF` deletes that commit with `-D` and reports `BRANCH_GONE`.

   Claim adjudication:
   ```json
   {"id":"R2-P1-001","claim":"The T016 removal block executes branch -D without checking the branch tip against BASE_REF, though the operator pre-approval requires that check.","evidenceRefs":["goal.md:166","tasks.md:868-869","plan.md:394-395"],"counterevidenceSought":"Searched the whole block for rev-list, merge-base, BASE_REF and any conditional guard around the two destructive commands; found none.","alternativeExplanation":"The tip check may have been performed manually before the block ran. Rejected as a control: a manual check leaves no artifact the script can read, and the block still executes -D unattended.","finalSeverity":"P1","confidence":0.9,"downgradeTrigger":"A tip check found in a sourced file the block runs before the delete, or a recorded refusal path for a moved branch."}
   ```

2. **Scenario 483 runs a gate-disabled writer in dangerous mode and never checks containment** - `.skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/level-1-packet-authored-from-card.md:92` - The dispatch line is `AI_SESSION_CHILD=1 SYSTEM_SPEC_GATE_ENFORCE=0 devin -p --model swe-2-max --permission-mode dangerous`, so the framework's own write gate is off and the CLI's permission prompt is off for the duration of the run ([SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/level-1-packet-authored-from-card.md:92]). The brief carries the only remaining bound, a prose `BANNED OPERATIONS:` list ([SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/level-1-packet-authored-from-card.md:74]). Step 3 then proves the packet exists, validates and holds no tokens, and the Pass list is exactly those three plus "the track is gone" ([SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/level-1-packet-authored-from-card.md:118-124]). No step inspects what else changed, so a worker that edits `.skilled/`, rewrites `recommend-level.sh` or touches any path outside `specs/zz-pb-card/` still produces a PASS. The packet measures this exact quantity elsewhere as `out_of_scope_writes` and scores it in the benchmark, so the scenario is the one place where the measure is dropped.
   Finding class: unverified-containment
   Scope proof: the dispatch line, the brief's ban list, all four steps and the Pass/Fail block were read end to end; no `git status`, `git diff --stat` or path-scoped check appears in the procedure.
   Affected surface hints: playbook scenario 483, cli-devin dangerous-mode dispatch, phase 008 run report
   Case: a worker that also rewrites `specs/zz-pb-card/../other/spec.md` produces a valid packet, `RESULT: PASSED`, token count `0`, `cleanup=ok`, and the scenario records PASS.

   Claim adjudication:
   ```json
   {"id":"R2-P1-002","claim":"Scenario 483's procedure and Pass criteria contain no containment check after a dangerous-mode, gate-disabled writer run.","evidenceRefs":["level-1-packet-authored-from-card.md:92","level-1-packet-authored-from-card.md:74","level-1-packet-authored-from-card.md:118-124"],"counterevidenceSought":"Read all four steps and the Failure Triage paragraph for any status, diff or path check; the triage only re-runs the scenario.","alternativeExplanation":"Containment might be assumed from the CLI's own workspace scoping. Rejected: the same line passes `--permission-mode dangerous`, and the packet's benchmark records out_of_scope_writes precisely because the CLI does not bound the writer.","finalSeverity":"P1","confidence":0.85,"downgradeTrigger":"A containment step found in the scenario file or in the phase 008 wrapper that runs it, graded PASS with the run."}
   ```

### P2 Findings

1. **The acceptance evidence for the removal row was assembled by hand, not produced by the command it cites** - `specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/acceptance-criteria.md:62` - AC-009's observed column states that `SCRATCH_CLEAN`, `PATCH_SAVED` and `STATUS_SAVED` "were prepended from the console output of the same run because the T016 block prints them outside its `tee`" ([SOURCE: specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/acceptance-criteria.md:62]). The cause is visible in the block: `tee` wraps only the final grouped brace, while `SCRATCH_CLEAN` and the `PATCH_SAVED`/`STATUS_SAVED` echoes are printed before it ([SOURCE: specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/tasks.md:834-840] against `[SOURCE: specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/tasks.md:874]`). The row is honest about the edit, but the cited evidence file can no longer distinguish a run that printed those lines from one that did not.
   Finding class: hand-assembled-evidence
   Scope proof: the AC row's observed text and the block's `tee` boundary were both read; the three lines sit outside the redirected group.
   Affected surface hints: phase 008 AC-009, T016 block, removal.txt evidence artifact
   Case: re-run the block without its first three echoes; `removal.txt` still shows them, because they were added by hand.

## Traceability Checks

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| `spec_code` | partial | hard | `goal.md:166`; `tasks.md:828-874` | The removal gate implements three of the four approved conditions. |
| `checklist_evidence` | fail | hard | `008-.../acceptance-criteria.md:62` | The row discloses a manual edit to its own evidence artifact. |
| `skill_agent` | notApplicable | advisory | - | No skill definition reviewed this iteration. |
| `agent_cross_runtime` | notApplicable | advisory | - | No agent definition reviewed this iteration. |
| `feature_catalog_code` | pending | advisory | `feature-catalog/tooling-and-scripts/*` | Catalog claims are audited in a later pass. |
| `playbook_capability` | fail | advisory | `level-1-packet-authored-from-card.md:92,118-124` | A scenario claims containment it never checks. |

## Verdict

Two P1 findings and one P2. The first is an authority gap in a shipped removal procedure; the second is a missing containment check on the packet's only dangerous-mode dispatch.

## Next Dimension

Traceability. The benchmark's five authoring metrics: whether the parent criterion, the phase 009 report and the recorded sets describe the same measurement.

Review verdict: CONDITIONAL
