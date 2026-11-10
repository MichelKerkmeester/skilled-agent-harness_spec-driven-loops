---
title: "Acceptance Criteria: Enforce asking operator decisions through each runtime's native ask-question tool instead of prose option menus"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "ask surface enforcement acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/003-ask-surface-enforcement"
    last_updated_at: "2026-11-08T10:05:12Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "37344d65-539c-401d-8341-c9b769fd34a7"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Enforce asking operator decisions through each runtime's native ask-question tool instead of prose option menus

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `027-ask-surface-enforcement`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-08
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the ten fixtures, When the detector runs, Then the three menus fire and the seven others pass | `node --test` over the core, advisory, Claude, DSH and OpenCode tests: 37 pass, 0 fail, exit 0; all ten fixtures hold their verdict. Cited: `.skilled/hooks/ask-surface-guard/lib/ask-surface-core.test.mjs:19` | Met | - |
| AC-002 | REQ-002 | Given a Stop payload ending in the original prose menu, When the Claude guard runs, Then it prints one block envelope, and it prints nothing when `stop_hook_active` is true | `claude/ask-surface-stop.test.mjs`: blocks once with the `AskUserQuestion` instruction, and a re-entrant stop ends the turn. Cited: `.skilled/hooks/ask-surface-guard/claude/ask-surface-stop.test.mjs:38 and :48` | Met | - |
| AC-003 | REQ-003 | Given the amended rule text, When the tool names are searched, Then only `communication-handoff.md` §5 names one and Gate 3 points at §5 | `rg -n "AskUserQuestion\|request_user_input\|ask_user_question" AGENTS.md .skilled/repo-rules` hits only `communication-handoff.md` lines 157-162; Gate 3 reads "asked via the `communication-handoff.md` §5 tool". Cited: `AGENTS.md:78, .skilled/repo-rules/communication-handoff.md:157` | Met | - |
| AC-004 | REQ-004 | Given a firing turn on DSH, OpenCode and Pi, When each guard runs twice in that turn, Then each re-prompts once | DSH, OpenCode and Pi tests each fire the stop event twice on one turn and assert one re-prompt; Pi vitest 4 pass, exit 0. Cited: `.skilled/hooks/ask-surface-guard/tests/dsh-ask-surface-guard.test.mjs:36, .opencode/plugins/tests/ask-surface-guard.test.cjs:49, .skilled/hooks/ask-surface-guard/pi/ask-surface-guard.test.ts:45` | Met | - |
| AC-005 | REQ-005 | Given a firing turn on Codex and Devin, When the adapter runs, Then it logs an advisory and returns no block | `lib/advisory-stop.test.mjs`: Codex and Devin exit 0 with empty stdout, the tool named on stderr and one `advise` line in `fires.jsonl`. Cited: `.skilled/hooks/ask-surface-guard/lib/advisory-stop.test.mjs:30` | Met | - |
| AC-006 | REQ-006 | Given `SYSTEM_ASK_SURFACE_DISABLED=1`, When any guard runs on a firing turn, Then nothing is re-prompted | kill-switch case in the Claude, DSH, OpenCode, Pi and advisory tests passes; live kill-switch run recorded fires=0 on all four runtimes. Cited: `.skilled/hooks/ask-surface-guard/claude/ask-surface-stop.test.mjs:52, .skilled/hooks/ask-surface-guard/pi/ask-surface-guard.test.ts:76` | Met | - |
| AC-007 | REQ-007 | Given the new registry entry, When the sync check runs, Then the generated configs match | `sync-hook-registrations.cjs --check`: "PASS: 4 registration files match the 34-hook registry; 21 Pi extensions resolve.". Cited: `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:1636` | Met | - |
| AC-008 | REQ-002, REQ-004 | Given a slash command after an earlier ask, a Pi run with no UI, five Pi agent loops of one operator turn, and an OpenCode 2 turn that called `question`, When each guard runs, Then Claude blocks, Pi sends back none, then exactly one, and OpenCode sees the call | Claude 7/7, Pi vitest 6/6, OpenCode plugin suites 572/572. Cited: `.skilled/hooks/ask-surface-guard/claude/ask-surface-stop.test.mjs:71, .skilled/hooks/ask-surface-guard/pi/ask-surface-guard.test.ts:60 and :74, .opencode/plugins/tests/v2-bridge.test.cjs:139` | Met | - |

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
<!-- FILL: Write Yes or No and one sentence. Name a criterion by its id only when it blocks closure. Never write a count of criteria or an id range, because every added row makes it wrong. GOOD: No. AC-002 is unmet. WEAK: All eight criteria AC-001 to AC-008 are met. -->

**Closeable:** Yes

Every criterion is met, each against output observed on the final tree.
<!-- /ANCHOR:closure -->
