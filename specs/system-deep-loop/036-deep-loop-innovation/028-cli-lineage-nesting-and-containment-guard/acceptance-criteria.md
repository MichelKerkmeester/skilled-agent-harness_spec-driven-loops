---
title: "Acceptance Criteria: Prevent a cli-codex fan-out lineage from nesting codex exec per iteration, and make write containment preserve concurrent operator edits instead of erasing them"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/028-cli-lineage-nesting-and-containment-guard"
    last_updated_at: "2026-09-02T17:17:51Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Prevent a cli-codex fan-out lineage from nesting codex exec per iteration, and make write containment preserve concurrent operator edits instead of erasing them

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-deep-loop/036-deep-loop-innovation/028-cli-lineage-nesting-and-containment-guard
**Level:** 2
**Status:** Complete
**Date:** 2026-09-02
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a fan-out lineage of any supported CLI kind, When `buildLoopPrompt` composes its prompt, Then the prompt states that iterations run in the current process and that the lineage must not spawn a nested CLI executor | `npx vitest run tests/fanout-loop-prompt-in-process.test.ts` 4 passed on branch 017, exit 0 | Met | - |
| AC-002 | REQ-002 | Given a cli-codex lineage that reaches the codex executor step, When the step evaluates whether to dispatch, Then the pre-dispatch rule resolves to in-process execution and the embedded node script never calls `codex exec` | Both auto YAML codex steps carry the PRE-DISPATCH RULE and the pre-spawn `validateExecutorDispatchAllowed` refusal; `check-contract-drift` and `render-command-contract` pass after recompile | Met | - |
| AC-003 | REQ-003 | Given a process whose `SPECKIT_CLI_DISPATCH_STACK` already names cli-codex, When `executor-audit.ts` is asked to dispatch cli-codex, Then it refuses before any process is created and records the refusal | `tests/unit/executor-audit.vitest.ts` refusal rows, 43 passed, exit 0 | Met | - |
| AC-004 | REQ-003 | Given a top-level invocation with an empty dispatch stack, no fan-out lineage marker and no `CODEX_SESSION_ID`, When `executor-audit.ts` is asked to dispatch cli-codex, Then it allows the dispatch, and a set `CODEX_SESSION_ID` is treated as nesting and refused | `tests/unit/executor-audit.vitest.ts` allow row and the CODEX_SESSION_ID detection row at line 417, exit 0 | Met | - |
| AC-005 | REQ-004 | Given an iteration that modified a tracked out-of-scope file, When `enforceWriteContainment` runs, Then a patch exists at `<artifactDir>/containment-reverted/<iteration>-<timestamp>.patch` before the revert touches the file | `tests/unit/write-containment.vitest.ts` patch-exists row, 34 passed, exit 0 | Met | - |
| AC-006 | REQ-005 | Given that containment reverted at least one path, When the violation event and the returned result are read, Then the event carries `revertedPatchPath` and the result carries a `recoveryHint` naming that patch | `tests/unit/write-containment.vitest.ts` event and result rows, exit 0 | Met | - |
| AC-007 | REQ-006 | Given the emitted patch and a checkout sitting at the reverted state, When `git apply` replays that patch, Then the operator content is restored byte for byte | `git apply` round trip in `tests/unit/write-containment.vitest.ts`, exit 0 | Met | - |
| AC-008 | REQ-007 | Given a lineage author reading the executor documentation, When they open the cli-codex `SKILL.md`, the deep-research `loop-protocol.md` and the `system-deep-loop` hub `SKILL.md`, Then each one states the in-process rule and the recovery-patch rule | Read on disk: cli-codex SKILL.md Rule 18, loop-protocol.md Executor Resolution bullets, system-deep-loop SKILL.md NEVER line | Met | - |
| AC-009 | REQ-008 | Given an out-of-scope path that is untracked, When containment runs, Then the path is preserved as an advisory and the lineage still fails closed | `tests/unit/write-containment.vitest.ts` untracked-path row, exit 0 | Met | - |
| AC-010 | REQ-009 | Given a second run holding a live loop lock in a sibling phase folder of the same packet, When this lineage's containment check runs, Then that run's new files are advisories and this lineage reports zero violations, and the same files with no live lock, or with a stale lock, remain a fatal violation | `tests/unit/write-containment.vitest.ts`, the concurrent-run describe block with seven cases, 157 passed across the three targeted files, exit 0 | Met | - |

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

Every criterion is `Met` with observed evidence. Two rows decided this packet: AC-003, because the prompt and the YAML rule are advice and only the pre-spawn refusal enforces them, and AC-007, because a patch that `git apply` cannot replay leaves the operator edit as lost as it was before. The other eight rows guard against the fix breaking the behavior it sits next to, and AC-010 closes the concurrent-run false positive that the original run surfaced.
<!-- /ANCHOR:closure -->
