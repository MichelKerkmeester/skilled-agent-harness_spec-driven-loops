# Iteration 2: Active Topology and Migration Residue

## Focus

Remove archive/fixture noise from the inventory and determine which numbering and phase-topology findings remain actionable in the live tree.

## Actions Taken

1. Reclassified packet candidates by excluding archive, scratch, fixture, benchmark-fixture, backup, and sandbox segments.
2. Compared every track's direct active numbering with its direct `z_archive` ceiling.
3. Read the migration parent and the skipped `sk-doc` and `system-deep-loop` phase summaries to distinguish known decisions from newly discovered residue.
4. Sampled active phase-parent candidates that still retain heavy documents.

## Findings

1. After excluding historical/test surfaces, 2,168 active packet candidates remain and 847 candidates are classified as archive, backup, fixture, scratch, or sandbox copies. This active-only denominator is a better basis for later metadata drift estimates. [SOURCE: repository active-scope inventory command, 2026-07-16]
2. Archive-first numbering is structurally clean in the completed migration tracks: `system-speckit` uses `026-041` above archive ceiling `025` plus the explicitly accepted coordinator `000`; `system-code-graph` is contiguous `025-035` above archive ceiling `024`; `sk-design` is contiguous `001-009`; and `sk-code`/`sk-git` begin immediately above their archive ceilings. [SOURCE: repository track-number inventory command, 2026-07-16] [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/spec.md:122-130]
3. `sk-doc` is the clearest live deferred numbering problem. Direct active packets `001-013` overlap the archive ceiling `013`, and the active range includes discontinuities (`019-031`, then `033-998`) that the skipped alignment packet deliberately left to the concurrent owner. Separately, child numbering under `015-sk-doc-parent` reuses six sibling prefixes (`010` through `015`). [SOURCE: repository track-number inventory command, 2026-07-16] [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/004-sk-doc-alignment/implementation-summary.md:54-61] [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/004-sk-doc-alignment/implementation-summary.md:103-107]
4. `system-deep-loop` has no archive overlap, but its active top-level numbering remains discontinuous (`029,030,031,032,033,035,038,052,054,059,063,065,066,067,068`) because the operator selected but skipped the high-blast renumber. Several gaps are explained by phase-parent regrouping, while `024-028` remains explicitly unknown/tolerated. Its phase summary also records stale `children_ids`, including one untraceable entry, as an unresolved follow-up. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/002-system-deep-loop-renumber/implementation-summary.md:58-63] [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/002-system-deep-loop-renumber/implementation-summary.md:107-113]
5. Fifteen active phase-parent candidates retain one or more heavy documents despite the current lean-trio contract. Confirmed examples include `sk-doc/017-benchmark-authoring-centralization` and `system-deep-loop/054-smart-routing-benchmark-program`, both of which contain child phase maps plus root `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, and `implementation-summary.md`. This is real policy-shape residue, but remediation requires a grandfathering/migration decision because the documents may contain canonical history. [SOURCE: repository active phase-parent inventory command, 2026-07-16] [SOURCE: .opencode/specs/sk-doc/017-benchmark-authoring-centralization/spec.md:35-40] [SOURCE: .opencode/specs/system-deep-loop/054-smart-routing-benchmark-program/spec.md:53-63] [SOURCE: AGENTS.md:291-298]

## Questions Answered

- Q1 substantially answered for track-level numbering and active topology.
- Q2 partially answered: migration residue is concentrated in explicitly skipped tracks and phase-parent policy shape.

## Questions Remaining

- Q2 still needs stale cross-reference and graph-parent evidence.
- Q3-Q5 remain open.

## Ruled Out

- Treating all top-level numbering gaps as data loss was ruled out: deep-loop documents phase-parent regrouping and an intentional archive deletion.
- Treating old names inside packet titles as stale path evidence was ruled out; historical packet names can legitimately preserve migration context.

## Dead Ends

- A simple contiguous-range check is unusable for sentinel numbers such as `999` and explicit coordinator `000` exceptions.

## Sources Consulted

- `.opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/spec.md:68-92,122-150`
- `.opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/002-system-deep-loop-renumber/implementation-summary.md:53-63,107-113`
- `.opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/004-sk-doc-alignment/implementation-summary.md:54-61,103-107`
- `.opencode/specs/sk-doc/017-benchmark-authoring-centralization/spec.md:30-60`
- `.opencode/specs/system-deep-loop/054-smart-routing-benchmark-program/spec.md:53-92`
- `AGENTS.md:291-298`

## Assessment

- New information ratio: 0.80
- Novelty justification: three findings are fully new and two refine inventory candidates into decision-backed live residue.
- Confidence: high for current track numbering; medium for phase-parent remediation because grandfather policy is not established.

## Reflection

- What worked and why: combining current filesystem counts with the migration phase summaries separated unresolved decisions from accidental drift.
- What did not work and why: lexical legacy-name matching cannot tell durable historical names from broken references.
- What I would do differently: use exact path-reference validation and metadata reconciliation rather than filename vocabulary.

## Recommended Next Focus

Quantify and sample completion-state drift: spec status versus graph metadata, checklist completion, implementation-summary state, placeholder frontmatter, stale continuity fingerprints, and parent/child completion contradictions.
