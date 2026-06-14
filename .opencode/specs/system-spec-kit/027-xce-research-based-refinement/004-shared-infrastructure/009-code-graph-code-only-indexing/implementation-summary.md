---
title: "Implementation Summary: Code Graph Code-Only Indexing and Selectable Maintainer Mode"
description: "Dropped markdown from the code graph's default include globs (code + structured config still index) and made SPECKIT_CODE_GRAPH_MAINTAINER_MODE selectable via a pure resolver so the maintainer indexes only skills+plugins. Tests updated/added, dist rebuilt, docs synced."
trigger_phrases:
  - "code only indexing summary"
  - "exclude markdown shipped"
  - "selectable maintainer mode summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/009-code-graph-code-only-indexing"
    last_updated_at: "2026-06-14T11:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped code-only graph indexing + selectable maintainer mode"
    next_safe_action: "Recycle code-index daemon + full rescan to drop existing md nodes"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Complete (code + tests + build; rescan deferred to next daemon load) |
| **Level** | 1 |
| **Parent** | `../spec.md` (004-shared-infrastructure phase parent) |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Completed** | 2026-06-14 |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The code graph no longer indexes markdown. `**/*.md` was removed from `defaultIncludeGlobs` in `indexer-types.ts`, so prose docs (including the framework's `SKILL.md`, agent, command and spec markdown, and external users' READMEs) are excluded from the walk. Code (ts/tsx/mts/cts/js/jsx/mjs/cjs/py/sh/bash/zsh) and structured config (json/jsonc/yaml/yml/toml) are kept — config still registers as `language='doc'` rows, so the `'doc'` language itself stays.

Maintainer-mode is now selectable. `SPECKIT_CODE_GRAPH_MAINTAINER_MODE` was the only `.env.local` knob that can beat the committed `INDEX_*=false` (the launcher force-assigns `process.env`, and config otherwise wins over file). A pure exported `resolveMaintainerModeCategories(raw)` in `mk-code-index-launcher.cjs` now maps `"true"` to all five categories (back-compat), `"skills,plugins"` to that subset, and `"false"`/empty/unknown to none; the launcher force-sets only the resolved categories' `INDEX_*`. The gitignored `.env.local` was set to `skills,plugins` — the only `.opencode` folders with real code once markdown is excluded. ENV_REFERENCE and `lib/README.md` were updated to match.

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Investigation established the two independent gates: the file-type allowlist (`defaultIncludeGlobs`) and the category scope (`INDEX_*`). Dropping `**/*.md` at the file-type gate excludes markdown regardless of category opt-in. The indexer test proved the change empirically — `agents/code.md` and `SKILL.md` dropped from the `'doc'` rows while `rules.json` stayed — and its now-stale expectations were updated to assert markdown is excluded even in opted-in folders. The maintainer resolver was extracted to a pure function and unit-tested (`true`→all five, `skills,plugins`→two, unknown/empty→none) rather than testing the inline launcher block. The dist was rebuilt (`tsc --build`, clean). `node --check` on the launcher and comment-hygiene on all edited code passed.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- Keep structured config, drop only prose docs (user choice): json/yaml/toml carry dependency/structure signal the graph can use; markdown is documentation.
- Remove markdown at the file-type gate, not the category gate: one change excludes it in every scope (default + maintainer), keeping the category flags purely about which `.opencode` folders are in range.
- Selectable maintainer-mode via the one knob that works: per-`INDEX_*` in `.env.local` is inert because the committed config already sets those keys (config wins over file); `MAINTAINER_MODE` is the override that force-assigns, so it carries the category selection.
- Pure resolver + unit test instead of testing the inline launcher closure.

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Markdown excluded / config kept | PASS: `code-graph-indexer.vitest.ts` 61 pass (md dropped, json kept; explicit `.md` exclusion asserted) |
| Maintainer resolver | PASS: `launcher-maintainer-mode.vitest.ts` (true / subset / unknown / empty) |
| Parser regression | PASS: `tree-sitter-parser.vitest.ts` ('doc' language intact for config) |
| Build | PASS: `tsc --build` clean |
| Launcher syntax + hygiene | PASS: `node --check` + comment-hygiene clean on all edited code |
| `launcher-lease.vitest.ts` | PRE-EXISTING FAIL (environmental): fails identically on HEAD's launcher with my changes stashed — process-spawn contention on the shared host, not this change |

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- The change activates when the code-index daemon next loads the new launcher + dist (next session); a one-time full `code_graph_scan` is then needed to drop the existing `.md` `'doc'` rows from the live graph.
- The default-scope change affects external users too: their own `.md` files stop being graphed. This is intended (the graph models code, not docs); a caller can still re-add markdown for a specific scan via `includeGlobs`.
- `launcher-lease.vitest.ts` is red in this environment independent of the change (verified against HEAD); not addressed here.

<!-- /ANCHOR:limitations -->
