# Focus

RQ3 and RQ4 for Lane C (`skill-benchmark`): whether activation should be scored against the external skill-advisor, the in-`SKILL.md` smart router, or both as separate sub-scores; what "properly utilized" means operationally; and how to author scenarios/fixtures without circularity when some candidates are generated from the target skill's own triggers. Secondary focus: update the `deep-agent-improvement` -> `deep-improvement` rename surface with active routing/code surfaces.

# Actions Taken

- Re-read the target `deep-agent-improvement` skill for its current two-lane shape, smart-router `INTENT_SIGNALS`/`RESOURCE_MAP`, Lane B seam pattern, and its warning that merely reading `SKILL.md` is not execution evidence. [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:27] [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:113] [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:248] [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:273]
- Re-read `sk-doc` and `system-skill-advisor` to keep Lane C distinct from doc-shape validation, manual testing playbooks, and prompt-time skill selection. [SOURCE: .opencode/skills/sk-doc/SKILL.md:46] [SOURCE: .opencode/skills/sk-doc/SKILL.md:117] [SOURCE: .opencode/skills/system-skill-advisor/SKILL.md:57] [SOURCE: .opencode/skills/system-skill-advisor/SKILL.md:257]
- Re-read the 122 parent/child specs and the Lane B sibling build packet for the existing Lane C hypotheses, fixture/dispatcher/scorer frame, rename goals, and byte-identity precedent. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/spec.md:120] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/003-skill-benchmark-mode/spec.md:39] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/002-skill-rename-deep-improvement/spec.md:37] [SOURCE: .opencode/specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/003-build-benchmark-mode/spec.md:125]
- Checked prior GPT-5.5 iterations so this pass narrows RQ3/RQ4 instead of restating the scorecard and hint-free harness findings. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/gpt55/iterations/iteration-001.md:34] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/gpt55/iterations/iteration-002.md:27]
- Used external prior art for tool selection, fuzzy tool retrieval, trajectory-level evaluation, and benchmark leakage/circularity risk. [SOURCE: https://arxiv.org/abs/2310.03128] [SOURCE: https://arxiv.org/abs/2508.20453] [SOURCE: https://ojs.aaai.org/index.php/AAAI/article/view/41098]

# Findings

## f-gpt55-i3-01 - Activation should be a composite with separate advisor and in-skill router sub-scores.

Do not choose "advisor only" or "smart router only." They are different gates in the user journey. `system-skill-advisor` first maps the prompt to a skill through exact user direction, advisor recommendation, confidence thresholds, and ambiguity handling. [SOURCE: .opencode/skills/system-skill-advisor/SKILL.md:61] [SOURCE: .opencode/skills/system-skill-advisor/SKILL.md:257] Once the skill is selected, the target skill has a separate router over `INTENT_SIGNALS` and `RESOURCE_MAP`, so the correct skill can be selected while the wrong references are loaded. [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:113] [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:124] MetaTool supports this separation externally because it distinguishes deciding whether to use tools from choosing the right tool(s). [SOURCE: https://arxiv.org/abs/2310.03128]

Recommended Lane C activation output:

| Sub-score | What it measures | Primary remediation |
| --- | --- | --- |
| `advisorActivation` | correct target skill top-1/top-2, confidence, ambiguity, false positives/negatives | advisor aliases, trigger phrases, graph edges, scorer boosts |
| `skillRouterActivation` | correct intent key(s), expected resource/runtime asset set, fallback behavior | `INTENT_SIGNALS`, `RESOURCE_MAP`, loading levels, resource names |
| `activationOutcome` | whether the agent actually engaged the selected skill path before acting | harness/tool availability, prompt contamination, executor behavior |

Aggregate activation can be a weighted score, but the report must print the three raw sub-scores. Otherwise the remediation path is ambiguous.

## f-gpt55-i3-02 - "Properly utilized" means trace-backed use of the right guidance before the decision, not merely skill mention or file access.

The target skill already warns that `Read(SKILL.md)` or `skill(deep-agent-improvement)` is not evidence that the protocol executed. [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:248] Prior iteration 2 reached the same harness conclusion: score both router output and actual tool trace, because the router may select the right resources while the agent ignores them, or the agent may manually recover despite weak routing. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/gpt55/iterations/iteration-002.md:27] MCP-Bench also evaluates tool-level behavior, trajectory-level planning, and task completion rather than final answer alone. [SOURCE: https://arxiv.org/abs/2508.20453]

Operational definition for Lane C: a skill is properly utilized in a scenario only if the run trace proves all required conditions for that scenario class:

1. The correct skill was selected or explicitly kept out for a negative.
2. The correct in-skill intent/resource set was selected or discovered.
3. Required reference/asset files were actually loaded by a tool event before the final decision.
4. Scenario-specific must-do steps were followed when the skill defines them.
5. The final artifact/outcome improves over the skill-off baseline or meets the rubric.

This definition keeps "activation" narrower than "usefulness": activation asks whether the right pathway was entered; utilization asks whether the agent used that pathway well enough to affect the work.

## f-gpt55-i3-03 - Activation failure labels should map directly to the owner surface.

The advisor scorer is multi-lane: explicit author, lexical, graph causal, derived generated, and semantic shadow all contribute differently to confidence and ambiguity. [SOURCE: .opencode/skills/system-skill-advisor/references/scoring/advisor_scorer.md:42] [SOURCE: .opencode/skills/system-skill-advisor/references/scoring/advisor_scorer.md:102] The in-skill router is simpler and local: keyword hits select at most two intents, then load matching resources and runtime assets. [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:165] [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:174] [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:183]

Therefore the report should not emit generic "routing failed." It should emit owner-specific labels:

| Label | Meaning | Likely fix |
| --- | --- | --- |
| `advisor_false_negative` | target skill not recommended for positive scenario | add/adjust advisor trigger, alias, graph edge, derived metadata |
| `advisor_false_positive` | target skill recommended for negative scenario | add negative phrase, reduce over-broad boost, adjust graph edge |
| `advisor_ambiguous` | target skill appears only in an ambiguity cluster | improve disambiguating trigger or command bridge |
| `skill_intent_miss` | skill selected, wrong local intent | add intent keyword, split overlapping intent, adjust weights |
| `skill_resource_miss` | correct intent, missing expected resource | add `RESOURCE_MAP` edge or rename resource for discoverability |
| `runtime_utilization_miss` | resource available but not opened/used | strengthen quick reference, operator flow, or dispatcher prompt |

This owner mapping is the difference between a benchmark and an actionable remediation report.

## f-gpt55-i3-04 - Scenario authoring should be hybrid: hand-authored gold plus trigger-derived coverage probes, with trigger-derived cases capped and labeled.

The parent spec asks whether scenarios should be hand-authored or generated from the skill's own triggers, explicitly naming circularity as an open question. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/spec.md:174] Pure hand-authored scenarios are credible but can miss router coverage. Pure trigger-derived scenarios maximize coverage but risk proving only that the system recognizes its own labels. MCP-Bench points to the right middle ground: realistic fuzzy instructions without explicit tool names, evaluated through trajectory and task completion. [SOURCE: https://arxiv.org/abs/2508.20453]

Recommended fixture origins:

| Origin | Use | Counts toward headline score? |
| --- | --- | --- |
| `gold_hand_authored` | realistic user tasks from actual workflows/specs/incidents | yes |
| `negative_near_miss` | adjacent tasks that should route elsewhere or nowhere | yes |
| `trigger_derived_smoke` | generated from trigger phrases to test declared coverage | capped, diagnostic only or low weight |
| `paraphrase_holdout` | rewritten gold cases with trigger words scrubbed | yes |
| `resource_targeted_probe` | cases designed around a private expected resource/asset | yes if prompt leakage linter passes |

This hybrid keeps trigger-derived fixtures useful as coverage probes while preventing them from dominating the validity claim.

## f-gpt55-i3-05 - Circularity controls need to be explicit fixture metadata and a pre-dispatch leakage linter.

Iteration 2 already recommended a public/private fixture split where public prompt content is visible to the executor and private expected keys are scorer-only. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/gpt55/iterations/iteration-002.md:15] It also recommended blocking public prompts that contain expected paths, resource basenames, intent labels, or direct trigger phrases unless explicitly allowed. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/gpt55/iterations/iteration-002.md:33] External benchmark-leakage work reinforces the risk: public or overfit benchmark material can inflate capability estimates, and dynamic/private test construction is one mitigation. [SOURCE: https://ojs.aaai.org/index.php/AAAI/article/view/41098]

Lane C fixtures should include:

```json
{
  "scenarioId": "skill-benchmark.routing.gold.001",
  "origin": "gold_hand_authored",
  "seedSource": "spec|incident|manual|trigger|generated",
  "headlineWeightEligible": true,
  "public": {
    "prompt": "...",
    "allowedSkillNames": [],
    "forbiddenHints": []
  },
  "private": {
    "expectedSkill": "deep-improvement",
    "expectedAdvisorAliases": ["deep-improvement"],
    "expectedIntentKeys": ["SKILL_BENCHMARK"],
    "expectedResources": ["references/skill-benchmark/scenario_authoring.md"],
    "expectedAssets": [],
    "negativeActivation": false,
    "rubric": []
  },
  "leakagePolicy": {
    "forbidExpectedPathBasename": true,
    "forbidIntentKeyText": true,
    "forbidDirectTriggerUnlessAllowed": true
  }
}
```

The linter should run before dispatch and fail the scenario, not the skill, if fixture contamination is detected.

## f-gpt55-i3-06 - Generated-from-trigger fixtures are useful for recall, but invalid for precision unless paired with negatives and paraphrase holdouts.

Trigger-derived positives mostly answer "does this declared trigger still reach the skill?" They do not answer "would a real user naturally activate this skill?" because the generation seed is already the answer. The 122 spec's core problem is realistic in-situ discovery without telling the AI which file to open or which skill to use. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/spec.md:69] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/spec.md:71]

Use trigger-derived cases for:

- coverage smoke over declared triggers and aliases;
- regression checks after rename or advisor metadata changes;
- discovering dead `INTENT_SIGNALS` or `RESOURCE_MAP` entries.

Do not use them alone for:

- headline advisor precision;
- usefulness claims;
- "works in practice" claims.

To make them safer, require each trigger-derived positive to have a paired near-miss negative and a paraphrase holdout with the original trigger words removed. If the original passes but the paraphrase fails, the finding is `trigger_overfit`, not "skill works."

## f-gpt55-i3-07 - The rename surface is active in advisor code, command docs, agent mirrors, and runtime config, not just prose.

Phase 002 already scopes the rename across the skill directory, `SKILL.md`, commands, agent/runtime mirrors, advisor graph, descriptions, cross-references, and internal self-references. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/002-skill-rename-deep-improvement/spec.md:37] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/002-skill-rename-deep-improvement/spec.md:45] Active code confirms several non-doc surfaces: the advisor alias group maps `deep-agent-improvement` and command aliases, the explicit scorer boosts `/deep:start-agent-improvement-loop` and Lane B phrases with penalties against the canonical id, and the Python shim carries the same alias/boost surface. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:27] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts:98] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts:123] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:250] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:1576]

Active runtime surfaces also name the old agent/skill: the Lane A command describes orchestration through `deep-agent-improvement`, the Lane B command fixes model-benchmark as a mode of `deep-agent-improvement`, the OpenCode agent and Codex mirror are named `deep-agent-improvement`, and `.codex/config.toml` registers the mirror under that id. [SOURCE: .opencode/commands/deep/start-agent-improvement-loop.md:17] [SOURCE: .opencode/commands/deep/start-model-benchmark-loop.md:17] [SOURCE: .opencode/agents/deep-agent-improvement.md:2] [SOURCE: .codex/agents/deep-agent-improvement.toml:3] [SOURCE: .codex/config.toml:21]

Rename map update:

| Bucket | Examples | Treatment |
| --- | --- | --- |
| Canonical skill package | `.opencode/skills/deep-agent-improvement/`, `SKILL.md` name/triggers/keywords | rename to `deep-improvement` |
| Commands | `/deep:start-agent-improvement-loop`, `/deep:start-model-benchmark-loop`, future `/deep:start-skill-benchmark-loop` | keep command verbs; update skill path/name references |
| Agent and mirrors | `.opencode/agents/deep-agent-improvement.md`, `.codex/agents/deep-agent-improvement.toml`, runtime mirror registries | decide agent id explicitly; update mirrors/config consistently |
| Advisor runtime | aliases, explicit boosts, Python shim, projection, skill graph, regression fixtures | update canonical id plus compatibility aliases if desired |
| Skill-local internals | references, assets, scripts, README/test paths | update operational paths; allow historical archive mentions |
| Specs/changelogs/history | packet 121 and old changelogs | allowlist as historical, not operational dangling refs |

## f-gpt55-i3-08 - Lane C should use rename aliases during trace normalization, while Phase 002 remains grep-strict for operational surfaces.

During the transition, runs may produce traces containing both old and new ids. Iteration 2 already recommended normalizing `deep-agent-improvement` and `deep-improvement` to one target id in research/build traces while keeping Phase 002's operational grep-clean requirement strict. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/gpt55/iterations/iteration-002.md:57] Phase 002 success criteria require zero dangling old-name references where the new name is intended, plus advisor rebuild/validate. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/002-skill-rename-deep-improvement/spec.md:50]

Implementation implication for Lane C: the scorer should accept a `skillAliasMap` for trace normalization, but the rename phase should not use that map as an excuse to leave live routing surfaces stale. The alias map prevents false negatives in benchmark traces; the grep/advisor validation prevents real migration drift.

# Recommendations

1. Define the activation dimension as three printed sub-scores: `advisorActivation`, `skillRouterActivation`, and `activationOutcome`. Aggregate only after printing raw sub-scores and failure labels. [SOURCE: .opencode/skills/system-skill-advisor/SKILL.md:61] [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:183]
2. Define "properly utilized" as trace-backed resource use plus process fidelity plus outcome contribution. Do not give utilization credit for skill mention, self-report, or `SKILL.md` read alone. [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:248] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/gpt55/iterations/iteration-002.md:21]
3. Use hybrid scenario authoring: hand-authored gold and near-miss negatives for headline validity, trigger-derived cases for coverage smoke, paraphrase holdouts for overfit detection. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/spec.md:174] [SOURCE: https://arxiv.org/abs/2508.20453]
4. Add fixture metadata for `origin`, `seedSource`, `headlineWeightEligible`, `leakagePolicy`, and private expected keys. Block contaminated public prompts before dispatch. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/gpt55/iterations/iteration-002.md:15] [SOURCE: https://ojs.aaai.org/index.php/AAAI/article/view/41098]
5. For the rename, build a two-mode scanner: strict operational scan for Phase 002 and alias-tolerant trace normalization for Lane C benchmark artifacts. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/002-skill-rename-deep-improvement/spec.md:50] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/gpt55/iterations/iteration-002.md:57]

# Open Questions

- What exact aggregate weights should activation use after the raw sub-scores are printed? My current recommendation is 40% advisor, 40% in-skill router, 20% activation outcome, but this should be calibrated against real traces. [SOURCE: .opencode/skills/system-skill-advisor/references/scoring/advisor_scorer.md:46] [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:124]
- Should trigger-derived fixtures be excluded entirely from headline scoring, or included with a small cap such as 10-15%? The safer default is exclusion from headline validity and inclusion in diagnostic coverage. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/spec.md:174]
- Should the post-rename advisor keep backward-compatible aliases for `deep-agent-improvement`, or should the old id fail fast except in historical specs? This affects both user ergonomics and migration cleanliness. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:27] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/002-skill-rename-deep-improvement/spec.md:50]
