# Review Iteration 005

## Dispatcher

- Mode: review (fan-out lineage `vibe-2`)
- Session: `fanout-vibe-2-1794765851303-zrv85l`, generation 1, lineageMode `new`
- Dimension: cross-reference (no declared dimension remained, so the final iteration runs the cross-reference pass and records that fallback)
- Review target: `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation` (spec-folder)
- Operator review focus: phases 013-022 and the 2026-11-15 fixes, with the open lead on VIB-HK-005/006/007. This iteration addresses the focus by closing the last unchecked overlay (`feature_catalog_code`), re-reading the carried P1s against the current files, and testing the lead's own discriminator: the same journal with a fresh state dir returns the text, so the difference has to be the state the live run already wrote.
- Sources read this iteration: `steer.md` (absent), `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs:215-258`, `.skilled/skills/cli-external-orchestration/feature-catalog/feature-catalog.md:155-171`, `.skilled/skills/cli-external-orchestration/feature-catalog/mistral-vibe-dispatch-mode/mistral-vibe-dispatch-mode.md:1-80`, `.skilled/skills/cli-external-orchestration/{mode-registry.json,hub-router.json,leaf-manifest.json}`, `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/hook-scenarios/{turn-start-compaction-reinjection.md,compaction-post-tool.md}`, `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs:739,985-1090`, `.skilled/hooks/session-handover/vibe/handover-parts.mjs:66-72`, `.skilled/hooks/session-handover/lib/relaunch-core.cjs:1191-1243`, `022-vibe-hook-playbook-and-live-scenarios/scratch/verdicts.md:46`.

## Files Reviewed

- `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs:215-258`
- `.skilled/skills/cli-external-orchestration/feature-catalog/feature-catalog.md:155-171`
- `.skilled/skills/cli-external-orchestration/feature-catalog/mistral-vibe-dispatch-mode/mistral-vibe-dispatch-mode.md:1-80`
- `.skilled/skills/cli-external-orchestration/mode-registry.json:241-264`
- `.skilled/skills/cli-external-orchestration/hub-router.json:104-111,272-277`
- `.skilled/skills/cli-external-orchestration/leaf-manifest.json:82-83`
- `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/hook-scenarios/turn-start-compaction-reinjection.md:1-45`
- `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/hook-scenarios/compaction-post-tool.md:100-158`
- `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs:739,985-1090`
- `.skilled/hooks/session-handover/vibe/handover-parts.mjs:66-72`
- `.skilled/hooks/session-handover/lib/relaunch-core.cjs:1191-1243`
- `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/022-vibe-hook-playbook-and-live-scenarios/scratch/verdicts.md:46`

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **The detector commits the watermark before it knows it has any text, so a compaction whose goal slice and handoff note are both empty is marked injected and never retried** -- `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs:231` -- `writeWatermark` runs at `:231` and `resetReceipt` at `:236`, both before the sections are built at `:241-250` and before the empty check at `:252` returns `''`. The comment at `:233-234` justifies the order for the receipt ("the advisor part that runs later in the same turn already sees the re-armed receipt") but the same order applies to the watermark, which is the durable record that this compaction was handled. This is the refinement of R1-P1-001 that explains the operator's own discriminator: `buildCompactionPart` on the same journal with a fresh state dir returns the text because no watermark exists, while the live run has already written one on a call that produced nothing.
   Finding class: correctness
   Scope proof: the detector is a `reviewScopeFiles` entry and the whole path from the watermark read at `:219` to the empty return at `:252` was re-read this iteration.
   Affected surface hints: `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs`
   Case: a receiver session starts without `VIBE_SPEC_FOLDER` and with no open handoff note, a compaction lands, the detector writes the watermark and returns nothing, and every later call for that compaction is filtered out at `:223` even after the operator binds a packet.
   ```json
   {"type":"claim","claim":"The watermark is written before the sections are built, so a compaction that yields no text is permanently marked as injected.","evidenceRefs":["compaction-context.mjs:219-225","compaction-context.mjs:231","compaction-context.mjs:236","compaction-context.mjs:241-250","compaction-context.mjs:252"],"counterevidenceSought":"Checked whether the empty path restores the watermark (it does not), whether a later call can re-derive the compaction (the filter at :223 drops it by id), and whether the fresh-state-dir behaviour the operator reported is explained by anything else (a fresh dir has no watermark, so the filter passes and the text is built).","alternativeExplanation":"The live failure could also be the two-seam consumption R1-P1-001 describes, where the post_tool seam writes the watermark and the turn_start seam then finds nothing. Both mechanisms share the same ordering defect and the same fix, which is why this is recorded as a refinement rather than a separate root cause.","finalSeverity":"P1","confidence":"high","downgradeTrigger":"Downgrade only if a later read shows the empty path restoring the watermark or the filter keyed on something other than the compaction id."}
   ```

### P2 Findings

1. **The feature catalog's dispatch-mode page lists three composition points and omits the hand-over part that now runs in all three composers, and the catalog never mentions hand-over at all** -- `.skilled/skills/cli-external-orchestration/feature-catalog/mistral-vibe-dispatch-mode/mistral-vibe-dispatch-mode.md:39` -- the paragraph enumerates the rendered home's entries: `spec-gate-classify` and `turn-start` on `pre_agent`, `turn-end` on `post_agent`, the strict guards on `pre_tool`, the non-strict checks on `post_tool`, and `session-start`/`session-end`. It does not mention that `turn-start`, `compaction-post-tool` and `turn-end` each also run the hand-over part (`handover-parts.mjs:193,294` and the turn-end arm). `grep -rn "handover\|hand-over" .skilled/skills/cli-external-orchestration/feature-catalog/` returns nothing, and `git log` shows the page was last touched by `52be7e1f4db`, before `e5b8611a4fa`.
   Finding class: traceability
   Scope proof: the catalog is the `feature_catalog_code` overlay's own surface and the composers it describes are inside the review target.
   Affected surface hints: `.skilled/skills/cli-external-orchestration/feature-catalog/mistral-vibe-dispatch-mode/mistral-vibe-dispatch-mode.md`, `.skilled/hooks/session-handover/vibe/handover-parts.mjs`
   Case: an operator reads the catalog to learn what a Vibe dispatch runs, does not see that a dispatch can hand over and relaunch the session, and is surprised by a relaunch when `SYSTEM_SESSION_HANDOVER_VIBE_ENABLED=1` is set in the shell.

2. **Both compaction scenarios require a non-empty goal slice, so the empty-slice path that loses the injection has no coverage** -- `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/hook-scenarios/turn-start-compaction-reinjection.md:31` -- VIB-HK-006's expected signal is "a `pre_agent_turn` hook result whose injected text carries `Context restored after a compaction.` and the slice's `# Goal:` heading", and VIB-HK-007's is "a later `post_tool_call` result carries `Context restored after a compaction.`" with the probe model bound through `VIBE_SPEC_FOLDER`. Both therefore bind a packet with a `goal.md`, which is exactly the condition under which `sections` is non-empty and the defect in R5-P1-001 cannot fire. No scenario runs a compaction in a session with no bound packet and no open handoff note.
   Finding class: traceability
   Scope proof: the scenarios are the packet's own phase-022 artifacts and the detector they exercise is inside the review target.
   Affected surface hints: `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/hook-scenarios/turn-start-compaction-reinjection.md`, `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/hook-scenarios/compaction-post-tool.md`
   Case: the operator's live session compacts with no packet bound, the detector writes the watermark and returns nothing, and both recorded scenarios would still read PASS because neither one runs that shape.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|---|---|---|---|
| `spec_code` | core | partial | Carried from iterations 1, 2 and 4. Phase 018's promise is implemented at `compaction-context.mjs:243` and defeated on the empty path at `:231` versus `:252` (R5-P1-001). |
| `checklist_evidence` | core | notApplicable | No phase in 013-022 carries a `checklist.md`; evidence lives in `tasks.md` checkboxes. |
| `skill_agent` | overlay | pass | Carried from iteration 2. |
| `agent_cross_runtime` | overlay | pass | Carried from iteration 2. |
| `feature_catalog_code` | overlay | partial | Closed this iteration: the seven hard rules at `dispatch-rule-checks.mjs:739,985-1094` match the catalog's list, the mode registry, hub router and leaf manifest all name `cli-mistral-vibe`, and the dispatch-mode page omits the hand-over tier (R5-P2-001). |
| `playbook_capability` | overlay | partial | Carried from iteration 2, extended by R5-P2-002: 27 scenarios exist, 26 carry a verdict, and neither compaction scenario covers the empty-slice path. |

## Integration Evidence

- `.skilled/skills/cli-external-orchestration/mode-registry.json:241-264`, `hub-router.json:104-111,272-277` and `leaf-manifest.json:82-83` all name `cli-mistral-vibe` with the same four routing phrases, so the catalog's "eighth workflow mode" claim is registry-backed.
- `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs:739,985,995,1014,1043,1059,1074` holds one check per rule the catalog names, so the "seven hard rules" claim is code-backed.
- `.skilled/hooks/session-handover/lib/relaunch-core.cjs:1191-1243` holds `vibeGoalPacket`, and `handover-parts.mjs:66-72` routes the enable check through the shared `isHookEnabled` resolver, so the 2026-11-15 goal fallback and the documented switch both exist.
- `022-vibe-hook-playbook-and-live-scenarios/scratch/verdicts.md:46` names the merge `2d4fb4d0f92` as the one that brought VIB-HK-027 and cut VIB-HK-006 from four turns to three; `git log -1 2d4fb4d0f92` confirms the commit exists and is that merge.

## Edge Cases

- The cross-reference dimension was not in the declared list; it is the documented fallback when no dimension remains, and it is recorded here rather than treated as a fifth dimension.
- R5-P1-001 overlaps R1-P1-001 by construction. It is recorded as a refinement with its own evidence and its own case because the empty-return path is independently testable, and the delta row carries `refinementOf` so the merge can collapse the two if it prefers.
- The catalog omission in R5-P2-001 is a missing statement rather than a wrong one, so it is held at P2 even though the catalog is the overlay's canonical surface.

## Confirmed-Clean Surfaces

- The seven hard rules the catalog names all exist in `dispatch-rule-checks.mjs`, one check each, and the catalog's routing vocabulary matches `mode-registry.json:260-264` exactly.
- `022/scratch/verdicts.md:46`'s account of the merge is accurate: `2d4fb4d0f92` exists, is the `origin/main` merge, and the VIB-HK-027 note is consistent with the 26-row table.
- The carried R2-P1-001 is still active and unchanged: `verdicts.md` holds 26 `VIB-HK` rows and VIB-HK-027 has none, while the playbook lists 27 scenarios.
- The carried R1-P1-001 is still active and unchanged: `writeWatermark` at `:231` still precedes the section build at `:241-250`.

## Ruled Out

- **The mode registry, hub router and leaf manifest disagree about the Vibe mode.** Ruled out: all three name `cli-mistral-vibe` with the same routing phrases.
- **The catalog's seven-hard-rule claim is stale.** Ruled out: each rule has a check at the cited line in `dispatch-rule-checks.mjs`.
- **The 2026-11-15 goal fallback is missing from the relaunch core.** Ruled out: `vibeGoalPacket` is at `relaunch-core.cjs:1201-1243` and is called at `:1243`.
- **The hand-over enable switch is undocumented or unimplemented.** Ruled out: `handover-parts.mjs:66-72` routes through the shared resolver and `SKILL.md:197` names both switches.

## Next Focus

- Dimension: none remaining
- Focus area: synthesis
- Reason: five iterations are complete, all four declared dimensions and the cross-reference fallback are covered, and the bound stop policy is `max-iterations`.
- Rotation status: complete.
- Blocked/productive carry-forward: productive — the cross-reference pass produced the sharpest statement of the open lead's root cause.
- Required evidence: none; the synthesis reads the registry and the five iteration artifacts.
- Recovery note: not applicable.

Review verdict: CONDITIONAL
