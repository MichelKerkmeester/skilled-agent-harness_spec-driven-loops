# Deep Review Report: Command Presentation Workflow Separation

## Executive Summary

Verdict: CONDITIONAL.

Active findings: P0=0, P1=3, P2=0. `hasAdvisories=false`.

Scope: static review of the root phase-parent packet, sampled child family status evidence, and sampled command router/presentation references. The review found no security blocker, but three active P1 traceability/maintainability defects prevent a clean PASS.

Stop reason: converged after all four dimensions were covered and the saturation pass found no new finding family.

## Planning Trigger

Route to remediation planning because active P1 findings remain. The remediation is documentation and metadata alignment, not command runtime implementation: update root phase-parent status/progress, represent the memory workflow-YAML exception or add workflow assets, and correct the resume command spelling.

## Active Finding Registry

| ID | Severity | Dimension | Title | Evidence | Status |
| --- | --- | --- | --- | --- | --- |
| F001 | P1 | correctness/traceability | Root phase parent still reports planned state after all family parents completed | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/002-command-presentation-workflow-separation/spec.md:56`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/002-command-presentation-workflow-separation/spec.md:118-121`, child family specs `:54-57` | active |
| F002 | P1 | traceability | Root contract promises workflow-asset separation but memory family has no workflow YAML | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/002-command-presentation-workflow-separation/spec.md:75`, `.opencode/commands/memory/search.md:15`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/002-command-presentation-workflow-separation/001-memory-commands/003-router-rewire/implementation-summary.md:56-63` | active |
| F003 | P1 | maintainability | Phase transition instructions point at stale `/spec_kit:resume` command spelling | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/002-command-presentation-workflow-separation/spec.md:128`, `.opencode/commands/speckit/resume.md:7-9` | active |

## Remediation Workstreams

| Workstream | Findings | Suggested Action |
| --- | --- | --- |
| Root aggregate state reconciliation | F001 | Update root frontmatter, metadata table, phase map, and graph metadata to reflect completed child families or explicitly mark root as scaffold-only with child completion state. |
| Workflow-asset exception handling | F002 | Either add memory workflow YAML assets and update routers, or update the root contract to document memory commands as an intentional exception with the known YAML gap. |
| Command-reference cleanup | F003 | Replace the stale `/spec_kit:resume` instruction in this packet with the current `/speckit:resume` spelling or document an active alias if one exists. |

## Spec Seed

- Add an aggregate completion/status paragraph to the root phase parent.
- Add a root-level note for the memory family if workflow YAML assets remain absent.
- Update phase transition command examples to the current command surface.

## Plan Seed

1. Read the root phase parent and all four family parent specs.
2. Decide whether the root packet should be marked completed or scaffold-only with child completion pointers.
3. Patch `spec.md` and `graph-metadata.json` consistently.
4. Patch the memory workflow-asset wording to either close or explicitly track the YAML gap.
5. Patch the stale resume command spelling.
6. Run strict validation for the root phase parent and affected family parents.

## Traceability Status

| Protocol | Status | Gate | Notes |
| --- | --- | --- | --- |
| spec_code | fail | hard | Parent status and workflow-asset claims conflict with child and router evidence. |
| checklist_evidence | partial | hard | Lean phase parent has no checklist; evidence was reviewed directly. |
| feature_catalog_code | partial | advisory | Routers generally reference presentation assets; memory workflow YAML remains absent. |
| playbook_capability | not-applicable | advisory | No playbook artifact in target scope. |

## Deferred Items

- No P2 advisories were opened.
- Cross-model live command rendering was not executed; this lineage used static file evidence only.
- Broader repository cleanup of historical `/spec_kit` references was out of scope for this lineage.

## Audit Appendix

| Iteration | Dimension | New Findings | Ratio | Verdict |
| --- | --- | --- | ---: | --- |
| 001 | correctness | F001 | 1.00 | CONDITIONAL |
| 002 | traceability | F002 | 1.00 | CONDITIONAL |
| 003 | maintainability | F003 | 1.00 | CONDITIONAL |
| 004 | security | none | 0.00 | PASS |

Replay validation: JSONL state records four iteration records, all configured dimensions are covered, no P0 findings are active, P1 findings F001-F003 remain active, and final verdict maps to CONDITIONAL.

Resource map coverage gate: skipped because target `resource-map.md` was absent at init.
