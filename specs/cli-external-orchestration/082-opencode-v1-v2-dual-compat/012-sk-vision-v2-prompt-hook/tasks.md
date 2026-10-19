---
title: "Tasks: Phase 12: sk-vision-v2-prompt-hook"
description: "Ordered tasks that read the OpenCode 2 prompt hook from its published types, port sk-vision's automatic image check onto it, and prove it with unit tests and a live private server run."
trigger_phrases:
  - "sk vision v2 prompt hook tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 12: sk-vision-v2-prompt-hook

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] T001 Read the OpenCode 2.0.32 prompt hook and session shapes from the published `@opencode/plugin`, `@opencode/schema` and `@opencode/client` 2.0.32 packages, unpacked into the session scratchpad (orchestrator) Done: `SessionPrompt` has a mutable `prompt` with `text` and `files[{ uri, name }]`, and `session.get({ sessionID })` returns an optional `model { id, providerID }` (decision 1).
- [x] T002 Capture the suite baselines before any change (`scratch/suites-before.txt`) (orchestrator) Done: sk-vision 46 pass, typecheck exit 0, plugins 356 pass, v2 files 39 pass.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Extract `AttachmentInjector.evidenceText` from `handle` (`vision-runtime/src/opencode/attachments.ts`) (DeepSeek) Done: `handle` calls it and pushes the same part.
- [x] T004 Run automatic inspection in the OpenCode 2 prompt hook, behind `SK_VISION_AUTOINSPECT=1` (`vision-runtime/src/plugin.ts`) (DeepSeek) Done: template path first, then image and PDF files, the session model and the appended evidence.
- [x] T005 Add four tests for the new path (`vision-runtime/src/plugin.test.ts`) (DeepSeek) Done: text-only model, non-image file, template precedence, rejection.
- [x] T006 Fix Luna's two code P2s: the `bmp` mime and the hook-registration assertion (`plugin.ts`, `plugin.test.ts`) (DeepSeek) Done.
- [x] T007 Rebuild the bundle (`vision-runtime/dist/plugin.js`) (orchestrator) Done: build exit 0, 511520 bytes. `hooks/opencode/sk-vision.js` is rebuilt too and stays uncommitted.
- [x] T008 [P] Update the OpenCode 2 gap in the docs (`.opencode/plugins/README.md`, `.skilled/hooks/injection-contract.md`) (orchestrator) Done: both validate.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Rerun every baseline suite from the final tree (`scratch/suites-final.txt`) (orchestrator) Done: sk-vision 50 pass, typecheck exit 0, plugins 356 pass, v2 files 39 pass.
- [x] T010 Live run on a private OpenCode 2.0.32 server, automatic inspection off then on, and again on from the final bundle (`scratch/proof/`) (orchestrator) Done: off has no evidence, on stores Scene, Caption, OCR and Atlas blocks, both exit 0.
- [x] T011 The doctor battery on both versions (`scratch/battery-v1.txt`, `scratch/battery-v2.txt`) (orchestrator) Done: exit 0 on each.
- [x] T012 Luna review until it passes (`scratch/luna-1.txt`, `scratch/luna-2.txt`) (Luna) Done: round 1 PASS with three P2s, round 2 on the fixes.
- [x] T013 Reconcile the parent and phase 011 records, then run recursive strict validation (orchestrator) Done: see the implementation summary.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the live private-server run
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: spec.md section 4.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: plan.md section 3.
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: T001, the 2.0.32 types.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks. Evidence: `tsc --noEmit` exit 0 (`scratch/suites-final/sk-vision-typecheck.txt`).
- [x] CHK-011 [P0] No console errors or warnings. Evidence: the hook writes to stderr only under `SK_VISION_DEBUG=1`, as before.
- [x] CHK-012 [P1] Error handling implemented. Evidence: the rejection test and the fail-open catch.
- [x] CHK-013 [P1] Code follows project patterns. Evidence: Luna round 1, no comment-hygiene finding.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: acceptance-criteria.md.
- [x] CHK-021 [P0] Manual testing complete. Evidence: T010.
- [x] CHK-022 [P1] Edge cases tested. Evidence: the non-image file, template precedence and rejection tests.
- [x] CHK-023 [P1] Error scenarios validated. Evidence: the rejection test, and a failed `session.get` falls back to the grace.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class. Evidence: the gap is `cross-consumer` (one producer, two hosts). Luna's P2s are `instance-only`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed. Evidence: `AttachmentInjector` has one producer, `handle`, and no other caller (plan.md affected surfaces).
- [x] CHK-FIX-003 [P0] Consumer inventory completed. Evidence: the v2 hard-plugin test, the two docs, and the Pi and Devin adapters, which do not use the injector.
- [x] CHK-FIX-004 [P0] Path and parser fixes include adversarial cases. Evidence: a non-image `file://` uri is skipped, and a malformed one fails open through the catch.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed. Evidence: plan.md, five axes.
- [x] CHK-FIX-006 [P1] Hostile env variant executed. Evidence: the live run with `SK_VISION_AUTOINSPECT` unset and set.
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix diff. Evidence: the phase commit.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: the proof scan found no key or password value.
- [x] CHK-031 [P0] Input validation implemented. Evidence: the mime filter on prompt files.
- [x] CHK-032 [P1] Auth/authz working correctly. Evidence: not applicable, the hook adds no auth surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. Evidence: this file.
- [x] CHK-041 [P1] Code comments adequate. Evidence: the `createSetup` and `evidenceText` doc comments.
- [x] CHK-042 [P2] README updated. Evidence: `.opencode/plugins/README.md` sections 4 and 9.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. Evidence: probe workspaces and downloaded packages live in the session scratchpad.
- [x] CHK-051 [P1] scratch/ cleaned before completion. Evidence: scratch keeps only the cited suites, batteries, reviews and proof. The temp images the probes wrote were deleted.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-19
<!-- /ANCHOR:summary -->

---
