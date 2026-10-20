---
title: "Acceptance Criteria: Phase 16: handover-trigger-review"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "handover trigger review acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/hooks/023-session-relaunch-loop/016-handover-trigger-review"
    last_updated_at: "2026-10-20T18:00:00Z"
    last_updated_by: "worker"
    recent_action: "Met the Part A criteria for the handoff command doc"
    next_safe_action: "Run the ten-iteration deep review of the 023 packet"
    blockers: []
    key_files:
      - ".skilled/commands/speckit/handoff.md"
      - ".skilled/skills/sk-doc/sk-create-command/assets/command-contract.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 30
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 16: handover-trigger-review

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** specs/hooks/023-session-relaunch-loop/016-handover-trigger-review
**Level:** 2
**Status:** In Progress
**Date:** 2026-10-20
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the sk-create-command template, When the `/speckit:handoff` doc is read against it, Then it uses an approved section name, title-case step headings and an Outputs column with the exact STATUS lines | Evidence: commit `33a68750b1`. Section 5 renamed from "RECEIVING A HANDOFF" to the approved "REFERENCE" with "### Receiving A Handoff" under it, step headings in title case, overview column "Output" renamed "Outputs" and listing the three exact STATUS lines. The contract coverage note in `command-contract.json` now says 34 of the 40 shipped commands and names `/speckit:handoff` and `/doctor:setup` | Met | - |
| AC-002 | REQ-004 | Given the edited command doc and contract, When the command checks run, Then they pass | Evidence: `check_authored_name_kebab` PASS rc 0. `validate_document.py --type command` VALID, 0 issues, rc 0. `extract_structure.py` checklist 0 failed, score 95. `hvr_scan.py` 0 hard blockers. `generate-command-routers.cjs` routers=34 clean=34 rc 0. `sync-runtime-mirrors.cjs --check` PASS, 192 mirrors. `doctor-update-contract.test.cjs` 12 of 12 | Met | - |
| AC-003 | REQ-002 | Given the 023 packet, When the ten-iteration `/deep:review` runs with cli-codex `gpt-6-luna`, reasoning max, fast tier, through `fanout-run.cjs` with one executor, Then it reports whether the automatic handover fires every time on the five automatic runtimes, including repositories that symlink `.skilled` | Not yet met. The review has not run | Unmet | - |
| AC-004 | REQ-003 | Given the review's P0 and P1 findings, When each is verified, Then every confirmed one is fixed with a check that fails without the fix | Not yet met. Waits on AC-003 | Unmet | - |
| AC-005 | REQ-005 | Given the review's P2 findings, When each is verified, Then every confirmed one is fixed | Not yet met. Waits on AC-003 | Unmet | - |
| AC-006 | REQ-006 | Given the fixes, When live hops run on Claude, Pi, OpenCode, Codex and Hermes, including a repository that symlinks `.skilled`, Then each hop passes | Not yet met. Waits on AC-004 and AC-005 | Unmet | - |

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

AC-001 and AC-002 are Met by Part A. AC-003 to AC-006 wait on the Part B review, its fixes and the live re-proof.
<!-- /ANCHOR:closure -->
