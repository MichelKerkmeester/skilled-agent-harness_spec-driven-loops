# Spec — mcp-obsidian reference + asset template conformance

## Status

- **Level:** 2
- **State:** complete
- **Type:** Documentation conformance rewrite (skill docs only; no runtime code)

## Purpose

Align the 11 plugins' reference sets and the markdown asset docs in the `mcp-obsidian` skill to the sk-create-skill reference/asset templates — structure **and** harmonized content — because they were authored in separate batches and diverged (three divider styles, three index templates, inconsistent frontmatter, mixed section spines, inconsistent fixture naming).

## Scope

- **References (45 files):** `references/plugins/<p>/{data-model,workflows,troubleshooting,<p>}.md` × 11 plugins + `plugin-operation-logic.md`.
- **Asset docs (9 markdown):** the `.md` asset docs under `assets/` (raw `.json/.css/.beancount` fixtures are template-exempt — kebab-case naming only).
- **Fixtures:** normalize naming to the `.example.` infix; relocate the BRAT fixture under `assets/plugins/obsidian42-brat/`.

## Canonical target

Per `sk-create-skill/assets/skill/skill-{reference,asset}-template.md` + `template-rules.json`: 6-key frontmatter (bare 4-part version, `contextType` implementation for content docs / general for index+assets), H1 = title, 1–2-sentence intro, numbered ALL-CAPS H2, a `---` divider between every H2 (reference docs also after the intro), `## RELATED RESOURCES` last, no TOC/anchors. One canonical index shape (OVERVIEW-first). Per-doc section spines standardized (DIAGNOSIS SEQUENCE in troubleshooting, WHAT THE AI MUST NOT DO tail in data-model, per-recipe H2 in workflows).

## Acceptance criteria

- AC1: every reference + asset `.md` passes `validate_document.py` (exit 0).
- AC2: Style-A dividers present (a `---` between every H2), 0 H1≠title, 0 docs without frontmatter, all versions bare.
- AC3: fixtures renamed to the `.example.` convention + BRAT relocated, with every referencing path updated and 0 dangling links.
- AC4: 0 content drift — no code block, table, or schema fact dropped vs the pre-rewrite origin version.

## Outcome

All met. 54/54 docs pass; shipped to v4 as `b1e62fcc03`. Executor: cli-codex `gpt-5.6-luna` max/fast. Details in `implementation-summary.md`.
