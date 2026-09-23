---
title: "Acceptance Criteria: GPT-6 Luna and Sol cutover with LLM Gateway Luna routes and Opus 5.5 in cli-claude-code"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "gpt-6 cutover acceptance"
  - "luna sol closure gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/077-gpt-6-luna-sol-cutover"
    last_updated_at: "2026-09-23T06:20:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Recorded verification evidence against each criterion"
    next_safe_action: "Operator: remaining smokes, then commit"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "077-gpt-6-luna-sol-cutover"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: GPT-6 Luna and Sol cutover with LLM Gateway Luna routes and Opus 5.5 in cli-claude-code

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 077-gpt-6-luna-sol-cutover
**Level:** 2
**Status:** Complete
**Date:** 2026-09-23
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the in-scope skills, runtime, config and mirrors, When the residue scan runs, Then no `gpt-5.6-luna` or `gpt-5.6-sol` hit remains outside the recorded history, and the Luna Max persona counts are unchanged | `tasks.md` T012: one residue hit, the PI-017 captured-output cell; persona counts 26 files and 88 occurrences before and after | Met | - |
| AC-002 | REQ-002 | Given the deep-loop allowlists and their CJS mirrors, When the six runtime suites and typecheck run, Then they pass at or above the 391-passed baseline and typecheck exits 0 | `tasks.md` T013: 391 passed, 1 skipped, exit 0, equal to baseline; typecheck exit 0 | Met | - |
| AC-003 | REQ-003 | Given the Pi config, When `pi --list-models gpt-6` runs, Then `llmgateway/gpt-6-luna`, `openai-codex/gpt-6-luna` and `openai-codex/gpt-6-sol` are listed | `tasks.md` T014, rerun after the catalog refresh: all three listed, built-in `openai-codex` models intact | Met | - |
| AC-004 | REQ-004 | Given the Hermes roster, When its declaration and fan-out mirror are read, Then both name `gpt-6-luna` and `gpt-6-sol` and hold seven ids | `executor-config.ts` `HERMES_SUPPORTED_MODELS` and `fanout-run.cjs` `HERMES_ALLOWED_MODELS`, seven ids each; the Hermes pairing test passes in T013 | Met | - |
| AC-005 | REQ-005 | Given cli-claude-code's living docs and mirror, When searched for Opus 4.x, Then nothing matches and each roster carries one `claude-opus-5-5` row | `tasks.md` T008 and T012: zero `claude-opus-4` or `Opus 4.x` hits; one Opus row in each roster | Met | - |
| AC-006 | REQ-006 | Given the five affected skills, When their `SKILL.md` and changelogs are read, Then each carries a patch bump and one new changelog with `version` frontmatter, and the frontmatter gate passes | `tasks.md` T010 and T015: 1.9.1.0, 1.4.9.0, 1.5.7.0, 1.0.2.0, 1.5.1.0; gate exit 0 | Met | - |
| AC-007 | REQ-007 | Given the Hermes mirrors, When `sync-skills-hermes.cjs --check` runs, Then none of the five touched skills drifts | `tasks.md` T011 and T015: drift fell from 6 to 3, and the 3 left are untouched skills | Met | - |
| AC-008 | REQ-008 | Given the pi fast-mode extension, When its suite runs, Then it passes 77/77 with the GPT-6 ids in its priority list | `tasks.md` T013: 77/77 | Met | - |

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

All eight criteria are met: the residue scan, the unchanged suite counts and the Pi model listing carried the packet. Left out on purpose: a live billed round-trip through the new routes, which is the operator's check, and the adjacent defects listed in `implementation-summary.md`.
<!-- /ANCHOR:closure -->
