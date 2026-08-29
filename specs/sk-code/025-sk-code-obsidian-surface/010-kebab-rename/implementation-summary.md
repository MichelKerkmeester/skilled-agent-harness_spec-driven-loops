---
title: "Implementation Summary: Kebab-Case Source Rename"
description: "What landed: a manifest-driven rename of 235 files to lowercase-kebab, two rewrite passes plus a third the oracle forced, and a screenshot-harness determinism finding recorded rather than fixed."
trigger_phrases:
  - "implementation summary kebab rename"
  - "manifest driven rename oracle catch"
  - "scan-naming green obsidian plugin"
importance_tier: "important"
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
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-code-obsidian-010"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 010-kebab-rename |
| **Completed** | 2026-08-28 |
| **Level** | 2 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

Before this phase, `scan-naming.mjs` reported 235 of 248 scanned files failing the lowercase-kebab
filename grammar: the plugin tree was PascalCase-dominant with no scanner enforcing anything. This
phase renamed all 235 by manifest, not by hand — a script built the old-basename-to-new-kebab-name
map, split PascalCase and camelCase on case boundaries with acronym-run handling
(`CsvMarkdownZipExport` -> `csv-markdown-zip-export`, `UniqueIdStamp` -> `unique-id-stamp`), kept
compound test suffixes as kebab words (`Aggregate.test.ts` -> `aggregate.test.ts`), dropped one
leading underscore (`_shared.mjs` -> `shared.mjs`), and handled ad hoc cases
(`textLinkScheme` -> `text-link-scheme`) — then executed every rename via `git mv`: 0 failures, 0
collisions.

### The Two Rewrite Passes

189 files had relative import specifiers rewritten to the new basenames. 56 repo-relative path
references — the `sources` arrays in `tools/screenshots/scenarios/` — were rewritten the same way.
Both passes read from the same manifest, so neither could disagree with the other.

### The Oracle Catch

The first full gate run after both rewrite passes was `tsc` 0, `build` 0, but `vitest` 5 FAILED /
381 passed. The cause: `src/views/accessibility-defects.test.ts` reads sibling source files by bare
filename string — `resolve(__dirname, "TableRecordPeek.ts")` — which is neither an import specifier
nor a repo-relative path, so both rewrite passes skipped it. Ten such references, pointing at six
renamed target files (`table-record-peek.ts`, `record-detail-panel.ts`, `board-renderer.ts`,
`gallery-renderer.ts`, `list-renderer.ts`, `toolbar-renderer.ts`), were rewritten, and vitest then
returned 386 passed. This is the reason the phase's gate is "clean build and passing tests," not
"the diff looks right": a type checker cannot see a runtime `readFileSync` against a now-missing
path — only a test suite that actually executes it can.

### The Screenshot-Harness Finding

`styles.css` is a fingerprinted source for all 180 screenshot manifest entries, and `verify.mjs`
hashes source *paths*, so the rename flipped every entry stale regardless of pixel content.
Recapturing was required, and at verification time 12 PNGs differed from HEAD; as of this writing
`git status` shows 13 PNGs plus `manifest.json` and `screenshots/README.md` modified — one more
than the count taken mid-phase, which is itself an instance of the same finding. To separate "the
rename changed a render" from "the harness is not deterministic," two consecutive `npm run
screenshots` runs were executed with zero source change: 6 of 180 captures still differed in
pixels between the two clean runs, all in calendar, timeline, and list views, which render `today`
from 31 fixture references. The rename therefore caused no visual change at all — but this also
means the repository's own "look at the changed PNGs" review discipline cannot currently
distinguish a real regression from date noise while `screenshots:verify` passes either way. That is
recorded here as a finding for the harness owner (recommend freezing a clock in the capture/verify
pipeline); it is not fixed in this phase.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| 235 files across `src/**`, `tools/**` | Rename (`git mv`) | Kebab-case filename grammar |
| 189 files | Edit | Relative import specifiers rewritten |
| `tools/screenshots/scenarios/**` | Edit | 56 repo-relative `sources` path references rewritten |
| `src/views/accessibility-defects.test.ts` | Edit | 10 bare-filename `resolve(__dirname, ...)` references, across 6 renamed target files, rewritten |
| `screenshots/manifest.json`, `screenshots/views/*.png`, `screenshots/README.md` | Recapture | Re-fingerprinted after the rename; 13 PNGs plus manifest and README currently differ from HEAD |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Replace scaffold | This leaf's spec-kit record |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Verification ran to real exit status, not from reading the source. `scan-naming.mjs` moved from
235 violations (of 248 scanned) to a clean exit 0 (253 scanned, all lowercase-kebab). `npx tsc
--noEmit` and `npm run build` both exited 0 throughout. `npx vitest run` is the load-bearing check
in this phase: it failed 5 of 386 on the first full run after the two rewrite passes, and returned
386 passed across 49 files only after the bare-filename reference class was found and rewritten.
`npm run screenshots:verify` reports 180 entries current after recapture. `npm run lint` reports
115 problems (100 errors, 15 warnings) — confirmed identical to the pre-rename baseline, so the
rename neither fixed nor introduced a lint finding.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Build one manifest and drive every pass (rename, import rewrite, path rewrite) from it | So the three passes cannot disagree with each other or invent a different name for the same file |
| Execute renames via `git mv`, never delete-and-create | Preserves `git log --follow` and `git blame` history across the rename |
| Run the full gate suite, not just `tsc`, before declaring the rewrite passes complete | A type checker cannot see a bare `resolve(__dirname, "...")` string; only vitest, which actually executes the code, caught the 5 failures the two rewrite passes missed |
| Record the screenshot-harness determinism finding rather than fix it in this phase | Freezing a clock inside the capture/verify pipeline is a behavior change to the harness itself, not to the plugin being renamed, and deserves its own review |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node tools/naming/scan-naming.mjs` | PASS — 253 scanned, exit 0 (was 235 violations of 248 scanned) |
| `git mv` execution | PASS — 235 renames, 0 failures, 0 collisions |
| `npx tsc --noEmit` | PASS — exit 0 |
| `npm run build` | PASS — exit 0 |
| `npx vitest run` (first run, after 2 rewrite passes) | FAIL — 5 failed / 381 passed, tracing to bare-filename references |
| `npx vitest run` (after the bare-filename fix) | PASS — 386 passed across 49 files |
| `npm run screenshots:verify` | PASS — 180 entries current, post-recapture |
| Two-consecutive-capture determinism probe | FINDING — 6 of 180 differ with zero source change between runs |
| `npm run lint` | PASS — 115 problems (100 errors, 15 warnings), baseline unchanged |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The screenshot capture harness is not deterministic.** Two consecutive `npm run screenshots`
   runs with zero source change produced different pixels in 6 of 180 captures, concentrated in
   calendar, timeline, and list views that render `today`. This phase proves the rename itself
   caused no visual change, but the underlying nondeterminism is unresolved and weakens the "diff
   the changed PNGs" review pattern the rest of this packet relies on. Freezing a clock in the
   harness is recommended future work, not part of this phase.
2. **The bare-filename reference class was found reactively, not by static analysis.** The fix for
   `accessibility-defects.test.ts` closes the specific 10 references vitest exposed; no tool was
   built to detect this reference shape (`resolve(__dirname, "<bare-name>")`) proactively, so a
   future rename in this repo would need to rely on the same full-gate-suite discipline to catch it
   again.
3. **13 screenshot-related files remain uncommitted at the time of writing**, one more than the 12
   recorded mid-phase — itself a live instance of the determinism finding above, not a sign of
   incomplete recapture.

<!-- /ANCHOR:limitations -->
