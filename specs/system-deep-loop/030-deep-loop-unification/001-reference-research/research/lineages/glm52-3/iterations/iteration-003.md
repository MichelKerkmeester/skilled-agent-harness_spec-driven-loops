# Iteration 003 — Reference-Migration Surface + Advisor-Corpus Risk

**Lineage:** glm52-3 | **Iteration:** 3 of 5 | **Focus:** Q4 full reference-migration surface, highest-risk advisor corpus, incomplete-migration risk
**Date:** 2026-07-08

## Focus

Enumerate the complete reference-migration surface (commands/agents/READMEs/plugin/hooks/CI/advisor-corpus), quantify the ~948-hit estimate from spec.md:88, and assess the incomplete-migration risk per surface — especially the advisor corpus (labeled-prompts, divergence ledger, hardcoded scorer constants), called out as highest-risk.

## Findings

### F3.1 — Surface breakdown (measured line-hits, excluding specs/worktrees/node_modules)

| Surface | Line-hits | Mechanism class |
|---|---|---|
| `.opencode/commands/` | 452 | mixed: absolute script paths + generated `.contract.md` artifacts |
| `.opencode/skills/system-skill-advisor/` | 264 | labels + scorer constants + generated skill-graph.json |
| `.opencode/agents/` | 18 | agent-contract hardcoded `mode-registry.json` path refs |
| `.claude/agents/` | 18 | REAL DUPLICATE of .opencode/agents (confirms spec.md:76) |
| `.opencode/plugins/` | 3 | mk-deep-loop-guard |
| `.github/workflows/` | 1 | CI |
| `README.md` (root) | 8 | prose |
| `deep-loop-workflows/README.md` | 6 | prose |
| `deep-loop-runtime/README.md` | 14 | prose |

[SOURCE: rg per-surface line counts] The spec.md:88 "~948 grep hits" is consistent once `.opencode/specs/**` history (3622+ confirmed) is excluded — the non-history migration surface is ~780+ code/contract/doc lines across the surfaces above, dominated by commands (452) and advisor (264).

### F3.2 — CRITICAL REFRAME: the advisor already implements a merge-identity layer; system-deep-loop is the SECOND fold

`aliases.ts:92-109` is titled "MODULE: Merged Deep-Loop Identity + Mode Layer" and ALREADY folds the 4 legacy mode ids (deep-research/deep-review/deep-ai-council/deep-improvement) into one canonical skill via `MERGED_DEEP_SKILL_ID = 'deep-loop-workflows'` (line 109). The comment block (95-109) explains: legacy mode-level ids still resolve to themselves for caller compatibility, and a SECOND projection maps legacy-mode → (merged skill, workflowMode). [SOURCE: system-skill-advisor/mcp_server/lib/scorer/aliases.ts:92-109]

**The system-deep-loop merge is therefore NOT a new fold — it's renaming the canonical merged id** from `'deep-loop-workflows'` → `'system-deep-loop'`. This SHRINKS the advisor edit but raises its criticality:
- **1 load-bearing constant** (`MERGED_DEEP_SKILL_ID`) must change — if missed, the advisor resolves deep-loop prompts to a now-non-existent id and routing silently degrades.
- **Comment path refs** (lines 97-98,103 `deep-loop-workflows/mode-registry.json`) update to `system-deep-loop/mode-registry.json`.
- `DEEP_MODE_BY_CANONICAL` + `RAW_ALIAS_GROUPS` mode-level maps stay UNCHANGED (deep-research etc. mode ids are stable per spec.md:82 — identity-only rename). [SOURCE: aliases.ts:111-120]

### F3.3 — Divergence ledger reason strings are HISTORICAL NARRATION; mechanical replace would corrupt them

`local-native-approved-divergences.json` has 6+ entries with `"nativeTop"/"gold": "deep-loop-workflows"` AND `reason` strings like "deep-loop merge re-baseline: legacy deep-* skills folded into deep-loop-workflows shifted native top-1; recorded as approved local-vs-native divergence." [SOURCE: local-native-approved-divergences.json:30-31,90-91,120-121,158-161,168-171,228-231]

Two distinct edit classes in ONE file:
- **Label FIELDS** (`nativeTop`, `gold`) → field-scoped replace to `system-deep-loop` (these are routing ground-truth).
- **`reason` STRINGS** → HISTORICAL NARRATION. The statement "folded into deep-loop-workflows" is historically TRUE (that fold happened before this rename). A mechanical replace to "folded into system-deep-loop" would be FALSE narration and would mask the two-step history. Per the ledger's own Rule (c) / spec.md:134 / REQ-007, these require MANUAL re-approve with non-mechanical `reason` updates: add a note ("subsequently renamed to system-deep-loop in 052"), don't erase the original fold. `local-native-divergence-ratchet.vitest.ts` enforces this — a mechanical replace likely fails the ratchet's reviewed-reason check.

### F3.4 — labeled-prompts.jsonl: 54 deep-loop references; field-scoped replace on label keys only (spec.md:134 Stage I confirmed correct)

54 deep-loop references in the ground-truth routing corpus. [SOURCE: rg labeled-prompts.jsonl] The spec.md:134 risk ("field-scoped replace on label keys only, not full-file find/replace") is CONFIRMED CORRECT and load-bearing: a full-file replace would rewrite the natural-language PROMPT TEXT (which must stay as operators wrote it), corrupting the corpus's signal. Field-scoped = touch only the `expected_skill`/`gold` label fields. The REQ-004 acceptance ("score-routing-corpus.py accuracy matches or exceeds pre-merge baseline") is the right gate.

### F3.5 — skill-graph.json is GENERATED; hand-editing is a trap

`skill-graph.json` (`generated_at: 2026-07-04`) carries TWO separate nodes (`deep-loop-runtime`, `deep-loop-workflows`) in `families`, `adjacency`, `signals`, `hub_skills`, plus `system-spec-kit.prerequisite_for` edges to both. [SOURCE: skill-graph.json:1] Because it is GENERATED by `skill-graph scan` from `graph-metadata.json` sources, child 003 must:
1. Update the SOURCE graph-metadata.json files (deep-loop-workflows/graph-metadata.json edges, system-spec-kit/graph-metadata.json:45, sibling skill edge holders: cli-opencode, sk-code, sk-prompt).
2. Delete the now-internal runtime graph-metadata.json (it becomes a nested folder, not a skill node).
3. Re-run `skill-graph scan` — NOT hand-edit skill-graph.json.
A hand-edit would be silently overwritten on the next advisor rebuild (spec.md open-question on the family tag deferred to whoever runs the post-merge rebuild). [SOURCE: spec.md:145]

### F3.6 — commands/agents: orchestrate.md hardcodes mode-registry.json path 3x (load-bearing agent contract)

`.opencode/agents/orchestrate.md:163,185,206` hardcodes `.opencode/skills/deep-loop-workflows/mode-registry.json` as the registry-backed Deep Route resolution source, with an explicit "reviewer must be able to verify correctness by diffing the emitted Deep Route line against the registry entry" contract. [SOURCE: orchestrate.md:163,185,206] This appears in BOTH `.opencode/agents/` and `.claude/agents/` (18 lines each, real duplicate). These 3 path refs × 2 trees = 6 critical edits; a miss breaks the Deep Route resolution contract silently (orchestrate would look up a non-existent registry).

## Incomplete-Migration Risk Ranking

1. **HIGHEST — `MERGED_DEEP_SKILL_ID` constant (aliases.ts:109):** single point of routing failure; a miss degrades ALL deep-loop routing silently. Must be in child 003's first edit.
2. **HIGH — divergence ledger reason strings:** mechanical replace produces false historical narration; REQ-007 ratchet is the guard.
3. **HIGH — orchestrate.md mode-registry.json path (×2 trees):** breaks Deep Route contract.
4. **MEDIUM — skill-graph.json:** trap if hand-edited; correct path is graph-metadata.json sources + re-scan.
5. **MEDIUM — labeled-prompts.jsonl:** field-scoped replace is well-understood; REQ-004 baseline gate catches regressions.
6. **LOWER — commands generated .contract.md artifacts:** regenerated by compile-command-contracts.cjs; fix the generator (class A from iter 1/2), not the artifacts.

## Ruled Out

- **Ruled out:** "advisor corpus needs a from-scratch merge-identity layer." It already has one (aliases.ts:92-109); this is an id-rename.
- **Ruled out:** "hand-edit skill-graph.json." It's generated; edit sources + re-scan.
- **Ruled out:** "mechanical full-file replace on the divergence ledger." Corrupts historical narration; fails REQ-007 ratchet.

## Novelty Assessment

newInfoRatio: 0.62 — Partially-new, high-value reframe. The "advisor already has a merge layer, this is the second fold" insight reframes the entire advisor-corpus risk from "build merge identity" to "rename canonical id + manually review historical narration." Enumeration of surfaces is confirmatory (lower novelty); the load-bearing-constant and generated-graph-trap findings are net-new.

## Sources

- [SOURCE: rg per-surface line counts: commands=452, advisor=264, agents=18×2, plugins=3, ci=1]
- [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:92-120]
- [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/parity/fixtures/local-native-approved-divergences.json:30-31,90-91,158-161,228-231]
- [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/labeled-prompts.jsonl (54 deep-loop refs)]
- [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/scripts/skill-graph.json:1 (generated, two deep-loop nodes)]
- [SOURCE: .opencode/agents/orchestrate.md:163,185,206; .claude/agents mirror]
- [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/spec.md:76,88,134]
