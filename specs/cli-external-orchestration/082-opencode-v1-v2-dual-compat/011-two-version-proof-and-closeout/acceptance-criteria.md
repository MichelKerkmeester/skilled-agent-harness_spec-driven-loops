---
title: "Acceptance Criteria: Phase 11: two-version-proof-and-closeout"
description: "The criteria this packet must satisfy before it may be closed. Each one is met, waived by a decision record or superseded by one."
trigger_phrases:
  - "two version proof and closeout acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/011-two-version-proof-and-closeout"
    last_updated_at: "2026-10-18T12:45:11Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-011-two-version-proof-and-closeout"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 11: two-version-proof-and-closeout

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `cli-external-orchestration/082-opencode-v1-v2-dual-compat/011-two-version-proof-and-closeout`
**Level:** 2
**Status:** Draft
**Date:** 2026-10-18
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Evidence | Status | Waiver |
|-------|-----|---------------------|--------------|----------|--------|--------|
| AC-001 | REQ-001 | Given the phase 001 baseline, When each suite runs, Then each pass count is at or above its baseline count | Run the commands in tasks.md T005 to T007, and compare each count with `../001-unknowns-and-baseline/baseline.json`. Record each count in `proof.md`. Evidence: proof.md:40 | proof.md Suites: all ten suites exit 0 at or above baseline, from the final tree: plugins 355 (303), guard node 29 (21), guard vitest 106 (86), shared hooks 57 (57), classifier 90 (78), config shape 2 (2), gate 3 17 (17), doctor 383 (380), sk-vision 46 (29), deep-loop 2742 passed, 8 skipped (2718). scratch/suites/exits.txt | Met | - |
| AC-002 | REQ-002 | Given OpenCode 1.19.3 and 2.0.32 installed, When the doctor battery runs against each, Then each run exits 0 | Run `.skilled/commands/doctor/scripts/opencode-version-battery.cjs` against each binary, as in tasks.md T008 and T009. Observe each exit status. Evidence: proof.md:48 and proof.md:49 | Three runs per version, all exit 0 (scratch/proof/battery-exits.txt). 1.19.3: 16 of 16 discovered and loaded. 2.0.32: 16 of 16 active, 57 skills visible (scratch/proof/battery-v1-final.json, battery-v2-final.json) | Met | - |
| AC-003 | REQ-003 | Given the parent packet, When recursive strict validation runs, Then it prints `RESULT: PASSED` | Run `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat --recursive --strict`, and read the RESULT line. Evidence: proof.md:95 | `RESULT: PASSED` (scratch/validate-recursive.txt) | Met | - |
| AC-004 | REQ-004 | Given each child's acceptance criteria, When the rows are read, Then none is Unmet and each Met row carries evidence | Run `grep -c '\| Unmet \|' <child>/acceptance-criteria.md` for each child folder from 001 to 011, and read each Evidence cell. Evidence: scratch/decisions.txt:17 | No Unmet row in 001 to 011. Every Met row in 001 to 010 carries observed output, in its Verification cell (001 to 008) or its Evidence cell (009, 010); 010's missing Waiver cells were restored (scratch/decisions.txt 7) | Met | - |
| AC-005 | REQ-005 | Given the cli-opencode `SKILL.md`, When the claim is searched, Then it names 1.19.3, 2.0.32 and the verification date | Run `grep -n 'Verified against OpenCode 1.19.3 and 2.0.32 on' .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md`. Evidence: .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md:134 | One line, `SKILL.md:134`, dated 2026-10-19; Luna review PASS (scratch/reviews/review-claim-luna.txt); `validate_document.py` and `validate_skill_package.py` exit 0 (scratch/claim/) | Met | - |
| AC-006 | REQ-006 | Given the parent and each child, When the status lines are read, Then the completion state matches across them | Read the parent phase map in `../spec.md` and each child's `implementation-summary.md` status, and confirm they agree. Evidence: ../spec.md:124 | Parent phase map rows 1 to 11 Complete, matching each child's `implementation-summary.md` Status row | Met | - |

The Verification cell holds the exact check to run. The Evidence cell stays empty until the orchestrator runs that check. Then it holds the observed output and exit status.

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

Not started. This section is written when the packet closes, not before.
<!-- /ANCHOR:closure -->
