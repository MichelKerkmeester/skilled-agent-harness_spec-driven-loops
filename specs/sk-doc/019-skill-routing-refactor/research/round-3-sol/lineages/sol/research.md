# Second-Pass Skill-Routing Packet Audit

## 1. Executive Summary

The ten-iteration max-depth audit found **27 canonical defects: 22 P1 and 5 P2; 4 NEW from commit `140266be3e` and 23 PRE-EXISTING**. The recent parent-doc fix introduced four defects: an internal 2/7-versus-7/7 rollout contradiction, a stale operator-gated-default claim, broken parent handoff paths, and a false 7/7 route-gold denominator. The deeper pre-existing defects cluster around child packet required files, lifecycle truth, resume pointers, stale maps/paths, and an incomplete seven-hub hard-invariant closure.

Terminal verification resolved **62/62 canonical source anchors**, found all ten iteration and delta artifacts, and reproduced the severity/provenance totals. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/research/round-3-sol/lineages/sol/iterations/iteration-010.md:6-12]

## 2. Scope

- Audited the parent packet, all 21 direct children, selected nested trees under 020 and 021, the full 020/005 eight-child subtree, and the 019→020→007→015 resume chain.
- Compared parent routing canon with `.opencode/bin/lib/compiled-routing/` and all seven live hubs.
- Reviewed every canonical non-frozen hunk changed by `140266be3e`.
- Excluded frozen `research/**`, `benchmark/**`, `lineages/**`, `*.out`, `*.log`, and run-record artifacts as defect candidates.

## 3. Method

The loop used direct canonical-file reads, strict packet validation, exact target probes, Git object/blame checks, live seven-hub resolver calls, and `parent-skill-check.cjs`. Convergence remained telemetry until the configured tenth iteration. Iteration 9 reconciled overlaps; iteration 10 mechanically verified the final set.

## 4. Parent-Level Regressions

Four defects were introduced by `140266be3e`:

- **P1 · NEW:** mixed 2/7 and 7/7 typed-resource rollout claims.
- **P1 · NEW:** `context-index.md` says fleet default remains operator-gated although the resolver is default-on.
- **P2 · NEW:** the handoff row names nonexistent `020/spec.md` and `021/spec.md` paths.
- **P1 · NEW:** “7/7 hubs PASS” overstates route-gold applicability; canonical evidence defines six applicable hubs.

## 5. Direct Children

The direct-child pass verified four P1 defects: 012 fails its Level-3 file contract, 017 has an invalid `_memory.continuity` block, 015 is planned in spec/graph but in progress in its summary, and 019 claims research complete while graph/continuity remain stale. Planned 013/014 and lean phase parents 020/021 were ruled out as false required-file analogues. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/research/round-3-sol/lineages/sol/iterations/iteration-001.md:18-27]

## 6. Nested Topology

Resume safety is degraded at three levels: 020 and 020/007 have null active-child pointers; nested 015 has a stale pointer to child 011; and its phase map exposes 12 of 14 children. Duplicate `012-*` prefixes are ambiguous only for numeric-only selection; complete canonical IDs remain safe. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/research/round-3-sol/lineages/sol/iterations/iteration-002.md:6-15]

## 7. Live Routing Runtime

Compiled serving is live and default-on for all seven hubs, and all seven ship the four routed resource surfaces. Parent prose nevertheless conflates benchmark typed-resource replay with live compiled destination serving. Manifest guards 10a-10d pass, but sk-design still fails hard topology invariant 6a because `styles/` is unregistered/unallowlisted. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/research/round-3-sol/lineages/sol/iterations/iteration-003.md:6-16]

## 8. Link Integrity

Beyond the new parent handoff break, direct child 012 retains stale snake_case sk-doc paths, direct child 013 uses removed `mcp_server` and stale hook names in executable tasks, and 020's context index leaves the base of “New location” paths ambiguous. No non-excluded Markdown-link target survived as an additional defect. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/research/round-3-sol/lineages/sol/iterations/iteration-004.md:6-15]

## 9. Lifecycle Truth

Nested 009 claims Complete with an unresolved P0 strict-validation gate. Nested 013 claims Complete/100% while P1/P2 items and sign-off remain open. The 021 phase parent remains planned with no active-child pointer although child 011 is active. The 020/005 parent and several children similarly overstate or understate lifecycle state. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/research/round-3-sol/lineages/sol/iterations/iteration-005.md:6-15] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/research/round-3-sol/lineages/sol/iterations/iteration-006.md:6-14]

## 10. Canonical Finding Register

| ID | Severity | Provenance | Finding | Evidence |
|---|---|---|---|---|
| CF-01 | P1 | PRE-EXISTING | Direct child 012 violates its declared Level-3 file/level contract. | [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/012-sk-doc-routing-fixes/spec.md:36-60] |
| CF-02 | P1 | PRE-EXISTING | Direct child 017 has an invalid `_memory.continuity` block. | [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/017-system-code-graph-routing-research/implementation-summary.md:10-39] |
| CF-03 | P1 | PRE-EXISTING | Direct child 015 is planned in spec/graph but in progress in summary with an open P1 gate. | [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/015-sk-code-router-alignment/spec.md:58-65] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/015-sk-code-router-alignment/implementation-summary.md:43-52] |
| CF-04 | P1 | PRE-EXISTING | Direct child 019 claims research complete while graph/continuity remain stale. | [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/019-sk-prompt-routing-research/implementation-summary.md:13-27] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/019-sk-prompt-routing-research/graph-metadata.json:41-48] |
| CF-05 | P1 | PRE-EXISTING | Null pointers at 020 and 020/007 prevent deterministic automatic descent. | [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/graph-metadata.json:109-110] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/graph-metadata.json:111-112] |
| CF-06 | P2 | PRE-EXISTING | Duplicate `012-*` numbers make numeric-only selection ambiguous. | [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/spec.md:44-50] |
| CF-07 | P1 | PRE-EXISTING | Nested 015 metadata has 14 children but its phase map exposes only 12. | [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/spec.md:30-45] |
| CF-08 | P1 | PRE-EXISTING | Nested 015 resumes to stale child 011 rather than later work. | [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/graph-metadata.json:154-169] |
| CF-09 | P1 | NEW | Routing canon simultaneously says typed resources are 2/7 and 7/7 populated. | [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:45-64] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:180-200] |
| CF-10 | P1 | PRE-EXISTING | Parent prose conflates benchmark replay with live compiled destination serving. | [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:64-68] [SOURCE: .opencode/bin/lib/compiled-routing/011-runtime-engine/lib/compiled-route.cjs:94-107] |
| CF-11 | P1 | NEW | `context-index.md` says fleet default remains operator-gated although runtime is default-on. | [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/context-index.md:108-112] [SOURCE: .opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs:29-42] |
| CF-12 | P1 | PRE-EXISTING | `spec.md` independently retains the stale operator-gated/default-on contradiction. | [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/spec.md:71-75] |
| CF-13 | P1 | PRE-EXISTING | Fleet hard-invariant closure is false because sk-design fails invariant 6a. | [SOURCE: .opencode/commands/doctor/scripts/parent-skill-check.cjs:884-900] [SOURCE: .opencode/skills/sk-design/styles/README.md:1] |
| CF-14 | P2 | NEW | Parent handoff row names recoverably wrong `020/spec.md` and `021/spec.md`. | [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/spec.md:124-134] |
| CF-15 | P1 | PRE-EXISTING | Direct child 012's scope table uses stale pre-migration sk-doc paths. | [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/012-sk-doc-routing-fixes/spec.md:112-125] |
| CF-16 | P1 | PRE-EXISTING | Direct child 013's verification commands use removed paths/names. | [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/013-skill-advisor-routing-fixes/tasks.md:67-74] |
| CF-17 | P2 | PRE-EXISTING | 020's context index leaves the base for “New location” paths ambiguous. | [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/context-index.md:13-22] |
| CF-18 | P1 | NEW | “7/7 hubs PASS” overstates route-gold applicability; six hubs are applicable. | [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-before-after.md:152-161] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/001-3-tier-consistency-standard/verification-report.md:47-55] |
| CF-19 | P1 | PRE-EXISTING | Nested 009 claims Complete while its P0 strict-validation gate remains open. | [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/009-sk-doc-template-alignment/checklist.md:103-139] |
| CF-20 | P2 | PRE-EXISTING | Nested 013 claims Complete/100% while P1/P2 items and sign-off remain open. | [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/013-compiled-coverage-buildout/checklist.md:120-148] |
| CF-21 | P1 | PRE-EXISTING | 021 parent remains planned with no active pointer although child 011 is active. | [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/021-documentation-quality-program/graph-metadata.json:45-48] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/021-documentation-quality-program/graph-metadata.json:105-106] |
| CF-22 | P1 | PRE-EXISTING | 020/004 and 020/006 declare Level 2 but omit required canonical files. | [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/004-oob-glm-parallel-research/spec.md:21-31] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/006-unified-refactor-research/spec.md:23-31] |
| CF-23 | P2 | PRE-EXISTING | 020/004 says Research complete in spec but in progress in graph. | [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/004-oob-glm-parallel-research/spec.md:10-12] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/004-oob-glm-parallel-research/graph-metadata.json:34-40] |
| CF-24 | P1 | PRE-EXISTING | All eight 020/005 idea children declare Level 2 but omit required files. | [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/005-oob-idea-deep-dives/001-compiled-policy-collapse/spec.md:69-71] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/005-oob-idea-deep-dives/008-trp-decomposition/spec.md:68-72] |
| CF-25 | P1 | PRE-EXISTING | 020/005 children 001-004 claim complete without required completion evidence. | [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/005-oob-idea-deep-dives/001-compiled-policy-collapse/spec.md:25] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/005-oob-idea-deep-dives/004-no-wrong-door-handoff/spec.md:25] |
| CF-26 | P1 | PRE-EXISTING | 020/005 parent overstates children 005-007 as complete while graphs remain in progress. | [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/005-oob-idea-deep-dives/spec.md:43-46] |
| CF-27 | P1 | PRE-EXISTING | 020/005 parent remains planned with null pointer although child 008 is unfinished. | [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/005-oob-idea-deep-dives/graph-metadata.json:41-44] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/005-oob-idea-deep-dives/graph-metadata.json:95-103] |

## 11. Recommendations

1. Fix the four NEW parent regressions first because they undermine the corrective commit's own authority.
2. Repair direct-child 012/017 validation failures and reconcile direct-child 015/019 lifecycle metadata.
3. Restore deterministic resume pointers at 020, 020/007, 020/007/015, 020/005, and 021.
4. Bring incomplete Level-2/3 child packets into their declared documentation contracts or lower their declared levels/statuses truthfully.
5. Separate benchmark resource-replay authority from live compiled-serving authority in parent canon.
6. Resolve sk-design invariant 6a before claiming full seven-hub hard-invariant closure.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Treat 013/014 planned summaries as 012 analogues | Their planned-state file/level checks pass. | [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/013-skill-advisor-routing-fixes/graph-metadata.json:42-48] | 1 |
| Treat phase-parent heavy-doc absence as failure | 020/021 and 020/005 are lean phase parents. | [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/graph-metadata.json:41] | 1, 6 |
| Treat duplicate `012` as canonical-resume collision | Exact full IDs resolve safely; only numeric-only selection is ambiguous. | [SOURCE: .opencode/skills/system-spec-kit/shared/gate-3-classifier.ts:519-535] | 2 |
| Declare 91/106 and 91/91 false | Canonical evidence supports the arithmetic; raw records are only provenance-limited. | [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/001-3-tier-consistency-standard/verification-report.md:47-55] | 3, 5, 9 |
| Declare compiled fleet activation false | Live resolver proof returned compiled decisions for all seven hubs. | [SOURCE: .opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs:29-42] | 3, 5 |
| Treat 015 as having only 12 children | Metadata has 14; the phase map alone is stale at 12. | [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/graph-metadata.json:6-20] | 2, 9 |

## Divergence Map

- Saturated directions: direct-child matrix, 020/005 eight-child inventory, and parent changed-hunk review.
- Productive pivots: direct children → nested resume topology → live runtime → links → lifecycle claims → other nested trees → commit closure → reconciliation.
- Remaining frontier: implementation/remediation was explicitly out of scope.
- Council artifacts: none; divergent mode was not used.

## 12. Open Questions

- Which remediation packet should own the four NEW regressions versus the 23 PRE-EXISTING defects?
- Should incomplete child packets be completed to their declared Level or reclassified to match their actual research-only contents?
- Which child should be authoritative for each stale `last_active_child_id` after operator review?

## 13. Limitations

- Raw frozen benchmark/run records were excluded, so route-gold arithmetic was verified from promoted canonical reports rather than replayed.
- The code graph was empty; direct file and executable evidence was used instead.
- Iterations 6 and 8 used suffixed `resolved_route` strings. The mechanical verifier accepted them, and their base route fields remained correct; prior append-only records were not rewritten.

## 14. Negative Knowledge

Generic backticked filenames, schema-owned logical IDs, historical rename provenance, and lean phase-parent omissions were not treated as broken links or required-file defects without contextual proof. Broad recursive validator output was narrowed before promotion to avoid descendant and excluded-artifact false positives.

## 15. Verification

- `verify-iteration.cjs`: all ten iterations passed narrative, route-proof, and delta checks.
- Canonical sources: 62/62 anchors resolved.
- Artifact sequence: iterations 001-010 and deltas 001-010 present.
- Final count: 27 findings = 22 P1 + 5 P2 = 4 NEW + 23 PRE-EXISTING.

## 16. References

- `iterations/iteration-001.md` through `iterations/iteration-010.md`
- `deltas/iter-001.jsonl` through `deltas/iter-010.jsonl`
- `deep-research-state.jsonl`
- `deep-research-strategy.md`
- `findings-registry.json`
- `resource-map.md`

## 17. Convergence Report

- Stop reason: `maxIterationsReached`
- Total iterations: 10
- Questions answered: all scoped research and terminal verification questions
- Canonical findings: 27
- Severity: 22 P1, 5 P2
- Provenance: 4 NEW, 23 PRE-EXISTING
- Novelty trend: `0.75, 1.00, 1.00, 1.00, 0.75, 0.83, 0.88, 0.00, 0.10, 0.10`
- Convergence before iteration 10 was telemetry only under `stopPolicy=max-iterations`.
