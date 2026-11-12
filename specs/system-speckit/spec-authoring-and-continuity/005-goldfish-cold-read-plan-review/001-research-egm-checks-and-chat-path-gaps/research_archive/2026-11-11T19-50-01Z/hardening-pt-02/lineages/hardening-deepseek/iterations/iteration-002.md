# Iteration 2: Mode-blind checkpoints and self-scored confidence

## Focus

Leads 3 and 4: whether `applies_to: confirm` checkpoints are skipped under auto and leave a review that guards nothing, and whether confidence scores are authored by the same session that wrote the document — plus whether any existing line can make that evaluator independent.

## Actions Taken

1. Re-checked for `steer.md` in the lineage directory (absent, so no lead ruling applies).
2. Read `.skilled/commands/speckit/assets/speckit-plan.yaml:14-40` (execution-mode contract and `mode_overrides`).
3. Read `.skilled/commands/speckit/assets/speckit-plan.yaml:556-600` (step 1 body, confidence checkpoint, checkpoint) and `:580-670` (steps 2-4).
4. Read `.skilled/commands/speckit/assets/speckit-complete.yaml:1040-1062`, `:1163-1185`, `:1264-1285` (the three `HARD_BLOCK` sites).
5. Read `.skilled/commands/speckit/assets/speckit-implement.yaml:690-706` (step 7 `completion_checkpoint`).
6. `rg` for `mode_overrides` keys, `confidence_checkpoint:` and `wait_for:` across the three files.
7. `rg` for `autonomous_execution` blocks across the three files.

## Findings

1. **Lead 3's first half is a rule, not a bug: auto and autopilot skip every `applies_to: confirm` block.** The contract is one line, repeated verbatim in all three files: "Under auto or autopilot, skip every block whose applies_to is confirm and every checkpoint_confirm flag". The marker appears on 32 blocks — 7 in plan, 11 in implement, 14 in complete — so roughly four in five checkpoints are invisible to an auto run. [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:20] [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:8]

2. **The skip costs the *resolution branch*, not the review text — and two steps have no other exit.** Implement step 4 states "Ensure ALL P0 complete (HARD BLOCKER)" as a step-level activity, so the block itself survives the skip; but the only instruction for clearing an open P0 is the skipped checkpoint option "Address Blockers" (`:554`). Step 5 is weaker still: `checks: { prerequisites: verified, blockers: none, environment: ready }` states three conditions with no failure action anywhere, and its only exit from a failed check is the skipped option "Hold" (`:568`). Under auto, a failed environment check has no stated successor at all. [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:536-568]

3. **The inverse defect is larger: eight step-level `confidence_checkpoint` blocks survive into auto, and seven end in a wait-for-user STOP with no auto default.** They are siblings of the `checkpoint:` key, not children, so the skip rule never touches them. The low-confidence branches read `wait_for: "User response"` (plan `:586`, `:635`; complete `:727`, `:804`), `wait_for: "User decision"` (plan `:779`, complete `:980`) and `wait_for: "Resolution"` (complete `:1156`). Implement's block (`:641-653`) is the only one carrying a fallback, and its fallback is keyed to `child_dispatch`, not to auto. No file defines a `mode_overrides.auto` section — every `mode_overrides` in all three files has exactly one key, `confirm:` — so the mode that removes the operator is the mode with no default for a step that stops and waits. [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:574-586] [SOURCE: .skilled/commands/speckit/assets/speckit-complete.yaml:1156]

4. **Lead 4's first half is confirmed: every confidence score is self-assessed, and the blocks do not name an evaluator.** All eight `confidence_checkpoint` blocks list factors as questions to the same run ("Implementation strategy well-defined?", "Risks identified with mitigations?") and none states who answers. The weighted result feeds a threshold whose low band halts and whose high band authorises the next step, so the artifact's author both writes the document and certifies it. [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:765-780] [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:640-653]

5. **Lead 4's second half: an existing line can make the score *checkable*, not *independent*.** Independence needs a reader with no history of the document, and the only dispatched readers in these files are the four `@context` explorers in plan step 5, contractually conclusion-free ("Do NOT draw conclusions - just report findings", `:753`), and implement's user-dispatched `@debug` offer. Changing either contract is the larger decision the prior research already deferred. What an existing line *can* do is force each factor's score to cite the section it was judged against, which converts an unarguable number into a statement the next reader can falsify at zero new artifacts. [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:749-753] [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:623-637]

6. **Complete carries two gates at one location, and only the weaker one is wired.** `quality_gates.planning_gate` is declared at "Between Step 7 and Step 8" with `critical: true` and the only mentions of `plan_has_approach` and `tasks_has_format` in the repository; `step_7_task_breakdown.phase_gate_checkpoint` sits at "After Step 7 completes" with `enforcement: HARD_BLOCK` and checks existence plus `[NEEDS CLARIFICATION]` only. The invoked gate cannot see a plan with no technical approach; the gate that could has no consumer. [SOURCE: .skilled/commands/speckit/assets/speckit-complete.yaml:504-519] [SOURCE: .skilled/commands/speckit/assets/speckit-complete.yaml:1042-1051]

## Questions Answered

- Are checkpoints marked applies_to confirm skipped in auto mode, leaving a review nobody reads guarding nothing? — Skipped yes, 32 times; "guarding nothing" only where the checkpoint holds the sole resolution branch, which is true of implement steps 4 and 5 and false elsewhere; and the skip rule leaves the adjacent confidence STOP unguarded, which is the worse half.
- Are confidence scores given by the session that wrote the document, and can an existing line make the evaluator independent? — Yes to the first (8 blocks, no evaluator named); no to the second (independence needs a fresh reader, which each file's dispatch contract currently forbids or defers), but one existing line can make the score falsifiable by making each factor cite its section.

## Questions Remaining

- Lead 5 (drift between the three files) gains a concrete first instance from Finding 6 but is not yet swept.
- Lead 6 (`[DEVIATION:` and debug-delegation emissions in `specs/`), lead 7 (`recommend-level.sh` paths), lead 8 (`research/research.md`).

## Ruled Out

- **Treating the 32 confirm-only checkpoints as 32 defects.** Most duplicate a step-level activity that still runs; only the two steps whose sole exit is a checkpoint option carry damage. Counting checkpoints would have inflated the finding and hidden the real one.
- **Proposing a fresh-reader dispatch to fix self-scoring.** Rejected on the repo's own reversal-cost ladder: it changes the explorers' conclusion-free contract, which the prior lineage already recorded as a separate decision.

## Dead Ends

- Looking for an `auto` override section that supplies STOP defaults: `rg "^  auto:|^  autopilot:"` returns nothing in any of the three files. Absence is the finding.

## Edge Cases

- Ambiguous input: "a review nobody reads may guard nothing" can mean the checkpoint's review text or the checkpoint's option branch. Selected the option branch as the guard (the review text is display only) and recorded both halves.
- Contradictory evidence: the files declare `approvals: step_by_step` and `validation: checkpoint_based` under confirm, while the mode rule skips those checkpoints under auto — resolved as mode scoping, not contradiction.
- Missing dependencies: none.
- Partial success: complete's 14 checkpoint blocks were enumerated by `rg` but only the three `HARD_BLOCK` sites were read in body; per-block damage for complete is deferred to iteration 3.

## SCOPE VIOLATIONS

None executed. `steer.md` was absent, so no lead ruling applied.

## Sources Consulted

- `.skilled/commands/speckit/assets/speckit-plan.yaml:20`, `:574-586`, `:623-635`, `:749-753`, `:765-780`
- `.skilled/commands/speckit/assets/speckit-implement.yaml:8`, `:536-568`, `:623-653`, `:690-706`
- `.skilled/commands/speckit/assets/speckit-complete.yaml:504-519`, `:727`, `:804`, `:980`, `:1042-1051`, `:1156`, `:1174`, `:1273`
- `rg mode_overrides|confidence_checkpoint:|wait_for:` across the three files
- `rg autonomous_execution` across the three files

## Assessment

- New information ratio: 0.83
- Questions addressed: lead 3, lead 4
- Questions answered: 2 of 8 strategy questions (4 of 8 cumulative)

## Reflection

- What worked and why: asking what the *skip rule does not cover*. The dispatch framed lead 3 as "the review is skipped, so it guards nothing"; the durable defect is the opposite direction — blocks that stop for a user in a mode defined by the absence of one. Reading the mode contract first made the asymmetry visible.
- What did not work and why: an early pass counted `applies_to` hits per file and nearly reported "32 skipped checkpoints" as the finding. That number describes intent, not damage; the damage needed the neighbouring option lists.
- What I would do differently: for every STOP in a workflow file, read the enclosing block's parent key first. Whether a STOP is mode-scoped is decided by its parent, not by its wording.

## Recommended Next Focus

Lead 5's sweep: diff the duplicated config blocks across plan, implement and complete (`confidence_framework`, `circuit_breaker`, `request_analysis_framework`, `workflow_enforcement`, `quality_gates`) and identify which copies disagree in a way that changes behaviour, then finish lead 6's on-disk emission counts.
