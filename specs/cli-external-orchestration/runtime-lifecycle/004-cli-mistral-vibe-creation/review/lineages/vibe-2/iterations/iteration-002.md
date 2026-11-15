# Review Iteration 002

## Dispatcher

- Mode: review (fan-out lineage `vibe-2`)
- Session: `fanout-vibe-2-1794765851303-zrv85l`, generation 1, lineageMode `new`
- Dimension: traceability
- Review target: `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation` (spec-folder)
- Operator review focus: phases 013-022, the 2026-11-15 fixes, and the open lead on VIB-HK-005/006/007. This iteration addresses the focus by checking whether the packet's own artifacts still support the live verdicts those three scenarios carry.
- Sources read this iteration: `steer.md` (absent), `spec.md:120-145`, `decision-record.md:1-60`, `022-vibe-hook-playbook-and-live-scenarios/tasks.md:143-153`, `022-vibe-hook-playbook-and-live-scenarios/implementation-summary.md:1-40`, `022-vibe-hook-playbook-and-live-scenarios/scratch/verdicts.md`, `022-vibe-hook-playbook-and-live-scenarios/scratch/live/VIB-HK-006/{matrix.md,checkpoints.tsv,result.json}`, `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/manual-testing-playbook.md:180-300,340-430`, `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/hook-scenarios/turn-start-compaction-reinjection.md:1-110`, `.skilled/bin/skilled-loop:60-100,837-870`, `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:3050-3060,3220-3280,3340-3400`, `.skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml:1-190`, `.skilled/commands/doctor/scripts/overlay-engine.cjs:87`, `.skilled/skills/system-spec-kit/runtime/cli/vibe/sync-agents-vibe.cjs` (existence), `.vibe/agents/` (listing).

## Files Reviewed

- `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/spec.md:120-145`
- `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/decision-record.md:1-60`
- `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/022-vibe-hook-playbook-and-live-scenarios/tasks.md:143-153`
- `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/022-vibe-hook-playbook-and-live-scenarios/implementation-summary.md:1-40`
- `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/022-vibe-hook-playbook-and-live-scenarios/scratch/verdicts.md:1-40`
- `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/022-vibe-hook-playbook-and-live-scenarios/scratch/live/VIB-HK-006/{matrix.md,checkpoints.tsv,result.json}`
- `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/manual-testing-playbook.md:180-300,340-430`
- `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/hook-scenarios/turn-start-compaction-reinjection.md:1-110`
- `.skilled/bin/skilled-loop:60-100,837-870`
- `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:3050-3060,3220-3280,3340-3400`
- `.skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml:1-190`
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:87`
- `.vibe/agents/` (11 profiles)

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **The packet's live-evidence claim for VIB-HK-005, 006 and 007 is stale after the automatic handover tier merged, and no artifact in the packet records the regression** -- `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/spec.md:139` -- the phase 22 row reads "Complete: 26 PASS live, the five checks hardened after the review included", and `022-vibe-hook-playbook-and-live-scenarios/scratch/verdicts.md:11-13` records PASS for VIB-HK-005, 006 and 007 with matching `result.json` and `checkpoints.tsv`. The same file at `:38` says VIB-HK-027, the automatic handover tier, "belongs to the automatic handover work, not this phase, so it has no row here", while the playbook the phase owns lists 27 scenarios (`manual-testing-playbook.md:261,291`). The operator's review focus reports those three scenarios failing live after `e5b8611a4fa`, and nothing in the packet re-ran them or recorded the regression.
   Finding class: traceability
   Scope proof: every cited path is inside the declared review target; the playbook and the runner are cited as the integration surfaces the packet's claim depends on, not as code findings.
   Affected surface hints: `spec.md`, `022-vibe-hook-playbook-and-live-scenarios/scratch/verdicts.md`, `022-vibe-hook-playbook-and-live-scenarios/implementation-summary.md`, `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/manual-testing-playbook.md`
   Case: an operator reads `spec.md` and `verdicts.md`, sees 26 PASS and phase 22 Complete, and ships. The three scenarios the operator observed failing after the handover tier are recorded as passing, so the release-readiness claim rests on evidence that no longer holds.
   ```json
   {"type":"claim","claim":"The packet's live verdicts for VIB-HK-005/006/007 predate the automatic handover tier and were never re-run, so the packet's completion claim is unsupported for those three scenarios.","evidenceRefs":["spec.md:139","022-vibe-hook-playbook-and-live-scenarios/scratch/verdicts.md:11-13","022-vibe-hook-playbook-and-live-scenarios/scratch/verdicts.md:38","manual-testing-playbook.md:261","manual-testing-playbook.md:291"],"counterevidenceSought":"Checked every recorded artifact under `scratch/live/VIB-HK-005..007/` for a post-merge rerun (the `result.json` timestamps are 2026-11-15T00:46, 06:34 and 12:09, all before the 13:24 handover commit), checked `tasks.md:143-153` for a rerun task (none names 005, 006 or 007), and checked `verdicts.md` for a regression note (none).","alternativeExplanation":"The operator's failure may be a later, unrecorded run whose evidence was never written back. That does not change the finding: the packet still carries no record of it.","finalSeverity":"P1","confidence":"high","downgradeTrigger":"Downgrade to P2 if a post-merge rerun of the three scenarios is recorded and passes."}
   ```

### P2 Findings

1. **The recorded VIB-HK-006 evidence is from a four-turn scenario version the playbook no longer contains** -- `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/022-vibe-hook-playbook-and-live-scenarios/scratch/live/VIB-HK-006/vibe/checkpoints.tsv:1-5` -- the recorded `checkpoints.tsv` and `result.json` carry four turns (`first-turn`, `compact`, `reinject`, `history-offer`), while the current scenario defines three (`turn-start-compaction-reinjection.md:64,78,83`). `verdicts.md:38` documents the cut, but the evidence folder still carries the orphaned `turns/history-offer/` and a 4/4 row that a rerun of the current scenario cannot reproduce.
   Finding class: traceability
   Scope proof: the evidence folder and the scenario file are both inside the declared review target.
   Affected surface hints: `022-vibe-hook-playbook-and-live-scenarios/scratch/live/VIB-HK-006/`, `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/hook-scenarios/turn-start-compaction-reinjection.md`
   Case: a reader re-runs the current three-turn scenario, gets a 3/3 row, and cannot compare it with the recorded 4/4 row; the `history-offer` evidence has no scenario turn that justifies it.
   ```json
   {"type":"claim","claim":"The recorded VIB-HK-006 evidence does not correspond to the scenario file the playbook ships.","evidenceRefs":["022-vibe-hook-playbook-and-live-scenarios/scratch/live/VIB-HK-006/vibe/checkpoints.tsv:1-5","022-vibe-hook-playbook-and-live-scenarios/scratch/live/VIB-HK-006/vibe/result.json","turn-start-compaction-reinjection.md:64","turn-start-compaction-reinjection.md:78","turn-start-compaction-reinjection.md:83"],"counterevidenceSought":"Checked whether the scenario still defines a fourth turn (it does not) and whether `verdicts.md` explains the mismatch (it does, at `:38`, which is why this is P2 rather than P1).","alternativeExplanation":"The four-turn evidence may be kept on purpose as the broader record, which `verdicts.md:38` states.","finalSeverity":"P2","confidence":"high","downgradeTrigger":"No downgrade path; the tier is already the lowest."}
   ```

2. **The playbook lists 27 scenarios but carries no per-scenario verdict, so the only verdict table lives under a phase's `scratch/`** -- `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/manual-testing-playbook.md:261` -- the section header reads `VIB-HK-001..VIB-HK-027` and `:291` lists VIB-HK-027, but the playbook has no verdict column and the only verdict table is `022-vibe-hook-playbook-and-live-scenarios/scratch/verdicts.md`, which is a scratch artifact.
   Finding class: traceability
   Scope proof: the playbook is the integration surface the packet's phase 22 claim depends on; the verdict table is inside the declared review target.
   Affected surface hints: `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/manual-testing-playbook.md`, `022-vibe-hook-playbook-and-live-scenarios/scratch/verdicts.md`
   Case: a reader of the skill's playbook cannot tell which of the 27 scenarios have been run, and a `scratch/` folder is not a durable record for a shipped skill.
   ```json
   {"type":"claim","claim":"The playbook's scenario inventory and the packet's verdict table disagree in count and live in different artifacts, one of them scratch.","evidenceRefs":["manual-testing-playbook.md:261","manual-testing-playbook.md:291","022-vibe-hook-playbook-and-live-scenarios/scratch/verdicts.md:1-40"],"counterevidenceSought":"Checked whether the playbook carries a verdict column or a link to the verdict table (it carries neither) and whether `verdicts.md` is referenced from a durable packet document (it is referenced from `implementation-summary.md` key_files, which is durable, but the table itself is not).","alternativeExplanation":"The playbook may be scoped to the operator procedure only, with verdicts owned by the packet. That is a defensible split, which is why this is P2.","finalSeverity":"P2","confidence":"medium","downgradeTrigger":"No downgrade path; the tier is already the lowest."}
   ```

## Traceability Checks

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | partial | Phase 018's re-injection claim is implemented but single-consumer (iteration 1). Phase 22's "26 PASS live" claim is stale for VIB-HK-005/006/007 (this iteration). Phases 013-021's claims were not re-read this iteration. |
| `checklist_evidence` | core | notApplicable | No phase in 013-022 carries a `checklist.md`; the acceptance evidence lives in `tasks.md` checkboxes (`022/tasks.md:143-153`). Recorded as notApplicable with the reason rather than as a pass. |
| `skill_agent` | overlay | pass | The `cli-mistral-vibe` playbook lists 27 scenario files and `hook-scenarios/` holds 27 files, so the skill's inventory and its assets agree. |
| `agent_cross_runtime` | overlay | pass | `.vibe/agents/` holds 11 `.toml` profiles, and `sync-agents-vibe.cjs` exists at the path `doctor-runtime-mirrors.yaml:49` names, so the doctor's Vibe agent row has a real target. |
| `feature_catalog_code` | overlay | pending | Deferred to the cross-reference iteration. |
| `playbook_capability` | overlay | partial | The playbook's capability rows name the runner and the scenario ids, but the verdicts they claim are not carried in the playbook (P2-002 this iteration). |

## Integration Evidence

- `.skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml:47-49` names the three Vibe sync scripts, and `:159-161` gives each row its `--check` command and its `n/a` rule. This is the T099 doctor fix, and it is present.
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:87` lists `.vibe` in `DEFAULT_RUNTIME_FOLDERS`, which is the T099 re-pin fix, and it is present.
- `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:3057,3225,3274-3275,3359,3398` implements the T098 `--remove-home` flag and records `vibe_home` and `vibe_home_removed` in `result.json`.
- `.skilled/bin/skilled-loop:837-870` builds the manual claim command from the live launch arguments, which is the T097 fix, and `:1191-1194` exports `SESSION_HANDOVER_GOAL_PACKET` from the claim seed, which is the T098 goal fallback.
- `decision-record.md:47` records Q008 as the operator decision that authorised all four fixes, carried by T097, T098, T099 and 019 T011. All four are present in the code.

## Edge Cases

- **Ambiguity: `checklist_evidence` has no target.** I chose `notApplicable` with the reason recorded, rather than a pass, because a missing checklist is not evidence of coverage.
- **Contradiction: `verdicts.md:38` says VIB-HK-006 was cut to three turns, and the recorded evidence has four.** Both sides are cited; the adjudication is that the note is accurate about the cut and the evidence folder was not pruned, which is P2-001.
- **Missing dependency: no keyed Vibe session.** The three scenarios cannot be re-run here, so the staleness finding rests on the recorded timestamps and the absence of a rerun task, not on a live observation.
- **Partial success:** the four 2026-11-15 fixes named in the review focus are all present in the code, so the focus's fix claims are supported even though the live verdicts are not.

## Confirmed-Clean Surfaces

- `spec.md:120-139` phase rows for 013-021 each name a concrete artifact and a concrete verification, and every named artifact exists.
- `022/tasks.md:143-153` records T095-T105 with a verify command and a dated evidence line for each.
- `decision-record.md:47` Q008 names all four 2026-11-15 fixes and the tasks that carry them.
- `manual-testing-playbook.md:182` states the one-runner-at-a-time constraint and why, which matches the runner's repository snapshot behaviour.

## Ruled Out

- **The 2026-11-15 fixes were claimed but not landed.** Ruled out: all four are present at the cited lines.
- **The playbook and the scenario folder disagree on the scenario count.** Ruled out: both are 27.
- **The doctor's Vibe rows point at missing scripts.** Ruled out: all three scripts exist.

## Next Focus

- Dimension: security
- Focus area: the Vibe hook trust boundary, the `VIBE_SPEC_FOLDER` and `SESSION_HANDOVER_GOAL_PACKET` precedence, the state directories the hooks write under `payload.cwd`, and the `skilled-loop` env allowlist.
- Reason: the packet's hooks run model-adjacent code with write access under a caller-supplied `cwd`, and the goal packet path is caller-supplied too.
- Rotation status: correctness and traceability complete, security next.
- Blocked/productive carry-forward: productive — direct reads of the packet's own artifacts produced three findings.
- Required evidence: `file:line` in the hooks, the goal core's path resolution, and the wrapper's env handling.
- Recovery note: not applicable.

Review verdict: CONDITIONAL
