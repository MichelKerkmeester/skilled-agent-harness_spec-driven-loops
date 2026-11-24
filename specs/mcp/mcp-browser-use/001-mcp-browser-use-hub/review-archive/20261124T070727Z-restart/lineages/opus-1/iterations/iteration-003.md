# Iteration 003 - Traceability: parent and child status claims against shipped state

## Dispatcher
- Lineage opus-1, iteration 3, dimension traceability. steer.md: not present.
- Review focus: compared what each phase claims (spec status, goal checkboxes, handoff table, continuity) with what shipped, centring on the parent's aggregate claims and 013's REQ-006 "no hub gate regresses".

## Files Reviewed
- specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/spec.md:17,24,46,130-147
- specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/goal.md:17,24
- specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/graph-metadata.json:53
- specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/005-routing-and-surfaces/spec.md:23, implementation-summary.md:47,157-158
- specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/013-fix-alignment-findings-for-browser-hub-docs/spec.md:91,106-107,130; implementation-summary.md:105-130
- 009-013 implementation-summary.md continuity (completion_pct 100 each)

## Findings by Severity

### P0 Findings
None.

### P1 Findings
None new. Refinement of O1-I1-P1-001: 013's own REQ-006 ("No hub gate regresses", 013 spec.md:130) is the requirement the `_utils.sh` drift breaks; its verification table (implementation-summary.md:105-120) lists the hub check, playbook validators, advisor suite and freshness panel but not `mcp-installers.test.cjs`, which is why the regression went unseen. Severity unchanged.

### P2 Findings
1. **Parent handoff table still carries template placeholders for 006 -> 007** -- specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/spec.md:146 -- The row reads `[Criteria TBD] | [Verification TBD]` in a parent whose status is Complete; every other handoff row names a criterion and a command.
   Finding class: unfilled template placeholder.
   Scope proof: parent spec.md in scope.
   Affected surface hints: parent spec.md Phase Handoff Criteria; 007 goal criteria are the natural source.
   Case: a reader checking whether 007 could start finds no criterion for the 006 -> 007 handoff.
2. **Parent continuity and graph metadata contradict the Complete status** -- specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/graph-metadata.json:53 -- graph-metadata says `"status": "in_progress"` with `last_active_child_id` 012 (013 shipped after it); spec.md:17,24 keep `next_safe_action: "Start 002-hub-scaffold"` and `completion_pct: 0`; goal.md:17,24 keep `completion_pct: 0`. spec.md:46 says Complete and every child 009-013 records completion_pct 100.
   Finding class: stale continuity metadata.
   Scope proof: parent docs in scope.
   Affected surface hints: parent spec.md and goal.md `_memory.continuity`, graph-metadata.json derived block.
   Case: `/speckit:resume` on the parent reads "Start 002-hub-scaffold" as the next safe action for a finished epic.

## Traceability Checks
- spec_code: partial. 005 status "Partial" is consistent across 005 spec.md:23, 005 implementation-summary.md:47 and the parent phase map row 5; the prior C2-I3-P2-001 mismatch is resolved. 013's Devin allowlist and freshness-panel edits are in its own scope (013 spec.md:91,106-107), so not scope creep. 013 REQ-006 is broken by O1-I1-P1-001.
- checklist_evidence: partial. Parent handoff row placeholder (finding 1); parent continuity stale (finding 2).

## Integration Evidence
- None beyond spec docs; no commands run this iteration except greps.

## Edge Cases
- 013 Known Limitations (implementation-summary.md:126-130) openly record the Aside evidence script and out-of-scope top-level `await` docs; treated as honest deferrals, not findings.

## Confirmed-Clean Surfaces
- 012 -> 013 counts (91 + 21 = 112) match 013's description and commit message.

## Ruled Out
- 013 scope creep via Devin allowlist and freshness panel: declared in 013 spec.md:91.
- 005 status mismatch (prior C2-I3-P2-001): resolved.

## Next Focus
- Dimension: maintainability. Focus: hub docs/router/registry consistency after 013 (version stamps, changelog coverage, duplicated helper libraries, playbook result records). Required evidence: file:line.

Review verdict: CONDITIONAL
