---
title: "GATE ENFORCEMENT - Edge Cases & Cross-Reference"
importanceTier: constitutional
contextType: decision
last_confirmed: "2026-05-26"
last_confirmed_source: "git-log-last-touch"
triggerPhrases:
  # File modification → Gate 3 (HARD BLOCK)
  - fix
  - implement
  - create
  - modify
  - update
  - change
  - edit
  - refactor
  - write
  - add
  - remove
  - delete
  - rename
  - move
  - build
  - generate
  - configure
  - spec folder
  # Continuation (Behavioral)
  - continue
  - left off
  - continuation
  - handover
  - resume
  - where we left
  - pick up where
  - attempt
  # Compaction (Edge Case)
  - compaction
  - context lost
  - context compaction
  # Completion (Behavioral)
  - done
  - complete
  - finished
  - works
  - completed
  - all done
  # Memory Save
  - save context
  - save memory
  - memory save
---

# GATE ENFORCEMENT - Edge Cases & Cross-Reference

> Lean constitutional memory. Full gate definitions live in **AGENTS.md Section 2**.
> This file adds: compaction recovery, continuation validation, and trigger-based surfacing.

## Gate Cross-Reference

Full definitions: **AGENTS.md § 2 — MANDATORY GATES**

| Gate       | Type           | One-Line Summary                                                          |
| ---------- | -------------- | ------------------------------------------------------------------------- |
| **Gate 1** | SOFT           | Understanding + context surfacing on each user message                    |
| **Gate 2** | REQUIRED       | Skill routing via Skill Advisor Hook (primary) or the `system-skill-advisor` Python compat shim |
| **Gate 3** | **HARD BLOCK** | Spec folder A/B/C/D/E question before ANY file modification               |
| **Gate 4** | **HARD BLOCK** | Skill-owned workflow enforcement for iterative loops (`:auto` suffix etc) |

**Critical:** Gate 3 overrides Gates 1-2. If file modification detected → ask spec folder FIRST, analyze after.
**Critical:** Gate 4 enforces canonical command surfaces for deep-research/deep-review loops; cannot be bypassed via direct agent dispatch or `/tmp` state.

## Compaction Recovery

**TRIGGER:** Context compaction event (user mentions "compaction", "context lost", explicit `/compact` invocation, or post-compaction system reminder).

**ACTION:**
1. STOP — do not take any action, do not use any tools.
2. Re-read the project AGENTS.md (canonical) and any active spec folder's `handover.md` / `_memory.continuity` / `implementation-summary.md` ladder.
3. Summarise:
   - Current task and status
   - User's most recent instruction (especially constraints like "plan only", "discuss first")
   - Modified files and their current state
   - Any errors encountered and their resolutions
   - Current git branch and uncommitted changes
4. Present this summary and WAIT for confirmation before proceeding.
5. Do NOT assume the compaction summary's implied next steps are correct.

**Always preserve through compaction:**
- Exact file paths of all modifications
- Error messages verbatim
- The user's last 2-3 instructions with exact wording
- Any "do not" or "avoid" constraints from the user

After 2+ compactions in one session, recommend `/clear` and a fresh start.

## Continuation Validation

**TRIGGER:** User message contains "CONTINUATION - Attempt" pattern.

**ACTION:**
1. Parse handoff for: Spec folder path, Last Action, Next Action
2. Validate against canonical packet continuity in this order: `handover.md` -> `_memory.continuity` -> spec docs
3. IF mismatch → Report and ask:
   - A) Trust handoff message
   - B) Trust canonical continuity
   - C) Investigate both
4. IF validated → Proceed with "Continuation validated"

**RATIONALE:** Handoff messages may be stale or from a different branch. Always cross-check against the packet's canonical continuity surfaces before continuing.

## Quick Reference

| Rule                    | Trigger                                | Source            |
| ----------------------- | -------------------------------------- | ----------------- |
| Gates 1-4               | See above                              | AGENTS.md § 2     |
| Memory Save Rule        | "save context/memory"                  | AGENTS.md § 2     |
| Completion Verification | "done/complete/finished"               | AGENTS.md § 2     |
| Violation Recovery      | About to skip gates / gates skipped    | AGENTS.md § 2     |
| Compaction Recovery     | Context loss / compaction              | **This file**     |
| Continuation Validation | "CONTINUATION - Attempt"               | **This file**     |

*Constitutional Memory — Always surfaces at top of search results*
