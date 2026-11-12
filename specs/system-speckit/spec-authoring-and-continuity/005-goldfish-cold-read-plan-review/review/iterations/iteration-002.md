# Deep Review Iteration 002

## Dispatcher

Resolved route: mode=review target_agent=deep-review, execution=single_review_iteration, state_source=externalized_files.
BINDING: target=specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review
BINDING: maxIterations=5
BINDING: convergence=0.1
BINDING: mode=review
BINDING: dimensions=correctness,security,traceability,maintainability
BINDING: specFolder=specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review

Session lineage: sessionId=2026-11-12T00:11:44.581Z, parentSessionId=null, generation=1, lineageMode=new, run=run-001.
Iteration number derived from the state log (one prior `type:"iteration"` record) and matches the dispatched value.

Budget profile: `verify` (declared for evidence rereads and borderline severity), spent almost entirely on security surface reads. **Disclosed overrun:** 13 analysis calls, which is the hard ceiling, and the three mandatory artifact writes fall beyond it. No analysis call was spent outside the declared review scope, and the narrative below names the two leads that the ceiling left unverified rather than converting them into findings.

## Dimension

Security, per the dispatched iteration dimension, plus the operator review focus (the uncommitted implementation of children 002-006). The strategy's own Next Focus pointed at traceability; the dispatch overrode it, so this iteration covers security and restores the strategy's Next Focus to traceability. That disagreement is recorded under Edge Cases.

## Files Reviewed

- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:26-36,105-123,475-482,666-694,3304-3306,3357,3394-3410` (flag table, `parseArgs`, active-loop-type allowlist, artifact-dir and `configDir` validators, the new refusal, `lineagesDir`)
- `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:97-115,2507-2578` (opt-in helper, refusal case, opted-in case)
- `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:2207,2416` (new next-step echoes)
- `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:175-181` (Gate-3 mutation notice)
- `.skilled/commands/speckit/assets/speckit-implement.yaml:390,558-560,679`, `.skilled/commands/speckit/assets/speckit-complete.yaml:1047`, `.skilled/commands/speckit/assets/speckit-plan.yaml:656`
- `.skilled/commands/deep/research.md:125-129`, `.skilled/commands/deep/review.md:97-101`, `.skilled/commands/deep/assets/deep-review-presentation.txt:88,137-138`
- `.skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/fanout-dispatch.md:52-54`
- `.skilled/skills/system-spec-kit/ROUTER.md:39,163`, `.skilled/skills/system-spec-kit/SKILL.md:94`, `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:120`, `.skilled/skills/system-spec-kit/templates/core/plan.md.tmpl:124`

## Findings - New

### P0 Findings

None. The change set adds no trust boundary, no new spawn, no new path construction and no secret handling, so no exploitable path exists to rate a blocker.

### P1 Findings

None.

### P2 Findings

1. **The refusal gate hardcodes a two-value loop-type pair instead of the file's own allowlist** -- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3400` -- The guard tests `loopType === 'research' || loopType === 'review'` while the authoritative membership test in the same file is `ACTIVE_FANOUT_LOOP_TYPES` (`:475`), enforced by `assertActiveFanoutLoopType` (`:478-482`). The two agree exactly today, because `assertActiveFanoutLoopType` runs at `:3306` two lines after `loopType` is read, so no current input reaches the guard with a third value and there is no live bypass. The failure mode is a fail-open on change: widening the allowlist set makes the new type an active fan-out loop type that the refusal cannot see, because the guard never reads the set. The same pair is already duplicated at `:1114` and `:3409`, so this is the third copy rather than an isolated slip.
   Finding class: latent fail-open on a duplicated allowlist, three occurrences.
   Scope proof: `fanout-run.cjs` is a declared review-scope file and the guard is part of the child 003 change.
   Affected surface hints: `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:475`, `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1114`, `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3409`.
   Case: a maintainer enables a third loop type by adding it to `ACTIVE_FANOUT_LOOP_TYPES` at `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:475`; an executor matrix that expands to one lineage for that type now spawns a single CLI process that runs every iteration in-process, with no refusal, because the guard's literal pair never matches the new value.
   Residual risk: none at this revision; the finding is hardening, which is why it stays below P1 even though the consequence on the changed path is unbounded.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | partial | Carried from iteration 1: child 003 verified end to end; the security lens added no new REQ to check. |
| `checklist_evidence` | core | partial | Carried: 004 AC-002 and 005 AC-001 remain `Unmet`; 006 carries CHK-012 open. No security-relevant row changed. |
| `skill_agent` | overlay | pending | Not reached; deferred to D3 as the strategy records. |
| `agent_cross_runtime` | overlay | pending | Not reached; deferred to D3. |
| `feature_catalog_code` | overlay | partial | `fanout-dispatch.md:52-54` restates the one-lineage policy in the same terms as the command pages; no policy divergence introduced by the security lens. |
| `playbook_capability` | overlay | pending | Not reached; deferred to D3. |

## Integration Evidence

- `.skilled/commands/deep/research.md:125-129` and `.skilled/commands/deep/review.md:97-101` carry the same new one-lineage sentence as `.skilled/commands/deep/assets/deep-review-presentation.txt:88` and `:137-138`, so the runner refusal and all four documentation carriers agree on which matrix size takes which config key.
- `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:97-115` opts every helper-driven launch into the new flag, and `:2510-2578` drives the refusal through `rawSpawnCjs` so the opt-in cannot mask it. The pair of cases is what makes the guard observable rather than merely asserted.

## Edge Cases

- **Dimension disagreement.** The dispatched dimension is security; the strategy's Next Focus named traceability. I ran security and restored the strategy's Next Focus to traceability, so no direction is lost. Recorded rather than silently reconciled.
- **Two unverified security leads, deliberately not promoted to findings.** (a) `lineageDir` is built as `path.join(lineagesDir, lineage.label)` at `:3573` from a caller-supplied label, and `validateNamespaceValue` is applied in this file only to `specFolder` (`:3304`) and `configDir` (`:686`); whether `expandLineages` validates labels before this join was not reached inside the tool budget, so a label-carried path escape stays unproven rather than reported. (b) The one-entry `--executors` branch now sends a caller-supplied `configDir` through `config.executor`; whether that single-executor path re-applies the `.claude*` root restriction enforced at `:686-694` was not verified. Both are recorded as deferred in the search ledger with the next evidence step.
- **Nothing in the change set raises call-graph asymmetry concerns.** The refusal throws before `validateBaseArtifactDir`, which is the correct direction: the refusal is the cheaper check and it fires before any path resolution.
- **New text injected into model context is static repo-controlled content**, not caller input: `create.sh:2207,2416`, `spec-gate-core.mjs:178`, the three YAML strings and the two presentation lines contain no interpolation of reviewer or caller data. No prompt-injection surface is introduced.
- **The reviewed content was treated as data.** No directive-like text was found in the changed files or in the child packet documents read for this iteration.
- **Budget overrun disclosed** rather than hidden: 13 analysis calls is the hard ceiling and the artifact writes sit beyond it.

## Confirmed-Clean Surfaces

- The opt-in is fail-closed against value coercion. `parseArgs` sets `args[key] = true` only when the following token is absent or starts with `--` and otherwise stores the raw string (`:113-119`), and the guard compares with `!== true` (`:3402`). Any explicit value, including the string `true`, leaves the refusal firing. No input can enable a one-lineage run by accident; the cost of that choice is the usability finding already carried as `R1-P2-004`.
- The refusal precedes every side effect, including on the security lens: `:3394-3408` runs before `validateBaseArtifactDir`, the `lineages` directory creation, the status ledger and the spawn. The child 003 test asserts the marker, `lineages/`, `orchestration-status.log` and `orchestration-summary.json` are all absent (`fanout-run.vitest.ts:2573-2578`), which is the observable form of that ordering.
- `loopType` cannot be smuggled past the guard: `ensureString` plus `assertActiveFanoutLoopType` at `:3305-3306` admit exactly `research` and `review`, so case variants and unknown types fail before the guard is reached.
- The three speckit YAML edits add only prose values. `criteria` sits in a flow mapping with a quoted, colon-free string (`speckit-implement.yaml:390`), `on_fail` has sibling precedent, and the `test_failure` outcome is a plain mapping value (`:679`), so no loader or schema interpretation changes.
- `create.sh:2207` and `:2416` and `spec-gate-core.mjs:178` add fixed strings with no variable expansion, so no shell-escaping or notice-forging risk is introduced.

## Ruled Out

- Guard bypass by loop-type variation: impossible today; `ACTIVE_FANOUT_LOOP_TYPES` is exactly `{research, review}` at `:475` and is enforced at `:3306` before the guard.
- Opt-in enabling by value coercion: `!== true` plus the string-or-flag parser makes every non-bare form refuse.
- Prompt-injection surface from the new model-facing text: every added line is static repo text with no caller-data interpolation.
- New spawn, path or secret handling in the change set: the diff adds one refusal branch, one flag-table entry and prose. No new `spawn`, no new `path.join` on caller input, no credential read.
- Speckit YAML schema breakage and guard ordering were ruled out in iteration 1 and were not re-entered beyond the confirmation needed for the two clean surfaces above.

## SCOPE VIOLATIONS

None. No reviewed file was modified. Writes are limited to this narrative, `review/deltas/iter-002.jsonl`, `review/deep-review-strategy.md` and the gateway-written state log.

## Next Focus

- Dimension: traceability (D3).
- Focus area: parent Phase Documentation Map drift against child status, the 004/005 `Unmet` rows versus each implementation-summary, and the four overlay protocols (`skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`) across the changed skill and command surfaces.
- Reason: security produced one hardening advisory and two deferred leads; the strongest remaining lead stays status and cross-reference integrity, which the strategy already flags.
- Rotation status: D1 and D2 complete, D3-D4 remaining.
- Blocked/productive carry-forward: 7 active P2 advisories carried; the two deferred security leads must be re-opened with a `expandLineages` read and a single-executor `configDir` read before any security verdict above PASS can be claimed.
- Required evidence: `expandLineages` label validation, the single-executor `configDir` validation path, parent `spec.md` phase map lines, each child `implementation-summary.md`, and the overlay protocol targets.
- Recovery note: none; this iteration completed normally.

Review verdict: PASS
