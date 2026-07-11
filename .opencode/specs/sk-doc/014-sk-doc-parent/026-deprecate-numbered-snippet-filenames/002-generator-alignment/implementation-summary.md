---
title: "Implementation Summary: playbook generator slug-filename alignment"
description: "Records the surgical change making playbook-generator.cjs emit bare descriptive slug filenames plus a stage: routing default instead of the numbered AG-NNN.md form, with verification evidence."
importance_tier: "normal"
contextType: "implementation"
parent: "sk-doc/014-sk-doc-parent/026-deprecate-numbered-snippet-filenames"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/026-deprecate-numbered-snippet-filenames/002-generator-alignment"
    last_updated_at: "2026-07-11T17:41:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Generator emits slug filenames + stage default; commit 69638f96a4"
    next_safe_action: "Complete"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Playbook Generator Slug-Filename Alignment

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

<!-- ANCHOR:metadata -->
## Metadata
| Field | Value |
|-------|-------|
| **Spec Folder** | 002-generator-alignment |
| **Status** | Complete |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built
Changed `playbook-generator.cjs` to emit a bare descriptive slug filename derived from the scenario
name/id (with deterministic collision suffixes) plus a `stage: routing` frontmatter default, instead of the
numbered `AG-NNN.md` form. The scenario `id` stays in the frontmatter, not the filename. Every other generator
behavior — output directory, frontmatter contents, dedupe — is unchanged.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
A surgical filename-shape change only: the last live emitter of the numbered-filename anti-pattern now matches
the sk-doc bare-slug convention and the number-agnostic loader's stage-aware shape. Commit `69638f96a4`.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions
The generator was the one code path still producing `NNN-` filenames; every other generator and convention doc
already forbade the pattern, so this phase is a targeted emitter fix rather than a convention change.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification
`validate.sh <this-folder> --strict` Errors 0. `node --check` clean. Safe no-write dry run succeeded (10
scenarios staged, `proposalDir: null`). Comment-hygiene checker clean on the file.
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations
The generator writes into a staging / proposal directory, not the live scored corpus, so generated frontmatter
completeness (e.g. `expected_resources`) is a separate, pre-existing generator concern untouched here.
<!-- /ANCHOR:limitations -->
