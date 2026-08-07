# Iteration 1: Direct-Child Packet Consistency Inventory

## Focus
Mechanically inventoried all 21 direct children `001-*` through `021-*` for declared level, spec/summary/graph status, checklist completion, and required-file consistency. Nested descendants and all excluded `research/**`, `benchmark/**`, `lineages/**`, `*.out`, `*.log`, and run-record artifacts were not treated as defect candidates. Commit `140266be3e` changed parent documents and historical research artifacts, but no direct-child canonical packet file, so every defect below is **PRE-EXISTING** rather than **NEW**.

## Inventory

| Children | Result | Evidence |
|---|---|---|
| 001-005, 007-011, 016-017 | Declared complete/research-complete; implementation summary present; graph status complete; applicable checklists fully checked | [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/001-router-audit-and-fix-map/graph-metadata.json:42] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/011-skill-advisor-routing-research/graph-metadata.json:42] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/017-system-code-graph-routing-research/graph-metadata.json:41] |
| 006 | Analysis complete/decision pending; graph in progress; 13/14 checklist items checked; internally consistent pending state | [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/006-create-skill-router-marker-gap/graph-metadata.json:37] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/006-create-skill-router-marker-gap/implementation-summary.md:17] |
| 012-014 | Planned Level-3 packets with unchecked checklists and planned graph status; 012 alone fails strict required-file and level-consistency gates | [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/012-sk-doc-routing-fixes/spec.md:36] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/012-sk-doc-routing-fixes/checklist.md:52] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/013-skill-advisor-routing-fixes/graph-metadata.json:42] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/014-benchmark-harness-typed-wiring/graph-metadata.json:42] |
| 015 | Implementation is in progress, while spec and graph remain planned; two checklist items remain open | [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/015-sk-code-router-alignment/spec.md:60] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/015-sk-code-router-alignment/implementation-summary.md:43] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/015-sk-code-router-alignment/graph-metadata.json:42] |
| 018 | Planned/0%-in-progress scaffold with planned graph status; no contradictory completion claim | [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/018-system-deep-loop-routing-research/implementation-summary.md:45] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/018-system-deep-loop-routing-research/graph-metadata.json:42] |
| 019 | Spec and summary claim research complete, but graph remains in progress | [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/019-sk-prompt-routing-research/spec.md:46] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/019-sk-prompt-routing-research/implementation-summary.md:45] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/019-sk-prompt-routing-research/graph-metadata.json:42] |
| 020-021 | Correctly recognized as phase parents, so the lean trio—not Level-3 child required files—is authoritative | [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/graph-metadata.json:41] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/021-documentation-quality-program/graph-metadata.json:45] |

## Findings
1. **P1 · PRE-EXISTING — 012 fails both required-file and level-consistency validation.** The packet declares Level 3, remains Planned, and has a fully unchecked checklist; its metadata key-file list includes the five authored Level-3 planning documents but no `implementation-summary.md`. The strict validator reported `FILE_EXISTS` missing one Level-3 file and `LEVEL_MATCH` errors. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/012-sk-doc-routing-fixes/spec.md:36] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/012-sk-doc-routing-fixes/spec.md:57-60] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/012-sk-doc-routing-fixes/graph-metadata.json:43-49] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/012-sk-doc-routing-fixes/checklist.md:52-55]
2. **P1 · PRE-EXISTING — 017's known `_memory` defect is reproducible.** The implementation summary's `_memory.continuity` block spans lines 10-39; strict validation reports three `FRONTMATTER_MEMORY_BLOCK` errors even though spec, summary, and graph all agree that research is complete. This is a structural metadata defect, not a lifecycle-status disagreement. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/017-system-code-graph-routing-research/implementation-summary.md:10-39] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/017-system-code-graph-routing-research/spec.md:44-51] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/017-system-code-graph-routing-research/graph-metadata.json:41-48]
3. **P1 · PRE-EXISTING — 015 materially understates active work as Planned on two surfaces.** Its spec says Planned and graph metadata says planned, while the summary says In Progress (~70%) and the live-mode P1 checklist gate remains unchecked. The packet therefore cannot be reliably resumed from spec/graph status alone. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/015-sk-code-router-alignment/spec.md:58-65] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/015-sk-code-router-alignment/implementation-summary.md:43-52] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/015-sk-code-router-alignment/graph-metadata.json:41-48] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/015-sk-code-router-alignment/checklist.md:72-77]
4. **P1 · PRE-EXISTING — 019's graph and continuity metadata are stale after research completion.** The spec and summary both claim Research Complete (100%), but graph metadata remains `in_progress`; the summary's continuity block still says the loop is pending and records 0% completion. Strict validation also reports one memory-block issue. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/019-sk-prompt-routing-research/spec.md:44-51] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/019-sk-prompt-routing-research/implementation-summary.md:13-27] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/019-sk-prompt-routing-research/implementation-summary.md:44-54] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/019-sk-prompt-routing-research/graph-metadata.json:41-48]

## Ruled Out
- 013 and 014 superficially resemble 012 because they are planned Level-3 packets without implementation summaries, but both pass strict `FILE_EXISTS` and `LEVEL_MATCH`; absence alone is not an analogous defect for their current lifecycle state. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/013-skill-advisor-routing-fixes/graph-metadata.json:42-48] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/014-benchmark-harness-typed-wiring/graph-metadata.json:42-48]
- 020 and 021 are phase parents. Treating their absent heavy documents as Level-3 required-file failures would be a false positive. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/graph-metadata.json:41] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/021-documentation-quality-program/graph-metadata.json:45]
- No direct-child defect was introduced by `140266be3e`; that commit's packet changes are parent-level canonical docs plus excluded historical research artifacts. [INFERENCE: based on `git show --name-only 140266be3e` and the cited direct-child file histories]

## Dead Ends
None. The mechanical direct-child matrix was productive; nested phase-child validator failures are deferred because this iteration was explicitly direct-child-only.

## Edge Cases
- Ambiguous input: none; “DIRECT child packets” was interpreted strictly as the 21 immediate `001-*` through `021-*` directories.
- Contradictory evidence: 015 and 019 preserve both sides of their status contradictions above rather than collapsing them.
- Missing dependencies: code graph was empty by strategy context, so direct file reads and strict validation were authoritative.
- Partial success: strict validation of 020/021 recursively emitted extensive nested-child output; only the direct phase-parent classification was used, and nested failures were excluded from findings.

## Sources Consulted
- [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/012-sk-doc-routing-fixes/spec.md:36-60]
- [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/012-sk-doc-routing-fixes/graph-metadata.json:42-49]
- [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/015-sk-code-router-alignment/spec.md:58-65]
- [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/015-sk-code-router-alignment/implementation-summary.md:43-52]
- [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/017-system-code-graph-routing-research/implementation-summary.md:10-39]
- [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/019-sk-prompt-routing-research/implementation-summary.md:13-27]
- [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/019-sk-prompt-routing-research/graph-metadata.json:42]

## Assessment
- New information ratio: 0.75 (015 and 019 fully new; known 012 and 017 independently verified and therefore partially new)
- Questions addressed: q1 direct-child consistency; q2 analogous defects; q4 defects introduced by `140266be3e`
- Questions answered: q1 (inventory complete and four direct-child defects identified); q2 (015 and 019 are analogous metadata/status failures); q4 for this focus (no direct-child defect is NEW)

## Reflection
- What worked and why: a direct-directory inventory followed by narrow reads and strict validation separated genuine direct-child defects from planned-packet and phase-parent false positives.
- What did not work and why: broad recursive grep and recursive phase-parent validation included nested and excluded artifacts, so those outputs were used only to guide narrower direct-file verification.
- What I would do differently: run a direct-depth-only validator wrapper first, avoiding recursive 020/021 output while retaining strict checks for 001-019.

## Recommended Next Focus
Audit parent and nested lifecycle topology separately: verify `children_ids`, `derived.last_active_child_id`, the 020/007 duplicate-012 prefix collision, and the 015 sub-parent resume path without reclassifying the direct-child findings above.
