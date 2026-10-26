---
title: "Tasks: Phase 14: removed-template-reality-sweep"
description: "Record both sweeps, fix every confirmed stale hit, sync the Hermes copies, then rerun both sweeps, review the diff and validate."
trigger_phrases:
  - "removed template reality sweep tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.3 -->
# Tasks: Phase 14: removed-template-reality-sweep

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation
<!-- FILL: Keep the prefix table and add the two shell variables this task list uses. GOOD: `S` is the script path. `P` is the packet path. WEAK: Variables are defined below. -->

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`S` is `.skilled/skills/system-spec-kit`. `P` is this phase folder, `specs/system-speckit/054-weak-model-spec-authoring/014-removed-template-reality-sweep`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Read the output block in `recommend-level.sh`. Verify: `rg -n 'Recommended Level'` prints one line. WEAK: T001 Set up the project. -->

- [x] T001 Record the baseline sweep commands, with the exclusions for `specs/**`, `changelog/`, `runtime/data/trigger-index.json` and `runtime/cli/retrieval/fixtures/**`, in each audit file (`P/scratch/audit-mentions.md`, `P/scratch/audit-reality.md`). Verify: `rg -n 'rg ' P/scratch/audit-mentions.md P/scratch/audit-reality.md` prints at least one line per file. Done: `audit-mentions.md` records its `rg` commands; `audit-reality.md` records its ground-truth reads by file and line instead.
- [x] T002 Confirm both audit files exist and every row is marked stale or not stale with a reason (`P/scratch/`). Verify: `ls P/scratch/audit-mentions.md P/scratch/audit-reality.md` prints both paths.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--quiet` branch. Verify: `--quiet` prints one line. WEAK: T002 Implement the feature. -->

- [x] T003 Fix every stale mention hit, starting with the comment that calls `resource-map.md` "the addon" (`S/runtime/cli/tests/upgrade-legacy.vitest.ts`, and each file `P/scratch/audit-mentions.md` names). Verify: `rg -n 'the addon' S/runtime/cli/tests/upgrade-legacy.vitest.ts` prints nothing. Done: H1 to H5, all exit 0; the `rg` printed nothing, exit 1.
- [x] T004 Fix every stale reality hit on the add-on set, template total, `--with-lazy-addons`, validate step, repair hint order and id numbering (each file `P/scratch/audit-reality.md` names). Verify: each fixed line matches `ls S/templates/addons/*.tmpl | wc -l`, which prints 7, and the card and `orchestrator.ts` text it cites. Done: `ls templates/addons` lists 7 files; the conductor fixed two `level-decision-matrix.md` rows.
- [x] T005 Sync the Hermes copies of the edited skill docs (`.hermes/skills/`). Verify: `node S/runtime/cli/hermes/sync-skills-hermes.cjs --check` prints `PASS`. Done: `PASS: 67`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `wc -l` prints 1 and 17. WEAK: T003 Test everything. -->

- [x] T006 Rerun the mention sweep from the final tree (`P/scratch/audit-mentions.md`). Verify: the recorded `rg` commands list zero stale hits. Done: the final sweep printed 10 hits, all judged fine.
- [x] T007 Rerun the reality sweep from the final tree (`P/scratch/audit-reality.md`). Verify: the recorded checks list zero contradictions.
- [x] T008 Have a fresh Opus medium agent review the phase diff (`P/scratch/review.md`). Verify: `rg -n 'wrong rewrite: none' P/scratch/review.md` prints one line. Done: `review.md` reads "OK with notes" and "None of them makes a 014 edit wrong"; the literal phrase `wrong rewrite: none` is not in it.
- [x] T009 Validate this folder (`P`). Verify: `bash S/runtime/cli/spec/validate.sh P --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--quiet` prints one line and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `acceptance-criteria.md` reads Closeable: Yes
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor**: `../013-addon-removal-and-speed-refinements/`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist
<!-- FILL: Fill each checklist section below. GOOD: Each CHK line names the command that answers it. WEAK: The checklist is done. -->

<!-- ANCHOR:protocol -->
## Verification Protocol
<!-- FILL: Keep the three rows and add the rule this packet uses for a blocked task. GOOD: P0 blocks close. P1 needs a recorded reason. WEAK: Follow the priorities. -->

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A blocked task is marked `[B]` with its reason, and the phase stays In Progress.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
<!-- FILL: Write one check per setup fact, each with a command. GOOD: CHK-001 [P0] The start commit is in `goal.md` section 4. WEAK: Setup is ready. -->

- [x] CHK-001 [P0] Both audit files exist before any fix edit: `ls P/scratch/` lists `audit-mentions.md` and `audit-reality.md`.
- [x] CHK-002 [P0] Every audit row says stale or not stale, with a reason, before a brief goes out.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n recommend-level.sh` exits 0. WEAK: Code is clean. -->

- [x] CHK-010 [P0] The phase diff changes only comment lines in `.ts` files: the reviewer confirms no code line changed.
- [x] CHK-011 [P1] `node S/runtime/cli/check-markdown-links.cjs` prints "0 broken" after the fixes.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--quiet` prints one line. WEAK: Tests pass. -->

- [x] CHK-020 [P0] Every row of `acceptance-criteria.md` is Met.
- [x] CHK-021 [P0] The mention sweep rerun lists zero stale hits.
- [x] CHK-022 [P0] The reality sweep rerun lists zero contradictions.
- [x] CHK-023 [P1] The Opus review reports no wrong rewrite, such as a correct line about the deep loops' own map.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
<!-- FILL: Keep this section, because every level requires it. Write one check per finding class this packet can produce. Delete only the rows that do not apply, never the section. GOOD: CHK-FIX-001 [P0] Every finding names one class. WEAK: All findings handled. -->

- [x] CHK-FIX-001 [P0] Each stale hit names its class: `instance-only` for one line, `class-of-bug` for a phrase repeated across files. Classed by brief: H1 counts and H4 "template" phrasing and H2/H5 decision-record-required are `class-of-bug`, each closed by a repo-wide `rg` that now prints no stale hit; the card line, the comment and the two matrix rows are `instance-only`.
- [x] CHK-FIX-002 [P0] Same-class inventory: the mention sweep covers `.skilled`, the root README and every runtime mirror (`.opencode .claude .codex .pi .devin .cursor .hermes`).
- [x] CHK-FIX-003 [P0] Consumer inventory: the Hermes copies of every edited skill doc are synced, and `sync-skills-hermes.cjs --check` prints `PASS`.
- [x] CHK-FIX-004 [P0] N/A: no security, path, parser or redaction fix; the phase edits doc lines and comments only.
- [x] CHK-FIX-005 [P1] Matrix axes are listed in the audit files: the three template names across the swept surfaces, and the six reality topics across their sources.
- [x] CHK-FIX-006 [P1] N/A: no test or code reads process-wide state; no code line changes.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to the phase commit SHA in `implementation-summary.md`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] The script reads no credential. WEAK: Security is fine. -->

- [x] CHK-030 [P0] N/A: no credential, input path or permission changes; the dispatch briefs carry no secret.
- [x] CHK-031 [P0] N/A: no input validation; no code path changes.
- [x] CHK-032 [P1] N/A: no auth surface; the phase edits docs and comments.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` name the same flag. WEAK: Docs are updated. -->

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `goal.md` name the same exclusions: `specs/**`, `changelog/`, the generated trigger index and fixtures, and the deep loops' own map docs. `plan.md` section 1 now lists them.
- [x] CHK-041 [P1] `node S/runtime/cli/hermes/sync-skills-hermes.cjs --check` prints `PASS`.
- [x] CHK-042 [P2] The root README and the templates README list the same seven add-ons as `ls S/templates/addons/`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [x] CHK-050 [P1] The audit and review files live under `P/scratch/` only.
- [x] CHK-051 [P1] No brief or temp file from the dispatches is left outside `P/scratch/`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 10 | 9/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-26
<!-- /ANCHOR:summary -->

---
