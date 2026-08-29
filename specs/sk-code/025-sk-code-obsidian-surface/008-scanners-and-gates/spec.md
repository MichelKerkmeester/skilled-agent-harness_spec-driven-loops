---
title: "Feature Specification: Scanners and Gates"
description: "Three Node ESM scanners under tools/naming/ that make the plugin's target source conventions (kebab-case filenames, MODULE banners and numbered sections, paired folder docs) executable, proven against the current unconverted tree."
trigger_phrases:
  - "obsidian scanners and gates"
  - "scan-naming scan-comments scan-folder-docs"
  - "phase 008 scanners"
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
    answered_questions:
      - "Whether the scanners hardcode exceptions for the existing camelCase/underscore filenames: no — phase 010's rename is a full conversion, so nothing is grandfathered (operator via goal.md §3, 2026-08-28)"
---
# Feature Specification: Scanners and Gates

> Phase chain: parent [`../spec.md`](../spec.md), predecessor `007-manual-testing-playbook`,
> successor `009-banners-and-folder-docs` (consumes these scanners as its acceptance gate).

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

`002-repo-convention-audit/audit.json` measured the plugin's target conventions as entirely
absent — 232 of 248 filenames PascalCase with no scanner enforcing anything, 0 of 249 files
carrying a `MODULE:` banner, and 0 folder docs anywhere under `src/` or `tools/` — but a measured
count sitting in a JSON file is a snapshot, not a gate. Nothing re-runs it, nothing fails a build
over it, and phase 009's banner/folder-doc work and phase 010's kebab rename would otherwise have
no way to prove they actually closed the gap they claim to close.

### Purpose

Give each of the three target conventions its own executable Node ESM scanner under
`tools/naming/`: `scan-naming.mjs` for the filename grammar, `scan-comments.mjs` for the
`MODULE:` banner and numbered box-drawing sections (plus commented-out code), and
`scan-folder-docs.mjs` for the `README.md`/`CODE.md` pairing threshold in both directions. Each
scanner is run against the current, unconverted tree in this same phase so its non-zero result is
proven, not assumed — a scanner that reports zero violations today would be measuring nothing.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- `tools/naming/scan-naming.mjs`, `scan-comments.mjs`, `scan-folder-docs.mjs` — three standalone
  Node ESM scripts, each with a `--json` flag, an exit code of `0` when clean and `1` when it
  finds violations, and its own `MODULE:` banner plus numbered upper-case box-drawing sections —
  the first files in this repository to follow the convention they enforce.
- Running each scanner with Bash against the current tree and recording the real counts in this
  document.
- Replacing this leaf's own `spec.md`, `plan.md`, and `tasks.md` scaffolds with real content.

### Out of Scope

- Converting the tree to satisfy the scanners — that is phases 009 (banners, sections, folder
  docs, stylesheet grammar) and 010 (the kebab rename). This phase proves the gate exists and
  proves it currently fails; it does not make it pass.
- Any change to `src/`, `styles.css`, `package.json`, or any file outside `tools/naming/` and this
  phase's own folder.
- A fourth scanner for `styles.css`'s own section grammar — phase 009's `screenshots:verify` gate
  covers that file's behavior; `scan-comments.mjs` here scans `src/` and `tools/` source files
  only (`.ts`, `.mjs`, `.js`), not the stylesheet.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `tools/naming/scan-naming.mjs` | Create | Filename-grammar scanner |
| `tools/naming/scan-comments.mjs` | Create | `MODULE:` banner, numbered-section, and commented-out-code scanner |
| `tools/naming/scan-folder-docs.mjs` | Create | Folder-doc threshold scanner (both directions) |
| `spec.md` | Replace scaffold | This document |
| `plan.md` | Replace scaffold | The execution plan for building and proving the scanners |
| `tasks.md` | Replace scaffold | The task breakdown for this phase |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `scan-naming.mjs` reports every non-kebab file under `src/` and `tools/` | Run against the tree at the start of this phase: `252` files scanned (249 measured by `audit.json` plus the three new scanner files this phase adds), `235` non-kebab, exit `1`. The three new scanner files are themselves excluded from the violation list because their own names are lowercase-kebab. |
| REQ-002 | `scan-comments.mjs` reports every file missing a `MODULE:` banner or numbered box-drawing sections | Run against the tree: `252` scanned, `249` missing a banner, `249` missing paired numbered sections, `0` commented-out-code lines found, exit `1`. The three new scanner files are excluded because each carries the banner and sections this phase requires of them. |
| REQ-003 | `scan-folder-docs.mjs` enforces both directions of the `>=3`-source-files-or-child-source threshold | Run against the tree: `10` folders scanned, `9` owe both `README.md` and `CODE.md`, `1` (`src/__tests__`) owes `README.md` only, `19` total violations (a `missing-readme` for all 10, plus a `missing-code` for the 9 that owe it), exit `1`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Each scanner carries its own `MODULE:` banner and numbered box-drawing sections | `scan-comments.mjs`, run against `tools/naming/`, reports zero violations for its own three files — proven by the `249`-of-`252` count in REQ-002 excluding exactly those three. |
| REQ-005 | No new dependency is introduced | All three scripts import only Node built-ins (`node:fs`, `node:path`, `node:url`); `package.json` is untouched, per this packet's frozen "no behavior change beyond the three scanners" constraint (`../goal.md` §3). |
| REQ-006 | The real counts are pasted into this document, not estimated | §1's requirement rows and this phase's `tasks.md` verification section both carry the numbers from an actual `node tools/naming/scan-*.mjs --json` run captured during this phase, dated 2026-08-28. |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All three scanners exist under `tools/naming/`, each runnable as `node tools/naming/scan-*.mjs` and `node tools/naming/scan-*.mjs --json`.
- **SC-002**: Each scanner exits `1` against the current tree, with a non-zero violation count matching the numbers recorded in §4.
- **SC-003**: Each scanner's own source file is not among its own violations — the three scripts are clean by the convention they enforce.
- **SC-004**: `spec.md`, `plan.md`, and `tasks.md` in this folder contain no scaffold placeholder text (`REQUIREMENT_PLACEHOLDER`, `**Given**` with no scenario body, or similar).

### Acceptance Scenarios

- **Scenario 1**: **Given** the tree measured by `002-repo-convention-audit/audit.json` as 232-of-248 PascalCase, **when** `node tools/naming/scan-naming.mjs --json` is run in this phase, **then** it reports `235` violations out of `252` scanned files and exits `1`.
- **Scenario 2**: **Given** `audit.json` measured 0 of 249 files with a `MODULE:` banner, **when** `node tools/naming/scan-comments.mjs --json` is run, **then** it reports `249` files missing the banner (all of the pre-existing tree, none of the three new scanners) and exits `1`.
- **Scenario 3**: **Given** `audit.json` measured zero folder docs anywhere, **when** `node tools/naming/scan-folder-docs.mjs --json` is run, **then** it reports `19` violations across `10` scanned folders and exits `1`.
- **Scenario 4**: **Given** a file that genuinely contains commented-out code (a `//` line carrying a statement keyword plus code punctuation, or an assignment/call ending in `;`/`{`/`}`), **when** `scan-comments.mjs`'s heuristic is unit-checked against eight labeled cases (real code and look-alike prose), **then** every case classifies correctly — confirmed inline during this phase (see `plan.md` §5).
- **Scenario 5**: **Given** `scan-folder-docs.mjs`'s own live count for `src/data/__tests__` (5 direct `.test.ts` files), **when** compared against `audit.json`'s `folderDocs.owesReadmeOnly` list (which names that same folder), **then** the two disagree — the live scan places it in `owesReadmeAndCode` because 5 >= the 3-file threshold. This phase records the discrepancy as evidence (§7) rather than editing `audit.json`, which belongs to phase 002 and is outside this phase's write boundary.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A scanner reports zero violations against the unconverted tree | It would be measuring nothing and the whole phase would be silently wrong | Every scanner was run with Bash immediately after being written, in this same phase, and its non-zero count is recorded in §4 before this document was finalized |
| Risk | The commented-out-code heuristic false-positives on prose that merely starts with a keyword-shaped word (`type icon...`, `return/typeof/else are...`) | A clean file gets flagged, eroding trust in the gate | The heuristic requires code punctuation (`(){};=`) alongside the keyword, not the keyword alone; verified against two real false positives found in `src/data/FormulaTokenizer.ts` and `src/views/ColumnWidth.ts` during this phase and against six additional labeled cases (`plan.md` §5) |
| Dependency | `002-repo-convention-audit/audit.json` | The baseline this phase's counts are checked against and, in one case, found to disagree with (§5, Scenario 5) | Already measured and committed; this phase treats it as evidence, not as ground truth to be silently trusted over a live re-scan |
| Dependency | `sk-code-mobile-cli/scripts/run-source-gates.sh` | The shape template for a source-gates runner; its guard list (naming, comments, folder-docs, skill-references, token-identity) does not map one-to-one onto this plugin (no skill-reference or token-identity concept here) | This phase builds only the three scanners the task specifies; a `run-source-gates.sh`-equivalent for this plugin, if wanted, is future scope, not silently added here |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:edge-cases -->
## 7. EDGE CASES

### Scanner Boundaries

- **A file this phase itself creates becomes part of the scanned set**: `tools/naming/`'s three new `.mjs` files are under `tools/`, so every scanner counts them. Each scanner's reported totals (`252` scanned, not `249`) reflect this honestly rather than excluding the scanners from their own scan.
- **The `audit.json` vs. live-scan disagreement for `src/data/__tests__`**: `audit.json` lists it under `folderDocs.owesReadmeOnly`, but a live count finds 5 direct `.test.ts` files there (`ComputedField.let.test.ts`, `LetVariables.test.ts`, `ViewFilterTree.test.ts`, `computed-formulas.test.ts`, `textLinkScheme.test.ts`), which is `>=3` and so owes both docs under the stated threshold. This phase's scanner reflects the live tree; `audit.json` is phase 002's artifact and is out of this phase's write boundary, so the discrepancy is recorded here as evidence rather than silently reconciled.
- **CJK or English prose that opens with a code-keyword-shaped word**: `scan-comments.mjs`'s commented-out-code check requires code punctuation alongside the keyword specifically because two real files in the tree (`src/data/FormulaTokenizer.ts:144,150` and `src/views/ColumnWidth.ts:47`) contain exactly this shape and are not commented-out code.

### Grounding Boundaries

- **No claim in this document is unmeasured**: every count in §4 and §5 comes from an actual `node tools/naming/scan-*.mjs --json` run captured during this phase, not from `audit.json` alone or from estimation.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Three small, independent Node scripts plus their spec-kit wrapper; no framework, no test harness changes |
| Risk | 5/25 | Read-only scanners with no write side effects; the only risk is a false-positive/negative in the heuristics, mitigated in §6 |
| Research | 6/20 | Required reading: the mobile-cli template's `run-source-gates.sh` shape, the plugin's real `src/`/`tools/` tree, and `audit.json`'s measured baseline |
| **Total** | **21/70** | **Level 2** |

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS

All resolved for this phase:
- **Whether to hardcode exceptions for `textLinkScheme`/`_shared`**: no. `goal.md` §3 and this
  packet's `spec.md` frame phase 010 as a full manifest-driven rename, so nothing already in the
  tree is grandfathered by these scanners.
- **Whether a `run-source-gates.sh`-equivalent runner is needed for this plugin**: out of scope
  for this phase, which builds only the three scanners the task names; deferred as future scope
  if wanted.

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Parent Spec**: [`../spec.md`](../spec.md)
- **Packet Goal**: [`../goal.md`](../goal.md)
- **Measured Audit**: [`../002-repo-convention-audit/audit.json`](../002-repo-convention-audit/audit.json)
- **Template Runner**: `$HUB/.opencode/skills/sk-code/sk-code-mobile-cli/scripts/run-source-gates.sh`
- **Scanners**: `../../../tools/naming/scan-naming.mjs`, `scan-comments.mjs`, `scan-folder-docs.mjs`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`

<!-- /ANCHOR:related-docs -->
