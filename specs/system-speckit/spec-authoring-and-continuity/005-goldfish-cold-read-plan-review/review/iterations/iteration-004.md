# Review Iteration 004

## Dispatcher

- Mode: `review` | Target agent: `deep-review` (LEAF, single iteration)
- Dimension: `maintainability` (D4, last remaining)
- Target: `specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review` (spec-folder)
- Operator focus: read the uncommitted implementation of child phases 002-006 as changed code and docs, judged against each child's `spec.md` and `acceptance-criteria.md`. This iteration reads the same change set through the maintainability lens only; no correctness or security direction was re-entered.
- Budget profile: `verify` (13 tool calls used: 10 discovery, 3 write/record)
- Prior state: iterations 1-3 complete; P0=0 P1=0 P2=11; ratios 0.14 -> 0.36
- Dimension reconciliation: the strategy's `## 11. NEXT FOCUS` still named `traceability`, which iteration 3 completed. The dispatched dimension (`maintainability`) is the one remaining unchecked row in `## 3. REVIEW DIMENSIONS`, so it was followed and the strategy's focus block was corrected rather than trusted.

## Files Reviewed

Change-set level (diff hunks, all 25 files touched by the phase-002..006 implementation):

- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:35,3397-3408` (flag table entry and the refusal guard, read with its surrounding region)
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:470-482` (constant and assertion region)
- `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` (shared spawn helper rewrite, refusal case, opt-in case)
- `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/fanout.vitest.ts`, `tests/stress/cli-adapter/fixtures/adapter-fixture.ts`, `tests/unit/lineage-timestamp-window.vitest.ts` (single-flag additions)
- `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:2207,2416`
- `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:178`
- `.skilled/skills/system-spec-kit/ROUTER.md:37,39,46,57,187,206,246,284`
- `.skilled/skills/system-spec-kit/templates/core/plan.md.tmpl` and `runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap`
- `.skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-passes-its-own-gate.vitest.ts`, `runtime/tests/hooks/spec-gate-core.test.mjs`
- `.skilled/commands/deep/research.md`, `.skilled/commands/deep/review.md`, both presentation assets, both regenerated compiled contracts, `deep-ai-council.contract.markdown`
- `.skilled/commands/speckit/assets/speckit-{plan,implement,complete}.yaml`
- `.skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/fanout-dispatch.md`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The refusal guard re-hard-codes the loop-type set that a constant already owns, on a predicate that is provably true at that point** -- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3400` -- The new condition is `if ((loopType === 'research' || loopType === 'review') && allLineages.length === 1 && args.allowSingleLineage !== true)`. `assertActiveFanoutLoopType(loopType)` has already thrown for anything outside that pair at `:3306`, and the pair itself is owned by `ACTIVE_FANOUT_LOOP_TYPES` at `:475` and consumed by `assertActiveFanoutLoopType` at `:478-481`. The guard therefore adds the literals a fifth time while its own loop-type clause can never evaluate false, so the clause reads as load-bearing to a future reader when nothing rests on it. The identical shape at `:3408` is existing precedent in the same function, which is why this stays P2 rather than a correction.
   Finding class: naming and single-source-of-truth drift in a guard predicate
   Scope proof: both the constant (`:475`), the assertion that runs earlier (`:3306`), the new guard (`:3400-3402`) and the sibling guard (`:3408`) were read in place in one file; no cross-file claim is made.
   Affected surface hints: `resource:fanout-run.cjs` guard family; `consumer:/deep:research` and `/deep:review` refusal path; `reference:ACTIVE_FANOUT_LOOP_TYPES` as the documented pair
   Case: A maintainer adds a third active fan-out loop type to `ACTIVE_FANOUT_LOOP_TYPES` at `:475` — the one place the file treats as authoritative — and the new refusal silently does not cover it, because the guard compares against a hand-written pair instead of the constant.

2. **One authoring-card instruction is hand-duplicated across two scaffold branches, and a differently-worded third copy points at the same file** -- `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:2207` -- The same sentence is echoed twice in one script (`:2207` in the level flow, `:2416` in the phase-parent flow), differing only in leading indentation, while `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:178` carries a third, differently-worded instruction naming the same `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md`. Two copies in one shell script is the drift hazard; the tests already assert the card appears in both flows, so the cost is edit fan-out rather than a silent wrong path.
   Finding class: duplicated literal with a single upstream owner
   Scope proof: both `create.sh` occurrences were located by direct search of that file, and the `spec-gate-core.mjs` line is the added hunk from this change set; the ROUTER rows (`:37,39,46,57`) were checked as the path's other carriers.
   Affected surface hints: `resource:create.sh` scaffold output; `resource:spec-gate-core.mjs` Gate-3 notice; `test:scaffold-passes-its-own-gate.vitest.ts` (both flows assert the path)
   Case: The card file is renamed or relocated; a maintainer updates the Gate-3 notice and one of the two `create.sh` echoes, and the phase-parent scaffold keeps telling the model to read a path that no longer exists until a test run catches it.

## Traceability Checks

No new traceability direction was opened (that dimension closed in iteration 3). Carried status, unchanged by this iteration:

| Protocol | Level | Status | Note |
|---|---|---|---|
| `spec_code` | core | pass | Refusal requirement and its runner/test citations still resolve; this iteration re-read `fanout-run.cjs:3400-3402` and found it present. |
| `checklist_evidence` | core | partial | Unchanged: R3-P2-001 (004 summary body) and R3-P2-002 (006 CHK-012) remain open P2 advisories. |
| `skill_agent` | overlay | pass | Unchanged. |
| `agent_cross_runtime` | overlay | pass | Unchanged. |
| `feature_catalog_code` | overlay | partial | Unchanged: R3-P2-003 (no operator surface documents the refusal or its opt-in) remains open and is the maintainability-relevant gap; it was not re-raised as a new finding. |
| `playbook_capability` | overlay | pass | Unchanged; no `playbooks/` directory exists to drift. |

Each child's requirement was checked against the code that implements it in iterations 1-3 and was not re-litigated here. The two findings above are new maintainability surfaces, not restatements of a carried row.

## Integration Evidence

No new integration surface was reviewed this iteration, and none is claimed. The guard's consumers (`/deep:research`, `/deep:review`, `deep-research/feature-catalog/loop-lifecycle/fanout-dispatch.md`) were reviewed and named in iterations 1 and 3; this iteration read only their unchanged diff hunks. The authoring card's routing carriers (`system-spec-kit/ROUTER.md`) were confirmed as still naming the card, which is a carried traceability row, not new integration evidence.

## Confirmed-Clean Surfaces

- **Comment hygiene across every comment added by the change set.** Read as one set: the three-line guard comment at `fanout-run.cjs:3397-3399`, the three-line helper comment in `tests/unit/fanout-run.vitest.ts`, the `rawSpawnCjs` note in the refusal case, and the inline `rawSpawnCjs skips the shared helper` note. Every one states a durable reason; none embeds a spec path, a phase or packet number, or an `ADR-`/`REQ-`/`CHK-`/task id. The two instruction strings that do name a path (`create.sh:2207,2416`, `spec-gate-core.mjs:178`) are model-facing output, not code comments, and name a durable skill reference rather than an ephemeral artifact label.
- **Compiled contracts were regenerated, not hand-edited.** A generator exists at `.skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs`, so the two contract diffs sit downstream of the presentation assets by construction. Iteration 1's text-level parity check stands; the parity suite itself was still not executed (carried limit, not a new finding).
- **The template change is a self-consistent pair.** `.skilled/skills/system-spec-kit/templates/core/plan.md.tmpl` and its golden snapshot move together, so the scaffold-output contract is not left asserting the old example.

## Edge Cases

- **Dispatched dimension versus strategy Next Focus disagreed** (`maintainability` versus a stale `traceability`). Resolved toward the dispatch, because `## 3. REVIEW DIMENSIONS` showed `maintainability` as the only unchecked row and `## 4. COMPLETED DIMENSIONS` already listed `traceability`; the strategy focus block was corrected afterward.
- **Budget:** 13 tool calls against a target of 9 (hard cap 13). Two discovery calls were spent on a failed shell pattern and a generator lookup that produced no finding. No discovery was expanded after the ceiling was reached; the two findings were written from evidence already collected.
- **Severity calibration on finding 1:** the same predicate shape already exists at `fanout-run.cjs:3408` in shipped code. Following the repo's own idiom is not a defect, so the finding is recorded at P2 with an upgrade trigger — if a third loop type is ever added to `ACTIVE_FANOUT_LOOP_TYPES` without touching the guard, it becomes a correctness finding against the refusal requirement.
- **Contradictory-evidence check:** the duplicated `create.sh` sentence could be argued as intentional per-branch messaging. The two strings are byte-identical apart from indentation, so the duplication is mechanical rather than semantic, and the finding stands at P2 only because tests cover both flows.

## Ruled Out

- **Test-suite fidelity loss from the shared spawn helper.** `tests/unit/fanout-run.vitest.ts` now appends `--allow-single-lineage` in every launch that passes through the shared helper, which makes the suite's default entry point differ from the operator CLI. Ruled out as a defect: the behaviour is documented in the helper's own comment, the refusal case deliberately bypasses the helper via `rawSpawnCjs`, and the suite's cases drive one lineage on purpose. Upgrade trigger: a future case that needs the standard path to refuse will silently pass, and that case must use the raw path.
- **Tracked-artifact labels leaked into code comments.** Searched the added comment lines as a set; none carries a spec path, phase number or requirement id.
- **Manual compiled-contract maintenance.** A generator script exists and the presentation sources changed with the contracts.

## Next Focus

- Dimension: none remaining — D1-D4 all complete.
- Focus area: consolidation. Every dimension has produced findings; nothing is left to open.
- Reason: `maintainability` was the last unchecked dimension and it closed with two advisories, no blocker.
- Rotation status: D1 correctness, D2 security, D3 traceability, D4 maintainability complete (4/4).
- Blocked/productive carry-forward: 11 carried P2 advisories plus 2 new ones (13 active, no P0, no P1). The two deferred security leads (`expandLineages` label validation, the single-executor `configDir` path) remain unread and must be reopened before any claim stronger than PASS-with-advisories.
- Required evidence for a terminal iteration: none beyond carried rows; if the loop runs iteration 5 it should be a consolidation pass over R3-P2-003 and the 006 CHK-012 row rather than a new dimension.
- Recovery note: none; this iteration completed normally.

Review verdict: PASS
