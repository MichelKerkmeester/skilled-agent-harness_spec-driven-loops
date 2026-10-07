---
title: "Acceptance Criteria: Phase 5: source-resolver"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "source resolver acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/050-open-knowledge-format-adoption/005-source-resolver"
    last_updated_at: "2026-10-04T12:55:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Met all seven criteria and closed the packet"
    next_safe_action: "Operator reviews the diff and decides the commit"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 5: source-resolver

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/050-open-knowledge-format-adoption/005-source-resolver
**Level:** 2
**Status:** Complete
**Date:** 2026-10-04
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the registry entry, When a packet created on or before the cutoff is validated, Then the rule skips it, and a newer packet gets warn and never error | Registered at warn with `SPECKIT_SOURCE_TAG_CUTOFF`; cutoff skip and malformed fallback in the fixtures (implementation-summary.md:115) | Met | - |
| AC-002 | REQ-002 | Given a packet with no `[SOURCE:]` tags, When the rule runs, Then it passes | The no-tags fixture prints `CHECKED 0` and passes (implementation-summary.md:115) | Met | - |
| AC-003 | REQ-003 | Given any outcome, When the rule reports, Then it says a pass proves the path and line exist and nothing more | The pass and warn messages are asserted in the shell-rule fixtures (implementation-summary.md:115) | Met | - |
| AC-004 | REQ-004 | Given the helper, When it resolves a tag, Then it calls the phase 004 resolver and defines none of its own | Imports from `cite-drift-scan.mjs` only (implementation-summary.md:120) | Met | - |
| AC-005 | REQ-005 | Given a validation run, When the rule runs, Then `description.json` and `graph-metadata.json` are unchanged | Hashes and `git status` identical on phase 001 with the cutoff lifted (implementation-summary.md:119); 20 packets identical (implementation-summary.md:117) | Met | - |
| AC-006 | REQ-006 | Given a fixture with an invented line number, When the rule runs, Then it warns | A fixture tag citing line 999 of a 10-line file warns as past end (implementation-summary.md:116) | Met | - |
| AC-007 | REQ-007 | Given a fresh research lineage with one invented tag among good ones, When the rule runs, Then exactly one warning names the tag and its class | One warning naming the file, the citation and `past end`; moved names its new path (implementation-summary.md:116) | Met | - |

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

All seven criteria are met, carried by the fixture tests and the 20-packet comparison run twice. Tags without a line number and refused targets are left unchecked on purpose (implementation-summary.md:134).
<!-- /ANCHOR:closure -->
