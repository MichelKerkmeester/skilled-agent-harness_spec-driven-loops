# Deep Review Report: Example-tolerant drift guards

Review of commit `b6eef4ebbb` on branch `worktrees/126-drift-guard-tolerance`: the router-sync existence filter, archived-gold skip and first-map anchor, the registry-derived doc-claims surface count with its allowlist row, their tests, the scripts README row, the sk-code-skilled 1.2.4.0 release with its Hermes copy, and the phase spec docs.

## 1. Executive Summary

- **Verdict:** PASS
- **hasAdvisories:** true
- **Active findings:** P0 0, P1 0, P2 9
- **Scope:** 13 files (8 in the commit, 5 phase spec docs), four dimensions, five iterations on cli-pi `deepseek-v4.1-flash` at `max` thinking. Stop reason `maxIterationsReached` under stop policy `max-iterations`.
- No finding is a defect in the guards' behavior on well-formed input. The P2s are robustness, coverage, documentation and spec-traceability advisories.

## 2. Planning Trigger

`/speckit:plan` is not required: the verdict is PASS. The P2 advisories are handled inside this phase, as the phase goal (C3) requires; each disposition is recorded in the phase `implementation-summary.md` as an RV row.

```json
{
  "label": "Planning Packet",
  "triggered": false,
  "verdict": "PASS",
  "hasAdvisories": true,
  "activeFindings": { "P0": 0, "P1": 0, "P2": 9 },
  "remediationWorkstreams": ["guard robustness (R1-P2-001)", "doc and spec sync (R3-P2-001, R3-P2-002, R3-P2-003)"],
  "specSeed": ["spec.md Files to Change lists the scripts README and the generated Hermes copy", "AC-006 cites the doctor 13d check"],
  "planSeed": ["contain the registry parse in checkSurfaces with one test", "rephrase the two stale three-surface sentences and regenerate Hermes"],
  "findingClasses": ["class-of-bug", "instance-only"],
  "affectedSurfacesSeed": ["verify-doc-claims.cjs", "sk-code-skilled/SKILL.md", "sk-code-skilled/scripts/README.md", "phase spec.md", "phase acceptance-criteria.md"],
  "fixCompletenessRequired": false
}
```

## 3. Active Finding Registry

| ID | Sev | Title | Dimension | Evidence | Disposition |
|----|-----|-------|-----------|----------|-------------|
| R1-P2-001 | P2 | Malformed `mode-registry.json` crashes the `surfaces` check before it can report | correctness | `verify-doc-claims.cjs:324` raw `JSON.parse`, no per-check containment | Fix |
| R1-P2-002 | P2 | Count check cannot flag stale one-surface wording | correctness | `verify-doc-claims.cjs:45-46` vocabulary starts at two | Reject: "one surface" is used five times in live sk-code docs in non-count senses |
| R2-P2-001 | P2 | Symlinked docs and packet dirs escape the walk-based checks | security | dirent predicates in both guards, unchanged by this commit | Reject: pre-existing walk behavior outside the phase scope |
| R3-P2-001 | P2 | spec.md Files to Change omits the scripts README and the Hermes copy | traceability | `spec.md:86-94` | Fix |
| R3-P2-002 | P2 | Two live docs still describe the surfaces rule as a three-surface check | traceability | `sk-code-skilled/SKILL.md:175`, `scripts/README.md:13` | Fix |
| R3-P2-003 | P2 | AC-006 does not express REQ-006's doctor clause | traceability | `acceptance-criteria.md:59` | Fix |
| R4-P2-001 | P2 | The new `surfaces` allowlist row has no unit test | maintainability | no fixture writes `agent-authoring.md` | Reject: the live wrapper already fails loudly if the row stops matching; a fixture copying the live line mirrors the implementation |
| R4-P2-002 | P2 | Count vocabulary encoded twice, `both` fallback positional | maintainability | `verify-doc-claims.cjs:45-46`, `:331` | Reject: two adjacent instances, no live defect; restraint rule "two is not a pattern" |
| R5-P2-001 | P2 | First-map anchor can skip a half-removed map body | correctness | `verify-router-sync.cjs:129` | Reject: needs an inconsistent intermediate state the documented removal never produces; a stricter anchor would re-break removal tolerance |

## 4. Remediation Workstreams

1. Guard robustness: R1-P2-001, contain the registry read and report a named problem.
2. Documentation and spec sync: R3-P2-002 (two sentences plus the Hermes copy), R3-P2-001 and R3-P2-003 (phase spec docs).

## 5. Spec Seed

- Add the scripts README and the generated Hermes copy to `spec.md` Files to Change.
- Extend AC-006 to cite the sk-code doctor 13d check.

## 6. Plan Seed

- Wrap the `mode-registry.json` parse in `checkSurfaces` and add one test for a registry that does not parse.
- Rephrase "matches the three-surface hub" in `sk-code-skilled/SKILL.md` and `scripts/README.md`, then regenerate the Hermes copies.

## 7. Traceability Status

| Protocol | Level | Status | Notes |
|----------|-------|--------|-------|
| `spec_code` | core | pass after fixes | Four guard changes match D1 to D4; R3-P2-001 adds the two unlisted files |
| `checklist_evidence` | core | pass after fixes | AC-006 gains the doctor clause (R3-P2-003) |
| `skill_agent` | overlay | pass | SKILL.md and README now describe the registry-derived count |
| `agent_cross_runtime` | overlay | pass | Hermes copy regenerated, `sync-skills-hermes.cjs --check` PASS |
| `feature_catalog_code` | overlay | notApplicable | No catalog entry covers these guards |
| `playbook_capability` | overlay | notApplicable | No playbook scenario covers these guards |

AC_COVERAGE: lifecycle-active Level 2 packet; acceptance rows are closed by the builder with ledger evidence.

## 8. Deferred Items

- R2-P2-001 (symlink policy across both guards) is pre-existing and could be a follow-up packet if symlinked docs ever ship in sk-code.

## Dimension Expansion Map

No divergent pivots ran (convergence mode `default`). Iteration 5 broadened to an adversarial correctness re-check of all four changes and re-adjudicated every open P2; no severity changed.

## 9. Search Ledger

- `searchCoverage.graphCoverageMode`: `graphless_fallback`
- Required bug classes: prose_anchor_coverage, count_wording_spelling_gap, registry_shape_robustness, example_surface_removal_edge, orphan_skip_breadth
- Candidate classes covered: acceptance_gap, count_vocabulary_gap, duplicated_vocabulary_drift, prose_anchor_coverage, spec_code_drift, stale_doc_claim, symlink_handling, test_coverage_gap, uncaught_error
- Reducer-owned `searchDebt` and `cleanSearchProof` are in `deep-review-findings-registry.json`.

## 10. Audit Appendix

- **Convergence:** five iterations, newFindingsRatio 1 on each pass that added a finding; all four dimensions covered by iteration 4; graph convergence `STOP_BLOCKED` on coverage until dimensions completed. Stop: `maxIterationsReached`.
- **Coverage:** correctness (1, 5), security (2), traceability (3), maintainability (4).
- **Ruled out:** archived-gold skip hiding a declared mode (test asserts a declared mode still fails); first-map anchor moving on the live tree (first match is still `## 4. WEBFLOW MAP`); existence filter changing pristine check 2 output (identical by construction and by run).
- **Sources reviewed:** the 13 scope files, `leaf-resource-contract.cjs` `qualifiedIdToLeaf`, `router-replay-lib.cjs`, the live ROUTER.md and `mode-registry.json`.

### Core Protocols

`spec_code` and `checklist_evidence`, as in section 7.

### Overlay Protocols

`skill_agent`, `agent_cross_runtime` pass; `feature_catalog_code`, `playbook_capability` not applicable.
