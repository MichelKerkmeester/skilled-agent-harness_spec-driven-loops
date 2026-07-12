---
description: Fully conformant command-shaped fixture doc, the clean-lane counterpart to docs/commands/lint-docs.md.
argument-hint: <target> [--dry-run]
allowed-tools: Read
---

# Well-Formed Command

A small command-shaped doc bundled as clean fixture data: it classifies as `command` from its `commands/` path segment, the same way `docs/commands/lint-docs.md` does, but carries both of the document type's required sections on purpose.

---

## 1. PURPOSE

Demonstrate a `command`-classified artifact that clears the authority's structural checks in full, as the direct clean-lane counterpart to the fixture's deliberately gapped `docs/commands/lint-docs.md`. Nothing about this file's shape is unusual; it simply does not skip a required section the way its sibling does.

---

## 2. INSTRUCTIONS

Read top to bottom. There is nothing to execute — this document is fixture data, not a real dispatcher — but it is shaped exactly like a real command doc would be: a `purpose` explaining what the command is for, and an `instructions` section explaining how it would be used if it were real.

```text
well-formed <target> [--dry-run]
```

The two required sections above are both present, both numbered, and neither is missing — the property this file exists to demonstrate.
