---
title: "Acceptance Criteria: Phase 2: retire-fundamentals"
description: "The criteria this retirement phase must meet before the packet closes, each one met with a command from the final gate run."
trigger_phrases:
  - "retire fundamentals acceptance criteria"
  - "sk-design three mode criteria"
  - "phase 2 closure gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/021-deprecate-fundamentals/002-retire-fundamentals"
    last_updated_at: "2026-11-05T12:00:00Z"
    last_updated_by: "markdown"
    recent_action: "Recorded the acceptance evidence for every criterion"
    next_safe_action: "None, the phase is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-021-002-retire-fundamentals"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 2: retire-fundamentals

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** 002-retire-fundamentals
**Level:** 2
**Status:** Complete
**Date:** 2026-11-05
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the retired design mode, When the deletion completes, Then no live file names `sk-design-fundamentals` | `ls .skilled/skills/sk-design/sk-design-fundamentals` reports no such file and `rg -n 'sk-design-fundamentals'` over the eight live hub files prints no line | Met | - |
| AC-002 | REQ-002 | Given the sk-design hub, When its registry, router and skill entry are read, Then three modes remain and no default mode is set | `parent-skill-check sk-design` prints `OK: parent-skill-check` with all hard invariants passed and 0 warnings at exit 0, and leg 6b counts 3 modes in the hub table | Met | - |
| AC-003 | REQ-003 | Given the hub metadata, When the intent signals are counted, Then 111 remain from 219 with the fundamentals and slides or print phrases gone | `generate-router-intent-signals --check sk-design` prints orphans=0 missing=0 PASSED | Met | - |
| AC-004 | REQ-004 | Given a decide request, When the design agent routes it, Then the decide path names the sk-code-frontend visual references | `rg -n 'sk-code-frontend' .skilled/agents/design.md` prints the decide path and `runtime-mirrors --check` reports PASS for 213 mirrors | Met | - |
| AC-005 | REQ-005 | Given every document that cited the fundamentals path, When its links are read, Then each points at sk-code-frontend or drops the reference | `rg -n 'sk-design-fundamentals'` over the ten repointed documents and prompts prints no line | Met | - |
| AC-006 | REQ-006 | Given the sk-design canaries, When they replay, Then no case names fundamentals and the out-of-domain prompt defers | `rg -n 'out-of-domain-defer' .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/009-sk-design/fixtures/canary-cases.v1.json` prints the case and `rg -n 'VALUES\|REVIEW'` on `registry-compiler.cjs` prints no line | Met | - |
| AC-007 | REQ-007 | Given the compiled routing chain, When the served copies are compared, Then all 55 match their authored files and all 7 hubs resolve | `compiled-route-sync --check` prints all 55 served copies match and `--verify` prints the move simulation resolves all 7 hubs | Met | - |
| AC-008 | REQ-008 | Given all 7 hubs, When the vocabulary reach check runs, Then no wrong hub wins and sk-design declares 84 phrases from 120 | `ci-router-vocabulary-reach` prints RESULT PASSED with wrong-hub=0 outranked=0 no-reach=0 | Met | - |
| AC-009 | REQ-009 | Given the two skills, When their versions are read, Then sk-design is 3.0.0.0 and mcp-figma is 1.2.2.0, each with a changelog entry | `rg -n 'version: 3.0.0.0' .skilled/skills/sk-design/SKILL.md` and `rg -n 'version: 1.2.2.0' .skilled/skills/mcp-tooling/mcp-figma/SKILL.md` each print one line and both changelogs exist | Met | - |
| AC-010 | REQ-010 | Given the repository, When the link and mirror checks run, Then no markdown link breaks and every mirror matches | `check-markdown-links` prints 0 broken markdown links across 14494 links and `runtime-mirrors --check` reports PASS for 213 mirrors | Met | - |

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

Every criterion is Met with a command from the final gate run and nothing was waived, so the decision record carries no closure ADR.
<!-- /ANCHOR:closure -->
