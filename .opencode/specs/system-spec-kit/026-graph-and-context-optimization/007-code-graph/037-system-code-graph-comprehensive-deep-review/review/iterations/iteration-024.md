# Iteration 024 — P1-A Docs and P1-H2 Config Verification

## Summary

P1-A1, P1-A2, P1-A3, and P1-H2 are **VERIFIED**. P1-A4 and P1-A5 are **PARTIAL** because each contains true drift plus overclaimed template/file-name details.

## Files Reviewed

- `.opencode/skills/system-code-graph/SKILL.md`
- `.opencode/skills/sk-doc/assets/skill/skill_md_template.md`
- `.opencode/skills/system-code-graph/feature_catalog/feature_catalog.md`
- `.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md`
- `.opencode/skills/system-code-graph/manual_testing_playbook/manual_testing_playbook.md`
- `.opencode/skills/sk-doc/assets/testing_playbook/manual_testing_playbook_snippet_template.md`
- `.opencode/skills/system-code-graph/manual_testing_playbook/10--devin-hooks/025-devin-session-start.md`
- `.claude/mcp.json`
- `.gemini/settings.json`
- `.codex/config.toml`, `.devin/config.json`, `.vscode/mcp.json`, `opencode.json` as comparators

## Findings

### P0 (release-blocking)

| ID | Verdict | File:line | Finding | Remediation |
|----|---------|-----------|---------|-------------|
| — | — | — | None | — |

### P1 (high priority)

| ID | Verdict | File:line | Finding | Remediation |
|----|---------|-----------|---------|-------------|
| P1-A1 | VERIFIED | `SKILL.md:44-62`; `skill_md_template.md:659-685` | `SKILL.md` uses a static routing table, while the template requires detection context, resource domains/loading levels, and a smart-router pseudocode block. | Bring §2 into template shape or document an accepted deviation. |
| P1-A2 | VERIFIED | `SKILL.md:76-83`; `skill_md_template.md:878-922` | `SKILL.md` uses unstructured RULES bullets, while the template requires ALWAYS, NEVER, and ESCALATE IF subsections. | Restructure §4. |
| P1-A3 | VERIFIED | `SKILL.md:20`, `SKILL.md:26-40`; `skill_md_template.md:628-647` | Keywords live in an HTML comment and §1 lacks explicit Activation Triggers / Keyword Triggers subsections. | Promote triggers into §1. |
| P1-A4 | PARTIAL | `feature_catalog/feature_catalog.md:53-122`; `feature_catalog_template.md:83-163` | The root catalog uses simple feature tables instead of per-feature `###`, Description, Current Reality, Source Files sections. The filename critique is wrong: the sk-doc template's canonical layout uses lowercase `feature_catalog.md` at `feature_catalog_template.md:29-36` and `:83-86`. | Keep the structural catalog remediation; drop the filename-rename claim. |
| P1-A5 | PARTIAL | `manual_testing_playbook.md:141-148`, `manual_testing_playbook.md:161-165`; `manual_testing_playbook/10--devin-hooks/025-devin-session-start.md:1-164`; `manual_testing_playbook_snippet_template.md:1-140` | Scenario 024 is listed under CCC while linking to `03--detect-changes`; scenario 016 is listed under post-rename while linking to `06--mcp-tool-surface`. The Devin scenario is 164 lines and more custom than the snippet template, but the template itself is 140 lines, so the "~65-line template" severity claim is not supported. | Fix the two category rows. Treat the Devin scenario as a style review, not a hard length violation. |
| P1-H2 | VERIFIED | `.claude/mcp.json:40-47`; `.gemini/settings.json:60-69`; `.codex/config.toml:48-49`; `.devin/config.json:47-48`; `.vscode/mcp.json:47-48`; `opencode.json:59-60` | `.claude/mcp.json` and `.gemini/settings.json` still use `_NOTE_1_TOOLS` in the `mk_code_index` env block, while the other four configs use `_NOTE_1_DB` / `_NOTE_2_TOOLS`. | Align the two remaining configs. |

### P2 (nice-to-have)

| ID | Verdict | File:line | Finding | Remediation |
|----|---------|-----------|---------|-------------|
| — | — | — | None | — |

## Convergence Signal

newInfoRatio 0.40: the doc/config cluster is mostly real, but packet 038 should avoid carrying the feature-catalog filename and Devin-template line-count overclaims.
