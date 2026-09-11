---
title: "Acceptance Criteria: Phase 1: plugin-doc-removal"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/001-plugin-doc-removal"
    last_updated_at: "2026-09-11T06:42:00Z"
    last_updated_by: "scaffold"
    recent_action: "All six criteria met against observed evidence"
    next_safe_action: "Phase complete; nothing further in this phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 1: plugin-doc-removal

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->

## 1. METADATA

**Packet:** mcp-tooling/020-obsidian-plugin-reduction/001-plugin-doc-removal
**Level:** 3
**Status:** Complete
**Date:** 2026-09-11
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->

## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the 14 plugin doc sets, When the frozen list is deleted, Then only `iconic` and `health-md` remain | .opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/ holds 4 entries; `ls` printed health-md, iconic, installed-plugins.md, plugin-operation-logic.md | Met | - |
| AC-002 | REQ-002 | Given the retained sets, When the phase completes, Then each still holds its 4 files and none appears modified | .opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/iconic/ and health-md/ hold 4 files each; git status shows no M on either | Met | - |
| AC-003 | REQ-003 | Given 7 asset directories, When the 5 removed ones and the BRAT root asset are deleted, Then `assets/plugins/` holds only `health-md` and `iconic` | .opencode/skills/mcp-tooling/mcp-obsidian/assets/plugins/ holds health-md and iconic; .opencode/skills/mcp-tooling/mcp-obsidian/assets/brat-data-entry.example.json absent | Met | - |
| AC-004 | REQ-004 | Given 14 catalog entries and 14 playbook tie-ins, When the removed ones are deleted, Then 3 of each remain | .opencode/skills/mcp-tooling/mcp-obsidian/feature-catalog/plugins/ and .opencode/skills/mcp-tooling/mcp-obsidian/manual-testing-playbook/plugin-tie-ins/ hold 3 files each | Met | - |
| AC-005 | REQ-005 | Given the theme surface, When the phase completes, Then `theme-system.md` and `theme-activation.md` are still present | .opencode/skills/mcp-tooling/mcp-obsidian/feature-catalog/plugins/theme-system.md:1 and .opencode/skills/mcp-tooling/mcp-obsidian/manual-testing-playbook/plugin-tie-ins/theme-activation.md:1 both present | Met | - |
| AC-006 | REQ-006 | Given the mode directory, When the phase completes, Then the diff holds 79 deletions and zero modifications | git status --porcelain over .opencode/skills/mcp-tooling/mcp-obsidian returned 79 lines, all prefixed D | Met | - |

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

Every criterion is Met against evidence that was run from the final state and read.
What was consciously left out: the two prose mentions of removed plugins that are
statements about the vault rather than pointers into deleted docs, which is why AC-003
scans paths rather than names.
<!-- /ANCHOR:closure -->
