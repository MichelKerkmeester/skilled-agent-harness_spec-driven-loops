# Iteration 2: What each hop surface reads and emits, and whether the purpose travels

## Focus
Question 2 of section 7: for each hop surface, what it reads and what it emits, and whether the purpose travels. Surfaces: the Claude compaction hooks (`compact-inject.ts`, `session-prime.ts`) and their counterparts for other runtimes, `/speckit:resume`, `/speckit:handoff` and the session relaunch, `/speckit:save` with `generate-context.js`, and the deep-loop iteration prompts and child-dispatch briefs. The reducer's auto Next Focus pointed at the successor-facing surfaces from iteration 1; this iteration answers that line directly because the successor-facing surfaces *are* the hop surfaces.

No `steer.md` exists in the lineage directory, so no lead ruling constrained this iteration.

## Actions Taken
1. Read the Claude PreCompact hook `runtime/hooks/claude/compact-inject.ts`: the merged-context builder, its four selectors, the spec-folder detector, and the opt-in authored-snapshot path.
2. Read the Claude `session-prime.ts` startup/compact/resume output paths.
3. Read the continuity facet builder `runtime/lib/continuity/thin-continuity-record.ts` and the resume ladder `runtime/lib/resume/resume-ladder.ts` (signal shape, handover/continuity/spec-doc parsers, restore panel, result synthesis).
4. Traced the counterparts: `hooks/codex/compact-inject.ts`, `hooks/dsh/session-compact-context.mjs` + `hooks/dsh/session-start-context.mjs`, `hooks/pi/session-compact-context.ts`, `hooks/devin/post-compaction.cjs`, and grepped every hook for `buildResumeLadder` / authored-snapshot usage.
5. Read the operator-facing resume brief template and the `/speckit:handoff` contract, plus the `generate-context.ts` documented payload fields.
6. Read `fanout-run.cjs` `buildLoopPrompt` and the iteration prompt pack to see what a deep-loop child brief carries.

## Findings
1. Claude's PreCompact hook reads only the live transcript tail. It extracts active file paths, recent topics, working-memory attention signals and the last five meaningful transcript lines, adds a detected `Active spec folder: <path>` line, and merges those into a token-budgeted brief [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts:443-492]. It opens no packet document: spec.md, handover.md and the continuity block are never read on this path, so the packet arrives as a path string and nothing else.
2. The hook has a continuity-aware path, but it is opt-in: `authoredSnapshotEnabled(input)` is true only when the hook input sets `authored_continuity_snapshot: true` or `continuity_snapshot: 'authored'` [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts:348-355]. Default compaction does not pass that flag, so the authored snapshot worker is skipped [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts:608-630].
3. Even on the continuity path the injected facets carry no purpose. `buildContinuityFacets` fills the facet labelled "Goal" from `next_safe_action`, "Decision" from answered-question ids, "Progress" from `recent_action` + summary + touched files, and "Gotcha" from blockers + open questions [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts:289-303]. The renderer then prints those four headings with the literal labels `Goal`, `Decision`, `Progress`, `Gotcha` [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts:307-323]. So the one line a compacted session reads under the word "Goal" is the next action, which is the exact substitution the operator reported.
4. `session-prime.ts` emits pointers, not content. At startup its fallback surface is the continuity line `- Continuity: recover on demand from the packet docs` plus `/speckit:resume — recover the active packet from its canonical docs` and the `rg` hint [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts:230-258]; after a compaction it prints `Context was compacted. Run /speckit:resume against the active packet to recover session state.` [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts:135-170]. Recovery is delegated to the packet docs; the hook itself never states what the packet is for.
5. The other runtimes split into two groups, and neither group recovers purpose. Codex's PreCompact adapter hands the event to the Claude implementation (`runClaudeHookAdapter('compact-inject.js', …)`) [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/codex/compact-inject.ts:36-38]. DSH's compaction handler reuses the shared session-prime output as its base context and appends the same `/speckit:resume` recovery pointer [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/dsh/session-compact-context.mjs:7,122,126-142], where that prime output is the spawned Claude session-prime hook's stdout [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/dsh/session-start-context.mjs:44-58]. Pi and Devin compose their own recovery sections: the retained compaction summary, `## Active Spec Folder\n<path>`, and `## Recovery\nRun /speckit:resume …` [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/pi/session-compact-context.ts:141-190; .skilled/skills/system-spec-kit/runtime/hooks/devin/post-compaction.cjs:266-290]. No hook outside Claude imports the authored-snapshot module, and no hook calls the resume ladder at all (grep over `runtime/hooks` found one importer, `claude/compact-inject.ts:40`).
6. `/speckit:resume` parses each tier into a fixed signal shape that has no purpose field: `summary`, `recentAction`, `nextSafeAction`, `blockers`, `keyFiles`, `documents`, plus an optional `packetPointer` [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/resume/resume-ladder.ts:56-72]. The handover tier reads only the labelled values `Recent action`, `Next safe action`, `Blockers`, `Key files` [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/resume/resume-ladder.ts:632-673]; the continuity tier maps the thin record's six fields into the same shape [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/resume/resume-ladder.ts:677-712].
7. The spec-docs fallback tier cannot recover purpose either. It takes the title plus the first three non-heading, non-table lines as the summary, and *synthesizes* the next action as `Review tasks.md and continue the packet.` or `Review <primary>.md and continue the packet.` [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/resume/resume-ladder.ts:758-790; collectSummaryLines at :405-417]. A packet's Problem & Purpose paragraph can reach the brief only by happening to sit inside those first three plain body lines — `## 2. PROBLEM & PURPOSE` is a heading and is filtered out.
8. The operator-facing brief has no purpose row: `RESUME BRIEF` renders Spec, Confidence, Source, Now, Last confirmed, Next safe action, Blockers, Progress and "Why this is next" [SOURCE: .skilled/commands/speckit/assets/speckit-resume-presentation.txt:116-129]. The restore panel that feeds it is capped at 8 items and 1,200 characters and is built from the same four facets, so a purpose string would compete with next-action and key-file items for the same budget [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/resume/resume-ladder.ts:507-560].
9. `/speckit:handoff` saves continuity before writing the note and hands the receiving session to `/speckit:resume` [SOURCE: .skilled/commands/speckit/handoff.md:42,61,78-88], and the handover template has no purpose heading [SOURCE: .skilled/skills/system-spec-kit/templates/addons/handover.md.tmpl:37,50,84,107,121]. Even an author who adds a purpose paragraph has no reader: the handover parser looks only for four labelled fields, so the paragraph can travel only accidentally through `collectSummaryLines` [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/resume/resume-ladder.ts:632-640,405-417].
10. `/speckit:save`'s writer contract is explicitly compact and mechanics-only: the documented payload fields are `recent_action` and `next_safe_action` (≤96 chars / ≤16 words), `blockers` and `key_files` (≤5 short items), plus the stored `completion_pct` and question lists [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts:170-181]. The thin record has no purpose field [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts:60-78], so a purpose survives a save only as a packet document, never as continuity state.
11. The deep-loop hop is the exception: the child-dispatch brief carries purpose-shaped text. `buildLoopPrompt` injects `research_topic: <full topic>` into the child prompt [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1655-1669], and the per-iteration prompt pack renders `Research Topic: {research_topic}` plus focus and remaining questions on every iteration [SOURCE: .skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl:11-16]. A research loop therefore restates its purpose by construction; an ordinary implementation session has no equivalent field at any hop.

## Questions Answered
- Q2: For each hop surface, what does it read and what does it emit, and does the purpose travel? — Answered by findings 1-11: compaction hooks read the transcript (and optionally continuity facets whose "Goal" is the next action); session-prime emits pointers; the resume ladder emits a fixed action-shaped signal; handoff/save write action-shaped state; only the deep-loop brief carries the topic.

## Questions Remaining
3, 4, 5.

## Ruled Out
- The hypothesis that a runtime's compaction hook rehydrates the packet's spec.md. Every hook was grepped for ladder/authored-snapshot usage; the only importer is Claude's opt-in snapshot, and no hook reads spec.md.
- The hypothesis that a purpose paragraph in handover.md reaches the next session through the ladder. The parser extracts four labelled fields only; an unlabelled paragraph is not part of the signal shape.

## Dead Ends
- Looking for a "purpose" field in the continuity schema. `ThinContinuityRecord` has six fields and none is a purpose; a purpose string has no slot to occupy.

## Edge Cases
- Ambiguous input: none. Q2 enumerates the surfaces.
- Contradictory evidence: none new. Iteration 1's declared-vs-executed phase-parent gap stands and is unchanged by this iteration.
- Missing dependencies: none.
- Partial success: none.
- Note on scope: the `cursor` and `opencode` adapters were inspected only for continuity/purpose reads (none found in `cursor/precompact.ts`); they were not traced line by line, so finding 5 is stated for the runtimes that were read and does not claim more.

## Sources Consulted
- `.skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts`
- `.skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts`
- `.skilled/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts`
- `.skilled/skills/system-spec-kit/runtime/lib/resume/resume-ladder.ts`
- `.skilled/skills/system-spec-kit/runtime/hooks/codex/compact-inject.ts`
- `.skilled/skills/system-spec-kit/runtime/hooks/dsh/session-compact-context.mjs`
- `.skilled/skills/system-spec-kit/runtime/hooks/dsh/session-start-context.mjs`
- `.skilled/skills/system-spec-kit/runtime/hooks/pi/session-compact-context.ts`
- `.skilled/skills/system-spec-kit/runtime/hooks/devin/post-compaction.cjs`
- `.skilled/skills/system-spec-kit/runtime/hooks/cursor/precompact.ts`
- `.skilled/commands/speckit/assets/speckit-resume-presentation.txt`
- `.skilled/commands/speckit/handoff.md`
- `.skilled/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts`
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`
- `.skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl`

## Assessment
- New information ratio: 1.0
- Questions addressed: Q2
- Questions answered: Q2

## Reflection
- What worked and why: following the data shape rather than the prose. Reading `ResumeSignal` and `ThinContinuityRecord` first made the absence of purpose a structural fact (no field) instead of an inference from headings, and it explained the operator's compaction observation exactly: the facet labelled "Goal" is populated from `next_safe_action`.
- What did not work and why: starting from the hook names. The interesting behaviour was in the shared continuity module the hooks call, not in the hooks themselves; a hook-only pass would have reported "injects context" without saying what context.
- What I would do differently: go straight from a hop's output template (the resume brief, the facet renderer) back to its producer; the template names the fields and the producer confirms the source.

## Recommended Next Focus
Q3: sample real packets under `specs/` that have a `handover.md` or several continuity saves and measure whether the purpose is restated, shortened or absent, including whether phase children restate the parent's purpose.

## SCOPE VIOLATIONS
- None. Every write landed inside `research/lineages/deepseek-1/`.
