---
title: "Feature Specification: Banners and Folder Docs"
description: "Two current-state documentation deliverables: paired README.md/CODE.md folder docs for every source folder under src/ and tools/ that owes them, and numbered upper-case box-drawing section banners plus a real header for styles.css, both proven against the phase 008 scanners and the screenshot gate."
trigger_phrases:
  - "obsidian banners and folder docs"
  - "styles.css numbered sections box drawing"
  - "readme code md folder documentation plugin"
  - "phase 009 banners folder docs"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/025-sk-code-obsidian-surface/009-banners-and-folder-docs"
    last_updated_at: "2026-08-28T22:05:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Folder docs + styles.css sections"
    next_safe_action: "Kebab rename (phase 010)"
    blockers: []
    key_files:
      - "../../../src/README.md"
      - "../../../src/CODE.md"
      - "../../../src/views/modals/README.md"
      - "../../../styles.css"
      - "../../../screenshots/manifest.json"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-code-obsidian-009"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Whether src/data/__tests__ owes README only or both: both, because a live scan counts 5 direct source files there (>= the 3-file threshold), correcting the phase-008 reference which listed it as README-only (scan-folder-docs.mjs, 2026-08-28)"
      - "Whether a styles.css comment change can keep screenshots:verify green without recapture: yes, by re-fingerprinting styles.css in the manifest, because the change is comment-only and moves no pixel (2026-08-28)"
---
# Feature Specification: Banners and Folder Docs

> Phase chain: parent [`../spec.md`](../spec.md), predecessor `008-scanners-and-gates`
> (built the scanners this phase satisfies), successor `010-kebab-rename`.

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

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

Phase 008 built `scan-folder-docs.mjs`, which reported 19 violations against the tree: every source
folder under `src/` and `tools/` was missing the `README.md` and, where the threshold applies,
`CODE.md` that its source count owes. Separately, `styles.css` was 18,931 lines fronted by a
312-line Chinese-language CSS tutorial preamble and grouped under 65 `=====` delimiter banners with
Chinese titles and gaps in their numbering, with zero box-drawing section banners in the grammar the
`sk-code-obsidian` surface documents. A reader landing in either place had no current-state map.

### Purpose

Make `node tools/naming/scan-folder-docs.mjs` exit 0 by writing the folder docs it demands, and
replace the stylesheet's preamble and delimiter banners with a real English header and numbered
upper-case box-drawing sections, without moving a single rendered pixel. Both deliverables describe
the tree as it is now, not how it got there.

### Explicitly Not In This Phase

The 249-file `MODULE:` banner pass across every `src/` and `tools/` source file is deliberately not
in this phase. This phase documents folders and the stylesheet only. The per-file source-comment
banners that `scan-comments.mjs` gates remain future work.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Ten `README.md` files, one per source folder under `src/` and `tools/`, and nine `CODE.md` code
  maps for the nine folders above the pairing threshold, so `scan-folder-docs.mjs` exits 0.
- Replacing `styles.css`'s Chinese tutorial preamble with a real English header, and every one of
  its 33 section banners with a numbered upper-case box-drawing banner, in place.
- Re-fingerprinting `styles.css` in `screenshots/manifest.json` so `screenshots:verify` stays green
  without recapturing, since the stylesheet change is comment-only.
- Replacing this leaf's `spec.md`, `plan.md`, `tasks.md`, and `implementation-summary.md` scaffolds.

### Out of Scope

- The 249-file `MODULE:` banner and per-file numbered-section pass gated by `scan-comments.mjs`.
- The kebab-case filename rename gated by `scan-naming.mjs` (phase 010).
- Any change to a `src/*.ts` logic file, a `tools/screenshots/*.mjs` behavior, or a hub file.
- Reordering, deleting, or rewriting any CSS rule. The stylesheet change is comment-structure only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `src/README.md`, `src/CODE.md` | Create | Source-root feature doc and code map |
| `src/__tests__/README.md` | Create | Test-setup folder (README only, below threshold) |
| `src/data/README.md`, `src/data/CODE.md` | Create | Data-layer feature doc and code map |
| `src/data/__tests__/README.md`, `src/data/__tests__/CODE.md` | Create | Data-test folder (owes both, 5 source files) |
| `src/views/README.md`, `src/views/CODE.md` | Create | Rendering-layer feature doc and code map |
| `src/views/modals/README.md`, `src/views/modals/CODE.md` | Create | Dialog-layer feature doc and code map |
| `tools/README.md`, `tools/CODE.md` | Create | Tooling-root feature doc and code map |
| `tools/naming/README.md`, `tools/naming/CODE.md` | Create | Scanner feature doc and code map |
| `tools/screenshots/README.md`, `tools/screenshots/CODE.md` | Create | Harness feature doc and code map |
| `tools/screenshots/scenarios/README.md`, `tools/screenshots/scenarios/CODE.md` | Create | Scenario feature doc and code map |
| `styles.css` | Edit comments only | New English header, 33 numbered box-drawing section banners |
| `screenshots/manifest.json` | Edit data only | Re-fingerprint `styles.css` in all 180 entries |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Replace scaffold | This leaf's spec-kit record |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every folder under `src/`/`tools/` that owes docs has them | `node tools/naming/scan-folder-docs.mjs` reports `10` folders scanned, `9` owe README + CODE, `1` owes README only, and exits `0` with the PASS line. Confirmed 2026-08-28. |
| REQ-002 | `styles.css` carries a real header and numbered box-drawing sections | The 312-line Chinese preamble is replaced by an English header, and all 33 section banners are numbered `1..33` upper-case box-drawing banners. `grep -c '======' styles.css` returns `0`; the box-drawing rule character is present. |
| REQ-003 | The stylesheet change moves no pixel | `npm run screenshots:verify` reports all `180` entries current without recapturing. The transform's own guard confirmed the non-comment bytes are byte-identical before and after. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Folder docs are current-state only | No doc names a spec path, a requirement or task id, or a migration note. Each README states what the folder is for; each CODE.md maps topology, boundaries, entrypoints and validation. |
| REQ-005 | Every backticked path and link resolves | A resolver over all 19 docs checks 56 links and slashed source paths; `0` are broken. |
| REQ-006 | The baseline gates stay green | `tsc` `0`, `build` `0`, `vitest` `386` passed across `49` files, `screenshots:verify` `180`, `lint` `115` problems (`100` errors, unchanged and not touched). |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `scan-folder-docs.mjs` exits `0` where it reported 19 violations before this phase.
- **SC-002**: `styles.css` opens with an English header and reads under 33 numbered box-drawing sections, with no `=====` banner and no Chinese preamble remaining.
- **SC-003**: `screenshots:verify` reports 180 entries current with no capture run in this phase.
- **SC-004**: `spec.md`, `plan.md`, `tasks.md`, and `implementation-summary.md` carry no scaffold placeholder text.

### Acceptance Scenarios

- **Scenario 1**: **Given** `scan-folder-docs.mjs` reporting 19 violations across 10 folders, **when** the 10 READMEs and 9 CODE maps are written, **then** the scanner exits `0` with `9` owe-both, `1` owe-README-only, and a PASS line.
- **Scenario 2**: **Given** `styles.css` with a 312-line Chinese preamble and 65 `=====` delimiter lines, **when** the 34 banner comments are replaced, **then** `grep -c '======' styles.css` is `0` and the file opens with the numbered box-drawing header.
- **Scenario 3**: **Given** `styles.css` is a fingerprinted source for all 180 manifest entries, **when** its comments change and its manifest hash is updated to match, **then** `screenshots:verify` reports 180 current without a capture run.
- **Scenario 4**: **Given** the phase-008 folder-docs reference listing `src/data/__tests__` as README-only, **when** a live scan counts its 5 direct source files, **then** it owes both docs, and this phase writes both rather than trusting the stale list.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A comment edit to `styles.css` silently changes a CSS rule | Rendering drift the screenshot gate would then hide once re-fingerprinted | The transform strips every comment from the before and after and requires the remaining CSS to be byte-identical, aborting with no write otherwise |
| Risk | Re-fingerprinting `styles.css` masks a real render change | A future real stylesheet change could look already-captured | The re-fingerprint is applied only in the same step as a proven comment-only edit; any behavioral edit must recapture, and the guard above is what proves this edit was comment-only |
| Risk | A folder doc names a file that does not exist | A broken reference and a misleading map | A resolver checks all 56 links and slashed paths across the 19 docs; `0` broken |
| Dependency | `008-scanners-and-gates/scan-folder-docs.mjs` | The gate this phase must turn green | Already built and committed; run live here, not assumed |
| Dependency | `screenshots/manifest.json` and `tools/screenshots/verify.mjs` | Verify hashes `styles.css` for every entry, so a comment edit flips them all stale unless re-fingerprinted | Manifest re-fingerprinted in all 180 entries; `verify.mjs` behavior untouched |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:edge-cases -->
## 7. EDGE CASES

### Threshold Boundaries

- **`src/data/__tests__` owes both, not README-only**: a live scan finds 5 direct source files there
  (`ComputedField.let.test.ts`, `LetVariables.test.ts`, `ViewFilterTree.test.ts`,
  `computed-formulas.test.ts`, `textLinkScheme.test.ts`), which is at or above the 3-file threshold.
  The phase-008 folder-docs reference listed it as README-only; the live scanner is authority and
  this phase writes both docs.
- **`tools/naming` owes both**: it holds the three scanner scripts phase 008 added, so it is now a
  source-bearing folder above the threshold, though it did not exist when earlier lists were drawn.
- **`tools` owes both with zero direct source files**: it has no direct `.mjs`, but both its child
  folders carry source, so the child-source clause of the threshold applies.

### Stylesheet Boundaries

- **`styles.css` must not be split**: the test suite and the capture harness load it in source
  order, so the sectioning is in place. The 33 banners renumber sequentially `1..33`, closing the
  gaps the original Chinese numbering left (it skipped 9 and 22 and reused 13b).
- **Two small in-context dividers become their own sections**: the original wrap-mode and
  filename-path-prefix inline dividers are distinct rule groups, so they take their own numbers
  rather than being dropped.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 19 folder docs plus an in-place comment restructure of a 19k-line stylesheet and a manifest re-fingerprint |
| Risk | 7/25 | The one real risk is a comment edit touching a rule, closed by a byte-equality guard; docs carry no runtime risk |
| Research | 8/20 | Required reading: both README templates, the surface's folder-docs rule, the real `src`/`tools` tree, the stylesheet's banner map, and the verify/manifest contract |
| **Total** | **27/70** | **Level 2** |

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS

All resolved for this phase:
- **Whether `src/data/__tests__` owes README-only or both**: both, per the live scan (5 source
  files), correcting the phase-008 reference list.
- **Whether a comment-only `styles.css` edit can keep `screenshots:verify` green without
  recapturing**: yes, by re-fingerprinting `styles.css` in the manifest, which is honest because a
  guard proved the rendered bytes are unchanged.

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Parent Spec**: [`../spec.md`](../spec.md)
- **Predecessor**: [`../008-scanners-and-gates/spec.md`](../008-scanners-and-gates/spec.md)
- **Scanner Gate**: `../../../tools/naming/scan-folder-docs.mjs`
- **Stylesheet**: `../../../styles.css`
- **Verify Gate**: `../../../tools/screenshots/verify.mjs`, `../../../screenshots/manifest.json`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Implementation Summary**: See `implementation-summary.md`

<!-- /ANCHOR:related-docs -->
</content>
