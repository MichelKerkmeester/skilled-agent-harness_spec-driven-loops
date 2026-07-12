---
title: "Decision Record: numbered snippet-filename prefix deprecation"
description: "The load-bearing decisions for the NNN- snippet-filename deprecation: hard rename, tolerate-then-rename sequencing, content-based scenario selection, explicit stage: frontmatter to preserve routing/holdout/negative grouping, a no-new-numbered-snippet guard, the in-scope/out-of-scope boundary, folding in adjacent corpus bugs, and reuse of the proven packet-108 engine."
importance_tier: "important"
contextType: "decision"
parent: "sk-doc/014-sk-doc-parent/027-catalog-naming-convention/002-deprecate-numbered-snippet-filenames"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/027-catalog-naming-convention/002-deprecate-numbered-snippet-filenames"
    last_updated_at: "2026-07-12T00:00:00Z"
    last_updated_by: "openai/gpt-5.6-terra-fast"
    recent_action: "Recorded decisions retained with completed migration evidence"
    next_safe_action: "Reference this completed child for future naming migrations"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Decision Record: Numbered Snippet-Filename Prefix Deprecation

## ADR-001 — Hard rename, no compatibility aliases

**Decision.** Rename each of the 111 files to its bare descriptive slug and delete the numbered name; do
**not** create symlinks, dual filenames, or a deprecation grace period.

**Why.** Mirrors sibling packet 025 ADR-001. Nothing computes on the number except the one loader gate
(`load-playbook-scenarios.cjs:302`), which is neutralized in Phase 001 before any rename lands in Phase 004,
and the reference sweep rewrites the 3 hub-routing index rows in the same pass — so there is no window in
which an alias would be needed. Git history preserves the old names.

## ADR-002 — Tolerate-then-rename sequencing

**Decision.** Land the number-agnostic loader change (Phase 001) and the generator fix (Phase 002) **before**
renaming any file (Phase 004). The loader must accept both `NNN-slug.md` and `slug.md` during the transition.

**Why.** `load-playbook-scenarios.cjs:302` currently ingests a sk-doc-shape scenario into the Lane C corpus
only if its basename is 3-digit-prefixed. Renaming before the loader changes would silently drop all 111
scenarios from the benchmark corpus — empirically reproduced this session. Tolerating both forms first means
every commit in the sequence keeps the full corpus, and 005 can assert the count is unchanged at the end
rather than hoping it stayed unchanged throughout.

## ADR-003 — Select scenario files by frontmatter/content, not by the filename number

**Decision.** Re-base `loadYamlFrontmatterScenarios()` from the `^\d{3}-.*\.md$` filename gate to a content
gate: any `*.md` file carrying scenario frontmatter, excluding the root `manual_testing_playbook.md` /
`feature_catalog.md` index files. Update the `code-opencode-playbook-ids.vitest.ts:28` oracle, which
re-implements the same regex, in lockstep.

**Why.** This is number-agnostic in both directions — numbered and un-numbered files load identically — and
the loader walk is already unsorted with scenario identity carried by the frontmatter `id:` field, so nothing
about scenario identity or benchmark order depends on the filename. This also closes a latent, pre-existing
bug where 10+ live playbooks whose files are single-digit or generator-output currently never match the
3-digit gate and are silently dropped from the corpus today, independent of this migration.

## ADR-004 — Preserve routing/holdout/negative grouping via explicit `stage:` frontmatter (operator decision A)

**Decision.** Before renaming a file, inject an explicit `stage: routing|holdout|negative` YAML frontmatter
field during migration for every scenario in the routing-recall and hub-routing benchmark categories.

**Amended during execution (operator decision — "all 88").** The pre-implementation estimate scoped this to
63 files; the live tree actually holds 88 files in those two categories. The operator chose to stamp all 88
explicitly — 14 holdout + 5 negative + 69 routing — rather than only the 19 token-carrying files (which would
have relied on the loader's absent-defaults-to-routing behavior for the rest). The 23 feature-oriented files
(language-standards, implementation-quality, performance-animation, deployment-forms-video,
authoring-verification, config-hooks, quality-gate) encode no benchmark tier and receive no `stage:` field.

**Why.** The ordinal's only surviving meaning across the corpus is this grouping. Once the prefix is gone,
nothing else preserves it. Encoding the grouping as frontmatter keeps it explicit and machine-readable rather
than depending on a future consumer inferring it from a filename token that no longer exists after the rename.

## ADR-005 — No-new-numbered-snippet guard (mirrors 025 ADR-005)

**Decision.** Add a check (owned alongside the Phase 001 loader change) that FAILS when a newly created
`feature_catalog|manual_testing_playbook/<category>/NNN-*.md` file appears. Grandfather nothing — after Phase
004 there are no in-scope numbered snippet files, so any new one is a regression.

**Why.** These 111 files are themselves proof that deprecation without a guard rots back: they were
re-introduced 5+ weeks after packet 108 removed the same pattern repo-wide. A guard makes the de-numbered form
self-enforcing instead of relying on authors remembering the convention.

## ADR-006 — Scope boundary: 111 in scope, 20 excluded, 026 is a fresh packet

**Decision.** The 111 three-digit-prefixed files across the 9 named packets (`cli-external` and its
`cli-claude-code`/`cli-opencode` modes, `mcp-tooling` and its `mcp-chrome-devtools`/`mcp-click-up`/`mcp-figma`
modes, `sk-code` and its `code-review`/`code-opencode`/`code-webflow`/`code-quality` modes, `sk-prompt`, and
`system-deep-loop`'s `deep-improvement`/`deep-research`/`deep-review` modes) are in scope. The 20
system-spec-kit single-digit files (`feature-flag-reference/1-7`, `pipeline-architecture/4 & 7`,
`retrieval/4-stage-pipeline-architecture`) are excluded — their leading digit is a legitimate reading-order or
topic-name token, not an ordinal, and packet 108 already applied its intended rule to them. Changelogs and
`z_archive/` history stay frozen. 026 is scoped as its own fresh packet, not a resumption of archived 108
(completed 2026-06-06, file-level, whole repo) and not folded into sibling 025 (category folders only) — the
111 postdate 108 by 5+ weeks, created by the Smart-Routing Benchmark Program.

**Why.** A naive `^[0-9]+-` grep false-positives on the 20 legitimate files; touching them would undo
correct, already-shipped work from 108. Keeping 026 as its own packet — rather than reopening 108 or merging
into 025 — keeps each packet's scope, history, and completion status honest.

## ADR-007 — Fold adjacent corpus bugs into 026 (operator decision B)

**Decision.** Fix the 2 failing vitest suites (`system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts`,
`system-spec-kit/scripts/tests/outsourced-agent-handback-docs.vitest.ts` — both hardcode stale numbered
filenames from a prior scheme and fail with ENOENT) and sweep the 7 dead allowlist entries in
`system-spec-kit/scripts/tests/workflow-invariance.vitest.ts:97-104`, as part of Phase 004, alongside the
`playbook-generator.cjs` numbered-emission fix in Phase 002.

**Why.** These are the same corpus the migration already touches, and they are broken for the same class of
reason — stale assumptions about numbered filenames. Fixing them in the same migration avoids leaving the
corpus half-consistent immediately after 026 ships.

**Deferred during execution.** On inspection, these 2 suites and 7 allowlist entries hardcode
**system-spec-kit's own** numbered feature_catalog/playbook docs (e.g. `273-1-search-pipeline-features-speckit.md`,
`149-outsourced-agent-memory-capture.md`, `411-causal-graph-link-quality.md`) — files outside the 111-file
scope, in a skill explicitly excluded from de-numbering per ADR-006, and under active concurrent-session churn
during execution (11 dirty files). The 111-file de-numbering is complete and independently verified without
them, so folding them in offered no dependency benefit and would have collided with in-flight work. Deferred to
a dedicated system-spec-kit maintenance pass.

## ADR-008 — Reuse the proven packet-108 engine

**Decision.** The Phase 003 migration script (`denumber-snippet-filenames.mjs`) is adapted from archived packet
108's `denumber-snippets.cjs` — a complete, dry-run-default engine with hard collision-abort before any write
and a basename-keyed, word-boundary-safe reference sweep — retargeted from 108's flat per-tree file scan to
the scoped 111-file set, with `stage:` frontmatter injection added.

**Why.** Reusing a proven engine beats authoring a new one blind. 026 must not repeat 108's own
self-exclusion bug, where its deny-list referenced a non-existent `999-sk-doc-parent` path instead of the
correct packet path — 026's deny-list must reference the real `014-sk-doc-parent` path so this packet's own
files are correctly excluded from the scan.
