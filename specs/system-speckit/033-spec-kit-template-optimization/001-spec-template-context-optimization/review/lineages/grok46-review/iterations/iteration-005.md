# Iteration 5: Broadening pass — adversarial P1 replay, overlays, leftover task wording

## Focus
Dimension: correctness (replay) + security (F006 replay) + traceability (overlays). Hard-stop iteration under `stopPolicy: max-iterations`. Convergence is telemetry only.

## Scorecard
- Dimensions covered: correctness, security, traceability
- Files reviewed: 8
- New findings: P0=0 P1=0 P2=2
- Refined findings: P0=0 P1=2 P2=1
- New findings ratio: 0.05

## Findings

### P0, Blocker
- None.

### P1, Required
- **F001** (replay, still active): `tasks.md:47` T004 and T010–T053 remain `[ ]` while checklist/spec claim Complete.
- **F002** (refined): `implementation-summary.md:87` still reports 4 golden-snapshot failures, while `implementation-summary.md:97` says those snapshots were regenerated. Current vitest is green (iter 1 evidence).
- **F003** (replay, still active): `spec.md:47` still says Complete (uncommitted) / awaiting commit go-ahead after feat `c8c4e79139`.
- **F006** (refined): `check-scope-adherence.sh:136` basename skip is locked in by `check-scope-adherence.vitest.ts:64` (`specs/x/spec.md` treated as canonical). No negative test for an unrelated `other/spec.md`. Any `spec.md` anywhere is in-scope.
- **F009** (replay, still active): `spec.md:113` still requires shared `enforceTokenBudget`; ADR-005 + code keep `enforceSearchTokenBudget`.
- **F013** (replay, still active): `plan.md:84` / `tasks.md:65` still prescribe warn-severity AC_COVERAGE.

### P2, Suggestion
- **F016**: REQ-003 / T022 name a `--stdout` flag the renderer does not have, `specs/system-speckit/034-spec-template-context-optimizations/tasks.md:62`, [Evidence: T022 says `--level N --stdout`. spec.md:119 says `--stdout` (or equivalent). template-guide.md:85 documents omit `--out-dir`. Renderer usage string has `--out-dir`, not `--stdout`.]
- **F017**: Overlay leftovers — no playbook scenario for SCOPE_ADHERENCE change-sets or `handleMemorySearch` token-budget, `.opencode/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md:1`, [Evidence: playbook glob for scope-adherence / memory_search budget returned unrelated dual-scope and dynamic-token-budget-allocation files. Catalog mentions the new rules in spec-validation-rule-engine.md:64 but has no dedicated memory_search handler-budget feature.]
- **F014** (refined): T020 remains `[ ]` "shared core + addenda" after the shipped per-template inline gates.

## Claim adjudication

No new P0/P1 this iteration. Replay packets for still-active P1s:

```json
{
  "findingId": "F006",
  "claim": "Canonical-doc skip uses basename only, so any spec.md (or other canonical basename) anywhere is treated as in-scope; the vitest suite locks that heuristic in.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/scripts/rules/check-scope-adherence.sh:136",
    ".opencode/skills/system-spec-kit/scripts/tests/check-scope-adherence.vitest.ts:64"
  ],
  "counterevidenceSought": "Looked for a negative test that an unrelated packet spec.md must warn. None. The pass-path test uses specs/x/spec.md as a canonical skip.",
  "alternativeExplanation": "Intentional per-packet heuristic because validate.sh runs in one folder. Rejected as sufficient: a mixed change-set can hide another packet's spec.md.",
  "finalSeverity": "P1",
  "confidence": 0.88,
  "downgradeTrigger": "If skip matches the packet folder under review (not basename) and a negative test covers other/spec.md, downgrade to P2.",
  "transitions": [
    { "iteration": 2, "from": null, "to": "P1", "reason": "Initial discovery" },
    { "iteration": 5, "from": "P1", "to": "P1", "reason": "Replay: vitest locks in basename skip" }
  ]
}
```

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | spec.md:47, spec.md:113, plan.md:84 | All six P1s still hold on replay |
| checklist_evidence | partial | hard | tasks.md:47, checklist.md:29 | Open tasks + 0/8 AC_COVERAGE |
| feature_catalog_code | partial | advisory | spec-validation-rule-engine.md:64 | New rules mentioned; no handler-budget feature |
| playbook_capability | partial | advisory | manual-testing-playbook | F017: no SCOPE_ADHERENCE or search-budget scenario |
| skill_agent | notApplicable | advisory | spec-folder target | |
| agent_cross_runtime | notApplicable | advisory | spec-folder target | |

## Assessment
- New findings ratio: 0.05
- Dimensions addressed: correctness, security, traceability (broadening)
- Novelty justification: F016–F017 are leftover-angle findings. P1 set unchanged in count; F002/F006 refined.

## Ruled Out
- Sibling claim that research.md.tmpl has no automated render proof: [`research-template-gating.vitest.ts` asserts L1/L2/L3/3+/phase gating and marker leak], [research-template-gating.vitest.ts:22-50]
- Sibling F010 phase-number collision as unmarked: [tasks.md:35 Phase-numbering note], [tasks.md:35]
- Forcing shared `enforceTokenBudget` as a security defect: [ADR-005], [decision-record.md]
- Red golden snapshots on the current tree: [iter 1 vitest 10/10], [scaffold-golden-snapshots + research-template-gating]

## Dead Ends
- Looking for a `--stdout` flag in the renderer: usage is `--out-dir` or omit it.
- Looking for a playbook file named for SCOPE_ADHERENCE: none.

## Recommended Next Focus
Hard stop: `iteration_count >= 5`. Enter phase_synthesis. Do not dispatch another iteration.

Review verdict: CONDITIONAL
