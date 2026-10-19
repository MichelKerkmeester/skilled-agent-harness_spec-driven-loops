---
title: "Acceptance Criteria: Phase 12: sk-vision-v2-prompt-hook"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "sk vision v2 prompt hook acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/012-sk-vision-v2-prompt-hook"
    last_updated_at: "2026-10-19T11:29:13Z"
    last_updated_by: "orchestrator"
    recent_action: "Met all six criteria with suite, live-run and review evidence"
    next_safe_action: "Phase complete. Pushing waits for the operator"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-012-sk-vision-v2-prompt-hook"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 12: sk-vision-v2-prompt-hook

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 082-opencode-v1-v2-dual-compat/012-sk-vision-v2-prompt-hook
**Level:** 2
**Status:** Complete
**Date:** 2026-10-19
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given `SK_VISION_AUTOINSPECT=1` on a private OpenCode 2.0.32 server, When a prompt is sent with an image attached, Then the stored user message carries sk-vision evidence | `scratch/proof/on.summary.json` and `on-final.summary.json`: exit 0, `hasVisionEvidence` true, Scene, Caption, OCR and Atlas blocks (`on-evidence-excerpt.txt`) | Met | - |
| AC-002 | REQ-002 | Given OpenCode 1.19.3, When the doctor battery runs after the change, Then it exits 0 and `handle` still pushes the same part | `scratch/battery-v1.txt` exit 0, 16 of 16 plugins; Luna round 1: "The v1 evidence text remains unchanged" (`scratch/luna-1.txt`) | Met | - |
| AC-003 | REQ-003 | Given `SK_VISION_AUTOINSPECT` unset, When the same prompt is sent, Then no evidence is added and no vision runtime starts | `scratch/proof/off.summary.json`: `hasVisionEvidence` false; `createDefaultAutoInspect` returns null before building a client (Luna round 1) | Met | - |
| AC-004 | REQ-004 | Given a prompt that matches the vision template and carries an image, When the hook runs, Then the command path runs and automatic inspection does not | `plugin.test.ts` "leaves a template prompt to the command path without inspecting", in `scratch/suites-final/sk-vision.txt` | Met | - |
| AC-005 | REQ-005 | Given the analysis rejects, When the hook runs, Then it resolves and the prompt text is unchanged | `plugin.test.ts` "fails open when evidence rejects", in `scratch/suites-final/sk-vision.txt` | Met | - |
| AC-006 | REQ-006 | Given the baselines in `scratch/suites-before.txt`, When every suite reruns from the final tree, Then none is below its baseline and the two docs describe what holds | `scratch/suites-final.txt`: sk-vision 46 to 50, typecheck exit 0, plugins 356 to 356, v2 files 39 to 39; `validate_document.py` on both docs | Met | - |

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

All six criteria are Met. The live private-server run (AC-001, AC-003) and the v1 battery (AC-002) carried the phase. Registering the `sk_vision_*` tools on OpenCode 2 was consciously left out and is recorded as a limitation.
<!-- /ANCHOR:closure -->
