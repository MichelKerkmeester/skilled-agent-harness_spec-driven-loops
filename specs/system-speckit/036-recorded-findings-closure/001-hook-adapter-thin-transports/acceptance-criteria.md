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
    packet_pointer: "system-speckit/036-recorded-findings-closure/001-hook-adapter-thin-transports"
    last_updated_at: "2026-09-07T15:05:41Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-07-036-recorded-findings-closure-001"
      parent_session_id: null
    completion_pct: 0
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

**Packet:** system-speckit/036-recorded-findings-closure/001-hook-adapter-thin-transports
**Level:** 2
**Status:** Draft
**Date:** 2026-09-07
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|----------------------|---------------|--------|--------|
| AC-001 | REQ-001 | Given claude/codex/cursor/devin's `spec-gate-classify.mjs` and `spec-gate-enforce.mjs`, When each is read after migration, Then none contains the duplicated observe/deny orchestration that lived there before this phase | `rg -n "observeGate3QuestionDelivery\|buildGate3ObservedReceipt" hooks/{claude,codex,cursor,devin}/spec-gate-{classify,enforce}.mjs` shows only the shared-function call, not an inline re-implementation | Unmet | - |
| AC-002 | REQ-002 | Given pi's `spec-gate-classify.ts` and `spec-gate-enforce.ts`, When compared against the four Node-CLI runtimes, Then all five call the same exported function names in `spec-gate-core.mjs` | `rg -n "spec-gate-core.mjs" hooks/pi/spec-gate-{classify,enforce}.ts` and a diff of the imported symbol names against `hooks/codex/spec-gate-classify.mjs` | Unmet | - |
| AC-003 | REQ-003 | Given the eight named regression suites, When run after the full migration, Then every suite exits 0 with the same rule ids and pass/fail outcomes as the pre-port baseline | `npx vitest run spec-gate-claude spec-gate-codex spec-gate-devin spec-gate-prebind spec-gate-core directive-lifecycle-adapter-parity completion-evidence-sentinel hook-completion-evidence-stop` from `runtime/` | Unmet | - |
| AC-004 | REQ-004 | Given claude/codex/cursor/devin's classify+enforce+shared.ts trio, When measured with `wc -l` after migration, Then each runtime's sum is under 200 lines | `wc -l hooks/<runtime>/spec-gate-classify.mjs hooks/<runtime>/spec-gate-enforce.mjs hooks/<runtime>/shared.ts` run once per runtime | Unmet | - |
| AC-005 | REQ-005 | Given `hooks/README.md`'s architecture section, When read after this phase, Then it names the new shared classify/enforce call site instead of describing per-runtime duplication | Manual read of `hooks/README.md`'s architecture section against the post-port file layout | Unmet | - |
| AC-006 | REQ-006 | Given the lifecycle hooks (session-prime, session-stop, compact-inject), When this phase's diff is reviewed, Then none of their spawnSync delegation to `claude/*.js` changed | `git diff` for this phase touches no file under the lifecycle-hook set, and `directive-lifecycle-adapter-parity.vitest.ts` still passes unmodified | Unmet | - |

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

This packet is at the planning stage: spec, plan and tasks are authored and every
criterion above is traced to a real requirement, but none has been executed yet.
Closure is written once AC-001 through AC-006 all read `Met`.
<!-- /ANCHOR:closure -->
