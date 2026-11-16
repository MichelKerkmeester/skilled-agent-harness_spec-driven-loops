# Review Iteration 005 — fixes-11

**Lineage:** `fixes-11` (detached fan-out, review pass eleven)
**Artifact dir:** `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/fixes-11`
**Session:** `fanout-fixes-11-1794851543294-mlt3r6`

## Dispatcher

- **Operator review focus (bound):** review pass eleven, area `fixes`, per `review/review-brief-11.txt`. This iteration is the closure pass for the focus: it re-checked every active finding against the current bytes of the reviewed files, confirmed the five scope paths each carry more than one dimension, and reconciled the packet evidence (REQ-006, AC-006, T010/T011) with what the code and tests actually do.
- **Dimension this iteration:** traceability (cross-reference closure).
- **Dimensions planned:** all four reviewed; this pass re-checks coverage.
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

None new; `FIX11-P1-001` and `FIX11-P1-002` remain active.

### P2 Findings

None new.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | Re-read `spec.md:134` (REQ-006) against `command-attach.ts:427` and `:259`: the quoted single-command shape is implemented; the quoted or-list shape (`FIX11-P1-001`) and the retired-name guard (`FIX11-P1-002`) are not. The doctor half still holds at `presentation:78`, `yaml:58` and the manifest. |
| `checklist_evidence` | partial | Re-read `acceptance-criteria.md:59` (AC-006, `Met`) and `tasks.md:60-61` (T010/T011): the stated evidence is present and reproducible; the AC's given remains narrower than REQ-006, and the contract test's runtime assertion still reads the presentation only. |

## Active Finding Recheck

| Finding | Severity | Recheck at current bytes | Still active |
|---------|----------|--------------------------|--------------|
| `FIX11-P1-001` | P1 | `command-attach.ts:427` still strips only the opening quote; `command-attach.ts:385` and `:438-442` still cannot bridge the closing quote; the compiled module still returns `false` for `do not run '/create:agent' or '/create:readme'` and `attachCommand` still returns `/create:readme`. | Yes |
| `FIX11-P1-002` | P1 | `command-attach.ts:243` still maps `/create:skill` → `/create:sk-skill` before the guard at `:259`; `typedCommandForTop` still returns the successor for a refusal of the old name, and `attachCommand` still returns it for a single-target route. | Yes |
| `FIX11-P2-001` | P2 | `doctor-install-contract.test.cjs:238-244` still asserts only `PRESENTATION` against the manifest; no assertion reads `WORKFLOW` for a runtime name. | Yes |
| `FIX11-P2-002` | P2 | `acceptance-criteria.md:59` still names only the single-command prompt. | Yes |
| `FIX11-P2-003` | P2 | `command-attach.ts:413` still claims quote marks around a name are dropped; `:417-418` still splits mid-sentence. | Yes |
| `FIX11-P2-004` | P2 | `presentation:78` still fuses the accepted list with "the ones already there". | Yes |
| `FIX11-P2-005` | P2 | `doctor-install-contract.test.cjs:239` is still a strict subset of `:240`. | Yes |

No finding was resolved or downgraded this iteration; no code changed under review (`git status` shows only the lineage directory and the shared observability log modified).

## Integration Evidence

- **Coverage:** all five scope files carry correctness, traceability, security and maintainability reads (iterations 1-4), so no scope file is single-dimension.
- **Packet → code:** REQ-006's two halves map to `command-attach.ts:427` (quote fold) and the four doctor surfaces (`presentation:78`, `yaml:58`, `symlink-manifest.json`, `symlink-engine.cjs:435-438`).
- **Code → test:** the quote fold's tests cover four single-command mention shapes and two request shapes (`command-attach-guards.vitest.ts:172-190`); no test covers the or-list shape or the retired alias. The doctor contract test covers the presentation sentence (`test:243`) but not the workflow list.
- **Holdout hygiene:** no prompt corpus file was opened; the holdout gate was read by count only, per the brief's rule.

## Edge Cases

- **Registry vs narrative.** The registry lists all seven active findings and computes two P1 and five P2; the narrative counts match the delta rows. No discrepancy was found.
- **Closure depends on fixes, not further review.** Every active finding has a named file:line and a concrete input; none is blocked on missing evidence, so the next step is remediation, not another dimension.
- **Doctor membership is clean.** The only remaining doctor findings are the test-coverage and wording ones; the runtime set itself agrees across every surface.

## Confirmed-Clean Surfaces

- The five scope files are all present at the reviewed commit and unchanged during the review.
- The review packet's active findings all have file:line evidence; no finding relies only on inference.
- No stale compiled advisor build: `runtime/dist/runtime/lib/command-attach.js` carries the same fold and the same mapping order as the source.
- No holdout text was read or printed; no prompt corpus file was opened.

## Ruled Out

- **A missing dimension or scope file** — all four dimensions and all five scope paths are covered; the only gap is remediation of the active findings.
- **A registry/narrative mismatch** — counts and ids agree across registry, iterations and deltas.
- **A stale review artifact** — every active finding was re-read at the current bytes and still holds.

## Next Focus

- **Dimension:** closure verification (no new dimension).
- **Focus area:** confirm the stop decision against the registry and prepare the lineage for synthesis; do not open a new review direction.
- **Reason:** every dimension is covered and every active finding is verified; further review would repeat evidence rather than add signal.
- **Rotation status:** complete for all four dimensions.
- **Blocked/productive carry-forward:** none blocked; the productive approaches are recorded in the strategy.
- **Required evidence:** the stop decision from `convergence.cjs` and the registry counts.

**Stop decision after iteration 4:** CONTINUE; `stopReason` none; `blockedBy` empty; no dimension is missing, but the rolling signal was still above the convergence threshold.

Review verdict: CONDITIONAL
