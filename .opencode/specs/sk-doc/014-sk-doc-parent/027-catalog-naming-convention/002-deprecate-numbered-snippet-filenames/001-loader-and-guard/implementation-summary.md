---
title: "Implementation Summary: number-agnostic loader + no-numbered-snippet guard"
description: "Records the content-gate rewrite of the Lane C playbook loader, the optional stage: parse, the oracle-test lockstep update, and the new numbered-snippet-file guard, with verification evidence."
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/014-sk-doc-parent/027-catalog-naming-convention/002-deprecate-numbered-snippet-filenames"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/027-catalog-naming-convention/002-deprecate-numbered-snippet-filenames/001-loader-and-guard"
    last_updated_at: "2026-07-12T12:16:22Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Content-gate loader + stage parse + guard shipped; commit 69638f96a4"
    next_safe_action: "Complete"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Number-Agnostic Loader + No-Numbered-Snippet Guard

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

<!-- ANCHOR:metadata -->
## Metadata
| Field | Value |
|-------|-------|
| **Spec Folder** | 001-loader-and-guard |
| **Status** | Complete |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built
Replaced the `^\d{3}-.*\.md$` filename gate in `load-playbook-scenarios.cjs` (`loadYamlFrontmatterScenarios`)
with a content gate: any `.md` carrying scenario frontmatter (`id` / `expected_intent` / `expected_resources`),
excluding the two root index files. Added optional `stage:` parsing (routing|holdout|negative, default routing)
surfaced on each returned scenario. Updated the `code-opencode-playbook-ids.vitest.ts` oracle to the same
content predicate so loader and oracle stay in lockstep. Added `sk-doc/shared/scripts/check_no_numbered_snippet_files.py`,
a guard that fails when a numbered per-scenario file exists under a catalog/playbook category.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
Number gate → content gate so numbered and bare-slug files load identically; the same change closes a latent
bug where single-digit / generator-output playbooks never matched the 3-digit gate and were silently dropped
from the corpus. The guard mirrors the sibling numbered-category-folder check in style and CLI shape. Commit
`69638f96a4`.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions
Per `decision-record.md`: ADR-002 (tolerate-then-rename — this loader lands before any file rename so the
corpus never drops) and ADR-003 (select scenario files by frontmatter/content, not the filename number). Guard
per ADR-005 (no-new-numbered-snippet, grandfather nothing).
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification
`validate.sh <this-folder> --strict` Errors 0. `node --check` clean on the loader. Oracle suite 2/2 pass. Guard
reports 111 offenders / exit 1 pre-migration (0 / exit 0 after Phase 004). No new benchmark-suite failures — the
`playbook-mode` + `skill-benchmark` vitest result is byte-identical to the pre-change baseline (10 pre-existing
failures, 74 passing).
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations
The loader now parses `stage:` but the downstream scorer does not yet bucket by it — holdout/negative scenarios
are still aggregated as routing (a pre-existing scorer limitation). The `stage:` field this phase adds is the
enabler for a future stage-aware-scoring pass; wiring it is out of this packet's de-numbering scope.
<!-- /ANCHOR:limitations -->
