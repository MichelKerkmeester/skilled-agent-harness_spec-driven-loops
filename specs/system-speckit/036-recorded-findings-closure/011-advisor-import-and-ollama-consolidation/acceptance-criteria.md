---
title: "Acceptance Criteria: Phase 11: advisor-import-and-ollama-consolidation"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "advisor import acceptance criteria"
  - "ollama merge closure gate"
  - "specifier fix ac traceability"
  - "advisor isolation waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/036-recorded-findings-closure/011-advisor-import-and-ollama-consolidation"
    last_updated_at: "2026-09-07T15:05:51Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-07-036-011-advisor-import-and-ollama-consolidation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 11: advisor-import-and-ollama-consolidation

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/036-recorded-findings-closure/011-advisor-import-and-ollama-consolidation
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
| AC-001 | REQ-001 | Given the merged Ollama implementation, When both getAdapter('ollama').embed() and createEmbeddingsProvider() are called, Then both resolve through the same implementation with no capability lost | Direct read of the merged file plus the two call sites in skill-graph-db.ts | Met | - |
| AC-002 | REQ-002 | Given the merge, When the advisor's own test suite runs, Then it passes | `npm --prefix .opencode/skills/system-skill-advisor/mcp-server run test` | Waived | ADR-001 |
| AC-003 | REQ-003 | Given the nine advisor-owned files, When their @spec-kit/shared specifiers are normalized, Then every one uses the .js extension form | `rg -n "from '@spec-kit/shared[^']*'" .opencode/skills/system-skill-advisor/mcp-server` shows only `.js`-suffixed specifiers | Met | - |
| AC-004 | REQ-004 | Given the normalized specifiers, When a lint rule or test is added, Then it fails on a future extensionless @spec-kit/shared specifier under the advisor | The new lint rule or test, run against a throwaway extensionless specifier to confirm it fails | Met | - |
| AC-005 | REQ-005 | Given the merge and the specifier fix, When the golden-prompt suite runs, Then it passes and the unicode-normalization isolation doctrine file is unchanged | `npx vitest run routing-golden-prompts.vitest.ts` and `git diff` shows no change to unicode-normalization.ts | Met | - |

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

Not started. This packet stays Planned until the five criteria above move from Unmet to Met, Waived or Superseded.
<!-- /ANCHOR:closure -->
