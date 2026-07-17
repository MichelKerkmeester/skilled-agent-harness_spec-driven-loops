# Iteration 2: Metadata drift systemicness

## Focus

Determine whether graph/status metadata drift is isolated manual editing or a systemic metadata derivation problem.

## Actions Taken

- Sampled cited 026 and 027 metadata drift findings.
- Ran a read-only Node scan over 026 spec folders to compare `spec.md` metadata-table status against `graph-metadata.json.derived.status`.
- Inspected the graph-metadata backfill and derivation code.

## Findings

1. The status drift is systemic. Under 026, a read-only scan found 721 `spec.md` files and 714 `graph-metadata.json` files. A tightened classifier found 163 strong status contradictions: 75 not-started specs whose graph metadata says done, 57 done-ish specs whose graph metadata says not-done, plus 69 specs with no parsed metadata-table status whose graph metadata says done. [SOURCE: command:node read-only status scan over .opencode/specs/system-spec-kit/026-graph-and-context-optimization]

2. The most likely mechanism is status-source precedence. The graph parser reads frontmatter `status` from canonical docs, not the visible `## METADATA` table used by current spec templates. If no frontmatter status exists, it falls back to implementation-summary presence and checklist completion. That means a spec whose table says `Draft` can be derived as `complete` when an implementation-summary exists or a checklist is complete. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:605] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:987] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/graph/README.md:72]

3. A concrete 027 sample confirms the laundering path: `027/.../003-incremental-index-foundation/spec.md` table status is `Draft`, while its `graph-metadata.json` status is `complete`; the same folder has an implementation-summary placeholder with a `Completed` metadata row. [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-incremental-index-foundation/spec.md:41] [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-incremental-index-foundation/graph-metadata.json:35] [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-incremental-index-foundation/implementation-summary.md:39]

4. A concrete 026 sample shows the same mismatch: `002-phase-parent-generator-pointer-polish/spec.md` says `Draft`, while its graph metadata says `complete`. The implementation summary has completion-oriented continuity metadata but no frontmatter status, so the parser fallback can still mark it complete while the canonical user-visible spec remains draft. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/009-phase-parent-lean-trio-documentation/002-phase-parent-generator-pointer-polish/spec.md:31] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/009-phase-parent-lean-trio-documentation/002-phase-parent-generator-pointer-polish/graph-metadata.json:35] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/009-phase-parent-lean-trio-documentation/002-phase-parent-generator-pointer-polish/implementation-summary.md:1]

5. The backfill script refreshes all eligible spec folders and calls `deriveGraphMetadata` / `refreshGraphMetadataForSpecFolder`, but its review flag only catches `metadata.derived.status === "planned"` without explicit planned/complete/in_progress/blocked prose. It does not flag the more dangerous `draft/planned spec table -> complete graph metadata` case. [SOURCE: file:.opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:193] [SOURCE: file:.opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:214] [SOURCE: file:.opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:159]

6. Test coverage is skewed toward traversal. The backfill test covers dry-run discovery, while the write-path test that should assert graph-metadata file creation is marked as an expected-failure skip. [SOURCE: file:.opencode/skills/system-spec-kit/scripts/tests/graph-metadata-backfill.vitest.ts:77] [SOURCE: file:.opencode/skills/system-spec-kit/scripts/tests/graph-metadata-backfill.vitest.ts:95]

## Questions Answered

- Q2 is answered. Metadata drift is systemic. The root cause is not just isolated edits; it is a derivation/refresh path that ignores the spec template's visible status table and uses implementation-summary/checklist fallbacks, plus asymmetric review flags and incomplete write-path tests.

## Questions Remaining

- Q3 memory correctness impact.
- Q4 P0 severity calibration.
- Q5 deep-loop blast radius.

## Reflection

What worked: quantifying strong contradictions made the answer harder to hand-wave as stale one-offs.

What failed: raw status equality was too noisy because many specs use free-form status prose; a coarse class-based classifier gave a more useful estimate.

Ruled out: "only the parent 026 graph-metadata pointer is stale" is too narrow; drift appears across many child packets and into 027.

## Recommended Next Focus

Q3 memory correctness impact: inspect entity-density invalidation and atomic save ordering for actual retrieval/routing consequences.

## Assessment

- newInfoRatio: 0.88
- Novelty justification: Adds quantified blast-radius evidence and identifies the metadata precedence mechanism.
- Confidence: High that status drift is systemic; medium on exact affected count because status prose is heterogeneous.
