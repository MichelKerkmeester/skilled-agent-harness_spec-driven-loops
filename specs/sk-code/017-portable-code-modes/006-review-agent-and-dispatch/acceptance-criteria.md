---
title: "Acceptance Criteria: Review agent and dispatch"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "review agent and dispatch acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/017-portable-code-modes/006-review-agent-and-dispatch"
    last_updated_at: "2026-10-28T02:00:00Z"
    last_updated_by: "implementer"
    recent_action: "Met every criterion with observed runs against the HEAD tree and the changed tree"
    next_safe_action: "Conductor wires the child into the parent phase table and commits"
    blockers: []
    key_files:
      - ".skilled/agents/review.md"
      - ".skilled/skills/sk-code/sk-code-review/scripts/check-review-final-line.js"
      - ".skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js"
      - ".opencode/plugins/tests/speckit-review-dispatch-contract.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "review-agent-dispatch-implementer"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Review agent and dispatch

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `006-review-agent-and-dispatch`
**Level:** 2
**Status:** Complete
**Date:** 2026-10-28
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the review agent, When it is searched for its old checklist, house rules and score cutoff, Then none remain and its verdict table fails a gate only on a P0 or an open P1 | `grep -n "threshold: 70\|< 10 cyclomatic\|No merge commits\|<500 lines\|Quality Gate Protocol\|APPROVE/REQUEST CHANGES/BLOCK" .skilled/agents/review.md` prints nothing; dispatch contract case five passes and fails on `HEAD`. Text: `.skilled/agents/review.md:128` | Met | - |
| AC-002 | REQ-001 | Given every agent report format, When the formats are read, Then each states its verdict in `APPROVED`, `REQUESTED_CHANGES` or `COMMENTED` and the score only as advisory | Text: `.skilled/agents/review.md:232`; fixture `pr-shape-valid.md` passes both checkers | Met | - |
| AC-003 | REQ-002 | Given `@orchestrate` and the two speckit review entries, When a code review is dispatched, Then `@orchestrate` adds the exact `CODE-REVIEW` line and one blank line and never adds it to a deep-loop dispatch, and both entries state the same marker for a step that dispatches `@review` while saying they dispatch nothing | Dispatch contract cases one and three pass, both fail on `HEAD`. Text: `.skilled/commands/speckit/assets/speckit-implement.yaml:353`, `.skilled/commands/speckit/assets/speckit-complete.yaml:454`, `.skilled/agents/orchestrate.md:239` | Met | - |
| AC-004 | REQ-002 | Given the review mode, When its floor and integration text are read, Then the floor says a dispatcher adds the marker, the guards keep the exact text and the create workflows are no longer said to dispatch review | Canary `OK` with the reworded pin; deep-loop marker-scan suites pass. Text: `.skilled/skills/sk-code/sk-code-review/SKILL.md:588`, `.skilled/skills/sk-code/sk-code-review/SKILL.md:628` | Met | - |
| AC-005 | REQ-003 | Given a report whose `Recommendation:` contradicts its status line or its findings, When both checkers read it, Then the matching checker exits 1 and names the contradiction | `C` cases for `recommendation-contradicts-status.md`, `recommendation-contradicts-findings.md`, the `BLOCK` token and a P2-only report fail on the `HEAD` checkers and pass after. Code: `.skilled/skills/sk-code/sk-code-review/scripts/check-review-findings.js:87`, `.skilled/skills/sk-code/sk-code-review/scripts/check-review-final-line.js:62` | Met | - |
| AC-006 | REQ-003 | Given a report with a `Rule sources:` line, When the final-line checker reads it, Then a malformed entry, an upper-case rule id, a missing group and a second line fail while `Rule sources: none` and the 005 fixture pass, and the id grammar comes from the shared linter | `C` 125 `PASS`; the four new failure cases fail on `HEAD`. Export: `.skilled/skills/sk-code/shared/scripts/check-rule-overrides.cjs:286`. Code: `.skilled/skills/sk-code/sk-code-review/scripts/check-review-final-line.js:98` | Met | - |
| AC-007 | REQ-004 | Given a scratch repository outside this checkout with the skill installed under another folder, When `check-rule-copies.js --mode-only` runs there, Then it exits 0 with a `SKIPPED:` line, exits 1 once a floor is reworded, and the full mode still exits 1 for the missing `AGENTS.md` | `C` foreign-repository cases pass, and on the `HEAD` canary fail with `unknown option: --mode-only`, exit 2. CI step unchanged: `.github/workflows/rule-canary-sync.yml:44`. Code: `.skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js:221` | Met | - |
| AC-008 | REQ-005 | Given the regenerated mirrors and the suites that read the touched files, When the gates run from the final state, Then all pass with their baseline counts | `check-agent-mirror-sync.cjs --all` exit 0; generators `--check` `PASS`; speckit suites `pass 5`, `passed=148`, `pass 17`, 7, 4; `check-contract-drift.cjs` `OK commands=3`. Cases: `.skilled/skills/sk-code/sk-code-review/scripts/tests/check-rule-copies.test.sh:326` | Met | - |
| AC-009 | REQ-006 | Given `@review` and `@deep-review`, When they are searched for `.skilled/skills/` paths, Then each sits inside an "in this repository:" example of the loaded-skill pattern | The search in T011 prints nothing. Text: `.skilled/agents/review.md:48`, `.skilled/agents/deep-review.md:189` | Met | - |
| AC-010 | REQ-007 | Given `@code`'s RETURN contract, When `@orchestrate` evaluates its output, Then it names the `Quality Gate` field exactly as `code.md` writes it and gives an action for each of the five runner verdicts | Dispatch contract case four passes and fails on `HEAD`. Text: `.skilled/agents/orchestrate.md:532` | Met | - |
| AC-011 | REQ-008 | Given the review agent, When its PR rules, P0 hint and gate name are read, Then PR rules come from the repository's declared conventions, a security finding is P0 only with a named reach and the gate is the Review Gate Protocol | Text: `.skilled/agents/review.md:184`, `.skilled/agents/review.md:394`, `.skilled/agents/review.md:199` | Met | - |
| AC-012 | REQ-009 | Given the four changelog entries, When they are validated and the Hermes copies checked, Then each has 0 issues and the copies are in sync | `validate_document.py --json` `"total_issues": 0` for all four; `sync-skills-hermes.cjs --check` `PASS: 67 Hermes skill copies in sync`; `parent-skill-check.cjs` on the hub `OK`. Entry: `.skilled/skills/sk-code/sk-code-review/changelog/v1.9.6.0.md:14` | Met | - |
| AC-013 | REQ-003 | Given a prose Recommendation sub-line, the Focused File Review shape, a `COMMENTED` report with an open P1 and a `REQUESTED_CHANGES` report with P2 findings alone, When both checkers read them, Then the prose report passes both, the Focused File Review shape fails both, and the two status cases fail the findings checker | `C` cases `shape_*_recommendation_prose` pass; `shape_*_focused_file_recommendation`, `shape_findings_status_commented_open_p1` and `shape_findings_status_requested_changes_p2_only` fail on `HEAD` and pass after. The first review round's regex read the prose line as `approve`. Code: `.skilled/skills/sk-code/sk-code-review/scripts/check-review-final-line.js:90` | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

Every criterion is met with observed runs against the `HEAD` tree and the changed one.
<!-- /ANCHOR:closure -->
