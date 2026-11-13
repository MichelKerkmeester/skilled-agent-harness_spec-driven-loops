# Iteration 5: What is ruled out, why, and the corrected cheapest change

## Focus
Question 5 of section 7: what is ruled out, and why. This iteration consolidates the rule-outs from iterations 1-4 and, before doing so, checks iteration 4's recommendation against a consumer it had not traced: who actually renders the resume brief the operator reads. That check changed the recommendation's cost model, so the correction is recorded here rather than smoothed over.

No `steer.md` exists in the lineage directory.

## Actions Taken
1. Grepped every non-test consumer of `buildResumeLadder` across `.skilled`.
2. Read the resume command's own continuity ladder and reply format in `speckit-resume-auto.yaml` (and the parallel confirm asset), to see whether the interactive brief is produced by the programmatic ladder or by the command workflow's instructions.
3. Read the one consumer found, `authored-continuity-snapshot.ts`, around its ladder call.
4. Re-ranked the five candidates against that consumer evidence and wrote the corrected recommendation with residual risks.

## Findings
1. The interactive `/speckit:resume` brief is not produced by the programmatic ladder. The command workflow carries its own continuity ladder — read `handover.md`, then `_memory.continuity`, then the canonical spec docs, then a ripgrep recipe only for a named gap [SOURCE: .skilled/commands/speckit/assets/speckit-resume-auto.yaml:105-112] — and its reply format fixes the visible fields at `Confidence`, `Context source`, `Now`, `Last confirmed`, `Next safe action` [SOURCE: .skilled/commands/speckit/assets/speckit-resume-auto.yaml:138]. `Purpose` is not among them.
2. The programmatic ladder has exactly one non-test consumer: `refreshAuthoredContinuitySnapshot` in `authored-continuity-snapshot.ts`, which calls `buildResumeLadder({ specFolder, workspacePath })` [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/authored-continuity-snapshot.ts:201], and that module is imported only by Claude's opt-in compaction path [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts:40]. A `ResumeSignal` change alone would therefore improve only the opt-in snapshot, not the brief every operator sees.
3. Correction to iteration 4's candidate (f): the cheapest closing change is not a code change in the ladder but one row in the resume workflow's reply format — `Purpose` — plus the matching instruction in the ladder step, in both the auto and confirm assets and the presentation template. That is three text assets, no schema, no migration, and the workflow already reads `spec.md` (the third rung of its ladder), so the value is on hand [SOURCE: .skilled/commands/speckit/assets/speckit-resume-auto.yaml:105-112,138]. This supersedes iteration 4 finding 8's file list while keeping its read-side reasoning.
4. Ruled out — parent-level acceptance criteria: no purpose column in the AC schema, only 10 of 319 phase parents carry the file, and enabling it at parent level touches the manifest, the `AC_CLOSURE` rule scope, `create.sh` seeding and the template [SOURCE: .skilled/skills/system-spec-kit/templates/addons/acceptance-criteria.md.tmpl:57-66; .skilled/skills/system-spec-kit/templates/spec-kit-docs.json:1848].
5. Ruled out — a parent-level user story or purpose/problem section as a standalone change: the phase-parent template already carries Problem & Purpose [SOURCE: .skilled/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl:63-72] and the phase validator exempts parents [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:963-970], so the candidate adds an artifact no hop reads.
6. Ruled out — an improved parent-specific template as the closing change: the parent template already carries the purpose; the defect is the absence of a reader, which a template cannot supply.
7. Ruled out — a purpose field in the continuity block as the *cheapest* option: it is the most expensive (thin record + `MEMORY_0NN` validation + save payload + template + parser), needs a fallback for the 4,657 existing summaries, and leaves the 29 handover-only packets uncovered [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts:60-78].
8. Ruled out — the compaction brief as the primary carrier: it is feasible on Claude because `lastSpecFolder` is persisted in hook state [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts:345], but it covers one hop and needs per-runtime wiring, and Claude's own compaction path is opt-in for continuity [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts:348-355].
9. Ruled out — relying on authors to restate the purpose in handovers: 0 of 97 handovers has a Purpose heading and exactly one restates an objective, as a bullet no parser reads [SOURCE: specs/system-deep-loop/z_archive/022-sk-deep-research-evolution/005-sk-deep-research-review-mode/handover.md:33].
10. Ruled out — using validation as the lever: the only executed required-anchor check exempts phase parents, and the phase level's declared `problem` gate is never executed, so a validation change would enforce authoring at the parent while leaving every hop untouched. It is a different change from the one the evidence supports, and it would not close the measured gap.

## Questions Answered
- Q5: What is ruled out, and why? — Answered by findings 4-10, with findings 1-3 recording the one correction that new evidence forced on iteration 4's recommendation.

## Questions Remaining
None. All five section-7 questions have an answer in this lineage (Q1 iteration 1, Q2 iteration 2, Q3 iteration 3, Q4 iteration 4 as corrected here, Q5 this iteration).

## Residual Risks Of The Recommended Change
- The brief is model-rendered from instructions, so a `reply_format` row is a softer guarantee than code; a missing purpose would need the workflow's own sufficiency rule to name it, or the row will be skipped silently.
- A purpose string can be long: the parent measured in iteration 3 has a 481-character purpose, and the brief has no explicit per-field budget (unlike the restore panel's 1,200-character cap), so the change needs a one-sentence rule.
- A resume that follows a failed phase-parent redirect can surface the parent's container purpose, which iteration 3 measured as stale (38 stated, 69 children). Showing it is still better than showing nothing only if the row is labelled as the parent's purpose.
- The change adds a true purpose but leaves the misleading "Goal" facet (populated from `next_safe_action`) in place, so two surfaces would use "goal" for different things until that label is fixed.

## Ruled Out
- All seven candidates and habits listed in findings 4-10.

## Dead Ends
- Treating the programmatic ladder as the brief's renderer. It is consumed only by the opt-in authored snapshot; the operator-facing brief is assembled by the command workflow from its reply format.

## Edge Cases
- Ambiguous input: none new.
- Contradictory evidence: yes — iteration 4's recommendation named the ladder as the edit point, while this iteration's consumer trace shows the brief comes from the command workflow. Both are recorded; finding 3 supersedes the file list and the reasoning (read side) is unchanged. Resolution status: resolved by evidence, with the correction stated rather than back-filled.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted
- `.skilled/commands/speckit/assets/speckit-resume-auto.yaml`
- `.skilled/commands/speckit/assets/speckit-resume-confirm.yaml`
- `.skilled/commands/speckit/assets/speckit-resume-presentation.txt`
- `.skilled/skills/system-spec-kit/runtime/lib/continuity/authored-continuity-snapshot.ts`
- `.skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts`
- `.skilled/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts`
- `.skilled/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts`
- `.skilled/skills/system-spec-kit/templates/addons/acceptance-criteria.md.tmpl`
- `.skilled/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl`
- `.skilled/skills/system-spec-kit/templates/spec-kit-docs.json`
- `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts`
- `specs/system-deep-loop/z_archive/022-sk-deep-research-evolution/005-sk-deep-research-review-mode/handover.md:33`

## Assessment
- New information ratio: 0.70
- Questions addressed: Q4 (correction), Q5
- Questions answered: Q5

## Reflection
- What worked and why: tracing the consumer instead of trusting the module name. `buildResumeLadder` reads like the resume brief's engine, but the brief is produced by the command workflow, and the only code consumer is the opt-in snapshot. One grep moved the recommendation from a two-code-file change with test fixtures to a three-text-file change with no migration.
- What did not work and why: iteration 4 ranked candidates before tracing who renders the output. The cost model was directionally right (read side, not authoring) but named the wrong edit point.
- What I would do differently: for every recommendation, name the consumer that renders the value the user sees before costing the change.

## Recommended Next Focus
Synthesis. All five questions are answered; the synthesis should present the corrected cheapest change (a `Purpose` row in the resume workflow's reply format, sourced from the `spec.md` the ladder already reads), the measured evidence for each answer, and the seven rule-outs with their reasons.

## SCOPE VIOLATIONS
- None. Every write landed inside `research/lineages/deepseek-1/`.
