# Iteration 14: spec folder — parent + phases 001-004

> dimension: spec-conformance | model: gpt-5.6-sol effort=high tier=fast | sandbox: read-only
> status: 0 | timedOut: false

- **[P1] Parent documentation describes an obsolete eight-phase program**

  `.opencode/specs/sk-doc/019-skill-routing-refactor/021-documentation-quality-program/spec.md:3,15-16,35-46`

  Evidence: The parent claims eight phases, stops at the nonexistent `008-verification-and-closeout`, and says phase 002 is next. The directory and `graph-metadata.json:6-16` contain ten phases, including `008-existing-readme-cleanup`, `009-titlecase-config-and-closeout`, and `010-deferred-code-and-checker-fixes`. The map also assigns the uppercase-validator change to phase 002, although `002-*/spec.md:71` explicitly excludes it.

  Fix: Rewrite the phase map and continuity for the actual ten-phase program, then regenerate `description.json` and `graph-metadata.json` through the canonical save workflow.

- **[P1] All four completed checklists miscount their verification items**

  `.opencode/specs/sk-doc/019-skill-routing-refactor/021-documentation-quality-program/{001-*,002-*,003-*,004-*}/checklist.md:118-124`

  Evidence: Counting the actual `CHK-* [P*]` rows gives:

  - 001: 12 P1 + 1 P2; summary says 11 P1 + 1 P2.
  - 002: 13 P2; summary says 11.
  - 003: 10 P1 + 4 P2; summary says 9 P1 + 5 P2.
  - 004: 13 P1 + 2 P2; summary says 11 P1 + 3 P2.

  All four simultaneously claim `status: complete` and `completion_pct: 100`.

  Fix: Correct each verification summary’s totals and denominators from its actual checklist rows.

- **[P1] Completed phases do not pass the mandated strict spec gate**

  `.opencode/specs/sk-doc/019-skill-routing-refactor/021-documentation-quality-program/{001-*,002-*,003-*,004-*}/spec.md:10`

  Evidence: Running `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <phase> --strict` returned `RESULT: FAILED` for every phase. Each failed `GRAPH_METADATA_SHAPE`, `DESCRIPTION_SHAPE`, and `SECTION_COUNTS` with “Registry shell rule bridge failed.” The document-specific template, anchor, frontmatter, evidence, level, and integrity checks passed, so this appears to be a shared validator/registry failure—but the required completion gate is still red.

  Fix: Repair or rebuild the registry rule bridge, rerun strict validation on all four phases, and record the successful gate before retaining the completion claims.

- **[P1] Phase 002’s “known limitation” is false at branch HEAD**

  `.opencode/specs/sk-doc/019-skill-routing-refactor/021-documentation-quality-program/002-reference-asset-template-alignment/implementation-summary.md:108-111`

  Evidence: The summary says reference and asset validation still has `h2UppercaseRequired: false`; `spec.md:132` leaves that as an open decision for phase 008. At HEAD, `.opencode/skills/sk-doc/shared/assets/template-rules.json:331,394` sets it to `true`, and phase 009 explicitly records completing the flip.

  Fix: Recast the limitation as historical and mark the open question resolved by phase 009, with a cross-reference to that phase.
