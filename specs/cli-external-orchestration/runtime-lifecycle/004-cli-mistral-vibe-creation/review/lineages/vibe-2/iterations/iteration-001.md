# Review Iteration 001

## Dispatcher

- Mode: review (fan-out lineage `vibe-2`)
- Session: `fanout-vibe-2-1794765851303-zrv85l`, generation 1, lineageMode `new`
- Executor: `cli-mistral-vibe` model `deepseek-flash`
- Dimension: correctness
- Review target: `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation` (spec-folder)
- Operator review focus: phases 013-022, the 2026-11-15 fixes, and the open lead on VIB-HK-005/006/007 failing live after the automatic handover tier.
- Sources read this iteration: `steer.md` (absent, so no lead ruling applied), `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs`, `.skilled/hooks/session-lifecycle/vibe/compaction-post-tool.mjs`, `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs`, `.skilled/hooks/session-lifecycle/vibe/turn-end.mjs`, `.skilled/hooks/session-lifecycle/vibe/session-start.mjs`, `.skilled/hooks/shared/session-readers/vibe.mjs`, `.skilled/hooks/session-handover/vibe/handover-parts.mjs`, `.skilled/hooks/goal/vibe/goal-inject.mjs`, `.skilled/bin/skilled-loop`, `.vibe/hooks.toml`, `022-vibe-hook-playbook-and-live-scenarios/scratch/live/VIB-HK-006/diagnosis.md`, `022-vibe-hook-playbook-and-live-scenarios/scratch/verdicts.md`, `spec.md`.

## Files Reviewed

- `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs:1-324`
- `.skilled/hooks/session-lifecycle/vibe/compaction-post-tool.mjs:1-86`
- `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs:1-162`
- `.skilled/hooks/session-lifecycle/vibe/turn-end.mjs:1-122`
- `.skilled/hooks/session-lifecycle/vibe/session-start.mjs:1-80`
- `.skilled/hooks/shared/session-readers/vibe.mjs:1-120,250-430,455-477`
- `.skilled/hooks/session-handover/vibe/handover-parts.mjs:1-375`
- `.skilled/hooks/goal/vibe/goal-inject.mjs:1-42`
- `.skilled/bin/skilled-loop:895-935,1175-1215`
- `.vibe/hooks.toml:1-80`
- `.skilled/hooks/session-lifecycle/vibe/compaction-context.test.mjs:92-175`
- `.skilled/hooks/session-lifecycle/vibe/compaction-post-tool.test.mjs:1-150`

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **The compaction watermark is consumed by whichever detector seam runs first, before the text is proven delivered, so a `post_tool` detection during the compact turn suppresses the turn-start re-injection** -- `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs:231` -- `buildCompactionPart` writes the per-session watermark at `:231` and only then builds the sections at `:241-252`, so the compaction is recorded as injected before any text exists. The same detector backs two seams: `compaction-post-tool.mjs:59-64` runs it on every `post_tool` call whose journal grew, and `turn-start.mjs:96` runs it again at the next `pre_agent`. Whichever seam runs first consumes the one injection the watermark allows; the other seam then filters the compaction out at `:220-225` and returns `''`. This is the root cause of the open lead: the three journaled compactions were consumed at a `post_tool` seam inside the compact turn, so the `pre_agent_turn` the scenario checks carried no `Context restored after a compaction.`, while `buildCompactionPart` on the same journal with a fresh state dir returns the text because no watermark exists to filter it.
   Finding class: correctness
   Scope proof: the finding is inside the declared review target's implementation surface (`.skilled/hooks/session-lifecycle/vibe/`), and every claim cites a line in a file the config lists under `reviewScopeFiles`.
   Affected surface hints: `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs`, `.skilled/hooks/session-lifecycle/vibe/compaction-post-tool.mjs`, `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs`, `.skilled/hooks/session-lifecycle/vibe/compaction-context.test.mjs`
   Case: a `/compact` turn ends with a tool call. The `post_tool` binding measures a grown journal, detects the compaction, writes the watermark at `:231`, and emits the text into the tool result. The next turn start reads that watermark, filters the compaction out at `:221-225`, and returns `''`, so the turn-start context the operator and the VIB-HK-006 check read carries no restored context.
   ```json
   {"type":"claim","claim":"The single per-session watermark is written before the text is built, so the first detector seam to run consumes the injection and the other seam can never deliver it.","evidenceRefs":["compaction-context.mjs:231","compaction-context.mjs:241-252","compaction-context.mjs:220-225","compaction-post-tool.mjs:59-64","turn-start.mjs:96"],"counterevidenceSought":"Read the whole detector, both bindings, the reader, and the recorded live evidence; checked whether the watermark is per-seam (it is not), whether the post_tool seam is skipped during a compact turn (it is not), and whether the turn-start seam bypasses the watermark (it does not).","alternativeExplanation":"The live run may simply have had no goal slice to render, which would also return '' after the watermark advanced. That variant is the same defect at a different trigger and does not change the fix.","finalSeverity":"P1","confidence":"medium","downgradeTrigger":"Downgrade to P2 if a live run shows the post_tool seam never fires during a compact turn, which would leave the turn-start seam as the only consumer."}
   ```

2. **The `post_tool` size gate watches only `journal/*.jsonl`, so a compaction that lands in the snapshot store without growing the journal never reaches the detector** -- `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs:271-282` -- `measureJournal` sums the sizes of the numbered journal segments only, and `buildPostToolPart:314-316` returns `''` when that sum equals the recorded size. Since the VIB-HK-006 fix taught the reader to seed from the committed snapshot generation (`session-readers/vibe.mjs:76-107`), the detector can now see a compaction that the size gate never notices: Vibe folds the journal into `chunks/` and `generations/` at a quiet point, and the checkpoint can land there without a new journal segment. The gate then short-circuits before `detect` runs.
   Finding class: correctness
   Scope proof: both files are listed in `reviewScopeFiles`; the claim is a direct read of the gate and the reader's snapshot seeding.
   Affected surface hints: `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs`, `.skilled/hooks/shared/session-readers/vibe.mjs`, `.skilled/hooks/session-lifecycle/vibe/compaction-post-tool.test.mjs`
   Case: a headless turn compacts mid-turn and Vibe commits the checkpoint into a snapshot generation without appending a journal segment. Every later `post_tool` call measures the same journal size, returns `''` at `:316`, and the mid-turn re-injection never happens, while `buildCompactionPart` called directly on the same session root returns the text.
   ```json
   {"type":"claim","claim":"The size gate measures only the journal directory, so a snapshot-only compaction is invisible to the post_tool binding.","evidenceRefs":["compaction-context.mjs:271-282","compaction-context.mjs:314-316","session-readers/vibe.mjs:76-107"],"counterevidenceSought":"Checked whether the snapshot commit always appends a journal segment (the reader's own comment at `vibe.mjs:70-75` says the journal restarts after `snapshot_sequence`, which can leave the directory empty or unchanged), and whether the gate also stats `chunks/` or `generations/` (it does not).","alternativeExplanation":"Vibe may always write a fresh journal segment at the snapshot, which would make the gate fire. No recorded run proves either way, so the finding is stated as a reachable path rather than an observed one.","finalSeverity":"P1","confidence":"medium","downgradeTrigger":"Downgrade to P2 if a recorded session store shows a new journal segment written at every snapshot commit."}
   ```

### P2 Findings

1. **`writeWatermark` records only the latest compaction id in `seen`, so a multi-compaction catch-up followed by a snapshot roll re-injects the older compactions** -- `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs:111-115` -- the `seen` list is built from `previous.seen`, `previous.compactionId` and `compaction.compactionId`, where `compaction` is only `compactions[compactions.length - 1]` (`:227`). The intermediate compactions in the same catch-up are covered only by the `sequence` floor at `:221`, and a later snapshot generation re-reads them under a higher sequence, above that floor and absent from `seen`.
   Finding class: correctness
   Scope proof: direct read of the watermark writer and the filter; both in a `reviewScopeFiles` entry.
   Affected surface hints: `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs`, `.skilled/hooks/session-lifecycle/vibe/compaction-context.test.mjs`
   Case: three compactions are journaled between two hook calls. The detector injects once and records only the third id. A later snapshot generation re-reads the first two under a higher sequence, so the detector injects them a second time.
   ```json
   {"type":"claim","claim":"Only the latest compaction id enters the seen list, so a multi-compaction catch-up is not fully deduplicated across a snapshot roll.","evidenceRefs":["compaction-context.mjs:111-115","compaction-context.mjs:227","compaction-context.mjs:221"],"counterevidenceSought":"Checked whether the sequence floor alone covers the older ids (it does until a snapshot re-reads them under a higher sequence) and whether the test suite covers a multi-compaction catch-up (it covers one compaction re-read, `compaction-context.test.mjs:113-127`).","alternativeExplanation":"The reader may never re-read an older compaction under a higher sequence. The existing test at `:113-127` exists precisely because it does.","finalSeverity":"P2","confidence":"medium","downgradeTrigger":"No downgrade path; raise to P1 if a live run shows a duplicate restored-context block."}
   ```

2. **`measureJournal` returns `null` for an empty journal directory, so the binding silently skips the detector right after a snapshot roll** -- `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs:274-275` -- `if (names.length === 0) return null;` makes an empty journal indistinguishable from an unreadable one, and `buildPostToolPart:315` treats `null` as "do nothing".
   Finding class: correctness
   Scope proof: direct read of the measurement helper and its caller.
   Affected surface hints: `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs`
   Case: Vibe commits a snapshot generation and has not yet written the next journal segment. A `post_tool` call in that window measures `null`, returns `''`, and the compaction the snapshot holds is not re-injected at that seam.
   ```json
   {"type":"claim","claim":"An empty journal directory is reported as unreadable, so the binding skips a window in which the snapshot may hold a new compaction.","evidenceRefs":["compaction-context.mjs:274-275","compaction-context.mjs:314-315"],"counterevidenceSought":"Checked whether the caller distinguishes empty from unreadable (it does not) and whether the window is reachable (the reader's comment at `vibe.mjs:70-75` describes the journal restarting after `snapshot_sequence`).","alternativeExplanation":"Vibe may write the next segment before any tool call can run, closing the window.","finalSeverity":"P2","confidence":"low","downgradeTrigger":"No further downgrade; the tier is already the lowest."}
   ```

## Traceability Checks

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | partial | Phase 018's claim ("Goal slice and history locator re-injected after a compaction, detected from the journal", `spec.md:136`) is implemented in `compaction-context.mjs`, but the delivery is single-consumer, so the claim holds only for the seam that runs first. |
| `checklist_evidence` | core | pending | Deferred to the traceability iteration. |
| `skill_agent` | overlay | notApplicable | No skill or agent definition is in this iteration's scope. |
| `agent_cross_runtime` | overlay | pending | Deferred. |
| `feature_catalog_code` | overlay | pending | Deferred. |
| `playbook_capability` | overlay | partial | `022-vibe-hook-playbook-and-live-scenarios/scratch/verdicts.md:12-13` records VIB-HK-006 and VIB-HK-007 as PASS, and the recorded `checkpoints.tsv` files agree, so the live evidence on disk does not reproduce the lead's failure. The lead's failure is therefore either a later run or a latent path, and this iteration treats it as latent. |

## Integration Evidence

- `.vibe/hooks.toml:19-24` registers `turn-start` as the only `pre_agent` composer, and `:26-31` registers `turn-end` as the only `post_agent` composer. The `post_tool` compaction binding is registered through the rendered home hooks, not the project file, so a scratch-cwd run reaches it only through `render-home-hooks.cjs`.
- `.skilled/bin/skilled-loop:911-912` unsets `SESSION_HANDOVER_GOAL_PACKET` and `SKILLED_LOOP_CLAIM_SEED` before a first launch, and `:1191-1194` re-exports `SESSION_HANDOVER_GOAL_PACKET` from the claim seed's note. `VIBE_SPEC_FOLDER` is neither unset nor re-exported, so a relaunched Vibe session keeps it only when the operator's shell exported it.
- `.skilled/hooks/goal/vibe/goal-inject.mjs:33` prefers `VIBE_SPEC_FOLDER` and falls back to `SESSION_HANDOVER_GOAL_PACKET`, which is the 2026-11-15 goal fallback the review focus names.

## Edge Cases

- **Ambiguity: the lead's live failure is not on disk.** The recorded VIB-HK-005/006/007 runs under `022-vibe-hook-playbook-and-live-scenarios/scratch/live/` all read PASS with matching `checkpoints.tsv` and `result.json`. I chose the safest in-scope interpretation: treat the lead as a latent defect in the delivery path rather than as a contradiction of the recorded evidence, and say so in the traceability row.
- **Contradiction: the diagnosis file says the reader fix closed VIB-HK-006.** `VIB-HK-006/diagnosis.md:1-8` records PASS 4/4 after the reader and watermark fixes. Both sides are cited; the adjudication is that the reader fix made the compaction visible and the watermark fix made the write land, and neither addressed which seam consumes the injection.
- **Missing dependency: no keyed Vibe session in this environment.** The live scenarios cannot be re-run here, so every finding is a code-path reading with recorded evidence as corroboration, never a live observation.
- **Partial success:** the detector's own unit suite passes 29/29 per the diagnosis note, and the tests cover the single-compaction path only, so a green suite does not contradict these findings.

## Confirmed-Clean Surfaces

- `turn-start.mjs:125-139` composes each part inside its own `try/catch` and returns `''` for a non-`pre_agent` payload, so a failing part cannot blank the others.
- `turn-end.mjs:86-99` stops at the first `deny` and never denies itself, and the hand-over part is last, so a turn another part sends back is never armed.
- `compaction-post-tool.mjs:76-84` joins the parts and prints nothing when both are empty, and `:80-82` keeps the exit code at 0 on a failure.
- `session-readers/vibe.mjs:455-477` deduplicates compactions by id and prefers the last write, so a completed entry replaces the running one.
- `goal-inject.mjs:30-41` fails open on every path and never throws.

## Ruled Out

- **The reader cannot see the compaction.** Ruled out: `session-readers/vibe.mjs:76-107` seeds from the committed snapshot generation plus the journal tail, and `VIB-HK-006/diagnosis.md:1-8` records the fix and a 4/4 rerun.
- **The watermark write is denied by the sandbox.** Ruled out for the current code: `compaction-context.mjs:67-70` puts the state dir under `payload.cwd`, and the captured `pre_tool` payload carries `cwd` (`guards-and-hooks.md:180-195`), so the write lands in the session's own folder.
- **The goal slice renderer is broken.** Ruled out: `goal-inject.mjs:30-41` returns the packet's `chatSlice`, and the diagnosis' positive control produced a 2503-character block with the goal slice and the history offer.
- **The hook is not registered.** Ruled out: `.vibe/hooks.toml:19-24` registers `turn-start`, and the recorded runs show the advisor part landing in the same `pre_agent_turn` record.

## Next Focus

- Dimension: traceability
- Focus area: phases 013-022 spec-to-code alignment, starting with the phase 018 and phase 022 claims that this iteration found only partially supported, then the 2026-11-15 fix claims named in the review focus.
- Reason: correctness produced two P1 findings on one surface; the packet's own claims about that surface are now the highest-value next check.
- Rotation status: correctness complete, traceability next.
- Blocked/productive carry-forward: productive — direct reads of the detector and its bindings produced the root cause.
- Required evidence: `spec.md` phase rows, each phase's `implementation-summary.md` and `tasks.md`, and the playbook scenario rows that claim the live verdicts.
- Recovery note: not applicable.

Review verdict: CONDITIONAL
