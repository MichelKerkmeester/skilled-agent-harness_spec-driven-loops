---
title: "Tasks: Phase 3: convert-legacy-skilled"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "convert legacy skilled tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 3: convert-legacy-skilled

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`DOC` is `.skilled/commands/doctor`. `FX` is `DOC/scripts/tests/fixtures/sk-skill-convert`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Add the pre-move `sk-git` source and routed resources plus the expected post-move `ROUTER.md` under `FX`; use that fixture for golden conversion and retain Git history comparison as a separately skippable check. Verify: the fixture test is byte-equal to the expected machine section and the history test checks `ca10a236d2^` when available.
- [x] T002 Confirm phase 002 closed (`DOC/scripts/route-validate.sh`). Verify: `OK: route-validate — 18 routes validated, 3 warnings` (exit 0).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Write the V2 frontmatter transform: four-part `version`, `allowed-tools` as a YAML array when needed, `name` and `description` bytes kept, and existing flow sequences preserved byte-for-byte (`DOC/scripts/lib/sk-skill-convert-transforms.cjs`). Verify: unit assertions cover scalar normalization, flow-sequence preservation, and version planning.
- [x] T004 Write the V3(b) move: trailing section plus every machine block the strict gate flags, anywhere above that section, into `ROUTER.md` under `## 3. MACHINE ROUTER`, link line appended (`DOC/scripts/lib/sk-skill-convert-transforms.cjs`). Verify: the unit case preserves both source blocks and removes them from `SKILL.md`; a converted skill holding a helper fence, a map outside SMART ROUTING, a fenced pointer or an inline-code pointer passes `package_skill.py --check --strict` with no RS-002 or RS-005.
- [x] T005 Write V0 preflight refusals and the `plan` printout naming every overwrite (`DOC/scripts/sk-skill-convert.cjs`). Verify: every refusal has its required code, including a hub declaration containing only `hub-router.json`.
- [x] T006 Write `apply` with backups to `.skilled/skills/.state/doctor-sk-skill/<name>/<timestamp>/`, snapshot only the router parser inputs, and use exclusive creates (`DOC/scripts/sk-skill-convert.cjs`). Verify: the golden case checks the saved `SKILL.md` and parser-input snapshot; pre-write failures remove empty backups.
- [x] T007 Write the `parseRouter` proof with rollback (`DOC/scripts/sk-skill-convert.cjs`). Verify: the forced map-change test restores `SKILL.md` and removes the new router.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run the fixture golden, idempotence, refusal, transform and rollback tests (`DOC/scripts/tests/sk-skill-convert.test.cjs`). Verify: `PYTHON=/usr/bin/python3 node --test .skilled/commands/doctor/scripts/tests/sk-skill-convert.test.cjs` passes 27/27; the history test skips with a reason in a shallow clone.
- [x] T009 Run the strict gate on the converted fixture created by the golden test. Verify: its `package_skill.py --check --strict` assertion observes exit 0, `Result: PASS`, and no RS-002, RS-004 or RS-005.
- [x] T010 Remove test-managed `TMPDIR` changes and use `fs.mkdtempSync(path.join(os.tmpdir(), 'sk-skill-convert-'))` with named-root cleanup. Verify: the test source contains no `SCRATCH_ROOT` or `process.env.TMPDIR` mutation.
- [x] T011 Preserve transform refusal codes and print full usage on `USAGE`; keep input refusal exit 1 and prerequisite failure exit 2. Verify: tests assert the printed code and both exit classes.
- [x] T012 Split `allowed-tools` commas only at parenthesis depth zero and reject unbalanced parentheses. Verify: `Bash(git log, git show)` remains one item and malformed input reports `ALLOWED_TOOLS_AMBIGUOUS`.
- [x] T013 Give each refusal a distinct code, keep the reserved-path check before reading, and route persona/collision checks through `inspectCollisions`. Verify: tests cover dual declaration, both hub files independently, nested packets, reserved/persona prefixes, name collision, long description and non-kebab name, plus the six preflight codes `NOT_DIRECT_CHILD`, `SKILL_UNREADABLE`, `DESCRIPTION_MISSING`, `NO_MACHINE_ROUTER`, `ROUTER_EXISTS` and `INPUT_KIND_UNSUPPORTED`.
- [x] T014 Keep V2 active when `ROUTER.md` already declares the router; remove trailing divider residue and list retained template TODOs and stale SKILL wording as plan follow-ups. Verify: targeted plan/apply and golden-output assertions pass.
- [x] T015 Run the converter tests in a shallow clone and confirm the fixture is ignored by Hermes and advisor discovery. Verify: shallow history test skips with a reason, Hermes `--check` passes, and advisor discovery remains scoped to `.skilled/skills`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] Golden test passes and a second `apply` writes nothing
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Design**: See `../scratch/design.md` section 2.2 steps V0, V2, V3(b) and section 4 R1 to R3, R8
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

A blocked task is marked `[B]` with the blocking cause on the same line.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: REQ-001 through REQ-007 and AC-001 through AC-007.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: plan architecture and rollback sections.
- [x] CHK-003 [P1] Golden fixture pair in place. Evidence: `FX/source/sk-git` and `FX/expected/ROUTER.md` hold the pre-move source/resources and post-move expected router; the test copies them into an OS temp root.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node --check` exits 0 on the converter, transforms and test script. Evidence: all three syntax checks passed.
- [x] CHK-011 [P0] Transforms read and write no file. Evidence: the library has no filesystem access; its unit case uses an inline template string.
- [x] CHK-012 [P1] Every failure after a write restores from backup; pre-write failures remove a new empty backup. Evidence: parser mismatch rolls back `SKILL.md` and `ROUTER.md`; `ROUTER_CONTENT_CHANGED` and failed exclusive create remove the unwritten backup.
- [x] CHK-013 [P1] `--apply` gate matches `sk-code-quality-config.cjs`. Evidence: plan and `apply` without `--apply` leave fixture bytes unchanged.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: AC-001 through AC-015 are `Met` with test evidence.
- [x] CHK-021 [P0] Golden machine section byte-equal. Evidence: the converted machine section equals `FX/expected/ROUTER.md`; the moved source section body is preserved as its suffix.
- [x] CHK-022 [P1] Second `apply` is a no-op. Evidence: fixture tree hash is unchanged on the second run.
- [x] CHK-023 [P1] Each V0 refusal tested with its own code. Evidence: dual, mode-registry-only, hub-router-only, nested, reserved-prefix, persona-prefix, name-collision, long-description and non-kebab cases refuse without writes, and the six preflight refusals each report a distinct code.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

All reported review defects are addressed. Evidence: T010–T015 and CHK-012, CHK-023, CHK-050–CHK-052 cover temp isolation, fixture-based history handling, error codes, parser-input snapshots, refusals, frontmatter-only conversion and nested-packet discovery.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: code review of the three changed scripts found none.
- [x] CHK-031 [P0] Name-or-path argument resolved inside the repository; no write outside the skill folder and `.state/`. Evidence: the converter requires a direct child of `.skilled/skills`; backups and snapshots stay under `.state/`.
- [x] CHK-032 [P1] Reserved-prefix names refused before any read of their contents. Evidence: the test instruments `readFileSync` and observes zero reads for the reserved path.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. Evidence: scope, dynamic golden setup, implementation and checks match across the phase docs.
- [x] CHK-041 [P1] Comments state why each refusal exists, not a ticket id. Evidence: converter comments explain the safety reason for each refusal and contain no packet identifiers.
- [x] CHK-042 [P2] Script README entry deferred to phase 007. Evidence: this phase's scope excludes the README entry.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Test temp roots use `os.tmpdir()` without changing `TMPDIR`. Evidence: each root uses `fs.mkdtempSync(path.join(os.tmpdir(), 'sk-skill-convert-'))` and is removed by its registered cleanup.
- [x] CHK-051 [P1] Tests do not create `.scratch-dc90` or `075-003`. Evidence: test code has no reference to either path; scoped filesystem inspection found no test-created directories there.
- [x] CHK-052 [P1] The history comparison skips cleanly without its parent commit and fixture files stay outside skill discovery. Evidence: shallow-clone test reports the explicit missing-history skip; Hermes sync and advisor discovery checks pass.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-30
<!-- /ANCHOR:summary -->

---
