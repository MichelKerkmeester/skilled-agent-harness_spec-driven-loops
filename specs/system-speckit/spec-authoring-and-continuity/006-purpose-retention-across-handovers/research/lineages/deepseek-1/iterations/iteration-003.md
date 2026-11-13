# Iteration 3: What the real packet corpus shows — restated, shortened or absent

## Focus
Question 3 of section 7: in real packets under `specs/` that have a `handover.md` or several continuity saves, is the purpose restated, shortened or absent, and do phase children restate the parent's purpose or drift from it. This iteration measures the live corpus with commands rather than reading one or two packets by hand.

No `steer.md` exists in the lineage directory.

## Actions Taken
1. Walked `specs/` (excluding `_archive`, `z_archive`, `node_modules`, `.git`) for `spec.md`, extracted the `problem` anchor, and classified each `### Purpose` subsection as filled, placeholder or empty.
2. Counted `handover.md` files, grepped them case-insensitively for purpose/problem/objective, and grepped for a Purpose heading; inspected the matching lines to see what they actually are.
3. Grepped every `implementation-summary.md` for a purpose-like key inside the continuity block indentation.
4. Measured how many handover packets also carry `implementation-summary.md` (the "several continuity saves" case).
5. Measured parent-to-child purpose drift on the largest live phase parent: extracted the parent's Purpose text, extracted every child's Purpose text, and counted how many children share at least three significant words with the parent's purpose (a lexical probe, not a semantic judgement).

## Findings
1. Purpose is authored at spec level and usually filled. Of 3,294 live `spec.md` files, 3,211 carry the `problem` anchor; 2,943 carry filled `### Purpose` text, 22 still carry a template placeholder, and 246 have the anchor with an empty Purpose subsection (measured by the extraction script described above). The section exists and is used; the purpose is not a missing authoring surface.
2. `handover.md` does not carry a purpose field in practice. Of 97 handover files, **0** have a Purpose heading. 22 contain a purpose/problem/objective string somewhere, and inspection shows those are incidental: a checklist row that points back at `spec.md` ("Spec file: `spec.md` (root purpose and the phase map)"), a trap-table note about a "purpose-built" port, a frontmatter `description` field, and a "Related" pointer to `goal.md` [SOURCE: specs/system-deep-loop/loop-architecture/001-deep-loop-innovation/012-runtime-enablement/handover.md:173] [SOURCE: specs/system-speckit/memory-search-and-knowledge/001-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/handover.md:80] [SOURCE: specs/system-speckit/memory-search-and-knowledge/001-graph-and-context-optimization/003-memory-and-causal-runtime/001-continuity-memory-runtime/003-continuity-refactor-gates/handover.md:32].
3. Exactly one of the 97 handovers restates an objective, and it does so outside any schema field: `- **Objective:** Deep research on improving sk-deep-research review logic, then implement all recommendations`, a bullet an author added inside the handover's summary list [SOURCE: specs/system-deep-loop/z_archive/022-sk-deep-research-evolution/005-sk-deep-research-review-mode/handover.md:33]. By iteration 2's parser finding, no reader extracts that bullet; purpose in a handover is author will, not mechanism.
4. Continuity state never carries purpose. A grep for a purpose/goal/objective/problem key at continuity indentation across every `implementation-summary.md` in `specs/` returned **0** hits. Combined with iteration 2's six-field record, this is absence by construction: the writer cannot write a field the record does not have.
5. The "several continuity saves" case is common, and neither surface carries purpose: 68 of the 97 handover packets also carry an `implementation-summary.md`, so a successor has two continuity artifacts to read and both are purpose-free.
6. Phase children drift from the parent's purpose. On the largest live phase parent (`specs/system-speckit/runtime-and-release/001-system-speckit-v4`), the parent's Purpose is a 481-character statement about holding "the thirty-eight packets as phases in chronological order under one parent that a reader can call v4" [SOURCE: specs/system-speckit/runtime-and-release/001-system-speckit-v4/spec.md:71]. The folder actually holds 69 numbered child folders, 65 of which carry purpose text; only 16 of those 65 share at least three significant words with the parent's purpose (lexical probe). Children 001 and 002 share zero: their purposes are "Let the preflight helper target any packet…" and "Make the external-MCP guard match only a genuine external MCP binary…".
7. The parent's purpose is a container purpose, and it is already stale. The 481-character statement describes the decomposition ("hold the thirty-eight packets as phases … with a timeline, literal names, and retrieval"), not a user need, and the count it states (38) no longer matches the 69 numbered children [SOURCE: specs/system-speckit/runtime-and-release/001-system-speckit-v4/spec.md:71]. A child that did restate the parent purpose would inherit a container statement, not the user need behind its own phase.
8. The one child that does echo the parent is the child whose own subject *is* parent documentation: `003-spec-doc-template-reduction` shares 21 significant words, quoting the parent's note "Keep parent documentation lean while child phases own detailed plans, tasks, checklists, and continuity" [SOURCE: specs/system-speckit/runtime-and-release/001-system-speckit-v4/003-spec-doc-template-reduction/spec.md:72]. Echo therefore tracks subject matter, not inheritance.

## Questions Answered
- Q3: In real packets under `specs/` that have a `handover.md` or several continuity saves, is the purpose restated, shortened or absent? Do phase children restate the parent's purpose? — Answered by findings 1-8: purpose is authored on `spec.md` and mostly filled; it is absent from handovers (0 headings) and from continuity state (0 keys); phase children state local purposes that lexically drift from the parent's, and the parent's own purpose is a stale container statement.

## Questions Remaining
4, 5.

## Ruled Out
- The hypothesis that handovers in practice restate the purpose because the template gives room for it. 0 of 97 have a heading and only one carries a restatement bullet, which no parser reads.
- The hypothesis that continuity saves accumulate purpose over time because they are written repeatedly. 0 purpose-like keys exist in any continuity block in the corpus.

## Dead Ends
- Looking for a packet family where several continuity saves preserved the purpose by convention. The convention does not exist: the only recurring carriers are `spec.md` and, in one packet, `goal.md` pointers.

## Edge Cases
- Ambiguous input: none.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.
- Measurement caveat: the parent-vs-child "drift" count is a lexical overlap probe over significant words; it shows that child purposes are not copied from the parent, not that the child team ignored the parent. [INFERENCE: the shared-word count is a proxy for copied text; the cited purpose lines show the children state different subjects, so the drift claim is about text inheritance, which is what a successor session can read.]

## Sources Consulted
- Corpus walk over `specs/**/spec.md` (3,294 live files) and `specs/**/handover.md` (97 files), excluding `_archive`, `z_archive`, `node_modules`, `.git`.
- `specs/system-speckit/runtime-and-release/001-system-speckit-v4/spec.md` and its 69 child `spec.md` files.
- `specs/system-deep-loop/loop-architecture/001-deep-loop-innovation/012-runtime-enablement/handover.md:173`
- `specs/system-speckit/memory-search-and-knowledge/001-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/handover.md:80`
- `specs/system-speckit/memory-search-and-knowledge/001-graph-and-context-optimization/003-memory-and-causal-runtime/001-continuity-memory-runtime/003-continuity-refactor-gates/handover.md:32`
- `specs/system-deep-loop/z_archive/022-sk-deep-research-evolution/005-sk-deep-research-review-mode/handover.md:33`
- `rg` over `specs/**/implementation-summary.md` for purpose-like continuity keys (0 hits).

## Assessment
- New information ratio: 1.0
- Questions addressed: Q3
- Questions answered: Q3

## Reflection
- What worked and why: turning the question into counts before reading prose. "0 of 97 handovers have a Purpose heading" and "0 purpose keys in any continuity block" are falsifiable and decide the question faster than sampling packets, and the lexical probe turned "children drift" from an impression into a number with named examples.
- What did not work and why: an early walk skipped `_archive`/`z_archive` and initially differed from the `find` count; the population had to be stated precisely (3,294 live files) so the percentages mean what they say.
- What I would do differently: measure the child purposes against the parent's *problem statement* as well as its purpose, since a child could restate the problem while writing a new purpose.

## Recommended Next Focus
Q4: test the operator's candidate changes (parent-level acceptance criteria, a parent-level user story or purpose/problem section, an improved parent-specific spec template) plus the evidence-supported alternatives (a purpose field in the continuity block, a purpose line in the compaction brief), and rank them by the gap they close and their cost.

## SCOPE VIOLATIONS
- None. Every write landed inside `research/lineages/deepseek-1/`.
