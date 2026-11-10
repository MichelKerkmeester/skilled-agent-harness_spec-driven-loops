The diff read found every moved line in place and checked two corrections against the tree, both kept:
- The README's global-format row said `validate_document.py --type changelog` checks the summary-first order, the tier sections, the spec-folder line and the upgrade guidance. The changelog rule in `template-rules.json` requires no section, so the row now names what the validator checks, the frontmatter keys, a trigger phrase and the version phrase, and sends the rest to the by-hand check in `SKILL.md` section 9.
- `SKILL.md` no longer lists flowcharts among sk-doc's own packets: this hub registers none, and a flowchart routes to the `sk-design` hub's `/design:diagram`.

The H2 "How It Works (HOW_IT_WORKS): Changelog Output Modes" drops its token label; no file links its anchor.
