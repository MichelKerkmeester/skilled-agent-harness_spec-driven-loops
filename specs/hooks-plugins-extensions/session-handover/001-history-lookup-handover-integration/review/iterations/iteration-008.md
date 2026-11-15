# Deep Review Iteration 008

## Dispatcher

- Route: `Resolved route: mode=review target_agent=deep-review`; execution=single review iteration.
- Run/session: `2026-11-15T17:33:23.837Z`; generation 1; lineageMode restart; iteration 8 of 10.
- Dimension: recovery / consolidation. All four dimensions are complete; this pass changes granularity to line-level re-confirmation of the eight carried findings and the operator's four residuals.
- Operator focus: old-engine-path sweep; whether the never-run CI engine step would pass as written; the `project.test.mjs` schema skip; the 66-character quoted session-id bound equality. The known `hop-recall.sh:18` reference is recorded as known and owned by phase 008 task T002.
- Authority: review target read-only. The only writes are this narrative, the strategy update, the write-once delta, and the append-gateway record.

## Files Reviewed

| File | Lines | Why |
|------|-------|-----|
| `.github/workflows/spec-kit-check.yml` | 3-85, 273-302 | Trigger filters, install set and the history-engine step |
| `.skilled/hooks/session-handover/history/package.json` | 1-15 | Engine build and test scripts |
| `.skilled/package.json` | 1-25 | Install root, workspaces and scripts |
| `.skilled/skills/system-spec-kit/package.json` | 1 | Nested package presence; proves it is not a workspace install target |
| `.skilled/hooks/shared/tests/session-readers/project.test.mjs` | 1-40, 120-156 | Schema path and the missing-schema skip branch |
| `.skilled/hooks/session-handover/history/lib/lookup-offer.ts` | 24-68 | Engine-side 66-character bound and quote transform |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts` | 268-289 | Hook-state copy of the same bound |
| `.skilled/hooks/session-handover/history/tests/history-locator.vitest.ts` | 130-184 | Cross-copy bound sweep and session-id shape tests |
| `.skilled/hooks/session-handover/history/lib/history-entry.schema.json` | 1 | Existence check for the published schema |
| `.skilled/skills/sk-code/sk-code-review/references/review-core.md` | 1-423 | Severity and evidence doctrine |
| `.skilled/hooks/session-handover/history/tests/history-projection.vitest.ts` | 230 | Documented compatibility fixture hit from the old-path sweep |
| `.skilled/hooks/session-handover/tests/session-handover-cli.test.cjs` | 3598 | Other-checkout gate fixture hit from the old-path sweep |

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. Active carried P1 `I1-P1-001` remains active and is re-confirmed below. Because it is active, this iteration's verdict is CONDITIONAL.

### P2 Findings

None new. Seven active carried P2s remain active and are re-confirmed below. No new P2 is raised from the four operator residuals.

### Carried Findings Re-confirmed at HEAD `5bd9d54`

The target-scope drift check from `1c7bc3d9d63` to `5bd9d54ef96c` is empty for `.skilled/hooks/session-handover`, `.skilled/hooks/shared`, `.github/workflows/spec-kit-check.yml`, the runtime hook tree, the feature catalog, the playbook and the packet. The one intervening commit is a packet goal-doc edit outside the declared target. Every anchor below is therefore unchanged since the target end.

**I1-P1-001 -- The history-engine CI step cannot resolve `tsc` on a clean runner (active, carried).**
Case: a push that runs the `runtime-vitest` job reaches the history-engine step. The build script resolves `../../../skills/system-spec-kit/node_modules/.bin/tsc` from `.skilled/hooks/session-handover/history`, so it needs `.skilled/skills/system-spec-kit/node_modules`. The workflow installs `.opencode/skills/system-spec-kit` and `.skilled`, and `.skilled/package.json` declares no workspaces or install script, so that nested directory is not provisioned on a clean runner. The local tree happens to contain the symlink, but `git check-ignore` reports it under `.skilled/.gitignore:1`, so it cannot be counted as CI provisioning. [SOURCE: .skilled/hooks/session-handover/history/package.json:6] [SOURCE: .github/workflows/spec-kit-check.yml:276-286] [SOURCE: .github/workflows/spec-kit-check.yml:296-302] [SOURCE: .skilled/package.json:1-25]

| ID | Anchor | Re-confirmation |
|----|--------|-----------------|
| `I1-P2-002` | `.github/workflows/spec-kit-check.yml:3-85` | Push and pull-request filters include `.opencode/skills/system-spec-kit/**` and `.skilled/skills/system-spec-kit/**`, but neither includes `.skilled/hooks/**`. Engine-only changes still do not trigger the engine suites. |
| `I1-P2-003` | `.skilled/hooks/shared/tests/session-readers/project.test.mjs:141-142` | The missing-schema branch still registers a skipped test instead of failing. The schema file exists today at `.skilled/hooks/session-handover/history/lib/history-entry.schema.json`, so the gap is latent, not firing. |
| `I1-P2-004` | `.skilled/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts:278,281-284` | The hook-state copy is 66 and uses the same quote transform as the engine. The locator sweep compares the two behaviours but never asserts the literal 66, so both copies could move together without a test failure. [SOURCE: .skilled/hooks/session-handover/history/lib/lookup-offer.ts:33,52-58] [SOURCE: .skilled/hooks/session-handover/history/tests/history-locator.vitest.ts:164-172] |
| `I2-P2-001` | `.skilled/hooks/session-handover/history/lib/lookup-offer.ts:70` | Anchor unchanged by the target-scope diff. The runtime label is still the one interpolated value the offer does not quote; no new producer is in reach. |
| `I3-P2-001` | `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-lookup.md:185-186` | Anchor unchanged by the target-scope diff; the two retired runtime test paths remain in the Source Files table. |
| `I3-P2-002` | `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-lookup.md:147,166` | Anchor unchanged; both capability lines still omit Vibe while the file's other runtime lists include it. |
| `I3-P2-003` | `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/hop-recall-conversation.md:18` | Anchor unchanged; the hop-recall pair still describes a hop that prints no lookup offer. |

## Traceability Checks

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | pass | The retired tree `.skilled/skills/system-spec-kit/runtime/hooks/lib/history` no longer exists; the shipped engine resolves under `.skilled/hooks/session-handover/history`. The parent `spec.md:97-102` table remains a historical action list, not a live contract. |
| `checklist_evidence` | core | pass | Phase 008 remains Draft with T001-T011 unchecked. T002's negative pattern `runtime/dist/hooks/lib/history` still matches the known harness line `specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/001-hop-recall-baseline/scratch/harness/hop-recall.sh:18`, so the check is non-vacuous once the owned line is fixed. |
| `skill_agent` | overlay | notApplicable | No `SKILL.md`, command document or agent definition is inside the declared target. |
| `agent_cross_runtime` | overlay | notApplicable | No runtime mirror path is inside the declared target. |
| `feature_catalog_code` | overlay | pass | The cap, command, prefix rule and refusal exit still match the shipped constants; the previously untraced success exit remains traced to the CLI. |
| `playbook_capability` | overlay | fail | `I3-P2-001`, `I3-P2-002` and `I3-P2-003` remain active at their unchanged anchors. |

## Integration Evidence

The engine step is `.github/workflows/spec-kit-check.yml:296-302` inside the `runtime-vitest` job. Its build command is `npm --prefix .skilled/hooks/session-handover/history run build` [SOURCE: .github/workflows/spec-kit-check.yml:301], which runs the package's `build` script [SOURCE: .skilled/hooks/session-handover/history/package.json:6]. The job's install set is `.opencode/skills/system-spec-kit`, `.skilled`, the skill-advisor runtime, the shared package, the runtime and the runtime CLI [SOURCE: .github/workflows/spec-kit-check.yml:276-286]. `.skilled/package.json:1-25` has no `workspaces` field and no `install`/`postinstall` script. The nested `.skilled/skills/system-spec-kit/package.json` exists, but no step installs it. The local `.skilled/skills/system-spec-kit/node_modules/.bin/tsc` is a gitignored symlink [SOURCE: .skilled/.gitignore:1], so it is not evidence for a clean GitHub runner.

The two bound copies are `.skilled/hooks/session-handover/history/lib/lookup-offer.ts:33,52-58` (engine) and `.skilled/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts:278,281-284` (hook state). Both use 66 on the shell-quoted form with the same apostrophe expansion. The locator suite cross-checks schema acceptance against `fitsHistoryLookupOffer` over quotes 0-4 and plain lengths 50-70 [SOURCE: .skilled/hooks/session-handover/history/tests/history-locator.vitest.ts:164-172], so equality holds today.

The published-schema test resolves `.skilled/hooks/session-handover/history/lib/history-entry.schema.json` [SOURCE: .skilled/hooks/shared/tests/session-readers/project.test.mjs:26-34]. That file exists, so the skip at `:141-142` is not currently firing.

## Edge Cases

- HEAD advanced one commit beyond the target end (`5bd9d54ef96c` versus `1c7bc3d9d63`). The intervening commit is a packet goal-doc edit outside the declared target, and the target-scope diff is empty. Carried evidence is therefore still anchored, not stale.
- The local `tsc` symlink exists but is gitignored. It proves only that the developer checkout works; it does not prove the CI install set provisions the path.
- The engine's legacy matcher at `.skilled/hooks/session-handover/history/lib/history.ts:330-335` encodes the old path as an escaped regex, so a plain-text sweep cannot see it. The surrounding comment documents it as compatibility for older transcripts; it is not live drift.
- The known harness line `hop-recall.sh:18` names the retired compiled CLI. It is inside `specs/`, is owned by phase 008 task T002, and is recorded as known rather than as a new finding.
- The `project.test.mjs` skip is latent because the schema file exists. If the schema is deleted or moved, the suite will silently pass with one skipped test rather than fail.
- The worktree contains pre-existing changes to loop-owned review artifacts (the findings registry and archived lineage frames). Those are outside the declared target and were not modified by this pass.
- The P2 anchors `I2-P2-001` and `I3-P2-001` to `I3-P2-003` were re-confirmed by the zero-drift proof and the unchanged registry anchors rather than by fresh line reads, because the four operator residuals consumed the read budget. That limitation is carried into the next focus.

## Confirmed-Clean Surfaces

- The retired engine tree `.skilled/skills/system-spec-kit/runtime/hooks/lib/history` does not exist.
- The plain-text sweep for `runtime/hooks/lib/history` returns no hit under `.skilled`, `.github` or `.opencode`; the remaining 136 hits are historical prose, review packets, prompts and the known harness/compiled-path references under `specs/`.
- The dist-variant sweep `runtime/dist/hooks/lib/history` returns the known harness line plus the two documented compatibility fixtures at `.skilled/hooks/session-handover/history/tests/history-projection.vitest.ts:230` and `.skilled/hooks/session-handover/tests/session-handover-cli.test.cjs:3598`; no live import or runnable entry loads the retired tree.
- The two 66-character bound copies agree today: both are 66 and both compare the length of the shell-quoted form.
- The published schema file exists, so the missing-schema skip is latent.
- No target source changed between `1c7bc3d9d63` and HEAD `5bd9d54ef96c`.

## Ruled Out

- A live old-path reference surviving outside `specs/` outside the owned harness line and documented compatibility fixtures.
- The two 66-character copies disagreeing.
- The CI engine step passing as written.
- The projection schema skip currently firing.
- A fresh dimension remaining: all four dimensions are complete and no unread target source remains.
- A new finding from any of the four operator residuals: each resolved to a confirmation of an existing finding or to a clean surface.

## Next Focus

- Dimension: consolidation / synthesis prep; all four dimensions complete.
- Focus area: prepare the Planning Packet from the refreshed registry and re-confirm the active carried P1 and seven P2s at the next HEAD, without re-entering any BLOCKED direction.
- Reason: this pass found zero target-scope drift and zero new findings; four operator residuals closed as confirmations. The only remaining read gap is the fresh line evidence for `I2-P2-001` and the three playbook P2s.
- Carry-forward: `I1-P1-001`, `I1-P2-002`, `I1-P2-003`, `I1-P2-004`, `I2-P2-001`, `I3-P2-001` to `I3-P2-003` remain active (0 resolved).
- Required evidence: the refreshed `deep-review-findings-registry.json`, a HEAD drift check over the eight anchors, and direct line reads for `I2-P2-001` and `I3-P2-001` to `I3-P2-003` if budget remains.
- Recovery note: the zero-ratio count is at the `stuckThreshold=2` boundary; `stopPolicy=max-iterations` keeps iterations 9-10 running as consolidation only, and they must not invent findings.

Active P1 `I1-P1-001` remains, so the iteration verdict is CONDITIONAL. No P0 exists.

Review verdict: CONDITIONAL
