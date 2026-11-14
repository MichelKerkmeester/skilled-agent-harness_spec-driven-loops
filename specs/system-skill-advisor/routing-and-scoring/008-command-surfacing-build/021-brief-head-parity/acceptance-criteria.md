---
title: "Acceptance Criteria: Phase 21: brief-head-parity"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "brief head parity acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/021-brief-head-parity"
    last_updated_at: "2026-11-14T08:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Run T001 and record the before numbers"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-021-brief-head-parity"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 21: brief-head-parity

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** 021-brief-head-parity
**Level:** 2
**Status:** Planned
**Date:** 2026-11-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the phase diff, When the two capture scripts run, Then the typed recall, false offer, typed delivery and eval lines equal their lines in `scratch/before.txt` and neither the plain tune count nor the sealed plain count is lower | `rg -c "^RESULT: every floor holds$" scratch/after.txt` prints 1 | Unmet | - |
| AC-002 | REQ-002 | Given one prompt whose hub leads and whose command also has its own row, When the handler runs with `compiledRouteTopOnly` set and unset, Then the first recommendation carries the same command both times | `npx vitest run tests/handlers/advisor-recommend-compiled-route-option.vitest.ts` reports 0 failed | Unmet | - |
| AC-003 | REQ-003 | Given the built advisor and the real plugin, When `probe-heads.mts` runs, Then all 17 prompts print `same head: true` and no line holds `command-doctor-` | `rg -c -F 'same head: true' scratch/repro-after.txt` prints 17 and `rg -c -F 'command-doctor-' scratch/repro-after.txt` prints nothing | Unmet | - |
| AC-004 | REQ-004 | Given a passing doctor bridge below a skill head, When the brief renders outside and inside a child session, Then the companion reads `Also: <command> (<policy>)` or keeps its child marker | `npx vitest run tests/doctor-brief-render.vitest.ts tests/render-child-session.vitest.ts` reports 0 failed | Unmet | - |
| AC-005 | REQ-005 | Given a head that prints `/doctor:update` and a passing row for the same command, When the brief renders, Then `/doctor:update` appears once and no `Also:` line repeats it | `rg -c -F 'Also: /doctor:update' scratch/repro-after.txt` prints nothing | Unmet | - |
| AC-006 | REQ-006 | Given a CLI payload whose first row does not pass and whose second does, When the plugin renders, Then the head names the second row | `node --test .opencode/plugins/tests/system-skill-advisor.test.cjs` reports `fail 0` | Unmet | - |
| AC-007 | REQ-007 | Given the skill README and the hook reference, When each is searched for the companion line's form, Then both show `(<policy>)` | The two `rg` checks in T007 and T008 print 1 | Unmet | - |
| AC-008 | REQ-008 | Given the phase diff, When added comment lines are searched for a spec path or an id, Then nothing is found and no head wording string changed | The `G diff` checks in T012 and CHK-011 print nothing | Unmet | - |
| AC-009 | REQ-009 | Given a prompt sent through the plugin, When the request written to the advisor CLI is parsed, Then `options.compiledRouteTopOnly` is `true` | `node --test .opencode/plugins/tests/system-skill-advisor.test.cjs` reports `fail 0` and `rg -c -F 'compiledRouteTopOnly: true,' .opencode/plugins/system-skill-advisor.js` prints 1 | Unmet | - |

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

**Closeable:** No

The phase is planned and not built, so every row is unmet.
<!-- /ANCHOR:closure -->
