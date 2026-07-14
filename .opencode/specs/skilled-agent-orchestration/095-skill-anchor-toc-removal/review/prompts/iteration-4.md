Independent code review (READ-ONLY). You may run git/rg/python3/node for inspection only. Do NOT modify any file.

# Task
Audit git commit `1e58d845af` (TOC + `<!-- ANCHOR -->` removal). Find anything broken **by accident**.

This is **Iteration 4 of 10**. Focus: **carve-out integrity + traceability + security**.

# ALREADY KNOWN (do not re-report)
- P1: orphaned numbered-TOC link lists (~8 files).
- P1: readme_template.md:76,293 stale "optional anchors" guidance.
- P2: stale TOC/anchor guidance in validation.md, sk-doc/README.md, skill_asset_template.md, create_folder_readme_{auto,confirm}.yaml, create/README.txt.
Find OTHER issues.

# This iteration — inspect
1. **Carve-out integrity (over-removal check):** the cleanup was supposed to PRESERVE anchors in `.opencode/skills/system-spec-kit/templates/**` and TOCs in `.opencode/skills/sk-doc/scripts/tests/**`. Confirm the commit did NOT touch/strip those:
   - `git show --stat 1e58d845af -- .opencode/skills/system-spec-kit/templates | head` — expect NO template files in the diff.
   - `rg -l '<!-- ANCHOR' .opencode/skills/system-spec-kit/templates --glob '*.md' | wc -l` — expect > 0 (anchors preserved).
   - `rg -l -i 'table of contents' .opencode/skills/sk-doc/scripts/tests` — expect the fixtures still have TOCs.
   Flag if a carve-out was wrongly stripped (that would be a real regression).
2. **Under-removal in scope:** any non-carve-out skill `*.md` that STILL has a `## TABLE OF CONTENTS` heading or a standalone `<!-- ANCHOR:... -->` / `<!-- /ANCHOR:... -->` comment line that should have been removed. (`rg -n '^#{1,6}\s+.*TABLE OF CONTENTS' .opencode/skills --glob '*.md'` minus carve-outs; `rg -n '^\s*<!--\s*/?ANCHOR:[^>]*-->\s*$' .opencode/skills --glob '*.md'` minus carve-outs.)
3. **Traceability — 117 spec packet accuracy:** read `specs/skilled-agent-orchestration/z_archive/095-skill-anchor-toc-removal/` spec.md + the 4 children's spec/plan/tasks/implementation-summary. Do the documented claims match the actual change set? Specifically flag any claim that is now FALSE given the orphaned-TOC defect (e.g., "zero TOC headings/anchors in scope" or "no content lost" claims that the orphaned numbered-TOC finding contradicts). Note: the spec packet itself is part of the commit.
4. **Security:** scan the 20 non-md changed files (template_rules.json, test_validator.py, 6 create YAMLs, README.txt, 117 packet json/md) for any accidentally introduced secret, absolute private path leak, injection vector, or permission/allowlist change. Low expectation, but verify.

# Carve-outs — do NOT flag as defects
`system-spec-kit/templates/**` anchors (MUST remain); `sk-doc/scripts/tests/**` TOC fixtures (MUST remain); `research/research.md` ToC; Webflow "Table of Contents" in `sk-code`; inline anchor mentions documenting the live spec-kit anchor system.

# Output (stdout only)
1. "## Iteration 4 — Carve-outs + traceability + security": what was inspected/run + results (state the carve-out counts and under-removal counts explicitly).
2. Per finding: `- [P0|P1|P2] <file>:<line> — <claim>` + evidence + why.
3. If none: "No NEW defects found in this dimension/sample."
4. FINAL LINE exactly:
`FINDINGS_JSON: {"iteration":4,"dimension":"traceability","p0":<n>,"p1":<n>,"p2":<n>,"verdict":"PASS|CONDITIONAL|FAIL","summary":"<<=160 chars"}`
