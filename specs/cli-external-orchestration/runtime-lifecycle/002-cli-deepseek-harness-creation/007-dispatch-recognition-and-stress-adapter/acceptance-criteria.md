---
title: "Acceptance Criteria: Phase 7: dispatch-recognition-and-stress-adapter"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "dispatch recognition and stress adapter acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/007-dispatch-recognition-and-stress-adapter"
    last_updated_at: "2026-11-06T08:02:05Z"
    last_updated_by: "codex"
    recent_action: "Verified all acceptance criteria"
    next_safe_action: "Resolve the remaining task-checklist gaps"
    blockers: []
    key_files: ["evidence/dispatch-audit-after.txt", "evidence/rule-checks-after.txt", "evidence/stress-dsh-pi-hermes-verbose.txt", "evidence/sibling-diff.txt"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-085-007-dispatch-recognition-and-stress-adapter"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 7: dispatch-recognition-and-stress-adapter

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/007-dispatch-recognition-and-stress-adapter
**Level:** 2
**Status:** In Progress
**Date:** 2026-11-06
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given positive cases `dsh headless -`, `dsh --profile headless --json -`, env-wrapped calls and shell-wrapped calls plus negative cases `dsh plugin`, `--help`, `-h`, `-V`, `--version`, `--dump-config`, `--dump-default-config` and `--dump-config-schema`, When `.skilled/node_modules/.bin/vitest run .skilled/hooks/dispatch/lib/dispatch-audit.test.mjs` runs, Then it passes | The Vitest run reports 23 files, 2854 tests passed and exit 0 (`evidence/dispatch-audit-after.txt:8`, `evidence/dispatch-audit-after.txt:9`, `evidence/dispatch-audit-after.txt:17`) | Met | - |
| AC-002 | REQ-002 | Given dsh dispatches missing `-`, missing `--approval-policy never`, missing a route patch and with a repo-root cwd, When `node --test .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` runs, Then each is flagged and all twelve declared rule checks pass | The current run reports 50 tests passed and exit 0 (`evidence/rule-checks-after.txt:62`). The recorded rule-ID mapping and required violations are listed in `evidence/task-verify-outputs.txt:20` and `evidence/task-verify-outputs.txt:31` | Met | - |
| AC-003 | REQ-003 | Given the dsh shim and subject, When the runtime's Vitest runs `tests/stress/cli-adapter/cli-deepseek-harness.vitest.ts`, Then it passes | The dsh stress cases pass and its live probe is skipped by the hermetic fixture configuration (`evidence/stress-dsh-pi-hermes-verbose.txt:7`, `evidence/stress-dsh-pi-hermes-verbose.txt:25`, `evidence/stress-dsh-pi-hermes-verbose.txt:65`, `evidence/stress-dsh-pi-hermes-verbose.txt:70`) | Met | - |
| AC-004 | REQ-004 | Given the edited stress tests, When Vitest runs `cli-pi.vitest.ts` and `cli-hermes.vitest.ts` and `git diff --exit-code` runs on both files, Then both pass and the diff exits 0 | The combined adapter run passes 54 tests with 3 live probes skipped (`evidence/stress-dsh-pi-hermes-verbose.txt:65`, `evidence/stress-dsh-pi-hermes-verbose.txt:66`). The sibling and shared-shim diffs exit 0 (`evidence/sibling-diff.txt:3`, `evidence/sibling-diff.txt:7`) | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names observed evidence. |
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
<!-- FILL: Write Yes or No and one sentence. Name a criterion by its id only when it blocks closure. Never write a count of criteria or an id range, because every added row makes it wrong. GOOD: No. AC-002 is unmet. WEAK: All eight criteria AC-001 to AC-008 are met. -->

**Closeable:** Yes

All acceptance criteria are met. The phase remains In Progress because `tasks.md` still has the baseline task and test-order evidence open.
<!-- /ANCHOR:closure -->
