Independent code review (READ-ONLY). You may run git and read files. Do NOT modify any file.

# Task
Audit git commit `1e58d845af` ("docs(117): remove TOC blocks + HTML anchor comments from skill docs") in this repo. The commit removed Table-of-Contents blocks and `<!-- ANCHOR -->` HTML comment delimiters from ~857 skill markdown files plus 20 standards/config/template/command files. Your job: find anything the cleanup broke **by accident**.

This is **Iteration 1 of 10**. Focus dimension: **CORRECTNESS — TOC-removal content safety on high-risk files**.

# What the change was supposed to do
- Remove `## TABLE OF CONTENTS` heading + its `[text](#anchor)` bullet list + a wrapping `<!-- ANCHOR:table-of-contents -->`.
- Remove standalone `<!-- ANCHOR:name -->` / `<!-- /ANCHOR:name -->` comment lines.
- Collapse redundant `---` rules / blank lines left behind.
It must NOT have removed or altered prose, real section headings (other than the TOC heading itself), tables, code blocks, non-TOC list items, or frontmatter.

# This iteration — inspect these high-TOC-risk files in the commit
Sample broadly across the removed-TOC files (READMEs, manual_testing_playbook roots, feature_catalog roots). Suggested commands:
- `git show --stat 1e58d845af | head -40`
- `git show 1e58d845af -- .opencode/skills/cli-gemini/README.md .opencode/skills/cli-codex/manual_testing_playbook/manual_testing_playbook.md .opencode/skills/deep-research/feature_catalog/feature_catalog.md .opencode/skills/system-skill-advisor/README.md .opencode/skills/deep-loop-runtime/README.md`
- Pick ~10 more removed-TOC files of your choosing from `git show --stat 1e58d845af --name-only` and inspect their diffs.
- For each, confirm every `-` (removed) line is ONLY: a TOC heading, a TOC `[...](#...)` link bullet, an `<!-- ANCHOR -->` comment, a blank line, or a `---` rule. Flag any removed line that is real prose, a non-TOC heading, a table row, code, or a real list item — that is content loss.
- Spot-check that the post-removal file still reads coherently (no orphaned intro like "see the table below" pointing at a deleted TOC; first real section follows the title/tagline cleanly).

# Carve-outs — do NOT flag these
- `system-spec-kit/templates/**` keep `<!-- ANCHOR -->` markers (intentional, tooling-consumed).
- `sk-doc/scripts/tests/**` fixtures keep TOCs (validator test data).
- `research/research.md` ToC allowance; Webflow "Table of Contents" web component in `sk-code`.
- Inline anchor *mentions* in prose/commands (they reference, not declare, anchors).

# Output (to stdout only)
1. A markdown section "## Iteration 1 — Correctness (TOC content safety)" with: files inspected (list), method, and each finding.
2. For each finding: `- [P0|P1|P2] <file>:<line-or-hunk> — <one-line claim>` then an indented evidence line (the offending removed content) and why it is a defect. P0=content/functionality broken; P1=regression risk/inconsistency; P2=polish.
3. If no defects: say "No defects found in this dimension/sample."
4. FINAL LINE, exactly one, machine-parseable:
`FINDINGS_JSON: {"iteration":1,"dimension":"correctness","p0":<n>,"p1":<n>,"p2":<n>,"verdict":"PASS|CONDITIONAL|FAIL","summary":"<<=160 chars"}`
