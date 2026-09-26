---
title: "Acceptance Criteria: Phase 11: cross-surface-references"
description: "The criteria that close phase 011: README references, a fresh command-bridge projection, passing command counts, agent coverage and the feature catalog."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/060-create-goal-mode/011-cross-surface-references"
    last_updated_at: "2026-09-26T14:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Closed all five criteria with evidence"
    next_safe_action: "None, phase closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "75aab0e6-dcc7-401b-9d10-f48248374023"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 11: cross-surface-references

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/060-create-goal-mode/011-cross-surface-references
**Level:** 2
**Status:** Complete
**Date:** 2026-09-26
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the root and sk-doc hub READMEs, When a reader looks for the create modes and commands, Then both name the goal mode and count what `mode-registry.json` holds. | T005, T006, T015. Both validate with 0 issues and no HVR finding was added. Cited: `README.md:870`, `README.md:1149` and `.skilled/skills/sk-doc/README.md:134`. | Met | - |
| AC-002 | REQ-002 | Given the sk-doc command metadata, When the bridge deriver runs in check mode, Then it reports fresh, the projection carries `/create:goal`, and the memory-save wording matches the committed scorer. | T009, T013. `derive-command-bridges.cjs --check` prints `"status": "fresh"`, and the TypeScript projection's only change is the new bridge. Cited: `.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:346` and `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json:32`. | Met | - |
| AC-003 | REQ-003 | Given the create command assets and the declared commands, When the asset tests and the advisor census run, Then both pass. | T010, T011, T012, T013. 13 of 13 asset tests and the census test pass. Cited: `.skilled/commands/create/assets/tests/fixtures/emitted-name-contract.json:21` and `.skilled/skills/system-skill-advisor/runtime/tests/command-metadata-e2e.vitest.ts:73`. | Met | - |
| AC-004 | REQ-004 | Given the `@markdown` agent, When its gate and template map are read on any runtime, Then `/create:goal` is valid and maps to the three goal templates. | T007, T014. The agent mirror check reports 12 agents in sync and the Hermes check reports 71 copies in sync. Cited: `.skilled/agents/markdown.md:63` and `.skilled/agents/markdown.md:206`. | Met | - |
| AC-005 | REQ-005 | Given the sk-doc feature catalog, When its mode list and counts are read, Then it lists `sk-create-goal` and counts fifteen modes across fourteen packets. | T008, T015. Both files validate with 0 issues. Cited: `.skilled/skills/sk-doc/feature-catalog/feature-catalog.md:35` and `.skilled/skills/sk-doc/feature-catalog/packet-authored-registry-routing/packet-authored-registry-routing.md:28`. | Met | - |

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

The READMEs, the agent, the catalog and the advisor projection now name the goal mode, and both command counts pass. The changelog link and the command files already matched their siblings, so they were checked and left as they were.
<!-- /ANCHOR:closure -->
