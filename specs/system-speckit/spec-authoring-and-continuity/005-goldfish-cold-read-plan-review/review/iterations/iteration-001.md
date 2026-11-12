# Deep Review Iteration 001

## Dispatcher

Resolved route: mode=review target_agent=deep-review, execution=single_review_iteration, state_source=externalized_files.
BINDING: target=specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review
BINDING: maxIterations=5
BINDING: convergence=0.1
BINDING: mode=review
BINDING: dimensions=correctness,security,traceability,maintainability
BINDING: specFolder=specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review

Session lineage: sessionId=2026-11-12T00:11:44.581Z, generation=1, lineageMode=new. Iteration number derived from the state log (zero prior `type:"iteration"` records, one `iteration_start` at `review/deep-review-state.jsonl:3`) and matches the dispatched value.

Budget profile: `verify` (11 analysis actions), spent on the operator's eight-surface change set. Tool calls ran slightly above the soft ceiling because the doctrine load and the three mandatory artifact writes each cost one; every analysis action stayed inside the declared review scope.

## Dimension

Correctness, including the operator review focus (children 002-006 judged against each child's spec.md and acceptance-criteria.md). Security, traceability and maintainability are carried to D2-D4.

## Files Reviewed

- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:30-40,105-128,666-681,3302-3420` (new guard, `parseArgs`, `assertKnownFlags`, `validateBaseArtifactDir`, expansion site)
- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:827,839,1162` (executor schema, `iterations` semantics, expansion)
- `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:97-115,2507-2578,3020-3055`
- `.skilled/skills/system-deep-loop/runtime/tests/unit/lineage-timestamp-window.vitest.ts:121-127`
- `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/fanout.vitest.ts:94-178`
- `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/fixtures/adapter-fixture.ts:198`
- `.skilled/commands/deep/assets/deep-research-presentation.txt:68-110`
- `.skilled/commands/deep/assets/deep-review-presentation.txt:85-138`
- `.skilled/commands/deep/research.md:105-129`
- `.skilled/commands/deep/review.md:88-103`
- `.skilled/commands/deep/assets/compiled/deep-research.contract.markdown:220,266`
- `.skilled/commands/deep/assets/compiled/deep-ai-council.contract.markdown:137-141`
- `.skilled/commands/speckit/assets/speckit-implement.yaml:387-393,555-560,677-681`
- `.skilled/commands/speckit/assets/speckit-complete.yaml:1044-1050`
- `.skilled/commands/speckit/assets/speckit-plan.yaml:653-657`
- `.skilled/skills/system-spec-kit/templates/core/plan.md.tmpl:124`
- `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:117-121`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:2204-2210,2412-2418`
- `.skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-passes-its-own-gate.vitest.ts:47-68`
- `.skilled/skills/system-spec-kit/runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap` (4 changed hunks)
- `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:170-180`
- `.skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-core.test.mjs:310-320`
- `.skilled/skills/system-spec-kit/ROUTER.md:36-40,160-165`
- `.skilled/skills/system-spec-kit/SKILL.md:88-95`
- `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/references/repin-runbook.md:148-156`
- `.skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/fanout-dispatch.md:49-60`
- child packet docs: `002/spec.md`, `002/acceptance-criteria.md`, `003/spec.md`, `003/acceptance-criteria.md`, `003/tasks.md`, `004/spec.md`, `004/acceptance-criteria.md`, `005/spec.md`, `005/acceptance-criteria.md`, `006/spec.md`, `006/acceptance-criteria.md`, `006/tasks.md`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **One-lineage `--executors` branch pins an ambiguous maxIterations binding** -- `.skilled/commands/deep/assets/deep-research-presentation.txt:109` -- The new consolidated-prompt branch says "write config.executor from that entry (kind, model, configDir, reasoningEffort, serviceTier, timeoutSeconds; its iterations value sets maxIterations)". `iterations` is a real per-lineage field on `config.executor` that defaults to null and defers to the packet `maxIterations` (`executor-config.ts:827,839`), so the sentence admits two bindings: the lineage override or the top-level packet ceiling. Neither command page nor presentation says which one the value lands in.
   Finding class: instruction ambiguity, single instance, same wording duplicated in five surfaces.
   Scope proof: all five carriers are inside the declared review scope (research.md, review.md, both presentation assets, both compiled contracts).
   Affected surface hints: `.skilled/commands/deep/assets/deep-review-presentation.txt:137`, `.skilled/commands/deep/assets/compiled/deep-research.contract.markdown:266`, `.skilled/commands/deep/assets/compiled/deep-review.contract.markdown`, `research.md:124-129`, `review.md:97-102`.
   Case: an operator runs `/deep:research --executors '[{"label":"solo","kind":"native","iterations":4}]' --max-iterations 10`; one binding writes `config.executor.iterations=4` and leaves the packet ceiling at 10, another writes `maxIterations=4` and leaves the lineage override null. The same invocation yields a 4-iteration or a 10-iteration run depending on the reading, and both readings match the sentence.

2. **`--executors` option row still describes the value as a whole fan-out matrix** -- `.skilled/commands/deep/research.md:122` -- The row reads "Escape hatch declaring the whole fan-out matrix in one value", while the policy paragraph four lines below now sends a one-entry matrix to `config.executor`. The same file contradicts itself for the one-entry case.
   Finding class: stale doc row against a changed rule, two files.
   Scope proof: both files are listed review-scope files and are the surfaces child 002 authorizes.
   Affected surface hints: `.skilled/commands/deep/review.md:94`, `.skilled/commands/deep/assets/deep-research-presentation.txt:68`.
   Case: a caller reads the table, passes a one-entry `--executors` plus `--concurrency 3`, and expects a fan-out lineage with capped concurrency; the policy instead writes `config.executor` and "leaves config.fanout unset", so `--concurrency` and fan-out stop-policy handling are silently dropped.

3. **The opt-in flag has no public documentation** -- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:35` -- `--allow-single-lineage` is registered in `FANOUT_FLAGS` and is required by every direct one-lineage fixture and by the runbook command, but it appears in none of the flag tables (`.skilled/commands/deep/research.md:110-122`, `.skilled/commands/deep/review.md:88-95`) and the refusal message is required to omit it.
   Finding class: undocumented escape hatch, deliberate but unstated.
   Scope proof: runner and both command pages are in the declared scope; the runbook is a listed scope file.
   Affected surface hints: `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/references/repin-runbook.md:153`, `.skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/fanout-dispatch.md:49-60`.
   Case: an operator whose direct runner call is refused is told to leave the runner for the single-executor workflow. If they must stay on the runner, their only in-repo discovery path is a bare flag inside one runbook command with no sentence explaining when to add it.

4. **The value form of the opt-in is refused and the message hides the opt-in** -- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3397-3405` -- `parseArgs` assigns the next non-`--` token as a flag value (`:113-118`), and the guard tests `args.allowSingleLineage !== true`, so any caller who writes the flag with a token after it gets a string and is refused.
   Finding class: fail-closed input-shape gap, single guard.
   Scope proof: the guard, its parser and the refusal message are the child 003 change.
   Affected surface hints: child 003 REQ-002 ("the runner accepts the registered option"), `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:2571`.
   Case: `node fanout-run.cjs ... --base-artifact-dir "$DIR" --allow-single-lineage 1` sets `allowSingleLineage='1'`, the guard refuses, and the error says to run `/deep:research` instead although the caller opted in. The refusal is correct for the shipped callers (every one of them puts the flag last), so the blast radius is invocation shapes nobody documented.

5. **The installed plan_clarity criteria contradicts the packet's own CHK-012** -- `.skilled/commands/speckit/assets/speckit-implement.yaml:390` -- Child 006's REQ-001 requires defining the `plan_clarity` check, and the row now carries a `criteria` string; CHK-012 says the `quality_gates` entry remains unchanged, and 006's acceptance document records the conflict twice and keeps the packet Draft (`006/acceptance-criteria.md:20,96`, `006/goal.md:17`).
   Finding class: recorded intra-packet contradiction, documentation only.
   Scope proof: the asset and the child packet docs are both inside the declared scope.
   Affected surface hints: `006/tasks.md` Verification Checklist (CHK-012), `.skilled/commands/speckit/assets/speckit-implement.yaml:558-560`.
   Case: a closeout run walks CHK-012 against the shipped asset, finds the `criteria` key that the row forbids, and cannot record a clean closeout. No runtime path executes CHK-012, so nothing fails beyond the packet's own closure, and the author already recorded it as the Draft reason.

6. **An eighth generated contract moved with no owning phase** -- `.skilled/commands/deep/assets/compiled/deep-ai-council.contract.markdown:140` -- The only change is the pinned `sha256` for `.skilled/agents/ai-council.md` (`b3082079…` to `c8f2ffb2…`). The pin is now correct: the shipped agent file and HEAD both hash to `c8f2ffb2…`, so this is real drift repair. But no child lists the file in a Files to Change table, and child 002's scope is the research and review contracts only.
   Finding class: correct fix outside the frozen scope, mechanical regenerator side effect.
   Scope proof: the file is a listed review-scope file; the scope tables in `002/spec.md:3`.
   Affected surface hints: `.skilled/commands/deep/assets/compiled/README.markdown`, `compile-command-contracts.cjs`.
   Case: a reviewer reconciling the working tree against the frozen Files to Change tables finds an artifact with no owning phase and must either widen child 002's table or record the refresh separately.

## Traceability Checks

| Protocol | Level | Result |
|----------|-------|--------|
| `spec_code` | core | partial. Child 003 verified end to end: every asserted behavior exists in the runner and every cited test line lands on the asserted expression. Children 002, 004, 005 and 006 checked as diff-against-REQ only; the contract-parity check was not executed, so the regeneration claim is compared as text, not proven. |
| `checklist_evidence` | core | partial. 002 and 003 are fully Met and closeable. 004 AC-002 is `Unmet` (exit status not captured) and 005 AC-001 is `Unmet` (pre-edit carrier check incomplete); both packets stay Draft and say so. 006 has all five rows Met and stays Draft on CHK-012. |
| `skill_agent` | overlay | deferred to D3. |
| `agent_cross_runtime` | overlay | deferred to D3. |
| `feature_catalog_code` | overlay | deferred to D3 (`fanout-dispatch.md` policy line was read and matches). |
| `playbook_capability` | overlay | deferred to D3 (manual-testing playbook references were not opened). |

Status-drift lead for D3: the parent `005-.../spec.md` Phase Documentation Map still lists phases 002-006 as Pending while 003 reads Complete and 002 reads Complete.

## Integration Evidence

- Runner guard to its callers: searched every non-test reference to `fanout-run.cjs` under `.skilled`. All hits are docs, changelogs, feature catalogs and the four deep auto/confirm YAML workflows; none of them launches a one-lineage research/review config without the opt-in, so no shipped caller is broken by the refusal.
- Guard placement to side effects: the guard sits after `expandLineages` and `applyFlatPoolAssignmentGuard`, both pure transforms, and before capability preflight, lineage directory creation, ledger writes and spawn. `validateBaseArtifactDir` only resolves and compares paths. The refusal test asserts marker, `lineages/`, status log and summary are all absent.
- `create.sh:2207,2416` output to `scaffold-passes-its-own-gate.vitest.ts:50,67` assertions to the regenerated snapshot: all three move together.
- `spec-gate-core.mjs:178` notice line to `spec-gate-core.test.mjs:317` byte-identical baseline: updated in the same change set.
- `plan.md.tmpl:124` to the four snapshot hunks to `spec-authoring-card.md:120`: same sentence, same file names.
- Speckit YAML assets: no schema or loader validates `.skilled/commands/speckit/assets/*.yaml` (the folder holds prose workflow assets only), and the added `criteria`/`on_fail` keys have in-file precedent at `speckit-implement.yaml:393,403,513,560`, so no consumer breaks.

## Edge Cases

- Children 004, 005 and 006 remain Draft with Unmet or unresolved rows. That is disclosed in each acceptance document, so it is recorded here as context, not as a finding.
- The compiled-contract parity test was not executed; a `PASS` here does not claim the regeneration is byte-reproducible, only that the changed text matches its source policy sentence.
- The per-iteration budget was exceeded by the mandatory doctrine load and the three required artifact writes; analysis actions stayed within the declared scope and file set.
- The review target content was treated as data. No directive-like text was found in the changed files.

## Confirmed-Clean Surfaces

- Child 003 AC evidence lines are exact: `fanout-run.vitest.ts:2536` is the exit-code assertion, `:2537` the workflow-guidance assertion, `:2540` the spawn-marker absence, `:2543` the summary absence, `:2572` the marker creation and `:2573` the no-refusal assertion.
- `--allow-single-lineage` is a registered known flag, so `assertKnownFlags` accepts it and no unknown-flag path rejects it.
- The guard is loop-scoped exactly as specified: research and review only, and it fires on `length === 1` only, so empty input and two-or-more matrices keep their prior behavior.
- `config.executor` accepts an `iterations` field (`executor-config.ts:827`), so the new write instruction names a real schema key.
- The ai-council contract pin now matches the shipped agent file, closing prior drift.
- The `.skilled/acceptance-criteria` rows in 003 name evidence that resolves, including the final full-suite evidence pointer.

## Ruled Out

- Hidden shipped one-lineage caller broken by the refusal: searched, none found.
- Hand-edited compiled contracts: both contract diffs carry the same policy sentence as their presentation sources, and the prompt-block branch appears on the contract line child 002 predicted.
- Guard ordering hazard: no filesystem or ledger write occurs before the guard; `validateBaseArtifactDir` and `applyFlatPoolAssignmentGuard` are pure.
- Speckit YAML schema breakage from the new `criteria` key: no validator exists over that asset folder; sibling `on_fail` keys are precedent.
- `iterations` being an invalid `config.executor` key: it is a declared nullable field, so only the binding target is ambiguous, not the key.
- Refusal-message leakage: the message names the workflow and omits both the opt-in and any count, as REQ-001 requires, and the test asserts both omissions.

## SCOPE VIOLATIONS

None. No reviewed file was modified; the only writes are this narrative, the delta file, the strategy update and the gateway-written state log.

## Next Focus

- Dimension: traceability (D3).
- Focus area: parent Phase Documentation Map drift against child status, the 004/005 `Unmet` rows versus each implementation-summary, and the four overlay protocols (`skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`) across the changed skill and command surfaces.
- Reason: correctness is covered and produced advisories only; the strongest remaining lead is status and cross-reference integrity, which the strategy already flags as a status-drift risk.
- Rotation status: D1 complete, D2-D4 remaining.
- Blocked/productive carry-forward: nothing blocked; the P2 set is carried forward as advisories.
- Required evidence: parent `spec.md` phase map lines, each child `implementation-summary.md`, and the overlay protocol targets named in the strategy.
- Recovery note: none; iteration 1 completed normally.

Review verdict: PASS
