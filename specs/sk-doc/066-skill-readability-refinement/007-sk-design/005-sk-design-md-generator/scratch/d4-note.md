The diff read found one loss, fixed by hand: the editorial exemplar's intro had become a hook naming "a magazine, a museum or a shop", which HEAD never said, and had dropped "without turning it into a reusable preset". Its HEAD intro is back.

The fixer also corrected six stale facts, each checked against the tree and kept:
- `backend/package.json` now pins `engines.node` to `>=20`, so `SKILL.md` no longer says the range is unpinned.
- The latest changelog is no longer `v1.0.0.0`; the pointer follows the current release.
- `backend/scripts/` holds 28 TypeScript modules plus `css-tree.d.ts`, not 20.
- The older Vercel extraction's Colors table has 42 rows, not 41.
- The design-judgment sibling is `sk-design`; no `interface` skill exists.
- The DESIGN.md format's Quick Start is section 15, as its own heading says, not 16.

Everything else moved: the success-criteria checklist reads as unchecked boxes, the component-taxonomy labels became list items, and numeric-design-laws folds its "how this skill uses it" section into the overview, keeping the rule that this document reports and `sk-design` decides. The writing style guide's final quality gate moved to the end, section 20, with sections 15 to 20 moving up one; the anti-patterns and color-role-taxonomy files reorder their sections, and troubleshooting's Tests is now section 6. No file cites those sections by number; the playbook's troubleshooting citations, sections 2 and 3, are unchanged.

The skill's independent pre-commit review led to hand fixes here: the four example `DESIGN.md` files under `references/examples/` are back to HEAD, because the fixer had put a blank line between the base-unit and density lines that the formatter writes together and the docs paste unchanged; and the numeric-design-laws overview keeps its four example thresholds, a contrast pair, a motion band, a spacing step and a type ratio.
