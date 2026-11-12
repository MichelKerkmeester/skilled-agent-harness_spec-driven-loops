---
title: "Acceptance Criteria: Phase 7: fix-deep-review-p2-findings-for-plan-check-builds"
description: "Closure criteria for the scoped deep-review remediation plan; each row requires evidence from its named edit, command or generated artifact."
trigger_phrases:
  - "fix deep review p2 findings acceptance criteria"
  - "deep review p2 closure gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/007-fix-deep-review-p2-findings-for-plan-check-builds"
    last_updated_at: "2026-11-12T02:13:37Z"
    last_updated_by: "codex"
    recent_action: "Closed the synthesis follow-up: config-dir home path, runner-only flag rows, WRITE intent"
    next_safe_action: "Use the parent packet for follow-up work outside this completed phase."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "01a1cd68-75ce-7230-a887-9e7035954011"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Acceptance Criteria: Phase 7: fix-deep-review-p2-findings-for-plan-check-builds

<!-- SPECKIT_LEVEL: 2 -->

<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 007-fix-deep-review-p2-findings-for-plan-check-builds
**Level:** 2
**Status:** Complete
**Date:** 2026-11-12
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a one-lineage research or review runner invocation, When the allowlist guard evaluates the parsed opt-in, Then only bare Boolean `true`, string `true`, or string `1` proceeds and all other values refuse before side effects. | T002/T005; `fanout-run.cjs:3408-3412`; `../scratch/build-evidence.md:154` records exit=0 and 179 tests passed. | Met | - |
| AC-002 | REQ-002 | Given a direct deep-review `:auto` configDir input, When the runner prepares `CLAUDE_CONFIG_DIR`, Then the existing validator accepts only home or repo-local `.claude*` roots, in the `~/` form and in the absolute home form the workflow renders. | T003–T005, T037; `fanout-run.cjs:686-695` skips the repository-only namespace rule for an absolute path and the root check still applies; the unit case asserts the absolute home form passes and `~/.ssh` in absolute form is refused; `deep-review-auto.yaml:1263-1264,1293-1294`; unit case at `fanout-run.vitest.ts:2657`; `../scratch/build-evidence.md:154` records exit=0 and 179 tests passed. | Met | - |
| AC-003 | REQ-003 | Given the maintained research and review policy carriers, When contracts are compiled, Then each carrier names `config.maxIterations`, the `--executors` routing, and direct runner refusal/opt-in, and both compiled contracts regenerate from those sources. | T006–T012, T029–T030; four maintained carrier searches passed; prior `--write` runs exit 0 at `../scratch/build-evidence.md:50`; closeout stdout parity checks returned `RESEARCH CONTRACT MATCH` and `REVIEW CONTRACT MATCH` (exit 0). | Met | - |
| AC-004 | REQ-004 | Given the reviewed packet status and shell carriers, When the scoped edit packets apply, Then child and parent status records agree with verified evidence and both scaffold branches print the one shared sentence unchanged. | T013–T028; shell syntax and two-site shared-value checks pass. Settled by the orchestrating session under goal D1: `../scratch/remediation-evidence.md` records each of edit-T014, T015, T019, T024 and T028 as applied with exact match True at apply time, meaning the target equalled `before.replace(OLD, NEW)` byte for byte. The later closeout pass on child 006 then rewrote those same status lines to the final closed state, so a replay now finds neither OLD nor NEW. The edits were applied as specified and were superseded by newer, verified text. | Met | - |
| AC-005 | REQ-005 | Given all edits and contract refreshes, When the required suites and final validator run, Then each required command succeeds and strict validation prints `RESULT: PASSED`. | T029–T036 in `tasks.md`; generator exit-0 evidence at `../scratch/build-evidence.md:50`, suite evidence at lines 119 and 152–156, card sync exit 0, and closeout strict validation printed `RESULT: PASSED` with exit 0. | Met | - |
| AC-006 | REQ-005 | Given the closing synthesis found three more defects, When T038 and T039 apply, Then the `/deep:*` flag tables list no runner-only flag and a plain write request loads the card without displacing a stronger intent. | T038–T041; `rg -c allow-single-lineage` on both command docs finds 0 lines; `ROUTER.md` WRITE intent at weight 1 scores "write a plan and update the spec" PLAN 3, WRITE 2, so PLAN stays first. | Met | - |

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

AC-001 through AC-006 are Met, and every task and verification checklist row is checked. Strict packet validation prints `RESULT: PASSED`.
<!-- /ANCHOR:closure -->
