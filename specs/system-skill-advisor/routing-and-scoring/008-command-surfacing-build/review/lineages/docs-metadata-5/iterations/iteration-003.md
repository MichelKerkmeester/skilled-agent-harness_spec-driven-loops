# Review Iteration 003

## Dimension

Primary dimension: **correctness**. The pass checked whether the changelog's workflow-measure formulas and path vocabulary describe what `score-command-transcripts.mjs` actually computes, including the Vibe journal path the operator focus names.

Review focus addressed: the operator focus asks whether the transcript scorer counts a load, a followed step or an offer that did not happen, including Vibe journal records. This iteration read the `Workflow Measure` section line by line against the scorer's `workflowPath()` union, its `loadRate` and `followedRate` expressions, and its Vibe journal loader. No prompt corpus was opened; the check is code-and-formula only.

## Dispatcher

- Mode: review, detached fan-out lineage `docs-metadata-5`.
- Session: `fanout-docs-metadata-5-1794760565927-i99t40`, generation 1, new lineage.
- Budget: 60 tool calls, 10 minutes. Consumed: 4 calls, about 2 minutes.
- Prior state: 7 open P2 findings, 0 P0, 0 P1; traceability and maintainability covered.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/changelog/v1.1.0.0.md:172-198`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:883-940` (`askedAndWaited`, `workflowPath`)
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1840-1895` (published `workflow` tally and rates)
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1645-1650` (Vibe journal load)
- `.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs:180-190` (Vibe diagnostic writer)
- `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/command-meaning-matching.md:32-44`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The load-rate sentence and the "six paths" heading do not match the published tally** -- `.skilled/skills/system-skill-advisor/changelog/v1.1.0.0.md:176` -- The note says `loadRate` "counts the runs that loaded a workflow over every owned run" and heads the section "Six Paths and Two Rates". The scorer's `loadRate` numerator is `command + skill` only, so an `otherMode` run — a run that loaded another mode under the same hub, which the same note calls a load — is counted in the denominator but not the numerator. The published `workflow` tally also carries a seventh path, `noOwner`, which the note never mentions.
   - Case: an arm of 10 owned runs scores `command=6`, `skill=2`, `otherMode=2`, with `asked`, `improvised` and `none` at 0. A reader applying the note's "loaded a workflow" definition expects `loadRate=1.0`; the scorer reports `8/10 = 0.8`, because the two `otherMode` runs loaded a different mode.
   - Evidence: `[SOURCE: .skilled/skills/system-skill-advisor/changelog/v1.1.0.0.md:176]`; `[SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1863]` (the `loadRate` numerator is `command + skill`); `[SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1857]` (`noOwner` is published in the same `workflow` object); `[SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:914]` (`workflowPath` returns seven values).
   - User impact: a release reader cannot recompute `loadRate` from the counts the note describes, and a run that opened a workflow under another mode is silently a non-load in the published rate.
   - Finding class: instance-only
   - Scope proof: the formula appears once in the note; the scorer has one `loadRate` construction and one `workflowPath` union, so the mismatch is a single definition gap rather than a second convention.
   - Affected surface hints: ["changelog: workflow measure", "transcript scorer loadRate", "transcript scorer workflow tally"]
   - Recommendation: say "`loadRate` counts the runs that loaded the expected command or skill; an `otherMode` run loaded a different workflow and stays out of the numerator", and list `noOwner` as the seventh path or state that it is excluded from the owned denominator.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | partial | No top-level spec reference; phase child `019-workflow-outcome-measure` and `022-workflow-measure-soundness` own the measure's intent. |
| `checklist_evidence` | core | notApplicable | No top-level `checklist.md`. |
| `skill_agent` | overlay | pass | The note's runtime list matches the handlers that write health records; Vibe passes a no-op diagnostic writer. |
| `agent_cross_runtime` | overlay | pass | The Vibe journal loader and the Vibe diagnostic writer were read at their exact call sites. |
| `feature_catalog_code` | overlay | pass | No catalog claim changed this iteration. |
| `playbook_capability` | overlay | notApplicable | No playbook file changed this iteration. |

## Integration Evidence

- `workflowPath()` returns `command`, `skill`, `otherMode`, `asked`, `improvised`, `none` and `noOwner`; the note documents the first six.
- `loadRate` is `rate(command + skill, command + skill + asked + otherMode + improvised + none)`; `followedRate` is `rate(command + skill + asked, ...same denominator)`.
- The `asked` path requires `policy === ASK_POLICY`, `wrote !== true`, no write position and `askedAndWaited(stream, command)`, so an offer that did not happen is not counted as a followed step.
- Vibe records go through `loadVibeSession()` and `vibeRecords()` before `workflowPath()`, so the Vibe journal is scored by the same path function rather than a parallel one.
- Vibe's `runAdvisor` passes `writeDiagnostic: () => {}`, which is why the changelog's six-runtime list and its OpenCode exclusion are accurate without naming Vibe.

## Edge Cases

- `otherMode` could be read as "not a load" because it is a different workflow. That reading is defensible for `followedRate`, but the note's own definition of the path says it "loaded another mode", and `loadRate` is described as runs that "loaded a workflow", so the sentence is broader than the numerator under either reading.
- The seventh path `noOwner` may be considered internal because it is excluded from every rate denominator. It is still published in the summary object, so a reader reconciling counts will meet a bucket the note does not define.
- The stored per-runtime rates (claude 8 of 16, and so on) were not re-derived; the stored arm data is outside this lineage's scope and was not opened. The finding is about the formula definition, not those numbers.
- No prompt corpus was opened. Holdout hygiene holds.

## Confirmed-Clean Surfaces

- `followedRate` matches the note exactly: `asked` is added to `command` and `skill`, over the six-path owned denominator.
- `asked` is not counted when no offer happened: the branch requires an ask policy, no write and an observed ask-and-wait event.
- A search and a heredoc line are not loads; the normalizer's comment and the note agree.
- The Vibe journal is loaded through `loadVibeSession()` and normalized with `vibeRecords()`; no parallel Vibe-only path classifier exists.
- The health-record runtime list is accurate: Vibe calls the Claude handler with a no-op `writeDiagnostic`, so it writes no record and is correctly absent from the list.
- No scope violation occurred; no file outside the lineage directory was written.

## Ruled Out

- An offer counted as a followed step without an offer: ruled out; the `asked` branch requires `askedAndWaited`.
- A non-load counted in `loadRate`: ruled out; the numerator is `command + skill`, both witnessed loads.
- A separate Vibe scoring path: ruled out; Vibe records feed the same `workflowPath()`.
- A missing runtime in the health-record list: ruled out; the two runtimes that do not write (Vibe, OpenCode) are either no-op or explicitly excluded.
- A `followedRate` formula mismatch: ruled out; the numerator and denominator match the note.

## Next Focus

- Dimension: security
- Focus area: holdout hygiene and prompt-leak claims across the scoped documents, plus the direct-call kill-switch sentence in `advisor-recommend.md` against the CLI's call order and the launcher's environment handling.
- Reason: the operator focus names holdout hygiene and the direct-call switch, and those are the only security-flavored claims not yet checked.
- Rotation status: traceability, maintainability and correctness completed; security remains.
- Blocked/productive carry-forward: productive — formula-to-code comparison found a real definition gap.
- Required evidence: the scoped documents' holdout references, the CLI's `advisorDisabledBy` call order, and the launcher's environment allowlist.
- Recovery note: none; no failed iteration.

Review verdict: PASS
