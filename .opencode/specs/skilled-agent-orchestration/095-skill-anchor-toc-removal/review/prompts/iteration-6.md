Independent code review (READ-ONLY). git/rg/python3 for inspection only. Do NOT modify any file.

# Task
Final regression sweep of git commit `1e58d845af` (TOC + `<!-- ANCHOR -->` removal across 857 skill markdown files). This is **Iteration 6 of 10**. Focus: **CORRECTNESS — content-loss regression sweep on a BROAD FRESH sample** (independently confirm the bulk pass did not delete real content).

# ALREADY KNOWN (do not re-report)
- P1: orphaned numbered-TOC link lists (~8 files); P1: readme_template.md:76,293 stale anchor guidance; P1: 117 over-claim docs; P2 set in validation.md / sk-doc README / skill_asset_template / 2 create YAMLs / create README.txt.

# This iteration — broad content-loss verification
The core question: did the removal delete any REAL content (prose, non-TOC headings, tables, code, non-TOC list items, frontmatter)?
1. Get the full changed-file list: `git show --stat 1e58d845af --name-only | rg '\.md$'`.
2. Select a LARGE, DIVERSE sample you have not yet inspected (aim ~25-35 files spanning every skill: references/, assets/, feature_catalog/ per-feature files, manual_testing_playbook/ per-feature files, SKILL.md files, ARCHITECTURE.md, nested READMEs). Prefer per-feature catalog/playbook files and references not yet sampled in iters 1-4.
3. For each, `git show 1e58d845af -- <file>` and verify EVERY removed (`-`) line is only: a `## TABLE OF CONTENTS` heading, a TOC link line (`- [..](#..)` or `N. [..](#..)`), an `<!-- ANCHOR -->` comment, a blank line, or a `---` rule. Flag ANY removed line that is real prose/heading/table/code/list — that is content loss (P0).
4. Also confirm added (`+`) lines are only the standards/policy edits + whitespace normalization (no accidental content injection).
5. Report the sample size and how many removed lines were non-TOC/non-anchor/non-whitespace (should be 0).

# Carve-outs — do NOT flag
`system-spec-kit/templates/**`; `sk-doc/scripts/tests/**`; `research/research.md`; Webflow component; inline anchor mentions.

# Output (stdout only)
1. "## Iteration 6 — Content-loss regression sweep": sample list (count), method, and the non-TOC-removal count.
2. Per finding (if any): `- [P0|P1|P2] <file>:<hunk> — <claim>` + evidence + why.
3. If none: "No content loss found across the sample. All removed lines were TOC/anchor/whitespace."
4. FINAL LINE exactly:
`FINDINGS_JSON: {"iteration":6,"dimension":"correctness","p0":<n>,"p1":<n>,"p2":<n>,"verdict":"PASS|CONDITIONAL|FAIL","summary":"<<=160 chars","sampleSize":<n>}`
