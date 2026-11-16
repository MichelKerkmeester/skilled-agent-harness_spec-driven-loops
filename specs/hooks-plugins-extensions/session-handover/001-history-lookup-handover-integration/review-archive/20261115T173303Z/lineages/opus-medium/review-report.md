# Deep Review Report - opus-medium lineage

## 1. Executive Summary
- Overall verdict: PASS
- hasAdvisories: true
- Active findings: P0=0, P1=0, P2=7
- Review scope: packet `specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration` and commits 198162c7f11, 7973b80ab0b, 50c5472789e, de26d18cbdf, 8cd3fa79da9, f320d9d9bcd, 4cb3db7a787, cede6d301ab, 70c47ad5e00, plus the v4.0.2.1 changelog section from 967a825df3a and the unlisted files claude.mjs, vibe/compaction-context.mjs and compaction-adapters.vitest.ts.
- Operator review focus: Review the work in these commits: 198162c7f11 7973b80ab0b 50c5472789e de26d18cbdf 8cd3fa79da9 f320d9d9bcd 4cb3db7a787 cede6d301ab 70c47ad5e00 (inspect each with git show), plus the section A Claimed Note Offers the Sender History added to .skilled/changelog/skilled/v4.0.2.1.md in merge commit 967a825df3a. Also cover files the phase docs do not list: .skilled/hooks/shared/session-readers/claude.mjs, .skilled/hooks/session-lifecycle/vibe/compaction-context.mjs and .skilled/skills/system-spec-kit/runtime/tests/compaction-adapters.vitest.ts. Do not review other commits in the surrounding history.
- Stop reason: maxIterationsReached (2 of 2). Tests were not re-run by this lineage.

## 2. Planning Trigger
`/speckit:plan` is not required; the P2 advisories can be fixed in one doc-and-small-code follow-up.

```json
{"label":"Planning Packet","triggered":false,"verdict":"PASS","hasAdvisories":true,"activeFindings":["OM-001","OM-002","OM-003","OM-004","OM-005","OM-006","OM-007"],"remediationWorkstreams":["WS-1 phase-doc truth (OM-001, OM-003 SC-003, OM-004, OM-006, OM-007)","WS-2 claim-path ordering and dead prepare write (OM-002, OM-003)","WS-3 catalog/playbook naming (OM-005)"],"specSeed":["State in the parent spec scope that only Claude Code and Codex senders get the claim-time lookup"],"planSeed":["Move the sameCheckout check ahead of the mint in handoverLookupSection","Decide whether prepare keeps its mint"],"findingClasses":["spec drift","ordering / side effect before guard","dead write / spec drift","checklist evidence drift","naming drift","metadata drift","evidence drift"],"affectedSurfacesSeed":[".skilled/hooks/session-handover/lib/relaunch-core.cjs",".skilled/hooks/session-handover/bin/session-handover.cjs","specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/spec.md","specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/004-offer-lookup-at-claim/spec.md","specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/004-offer-lookup-at-claim/tasks.md","specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/005-deprecate-compaction-offer/plan.md","specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/006-docs-and-live-hop-proof/implementation-summary.md",".skilled/skills/system-spec-kit/feature-catalog/context-preservation/compaction-history-lookup.md"],"fixCompletenessRequired":false}
```

## 3. Active Finding Registry
| ID | Sev | Title | Dimension | file:line | Fix |
|----|-----|-------|-----------|-----------|-----|
| OM-001 | P2 (was P1) | Phase 005 says the claim path covers OpenCode, and the parent spec never limits the feature to two runtimes. The claim path serves only Claude/Codex senders, and the compaction offer was removed on five runtimes | traceability | specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/005-deprecate-compaction-offer/plan.md:123; .skilled/hooks/session-handover/lib/relaunch-core.cjs:910-915 | Correct the phase 005 risk/mitigation and add the runtime limit to the parent spec scope |
| OM-002 | P2 | Claim mints and persists before the sameCheckout guard | correctness | .skilled/hooks/session-handover/lib/relaunch-core.cjs:983-988 | Check placement/sameCheckout before minting |
| OM-003 | P2 | Prepare-time mint has no consumer on the claim path; 004 SC-003 is false | correctness | .skilled/hooks/session-handover/bin/session-handover.cjs:603-607 | Drop the prepare mint or have the claim read it; correct SC-003 |
| OM-004 | P2 | 004 T005/T006 checked done for a re-stamp helper and test never built | traceability | specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/004-offer-lookup-at-claim/tasks.md:47-48 | Re-word or uncheck the tasks to match the re-mint design |
| OM-005 | P2 | Catalog entry/playbook page still named as a compaction feature | maintainability | .skilled/skills/system-spec-kit/feature-catalog/context-preservation/compaction-history-lookup.md:2 | Rename title/trigger (and file if the catalog allows) to the handoff-claim lookup |
| OM-006 | P2 | Parent spec Parent Packet row is a scaffold placeholder | traceability | specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/spec.md:55 | Set it to the session-handover sub-track or None |
| OM-007 | P2 | 006 summary counts disagree with each other and with run records | traceability | specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/006-docs-and-live-hop-proof/implementation-summary.md:99,111,113 | Restate which runs count and why; align the limitation lines |

Each finding's case is in the iteration narratives (iteration-001.md, iteration-002.md).

## 4. Remediation Workstreams
- P0: none. P1: none.
- P2 advisories: WS-1 phase-doc truth, WS-2 claim-path ordering and dead prepare write, WS-3 catalog/playbook naming.

## 5. Spec Seed
- Parent spec section 3: add "Senders on runtimes other than Claude Code and Codex get no claim-time lookup" to Out of Scope.
- 004 SC-003: re-state as "A claim whose sender transcript cannot be found prints no section".

## 6. Plan Seed
- Reorder handoverLookupSection: compute placement of the receiver and the note cwd, compare, then mint.
- Decide and record whether the prepare mint stays.
- Fix 005 plan section 5, 004 tasks T005/T006, 006 counts, parent Parent Packet row, catalog title.

## 7. Traceability Status
- Core: spec_code partial (OM-001, OM-003); checklist_evidence partial (OM-004, OM-007).
- Overlay: feature_catalog_code partial (OM-005, naming only); playbook_capability pass; skill_agent and agent_cross_runtime not applicable to this target.
- AC_COVERAGE: exempt for this lineage (no acceptance-criteria.md at the phase parent; not assessed per child).

## 8. Deferred Items
- No live Codex hop was run (006 limitation 2); Codex claim coverage is unit-test only.

## Dimension Expansion Map
- Swept: correctness, security (iteration 1); traceability, maintainability (iteration 2). No pivots.

## 9. Search Ledger
*No search-depth state captured (legacy v1 record)*

## 10. Audit Appendix
- Convergence: stopped at maxIterations=2; newFindingsRatio 1.0 then 0.88.
- Coverage: 4/4 dimensions.
- Ruled out: note session_id path traversal (regex guard); cross-workspace hook-state collision (sha256(sessionId) key); missing negative assertions in kept compaction adapters.
- Sources: see Files Reviewed in each iteration.
- Core Protocols: spec_code partial, checklist_evidence partial.
- Overlay Protocols: feature_catalog_code partial, playbook_capability pass.
