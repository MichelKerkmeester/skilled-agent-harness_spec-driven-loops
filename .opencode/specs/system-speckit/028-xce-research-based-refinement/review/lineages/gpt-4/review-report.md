# Deep Review Report: gpt-4 Lineage

## Executive Summary

Verdict: CONDITIONAL. The lineage reached `maxIterations=5` with all four review dimensions covered and no P0 findings. Three active P1 findings remain: parent child-registry drift, stale parent phase-map statuses, and incomplete resource-map coverage. One P2 advisory remains for stale parent continuity. `hasAdvisories=true`.

## Planning Trigger

Route to remediation planning before release-readiness claims for this parent packet. The active P1 findings affect parent-level resume/search/phase traversal wayfinding and resource-map audit coverage.

## Active Finding Registry

| Finding | Severity | Dimension | Title | Evidence | Status |
|---|---|---|---|---|---|
| F001 | P1 | correctness | Parent child registry omits live phase 011 from authored child surfaces | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:127-140`; `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/description.json:27-39`; `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/graph-metadata.json:6-18`; `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/011-command-presentation-workflow-separation/spec.md:47-56` | active |
| F002 | P1 | correctness | Parent phase map status column is stale for shipped child tracks | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:129-139`; `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:160`; `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-write-safety/spec.md:56-64`; `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/008-openltm-retrieval-observability/spec.md:41-46`; `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/009-openltm-continuity-resilience/spec.md:41-46` | active |
| F003 | P1 | traceability | Parent resource map excludes current 011 track and later shipped scope | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/resource-map.md:30-33`; `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/resource-map.md:70-82`; `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/011-command-presentation-workflow-separation/spec.md:116-121` | active |
| F004 | P2 | maintainability | Parent continuity block points to already-shipped or superseded next actions | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:23-44`; `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/changelog/README.md:14-31`; `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/timeline.md:74-88` | active |

## Remediation Workstreams

1. Reconcile parent child membership: add `011-command-presentation-workflow-separation/` consistently to parent `spec.md` phase map and `description.json.children`, preserving graph metadata agreement.
2. Reconcile parent status rows for shipped tracks: update stale `000`, `002`, `008`, and `009` status signals or explicitly explain if the parent map intentionally uses a different status vocabulary.
3. Refresh parent `resource-map.md` so its scope and path ledger include current child tracks, especially 011 and its four command-family child parents.
4. Refresh parent `_memory.continuity` block after metadata remediation so next-safe-action and key files match current work.

## Spec Seed

- Parent spec should state 011 as a current child phase or explicitly document why `graph-metadata.json` is ahead of authored parent surfaces.
- Parent phase map should represent current aggregate progress, consistent with the rule at `spec.md:160`.
- Resource-map scope should no longer say it is focused only on renumbered metadata and peck-derived work if later child tracks are active.

## Plan Seed

- Read parent `spec.md`, `description.json`, `graph-metadata.json`, `resource-map.md`, child `011` metadata, and the changelog index.
- Patch parent authored surfaces for child membership and status consistency.
- Regenerate or manually update parent resource-map and description metadata using the packet's normal save/generate tooling.
- Run strict validation for the parent packet and targeted child metadata checks.

## Traceability Status

| Protocol | Status | Gate | Evidence | Notes |
|---|---|---|---|---|
| spec_code | partial | hard | `spec.md:127-140`; `description.json:27-39`; `graph-metadata.json:6-18` | Parent child membership and status claims are not reconciled. |
| checklist_evidence | pass | hard | `spec.md:51-59` | Parent is a phase parent and has no parent checklist by design. |
| feature_catalog_code | partial | advisory | `resource-map.md:30-33`; `resource-map.md:70-82` | Parent resource map is stale/incomplete for current track scope. |
| playbook_capability | pass | advisory | `011-command-presentation-workflow-separation/spec.md:91-96` | Scaffold is docs/metadata-only; no source-code edits were claimed. |

## Resource Map Coverage Gate

- Touched entries: parent `spec.md`, `description.json`, `graph-metadata.json`, `resource-map.md`, `timeline.md`, `changelog/README.md`, child 011 spec, and sampled child status specs.
- Untouched entries (`expected-by-scope` vs `gap`): nested implementation code was expected-by-scope for parent-control review; parent map omission of 011 is a gap.
- Implementation paths absent from the map: `011-command-presentation-workflow-separation/` and its four child-family phase parents are absent from the reviewed parent resource map.

## Deferred Items

- F004 is advisory and can be closed by normal continuity refresh after the P1 metadata fixes land.
- Full implementation-code audit of child tracks was not attempted because this lineage reviewed the phase-parent control packet.

## Audit Appendix

| Iteration | Focus | New P0/P1/P2 | Ratio | Verdict |
|---:|---|---|---:|---|
| 001 | correctness | 0/2/0 | 1.00 | CONDITIONAL |
| 002 | security | 0/0/0 | 0.00 | PASS |
| 003 | traceability | 0/1/0 | 1.00 | CONDITIONAL |
| 004 | maintainability | 0/0/1 | 1.00 | PASS |
| 005 | stabilization replay | 0/0/0 | 0.00 | CONDITIONAL |

Replay validation: JSONL state covers all configured dimensions, required traceability protocols are represented, every active finding has file-line evidence, and final verdict follows active severity counts. Stop reason is `maxIterationsReached` rather than clean convergence because active P1 findings remain.
