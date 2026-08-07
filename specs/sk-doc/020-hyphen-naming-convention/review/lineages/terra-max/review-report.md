---
title: "Deep Review Report: 032 hyphen naming convention (terra-max lineage)"
description: "Five-pass detached review synthesis for the 032 phase-parent packet."
---

# Deep Review Report

## 1. Executive Summary

Verdict: **CONDITIONAL**. The forced five-pass review completed with no P0 findings, three active P1 findings, and one P2 advisory. The target was read-only throughout; all generated evidence is contained in this detached lineage.

The P1 findings block a clean execution handoff: the parent phase topology is obsolete, phase 000 has impossible bootstrap evidence requirements, and its worktree instruction bypasses the current allocator. The P2 finding is an independent documentation-maintainability issue.

Scope covered parent topology, phase-000 bootstrap, guard/tooling safety controls, traceability contracts, final-gate/closeout adjacency, and the repository worktree workflow.

## 2. Planning Trigger

`/speckit:plan` is required before this packet is executed because active P1 findings change the executable phase contract.

### Planning Packet

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": true,
  "activeFindings": [
    {"id": "F001", "severity": "P1", "title": "Parent phase map targets an obsolete 16-phase topology"},
    {"id": "F002", "severity": "P1", "title": "Phase 000 requires unavailable predecessor and rename-map evidence"},
    {"id": "F004", "severity": "P1", "title": "Phase 000 hard-codes a non-allocating legacy worktree identity"},
    {"id": "F003", "severity": "P2", "title": "Duplicate partial phase map competes with the packet topology"}
  ],
  "remediationWorkstreams": [
    "Regenerate the parent topology from the authoritative phase tree",
    "Make phase-000 acceptance evidence achievable at bootstrap",
    "Route phase-000 worktree creation through the current allocator",
    "Remove or clearly scope the duplicate phase map"
  ],
  "specSeed": ["parent topology contract", "phase-000 scope and checklist", "worktree lifecycle contract"],
  "planSeed": ["derive map", "repair bootstrap gates", "allocate worktree", "validate parent/children consistency"],
  "findingClasses": ["topology-drift", "bootstrap-contract", "workflow-contract", "duplicate-contract"],
  "affectedSurfacesSeed": ["parent spec", "phase-000 spec", "phase-000 plan", "phase-000 checklist", "graph/phase-tree metadata", "sk-git integration"],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

| ID | Severity | Finding | Evidence | Required action |
|---|---|---|---|---|
| F001 | P1 | Parent phase map targets an obsolete 16-phase topology | `spec.md:3,143-151`; `manifest/phase-tree.json:4,10-20`; `011-integrate-and-closeout/spec.md:37` | Generate one current parent topology from the authoritative phase tree. |
| F002 | P1 | Phase 000 requires unavailable predecessor and rename-map evidence | `000.../spec.md:31,62-64`; `000.../checklist.md:31-40`; parent `spec.md:142` | Make phase-000 acceptance phase-local; defer frozen-map evidence to phase 006 onward. |
| F004 | P1 | Phase 000 hard-codes a non-allocating legacy worktree identity | `000.../spec.md:57-58`; `000.../plan.md:60-61,69-74`; `sk-git/SKILL.md:302` | Use the current allocation workflow and persist its returned ref/path as baseline evidence. |
| F003 | P2 | Duplicate partial phase map competes with the packet topology | `spec.md:214-230,236-238`; `graph-metadata.json:6-18` | Remove it or scope it explicitly as a non-authoritative final-phase view. |

## 4. Remediation Workstreams

1. **P1 — Topology authority.** Rebuild the parent frontmatter and phase documentation map from `manifest/phase-tree.json`; reconcile it with `graph-metadata.json` and terminal phase adjacency.
2. **P1 — Bootstrap contract.** Change phase 000 so “no predecessor” is accepted, and make the rename-map hash mandatory only once the map exists.
3. **P1 — Worktree lifecycle.** Replace literal `wt/0037-*` and `.worktrees/0037-*` values with the current `sk-git` allocator result; record that result rather than predicting it.
4. **P2 — Navigation hygiene.** Delete the second partial map or give it an explicitly non-authoritative, final-phase-only purpose.

## 5. Spec Seed

- Declare `manifest/phase-tree.json` as the single executable topology source and derive the parent map from it.
- Define phase 000 as a true bootstrap phase with no predecessor and no frozen rename-map requirement.
- Replace literal worktree naming with allocator-owned branch/path fields.
- State which map, if any, owns parent progress and remove duplicate navigation contracts.

## 6. Plan Seed

- Add a topology regeneration task and compare the generated parent map to graph metadata before approval.
- Split phase-000 checklist evidence into bootstrap evidence and later frozen-map evidence, with explicit ownership.
- Invoke the sk-git worktree allocator and capture the returned owner-first ref/path in baseline output.
- Run packet validation and a phase-adjacency consistency check after documentation repair.

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Evidence / unresolved drift |
|---|---|---|
| `spec_code` | FAIL | F001, F002, F003, and F004 show phase topology, bootstrap, duplicate-map, and lifecycle drift. |
| `checklist_evidence` | FAIL | Phase-000 CHK-007/CHK-008 require prerequisites and a map hash unavailable at bootstrap; its worktree plan cannot prove allocator ownership. |

### Overlay Protocols

| Protocol | Status | Evidence |
|---|---|---|
| `feature_catalog_code` | NOT APPLICABLE | No implementation consumer exists in this planned packet. |
| `playbook_capability` | PASS | The active sk-git workflow documents the required allocator and owner-first form. |

`AC_COVERAGE`: exempt — this is a planned spec-folder review with no applied implementation reports. The target had no `resource-map.md` at initialization, so the conditional Resource Map Coverage Gate is omitted; the lineage-local `resource-map.md` is generated review evidence, not target coverage input.

## 8. Deferred Items

- F003 is advisory only. It should be fixed with the topology workstream, but it does not independently change the CONDITIONAL verdict.
- Implementation-level correctness remains unverified because the migration is planned; that is a scope limit, not a clean result.

## Dimension Expansion Map

- Completed directions: parent topology correctness; migration safety controls; bootstrap traceability; map maintainability; worktree lifecycle alignment.
- Convergence telemetry was observed after coverage improved, but synthesis was deferred until the fifth pass because `stopPolicy=max-iterations`.
- No council artifacts, failed pivots, or remaining review frontier were recorded.

## 9. Search Ledger

*No search-depth state captured (legacy v1 record).* `hasSearchDebt: false`.

## 10. Audit Appendix

- Stop reason: `maxIterationsReached` after 5 of 5 required passes.
- Coverage: correctness, security, traceability, and maintainability all covered.
- Convergence telemetry: reducer convergence score `0.71`; graph convergence score `0.46`; these did not shorten the required loop.
- Source set: parent `spec.md`, `graph-metadata.json`, `manifest/phase-tree.json`, phase-000 spec/plan/checklist, phase 004/005 safety contracts, phase 010/011 adjacency, and `sk-git/SKILL.md`.
- Ruled out: a material security documentation gap was not supported by the reviewed guard/tooling contracts. No target file was modified.

