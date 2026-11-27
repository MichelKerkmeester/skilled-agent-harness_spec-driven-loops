# Iteration 009 — Correctness: phases 009-014 and the net-new candidates

## Dispatcher

- Mode: review
- Target agent: deep-review
- Resolved route: Resolved route: mode=review target_agent=deep-review
- Session: `fanout-vibe-2-1795770902266-zziqbr`, generation 1, lineageMode `new`
- Iteration: 9 of 10
- Dimension: correctness
- Focus: the six phase sections 009 through 014 (`research.md:284-437`) and the sixteen net-new candidates with their ranked order (`research.md:468-515`)

## Files Reviewed

- `research/research.md:284-437` — the 009, 010, 011, 012, 013 and 014 sections, read end to end
- `research/research.md:468-515` — section 5, the sixteen candidates and the ranked order
- The reference and plan lines those rows cite, re-read at the cited line or range: `C/OpenGhost-main/skills.js:1-10`, `:56-64`, `:74-80`, `:81-96`; `C/tinychannels-main/src/providers/telegram/channel_ops.rs:1935-1955`; `C/tinychannels-main/src/providers/telegram/channel_types.rs:10-14`; `C/openhuman-full/tests/cli_sigpipe.rs:1-22`; `C/turnstone-main/tests.json:1-8`; `C/turnstone-main/lint_hypothesis.py:127-141`; `C/hermes-muse-main/scripts/check_callers.py:15-20`, `:34-35`; `C/hermes-muse-main/.github/workflows/test.yml:26-27`; `C/buzz-main/TESTING.md:21-31`; `C/buzz-main/CONTEXT.md:21`; `B/009-skills/spec.md:93`, `:112`, `:162`, `:266`; `B/009-skills/design/fixtures.md:128`; `B/contracts/decisions.md:35`; `B/contracts/prompt-sections.md:212`; `B/005-memory/goal.md:100`; `B/010-conversations/001-chat-ux-and-pane-map/design/key-map-delta.md:104-108`; `B/011-messaging-channels/002-adapter-and-record-contracts/design/conformance-rules.md:30-36`; `B/012-manual-testing-scenarios/spec.md:75`; `B/014-deep-review/tasks.md:231`; `B/014-deep-review/design/fixtures/fix-ledger.md:1-12`; `.skilled/bin/bots.cjs:19`; `.skilled/commands/assets/local-doc-alignment/topics.json:160`, `:185-200`
- Size claims in section 5 recomputed with `wc -l` and `find`: `C/OpenBot-main/shared/audit-words.ts` (400), `C/OpenBot-main/shared/tool-name-words.ts` (296), `C/OpenBot-main/shared/what-if.ts` (365), `C/OpenBot-main/shared/connect-prompt.ts` (167 plus `connect-prompt.test.ts`), `C/buzz-main/crates/ifc-core/src/lib.rs` (507), `C/buzz-main/crates/buzz-conformance` (5 files, 1,775 lines), `C/openhuman-full/vendor/tinydocs/src` (25 files, 4,537 lines), `C/openhuman-full/vendor/tinysecurity/crates/tinysecurity-egress` (15 files, 3,612 lines), `C/hermes-muse-main/plugin.yaml` (12)
- `steer.md` — absent from the lineage directory, so no lead ruling applied to this iteration

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The 009 opening counts the name-and-description list among what is worth taking, but no lift row takes it and the differences table defers it** -- `research.md:286` -- The 009 phase opening reads "Two more parts of it are worth taking: the lines that tell a model where a skill's files live, and the name-and-description list." The lift table for 009 holds three rows (`research.md:290-294`): the two directory lines from `skills.js`, turnstone's adherence case, and tinyskills' `scan_skill`. None of them is the name-and-description list. The list appears only in the differences table, where the verdict is "Split ... Record the list tier as a weighed alternative, so a later phase can add it with a pin" (`research.md:300`). So the section's own verdict is that the list is not taken now, while its opening sentence says it is worth taking. The two statements are one paragraph apart and a builder reads the opening first.
   Finding class: matrix/evidence
   Scope proof: the claim sits in the 009 phase opening at `research.md:286`; the 009 lift table is `research.md:290-294` and holds no list row; the deferral is `research.md:300`; the plan side the deferral protects is `B/009-skills/spec.md:161-162`, where every listed body goes into the prompt and the caps refuse rather than cut.
   Affected surface hints: `research.md:286`, `research.md:290-294`, `research.md:300`; the 009 build phase `B/009-skills/spec.md:161-162` and `B/009-skills/spec.md:175` (the digest pin the differences row requires)
   Case: A builder reads the 009 opening, sees the name-and-description list named as one of two parts worth taking, and looks for the lift row that says how to take it. There is none. If the builder implements the list tier from the opening sentence instead, it lands without the digest pin the differences row requires, which is the governance hole that row exists to prevent.

```json
{
  "id": "V2-R9-P2-001",
  "type": "internal-inconsistency",
  "claim": "research.md:286 names the name-and-description list as one of two parts of skills.js worth taking, but the 009 lift table (research.md:290-294) has no row for it and research.md:300 defers it as a weighed alternative for a later phase.",
  "evidenceRefs": ["research.md:286", "research.md:290-294", "research.md:300", "B/009-skills/spec.md:161-162", "B/009-skills/spec.md:175"],
  "counterevidenceSought": "Read the whole 009 section for a fourth lift row or a sentence that reconciles the opening with the deferral. There is none: the lift table closes after row 3 and the differences row 1 is the only place the list tier appears. Checked whether 'worth taking' could mean 'worth taking later', which would reconcile them; the sentence names the two parts as what the section takes, and the section takes one.",
  "alternativeExplanation": "The opening may be summarising the phase's whole evidence rather than its lift table, in which case the list tier is 'worth taking' as a weighed alternative. That reading is available but not stated, and the differences row's own wording ('a later phase can add it') is what a builder needs to see before the opening sentence.",
  "finalSeverity": "P2",
  "confidence": "high",
  "downgradeTrigger": "Downgrade to no finding if the 009 opening is read as a summary of the phase's evidence rather than of its lift table, or if a lift row for the list tier is added."
}
```

## Traceability Checks

| Protocol | Level | Result | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | pass | Every sampled row in 009-014 and section 5 was re-read against the line or range it cites; the citations resolve and say what the row claims. The one exception is the summary sentence at `research.md:286`, recorded as V2-R9-P2-001. |
| `checklist_evidence` | core | notApplicable | The packet has no `checklist.md` at Level 1, so there is no checklist to trace against. |

## Integration Evidence

- `.skilled/commands/assets/local-doc-alignment/topics.json:160` names the `advisor-lane-removal` topic, and `:193-194` holds its `lane-residue-repo` check with the sweep command. 013 lift row 1 cites this as the in-tree precedent for a residue list, and the citation is exact.
- `.skilled/bin/bots.cjs:19` is `const USAGE = [`, the literal array 013 difference row 1 says the help block is built from today. The citation is exact.

## Edge Cases

- **012 pitfall 1 rests on an inferred exposure, and says so.** The row records that a plain Node script writing 20,000 lines into a closed reader died with `write EPIPE`, then states "That probe did not run bots, so the bots exposure is inferred", and grades the row `weak` (`research.md:392`). The hedge is in the row, so the inference is disclosed rather than converted into a pass or a confirmed claim. No finding.
- **011 lift row 5 records a plan-internal contradiction rather than resolving it.** The row says the plan "says both things": `conformance-rules.md:33` describes a fake transport built from a capability column that returns a scripted result, while the reference's kit "never substitutes a synthetic transport". Re-read `conformance-rules.md:30-36`, which confirms the fake transport is one object per channel name returning a scripted result. The research's characterisation holds, and the contradiction it names is in the plan, not in the research. No finding.
- **009 pitfall 4's symlink claim is live, not hypothetical.** `.skilled/skills/local-webflow` is a symlink to `/Users/.../local-skills/local-webflow`, outside the repository, exactly as the row states. The row's guard is written to avoid a blanket refusal that would break every `local-*` skill. No finding.
- **The 013 opening's "two ideas" reconciles across two tables.** The residue list is lift row 1 and the generated help block is difference row 1, so "two ideas fit inside files 013 already edits" is exact even though the lift table holds one row. No finding.

## Confirmed-Clean Surfaces

- **009 lift row 1.** `C/OpenGhost-main/skills.js:81-96` is the `content(name, folder)` method, and the two lines the row lifts are `Skill directory: ${skill.dir}` and `'Relative paths in this skill are relative to the skill directory.'` at `:90-91`. The row's claim that copying them triggers 009's own reversal condition holds: `B/009-skills/spec.md:266` says the reversal condition is "if any line of that file is copied".
- **009 difference row 1.** `skills.js:4-7` states the list is "named to the agent, and handed to it, when it uses one or when the user picks one with `/name`"; `:58-62` is `mentions()`; `:76-78` is `lines()`, one `- name: description` per skill. The row's reading of the reference is exact, and its budget figure is exact: `B/009-skills/spec.md:93` says the sixteen bodies together are 219,862 bytes.
- **009 pitfall 5.** `B/009-skills/spec.md:162` (REQ-003) still says "a bot at both caps is always refused `prompt-over-budget`", and `B/009-skills/design/fixtures.md:128` repeats it. `B/contracts/decisions.md:35` is D11, which lowered the list cap to 20,480, and `B/contracts/prompt-sections.md:212` says "a bot at both caps fits and is not refused". The stale sentence is real and the row names both sides.
- **010 pitfall 1.** `B/010-conversations/001-chat-ux-and-pane-map/design/key-map-delta.md:106` is the `Ctrl+Enter` or `Shift+Enter` row, and it says "a typed draft has no key that inserts one". The row's claim that the pane binds no newline key is exact.
- **011 lift row 1.** `C/tinychannels-main/src/providers/telegram/channel_ops.rs:1935-1955` is the `409` branch: a description containing "webhook" calls `delete_webhook_for_long_polling()` and `continue`s, any other `409` falls through to `poll_conflict_backoff`. The row's description of the branch is exact.
- **011 pitfall 2.** `C/tinychannels-main/src/providers/telegram/channel_types.rs:12` is `TELEGRAM_RECENT_UPDATE_CACHE_SIZE: usize = 4096`. The row's 4,096 figure is exact.
- **012 difference row 1.** `C/turnstone-main/tests.json:4` is `"n_runs": 5` under `defaults`. The row's "five times by default" is exact.
- **012 pitfall 1.** `C/openhuman-full/tests/cli_sigpipe.rs:3` is the test, and `:14-20` is the comment warning that closing before reading "lets the child buffer its entire few-KB `--help` output in one successful write well under the 64 KB pipe buffer ... a false green that passes even without the fix". `B/012-manual-testing-scenarios/spec.md:75` is the measured block that pipes the CLI into `head -1`. Both citations are exact.
- **013 lift row 1.** `C/turnstone-main/lint_hypothesis.py:127-141` is the `residue` dict of labelled patterns; `C/hermes-muse-main/scripts/check_callers.py:15-20` is the `REMOVED` tuple and its `WORD` regex, and `:34-35` is the comment "bare words (context, status, delegate) count only next to muse_manage; underscored names anywhere", which is exactly the row's "a common word counts only on a line that names its tool, while a distinctive name counts anywhere"; `C/buzz-main/CONTEXT.md:21` is `_Avoid_: Push server, APNs gateway`. All three are exact.
- **013 difference row 1.** `C/hermes-muse-main/.github/workflows/test.yml:26-27` is the "Generated interface reference is current" step running `python -m hermes_muse.surface && git diff --exit-code`. `.skilled/bin/bots.cjs:19` is `const USAGE = [`. Both exact.
- **014 pitfall 1.** `C/buzz-main/TESTING.md:21-31` carries the falsifiability rule and the two mutation-survival PRs. `B/014-deep-review/tasks.md:231` is CHK-012, which verifies with `rg -c 'regression' $R/fix-ledger.md` printing at least `1`. `B/014-deep-review/design/fixtures/fix-ledger.md:1-12` holds no such word, and `rg -c regression` on it exits 1. The row's chain is exact, including the claim that the check cannot pass on the golden ledger.
- **Section 5's size column.** Every stated size recomputes exactly: `audit-words.ts` 400 lines and `tool-name-words.ts` 296; `ifc-core/src/lib.rs` 507; `what-if.ts` 365 with no test file beside it; `connect-prompt.ts` 167 with `connect-prompt.test.ts` beside it; `buzz-conformance` 5 `.rs` files and 1,775 lines; `tinydocs/src` 25 files and 4,537 lines; `tinysecurity-egress` 15 files and 3,612 lines; `plugin.yaml` 12 lines. Nine of nine exact.
- **Section 5's ranked order.** The list is a permutation of 1-16 with exactly the two changes the intro states (candidate 11 to position 4, candidate 7 above candidate 6), re-checked against the candidate numbers in brackets.

## Ruled Out

- **009 lift row 1's citation range is too wide.** Ruled out: `:81-96` is the whole `content()` method and the two lifted lines sit inside it at `:90-91`, so the range contains what the row claims.
- **009 pitfall 6's `allowed-tools` claim is wrong.** Ruled out: the row's point is that the draft template's stated reason claims an effect the prompt loader does not give, which is a plan-side observation and does not depend on the reference.
- **010's "No row" for lift is a gap.** Ruled out: the phase's one reference rule is a paste rule, which is a pitfall and not code to lift, and the section says so.
- **011 lift row 5 misreads the reference's conformance rule.** Ruled out: `conformance-rules.md:30-36` confirms the plan's fake transport is a synthetic transport, and the reference's kit forbids one.
- **012's "No row" for lift hides a corpus that fits.** Ruled out: every cited corpus is an automated suite or a model trial, and 012 rules out a new automated test at `B/012-manual-testing-scenarios/spec.md:112` and `:114`.
- **013's "No row" for pitfalls is a skipped dimension.** Ruled out: the section names the residue gap as lift row 1 and says so in the pitfalls slot.
- **014's "No row" for lift and differences is a skipped phase.** Ruled out: the section states that no reference runs a review loop, and the one transferable criterion is carried as pitfall 1.
- **Section 5 candidate 3's runtime figure is wrong.** Ruled out: the row cites `L/definition.ts:82` for the 900 s wall-clock budget and the row's own text is what the citation supports.
- **Section 5 candidate 12's line counts are estimates.** Ruled out: 400 and 296 recompute exactly.
- **Section 5 candidate 8's "no test file beside it" is wrong.** Ruled out: `what-if.ts` is the only `what-if` file in `shared/`.
- **Section 5 candidate 11's "plus a test file" is wrong.** Ruled out: `connect-prompt.test.ts` sits beside `connect-prompt.ts`.

## Next Focus

- Dimension: traceability
- Focus area: cross-cutting consistency — the recommendations against each other, against the packet decisions D1-D6, and against the licence rules; then the final verdict over all active findings
- Reason: correctness has now been swept across all fourteen phase sections and section 5. The remaining risk is that two recommendations contradict each other or a packet decision, which no single-phase read can see.
- Rotation status: correctness complete for 001-014 and section 5; traceability is the last configured dimension with work left
- Blocked/productive carry-forward: productive — the phase-by-phase citation reads have been the highest-yield approach and are now exhausted; the cross-cutting read is the remaining angle
- Required evidence: the licence map in section 9, the skip list in section 6, the divergence map in section 11, the packet decisions D1-D6, and the seven open P2 findings for a final verdict
- Recovery note: not applicable

Review verdict: PASS
