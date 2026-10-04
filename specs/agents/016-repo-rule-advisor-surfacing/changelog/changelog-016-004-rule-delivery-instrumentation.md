---
title: "Changelog: Rule delivery instrumentation [016-repo-rule-advisor-surfacing/004-rule-delivery-instrumentation]"
description: "Chronological changelog for the Rule delivery instrumentation phase."
trigger_phrases:
  - "repo rule advisor surfacing rule delivery instrumentation changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-10-04

> Spec folder: `specs/agents/016-repo-rule-advisor-surfacing/004-rule-delivery-instrumentation` (Level 2)
> Parent packet: `specs/agents/016-repo-rule-advisor-surfacing`

### Summary

One command now tells you, for Claude Code and Codex, how often a session needed a repo rule and did not have it. Before this, the only numbers came from an untested script that counted Read calls in Claude Code alone.

### Added

- Add the rule-version split from git log
- Add the requested-table split and Wilson intervals
- List the script in sk-create-repo-rule/SKILL.md
- CHK-011 New code follows the surrounding file's patterns

### Changed

- Read the Codex session JSONL format and the Claude Code compaction record shape from local samples
- [P] Probe whether Devin, Cursor, OpenCode and Pi keep a readable session transcript, and record the result in plan.md
- Normalize events through a Claude Code adapter and a Codex adapter
- Count delivery receipts by channel and compaction window
- Compute Gate 5 and §8 eligibility and misses
- Run pytest and the output-privacy test

### Fixed

- Copy the script to sk-create-repo-rule/scripts/ and write synthetic fixtures (test_measure_rule_compliance.py)
- CHK-020 Privacy test passes: no fixture text in output
- CHK-023 Codex adapter covered by a fixture
- CHK-FIX-001 Consumer inventory in plan.md affected surfaces is complete
- CHK-FIX-002 Evidence is pinned to a commit SHA, not a moving branch range

### Verification

- pytest - 9 of 9 pass, directly and through run-script-tests.sh
- Full sk-doc suite - run-script-tests.sh printed "all sk-doc script tests passed", exit 0
- Evidence pack rerun - Exact match on every before, after and never count in §3
- Comment hygiene - check-comment-hygiene.sh exit 0 on both new files
- SKILL.md - validate_document.py VALID, 0 issues, and check-repo-rules.cjs 9 of 9 PASSED
- Privacy - No marker, user path, jsonl name or session id in either baseline file
- Speed - 244 sessions in 45 seconds wall time
- Strict validation - See the parent's recursive validate.sh --strict run

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.skilled/skills/sk-doc/sk-create-repo-rule/scripts/measure-rule-compliance.py` | Created | The analyzer, promoted from the 002 prep copy |
| `.skilled/skills/sk-doc/scripts/tests/test_measure_rule_compliance.py` | Created | Nine pytest cases over synthetic transcripts |
| `.skilled/skills/sk-doc/sk-create-repo-rule/SKILL.md` | Modified | Points the Revise path at the analyzer |
| `baselines/` | Created | Aggregates-only baseline, text and JSON |

### Follow-Ups

- Replies cluster by session. The intervals treat replies as independent, so they understate between-session uncertainty.
- Shell writes are invisible. A Codex write through sed -i or a redirect is not counted, only apply_patch.
- Pattern detection. Requested tables are a keyword heuristic, and the document bucket rarely fires.
- Two runtimes. Devin, Cursor, Pi and OpenCode have no adapter yet.
