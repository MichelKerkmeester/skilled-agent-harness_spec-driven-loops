# Deep Review Strategy: 117 Skill Anchor + TOC Removal

## Review Charter

**Target:** git commit `1e58d845af` — "docs(117): remove TOC blocks + HTML anchor comments from skill docs"
**Question:** Did the cleanup break anything by accident?
**Scope:** 897 files (857 skill `*.md` under `.opencode/skills/`; 20 non-md: sk-doc `template_rules.json`, `test_validator.py`, 6 `/create` command YAMLs + README.txt, and the 117 spec packet docs/metadata).
**Diff stat:** +3,184 / −12,998 (deletion-dominated, as expected for removal).
**Executor:** cli-codex `gpt-5.5`, reasoning=medium, service-tier=fast, sandbox=read-only.
**Max iterations:** 10 | **Convergence threshold:** 0.10

## What the change was supposed to do (intended transform)

1. Remove every `## TABLE OF CONTENTS` block (heading + its `[text](#anchor)` link list + a wrapping `<!-- ANCHOR:table-of-contents -->`).
2. Remove every standalone `<!-- ANCHOR:name -->` / `<!-- /ANCHOR:name -->` HTML comment line.
3. Collapse the redundant `---` rule and blank lines those removals left behind.
4. Flip sk-doc standards/config so TOCs are not required or regenerated (`tocRequired:false` ×3; core_standards TOC policy → Never; templates + creation refs + `/create` YAMLs no longer mandate/emit a TOC).
It must NOT have altered prose, section headings (other than the TOC heading), tables, code blocks, non-TOC lists, frontmatter, or any non-markdown logic.

## Carve-outs — do NOT flag these as bugs/regressions

- `.opencode/skills/system-spec-kit/templates/**` retain `<!-- ANCHOR -->` markers (consumed by spec/memory generation + indexing). Intentional.
- `.opencode/skills/sk-doc/scripts/tests/**` fixtures retain TOCs (validator test data). Intentional; `test_validator.py` updated to match the new policy.
- `system-spec-kit` SKILL.md ToC allowance for `research/research.md` (spec-artifact domain). Intentional.
- Webflow "Table of Contents" web-component references in `sk-code` (a website UI feature, unrelated to doc TOCs). Intentional.
- Inline anchor *mentions* in prose/commands that document the live spec-kit anchor system (they reference, not declare, anchors).

## Dimension queue (risk-ordered, mapped to 10 passes)

| Pass | Dimension | Focus |
|------|-----------|-------|
| 1 | correctness | Inventory + TOC-removal content safety on high-risk files (READMEs, playbooks, feature catalogs): any prose/heading/table/code lost? |
| 2 | correctness | Anchor-comment removal: orphaned/garbled sections, dangling closers, broken section boundaries |
| 3 | correctness | Markdown structure: stray/double `---`, empty sections, broken in-doc links, frontmatter integrity |
| 4 | correctness | Standards/config consistency: `template_rules.json` tocRequired flags, core_standards policy, validator behavior |
| 5 | correctness | `/create` command YAMLs: still YAML-valid, no TOC regeneration, menu/option consistency (B/C relabel) |
| 6 | traceability | Carve-out integrity: spec-kit templates anchors intact, test fixtures intact, live anchor-system docs intact |
| 7 | traceability | 117 spec packet accuracy: do spec/plan/tasks/impl-summary/checklist match what was actually done |
| 8 | security | No secrets/paths leaked, no injection introduced in edited YAML/JSON, no permission changes |
| 9 | maintainability | "No TOC" standard is consistent across docs; no surviving contradictions/half-edits |
| 10 | correctness | Final regression sweep across the whole change set; confirm nothing else mutated |

## Stop policy

Stop early if 2 consecutive passes yield zero new P0/P1 findings (convergence), any P0 blocks STOP until resolved/triaged, else run to 10.

## Known Context

No prior review memory for this target (fresh). The cleanup's own deterministic verification already showed: 0 TOC headings + 0 standalone anchors in scope, carve-outs intact, validator suite 11/11, full-diff per-file classification with 0 non-TOC/anchor/whitespace removals from the bulk pass. This review independently re-checks those claims.
