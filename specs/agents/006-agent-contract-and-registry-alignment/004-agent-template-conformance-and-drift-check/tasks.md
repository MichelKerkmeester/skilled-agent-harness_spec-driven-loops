---
title: "Tasks: Phase 4: agent-template-conformance-and-drift-check"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "agent template conformance and drift check tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 4: agent-template-conformance-and-drift-check

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

**Variables**: `A` is `.skilled/agents`. `T` is `.skilled/skills/sk-doc/sk-create-agent/assets/agent-template.md`. `S` is `.skilled/bin/sync-agent-roster.cjs`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Save the Measured Behavior commands and their output (`scratch/baseline.txt`). Verify: `rg -c '10' scratch/baseline.txt` prints 1 or more.
- [x] T002 List the template's required sections in order, and whether `0b` applies to every agent (`scratch/required-sections.md`). Verify: `rg -c 'CAPABILITY SCAN' scratch/required-sections.md` prints 1.
- [x] T003 List every section reference in the agent files and the commands (`scratch/section-refs.md`). Verify: `rg -c '§' scratch/section-refs.md` prints 1 or more.
- [x] T004 Copy each block that will move, with its file and line range (`scratch/move-parity.md`). Verify: `rg -c 'Hook-Injected' scratch/move-parity.md` prints 10 or more.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Add the outline check and read the required list from the template (`.skilled/bin/sync-agent-roster.cjs`). Verify: `node .skilled/bin/sync-agent-roster.cjs --check` exits 1 and names ten agents.
- [x] T006 Add the missing, renamed, out-of-order and excepted cases (`.skilled/bin/sync-agent-roster.vitest.ts`). Verify: `npx vitest run .skilled/bin/sync-agent-roster.vitest.ts` reports every case passed.
- [x] T007 Rename the skills section in the ten files that use the old name (`.skilled/agents/code.md`). Verify: `rg -l -i '^## [0-9]+\. ROUTING SCAN' .skilled/agents` prints no path.
- [x] T008 Move the hook-injected advisor paragraph into its own section in the ten files that lack it (`.skilled/agents/context.md`). Verify: `rg -l '^## [0-9]+\. HOOK-INJECTED CONTEXT ROUTING' .skilled/agents | wc -l` prints 11.
- [x] T009 Add each remaining required section to the agents that lack it (`.skilled/agents/review.md`). Verify: `node .skilled/bin/sync-agent-roster.cjs --check` names only agents whose deviation is deliberate.
- [x] T010 Record each deliberate deviation with a reason (`.skilled/agents/agent-registry.json`). Verify: `node .skilled/bin/sync-agent-roster.cjs --check` exits 0.
- [x] T011 Correct every section reference that renumbering moved (`.skilled/agents/orchestrate.md`). Verify: `rg -c 'resolves$' scratch/section-refs.md` equals the number of references listed in T003.
- [x] T012 Regenerate the runtime copies of every changed agent file by the route `.skilled/bin/agent-mirror-crosswalk.md` names for each tree (`.claude/agents`, `.codex/agents`, `.pi/agents`, `.cursor/agents`, `.devin/agents`, `.dsh/agents`). Verify: `node .skilled/bin/check-agent-mirror-sync.cjs` ends with `all comparable mirrors in sync` and exits 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Compare each moved block with its copy from T004 (`scratch/move-parity.md`). Verify: `rg -c 'identical apart from heading' scratch/move-parity.md` equals the number of blocks listed.
- [x] T014 Rename one required section in a scratch copy and run the check against it (`scratch/after.txt`). Verify: the check exits 1 and prints the section name.
- [x] T015 Recheck every section reference (`scratch/section-refs.md`). Verify: `rg -c -v -e 'resolves$' -e '^#' -e '^$' scratch/section-refs.md` prints no line.
- [x] T016 Time the check (`scratch/after.txt`). Verify: `time node .skilled/bin/sync-agent-roster.cjs --check` reports under 3 seconds real.
- [x] T017 Run strict validation on this phase folder (`spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `rg -l -i '^## [0-9]+\. ROUTING SCAN' .skilled/agents` prints no path and the check exits 0 with the outline check on
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Parent**: See `../spec.md`
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

A `[B]` task blocks close until its blocker is named in this file and the operator has answered it.

A `[B]` task blocks close until its blocker is named in this file and the operator has answered it.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements are in `spec.md` section 4 and each has a row in `acceptance-criteria.md` Evidence: seven REQ rows in `spec.md` section 4 and seven AC rows.
- [x] CHK-002 [P0] The baseline in `spec.md` Measured Behavior was rerun and saved to `scratch/baseline.txt` Evidence: `rg -c '10' scratch/baseline.txt` printed 1.
- [x] CHK-003 [P1] Phase 3's `acceptance-criteria.md` says `Closeable: Yes` Evidence: phase 3 `acceptance-criteria.md` reads `**Closeable:** Yes`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node --check .skilled/bin/sync-agent-roster.cjs` exits 0 Evidence: the command exited 0.
- [x] CHK-011 [P0] `node .skilled/bin/check-agent-mirror-sync.cjs` ends with `all comparable mirrors in sync` and exits 0 Evidence: `check-agent-mirror-sync.cjs --all` printed `11 agent(s) checked — all comparable mirrors in sync — OK` and exited 0.
- [x] CHK-012 [P1] The check reads the required list from the template and holds no copy of it Evidence: `requiredSections()` reads the lines between the two markers in `agent-template.md` at run time, and `rg -n 'CAPABILITY SCAN|ANTI-PATTERNS' .skilled/bin/sync-agent-roster.cjs` printed no line.
- [x] CHK-013 [P1] No changed line names a spec path, a packet number or a task id Evidence: `rg -i -e 'specs/' -e 'REQ-' -e 'T0[0-9][0-9]' -e 'CHK-' -e 'phase [0-9]'` over the added lines of the working diff matched only the two scratch file headers of this packet.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] REQ-001 to REQ-003 hold as `acceptance-criteria.md` states Evidence: see AC-001 to AC-003.
- [x] CHK-021 [P0] Every moved block is identical apart from its heading Evidence: `rg -c 'identical apart from heading' scratch/move-parity.md` printed 11, one per block.
- [x] CHK-022 [P1] REQ-004 to REQ-007 hold as `acceptance-criteria.md` states Evidence: see AC-004 to AC-007.
- [x] CHK-023 [P1] A template whose required list cannot be parsed makes the check exit 2 Evidence: a scratch copy of the template without its END marker printed `cannot read the required sections from` with the path and `missing REQUIRED-SECTIONS:END marker`, and exited 2. The vitest case `exits 2 when the required list cannot be parsed` passed.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

N/A: this phase fixes no reported defect class beyond the rows in the Testing Checklist.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] The check writes nothing: `rg -n 'writeFileSync' .skilled/bin/sync-agent-roster.cjs` shows writes only in the write mode Evidence: one `writeFileSync` call, line 351, inside `writeMode`.
- [x] CHK-031 [P1] No agent gains a permission in this phase Evidence: `git diff 04eecf3d46 -- .skilled/agents` holds no added or removed frontmatter `permission` line. The only hits for the word are the moved advisor paragraph, removed and added with the same text.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` name the same script and registry field Evidence: the three documents name `sync-agent-roster.cjs` and `templateExceptions`.
- [x] CHK-041 [P1] `.skilled/skills/sk-doc/sk-create-agent/SKILL.md` names the check an author runs after editing the template Evidence: `rg -c 'sync-agent-roster.cjs --check' .skilled/skills/sk-doc/sk-create-agent/SKILL.md` printed 1, in creation step 13.
- [x] CHK-042 [P2] `.skilled/bin/README.md` describes the outline check Evidence: `rg -c 'lacks or misorders a section' .skilled/bin/README.md` printed 1.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Baselines, parity tables and removal maps live under `scratch/` only Evidence: `baseline.txt`, `required-sections.md`, `section-refs.md`, `move-parity.md`, `check-before.txt`, `after.txt`, the move script and the briefs all sit under `scratch/`.
- [x] CHK-051 [P1] `git status --short` lists no file outside the paths in `spec.md` Files to Change and this packet Evidence: `git status --short` lists the eleven agent files, the registry, the script, its test, the template, the two files the checklist names, the generated copies and this packet.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|---|---|---|
| P0 Items | 7 | 7/7 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-14
<!-- /ANCHOR:summary -->

---



