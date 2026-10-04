---
title: "Changelog: Trigger coverage check [016-repo-rule-advisor-surfacing/005-trigger-coverage-check]"
description: "Chronological changelog for the Trigger coverage check phase."
trigger_phrases:
  - "repo rule advisor surfacing trigger coverage check changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-10-04

> Spec folder: `specs/agents/016-repo-rule-advisor-surfacing/005-trigger-coverage-check` (Level 1)
> Parent packet: `specs/agents/016-repo-rule-advisor-surfacing`

### Summary

The router and the rules now have to agree on when a rule fires. Gate 5 loads rules by their REPO RULES.md row, so a condition named only inside a rule was one no session was ever sent to that rule for. Seven such conditions existed, and check 10 found all of them.

### Added

- Add check 10 and --root (check-repo-rules.cjs)
- List every router edit in implementation-summary.md

### Changed

- Read check-repo-rules.cjs CHECKS, splitRouterSections and check 9
- Measure token overlap between every Fires-when bullet and its router row, and set the threshold
- Update the check lists (SKILL.md, rule-anatomy.md)
- Run the checker on the corpus and the pytest suite
- All tasks marked [x]
- No [B] blocked tasks remaining

### Fixed

- Write covered and uncovered fixtures (test_check_repo_rules.py)
- Fix the router rows for each real gap (REPO RULES.md)

### Verification

- Corpus - node check-repo-rules.cjs prints RESULT: PASSED (10/10 checks), exit 0. Before the router edits it printed 9/10 with all seven gaps
- pytest - test_check_repo_rules.py 3 of 3 pass, including the removed-item failure naming rule, bullet and line 7
- Docs - validate_document.py VALID on SKILL.md and rule-anatomy.md. The anatomy file's one numbering warning predates this phase
- Comment hygiene - exit 0 on the checker and the test
- Strict validation - See the parent's recursive validate.sh --strict run
- Tasks complete - 11 completed task item(s) recorded

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs` | Modified | Check 10 and --root |
| `.skilled/skills/sk-doc/scripts/tests/test_check_repo_rules.py` | Created | Covered, uncovered and missing-root fixtures |
| `REPO RULES.md` | Modified | The seven router items above |
| `.skilled/skills/sk-doc/sk-create-repo-rule/SKILL.md` | Modified | Lists the tenth check |
| `.skilled/skills/sk-doc/sk-create-repo-rule/references/rule-anatomy.md` | Modified | Lists all ten checks |

### Follow-Ups

- Lexical, not semantic. A bullet reworded with fresh synonyms can fail although covered, and a row sharing words by chance can pass.
- Barter's copy of the checker was left untouched, so it still runs nine checks.
