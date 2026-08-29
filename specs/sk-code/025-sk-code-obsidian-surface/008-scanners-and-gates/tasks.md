---
title: "Tasks: Scanners and Gates"
description: "Task breakdown for building the three tools/naming/ scanners and proving each one fails against the current tree, in setup-then-implementation-then-verification order."
trigger_phrases:
  - "obsidian scanners task breakdown"
  - "phase 008 tasks"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/025-sk-code-obsidian-surface/008-scanners-and-gates"
    last_updated_at: "2026-08-28T21:15:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Added three convention scanners"
    next_safe_action: "Apply banners and folder docs"
    blockers: []
    key_files:
      - "../../../tools/naming/scan-naming.mjs"
      - "../../../tools/naming/scan-comments.mjs"
      - "../../../tools/naming/scan-folder-docs.mjs"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-code-obsidian-008"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Scanners and Gates

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

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

- [x] T001 Read `sk-code-mobile-cli/scripts/run-source-gates.sh` for the source-gates runner shape and banner grammar (`$HUB/.opencode/skills/sk-code/sk-code-mobile-cli/scripts/run-source-gates.sh`)
- [x] T002 [P] Read `002-repo-convention-audit/audit.json` for the measured naming/comments/folderDocs baseline (`../002-repo-convention-audit/audit.json`)
- [x] T003 [P] Walk the real `src/`/`tools/` tree with `find` to confirm file and folder counts before writing scanner logic against assumptions
- [x] T004 Confirm the Node runtime available in the worktree supports plain `node:fs`/`node:path`/`node:url` ESM (no new dependency needed)

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Write `scan-naming.mjs`: walk, lowercase-kebab stem regex, `--json` flag, exit `0`/`1`, own `MODULE:` banner and numbered sections (`../../../tools/naming/scan-naming.mjs`)
- [x] T011 Write `scan-comments.mjs`: `MODULE:` banner check, paired box-drawing/numbered-section check, commented-out-code heuristic, `--json` flag, exit `0`/`1`, own banner and sections (`../../../tools/naming/scan-comments.mjs`)
- [x] T012 Write `scan-folder-docs.mjs`: folder tree build, `isSourceBearing`/`owesReadmeAndCode` bottom-up passes, both-direction violation reporting, `--json` flag, exit `0`/`1`, own banner and sections (`../../../tools/naming/scan-folder-docs.mjs`)
- [x] T013 Fix a real false-positive found while running `scan-comments.mjs`: tighten the commented-out-code keyword check to require code punctuation alongside the keyword, so `type icon and its 6px margin...` (`src/views/ColumnWidth.ts:47`) and `return/typeof/else 是语法关键字...` (`src/data/FormulaTokenizer.ts:144,150`) stop false-flagging (`../../../tools/naming/scan-comments.mjs`)

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Run `node tools/naming/scan-naming.mjs --json`: `252` files scanned, `235` violations, exit `1`
- [x] T021 Run `node tools/naming/scan-comments.mjs --json`: `252` files scanned, `249` missing banner, `249` missing paired sections, `0` commented-out-code lines, exit `1`
- [x] T022 Run `node tools/naming/scan-folder-docs.mjs --json`: `10` folders scanned, `9` owe README+CODE, `1` owes README only, `19` total violations, exit `1`
- [x] T023 Unit-check the commented-out-code heuristic against 8 labeled cases (`const x = doThing();`, `return value;`, `if (foo) { bar(); }`, `x.value = compute();` as real code; `type icon and its 6px margin...`, `return/typeof/else are keywords`, `This is a normal sentence.`, `Chrome the header name has to share the cell with:` as prose) — all 8 classify correctly
- [x] T024 Cross-check `scan-folder-docs.mjs`'s live classification of `src/data/__tests__` (5 direct `.test.ts` files, owes both) against `audit.json`'s `folderDocs.owesReadmeOnly` listing of the same folder; disagreement recorded as evidence in `spec.md` §5/§7, `audit.json` left unedited (outside this phase's write boundary)
- [x] T025 Replace this leaf's `spec.md`, `plan.md`, `tasks.md` scaffolds and grep for residual scaffold markers (`REQUIREMENT_PLACEHOLDER`, bare `**Given**`) — none remain
- [x] T026 Confirm no file was written outside `tools/naming/` and `008-scanners-and-gates/`

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
- **Deliverables**: `../../../tools/naming/scan-naming.mjs`, `scan-comments.mjs`, `scan-folder-docs.mjs`

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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies (template runner, audit baseline, real tree) identified and read

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Each scanner passes `node --check` implicitly by running cleanly end-to-end (no syntax errors surfaced across any of the six invocations in T020-T022)
- [x] CHK-011 [P0] No spec path, requirement id, task id, or checklist id appears in any scanner's source comments (durable-WHY prose only, per `AGENTS.md`'s comment rule)
- [x] CHK-012 [P1] Each scanner carries its own `MODULE:` banner and numbered box-drawing sections
- [x] CHK-013 [P1] No new dependency added; `package.json` untouched

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Each scanner run against the live tree and its exit code confirmed non-zero (T020-T022)
- [x] CHK-021 [P0] Each scanner's real violation count recorded in `spec.md` §4, not estimated
- [x] CHK-022 [P1] The commented-out-code heuristic unit-checked against both real and prose-look-alike cases (T023)
- [x] CHK-023 [P1] A real false positive was found and fixed, not just a hypothetical one (T013)

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] The commented-out-code false-positive fix is classed `class-of-bug`, not `instance-only` — the keyword-plus-punctuation requirement applies to every keyword in the list, not just `type` and `return`
- [x] CHK-FIX-002 [P0] Consumer inventory: no other file imports or calls these scanners yet (each is a standalone CLI entry point), so no downstream consumer needed updating
- [x] CHK-FIX-003 [P1] The full six-run verification matrix (3 scanners × plain/`--json`) is listed in T020-T022, not a single spot-check

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secret, token, or absolute personal path is embedded in any scanner
- [x] CHK-031 [P1] Every scanner is read-only against `src/`/`tools/`; none writes, deletes, or renames a scanned file

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized with the real scanner counts
- [x] CHK-041 [P1] No spec paths, requirement ids, or task ids introduced into any scanner's code comments
- [x] CHK-042 [P2] Section-header grammar in each scanner matches `sk-code-mobile-cli`'s numbered upper-case style

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No file created outside `tools/naming/` and `specs/sk-code/025-sk-code-obsidian-surface/008-scanners-and-gates/`
- [x] CHK-051 [P1] `scratch/` left untouched (no temp files used)

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 5 | 5/5 |
| P1 Items | 9 | 9/9 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-08-28

<!-- /ANCHOR:summary -->
