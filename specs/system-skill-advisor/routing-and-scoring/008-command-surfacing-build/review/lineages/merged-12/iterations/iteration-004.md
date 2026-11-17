# Review Iteration 004 — merged-12

**Lineage:** `merged-12` (detached fan-out, review pass twelve, area `merged`)
**Artifact dir:** `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/merged-12`
**Session:** `fanout-merged-12-1794856957949-n58dw7`
**Diff under review:** `git -c core.fsmonitor=false diff 2f3f893c153 05475f9d044`; whole files at `05475f9d044`.
**Recovery mode:** iteration 3's stop pass returned `stuckRecovery` (`stuckThresholdReached`); this pass changes granularity to line-level reading and re-runs the severity escalation review of the open P2, per the workflow's recovery strategies.

## Dispatcher

- **Operator review focus (bound):** review pass twelve, area `merged`, per `review/review-brief-12.txt`. This iteration read the same obligations through the maintainability dimension: whether the narrowing rationale is legible where a future editor will look, whether a test title, comment or generated list claims more than it enforces, and whether the changed assertion's cost is safe to modify.
- **Dimension this iteration:** maintainability (recovery granularity).
- **Dimensions planned:** correctness, security, traceability, maintainability.
- **Steer file:** absent at iteration start.

## Files Reviewed

| File | Under |
|------|-------|
| `.skilled/skills/sk-doc/ROUTER.md` | maintainability |
| `.skilled/skills/sk-doc/SKILL.md` | maintainability |
| `.skilled/skills/sk-doc/graph-metadata.json` | maintainability |
| `.skilled/commands/doctor/scripts/tests/doctor-install-contract.test.cjs` | maintainability |

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None new. The recovery severity review of `MRG12-P2-001` keeps it at P2: the mismatch is currently latent (all three doctor artifacts agree), the guard is the only defect, and no input reaches a wrong operator action today. Escalation to P1 would require a shown live desync between `doctor-install.yaml:60` and `symlink-manifest.json:5-13`; none exists.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | Unchanged from iteration 3: REQ-005 passes both mechanical checks; REQ-006's workflow leg is unenforced by the test. The maintainability pass adds no new code-to-spec divergence. |
| `checklist_evidence` | partial | `039-main-sk-doc-routing-repair/tasks.md:65` still describes more than `doctor-install-contract.test.cjs:240` does; recorded, not re-filed. |

## Integration Evidence

- `.skilled/skills/sk-doc/ROUTER.md:127-134` — the three narrowing sentences state the reason next to the removal ("it pulled a request that was not a README into this skill", "their names carry git, hooks and gate", "'mirror' belongs to the runtime mirror doctor"), so a future editor can re-derive the boundary without the review history.
- `.skilled/skills/sk-doc/ROUTER.md:195-197` — the machine-readable block states the sync obligation and that every `RESOURCE_MAP` path resolves through `leaf-manifest.json`; both properties were re-verified in this run.
- `.skilled/commands/doctor/scripts/tests/doctor-install-contract.test.cjs:234-237` — the test's own name states the contract it means to enforce; the assertion at `:240` is the half that does not reach it. This is the open P2's maintainability face, not a second finding.

## Edge Cases

- **Recovery changes the read, not the scope.** The granularity change re-read the same four files at line level; it did not widen the target, and the review still treats the files as read-only.
- **Two intent lists are deliberately distinct.** `graph-metadata.json`'s 344 `intent_signals` and 326 `intent_signals_generated` are documented by the generator header as authored versus provenance; a reader who mistakes one for the other is warned by that header, so no code change is warranted.
- **Derived block timestamps.** `graph-metadata.json`'s derived block keeps `last_updated_at: 2026-09-26T00:00:00Z`; `regenerate-skill-derived.cjs:189-216` stamps that block only when the derived content changes, and the merge changed only `intent_signals`. The timestamp is therefore correct for its field, not stale metadata.

## Confirmed-Clean Surfaces

- **The narrowing rationale is durable.** Each of the three phrase removals carries its reason in the router prose, which is the file a maintainer edits.
- **The generated block is machine-owned.** Its provenance list and orphan rule are stated in `generate-router-intent-signals.cjs`'s header and enforced by `--check`; no hand-maintained duplicate needs updating.
- **The changed test is cheap to extend.** Deriving `named` from the link manifest means a future runtime addition fails the presentation assertion first, which is the intended tripwire.
- **The command rename is single-sourced.** `/create:sk-skill` appears in the router keyword, the SKILL.md mode table, and the live command file, with no stale `/create:skill` token left in the three merged files.

## Ruled Out

- **P2 escalation to P1.** Re-read `doctor-install-contract.test.cjs:239-240`, `doctor-install.yaml:46,60` and `symlink-manifest.json:5-13`: the three artifacts agree today, so the defect is guard coverage only.
- **A stale derived timestamp.** The stamp is block-scoped and the block did not change.
- **A second drift between the two intent lists.** The generator check reports no missing phrase and no orphan.

## Next Focus

- Dimension: none remaining; all four dimensions are covered.
- Focus area: stop decision. If convergence allows STOP, synthesize; otherwise continue with the gate named in `blockedBy`.
- Reason: coverage completion is the precondition the graph was blocking on.
- Required evidence: the stop decision's `blockedBy` and the coverage ratio.

Review verdict: PASS
