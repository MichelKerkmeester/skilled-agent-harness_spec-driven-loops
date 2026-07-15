# Iteration 2: Security - rename apply boundary

## Dispatcher

- Route: 'mode=review target_agent=deep-review'
- Budget profile: 'verify'
- Scope: policy hazard decision, rename-engine plan/apply contract, and disposable-fixture security tests

## Files Reviewed

- '.opencode/specs/sk-doc/019-hyphen-naming-convention/001-convention-policy-and-scope/decision-record.md'
- '.opencode/specs/sk-doc/019-hyphen-naming-convention/005-rename-and-reference-tooling/001-rename-engine/spec.md'
- '.opencode/specs/sk-doc/019-hyphen-naming-convention/005-rename-and-reference-tooling/001-rename-engine/plan.md'
- '.opencode/specs/sk-doc/019-hyphen-naming-convention/005-rename-and-reference-tooling/001-rename-engine/tasks.md'
- '.opencode/specs/sk-doc/019-hyphen-naming-convention/005-rename-and-reference-tooling/001-rename-engine/checklist.md'
- '.opencode/specs/sk-doc/019-hyphen-naming-convention/005-rename-and-reference-tooling/001-rename-engine/decision-record.md'
- '.opencode/specs/sk-doc/019-hyphen-naming-convention/005-rename-and-reference-tooling/003-fixture-corpus-and-dry-run-harness/spec.md'
- '.opencode/specs/sk-doc/019-hyphen-naming-convention/005-rename-and-reference-tooling/003-fixture-corpus-and-dry-run-harness/checklist.md'

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **F003 - Apply is not required to revalidate the reviewed dry-run snapshot** -- '.opencode/specs/sk-doc/019-hyphen-naming-convention/005-rename-and-reference-tooling/001-rename-engine/decision-record.md:77' -- DR-004 puts candidate SHA/worktree identity, map identity, closure, and operation order in the reviewable plan [SOURCE: '.opencode/specs/sk-doc/019-hyphen-naming-convention/005-rename-and-reference-tooling/001-rename-engine/decision-record.md:77-84'], and the phase names concurrent worktrees and non-reproducible execution as risks [SOURCE: '.opencode/specs/sk-doc/019-hyphen-naming-convention/005-rename-and-reference-tooling/001-rename-engine/spec.md:102-110']. None of REQ-001..006, T001..T014, or CHK-001..015 requires explicit apply to reject a changed HEAD/worktree, changed semantic-map hash, dirty index, or plan identity mismatch immediately before the first write [SOURCE: '.opencode/specs/sk-doc/019-hyphen-naming-convention/005-rename-and-reference-tooling/001-rename-engine/spec.md:81-91'; '.opencode/specs/sk-doc/019-hyphen-naming-convention/005-rename-and-reference-tooling/001-rename-engine/checklist.md:29-75']. Recording an identity without enforcing it permits a reviewed plan to be replayed against a different tree.
   - Finding class: cross-consumer
   - Scope proof: Exact searches for stale-plan, HEAD/worktree, candidate, map identity, clean/dirty, and revalidation language across the engine spec, plan, tasks, checklist, decision record, and harness found evidence-recording language but no apply-time invariant.
   - Affected surface hints: 'dry-run plan', 'apply preflight', 'operation journal', 'worktree isolation', 'harness negative scenarios'
   - Recommendation: Make apply consume a plan identifier and atomically revalidate candidate HEAD/worktree identity, clean index/worktree, semantic-map hash, closure, and operation order before any write; add stale-plan and dirty-tree negative fixtures.

~~~json
{"findingId":"F003","type":"contract_safety","claim":"The apply contract records candidate and map identities in the reviewed plan but never requires apply to revalidate those identities before filesystem writes.","evidenceRefs":[".opencode/specs/sk-doc/019-hyphen-naming-convention/005-rename-and-reference-tooling/001-rename-engine/decision-record.md:77-84",".opencode/specs/sk-doc/019-hyphen-naming-convention/005-rename-and-reference-tooling/001-rename-engine/spec.md:81-91",".opencode/specs/sk-doc/019-hyphen-naming-convention/005-rename-and-reference-tooling/001-rename-engine/spec.md:102-110",".opencode/specs/sk-doc/019-hyphen-naming-convention/005-rename-and-reference-tooling/001-rename-engine/checklist.md:29-75"],"counterevidenceSought":"Searched the engine and harness contracts for revalidation, stale-plan rejection, candidate/HEAD matching, map-hash matching, and clean/dirty preconditions; only evidence capture and post-run cleanliness checks were present.","alternativeExplanation":"An implementation might implicitly regenerate the plan during apply, but that behavior is neither required nor verified and therefore cannot be relied on by downstream phases.","finalSeverity":"P1","confidence":0.97,"downgradeTrigger":"Downgrade if an inherited executable contract requires atomic apply-time identity revalidation and the engine checklist cites a negative stale-plan test."}
~~~

2. **F004 - The declared leading-hyphen CLI hazard has no rejecting engine or harness criterion** -- '.opencode/specs/sk-doc/019-hyphen-naming-convention/001-convention-policy-and-scope/decision-record.md:72' -- The policy identifies leading-hyphen targets as a CLI hazard and selects a semantic map to avoid mechanical unsafe names [SOURCE: '.opencode/specs/sk-doc/019-hyphen-naming-convention/001-convention-policy-and-scope/decision-record.md:72-77']. The engine calls 'git mv' after accepting explicit targets, but its acceptance criteria cover leading/double underscores and collision classes rather than rejection or argv-safe handling of an explicit target beginning with '-' [SOURCE: '.opencode/specs/sk-doc/019-hyphen-naming-convention/005-rename-and-reference-tooling/001-rename-engine/spec.md:66-73'; '.opencode/specs/sk-doc/019-hyphen-naming-convention/005-rename-and-reference-tooling/001-rename-engine/spec.md:84-91']. Engine and harness fixture checklists repeat leading/double-underscore coverage but never exercise a leading-hyphen source or target [SOURCE: '.opencode/specs/sk-doc/019-hyphen-naming-convention/005-rename-and-reference-tooling/001-rename-engine/checklist.md:38-61'; '.opencode/specs/sk-doc/019-hyphen-naming-convention/005-rename-and-reference-tooling/003-fixture-corpus-and-dry-run-harness/checklist.md:53-61']. The safety decision is therefore not executable: a map-validation or argv construction regression can reintroduce the exact hazard it was meant to prevent.
   - Finding class: cross-consumer
   - Scope proof: Exact searches for leading-hyphen, argv, option terminator, and unsafe-target fixtures across policy, engine, and harness found the hazard statement but no negative acceptance row.
   - Affected surface hints: 'semantic map validator', 'git mv argv construction', 'engine fixture corpus', 'harness scenario matrix'
   - Recommendation: Specify whether leading-hyphen paths are rejected or normalized to argv-safe repository-relative operands, require option termination where applicable, and add source/target fixtures that prove the chosen behavior.

~~~json
{"findingId":"F004","type":"security","claim":"The policy's explicit leading-hyphen CLI hazard is not converted into a rejecting or argv-safety acceptance criterion for the rename engine or shared harness.","evidenceRefs":[".opencode/specs/sk-doc/019-hyphen-naming-convention/001-convention-policy-and-scope/decision-record.md:72-77",".opencode/specs/sk-doc/019-hyphen-naming-convention/005-rename-and-reference-tooling/001-rename-engine/spec.md:66-73",".opencode/specs/sk-doc/019-hyphen-naming-convention/005-rename-and-reference-tooling/001-rename-engine/spec.md:84-91",".opencode/specs/sk-doc/019-hyphen-naming-convention/005-rename-and-reference-tooling/003-fixture-corpus-and-dry-run-harness/checklist.md:53-61"],"counterevidenceSought":"Searched policy, engine, and harness documents for leading-hyphen fixtures, argv/option-terminator rules, and explicit unsafe-target rejection; only the policy hazard statement was found.","alternativeExplanation":"A generic unsafe-target validator could reject leading hyphens, but the term is undefined and its acceptance criteria omit the known hazard, so the behavior is not verifiable.","finalSeverity":"P1","confidence":0.94,"downgradeTrigger":"Downgrade if a cited inherited path grammar unambiguously excludes leading-hyphen segments and the harness verifies that inherited rule."}
~~~

### P2 Findings

None.

## Traceability Checks

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| 'spec_code' | fail | hard | engine 'spec.md:81-91'; engine 'decision-record.md:77-84' | Security decisions are not fully expressed as executable acceptance criteria. |
| 'checklist_evidence' | fail | hard | engine 'checklist.md:29-75'; harness 'checklist.md:53-75' | Neither stale-plan nor leading-hyphen negative proof is required. |
| 'feature_catalog_code' | notApplicable | advisory | n/a | No feature-catalog behavior was claimed in this pass. |
| 'playbook_capability' | notApplicable | advisory | n/a | No playbook behavior was claimed in this pass. |

## Integration Evidence

- Checked the policy-to-engine-to-harness chain, not the engine spec in isolation.
- Graphless fallback used: direct reads and exact searches across all executable contract documents.

## Edge Cases

- Path traversal and symlink-following are covered by CHK-014 in both the engine and harness.
- Exact, case-folded, and NFC-normalized collisions have explicit pre-write failure criteria.
- Dry-run non-mutation, partial-failure journaling, and rollback have explicit fixture requirements.

## Confirmed-Clean Surfaces

- The supplied repository-root boundary and symlink-directory boundary are explicit.
- The harness forbids applying to the real migration worktree and forbids executing fixture code for discovery.

## Ruled Out

- **No repository-boundary protection**: ruled out by engine CHK-014 and harness CHK-014.
- **Collision handling deferred until after writes**: ruled out by engine REQ-002 and CHK-008.

## Next Focus

- Dimension: traceability
- Focus area: parent/child references, phase adjacency, and executable cross-links after nested decomposition
- Reason: iteration 1 showed topology drift; a cross-packet reference sweep can measure its downstream reach and distinguish a parent-only defect from systematic routing breakage
- Rotation status: security pass complete; broaden into dependency traceability
- Required evidence: broken relative-link inventory, stale phase-number references, and manifest-to-document edge checks

## Assessment

- New findings: P0=0 P1=2 P2=0
- New findings ratio: 0.5
- Status: complete
- Verdict basis: P1 security-contract findings remain active; no P0 found

Review verdict: CONDITIONAL
