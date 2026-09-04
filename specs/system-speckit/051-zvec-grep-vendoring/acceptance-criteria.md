---
title: "Acceptance Criteria: zvec-grep vendoring into system-plugins"
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
    packet_pointer: "system-speckit/051-zvec-grep-vendoring"
    last_updated_at: "2026-09-04T16:33:32Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-04-051-zvec-grep-vendoring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: zvec-grep vendoring into system-plugins

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/051-zvec-grep-vendoring
**Level:** 2
**Status:** Complete
**Date:** 2026-09-04
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a fresh checkout, When `npm ci && npm run build` runs in the vendored directory, Then `dist/cli/index.js` exists and prints the fork's version | built in place against the fork's dependencies; `dist/cli/index.js --version` prints 0.2.1; 380 tracked files at `53a3dc5385` | Met | - |
| AC-002 | REQ-002 | Given no override and an upstream `zg` on PATH, When the lane resolves, Then the vendored build answers with `binarySource: vendored` | live `status --json`: `vendored`, entry `skills/system-plugins/zvec-grep/dist/cli/index.js`; test "prefers the vendored harness build over an installed zg on PATH" | Met | - |
| AC-003 | REQ-003 | Given the vendored copy is unbuilt, When the lane resolves, Then the next rung answers and the doctor route names the unbuilt copy | tests pin a missing vendored path and assert PATH, fork-clone and fallback in order; `doctor-zvec.yaml` `vendored_not_built`; `route-validate.sh` 10 routes | Met | - |
| AC-004 | REQ-004 | Given the baseline index, When the five concept queries run through the vendored build, Then the top hits match the post-fix baseline | five queries through `binarySource: vendored`: same top hits as the post-fix baseline, 0.82 to 1.72 s, 0 processes left | Met | - |

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

The subtree and the resolution order carried the packet. Left out on purpose: pruning upstream's `.github` tree from the subtree, and the prompt-time hook.
<!-- /ANCHOR:closure -->
