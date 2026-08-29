---
title: "Tasks: Kebab-Case Source Rename"
description: "Task breakdown for the manifest-driven rename: enumerating violations, building and executing the manifest, the two rewrite passes, the third-pass discovery vitest forced, and the recapture plus full gate re-run."
trigger_phrases:
  - "obsidian kebab rename tasks"
  - "phase 010 tasks"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/025-sk-code-obsidian-surface/010-kebab-rename"
    last_updated_at: "2026-08-28T23:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Kebab-case source rename"
    next_safe_action: "Changelog + verification (phase 011)"
    blockers: []
    key_files:
      - "../../../tools/naming/scan-naming.mjs"
      - "../../../src/views/accessibility-defects.test.ts"
      - "../../../screenshots/manifest.json"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-code-obsidian-010"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Kebab-Case Source Rename

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [x] T001 Run `scan-naming.mjs --json` for the 235-violation baseline against 248 scanned files
- [x] T002 [P] Enumerate every non-conforming basename under `src/` and `tools/`, classifying PascalCase, camelCase, acronym-run, compound-suffix, and leading-underscore cases
- [x] T003 [P] Read every `sources` array under `tools/screenshots/scenarios/` to identify the 56 repo-relative path string entries the rename touches
- [x] T004 Build the rename manifest (old basename -> new kebab-case basename) and check it for collisions before executing

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Execute all 235 renames via `git mv` from the manifest — 0 failures, 0 collisions
- [x] T011 Rewrite relative import specifiers in the 189 affected files to the manifest's new basenames
- [x] T012 Rewrite the 56 repo-relative `sources` path references in `tools/screenshots/scenarios/`
- [x] T013 Run the full gate suite once (`tsc`, `build`, `vitest`) and diagnose the resulting 5 vitest failures
- [x] T014 Rewrite the 10 bare-filename `resolve(__dirname, "...")` references across 6 renamed target files in `src/views/accessibility-defects.test.ts`
- [x] T015 Recapture screenshots (`npm run screenshots`) and re-fingerprint `screenshots/manifest.json`

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Run `node tools/naming/scan-naming.mjs`: 253 scanned, exit 0
- [x] T021 Run `npx tsc --noEmit`: exit 0
- [x] T022 Run `npm run build`: exit 0
- [x] T023 Run `npx vitest run`: 386 passed across 49 files (was 5 failed / 381 passed before T014)
- [x] T024 Run `npm run screenshots:verify`: 180 entries current
- [x] T025 Run `npm run lint`: 115 problems (100 errors, 15 warnings) — confirmed unchanged from the pre-rename baseline
- [x] T026 Replace this leaf's four scaffolds and grep for residual scaffold placeholder markers and bare Given-scenario stubs

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
- **Deliverables**: 235 renamed files under `src/` and `tools/`, `../../../screenshots/manifest.json`, recaptured PNGs under `../../../screenshots/views/`

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
- [x] CHK-003 [P1] `scan-naming.mjs` grammar and every `sources` array read before building the manifest

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every rename executed via `git mv`, not delete-and-create, preserving file history
- [x] CHK-011 [P0] No spec path, requirement id, task id, or checklist id appears in any renamed file or rewritten reference
- [x] CHK-012 [P1] No source logic, behavior, or exported surface changed; every touched line is a filename, import path, or `resolve()` argument
- [x] CHK-013 [P1] The manifest's case-boundary, acronym-run, compound-suffix, and leading-underscore rules were checked for collisions before execution — 0 found

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] `scan-naming.mjs` run live, exits 0 (was 235 violations)
- [x] CHK-021 [P0] `npx vitest run` run to real exit status both before (5 failed) and after (386 passed) the bare-filename fix — not assumed from the rewrite passes alone
- [x] CHK-022 [P0] `screenshots:verify` reports 180 current after recapture
- [x] CHK-023 [P0] Baseline gates confirmed unchanged: `tsc` 0, `build` 0, `lint` 115 (100 errors, 15 warnings)
- [x] CHK-024 [P1] The screenshot-harness determinism finding (6 of 180 differ across two clean runs with zero source change) is recorded, not silently absorbed into "recapture and move on"

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] All three reference classes are covered: import specifiers (189 files), repo-relative paths (56 references), and bare filename strings (10 references, 6 target files) — the last found only because the oracle (vitest) executed the code, not because it was anticipated
- [x] CHK-FIX-002 [P0] The manifest is the single source of truth for every rename and every rewrite; no rewrite pass derived a new name independently
- [x] CHK-FIX-003 [P1] The screenshot recapture covers every entry the rename's path changes touch, and `verify.mjs` confirms 180/180 current, not a spot sample

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secret, token, or absolute personal path is embedded in the manifest, any renamed file, or any rewritten reference
- [x] CHK-031 [P1] No `src/*.ts` logic or `tools/screenshots/*.mjs` capture/verify behavior was modified; only filenames and path/import strings changed

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks, and implementation-summary carry the real gate counts, not estimates
- [x] CHK-041 [P1] The screenshot-harness nondeterminism is stated plainly as a finding for the harness owner, not fixed in this phase
- [x] CHK-042 [P2] The oracle-catch (vitest finding the bare-filename gap `tsc`/`build` could not see) is documented prominently, since it is the reason this phase's gate is "clean build and passing tests," not "the diff looks right"

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Only files failing the kebab-case grammar were renamed; no conforming file was touched
- [x] CHK-051 [P1] `scratch/` left untouched

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 9 | 9/9 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-08-28

<!-- /ANCHOR:summary -->
