# Review Iteration 005

## Dispatcher

- Target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build`
- Target type: spec-folder (fan-out lineage `scorer-attach`)
- Artifact directory: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/scorer-attach`
- Session: `fanout-scorer-attach-1794550137809-1ecgc7`, generation 1, lineage mode `new`
- Dimension: stabilization / adversarial recheck (all four dimensions covered)
- Budget profile: adjudicate (8-10 calls)
- Prior findings: P0=0 P1=0 P2=7 (all carried forward)

## Files Reviewed

- Every line cited by an active finding, reread in place:
  `command-attach.ts:266-274`, `command-attach.ts:353-388`, `command-attach.ts:123-124`,
  `advisor-recommend.ts:476-479`, `fusion.ts:749-752`, `README.md:176`, `ARCHITECTURE.md:142`
- Lineage directory inventory (`find`, maxdepth 2) for the scope audit

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None. The seven active findings below were revalidated, not re-raised.

## Revalidation of Active Findings

| Id | Severity | Cited line still holds | Verdict |
|---|---|---|---|
| R1-P2-001 | P2 | `command-attach.ts:385` still gates on `lowered.includes('/deep:')` for every deep-loop mode | confirmed |
| R1-P2-002 | P2 | `command-attach.ts:266-269` still treats `.` as an end boundary, so `/create:skill.md` matches | confirmed |
| R2-P2-001 | P2 | `command-attach.ts:353-388` still has no `NO_EDIT_REQUEST` guard while `fusion.ts:677,887` does | confirmed |
| R3-P2-001 | P2 | `README.md:176` still says 45; artifact still reports `typescriptActive: 46` | confirmed |
| R3-P2-002 | P2 | `ARCHITECTURE.md:142` still omits `dsh` from the adapter sentence | confirmed |
| R4-P2-001 | P2 | `command-attach.ts:123` still declares the block; `advisor-recommend.ts:478` still reads `TRACKED_COMMANDS` | confirmed |
| R4-P2-002 | P2 | `fusion.ts:750-751` is still an empty conditional | confirmed |

No severity was raised or lowered in this pass. In particular, R2-P2-001 was tested against the
P1 promotion trigger and stays P2: the trigger needs the compiled route to return the create-skill
mode for a no-edit prompt, and the route was not executed, so the reach remains unproven. Inflating it
would trade a supportable advisory for an unsupported blocker.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|---|---|---|---|
| `spec_code` | core | partial | Four P2 deviations across the generated tables and their docs remain active. |
| `checklist_evidence` | core | partial | No packet checklist claim is contradicted; no claim covers the generated blocks. |
| `skill_agent` | overlay | pass | 36/36 doctor owners match their router tags (iteration 3). |
| `agent_cross_runtime` | overlay | partial | Seven runtime labels; prose omits `dsh` (R3-P2-002). |
| `feature_catalog_code` | overlay | partial | Cosine/margin claims hold; the row count does not (R3-P2-001). |
| `playbook_capability` | overlay | notApplicable | No playbook path in this surface. |

## Integration Evidence

- The five `MODE_COMMANDS`-related checks, the policy-table invariant, the owner-tag comparison and
  the holdout boundary were each executed once and are recorded in iterations 1-4; nothing was
  re-executed here because no file changed between iterations.
- Convergence: weighted new findings 0 against 7 accumulated P2 (weight 7), so
  `newFindingsRatio = 0.00`, below the 0.10 threshold. The cap (5) and the convergence rule meet at
  this iteration.

## Operator Focus Coverage

- Six runtimes: coverage confirmed for the label set and the doc omission; the runtime-specific
  renderer/router remains outside this lineage and is not asserted clean.
- Mutating-command safety: no `run` policy carries a writing class; one P2 gap on the hub-attach
  no-edit gate remains.
- Holdout hygiene: this lineage's surface reads and prints no holdout rows; the tune/fix/report
  implementations are another lineage's scope and are not claimed clean here.
- Docs vs code: three doc-code drifts remain active (two row-count sentences and the runtime list).

## Edge Cases

- The compiled-route front door stays unexecuted by design (write-safe scope), so two findings state a
  reach condition rather than a proven end-to-end path. Recorded, not hidden.
- The scope audit found only the lineage's own artifacts: config, state projection, strategy,
  dashboard, registry, `iterations/iteration-001..005`, `deltas/iter-001..005`, and the executor's
  event files under `.executor-state/`. No review target, config, registry or reducer output was
  hand-edited; the registry and dashboard are reducer output.

## Deferred Items

- `tune` / `fix` / report holdout-path review: `accuracy-runner` lineage's scope.
- Compiled-route mode selection for no-edit prompts: needs a write-safe probe outside this lineage.
- The `render-hooks-plugin` catalog page that names `COMMAND_POLICIES` as the policy source: named as
  context in R4-P2-001, filed against that lineage's file list, not this one.

## Confirmed-Clean Surfaces

- No active P0 or P1.
- Every generated table that a surface reads agrees with its authored source (mode registries, doctor
  routes, command metadata, runtime labels).
- No mutating command is offered with `run`.

## Ruled Out

- All prior ruled-out directions stand; no new dead end was entered in this pass.
- "A P2 should be promoted so the report reads stronger": rejected on evidence — no new failing input
  was found, and the reach conditions are unchanged.

## Next Focus

- Dimension: none remaining
- Focus area: synthesis
- Reason: convergence reached at the iteration cap with no P0 or P1 active
- Rotation status: complete
- Blocked/productive carry-forward: no blocked approaches; correctness and safety were the productive
  dimensions
- Required evidence: the findings registry, the seven iteration records, and the report

Review verdict: PASS
