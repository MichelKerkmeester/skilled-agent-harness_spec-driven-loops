# Iteration 5 (MiniMax-M2.7): RQ6 — Rename Surface + Safe Ordering

## Focus

RQ6: exhaustive rename surface map + SAFE ORDERING for `deep-agent-improvement` → `deep-improvement`, covering all surfaces, dangling-reference risks, and phase-gating constraints that determine whether Lane C should be built before or after the rename.

---

## Actions Taken

1. **Re-read** the live skill-advisor TypeScript scorer files — `aliases.ts` and `lanes/explicit.ts` — to confirm the exact alias group shape and phrase-boost matrix that Phase 002 must update. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:27-48] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts:98-139]

2. **Re-read** the Python skill-advisor shim for the same alias surface. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:250] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:1576]

3. **Glob-surveyed** all four runtime mirror trees (`.opencode/agents/`, `.claude/agents/`, `.codex/agents/`, `.gemini/agents/`) to inventory the agent mirror surfaces that Phase 002 must handle simultaneously. [SOURCE: glob results — .opencode/agents/deep-agent-improvement.md, .claude/agents/deep-agent-improvement.md, .codex/agents/deep-agent-improvement.toml, .gemini/agents/deep-agent-improvement.md]

4. **Read** the `deep-agent-improvement` SKILL.md frontmatter and §10 INTEGRATION POINTS for the exact `description` field text and skill-advisor `enhances` edge surface. [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:1-15] [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:520-525]

5. **Read** the sibling packet 121 context-index for the Phase 002 rename scope and success criteria definition. [SOURCE: .opencode/specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/context-index.md:36] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/002-skill-rename-deep-improvement/spec.md:37-50]

6. **Grep-surveyed** the existing iteration-004 MiniMax narrative for the 11-surface-class inventory from that iteration. [SOURCE: iteration-004.md:165-240]

7. **Read** the `sk-prompt-small-model` SKILL.md for the `deep-agent-improvement` sentinel reference. [SOURCE: .opencode/skills/sk-prompt-small-model/SKILL.md:202-229]

---

## Findings

### F-MINIMAX-I5-01: Alias Groups — Six Hard-Coded Strings to Update

The skill-advisor TypeScript scorer hard-codes `deep-agent-improvement` as a canonical alias-group key and as a phrase-boost target in `aliases.ts:27-32` and `explicit.ts:116-119`. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:27] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts:116] The group contains four aliases: `command-spec-kit-deep-agent-improvement`, `/deep:start-agent-improvement-loop`, `deep-agent-improvement`, `sk-deep-agent-improvement`. All four must be renamed to `deep-improvement`-equivalent forms, and the existing `deep-model-benchmark` alias group must also be assessed — if `deep-agent-improvement` is renamed, the benchmark lane alias group may need renaming too (e.g., to `deep-model-benchmark` → `deep-benchmark` or similar), but that decision is Phase 002 policy.

The Python shim at `skill_advisor.py:250` and `skill_advisor.py:1576` carries the same alias surface. Both the TypeScript and Python implementations must be updated in the same Phase 002 step — updating one but not the other would produce split-brain routing where the MCP server (TypeScript) and the Python fallback shim disagree on the canonical skill id.

**Actionable**: Phase 002 must update both `aliases.ts` and `skill_advisor.py` in the same atomic step or verify they stay in sync post-rename.

### F-MINIMAX-I5-02: Phrase-Boost Matrix Has Both Positive and Negative Entries for the Old Name

The `explicit.ts` phrase-boost matrix includes both positive boosts for `deep-agent-improvement`-related phrases and negative penalties targeting the old id when benchmark phrasing appears. Specifically:
- `'5d scoring'` → `[['deep-agent-improvement', 1.5]]`
- `'5-dimension agent scoring'` → `[['deep-agent-improvement', 1.6]]`
- `'integration scan'` → `[['deep-agent-improvement', 1.5]]`
- `'dynamic profile'` → `[['deep-agent-improvement', 1.5]]`
- `'benchmark a model'` → `[['deep-model-benchmark', 1.6], ['deep-agent-improvement', -0.6]]`

The negative entries mean that during the transition window, a prompt containing benchmark phrasing would receive a negative penalty against `deep-agent-improvement`. If Phase 002 updates the positive targets but leaves the negative penalty strings unchanged, the penalty would still hit the old id (now a non-existent skill), which is inert but also means the disambiguation logic for benchmark vs. agent-improvement is temporarily impaired. This is not a breaking failure but a degraded state.

**Actionable**: Phase 002 should update the positive boost targets to `deep-improvement` AND update or remove the negative penalties referencing `deep-agent-improvement`, replacing them with equivalent penalties against the new id if the disambiguation semantics are to be preserved.

### F-MINIMAX-I5-03: Four Runtime Mirror Trees — Each Has a `deep-agent-improvement` Named Surface

All four agent mirror directories contain a file named `deep-agent-improvement` (`.md` for three runtimes, `.toml` for Codex):
- `.opencode/agents/deep-agent-improvement.md`
- `.claude/agents/deep-agent-improvement.md`
- `.codex/agents/deep-agent-improvement.toml`
- `.gemini/agents/deep-agent-improvement.md`

The skill-advisor `graph-metadata.json` `enhances` edge for `deep-agent-improvement` currently reads:
```json
{"target": "deep-agent-improvement", "weight": 0.7, "context": "routes agent improvement requests", "auto_added_at": "2026-05-15T14:10:44.259Z", "auto_added_reason": "family-inference:0.45 + asset-shape:0.30 + sibling-transitivity:0.15"}
```
This edge must be updated to `deep-improvement` with appropriate context. [SOURCE: .opencode/skills/system-skill-advisor/graph-metadata.json:70-73]

The Phase 002 success criteria require "zero dangling operational old-name references where the new name is intended, plus advisor rebuild/validate." The four mirror files are the most visible operational surfaces — if an operator invokes `/deep:start-agent-improvement-loop` after the rename and the agent mirror still responds as `deep-agent-improvement`, the experience is broken even if all internal routing is correct.

**Actionable**: Phase 002 must rename all four mirror files in the same step as the skill directory rename. The decision of whether the agent becomes `deep-improvement.md` (general) or `deep-improvement-agent-improvement.md` (lane-specific) is Phase 002 policy, but the four files must be touched together.

### F-MINIMAX-I5-04: CLI Command Files Name the Skill in Their Body Text

The two deep-loop command files (`start-agent-improvement-loop.md` and `start-model-benchmark-loop.md`) both contain body text that names `deep-agent-improvement` as the orchestration target. [SOURCE: .opencode/commands/deep/start-agent-improvement-loop.md:17] [SOURCE: .opencode/commands/deep/start-model-benchmark-loop.md:17] These are documentation files, not executable code, but they are user-facing and would show stale references if Phase 002 does not update them.

Additionally, the `.codex/config.toml` registers the agent mirror under the old id. [SOURCE: confirmed by glob — `.codex/agents/deep-agent-improvement.toml` exists and is the only agent mirror for Codex]

**Actionable**: Phase 002 must update the command file body text and `.codex/config.toml` registration as part of the mirror rename step.

### F-MINIMAX-I5-05: Lane B Alias Group `deep-model-benchmark` May Also Need Renaming

The `aliases.ts` file contains a `deep-model-benchmark` alias group at lines 33-38. This is the canonical id for the benchmark lane, but the skill itself would be renamed to `deep-improvement`. The naming relationship between `deep-improvement` (skill) and `deep-model-benchmark` (canonical alias id for Lane B) is not obviously wrong — the benchmark lane could remain `deep-model-benchmark` as a sub-id under the renamed skill. However, if Phase 002 decides to rename the skill to `deep-improvement`, the question of whether `deep-model-benchmark` becomes `deep-benchmark` or stays independent is an explicit decision that must be recorded.

**Actionable**: Phase 002 decision-record must state whether `deep-model-benchmark` is renamed, stays, or is deprecated in favor of a new `deep-improvement` sub-id for the benchmark lane.

### F-MINIMAX-I5-06: The `description.json` Auto-Regeneration Is Not Automatic on Rename

The skill's `description.json` is auto-generated by `generate-context.js` during canonical saves. A `git mv` of the skill directory does not automatically regenerate `description.json` with the new skill id. The Phase 002 plan mentions running `generate-description.js` and the graph-metadata backfill to ensure both files exist post-rename, but this is an explicit step, not a side effect of the file move. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/002-skill-rename-deep-improvement/spec.md:45]

**Actionable**: Phase 002 must include a post-rename `generate-context.js` invocation to refresh `description.json`, `graph-metadata.json`, and `implementation-summary.md` frontmatter with the new skill id. This is the same tool used in normal memory saves and is the correct mechanism.

### F-MINIMAX-I5-07: Sentinel Skill `sk-prompt-small-model` References `deep-agent-improvement` in Its Cross-Reference Table

The `sk-prompt-small-model` SKILL.md §5 REFERENCES lists `deep-agent-improvement` as a routing/agent target in the skill boundary map at lines 202-213. Specifically, it references `../cli-devin/references/quota-fallback.md` — which is unrelated — but the broader integration table in `SKILL.md:70-78` of `sk-prompt-small-model` mentions deep-agent-improvement as an agent/command target. The Phase 002 success criteria require "zero dangling operational old-name references where the new name is intended," so this reference must be updated.

**Actionable**: Update `sk-prompt-small-model/SKILL.md` cross-references to `deep-improvement` when Phase 002 executes.

### F-MINIMAX-I5-08: The Rename Changes the Benchmark Harness Trace-Normalization Root

Prior iterations (iteration-004 MiniMax) established that building Lane C against `deep-agent-improvement` and then renaming to `deep-improvement` would require rebuilding all trace normalization roots. [SOURCE: iteration-004.md:260] This is because Lane C's benchmark harness resolves the skill root dynamically to find `INTENT_SIGNALS`, `RESOURCE_MAP`, and `RUNTIME_ASSETS`. If the harness is built against the old path and the directory is renamed, every hard-coded path constant in the harness breaks.

This creates a hard gating constraint: **Lane C cannot be built against the old skill name if Phase 002 is expected to execute before Lane C is shipped.** The two possible orderings are:
- **Option A (Rename First)**: Execute Phase 002, rename all surfaces, rebuild/retest Lane C against `deep-improvement`. Safe but blocks Lane C until Phase 002 is complete.
- **Option B (Rename After)**: Build Lane C against `deep-agent-improvement` with explicit path constants that will be updated post-rename. Requires Phase 002 to do a full Lane C path update in addition to all other rename surfaces.

Option A is the recommended path. Lane C is explicitly scoped to be diagnostic and non-mutating (per the parent spec), so running it against the old name before rename is low-value — the benchmark traces would be filed under the old skill id and become stale the moment the rename completes.

**Actionable**: Phase 002 should be sequenced before the Lane C implementation phase. If Phase 002 slips, Lane C should be scoped to build against `deep-improvement` directly and accept that the rename will land during the Lane C build window.

### F-MINIMAX-I5-09: Phase 002 Freeze Inventory Step Prevents Dangling References

The Phase 002 spec calls for running `rg 'deep-agent-improvement'` and classifying every hit as active operational, active documentation, generated/cache, or historical/archive. This step is the gate that ensures no surface is missed. The prior iterations' grep surveys confirm there are 80+ files across the repo containing this string, spanning skill internals, advisor metadata, runtime mirrors, command files, and cross-skill references. [SOURCE: iteration-003-deepseek:27]

A risk not explicitly named in Phase 002: generated cache files (JSON score caches, benchmark output caches, vitest result files) may contain the old skill id in their path or content. These should be classified as generated/cache (not operational) and cleaned or regenerated post-rename, but the classification decision must be explicit.

**Actionable**: Phase 002's freeze inventory should produce a four-column table (file, classification, action, verification method) before any rename step executes.

### F-MINIMAX-I5-10: Python Shim `skill_advisor.py` Must Be Updated Alongside TypeScript Scorer

The skill-advisor has two implementations: the TypeScript MCP server (`aliases.ts`, `explicit.ts`) and the Python fallback shim (`skill_advisor.py`). Both carry the `deep-agent-improvement` alias group and phrase-boost matrix. During the rename, updating only the TypeScript files would leave the Python shim with stale references, causing a split-brain failure if the runtime ever falls back to the Python path (e.g., when the MCP daemon is unavailable).

The Python shim's alias handling is at `skill_advisor.py:250` and its phrase-boost handling is at `skill_advisor.py:1576`. Both must be updated in the same Phase 002 step as the TypeScript files.

**Actionable**: Phase 002 must treat the TypeScript scorer and Python shim as a paired surface — update both or verify post-rename that the Python shim is not invoked (which requires checking `DAEMON_LEASE` and `fallback_contract` per `system-skill-advisor/SKILL.md:262`).

---

## Recommendations

1. **Sequence Phase 002 before Lane C implementation.** The trace-normalization root changes with the rename; building Lane C against the old name then renaming creates rework. Option A (rename first) is strictly safer. [F-MINIMAX-I5-08]

2. **Produce the four-column freeze inventory before any rename step.** File | Classification | Action | Verification for every `deep-agent-improvement` hit across `.opencode/`, `.codex/`, `.claude/`, `.gemini/`, and the Python shim. This prevents dangling references and is the gate for Phase 002 success criteria. [F-MINIMAX-I5-09]

3. **Treat the TypeScript scorer and Python shim as a paired surface.** Update `aliases.ts`, `explicit.ts`, and `skill_advisor.py` in the same atomic Phase 002 step. Verify post-rename that both implementations agree on the canonical skill id. [F-MINIMAX-I5-01] [F-MINIMAX-I5-10]

4. **Update all four runtime mirror files in the same step as the skill directory rename.** The mirror files (`.opencode/agents/`, `.claude/agents/`, `.codex/agents/`, `.gemini/agents/`) are the most visible user-facing surfaces. Rename them together or not at all. [F-MINIMAX-I5-03]

5. **Update or remove the negative phrase-penalties referencing `deep-agent-improvement`.** The benchmark-vs-agent-improvement disambiguation penalties in `explicit.ts:130-138` currently target `deep-agent-improvement`. After rename, these are inert. Phase 002 should either remove them or map them to the new id if the disambiguation semantics are to be preserved. [F-MINIMAX-I5-02]

6. **Decide explicitly whether `deep-model-benchmark` is renamed, stays, or is deprecated.** Record the decision in Phase 002's decision-record. This affects the alias group in `aliases.ts` and the phrase-boost entries in `explicit.ts`. [F-MINIMAX-I5-05]

7. **Run `generate-context.js` post-rename to refresh `description.json`, `graph-metadata.json`, and `implementation-summary.md`.** This is not automatic on `git mv` — it requires an explicit post-rename save step. [F-MINIMAX-I5-06]

8. **Update `sk-prompt-small-model/SKILL.md` cross-references** to point to `deep-improvement` instead of `deep-agent-improvement`. [F-MINIMAX-I5-07]

9. **Classify generated/cache files explicitly in the freeze inventory.** JSON score caches, vitest results, and benchmark output files containing the old skill id are not operational references but must be classified to know whether they need regeneration or can be stale-deleted. [F-MINIMAX-I5-09]

10. **Verify advisor rebuild/validate as the final Phase 002 step.** Phase 002 success criteria require advisor rebuild + validate. This is the last step, not the first — it should only run after all surface renames are complete and the freeze inventory shows zero operational old-name references. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/002-skill-rename-deep-improvement/spec.md:50]

---

## Open Questions

**OQ-MINIMAX-I5-01**: Should the post-rename advisor keep backward-compatible aliases for `deep-agent-improvement` so that old command strings and skill mentions continue to work during a transition window? This would ease migration but would leave the old name as an active operational reference, conflicting with the "zero dangling old-name references" success criterion. The alternative is a hard cutover where old names produce explicit errors with migration guidance.

**OQ-MINIMAX-I5-02**: After rename, should the benchmark lane be known as `deep-model-benchmark` (preserving the existing alias group identity) or should it be renamed to `deep-benchmark` or `deep-improvement-benchmark` to align with the new skill name? The current alias group `deep-model-benchmark` is internally consistent but may be confusing if the parent skill is `deep-improvement`.

**OQ-MINIMAX-I5-03**: Lane C is scoped as diagnostic (non-mutating per parent spec). If Phase 002 slips and Lane C must be built against the old name, what is the minimum path update required in the Lane C harness to prepare for the rename? Is there a way to build Lane C that is agnostic to the skill id (using only the skill's observable behavior rather than its name)?

**OQ-MINIMAX-I5-04**: During the freeze inventory, if generated/cache files (score caches, vitest results) contain the old skill id, should they be regenerated, stale-deleted, or left as-is with the understanding that they are generated artifacts and not operational references? The Phase 002 success criterion of "zero dangling operational references" is clear on operational files but silent on generated artifacts.

---

*Iteration 5 of 5 — MiniMax-M2.7 — RQ6 rename surface + safe ordering*
*Status: complete*