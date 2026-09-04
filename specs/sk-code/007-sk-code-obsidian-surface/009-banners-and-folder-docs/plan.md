---
title: "Implementation Plan: Banners and Folder Docs"
description: "Execution plan for the two deliverables: the template-driven folder docs that turn scan-folder-docs green, and the in-place, guarded comment restructure of styles.css with a manifest re-fingerprint that keeps the screenshot gate green without recapture."
trigger_phrases:
  - "obsidian banners folder docs plan"
  - "styles.css sectioning transform plan"
  - "manifest re-fingerprint screenshots verify"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/007-sk-code-obsidian-surface/009-banners-and-folder-docs"
    last_updated_at: "2026-08-28T22:05:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Folder docs + styles.css sections"
    next_safe_action: "Kebab rename (phase 010)"
    blockers: []
    key_files:
      - "../../../styles.css"
      - "../../../screenshots/manifest.json"
      - "../../../tools/naming/scan-folder-docs.mjs"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-code-obsidian-009"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Banners and Folder Docs

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown folder docs, CSS comments, and one throwaway Node ESM transform |
| **Framework** | None. Docs follow sk-doc's README and code-README templates; the stylesheet edit is comment-only |
| **Storage** | Files on disk. `screenshots/manifest.json` re-fingerprinted for `styles.css` |
| **Testing** | The phase-008 scanners and the existing gate suite: `scan-folder-docs`, `tsc`, `build`, `vitest`, `screenshots:verify`, `lint` |

### Overview
Two independent deliverables. First, 19 folder docs: a `README.md` for each of the 10 source
folders under `src/` and `tools/`, plus a `CODE.md` code map for the 9 above the pairing threshold,
each written from the folder's real files against sk-doc's two README templates and the surface's
own folder-docs rule, until `scan-folder-docs.mjs` exits 0. Second, `styles.css` sectioning: the
312-line Chinese tutorial preamble becomes a real English header, and each of the 33 delimiter
banners becomes a numbered upper-case box-drawing banner, applied in place by a self-checking Node
transform that touches only comment spans and aborts unless the non-comment bytes are byte-identical.
Because `styles.css` is a fingerprinted source for all 180 screenshot entries, its manifest hash is
updated to the post-edit value so `screenshots:verify` stays green with no capture run. The 249-file
`MODULE:` banner pass is not part of this phase.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Both sk-doc README templates and the surface's `folder-docs.md` rule read in full.
- [x] `scan-folder-docs.mjs` read as the authority on the threshold, and run to capture its 19 baseline findings.
- [x] The real `src`/`tools` tree measured with `find` and the stylesheet's 34 banner comments enumerated before any write.
- [x] `verify.mjs` and `manifest.json` read to confirm `styles.css` is a fingerprinted source for every entry.

### Definition of Done
- [x] `node tools/naming/scan-folder-docs.mjs` exits 0.
- [x] `styles.css` carries the English header and 33 numbered box-drawing sections; no `=====` banner remains.
- [x] The transform's byte-equality guard confirmed the CSS rules are unchanged.
- [x] `screenshots:verify` reports 180 current without recapture.
- [x] `tsc` 0, `build` 0, `vitest` 386/49, `lint` 115 (unchanged).
- [x] `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` replaced with real content.
- [x] No `src/*.ts` logic, `tools/screenshots/*.mjs` behavior, or hub file touched.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Template-first for the docs, guarded in-place transform for the stylesheet. Each README answers
what the folder is for; each CODE.md maps topology, boundaries, entrypoints and validation. The
stylesheet edit is mechanical and reversible: find every comment containing an `=` run, replace the
Nth with the Nth prepared banner, verify nothing else moved.

### Key Components
- **Folder docs (19 files)**: 10 READMEs and 9 CODE maps. The pairing follows the live scan, which
  places `src/data/__tests__` (5 source files) and `tools/naming` (the three phase-008 scanners) in
  the owe-both set, and `src/__tests__` (1 file) in owe-README-only.
- **Stylesheet transform**: a one-shot Node script collects the 34 banner comments in file order
  (index 0 the preamble/header, 1..33 the sections), rebuilds the file replacing each span with a
  numbered box-drawing banner carrying a short upper-case title and the durable why translated from
  the original Chinese note, then asserts `stripComments(before) === stripComments(after)` before
  writing. The script is deleted after it runs.
- **Manifest re-fingerprint**: every entry's recorded `styles.css` hash is updated from the old
  value to the new one, so the shots stay valid for the comment-changed file without a capture run.

### Data Flow
`scan-folder-docs baseline (19)` -> write 19 docs -> `scan-folder-docs (0)`.
`styles.css banners` -> transform (guarded) -> new hash -> update manifest -> `screenshots:verify (180)`.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase
state. In brief: read templates and measure the tree and stylesheet, then write the folder docs,
then transform the stylesheet and re-fingerprint the manifest, then run every gate.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Folder-doc gate | The whole `src`/`tools` tree against the threshold | `node tools/naming/scan-folder-docs.mjs` (exit 0) |
| Reference resolution | All 56 links and slashed source paths across the 19 docs | Node resolver script; 0 broken |
| Byte-equality guard | CSS rules unchanged by the comment transform | `stripComments(before) === stripComments(after)` inside the transform |
| Pixel-stability gate | Every screenshot still current after the stylesheet edit | `npm run screenshots:verify` (180 current, no recapture) |
| Baseline gates | Type, build, unit, lint stay at baseline | `npx tsc --noEmit`, `npm run build`, `npx vitest run`, `npm run lint` |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `008-scanners-and-gates/scan-folder-docs.mjs` | Internal (predecessor) | Green — run live, exits 0 after the docs land | Without it there is no gate to prove the folder docs complete |
| sk-doc README templates and the surface `folder-docs.md` rule | External (hub) | Green — read in full | The doc shape and the threshold rule the folder docs follow |
| `screenshots/manifest.json` + `tools/screenshots/verify.mjs` | Internal | Green — hash updated, behavior untouched | Verify would flip all 180 entries stale on any `styles.css` edit unless re-fingerprinted |
| Node.js runtime (`node:fs`) | Runtime | Green — stable built-ins only | The one-shot transform and the resolver both need it |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the stylesheet transform is found to have altered a rule, or a folder doc names a
  path that does not resolve.
- **Procedure**: the stylesheet edit is comment-only and self-contained, so `git checkout styles.css
  screenshots/manifest.json` restores both together; the byte-equality guard makes an undetected
  rule change effectively impossible, but the revert is the backstop. A wrong folder doc is a single
  markdown file: fix or delete it and re-run `scan-folder-docs.mjs`. No data migration is involved.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (templates + tree + stylesheet map) ──► Implementation (docs, then stylesheet + manifest) ──► Verification (all gates)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 008 scanners | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Phase 010 (kebab rename) |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Two templates, one rule doc, one tree measurement, one stylesheet banner enumeration |
| Implementation | Med | 19 folder docs plus a guarded 34-comment stylesheet transform and a 180-entry manifest update |
| Verification | Low | Six gate commands plus a reference resolver |
| **Total** | | **Single-session** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] The stylesheet transform aborts with no write unless the non-comment bytes are identical.
- [x] The manifest hash update was applied only after the comment-only edit was proven.
- [x] Every gate was run to its real exit status, not assumed from the source.

### Rollback Procedure
1. For a stylesheet regression: `git checkout styles.css screenshots/manifest.json`.
2. For a bad folder doc: fix or delete the single markdown file and re-run `scan-folder-docs.mjs`.
3. Re-run the gate suite to confirm the baseline is restored.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A — this phase adds docs and rewrites comments; no runtime data changes.

<!-- /ANCHOR:enhanced-rollback -->
</content>
