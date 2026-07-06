---
title: "Implementation Summary"
description: "All 11 active findings from the 009 packet's 10-iteration deep review are fixed: 8 P1 defects across the design-md-generator backend, plus 3 P2 advisories."
trigger_phrases:
  - "implementation"
  - "summary"
  - "review remediation"
  - "phase 014 implementation summary"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/014-review-remediation"
    last_updated_at: "2026-07-06T19:20:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Completed implementation-summary.md; all 27 tasks and 30 checklist items done"
    next_safe_action: "Run validate.sh --strict for final confirmation, then commit and push"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - ".opencode/skills/sk-design/design-md-generator/backend/scripts/output-policy.ts"
      - ".opencode/skills/sk-design/design-md-generator/backend/scripts/render-safety.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "review-remediation-014"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 014-review-remediation |
| **Completed** | 2026-07-06 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The 009 packet's 10-iteration deep review came back CONDITIONAL: 8 P1 defects and 3 P2 advisories, every one of them concentrated in the design-md-generator backend. This phase fixes all 11. The backend now enforces a real output-path boundary instead of a leaky blocklist, isolates live-site-extracted text from the WRITE-phase prompt so a hostile page can't smuggle instructions into it, sanitizes every CSS value that lands in a generated report's `style="..."` attribute, and parses `cubic-bezier(...)` transitions correctly instead of shredding them on their own internal commas.

### Seam B: Output/Artifact Policy

`extract.ts`'s old guard only rejected paths inside the skill directory — anything else, including `/etc/anything`, sailed through. The new `output-policy.ts` module flips that to a positive allowlist: a path must resolve inside a spec folder or an approved `/tmp/skd-*` sandbox, or it's rejected with a clear reason. It also closes a subtler bug in `guided-run.ts`: the wrapper validated an output path against the caller's cwd, then spawned `extract.ts` with a *different* cwd (`BACKEND_ROOT`), so the same relative path could resolve to two different locations depending on which check ran. `runGuided()` now resolves output and `--design-md` to absolute paths once, before building the child-process plan, so validation and execution always agree. The same module gives `report-gen.ts`, `preview-gen.ts`, and `proof.ts` a real overwrite guard — they now refuse to clobber an existing `report.html`/`preview.html`/`proof.html`/`proof-data.json` unless you pass `--force`, matching what the feature catalog already (incorrectly) claimed they did.

### Seam A: Prompt Data Isolation + Component Facts

The WRITE-phase prompt asked the AI to name real components with "exact values from the component data" but never actually gave it any component data — so it invented values. `build-write-prompt.ts` now has a `componentFacts()` function that renders the real extracted style values per component variant, and it's wired into the prompt's FACTS block. Because component sample text and font-family names are scraped from whatever site is being analyzed, they're the one place in this prompt that a hostile page could plant instruction-like text. Both now go through `asDataBlock()`, which fences them in a labeled, backtick-neutralized block that explicitly tells the downstream agent to treat the content as inert data, never a command.

### Seam C: Renderer CSS-Value Safety

`report-gen.ts` and `preview-gen.ts` build HTML reports by interpolating extracted CSS values — colors, shadows, font families, radii — directly into `style="..."` attributes. HTML-escaping alone doesn't stop that: a crafted value like `red; } * { display:none } /*` stays fully valid, dangerous CSS even after `&`/`<`/`>`/`"` are escaped, because those aren't the characters doing the damage. The new `render-safety.ts` module validates each value's *shape* against what its CSS property actually allows (hex/rgb/hsl/oklch for colors, numeric+unit for lengths, a constrained token grammar for shadows) and falls back to an inert default rather than ever emitting an unvalidated string into a style context. It's wired into every source-derived style interpolation in both files — not just the two lines the review cited, but the whole class of the same bug across `inferPreviewTokens`, the color swatches, the typography row, and the shadow/radius rows.

### Seam D: Transition Parser Correctness

`css-analyzer.ts` split transition shorthand on every comma, so `color 150ms cubic-bezier(0.4, 0, 0.2, 1)` came out as four bogus transitions instead of one. Worse, once that was fixed, the per-transition whitespace split had the same problem one level down — it would have shattered the cubic-bezier's own internal spacing too. Both are fixed with paren-depth-aware splitters that treat anything inside `(...)` as one atomic unit.

### Seam E + P2 Advisories

The feature catalog claimed report/preview/proof "do not silently overwrite existing artifacts" when the code did exactly that; it now describes the real `--force` guard from Seam B. The procedure-card schema's Required-Field Lint was manual-only — `procedure-card-schema-check.mjs` automates 8 of its 10 rules (the other two are genuine judgment calls, and the script says so). Two byte-identical benchmark artifacts under incompatible naming conventions (`after-012-routing-rigor/report.json` vs `after-d3-proxy/skill-benchmark-report.json`) are now resolved by ADR-004: the first is canonical, the second is a named-deprecated duplicate — no files were deleted, since that phase is already closed and out of this remediation's blast radius. And five "focused extraction modules" that had zero test coverage (`motion-extract.ts`, `icon-detect.ts`, `design-boundary-detect.ts`) now have real unit tests for their pure, browser-independent logic.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every seam shipped with its own regression tests before moving to the next one, in the order the review's own Plan Seed recommended (output policy first, since two other seams reuse it). The full backend test suite (134 tests, 63 of them new) and a TypeScript strict typecheck ran clean after every seam, not just at the end. Two adversarial-check moments caught real bugs before they shipped: `safeShadow`'s first version broke on `rgba(0,0,0,0.08)` because its own comma-split had the exact bug class Seam D exists to fix, and the "independent" design-boundary test initially passed for the wrong reason (matching default fixture fields, not the fonts/colors it was supposed to test) until the fixture was corrected.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Sanitize at the shared `inferPreviewTokens()` return point in `report-gen.ts`, not at every downstream call site | `buildComponentPreviewHtml` consumes only that object's fields, so one sanitization point covers a dozen interpolation sites for free instead of touching each one individually |
| Resolve `guided-run.ts`'s output path to absolute in `runGuided()`, not inside `buildPlan()` | `buildPlan()` is a pure function with its own direct unit tests that pass relative paths on purpose; changing its contract would have broken those tests for no benefit, since the real bug only manifests at the point where a child process gets spawned with a different cwd |
| Don't delete `after-d3-proxy/`, document it as deprecated instead | It's a git-tracked artifact belonging to an already-closed, unrelated phase (012); this remediation phase's own spec.md committed to a documentation resolution for that P2 finding, and deleting another phase's files is a scope decision that phase's owner should make, not this one |
| Automate 8 of 10 procedure-card lint rules, not all 10 | Rules 8 and 10 (no copied source prose; read-only modes gain no write/execute authority) are semantic judgment calls — a script that claimed to check them reliably would be lying about its own coverage |
| Restructure `tasks.md` from 6 seam-named phases to the template's literal Setup/Implementation/Verification headers, with seams as H3 subsections | `validate.sh --strict`'s TEMPLATE_HEADERS rule requires the literal Level-2 template headers to exist in order; nesting the seam breakdown under them keeps both the tool's contract and the readable seam-by-seam breakdown |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npx tsc -p tsconfig.json --noEmit` (design-md-generator/backend) | PASS, 0 errors, run after every seam |
| `npx vitest run` (design-md-generator/backend) | PASS, 134/134 tests (71 pre-existing + 63 new across 7 new test files and 2 extended files) |
| `procedure-card-schema-check.mjs` against real cards | PASS, 14/14 cards, 0 failures |
| `procedure-card-schema-check.mjs` negative-case check (scratch fixture, deleted after use) | Correctly caught 8 injected schema violations, exit code 1 |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <folder> --strict` | PASS, Errors: 0, Warnings: 0 (final run) |

Note on validate.sh: getting to a clean pass took several fix-and-recheck rounds, not one shot. `tasks.md` initially used seam-named phase headers instead of the Level 2 template's literal "Phase 1: Setup"/"Phase 2: Implementation"/"Phase 3: Verification" — restructured with the seams as H3 subsections under "Phase 2: Implementation" so the template contract and the seam-level detail both survive. `checklist.md`'s "Fix Completeness" section needed both a header-text fix (dropped a parenthetical) and a reorder (template expects it after Testing, not after Pre-Implementation) — plus every completed item needed an explicit `(verified)` evidence marker; free-text evidence after the checkbox didn't satisfy the EVIDENCE_CITED rule's pattern match. `implementation-summary.md`'s Spec Folder metadata field needed to be the bare folder basename with no backticks, not the full packet path. Finally, `description.json` and `graph-metadata.json` were missing entirely and had to be generated via `generate-description.js` and `backfill-graph-metadata.js` (scoped to this one folder, not `--all`).
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`after-d3-proxy/` duplicate benchmark artifact still exists on disk.** ADR-004 in `012-routing-benchmark-rigor/decision-record.md` designates it deprecated and names `after-012-routing-rigor/` canonical, but does not delete it — that's an explicit out-of-scope decision (see Key Decisions), not an oversight. A future cleanup pass can act on the ADR directly.
2. **Procedure-card lint rules 8 and 10 remain manual-only.** `procedure-card-schema-check.mjs` automates rules 1-7 and 9; rules 8 (no copied source prose) and 10 (read-only modes gain no write/execute authority) are semantic judgment calls the script explicitly flags as needing human review rather than silently skipping.
3. **`framework-detect.ts` and `dark-mode-detect.ts` still have no automated test coverage.** Both require a live Playwright `Page` for their core logic, unlike `motion-extract.ts`/`icon-detect.ts`/`design-boundary-detect.ts`, which operate on already-collected data structures. Covering them would need browser mocking disproportionate to a P2 advisory's scope.
4. **`contrastOn()` in report-gen.ts only understands hex colors.** If `safeColor()`'s fallback or a functional-color match (`rgb()`/`hsl()`/`oklch()`) reaches it, its naive hex-slicing produces `NaN` and silently falls through to a default contrast color. This is a pre-existing cosmetic limitation, not something this phase introduced or was asked to fix.
<!-- /ANCHOR:limitations -->
