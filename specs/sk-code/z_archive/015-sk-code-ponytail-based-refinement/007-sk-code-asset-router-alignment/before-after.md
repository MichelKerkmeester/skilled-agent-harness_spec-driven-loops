---
title: "Before / After: sk-code Asset-Template + Smart-Router Alignment"
description: "Side-by-side before/after for the sk-code §2 router conformance, the five authoring-checklist asset-template fixes, and the two reference link-label cleanups, with live re-verification evidence."
trigger_phrases:
  - "sk-code before after"
  - "router conformance before after"
  - "authoring checklist asset alignment before after"
importance_tier: "normal"
contextType: "general"
---

# Before / After — Phase 007: sk-code Asset-Template + Smart-Router Alignment

> **Scope**: `sk-code/SKILL.md §2` router conformance + five `*_authoring.md` asset fixes + two reference label cleanups.
> **Commits**: `6ec94ed17e` (feature) and `a46b4afa4b` (version bump).
> **Standard conformed to**: `sk-doc` `skill_asset_template.md`, `skill_smart_router.md`, `skill_md_template.md`.
> This is a **supplementary** doc (no `_memory:` block, no template markers) so it is not structure-validated by `validate.sh --strict`.

---

## At a Glance

| # | Area | Before | After |
|---|------|--------|-------|
| 1 | Router §2 — loading levels | No inline `Resource Loading Levels` table; tiers only existed in `references/smart_routing.md` | Canonical `ALWAYS / CONDITIONAL / ON_DEMAND` table inline, pointing to `smart_routing.md §3` for the finer tiers |
| 2 | Router §2 — fallback | `UNKNOWN_FALLBACK` disambiguation lived only in `references/smart_routing.md §8` | Inline `UNKNOWN_FALLBACK Checklist` in `SKILL.md §2`, deferring to `smart_routing.md §8` for full logic |
| 3 | 5 `*_authoring.md` checklists | Led with `## 1. PURPOSE` + `## 2. WHEN TO USE`; **failed** `validate --type asset` (`missing_required_section: overview`) | `## 1. OVERVIEW` with `### Purpose` + `### Usage`, renumbered sections, `---` dividers, 1-line intro; **all 11 pass** |
| 4 | 2 references (`phase_detection`, `stack_detection`) | Stale link **labels** (`code_surface_detection.md`, `intent_classification.md`, `resource_loading.md`) + a duplicate link in each | Labels match real targets (`stack_detection.md`, `smart_routing.md`) with one-line descriptions; duplicates removed |
| 5 | Version metadata | `SKILL.md version: 3.3.1.0`; `description.json version: 3.3.0.0`; latest changelog `v3.4.0.0` | `SKILL.md` + `description.json` both `3.5.0.0`; new changelog `v3.5.0.0.md` |

**Design preserved**: the surface-first **two-axis** router (Code Surface → Intent) and the deferral of heavy `INTENT_SIGNALS` / `RESOURCE_MAP` pseudocode to `references/smart_routing.md` were **not** changed. No `STACK_FOLDERS` map edit, no Iron Law wording change, no routing-behavior change.

---

## 1. Smart Router §2 — Resource Loading Levels (NEW, inline)

The router had per-surface and authoring-time loads described in prose but no canonical loading-levels table; the three-tier model only existed inside `references/smart_routing.md`. The reader had to leave `SKILL.md` to see what loads when.

### Before
No `### Resource Loading Levels` heading in `SKILL.md §2`.

### After
```text
### Resource Loading Levels

| Level       | When to Load                                   | Resources |
| ALWAYS      | Every sk-code invocation                       | stack_detection.md, smart_routing.md, phase_detection.md, references/universal/ baseline |
| CONDITIONAL | After surface + intent (+ OPENCODE language)   | detected references/<surface>/ + assets/<surface>/, language standards, intent-mapped + authoring checklists, references/motion_dev/ |
| ON_DEMAND   | Only on explicit deep-dive request             | extended checklists, niche references, full INTENT_MODEL / RESOURCE_MAP in smart_routing.md |
```
A one-line note keeps the finer `ALWAYS / SURFACE / INTENT / LANGUAGE / ON_DEMAND` tiers factored into `smart_routing.md §3` — no DRY duplication.

---

## 2. Smart Router §2 — UNKNOWN_FALLBACK Checklist (NEW, inline)

When no surface matched, the disambiguation behavior was documented only in `references/smart_routing.md §8`, so a reader scanning the router could not see the fallback contract.

### Before
No inline fallback checklist; `§2` ended at Phase Detection with no "what if nothing matches" block.

### After
A `### UNKNOWN_FALLBACK Checklist` block now sits inline: it fires when no supported surface matches, when `max(intent_scores) < 0.5`, or when the user explicitly asks for stack-agnostic guidance, and it instructs the agent to **ask** for the runtime surface, the task intent, one concrete input/error, and the verification command set — rather than guessing — while reminding it not to load Go / Next.js / React Native / Swift resources (canonical `sk-code` owns only WEBFLOW + OPENCODE + MOTION_DEV). Full logic still deferred to `smart_routing.md §8`.

---

## 3. Five `*_authoring.md` Checklists — Asset-Template OVERVIEW

`agent_authoring.md`, `command_authoring.md`, `mcp_server_authoring.md`, `skill_authoring.md`, `spec_folder_authoring.md` (under `assets/opencode/checklists/`) led with `## 1. PURPOSE`, so `validate_document.py --type asset` rejected them with `missing_required_section: overview`. The six sibling `*_checklist.md` files already passed.

### Before (per file)
```text
# <Title>
## 1. PURPOSE
<purpose prose>
## 2. WHEN TO USE
<usage bullets>
## 3. PRE-CHECKS
## 4. STEPS
## 5. POST-CHECKS
## 6. RELATED RESOURCES
```

### After (per file)
```text
# <Title>
<1-line intro sentence>
## 1. OVERVIEW
### Purpose
<purpose prose, unchanged>
### Usage
<the former WHEN TO USE bullets, unchanged>
---
## 2. PRE-CHECKS
---
## 3. STEPS
---
## 4. POST-CHECKS
---
## 5. RELATED RESOURCES
```

The change was **structural only** — no checklist item was added, removed, or reworded. Filenames were kept (they are load-bearing by name in the router).

---

## 4. Two References — Stale Link Labels + Dedup

`phase_detection.md` and `stack_detection.md` linked to real files but with **wrong display labels** left over from a pre-merge file layout, and each carried a duplicate link.

### Before
```text
- [code_surface_detection.md](./stack_detection.md)
- [intent_classification.md](./smart_routing.md)
- [resource_loading.md](./smart_routing.md)        # 3rd item duplicated target of 2nd
- `references/smart_routing.md`                     # listed twice in stack_detection.md
```

### After
```text
- [stack_detection.md](./stack_detection.md) — surface detection and OPENCODE language sub-detection
- [smart_routing.md](./smart_routing.md) — intent classification, resource maps, and load tiers
```
Labels now match their targets, duplicates removed, each link gained a one-line description. Link **targets** were already correct, so no resolution changed.

---

## 5. Version Metadata + Changelog

### Before
`SKILL.md version: 3.3.1.0`, `description.json version: 3.3.0.0`, latest changelog `v3.4.0.0.md` — the SKILL version lagged its changelog stream.

### After
`SKILL.md` and `description.json` both `3.5.0.0`; new changelog `changelog/v3.5.0.0.md` documents the §2 conformance + checklist alignment + reference cleanup. SKILL version now equals the latest changelog (`v3.5.0.0`).

---

## Collateral Changes Carried in the Same Commit

Two edits rode along in `6ec94ed17e` that were **outside** 007's stated additive scope. Recorded here for transparency; both are reversible and lost no information.

| Change | Detail | Disposition |
|--------|--------|-------------|
| Removed the `🎯 Template customization surface` callout from `SKILL.md §1` | It was a pointer paragraph duplicating the root **README §4 "Customizing for Your Stack"** (README.md:1305), which still carries the full customization map | No guidance lost — README §4 is the canonical home; the SKILL.md copy was redundant |
| Added a `Baseline & blast-radius` paragraph after the Iron Law | Auto-inserted by the repo linter/hook; restates the CLAUDE.md "baseline before no-regressions" + "match effort to blast-radius" operating discipline | Kept — aligns with house operating discipline |

---

## Verification (live re-run on `system-speckit/027`)

| Check | Command | Result |
|-------|---------|--------|
| All 11 checklists are valid assets | `validate_document.py --type asset` (×11) | **11/11 VALID** |
| SKILL still validates | `validate_document.py SKILL.md --type skill` | **VALID** |
| Router drift guard | `sk-code-router-sync.vitest.ts` (prior run) | green 4/4 |
| STACK_FOLDERS still parseable | `verify_stack_folders.py` (prior run) | exit 0 |
| Iron Law wording intact | `check-rule-copies.js` | exit 0 |
| SKILL version == latest changelog | `grep version` vs `ls changelog/` | `3.5.0.0` == `v3.5.0.0.md` |

---

## What Did **Not** Change

- The two-axis surface-first routing design and the `STACK_FOLDERS` dict literal.
- The full `INTENT_SIGNALS` / `RESOURCE_MAP` / discovery pseudocode (stays factored in `references/smart_routing.md`).
- Both Iron Law lines (verbatim, canary-guarded).
- The Design Restraint Ladder gate placement (Phase 0→1, after surface+intent routing).
- Any checklist item text in the five authoring files.
