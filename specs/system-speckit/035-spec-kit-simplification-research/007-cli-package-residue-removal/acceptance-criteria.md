---
title: "Acceptance Criteria: CLI package residue removal"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "cli residue removal criteria"
  - "residue census criterion"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/035-spec-kit-simplification-research/007-cli-package-residue-removal"
    last_updated_at: "2026-09-06T18:40:00Z"
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
# Acceptance Criteria: CLI package residue removal

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 035-spec-kit-simplification-research/007-cli-package-residue-removal
**Level:** 2
**Status:** Complete
**Date:** 2026-09-06
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the repository outside specs, changelogs, benchmark reports and generated fixtures, When every removed name is searched, Then nothing names it | the residue census in `implementation-summary.md` returned only two fixture strings inside test data and one comment that was reworded | Met | - |
| AC-002 | REQ-002 | Given the rebuilt CLI package, When `npm run check` runs, Then it passes with the dist-alignment check reporting no orphan | `npm run rebuild` exit 0; `npm run check` exit 0, "Source/dist alignment check passed"; dist freshness "All watched dist outputs are fresh" | Met | - |
| AC-003 | REQ-003 | Given the CLI vitest project, When it runs after the removals, Then every file passes except the manifest test that reads another session's live packet | the six touched files passed (96 tests); the full project run is recorded in `implementation-summary.md` | Met | - |
| AC-004 | REQ-004 | Given every site that states the phase-child regex, When they are read, Then all carry `^[0-9]{3}-[a-z0-9][a-z0-9-]*$` | a search for the looser form under the skill and the command assets returns nothing | Met | - |
| AC-005 | REQ-005 | Given `package.json`, the CLI README and ARCHITECTURE, When their package description is read, Then all three name the same package | the three sentences in the staged diff | Met | - |
| AC-006 | REQ-006 | Given ARCHITECTURE, When the validation paragraph is read, Then it names the orchestrator hop and the 39 registered rules | the paragraph in the staged diff; the registry holds 39 entries | Met | - |
| AC-007 | REQ-007 | Given a pull request touching the skill, When the spec-kit-check workflow runs, Then the check gate, typecheck, shared tests, CLI vitest project and mirror checks execute | `.github/workflows/spec-kit-check.yml` exists with those steps; every command in it was run locally in this session | Met | - |

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

Every criterion is met by observed command output. Consciously left out: the save-path phase-parent copy stays, the resource-map wiring waits for lane 004, and the failing manifest test that reads another session's packet is recorded rather than touched.
<!-- /ANCHOR:closure -->
