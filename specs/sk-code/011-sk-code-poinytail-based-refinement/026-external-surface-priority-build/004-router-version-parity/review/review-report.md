# Deep Review Report: Router version parity

Review of commits `9d1168bf3a` and `95698b591b` on branch `worktrees/128-router-version-parity` (diff `455f2a2d8c..95698b591b`): check 13a no longer compares a hub `ROUTER.md` version with `SKILL.md`, a new invariants test pins that, both create-changelog YAML twins stop copying the release version into `ROUTER.md`, and `frontmatter-versioning.md` says the doctor compares only the three JSON routing files.

## 1. Executive Summary

- **Verdict:** CONDITIONAL
- **hasAdvisories:** false
- **Active findings:** P0 0, P1 2, P2 0 (the reducer registry holds four P1 rows because iteration 5 re-adjudicated both findings under the same ids; deduplicated by id they are two)
- **Scope:** 7 files (5 in the commits, plus the phase `spec.md` and `goal.md`), four dimensions, five iterations on cli-pi `deepseek-v4.1-flash` at `max` thinking. Stop reason `maxIterationsReached` under stop policy `max-iterations`.
- The diff itself is correct and minimal: the follower list, the failure branches, the pass message, the new test and both twins were confirmed by direct read. Both P1 findings are one class: live docs outside the diff that still say a hub `ROUTER.md` carries the release version.

## 2. Planning Trigger

`/speckit:plan` is not required: the phase goal (C3) has the builder fix every confirmed P0 to P2 inside this phase. Both findings were fixed in `695335c9b7` and recorded as RV rows in the phase `implementation-summary.md`.

```json
{
  "label": "Planning Packet",
  "triggered": false,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": { "P0": 0, "P1": 2, "P2": 0 },
  "remediationWorkstreams": ["same-class inventory: correct every live claim that a hub ROUTER.md carries the release version (R1-P1-001, R3-P1-001)"],
  "specSeed": ["the same-class inventory covers every hub SKILL.md and the sk-doc release instructions, not only the files the build edits"],
  "planSeed": ["drop ROUTER.md from the version-authority note of four hub SKILL.md files, from sk-create-changelog step 6 and from examples-and-maintenance.md; regenerate the Hermes copies"],
  "findingClasses": ["class-of-bug"],
  "affectedSurfacesSeed": ["sk-doc/SKILL.md", "system-deep-loop/SKILL.md", "cli-external-orchestration/SKILL.md", "sk-code/SKILL.md", "sk-create-changelog/SKILL.md", "examples-and-maintenance.md", ".hermes/skills copies"],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

| ID | Sev | Title | Dimension | Evidence | Disposition |
|----|-----|-------|-----------|----------|-------------|
| R1-P1-001 | P1 | Three live sk-doc docs still state a hub ROUTER.md carries the release version | correctness, traceability | `sk-create-changelog/SKILL.md:261`, `sk-doc/SKILL.md:17`, `examples-and-maintenance.md:181` | Fix (`695335c9b7`) |
| R3-P1-001 | P1 | Three more hub SKILL.md version-authority notes make the same claim | traceability | `sk-code/SKILL.md:17`, `system-deep-loop/SKILL.md:14`, `cli-external-orchestration/SKILL.md:17` | Fix (`695335c9b7`) |

Finding class for both: class-of-bug. Scope proof after the fix: a sweep of `.skilled`, `.hermes`, `.claude` and `.opencode` (changelogs excluded) for release-version claims on `ROUTER.md` returns only the corrected lines. `mcp-tooling/SKILL.md:19` says "Hub metadata files carry the same value" without naming `ROUTER.md`; it is left as is because it names no Markdown doc.

Adversarial self-check: both findings were re-read at the cited lines by the orchestrator before the fix. Each line named `ROUTER.md` as a release copy, and the changelog skill's step 6 told the release workflow to write it, so P1 holds: following the doc recreates the coupling the phase removes.

## 4. Remediation Workstreams

1. Same-class inventory (R1-P1-001, R3-P1-001): six doc lines corrected, five Hermes copies regenerated.

## 5. Spec Seed

- The same-class inventory in `spec.md` scope reaches every hub `SKILL.md`, not only the directories T002 named.

## 6. Plan Seed

- Correct the six lines, regenerate Hermes, rerun the six hub doctors and the routing guards.

## 7. Traceability Status

| Protocol | Level | Status | Notes |
|----------|-------|--------|-------|
| `spec_code` | core | pass after fixes | REQ-001 to REQ-004 map to the diff; the same-class bullet closes with `695335c9b7` |
| `checklist_evidence` | core | pass after fixes | T002 and CHK-FIX-002 close with the widened sweep |
| `skill_agent` | overlay | pass after fixes | Skill instructions now match the YAML twins |
| `agent_cross_runtime` | overlay | pass | Hermes copies regenerated; `sync-skills-hermes.cjs --check` reports 68 in sync |
| `feature_catalog_code` | overlay | notApplicable | No catalog entry covers version parity |
| `playbook_capability` | overlay | notApplicable | Playbooks touch ROUTER.md routing reach only |

AC_COVERAGE: lifecycle-active Level 2 packet; the acceptance rows are closed by the builder with ledger evidence.

## 8. Deferred Items

None. Search debt SL-505 (the runtime claim that the new test and the six hubs pass) was deferred by the read-only iterations to the closure gate; the orchestrator ran it: the test exits 1 before the checker change and 0 after, the invariants suite passes 99 of 99, `run-all.sh` passes 7 suites and the six hub doctors exit 0.

## Dimension Expansion Map

No divergent pivots ran (convergence mode `default`). Iteration 5 was an adversarial correctness re-check of all four changes that re-adjudicated both open P1 findings; neither changed severity.

## 9. Search Ledger

- `searchCoverage.graphCoverageMode`: `graphless_fallback`
- Required bug classes: stale_documentation, spec_mismatch, test_vacuity, doc_code_drift, unverified_runtime_claim
- Covered: stale_documentation, spec_mismatch; ruled out: test_vacuity, doc_code_drift; deferred: unverified_runtime_claim (SL-505, closed by the observed runs in section 8)
- hasSearchDebt: true at synthesis time, closed by the observed runs above
- Reducer-owned `searchDebt`, `ruledOutCandidates` (24) and `cleanSearchProof` are in `deep-review-findings-registry.json`.

## 10. Audit Appendix

- **Convergence:** five iterations, ratios 1, 0, 1, 0, 0; all four dimensions covered by iteration 4; graph convergence `STOP_BLOCKED` on each check. Stop: `maxIterationsReached`.
- **Coverage:** correctness (1, 5), security (2), traceability (1, 3), maintainability (4).
- **Ruled out:** test vacuity (the fixture carries the replaced version line), JSON parity regression (followers and both failure branches intact), twin divergence (identical removals), security impact (version metadata only), comment or message drift (both match the JSON-only follower set).
- **Sources reviewed:** the five changed files, the phase spec docs, the hub SKILL.md files, `sk-create-changelog/SKILL.md`, `examples-and-maintenance.md`, `root-router-contract.cjs`, the Hermes copies.

### Core Protocols

`spec_code` and `checklist_evidence`, as in section 7.

### Overlay Protocols

`skill_agent` and `agent_cross_runtime` pass after the fix; `feature_catalog_code` and `playbook_capability` not applicable.
