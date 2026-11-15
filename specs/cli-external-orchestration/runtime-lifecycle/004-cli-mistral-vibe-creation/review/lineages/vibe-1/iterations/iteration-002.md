# Review Iteration 002

## Dispatcher

- Mode: review, target_agent `deep-review`, execution single_review_iteration
- Review target: `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation` (spec-folder)
- Dimension: traceability
- Operator review focus: the 2026-11-15 fixes (skilled-loop manual claim flags, Vibe goal fallback and `vibeGoalPacket`, runner `--remove-home`, overlay and doctor Vibe rows, hardened VIB-HK checks) and the VIB-HK-005/006/007 live regression.
- Iteration: 2 of 5. Session `fanout-vibe-1-1794765851303-zrv85l`, generation 1, lineageMode new.
- Sources read this iteration: `steer.md` (absent), `022-vibe-hook-playbook-and-live-scenarios/implementation-summary.md`, `022/scratch/verdicts.md`, `022/tasks.md` (T013-T102), `022/scratch/live/VIB-HK-00{5,6,7}/vibe/result.json`, `decision-record.md` (Q008), `.skilled/hooks/goal/README.md`, `.skilled/hooks/goal/vibe/goal-inject.mjs`, `.skilled/hooks/session-handover/lib/relaunch-core.cjs` (1186-1250), `.skilled/commands/doctor/scripts/overlay-engine.cjs`, `.skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml`, `.skilled/skills/system-skilled-doctor/references/overlays.md`, `spec.md`.

## Files Reviewed

- `specs/.../022-vibe-hook-playbook-and-live-scenarios/implementation-summary.md` (full)
- `specs/.../022-vibe-hook-playbook-and-live-scenarios/scratch/verdicts.md` (full)
- `specs/.../022-vibe-hook-playbook-and-live-scenarios/tasks.md` (T013-T102)
- `specs/.../022-vibe-hook-playbook-and-live-scenarios/scratch/live/VIB-HK-005|006|007/vibe/result.json`
- `specs/.../decision-record.md` (Q008 and its evidence)
- `specs/.../spec.md` (metadata and `_memory` block)
- `.skilled/hooks/goal/README.md` (lines 76-84, 138-142)
- `.skilled/hooks/goal/vibe/goal-inject.mjs` (full)
- `.skilled/hooks/session-handover/lib/relaunch-core.cjs` (lines 1186-1250)
- `.skilled/commands/doctor/scripts/overlay-engine.cjs` (line 87)
- `.skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml` (lines 5, 47-49, 159-161)
- `.skilled/skills/system-skilled-doctor/references/overlays.md` (lines 182, 193)

## Findings - New

### P0 Findings

None. No exploitable security issue, auth bypass or destructive data loss was found in this dimension.

### P1 Findings

1. **Phase 022's live-verdict claim does not cover the code the branch ships: all three VIB-HK-005/006/007 runs finished before `e5b8611a4fa`** -- `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/022-vibe-hook-playbook-and-live-scenarios/implementation-summary.md:110` -- the summary records "26 PASS, 0 FAIL, 0 OPERATOR-ONLY", and `scratch/verdicts.md:11-13` records PASS for the three scenarios that exercise the composers the commit changed. Their recorded runs finished at `00:47:35Z`, `06:36:40Z` and `12:11:01Z`; the commit is dated `2026-11-15T12:24:52Z`. No post-change run exists for any of them, so the packet's completion claim is unsupported for the shipped tree.
   Finding class: traceability
   Scope proof: `022/scratch/live/VIB-HK-005/vibe/result.json` `finished_at` 2026-11-15T00:47:35.277Z; `VIB-HK-006` 06:36:40.417Z; `VIB-HK-007` 12:11:01.853Z; `git show -s --format=%cI e5b8611a4fa` prints 2026-11-15T13:24:52+01:00. `implementation-summary.md:110` and `scratch/verdicts.md:11-13` are the claims.
   Affected surface hints: `022/scratch/verdicts.md:11-13`, `022/tasks.md:90-92` (T041-T043 evidence lines), `spec.md` `_memory.recent_action` ("all 22 phases Complete"), `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs`, `.skilled/hooks/session-lifecycle/vibe/compaction-post-tool.mjs`
   Case: an operator reads `scratch/verdicts.md` and `implementation-summary.md` to conclude the Vibe hook surface is live-verified on this branch, and pushes the closeout, when the three scenarios that exercise the changed composers have no run against the changed code.
   ```json
   {"type":"traceability","claim":"Phase 022's live PASS rows for VIB-HK-005/006/007 predate the commit that changed the composers they exercise, so the packet's completion claim is unsupported for the shipped tree","evidenceRefs":["022/scratch/live/VIB-HK-005/vibe/result.json","022/scratch/live/VIB-HK-006/vibe/result.json","022/scratch/live/VIB-HK-007/vibe/result.json","022/implementation-summary.md:110","022/scratch/verdicts.md:11-13"],"counterevidenceSought":"Checked whether a later rerun exists under scratch/live/ for any of the three, whether the commit touched only files those scenarios do not exercise, and whether implementation-summary.md:124 scopes the claim to a pre-merge commit.","alternativeExplanation":"The commit could be a no-op for these scenarios if it only added a part that never runs. It does run: turn-start.mjs:100 and compaction-post-tool.mjs:68 both invoke the new hand-over part on the same payloads these scenarios drive.","finalSeverity":"P1","confidence":"high","downgradeTrigger":"Downgrade to P2 once a post-change rerun of the three scenarios is recorded under scratch/live/."}
   ```

### P2 Findings

2. **The goal README still says Vibe has no compaction re-injection and reads only `VIBE_SPEC_FOLDER`, contradicting the code it documents** -- `.skilled/hooks/goal/README.md:80` -- the Vibe row ends "no per-turn refresh, no compaction re-injection", while `compaction-context.mjs:243` renders the goal slice through `renderVibeGoalSlice` and injects it after every compaction. Line 140 separately says the adapter "Reads the packet path from `VIBE_SPEC_FOLDER`", omitting the `SESSION_HANDOVER_GOAL_PACKET` fallback that `goal-inject.mjs:33` implements and that the 2026-11-15 F5 fix added.
   Finding class: traceability
   Scope proof: `goal/README.md:80` and `:140` are the claims; `goal-inject.mjs:33` and `compaction-context.mjs:243` are the code.
   Affected surface hints: `.skilled/hooks/goal/README.md:80`, `.skilled/hooks/goal/README.md:140`, `.skilled/hooks/goal/vibe/goal-inject.mjs:33`, `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs:243`
   Case: an operator reads the goal README to decide whether a compaction loses the goal slice, concludes it does permanently, and either re-binds the packet by hand or skips the claimed-note fallback, so the F5 fix goes unused.

3. **The parent spec records "all 22 phases Complete" and a push-ready next action while three of 022's own live rows are pre-change** -- `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/spec.md:17` -- the `_memory` block sets `recent_action: "Closed 019 and 022; all 22 phases Complete"` and `next_safe_action: "Await the operator's go-ahead to push the closeout to origin/main"`. The completion percentage is 100 and `blockers` is empty, so the packet's own continuity pointer tells the next session there is nothing left to verify.
   Finding class: traceability
   Scope proof: `spec.md:17` (`recent_action`), `:18` (`next_safe_action`), `:22` (`blockers: []`), `:26` (`completion_pct: 100`).
   Affected surface hints: `spec.md` `_memory` block, `022/implementation-summary.md:110`, `022/scratch/verdicts.md:11-13`
   Case: a fresh session resumes from `spec.md` `_memory`, sees `blockers: []` and a push-ready next action, and pushes the closeout without rerunning the three scenarios the operator reports as failing.

## Traceability Checks

| Check | Result | Evidence |
|-------|--------|----------|
| `spec_code` (core) | partial | The 018/022 claims hold for the reader fix and the F1/F2/F5/F11 fixes, but the 022 live-verdict claim does not cover the shipped composers (finding 1). |
| `checklist_evidence` (core) | fail | `022/tasks.md:90-92` mark T041-T043 `[x]` on evidence that predates `e5b8611a4fa`; the checkbox state is not supported by a post-change run. |
| `skill_agent` (overlay) | pass | `.skilled/hooks/goal/README.md` is the only stale agent-facing doc found; the hook READMEs for session-lifecycle and session-handover describe the hand-over part correctly. |
| `agent_cross_runtime` (overlay) | notApplicable | No agent profile changed in the 2026-11-15 fixes; T099's `sync-agents-vibe.cjs --check` claim is out of this dimension's reach. |
| `feature_catalog_code` (overlay) | pending | Deferred to iteration 5. |
| `playbook_capability` (overlay) | partial | The playbook scenarios exist and the runner drives them, but their recorded verdicts are pre-change (finding 1). |

## Integration Evidence

- `.skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml:47-49` -- the three Vibe mirror checks (`vibe_skills`, `vibe_prompts`, `vibe_agents`) exist, and `:159-161` names the exact `--check` command for each. T099's claim is verified.
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:87` -- `DEFAULT_RUNTIME_FOLDERS` now includes `.vibe`, so a re-pin copies it. T099's first half is verified.
- `.skilled/skills/system-skilled-doctor/references/overlays.md:182` and `:193` -- both list `.vibe` in the runtime-folder set, matching the engine.
- `.skilled/hooks/session-handover/lib/relaunch-core.cjs:1201-1211` -- `vibeGoalPacket` reads `VIBE_SPEC_FOLDER` then `SESSION_HANDOVER_GOAL_PACKET` and validates the result through `goalPacketProblem`, so the F5 fallback is implemented on the sender side too.
- `.skilled/hooks/goal/vibe/goal-inject.mjs:33` -- the receiver-side fallback matches the sender, so a claimed note's packet reaches the goal hook.

## Edge Cases

- **Ambiguity: whether the operator's live rerun is recorded anywhere.** No post-`e5b8611a4fa` run exists under `022/scratch/live/`, so the failure is known only from the dispatch focus. Finding 1 is scoped to the missing evidence, not to the failure itself.
- **Contradictory evidence: `implementation-summary.md:124` limitation 3** says "VIB-HK-027 is not covered here. The automatic handover tier's scenario arrived with the merge of origin/main and belongs to that work." That scopes VIB-HK-027 out, but it does not scope out VIB-HK-005/006/007, which the same merge changed. Recorded as the reason finding 1 stays P1 rather than being read as an accepted limitation.
- **VIB-HK-005's own cause remains open.** Iteration 1 established that the compaction watermark cannot explain it. Carried to iteration 4.
- **Partial success.** F1 (`skilled-loop` manual claim flags), F2 (`--remove-home`), F5 (goal fallback) and F11 (overlay + doctor rows) are all verified present in code, so the 2026-11-15 fix set is real; only its live-evidence claim is stale.

## Confirmed-Clean Surfaces

- `022/implementation-summary.md:124` -- the `--remove-home` limitation matches `sk-doc/sk-create-manual-testing-playbook/references/conversation-scenarios.md:167`, which documents the flag and `vibe_home_removed`.
- `022/tasks.md:145` (T097) -- the manual claim command now carries the sender's extra launch flags; the evidence line names the wrapper test that fails before the change.
- `decision-record.md:44` (Q008) -- the four applied fixes are named with their task ids, and each is present in code.

## Ruled Out

- **F11 unimplemented.** Both halves are present: `.vibe` in `overlay-engine.cjs:87` and the three checks in `doctor-runtime-mirrors.yaml:47-49`.
- **F5 unimplemented.** Both the sender (`relaunch-core.cjs:1201-1211`) and the receiver (`goal-inject.mjs:33`) carry the fallback.
- **A missing playbook scenario for the changed composers.** VIB-HK-005/006/007 exist and target exactly those composers; the gap is the run date, not the coverage.
- **`spec.md` phase-count drift.** The Phase Documentation Map lists 22 child phases and all 22 folders exist on disk.

## Next Focus

- Dimension: security
- Focus area: the hook trust boundaries the 2026-11-15 work touched -- `handover-parts.mjs` env and payload handling, `relaunch-core.cjs` packet validation, and the `--trust` flag path in `skilled-loop`
- Reason: the hand-over tier added new env-driven behaviour (`SKILLED_LOOP_ID`, `SESSION_HANDOVER_GOAL_PACKET`, `VIBE_SPEC_FOLDER`) and a process-killing path, which is the highest-risk surface not yet reviewed
- Rotation status: correctness and traceability reviewed; security and maintainability remain
- Blocked/productive carry-forward: productive -- reading the recorded evidence against commit timestamps found the traceability gap cheaply
- Required evidence: `file:line` on each trust boundary plus the validation that guards it

## Verdict

CONDITIONAL -- no active P0; three active P1 findings remain (R1-P1-001, R1-P1-002, R2-P1-001).

Review verdict: CONDITIONAL
