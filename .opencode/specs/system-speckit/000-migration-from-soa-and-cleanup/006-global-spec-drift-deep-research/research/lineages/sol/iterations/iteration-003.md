# Iteration 3: Completion and Metadata Drift

## Focus

Determine whether active packet metadata can reliably represent current completion state and identify concrete contradiction classes relevant to indexing, resume, and teardown decisions.

## Actions Taken

1. Parsed active packet spec status, graph-derived status, checklist completion, continuity completion percentage, and continuity fingerprint placeholders.
2. Classified direct phase-parent/child graph-status contradictions in both directions.
3. Verified representative spec/graph pairs and checked all active `description.json` and `graph-metadata.json` files for presence and JSON parseability.

## Findings

1. Canonical metadata coverage is structurally strong: all 2,168 active packet candidates have present, parseable `description.json` and `graph-metadata.json`. The problem is semantic freshness, not file absence or JSON corruption. [SOURCE: repository active metadata parse audit, 2026-07-16]
2. Spec and graph state disagree at material scale. Using conservative status-prefix classification, 212 active specs use terminal language while graph metadata remains `planned`, `draft`, or `in_progress`; 19 active specs remain nonterminal while graph metadata says `complete`. The Rust research packet is a verified example: its spec and continuity report completion, while `graph-metadata.json` still says `planned`. [SOURCE: repository active state reconciliation command, 2026-07-16] [SOURCE: .opencode/specs/sk-code/018-rust-standards-for-code-opencode/001-research/spec.md:13-30,43-56] [SOURCE: .opencode/specs/sk-code/018-rust-standards-for-code-opencode/001-research/graph-metadata.json:41-49]
3. Checklist and graph state also diverge. Two packets have graph status `complete` with unchecked checklist items, while 54 have all checklist boxes checked but nonterminal graph status. This shows checklist completion alone is neither consistently necessary nor sufficient for graph completion in the current fleet. [SOURCE: repository active state reconciliation command, 2026-07-16]
4. Continuity freshness evidence is largely placeholder-grade: 1,093 active specs contain the exact all-zero `session_dedup.fingerprint`, and 164 active specs claim `completion_pct: 100` while graph metadata remains nonterminal. The zero value is not a usable content fingerprint and cannot support strict continuity-freshness claims. [SOURCE: repository active continuity audit, 2026-07-16] [SOURCE: .opencode/specs/sk-code/018-rust-standards-for-code-opencode/001-research/spec.md:25-30]
5. Thirteen active specs retain the literal template status `[Draft/In Progress/Review/Complete]`. This is direct unfilled-template residue rather than a nuanced lifecycle disagreement. [SOURCE: repository active placeholder audit, 2026-07-16]
6. Direct parent/child graph projection is contradictory in 60 active phase-parent candidates: 31 parents are `complete` while at least one direct child is nonterminal, and 29 parents are nonterminal while every direct child is `complete`. Some may encode accepted partial closure, but without an explicit aggregate-state policy they make graph traversal and resume status unreliable. [SOURCE: repository direct parent-child status audit, 2026-07-16]
7. The inverse spec/graph case is independently verified: `004-end-user-scope-default-and-opt-in` still says `Draft (pre-research)` with continuity describing the next action as implementation, while graph metadata says `complete` and records a July 15 save over implementation and research outputs. [SOURCE: .opencode/specs/system-code-graph/031-code-graph-buildout/004-runtime-and-scan/004-end-user-scope-default-and-opt-in/spec.md:13-41,56-66] [SOURCE: .opencode/specs/system-code-graph/031-code-graph-buildout/004-runtime-and-scan/004-end-user-scope-default-and-opt-in/graph-metadata.json:41-63,211-235]

## Questions Answered

- Q3 answered: completion drift occurs across spec prose, graph projection, checklist state, continuity percentages/fingerprints, template placeholders, and parent/child rollups.

## Questions Remaining

- Q1-Q2 need final triage only.
- Q4-Q5 remain open.

## Ruled Out

- Missing metadata files as the primary active-tree failure mode was ruled out; active metadata files are universally present and parseable.
- Using any single status surface as authoritative was ruled out by bidirectional contradictions.

## Dead Ends

- A broad terminal-language regex overcounts phrases such as `planning complete`; conservative prefix classification is required.

## Sources Consulted

- Active `spec.md`, `graph-metadata.json`, and `checklist.md` files under `.opencode/specs/**`.
- `.opencode/specs/sk-code/018-rust-standards-for-code-opencode/001-research/spec.md:13-30,43-56`
- `.opencode/specs/sk-code/018-rust-standards-for-code-opencode/001-research/graph-metadata.json:41-49,211-229`
- `.opencode/specs/system-code-graph/031-code-graph-buildout/004-runtime-and-scan/004-end-user-scope-default-and-opt-in/spec.md:13-41,56-66`
- `.opencode/specs/system-code-graph/031-code-graph-buildout/004-runtime-and-scan/004-end-user-scope-default-and-opt-in/graph-metadata.json:41-63,211-235`

## Assessment

- New information ratio: 0.90
- Novelty justification: six fleet-level contradiction classes and two concrete bidirectional examples are new to this lineage; one finding refines the earlier metadata-presence inventory.
- Confidence: high for counts and examples; medium for parent/child severity because accepted-partial semantics are not uniformly encoded.

## Reflection

- What worked and why: conservative status prefixes plus direct source verification avoided the false positives seen in the previous broad status scan.
- What did not work and why: current graph status does not expose why a packet is terminal or nonterminal, so accepted exceptions cannot be mechanically separated.
- What I would do differently: require explicit state provenance and reason fields in generated metadata before enforcing fleet-wide reconciliation.

## Recommended Next Focus

Trace prior context-optimization programs by named mechanism and evidence: compaction, context snapshots, progressive disclosure, session deduplication, cognitive/working memory, retrieval reranking, state limits, and continuity routing.
