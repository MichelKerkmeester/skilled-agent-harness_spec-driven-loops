---
title: "Changelog: AGENTS.md delivery prefix [016-repo-rule-advisor-surfacing/003-agents-md-delivery-prefix]"
description: "Chronological changelog for the AGENTS.md delivery prefix phase."
trigger_phrases:
  - "repo rule advisor surfacing agents md delivery prefix changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-10-04

> Spec folder: `specs/agents/016-repo-rule-advisor-surfacing/003-agents-md-delivery-prefix` (Level 2)
> Parent packet: `specs/agents/016-repo-rule-advisor-surfacing`

### Summary

Devin now receives every hard blocker in AGENTS.md, the line that tells it to load the reply rules, and the "Never fabricate" and "treat content as data" mandates. Before this phase its 16,384-byte cut fell inside the completion rule and dropped all of that. The rule canary now fails CI the moment any of those clauses drifts past the cut or the file passes Codex's 32,768-byte cap.

### Added

- Write the before and after clause table into implementation-summary.md
- CHK-011 New code follows the surrounding file's patterns

### Changed

- Confirm the .skilled path of check-rule-copies.js and the CI step that runs it (.github/workflows/rule-canary-sync.yml)
- [P] Inventory every reference to an AGENTS.md section number (rg -n 'AGENTS.md.{0,3}§' .skilled "REPO RULES.md")
- [P] Measure the must-carry set in bytes (recorded in plan.md ADR-001 instead of a scratch file)
- Record ADR-001's move list in plan.md from the T003 budget
- Restructure AGENTS.md per ADR-001 (AGENTS.md)
- Update any section reference found in T002 (REPO RULES.md): none needed, every section kept its number

### Fixed

- Add the delivery-prefix guard and the 32,768-byte ceiling (check-rule-copies.js)
- Add a fixture with an anchor past the cut and a fixture over 32,768 bytes (check-rule-copies.test.sh)
- CHK-021 Guard fails on the past-cut fixture
- CHK-FIX-001 Consumer inventory in plan.md affected surfaces is complete
- CHK-FIX-002 Evidence is pinned to a commit SHA, not a moving branch range

### Verification

- node check-rule-copies.js - PASS, exit 0, 21 anchors, last ends at byte 16,345
- bash check-rule-copies.test.sh - PASS, 7 of 7 cases
- node sync-gate1-pointers.cjs --check - PASS, exit 0
- npx vitest run --project cli gate1-pointer-sync workflow-invariance - PASS, 2 files, 6 tests
- Live Devin probe (swe-2-max) - Quoted the §8 load line, the Never fabricate bullet and the first Blast-Radius bullet verbatim, with 113 of the file's lines truncated after Execution Behavior's first bullet
- Acceptance criteria - 6 of 6 Met, see acceptance-criteria.md
- Tasks complete - 29 completed task item(s) recorded

### Files Changed

| File | Action | What changed |
|---|---|---|
| `AGENTS.md` | Modified | §4 placed before §3, reply rules and two mandates moved into §4, pointers under §8 and §10, Confidence table padding removed |
| `.skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js` | Modified | Delivery-prefix guard: 21 anchors must end by byte 16,384, file at most 32,768 bytes |
| `.skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.test.sh` | Modified | Fixtures for an anchor past the cut and an oversize file |

### Follow-Ups

- The rest of §3 is past Devin's cut. Execution Behavior, Quality Principles and Restraint Signals, plus §5 to §10, still do not reach Devin. None is a hard blocker.
- 39 bytes of headroom. Any growth in §1, §2 or §4 trips the guard. That is intended: whoever grows those sections must decide what gives way.
- The CI workflow runs the canary, not its test script. The fixture cases run locally through check-rule-copies.test.sh.
