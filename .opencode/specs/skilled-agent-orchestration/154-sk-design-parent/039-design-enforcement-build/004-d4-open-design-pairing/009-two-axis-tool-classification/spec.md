---
title: "D4-R9 — Two-axis tool classification + ambiguous-read receipts"
description: "Split tool_surface §3 into mutationSafety × designInfluence, stop labeling ambiguous_read tools always-safe, and emit non-design-use receipts."
trigger_phrases:
  - "d4-r9 two-axis classification"
  - "ambiguous read receipts design build"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-scaffold | v1.0 -->
# D4-R9 — Two-axis tool classification + ambiguous-read receipts

## 1. OBJECTIVE
Re-model the tool surface as two independent axes — `mutationSafety` × `designInfluence` — so a tool that does not mutate can still be design-influencing, and emit non-design-use receipts for ambiguous reads.

## 2. WHY
A single safe/unsafe axis mislabels `ambiguous_read` tools (`list_projects`, `get_file`, `search_files`) as "always safe" even though their output can feed design decisions. Two axes plus receipts make read-then-launder detectable.

## 3. TARGET & CLASS
- **Target file(s):** `.opencode/skills/mcp-open-design/references/tool_surface.md:46` (§3)
- **Severity:** P1
- **Enforcement class:** enforceable
- **Dimension:** D4 — mcp-open-design Pairing

## 4. BUILD OUTLINE
- Split §3 into `mutationSafety` and `designInfluence` axes and reclassify every tool on both.
- Stop labeling `ambiguous_read` tools (`list_projects`, `get_file`, `search_files`) "always safe".
- Require a non-design-use receipt when an ambiguous-read tool is invoked outside a design-authorized context.

## 5. ACCEPTANCE
- Each tool carries an explicit `(mutationSafety, designInfluence)` pair; an ambiguous-read call without a non-design-use receipt is flagged/denied for downstream design use.

## 6. EVIDENCE
- `.opencode/skills/mcp-open-design/references/tool_surface.md:46` — the single-axis §3 classification that labels ambiguous reads always-safe.
- Source: `research/research.md` §7 (D4-R9)

## 7. STATUS
planned — plan.md / tasks.md / checklist.md authored when executed.
