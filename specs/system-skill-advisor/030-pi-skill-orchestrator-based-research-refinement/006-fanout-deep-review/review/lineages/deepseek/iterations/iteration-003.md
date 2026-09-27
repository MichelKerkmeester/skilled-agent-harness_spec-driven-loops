# Iteration 3: D3 Traceability + D4 Maintainability — spec claims, deep-loop YAML, Pi extension, docs

## Focus

- **Dimension**: traceability (D3) and maintainability (D4). Also closes the phase 002-005 spec sweep and the `checklist_evidence` protocol re-check.
- **Scope**: the remaining manifest files not covered in iterations 1-2:
  - `.skilled/skills/system-deep-loop/runtime/tests/unit/run-now-yaml-control.vitest.ts` (phase 5 REQ-001)
  - `.pi/extensions/pi-cache-optimizer/index.ts` (hash-verified edits section only), `README.md`, `tests/hash-verified-edits.test.ts` (phase 5 REQ-002/003)
  - `.skilled/commands/deep/assets/deep-{research,review}-{auto,confirm}.yaml` (`step_convergence_report` plus the convergence machinery it feeds)
  - docs `hooks/skill-advisor-hook.md`, `ARCHITECTURE.md` (phase 3 REQ-007)
  - remaining tests: `prompt-advisor.vitest.ts`, `skill-advisor-cli-fallback-no-match.vitest.ts`, `prompt-policy-gold-replay.vitest.ts`, `claude-user-prompt-submit-hook.vitest.ts`, `user-prompt-submit-shim.vitest.ts`, `hook-adapter-runtime-label.vitest.ts`
- **Method**: requirement-by-requirement sweep of phases 002-005 against implementation and pinned tests; statement-level diff review of the four YAML `step_convergence_report` blocks (research vs. review, auto vs. confirm); cross-check of ledger scope shapes against the ledger schema tests.

## Scorecard

- Dimensions covered: traceability, maintainability (plus final spec_code sweep)
- Files reviewed: 14
- New findings: P0=0 P1=0 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.2 (severity-weighted new = 1.0 over accumulated = 5.0; telemetry only, `stopPolicy=max-iterations`)

## Findings

### P0, Blocker

None.

### P1, Required

None.

### P2, Suggestion

- **F005**: The confirm-mode review workflow never consumes `stop_policy`, so `max-iterations` can stop before the ceiling, `.skilled/commands/deep/assets/deep-review-confirm.yaml:38` (contract) vs. `:618-660` (`step_check_convergence`).
  Both review YAMLs document the same contract: "max-iterations treats convergence as telemetry until the hard iteration ceiling." Only `deep-review-auto.yaml` implements it (`:624` "do not allow all-dimensions-clean or composite convergence to stop", `:646` "convergence votes are telemetry only"); `deep-review-confirm.yaml` extracts `stop_policy` (`:569`) and stores it in config (`:433`, `:447`) but its `step_check_convergence` promotes all-dimensions-clean (`:627`) and composite convergence to a STOP candidate with no `max-iterations` guard. The research pair has the same shape: research relies on `effective_min_iterations` (auto `:729`, confirm `:677`), which review does not define at all. Under `deep-review-confirm` with `stop_policy: max-iterations`, an operator who asked for exactly-N iterations is offered an early stop prompt at the first clean dimension sweep. Alternative reading: in confirm mode the operator is the guard, and the divergence is deliberate. Recommendation: either add the auto clause to confirm or document the confirm-mode difference at line 38. Scope note: this line sits in `step_check_convergence`, adjacent to the changed `step_convergence_report` hunk but not inside it; filed because all four YAMLs are in `goal-file-manifest.txt` and the divergence concerns the same convergence machinery the changed step reports. Upgrade condition: if confirm + `max-iterations` is an operational lane, the contract violation becomes P1.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | pass | hard | Phase 002 REQ-001/003/004/007, 003 REQ-001..005/007, 004 REQ-001..007, 005 REQ-001..005 across the manifest | Full sweep complete (iterations 1-3). Every requirement with a manifest-visible implementation has code plus a pinned test; no contradiction found. Phase 005 REQ-006 (`check-contract-drift.cjs`) and REQ-007 (trigger index) are outside `goal-file-manifest.txt` and are recorded as not reviewable in scope rather than passed. |
| checklist_evidence | notApplicable | hard | `006-fanout-deep-review/spec.md:15` (`SPECKIT_LEVEL: 1`) | No `checklist.md` and no `acceptance-criteria.md` in the target; nothing to reconcile. |

## Assessment

- New findings ratio: 0.2
- Dimensions addressed: all four required dimensions now covered (D3/D4 closed this iteration)
- Novelty justification: one new P2. The traceability sweep found no unmet requirement among the manifest-visible ones; the phase 004/005 status-head and dedup claims hold in code and tests, phase 003's five requirements each have a named test, and phase 002's runtime-label and Pi dual-import requirements are pinned. Verified items worth naming: `validateEdits` now names the final empty line and keeps the moved-line refusal intact (`index.ts:8148-8175`, tests at `hash-verified-edits.test.ts:123-127`); the fan-out review close is proven both ways by the YAML control test (`:337-375` complete with lineage logs, `:376-400` incomplete without them); the research/review ledger scope shapes (`lineageId` vs `sessionId`) match their per-mode ledger schemas (`deep-review-ledger-schema.vitest.ts:162`), so the asymmetry is correct rather than drift.

## Ruled Out

- **Research/review `scope` key asymmetry as a defect**: the review ledger schema keys scope on `sessionId` and the research ledger on `lineageId` (`deep-review-ledger-schema.vitest.ts:162`), so the four YAML blocks match their consumers. Not a finding. (iteration 3)
- **Fan-out review close still blocked by the root-dashboard requirement**: the convergence command exempts the dashboard when lineage logs exist and the control test proves both branches. (iteration 3, evidence: `run-now-yaml-control.vitest.ts:293-400`)
- **`edit_lines` refusal wording as user-hostile for the common miscount**: the short-count branch is self-describing and offers a safe retry, while every other mismatch keeps the strict message. (iteration 3, evidence: `index.ts:8158-8175`)
- **Phase 003 REQ-007 doc claims**: `skill-advisor-hook.md:37-39` places the gate ahead of the CLI and `ARCHITECTURE.md:133` names the CLI as the hook's front door with no native builder on the hook path. (iteration 3)
- **Phase 002 R7 dual-import coverage**: `prompt-advisor.vitest.ts:138` imports from both Pi extension locations; the renderer-source assertion at `:158` guards pi-agnostic rendering. (iteration 3)

## Dead Ends

- **Phase 005 REQ-006/REQ-007 verification**: `check-contract-drift.cjs` and the trigger index are not in the manifest; their acceptance claims cannot be checked from the reviewed surface (compiled contracts and a committed index are also review targets of another packet). Recorded as out-of-manifest, not re-run — the lineage runs no generation or validation commands.
- **`metrics.ts` diagnostics permission finding (F004) could not be raised to P1**: content stays prompt-free by design; only debug-on telemetry on a shared host is exposed.
- **Confirm-mode research parity for `max-iterations`**: research's `effective_min_iterations` mechanism covers the case where the operator sets it; without it, research-confirm has the same theoretical gap as F005 but its config surface offers the knob, so the finding stays scoped to the review pair.

## Recommended Next Focus

None for this lineage: all four dimensions are covered, the spec_code sweep is complete, and the four recorded findings (F001-F005, all P2) are final for this session. Handoff: the orchestrator merges this lineage with the sibling and runs the fan-out close.

Review verdict: PASS
