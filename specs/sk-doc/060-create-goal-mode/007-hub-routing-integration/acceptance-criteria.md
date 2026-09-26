---
title: "Acceptance Criteria: Phase 7: hub-routing-integration"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/060-create-goal-mode/007-hub-routing-integration"
    last_updated_at: "2026-09-26T12:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Closed every criterion with evidence during phase 009 reconciliation"
    next_safe_action: "None; phase closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "not-recorded"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Authoring-only aliases that route through both stages: settled by replay, 0 of 6 session-goal probes captured"
      - "Stage-two leaves: the mode's six real reference and asset files"
      - "Alias source: the packet's Keyword triggers line covers seven of the fourteen aliases; the rest live in the hub registry"
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 7: hub-routing-integration

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/060-create-goal-mode/007-hub-routing-integration
**Level:** 2
**Status:** Complete
**Date:** 2026-09-26
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the sk-doc registry, when the mode is registered, then exactly one row has `workflowMode: sk-create-goal`, `packetKind: workflow`, `backendKind: template-scaffold`, packet and skill name `sk-create-goal`, `grandfatheredFolderMismatch: false`, `/create:goal`, the matching tool surface and metadata routing. | `python3 -m json.tool .skilled/skills/sk-doc/mode-registry.json`; read back the `sk-create-goal` row (T004). Observed 2026-09-26: one `sk-create-goal` row with every named field and `routingClass: metadata` (`.skilled/skills/sk-doc/mode-registry.json:567`). | Met | - |
| AC-002 | REQ-002 | Given the registry mode list, when the explicit sk-doc parent-skill check runs, then the goal mode has a router signal, vocabulary class and tie-break entry in the required permutation. | `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-doc` (T005, T009). Observed: `OK: parent-skill-check — all hard invariants passed, 0 warnings`; the signal and vocabulary class sit at `.skilled/skills/sk-doc/hub-router.json:178`. | Met | - |
| AC-003 | REQ-003 | Given the completed mode packet's real leaves, when a positive request passes through compiled routing, then the hub router selects `sk-create-goal` and every mapped leaf resolves through the generated inventory. | `node .skilled/bin/compiled-route.cjs --hub sk-doc --prompt "Write the goal document for this spec packet and make its completion checks testable."`; `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --check .skilled/skills/sk-doc` (T006, T008, T009). Observed: `action: route`, targets `[sk-create-goal]`; manifest `--check` OK, with the mode leaves at `.skilled/skills/sk-doc/leaf-manifest.json:109`. | Met | - |
| AC-004 | REQ-004 | Given the hub's discovery metadata, when the mode is added, then `graph-metadata.json`, `description.json` and the `SKILL.md` mode table/count advertise the workflow as fifteen modes across fourteen packets, and the manifest is regenerated. | JSON parse and exact read-back of the three hub metadata files; `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --check .skilled/skills/sk-doc` (T007-T009). Observed: all three files parse and read back fifteen modes across fourteen packets (`.skilled/skills/sk-doc/SKILL.md:15`); manifest `--check` OK. | Met | - |
| AC-005 | REQ-005 | Given a positive authoring request and the six session-goal/host-command probes, when both routing stages are replayed, then the positive request selects sk-doc and sk-create-goal while the six probes produce zero sk-create-goal targets. | Advisor and compiled-route commands for the positive prompt and each negative prompt (T010, T011). Observed: "Write a goal.md for this spec packet." goes `sk-doc@0.9474` -> route `[sk-create-goal]`; 0 of 6 probes reach the mode (`specs/sk-doc/060-create-goal-mode/007-hub-routing-integration/scratch/routing-replay-final.txt:3`). | Met | - |
| AC-006 | REQ-006 | Given the fixed ten newcomer prompts, when the same corpus is replayed before and after integration, then the results contain ten before rows and ten after rows with observed target counts from zero to ten. | Ten-prompt before/after replay record in `implementation-summary.md` (T003, T010). Observed: 0 of 10 before (`specs/sk-doc/060-create-goal-mode/007-hub-routing-integration/scratch/routing-before.md:36`) and 10 of 10 after at the hub, 9 of 10 at the advisor (`specs/sk-doc/060-create-goal-mode/007-hub-routing-integration/scratch/routing-after.md:13`). | Met | - |
| AC-007 | REQ-007 | Given the final planning documents, when strict validation runs on this phase folder, then it prints `RESULT: PASSED` with no non-generated metadata failures. | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/060-create-goal-mode/007-hub-routing-integration --strict` (T012). Observed: `RESULT: PASSED`, 0 errors and 0 warnings, on 2026-09-26. | Met | - |
| AC-008 | REQ-008 | Given the registered mode, When compiled routing is republished, Then every hub reports `compiled-serving`, the sk-doc canary gate passes with a `sk-create-goal` case, and no lock or rollback directory remains | T013; `compiled-route-status.cjs --all`, the canary gate output and a listing of the runtime root Observed: all seven hubs `compiled-serving`; canary 22 of 22 with `single-create-goal`; finalize removed the rollback and no lock remains (`specs/sk-doc/060-create-goal-mode/007-hub-routing-integration/scratch/publication-notes.md:86`). | Met | - |

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

All eight criteria are `Met` with observed evidence. The hub routes the ten newcomer prompts to `sk-create-goal`, none of the six session-goal probes reach it, and the compiled route was republished with the canary case in both trees.
<!-- /ANCHOR:closure -->
