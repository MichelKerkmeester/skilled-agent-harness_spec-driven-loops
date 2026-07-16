# Iteration 7: Independent Exact-Path Verification

## Focus

Attempt to falsify the highest-impact conclusions using direct current-file evidence rather than migration summaries or prior aggregate outputs.

## Actions Taken

1. Enumerated the six allegedly duplicated sk-doc child-number prefixes directly from current `spec.md` paths.
2. Searched every canonical document in the cited system-speckit packet for the deleted ownership target and tested whether that target exists.
3. Re-read both directions of the sample spec/graph status contradiction and the teardown rebuild boundary from current files.

## Findings

1. The sk-doc collision is confirmed exactly: prefixes `010` through `015` each resolve to two current sibling `spec.md` files under `015-sk-doc-parent`, for twelve files total. No prior count correction is needed. [SOURCE: current Glob over .opencode/specs/sk-doc/015-sk-doc-parent/{010,011,012,013,014,015}-*/spec.md, 2026-07-16]
2. The broken ownership pointer is broader than one frontmatter occurrence: the deleted `skilled-agent-orchestration/z_archive/090-base-files-renumbering-name-cleanup` target appears in `spec.md`, `plan.md`, `tasks.md`, and `implementation-summary.md`, while the target path has no current files. This strengthens the classification as canonical packet-wide ownership drift. [SOURCE: .opencode/specs/system-speckit/040-base-files-renumbering-name-cleanup/spec.md:12] [SOURCE: .opencode/specs/system-speckit/040-base-files-renumbering-name-cleanup/plan.md:11] [SOURCE: .opencode/specs/system-speckit/040-base-files-renumbering-name-cleanup/tasks.md:10,46] [SOURCE: .opencode/specs/system-speckit/040-base-files-renumbering-name-cleanup/implementation-summary.md:10] [SOURCE: current Glob for target path, no files, 2026-07-16]
3. Both sample status contradictions remain present in current files. The Rust research spec reports complete/100% while graph metadata says `planned`; the end-user-scope spec reports draft/70% and a next implementation action while graph metadata says `complete`. The contradiction class is not an artifact of a stale research transcript. [SOURCE: .opencode/specs/sk-code/018-rust-standards-for-code-opencode/001-research/spec.md:12-30,43-56] [SOURCE: .opencode/specs/sk-code/018-rust-standards-for-code-opencode/001-research/graph-metadata.json:41-52] [SOURCE: .opencode/specs/system-code-graph/031-code-graph-buildout/004-runtime-and-scan/004-end-user-scope-default-and-opt-in/spec.md:13-41,56-65] [SOURCE: .opencode/specs/system-code-graph/031-code-graph-buildout/004-runtime-and-scan/004-end-user-scope-default-and-opt-in/graph-metadata.json:41-63]
4. The teardown plan explicitly limits `/doctor:update` to spec-doc rescan and lazy re-embedding, and explicitly excludes history recovery. The source-versus-derived distinction survives direct contract verification. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/007-memory-db-teardown/plan.md:100-114,119-138]

## Questions Answered

- Q1-Q5 remain answered. Independent checks did not falsify the taxonomy or teardown implications.

## Questions Remaining

- None.

## Ruled Out

- Aggregate-command transcription error as the explanation for the duplicate-prefix finding.
- A single stale frontmatter field as the full scope of the deleted ownership pointer.
- Research-transcript staleness as the explanation for the bidirectional status examples.

## Dead Ends

- No tested high-impact claim was falsified; repeating the same exact-path checks would add no value.

## Sources Consulted

- Current sk-doc sibling `spec.md` paths under `015-sk-doc-parent`.
- Current canonical docs under `system-speckit/040-base-files-renumbering-name-cleanup`.
- Current spec/graph pairs for the Rust research and end-user-scope examples.
- Current phase 007 teardown plan.

## Assessment

- New information ratio: 0.04
- Novelty justification: direct verification produced one narrow expansion of the broken-pointer scope and otherwise confirmed existing findings without correction.
- Confidence: high for the four independently checked conclusions.

## Reflection

- What worked and why: exact current paths removed dependence on prior aggregate commands and phase-summary interpretation.
- What did not work and why: none of the selected claims could be falsified, so novelty was intentionally low.
- What I would do differently: retain machine-readable evidence manifests for fleet counts so later lineages can reproduce them without rerunning broad scans.

## Recommended Next Focus

Verify prior context-optimization claims against current implementation surfaces, especially session bootstrap, quality scoring, compaction hooks, and whether legacy status authority still remains.
