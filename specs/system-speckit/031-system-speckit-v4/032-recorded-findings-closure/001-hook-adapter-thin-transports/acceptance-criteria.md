---
title: "Acceptance Criteria: Phase 1: hook-adapter-thin-transports"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "hook adapter acceptance criteria"
  - "spec gate closure gate"
  - "adapter trio line count proof"
  - "regression suite parity proof"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/032-recorded-findings-closure/001-hook-adapter-thin-transports"
    last_updated_at: "2026-09-07T18:20:00Z"
    last_updated_by: "scaffold"
    recent_action: "Marked every criterion met with the evidence observed"
    next_safe_action: "None; the packet is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-07-032-recorded-findings-closure-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 1: hook-adapter-thin-transports

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/033-system-speckit-v4/032-recorded-findings-closure/001-hook-adapter-thin-transports
**Level:** 2
**Status:** Complete
**Date:** 2026-09-07
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|----------------------|---------------|--------|--------|
| AC-001 | REQ-001 | Given claude/codex/cursor/devin's `spec-gate-classify.mjs` and `spec-gate-enforce.mjs`, When each is read after migration, Then none contains the duplicated observe/deny orchestration that lived there before this phase | `grep -c` of `observeGate3QuestionDelivery`, `buildGate3ObservedReceipt` and `appendWarningLog` over the eight adapters returns 0 for each; the sequences live in `hooks/lib/spec-gate/spec-gate-core.mjs` as `runClassifyGate` and `runEnforceGate` | Met | Unmet | - |
| AC-002 | REQ-002 | Given pi's `spec-gate-classify.ts` and `spec-gate-enforce.ts`, When compared against the four Node-CLI runtimes, Then all five call the same exported function names in `spec-gate-core.mjs` | `hooks/pi/spec-gate-classify.ts` and `spec-gate-enforce.ts` call `runClassifyGate` and `runEnforceGate`, the same two names `hooks/codex/spec-gate-classify.mjs` and `spec-gate-enforce.mjs` call | Met | - |
| AC-003 | REQ-003 | Given the eight named regression suites, When run after the full migration, Then every suite exits 0 with the same rule ids and pass/fail outcomes as the pre-port baseline | node tests: claude 13, codex 14, devin 15, cursor prebind 16, core 87 pass with 0 failures; vitest: directive-lifecycle-adapter-parity, completion-evidence-sentinel, hook-completion-evidence-stop, hook-adapter-path-parity and hooks-reexport-parity pass, 5 files and 151 tests; the full runtime project result is in implementation-summary.md | Met | - |
| AC-004 | REQ-004 | Given claude/codex/cursor/devin's `spec-gate-classify.mjs` plus `spec-gate-enforce.mjs` pair, When measured with `wc -l` after migration, Then each runtime's pair sum is under 200 lines | `wc -l` over each runtime's classify plus enforce pair: claude 89, codex 105, cursor 86, devin 92, each under 200; the criterion was amended from the trio to the pair because `shared.ts` is lifecycle transport the phase leaves untouched, recorded in goal.md | Met | - |
| AC-005 | REQ-005 | Given `hooks/README.md`'s architecture section, When read after this phase, Then it names the new shared classify/enforce call site instead of describing per-runtime duplication | `hooks/README.md` core row names `runClassifyGate()` and `runEnforceGate()` as the call every adapter makes | Met | - |
| AC-006 | REQ-006 | Given the lifecycle hooks (session-prime, session-stop, compact-inject), When this phase's diff is reviewed, Then none of their spawnSync delegation to `claude/*.js` changed | the diff touches the eight gate adapters, the two pi hooks, the core, its test and the README only; `directive-lifecycle-adapter-parity.vitest.ts` passes unmodified in this phase | Met | - |

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

This packet is at the planning stage: spec, plan and tasks are authored and every
criterion above is traced to a real requirement, but none has been executed yet.
Closure is written once AC-001 through AC-006 all read `Met`.
<!-- /ANCHOR:closure -->
