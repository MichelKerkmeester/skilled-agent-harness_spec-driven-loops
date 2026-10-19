---
title: "Acceptance Criteria: Let a second copy of the Pi fast-mode extension stand down, so cli-pi runs from a git worktree"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "cli pi worktree extension clash acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/040-cli-pi-worktree-extension-clash"
    last_updated_at: "2026-10-19T11:44:12Z"
    last_updated_by: "orchestrator"
    recent_action: "Marked each criterion with the evidence observed"
    next_safe_action: "Packet complete. Merging into the live branch waits for the operator"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "040-cli-pi-worktree-extension-clash"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Let a second copy of the Pi fast-mode extension stand down, so cli-pi runs from a git worktree

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-deep-loop/040-cli-pi-worktree-extension-clash
**Level:** 2
**Status:** Complete
**Date:** 2026-10-19
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a copy already loaded on a load's bus, When a second copy's factory runs on that bus, Then it calls none of `registerFlag`, `registerCommand` or `on` | `tests/extension.test.ts` "stands down when another copy already claimed the package" passes, and fails on the pre-change `index.ts` (1 failed, 11 passed) | Met | - |
| AC-002 | REQ-002 | Given a first copy, a copy in its own load, or a copy loading after the bus was cleared, When its factory runs, Then it registers `fast` | The "separate bus" and "cleared bus" tests and every pre-existing registration test pass: 80 of 80 (`scratch/after-ext.txt`) | Met | - |
| AC-003 | REQ-003 | Given the cli-pi argv `fanout-run.cjs` builds, When it runs from the worktree with two fixed copies, Then it exits 0 with `PI-OK`; with an unfixed second copy it still exits 1; from the main checkout it exits 0 | `scratch/smoke-2-worktree-two-fixed-copies.json` exit 0 PI-OK, `smoke-3-control-unfixed-overlay-copy.json` exit 1, `smoke-4-main-plain.json` exit 0 PI-OK | Met | - |
| AC-004 | REQ-004 | Given the baselines, When the suites rerun after the change, Then none drops below its baseline | Extension 77 → 80 passed, tsc 0; deep-loop 2,742 passed, 1 failed, 8 skipped → 2,743 passed, 0 failed, 8 skipped. The baseline failure is the containment-mode test timing out at 30 s under load (load average about 15); it passes alone (`scratch/base-*.txt`, `scratch/after-*.txt`) | Met | - |
| AC-005 | REQ-001 | Given the change, When Luna reviews it read-only against Pi's source, Then it passes with no P0 or P1 | Round 1 FAIL (P1: cwd design) led to the redesign; round 2 PASS, no findings | Met | - |
| AC-006 | REQ-003 | Given the operator's Pi install, When the work is done, Then `~/.pi` and the global install are unchanged | `~/.pi/agent/extensions/pi-fast-mode-w-subagent-support` still links to the main checkout's copy; the overlay lived in the session scratchpad; the main checkout's `git status` is the same before and after the runs | Met | - |

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

All six criteria are Met. AC-001 and AC-003 carry the fix: a second copy in one load registers nothing, and a worktree run with two fixed copies exits 0 while an unfixed control still exits 1. Left out on purpose: the cli-pi builder, the operator's `~/.pi`, and copies without the fix, which still collide until their branch takes this change.
<!-- /ANCHOR:closure -->
