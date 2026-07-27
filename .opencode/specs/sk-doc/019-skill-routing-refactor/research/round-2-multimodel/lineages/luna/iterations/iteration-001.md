# Iteration 1: Direct-child packet consistency

## Focus
Direct child packet internal consistency, required-file completeness, and completion truthfulness.

## Actions Taken
- Enumerated all 21 direct child directories under the parent, excluding research, benchmark, lineage, log, and run-record surfaces.
- Compared spec.md, implementation-summary.md, graph-metadata.json, checklist.md, and declared levels for every direct child.
- Ran the strict spec validator on representative and known-problem children, then inspected the validator's structural-rule diagnostics.
- Checked commit 140266be3e's changed-file list; it touched parent docs/metadata and the frozen first-pass research lineage, not child packets.

## Findings

### P1: PRE-EXISTING — 012 missing a required Level-3 file
Evidence: spec.md:36 and checklist.md:32 declare Level 3; implementation-summary.md is absent. The strict validator reports FILE_EXISTS failure for the missing Level-3 implementation summary.

### P1: PRE-EXISTING — 012 fails LEVEL_MATCH
Evidence: spec.md:36, plan.md:33, tasks.md:32, checklist.md:32, and decision-record.md:33 carry Level 3 declarations; strict validation still reports LEVEL_MATCH as an error in the same packet. The defect is present before 140266be3e because that commit changed no child file.

### P2: PRE-EXISTING — 017 continuity fields violate the frontmatter memory-block contract
Evidence: implementation-summary.md:15 has a narrative recent_action and :16 has a narrative next_safe_action. The structural validator reports SPECDOC_FRONTMATTER_004 for both fields. The separate missing _memory warning in research/research.md is excluded by the research/** boundary.

### P1: PRE-EXISTING — 019 lifecycle status drift
Evidence: spec.md:46 says Research Complete, implementation-summary.md:45 says Research Complete (100%), while graph-metadata.json:42 remains in_progress. The graph is the machine-authoritative resume surface under context-index.md:113-118, so this is a real completion-truthfulness defect.

### P2: PRE-EXISTING — pending-state representation varies
Evidence: 006 graph-metadata.json:37 is in_progress while spec.md:19 says Analysis complete — decision pending; 015 graph-metadata.json:42 is planned while implementation-summary.md:43 says In Progress (~70%) and checklist.md:76 remains open. These are not completion claims, but they show status vocabulary drift that the lifecycle pass must reconcile.

## Questions Answered
- Direct-child consistency is not uniform; 012, 017, and 019 are confirmed defects, and 015 is a pending-state drift candidate.

## Questions Remaining
- Are the parent graph children_ids and last_active_child_id correct across nested 020/007 and 015 topology?
- Does compiled-routing match the four parent reference documents and seven live hubs?
- Which cross-document links are broken after 140266be3e?

## Sources Consulted
- `.opencode/specs/sk-doc/019-skill-routing-refactor/012-sk-doc-routing-fixes/spec.md:36`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/012-sk-doc-routing-fixes/checklist.md:32`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/017-system-code-graph-routing-research/implementation-summary.md:15-16`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/019-sk-prompt-routing-research/spec.md:46`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/019-sk-prompt-routing-research/implementation-summary.md:45`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/019-sk-prompt-routing-research/graph-metadata.json:42`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/context-index.md:113-118`

## Recommended Next Focus
Verify parent routing-reference claims against the compiled-routing runtime and all seven hub manifests.

## Next Focus
Verify parent routing-reference claims against the compiled-routing runtime and all seven hub manifests.

## Ruled-Out Directions
- Research/** frontmatter warnings were excluded as frozen historical artifacts per the charter.
