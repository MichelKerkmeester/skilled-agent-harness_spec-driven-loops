# Deep Review Report: Surface tie order warning

Review of commit `a682c06d3d` on branch `worktrees/131-tieorder-warning` (diff `c62d7d1399..a682c06d3d`): doctor check 5l in `parent-skill-check.cjs` reports, on the sk-code hub only and as a soft failure, a surface mode listed after `sk-code-opencode` in `routerPolicy.tieBreak` other than the two shipped examples; three invariant tests and the `addNamedSurfaces` helper pin it; the section heading names the 5a-5l range; the root README's sk-code guide gains one sentence for a hand edit of `tieBreak`.

## 1. Executive Summary

- **Verdict:** PASS
- **hasAdvisories:** true
- **Active findings at synthesis:** P0 0, P1 0, P2 6
- **Scope:** 6 files (3 in the commit, plus the phase `spec.md`, `decision-record.md` and `goal.md`), four dimensions, five iterations on cli-devin `deepseek-v4-1-flash-max`. Stop reason `maxIterationsReached` under stop policy `max-iterations`.
- The check does what the spec says on all four real orders (the shipped one, a hand-added surface after opencode, examples removed, opencode absent). The six P2 advisories are test-pinning gaps, one interpolation hazard shared by every neighbouring check, one duplicated expression and one fixture-hygiene point.

## 2. Planning Trigger

`/speckit:plan` is not required: the phase goal (C3) has every confirmed P0 to P2 fixed or rejected inside this phase. Three findings were fixed in the review-fix commit, three were rejected with a reason, and all six are recorded as RV rows in the phase `implementation-summary.md`.

```json
{
  "label": "Planning Packet",
  "triggered": false,
  "verdict": "PASS",
  "hasAdvisories": true,
  "activeFindings": { "P0": 0, "P1": 0, "P2": 6 },
  "remediationWorkstreams": ["test pinning: the FAIL message's two fixes and the opencode-absent silence (R1-P2-002, R3-P2-001)"],
  "specSeed": ["none: the spec already states both behaviours"],
  "planSeed": ["tighten the 5l failure assertion", "add an opencode-absent test"],
  "findingClasses": ["matrix/evidence", "class-of-bug", "instance-only"],
  "affectedSurfacesSeed": ["parent-skill-check-invariants.test.cjs 5l tests"],
  "fixCompletenessRequired": false
}
```

## 3. Active Finding Registry

| ID | Sev | Title | Dimension | Evidence | Disposition |
|----|-----|-------|-----------|----------|-------------|
| R1-P2-001 | P2 | No test pins 5l's silence on non-sk-code hubs | correctness | `parent-skill-check-invariants.test.cjs:315` | Fixed through R3-P2-001: a mutation that drops the basename gate changes nothing on a hub without `sk-code-opencode`, because the `nativeAt < 0` return still fires; the opencode-absent test pins that return. An absence assertion on the clean fixture was tried and removed, since that mutation leaves it green |
| R1-P2-002 | P2 | The 5l FAIL message's two named fixes are not pinned | correctness | `parent-skill-check-invariants.test.cjs:482` | Fixed: the failure assertion now matches the surface, `move them ahead of "sk-code-opencode"` and `/create:skill-parent update --surfaces`; a mutation that trims the message fails it |
| R2-P2-001 | P2 | 5l interpolates raw `tieBreak` entries into the report | security | `parent-skill-check.cjs:1173` | Rejected: `hub-router.json` is repository config at the checker's own trust level, the exit code is unaffected, and 5b, 5c, 5d, 5e, 5f and 5i interpolate the same way, so a sanitiser belongs in the shared emit helpers as its own change |
| R3-P2-001 | P2 | The spec's edge-case silence statements are unpinned | traceability | `spec.md:156-158` | Fixed: a test asserts no 5l line on an sk-code tree whose `tieBreak` has no `sk-code-opencode`; a mutation that drops the early return fails it |
| R4-P2-001 | P2 | 5l re-derives the mode-to-packetKind map 5i builds | maintainability | `parent-skill-check.cjs:1145`, `:1169` | Rejected: two copies of a one-line expression are not a pattern; each check stays self-contained, as the file's other checks are |
| R5-P2-001 | P2 | `addNamedSurfaces` leaves the 5l fixtures non-canon-clean | correctness | `parent-skill-check-invariants.test.cjs:243-258` | Rejected: every 5l assertion is scoped to the 5l line, and an sk-code fixture stays red from 5k-canary whatever the helper writes, so canon-cleaning it adds writes no assertion reads |

No P0 or P1 was raised, so the typed claim-adjudication gate stayed vacuous. The orchestrator confirmed R1-P2-001, R1-P2-002 and R3-P2-001 by three mutations of the checker run against the tests.

## 4. Remediation Workstreams

1. Test pinning (R1-P2-002, R3-P2-001, which also covers R1-P2-001): one assertion tightened, one test added.

## 5. Spec Seed

- None. `spec.md` already states the silence edge cases and the named fixes.

## 6. Plan Seed

- Tighten the 5l failure assertion, add the opencode-absent test, rerun the suite and the mutations.

## 7. Traceability Status

| Protocol | Level | Status | Notes |
|----------|-------|--------|-------|
| `spec_code` | core | pass | REQ-001 to REQ-004 map to the diff; the live sk-code doctor prints `PASS: 5l` |
| `checklist_evidence` | core | pass after closeout | Ledger rows T1 to T3 and the RV rows are filled at closeout |
| `skill_agent` | overlay | notApplicable | No skill or agent file changed |
| `agent_cross_runtime` | overlay | notApplicable | No mirrored file changed |
| `feature_catalog_code` | overlay | notApplicable | No catalog entry covers doctor check ids |
| `playbook_capability` | overlay | notApplicable | No playbook scenario covers 5l |

AC_COVERAGE: lifecycle-active Level 2 packet; the acceptance rows are closed at closeout with ledger evidence.

## 8. Deferred Items

- R2-P2-001's class (raw config strings in every doctor message) is a whole-doctor change, outside this phase.
- Search debt SL-008 (live-hub confirmation) is closed by the orchestrator's doctor run on the real sk-code hub; SL-004 (helper body comparison) is answered by R4-P2-001's rejection.

## Dimension Expansion Map

No divergent pivots ran (convergence mode `default`). Iteration 5 was a second correctness pass that re-read every open finding; none changed severity.

## 9. Search Ledger

- `searchCoverage.graphCoverageMode`: `graphless_fallback`
- Required bug classes: regression_pinning, spec_mismatch, boundary_condition, evidence_gap; covered by findings: regression_pinning; ruled out: spec_mismatch, boundary_condition
- hasSearchDebt: true at synthesis (SL-008, SL-004), closed as section 8 says
- Reducer-owned `searchDebt`, `ruledOutCandidates` (16) and `cleanSearchProof` are in `deep-review-findings-registry.json`.

## 10. Audit Appendix

- **Convergence:** five iterations, new-findings ratios 1, 0.33, 0.25, 0.2, 0.17; all four dimensions covered by iteration 4. `convergence.cjs` ran before each iteration and returned `STOP_BLOCKED` until coverage reached four dimensions; its ledger rows were refused by the append gateway for a payload-shape mismatch and are not in the state log. Stop: `maxIterationsReached`.
- **Coverage:** correctness (1, 5), security (2), traceability (3), maintainability (4).
- **Ruled out:** an off-by-one in the slice after `sk-code-opencode`, duplicate `tieBreak` entries, a transport or workflow mode misread as a surface, path traversal, secret exposure, a bypass of 5e or 5i, and a README claim that contradicts the checker.
- **Sources reviewed:** the three changed files, the phase spec docs, `hub-router.json` and `mode-registry.json` of sk-code, and the 5e, 5i and 5k code paths.

### Core Protocols

`spec_code` and `checklist_evidence`, as in section 7.

### Overlay Protocols

All four overlay protocols are not applicable.
