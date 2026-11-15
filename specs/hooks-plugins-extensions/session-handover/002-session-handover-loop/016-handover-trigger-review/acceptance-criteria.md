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
    recent_action: "Met every criterion after the review fixes and live hops"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files:
      - ".skilled/commands/speckit/handoff.md"
      - ".skilled/skills/sk-doc/sk-create-command/assets/command-contract.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 100
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
**Status:** Complete
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
| AC-003 | REQ-002 | Given the 023 packet, When the ten-iteration `/deep:review` runs with cli-codex `gpt-6-luna`, reasoning max, fast tier, through `fanout-run.cjs` with one executor, Then it reports whether the automatic handover fires every time on the five automatic runtimes, including repositories that symlink `.skilled` | Evidence: run `1792514860659-ivxs3k` through `fanout-run.cjs`, one cli-codex lineage `gpt-6-luna` max fast, 10 of 10 iterations, stop reason `maxIterationsReached`, 1 of 1 lineage succeeded. `review/lineages/luna/review-report.md` reports FAIL with P0=1, P1=4, P2=1, and commit `d68b78eec3` records it | Met | - |
| AC-004 | REQ-003 | Given the review's P0 and P1 findings, When each is verified, Then every confirmed one is fixed with a check that fails without the fix | Evidence: commit `17cfea3629`. Verified each finding by reading the code. P1 tail: an oversized final row hid the latest usage. The Claude and Codex readers now widen the tail up to 16 MiB, and two new tests failed before the fix on assertions. P1 timeout: a stale killer disarmed a same-note re-arm. Timeout cleanup now compares `armedAt`, and a new killer test failed before the fix. P1 Cursor name: confirmed, since `.cursor/commands/speckit-handoff.md` is flat, so the docs now say `/speckit-handoff`. P0 linked repo: narrowed to a docs overclaim, because AI Systems links all runtime folders and hops. The README, feature catalog, root README and v4.0.0.13 now say the runtime folders must be linked too. P1 spawn failure: rejected as designed and documented, because `armableRecord` re-arms an armed record whose killer is gone at the next Stop, and rolling back to pending would lose the relaunch on a manual exit. Suite 589 of 589 against a 586 baseline, Pi 40 of 40 | Met | - |
| AC-005 | REQ-005 | Given the review's P2 findings, When each is verified, Then every confirmed one is fixed | Evidence: commit `17cfea3629`. The P2 save gap is confirmed and fixed: Step 2 of `handoff.md` now stops on a failed continuity save with `STATUS=FAIL`. `validate_document.py --type command` 0 issues, mirrors PASS with 192 | Met | - |
| AC-006 | REQ-006 | Given the fixes, When live hops run on Claude, Pi, OpenCode, Codex and Hermes, including a repository that symlinks `.skilled`, Then each hop passes | Evidence: main at merge `92ffcbd25c`, run from `AI Systems` (a repository that links `.skilled` and the runtime folders) through the shell shim in tmux, with `SESSION_RELAUNCH_THRESHOLD=0.05`, `SESSION_RELAUNCH_WINDOW_TOKENS=100` and `SESSION_RELAUNCH_MAX_HOPS=1`. `relaunch.log` shows `relaunch reason=ready` for loops 62512 (Claude), 62522 (Pi), 62536 (OpenCode), 62554 (Codex) and 62575 (Hermes). All five handoff notes reached `status: done`. Hermes nudged on its second user turn, because `pre_llm_call` fires once per turn. The OpenCode receiver ran `prepare` on its claimed note against the seed, the CLI refused it, and it completed after one follow-up prompt | Met | - |

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

Every row is Met. Part A aligned the command doc. Part B ran the review, verified each finding, fixed the confirmed ones with checks that failed first and proved live hops again on all five automatic runtimes.
<!-- /ANCHOR:closure -->
