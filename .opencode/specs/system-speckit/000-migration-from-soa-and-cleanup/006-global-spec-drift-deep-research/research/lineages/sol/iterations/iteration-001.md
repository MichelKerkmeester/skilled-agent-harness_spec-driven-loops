# Iteration 1: Quantitative Full-Tree Inventory

## Focus

Establish the size and topology of `.opencode/specs`, identify candidate structural drift, and distinguish actionable packet anomalies from archives, backups, fixtures, and documentation-level differences.

## Actions Taken

1. Recursively inventoried files, Markdown documents, `spec.md` packet candidates, track distribution, and packet depth.
2. Classified archive membership, canonical metadata presence, repeated numeric prefixes, and phase-parent heavy-document residue.
3. Searched the full Markdown corpus for context-optimization vocabulary to size the later evidence pass.

## Findings

1. The tree contains 12 top-level tracks, 44,470 files, 28,297 Markdown files, and 3,015 directories containing `spec.md`. Packet candidates are highly concentrated in `system-speckit` (1,411), `system-deep-loop` (607), and `sk-doc` (337), so those three tracks dominate both true drift and false-positive risk. [SOURCE: repository inventory command over .opencode/specs, 2026-07-16]
2. Topology is deeply nested: packet candidates range from depth 1 through depth 10, with 2,075 candidates at depths 4-6 and 657 candidates under a `z_archive` segment. Any drift detector that assumes only track/packet or parent/child depth will miss substantial historical structure. [SOURCE: repository inventory command over .opencode/specs, 2026-07-16]
3. Raw canonical-file absence is not itself a reliable drift signal. The 8 candidates missing `description.json` are benchmark fixtures/templates, and most of the 37 missing `graph-metadata.json` are timestamped `.backup-*` copies, fixtures, or scratch templates. Likewise, missing `plan.md`, `tasks.md`, `checklist.md`, or `implementation-summary.md` can be valid for phase parents, lower documentation levels, archives, or fixtures. [SOURCE: repository inventory command over .opencode/specs, 2026-07-16]
4. A concrete active numbering collision exists under `.opencode/specs/sk-doc/015-sk-doc-parent`: sibling prefixes `010`, `011`, `012`, `013`, `014`, and `015` are each reused by two different child packets. This is outside `z_archive` and matches the global migration packet's concern about residual numbering drift. [SOURCE: .opencode/specs/sk-doc/015-sk-doc-parent/010-create-benchmark/spec.md:1] [SOURCE: .opencode/specs/sk-doc/015-sk-doc-parent/010-subskill-doc-review/spec.md:1]
5. There are 323 directories that look like phase parents because they contain numbered child specs. Several active and archived parents still carry heavy documents despite the current lean-trio phase-parent contract; this is a candidate policy-age or migration-residue class, not yet a confirmed defect. [SOURCE: repository inventory command over .opencode/specs, 2026-07-16] [SOURCE: AGENTS.md:291-298]
6. Context-optimization terminology is widespread enough that keyword presence alone is low precision: continuity appears in 14,511 Markdown files, deduplication in 9,269, token/context-window terms in 886, summarization/progressive-disclosure terms in 694, pruning/decay terms in 627, and working-memory terms in 267. The next passes must identify named mechanism packets and outcome evidence rather than count boilerplate frontmatter. [SOURCE: repository keyword inventory command over .opencode/specs, 2026-07-16]

## Questions Answered

- Q1 partially answered: global scale, concentration, archive share, depth, and one active duplicate-number cluster are established.

## Questions Remaining

- Q1 needs active-only convention analysis and ownership/topology validation.
- Q2-Q5 remain open.

## Ruled Out

- Treating every `spec.md` as a live canonical packet was ruled out because fixtures, backups, scratch templates, archive copies, and track-root specs are mixed into the same filename surface.
- Treating missing heavy documents as automatic drift was ruled out because documentation level and phase-parent mode intentionally alter required files.

## Dead Ends

- Broad keyword counts for `continuity` and `session_dedup` mostly measure repeated frontmatter, not distinct optimization work.

## Sources Consulted

- `.opencode/specs/**/spec.md` and adjacent canonical packet files, recursively inventoried.
- `.opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/006-global-spec-drift-deep-research/spec.md:42-50`
- `AGENTS.md:291-298`
- `.opencode/specs/sk-doc/015-sk-doc-parent/010-create-benchmark/spec.md:1`
- `.opencode/specs/sk-doc/015-sk-doc-parent/010-subskill-doc-review/spec.md:1`

## Assessment

- New information ratio: 1.00
- Novelty justification: all six inventory findings are first-pass evidence for this lineage, and two measurement shortcuts were newly eliminated.
- Confidence: high for counts at this repository snapshot; medium for policy conclusions pending active/archive/fixture classification.

## Reflection

- What worked and why: one bounded repository traversal produced a reproducible baseline and exposed false-positive classes early.
- What did not work and why: unqualified status/file-presence and keyword counts confound live packets with historical/test surfaces.
- What I would do differently: classify scope before applying policy checks, then inspect only active candidates and retain archives as precedent evidence.

## Recommended Next Focus

Separate active packets from archives, backups, fixtures, and scratch data; verify duplicate numbering, stale migration names/paths, root-level packet anomalies, and phase-parent lean-trio residue in the active tree.
