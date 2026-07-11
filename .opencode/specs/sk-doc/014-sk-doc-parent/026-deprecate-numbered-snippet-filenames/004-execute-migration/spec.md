---
title: "Spec: Execute the 111-file rename + fold in adjacent corpus fixes"
description: "Phase 004. Run the Phase 003 migration tooling against the live tree, fanned out by skill family: rename all 111 numbered snippet files under feature_catalog/ and manual_testing_playbook/ across 9 skill packets to their bare slug, inject stage: routing|holdout|negative frontmatter, and rewrite the 3 hub-routing root-index tables in lockstep. Folds in operator decision B: fix the 2 failing vitest suites and sweep the 7 dead allowlist entries in the same corpus. Gated on Phase 001's tolerant loader and Phase 002's generator alignment landing first."
trigger_phrases:
  - "execute snippet de-numbering migration"
  - "rename numbered snippet files"
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/014-sk-doc-parent/026-deprecate-numbered-snippet-filenames"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/026-deprecate-numbered-snippet-filenames/004-execute-migration"
    last_updated_at: "2026-07-11T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase spec authored"
    next_safe_action: "Run the Phase 003 dry-run migration"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Spec: Execute the 111-file rename + fold in adjacent corpus fixes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

## 1. METADATA
<!-- ANCHOR:metadata -->
| Field | Value |
|-------|-------|
| **Packet** | 026/004-execute-migration |
| **Level** | 2 |
| **Status** | Planned |
| **Phase** | 004 of 005 (execution) |
<!-- /ANCHOR:metadata -->

## 2. PROBLEM & PURPOSE
<!-- ANCHOR:problem -->
The migration tooling authored in Phase 003 (`denumber-snippet-filenames.mjs`, adapted from the proven packet-108
engine) is dry-run-verified against the 111 in-scope files but has not mutated the tree. This phase runs it for
real. Because the 111 files span 9 skill packets with different owning families, execution is **fanned out by
skill family**: each family is migrated, its `stage:` frontmatter injected, its family validated, and its
reference index rows fixed before moving to the next — so a failure in one family is isolated and does not block
the rest. Per the sequencing invariant this phase may only start once Phase 001 (the number-agnostic loader) and
Phase 002 (the corrected generator) have landed — otherwise every renamed file would silently vanish from the
deep-improvement Lane C skill-benchmark corpus the moment it loses its `^\d{3}-` prefix.

This phase also folds in operator decision B: two pre-existing failing vitest suites
(`system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts` and
`system-spec-kit/scripts/tests/outsourced-agent-handback-docs.vitest.ts`, both `ENOENT` on stale numbered names
from a prior scheme) and 7 dead allowlist entries in
`system-spec-kit/scripts/tests/workflow-invariance.vitest.ts:97-104` are fixed in the same pass, so the corpus
this migration touches does not end the program in a half-consistent state.
<!-- /ANCHOR:problem -->

## 3. SCOPE
<!-- ANCHOR:scope -->
**In scope:** invoke the Phase 003 script against the live worktree, fanned out by skill family, for all 111
in-scope files across the 9 packets: `cli-external/cli-claude-code` (10), `cli-external/cli-opencode` (10),
`cli-external` hub-routing (5), `mcp-tooling` hub-routing (6), `mcp-tooling/mcp-chrome-devtools` (8),
`mcp-tooling/mcp-click-up` (7), `mcp-tooling/mcp-figma` (9), `sk-code/code-review` (7),
`sk-code/code-opencode` (9), `sk-code/code-webflow` (13), `sk-code/code-quality` (1),
`sk-prompt` hub-routing (4), `system-deep-loop/deep-improvement` (10), `system-deep-loop/deep-research` (8),
`system-deep-loop/deep-review` (4). Per-family `stage: routing|holdout|negative` frontmatter injection for the
63/111 files that encode routing/holdout/negative grouping in their current filename token (default `stage:
routing` for the remainder). Rewrite of the 3 hub-routing root-index tables (`cli-external`, `mcp-tooling`,
`sk-prompt`) that cite scenario files by name, in the same commit as the family that owns them. Per-family
`validate.sh --strict`. The adjacent fold-in: fixing the 2 failing vitest suites and sweeping the 7 dead
allowlist entries in `workflow-invariance.vitest.ts`.

**Out of scope:** authoring the migration script (Phase 003); the final recursive validation, whole-workspace
markdown-link guard, and Lane C skill-benchmark regression proof (Phase 005); the 20 system-spec-kit single-digit
files (`feature-flag-reference/1-7`, `pipeline-architecture/4` and `7`, `retrieval/4-stage-pipeline-architecture`)
— legitimate ordinal/topic-name filenames, never touched; changelogs, `z_archive/`, and completed spec-folder
history/narrative — frozen, records what files were named at the time.
<!-- /ANCHOR:scope -->

## 4. REQUIREMENTS
<!-- ANCHOR:requirements -->
- **R1:** All 111 in-scope files across the 9 packets are renamed to their bare descriptive slug; a repo-wide
  find for the in-scope `^\d{3}-` snippet filenames (excluding the 20 out-of-scope system-spec-kit files and the
  changelog/`z_archive/` deny-list) returns zero.
- **R2:** Each of the 63/111 files that encoded routing/holdout/negative grouping in its filename token carries
  an explicit `stage: routing`, `stage: holdout`, or `stage: negative` frontmatter field after migration; the
  remaining 48 files default to `stage: routing`.
- **R3:** The 3 hub-routing root-index tables (`cli-external`, `mcp-tooling`, `sk-prompt`) are rewritten in
  lockstep with their owning family's rename so every index row cites a file that exists on disk under its new
  name.
- **R4:** Each migrated skill family passes `validate.sh --strict` (Errors 0) before its commit; a family that
  fails is fixed or reverted, not committed.
- **R5:** The excluded surfaces (the 20 system-spec-kit single-digit files, `z_archive/`, changelog/history
  narrative) are byte-unchanged.
- **R6:** The 2 previously-failing vitest suites (`feature-flag-reference-docs.vitest.ts`,
  `outsourced-agent-handback-docs.vitest.ts`) pass after their stale numbered-name references are corrected.
- **R7:** The 7 dead allowlist entries in `workflow-invariance.vitest.ts:97-104` are removed once the files they
  allowlisted no longer carry numbered names.
<!-- /ANCHOR:requirements -->

## 5. SUCCESS CRITERIA
<!-- ANCHOR:success-criteria -->
1. A repo-wide find for in-scope `^\d{3}-` snippet filenames returns zero (outside the excluded surfaces).
2. Every touched skill family validated Errors 0 at commit time.
3. The 3 hub-routing root-index tables resolve every row to a real on-disk file under its de-numbered name.
4. All 63 grouped files carry an explicit `stage:` field; the previously-implicit R/H/N grouping is now
   filename-independent.
5. The 2 previously-failing vitest suites pass; the 7 dead allowlist entries are gone.
<!-- /ANCHOR:success-criteria -->

## 6. RISKS & DEPENDENCIES
<!-- ANCHOR:risks -->
- *Renaming before Phase 001's loader lands* would silently drop all 111 sk-doc-shape scenarios from the
  deep-improvement Lane C skill-benchmark corpus (the load-bearing `load-playbook-scenarios.cjs` gate is a
  3-digit-prefix filename check) → hard sequencing dependency on Phase 001 and Phase 002, confirmed by two
  adversarial verifiers this session; this phase does not start until both have landed.
- *A mid-migration hub-routing index desync* (a root-index row still citing the old numbered filename after its
  family renames) → caught by per-family `validate.sh --strict` before commit; Phase 005 runs the
  whole-workspace link guard as the backstop.
- *The 2 vitest fixes and 7 allowlist entries touching files outside this migration's direct rename set* → scope
  each fix narrowly to the stale-reference lines identified in research, not a broader rewrite of those test
  files.
- *Depends on* Phase 001 (number-agnostic loader with `stage:` parsing) and Phase 002 (generator emits slug
  filenames) and Phase 003 (the reviewed, dry-run-verified rename engine).
<!-- /ANCHOR:risks -->

## 7. OPEN QUESTIONS
<!-- ANCHOR:questions -->
Family batching granularity (per-skill vs per-parent-hub, e.g. whether `mcp-tooling`'s three sub-skills land as
one commit or three) is decided at run time from the Phase 003 dry-run report size.
<!-- /ANCHOR:questions -->
