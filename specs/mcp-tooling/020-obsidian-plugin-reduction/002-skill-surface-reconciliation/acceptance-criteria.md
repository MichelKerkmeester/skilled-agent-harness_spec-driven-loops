---
title: "Acceptance Criteria: Phase 2: skill-surface-reconciliation"
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
    packet_pointer: "scaffold/002-skill-surface-reconciliation"
    last_updated_at: "2026-09-11T06:42:01Z"
    last_updated_by: "scaffold"
    recent_action: "All nine criteria met against observed evidence"
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
# Acceptance Criteria: Phase 2: skill-surface-reconciliation

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->

## 1. METADATA

**Packet:** mcp-tooling/020-obsidian-plugin-reduction/002-skill-surface-reconciliation
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
| AC-001 | REQ-001 | Given the reconciled router, When every `RESOURCE_MAP` value is resolved against disk, Then all exist | .opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md:247 `RESOURCE_MAP`; every value resolved with test -f, none missing | Met | - |
| AC-002 | REQ-002 | Given `INTENT_SIGNALS`, When the plugin-specific intents are listed, Then only `PLUGIN_ICONIC`, `PLUGIN_HEALTH` and `THEME_SYSTEM` remain | .opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md:330 `specific_plugin_intents` holds PLUGIN_ICONIC, PLUGIN_HEALTH, THEME_SYSTEM | Met | - |
| AC-003 | REQ-003 | Given the mode directory, When the 12 removed doc-set PATHS are grepped excluding `changelog/`, Then there are no hits | grep over .opencode/skills/mcp-tooling/mcp-obsidian for removed doc-set paths returned no hits outside changelog/ | Met | - |
| AC-004 | REQ-004 | Given the generic `PLUGINS` intent, When its resource list is read, Then every entry resolves | .opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md:266 `PLUGINS` lists 5 entries, all resolving on disk | Met | - |
| AC-005 | REQ-005 | Given `SKILL.md` frontmatter and §1, When read, Then only Iconic and Health.md are named as documented plugins | .opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md:3 description and .opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md:8 keywords comment name only Iconic and Health.md | Met | - |
| AC-006 | REQ-006 | Given `installed-plugins.md`, When read, Then the dedicated-docs column names exactly the two retained plugins | .opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/installed-plugins.md:34 lists 2 documented; classes sum 2+13+9=24 | Met | - |
| AC-007 | REQ-007 | Given the changelog, When the version field is compared to the entry filename, Then they match | .opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md:5 version 0.24.0.0 matches .opencode/skills/mcp-tooling/mcp-obsidian/changelog/v0.24.0.0.md:12 | Met | - |
| AC-008 | REQ-008 | Given the intent-count comment, When `INTENT_SIGNALS` keys are counted, Then the number matches | .opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md:241 reads ten; INTENT_SIGNALS holds ten keys | Met | - |
| AC-009 | REQ-001 | Given an Iconic request and a Health.md request, When each is replayed through the router by hand, Then each loads its retained doc set | .opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md:247 `RESOURCE_MAP` maps PLUGIN_ICONIC and PLUGIN_HEALTH to their retained doc sets, both resolving | Met | - |

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
