---
title: "Research: numbered category-prefix consumer & blast-radius investigation"
description: "Findings from four parallel GPT-5.6-sol xhigh agents (inventory/collisions, runtime consumers/ordering, reference surface, convention/risk) that scoped the NN-- prefix deprecation: 390 folders, ~6,500 references, and exactly one hard runtime dependency."
importance_tier: "important"
contextType: "research"
parent: "sk-doc/999-sk-doc-parent/025-deprecate-numbered-category-prefix"
_memory:
  continuity:
    packet_pointer: "sk-doc/999-sk-doc-parent/025-deprecate-numbered-category-prefix"
    last_updated_at: "2026-07-10T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Synthesized 4-agent GPT-5.6 investigation"
    next_safe_action: "Proceed to implementation"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: research | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Research: Numbered Category-Prefix Consumers & Blast Radius

## Method

Four `openai/gpt-5.6-sol-fast --variant xhigh` agents ran in parallel, each on a disjoint question, followed by
a repo re-count to confirm every number the agents reported. Findings below are stated as **confirmed**
(re-verified against the tree at HEAD `37fc5f789a`) or **inferred**.

## A — Inventory & collisions (confirmed)

- **390 numbered folders**: **123** under `feature_catalog/`, **267** under `manual_testing_playbook/`, across
  **34 skills**, 51 parent directories.
- **Zero collisions** — stripping the `NN--` prefix yields a distinct descriptive slug in every parent; no two
  categories in the same skill collapse onto one name.
- **115** `category:` frontmatter values embed the numbered form; ~15 leaf docs already use a de-numbered
  `category:` (e.g. `hub-routing`), so the field is not uniformly numbered today.
- No other numbering variants (no 1-digit, 3-digit, or `NN_` forms) — the shape is uniformly `^\d{2}--<slug>`.

## B — Runtime consumers & ordering (confirmed) — the load-bearing finding

1. **The one hard dependency: sk-doc leaf classification.** `validate_document.py` classifies a markdown file
   as `feature_catalog` / `playbook_feature` (and runs its taxonomy + placeholder-row checks) **only when the
   file's immediate parent matches `^\d{2}--`** — `scripts/validate_document.py:129,135` and the identical
   `shared/scripts/validate_document.py:129,135`. De-numbering a folder without changing this regex silently
   downgrades every child to the generic `readme` type: catalog/playbook checks stop running, unrelated readme
   rules may run instead. **This is the single change that makes the whole migration safe.**
2. **No numeric ordering anywhere.** No consumer parses `NN` as an integer. `frontmatter-version.mjs` sorts
   lexically on the *whole path* (`:222-242`) — the prefix affects presentation order but is never parsed as a
   number. Ordering that matters (benchmark scenario order, catalog display) is driven by the **root index
   tables**, not the filesystem.
3. **The benchmark loader is number-agnostic.** `load-playbook-scenarios.cjs` derives a scenario's `category`
   from the root index or the folder basename (`:317`), then `classifyKind()` (`:56-74`) matches descriptive
   keywords (`motion|animation|browser|performance|visual|…`) — **never the digits**. Stripping `NN--` leaves
   the slug (and therefore every keyword match) intact. Confirmed by reading the function.
4. **No catalog-index generator is executable.** Catalog/playbook index maintenance is an AI-run YAML workflow
   (in the `/create:*` command docs), not a script — so "new folder" generation is governed by the convention
   docs (Phase 001), not code.
5. **No memory / code-graph / skill-advisor indexer consumes catalog markdown by default** — the SKILL.md
   router *prefix* config is the exception (see C), but the daemons do not walk the category folders.
6. **Relative links are load-bearing.** The whole-workspace markdown-link CI guard recursively checks catalog
   roots and leaves; a rename without a lockstep link rewrite fails CI. Several tests hard-code exact
   category/leaf paths and must be updated with the rename.

## C — Reference surface (confirmed count ≈ 6,500)

| Surface | Approx. count | Handling |
|---------|--------------:|----------|
| Index-table path rows (`feature_catalog.md` / `manual_testing_playbook.md`) | ~1,052 | Rewrite (script) |
| Markdown nav / cross-ref links across ~1,841 files | ~5,298 | Rewrite (script), **minus** changelog/history |
| Frontmatter `category:` values | 115 | Rewrite (script) |
| SKILL.md router-config prefixes | 2 skills | Rewrite (script) — see below |

**Load-bearing router config (confirmed lines):**
- `system-skill-advisor/SKILL.md:129,133,137,145` — `"prefixes": [… "feature_catalog/04--scorer-fusion/",
  "manual_testing_playbook/08--scorer-fusion/" …]`.
- `system-code-graph/SKILL.md:131,136-150,155,160,164,171` — `"support_prefixes"` / nested prefix arrays that
  name specific numbered folders, plus prose table rows citing numbered leaf paths (`:308,309`).

## D — Convention authority & recommendation (confirmed authority, adopted recommendation)

- **Convention authority** = two sk-doc packets: `create-feature-catalog/SKILL.md` (the `NN--category-name`
  mandate) and `create-manual-testing-playbook/SKILL.md`, plus their templates and the `/create:*` command
  YAMLs that generate new catalogs/playbooks.
- **`subfolder-utils.ts:15-22`** already tolerates both forms (`/^(?:\d{2}--[a-z]…|[a-z]…)$/`) — no change
  needed there; it is evidence the de-numbered form was always structurally legal.
- **Adopted recommendation (D):** hard-rename all folders and fix every live consumer in the *same* migration;
  add a regression guard rejecting new numbered folders; **leave changelogs/history numbered**; no compat
  symlinks. This packet refines D by splitting "make consumers tolerant" (001+002) from "rename" (004) so each
  commit is independently valid.

## Net conclusion

The prefix is **safe to remove** because nothing computes on the number. The migration's entire risk collapses
to one class of change — leaf classification in `validate_document.py` — plus mechanical, scriptable reference
rewrites. Phase 002 neutralizes that risk before Phase 004 touches a single folder.
