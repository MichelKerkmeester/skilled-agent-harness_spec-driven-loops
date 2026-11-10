---
title: "Tasks: Phase 14: registration-schema-unification"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "registration schema unification"
  - "hook registration drift"
  - "one behavioral contract five schemas"
  - "generated hook registration check"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 14: registration-schema-unification

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

- [x] T001 Read all four registration files in full and enumerate every hook, its per-runtime event bindings, its matcher value where one exists and the script it invokes (`.claude/settings.json`, `.codex/hooks.json`, `.cursor/hooks.json`, `.devin/hooks.v1.json`)
- [x] T002 Read `.pi/extensions/README.md` and list every symlink and the Pi event it binds to, for cross-reference against the same hook set
- [x] T003 [P] Decide the canonical source's format (JSON versus a small TS/CJS module) and its file location under `.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Author the canonical hook-set source from the T001/T002 inventory (new file, path decided in T003)
- [x] T005 Write the Claude template function producing `.claude/settings.json`'s `hooks` key only, leaving `env`, `statusLine` and the file's other keys untouched
- [x] T006 [P] Write the Codex template function producing the whole of `.codex/hooks.json`
- [x] T007 [P] Write the Cursor template function producing the whole of `.cursor/hooks.json`, including its flat unwrapped array shape and absent matcher field
- [x] T008 [P] Write the Devin template function producing the whole of `.devin/hooks.v1.json`, including its un-nested top-level event map and regex-anchored matchers
- [x] T009 Write the Pi verification pass that reads the canonical source's Pi-applicable hooks and checks each against a `.pi/extensions/` directory listing, reporting missing or mismatched symlinks without writing
- [x] T010 Add the `--check` mode to the generator, following `sync-runtime-mirrors.cjs --check`'s reporting convention
- [x] T011 Update `.opencode/skills/system-spec-kit/runtime/hooks/README.md` to document the canonical source and the generate-and-check workflow
- [x] T012 Add the new generator's `--check` call to the `mirrors` job in `.github/workflows/spec-kit-check.yml`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Run the generator against the repository and diff each of the four output files against its pre-change committed content. Every diff must be empty
- [x] T014 Run `node <generator script> --check` and confirm exit 0
- [x] T015 Run the Pi verification pass and confirm zero missing or mismatched symlinks
- [x] T016 Run `node runtime-mirrors/sync-runtime-mirrors.cjs --check` against the regenerated files and confirm it still exits 0
- [x] T017 Run every runtime's own hook adapter test, plus the `directive-lifecycle-adapter-parity` and `completion-evidence` suites, and confirm they pass unchanged
- [x] T018 Update `spec.md`, `plan.md` and this document's own state to reflect what shipped
- [x] T019 Repair `mcp-server/tests/hooks/settings-driven-invocation-parity.vitest.ts`, whose regex still expects the Claude hook command under `mcp-server/dist/hooks/claude/` while the registration files point at `runtime/dist/hooks/claude/`; routed here by 011's ADR-001
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
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

- [x] CHK-001 [P0] Requirements documented in spec.md [EVIDENCE: spec.md section 4 lists REQ-001 through REQ-008]
- [x] CHK-002 [P0] Technical approach defined in plan.md [EVIDENCE: plan.md section 3 names the canonical source, the four template functions and the Pi verification pass]
- [x] CHK-003 [P1] Dependencies identified and available [EVIDENCE: plan.md section 6 names the mirror-generator compatibility and the CI job as the two dependencies]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks [EVIDENCE: the generator script's own lint output, once T004 through T010 land]
- [x] CHK-011 [P0] No console errors or warnings [EVIDENCE: a clean run of `node <generator script> --check` from T014]
- [x] CHK-012 [P1] Error handling implemented [EVIDENCE: the generator fails closed on a malformed canonical source or a missing script path, per NFR-R01, verified by a deliberately broken source]
- [x] CHK-013 [P1] Code follows project patterns [EVIDENCE: side-by-side structural comparison with `sync-runtime-mirrors.cjs`'s and `sync-prompts.cjs`'s generate-plus-check shape]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met [EVIDENCE: acceptance-criteria.md, every AC-ID row Met or Waived with an ADR]
- [x] CHK-021 [P0] Manual testing complete [EVIDENCE: the byte-for-byte diff from T013 and the Pi verification report from T015]
- [x] CHK-022 [P1] Edge cases tested [EVIDENCE: a run against a canonical source naming a script path that does not exist on disk, confirming the generator fails closed]
- [x] CHK-023 [P1] Error scenarios validated [EVIDENCE: a `--check` run against a deliberately hand-edited registration file, confirming drift is reported rather than silently accepted]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. [EVIDENCE: this phase's finding is cross-consumer (one hook set, five consuming registration surfaces) plus a matrix/evidence element (four independent structural axes across the four JSON schemas)]
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. [EVIDENCE: T001's inventory of all four files' hook lists is the producer census. No fifth hand-authored JSON registration exists, confirmed by the Files to Change table in spec.md]
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. [EVIDENCE: spec.md's Files to Change table names every consumer, including `sync-runtime-mirrors.cjs`'s read path and the CI `mirrors` job]
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. [EVIDENCE: not a parser or redaction change. The adversarial equivalent here is the four-runtime structural matrix in spec.md's problem statement, exercised by T005 through T008]
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. [EVIDENCE: the four structural axes (nesting shape, matcher dialect, project-dir variable, fallback-envelope shape) and five runtimes are enumerated in spec.md's problem statement and risks section]
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. [EVIDENCE: not applicable. The generator reads only checked-in files and the canonical source, no environment-dependent behavior]
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. [EVIDENCE: the closing commit SHA, once implementation lands, is recorded in implementation-summary.md]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets [EVIDENCE: the generated files carry only repo-relative script paths and the existing fallback-envelope text, verified by reading the generator's output]
- [x] CHK-031 [P0] Input validation implemented [EVIDENCE: the generator validates every referenced script path exists on disk before writing, per NFR-R01]
- [x] CHK-032 [P1] Auth/authz working correctly [EVIDENCE: not applicable. No authentication or authorization surface exists in this phase]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized [EVIDENCE: this document's task list matches plan.md's phases and spec.md's requirements one for one]
- [x] CHK-041 [P1] Code comments adequate [EVIDENCE: the generator script's header comment names the canonical source, the four per-runtime templates and the byte-for-byte round-trip invariant it must preserve]
- [x] CHK-042 [P2] README updated (if applicable) [EVIDENCE: `.opencode/skills/system-spec-kit/runtime/hooks/README.md` updated per T011]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only [EVIDENCE: `git status` on this packet's folder shows no stray file outside `scratch/`]
- [x] CHK-051 [P1] scratch/ cleaned before completion [EVIDENCE: `ls scratch/` is empty or holds only the `.gitkeep` placeholder at completion]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | [ ]/9 |
| P1 Items | 9 | [ ]/9 |
| P2 Items | 1 | [ ]/1 |

**Verification Date**: 2026-09-07
<!-- /ANCHOR:summary -->

---
