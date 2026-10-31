---
title: "Acceptance Criteria: Phase 3: playbook-provenance-lines"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "playbook provenance acceptance criteria"
  - "provenance line closure gate"
  - "no fabrication proof"
  - "playbook contract regression proof"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/032-recorded-findings-closure/003-playbook-provenance-lines"
    last_updated_at: "2026-09-07T19:40:00Z"
    last_updated_by: "scaffold"
    recent_action: "Marked every criterion met with the evidence observed"
    next_safe_action: "None; the packet is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-07-032-recorded-findings-closure-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 3: playbook-provenance-lines

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/033-system-speckit-v4/032-recorded-findings-closure/003-playbook-provenance-lines
**Level:** 2
**Status:** Complete
**Date:** 2026-09-07
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|----------------------|---------------|--------|--------|
| AC-001 | REQ-001 | Given all 85 files under `manual-testing-playbook/`, When each is read, Then every one carries a `Provenance:` line naming a suite path or "manual only" plus a command | `grep -rL "Provenance:"` over the package returns zero files; 85 lines, 16 suite-backed and 69 manual only | Met | - |
| AC-002 | REQ-002 | Given the new `playbook-provenance-paths.vitest.ts`, When run against the full tree, Then it fails if any cited suite path does not resolve on disk | `runtime/cli/tests/playbook-provenance-paths.vitest.ts` passes, 3 tests; its third case fails on any cited path that does not resolve from the repository, skill or runtime root | Met | - |
| AC-003 | REQ-003 | Given every suite-backed provenance line, When cross-checked against the runtime tree, Then each cited path is a real, existing file, not a name that resembles one | the same suite resolved all 16 cited suites; spot check: architecture-boundary-enforcement, cli-trusted-gate-refusal and three plugins-and-hooks entries cite files that exist | Met | - |
| AC-004 | REQ-004 | Given `.github/workflows/playbook-operator-contract.yml`, When run against the changed tree, Then the `validate-playbook-package.cjs` step still exits 0 | `validate-playbook-package.cjs --strict` prints PASS for system-spec-kit with 83 scenarios, 10 categories and 0 violations | Met | - |
| AC-005 | REQ-005 | Given `manual-testing-playbook.md` Section 8, When read after this phase, Then it names the provenance-line convention alongside the two coverage mechanisms it already documents | section 8 of `manual-testing-playbook.md` names the two forms and the walking suite | Met | - |
| AC-006 | REQ-006 | Given the fixed provenance-line template, When applied across all 85 files, Then every line matches one of exactly two forms with no third variant | the form grep matches all 85 lines; the writing script rejected zero | Met |test\.mjs\|test\.ts\|test\.cjs))" .opencode/skills/system-spec-kit/manual-testing-playbook --include="*.md" \| wc -l` equals 85 | Unmet | - |

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

This packet is at the planning stage: spec, plan and tasks are authored and every
criterion above is traced to a real requirement, but none has been executed yet.
Closure is written once AC-001 through AC-006 all read `Met`.
<!-- /ANCHOR:closure -->
