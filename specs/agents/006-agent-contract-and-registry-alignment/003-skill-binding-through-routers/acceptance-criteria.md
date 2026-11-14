---
title: "Acceptance Criteria: Phase 3: skill-binding-through-routers"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "skill binding through routers acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/006-agent-contract-and-registry-alignment/003-skill-binding-through-routers"
    last_updated_at: "2026-11-14T11:36:22Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-skill-binding-through-routers"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 3: skill-binding-through-routers

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 006-agent-contract-and-registry-alignment/003-skill-binding-through-routers
**Level:** 2
**Status:** Draft
**Date:** 2026-11-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given an agent file citing a skill path that is not on disk, When the check runs, Then it exits 1 and prints the agent and the path | The vitest case `flags a missing skill path` passes, and `node .skilled/bin/sync-agent-roster.cjs --check` exits 0 | Unmet | - |
| AC-002 | REQ-002 | Given each path removed from an agent file, When the skill's router is run for that agent's task, Then the same file is among the resources it returns | `scratch/route-parity.md` has one row per removed path, each ending `reachable` or `kept, router cannot select it` | Unmet | - |
| AC-003 | REQ-003 | Given the edited canonical files, When the mirror check runs, Then every comparable copy is in sync | `node .skilled/bin/check-agent-mirror-sync.cjs` ends with `all comparable mirrors in sync` and exits 0 | Unmet | - |
| AC-004 | REQ-004 | Given `design.md`, When it is searched for paths inside `sk-code-frontend`, Then only paths marked kept in the parity table remain | `rg -o 'sk-code/sk-code-frontend/[a-z/.-]+' .skilled/agents/design.md` prints only paths listed as kept in `scratch/route-parity.md` | Unmet | - |
| AC-005 | REQ-005 | Given `markdown.md`, When it is searched for `sk-create-*` asset paths, Then nothing matches | `rg -n 'sk-doc/sk-create-[a-z-]+/assets/' .skilled/agents/markdown.md` prints no line | Unmet | - |
| AC-006 | REQ-006 | Given `deep-review.md`, When it is searched for the doctrine file path, Then nothing matches and the mode's `SKILL.md` is named | `rg -n 'sk-code-review/references/review-core.md' .skilled/agents/deep-review.md` prints no line, and `rg -c 'sk-code-review/SKILL.md' .skilled/agents/deep-review.md` prints 1 or more | Unmet | - |
| AC-007 | REQ-007 | Given the three files, When each skill row is read, Then it has a load condition and an entry file | `rg -c 'SKILL.md' .skilled/agents/debug.md .skilled/agents/context.md .skilled/agents/prompt-improver.md` prints 1 or more for each file | Unmet | - |

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

No criterion has been verified yet, because this phase is planned and not implemented.
<!-- /ANCHOR:closure -->
