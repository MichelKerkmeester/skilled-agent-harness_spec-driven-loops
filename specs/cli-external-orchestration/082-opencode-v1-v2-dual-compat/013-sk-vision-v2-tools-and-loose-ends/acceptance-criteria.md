---
title: "Acceptance Criteria: Phase 13: sk-vision-v2-tools-and-loose-ends"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "sk vision v2 tools and loose ends acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/013-sk-vision-v2-tools-and-loose-ends"
    last_updated_at: "2026-10-19T17:30:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Met all seven criteria with mutation, suite, live-run and review evidence"
    next_safe_action: "Phase complete. Pushing waits for the operator"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-013-sk-vision-v2-tools-and-loose-ends"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 13: sk-vision-v2-tools-and-loose-ends

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 082-opencode-v1-v2-dual-compat/013-sk-vision-v2-tools-and-loose-ends
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
| AC-001 | REQ-001 | Given `SK_VISION_AUTOINSPECT=1` on a private OpenCode 2.0.32 server, When the tool list is read and a prompt asks for `sk_vision_status`, Then 13 `sk_vision_*` tools are listed and the call returns the runtime status | `scratch/proof/final-on/summary.json`: 13 of 78 tools, `execute` completed with `provider: photon` and `device: mps`, exit 0 | Met | - |
| AC-002 | REQ-002 | Given `SK_VISION_AUTOINSPECT` unset, When the same server starts, Then no `sk_vision_*` tool is listed, and OpenCode 1 still loads the plugin | `scratch/proof/final-off/summary.json`: 0 of 65; `scratch/suites-after/battery-v1.txt` exit 0, 16 of 16 loaded | Met | - |
| AC-003 | REQ-003 | Given a client still provisioning, When `close()` runs, Then no runtime spawns, the step exits even if it ignores SIGTERM, and `ready` settles without an error toast | `client.test.ts`, three tests, in `scratch/suites-after/skvision-test.txt`; they fail on the old and reverted code (`scratch/mutation/old-code.txt`, `round2-revert.txt`, `round3-revert.txt`) | Met | - |
| AC-004 | REQ-004 | Given `ctx.tool.transform` or the prompt hook rejects, When `setup` runs, Then the command and hook keep working, or no tool stays registered | `plugin.test.ts` "keeps the prompt hook and disposes cleanly when tool registration fails" and "leaves no tools registered when the prompt hook fails to register"; both fail on reverted code (`round1-revert.txt`, `round3-revert.txt`) | Met | - |
| AC-005 | REQ-005 | Given a model off the text-only list, or no model from `session.get`, When an image prompt runs on OpenCode 2, Then `evidenceText` gets the grace, not the full wait | Two `plugin.test.ts` and two `attachments.test.ts` grace tests; forcing the full wait fails 4 (`scratch/mutation/grace-mutation.txt`). No live run: decision 6 | Met | - |
| AC-006 | REQ-006 | Given the plugin links point at `vision-runtime/dist/plugin.js`, When the two bundle comments are read, Then they name that file | `hooks/opencode/sk-vision.ts` lines 7 and 8, `scripts/build.ts`; Luna round 4: "The corrected comments are true" | Met | - |
| AC-007 | REQ-007 | Given the baselines in `scratch/suites-before/`, When every suite reruns from the final tree, Then none is below its baseline and the README says what holds | `scratch/suites-after/`: sk-vision 50 to 65, typecheck exit 0, plugins 356 to 356, v2 files 50 to 50, battery exit 0 on both versions | Met | - |

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

All seven criteria are Met. The live private-server runs carried AC-001 and AC-002, and the mutation runs show every new test fails on the old code. The grace path has no live run, because the only model on this machine is on the text-only list. Unit tests and a mutation stand in for it, as decision 6 records.
<!-- /ANCHOR:closure -->
