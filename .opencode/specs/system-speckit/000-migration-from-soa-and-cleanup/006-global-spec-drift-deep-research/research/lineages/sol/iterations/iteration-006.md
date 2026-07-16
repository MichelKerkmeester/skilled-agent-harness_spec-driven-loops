# Iteration 6: Global Drift and Migration-Residue Taxonomy

## Focus

Close the global inventory and migration-residue questions by ranking confirmed drift classes according to integrity impact, ownership, rebuildability, and historical intent.

## Actions Taken

1. Reconciled the active-only inventory and topology findings from iterations 1-3.
2. Compared completed, skipped, and deferred migration phase evidence to avoid classifying accepted decisions as accidental defects.
3. Ranked source-semantic, numbering, graph-parent, policy-shape, derived-index, and historical findings by remediation urgency.

## Findings

1. **P1 source-semantic integrity:** completion authority is the broadest actionable drift class. Across 2,168 active candidates, 212 terminal-spec/nonterminal-graph and 19 inverse conflicts exist; checklist state disagrees in both directions; 1,093 specs use zero continuity fingerprints; 13 retain literal status templates; and 60 phase parents contradict direct-child graph status. These conditions can misroute resume, freshness, and completion checks even when every metadata file parses. [SOURCE: iterations/iteration-003.md:13-25]
2. **P1 accepted but owner-required numbering/topology:** `sk-doc` retains direct active/archive overlap and six duplicate child prefixes under `015-sk-doc-parent`; `system-deep-loop` retains the operator-selected but skipped renumber plus stale `children_ids`. These are not surprise drift, but they remain live integrity debt owned by their active migration programs and should not be normalized as healthy topology. [SOURCE: iterations/iteration-002.md:14-20] [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/004-sk-doc-alignment/implementation-summary.md:45-67,101-107] [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/002-system-deep-loop-renumber/implementation-summary.md:94-112]
3. **P1 isolated broken ownership pointer:** the completed system-speckit renumber records a surviving `packet_pointer` in `040-base-files-renumbering-name-cleanup` to a deleted `skilled-agent-orchestration/z_archive/090-...` path. Unlike documented historical names, this is a canonical-pointer decision still requiring an owner and target. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/001-system-speckit-renumber/implementation-summary.md:113-118]
4. **P2 policy-shape residue:** fifteen active phase-parent candidates retain heavy root documents despite the current lean-trio contract. The files may contain canonical history, so the correct action is a grandfather/migration policy decision, not mechanical deletion. [SOURCE: iterations/iteration-002.md:14-20]
5. **P2 rebuildable derived-index residue:** 152 stale `descriptions.json` paths after code-graph renames and stale sk-design track-root `children_ids` are documented reindex follow-ups. A clean memory rebuild can address the search-index class, but track-root graph metadata may require its own supported regeneration path. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/003-system-code-graph-cleanup/implementation-summary.md:78-105] [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/005-sk-design-reconstruct/implementation-summary.md:119-124]
6. **Informational or resolved history:** archive gaps backed by deletion commits, coordinator `000`, sentinel numbers, rename-mapping tables, archived copies, fixtures, backups, and reconstructed packets with explicit source banners are not defects by themselves. Completed migrations left system-speckit, system-code-graph, sk-design, sk-code, and sk-git structurally clean at track level. [SOURCE: iterations/iteration-001.md:13-20,31-38] [SOURCE: iterations/iteration-002.md:14-20,32-39]
7. The reliable global baseline is therefore 3,015 raw spec candidates across 12 tracks, reduced to 2,168 active candidates after excluding 847 historical/test copies. Drift detection must use the active denominator and provenance-aware classifications; raw file absence, lexical legacy names, and simple contiguous-number checks are not valid fleet-wide severity models. [SOURCE: iterations/iteration-001.md:13-20] [SOURCE: iterations/iteration-002.md:14-20]

## Questions Answered

- Q1 answered: the active fleet is 2,168 packet candidates, with primary drift in completion semantics, deferred sk-doc/deep-loop topology, one broken ownership pointer, phase-parent policy shape, and limited derived-index residue.
- Q2 answered: migration residue separates into completed clean tracks, accepted operator-skipped live debt, explicit reindex follow-ups, policy-age residue, and harmless historical records.

## Questions Remaining

- None. All five key questions now have evidence-backed answers.

## Ruled Out

- Treating accepted skips as completed remediation.
- Treating every historical path/name or numbering gap as a live defect.
- Treating all metadata drift as rebuildable derived-index state.
- Mechanically deleting heavy phase-parent docs without a grandfather policy.

## Dead Ends

- A single severity rank cannot cover both source-semantic contradictions and intentionally preserved historical artifacts without provenance and ownership dimensions.

## Sources Consulted

- `iterations/iteration-001.md`
- `iterations/iteration-002.md`
- `iterations/iteration-003.md`
- `.opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/001-system-speckit-renumber/implementation-summary.md`
- `.opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/002-system-deep-loop-renumber/implementation-summary.md`
- `.opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/003-system-code-graph-cleanup/implementation-summary.md`
- `.opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/004-sk-doc-alignment/implementation-summary.md`
- `.opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/005-sk-design-reconstruct/implementation-summary.md`

## Assessment

- New information ratio: 0.35
- Novelty justification: the severity/ownership/rebuildability taxonomy is new, while its seven classes consolidate evidence established in earlier iterations.
- Confidence: high for inventory counts and documented decisions; medium for remediation priority because cross-lineage synthesis may alter final ordering.

## Reflection

- What worked and why: ranking by integrity, ownership, and rebuildability prevented accepted history from competing with active source-semantic failures.
- What did not work and why: a flat defect list obscures the difference between unresolved owner debt and harmless historical evidence.
- What I would do differently: make provenance and authoritative-owner fields mandatory in future generated graph metadata.

## Recommended Next Focus

Independently falsify the highest-impact conclusions using exact-path and current-file checks, with emphasis on duplicate sibling numbers, broken ownership pointers, status contradictions, and teardown rebuild boundaries.
