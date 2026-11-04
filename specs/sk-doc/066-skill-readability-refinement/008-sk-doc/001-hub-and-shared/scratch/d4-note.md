The diff read found every moved line in place. Two count corrections were checked against the tree:
- `core-standards.md` now lists every `validate_document.py --type` choice, adding the `code-folder` alias, `skill_router` and `benchmark_companion`, which match the parser's `choices` list.
- HEAD's "six alias entries, five of them `shared/` paths" was stale; the fixer had dropped the count, so it was set by hand to what `leaf-aliases.json` holds: five entries, four of them `shared/` paths.

The quick reference's closing "For complete documentation" line is now the `SKILL.md` row in its Related Resources.
