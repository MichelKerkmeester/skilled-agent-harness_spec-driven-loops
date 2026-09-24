# Iteration 4: Archive skip mechanics and grandfather-cutoff detail

## Focus

Q4: why the two repair tools skip archived packets, and what breaks if the upgrade includes them. Q3 mechanics: pin the grandfather-cutoff fields and behavior so the least-change route is implementable as specified.

## Findings

1. **F-022 Archive exclusion is four mechanisms, not one.** (a) repair-derived.cjs freezes whole trees via FROZEN_TREES (node_modules, .git, z_archive, scratch) plus any .backup- prefixed name, and its code comment gives the reason: snapshots taken before a rename record a deliberately historical location, so "repairing" it destroys the very thing the copy preserved. (b) repair-derived also gates selection on packet shape: marker files (spec.md or implementation-summary.md) plus PACKET_NAME_RE, a ###-digit prefix. (c) backfill-frontmatter excludes any path containing /z_archive/ unless --include-archive is passed. (d) backfill-graph-metadata carries its own ARCHIVE_SEGMENT_RE over both z_archive and z_future with --include-archive and --active-only switches. The measured pipeline (bf-pipeline.sh) threads the include flag as a positional argument that was empty in every measured row, so the frontmatter step ran with archives excluded. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs (FROZEN_TREES, PACKET_NAME_RE), runtime/cli/continuity/backfill-frontmatter.ts, runtime/cli/graph/backfill-graph-metadata.ts, scratch/harness/bf-pipeline.sh]

2. **F-023 Correction to spec.md section 2's attribution: z_future is skipped only at the graph-metadata layer.** "Both repair tools skip archives by default" is precise for z_archive across the stack, but z_future appears in no frozen set and 37 of its 39 corpus packets pass repair-derived's name gate (only sqlite-to-turso and code-graph-and-cocoindex do not). The layer that excludes z_future is backfill-graph-metadata's ARCHIVE_SEGMENT_RE, reached inside repair-derived's re-derive child call. Candidate residual explanation for the wholesale z_future failure: that child's archive handling or masked write refusals (backfill-graph-metadata reports per-folder failures while exiting 0, and repair-derived's re-derive trusts the exit code). INFERRED until the child's switch default is pinned; it matters because an include mode must thread all four mechanisms. [SOURCE: repair-derived.cjs discover/walk and re-derive regions, backfill-graph-metadata.ts ARCHIVE_SEGMENT_RE, corpus z_future name census]

3. **F-024 What breaks if the upgrade includes archives, and the shape of a safe include mode.** Four breakages: (a) for pre-rename snapshots (.backup-*) any recorded-location rewrite destroys the snapshot's purpose (the freeze comment's exact failure); (b) drift refresh overwrites stored description and causal_summary values in historical sidecars with fresh extractions, the meaning-bearing churn the freeze exists to prevent; (c) passing METADATA_DISK_PATH inside archives requires writing archive-segment paths into continuity pointers and parent ids, which is correct for genuinely moved packets and destructive for deliberate snapshots, and the corpus contains both kinds; (d) non-digit folders (the two z_future names above plus fixture-shaped names like invalid-priority-tags) cannot be reached by repair-derived at all, so include mode alone cannot satisfy REQ-004 for them. A safe include mode therefore transforms moved packets additively (sidecar creation, enum canonicalization) while routing snapshots and non-digit folders to the F-019 policy layer rather than to transformation. [SOURCE: repair-derived.cjs freeze comment and PACKET_NAME_RE, backfill-graph-metadata.ts, corpus FOLDER_NAMING and METADATA_DISK_PATH patterns]

5. **F-025 The grandfather-cutoff mechanics, and the gap against the spec's edge case.** check-ac-closure.sh keys on: a cutoff default of 2026-08-30, overridable by SPECKIT_AC_CLOSURE_CUTOFF with ISO-date validation and a fallback note; the packet creation date parsed from the spec.md metadata table Created row; the boundary day itself is grandfathered; an unparseable creation date grandfathers the packet; and grandfathered packets report info on every branch, not just on the presence check. The gap: keying on Created alone keeps a pre-cutoff packet advisory forever, even after post-upgrade edits, which does not satisfy the packet's edge case "upgrade then later edit: new findings in an upgraded packet are ordinary errors". Two candidates close it: a finding-level baseline manifest recorded at upgrade time (a regression-style delta check, matching the CI precedent the packet cites for blocking only regressions) or touch-date coupling (a document saved after the upgrade timestamp loses grandfathering). Recommendation: the manifest as the source of truth, with touch-date as a cheap pre-filter. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-ac-closure.sh (cutoff and created-date helpers, boundary comment), spec.md L2 edge cases and section 2 CI observation]

6. **F-026 repair-derived's repair taxonomy bounds what mechanical in-document edits exist today.** DERIVABLE covers DESCRIPTION_SHAPE, GENERATED_METADATA_INTEGRITY, GENERATED_METADATA_DRIFT, GRAPH_METADATA_SHAPE, METADATA_DISK_PATH_CONSISTENCY and SPEC_DOC_INTEGRITY; REDERIVABLE is the four graph-metadata assertions alone, with a comment admitting the others concern description.json contents and in-document reference paths that a re-derive does not write. The only observed in-document write is the frontmatter packet-pointer line (POINTER_LINE regex, atomic write, re-check before splicing). The broken-link half of SPEC_DOC_INTEGRITY has no observed write mechanism in the tool. [SOURCE: repair-derived.cjs DERIVABLE/REDERIVABLE sets and pointer rewrite action]

7. **F-027 Validator tests do not bind to the live corpus.** test-validation-extended.sh resolves fixtures from runtime/cli/../test-fixtures, so the corpus folders with fixture-shaped names (invalid-priority-tags, missing-evidence and siblings) are not live test inputs and upgrading them breaks no test directly. Their expected-failure semantics live only in the separate fixtures tree. Renames in include mode still break cross-packet references (continuity pointers, parent ids, document links), which is the real FOLDER_NAMING cost. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/test-validation-extended.sh:35 (FIXTURES root), corpus FOLDER_NAMING samples]

## Sources Consulted

- .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs (constants, walk, freeze, re-derive, pointer actions)
- .skilled/skills/system-spec-kit/runtime/cli/continuity/backfill-frontmatter.ts (CLI contract and archive exclusion)
- .skilled/skills/system-spec-kit/runtime/cli/graph/backfill-graph-metadata.ts (ARCHIVE_SEGMENT_RE, switches, failed[] summary)
- .skilled/skills/system-spec-kit/runtime/cli/rules/check-ac-closure.sh (cutoff and created-date helpers)
- .skilled/skills/system-spec-kit/runtime/cli/tests/test-validation-extended.sh (fixture root)
- scratch/harness/bf-pipeline.sh (the measured pipeline and its archive flag threading)
- scratch/harness/data/*.jsonl (z_future and z_archive name census)

## Assessment

- newInfoRatio: 0.75. The four-mechanism archive answer, the z_future correction, the include-mode breakage shape and the cutoff-gap analysis are all new; they refine but do not replace earlier findings.
- Questions considered: Q4 (answered with F-022 to F-024), Q3 (mechanics pinned with F-025).
- Questions answered: Q4 substantially (one residual: the child tool's switch default direction, INFERRED). Q3's implementation mechanics resolved into two named candidates with a recommendation.
- Confidence: F-022, F-026, F-027 are OBSERVED from source. F-023 mixes observed census with one inferred step. F-024 and F-025 are derived analysis over observed mechanisms.

## Reflection

- What worked: reading the tools' own comment and CLI contract instead of trusting the packet's summary line; the freeze comment answered "why" in one sentence the summary never carried.
- What failed: the first read of the archive question assumed one skip mechanism and nearly missed that z_future is excluded at a different layer than z_archive.
- Ruled out: z_future is skipped by repair-derived's frozen set or name gate (37 of 39 pass the gate and none are frozen); corpus fixture-shaped folders are live test inputs (tests bind to their own fixtures root); Created-date cutoff keying alone satisfies the edge case (post-cutoff edits stay advisory).

## Recommended Next Focus

Iteration 5: Q5 pipeline order and idempotence. Derive the step ordering from the write-dependency graph the tools actually have (frontmatter edits re-stale sidecars; re-derive writes graph metadata; status canonicalization feeds cross-doc checks), name the fixed point each idempotent step must reach, and design the proof the harness can run (second-run zero-change check at file and finding granularity).
