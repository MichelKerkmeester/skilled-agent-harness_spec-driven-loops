---
title: "Phase 004: Trigger Phrases — system-skill-advisor + system-code-graph"
description: "Add or improve trigger_phrases in 40 skill-advisor snippets and 14 code-graph snippets. Audit existing phrases for quality; fill all gaps."
importance_tier: "normal"
contextType: "general"
---
# Phase 004: Trigger Phrases — system-skill-advisor + system-code-graph

<!-- SPECKIT_LEVEL: 1 -->

---

## 1. METADATA

| Field | Value |
|---|---|
| **Parent** | 125-feature-catalog-template-improvements |
| **Phase** | 004 |
| **Status** | Planned |
| **Method** | AI agent batches per category |
| **Prerequisite** | Phase 002 complete |
| **Skill targets** | system-skill-advisor, system-code-graph |

---

## 2. PROBLEM & PURPOSE

Both skills have partial trigger_phrases adoption (the 57 files with trigger_phrases across all skills are concentrated here). Phase 004 audits existing phrases for quality and fills remaining gaps. These are smaller, faster to complete than spec-kit.

---

## 3. SCOPE

### system-skill-advisor (40 snippets, 7 categories)
```
01--daemon-and-freshness (7 files)
02--auto-indexing (6 files)
03--lifecycle-routing (5 files)
04--scorer-fusion (6 files)
06--mcp-surface (9 files)
07--hooks-and-plugin (4 files)
08--python-compat (3 files)
```

### system-code-graph (14 snippets, 7 categories)
```
01--read-path-freshness (2 files)
02--manual-scan-verify-status (3 files)
03--detect-changes (1 file)
04--context-retrieval (2 files)
05--coverage-graph (4 files)
06--mcp-tool-surface (1 file)
08--doctor-code-graph (1 file)
```

### Quality audit on existing phrases
Both skills already have partial trigger_phrases. Audit each:
- Fewer than 3 phrases → add more
- Phrases don't include the tool function name → add it
- Generic phrases only → replace with specific ones

---

## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| R-001 | All 54 snippets have `trigger_phrases:` | grep -rL returns 0 for both skills |
| R-002 | Minimum 3 phrases per snippet | No snippet has < 3 phrases |
| R-003 | Existing weak phrases improved | Files previously with 1-2 phrases now have 3+ |
| R-004 | MCP tool names present where applicable | `advisor_recommend`, `code_graph_query` etc. are phrases |

---

## 5. SUCCESS CRITERIA

- 54 snippets have `trigger_phrases:` with ≥ 3 quality phrases
- Zero snippets have generic-only phrases
- MCP tool names and CLI command names are trigger phrases where applicable
