---
title: "Acceptance Criteria: Phase 14: handover-docs-promotion"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "handover docs promotion acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/hooks/023-session-relaunch-loop/014-handover-docs-promotion"
    last_updated_at: "2026-10-20T12:30:00Z"
    last_updated_by: "worker"
    recent_action: "Met all six criteria with file and line evidence"
    next_safe_action: "Commit worktree 165 and merge it to main"
    blockers: []
    key_files:
      - "README.md"
      - ".skilled/skills/system-spec-kit/README.md"
      - ".skilled/commands/speckit/handoff.md"
      - ".skilled/commands/README.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 14: handover-docs-promotion

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** specs/hooks/023-session-relaunch-loop/014-handover-docs-promotion
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
| AC-001 | REQ-001 | Given a reader opening the root README, When they read the summary and Quick Start, Then they find the feature in plain words and a setup section with the `source` line, the automatic runtimes, the `/speckit:handoff` runtimes, the symlinked-repository note and a link to the session-relaunch README | Evidence: `README.md:22` (summary bullet), `:49` to `:56` (Endless Sessions), `:249` to `:267` (Turn On Endless Sessions: `source` line at `:254`, symlink at `:257`, runtimes at `:259`, link at `:267`), `:1695` (related documents) | Met | - |
| AC-002 | REQ-002 | Given each fact the new text states, When it is read against the session-relaunch README and phase 013's evidence, Then the threshold, kill switch, Hermes switch, outside-loop rule and timeout notice match | Evidence: `README.md:261` to `:265` against `.skilled/hooks/session-relaunch/README.md:90` (Hermes switch and config line), `:112` (no nudge outside the loop), `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:98` (`SYSTEM_SESSION_RELAUNCH_DISABLED`) and `:108` (`SESSION_RELAUNCH_THRESHOLD`, `0.80`). The stalled-hop line matches the killer-timeout notice in `.skilled/hooks/session-relaunch/README.md`, section 3 | Met | - |
| AC-003 | REQ-003 | Given the files under `.skilled/commands/`, When the root README command library is read, Then it lists `/speckit:handoff` and its counts match the files | Evidence: `README.md:1166` to `:1170` (entry), `:90` and `:1108` (40 entry points, 37 in 6 groups plus 3 root). `find .skilled/commands -name '*.md' -not -name README.md` without `assets` lists 40 files: create 13, deep 3, design 3, doctor 10, prompt 1, speckit 7, root 3 | Met | - |
| AC-004 | REQ-004 | Given every markdown surface that names the feature or describes starting a session, When they are grepped and read, Then each mentions or links it and none says the wrapper must be started by hand or that a handoff is manual by default | Evidence: `.skilled/commands/speckit/handoff.md:15` (shim sentence), `.skilled/skills/system-spec-kit/README.md:72` (automatic runtimes), `.skilled/commands/README.txt:49`, `:122`, `README.md:1091` (Hermes note), `:1100` (hook core list), `:1629` to `:1635` (FAQ). The hooks README, `bin/` README, env reference, catalog entry and three playbooks already state the shim and the outside-loop rule, so they stay unchanged | Met | - |
| AC-005 | REQ-005 | Given a doc where the relaunch handoff note and a packet's `handover.md` both appear, When it is read, Then it says which is which | Evidence: `README.md:265`, `.skilled/skills/system-spec-kit/README.md:72`, `.skilled/commands/speckit/handoff.md:15` | Met | - |
| AC-006 | REQ-006 | Given the touched docs, When the validators run, Then `validate_document.py` passes, HVR and README-audit findings on touched files equal their baselines and the mirror check passes | Evidence: run on the touched lines at `README.md:249`, `.skilled/skills/system-spec-kit/README.md:72` and `.skilled/commands/speckit/handoff.md:15`. `validate_document.py` rc 0 on `README.md`, `.skilled/skills/system-spec-kit/README.md` and `.skilled/commands/speckit/handoff.md`. `hvr_scan.py`: root README 85/100 before and after, 0 hard blockers. system-spec-kit README 62/100 before and after, its 6 hard blockers all in lines this phase did not touch. `handoff.md` 100/100. `audit_readmes.py` rc 0, broken references 116 after the fix, matching the pre-edit count, and no new finding on a touched file. `sync-runtime-mirrors.cjs --check` rc 0, 192 mirrors in sync | Met | - |

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

All six criteria are Met. The root README now introduces the in-session handover in plain words and gives the one-line setup, the command library lists `/speckit:handoff`, and the other surfaces link the setup and keep the handoff note apart from `handover.md`. Surfaces that already described the shim were left unchanged.
<!-- /ANCHOR:closure -->
