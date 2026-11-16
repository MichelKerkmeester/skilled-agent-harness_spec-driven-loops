# Review Iteration 007 — fixes-11

**Lineage:** `fixes-11` (detached fan-out, review pass eleven)
**Artifact dir:** `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/fixes-11`
**Session:** `fanout-fixes-11-1794851543294-mlt3r6`

## Dispatcher

- **Operator review focus (bound):** review pass eleven, area `fixes`, per `review/review-brief-11.txt`. This iteration is the stuck-recovery pass the stop decision ordered: it replayed the core traceability protocols at line granularity and re-examined every P2 for a possible P1 upgrade, staying inside the focus's five paths.
- **Dimension this iteration:** traceability (recovery replay).
- **Recovery directive:** `STUCK_RECOVERY` (`stuckThresholdReached`) with the strategy "Escalate severity review: re-examine P2 findings for potential P1 upgrades", plus a core-protocol replay.
- **Dimensions planned:** all four covered; this pass tests the findings, not a new direction.
- **Steer file:** absent at iteration start.

## Files Reviewed

| File | Under |
|------|-------|
| `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` | traceability |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts` | traceability |
| `.skilled/commands/doctor/assets/doctor-install-presentation.txt` | traceability |
| `.skilled/commands/doctor/assets/doctor-install.yaml` | traceability |
| `.skilled/commands/doctor/scripts/tests/doctor-install-contract.test.cjs` | traceability |

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. No P2 was upgraded; the upgrade review is recorded below.

### P2 Findings

None new.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | Line-level replay against `spec.md:134`: the quote half is met only for the single-command shape (`command-attach.ts:427` and tests at `command-attach-guards.vitest.ts:178-181`); the retired-name half is not addressed by the requirement and remains a separate guard defect (`FIX11-P1-002`). The doctor half holds at `presentation:78`, `yaml:58`, the manifest and `symlink-engine.cjs:435-438`. |
| `checklist_evidence` | partial | `acceptance-criteria.md:59` (`Met`) and `tasks.md:60-61` remain reproducible; the AC instance is still narrower than the requirement, and the contract test still checks the presentation only. |

## P2 Upgrade Review (recovery directive)

| Finding | Upgrade test | Result |
|---------|--------------|--------|
| `FIX11-P2-001` — contract test no longer checks the workflow | A P1 needs degraded behavior or missing validation of input in reach. The workflow text is correct today; the gap is a future-drift guard, and no prompt reaches a wrong runtime set through it. | Stays P2. |
| `FIX11-P2-002` — AC-006 narrower than REQ-006 | The missing evidence is bookkeeping, not behavior; the behavioral defect is already `FIX11-P1-001`. | Stays P2. |
| `FIX11-P2-003` — fold comment overstates the rule | Comment accuracy only; no runtime effect. | Stays P2. |
| `FIX11-P2-004` — accepted-answer sentence ambiguity | User-facing wording; the accepted set is stated and the engine enforces it. | Stays P2. |
| `FIX11-P2-005` — subsumed assertion | No coverage effect; the next line carries the same signal. | Stays P2. |

## Integration Evidence

- **Recovery replay:** the two core protocols were re-read at line granularity (`spec.md:134` → `command-attach.ts:427` → `command-attach-guards.vitest.ts:178-181`; `acceptance-criteria.md:59` → `tasks.md:60-61` → `doctor-install-contract.test.cjs:243`).
- **Doctor chain unchanged:** `presentation:78` ↔ `yaml:58` ↔ `symlink-manifest.json` ↔ `symlink-engine.cjs:435-438` still agree on the eight runtimes.
- **No new surface:** the recovery pass added no file outside the five scope paths and read no prompt corpus.

## Edge Cases

- **Stuck signal vs real saturation.** The loop reports no progress because two consecutive passes added no findings; that is saturation of the declared scope, not a missing direction. The recovery directive's alternatives (change granularity, replay protocols, escalate P2s) were all applied or considered; none opened a new defect.
- **Severity inflation risk.** Upgrading a P2 to reset the stuck counter would be fabricating signal; the table above records the upgrade test and the result instead.
- **Remaining loop budget.** Two iterations of the eight remain; the next pass is the max-iteration stop, not another review direction.

## Confirmed-Clean Surfaces

- Line-level replay of the quote fold found no third defect beyond `FIX11-P1-001` and `FIX11-P1-002`.
- The doctor runtime set, the accepted-answer table and the printed checklist still agree with the manifest and the engine.
- No reviewed file changed during the recovery pass.

## Ruled Out

- **P2 → P1 upgrades under the recovery directive** — each was tested against the P1 definition and none met it; the table records the rationale.
- **A new defect at line granularity** — the fold, the lead grammar, the or-list grammar, the retired-name mapping and the doctor assertions were re-read at line level; no new defect surfaced.
- **A missing core protocol** — both core protocols have recorded results in this run (`spec_code`, `checklist_evidence`), both `partial` with file:line evidence.

## Next Focus

- **Dimension:** none; the loop is one pass from its iteration cap.
- **Focus area:** the max-iteration stop and synthesis.
- **Reason:** the recovery directive found no new direction and no upgrade; the remaining budget is one pass, which the stop arithmetic will consume.
- **Rotation status:** complete.
- **Blocked/productive carry-forward:** no approach is blocked; the scope is saturated.
- **Required evidence:** the stop decision from `convergence.cjs` and the registry counts.

**Stop decision after iteration 6:** STUCK_RECOVERY; `stopReason` stuckRecovery; `blockedBy` empty; the recovery directive was applied in this pass.

Review verdict: CONDITIONAL
