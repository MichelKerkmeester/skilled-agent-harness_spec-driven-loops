---
title: "Skill Graph 005: Populate intent_signals and manual skill relationships"
description: "Three structured-signal fields populated across all 17 active skill metadata files: derived.intent_signals, manual.depends_on, manual.related_to. The graph_causal lane now receives non-zero skill-side input where it previously scored zero."
trigger_phrases:
  - "intent signals populate"
  - "manual skill relationships"
  - "graph causal lane skill side"
  - "depends_on related_to metadata"
  - "skill graph metadata signals"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-14

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph/005-intent-signals-and-skill-relationships` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph`

### Summary

The skill advisor's `graph_causal` lane (0.13 weight) and part of the `derived_generated` lane (0.12 weight) had no skill-side structured signal to traverse. Across all 17 active skills, three metadata fields were universally absent: `derived.intent_signals`, `manual.depends_on`, `manual.related_to`. The lane scored entirely from causal edges in the spec-doc memory graph and auto-derived phrases rather than from authoritatively stated skill intent and relationship data.

All three fields were populated across all 17 active skill `graph-metadata.json` files. Each skill received 5 `derived.intent_signals` entries authored from the skill's actual SKILL.md description. The `manual.depends_on` field averages 0.65 entries per skill with 7 leaf or foundational skills carrying empty arrays that are documented. The `manual.related_to` field averages 3.76 entries per skill with zero empty cases. Edits touched only the three target fields and left every other field unchanged.

The `graph_causal` lane now produces non-zero raw scores on fixture prompts. A `deep-review` probe produced `graph_causal_rawScore=0.24`, up from zero before this packet shipped.

### Added

- `derived.intent_signals` field (5 entries per skill) across all 17 active skill metadata files
- `manual.depends_on` field across all 17 active skill metadata files, with documented empty arrays for 7 leaf or foundational skills
- `manual.related_to` field across all 17 active skill metadata files, with at least one adjacency entry per skill

### Changed

- Skill advisor `graph_causal` lane behavior: the lane now traverses skill-side relationship edges in addition to spec-doc causal edges

### Fixed

- `graph_causal` lane scored zero on all skill-side traversals because no skill carried `manual.depends_on` or `manual.related_to` entries. Non-zero scores now confirmed on multiple fixture probes.

### Verification

| Gate | Status | Evidence |
|------|--------|----------|
| JSON parse and field presence | Pass | All 17 active skill `graph-metadata.json` files parsed and confirmed to carry all three target fields |
| `skill_graph_scan` equivalent | Pass | 19 scanned, 18 indexed, 1 non-skill fixture skipped, 58 edges, 0 rejected edges |
| `advisor_recommend` graph_causal probe | Pass | `deep-review` probe returned `graph_causal_rawScore=0.24`. Browser and Codex probes also returned non-zero scores. |
| Typecheck | Fail | `npm run typecheck` from `mcp_server/` failed on out-of-scope sibling file `skill_advisor/tests/scorer/lane-weight-sweep.vitest.ts:610:20 TS2554 Expected 1 arguments but got 0`. Failure is pre-existing and unrelated to this packet. |
| Vitest `skill_advisor` | Pass with known baseline | 42 files, 303 tests, 1 pre-existing failure in `plugin-bridge.vitest.ts:97`. Zero new regressions. |
| Dist rebuild | Pass | `npx tsc --build` from `system-spec-kit/` exited 0 |
| Strict packet validation | Pass | `validate.sh` on this packet: 0 errors, 0 warnings |
| Strict parent validation | Pass | `validate.sh` on parent packet: 0 errors, 0 warnings |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/cli-claude-code/graph-metadata.json` | Added `derived.intent_signals`, `manual.depends_on`, `manual.related_to` |
| `.opencode/skills/cli-codex/graph-metadata.json` | Added `derived.intent_signals`, `manual.depends_on`, `manual.related_to` |
| `.opencode/skills/cli-gemini/graph-metadata.json` | Added `derived.intent_signals`, `manual.depends_on`, `manual.related_to` |
| `.opencode/skills/cli-opencode/graph-metadata.json` | Added `derived.intent_signals`, `manual.depends_on`, `manual.related_to` |
| `.opencode/skills/deep-agent-improvement/graph-metadata.json` | Added `derived.intent_signals`, `manual.depends_on`, `manual.related_to` |
| `.opencode/skills/deep-ai-council/graph-metadata.json` | Added `derived.intent_signals`, `manual.depends_on`, `manual.related_to` |
| `.opencode/skills/deep-research/graph-metadata.json` | Added `derived.intent_signals`, `manual.depends_on`, `manual.related_to` |
| `.opencode/skills/deep-review/graph-metadata.json` | Added `derived.intent_signals`, `manual.depends_on`, `manual.related_to` |
| `.opencode/skills/mcp-chrome-devtools/graph-metadata.json` | Added `derived.intent_signals`, `manual.depends_on`, `manual.related_to` |
| `.opencode/skills/mcp-coco-index/graph-metadata.json` | Added `derived.intent_signals`, empty `manual.depends_on`, `manual.related_to` |
| `.opencode/skills/mcp-code-mode/graph-metadata.json` | Added `derived.intent_signals`, empty `manual.depends_on`, `manual.related_to` |
| `.opencode/skills/sk-code/graph-metadata.json` | Added `derived.intent_signals`, empty `manual.depends_on`, `manual.related_to` |
| `.opencode/skills/sk-code-review/graph-metadata.json` | Added `derived.intent_signals`, `manual.depends_on`, `manual.related_to` |
| `.opencode/skills/sk-doc/graph-metadata.json` | Added `derived.intent_signals`, empty `manual.depends_on`, `manual.related_to` |
| `.opencode/skills/sk-git/graph-metadata.json` | Added `derived.intent_signals`, empty `manual.depends_on`, `manual.related_to` |
| `.opencode/skills/sk-prompt/graph-metadata.json` | Added `derived.intent_signals`, empty `manual.depends_on`, `manual.related_to` |
| `.opencode/skills/system-spec-kit/graph-metadata.json` | Added `derived.intent_signals`, empty `manual.depends_on`, `manual.related_to` |

### Follow-Ups

- Recheck the typecheck failure in `skill_advisor/tests/scorer/lane-weight-sweep.vitest.ts` once sibling lane-weight sweep work lands to confirm whether the TS2554 error is resolved by that packet.
- Consider re-running the seeded sweep after the sibling 007 harder-corpus sweep completes to measure cumulative `graph_causal` lift from both packets combined.
