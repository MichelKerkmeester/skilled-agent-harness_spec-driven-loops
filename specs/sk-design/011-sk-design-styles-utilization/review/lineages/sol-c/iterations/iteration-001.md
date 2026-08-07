# Iteration 1: Correctness and Lifecycle State

## Dispatcher

- Budget profile: scan
- Dimension: correctness
- Target: `.opencode/specs/sk-design/011-sk-design-styles-utilization`
- Structural caveat: code graph trust state is absent; direct reads and recursive strict validation were used.

## Files Reviewed

- `.opencode/specs/sk-design/011-sk-design-styles-utilization/spec.md:10-29,41-47,95-125`
- `.opencode/specs/sk-design/011-sk-design-styles-utilization/graph-metadata.json:1-17,23-106`
- `.opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/implementation-summary.md:10-31,53-74,109-127`
- `.opencode/specs/sk-design/011-sk-design-styles-utilization/002-md-generator-upgrade/spec.md:10-30,40-52`
- `.opencode/specs/sk-design/011-sk-design-styles-utilization/002-md-generator-upgrade/implementation-summary.md:10-31,53-72,110-129`
- `.opencode/specs/sk-design/011-sk-design-styles-utilization/003-global-modes-utilization/spec.md:10-30,40-52`
- `.opencode/specs/sk-design/011-sk-design-styles-utilization/003-global-modes-utilization/implementation-summary.md:10-31,53-72,107-127`
- Child implementation summaries 004-010, with planned/not-started state verified directly.

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **Resume continuity points back to completed research instead of the current implementation frontier** -- `.opencode/specs/sk-design/011-sk-design-styles-utilization/spec.md:15-16` -- The parent continuity says the packet was just initialized and directs the next session to run child 001, while the same document declares research phases 001-003 complete and implementation phases 004-010 scaffolded at line 46. Child 002 and 003 repeat the same stale-charter pattern in their continuity blocks even though their metadata says Complete (`002.../spec.md:15-16,47`; `003.../spec.md:15-16,47`). Resume recovery reads `_memory.continuity` before canonical body sections, so this can route a resumed session into redundant research rather than phase 004.
   - Finding class: cross-consumer
   - Scope proof: direct reads covered the parent and all three completed research children; 001 continuity is current, while parent/002/003 are stale.
   - Affected surface hints: parent resume, child 002 resume, child 003 resume, phase-004 handoff
   - Recommendation: reconcile each stale continuity block to the completed research state and set the parent next safe action to the phase-004 implementation frontier.

```json
{"findingId":"F001","claim":"The resume-first continuity blocks in the parent and research children 002-003 direct sessions to already-completed research rather than the current phase-004 frontier.","evidenceRefs":[".opencode/specs/sk-design/011-sk-design-styles-utilization/spec.md:15-16",".opencode/specs/sk-design/011-sk-design-styles-utilization/spec.md:46",".opencode/specs/sk-design/011-sk-design-styles-utilization/002-md-generator-upgrade/spec.md:15-16",".opencode/specs/sk-design/011-sk-design-styles-utilization/002-md-generator-upgrade/spec.md:47",".opencode/specs/sk-design/011-sk-design-styles-utilization/003-global-modes-utilization/spec.md:15-16",".opencode/specs/sk-design/011-sk-design-styles-utilization/003-global-modes-utilization/spec.md:47"],"counterevidenceSought":"Compared each spec continuity block with its metadata status, implementation-summary frontmatter, and the parent phase map; 001 is current but parent, 002, and 003 retain pre-run actions.","alternativeExplanation":"The continuity blocks may have been intentionally left as historical creation notes, but the framework defines recent_action and next_safe_action as live resume inputs, so historical wording is not safe there.","finalSeverity":"P1","confidence":0.96,"downgradeTrigger":"Downgrade to P2 only if the resume runtime is proven not to consume these continuity fields or a newer handover surface deterministically overrides all three.","transitions":[{"iteration":1,"from":null,"to":"P1","reason":"Initial discovery"}]}
```

### P2 Findings

None.

## Traceability Checks

- `spec_code`: pending for the dedicated traceability pass; this iteration only confirmed lifecycle claims against packet artifacts.
- `checklist_evidence`: pending for the dedicated traceability pass.
- Recursive strict validation: PASS for the parent and all ten child packets, with 0 errors and 0 warnings per packet.

## Integration Evidence

- The parent phase map and all child status summaries agree that 001-003 are complete and 004-010 are planned.
- The strict validator confirms structural and cross-document status consistency, but it does not compare semantic contents of `_memory.continuity` against body status.

## Edge Cases

- Planned implementation summaries are not false completion claims: each explicitly says nothing is built and all relevant checks are pending.
- `graph-metadata.json.derived.last_active_child_id` is null, but phase-parent resume has a documented child-list fallback; this was not promoted to an active finding.

## Confirmed-Clean Surfaces

- Parent child list exactly matches the ten on-disk phase folders.
- Child 004-010 planned statuses agree between specs and implementation summaries.
- Phase order is consistent across the parent map and predecessor/successor links inspected in child specs.

## Ruled Out

- Missing implementation for phases 004-010: ruled out because these are explicit planning scaffolds.
- Parent recursive validation failure: ruled out by a strict recursive PASS.

## Next Focus

- Dimension: security
- Focus area: rights, provenance, injection, leak, cache, and authority-order controls across phases 004-010
- Reason: these controls form the highest-risk cross-phase boundary and must be consistent before traceability synthesis.
- Rotation status: correctness covered once; security pending.
- Required evidence: direct spec/plan/decision citations and current mode/transport contract checks where claims depend on shipped behavior.

## Verdict

One active P1 lifecycle-routing finding remains.

Review verdict: CONDITIONAL
