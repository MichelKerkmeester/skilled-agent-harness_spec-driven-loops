# Review Iteration 005

## Dispatcher

- Mode: review (fan-out lineage `vibe-1`)
- Session: `fanout-vibe-1-1794808672532-65xu0h`, generation 1, lineageMode `new`
- Executor: cli-mistral-vibe, model `deepseek-flash`
- Iteration: 5 of 5 (final iteration; the cap is reached)
- Dimension: cross-reference (residual sweep)
- Operator review focus: every Vibe hook and plugin binding, its fail-open behaviour, wire-format and payload edge cases, ordering and kill-switch gaps, and parity against the OpenCode plugins. Only new or still-open issues; the 29 findings dispositioned in `023-vibe-review-remediation/implementation-summary.md` are excluded.

### How this iteration addressed the operator focus

The focus asks for new or still-open issues with `file:line` evidence. This iteration did two things. It re-read every one of the 15 active findings against the current file content, and it cross-referenced the 18 bindings against the 28 playbook scenarios and their verdict table — the live-verdict surface the previous four iterations deferred. The re-read confirmed all 15 still open and produced one refinement that narrows `R1-P2-001` rather than closing it. The cross-reference produced the one new finding: 17 of the 18 bindings have a live scenario with a recorded PASS, and the eighteenth is `session-start`, which is also the only adapter with no unit test and the only one that cannot be imported. The verdict table also supplied counterevidence for two carried findings, recorded under Edge Cases rather than as new findings.

## Files Reviewed

- `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/022-vibe-hook-playbook-and-live-scenarios/scratch/verdicts.md:1-60` — the 27-row verdict table, its counts and its rerun history
- `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/hook-scenarios/` — the 28 scenario files, listed and matched against the 18 bindings
- `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/manual-testing-playbook.md:9,95-133,265,351-355` — the execution policy, the verdict vocabulary and the pointer to the verdict table
- `.vibe/plugins/repo-guards/lib/hook-io.mjs:33-40,76-90` — `CORE_TOOL_NAMES` and `toCoreCall`, re-read for `R1-P1-001` and `R3-P2-003`
- `.vibe/plugins/repo-guards/spec-gate.mjs:72-80` — the `advise` branch and its comment, re-read for `R1-P2-001`
- `.vibe/hooks.toml:61,124-128` — the `overlay-guard` match and the `compaction-post-tool` binding, re-read for `R1-P2-002` and `R1-P2-005`
- `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs:52,80` — the two `payload.cwd` reads, re-read for `R1-P2-003`
- `.vibe/plugins/repo-guards/session-cleanup.mjs:14-18` — the OpenCode import, re-read for `R1-P2-004`
- `.vibe/plugins/repo-guards/overlay-guard.mjs:26,42` — `WRITE_TOOLS` and the allow branch, re-read for `R1-P2-005`
- `.skilled/hooks/session-lifecycle/vibe/session-start.mjs:1-147` — re-read for the new finding and for `R4-P2-001`
- `.vibe/plugins/repo-guards/fixtures/wire-format/tool-names.md:1-14` — re-read for `R1-P1-001`'s downgrade trigger

Context evidence (read-only, not review targets): `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/023-vibe-review-remediation/implementation-summary.md`, `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md:37,196,203-212,238`.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **`session-start` is the only one of the 18 bindings with no playbook scenario, and its adapter is also the only one with no unit test and no import guard, so nothing in the repository verifies it** -- `.skilled/hooks/session-lifecycle/vibe/session-start.mjs:1-147` -- The verdict table records 27 PASS rows across 28 scenario files, and matching each scenario against the 18 `[[hooks]]` bindings leaves exactly one binding uncovered: `session-start` at `hooks.toml:141-144`. The other seventeen each have at least one scenario with a recorded PASS — `spec-gate-classify` VIB-HK-001, `turn-start` VIB-HK-003/004/005/006/028, `turn-end` VIB-HK-008/009, `spec-gate` VIB-HK-002, `env-secret-guard` VIB-HK-010, `dispatch-preflight` VIB-HK-011, `overlay-guard` VIB-HK-012, `mcp-route-guard` VIB-HK-013, `git-message-gate` VIB-HK-014, `deep-loop-guard` VIB-HK-015, `post-edit-quality` VIB-HK-016, `dist-freshness` VIB-HK-017/018, `classifier-injection-screen` VIB-HK-019, `compaction-post-tool` VIB-HK-007, `decision-capture-ask` VIB-HK-020, `session-cleanup` VIB-HK-021. `session-start` has neither a scenario nor a unit test, and `R4-P2-001` records that it cannot be imported because `:145` calls `main()` at module scope. The only evidence for its four parts is the prose at `guards-and-hooks.md:37` ("the first turn carried the goal slice") and `:155`, neither of which is a verdict row.
   Finding class: unverified-binding
   Scope proof: the 28 scenario files matched against the 18 bindings leave `session-start` as the only uncovered binding; the `vibe/` directory holds only the adapter and no test.
   Affected surface hints: `.skilled/hooks/session-lifecycle/vibe/session-start.mjs`, `.vibe/hooks.toml`, `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/hook-scenarios/`, `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/022-vibe-hook-playbook-and-live-scenarios/scratch/verdicts.md`
   Case: the goal slice, the session context, the startup-guard warnings or the stale-dist warning stops arriving at session start. No test fails and no scenario row turns red, because neither surface names the binding, so the loss is found only when an operator notices the missing context in a live session.

## Traceability Checks

- **`spec_code` — pass.** The binding census was settled in iteration 3. This iteration added the scenario census, which is a different surface: 28 scenarios against 18 bindings, 17 covered, 1 uncovered, raised as finding 1.
- **`checklist_evidence` — notApplicable.** The declared target is a file set, not a spec folder with a checklist.
- **`skill_agent` (overlay) — pass.** VIB-HK-003 and VIB-HK-028 both passed live for the advisor path, so the `pre_agent` advisor claim at `guards-and-hooks.md:131` has a verdict row behind it.
- **`agent_cross_runtime` (overlay) — pass.** The two parity defects this lineage carries (`R1-P2-004`, `R1-P2-005`) are unchanged and both have live scenarios that pass (VIB-HK-021 for the cleanup hook, VIB-HK-012 for the overlay guard), so neither is a runtime break.
- **`feature_catalog_code` (overlay) — notApplicable.** No feature catalogue covers this file set.
- **`playbook_capability` (overlay) — pass, with one gap.** The verdict table was read in full: 27 PASS, 0 FAIL, 0 OPERATOR-ONLY, 26 from runner rows and 1 from the hand-driven hop, every runner row dated 2026-11-15 after the hand-over hardening merge. The gap is the uncovered `session-start` binding, raised as finding 1.

## Residual Re-Verification of Active Findings

Every active finding was re-read against current file content. All 15 remain open; none was fixed or invalidated during the run.

| Finding | Cited line re-read | Status |
|---|---|---|
| `R1-P1-001` | `hook-io.mjs:37` maps `process_start`→`bash`; `toCoreCall:82` reads only `input.command`; no capture exists in `fixtures/` | open, unchanged |
| `R1-P2-001` | `spec-gate.mjs:76` still prints `system_message` from a strict `pre_tool` hook | open, refined below |
| `R1-P2-002` | `hooks.toml:124-128` still declares no `match` on `compaction-post-tool` | open, unchanged |
| `R1-P2-003` | `turn-start.mjs:52,80` still read `payload.cwd` raw while `sessionDirFor` resolves against `REPO_ROOT` | open, unchanged |
| `R1-P2-004` | `session-cleanup.mjs:16` still imports `.opencode/plugins/session-cleanup.js` | open, unchanged |
| `R1-P2-005` | `hooks.toml:61` still matches `bash\|process_start` while `overlay-guard.mjs:26,42` allows both | open, unchanged |
| `R2-P2-001` | `completion-evidence-post-agent.cjs:62-66,110` and `turn-start.mjs:64` still unguarded | open, unchanged |
| `R2-P2-002` | `compaction-context.mjs:350-380` still has no `isHookEnabled` | open, unchanged |
| `R2-P2-003` | `render-home-hooks.cjs:94-99` still filters to `command =` lines | open, unchanged |
| `R3-P2-001` | `guards-and-hooks.md:37` still reads "six non-strict checks on `post_tool`" | open, unchanged |
| `R3-P2-002` | `guards-and-hooks.md:203-212` still lists only `decision`/`reason` | open, confirmed by live evidence |
| `R3-P2-003` | `hook-io.mjs:33-39` still keys `process_start` bare; `toCoreCall:81` still falls through to the unmapped branch | open, unchanged |
| `R4-P2-001` | `session-start.mjs:145` still calls `main()` unguarded and exports nothing | open, unchanged |
| `R4-P2-002` | `hook-io.mjs:44-56` still exports only `readPayload`; eight reply sites unchanged | open, unchanged |
| `R4-P2-003` | `deep-loop-guard.mjs` still has no test reference | open, refined below |

## Integration Evidence

- `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/022-vibe-hook-playbook-and-live-scenarios/scratch/verdicts.md` — the live-verdict surface, read in full for the first time in this lineage.
- `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/hook-scenarios/` — the 28 scenario files, matched one by one against the 18 bindings.
- `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/manual-testing-playbook.md:265` — the pointer that names the verdict table as the live-verdict surface and states that a row counts only when its run postdates the last change to the hook it judges.
- `.vibe/hooks.toml:141-144` — the `session-start` binding, the one binding with no scenario.
- `.skilled/hooks/session-lifecycle/vibe/session-start.mjs:145` — the unguarded `main()` call that makes the binding untestable.

## Edge Cases

- **`R1-P2-001` is narrowed, not closed.** `spec-gate.mjs:73-75` carries a comment stating the choice: "Vibe ignores the context field on `pre_tool`; `system_message` is the one field its runner shows, as a UI note to the operator. Nothing here can reach the model, so the note is not recorded as a delivered question." That is stronger counterevidence than iteration 1 recorded — the author tested the alternative and documented why it was rejected. What keeps the finding open is the other half: `guards-and-hooks.md:238` documents `system_message` only for `session_start`, and the reply table at `:203-212` calls a schema mismatch a failure path that `strict = true` turns into a block. No scenario covers the `advise` path — VIB-HK-002 exercises the deny path — so whether a strict `pre_tool` hook may return `system_message` is still unverified live.
- **`R4-P2-003` is narrowed by the verdict table.** All three adapters it names have a live scenario with a recorded PASS: `deep-loop-guard` VIB-HK-015, `ask-surface-post-agent` VIB-HK-008, `completion-evidence-post-agent` VIB-HK-009. The finding therefore stands as an automated-test gap, not a verification gap, and its severity stays P2 because a manual scenario is not a CI gate and does not run on a change.
- **`R3-P2-002` is confirmed rather than weakened by the live evidence.** VIB-HK-016 passed with `post-edit-quality` returning `hook_specific_output.additional_context` and the tool output intact, which proves the field works and leaves the reply table as the only thing that is wrong.
- **`R1-P1-001`'s downgrade trigger has not fired.** The only mention of `process_start` anywhere under `fixtures/` is the prose note at `tool-names.md:13`; no captured payload records its `tool_input` key. The finding stays P1 at medium confidence.
- **The verdict table's own staleness rule was applied.** `manual-testing-playbook.md:265` states that a row counts only when its run postdates the last change to the hook it judges. The table records that `turn-start.mjs`, `turn-end.mjs` and `compaction-post-tool.mjs` changed after earlier runs and that VIB-HK-003 to 007 were rerun on the merged code, so the rows for those three bindings are current. No row is cited here as evidence for a hook it predates.
- **The cap is reached with this iteration.** `config.maxIterations` is 5 and this is iteration 5, so the lineage stops on `max-iterations` rather than on convergence. The convergence score after iteration 4 was 0.8421, which is telemetry only for this lineage and did not trigger an early synthesis.

## Confirmed-Clean Surfaces

- `specs/.../022-vibe-hook-playbook-and-live-scenarios/scratch/verdicts.md` — 27 PASS, 0 FAIL, 0 OPERATOR-ONLY, with the model pinned and recorded per row and the rerun history written out.
- `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/manual-testing-playbook.md:9` — the execution policy names the only allowed verdicts (`PASS`, `FAIL`, `SKIP`) and requires a `SKIP` to name a blocker and a re-run condition.
- `.vibe/plugins/repo-guards/spec-gate.mjs:73-75` — the `advise` branch documents why `system_message` was chosen over the context field, so the choice is auditable even though the field is undocumented for the type.
- `.vibe/plugins/repo-guards/lib/hook-io.mjs:81` — `CORE_TOOL_NAMES.get(name) ?? name` falls through to the unmapped branch rather than throwing, so an unknown tool name reaches the core with its own name instead of crashing the hook.
- `.vibe/hooks.toml:141-144` — the `session-start` binding is correctly declared on `session_start` with no `strict`, matching `guards-and-hooks.md:69`'s statement that the type cannot block.

## Ruled Out

- **The verdict table as stale evidence for the three hooks the hand-over merge changed.** Ruled out: the table records the reruns of VIB-HK-003 to 007 on the merged code between 19:40 and 19:56 UTC, and `manual-testing-playbook.md:265` states the rule the table follows.
- **`R4-P2-003`'s three adapters as unverified.** Ruled out: VIB-HK-015, VIB-HK-008 and VIB-HK-009 each passed live for one of them. The finding is narrowed to the automated-test gap.
- **`R3-P2-002` as a runtime defect.** Ruled out by VIB-HK-016's live pass. The finding is scoped to the reply table's completeness.
- **`R1-P2-001` as an author oversight.** Ruled out: `spec-gate.mjs:73-75` documents the choice and the reason. The finding is scoped to the undocumented field on a strict hook and the missing `advise`-path scenario.
- **The `session_start` binding as mis-declared.** Ruled out: `hooks.toml:141-144` declares it on `session_start` with no `strict`, which matches `guards-and-hooks.md:69`. The finding is the missing verification, not the declaration.
- **A fifth dimension left uncovered.** Ruled out: correctness, security, traceability and maintainability each ran a full iteration, and this sweep closed the cross-reference protocol.

## Next Focus

- Dimension: none remaining. All four declared dimensions are complete and the cross-reference sweep is closed.
- Focus area: the synthesis. The report carries 16 active findings (1 P1, 15 P2), the verdict `CONDITIONAL`, and the Planning Packet built from the finding registry.
- Reason: `config.maxIterations` is 5 and this is iteration 5, so the lineage stops on `max-iterations` with `stopReason: "maxIterationsReached"`.
- Rotation status: correctness, security, traceability, maintainability and cross-reference all complete.
- Blocked/productive carry-forward: productive — cross-referencing the scenario census against the binding census found the one unverified binding in a single pass, and the verdict table supplied counterevidence that narrowed two carried findings.
- Required evidence: the synthesis cites the registry, not this narrative, for the finding count and the verdict.

Review verdict: CONDITIONAL
