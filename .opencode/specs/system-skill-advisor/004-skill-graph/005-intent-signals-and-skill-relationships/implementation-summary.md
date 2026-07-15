---
title: "Implementation Summary: Populate intent_signals + manual relationships"
description: "Pending; filled by codex with per-skill edit ledger and validation."
trigger_phrases:
  - "intent signals summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/004-skill-graph/005-intent-signals-and-skill-relationships"
    last_updated_at: "2026-05-14T01:30:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded packet"
    next_safe_action: "Dispatch codex"
    blockers: []
    key_files:
      - "implementation-summary.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Implementation Summary: Populate intent_signals + manual relationships

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-05-14 |
| **Branch** | `008-populate-intent-signals-and-relationships` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Populated the three requested structured-signal fields across all 17 active skill metadata files:

| Skill | `derived.intent_signals` | `manual.depends_on` | `manual.related_to` |
|-------|--------------------------|---------------------|---------------------|
| `cli-claude-code` | 5; e.g. `delegate to claude` | 1; `system-spec-kit` | 5; e.g. `cli-codex` |
| `cli-codex` | 5; e.g. `delegate to codex` | 1; `system-spec-kit` | 5; e.g. `cli-claude-code` |
| `cli-gemini` | 5; e.g. `google search research` | 1; `system-spec-kit` | 5; e.g. `cli-codex` |
| `cli-opencode` | 5; e.g. `full runtime dispatch` | 1; `system-spec-kit` | 6; e.g. `deep-research` |
| `deep-agent-improvement` | 5; e.g. `score candidate` | 1; `system-spec-kit` | 3; e.g. `sk-prompt` |
| `deep-ai-council` | 5; e.g. `multi-seat planning` | 1; `system-spec-kit` | 3; e.g. `deep-research` |
| `deep-research` | 5; e.g. `synthesize evidence` | 1; `system-spec-kit` | 3; e.g. `mcp-coco-index` |
| `deep-review` | 5; e.g. `iterative audit` | 2; e.g. `sk-code-review` | 3; e.g. `deep-research` |
| `mcp-chrome-devtools` | 5; e.g. `inspect network` | 1; `mcp-code-mode` | 2; e.g. `sk-code` |
| `mcp-coco-index` | 5; e.g. `semantic code search` | 0; `[]` | 3; e.g. `mcp-code-mode` |
| `mcp-code-mode` | 5; e.g. `chain tool calls` | 0; `[]` | 3; e.g. `mcp-chrome-devtools` |
| `sk-code` | 5; e.g. `verify after change` | 0; `[]` | 4; e.g. `sk-code-review` |
| `sk-code-review` | 5; e.g. `rank findings` | 1; `sk-code` | 3; e.g. `deep-review` |
| `sk-doc` | 5; e.g. `validate markdown` | 0; `[]` | 3; e.g. `system-spec-kit` |
| `sk-git` | 5; e.g. `finish pull request` | 0; `[]` | 3; e.g. `sk-doc` |
| `sk-prompt` | 5; e.g. `score clear quality` | 0; `[]` | 5; e.g. `cli-codex` |
| `system-spec-kit` | 5; e.g. `preserve continuity` | 0; `[]` | 5; e.g. `deep-review` |

Empty `manual.depends_on` justifications:

| Skill | Reason |
|-------|--------|
| `mcp-coco-index` | Leaf semantic-search/indexing skill; related consumers exist, but no other skill is mechanically required to search or index. |
| `mcp-code-mode` | Leaf MCP orchestration executor; other skills may call it, but it does not mechanically require another skill packet. |
| `sk-code` | Foundational code-work router; it pairs with review/spec/browser skills, but its implementation and verification guidance is self-contained. |
| `sk-doc` | Documentation/component authoring templates and validators are self-contained. |
| `sk-git` | Git workflow guidance is self-contained; packet/docs skills are adjacent, not required. |
| `sk-prompt` | Prompt framework/scoring workflow is self-contained; CLI and code/doc skills are downstream consumers. |
| `system-spec-kit` | Foundational spec and memory workflow; other skills depend on it, not the reverse. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

To be filled. Plan: cli-codex gpt-5.5 high reads each skill's SKILL.md + existing graph-metadata.json + the 015/005 audit, composes the three target fields, applies scoped edits, validates.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## KEY DECISIONS

| Decision | Why |
|----------|-----|
| Stay in three target fields only | Avoid touching 015/006's already-edited description + trigger_phrases + key_topics |
| Empty arrays allowed for leaf skills | Honest reflection of reality beats fabricated deps |
| Validate via skill_graph_scan | Single source of truth for skill-side schema validity |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Gate | Status | Evidence |
|------|--------|----------|
| JSON parse + field presence | Pass | `node` parsed all 17 active `.opencode/skills/<skill_id>/graph-metadata.json` files and confirmed `derived.intent_signals`, `manual.depends_on`, and `manual.related_to` arrays. |
| skill_graph_scan equivalent | Pass | `indexSkillMetadata('.opencode/skills')` with temp DB: 19 scanned, 18 indexed, 1 non-skill fixture skipped, 58 edges, 0 rejected edges. All 17 direct active skills were included; recursive scan also indexes nested `skill_advisor`. |
| advisor graph_causal probe | Pass | `scoreAdvisorPrompt('run a deep review...')` produced `deep-review` with `graph_causal.rawScore=0.24`; browser and Codex probes also produced non-zero graph_causal scores. |
| Typecheck | Fail | `npm run typecheck` from `mcp_server/` fails at out-of-scope sibling file `skill_advisor/tests/scorer/lane-weight-sweep.vitest.ts(610,20): TS2554 Expected 1 arguments, but got 0.` |
| Vitest skill_advisor | Pass with known baseline | `npm exec -- vitest run skill_advisor` from `mcp_server/`: 42 files, 303 tests; 1 failed known plugin-bridge test (`plugin-bridge.vitest.ts:97` expected `fail_open`, received `ok`). |
| Dist rebuild | Pass | `npx tsc --build` from `system-spec-kit/` exited 0. |
| Strict packet validation | Pass | `validate.sh 008-populate-intent-signals-and-relationships --strict`: RESULT PASSED, 0 errors, 0 warnings. |
| Strict parent validation | Pass | `validate.sh 002-semantic-routing-lane --strict`: RESULT PASSED, 0 errors, 0 warnings. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Manual deps are mechanical-only**: aspirational relationships are not captured.
2. **No sweep re-run**: this packet is metadata-population only; sibling 007 handles harder-corpus sweep.
3. **Effect on advisor recommendations**: small near-term; the graph_causal lane carries 0.13 weight so even strong skill-side signal contributes modestly. Effect compounds when combined with future weight rebalances.
<!-- /ANCHOR:limitations -->
