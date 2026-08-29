---
title: "Feature Specification: Kebab-Case Source Rename"
description: "A manifest-driven kebab-case rename of the plugin's 253 src/ and tools/ files, executed by script rather than by hand, closing the scan-naming gate the phase 008 scanner opened."
trigger_phrases:
  - "obsidian kebab case rename"
  - "manifest driven filename rename plugin"
  - "phase 010 kebab rename"
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
    answered_questions:
      - "Whether the import-specifier and repo-relative-path rewrite passes catch every stale reference: no — a bare filename string passed to `resolve(__dirname, \"...\")` is neither, and vitest caught the gap live (2026-08-28)"
      - "Whether the screenshot nondeterminism this phase surfaced should be fixed here: no, it is recorded as a finding for the harness, not fixed in this phase (2026-08-28)"
---
# Feature Specification: Kebab-Case Source Rename

> Phase chain: parent [`../spec.md`](../spec.md), predecessor `009-banners-and-folder-docs`
> (built the folder docs and stylesheet sections this phase's rename does not disturb),
> successor `011-changelog-and-verification`.

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-28 |
| **Branch** | `worktrees/001-sk-code-obsidian-surface` |
| **Wave** | 1 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Phase 008 built `scan-naming.mjs`, which measured the plugin tree at 235 of 248 scanned files
failing the lowercase-kebab filename grammar: PascalCase and camelCase basenames throughout
`src/` and `tools/`, a leading-underscore file, and inconsistent compound-suffix casing on test
files. No scanner enforced anything, so the violation count only grew with each new file.

### Purpose

Rename every non-conforming file to lowercase-kebab by manifest rather than by hand, rewrite every
import specifier and repo-relative path reference the manifest touches, and prove the tree still
builds, type-checks, tests, and renders identically, so `scan-naming.mjs` exits 0 against a rename
that changed no behavior.

### Explicitly Not In This Phase

Fixing the screenshot-harness date nondeterminism this phase's own verification surfaced (see
Risks) is out of scope. The finding is recorded for the harness owner; freezing a clock inside the
capture/verify pipeline is a separate change with its own review.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Building a rename manifest from every non-conforming basename under `src/` and `tools/`, splitting
  PascalCase and camelCase on case boundaries, handling acronym runs (`CsvMarkdownZipExport` ->
  `csv-markdown-zip-export`, `UniqueIdStamp` -> `unique-id-stamp`), preserving compound test suffixes
  as kebab words (`Aggregate.test.ts` -> `aggregate.test.ts`), dropping a leading underscore
  (`_shared.mjs` -> `shared.mjs`), and handling ad hoc cases such as `textLinkScheme` ->
  `text-link-scheme`.
- Executing the manifest with `git mv`, so file history is preserved across the rename.
- Rewriting every relative import specifier and every repo-relative path reference (the `sources`
  arrays in `tools/screenshots/scenarios/`) that the manifest's old names touch.
- Finding and fixing the reference class neither rewrite pass covers: a bare filename string passed
  to `resolve(__dirname, "...")` with no path prefix, which vitest caught live.
- Recapturing the screenshots the rename invalidates and re-verifying the full gate suite.

### Out of Scope

- Any change to a source file's logic, behavior, or exported surface. Every touched line is a
  filename, an import path, or a `resolve()` argument.
- Fixing the screenshot-harness date nondeterminism this phase's verification exposed.
- The `MODULE:` banner and folder-doc work; that landed in `009-banners-and-folder-docs` and this
  phase's rename does not reopen it.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| 235 files across `src/**`, `tools/**` | Rename (`git mv`) | Every non-conforming basename renamed per the manifest; full list is the git rename log, not reproduced here |
| 189 files (subset of the above) | Edit | Relative import specifiers rewritten to the new basenames |
| Files under `tools/screenshots/scenarios/` | Edit | 56 repo-relative `sources` path references rewritten |
| `src/views/accessibility-defects.test.ts` and 5 sibling-referencing files | Edit | 10 bare-filename `resolve(__dirname, "...")` references, across 6 renamed target files, rewritten after vitest caught them |
| `screenshots/manifest.json`, `screenshots/views/*.png`, `screenshots/README.md` | Recapture | Re-fingerprinted and recaptured after the rename; 13 PNGs plus the manifest and README currently differ from HEAD |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Replace scaffold | This leaf's spec-kit record |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every file under `src/`/`tools/` is lowercase-kebab | `node tools/naming/scan-naming.mjs` reports `253` files scanned and exits `0`. Confirmed 2026-08-28 (was 235 violations before this phase). |
| REQ-002 | The rename preserves file history and introduces zero collisions | All 235 renames executed via `git mv`; 0 failures, 0 basename collisions in the manifest. |
| REQ-003 | Every import specifier the rename touches still resolves | 189 files had relative import specifiers rewritten from the manifest; `npx tsc --noEmit` exits `0`. |
| REQ-004 | Every repo-relative path reference the rename touches still resolves | 56 `sources` entries in `tools/screenshots/scenarios/` rewritten; `npm run screenshots:verify` runs without a missing-source error. |
| REQ-005 | Bare-filename string references are found, not just import specifiers and relative paths | `vitest` caught 5 failing files on the first full run; the 10 bare `resolve(__dirname, "...")` references across 6 renamed target files, concentrated in `accessibility-defects.test.ts`, were rewritten; `npx vitest run` then reports `386` passed. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | The full baseline gate suite is green from the final state | `npx tsc --noEmit` `0`, `npm run build` `0`, `npx vitest run` `386` passed across `49` files, `npm run screenshots:verify` `180` current, `npm run lint` `115` problems (`100` errors, `15` warnings) unchanged from baseline. All confirmed live 2026-08-28. |
| REQ-007 | The rename's visual effect is proven, not assumed | The rename itself changes no rendered pixel; recapture was required only because `verify.mjs` hashes source *paths*, not because any view rendered differently. |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `scan-naming.mjs` exits `0` where it reported 235 violations before this phase.
- **SC-002**: `npx tsc --noEmit`, `npm run build`, and `npx vitest run` all pass from the renamed tree with 0 errors and 386 tests passing.
- **SC-003**: `npm run screenshots:verify` reports 180 entries current after recapture.
- **SC-004**: `npm run lint` reports the same 115 problems (100 errors, 15 warnings) as the pre-rename baseline — the rename neither fixes nor introduces a lint finding.
- **SC-005**: `spec.md`, `plan.md`, `tasks.md`, and `implementation-summary.md` carry no scaffold placeholder text.

### Acceptance Scenarios

- **Scenario 1**: **Given** 235 of 253 files under `src/`/`tools/` fail the kebab-case grammar, **when** the manifest-driven rename runs via `git mv`, **then** `scan-naming.mjs` scans 253 files and exits 0 with 0 collisions and 0 failures.
- **Scenario 2**: **Given** a manifest that rewrites relative import specifiers and repo-relative `sources` paths, **when** the first full gate run executes, **then** `tsc` and `build` both exit 0 but `vitest` reports 5 failed / 381 passed — the oracle catching a real gap the rewrite passes did not cover.
- **Scenario 3**: **Given** the 5 failures trace to `resolve(__dirname, "TableRecordPeek.ts")`-style bare filename strings, which are neither an import specifier nor a repo-relative path, **when** the 10 such references across 6 renamed target files are rewritten, **then** `vitest` reports 386 passed and the gate is clean because a real class of reference was fixed, not because the failing tests were skipped.
- **Scenario 4**: **Given** `styles.css` and view logic render `today` from 31 fixture references, **when** two consecutive `npm run screenshots` captures run with zero source change, **then** 6 of 180 captures still differ in pixels between the two runs — proof the rename caused no visual change, but also proof that this repository's "look at the changed PNGs" review discipline cannot currently separate a real regression from date noise.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | An import or path rewrite pass misses a reference class | A silent runtime or test break the type checker cannot see | Ran the full gate suite, not just `tsc`; vitest caught exactly this on the first run (5 failures) and the fix was verified by rerunning to 386 passed |
| Finding (not fixed here) | Screenshot capture is not deterministic: two consecutive runs with zero source change produced different pixels in 6 of 180 captures, concentrated in calendar/timeline/list views that render `today` from fixture data | A reviewer cannot tell a real visual regression from date noise by looking at which PNGs changed, weakening the repo's own screenshot-diff review discipline | Recorded here as a harness finding; recommend freezing a clock in the capture/verify pipeline. Not fixed in this phase — freezing time is a behavior change to the harness, not to the plugin |
| Risk | `git mv` history loss or basename collision across 235 renames | A broken `git blame` trail or two files clobbering one path | Every rename ran through `git mv` (not delete+create), and the manifest builder checked for collisions before executing; 0 failures, 0 collisions |
| Dependency | `008-scanners-and-gates/scan-naming.mjs` | The gate this phase must turn green | Already built and committed; run live here (253 scanned, exit 0), not assumed |
| Dependency | `tools/screenshots/scenarios/*` `sources` arrays and `screenshots/manifest.json` | Both reference plugin source paths by string and by hash; a rename invalidates both until rewritten/recaptured | 56 `sources` entries rewritten; manifest recaptured; `screenshots:verify` reports 180 current |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:edge-cases -->
## 7. EDGE CASES

### Manifest Transform Boundaries

- **Acronym runs don't split letter-by-letter**: `CsvMarkdownZipExport` -> `csv-markdown-zip-export`
  and `UniqueIdStamp` -> `unique-id-stamp` keep each recognizable word intact rather than emitting
  `c-s-v-markdown...`.
- **Compound test suffixes stay as kebab words, not nested extensions**: `Aggregate.test.ts` ->
  `aggregate.test.ts`, not `aggregate-test.ts`; the `.test.` separator is preserved.
- **A leading underscore is dropped, not kebabbed**: `_shared.mjs` -> `shared.mjs`.
- **Ad hoc camelCase with no clean acronym boundary still resolves correctly**: `textLinkScheme` ->
  `text-link-scheme`.

### The Reference Class the Rewrite Passes Missed

- **A bare filename string is neither an import specifier nor a repo-relative path.**
  `resolve(__dirname, "TableRecordPeek.ts")` in `accessibility-defects.test.ts` reads a sibling
  source file's text for a static-analysis assertion; it is a plain string literal, not a module
  specifier, so the import-rewrite pass skipped it, and it has no `/` in it, so the repo-relative
  rewrite pass skipped it too. This is the oracle finding that distinguishes "clean build and
  passing tests" from "the diff looks right": the first full run had `tsc 0`, `build 0`, and
  `vitest 5 FAILED / 381 passed` — a type checker cannot see a runtime `readFileSync` on a
  now-missing path, only the test suite that actually executes it can.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | 235 renames, 189 import rewrites, 56 path rewrites, plus a second pass for the reference class the first two missed |
| Risk | 10/25 | A missed reference class is a real runtime break; closed by running the full gate suite rather than trusting `tsc` alone |
| Research | 9/20 | Required reading: the phase-002 audit, `scan-naming.mjs`'s grammar, every `sources` array under `tools/screenshots/scenarios/`, and the failing test output |
| **Total** | **33/70** | **Level 2** |

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS

All resolved for this phase:
- **Whether the two rewrite passes (import specifiers, repo-relative paths) catch every stale
  reference**: no — proven by vitest's 5 failures on the first full run, closed by finding and
  rewriting the 10 bare-filename references the passes structurally cannot see.
- **Whether the screenshot nondeterminism this phase's verification surfaced should be fixed here**:
  no, recorded as a harness finding for a separate change.

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Parent Spec**: [`../spec.md`](../spec.md)
- **Predecessor**: [`../009-banners-and-folder-docs/spec.md`](../009-banners-and-folder-docs/spec.md)
- **Scanner Gate**: `../../../tools/naming/scan-naming.mjs`
- **Reference-Class Finding**: `../../../src/views/accessibility-defects.test.ts`
- **Verify Gate**: `../../../tools/screenshots/verify.mjs`, `../../../screenshots/manifest.json`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Implementation Summary**: See `implementation-summary.md`

<!-- /ANCHOR:related-docs -->

