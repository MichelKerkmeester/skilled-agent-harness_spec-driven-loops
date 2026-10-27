---
title: "Tasks: Phase 25: deprecate-nested-changelogs"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "deprecate nested changelogs tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 25: deprecate-nested-changelogs

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

`K` is `.skilled/skills/system-spec-kit`, `C` is `.skilled/skills/sk-doc/sk-create-changelog`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the CLI suite baseline. Verify: `npx vitest run --config vitest.config.ts --project cli` from `$K` prints its pass and fail counts into `scratch/`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 [P] Drop the packet-changelog step from the closing workflows (`.skilled/commands/speckit/assets/speckit-{implement,complete}.yaml`, both `-presentation.txt`). Verify: `rg -n "nested-changelog|nested changelog" .skilled/commands/speckit/assets/` prints nothing.
- [x] T003 [P] Drop the changelog line from the phase context (`$K/runtime/cli/spec/create.sh`). Verify: a throwaway `create.sh --phase` child has no `**Changelog**:` line.
- [x] T004 [P] Make the create-changelog workflows global-only and refuse `--nested` (`.skilled/commands/create/changelog.md`, `assets/create-changelog-{auto,confirm}.yaml`, `create-changelog-presentation.txt`). Verify: `rg -n "nested-changelog.js" .skilled/commands/create/` prints nothing.
- [x] T005 [P] Print a deprecation notice from the generator and pin it in a test (`$K/runtime/cli/spec-folder/nested-changelog.ts`, `$K/runtime/cli/tests/nested-changelog.vitest.ts`). Verify: the vitest file passes, and fails with the notice removed.
- [x] T006 [P] Mark nested mode deprecated in sk-create-changelog and the sk-doc hub (`$C/**`, `sk-doc/{SKILL.md,hub-router.json,mode-registry.json,command-metadata.json}`, `sk-create-frontmatter/assets/frontmatter-templates.md`). Verify: no doc there tells a reader to write a packet changelog.
- [x] T007 [P] Mark packet changelogs deprecated in system-spec-kit docs (`$K/SKILL.md`, `README.md`, `references/**`, `templates/README.md`, `templates/changelog/README.md`, `templates/CONTRACT.md`, the feature catalog and playbook entries, `runtime/cli/spec-folder/README.md`). Verify: the same `rg` sweep.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Sweep for live instructions. Verify: `rg -n -i "nested-changelog|nested changelog|packet-local changelog"` over `.skilled/commands` and the two skills, with fixtures, reports and versioned changelogs excluded, shows only deprecation wording.
- [x] T009 Rebuild the CLI and rerun the suite. Verify: no new failure against T001.
- [x] T010 Check the existing packet changelogs. Verify: `find specs -path "*/changelog/changelog-*.md" -not -path "*/z_archive/*" | wc -l` still prints 64 and `git diff --stat` touches none.
- [x] T011 Validate the packet. Verify: `validate.sh --strict --recursive` on packet 054 prints `RESULT: PASSED` for every folder.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Every row of `acceptance-criteria.md` is Met
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

- [x] CHK-001 [P0] Requirements documented in spec.md: REQ-001 to REQ-006.
- [x] CHK-002 [P0] Technical approach defined in plan.md: four lanes, then a sweep.
- [x] CHK-003 [P1] Dependencies identified: the CLI build, rebuilt before the suite reruns.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The CLI `npm run typecheck` and `npm run build` exit 0.
- [x] CHK-011 [P1] `bash -n` passes on `create.sh`.
- [x] CHK-012 [P1] Comments carry the reason and no packet, phase or finding id.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met.
- [x] CHK-021 [P1] The throwaway phase scaffold is removed after the check.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets: the diff adds none.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Every doc that names the generator calls it deprecated and points at `/create:changelog`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files stayed in the session scratchpad or this phase's `scratch/`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 5 | 5/5 |
| P1 Items | 6 | 6/6 |

**Verification Date**: 2026-10-27
<!-- /ANCHOR:summary -->
