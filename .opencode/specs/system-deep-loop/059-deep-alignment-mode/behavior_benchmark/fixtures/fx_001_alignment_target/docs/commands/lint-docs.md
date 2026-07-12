---
description: Read-only lint pass over a markdown directory against the sk-doc authority's structural rules.
argument-hint: <path> [--json]
allowed-tools: Read
---

# Lint Docs

A small command-shaped doc bundled as fixture data: it classifies as `command` because it sits under a `commands/` path segment, the same way a real `.opencode/commands/` entry would.

---

## 1. PURPOSE

Walk a directory of markdown files and report which ones would fail the authority's structural checks, without changing anything on disk. This is a read-only linting pass, not an auto-fixer.

---

## 2. SCOPE

Applies to any markdown file under the target directory, excluding the same generated/vendor paths the real validator already skips (`node_modules`, `.git`, `dist`, `build`, and friends). A single file may be passed directly instead of a directory.

```bash
lint-docs <path> [--json]
```

---

## 3. NOTES

This fixture doc intentionally omits its second required section on purpose, to seed a real, structural `missing_required_section` finding for the `command` document type — the corpus needs at least one genuine command-shaped gap alongside its skill-shaped one.
