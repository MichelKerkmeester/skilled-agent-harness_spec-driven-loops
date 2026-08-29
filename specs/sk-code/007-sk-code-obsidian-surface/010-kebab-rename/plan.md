---
title: "Implementation Plan: Kebab-Case Source Rename"
description: "Execution plan for the manifest-driven kebab-case rename of 235 plugin files: build the manifest, execute via git mv, rewrite two reference classes by pass, find and fix the third class the passes miss, then recapture and verify the full gate suite."
trigger_phrases:
  - "obsidian kebab rename plan"
  - "manifest driven rename execution plan"
  - "phase 010 plan"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/007-sk-code-obsidian-surface/010-kebab-rename"
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
# Implementation Plan: Kebab-Case Source Rename

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript/ESM source under `src/` and `tools/`, executed by a throwaway Node ESM manifest builder and rename runner |
| **Framework** | None. The rename follows `scan-naming.mjs`'s kebab-case grammar; no build-tool config changes |
| **Storage** | Files on disk, renamed via `git mv`; `screenshots/manifest.json` recaptured |
| **Testing** | The full gate suite: `scan-naming`, `tsc`, `build`, `vitest`, `screenshots:verify`, `lint` |

### Overview
A manifest built from every non-conforming basename under `src/` and `tools/`: PascalCase and
camelCase split on case boundaries with acronym-run handling, compound test suffixes preserved as
kebab words, one leading underscore dropped. 235 files renamed via `git mv` — 0 failures, 0
collisions — then two rewrite passes: relative import specifiers (189 files) and repo-relative
`sources` path references in `tools/screenshots/scenarios/` (56 references). The first full gate
run was clean on `tsc` and `build` but vitest failed 5 of 386 tests, tracing to a third reference
class neither pass covers: a bare filename string handed to `resolve(__dirname, "...")` with no
path prefix. Ten such references across six renamed target files, all inside
`accessibility-defects.test.ts`, were rewritten, and vitest returned 386 passed. Screenshots were
recaptured and the full gate suite re-run to its final state.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] `scan-naming.mjs` read as the authority on the kebab-case grammar and run for the 235-violation baseline.
- [x] Every non-conforming basename under `src/`/`tools/` enumerated before building the manifest.
- [x] Every `tools/screenshots/scenarios/*` `sources` array read to confirm which entries are repo-relative path strings.

### Definition of Done
- [x] `node tools/naming/scan-naming.mjs` scans 253 files and exits 0.
- [x] All 235 renames executed via `git mv`; 0 failures, 0 collisions.
- [x] 189 files had import specifiers rewritten; 56 repo-relative `sources` references rewritten.
- [x] The bare-filename reference class vitest caught (10 references, 6 target files) found and rewritten.
- [x] `tsc` 0, `build` 0, `vitest` 386/49, `screenshots:verify` 180 (post-recapture), `lint` 115 (100 errors, 15 warnings, unchanged).
- [x] `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` replaced with real content.
- [x] No source logic, behavior, or exported surface changed — every touched line is a filename, import path, or `resolve()` argument.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Manifest-first, mechanical execution. A single manifest maps every old basename to its new
kebab-case name; every subsequent step (rename, import rewrite, path rewrite) reads from that one
manifest rather than re-deriving names, so the three passes cannot disagree with each other.

### Key Components
- **Manifest builder**: walks `src/` and `tools/`, tests each basename against the kebab-case
  grammar, and for each failure applies the case-boundary split with acronym-run handling
  (`CsvMarkdownZipExport` -> `csv-markdown-zip-export`), the compound-suffix rule
  (`Aggregate.test.ts` -> `aggregate.test.ts`), and the leading-underscore drop
  (`_shared.mjs` -> `shared.mjs`). Checks for collisions before any file moves.
- **Rename runner**: executes the manifest via `git mv` old-path new-path, one call per entry, so
  git records each as a rename rather than a delete plus create.
- **Import-specifier rewrite pass**: for each of the 189 affected files, rewrites every relative
  `import`/`from` specifier whose resolved target is a manifest key to the manifest's new value.
- **Repo-relative path rewrite pass**: for each `sources` array under `tools/screenshots/scenarios/`,
  rewrites the 56 string entries that are old basenames to their new kebab-case form.
- **Third-pass discovery**: the first full gate run (`tsc` 0, `build` 0, `vitest` 5 failed / 381
  passed) located a reference class neither prior pass covers — a bare filename string with no `/`
  passed to `resolve(__dirname, "...")` inside `accessibility-defects.test.ts` — and the 10
  occurrences across 6 renamed target files were rewritten by the same manifest lookup.
- **Recapture**: `npm run screenshots` re-renders and re-fingerprints every entry the rename's path
  changes touch, then `npm run screenshots:verify` confirms all 180 current.

### Data Flow
`scan-naming baseline (235)` -> build manifest -> `git mv` x235 -> rewrite imports (189) -> rewrite
`sources` paths (56) -> full gate run (`tsc`/`build` 0, `vitest` 5 failed) -> locate + rewrite bare
references (10 across 6 files) -> full gate run (`vitest` 386 passed) -> recapture -> `screenshots:verify` (180) -> `scan-naming` (0).

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`; it owns the Setup, Implementation, and Verification phase
state. In brief: enumerate violations and build the manifest, execute the rename and both rewrite
passes, run the full gate suite once to discover the bare-filename gap, fix it, recapture, then
run every gate to its final state.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Naming gate | Every scanned file's basename against the kebab-case grammar | `node tools/naming/scan-naming.mjs` (exit 0, 253 scanned) |
| Type check | Every import specifier the rename touched still resolves | `npx tsc --noEmit` (exit 0) |
| Build | The bundled output still compiles from the renamed tree | `npm run build` (exit 0) |
| Runtime/oracle | Every reference class, including ones a type checker cannot see | `npx vitest run` — caught the bare-filename gap live (5 failed on first run, 386 passed after the fix) |
| Pixel gate | Every screenshot still resolves and renders after the rename | `npm run screenshots` (recapture) then `npm run screenshots:verify` (180 current) |
| Lint baseline | The rename introduces or fixes no lint finding | `npm run lint` (115 problems, 100 errors, 15 warnings — unchanged) |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `008-scanners-and-gates/scan-naming.mjs` | Internal (predecessor) | Green — run live, exits 0 after the rename lands | Without it there is no gate to prove the rename complete |
| `tools/screenshots/scenarios/*` `sources` arrays | Internal | Green — 56 references rewritten | A stale `sources` path would make the capture harness fail to find its source file |
| `screenshots/manifest.json` + `tools/screenshots/verify.mjs` | Internal | Green — recaptured, 180 current | Verify hashes source *paths*; a rename with no recapture would flip every entry stale |
| `vitest` runtime suite | Internal | Green — the oracle that caught the bare-filename gap | Without a runtime test pass, the missed reference class would have shipped as a silent break |
| Node.js runtime (`node:fs`, `git mv`) | Runtime | Green — stable built-ins and git CLI only | The manifest builder, rename runner, and both rewrite passes all depend on it |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a renamed file's import graph fails to resolve, a test the runtime oracle did not
  catch breaks in a later session, or the recapture proves a real (not date-noise) visual
  regression.
- **Procedure**: every rename ran through `git mv`, so `git diff` and `git log --follow` on any
  renamed path shows the full history; a full revert is `git checkout` on the renamed and rewritten
  paths plus `screenshots/manifest.json` and the touched PNGs. Because the rename is filename-only,
  a targeted fix (correcting one manifest entry and its one caller) is cheaper than a full revert in
  the common case. No data migration is involved.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (violations + manifest) ──► Implementation (rename + 3 rewrite passes) ──► Verification (recapture + all gates)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 008 `scan-naming.mjs` | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Phase 011 (changelog and verification) |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | One scanner run, one basename enumeration, one manifest build |
| Implementation | Med-High | 235 `git mv` calls, 189-file import rewrite, 56-reference path rewrite, plus a second discovery-and-fix pass for the bare-filename class |
| Verification | Med | Six gate commands plus a screenshot recapture |
| **Total** | | **Single-session** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Every rename ran through `git mv`, preserving history.
- [x] The manifest builder checked for basename collisions before any file moved.
- [x] Every gate was run to its real exit status, not assumed from the source.

### Rollback Procedure
1. For an import or path regression: `git checkout` the specific renamed/rewritten files.
2. For a screenshot regression: `git checkout screenshots/manifest.json screenshots/views/*.png` and recapture.
3. Re-run the full gate suite to confirm the baseline is restored.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A — this phase renames files and rewrites references; no runtime data changes.

<!-- /ANCHOR:enhanced-rollback -->
