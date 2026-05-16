---
title: "Phase 4 Batch A — Edit Evidence"
batch: A
scope: "3 SKILL.md files"
status: complete
timestamp: 2026-05-15
---

# Phase 4 Batch A — Edit Evidence

Surgical realignment of 3 SKILL.md files toward `.opencode/skills/sk-doc/assets/skill/skill_md_template.md`, per the verified delta in `delta-verified.md` §1 Group A.

## Summary

| File | Lines Before | Lines After | Anchors Before | Anchors After | EDITs Applied | Validate |
|------|--------------|-------------|----------------|---------------|---------------|----------|
| `.opencode/skills/system-spec-kit/SKILL.md` | 466 | 487 | 0 | 7 pairs | 17 (A-001..A-017) | exit 0, 0 issues |
| `.opencode/skills/system-code-graph/SKILL.md` | 146 | 148 | 8 pairs | 9 pairs* | 1 (A-018) | exit 0, 0 issues |
| `.opencode/skills/system-skill-advisor/SKILL.md` | 215 | 214 | 8 pairs | 8 pairs | 2 (A-019, A-020) | exit 0, 0 issues |
| **Total** | **827** | **849** | **16** | **24** | **20** | **3/3 clean** |

*system-code-graph anchor count is structural pairs (NAMING NOTE + 8 §-anchors). The Group A edit did not touch anchor structure for this file — table-row insertion only.

## File 1: `.opencode/skills/system-spec-kit/SKILL.md`

### EDIT A-001 to A-014 — Add 7 anchor pairs around §1-§7 (iter 002)

Template pattern: `<!-- ANCHOR:{n}-{kebab} -->` ... `<!-- /ANCHOR:{n}-{kebab} -->` wrapping each numbered H2 section.

#### A-001 / A-002 — Section 1: WHEN TO USE

BEFORE (lines 14-76):
```text
## 1. WHEN TO USE

### What is a Spec Folder?
[...content...]
**Rule:** When detected, proactively suggest the appropriate action.

---

## 2. SMART ROUTING
```

AFTER:
```text
<!-- ANCHOR:1-when-to-use -->
## 1. WHEN TO USE

### What is a Spec Folder?
[...content...]
**Rule:** When detected, proactively suggest the appropriate action.

<!-- /ANCHOR:1-when-to-use -->

---

<!-- ANCHOR:2-smart-routing -->
## 2. SMART ROUTING
```

#### A-003 / A-004 — Section 2: SMART ROUTING

BEFORE:
```text
    return result
```

---

## 3. HOW IT WORKS
```

AFTER:
```text
    return result
```

<!-- /ANCHOR:2-smart-routing -->

---

<!-- ANCHOR:3-how-it-works -->
## 3. HOW IT WORKS
```

#### A-005 / A-006 — Section 3: HOW IT WORKS

BEFORE (end of §3):
```text
...stale.

---

## 4. RULES

### ✅ ALWAYS
```

AFTER:
```text
...stale.

<!-- /ANCHOR:3-how-it-works -->

---

<!-- ANCHOR:4-rules -->
## 4. RULES

### ALWAYS
```

#### A-007 / A-008 — Section 4: RULES

BEFORE (end of §4):
```text
5. **Validation fails with errors** - Report specific failures, provide fix guidance, re-run after fixes

---

## 5. SUCCESS CRITERIA
```

AFTER:
```text
5. **Validation fails with errors** - Report specific failures, provide fix guidance, re-run after fixes

<!-- /ANCHOR:4-rules -->

---

<!-- ANCHOR:5-success-criteria -->
## 5. SUCCESS CRITERIA
```

#### A-009 / A-010 — Section 5: SUCCESS CRITERIA

BEFORE:
```text
...`validate.sh --strict` has no blocking errors.

---

## 6. INTEGRATION POINTS
```

AFTER:
```text
...`validate.sh --strict` has no blocking errors.

<!-- /ANCHOR:5-success-criteria -->

---

<!-- ANCHOR:6-integration-points -->
## 6. INTEGRATION POINTS
```

#### A-011 / A-012 — Section 6: INTEGRATION POINTS

BEFORE:
```text
...Every conversation that modifies files MUST have a spec folder.

---

## 7. REFERENCES AND RELATED RESOURCES
```

AFTER:
```text
...Every conversation that modifies files MUST have a spec folder.

<!-- /ANCHOR:6-integration-points -->

---

<!-- ANCHOR:7-references-and-related-resources -->
## 7. REFERENCES AND RELATED RESOURCES
```

#### A-013 / A-014 — Section 7: REFERENCES AND RELATED RESOURCES

BEFORE (end of file):
```text
Related skills: `sk-doc` for authored documentation quality, `sk-code` for code changes, `sk-git` for git handoff, `deep-research` for iterative research, and `deep-review` for iterative audit workflows.
```

AFTER:
```text
Related skills: `sk-doc` for authored documentation quality, `sk-code` for code changes, `sk-git` for git handoff, `deep-research` for iterative research, and `deep-review` for iterative audit workflows.

<!-- /ANCHOR:7-references-and-related-resources -->
```

### EDIT A-015 — Strip emoji prefix from `### ✅ ALWAYS` (iter 001)

BEFORE: `### ✅ ALWAYS`
AFTER: `### ALWAYS`

Rationale: Template §3 specifies `Subsections MUST be named ALWAYS, NEVER, and ESCALATE IF (or ESCALATE WHEN)`. Emoji prefixes are not part of the template's exact naming requirement.

### EDIT A-016 — Strip emoji prefix from `### ❌ NEVER` (iter 001)

BEFORE: `### ❌ NEVER`
AFTER: `### NEVER`

### EDIT A-017 — Strip emoji prefix from `### ⚠️ ESCALATE IF` (iter 001)

BEFORE: `### ⚠️ ESCALATE IF`
AFTER: `### ESCALATE IF`

## File 2: `.opencode/skills/system-code-graph/SKILL.md`

### EDIT A-018 — Add 2 missing tools to Smart Routing table (iter 005)

Iter-005 verified two tools registered in code that were missing from the §2 Smart Routing table:

1. `code_graph_apply` — exists in `mcp_server/tool-schemas.ts` CODE_GRAPH_TOOL_SCHEMAS (lines 156-179) and `mcp_server/tools/code-graph-tools.ts` TOOL_NAMES (line 33).
2. `code_graph_classify_query_intent` — exists in `mcp_server/tool-schemas.ts` CODE_GRAPH_TOOL_SCHEMAS (lines 120-130) and TOOL_NAMES (line 31).

BEFORE (table had 8 rows):
```markdown
| Intent | Primary Surface | Reference |
|--------|-----------------|-----------|
| Index or refresh structural graph state | `mcp__mk_code_index__code_graph_scan` | ... |
| Query callers, imports, dependencies, symbols or blast radius | `mcp__mk_code_index__code_graph_query` | ... |
| Build compact neighborhood context around seeds | `mcp__mk_code_index__code_graph_context` | ... |
| Check readiness, freshness, graph quality or blocked-read state | `mcp__mk_code_index__code_graph_status` | ... |
| Validate graph quality with gold queries | `mcp__mk_code_index__code_graph_verify` | ... |
| Inspect changed symbols from a diff | `mcp__mk_code_index__detect_changes` | ... |
| Bridge CocoIndex status, reindexing and feedback | `mcp__mk_code_index__ccc_*` | ... |
| Review doctor code-graph apply policy | `/doctor code-graph` | ... |
```

AFTER (table has 10 rows):
```markdown
| Intent | Primary Surface | Reference |
|--------|-----------------|-----------|
| Index or refresh structural graph state | `mcp__mk_code_index__code_graph_scan` | ... |
| Query callers, imports, dependencies, symbols or blast radius | `mcp__mk_code_index__code_graph_query` | ... |
| Classify natural-language queries into structural/semantic/hybrid intent | `mcp__mk_code_index__code_graph_classify_query_intent` | n/a (no dedicated reference) |
| Build compact neighborhood context around seeds | `mcp__mk_code_index__code_graph_context` | ... |
| Check readiness, freshness, graph quality or blocked-read state | `mcp__mk_code_index__code_graph_status` | ... |
| Validate graph quality with gold queries | `mcp__mk_code_index__code_graph_verify` | ... |
| Inspect changed symbols from a diff | `mcp__mk_code_index__detect_changes` | ... |
| Execute verification-gated apply-mode recovery operations | `mcp__mk_code_index__code_graph_apply` | `feature_catalog/08--doctor-code-graph/01-doctor-apply-mode.md` |
| Bridge CocoIndex status, reindexing and feedback | `mcp__mk_code_index__ccc_*` | ... |
| Review doctor code-graph apply policy | `/doctor code-graph` | ... |
```

Notes:
- Existing column header `Primary Surface` retained (the delta's `Tool` heading was indicative; the file's local column structure is the source of truth).
- `code_graph_classify_query_intent` reference cell uses `n/a (no dedicated reference)` since iter-005 explicitly noted "[Add appropriate reference if documentation exists]" — no dedicated reference doc exists in `feature_catalog/`.
- `code_graph_apply` reference points to `01-doctor-apply-mode.md` (the doctor apply mode is its operational surface).

## File 3: `.opencode/skills/system-skill-advisor/SKILL.md`

### EDIT A-019 — Remove `importance_tier` frontmatter key (iter 006)

Iter-006 verified `importance_tier` is unused in advisor scoring logic. Only appears in test fixture `tests/skill-graph-db.vitest.ts:74`. The other extra keys (`trigger_phrases`, `keywords`, `intent_signals`) are ACTIVE scoring inputs and retained per iter-006.

BEFORE (frontmatter):
```yaml
  - "system skill advisor"
importance_tier: critical
keywords:
```

AFTER:
```yaml
  - "system skill advisor"
keywords:
```

Note: actual file had `importance_tier: critical` (not the `"important"` literal cited in delta — that was the delta's authoritative key reference). The key was removed regardless of value, per iter-006 verdict.

### EDIT A-020 — Update lib/skill-graph current-state language (iter 015)

Iter-015 verified `lib/skill-graph/` is fully present at `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/` (README.md, skill-graph-db.ts, skill-graph-queries.ts) and is NOT present in system-spec-kit. The "pending packet 011 cleanup" reference is obsolete.

BEFORE (line 189 of original, in §7 INTEGRATION POINTS):
```text
- `lib/skill-graph/` database/query logic remains in `system-spec-kit` until the pending packet 011 cleanup.
```

AFTER:
```text
- `lib/skill-graph/` database/query logic is fully migrated to `system-skill-advisor` (extraction complete).
```

## Validation Results

All 3 files pass `validate_document.py --type skill`:

```text
.opencode/skills/system-spec-kit/SKILL.md       → VALID, 0 issues, exit 0
.opencode/skills/system-code-graph/SKILL.md     → VALID, 0 issues, exit 0
.opencode/skills/system-skill-advisor/SKILL.md  → VALID, 0 issues, exit 0
```

## Voice Preservation

No prose rewrites. Edits are surgical:
- Anchor tags are non-prose metadata comments.
- Emoji removal preserves the existing rule-text body and ordering.
- Smart Routing table additions follow the existing row format and tone.
- Frontmatter key removal is metadata-only.
- The line-189 update preserves the existing INTEGRATION POINTS bullet phrasing and replaces only the obsolete current-state claim.

HVR rules apply only to new prose. No new prose authored in this batch.

## Outcome

Batch A complete. 20 EDITs applied across 3 SKILL.md files (17 + 1 + 2). All 3 files pass `validate_document.py --type skill` with 0 issues. system-spec-kit/SKILL.md now has full anchor coverage (7 pairs) and template-compliant `### ALWAYS` / `### NEVER` / `### ESCALATE IF` subsection names. system-code-graph/SKILL.md Smart Routing table is now complete with 10 tool surfaces (was 8). system-skill-advisor/SKILL.md frontmatter no longer carries the unused `importance_tier` key, and the §7 INTEGRATION POINTS reflects the completed `lib/skill-graph/` extraction.
