# Synthesis — Project Manager plugin docs (deprecated)

**Reviewer:** fresh eyes, no prior context
**Date:** 2026-08-22
**Scope:** decide what, if anything, to do to the Project Manager plugin's shipped docs before removal.

---

## Verdict

**No doc investment is warranted.** The plugin is deprecated and uninstalled, its dedicated reference docs and feature-catalog entry are already deleted, and the surviving mentions are accurate. There is nothing to fix before the deprecation phase closes out.

---

## Recommendations

- **No pre-deprecation fix needed (P0/P1/P2: none).** The research leg was a deliberate skip-note, not a findings report — it surfaced nothing materially wrong because it never ran. Independently checking the shipped surface confirms there is no correctness debt to pay down.
- **Leave the historical changelog mentions as-is.** `changelog/v0.20.0.0.md` and `changelog/v0.21.0.0.md` reference the plugin as part of the record of when it was added/removed. Changelogs are append-only history; editing them would be wrong, not a fix.
- **No action on the roster.** `references/plugins/installed-plugins.md` already documents the removal accurately (see CONFIRMED below), so it does not misrepresent the vault state.
- **Nothing to hand to phase `008-notion-bases-consolidation`.** The removal it was tracking has already happened for this plugin's docs; there is no leftover deletion for it to perform here.

---

## CONFIRMED (evidence read directly)

- **Research leg was intentionally skipped, not researched.** `.../003-project-manager/research/research.md` is a skip-note: plugin `StepanKropachev/obsidian-pm` "deprecated and uninstalled from the vault on 2026-08-22," role consolidated onto Notion Bases + Meta Bind + JS Engine. No findings exist to act on.
- **Dedicated reference docs are already gone.** `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/` has no `project-manager/` directory (listing shows advanced-canvas … outliner; no PM).
- **Feature-catalog entry is already gone.** `.opencode/skills/mcp-tooling/mcp-obsidian/feature-catalog/plugins/` has no `project-manager.md`.
- **Only three files still mention it, all accurate:**
  - `references/plugins/installed-plugins.md:80` — states "**Project Manager was removed** (deprecated 2026-08-22)," with the consolidation rationale. This is correct and current, not a stale "installed" claim.
  - `changelog/v0.20.0.0.md` and `changelog/v0.21.0.0.md` — historical references only.

## INFERRED (not directly verified)

- **No other skill or catalog links point at the deleted PM docs.** A `grep -ril` across the `mcp-obsidian` skill returned only the three files above; a broken cross-reference elsewhere in the repo (outside `mcp-obsidian`) was not exhaustively checked. If the deprecation phase wants certainty, a repo-wide grep for `project-manager`/`obsidian-pm` would confirm no dangling links remain — but nothing in scope suggests one exists.
- **Phase `008-notion-bases-consolidation` has no residual PM doc-deletion work.** Inferred from the docs already being absent; the phase's own task list was not read.
