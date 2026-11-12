---
title: "Acceptance Criteria: Phase 3: refuse-single-lineage-fanout-run"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "single-lineage refusal acceptance criteria"
  - "fan-out opt-in closure criteria"
  - "allow-single-lineage acceptance"
  - "fanout-run refusal traceability"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/003-refuse-single-lineage-fanout-run"
    last_updated_at: "2026-11-11T23:59:43Z"
    last_updated_by: "closeout-author"
    recent_action: "Recorded verified acceptance evidence"
    next_safe_action: "Continue with Phase 4 after closeout review"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-refuse-single-lineage-fanout-run"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Acceptance Criteria: Phase 3: refuse-single-lineage-fanout-run

<!-- SPECKIT_LEVEL: 2 -->

<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 003-refuse-single-lineage-fanout-run
**Level:** 2
**Status:** Complete
**Date:** 2026-11-12
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a research or review matrix that expands to one lineage without the opt-in, When `fanout-run.cjs` reaches its preflight, Then it exits with input-validation code 3 before creating a directory, ledger, summary or spawn and names the matching single-executor workflow without naming the opt-in flag. | Focused refusal test passed: `../scratch/build-evidence.md:80`. The test asserts exit code 3, workflow guidance and absent side effects at `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:2536`, `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:2537`, `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:2540` and `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:2543`. Final full-suite result: `../scratch/build-evidence.md:119`. | Met | - |
| AC-002 | REQ-002 | Given an intentional direct one-lineage research or review run, When the caller passes `--allow-single-lineage`, Then the runner accepts the registered option and reaches the stub executor, and known direct callers use the opt-in. | Focused opt-in test passed: `../scratch/build-evidence.md:86`. The test asserts marker creation and no refusal at `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:2572` and `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:2573`. Caller flag Verify outputs are recorded at `tasks.md:50`, `tasks.md:52`, `tasks.md:60`, `tasks.md:62`, `tasks.md:64` and `tasks.md:66`; final full-suite result: `../scratch/build-evidence.md:119`. | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write - when the row is Met or Unmet. Write ADR-NNN when the row is Waived or Superseded, naming a decision record that exists in decision-record.md. A waiver naming an ADR that is not there fails validation: the point of a waiver is that someone recorded the reasoning, so an unbacked waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

AC-001 and AC-002 are Met. The focused behavior outputs and the final full-suite exit 0 are recorded above and in `tasks.md`.
<!-- /ANCHOR:closure -->
