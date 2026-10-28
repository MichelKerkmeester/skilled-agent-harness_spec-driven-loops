---
title: "Prose sweep record: Phase 10"
description: "Measured readings for the SKILL.md, command and agent prose sweep: line counts before and after, the checks each file passed, and the two review rounds."
trigger_phrases:
  - "prose sweep record"
importance_tier: "normal"
contextType: "implementation"
---
# Prose sweep record: Phase 10

The sweep ran in worktree `264-prose-clarity-sweep`, branched from `301247accf`, after phases 008 and 009 landed.

## 1. Line-length scan

The scanner skips frontmatter, fenced blocks, table rows and pinned lines. A pinned line is one a parser or a byte-for-byte check reads: an HTML comment such as `<!-- Keywords: ... -->`, a `Keyword triggers:` line, and the compiled-routing blockquote that starts `> Follow the returned decision`.

| Surface | Before | After |
|---------|--------|-------|
| Tracked `SKILL.md` files, 54 | 335 prose lines over 400 characters | 0 |
| `.skilled/commands/**/*.md` | 51 | 0 |
| `.skilled/agents/*.md` | 55 | 0 |

The 335 excludes 12 pinned lines. Counted the way `spec.md` measured it, with those lines included, the figure is 347 on this tree. The spec's 368 across 59 files was taken before `sk-vision` and `mcp-magicpath` were removed from main.

The pinned lines that stay over 400 characters are eight keyword comments, the compiled-routing blockquote in four hubs, and the same blockquote in `parent-skill-hub-template.md` and `scaffold/hub-skill-scaffold.md`, which a test holds identical.

## 2. Per-file checks

Every changed `SKILL.md`, command and agent doc passed three comparisons against `HEAD`:

- No inline code span, link target or number lost. The one exception is `system-deep-loop/SKILL.md`, which dropped the project history "formerly the separate `deep-loop-runtime` skill, merged into this hub 2026-07-08".
- No pinned or fenced line changed. The exceptions are the two hub templates, whose payload fence holds the prose a new hub starts from. That prose is the hard-blocker fix in section 4.
- No new paragraph rendering inside a list item, and no sentence left starting lowercase.

`package_skill.py --check --strict` passed on every skill folder. `validate_document.py` reported 0 issues on every new changelog entry.

## 3. Versions and changelogs

Each changed `SKILL.md` stepped its third version segment and gained exactly one changelog entry in its own `changelog/` folder, 50 in all. Each hub root carries the same version in `description.json`, `mode-registry.json` and `hub-router.json`. `sk-design` gained its entry for the glossary alone.

## 4. Glossaries and templates

All seven parent hubs now open HOW IT WORKS with `### Terms`, six to twelve routing terms each, taken from the hub's own text and registry.

| Template | Hard blockers before | After |
|----------|----------------------|-------|
| `assets/parent-skill/parent-skill-hub-template.md` | 5 | 0 |
| `assets/skill/skill-md-template.md` | 6 | 0 |
| `assets/skill/skill-scaffold-template.md` | 3 | 0 |
| `assets/parent-skill/scaffold/hub-skill-scaffold.md` | 13 | 0 |
| `assets/parent-skill/scaffold/packet-skill-scaffold.md` | 5 | 0 |

## 5. Review rounds

Each round was a read-only reviewer comparing the diff line by line for changed meaning, which the mechanical checks cannot see.

| Round | Files | Findings | Outcome |
|-------|-------|----------|---------|
| 1, `SKILL.md` sweep | 49 | 17: P0 5, P1 6, P2 6 | 15 fixed by a fix worker after confirming each, 2 already fixed by the list-spacing pass |
| 1, list-spacing scan | 49 | 14 paragraphs rendering inside a list item | all 14 fixed with a blank line |
| 2, commands, agents and templates | 44 | 18: P0 2, P1 5, P2 11 | 13 fixed by a fix worker, 4 lowercase sentence starts fixed directly, 1 kept: the directive line in the hub template is pinned |

## 6. Gate run on the final tree

The full gate set ran once on the finished sweep, `scratch/gates.sh`, 38 gates. 35 exited 0 on the first run. The other three were read again:

| Gate | First run | Rerun |
|------|-----------|-------|
| `pkg-system-spec-kit` | `SKILL.md exceeds word limit (5002 words, max: 5000)` | `Result: PASS` at 4,999 words, after three filler words were cut |
| `router-reach` | every probe `probe-error`: the advisor answered degraded while it reindexed the edited `SKILL.md` files | `RESULT: PASSED` once `advisor_status` read `freshness: live` |
| `validate` | this folder's generated metadata was stale after the doc edits | `RESULT: PASSED` after `repair-derived.cjs --apply` |

| Check | Result |
|-------|--------|
| `rule-copies` (`check-rule-copies.js`) | exit 0 |
| `package_skill.py --check --strict`, every skill folder | `Result: PASS` |
| `verify-doc-claims.cjs` | `doc-claims: 4/4 checks passed` |
| `test_create_skill_contract.py` | 29 passed |
| `check-contract-drift.cjs` | `OK commands=3` |
| `sync-skills-hermes.cjs --check` | `PASS: 65 Hermes skill copies in sync` |
| `sync-runtime-mirrors.cjs --check` | `PASS: 193 mirrors across 8 trees are in sync` |
| Routing accuracy | 155/195, 49/66, 19/24, identical to the baseline |
