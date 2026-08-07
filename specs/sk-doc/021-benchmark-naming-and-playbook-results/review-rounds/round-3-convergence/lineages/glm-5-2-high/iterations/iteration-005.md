# Iteration 5: Adversarial replay — active P1 findings, completion claims, and missed-P0 search

## Dispatcher

- Budget profile: verify.
- Resolved route: mode=review target_agent=deep-review.

## Files Reviewed

- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:94-143,388-402,539-578` (re-read)
- `.opencode/skills/sk-doc/create-benchmark/SKILL.md:300-325,455-502` (re-read)
- `.opencode/skills/sk-doc/create-manual-testing-playbook/SKILL.md:235-283` (re-read)
- `.opencode/skills/sk-doc/create-benchmark/scripts/render-serving-snapshot.cjs:31-134,145-170` (re-read)
- `.opencode/skills/sk-doc/create-benchmark/scripts/archive-compiled-routing.cjs:49,146-169` (re-read)
- `.opencode/specs/sk-doc/021-benchmark-naming-and-playbook-results/tasks.md:35-73`
- `.opencode/specs/sk-doc/021-benchmark-naming-and-playbook-results/checklist.md:39-46,57-77,109-118,167-175`

## Findings - New

### P0 Findings

- None. The adversarial search for a missed P0 (path traversal, secret leakage, frozen-anchor overwrite, manifest-source spoofing) did not surface one. The three active P1 findings remain P1; none elevates to P0.

### P1 Findings

- None new. All three active P1 findings (P1-001, P1-002, P1-003) survived adversarial replay.

### P2 Findings

- None.

## Adversarial Replay Results

### P1-001 — Default dated folders can overwrite same-day evidence

- Re-read `run-skill-benchmark.cjs:112-119` (`runFolderName`) and `:138-143` (`defaultOutputsDir`) and `:398-402` (`run()`'s `mkdirSync`).
- Re-read `create-benchmark/SKILL.md:312` and `spec.md:181` (the same-day disambiguator requirement).
- Re-read `archive-compiled-routing.cjs:167-169` (the collision guard the default writer lacks).
- Counterevidence sought: any same-folder replacement semantic documented in the SKILL.md, the playbook contract, or the test suite. None found.
- Alternative explanation: an operator can pass `--outputs-dir`. Rejected: REQ-004 (`spec.md:128`) promises a durable folder without the operator choosing a path.
- Verdict: P1-001 survives. `finalSeverity = P1`, confidence high.

### P1-002 — Published report contract does not describe the emitted folder

- Re-read `create-benchmark/SKILL.md:459-476` (Storage Shape: run folder directly under `benchmark/<run-label>/`, containing only `skill-benchmark-report.{json,md}`).
- Re-read `create-benchmark/SKILL.md:484-498` (reports layer: six files including `benchmark-report.md`).
- Re-read `create-manual-testing-playbook/SKILL.md:243-256` (seven files including `skill-benchmark-report.{json,md}` under `benchmark/reports/<run-label>/`).
- Re-read `run-skill-benchmark.cjs:539-563` (the writer's seven-file emission under `benchmark/reports/<run-label>/`).
- Counterevidence sought: any writer that emits `benchmark-report.md`, or any consumer that reads from `benchmark/<run-label>/` directly. None found.
- Alternative explanation: the owner's six-file `benchmark-report.md` contract could be a curated-only intent separate from the raw run folder. Rejected: the SKILL.md does not state that separation, and the writer puts all seven files in the curated `reports/` folder, so the "curated vs raw" distinction is not honored by the runtime.
- Verdict: P1-002 survives. `finalSeverity = P1`, confidence high.

### P1-003 — Serving snapshots still look for a retired non-dated parity label

- Re-read `render-serving-snapshot.cjs:121-134` (`scanParityBaseline` hardcodes `router-compiled-parity-baseline`).
- Re-read `render-serving-snapshot.cjs:145-170` (`scanRealModelLast` demonstrates the dated-discovery pattern in the same file).
- Re-read `create-benchmark/SKILL.md:323-325` (only `baseline/` is exempted from the dated grammar).
- Counterevidence sought: any other caller that maps a dated archive back to the `router-compiled-parity-baseline` label, or any explicit second carve-out declaration. None found.
- Alternative explanation: the hardcoded label could be retained as a frozen anchor like `baseline/`. Rejected: the SKILL.md only exempts `baseline/`; `router-compiled-parity-baseline` is not named as a second carve-out.
- Verdict: P1-003 survives. `finalSeverity = P1`, confidence high.

### Missed-P0 search (broadened angle)

- Path traversal: `slugField()` collapses everything outside `[a-z0-9]+` to single hyphens, so `..`, `/`, `\`, dots, underscores, and capitals cannot enter the folder name. `resolveSkillRoot()` resolves a path-like arg as-is, but that is the operator's intent for path-like args. No P0.
- Secret leakage: no credential, token, or transcript content is introduced by the storage path. `archive-compiled-routing.cjs:59` uses `execFileSync('git', ...)` with no untrusted interpolation. No P0.
- Frozen-anchor overwrite: `archive-compiled-routing.cjs:151` refuses `baseline`. `runFolderName()` never emits `baseline`. No P0.
- Manifest-source spoofing: `render-serving-snapshot.cjs:86-103` refuses any activation root that is not the live `010-live-activation` tree, including a `006-parent-hub-rollout` shadow candidate. No P0.
- Topology drift: `run-skill-benchmark.cjs:441-468` aborts with exit code 4 if `leaf-manifest.json` changes during a run. No P0.
- Frozen scorer drift: `run-skill-benchmark.cjs:425-435,470-480` aborts with exit code 2 if a frozen scorer digest changes during a compiled-parity run. No P0.

## Traceability Checks

| Protocol | Status | Gate | Evidence | Notes |
|---|---|---|---|---|
| `spec_code` | fail | hard | `run-skill-benchmark.cjs:398-402,539-563`; `create-benchmark/SKILL.md:459-498`; `render-serving-snapshot.cjs:121-134` | All three active implementation-to-contract contradictions survived replay. |
| `checklist_evidence` | fail | hard | `tasks.md:51`; `checklist.md:109-118,167-175` | Completion evidence asserts a six-file default-path contract the writer does not produce. The sign-off table at `checklist.md:167-175` records "Honesty: Yes" against a contract drift the gate did not catch. |
| `playbook_capability` | fail | advisory | `create-manual-testing-playbook/SKILL.md:243-256`; `create-benchmark/SKILL.md:489-498` | Playbook and owner publish incompatible report layouts. |

## Integration Evidence

- The adversarial pass re-confirmed the asymmetry between `archive-compiled-routing.cjs` (collision-safe) and `run-skill-benchmark.cjs` default path (not collision-safe). The archiver's pattern is the model for the fix.
- The adversarial pass re-confirmed the asymmetry between `scanParityBaseline` (hardcoded label) and `scanRealModelLast` (dated discovery) in the same file. The real-model pattern is the model for the fix.

## Edge Cases

- A hub that has archived a dated parity run AND retained the legacy `router-compiled-parity-baseline` folder would still see `parityBaseline.present = true` from the hardcoded lookup, but only because the legacy folder was not removed. Once the legacy folder is retired (which the dated grammar implies), the snapshot breaks. The defect is latent, not active, for hubs in transition.

## Confirmed-Clean Surfaces

- The missed-P0 search confirmed the security boundaries are intact (path alphabet, frozen anchor, manifest source, topology drift, frozen scorer drift).
- The migration execution is sound: 78 of 78 folders at mapped names, 0 live stale references, link checker at baseline.

## Ruled Out

- No P0 found. The three active P1 findings remain P1.
- No basis to downgrade any active P1: each has direct file evidence and a failed counterexplanation.

## Next Focus

- Max iterations reached. Synthesis must retain P1-001, P1-002, and P1-003 as active workstreams and route them to `/speckit:plan` for remediation. Do not synthesize a PASS from convergence telemetry.

Review verdict: CONDITIONAL
