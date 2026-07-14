---
title: "Phase 003: Trigger Phrases — system-spec-kit"
description: "Add trigger_phrases frontmatter to all 313 system-spec-kit snippets, derived from root catalog H3 headings and feature file content. Batched by category with parallel AI agents."
importance_tier: "normal"
contextType: "general"
---
# Phase 003: Trigger Phrases — system-spec-kit

<!-- SPECKIT_LEVEL: 1 -->

---

## 1. METADATA

| Field | Value |
|---|---|
| **Parent** | 125-feature-catalog-template-improvements |
| **Phase** | 003 |
| **Status** | Planned |
| **Method** | Parallel AI agents, one per category |
| **Prerequisite** | Phase 002 complete |
| **Skill target** | system-spec-kit |

---

## 2. PROBLEM & PURPOSE

`trigger_phrases` drive skill-advisor routing and memory search. Without them, feature catalog snippets are invisible to search. 309 of 366 snippets across all skills are missing this field. system-spec-kit alone accounts for ~256 of those gaps across its 313 snippets (57 partial-adoption files are in advisor/code-graph).

---

## 3. SCOPE

### Target
- `system-spec-kit/feature_catalog/**/*.md` (313 snippet files, 25 categories)
- Excludes: `feature_catalog.md` master catalog (handled in phase 008)
- Files that already have `trigger_phrases:` — verify quality, improve if weak (< 3 phrases)

### Categories (25 total)
```
01--retrieval (17 files)        14--pipeline-architecture (28 files)
02--mutation (13 files)         14--stress-testing (parallel dir)
03--discovery (9 files)         15--retrieval-enhancements (17 files)
04--maintenance (6 files)       16--tooling-and-scripts (47 files)
05--lifecycle (10 files)        17--governance (7 files)
06--analysis (10 files)         18--ux-hooks (21 files)
07--evaluation (4 files)        19--feature-flag-reference (14 files)
08--bug-fixes-and-data-integrity (15 files)   20--remediation-revalidation (5 files)
09--evaluation-and-measurement (17 files)     21--implement-and-remove-deprecated (7 files)
10--graph-signal-activation (20 files)        22--context-preservation (21 files)
11--scoring-and-calibration (23 files)        23--doctor-commands (3 files)
12--query-intelligence (13 files)             24--local-llm-query-intelligence (varies)
13--memory-quality-and-indexing (30 files)
```

---

## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| R-001 | All 313 snippets have `trigger_phrases:` | `grep -rL "trigger_phrases" .../feature_catalog/[0-9]*/*.md` returns 0 |
| R-002 | Minimum 3 phrases per snippet | No snippet has fewer than 3 trigger phrases |
| R-003 | Phrase #1 matches root catalog H3 heading | Canonical name is always present verbatim |
| R-004 | Tool/command name included where applicable | H1 parenthetical term is a trigger phrase |
| R-005 | No duplicate phrases within a file | Each phrase is unique |

---

## 5. SUCCESS CRITERIA

- 313 snippets have `trigger_phrases:` with ≥ 3 phrases
- Root catalog H3 headings are represented in every matching snippet
- MCP tool names and CLI command names appear as trigger phrases where H1 contains them
