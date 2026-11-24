---
title: "Acceptance Criteria: Fix every finding of the twelve-pass deep review of the system-skill-advisor logic"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "advisor logic review fixes acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/029-advisor-logic-review-fixes"
    last_updated_at: "2026-11-24T06:07:08Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-029-advisor-logic-review-fixes"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Fix every finding of the twelve-pass deep review of the system-skill-advisor logic

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 029-advisor-logic-review-fixes
**Level:** 3
**Status:** Complete
**Date:** 2026-11-24
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a copy of the live graph database, When `indexSkillMetadata` runs with the root `.skilled/skills/sk-code`, Then the copy still holds 15 nodes and 59 edges and the CLI text output prints `deletedNodes` | the database-copy probe from `spec.md` and the narrow-scan cases in `tests/skill-graph-db.vitest.ts` | Met | probe: 15 nodes, 59 edges, deletedNodes 0; skill-graph suites pass |
| AC-002 | REQ-002 | Given a socket folder owned by another user, group writable, or a socket path that is not a socket, When the CLI, the launcher bridge or the session-proxy reattach connects, Then each refuses and falls back | `tests/skill-advisor-cli-socket-ownership.vitest.ts` and the spec-kit launcher ownership cases | Met | socket-ownership and launcher suites pass outside the sandbox (57 and 55 tests) |
| AC-003 | REQ-003 | Given a planted symlink at a store's file name or a foreign-owned store folder, When the metrics, shadow or calibration store writes, Then the symlink target's content and mode are unchanged and the write is skipped | the symlink and foreign-owner cases in the three store tests | Met | store tests pass with symlink and foreign-owner cases (31, 30 and 34 tests) |
| AC-004 | REQ-004 | Given the five comments behind the `spec_code` partial and the trust-default doc echoes, When they are read beside their code, Then each states what the code does | the path-scoped residue grep printing hits before and zero after | Met | residue grep hit every target file before, zero target lines after |
| AC-005 | REQ-005 | Given the four dead lifecycle functions, When the deletion lands, Then `rg` for each symbol outside `specs/` and changelogs finds nothing and the live stress cases sa-014 and sa-016 still pass | `rg` output and the stress gate | Met | symbol rg exit 1; stress 62 passed with sa-014 and sa-016 kept |
| AC-006 | REQ-006 | Given the shared predicate fixture, When vitest and the Python runner read it, Then both languages agree on every case, and 'auto review this PR' still routes to sk-code | `scorer-predicate-cases.vitest.ts`, `test_scorer_predicate_parity` and `tests/scorer/sk-git-worktree-sweep-vocabulary.vitest.ts` | Met | predicate fixture passes in vitest and Python (cases=24); sweep vocabulary test unchanged and green |
| AC-007 | REQ-007 | Given the prompt cap and the confidence floors, When either language's copy is changed alone, Then the constant parity test fails | `python-ts-constant-parity.vitest.ts` with a mutation proof | Met | python-ts-constant-parity passes |
| AC-008 | REQ-008 | Given `scoreAdvisorPrompt`, When a stage is moved, Then the stage-order test fails | `score-stage-order.vitest.ts` mutation proofs | Met | score-stage-order passes and each of 4 mutation proofs fails it |
| AC-009 | REQ-009 | Given the Pi and Claude hook budgets, When one differs, Then the budget test fails | `tests/hooks/prompt-advisor.vitest.ts` | Met | prompt-advisor budget test passes |
| AC-010 | REQ-010 | Given a Gate-3 question list that fails to load, When `policy-plan.ts` reads it, Then a diagnostic is recorded | `policy-plan-gate-owner-load.vitest.ts` | Met | policy-plan-gate-owner-load passes |
| AC-011 | REQ-011 | Given an empty lock file another process is still writing, When the reclaim runs, Then the lock is not deleted | the new case in `daemon-freshness-foundation.vitest.ts` | Met | daemon-freshness-foundation passes with the new case |
| AC-012 | REQ-012 | Given the CLI catalog entry and the degraded-daemon playbook scenario, When their cited paths are checked, Then each path exists | `ls` of each cited path | Met | catalog and playbook validators 0 violations; link check exit 0 |
| AC-013 | REQ-013 | Given the final tree, When `run-gates-532.sh after` runs, Then every gate exits 0 against the baseline | `../review/iterations/iteration-011.md`, which reran `npm test` and the ratchets at HEAD | Met | run-gates-532.sh after: every gate exit 0 after the two count fixes |
| AC-014 | REQ-014 | Given the fixed tree, When two more review passes run on cli-pi DeepSeek Flash max (the operator replaced the native pass), Then `review-verdict.cjs` prints no `FAIL` | the verdict line | Met | review pass 11: `review-verdict.cjs` printed CONDITIONAL, P0 0, P1 0, P2 0, no failed gate |

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

Every criterion is Met with its evidence.
<!-- /ANCHOR:closure -->
