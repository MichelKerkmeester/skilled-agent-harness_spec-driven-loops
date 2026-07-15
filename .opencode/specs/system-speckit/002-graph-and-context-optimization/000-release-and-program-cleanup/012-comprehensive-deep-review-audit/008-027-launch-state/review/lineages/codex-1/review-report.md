# Deep Review Report - codex-1

## Executive Summary

- Overall verdict: CONDITIONAL
- hasAdvisories: false
- Active findings: P0=0, P1=3, P2=1
- Stop reason: converged
- Release-readiness state: in-progress
- Scope: 027 phase-parent launch state, child scaffolding, renumbering metadata, status pointers, and resource-map coverage.

The launch state is structurally close, but not release-ready. Three active P1 findings can mislead recursive validation, resume routing, graph traversal, or memory-trigger discovery.

## Planning Trigger

`/speckit:plan` is required because the verdict is CONDITIONAL.

Planning Packet:

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": [
    "F001",
    "F002",
    "F003",
    "F004"
  ],
  "remediationWorkstreams": [
    "Scaffold or remove metadata-listed placeholder child phase 000-release-cleanup.",
    "Refresh active child metadata and references after renumbering.",
    "Regenerate graph metadata statuses from canonical spec and implementation-summary state.",
    "Clarify parent wording around allowed support docs."
  ],
  "specSeed": [
    "Define whether 000-release-cleanup is executable, placeholder-only, or out of the child list.",
    "Define canonical renumbering cleanup requirements for description.json, graph-metadata.json, trigger phrases, specId, dependency text, and active docs."
  ],
  "planSeed": [
    "Inventory every 027 child description.json and graph-metadata.json for stale numeric ids.",
    "Patch active docs to current ids while preserving old numbering only in context-index.md.",
    "Run strict recursive validation on the 027 parent after metadata repairs."
  ],
  "findingClasses": [
    "phase-child-scaffolding",
    "renumbering-metadata-drift",
    "status-drift",
    "parent-doc-wording"
  ],
  "affectedSurfacesSeed": [
    "phase-parent resume",
    "recursive validation",
    "memory search triggers",
    "graph metadata",
    "release readiness"
  ],
  "fixCompletenessRequired": true
}
```

## Active Finding Registry

| ID | Sev | Title | Dimension | Evidence | Disposition |
|---|---|---|---|---|---|
| F001 | P1 | Listed child phase `000-release-cleanup` is not an executable spec folder | correctness | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:130` | active |
| F002 | P1 | Renumbered child metadata and docs still advertise old phase numbers | traceability | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-learning-feedback-reducers/description.json:53` | active |
| F003 | P1 | Graph metadata marks draft placeholder phases complete | traceability | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-incremental-index-foundation/graph-metadata.json:42` | active |
| F004 | P2 | Parent note overstates the lean-parent document rule | maintainability | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:88` | active |

## Remediation Workstreams

1. P1 structural child cleanup: decide whether `000-release-cleanup` is a real child phase. If yes, scaffold the required child metadata and spec. If no, remove it from the phase map and metadata child arrays.
2. P1 renumbering cleanup: update active metadata and docs that still say `027/009`, `027 phase 009`, old `specId` values, or old dependency paths.
3. P1 status reconciliation: regenerate `graph-metadata.json` derived statuses for phases 003-006 so draft placeholder specs are not surfaced as complete.
4. P2 doc wording cleanup: adjust the parent note to permit valid parent-level support docs such as `context-index.md` and `resource-map.md`.

## Spec Seed

- Add acceptance criteria that every metadata-listed child is either a valid spec folder or explicitly excluded from recursive child traversal.
- Add a renumbering consistency requirement covering `spec.md`, `description.json`, `graph-metadata.json`, trigger phrases, `specId`, dependency text, and resource maps.
- Add graph-status reconciliation criteria: `derived.status` must match canonical spec/summary state or use a distinct non-completion label.

## Plan Seed

- Run a direct inventory over `003-xce-research-based-refinement/[0-9][0-9][0-9]-*/{spec.md,description.json,graph-metadata.json}`.
- Patch stale active references to the current 001-008 numbering.
- Decide the fate of `000-release-cleanup`.
- Re-run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/027-xce-research-based-refinement --strict` and recursive validation after repairs.

## Traceability Status

### Core Protocols

| Protocol | Status | Notes |
|---|---|---|
| spec_code | partial | Active findings show parent/child metadata and status drift. |
| checklist_evidence | partial | No slice checklist exists; implementation summaries supplied status evidence. |

### Overlay Protocols

| Protocol | Status | Notes |
|---|---|---|
| feature_catalog_code | notApplicable | Not part of this slice. |
| playbook_capability | notApplicable | Not part of this slice. |

## Resource Map Coverage Gate

- `Entries touched`: 8 parent/child metadata and spec-document paths appear in the lineage evidence map.
- `Entries not touched`: implementation-candidate skill files listed by the parent resource map are `expected-by-scope`, because this slice reviews launch scaffolding rather than future implementation targets.
- `Implementation paths absent from resource-map`: none observed for the reviewed parent-control files.

## Deferred Items

- F004 can be handled after the P1 metadata repairs.
- A broader 027-wide validation-output investigation was deferred because this lineage had enough direct evidence for the launch-state verdict.

## Search Ledger

*No search-depth state captured (legacy v1 record)*

## Audit Appendix

- Iterations: 5
- Dimension coverage: 4/4 plus stabilization
- Last ratios: `0.67 -> 0.05 -> 0.00`
- Graph convergence decision: STOP_ALLOWED
- P0 adjudication: none found
- P1 adjudication: F001, F002, and F003 include typed claim-adjudication packets in their iteration files.
- Cited source files were re-read before severity assignment.
