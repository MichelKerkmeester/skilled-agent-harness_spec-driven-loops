---
title: "Acceptance Criteria: Phase 14: registration-schema-unification"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "registration schema unification"
  - "hook registration drift"
  - "one behavioral contract five schemas"
  - "generated hook registration check"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/032-recorded-findings-closure/014-registration-schema-unification"
    last_updated_at: "2026-09-07T15:05:56Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-014-registration-schema-unification"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 14: registration-schema-unification

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/033-system-speckit-v4/032-recorded-findings-closure/014-registration-schema-unification
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
| AC-001 | REQ-001 | Given the four registration files' hook content, When the canonical source is authored, Then every hook from all four files appears exactly once with its per-runtime event bindings and script path | The canonical source file, cross-checked against the T001 inventory line by line | Met | - |
| AC-002 | REQ-002 | Given the generator, When it runs against the repository, Then it produces `.claude/settings.json`'s `hooks` key, `.codex/hooks.json`, `.cursor/hooks.json` and `.devin/hooks.v1.json` each in that runtime's own existing structural shape | Reading the generator's four template functions and their output | Met | - |
| AC-003 | REQ-003 | Given the generator's first run against the current repository, When each of the four output files is diffed against its pre-change committed content, Then every diff is empty | `diff` output for each of the four files, before and after the first generator run | Met | - |
| AC-004 | REQ-004 | Given a repository with no drift, When `--check` runs, Then it exits 0, and Given a repository with a hand-edited registration file out of sync with the canonical source, When `--check` runs, Then it reports the drift and exits non-zero | `node <generator script> --check` exit code and output, on both a clean and a deliberately drifted state | Met | - |
| AC-005 | REQ-005 | Given the canonical source's Pi-applicable hooks, When the verification pass runs, Then it reports zero missing or mismatched symlinks under `.pi/extensions/` | The verification pass's own printed report | Met | - |
| AC-006 | REQ-006 | Given the regenerated registration files, When `sync-runtime-mirrors.cjs --check` runs, Then it exits 0 exactly as it does against the current hand-authored files | `node runtime-mirrors/sync-runtime-mirrors.cjs --check` exit code, run against the regenerated files | Met | - |
| AC-007 | REQ-007 | Given `.opencode/skills/system-spec-kit/runtime/hooks/README.md`, When it is read after this phase closes, Then it documents the canonical source and the generate-and-check workflow | The README's updated section, named and dated | Met | - |
| AC-008 | REQ-008 | Given `.github/workflows/spec-kit-check.yml`'s `mirrors` job, When it is read after this phase closes, Then it includes the new generator's `--check` call alongside the existing four mirror checks | `.github/workflows/spec-kit-check.yml`, the `mirrors` job's step list | Met | - |

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

This phase is still in planning. No requirement has been implemented, so every
criterion above stays Unmet until the tasks in `tasks.md` are executed and
re-verified against the repository.
<!-- /ANCHOR:closure -->
