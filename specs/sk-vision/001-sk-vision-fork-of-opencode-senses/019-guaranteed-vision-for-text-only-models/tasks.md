---
title: "Tasks: Guaranteed vision for text-only models"
description: "Task ledger for the classifier + OpenCode guarantee cut and the Pi/Cursor-Devin follow-on."
trigger_phrases:
  - "sk-vision guaranteed vision tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/019-guaranteed-vision-for-text-only-models"
    last_updated_at: "2026-08-18T11:00:00.000Z"
    last_updated_by: "claude"
    recent_action: "Shipped Pi per-model gate + Cursor/Devin best-effort rules; commit pending."
    next_safe_action: "Commit packet on v4 (and main) once the operator approves."
    blockers: []
    key_files:
      - "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/019-guaranteed-vision-for-text-only-models/tasks.md"
      - ".opencode/skills/sk-vision/vision-runtime/src/model-modality.ts"
      - ".opencode/skills/sk-vision/hooks/pi/sk-vision.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-019-guaranteed-vision"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Guaranteed vision for text-only models

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm OpenCode exposes the active model. Evidence: SDK type `{providerID, modelID}`; chose allowlist + await-fully.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Add the `isTextOnlyModel` classifier + allowlist + env overrides. Evidence: `model-modality.ts`.
- [x] T003 Gate the OpenCode injector to await for text-only; make `graceMs` injectable. Evidence: `attachments.ts` `guaranteed` branch.
- [x] T004 Expand to Pi (per-model gate on `ctx.model`, incl. declared input modality) and Cursor/Devin rules. Evidence: `sk-vision.ts` `guaranteed` gate; `vision-rule.md` (cursor + devin).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Classifier tests pass. Evidence: `model-modality.test.ts` 5/5.
- [x] T006 Guarantee test proves await-vs-race. Evidence: `attachments.test.ts` 2/2.
- [x] T007 Types + full suite + build green. Evidence: `tsc` 0; 16/16; `bun run build` OK.
- [ ] T008 Commit the packet on v4. Evidence: pending.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] OpenCode-cut tasks T001-T003, T005-T007 complete. Evidence: `tasks.md` above.
- [x] Expansion task T004 complete. Evidence: Pi `guaranteed` gate + Cursor/Devin `vision-rule.md`.
- [x] No `[B]` blocked tasks remaining. Evidence: `tasks.md` has no blocked entry.
- [ ] Commit task T008 complete. Evidence: pending the operator's go-ahead.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
