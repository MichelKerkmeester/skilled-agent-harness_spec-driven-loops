# Phase 001 — sk-doc Standards & Templates De-Numbering (MiMo authoring brief)

## Context
CWD is the repo root of an OpenCode AI-assistant framework. The `sk-doc` skill defines how "feature catalog" and "manual testing playbook" documentation packages are created. Today, per-feature snippet FILES carry a numeric prefix (`001-feature-name.md`, `NNN-feature-name.md`, `{NN}-{feature-name}.md`) that is globally sequential across categories. We are REMOVING that numeric prefix from snippet FILENAMES, while KEEPING the numeric prefix on the CATEGORY FOLDERS (`NN--category-name/` stays). This task updates ONLY the sk-doc standards/templates/commands that DEFINE the convention. It does NOT rename any real snippet file (that happens in a later phase).

Spec folder: `.opencode/specs/sk-doc/013-catalog-playbook-snippet-denumbering/001-sk-doc-standards-and-templates` — pre-approved at Gate 3. Do NOT ask about documentation or spec folders; it is already answered.

## Objective
You are READ-ONLY. Do NOT modify any file. Produce a precise, apply-ready EDIT PLAN (JSON) that de-numbers per-feature snippet FILENAMES across exactly the 14 files listed below, keeping category-folder numbering and the validator logic unchanged.

## Transformation rules (apply consistently)
1. Snippet FILENAME tokens lose the numeric prefix:
   - `001-feature-name.md`, `002-...`, `NNN-feature-name.md` → `feature-name.md`
   - `{NN}-{feature-name}.md`, `{NNN}-{feature-name}.md` → `{feature-name}.md`
   - `{NNN-1}-{neighboring-feature}.md` / `{NNN+1}-...` → `{neighboring-feature}.md`
   - In example/scaffold links, the URL path and the link text both de-number: `[001-foo.md](001-foo.md)` → `[foo.md](foo.md)`; `(01--cat/001-foo.md)` → `(01--cat/foo.md)`.
2. CATEGORY FOLDER tokens KEEP their number — NEVER strip a folder number: `01--category-name/`, `NN--category-name/`, `{CAT1_DIR}` stay exactly as-is. This is the #1 guardrail.
3. Feature IDs in content are NOT filenames — leave untouched: `{CAT}-001`, `{CAT1}-001`, `M-219`, `EX-001`, `PREFIX-NNN`. Only the `.md` FILE path de-numbers, never an ID.
4. ADD an explicit ordering rule to BOTH reference docs (feature_catalog_creation.md and manual_testing_playbook_creation.md): a sentence stating "Per-feature snippet order is defined by the root catalog/playbook listing order; filenames no longer encode order. Category folders keep `NN--` numbering for section order." Place it where the old numbering rule was.
5. In `validate_document.py` and `template_rules.json`: change ONLY the stale comment/description wording that implies an `NNN-` file prefix (e.g. the comment "Per-feature playbook files: under manual_testing_playbook/NN--category/NNN-feature.md" → drop the `NNN-`). Do NOT change any validation logic, regex, or code behavior.

## The 14 files (read each for exact current text before composing edits)
1. `.opencode/skills/sk-doc/references/feature_catalog_creation.md` — package-highlights/invariants, the §3 canonical tree (`001-/002-/003-feature-name.md` + a "numbers continue across categories" comment), the §3 invariant line "per-feature files use `NNN-feature-name.md` with a globally sequential 3-digit prefix...", and the §3/§4 naming rule about per-feature numbering. Replace numbering prose with the no-prefix rule + the ordering rule (rule 4).
2. `.opencode/skills/sk-doc/references/manual_testing_playbook_creation.md` — the §3 canonical tree (`001-/002-feature-name.md`) and the §3 invariant "per-feature files use stable numeric slugs such as `001-feature-name.md`". Replace with no-prefix + ordering rule.
3. `.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md` — §1 canonical tree, §3 "Category and File Design" table examples + the rule "Per-feature files use `NNN-feature-name.md` with a globally sequential 3-digit prefix...", §4/§5 scaffold path `feature_catalog/{CATEGORY_DIR}/{NN}-{feature-name}.md`, §5 SOURCE METADATA `Feature file path: {CATEGORY_DIR}/{NN}-{feature-name}.md`, §5 Related references `{NNN-1}`/`{NNN+1}`, §7 checklist line "Per-feature file numbers are globally sequential across categories... 3-digit zero-padded".
4. `.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_snippet_template.md` — §3 "Copy ... into feature_catalog/{CATEGORY_DIR}/{NN}-{feature-name}.md", §4 SOURCE METADATA `Feature file path: {CATEGORY_DIR}/{NN}-{feature-name}.md`, §4 Related references `{NNN-1}`/`{NNN+1}`, §4 authoring note "Preserve the feature file path and category numbering" (clarify: category FOLDER numbering preserved; file has no number).
5. `.opencode/skills/sk-doc/assets/testing_playbook/manual_testing_playbook_template.md` — §1 canonical tree, §3 per-feature path `manual_testing_playbook/{CATEGORY_DIR}/{NNN}-{feature-name}.md`, §7/§8 "Feature File" links `({CAT1_DIR}/001-{FEATURE_SLUG}.md)`, §6 scaffold path, §5 metadata path `{CATEGORY_DIR}/{NNN}-{feature-name}.md`, §10 cross-reference index links `({CAT1_DIR}/001-{FEATURE_SLUG}.md)`. KEEP all Feature IDs like `{CAT1}-001`.
6. `.opencode/skills/sk-doc/assets/testing_playbook/manual_testing_playbook_snippet_template.md` — §2 "Copy this into manual_testing_playbook/{CATEGORY_DIR}/{NNN}-{feature-name}.md", §5 SOURCE METADATA `Feature file path: {CATEGORY_DIR}/{NNN}-{feature-name}.md`.
7. `.opencode/commands/create/feature-catalog.md` — any numbered snippet-filename guidance/examples.
8. `.opencode/commands/create/testing-playbook.md` — any numbered snippet-filename guidance/examples (this file is a known referrer to numbered snippet paths).
9. `.opencode/commands/create/assets/create_feature_catalog_auto.yaml` — scaffold instructions referencing numbered snippet filenames.
10. `.opencode/commands/create/assets/create_feature_catalog_confirm.yaml` — same.
11. `.opencode/commands/create/assets/create_testing_playbook_auto.yaml` — same.
12. `.opencode/commands/create/assets/create_testing_playbook_confirm.yaml` — same.
13. `.opencode/skills/sk-doc/scripts/validate_document.py` — the stale comment near the playbook-feature detection (mentions `NNN-feature.md`). Comment wording ONLY; do NOT touch the regex `^\d{2}--` or any logic.
14. `.opencode/skills/sk-doc/assets/template_rules.json` — the description string mentioning `manual_testing_playbook/NN--category/` (ensure it does not imply a file-number prefix). Description text ONLY.

If a file genuinely needs no change, omit it from the output and note it.

## Style
precise, no preamble

## Tone
neutral

## Audience
automated pipeline — your output is parsed and applied directly by the orchestrator via exact string replacement; prose wrapping around the JSON is harmful.

## Response
Return ONLY a single JSON object, no surrounding prose, in one fenced ```json block:
```json
{
  "edits": [
    {
      "file": "<repo-relative path>",
      "changes": [
        { "old": "<exact existing text copied verbatim, 2-5 lines incl. enough unique surrounding context to match exactly once>", "new": "<replacement text>" }
      ]
    }
  ],
  "notes": "<= 3 short lines: any ambiguity, any file needing no change, any judgement call"
}
```
Rules for the output:
- Each `old` MUST be copied verbatim from the current file (exact whitespace/indentation) so it matches exactly once.
- Keep each change surgical — change only the numbered-filename tokens + (for the two references) add the ordering-rule sentence. Do NOT rewrite whole sections or alter unrelated content.
- Every `new` MUST preserve all `NN--` category-folder numbers and all Feature IDs present in the corresponding `old`.

## Pre-plan (lean)
1. Read all 14 files → list every numbered-FILENAME token (exclude folder numbers and Feature IDs) → expected: per-file change list.
2. For each token, craft `old`/`new` dropping the file number while preserving folder numbers + Feature IDs → acceptance: every `new` still contains the same `NN--` and `{CAT}-NNN` tokens that its `old` had.
3. Add the ordering-rule sentence to the two reference docs → acceptance: both contain an explicit "root listing defines order" statement.
