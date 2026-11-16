# Review Iteration 005

## Dispatcher

- Mode: review, target_agent `deep-review`, execution single_review_iteration
- Review target: `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation` (spec-folder)
- Dimension: cross-reference (all four dimensions revisited)
- Operator review focus: the `feature_catalog_code` overlay left pending since iteration 2, plus the VIB-HK-005 half of the open lead.
- Iteration: 5 of 5. Session `fanout-vibe-1-1794765851303-zrv85l`, generation 1, lineageMode new.
- Sources read this iteration: `steer.md` (absent), `.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md` (1086-1132, plus a full-file grep for `compaction|handover|vibe|goal|re-inject|watermark`), `.skilled/hooks/session-handover/lib/relaunch-core.cjs:35,54,57`, `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs` (60-101, 102-175), `.skilled/hooks/decision-capture/lib/capture-core.mjs` (395-455), `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/hook-scenarios/turn-start-save-nudge.md` (1-80), and `git show e5b8611a4fa -- .skilled/hooks/session-lifecycle/vibe/turn-start.mjs`.

## Files Reviewed

- `.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md` (the `## 9. CONTEXT PRESERVATION` section)
- `.skilled/hooks/session-handover/lib/relaunch-core.cjs` (`RUNTIMES`, `GOAL_RECORD_RUNTIMES`, `HANDOVER_GOAL_RUNTIMES`)
- `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs` (`buildSaveNudgePart`, `composeTurnStart`, `PARTS`)
- `.skilled/hooks/decision-capture/lib/capture-core.mjs` (`pendingRecords`, `takeNudge`)
- `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/hook-scenarios/turn-start-save-nudge.md` (VIB-HK-005 contract)
- `e5b8611a4fa` diff for `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs`

## Findings - New

### P0 Findings

None. The cross-reference pass found no blocker.

### P1 Findings

None. The two findings below are documentation and framing defects with no runtime effect.

### P2 Findings

1. **The feature catalog omits Vibe from both hand-over runtime enumerations and carries no entry for the Vibe compaction re-injection tier, so the two features this branch ships are absent from the feature index** -- `.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md:1096` -- the section reads "Claude Code, Pi, OpenCode and Codex prepare handoffs through automatic adapters. Cursor and Devin use `/speckit:handoff`" and "an operator prompt does the same on Claude, Codex, Pi and OpenCode", while `relaunch-core.cjs:35` lists `vibe` in `RUNTIMES` and `.skilled/hooks/session-handover/vibe/handover-parts.mjs` is imported by all three Vibe composers (`turn-start.mjs:45`, `turn-end.mjs:39`, `compaction-post-tool.mjs:30`). A full-file grep of the 1232-line catalog returns zero hits for `re-inject`, `Context restored` and `watermark`, so `compaction-context.mjs` has no catalog entry at all.
   Finding class: traceability
   Scope proof: `feature-catalog.md:1096` (both enumerations) against `relaunch-core.cjs:35` (`vibe` in `RUNTIMES`) and the three composer imports; the compaction tier is proven absent by a zero-hit grep over the whole file.
   Affected surface hints: `.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md:1088-1100`, `.skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-handover-loop.md`
   Case: an operator reads the feature index to learn which runtimes hand over automatically, sees Vibe in neither list, and concludes the Vibe tier is manual-only -- the exact opposite of what `e5b8611a4fa` shipped.

2. **The packet's open-lead text attributes the VIB-HK-005 save-nudge failure to `e5b8611a4fa` changing `turn-start.mjs`, but that file's diff is purely additive, so the lead sends the next reader to a file the commit did not change behaviourally** -- `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/spec.md:139` -- `git show e5b8611a4fa -- .skilled/hooks/session-lifecycle/vibe/turn-start.mjs` returns three hunks, all additions: the `HANDOVER_PART_URL` constant at `:41-44`, the `handoverPart` function at `:82-89`, and one `PARTS` entry at `:96-98`. `buildSaveNudgePart` and `composeTurnStart` are byte-identical before and after, so no mechanism in this file can suppress the save nudge.
   Finding class: traceability
   Scope proof: the three-hunk diff above; `turn-start.mjs:74-83` (`buildSaveNudgePart`) and `:124-141` (`composeTurnStart`) fall outside every hunk.
   Affected surface hints: `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/spec.md:139`, `022-vibe-hook-playbook-and-live-scenarios/implementation-summary.md:110`
   Case: the next reviewer takes the lead at face value, re-reads `turn-start.mjs` looking for a save-nudge regression, finds none because there is none, and burns an iteration on a file the commit only appended to.

## Traceability Checks

| Check | Result | Evidence |
|-------|--------|----------|
| `spec_code` (core) | partial | Unchanged from iteration 2; the cross-reference pass adds no new spec claim. |
| `checklist_evidence` (core) | fail | Unchanged from iteration 2. |
| `skill_agent` (overlay) | pass | The session-lifecycle and session-handover READMEs match the code; only the `turn-start.mjs` header is stale (R4-P2-001). |
| `agent_cross_runtime` (overlay) | notApplicable | No agent profile changed in the 2026-11-15 fixes. |
| `feature_catalog_code` (overlay) | fail | `feature-catalog.md:1096` omits Vibe from both hand-over enumerations and the file has no compaction re-injection entry (R5-P2-001). |
| `playbook_capability` (overlay) | partial | Unchanged from iteration 2. |

## Integration Evidence

- `.skilled/hooks/session-handover/lib/relaunch-core.cjs:35` -- `RUNTIMES` is `['claude', 'pi', 'opencode', 'codex', 'cursor', 'devin', 'vibe']`, so Vibe is a first-class loop runtime and the catalog's four-runtime enumeration is stale.
- `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs:45`, `.skilled/hooks/session-lifecycle/vibe/turn-end.mjs:39`, `.skilled/hooks/session-lifecycle/vibe/compaction-post-tool.mjs:30` -- all three composers import `handover-parts.mjs`, which is what makes Vibe an automatic-adapter runtime rather than a `/speckit:handoff` runtime.
- `.skilled/hooks/decision-capture/lib/capture-core.mjs:419-443` -- `takeNudge` is a cursor, not a consume: it returns the pending count only when the count rises above the stored peak, and writes the peak otherwise. The save nudge therefore cannot be consumed without being delivered, which is the opposite of the `compaction-context.mjs:231` defect.
- `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs:124-141` -- `composeTurnStart` awaits each part in `PARTS` order inside its own try/catch, so the async `handoverPart` appended last cannot starve the save nudge at index 3.

## Edge Cases

- **Ambiguity: whether the catalog is in the review target.** The catalog lives outside the spec folder. It is cited as the `feature_catalog_code` overlay surface the strategy names, not as a code finding against the packet, so the finding is scoped to the overlay protocol rather than to the packet's own files.
- **Contradictory evidence on the VIB-HK-005 lead.** The operator reports the failure began after `e5b8611a4fa`; the diff shows the commit cannot cause it through `turn-start.mjs`. Both are recorded: the timing correlation is real, the mechanism is not in that file. The root cause stays open with the search space narrowed to `capture-core.mjs`, the `decision-capture-ask` `post_tool` hook, and the runner's scratch-project `cwd`.
- **Missing dependency: no live re-run.** Confirming the 005 cause needs a live Vibe run, which this lineage cannot perform. Recorded as unverified rather than as a pass.
- **Partial success.** The `feature_catalog_code` overlay is now resolved from `pending` to `fail`; it is the last overlay that was outstanding.
- **Carried forward.** R1-P1-001, R1-P1-002 and R2-P1-001 remain active and unresolved.

## Confirmed-Clean Surfaces

- `.skilled/hooks/decision-capture/lib/capture-core.mjs:419-443` -- the nudge cursor writes before returning and returns the count it wrote, so delivery and bookkeeping agree.
- `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs:124-141` -- the composer awaits every part in order and isolates each failure.
- `.skilled/hooks/session-handover/lib/relaunch-core.cjs:35,54,57` -- the three runtime lists are distinct and each is used for its own purpose.
- `.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md:1112` -- the history-lookup section does name Vibe, so the omission is confined to the hand-over loop and compaction sections rather than the whole file.

## Ruled Out

- **Part ordering as the VIB-HK-005 cause.** `composeTurnStart` awaits each part sequentially and the save nudge sits at index 3, before the appended `handoverPart`; the diff adds no reordering.
- **A consume-without-inject defect in the save nudge.** `takeNudge` returns the count it stores, so the reminder and the cursor advance together.
- **The catalog being uniformly Vibe-blind.** `feature-catalog.md:1112` names Vibe as a history-lookup sender, so the gap is two specific sections.
- **A duplicate between R2-P2-001 and R5-P2-001.** R2-P2-001 is `.skilled/hooks/goal/README.md:80`; R5-P2-001 is the feature catalog. Different files, different claims.
- **A contradiction among the ten active findings.** Each names a distinct file and line; no two assert incompatible behaviour for the same surface.

## Next Focus

- Dimension: none remaining
- Focus area: synthesis
- Reason: all four dimensions and every overlay protocol are now covered; the iteration cap is reached
- Rotation status: correctness, traceability, security, maintainability and cross-reference all reviewed
- Blocked/productive carry-forward: productive -- the `git show` diff settled the 005 premise in one call
- Required evidence: none; synthesis reads the registry

## Verdict

CONDITIONAL -- no active P0; three active P1 findings remain (R1-P1-001, R1-P1-002, R2-P1-001). Twelve findings total, of which ten are active.

Review verdict: CONDITIONAL
