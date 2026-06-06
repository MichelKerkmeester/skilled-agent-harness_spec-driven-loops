Independent code review (READ-ONLY). You may run git and read files. Do NOT modify any file.

# Task
Audit git commit `1e58d845af` (removed TOC blocks + `<!-- ANCHOR -->` HTML comments from ~857 skill markdown files + 20 standards/config/template/command files). Find anything the cleanup broke **by accident**.

This is **Iteration 2 of 10**. Focus: **CORRECTNESS — anchor-comment removal + markdown structure**.

# ALREADY KNOWN (do not re-report as new; a different class)
Iteration 1 already found P1: orphaned **numbered** TOC link lists (`N. [text](#anchor)`) left behind after the heading was removed, in ~8 files (install guides + a few READMEs: mcp-chrome-devtools, mcp-code-mode, system-spec-kit/mcp_server INSTALL_GUIDE.md, sk-git/README.md, deep-research/README.md, mcp-chrome-devtools README + examples/README, system-spec-kit/mcp_server/ENV_REFERENCE.md). You may note if you see more instances of THIS class, but focus your effort on OTHER defects below.

# This iteration — look for NEW defect classes
1. **Anchor-comment removal damage:** the commit removed standalone `<!-- ANCHOR:name -->` / `<!-- /ANCHOR:name -->` lines. Check that removal did NOT: merge two paragraphs that should stay separate, delete a real content line adjacent to an anchor, leave a dangling `<!-- /ANCHOR ... -->` glued to a content line, or remove an anchor whose absence breaks a heading/section boundary.
2. **Markdown structure regressions:** scan a broad sample of changed files (use `git show --stat 1e58d845af --name-only`, pick ~15 across skills) for: consecutive/duplicated `---` horizontal rules, a `---` immediately after frontmatter that orphans content, empty sections (heading followed immediately by another heading), and broken intra-doc links (`](#...)` pointing at a section that no longer exists, outside the known orphaned-TOC files).
3. **Blank-line / spacing corruption** inside fenced code blocks (the transform should have skipped fences — verify a few files with code fences were not altered inside the fences).

Suggested: `git show 1e58d845af -- <file>` for chosen files; compare removed vs retained lines.

# Carve-outs — do NOT flag these
`system-spec-kit/templates/**` anchors; `sk-doc/scripts/tests/**` TOC fixtures; `research/research.md` ToC; Webflow "Table of Contents" web component in `sk-code`; inline anchor *mentions* in prose/commands.

# Output (stdout only)
1. "## Iteration 2 — Correctness (anchors + structure)": files inspected, method, findings.
2. Per finding: `- [P0|P1|P2] <file>:<line/hunk> — <claim>` + indented evidence + why. P0=content/functionality broken; P1=regression risk/inconsistency; P2=polish.
3. If none: "No NEW defects found in this dimension/sample."
4. FINAL LINE exactly:
`FINDINGS_JSON: {"iteration":2,"dimension":"correctness","p0":<n>,"p1":<n>,"p2":<n>,"verdict":"PASS|CONDITIONAL|FAIL","summary":"<<=160 chars"}`
