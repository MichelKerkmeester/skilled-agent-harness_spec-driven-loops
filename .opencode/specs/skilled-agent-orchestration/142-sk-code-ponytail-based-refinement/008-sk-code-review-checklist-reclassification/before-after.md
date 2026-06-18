---
title: "Before / After: sk-code-review Checklist Reclassification"
description: "Side-by-side before/after for moving six review checklists from references/ to assets/, aligning each to the asset template, and re-pathing every coupled reference in lockstep, with live re-verification evidence."
trigger_phrases:
  - "sk-code-review before after"
  - "checklist reclassification before after"
  - "references to assets move before after"
importance_tier: "normal"
contextType: "general"
---

# Before / After — Phase 008: sk-code-review Checklist Reclassification

> **Scope**: move six review checklists `references/ → assets/`, align them to the asset template, re-path every consumer.
> **Commits**: `7be787b5b8` (move + alignment) and `a46b4afa4b` (version bump).
> **Standard conformed to**: `sk-doc` `skill_asset_template.md`.
> This is a **supplementary** doc (no `_memory:` block, no template markers) so it is not structure-validated by `validate.sh --strict`.

---

## At a Glance

| # | Area | Before | After |
|---|------|--------|-------|
| 1 | File location | Six checklists filed under `references/` | Six checklists under a new flat `assets/` folder |
| 2 | `references/` contents | 10 files mixing doctrine + checklist artifacts | 4 genuine references only (`review_core`, `review_ux_single_pass`, `quick_reference`, `pr_state_dedup`) |
| 3 | Five checklists' OVERVIEW | `### Purpose` + `### Core Principle`, no `### Usage` | Gained `### Usage` (Purpose + Usage + Core Principle); asset-valid |
| 4 | `fix-completeness-checklist` | lowercase `## 1. Overview`, Title-Case sections, no Purpose/Usage, no RELATED | `## 1. OVERVIEW` + Purpose + Usage, UPPERCASE sections, `---` dividers, `## 5. RELATED RESOURCES` |
| 5 | Coupling paths (~30) | All named `references/<checklist>.md` | All re-pathed to `assets/<checklist>.md` |
| 6 | Runtime mirrors | `.claude` / `.codex` held the old layout | Re-synced to match `.opencode` |
| 7 | Version metadata | `SKILL.md version: 1.2.0.0`, latest changelog `v1.4.0.0` | `version: 1.5.0.0`, new changelog `v1.5.0.0.md` |

**No review doctrine changed** — the move is path + overview-shape only. A `git mv` back plus `git restore` reverts it with no data migration.

---

## 1. The Six Moved Files

`code_quality_checklist`, `security_checklist`, `solid_checklist`, `test_quality_checklist`, `fix-completeness-checklist`, `removal_plan` are checklist artifacts a reviewer **applies**, not doctrine a reviewer **reads** — so they belong in `assets/`, not `references/`.

### Before
```text
sk-code-review/references/
├── review_core.md
├── review_ux_single_pass.md
├── quick_reference.md
├── pr_state_dedup.md
├── code_quality_checklist.md          ← misfiled
├── security_checklist.md              ← misfiled
├── solid_checklist.md                 ← misfiled
├── test_quality_checklist.md          ← misfiled
├── fix-completeness-checklist.md      ← misfiled
└── removal_plan.md                    ← misfiled
```

### After
```text
sk-code-review/
├── references/                        (4 genuine references)
│   ├── review_core.md
│   ├── review_ux_single_pass.md
│   ├── quick_reference.md
│   └── pr_state_dedup.md
└── assets/                            (6 checklist artifacts — NEW)
    ├── code_quality_checklist.md
    ├── security_checklist.md
    ├── solid_checklist.md
    ├── test_quality_checklist.md
    ├── fix-completeness-checklist.md
    └── removal_plan.md
```

**Why flat `assets/` and not `assets/checklists/`**: keeping the same directory depth as `references/` preserves every `../`-relative link, so only the cross-folder links needed re-pathing.

---

## 2. Five Checklists — Gained `### Usage`

The five well-formed checklists already had `### Purpose` + `### Core Principle` but lacked the asset template's `### Usage` subsection.

### Before (example: `code_quality_checklist.md`)
```text
## 1. OVERVIEW
### Purpose
Provide a systematic pass for non-security defects...
### Core Principle
Prioritize silent-failure and data-corruption risks above stylistic concerns.
```

### After
```text
## 1. OVERVIEW
### Purpose
Provide a systematic pass for non-security defects...
### Usage
Run this pass on every findings-first review; walk each section against the
changed diff and cite file:line for anything flagged.
### Core Principle
Prioritize silent-failure and data-corruption risks above stylistic concerns.
```
`### Core Principle` was retained — only `### Usage` was inserted. No checklist item changed.

---

## 3. `fix-completeness-checklist` — Full Restructure

This file was a structural outlier: lowercase `## 1. Overview`, Title-Case section names, no `Purpose`/`Usage`, no `RELATED RESOURCES`.

### Before
```text
## 1. Overview
Use this checklist when turning review findings into complete fixes...
## 2. Classification
## 3. Required Inventories
## 4. Completion Output
```

### After
```text
# Fix Completeness Checklist
<1-line intro>
## 1. OVERVIEW
### Purpose
Turn a review finding into a complete fix that covers same-class producers,
consumers, changed algorithms, matrix coverage, and hostile runtime state...
### Usage
Use this when a finding becomes a fix: classify, run the required inventories,
and include the completion output before claiming done...
---
## 2. CLASSIFICATION
---
## 3. REQUIRED INVENTORIES
---
## 4. COMPLETION OUTPUT
---
## 5. RELATED RESOURCES
- [code_quality_checklist.md](./code_quality_checklist.md)
- [security_checklist.md](./security_checklist.md)
- [../references/review_core.md](../references/review_core.md)
```
Also: a grep example inside `## 3` changed `REQ-` → `requirement-id` (keeps the example clean of perishable-label patterns). The fix doctrine itself is unchanged.

---

## 4. Coupling Re-Pathed in Lockstep (~30 edits)

Every by-path reference to a moved file was updated `references/ → assets/` in the same commit.

| Surface | Before | After |
|---------|--------|-------|
| `SKILL.md` Resource Domains block | `references/*_checklist.md` | `references/pr_state_dedup.md` + `assets/*_checklist.md` + `assets/removal_plan.md` |
| `SKILL.md` Resource Loading Levels table (ALWAYS / CONDITIONAL) | `references/security_checklist.md`, … | `assets/security_checklist.md`, … |
| `SKILL.md` `DEFAULT_RESOURCES` | `references/…` (3 paths) | `assets/…` (3 paths) |
| `SKILL.md` `RESOURCE_MAP` (7 intent keys) | `references/…` | `assets/…` |
| `SKILL.md §7` reference list (5 links) | `./references/…` | `./assets/…` |
| `SKILL.md §8` references prose | `references/…` (5 names) | `assets/…` |
| `README.md` reference table | `references/<6>` | `assets/<6>` |
| `graph-metadata.json` | `references/<moved>` entities/key_files | `assets/<moved>` |
| 3 staying refs' cross-links | `./code_quality_checklist.md` … | `../assets/…` |
| moved files' inbound cross-links | `./quick_reference.md` | `../references/quick_reference.md` |
| `manual_testing_playbook/**` | 19 per-feature source anchors | re-pathed to `assets/` |
| cross-skill `sk-code/references/opencode/{python,shell}/quality_standards.md` | `references/<checklist>` | `assets/<checklist>` |

**Rule canary unaffected**: it keys on `pr_state_dedup.md`, a staying reference, so the move did not touch its invariant.

---

## 5. Runtime Mirrors

### Before
The untracked `.claude/` and `.codex/` skill mirrors still held the old `references/`-only layout (only `.opencode/` is git-tracked).

### After
Both mirrors re-synced; their `assets/` match `.opencode`.

---

## 6. Version Metadata + Changelog

### Before
`SKILL.md version: 1.2.0.0`; latest changelog `v1.4.0.0.md`. (sk-code-review tracks its version only in `SKILL.md` — there is no `description.json`.)

### After
`version: 1.5.0.0`; new changelog `changelog/v1.5.0.0.md` records the reclassification. SKILL version now equals the latest changelog (`v1.5.0.0`).

---

## Verification (live re-run on `system-speckit/027`)

| Check | Command | Result |
|-------|---------|--------|
| Six moved checklists are valid assets | `validate_document.py --type asset` (×6) | **6/6 VALID** |
| No stale `references/<moved>` outside changelogs | `rg … --glob '!**/changelog/**'` | **0 hits** |
| Six files physically in `assets/`; none left in `references/` | `ls assets/ ; ls references/` | confirmed (refs = 4 genuine) |
| SKILL still validates | `validate_document.py SKILL.md --type skill` | **VALID** |
| Load-bearing review wording intact | `check-rule-copies.js` | exit 0 |
| SKILL version == latest changelog | `grep version` vs `ls changelog/` | `1.5.0.0` == `v1.5.0.0.md` |

> Note: 10 `references/<moved>` strings remain **inside `changelog/v1.1`–`v1.4`** by design — those are point-in-time release records; the move is documented in `v1.5.0.0` rather than rewriting history.

---

## What Did **Not** Change

- Any review checklist item, severity model, or finding-format doctrine.
- The four genuine references (`review_core`, `review_ux_single_pass`, `quick_reference`, `pr_state_dedup`) — unchanged except outbound cross-link re-pathing.
- The rule canary's invariant (keyed on `pr_state_dedup.md`).
- Historical changelogs `v1.1`–`v1.4` (left as accurate point-in-time records).
