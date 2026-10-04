---
title: "Acceptance Criteria: Give CLI deep-loop lineages the findings output contract and gate it per iteration"
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
    packet_pointer: "system-deep-loop/042-cli-lineage-findings-contract"
    last_updated_at: "2026-10-04T13:23:40Z"
    last_updated_by: "claude-opus"
    recent_action: "Recorded evidence for every criterion"
    next_safe_action: "Prove SC-002 with the DeepSeek-only rerun in the AI Systems research packet"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Give CLI deep-loop lineages the findings output contract and gate it per iteration

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-deep-loop/042-cli-lineage-findings-contract
**Level:** 2
**Status:** In Progress
**Date:** 2026-10-04
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a CLI lineage for research or review, When `buildLoopPrompt` renders its prompt, Then the prompt carries that mode's CLI OUTPUT CONTRACT, and a native lineage prompt carries none | `.skilled/skills/system-deep-loop/runtime/tests/fanout-loop-prompt-in-process.test.ts:90`, contract block at `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1483` | Met | - |
| AC-002 | REQ-002 | Given a research iteration that claims findings, When none of its structured list, `## Findings` lines, graph events or delta rows filed under it match the count, Then `verify-iteration.cjs` returns `findings_not_enumerated` | `.skilled/skills/system-deep-loop/runtime/tests/unit/verify-iteration.vitest.ts:464`, `.skilled/skills/system-deep-loop/runtime/tests/unit/verify-iteration.vitest.ts:511` | Met | - |
| AC-003 | REQ-002 | Given a review iteration whose `findingsNew` claims new findings, When neither `findingDetails`, a ranked delta finding row filed under it, nor the reducer-parsed Markdown lists one, Then the gate returns `findings_not_enumerated`, and a carried running total with no new findings passes | Eight review cases from `.skilled/skills/system-deep-loop/runtime/tests/unit/verify-iteration.vitest.ts:534` to `.skilled/skills/system-deep-loop/runtime/tests/unit/verify-iteration.vitest.ts:682` | Met | - |
| AC-004 | REQ-003 | Given an iteration recorded twice, When the closeout or the merge counts it, Then only its latest record counts | `.skilled/skills/system-deep-loop/runtime/tests/unit/synthesis-closeout-latest-record.vitest.ts:73`, `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-merge-latest-record.vitest.ts:13` | Met | - |
| AC-005 | REQ-004 | Given each new test, When it runs against the unpatched code, Then it fails | Unpatched run: 9 failed. Each review gate rule disabled in turn failed its own test, `.skilled/skills/system-deep-loop/runtime/tests/unit/verify-iteration.vitest.ts:655` among them, then passed on restore | Met | - |
| AC-006 | REQ-005 | Given a lineage registry with `openQuestions` stored as a number, When the merge runs, Then it exits 0 and keeps every lineage | `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-merge-question-shape.vitest.ts:14` | Met | - |
| AC-007 | REQ-006 | Given `deep-ai-council` and `deep-improvement`, When checked for the defect class, Then each is shown absent with file:line evidence | `.skilled/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs:145`, `.skilled/skills/system-deep-loop/deep-improvement/scripts/shared/loop-host.cjs:134` | Met | - |
| AC-008 | REQ-007 | Given the full runtime suite, When run after the change, Then no test fails that passed at the baseline of 164 files and 2,799 passed | PASS: 167 files, 2,816 passed, 8 skipped, exit 0. Baseline 164 files, 2,799 passed, 8 skipped, so 3 new files and 17 new tests with no failure | Met | - |
| AC-009 | SC-001 | Given the ten kept iterations of the AI Systems research run, When the gate runs on each, Then the five DeepSeek iterations fail with `findings_not_enumerated` and the five Luna iterations pass | Replayed 2026-10-04: DeepSeek 1-5 fail, Luna 1-5 pass | Met | - |
| AC-010 | SC-002 | Given this change in place, When the DeepSeek lineage of that research reruns, Then the closeout reports `synthesis_complete` | Runs in the AI Systems repository after this commit | Unmet | - |

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

**Closeable:** No

AC-001 to AC-009 are met by tests, negative controls and a replay of the failing run. AC-010 stays open until the DeepSeek-only rerun in the AI Systems research packet closes with `synthesis_complete`.
<!-- /ANCHOR:closure -->
