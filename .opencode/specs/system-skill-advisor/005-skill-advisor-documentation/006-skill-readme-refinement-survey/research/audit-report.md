# Skill README Refinement Audit Report

**Audited at**: 2026-05-16T13:06:00Z  
**Auditor**: cli-devin/swe-1.6  
**Scope**: 17 skill README files for refinement opportunities mirroring packet 005 (a1a1ca9d3)

## Executive Summary

The audit found widespread Section 1 table violations across 15 of 17 skill READMEs, with 35 total tables in `## 1. OVERVIEW` sections that must be removed or converted per the zero-table rule. The cli-* family (5 skills) and sk-* family (3 skills) show the heaviest table density. Em dash usage is concentrated in cli-devin (29 instances) with minor occurrences in mcp-coco-index (2 instances). Banned word violations are minimal (2 instances of "leverage" in sk-doc, both in explanatory HVR context). No banned phrases were found. No frontmatter drift was detected. Cross-skill coupling is minimal and appropriate where present (legitimate consumer dependencies and sibling comparisons).

## Summary Table

| Skill | Refinement Score | §1 Tables | Em Dashes | Banned Words | Banned Phrases | Coupling Hits |
|-------|-------------------|-----------|-----------|--------------|----------------|--------------|
| cli-claude-code | heavy | 4 | 0 | 0 | 0 | 0 |
| cli-codex | heavy | 4 | 0 | 0 | 0 | 0 |
| cli-devin | heavy | 3 | 29 | 0 | 0 | 3 (all legitimate) |
| cli-gemini | heavy | 4 | 0 | 0 | 0 | 0 |
| cli-opencode | heavy | 4 | 0 | 0 | 0 | 0 |
| deep-agent-improvement | heavy | 3 | 0 | 0 | 0 | 0 |
| deep-ai-council | light | 1 | 0 | 0 | 0 | 0 |
| deep-research | light | 1 | 0 | 0 | 0 | 0 |
| deep-review | medium | 3 | 0 | 0 | 0 | 0 |
| mcp-chrome-devtools | medium | 3 | 0 | 0 | 0 | 0 |
| mcp-coco-index | medium | 2 | 2 | 0 | 0 | 1 (legitimate) |
| mcp-code-mode | medium | 3 | 0 | 0 | 0 | 0 |
| sk-code-review | medium | 2 | 0 | 0 | 0 | 1 (legitimate) |
| sk-code | heavy | 3 | 0 | 0 | 0 | 0 |
| sk-doc | medium | 2 | 0 | 2 | 0 | 0 |
| sk-git | none | 0 | 0 | 0 | 0 | 0 |
| sk-prompt | none | 0 | 0 | 0 | 0 | 0 |

## Per-Skill Detail

### Heavy Refinement Required (21+ hits or P0 coupling)

#### cli-claude-code (4 §1 tables)
- **Section 1 tables**: Lines 50-60 (Key Statistics), 62-71 (Comparison table), 73-85 (Key Features), 88-93 (Requirements)
- **Conversion hints**: Statistics to paragraph, comparison to §3, features to bullets, requirements to paragraph
- **No other violations**

#### cli-codex (4 §1 tables)
- **Section 1 tables**: Lines 50-61 (Key Statistics), 63-73 (Comparison table), 75-86 (Key Features), 88-93 (Requirements)
- **Conversion hints**: Statistics to paragraph, comparison to §3, features to bullets, requirements to paragraph
- **No other violations**

#### cli-devin (3 §1 tables + 29 em dashes)
- **Section 1 tables**: Lines 50-58 (Key Statistics), 60-72 (Comparison table), 74-84 (Key Features)
- **Conversion hints**: Statistics to paragraph, comparison to §3, features to bullets
- **Em dashes**: 29 instances throughout (lines 3, 14, 42, 44, 57, etc.) - primarily in description and feature descriptions
- **Cross-skill coupling**: 3 legitimate references to cli-opencode (line 135), sk-code (line 344), mcp-code-mode (line 345) in Related section - all appropriate

#### cli-gemini (4 §1 tables)
- **Section 1 tables**: Lines 52-62 (Key Statistics), 64-73 (Comparison table), 75-85 (Key Features), 88-93 (Requirements)
- **Conversion hints**: Statistics to paragraph, comparison to §3, features to bullets, requirements to paragraph
- **No other violations**

#### cli-opencode (4 §1 tables)
- **Section 1 tables**: Lines 52-62 (Key Statistics), 64-74 (Comparison table), 76-88 (Key Features), 91-95 (Requirements)
- **Conversion hints**: Statistics to paragraph, comparison to §3, features to bullets, requirements to paragraph
- **No other violations**

#### deep-agent-improvement (3 §1 tables)
- **Section 1 tables**: Lines 40-47 (Key Statistics), 50-57 (What Changes comparison), 59-72 (Key Capabilities)
- **Conversion hints**: Statistics to paragraph, comparison to bullets, capabilities to bullets
- **No other violations**

#### sk-code (3 §1 tables)
- **Section 1 tables**: Lines 48-57 (Key Statistics), 59-68 (Comparison table), 70-81 (Key Features)
- **Conversion hints**: Statistics to paragraph, comparison to §3, features to bullets
- **No other violations**

### Medium Refinement Required (6-20 hits)

#### deep-review (3 §1 tables)
- **Section 1 tables**: Lines 40-52 (Key Statistics), 54-63 (When to Use), 69-78 (How This Compares)
- **Conversion hints**: Statistics to paragraph, use-cases to paragraph, comparison to §3
- **No other violations**

#### mcp-chrome-devtools (3 §1 tables)
- **Section 1 tables**: Lines 51-61 (Key Statistics), 64-69 (How This Compares), 72-85 (Key Features)
- **Conversion hints**: Statistics to paragraph, comparison to §3, features to §3
- **No other violations**

#### mcp-coco-index (2 §1 tables + 2 em dashes)
- **Section 1 tables**: Lines 71-82 (Key Statistics), 84-90 (How This Compares)
- **Conversion hints**: Statistics to paragraph, comparison to §3
- **Em dashes**: Lines 33, 35 (both in explanatory context about fork patches)
- **Cross-skill coupling**: Line 92 references system-code-graph as semantic+structural pair - appropriate
- **No other violations**

#### mcp-code-mode (3 §1 tables)
- **Section 1 tables**: Lines 50-58 (Key Statistics), 60-66 (How This Compares), 72-78 (Key Features)
- **Conversion hints**: All comparison tables to §3, features to bullets
- **No other violations**

#### sk-code-review (2 §1 tables)
- **Section 1 tables**: Lines 50-59 (Key Statistics), 62-71 (How This Compares)
- **Conversion hints**: Statistics to paragraph, comparison to §3
- **Cross-skill coupling**: Line 44 references sk-code as consumer dependency - appropriate
- **No other violations**

#### sk-doc (2 §1 tables + 2 banned words)
- **Section 1 tables**: Lines 52-62 (Key Statistics), 64-74 (How This Compares)
- **Conversion hints**: Statistics to paragraph, comparison to §3
- **Banned words**: "leverage" at lines 46, 376 (both in explanatory HVR context - acceptable but noted)
- **No other violations**

### Light Refinement Required (1-5 hits)

#### deep-ai-council (1 §1 table)
- **Section 1 tables**: Lines 70-77 (Key Capabilities)
- **Conversion hint**: to-bullets
- **No other violations**

#### deep-research (1 §1 table)
- **Section 1 tables**: Lines 81-99 (Key Features - 16-row table)
- **Conversion hint**: to-bullets
- **No other violations**

### No Refinement Required

#### sk-git
- **No violations found** - clean README with no Section 1 tables, em dashes, banned words, banned phrases, frontmatter drift, or inappropriate coupling

#### sk-prompt
- **No violations found** - clean README with no Section 1 tables, em dashes, banned words, banned phrases, frontmatter drift, or inappropriate coupling

## Top-10 Highest-Priority Cleanups

1. **cli-devin** - 29 em dashes throughout (lines 3, 14, 42, 44, 57, etc.) - replace with commas, colons, or restructure sentences
2. **cli-claude-code** - Remove 4 Section 1 tables (lines 50-60, 62-71, 73-85, 88-93) - convert to prose or move to §3
3. **cli-codex** - Remove 4 Section 1 tables (lines 50-61, 63-73, 75-86, 88-93) - convert to prose or move to §3
4. **cli-gemini** - Remove 4 Section 1 tables (lines 52-62, 64-73, 75-85, 88-93) - convert to prose or move to §3
5. **cli-opencode** - Remove 4 Section 1 tables (lines 52-62, 64-74, 76-88, 91-95) - convert to prose or move to §3
6. **sk-code** - Remove 3 Section 1 tables (lines 48-57, 59-68, 70-81) - convert to prose or move to §3
7. **deep-agent-improvement** - Remove 3 Section 1 tables (lines 40-47, 50-57, 59-72) - convert to prose or bullets
8. **deep-review** - Remove 3 Section 1 tables (lines 40-52, 54-63, 69-78) - convert to prose or move to §3
9. **mcp-chrome-devtools** - Remove 3 Section 1 tables (lines 51-61, 64-69, 72-85) - convert to prose or move to §3
10. **mcp-code-mode** - Remove 3 Section 1 tables (lines 50-58, 60-66, 72-78) - convert to prose or move to §3

## Notes

- **Cross-skill coupling**: All detected instances are legitimate (consumer dependencies, sibling CLI comparisons, semantic+structural pairs). No inappropriate documentation of other skills' internals found.
- **Banned words**: Only 2 instances of "leverage" in sk-doc, both in explanatory HVR context describing what words are banned. These are acceptable but noted for completeness.
- **Banned phrases**: None found across all 17 files.
- **Frontmatter drift**: None detected - all frontmatters contain only canonical keys (title, description, trigger_phrases, importance_tier where applicable).
- **Em dash pattern**: Concentrated in cli-devin (29 instances), likely due to descriptive style in feature explanations. Should be replaced with commas, colons, or sentence restructuring per HVR rules.
- **Section 1 table pattern**: Consistent across cli-* family (4 tables each) and sk-* family (2-3 tables each). These tables present statistics, comparisons, and feature lists that should be converted to prose or moved to later sections per the zero-table rule.
