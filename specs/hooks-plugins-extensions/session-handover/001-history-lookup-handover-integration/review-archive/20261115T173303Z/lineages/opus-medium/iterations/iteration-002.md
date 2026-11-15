# Iteration 002 - Traceability + Maintainability over docs, tests and sub-track move

## Dispatcher
- Lineage: opus-medium (fan-out), session fanout-opus-medium-1794748073879-re9m5r, inline executor.
- Dimension: traceability, maintainability.
- Review focus coverage: f320d9d9bcd (feature catalog, playbook, compaction-adapters.vitest.ts, 006 hop proof), cede6d301ab and 70c47ad5e00 (sub-track declaration and move), and the v4.0.2.1 changelog section from 967a825df3a checked against the run records. steer.md: not present.

## Files Reviewed
- .skilled/skills/system-spec-kit/runtime/tests/compaction-adapters.vitest.ts:1-263
- .skilled/skills/system-spec-kit/feature-catalog/context-preservation/compaction-history-lookup.md:1-40, 85
- .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-lookup.md:24-46, 147, 166
- .skilled/changelog/skilled/v4.0.2.1.md (section "A Claimed Note Offers the Sender's History")
- specs/hooks-plugins-extensions/session-handover/graph-metadata.json
- specs/.../spec.md:55
- specs/.../006-docs-and-live-hop-proof/implementation-summary.md:87-113
- specs/.../001-hop-recall-baseline/scratch/runs/lookup-after-r1..r7/result.json

## Findings by Severity

### P0 Findings
None.

### P1 Findings
None new. OM-001 is downgraded to P2 (see refinement below).

### P2 Findings
1. **OM-001 refined: the five-runtime loss is disclosed in user-facing docs, so the residual defect is the phase 005 and parent-spec text** -- specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/005-deprecate-compaction-offer/plan.md:123 -- The feature catalog (compaction-history-lookup.md:25, :35), the playbook (:26) and the changelog all state that only Claude Code and Codex senders get the section and mark the compaction removal as breaking. That makes the capability loss an accepted, disclosed decision. What stays wrong is phase 005's mitigation ("Phase 004's claim tests own the offer that reaches OpenCode") and the parent spec scope, which never limits the feature to two runtimes.
   Finding class: spec drift
   Scope proof: 005 docs in 8cd3fa79da9; catalog in f320d9d9bcd.
   Affected surface hints: 005/plan.md section 5, 005/spec.md risks, parent spec.md scope.
   Case: a reader of phase 005 believes OpenCode receivers still get a lookup through the claim and skips writing a replacement.
2. **Catalog entry and playbook page are still named and triggered as a compaction feature** -- .skilled/skills/system-spec-kit/feature-catalog/context-preservation/compaction-history-lookup.md:2 -- The title "Compaction history lookup", the file name and the first trigger phrase "compaction history lookup" describe the path that 8cd3fa79da9 removed, while the body (:21-23) says the lookup is offered at claim and never after a compaction. The playbook page `plugins-and-hooks/compaction-history-lookup.md` has the same name. Trigger-index retrieval for "handoff history lookup" works, but the name steers a reader to the retired behaviour.
   Finding class: naming drift
   Scope proof: both files rewritten in f320d9d9bcd.
   Affected surface hints: feature-catalog/context-preservation/compaction-history-lookup.md, manual-testing-playbook/plugins-and-hooks/compaction-history-lookup.md, feature-catalog.md index row.
   Case: an operator searches the catalog for the compaction lookup and lands on an entry whose title promises a behaviour the body says is gone.
3. **Parent spec still names a scaffold placeholder as its parent packet after the sub-track move** -- specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/spec.md:55 -- `Parent Packet` reads `scaffold/001-history-lookup-handover-integration`, while the folder now sits under `hooks-plugins-extensions/session-handover` (graph-metadata parent_id). 70c47ad5e00 moved the packet and updated graph metadata but left this row.
   Finding class: metadata drift
   Scope proof: move commit 70c47ad5e00 and sub-track declaration cede6d301ab.
   Affected surface hints: parent spec.md metadata table.
   Case: a reader following the Parent Packet row looks for a `scaffold/` folder that does not exist.
4. **Hop-proof counts disagree inside the phase 006 summary** -- specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/006-docs-and-live-hop-proof/implementation-summary.md:99 -- Line 99 reports "3 of 3 counted runs" after the reader fix, line 111 says "Six counted runs per side", and line 113 says two runs were excluded because the sender copied the detail into the note. The run records show seven lookup-after runs: r1 leaked the note (note_leaked=1, excluded), r2 and r4 answered `missing`, r3, r5, r6 and r7 answered `correct`. Only one run leaked, and the six-per-side claim does not match the three counted runs. The changelog's "three of three receivers" is true only for runs after the reader fix.
   Finding class: evidence drift
   Scope proof: 006 summary and run records added in de26d18cbdf and f320d9d9bcd.
   Affected surface hints: 006/implementation-summary.md verification and limitations; v4.0.2.1 changelog section.
   Case: a reader reconciling the summary with the run folders counts four correct of six non-leaked runs, not three of three, and cannot tell which runs were excluded.

## Traceability Checks
- spec_code: partial -- carried from iteration 1; catalog/playbook text matches code (Claude/Codex only, re-mint at claim), phase 005 and parent spec do not.
- checklist_evidence: partial -- 006 counts inconsistent (finding 4); 004 T005/T006 (iteration 1) still open.
- feature_catalog_code: pass on behaviour, partial on naming (finding 2).
- playbook_capability: pass -- playbook scenarios name the CLI codes the code returns.

## Integration Evidence
- compaction-adapters.vitest.ts asserts `not.toContain('History Lookup')` for Pi (:181), Devin (:201) and DSH (:261), and keeps the summary and `/speckit:resume` pointer cases that phase 005 REQ-004 requires.

## Edge Cases
- compaction-adapters.vitest.ts afterEach removes only WORKSPACE-keyed state files (:57); every recordLastSpecFolder call uses the default cwd, so no leak today.
- The two tests named "keeps the recovery pointer whole..." (:155, :186) sit in different describe blocks and do not collide.

## Confirmed-Clean Surfaces
- cede6d301ab sub-track graph metadata lists the packet as its only child, with parent_id hooks-plugins-extensions.
- Feature catalog body accurately describes the claim-time mint, the 30-minute freshness and the Claude/Codex limit.

## Ruled Out
- Missing negative assertion for the removed offer in the kept adapters: present for all three runtimes.

## Next Focus
- Max iterations reached; synthesis next.

Review verdict: PASS
