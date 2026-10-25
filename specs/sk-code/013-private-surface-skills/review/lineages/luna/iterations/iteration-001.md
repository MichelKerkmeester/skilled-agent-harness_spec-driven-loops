# Deep Review Iteration 1

## Dispatcher

- Target: specs/sk-code/013-private-surface-skills (spec-folder)
- Mode: review
- Executor: cli-codex, gpt-6-luna
- Dimension: correctness
- Sources include current parent and child status records; existing research was treated as pointer material only.

## Dimension

Correctness: checked whether the packet's completion state agrees across its parent spec, goal, phase map, and phase metadata.

## Files Reviewed

- specs/sk-code/013-private-surface-skills/spec.md — metadata and phase map, lines 50, 133–145.
- specs/sk-code/013-private-surface-skills/goal.md — completion checklist and progress, lines 89–112.
- specs/sk-code/013-private-surface-skills/002-hub-surface-removal/spec.md — phase 2 metadata and remaining tasks, lines 33–34.
- specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup/spec.md — phase 3 status, line 33.
- specs/sk-code/013-private-surface-skills/004-private-local-skills/spec.md — phase 4 status, line 43.
- specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/spec.md — phase 5 status and predecessor, lines 33–40.
- specs/sk-code/013-private-surface-skills/review/lineages/luna/steer.md — absent before this iteration.

## Findings by Severity

### P0 Findings

None.

### P1 Findings

1. **Packet completion status contradicts active phase records** — specs/sk-code/013-private-surface-skills/spec.md:50 — The parent metadata says Complete; the goal checks all completion criteria and calls phases 2 and 3 Done, but the parent phase map says phase 2 is In progress and phase 3 is Pending, while phase 2 still records T103 as partial and T105/T106/T108 as open. That leaves the packet's completion and phase-advance state ambiguous and can cause an operator to stop work or advance from stale status. [SOURCE: specs/sk-code/013-private-surface-skills/spec.md:50] [SOURCE: specs/sk-code/013-private-surface-skills/spec.md:136] [SOURCE: specs/sk-code/013-private-surface-skills/spec.md:137] [SOURCE: specs/sk-code/013-private-surface-skills/goal.md:89] [SOURCE: specs/sk-code/013-private-surface-skills/goal.md:111] [SOURCE: specs/sk-code/013-private-surface-skills/002-hub-surface-removal/spec.md:34] [SOURCE: specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup/spec.md:33]
   Finding class: phase_status_drift
   Scope proof: This finding concerns the target packet's declared completion and phase-transition records.
   Affected surface hints: packet-status, phase-transition, completion-gate
   Case: An operator follows the checked goal and parent Complete status and stops, although phase 2's child still lists open work.
   Claim adjudication: The root and goal claim completion, while the root's phase map and child phase 2 record incomplete work; counterevidence is the goal's checked criteria and completed phase 4/5 metadata, which does not resolve the direct phase 2 conflict.
   Alternative explanation: These fields may have been authored at different times or may mean document readiness versus implementation readiness, but the packet does not distinguish those meanings.
   Downgrade trigger: Downgrade to P2 if root Status is defined as documentation-only and the phase 2 open-task metadata is proven stale.

### P2 Findings

None.

## Traceability Checks

- spec_code: partial — the parent status and child phase 2 task state disagree.
- checklist_evidence: partial — goal completion boxes are checked while phase 2 still lists open tasks.
- Overlay protocols skill_agent, agent_cross_runtime, feature_catalog_code, and playbook_capability: not evaluated in this correctness pass; reserved for traceability review.

## Integration Evidence

The fixed phase order requires phase 3 to follow phase 2 and phase 4 to follow phase 3. The explicit phase 2 incomplete record conflicts with the packet's separate completion claims. [SOURCE: specs/sk-code/013-private-surface-skills/spec.md:143] [SOURCE: specs/sk-code/013-private-surface-skills/spec.md:144]

## Edge Cases

- Later phases marked Complete do not prove the phase 2 child is complete; the parent says phase 2 remains in progress and its child lists open tasks.
- The packet goal could be a stale copy, but no in-scope status contract says its completion table is historical.

## Confirmed-Clean Surfaces

- Phase 2's stated predecessor/order and phase 3's predecessor metadata are consistent with the fixed sequence; the finding is status drift, not a claim that the sequence itself is wrong.

## Ruled Out

- No implementation conclusion was drawn from research summaries or unchecked source paths.

## Next Dimension

Security. Inspect the local-* ignore, symlink containment, and private-root discovery boundaries in the advisor and generated-output paths; defer graph-based discovery because graph writes are outside this lineage's scope.

## Next Focus

- Dimension: security
- Focus area: trace private-root and local-symlink handling through advisor readers and tracked-output writers.
- Reason: the privacy invariant depends on excluding private skill material from tracked outputs while allowing declared local routing.
- Rotation status: first pass
- Blocked/productive carry-forward: direct status reads were productive; graph-upsert steps remain blocked by the lineage write boundary.
- Required evidence: exact source lines in code and the phase 3 security requirements.

## SCOPE VIOLATIONS

- The YAML graph seed and per-iteration graph upsert target packet-root graph metadata outside the bound lineage path. Those writes were skipped; iteration search coverage therefore uses graphless fallback.
- A higher-priority runtime continuity directive already caused a session handoff note and a generate-context.js --full-auto save outside the lineage. The save reported two modified files; a read-only status check shows specs/sk-code/013-private-surface-skills/description.json modified, while the second modified path could not be isolated from other workspace changes. This violates the user's lineage-only write boundary and makes this lineage ineligible for a scope-clean completion claim.

## Verdict

The status mismatch is P1 and changes the packet's completion signal. No P0 was found in this focused pass.

Review verdict: CONDITIONAL
