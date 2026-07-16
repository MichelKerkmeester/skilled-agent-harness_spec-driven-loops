# Iteration 004 - External Reference-Migration Surface And Advisor Re-Baseline Risk

## Focus

Quantify the full reference-migration surface across commands/agents/READMEs/advisor-corpus and assess the advisor's hardcoded-projection re-baseline risk.

## Findings

1. The migration surface is broad but well-bounded: 33 command files (deep/*, create/*, doctor/*), 5 opencode + 5 claude mirror agents, 4 READMEs (repo root + 3 skill READMEs), plus the advisor internals. The 003 decision to keep `/deep:*` command names and agent names stable (skill identity changes, public surfaces do not) is correct and sharply reduces blast radius — only internal path references move, not user-facing invocations. [SOURCE: rg deep-loop-runtime|deep-loop-workflows counts: commands=33, opencode agents=5, claude agents=5] [SOURCE: 003/spec.md:143-149]

2. NEW P1 — the advisor is the highest-risk surface because it does NOT read `mode-registry.json` at runtime. The registry description states explicitly that the advisor keeps hardcoded projection maps (Python `DEEP_ROUTING_MODE_BY_KEY`, TypeScript `DEEP_MODE_BY_CANONICAL`) in sync via a CI drift-guard, intentionally avoiding cross-skill import coupling on the hot path. So renaming the skill is NOT a registry repoint — it requires regenerating the projection maps AND updating three hardcoded identity constants: `skill_advisor.py:83 MODE_REGISTRY_PATH`, `skill_advisor.py:2579 MERGED_DEEP_SKILL_ID`, `aliases.ts:109 MERGED_DEEP_SKILL_ID`. The drift guard will catch a stale projection, but only if it is re-run after the rename. [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:10-17 advisor-projection] [SOURCE: skill_advisor.py:83] [SOURCE: skill_advisor.py:2579] [SOURCE: aliases.ts:109] [SOURCE: routing-registry-drift-guard.vitest.ts]

3. NEW P1 — the divergence ledger mixes IDENTITY FIELDS with NARRATIVE PROSE, so a blind find/replace corrupts history. `local-native-approved-divergences.json` stores `nativeTop: "deep-loop-workflows"` and `gold: "deep-loop-workflows"` as structured fields (lines 30, 158, 160) BUT also stores prose like `"reason": "deep-loop merge re-baseline: legacy deep-* skills folded into deep-loop-workflows..."` (line 31). The identity fields must be field-scoped updates re-approved through the divergence ratchet; the `reason` prose is historical narrative and must NOT be rewritten. The 003 Stage-I divergence-ratchet gate is the correct control, but the migration must explicitly distinguish field from prose. [SOURCE: local-native-approved-divergences.json:30-31] [SOURCE: local-native-approved-divergences.json:158-161]

4. The dual-runtime agent mirror (5 opencode `.opencode/agents/` + 5 claude `.claude/agents/`) is a sync hazard: a rename applied to one tree but not the other leaves the runtimes disagreeing on the deep-loop path. 003's exit-gate "agent-mirror sync check" is therefore mandatory, not optional. [SOURCE: rg deep-loop in .opencode/agents and .claude/agents — 5 each]

## Ruled Out

- Pointing the advisor hot path at `mode-registry.json` dynamically to "future-proof" the rename — the architecture intentionally avoids that coupling; the drift-guard + projection-regeneration discipline is the supported path.
- Blind find/replace across the divergence ledger — it would corrupt the `reason` narrative fields.

## Next Focus

Iteration 5 (final): fallback-router wiring feasibility for GLM-5.2 → MiMo-v2.5-Pro, then convergence/consolidation of all findings.
