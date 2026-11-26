---
title: "Acceptance Criteria: Phase 15: fix-follow-up-review-findings"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "fix follow up review findings acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp/mcp-browser-use/001-mcp-browser-use-hub/015-fix-follow-up-review-findings"
    last_updated_at: "2026-11-24T07:44:39Z"
    last_updated_by: "scaffold"
    recent_action: "Marked every criterion Met with evidence"
    next_safe_action: "None; the packet may close"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-015-fix-follow-up-review-findings"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 15: fix-follow-up-review-findings

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** 015-fix-follow-up-review-findings
**Level:** 2
**Status:** Complete
**Date:** 2026-11-24
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the three mode ids in one prompt, When `compiled-route.cjs --hub mcp-browser-use` routes it, Then it prints `orderedBundle` with all three modes, and the canary harness fails without the alias | `route orderedBundle mcp-chrome-devtools,mcp-aside-devtools,mcp-bladebro`; harness `exit=1` without the alias and `exit=0` with it | Met | - |
| AC-002 | REQ-002 | Given the hub `SKILL.md`, When `rg -n 'page.on'` runs on it, Then it prints nothing | `rg exit=1`; line 40 reads "Not offered" for Aside | Met | - |
| AC-003 | REQ-003 | Given a stub `aside` on PATH, When the capture example runs with `./tmp/../../x`, Then it exits 1 at the guard, and `./tmp/run1` passes the guard | Guard message for `./tmp/../../x` and `./tmp/a/../../..`; `./tmp` and `./tmp/run1` reach the REPL step | Met | - |
| AC-004 | REQ-004 | Given the Aside installer, When the repo-wide grep for curl piped into a shell runs, Then no `install.sh` matches, and the wrapper checks a pinned sha256 before running | grep exit 1; `bash -n` exit 0; the mismatch branch exits 1 | Met | - |
| AC-005 | REQ-005 | Given the P2 drift items in Scope, When the replay runs, Then every row passes except MBU-PB-04 | `{"PASS":51,"FAIL":1}` in the follow-up replay; vocabulary diff 0; no 1.1.2.0 left in hub metadata; index lists both 2026-11-24 runs | Met | - |
| AC-006 | REQ-006 | Given the five probe prompts, When the advisor scores them, Then none lifts system-deep-loop, mcp-tooling, mcp-code-mode or mcp-browser-use, and "run the doctor update check" still lifts system-skilled-doctor | In-process probe `F2` against `nouns-base`; replay MBU-N-19 and MBU-N-20 at hub confidence 0 | Met | - |
| AC-007 | REQ-007 | Given the advisor runtime after the change, When the ratchet metrics and the full suite run, Then all eight metrics hold and only the known `system-skilled-bots` test fails | Metrics equal to the committed variant; suite 2,737 passed, 4 skipped, 1 failed | Met | - |

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

Every criterion is Met with observed evidence, and the one moved advisor pin was approved as Q009.
<!-- /ANCHOR:closure -->
