---
title: "Acceptance Criteria: Phase 1: goal-inventory-and-mode-contract"
description: "These criteria decide whether phase 001 has produced a complete, evidence-backed goal inventory and mode contract."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract"
    last_updated_at: "2026-09-25T20:15:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Closed all seven criteria with evidence"
    next_safe_action: "Execute phase 002"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-001-goal-inventory-and-mode-contract"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 1: goal-inventory-and-mode-contract

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract`
**Level:** 2
**Status:** Complete
**Date:** 2026-09-25
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 (T002, T003, T009) | Given the non-archive `goal.md` paths are enumerated, When the census and CLI loop finish, Then the report has one successful `goal.cjs packet` result for each path. | Observed 2026-09-25: `find` printed 296 and the scan summary shows `exitZero: 296`; per-goal rows in `scratch/goal-corpus-scan.json:5`, summarized in `goal-corpus-audit.md:16` | Met | - |
| AC-002 | REQ-002 (T004) | Given each goal's measured slices, When the audit classifies the corpus, Then it records counts for placeholders, over-budget parents, missing phase bindings, criterion counts outside three to seven, and criteria requiring another file to judge. | Observed: `goal-corpus-audit.md:24` through `goal-corpus-audit.md:229` (4 over budget, 17 with placeholders, 36 criterion counts out of range, 39 range/glob/prose binding tables, 12 packets with goalless children, 2 parents without binding); §12 lists other-file criteria as human review | Met | - |
| AC-003 | REQ-003 (T004, T009) | Given every defect example named in the source audit, When its reproduction command runs, Then the audit records the command, output, and exit status for each example. | Observed: `goal-corpus-audit.md:286` reproduces 4 of 4 examples from `scratch/wave1-goal-system-audit.md:41-44`, each with command, output lines and exit status; `create.sh` evidence is cited from source and this packet's log rather than run | Met | - |
| AC-004 | REQ-004 (T005, T006) | Given the goal template, hooks, validator, and host handoff, When ownership is recorded, Then system-spec-kit, goal hooks, host session-goal setting, and `sk-create-goal` each have a stated responsibility and cited source. | Observed: `mode-boundary.md:18` names system-spec-kit, the goal hooks, the host goal command and `sk-create-goal`, each with a cited source; `goal-anatomy.md:29` through `goal-anatomy.md:71` | Met | - |
| AC-005 | REQ-005 (T007) | Given a request to write a packet file or set a session objective, When the decision tests classify it, Then each request has a distinct owner and route. | Observed: `decision-tests.md:19` through `decision-tests.md:46`, each test with one passing and one redirected request | Met | - |
| AC-006 | REQ-006 (T006) | Given validator gaps and parent decision D4, When the ownership boundary is finalized, Then `mode-boundary.md` records one checker-versus-amendment decision and its rationale. | Observed: `mode-boundary.md:59` verdict: ship a mode-local checker and record a separate system-spec-kit validator amendment request | Met | - |
| AC-007 | REQ-007 (T008) | Given the nested-packet anatomy audit, When the mode tree is documented, Then `target-tree.md` names each included path and omission with an evidence-backed reason. | Observed: `target-tree.md:19` through `target-tree.md:78` name each path with its creating phase, and the omissions (no goal template, no packet-local root metadata) with cited reasons | Met | - |

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

All seven criteria are `Met` with observed evidence. The inventory, the defect reproductions, the ownership decision and the target tree exist in this folder, and strict validation of this phase passed.
<!-- /ANCHOR:closure -->
