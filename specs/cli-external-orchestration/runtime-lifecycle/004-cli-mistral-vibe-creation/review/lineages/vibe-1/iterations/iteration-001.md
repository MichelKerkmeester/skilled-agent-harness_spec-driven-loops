# Review Iteration 001

## Dispatcher

- Mode: review, target_agent `deep-review`, execution single_review_iteration
- Review target: `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation` (spec-folder)
- Dimension: correctness
- Operator review focus: the VIB-HK-005/006/007 live regression after `e5b8611a4fa`; find the root cause of "three compaction records journaled, no `Context restored` text injected, while `buildCompactionPart` on the same journal with a fresh state dir returns it".
- Iteration: 1 of 5. Session `fanout-vibe-1-1794765851303-zrv85l`, generation 1, lineageMode new.
- Sources read this iteration: `steer.md` (absent), `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs`, `compaction-post-tool.mjs`, `turn-start.mjs`, `turn-end.mjs`, `compaction-context.test.mjs`, `.skilled/hooks/shared/session-readers/vibe.mjs`, `.skilled/hooks/session-handover/vibe/handover-parts.mjs`, `.skilled/hooks/goal/vibe/goal-inject.mjs`, `022-vibe-hook-playbook-and-live-scenarios/scratch/live/VIB-HK-006/diagnosis.md`, `git show e5b8611a4fa`.

## Files Reviewed

- `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs` (full, 324 lines)
- `.skilled/hooks/session-lifecycle/vibe/compaction-post-tool.mjs` (full, 86 lines)
- `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs` (full, 162 lines)
- `.skilled/hooks/session-lifecycle/vibe/compaction-context.test.mjs` (full, 255 lines)
- `.skilled/hooks/shared/session-readers/vibe.mjs` (sections 1-10, lines 1-500)
- `.skilled/hooks/session-handover/vibe/handover-parts.mjs` (full, 375 lines)
- `.skilled/hooks/goal/vibe/goal-inject.mjs` (full, 42 lines)
- `git show e5b8611a4fa` diff for the three changed composers

## Findings - New

### P0 Findings

None. No exploitable security issue, auth bypass or destructive data loss was found in this dimension.

### P1 Findings

1. **The compaction watermark advances before any text exists, so a compaction with no resolvable section is consumed silently and never retried** -- `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs:231` -- `writeWatermark` is called before the sections are built, and `:252` then returns `''` when `sections.length === 0`. The watermark already holds the compaction id, and `:220`/`:223` filter that id out of every later call through `seen`, so the one injection the detector allows is spent on a call that produced nothing. This is the root cause of the operator's lead: with a fresh state dir the same journal returns 1199 characters including `Context restored after a compaction.`; with the state dir the first (empty) call already wrote, the same call returns `''`.
   Finding class: correctness
   Scope proof: `compaction-context.mjs:231` (write) precedes `:241-252` (section build and empty return); `:220` builds `seen` from the watermark and `:223` filters on it; `:225` returns `''` when the filtered list is empty.
   Affected surface hints: `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs:96` (pre_agent caller), `.skilled/hooks/session-lifecycle/vibe/compaction-post-tool.mjs:61` (post_tool caller), `.skilled/hooks/goal/vibe/goal-inject.mjs:34` (the empty-slice path), `.skilled/hooks/session-lifecycle/vibe/compaction-context.test.mjs` (no case covers it)
   Case: a Vibe session compacts while neither `VIBE_SPEC_FOLDER` nor `SESSION_HANDOVER_GOAL_PACKET` is set (or the named packet has no goal document) and no handoff note is open for the session. The first detector call writes the watermark, finds no section, and returns nothing; every later call filters the compaction out, so the goal slice and handoff pointer are never restored for that compaction.
   ```json
   {"type":"correctness","claim":"buildCompactionPart consumes the compaction watermark before it knows it has text, so an empty-section call permanently suppresses the re-injection","evidenceRefs":["compaction-context.mjs:231","compaction-context.mjs:252","compaction-context.mjs:220","compaction-context.mjs:223","goal-inject.mjs:34"],"counterevidenceSought":"Read the module header (lines 5-13) for a documented consume-on-empty contract; read the test file for a case asserting an empty-section call leaves no watermark; checked whether writeWatermark is deferred or rolled back on the empty path.","alternativeExplanation":"The operator's live failure could instead be a reader-scope gap (the pre-fix VIB-HK-006 cause) or a sandbox-denied watermark write. Both are excluded: the reader now seeds from the snapshot generation, and a denied write returns false at :231 so no watermark would exist and the next call would inject.","finalSeverity":"P1","confidence":"high","downgradeTrigger":"Downgrade to P2 only if a caller is shown to always supply a resolvable goal slice or handoff note, which would put the empty-section path out of reach."}
   ```

2. **The post-tool size gate records the journal size even when the detector produced no text, so a mid-turn compaction is consumed before the detector can retry** -- `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs:319` -- `writeSize` runs unconditionally after `detect`, including when `detect` returned `''`. The next `post_tool` call with the same journal size then returns at `:316` without running the detector at all. The binding exists precisely because "a headless turn can compact in the middle of its work, where no next turn start follows" (`:5-7`), so the lost injection has no later turn start to recover it.
   Finding class: correctness
   Scope proof: `compaction-context.mjs:314-320` shows the size read, the equality short-circuit at `:316`, the detector call at `:318`, and the unconditional `writeSize` at `:319`.
   Affected surface hints: `.skilled/hooks/session-lifecycle/vibe/compaction-post-tool.mjs:61`, `.skilled/hooks/session-lifecycle/vibe/compaction-context.test.mjs:210-235` (the two size-gate cases both return text, so neither covers the empty-text path)
   Case: a `post_tool` call whose detector returns nothing because the watermark write was denied (sandboxed session) or because no section resolved. The size is recorded anyway, so every later tool call in that turn short-circuits at the size gate and the mid-turn re-injection is lost for that journal size.
   ```json
   {"type":"correctness","claim":"buildPostToolPart advances the journal-size watermark on an empty detector result, so the size gate suppresses the retry the detector's own fail-open contract implies","evidenceRefs":["compaction-context.mjs:316","compaction-context.mjs:318","compaction-context.mjs:319"],"counterevidenceSought":"Checked whether the size is only written on a non-empty result, whether the detector is re-run on a size match, and whether the module header documents the size as a pure throttle rather than a consume.","alternativeExplanation":"The size gate could be intended as a strict once-per-size throttle, in which case the loss is by design. The header at :7-9 says an unchanged size 'returns nothing' and a grown journal 'gets the one injection the watermark allows', which places the once-only decision on the watermark, not on the size.","finalSeverity":"P1","confidence":"medium","downgradeTrigger":"Downgrade to P2 if the size file is documented as the authoritative once-per-size consume rather than a throttle in front of the watermark."}
   ```

### P2 Findings

3. **The seen list is capped at 64 ids, so a long session can re-inject a compaction a snapshot refolds** -- `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs:115` -- `.slice(-MAX_SEEN_COMPACTIONS)` drops the oldest ids once a session passes 64 compactions. A compaction dropped from `seen` whose sequence a later snapshot generation raises above the watermark floor is then listed again and injected a second time.
   Finding class: correctness
   Scope proof: `compaction-context.mjs:87` sets `MAX_SEEN_COMPACTIONS = 64`; `:111-115` builds and truncates the list; `:220-223` filters on it.
   Affected surface hints: `.skilled/hooks/shared/session-readers/vibe.mjs:455` (`compactionsSince` re-reads a refolded compaction under the snapshot sequence)
   Case: a session that compacts more than 64 times and then commits a snapshot generation that absorbs an early compaction. The id has fallen out of `seen`, its sequence is now above the watermark, and the detector injects the same compaction twice.

## Traceability Checks

| Check | Result | Evidence |
|-------|--------|----------|
| `spec_code` (core) | partial | The 018 packet claims a once-per-compaction re-injection; the code delivers it only when a section resolves. Deferred to iteration 2 for the full spec-to-code pass. |
| `checklist_evidence` (core) | pending | Phase 022 `tasks.md` T042/T043 record PASS rows that predate `e5b8611a4fa`; deferred to iteration 2. |

## Integration Evidence

- `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs:96` -- the `pre_agent` composer calls `buildCompactionPart(payload)` with no options, so `env` is `process.env` and `stateDir` follows `payload.cwd`.
- `.skilled/hooks/session-lifecycle/vibe/compaction-post-tool.mjs:61` -- the `post_tool` binding calls `buildPostToolPart(payload)` with no options, the same defaults.
- `.skilled/hooks/goal/vibe/goal-inject.mjs:33-34` -- the goal slice is empty whenever neither `VIBE_SPEC_FOLDER` nor `SESSION_HANDOVER_GOAL_PACKET` names a packet, which is the documented fail-open path and the trigger for finding 1.
- `git show e5b8611a4fa` -- the commit added only the hand-over part to the three composers; it did not touch `compaction-context.mjs`, so the defect predates it and the new part only changed which call reaches the detector first.

## Edge Cases

- **Ambiguity: which call consumed the watermark in the live run.** The repro proves the mechanism but not which live call hit the empty-section path first. Recorded as unresolved; the fix is the same either way (do not advance the watermark until text exists).
- **VIB-HK-005 is not explained by this root cause.** The save nudge (`turn-start.mjs:98`) runs before the hand-over part and does not touch the compaction state, so its live failure needs its own cause. Carried to iteration 2 as an open lead rather than folded into finding 1.
- **Stale live evidence.** `022/scratch/live/VIB-HK-006/vibe/result.json` is stamped `2026-11-15T06:34:48Z`, before `e5b8611a4fa` at `13:24:52Z`, so its PASS 4/4 row cannot speak for the post-commit behaviour.
- **Partial success.** The reader fix from T072 is verified present (`vibe.mjs:79-124` seeds from the committed snapshot generation), so the pre-fix reader-scope cause is genuinely closed.

## Confirmed-Clean Surfaces

- `compaction-context.mjs:141-150` -- a journal with no compaction writes no watermark; the test at `compaction-context.test.mjs:141-150` asserts the state dir stays empty.
- `compaction-context.mjs:228-230` -- a malformed compaction entry returns nothing before the watermark write.
- `compaction-context.mjs:254-256` and `compaction-post-tool.mjs:82-86` -- both entry points swallow every error and exit 0, so a detector bug cannot blank a tool result or end a turn.
- `turn-start.mjs:130-137` -- each part is awaited inside its own try/catch, so the new hand-over part cannot suppress the parts before it.

## Ruled Out

- **Reader scope (the pre-fix VIB-HK-006 cause).** `vibe.mjs:79-102` now reads `CURRENT`, the generation manifest, the chunks and `projection-state.json`, and `withSnapshot` at `:116-124` merges them. The recorded diagnosis is closed.
- **Watermark directory resolution.** `stateDirFor` at `compaction-context.mjs:67-70` follows `payload.cwd` and falls back to the checkout, and the test at `compaction-context.test.mjs:129-139` pins it. Not the cause.
- **Watermark file size overflow.** `readWatermark` at `:92` rejects a file over 4096 bytes, which would reset the floor to 0 and cause a repeat, not a suppression. 64 ids of 36 characters stay under the cap, so this is not the live cause.
- **The hand-over part suppressing the compaction part.** `turn-start.mjs:92-101` orders the compaction part before the hand-over part, and `composeTurnStart` catches per part. Not the cause.

## Next Focus

- Dimension: traceability
- Focus area: phases 013-022 spec-to-code alignment, with the stale VIB-HK-005/006/007 live evidence and the VIB-HK-005 open lead
- Reason: iteration 1 closed the compaction root cause; the operator focus also names the 2026-11-15 fixes and the hardened VIB-HK checks, which are traceability claims
- Rotation status: correctness reviewed; security, traceability and maintainability remain
- Blocked/productive carry-forward: productive -- the repro-first approach found the root cause in one pass
- Required evidence: `file:line` on each claimed fix plus the packet line that claims it

Review verdict: CONDITIONAL
