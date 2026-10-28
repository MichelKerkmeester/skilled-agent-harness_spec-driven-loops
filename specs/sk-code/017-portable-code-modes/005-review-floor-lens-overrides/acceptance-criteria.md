---
title: "Acceptance Criteria: Review floor, default lens and rule overrides"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "review floor lens overrides acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/017-portable-code-modes/005-review-floor-lens-overrides"
    last_updated_at: "2026-10-28T01:00:00Z"
    last_updated_by: "implementer"
    recent_action: "Met every criterion with observed runs against the HEAD tree and the changed tree"
    next_safe_action: "Conductor wires the child into the parent phase table and commits"
    blockers: []
    key_files:
      - ".skilled/skills/sk-code/sk-code-review/references/review-core.md"
      - ".skilled/skills/sk-code/sk-code-review/SKILL.md"
      - ".skilled/skills/sk-code/shared/scripts/tests/review-lens-overrides.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "review-floor-lens-implementer"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Review floor, default lens and rule overrides

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `005-review-floor-lens-overrides`
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
| AC-001 | REQ-001 | Given the four rule checklists and `review-core.md`, When the new suite reads every `Rule:` line and the section 8 tables, Then each floor id is fixed by the contract, each lens id is listed and unfixed, and a `replace:` row on `review.function-length` lints clean | `review-lens-overrides.test.cjs` cases one and three pass; on the `HEAD` tree they fail. Text: `.skilled/skills/sk-code/sk-code-review/references/review-core.md:142` | Met | - |
| AC-002 | REQ-001 | Given a row naming any of the four review floor ids, When `lintOverrides` reads it, Then it returns no row and a hard-floor error | Case two passes; fails on `HEAD`. The floor attempt fixture lists its checklist under `Refused`. Test: `.skilled/skills/sk-code/shared/scripts/tests/review-lens-overrides.test.cjs:108` | Met | - |
| AC-003 | REQ-002 | Given the review checklists, When they are searched for a P0 hint, Then none remains and each of the three hints names its reach | `grep -n "^- P0" .skilled/skills/sk-code/sk-code-review/assets/*.md` prints nothing, exit 1. Text: `.skilled/skills/sk-code/sk-code-review/assets/code-quality-checklist.md:114`, `.skilled/skills/sk-code/sk-code-review/assets/test-quality-checklist.md:60` | Met | - |
| AC-004 | REQ-003 | Given a repository whose quality config disables `issue`, When `--explain` runs and the review TODO rule is read, Then `config.hygiene.disabled` holds `hygiene.issue` and the TODO rule names it among the six tracker ids it defers to | Cases four and five pass; both fail on `HEAD`. Text: `.skilled/skills/sk-code/sk-code-review/assets/code-quality-checklist.md:134` | Met | - |
| AC-005 | REQ-004 | Given the review mode, When its SKILL.md is read and the tree is searched, Then it resolves rules with `quality-gate.cjs --explain <file> [<file>...]` and `detect_surface_evidence` survives only in a historical changelog | The canary pins the resolver string; `rg -n detect_surface_evidence .skilled` prints only `.skilled/skills/sk-code/sk-code-review/changelog/v1.7.0.0.md:20`. Text: `.skilled/skills/sk-code/sk-code-review/SKILL.md:426` | Met | - |
| AC-006 | REQ-005 | Given a report that carries a `Rule sources:` line, When both report checkers read it, Then both pass, and the canary fails when the line format or a floor id is changed | `C` cases `shape_final_line_rule_sources`, `shape_findings_rule_sources`, `rule_sources_format_reworded` and `review_floor_id_dropped` pass; the last two fail on the `HEAD` canary. Cases: `.skilled/skills/sk-code/sk-code-review/scripts/tests/check-rule-copies.test.sh:311` | Met | - |
| AC-007 | REQ-006 | Given the canary and its suite, When both run from the final state, Then the canary prints `OK` and the suite passes every case | Canary exit 0 with `8 exact-string file(s)`; suite 89 `PASS`, 0 `FAIL`, up from 80. Pins: `.skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js:55` | Met | - |
| AC-008 | REQ-007 | Given a router-bundled surface and a fileless review, When the SKILL.md steps are read, Then the surface applies only to files the resolver places in it, and `sk-code-skilled` stays only when the working directory shares the hub's git common dir | Text: `.skilled/skills/sk-code/sk-code-review/SKILL.md:431` and `inside_hub_checkout` in its pseudocode | Met | - |
| AC-009 | REQ-008 | Given the universal checklists, When they are searched for Skilled-only names, Then none appear, the code examples are labelled, and the XSS, SSRF, header, CORS, cookie and rate-limit items are marked web-only | `rg -n -i "skilled\|opencode\|specs/\|packet" .skilled/skills/sk-code/sk-code-review/assets` prints nothing. Text: `.skilled/skills/sk-code/sk-code-review/assets/security-checklist.md:51` | Met | - |
| AC-010 | REQ-009 | Given the SKILLED checklists, When the linter reads `universal-checklist.md`, Then it accepts one `review.todo-tracking` row that the review lens table lists and that asks for an owner and no ticket id, and both review handoffs point at it | `check-rule-overrides.cjs` prints `1 rule override(s)`, exit 0; case six passes and fails on `HEAD`. Row: `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/universal-checklist.md:358` | Met | - |
| AC-011 | REQ-010 | Given a no-comments, an opposite-rule and a floor-attempt repository, When `scratch/show-explain.cjs` runs, Then each `--explain` exits 2 and prints the `Rule sources:` line review would write | Output saved to `scratch/explain-no-comments.json`, `scratch/explain-opposite-rule.json` and `scratch/explain-floor-attempt.json`. Runner: `specs/sk-code/017-portable-code-modes/005-review-floor-lens-overrides/scratch/show-explain.cjs:22` | Met | - |
| AC-012 | REQ-011 | Given the three changelog entries, When they are validated and the Hermes copies checked, Then each has 0 issues and the copies are in sync | `validate_document.py --json` `"total_issues": 0` for all three; `parent-skill-check.cjs` `OK`; `sync-skills-hermes.cjs --check` `PASS: 67 Hermes skill copies in sync`. Entry: `.skilled/skills/sk-code/sk-code-review/changelog/v1.9.5.0.md:11` | Met | - |
| AC-013 | REQ-012 | Given a review range that deletes a file, When the resolver step builds its file list, Then only existing regular files reach `--explain`, deleted paths go on the `Not checked:` line where they matter, and the canary fails when the filter is dropped | `--explain README.md no-such-deleted.ts` exits 3 with `FILE_NOT_FOUND`, the failure the filter prevents. Canary case `resolver_deleted_path_filter_dropped` fails on the canary without the pin (87 `PASS`, 2 `FAIL`) and passes after. Text: `.skilled/skills/sk-code/sk-code-review/SKILL.md:429`, `resolvable_files` at `.skilled/skills/sk-code/sk-code-review/SKILL.md:238`. Case: `.skilled/skills/sk-code/sk-code-review/scripts/tests/check-rule-copies.test.sh:331` | Met | - |
| AC-014 | REQ-002 | Given a test whose mocks replace the system under test, When the test quality checklist and the lens table are read, Then the item is floor under `review.correctness-minimums` with reach-based severity, and `review.test-smells` carries no over-mocking clause | Lens suite case three passes with the extended exception line. Text: `.skilled/skills/sk-code/sk-code-review/assets/test-quality-checklist.md:116`, `.skilled/skills/sk-code/sk-code-review/references/review-core.md:183` | Met | - |
| AC-015 | REQ-011 | Given the sk-code-review changelog, When its Upgrade section is read, Then it names the default changes every repository gets and says an override row only changes a lens rule further | Text: `.skilled/skills/sk-code/sk-code-review/changelog/v1.9.5.0.md:36`; `validate_document.py --json` `"total_issues": 0` | Met | - |

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
