# Review Iteration 002

## Dimension

Maintainability: template conformance, Phase R evidence quality, and lifecycle-status coherence for children 006-008.

## Files Reviewed

- `.opencode/specs/system-speckit/028-memory-search-intelligence/006-presentation-layer-fixes/spec.md:50-195`
- `.opencode/specs/system-speckit/028-memory-search-intelligence/006-presentation-layer-fixes/plan.md:66-149`
- `.opencode/specs/system-speckit/028-memory-search-intelligence/006-presentation-layer-fixes/tasks.md:56-134`
- `.opencode/specs/system-speckit/028-memory-search-intelligence/006-presentation-layer-fixes/implementation-summary.md:48-149`
- `.opencode/specs/system-speckit/028-memory-search-intelligence/007-search-index-integrity-sweep/{spec,plan,checklist,tasks,implementation-summary}.md`
- `.opencode/specs/system-speckit/028-memory-search-intelligence/008-metadata-rename-reconciliation/{spec,plan,checklist,tasks,implementation-summary}.md`

## Findings By Severity

### P0

None.

### P1

#### R2-P1-001: Phase R remediation scope and evidence are incomplete in child 006

- Claim: The Phase R task addendum records eight completed cross-cutting remediation tasks, but the packet's canonical scope and delivered-files evidence do not cover all of those changes.
- Evidence: `006.../tasks.md:123-133` adds T021-T028, including `context-server.ts` envelope handling and the all-tools dispatch test. `006.../spec.md:109-132` limits the recorded files-to-change to presentation assets, `memory-context.ts`, and adjacent scope. `006.../implementation-summary.md:73-89` does not list `context-server.ts` or the dispatch-test surface among changed files.
- Counterevidence sought: The task addendum explicitly declares child 006 owner of cross-cutting public-contract parity work (`tasks.md:123-126`), and the implementation summary does list some related schema/type/test paths (`implementation-summary.md:79-89`).
- Alternative explanation: The addendum may intentionally be the authoritative closeout for work discovered after the original specification was frozen.
- Finding class: class-of-bug.
- Scope proof: The four core packet documents were compared; only the task addendum carries the expanded Phase R scope and its per-task acceptance claims.
- Affected surface hints: `006 spec scope`, `006 implementation-summary file ledger`, `Phase R remediation tasks`.
- Recommendation: Reconcile the Phase R additions into the packet's scope/deliverables and implementation-summary evidence, including the actual changed files and test evidence, or explicitly move them to their owning packet.
- Final severity: P1.
- Confidence: 0.92.
- Downgrade trigger: Evidence that a canonical cross-cutting closeout document deliberately supersedes the packet-local scope and file ledger for T021-T028.

#### R2-P1-002: Children 007 and 008 publish conflicting lifecycle states

- Claim: Resumption metadata, plan state, and completion documents give incompatible instructions about whether the packets are complete or blocked.
- Evidence: Every 007 document's continuity block says "Phase R audit remediation completed" with no blockers (`007.../spec.md:15-31`, `plan.md:15-27`, `checklist.md:15-27`, `tasks.md:15-27`, `implementation-summary.md:15-38`), while its checklist leaves P0 safety-net and completion checks open (`checklist.md:76-93`) and its implementation summary declares `PARTIAL / VERIFICATION BLOCKED` (`implementation-summary.md:49-58`). Child 008's spec declares `Complete` (`008.../spec.md:53-60`) and its checklist/tasks mark completion (`checklist.md:143-152`, `tasks.md:98-104`), but its plan still reports `completion_pct: 0` (`plan.md:14-29`) and every definition-of-done item is unchecked (`plan.md:94-105`).
- Counterevidence sought: 008's implementation summary gives concrete final verification evidence (`implementation-summary.md:104-145`), and 007's packet documents consistently preserve the operational blockers outside their continuity blocks.
- Alternative explanation: The stale plan and continuity values may be intentionally preserved historical planning metadata rather than current routing state.
- Finding class: class-of-bug.
- Scope proof: The status fields, checklists, tasks, plans, and implementation summaries of both Level 2 packets were compared.
- Affected surface hints: `continuity metadata`, `plan definition of done`, `checklist`, `implementation summary`.
- Recommendation: Make each packet expose one current lifecycle state in continuity metadata, plan gates, checklist, and implementation summary; preserve historical execution facts in narrative sections rather than active routing fields.
- Final severity: P1.
- Confidence: 0.97.
- Downgrade trigger: Evidence that the resume ladder ignores the conflicting continuity/plan fields and consumes only the implementation-summary state.

### P2

#### R2-P2-001: Child 007 retains template-path labels in public titles

- Evidence: `007.../spec.md:2`, `plan.md:2`, `checklist.md:2`, and `implementation-summary.md:2` append `[template:level_2/<file>.md]` to title metadata.
- Finding class: instance-only.
- Recommendation: Remove the template-source path from user-facing titles while retaining the existing `SPECKIT_TEMPLATE_SOURCE` markers for provenance.

## Traceability Checks

- `spec_code`: Not applicable. This slice was restricted to packet documentation; source-code claims were not adjudicated.
- `checklist_evidence`: Failed for the lifecycle/status direction. Child 007's unchecked P0/P1 checklist entries conflict with its active continuity completion claim; child 008's unchecked plan definition-of-done conflicts with completion claims.
- `skill_agent`: Covered. The review followed the deep-review artifact and severity contract.
- `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`: Not applicable to this documentation-only slice.

## Verdict

CONDITIONAL. Two P1 documentation-alignment findings require lifecycle and evidence reconciliation before the reviewed child packets are reliable handoff inputs.

## Next Dimension

Traceability for children 009-012, focusing on the same template, evidence, and status-coherence lenses.

Review verdict: CONDITIONAL
