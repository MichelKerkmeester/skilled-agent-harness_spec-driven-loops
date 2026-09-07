---
title: "Acceptance Criteria: Template seams and sentinel repair"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "sentinel repair criteria"
  - "runtime lanes green criterion"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/035-spec-kit-simplification-research/016-template-seams-and-sentinel-repair"
    last_updated_at: "2026-09-07T07:40:00Z"
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
# Acceptance Criteria: Template seams and sentinel repair

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 035-spec-kit-simplification-research/016-template-seams-and-sentinel-repair
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
| AC-001 | REQ-001 | Given a packet whose `tasks.md` verification section holds a completed P0 item without evidence, When a completion claim is evaluated, Then the sentinel advises; and a packet with no section takes the summary path | `runtime/lib/hooks/completion-evidence-sentinel.cjs:498` gates on the protocol anchor; `runtime/tests/completion-evidence-sentinel.vitest.ts:39` builds that section; the suite passed | Met | - |
| AC-002 | REQ-002 | Given the four test lanes, When they run, Then all pass and the workflow lists the runtime project | the runtime project passed 104 files and 1,258 tests, the CLI project 138 files and 1,356 tests, the legacy lane 94 checks and the validation lane 83 checks with exit 0 each; `.github/workflows/spec-kit-check.yml` runs the runtime project after the validation lane | Met | - |
| AC-003 | REQ-003 | Given the program and three older packets, When strict validation runs, Then every folder prints RESULT: PASSED | the program printed sixteen; `033-system-speckit-v4/028`, `034-goal-operator-resync-rule` and `agents/006-restraint-and-routing-gates` passed after the helper split, where the first attempt failed their level match | Met | - |
| AC-004 | REQ-004 | Given the skill's documents and the root README, When the retired claims are searched, Then none is presented as current | `runtime/cli/spec/create.sh` carries no sharded flag; `references/templates/template-guide.md:178` no longer says required; `templates/EXTENSION-GUIDE.md:45` qualifies the list; the enum names two values; both READMEs give the resource map its renderer | Met | - |

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

Every criterion is met by observed output. Consciously left out: the repository-wide retro-citation of criteria, documented as aspirational in the coverage reference, and a per-document staleness checker, documented in the checker itself.
<!-- /ANCHOR:closure -->
