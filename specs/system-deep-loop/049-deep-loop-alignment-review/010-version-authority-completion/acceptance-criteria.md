---
title: "Acceptance Criteria: Phase 10: version-authority-completion"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 10: version-authority-completion

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-deep-loop/049-deep-loop-alignment-review/010-version-authority-completion
**Level:** 2
**Status:** Complete
**Date:** 2026-09-16
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given `sk-doc`, When its `SKILL.md` version and its newest changelog entry are compared, Then they name the same release | `changelog/v2.1.0.0.md` created; both read `2.1.0.0` | Met | - |
| AC-002 | REQ-002 | Given each hub, When its five routing artifacts are read, Then all carry the authority's version | `sk-doc` 2.1.0.0 and `mcp-tooling` 1.6.1.0, five values each | Met | - |
| AC-003 | REQ-003 | Given the two `sk-code` `0.x` surfaces, When the alignment decision is read, Then it names why they are versioned independently | `sk-code/SKILL.md` Version authority paragraph; all six packets measured as independent | Met | - |
| AC-004 | REQ-004 | Given the version standard's enforcement section, When it is read, Then it names the parity checks that do not exist | `frontmatter-versioning.md` §7 "What nothing enforces" | Met | - |
| AC-005 | REQ-005 | Given the edits, When the compiled route guard runs, Then every hub is fresh | `node .opencode/bin/compiled-route-guard.cjs`, exit 0, five hubs fresh, authored twins byte-identical | Met | - |
| AC-006 | REQ-005 | Given the change, When the runtime suite runs, Then it exits zero | `npx vitest run --no-coverage` in `runtime/`: 154 files, 2678 passed, 8 skipped, exit 0 | Met | - |

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

AC-001 carried this packet: the two deferred hubs could not be aligned until the question of which release they were being aligned to was settled, and `sk-doc`'s `SKILL.md` named one its changelog did not. AC-002 and AC-005 prove the alignment landed and still serves. AC-003 and AC-004 record the two things deliberately not built: the `sk-code` `0.x` packet versions are independent by design, so nothing was raised to match the hub, and no parity gate was written, so the absence itself is documented where the standard states its enforcement.
<!-- /ANCHOR:closure -->
