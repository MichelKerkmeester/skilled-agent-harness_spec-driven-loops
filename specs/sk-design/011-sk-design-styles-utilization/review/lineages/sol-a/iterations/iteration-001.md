# Deep Review Iteration 001

## Dispatcher
- Route: `mode=review`, `target_agent=deep-review`, single LEAF iteration
- Focus: correctness inventory of lifecycle/status claims and current sk-design contract reality
- Budget profile: `scan` (9 analysis/setup tool calls before artifact writes; graphless fallback required by the prompt pack)

## Files Reviewed
- Parent lean trio: `spec.md`, `description.json`, `graph-metadata.json`
- Child lifecycle surfaces: all configured `spec.md`, `implementation-summary.md`, and `checklist.md` files for phases 001-010 (exact status/continuity/checklist searches), with direct counterevidence reads for phases 002 and 003
- Integration surfaces: `.opencode/skills/sk-design/SKILL.md`, `mode-registry.json`, and the six configured mode contracts (exact contract searches)

## Findings - New

### P0 Findings
None.

### P1 Findings
1. **Completed research phases retain pre-run continuity state** -- `.opencode/specs/sk-design/011-sk-design-styles-utilization/spec.md:13-25`, `.opencode/specs/sk-design/011-sk-design-styles-utilization/002-md-generator-upgrade/spec.md:13-30`, `.opencode/specs/sk-design/011-sk-design-styles-utilization/003-global-modes-utilization/spec.md:13-30` -- The parent still directs the next session to run phase 001 at 0% even though its phase map marks 001-003 complete, while phase 002 and 003 specs still direct dispatch of already-completed research at 10%. Their later body metadata and implementation summaries report complete/100%, so canonical packet surfaces expose mutually exclusive lifecycle instructions. [SOURCE: `.opencode/specs/sk-design/011-sk-design-styles-utilization/spec.md:13-25`] [SOURCE: `.opencode/specs/sk-design/011-sk-design-styles-utilization/spec.md:46`] [SOURCE: `.opencode/specs/sk-design/011-sk-design-styles-utilization/002-md-generator-upgrade/spec.md:13-30`] [SOURCE: `.opencode/specs/sk-design/011-sk-design-styles-utilization/002-md-generator-upgrade/spec.md:47`] [SOURCE: `.opencode/specs/sk-design/011-sk-design-styles-utilization/002-md-generator-upgrade/implementation-summary.md:10-30`] [SOURCE: `.opencode/specs/sk-design/011-sk-design-styles-utilization/003-global-modes-utilization/spec.md:13-30`] [SOURCE: `.opencode/specs/sk-design/011-sk-design-styles-utilization/003-global-modes-utilization/spec.md:47`] [SOURCE: `.opencode/specs/sk-design/011-sk-design-styles-utilization/003-global-modes-utilization/implementation-summary.md:10-31`]
   - Finding class: matrix/evidence
   - Scope proof: An exact continuity/status inventory across the parent and all ten configured child packets found completed lifecycle claims for phases 001-003, but stale pre-run continuity only in the parent and completed phase specs 002/003; planned phases 004-010 consistently remain at 0% with unchecked checklists.
   - Affected surface hints: `parent continuity`, `phase-002 resume`, `phase-003 resume`, `memory/index context`
   - Recommendation: Reconcile the three stale `_memory.continuity` blocks with the already-recorded completion evidence and current next implementation phase; refresh derived metadata through the owning continuity workflow.

```json
{"type":"claim-adjudication","claim":"Canonical packet surfaces give obsolete next actions and completion percentages for already-completed research phases.","evidenceRefs":[".opencode/specs/sk-design/011-sk-design-styles-utilization/spec.md:13-25",".opencode/specs/sk-design/011-sk-design-styles-utilization/spec.md:46",".opencode/specs/sk-design/011-sk-design-styles-utilization/002-md-generator-upgrade/spec.md:13-30",".opencode/specs/sk-design/011-sk-design-styles-utilization/002-md-generator-upgrade/implementation-summary.md:10-30",".opencode/specs/sk-design/011-sk-design-styles-utilization/003-global-modes-utilization/spec.md:13-30",".opencode/specs/sk-design/011-sk-design-styles-utilization/003-global-modes-utilization/implementation-summary.md:10-31"],"counterevidenceSought":"Checked the later status tables, implementation-summary frontmatter, parent phase map, all planned child lifecycle fields, and the phase-parent graph metadata.","alternativeExplanation":"Child resume normally prefers implementation-summary continuity, and a phase parent with no active child may list children rather than execute the stale parent next action; this contains some runtime impact but does not remove the contradictory canonical completion metadata.","finalSeverity":"P1","confidence":0.92,"downgradeTrigger":"Downgrade to P2 only if the owning completion validator and every memory/resume consumer are proven to exclude spec.md continuity fields for these packets."}
```

### P2 Findings
None.

## Traceability Checks
- `spec_code` (core): covered. Exact searches of the configured sk-design hub, registry, and mode contracts found no packet-011 retrieval/proof/context contract in current runtime; this agrees with the parent claim that phases 004-010 are not implemented. The existing md-generator `STUDY` router is a local example-study path, not evidence that the planned corpus substrate landed.
- `checklist_evidence` (core): covered. Phases 004-010 remain planned with 0% continuity and no checked checklist evidence; no false implementation-complete claim was found in those phases.
- `feature_catalog_code` (overlay): not applicable in this iteration; no feature-catalog claim exists in the configured packet evidence.
- `playbook_capability` (overlay): not applicable in this iteration; no manual-playbook or executable-scenario claim exists in the configured packet evidence.

## Integration Evidence
- `.opencode/skills/sk-design/SKILL.md` and `.opencode/skills/sk-design/mode-registry.json`: current hub remains registry-driven and exposes the existing six routes without packet-011 corpus-retrieval fields.
- `.opencode/skills/sk-design/design-md-generator/SKILL.md`: exact searches confirm an existing bounded `STUDY` intent over packaged examples, not the planned phase-004/006 styles-library retrieval and proof contracts.
- Configured interface/foundations/motion/audit/Open Design contracts were searched for the planned corpus/retrieval/proof symbols; no implementation counterevidence was found.

## Edge Cases
- Structural-impact analysis unavailable: the prompt pack explicitly forbids graph/convergence script invocation for this detached lineage, so direct reads and exact searches supplied graphless fallback evidence.
- Severity ambiguity was adjudicated downward from blocker consideration: implementation summaries contain correct child resume state, but the contradictory spec continuity still fails the completion-metadata consistency gate and remains P1.
- Parent `graph-metadata.json` reports aggregate status `planned` and `last_active_child_id: null`; this was not treated as a separate finding because implementation phases remain planned and no currently active child was proven.

## Confirmed-Clean Surfaces
- Parent phase map correctly distinguishes complete research phases 001-003 from planned implementation phases 004-010.
- Planned phases 004-010 consistently disclaim implementation and carry no checked completion evidence.
- Current sk-design contracts do not falsely claim the planned retrieval substrate or shared corpus-context seam is live.

## Ruled Out
- Individual style-bundle content quality: outside the declared packet-level scope.
- Presence of `implementation-summary.md` in phases 004-010 as a false completion signal: ruled out because each summary explicitly says `status: planned`, implementation not started, and 0%.
- Existing md-generator `STUDY` support as proof that phase 006 landed: ruled out because the current path references packaged examples and lacks the planned shared retrieval/proof contracts.

## Next Focus
- dimension: security
- focus area: trust boundaries for planned corpus retrieval, rights/provenance, injection resistance, path handling, and Open Design transport handoff
- reason: correctness inventory is complete; the planned phases introduce security-sensitive content and transport boundaries
- rotation status: rotate from correctness to security
- blocked/productive carry-forward: direct reads and exact searches productive; code graph remains blocked by lineage write containment
- required evidence: phase 004/006/007/010 security requirements and the exact current transport/runtime guardrails

Review verdict: CONDITIONAL
