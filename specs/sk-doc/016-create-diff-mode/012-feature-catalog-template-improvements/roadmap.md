---
title: "Roadmap: Feature Catalog Retroactive Rework"
description: "Master overview of all 9 phases — scope, execution model, dependencies, and estimated effort — for bringing 370 feature catalog files into conformance with the new standard."
---

# Roadmap: Feature Catalog Retroactive Rework

> **Scope**: 370 .md files across 3 skills (system-spec-kit: 314, system-skill-advisor: 41, system-code-graph: 15), 39 category directories, 3 master catalogs.

---

## Gap Summary (as of 2026-05-31)

| Gap | Files affected | Phase that fixes it |
|---|---|---|
| `CURRENT REALITY` heading → `HOW IT WORKS` | 365 | 002 |
| Missing template marker | 328 | 002 |
| Old 2-col validation table (`File \| Focus`) | 249 | 002 |
| Missing `trigger_phrases` in frontmatter | 309 | 003 + 004 |
| Long HOW IT WORKS without H3 sub-headings | TBD (audit in 002) | 005 + 006 |
| Missing `Related references` in SOURCE METADATA | 315 | 007 |
| Master catalogs missing `trigger_phrases` + `last_updated` | 3 | 008 |

---

## Phase Overview

| # | Name | Method | Files | Status |
|---|---|---|---|---|
| 001 | Template improvements | AI edits | 2 templates + creation reference | **Done** |
| 002 | Mechanical sweep | Python scripts | 365+ snippets (all 3 skills) | Planned |
| 003 | Trigger phrases — system-spec-kit | Parallel AI agents per category | 313 snippets, 25 categories | Planned |
| 004 | Trigger phrases — advisor + code-graph | AI agent batches | 54 snippets, 14 categories | Planned |
| 005 | Sub-headings — system-spec-kit | Audit script + AI per category | ~100-150 files (TBD) | Planned |
| 006 | Sub-headings — advisor + code-graph | AI agent batches | ~15-20 files (TBD) | Planned |
| 007 | Related references — all skills | Python script + frontmatter lookup | 315 snippets | Planned |
| 008 | Master catalog enrichment | AI edits | 3 master catalog files | Planned |
| 009 | Validation sweep | Verification script + targeted fixes | All 370 files | Planned |

---

## Phase Dependencies

```text
001 (done)
  └── 002 (must run first — establishes consistent heading/marker baseline)
        ├── 003 (trigger phrases: spec-kit)
        ├── 004 (trigger phrases: advisor + code-graph)
        ├── 005 (sub-headings: spec-kit — needs HOW IT WORKS heading to exist)
        ├── 006 (sub-headings: advisor + code-graph)
        ├── 007 (related references — independent of 003-006)
        └── 008 (master catalog enrichment — independent of 003-007)
              └── 009 (validation sweep — runs last, depends on all)
```

Phases 003–008 can run in any order after 002. Running 003+004 before 005+006 is recommended so trigger_phrases are visible during sub-heading review.

---

## Execution Models

### Script-based (002, 007)
Python scripts run locally. Idempotent — safe to re-run. Each script logs what it touched. Review git diff before committing.

### AI agent batched (003, 004, 005, 006, 008)
Parallel or sequential AI agents, one per category. Each agent reads the category's files + root catalog section and writes targeted edits. Batch size: 5-30 files per agent depending on file length.

### Validation (009)
Python audit script produces a per-file compliance report. Executor reviews report, applies targeted fixes, confirms 95%+ compliance before closing the phase.

---

## Key Standards Being Applied

All snippet files must reach this state:

```markdown
---
title: "{FEATURE_NAME}"
description: "{ONE_LINE}"
trigger_phrases:          ← required, ≥3 phrases
  - "{canonical name}"
  - "{tool/command name}"
  - "{natural language alternate}"
---

# {FEATURE_NAME} ({tool_name})

<!-- sk-doc-template: skill_asset_feature_catalog -->   ← required

## 1. OVERVIEW
...

## 2. HOW IT WORKS                                      ← not CURRENT REALITY

### {Primary Aspect}    ← H3 sub-headings required if >3 paragraphs
...

## 3. SOURCE FILES
### Validation And Tests
| File | Type | Role |                           ← 3-col, not 2-col "Focus"
...

## 4. SOURCE METADATA
- Group: ...
- Canonical catalog source: feature_catalog.md           ← lowercase
- Feature file path: ...

Related references:                                      ← required
- [neighbor.md](neighbor.md) — {title}
```

---

## Estimated Total Effort

| Phase | Estimated time |
|---|---|
| 002 | 1-2 hours (script authoring + execution) |
| 003 | 2-3 hours (25 category batches) |
| 004 | 1 hour (14 category batches) |
| 005 | 2-3 hours (audit + ~100-150 files) |
| 006 | 30 minutes (~15-20 files) |
| 007 | 30 minutes (script authoring + execution) |
| 008 | 15 minutes (3 files) |
| 009 | 1 hour (script + fixes) |
| **Total** | **~8-12 hours** |
