# Deep Review Iteration 009

## Dispatcher

- Route: `Resolved route: mode=review target_agent=deep-review`; execution=single review iteration.
- Run/session: `2026-11-15T17:33:23.837Z`; generation 1; lineageMode restart; iteration 9 of 10.
- Dimension: correctness under the consolidation / synthesis-prep focus. All four dimensions are complete; this pass changes granularity to direct line-level re-confirmation of the four P2 anchors left unread in iteration 8, plus a HEAD drift check over all eight active findings.
- Operator focus: the four residuals are **not re-entered as fresh searches** because every one is recorded BLOCKED across iterations 1-8 and the dispatch forbids re-entry. Their conclusions stand on the zero-drift proof, and the known `hop-recall.sh:18` line is recorded as known and owned by phase 008 task T002, not as a new finding.
- Authority: review target read-only. The only writes are this narrative, the strategy update, the write-once delta, and the append-gateway record.

## Files Reviewed

| File | Lines | Why |
|------|-------|-----|
| `.skilled/hooks/session-handover/history/lib/lookup-offer.ts` | 55-89 | Fresh line evidence for `I2-P2-001` (runtime-prefix interpolation) |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-lookup.md` | 138-192 | Fresh line evidence for `I3-P2-001` and `I3-P2-002` |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/hop-recall-conversation.md` | 1-40 | Fresh line evidence for `I3-P2-003` |
| `.skilled/hooks/session-handover/history/package.json` | 1-15 | Anchor for `I1-P1-001` (build script resolving `tsc`) |
| `.skilled/skills/sk-code/sk-code-review/SKILL.md` | 1-403 | Review-mode entry and severity doctrine |
| `.skilled/skills/sk-code/sk-code-review/references/review-core.md` | 1-423 | Severity, reach and evidence doctrine |

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. Active carried P1 `I1-P1-001` remains active and is re-confirmed below. Because it is active and no P0 exists, this iteration's verdict is CONDITIONAL.

### P2 Findings

None new. Seven active carried P2s remain active and are re-confirmed below. The four anchors named as the remaining read gap in iteration 8 were read directly at HEAD and reproduce unchanged, so the gap is closed rather than converted into a new finding.

### Carried Findings Re-confirmed at HEAD `5bd9d54`

The target-scope drift check is empty: `git status --porcelain` over all eight anchor paths returns nothing, and `git diff --stat 1c7bc3d9d63..HEAD` over the declared target paths returns nothing. HEAD is `5bd9d54ef96`. Every anchor below resolves as an existing file, so each carried finding is unchanged since the target end.

**I1-P1-001 -- The history-engine CI step cannot resolve `tsc` on a clean runner (active, carried).**
Case: a push that runs the `runtime-vitest` job reaches the history-engine step; the package build script resolves `../../../skills/system-spec-kit/node_modules/.bin/tsc`, a directory the workflow's install set never provisions on a clean runner.
Finding class: cross-consumer
Scope proof: the package build script is the only engine build entry, and the workflow's install set plus `.skilled/package.json` show no workspaces or nested install target.
Affected surface hints: ["session-handover history package", "spec-kit-check runtime-vitest", "CI install set"]
Evidence: [SOURCE: .skilled/hooks/session-handover/history/package.json:11] [SOURCE: .github/workflows/spec-kit-check.yml:296-302] [SOURCE: .github/workflows/spec-kit-check.yml:276-286] [SOURCE: .skilled/package.json:1-25]

| ID | Anchor | Re-confirmation at HEAD |
|----|--------|-------------------------|
| `I1-P2-002` | `.github/workflows/spec-kit-check.yml:3-85` | Push and pull-request filters still omit `.skilled/hooks/**`, so engine-only changes do not trigger the engine suites. Carried from iteration 8 and unchanged by the zero-drift proof. |
| `I1-P2-003` | `.skilled/hooks/shared/tests/session-readers/project.test.mjs:141-142` | The missing-schema branch still registers a skipped test instead of failing. The schema exists today at `.skilled/hooks/session-handover/history/lib/history-entry.schema.json`, so the gap is latent. |
| `I1-P2-004` | `.skilled/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts:278,281-284` | The hook-state copy is 66 on the shell-quoted form, but the locator sweep never asserts the literal, so both copies could move together without a failure. [SOURCE: .skilled/hooks/session-handover/history/lib/lookup-offer.ts:57-58] |
| `I2-P2-001` | `.skilled/hooks/session-handover/history/lib/lookup-offer.ts:69-70` | **Fresh read.** `runtimePrefix` is built from `locator.runtime` raw at `:69` and interpolated unquoted into the pasted command at `:70`; `shellQuote` is applied to the session id and handle only. No in-tree producer passes an unsafe label, so the severity stays P2. |
| `I3-P2-001` | `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-lookup.md:185-186` | **Fresh read.** Lines 185-186 still name `.skilled/skills/system-spec-kit/runtime/tests/history-lookup-cli.vitest.ts` and `history-locator.vitest.ts`; the moved counterparts exist under `.skilled/hooks/session-handover/history/tests/`. |
| `I3-P2-002` | `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-lookup.md:147,166` | **Fresh read of both lines.** `:147` says the section appears only for "a Claude Code or Codex session"; `:166` says "must be Claude Code or Codex". The file's other runtime lists (for example `:26,:30,:93`) include Vibe. |
| `I3-P2-003` | `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/hop-recall-conversation.md:18` | **Fresh read.** `:18` still says "the hop prints no lookup offer", while `:22` in the same document says "The claim prints a `## History Lookup` section ... so the section is printed in one and withheld in the other". The contradiction is internal and still live. |

## Traceability Checks

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | pass | The retired tree `.skilled/skills/system-spec-kit/runtime/hooks/lib/history` no longer exists; the shipped engine resolves under `.skilled/hooks/session-handover/history`. The parent `spec.md:97-102` table is a historical action list, not a live contract. |
| `checklist_evidence` | core | pass | Phase 008 remains Draft with T001-T011 unchecked. T002's negative pattern `runtime/dist/hooks/lib/history` still matches the known harness line `specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/001-hop-recall-baseline/scratch/harness/hop-recall.sh:18`, so the check is non-vacuous once the owned line is fixed. |
| `skill_agent` | overlay | notApplicable | No `SKILL.md`, command document or agent definition is inside the declared target. |
| `agent_cross_runtime` | overlay | notApplicable | No runtime mirror path is inside the declared target. |
| `feature_catalog_code` | overlay | pass | The cap, command, prefix rule, refusal exit 2 and success exit 0 remain traced to the shipped constants and the CLI; no catalog anchor drifted. |
| `playbook_capability` | overlay | fail | `I3-P2-001`, `I3-P2-002` and `I3-P2-003` remain active at their unchanged anchors, each re-read directly this pass. |

## Edge Cases

- **Registry anchor inaccuracy on the carried P1.** `deep-review-findings-registry.json` records `I1-P1-001` at `.skilled/hooks/session-handover/history/package.json:6`, which today is the `"engines"` field. The `build` script that proves the claim is `package.json:11` [SOURCE: .skilled/hooks/session-handover/history/package.json:11]. The target-scope diff is empty, so this is an anchor-writing inaccuracy, not code drift. The registry is reducer-owned and read-only; the corrected citation is recorded here for the Planning Packet rather than edited into the registry.
- The four operator residuals were not re-swept: old-path reference, CI engine step, schema skip and bound equality are all recorded BLOCKED, and re-entry is prohibited. The zero-drift proof plus the unchanged anchors carry their conclusions; this is a limitation of the pass, not a fresh pass for any of them.
- The CI engine step still has never run on GitHub. The failure remains statically proven by path resolution against the install set, not observed red.
- The local `.skilled/skills/system-spec-kit/node_modules/.bin/tsc` symlink exists but is gitignored, so it proves the developer checkout works and nothing about a clean runner.
- The engine's legacy matcher at `.skilled/hooks/session-handover/history/lib/history.ts:330-335` still encodes the old path as an escaped regex; its surrounding comment documents it as compatibility for older transcripts.
- The known `hop-recall.sh:18` reference is inside `specs/`, is owned by phase 008 task T002, and is recorded as known rather than as a new finding.
- The `project.test.mjs` skip remains latent because the published schema file exists; deleting or moving the schema would silently pass the suite with one skipped test.
- HEAD advanced one commit beyond the target end (`5bd9d54ef96` versus `1c7bc3d9d63`); the intervening commit is a packet goal-doc edit outside the declared target.
- No review-target file was modified by this pass; the only writes are the review packet artifacts.

## Confirmed-Clean Surfaces

- All eight active-finding anchor paths exist at HEAD and are unchanged since `1c7bc3d9d63`.
- The working-tree status over the eight anchor paths is empty, so no carried finding's source line has been locally edited.
- `I2-P2-001` and `I3-P2-001` to `I3-P2-003` now have fresh line evidence at HEAD; iteration 8's only remaining read gap is closed.
- The severity and evidence doctrine was loaded before classification (review-mode entry plus `review-core.md`).

## Integration Evidence

The engine build entry and the CI step it feeds were re-checked at the package side: `npm --prefix .skilled/hooks/session-handover/history run build` [SOURCE: .github/workflows/spec-kit-check.yml:301] runs `package.json:11`, which resolves `tsc` under `.skilled/skills/system-spec-kit/node_modules`. That nested tree is not in the workflow's install set [SOURCE: .github/workflows/spec-kit-check.yml:276-286], so the gap in `I1-P1-001` still holds. The workflow itself was not re-read this pass; its lines are carried from iteration 8 and unchanged by the zero-drift proof.

## Ruled Out

- The carried findings were fixed, or their anchors moved, at HEAD `5bd9d54`: the working-tree status over the anchor set and the committed diff since `1c7bc3d9d63` are both empty.
- A new finding from the remaining P2 read gap: all four anchors reproduce exactly and are re-attributed to their existing findings, not to new ones.
- A fresh re-entry into the four operator residuals: each direction is BLOCKED, and the dispatch forbids re-entry.

## Next Focus

- Dimension: consolidation / synthesis prep; all four dimensions complete.
- Focus area: iteration 10 is the terminal pass. Re-confirm the eight active findings at the final HEAD and assemble the Planning Packet (fix order, owners, evidence anchors) from the refreshed registry once this record lands.
- Reason: nine passes have produced zero new findings in the last two iterations; the target has not drifted since `1c7bc3d9d63`, and no unread target source remains.
- Carry-forward: `I1-P1-001`, `I1-P2-002`, `I1-P2-003`, `I1-P2-004`, `I2-P2-001`, `I3-P2-001` to `I3-P2-003` remain active (0 resolved).
- Required evidence: the refreshed `deep-review-findings-registry.json`, a final zero-drift proof at HEAD, and the corrected `package.json:11` anchor for `I1-P1-001`.
- Recovery note: `stopPolicy=max-iterations` ends the loop after iteration 10; that pass is closeout only and must not invent findings. Active P1 `I1-P1-001` remains, so the verdict stays CONDITIONAL while no P0 exists.

Review verdict: CONDITIONAL
