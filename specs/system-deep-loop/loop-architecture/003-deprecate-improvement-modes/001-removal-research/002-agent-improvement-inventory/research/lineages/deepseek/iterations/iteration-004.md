# Iteration 4: Skill-advisor projection surface — alias folds, projections, generated bridges, drift guard, fixtures

## Focus

Inventory `.skilled/skills/system-skill-advisor/` for agent-improvement wiring: the Python alias group and router maps (`skill_advisor.py`), the TypeScript alias groups and the generated routing projection (`aliases.ts`), the DEEP_MODE_BY_CANONICAL default-mode fold, the scorer projection and explicit lane, generated command bridges and their generator, the routing-registry drift guard, scorer tests, and routing fixtures.

## Actions Taken

1. Ranked `rg -c "agent-improvement|deep-improvement"` across the skill (non-node_modules) and listed the top files.
2. Grepped `runtime/scripts/skill_advisor.py` (alias group, deep-router patterns, command registries) with line numbers.
3. Read `runtime/lib/scorer/aliases.ts` (generated block context) and `runtime/lib/scorer/projection.ts` + `lanes/explicit.ts` around the lanes.
4. Read the generated bridge files' match lines and the generator `runtime/scripts/command-bridges/derive-command-bridges.cjs` input discovery.
5. Grepped drift-guard, scorer tests, regression fixtures, holdout prompts, `skill-graph.json`, the divergence-ledger script, and the two playbook docs.

## Findings

1. **The Python advisor keeps the legacy `deep-improvement` alias group** — `skill_advisor.py` lines 294-298 map `deep-improvement` to `command-spec-kit-deep-agent-improvement`, `/deep:agent-improvement`, `deep-agent-improvement`, `sk-deep-agent-improvement`. Disposition: EDIT (remove the group). [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:294]
2. **The Python deep-router pattern map carries four agent-improvement keys** — `deep-agent-improvement`, `/deep-agent-improvement`, `sk-agent-improvement-loop`, `/sk-agent-improvement-loop` (lines 2043-2046) plus `/deep:agent-improvement` again at line 2068, all routing to `system-deep-loop`. Disposition: EDIT. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:2043]
3. **The Python command registries own two `command-deep-agent-improvement` entries** — intent entry at lines 2231-2233 and the command registry at lines 2365-2371 (`command: /deep:agent-improvement`, `owner_mode: agent-improvement`). Disposition: EDIT (remove both). [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:2365]
4. **`aliases.ts` GENERATED_DEEP_ALIAS_GROUPS carries the `deep-improvement` fold inputs** — alias entries at lines 38-42, and the `DEEP_MODE_BY_CANONICAL` projection at lines 60-66 maps `'deep-improvement': 'agent-improvement'` inside a block marked "GENERATED DEEP ROUTING PROJECTION". This is the advisor's default-mode fold and the exact surface the registry's `advisorDefaultMode: true` describes. Disposition: EDIT (remove alias group and fold entry; regenerate the generated block). [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/aliases.ts:62]
5. **`projection.ts` carries a `command-deep-agent-improvement` inventory entry** at lines 458-470 (`routingEnabled: false`, kind command, family system). Disposition: EDIT (entry removal; it derives from the bridges sources). [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:460]
6. **`lanes/explicit.ts` scores the command directly** — `/deep:agent-improvement` explicit-lane boost at line 123 (`[['system-deep-loop', 1.6], ['command-spec-kit', 0.45]]`) and the Lane B comment at line 143 noting Lane B runs as a mode of the agent-improvement skill. Disposition: EDIT. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:123]
7. **The generated command-bridge files embed the full command bridge** — `command-bridges.generated.json` lines 304-321 (id, command, ownerMode `agent-improvement`, description, slash markers) and `scoring-compatibility.json` lines 241-247. Disposition: EDIT by regeneration (generated mirrors — do not hand-edit). [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json:304]
8. **The bridge generator reads the hub's command-metadata.json** — `derive-command-bridges.cjs` discovers `{skillId}/command-metadata.json` (line 71) and requires `command` + `ownerMode` on every entry (lines 80-85); removing the command entry in the hub (iteration 1 finding 5) propagates through regeneration. There is a companion `command-bridges-drift-guard.vitest.ts` in the advisor runtime tests. Disposition: EDIT source; regenerate. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:71]
9. **The routing-registry drift guard hard-asserts agent-improvement as THE default-mode fold** — `routing-registry-drift-guard.vitest.ts` lines 192-194: "exactly one mode is flagged advisorDefaultMode, and it is agent-improvement" with `toEqual(['agent-improvement'])`. Disposition: EDIT (the assertion must change with the mode's removal; this guard is the CI check that keeps maps == registry projection). [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/routing-registry-drift-guard.vitest.ts:192]
10. **The native scorer test uses the legacy skill id as fixture and negative case** — `native-scorer.vitest.ts` line 316 constructs a `deep-agent-improvement` skill fixture and line 344 asserts it is not recommended for a review prompt. Disposition: EDIT. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/scorer/native-scorer.vitest.ts:316]
11. **Routing fixtures expect the legacy skill id as top result** — `skill-advisor-regression-cases.jsonl` lines 40-44 (P1-PHRASE-002/003/004/005/009 expect `sk-deep-agent-improvement`) and `holdout-prompts.jsonl` lines 58-61 mirror those expectations (`skill_top_1: sk-deep-agent-improvement`). Disposition: EDIT (reroute or retire the cases). [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/fixtures/skill-advisor-regression-cases.jsonl:40]
12. **`skill-graph.json` lists `deep-improvement` and "agent improvement benchmark" in the system-deep-loop signal vocabulary** (generated 2026-10-02). Disposition: EDIT by regeneration (generated artifact). [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json:1]
13. **The divergence-ledger capture script special-cases the legacy ids** — `capture-local-native-divergence-ledger.mjs` line 130 tests for `deep-improvement`, `system-deep-loop`, `deep-research`, `deep-review`. Disposition: EDIT (drop the legacy id from the watched set). [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-local-native-divergence-ledger.mjs:130]
14. **Recorded playbook evidence cites the legacy fixture expectations** — `python-compat/regression-suite.md` lines 159-172 record run output with `expected_top_any=[sk-deep-agent-improvement]` / `actual_top=null`; `auto-indexing/corpus-df-idf.md` line 123 names the packet SKILL.md path as a corpus example. Disposition: KEEP-AS-HISTORY for the recorded run output; EDIT for the corpus example if the doc is maintained. [SOURCE: .skilled/skills/system-skill-advisor/manual-testing-playbook/python-compat/regression-suite.md:159]
15. **No alias/leaf-manifest mentions** — `leaf-aliases.json`, `leaf-manifest.json` and `leaf-manifest.config.json` carry no agent-improvement/deep-improvement matches, so the advisor's leaf packaging needs no edit for deletion. [SOURCE: .skilled/skills/system-skill-advisor/leaf-manifest.json]

## Ruled Out

- Treating `command-bridges.generated.json` and `scoring-compatibility.json` as hand-editable sources: the derive script discovers them as generated outputs of `{skillId}/command-metadata.json`, so the correct deletion order is source edit then regeneration.

## Dead Ends

- None; the advisor surface resolved into the two projection maps, the fold, the generated bridge pair, the drift guard, and fixture/test updates.

## Edge Cases

- Ambiguous input: which Python maps count as "projection maps" — resolved by reporting all three surfaces (alias group, deep-router patterns, command registries) separately.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:294-298,2043-2046,2068,2231-2233,2365-2371
- .skilled/skills/system-skill-advisor/runtime/lib/scorer/aliases.ts:38-42,60-66,95-104
- .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:458-470
- .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:123,143
- .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json:304-321
- .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json:241-247
- .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:63-93,120,131,347,418-436
- .skilled/skills/system-skill-advisor/runtime/tests/routing-registry-drift-guard.vitest.ts:192-194
- .skilled/skills/system-skill-advisor/runtime/tests/scorer/native-scorer.vitest.ts:316,344
- .skilled/skills/system-skill-advisor/runtime/scripts/fixtures/skill-advisor-regression-cases.jsonl:40-44
- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/holdout-prompts.jsonl:58-61
- .skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json
- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-local-native-divergence-ledger.mjs:130
- .skilled/skills/system-skill-advisor/manual-testing-playbook/python-compat/regression-suite.md:159-172
- .skilled/skills/system-skill-advisor/manual-testing-playbook/auto-indexing/corpus-df-idf.md:123

## Assessment

- New information ratio: 0.9
- Questions addressed: KQ2 (alias groups and folds, drift guard, generated mirrors, fixtures)
- Questions answered: none in full

## Reflection

- What worked and why: the runtime mention-rank scan plus the generator's source-path discovery created a precise edit order: command-metadata.json → regeneration → drift guard → fixtures.
- What did not work and why: nothing failed; the generated markers in aliases.ts named the generator contract directly.
- What I would do differently: when the deletion lands, rerun the command-bridges derive script and the drift guard; plan that as a verification step in synthesis.

## SCOPE VIOLATIONS

- None.

## Recommended Next Focus

Iteration 5: the remaining `.skilled/` command and skill surfaces — `.skilled/commands/` outside deep/ (indexes, routers, command assets), `.skilled/skills/system-deep-loop/` leftover subtrees (benchmark reports, changelog, feature-catalog, manual-testing-playbook, shared rollout, behavior-benchmark), and cross-references in `.skilled/skills/system-spec-kit/` and `sk-git`/other skills.
