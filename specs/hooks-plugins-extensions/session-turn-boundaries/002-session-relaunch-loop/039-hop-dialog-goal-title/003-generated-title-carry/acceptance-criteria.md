---
title: "Acceptance Criteria: Phase 3: generated-title-carry"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "generated title carry acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/003-generated-title-carry"
    last_updated_at: "2026-11-13T19:30:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Marked every criterion Met from the saved test runs, the commit and the suite runs"
    next_safe_action: "None. Merged into main and pushed on 2026-11-13"
    blockers: []
    key_files: [".skilled/hooks/session-relaunch/lib/context-usage.cjs", ".skilled/hooks/session-relaunch/bin/session-relaunch.cjs"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-generated-title-carry"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 3: generated-title-carry

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 003-generated-title-carry
**Level:** 2
**Status:** Complete
**Date:** 2026-11-13
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a Claude log with `ai-title` entries, When `readClaudeSettings` reads it, Then it returns the last non-empty title as `generatedName`, leaves the key out when no title exists and returns an object for a title-only log | `scratch/red.txt` shows the reader test failing before the edit with `generatedName: 'second generated'` missing, and `scratch/green.txt` shows it passing after. Cited: `scratch/red.txt:1`, `scratch/red.txt:34`, `scratch/green.txt:28` | Met | - |
| AC-002 | REQ-002 | Given a Claude session with no custom title and no `SKILLED_LOOP_NAME`, When `prepare` runs, Then the record's `name` is the generated title | `scratch/red.txt` shows the fallback test failing before the edit with `null` where `'hop state handoff'` was expected, and `scratch/green.txt` shows it passing after. `rg -n 'generatedName' .skilled/hooks/session-relaunch/bin/session-relaunch.cjs` prints line 592. Cited: `scratch/red.txt:2`, `scratch/red.txt:55`, `scratch/green.txt:345` | Met | - |
| AC-003 | REQ-003 | Given the fix commit, When it is inspected, Then it adds no module, no record key and no change to the wrapper | `git show --stat 7d6077678e` lists six files with none under `.skilled/bin`, and `git show 7d6077678e \| rg -c '^new file'` prints nothing with exit 1. The value rides in the existing `name:` line of the record. Observed 2026-11-13. Cited: `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:592` | Met | - |
| AC-004 | REQ-004 | Given a generated title beside a launch name or a custom title, When `prepare` runs, Then the launch name or the custom title is recorded | The ranking test passes before and after the edit, because it guards the rank that already held. Cited: `scratch/red.txt:3`, `scratch/green.txt:346` | Met | - |
| AC-005 | REQ-001, REQ-002 | Given the edited sources, When the three changed test files run, Then they all pass | `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/context-usage.test.cjs .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exited 0 with tests 359, pass 359 and fail 0 on the rerun of 2026-11-13. Cited: `scratch/green.txt:362`, `scratch/green.txt:365` | Met | - |
| AC-006 | REQ-005 | Given the final state, When the relaunch, OpenCode plugin, goal and Pi suites run, Then each passes | `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exited 0 with tests 1536, pass 1536 and fail 0, run by the orchestrator and rerun by this author on 2026-11-13 into `scratch/suite.txt`. The goal suites exit 0 with 200 of 200 and the Pi vitest run 62 of 62 were run by the orchestrator only, with no saved output. Cited: `scratch/suite.txt:1548`, `scratch/suite.txt:1551`. Note of 2026-11-14: all three suites were rerun on the final tree. `023-epic-review-doc-fixes/scratch/final-suite.txt` holds tests 1555, pass 1555, fail 0 and exit 0. `023-epic-review-doc-fixes/scratch/goal-suite.txt` holds tests 200, pass 200, fail 0 and exit 0. `023-epic-review-doc-fixes/scratch/pi-suite.txt` holds 62 passed of 62 and exit 0 | Met | - |
| AC-007 | REQ-006 | Given the session-relaunch README, When it is searched, Then it names the generated title fallback | `rg -n 'ai-title' .skilled/hooks/session-relaunch/README.md` prints one line on 2026-11-13. Cited: `.skilled/hooks/session-relaunch/README.md:49` | Met | - |

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

Every row is Met. No row asks for a live hop, and that gap is a Known Limitation in `implementation-summary.md`.
<!-- /ANCHOR:closure -->
