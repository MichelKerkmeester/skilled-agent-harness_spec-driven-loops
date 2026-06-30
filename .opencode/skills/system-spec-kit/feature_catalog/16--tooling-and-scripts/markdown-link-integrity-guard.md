---
title: "Markdown link integrity guard"
description: "check-markdown-links.cjs resolves every relative markdown link across the skills, commands, and agents doc trees and fails CI when a target no longer exists, catching breakage from deleted or moved files that survives in unchanged referrers."
trigger_phrases:
  - markdown link integrity
  - check-markdown-links
  - broken markdown links
  - link integrity guard
  - dead doc link detection
version: 3.6.0.1
---

# Markdown link integrity guard

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

`check-markdown-links.cjs` is a repo-wide guard that verifies every relative markdown link and `[id]:` reference definition across the active skills, commands, and agents documentation resolves to a file on disk. It fails a pull request when any link points at a missing target.

It exists because feature removal, migration, and deprecation edits have deleted snippet files or moved targets without updating the hand-maintained catalog and playbook roots that link to them. Nothing else caught that breakage, so it accumulated silently. The guard scans the whole tree rather than changed files only, because a deleted target breaks links in files that did not themselves change. It complements the wikilink checker (`check-links.sh`), which validates `[[...]]` links.

## 2. HOW IT WORKS

The guard walks a fixed set of documentation roots (`.opencode/skills`, `.opencode/commands`, `.opencode/agents`, plus the `.claude` and `.opencode` agent and command trees). For each markdown file it strips fenced and inline code spans first (code is not link surface), then extracts markdown links and reference definitions. Each target is resolved against two bases — the source file's own directory and the repository root — and counts as valid if either resolves.

Archived, generated, changelog, and test-fixture paths are excluded by path segment, and a small explicit `(file, ref)` allowlist covers intentional template fill-in placeholders plus one illustrative example. Adding a genuinely new broken link still fails; the allowlist is the only set of waivers. A `--self-test` mode asserts the inline-code handling against synthetic inputs without walking the filesystem, including the cases that must never be hidden: a real link on the same line as inline code, and a link behind escaped backticks.

The guard is wired into CI through `.github/workflows/markdown-link-integrity.yml`, which runs it on pull requests that touch the documentation trees. Exit code 0 means clean; exit code 1 lists each broken link.

## 3. SOURCE FILES

### SOURCE EVIDENCE

### 1) Whole-tree link resolution

- **Implementation**
  - `.opencode/skills/system-spec-kit/scripts/check-markdown-links.cjs` walks the documentation roots, extracts links and reference definitions, and resolves each against the file directory or repository root.
- **HEAD evidence**
  - `node .opencode/skills/system-spec-kit/scripts/check-markdown-links.cjs` prints a single `... 0 broken` summary line and exits `0` on the current tree.

### 2) Code spans are not link surface

- **Implementation**
  - The resolver strips fenced code blocks and inline code spans before extraction. The inline strip matches equal-length backtick runs, treats a backslash-escaped backtick as literal, and blanks (rather than deletes) spans so reference definitions are not promoted from stripped lines.
- **HEAD evidence**
  - `node .opencode/skills/system-spec-kit/scripts/check-markdown-links.cjs --self-test` reports all cases passing, including the same-line and escaped-backtick cases that must stay caught.

### 3) CI enforcement

- **Implementation**
  - `.github/workflows/markdown-link-integrity.yml` runs the guard on pull requests touching the doc trees and fails the run on a broken link.

---

### VERIFICATION TRACEABILITY

### Check commands

- Whole-tree scan:
  - `node .opencode/skills/system-spec-kit/scripts/check-markdown-links.cjs`
- Inline-code self-test:
  - `node .opencode/skills/system-spec-kit/scripts/check-markdown-links.cjs --self-test`

### Expected clean output

- The whole-tree scan exits `0` and prints a single `... 0 broken` summary line.
- The self-test exits `0` and prints `self-test: all cases passed`.

### Configuration links (enforcement points)

- Guard script: `.opencode/skills/system-spec-kit/scripts/check-markdown-links.cjs`
- CI workflow: `.github/workflows/markdown-link-integrity.yml`
- Registry entry: `.opencode/skills/system-spec-kit/scripts/scripts-registry.json`

## 4. SOURCE METADATA
- Group: Tooling And Scripts
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `16--tooling-and-scripts/markdown-link-integrity-guard.md`

### SOURCE FILES

### Representative implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/system-spec-kit/scripts/check-markdown-links.cjs` | Script/guard | Repo-wide markdown-link resolver with fenced + inline code stripping, exclusion segments, allowlist, and `--self-test` |
| `.github/workflows/markdown-link-integrity.yml` | CI workflow | Runs the guard on pull requests touching the documentation trees |

Related references:
- [code-standards-alignment.md](code-standards-alignment.md) — Code standards alignment
- [spec-validation-rule-engine.md](spec-validation-rule-engine.md) — Spec validation rule engine (the wikilink rule lives here)
