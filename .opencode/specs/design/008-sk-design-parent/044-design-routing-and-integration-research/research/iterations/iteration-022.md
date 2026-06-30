# Iteration 22: D3-A5 Negative Routing For Design Taste Prompts

## Focus

[D3-A5 / D3] negative routing: prove a design prompt ranks `sk-design` #1 and ranks Figma/Open Design transports below it for taste intents, using the local repo corpus. This pass does not re-cover D3-A1 through D3-A4 hub-router policy; it isolates advisor-level parent activation versus transport suppression.

## Actions Taken

1. Read prior D3 state and strategy to avoid repeating the registry, utilization-proof, and ambiguity findings from iterations 18-21.
2. Read the `sk-design` hub, graph metadata, and transport skills to separate taste authority from transport authority. [SOURCE: .opencode/skills/sk-design/SKILL.md:3] [SOURCE: .opencode/skills/sk-design/SKILL.md:31] [SOURCE: .opencode/skills/sk-design/SKILL.md:41] [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:21] [SOURCE: .opencode/skills/mcp-figma/SKILL.md:52]
3. Tried the daemon-backed advisor CLI first. It failed under this sandbox with `EPERM /tmp/mk-skill-advisor/daemon-ipc.sock`, so the proof uses the benchmark harness's Python advisor path.
4. Ran the deterministic Python advisor probe against this public prompt: "Design a distinctive product dashboard UI with a custom visual direction, palette, typography, layout hierarchy, motion, and accessibility audit. I need design taste and judgment, not Figma or Open Design transport."
5. Read the skill-benchmark advisor scoring code to verify what is currently enforceable and what fixture schema it lacks. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:11] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:140] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:265]

## Findings

### Finding 1: A taste-heavy design prompt already ranks `sk-design` first in the deterministic local advisor path

The direct Python advisor returned:

```text
1. sk-design       confidence 0.9328, score 0.767969
2. sk-code         confidence 0.8667, score 0.645047
3. mcp-open-design confidence 0.82,   score 0.517291
4. sk-code-review  confidence 0.82,   score 0.481533
5. mcp-figma       confidence 0.82,   score 0.3553
```

The benchmark's own wrapper over the same advisor returned `topSkill: "sk-design"` with `mcp-open-design` at rank 3 and `mcp-figma` at rank 5. That is the exact negative-routing shape this angle needed: the taste skill wins, and transport skills remain lower-ranked even when the prompt explicitly says "not Figma or Open Design transport."

This is not a live-model claim. The advisor-probe script says it runs the in-repo Python advisor over the public prompt and reads ranked recommendations from the compiled SQLite skill graph, not an LLM. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:11] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:13] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:15]

Buildable recommendation: add a playbook scenario such as `sk-design-negative-transport-taste.yml` with `expectedSkillId: sk-design`, `rankBelowSkillIds: [mcp-open-design, mcp-figma]`, and a public prompt that names taste axes plus explicitly negates transport. Run it with `run-skill-benchmark.cjs --skill sk-design --advisor-mode=python`.

Label: ENFORCEABLE on the deterministic local advisor corpus. Advisory only for unconstrained live prompts outside the replay fixture set.

### Finding 2: The file-backed contract already says transports are not taste authorities

The `sk-design` hub is authored as the advisor-routable design authority: its description covers visual direction, taste, interface build judgment, color, typography, motion, audit, and design-system extraction. [SOURCE: .opencode/skills/sk-design/SKILL.md:3] It also says the advisor routes any design query to the single `sk-design` identity before the hub picks a mode. [SOURCE: .opencode/skills/sk-design/SKILL.md:41] Generic "make this look good" prompts default to `interface`, while build/UI work auto-loads the interface/foundations bundle and proof cards. [SOURCE: .opencode/skills/sk-design/SKILL.md:56] [SOURCE: .opencode/skills/sk-design/SKILL.md:60]

The transport skills say the same thing from the other side. Open Design says it is "the transport, never the taste", must load `sk-design` before UI/design work, and must never produce or shape UI through Open Design without `sk-design`. [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:21] [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:263] [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:275] Figma says to skip `mcp-figma` when the work is design judgment itself, because that is `sk-design`, and to apply `sk-design` when a Figma read/export feeds a design decision. [SOURCE: .opencode/skills/mcp-figma/SKILL.md:52] [SOURCE: .opencode/skills/mcp-figma/SKILL.md:111] [SOURCE: .opencode/skills/mcp-figma/SKILL.md:250]

Buildable recommendation: make this a negative-routing invariant, not prose only: for taste prompts, `sk-design` must be rank 1, and `mcp-open-design` / `mcp-figma` must not rank above it. For prompts that genuinely ask for a transport action, the fixture should expect the transport to appear, but still require a pairing proof that `sk-design` is loaded before taste-affecting output.

Label: ENFORCEABLE for advisor replay and transport-pairing proof fields; ADVISORY for whether the final design judgment is high-quality.

### Finding 3: The benchmark can score top-skill activation, but it cannot yet express "these transports must rank below the taste skill"

`scoreD1Inter()` already rank-weights expected advisor selection: top-1 gets full credit, top-3 partial credit, top-5 lower partial credit, else zero. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:140] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:150] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:160] It also supports negative scenarios, but only by checking that the target skill is absent or low-ranked. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:155] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:157]

The scenario scorer passes a single `expected.skillId` into `scoreD1Inter()` and stores only rank/topSkill for that one target. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:265] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:268] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:270] Existing tests confirm the current surface: top-1 is full credit, rank 3 is partial, absence is zero, and negative scenarios invert for the target skill only. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts:195] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts:201] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts:206] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts:211]

So the harness can prove "`sk-design` is #1" today, but cannot directly fail "mcp-open-design outranked `sk-design`" unless the scenario is hand-coded as a separate negative target. That loses the relational invariant.

Buildable recommendation: extend the playbook expected schema and scoring output:

```yaml
expectedSkillId: sk-design
rank: 1
rankBelowSkillIds:
  - mcp-open-design
  - mcp-figma
negativePromptClass: transport-as-taste
```

Then add `scoreRelativeAdvisorRanking()` to check every listed transport's rank is either absent or greater than the expected skill's rank. Report it under D1-inter as `relativeRankBelow`, and make it gating for this fixture class.

Label: ENFORCEABLE. The missing part is schema and scorer support, not runtime judgment.

## Questions Answered

- Q2/D3: Parent activation can be made provable at advisor level with a deterministic replay fixture: the public taste prompt must return `sk-design` as topSkill, while transport skills must rank below it.
- Q5/all: Enforceable items are advisor replay, top-rank assertion, relative transport-below assertion, and transport pairing proof. Advisory items are live prompt interpretation outside fixtures and actual design quality.

## Questions Remaining

- Should `rankBelowSkillIds` live in the existing playbook scenario schema, or in a D3-specific advisor-ranking fixture file that can be reused by other parent/transport families?
- Should `mcp-open-design` at rank 3 count as acceptable because it is still below `sk-design`, or should explicit "not Open Design transport" language require it to be absent entirely?
- How should positive transport prompts be paired: should a prompt like "use Figma to export tokens for this design" expect `mcp-figma` rank 1 plus a required `sk-design` pairing edge, or `sk-design` rank 1 plus `mcp-figma` rank 2?

## Sources Consulted

- `.opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/deep-research-strategy.md`
- `.opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-018.md`
- `.opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-019.md`
- `.opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-020.md`
- `.opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-021.md`
- `.opencode/skills/sk-design/SKILL.md`
- `.opencode/skills/sk-design/graph-metadata.json`
- `.opencode/skills/mcp-open-design/SKILL.md`
- `.opencode/skills/mcp-figma/SKILL.md`
- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs`
- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs`
- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts`

## Assessment

newInfoRatio: 0.64. Novelty is moderate: previous iterations already proved the parent-router gap and advisory mode-precision problem, but this iteration adds concrete local advisor evidence and a buildable relative-ranking gate for transport suppression.

Confidence: high for deterministic advisor replay and file-backed transport subordination; medium for the exact schema placement because that depends on whether the benchmark maintainers want this as a generic D1-inter extension or a design-family-specific fixture.

## Reflection

The useful distinction is not "hide transports". The right invariant is "transports may be present, but never as the taste authority." A taste prompt can legitimately surface `mcp-open-design` or `mcp-figma` as related tools, but a regression should fire if either outranks `sk-design`.

Ruled out: treating the transport skills as negative-activation-only targets. That can prove absence, but it cannot encode the relational contract that the transport is allowed below the taste authority.

## Next Focus

D3-A6 should design the positive counterpart: transport-specific prompts where `mcp-figma` or `mcp-open-design` should activate, while a content-bound pairing proof still requires `sk-design` before any taste-affecting output.
