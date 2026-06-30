# Deep Review Report: sk-design-foundations

## Executive Summary

Verdict: CONDITIONAL

- Target: `.opencode/skills/sk-design-foundations`
- Target type: `skill`
- Stop reason: `maxIterationsReached`
- Iterations: 5 of 5
- Active findings: P0=0, P1=2, P2=1
- hasAdvisories: true
- Release-readiness state: `in-progress`

The package is readable, split-ready, and has no direct executable security surface. Release readiness is conditional because two traceability/runtime-contract findings remain active.

## Planning Trigger

Route to remediation planning before claiming the child is fully validated or release-ready. F001 blocks the source acceptance claim, and F002 shows one documented playbook prompt can bypass the target skill at advisor runtime.

## Active Finding Registry

| ID | Severity | Dimension | Title | Evidence | Status |
| --- | --- | --- | --- | --- | --- |
| F001 | P1 | traceability | Strict validation acceptance claim fails on the target child | `.opencode/specs/design/008-sk-design-parent/005-build-subskills/spec.md:155`; `.opencode/specs/design/008-sk-design-parent/005-build-subskills/implementation-summary.md:130-138`; `.opencode/skills/system-spec-kit/scripts/spec/validate.sh:100-115`; `logs/validation-and-advisor-evidence.md:3-8` | active |
| F002 | P1 | traceability | Layout playbook prompt routes to `sk-code` before `sk-design-foundations` | `.opencode/skills/sk-design-foundations/SKILL.md:23-29`; `.opencode/skills/sk-design/SKILL.md:87-94`; `.opencode/skills/sk-design-foundations/manual_testing_playbook/03--layout/layout-rhythm-responsive.md:15-23`; `logs/validation-and-advisor-evidence.md:20-24` | active |
| F003 | P2 | maintainability | Skill graph metadata has target-scoped hygiene warnings | `.opencode/skills/sk-design-foundations/graph-metadata.json:8-14`; `.opencode/skills/sk-design-foundations/graph-metadata.json:44-47`; `.opencode/skills/sk-design-foundations/graph-metadata.json:58-73`; `.opencode/skills/sk-design/graph-metadata.json:62-64`; `logs/validation-and-advisor-evidence.md:10-18` | active advisory |

## Remediation Workstreams

| Workstream | Findings | Recommended action |
| --- | --- | --- |
| Validation contract | F001 | Decide whether child skills must be spec-folder valid. If yes, add required docs/metadata. If no, amend the source spec and implementation summary to use a skill-specific validator instead of `validate.sh` on the child folder. |
| Advisor layout routing | F002 | Tune advisor signals or prompt/playbook wording so the documented layout scenario selects `sk-design-foundations` first at confidence >=0.8, or document that implementation-oriented layout fixes intentionally route to `sk-code`. |
| Skill graph hygiene | F003 | Reconcile reciprocal graph edges/weights and re-run derived sync so target-scoped skill graph warnings clear. |

## Spec Seed

- Amend the build-subskills acceptance criteria to distinguish skill-package validation from spec-folder validation.
- Add or update an acceptance row for the layout playbook prompt that records actual advisor rank, confidence, ambiguity, and expected top skill.
- Add an advisory requirement to keep skill graph warnings for net-new children at zero or explicitly accepted.

## Plan Seed

- Reproduce F001 with `validate.sh .opencode/skills/sk-design-foundations --strict --json` and choose the intended validation contract.
- Reproduce F002 with the layout playbook prompt and inspect advisor scoring lanes that give `sk-code` priority.
- Re-run `mk_skill_advisor_skill_graph_validate` after graph metadata repair and confirm target-scoped warnings are gone or documented.

## Traceability Status

| Protocol | Gate | Status | Evidence |
| --- | --- | --- | --- |
| spec_code | hard | fail | F001 contradicts `.opencode/specs/design/008-sk-design-parent/005-build-subskills/spec.md:155`. |
| checklist_evidence | hard | partial | Provided review spec folder had no Markdown checklist discoverable. |
| skill_agent | advisory | partial | No direct agent/command entry point references were found; parent router evidence is `.opencode/skills/sk-design/SKILL.md:87-94`, graph hygiene warning is F003. |
| feature_catalog_code | advisory | pass | Catalog capabilities map to source references at `.opencode/skills/sk-design-foundations/feature_catalog/feature_catalog.md:18-22`. |
| playbook_capability | advisory | partial | Layout playbook scenario evidence is `.opencode/skills/sk-design-foundations/manual_testing_playbook/03--layout/layout-rhythm-responsive.md:15-23`; advisor evidence is `logs/validation-and-advisor-evidence.md:20-24`. |

## Deferred Items

- F003 is advisory because `mk_skill_advisor_skill_graph_validate` returned `isValid=true` with warnings, not errors.
- The type playbook prompt selected `sk-design-foundations` first but was marked ambiguous; this is not an active finding because the correct skill still ranked first.
- Packet-local resource-map coverage was skipped because the provided review spec folder had no `resource-map.md` or Markdown docs.

## Audit Appendix

| Iteration | Dimension | New P0 | New P1 | New P2 | Verdict |
| --- | --- | ---: | ---: | ---: | --- |
| 001 | correctness | 0 | 0 | 0 | PASS |
| 002 | security | 0 | 0 | 0 | PASS |
| 003 | traceability | 0 | 2 | 0 | CONDITIONAL |
| 004 | maintainability | 0 | 0 | 1 | PASS |
| 005 | stabilization | 0 | 0 | 0 | PASS |

Replay validation:

- All configured dimensions covered: yes.
- Required overlay protocols applied or marked partial: yes.
- Active P0 count: 0.
- Active P1 count: 2.
- Final verdict mapping: active P1 with no P0 -> CONDITIONAL.
- Stop reason: maxIterationsReached.

Exact verdict: CONDITIONAL
