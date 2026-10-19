---
title: "Tasks: Phase 13: sk-vision-v2-tools-and-loose-ends"
description: "Ordered tasks that read OpenCode 2's tool editor from its published types, register sk-vision's tools on it, test the grace path, correct two comments and make close stop provisioning, then prove each change by mutation, suites and a live private server run."
trigger_phrases:
  - "sk vision v2 tools and loose ends tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 13: sk-vision-v2-tools-and-loose-ends

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

- [x] T001 Read OpenCode 2's tool API from the published `@opencode/plugin` 2.0.32 types (orchestrator) Done: `Context.tool.transform(editor => editor.add({ name, input, description, execute }))`, where `input` is a Standard Schema, JSON Schema or effect Schema and `execute` resolves to `{ output?, content?, metadata? }` (decision 1).
- [x] T002 Probe the API live on a private OpenCode 2.0.32 server (`scratch/proof/api-probe/`) (orchestrator) Done: a JSON Schema tool and a zod tool both registered, and `ids` lists `probe_json` and `probe_zod`.
- [x] T003 Capture the suite baselines before any change (`scratch/suites-before/`) (orchestrator) Done: sk-vision 50 pass, typecheck exit 0, plugins 356 pass, v2 files 50 pass, battery exit 0 on both versions, shared service start time recorded.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add `toV2Tools` (`vision-runtime/src/opencode/tools.ts`) (DeepSeek, `scratch/briefs/v2t-01.task`) Done.
- [x] T005 Register the tools in `createSetup` and return them from `createDefaultAutoInspect` (`vision-runtime/src/plugin.ts`) (DeepSeek, `v2t-02.task`) Done.
- [x] T006 Keep a closed client from spawning after provisioning (`vision-runtime/src/runtime/client.ts`) (DeepSeek, `v2t-03.task`) Done.
- [x] T007 [P] Correct the two bundle comments (`hooks/opencode/sk-vision.ts`, `vision-runtime/scripts/build.ts`) (DeepSeek, `v2t-04.task`) Done: the banner keeps its 84-byte width.
- [x] T008 Add the adapter, registration, grace and close tests (`tools.test.ts`, `plugin.test.ts`, `attachments.test.ts`, `client.test.ts`) (DeepSeek, `v2t-05.task`) Done.
- [x] T009 Fix Luna's round 1: fail open on a rejected `transform`, and carry metadata and attachments (`plugin.ts`, `tools.ts`, tests) (DeepSeek, `v2t-06.task`, `v2t-07.task`) Done.
- [x] T010 Fix Luna's round 2: `close()` stops the provisioning child (`client.ts`, `client.test.ts`) (DeepSeek, `v2t-08.task`) Done.
- [x] T011 Fix Luna's round 3: register the tools after the prompt hook, escalate to SIGKILL, and correct the README sentence (`plugin.ts`, `client.ts`, tests, `.opencode/plugins/README.md`) (DeepSeek, `v2t-09.task` to `v2t-11.task`) Done.
- [x] T012 Rebuild the bundle (`vision-runtime/dist/plugin.js`) (orchestrator) Done: 513975 bytes. `hooks/opencode/sk-vision.js` is rebuilt too and stays uncommitted.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Run each new test against the old or reverted code (`scratch/mutation/`) (orchestrator) Done: old code 3 fail, grace mutation 4 fail, round 1 revert 2 fail, round 2 revert 1 fail, round 3 revert 2 fail.
- [x] T014 Rerun every baseline suite from the final tree (`scratch/suites-after/`) (orchestrator) Done: sk-vision 65 pass, typecheck exit 0, plugins 356 pass, v2 files 50 pass, battery exit 0 on both versions.
- [x] T015 Live run on a private OpenCode 2.0.32 server from the final bundle, inspection off then on (`scratch/proof/final-off/`, `scratch/proof/final-on/`) (orchestrator) Done: off lists 0 of 65 tools as `sk_vision_*`, on lists 13 of 78, and `sk_vision_status` returned the runtime status, exit 0.
- [x] T016 Luna review until it passes (`scratch/luna-1.txt` to `scratch/luna-4.txt`) (Luna) Done: rounds 1 to 3 FAIL on P2s, all fixed. Round 4 PASS with four P2s, recorded.
- [x] T017 Reconcile the parent and phases 011 and 012, then run recursive strict validation (orchestrator) Done: see the implementation summary.
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
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: T001 and T002, the 2.0.32 types and the live probe.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks. Evidence: `tsc --noEmit` exit 0 (`scratch/suites-after/skvision-typecheck.txt`).
- [x] CHK-011 [P0] No console errors or warnings. Evidence: a failed registration writes to stderr only under `SK_VISION_DEBUG=1`.
- [x] CHK-012 [P1] Error handling implemented. Evidence: the fail-open and prompt-hook rejection tests.
- [x] CHK-013 [P1] Code follows project patterns. Evidence: Luna round 4, the comment scan found no spec paths or ids.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: acceptance-criteria.md.
- [x] CHK-021 [P0] Manual testing complete. Evidence: T015.
- [x] CHK-022 [P1] Edge cases tested. Evidence: the missing `ctx.tool`, object result and SIGTERM-ignoring step tests.
- [x] CHK-023 [P1] Error scenarios validated. Evidence: the rejected `transform`, rejected prompt hook and failed `session.get` tests.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class. Evidence: the tools gap is `cross-consumer` (one definition set, two hosts). Luna's P2s are `instance-only`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed. Evidence: `skVisionTools` has two consumers, `server` and `createDefaultAutoInspect` (plan.md affected surfaces).
- [x] CHK-FIX-003 [P0] Consumer inventory completed. Evidence: the v2 hard-plugin test, the plugin README and `RuntimeClient`'s callers on both versions.
- [x] CHK-FIX-004 [P0] Path and parser fixes include adversarial cases. Evidence: a host with no `ctx.tool`, a rejecting `transform` and a step that ignores SIGTERM.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed. Evidence: plan.md, six axes.
- [x] CHK-FIX-006 [P1] Hostile env variant executed. Evidence: the live run with `SK_VISION_AUTOINSPECT` unset and set.
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix diff. Evidence: the phase commit.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: the proof scan found no key or password value. The probe redacts the server password.
- [x] CHK-031 [P0] Input validation implemented. Evidence: each tool keeps its OpenCode 1 zod schema as its OpenCode 2 input.
- [x] CHK-032 [P1] Auth/authz working correctly. Evidence: not applicable, the change adds no auth surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. Evidence: this file.
- [x] CHK-041 [P1] Code comments adequate. Evidence: the `createSetup` and `close()` comments, and the two corrected bundle comments.
- [x] CHK-042 [P2] README updated. Evidence: `.opencode/plugins/README.md`, the tools sentence.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. Evidence: probe workspaces live in the session scratchpad.
- [x] CHK-051 [P1] scratch/ cleaned before completion. Evidence: scratch keeps only the cited briefs, suites, mutations, reviews and proof.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-19
<!-- /ANCHOR:summary -->

---
