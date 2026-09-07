---
title: "Acceptance Criteria: Shared package post-remediation cleanup"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "shared cleanup criteria"
  - "reader table criterion"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/035-spec-kit-simplification-research/015-shared-package-post-remediation-cleanup"
    last_updated_at: "2026-09-07T07:05:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Marked every criterion met with the evidence observed"
    next_safe_action: "None; the packet is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-06-simplification-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Shared package post-remediation cleanup

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 035-spec-kit-simplification-research/015-shared-package-post-remediation-cleanup
**Level:** 2
**Status:** Complete
**Date:** 2026-09-07
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the shared package, When it builds from clean and its lane runs, Then the build exits zero and the lane counts the two new tests | `tsc --build --force` exit 0; `npm test` 12 pass, 0 fail, with "jsonc strip ok" and "context types ok" in the output | Met | - |
| AC-002 | REQ-002 | Given the removals, When the CLI rebuilds and the runtime builds, Then both exit zero and dist freshness reports fresh | rebuild exit 0; `npm run check` exit 0; runtime build exit 0; "All watched dist outputs are fresh" | Met | - |
| AC-003 | REQ-003 | Given the README, When each group's variables are searched across the package, Then the cell names exactly the reading files | the cells were generated from that search; the sk-doc validator exit 0 | Met | - |
| AC-004 | REQ-004 | Given the skill, the bin scripts and the advisor, When the removed names are searched, Then only changelogs match | the search returned no line outside changelogs | Met | - |

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

Every criterion is met by observed output. Consciously left out: the two live Ollama implementations and the root resolvers, each a recorded decision in the lane's confirmed-findings document, and the 36 sk-doc parity mismatches that sit under other skills' READMEs.
<!-- /ANCHOR:closure -->
