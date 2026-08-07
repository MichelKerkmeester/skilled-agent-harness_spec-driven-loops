# Iteration 3: Complete `prompt-models` Resource Map

## Focus
Define and resolve-check the complete `prompt-models` `RESOURCE_MAP`, separating route-load leaves from supporting-only resources. The strategy's stale `Next Focus` still names the completed dependency plan, so this iteration follows the explicit iteration-3 prompt and carried-forward resource-map question instead. The selected interpretation treats every file the packet router can directly load as part of the route-load surface, while distinguishing the five model-selected leaves from the two lifecycle leaves.

## Findings
1. The complete route-load surface has seven Markdown leaves: the always-loaded model index, the post-selection pattern index, and five active model profiles. The router names `_index.md` and `pattern_index.md` as constants, loads the index before model resolution, and loads one canonical profile plus the pattern index only after a successful model match. [SOURCE: .opencode/skills/sk-prompt/prompt-models/SKILL.md:123] [SOURCE: .opencode/skills/sk-prompt/prompt-models/SKILL.md:168] [SOURCE: .opencode/skills/sk-prompt/prompt-models/SKILL.md:182]
2. The five profile leaves are the only model-selected leaves. `_index.md` is an `ALWAYS` lifecycle leaf and `pattern_index.md` is a conditional post-selection bridge, so typed-gold expectations should not pretend either identifies the requested model. The active set is exactly DeepSeek, Kimi, MiniMax, MiMo, and GLM; Haiku is explicitly optional and has no active profile. [SOURCE: .opencode/skills/sk-prompt/prompt-models/SKILL.md:103] [SOURCE: .opencode/skills/sk-prompt/prompt-models/references/models/_index.md:22] [SOURCE: .opencode/skills/sk-prompt/prompt-models/references/models/_index.md:41]
3. Aliases are routing signals, not resource leaves. Every accepted alias normalizes to one of the five canonical profile ids, so aliases must point to the same five map keys rather than create duplicate addresses or synthetic files. [SOURCE: .opencode/skills/sk-prompt/prompt-models/SKILL.md:59] [SOURCE: .opencode/skills/sk-prompt/prompt-models/SKILL.md:64] [SOURCE: .opencode/skills/sk-prompt/prompt-models/SKILL.md:150]
4. Eight packet resources are supporting-only data under the current router: `references/context_budget.md`, `references/output_verification.md`, `references/quota_fallback.md`, `references/vision-audit-benchmark.md`, `assets/per_model_budgets.json`, `assets/confidence_scoring_rubric.md`, `assets/model_profiles.json`, and `assets/cli_prompt_quality_card.md`. The router's declared load levels contain none of these; assets are explicitly shared data referenced by profiles/indexes, and the JSON files are additionally ineligible because the guard permits only Markdown. [SOURCE: .opencode/skills/sk-prompt/prompt-models/SKILL.md:103] [SOURCE: .opencode/skills/sk-prompt/prompt-models/SKILL.md:117] [SOURCE: .opencode/skills/sk-prompt/prompt-models/SKILL.md:136] [SOURCE: .opencode/skills/sk-prompt/prompt-models/SKILL.md:256] [SOURCE: .opencode/skills/sk-prompt/prompt-models/references/vision-audit-benchmark.md:1]
5. Every proposed packet-qualified route address resolves on disk, and each converts exactly once to a packet-root-relative typed pair. The candidate map is therefore deterministic:

   | Map key | Packet-qualified address | Typed pair | Role |
   | --- | --- | --- | --- |
   | `MODEL_INDEX` | `prompt-models/references/models/_index.md` | (`prompt-models`, `references/models/_index.md`) | lifecycle: always/default |
   | `PATTERN_INDEX` | `prompt-models/references/pattern_index.md` | (`prompt-models`, `references/pattern_index.md`) | lifecycle: post-selection bridge |
   | `PROFILE_DEEPSEEK_V4_PRO` | `prompt-models/references/models/deepseek-v4-pro.md` | (`prompt-models`, `references/models/deepseek-v4-pro.md`) | model-selected |
   | `PROFILE_KIMI_K2_7_CODE` | `prompt-models/references/models/kimi-k2.7-code.md` | (`prompt-models`, `references/models/kimi-k2.7-code.md`) | model-selected |
   | `PROFILE_MINIMAX_M3` | `prompt-models/references/models/minimax-m3.md` | (`prompt-models`, `references/models/minimax-m3.md`) | model-selected |
   | `PROFILE_MIMO_V2_5_PRO` | `prompt-models/references/models/mimo-v2.5-pro.md` | (`prompt-models`, `references/models/mimo-v2.5-pro.md`) | model-selected |
   | `PROFILE_GLM_5_2` | `prompt-models/references/models/glm-5.2.md` | (`prompt-models`, `references/models/glm-5.2.md`) | model-selected |

   The index links all five active files, while the router's guarded inventory resolves Markdown only within packet `references/` and `assets/`; a bounded inventory check found all seven candidate files and all eight supporting files. [SOURCE: .opencode/skills/sk-prompt/prompt-models/references/models/_index.md:24] [SOURCE: .opencode/skills/sk-prompt/prompt-models/SKILL.md:123] [SOURCE: .opencode/skills/sk-prompt/prompt-models/SKILL.md:143]

## Ruled Out
- Adding one `RESOURCE_MAP` entry per alias: aliases normalize to canonical ids before profile construction, so duplicate alias leaves would misrepresent the router and create duplicate typed pairs. [SOURCE: .opencode/skills/sk-prompt/prompt-models/SKILL.md:150]
- Promoting every discovered Markdown file to typed gold: discovery establishes availability, not selection; the actual router loads only the index, one profile, and the pattern index. [SOURCE: .opencode/skills/sk-prompt/prompt-models/SKILL.md:143] [SOURCE: .opencode/skills/sk-prompt/prompt-models/SKILL.md:168]
- Treating JSON registry/budget assets as leaves: `_guard_in_skill` rejects non-Markdown resources. [SOURCE: .opencode/skills/sk-prompt/prompt-models/SKILL.md:136]

## Dead Ends
No new exhausted approach category. Keep the previously blocked conversion of packet entrypoints into leaf gold excluded; this iteration instead supplies the separate packet-qualified second-layer map.

## Edge Cases
- Ambiguous input: “route leaf” could mean model-selected only or any file directly loaded by the router. This iteration records both classifications: five model-selected leaves and two lifecycle route-load leaves; supporting-only resources remain outside typed model selection.
- Contradictory evidence: none.
- Missing dependencies: packet memory remains unavailable, but direct repository evidence and a bounded on-disk inventory were sufficient.
- Partial success: none.

## Sources Consulted
- `.opencode/skills/sk-prompt/prompt-models/SKILL.md:55`
- `.opencode/skills/sk-prompt/prompt-models/SKILL.md:103`
- `.opencode/skills/sk-prompt/prompt-models/SKILL.md:123`
- `.opencode/skills/sk-prompt/prompt-models/SKILL.md:143`
- `.opencode/skills/sk-prompt/prompt-models/SKILL.md:168`
- `.opencode/skills/sk-prompt/prompt-models/SKILL.md:256`
- `.opencode/skills/sk-prompt/prompt-models/references/models/_index.md:22`
- `.opencode/skills/sk-prompt/prompt-models/references/vision-audit-benchmark.md:1`
- Bounded packet inventory command output (15 files under `references/` and `assets/`; all seven candidate addresses present)

## Assessment
- New information ratio: 0.90
- Questions addressed: What resources must a `prompt-models` `RESOURCE_MAP` expose, and do all proposed leaves resolve?
- Questions answered: What resources must a `prompt-models` `RESOURCE_MAP` expose, and do all proposed leaves resolve?

## Reflection
- What worked and why: Joining the executable router's load branches with the exact packet inventory separated semantic selection from mere file discoverability.
- What did not work and why: The strategy's machine-owned `Next Focus` lagged one iteration and still named the dependency plan; the explicit prompt and carried-forward question provided the narrower authoritative focus.
- What I would do differently: In the benchmark iteration, encode role metadata (`model-selected`, `always`, `post-selection`) beside typed pairs so scoring does not credit lifecycle loads as model-selection decisions.

## Recommended Next Focus
Reconcile the baseline score of 100 with the canonical report's measured/null dimensions, then compute the typed-routing score using the seven-leaf map while scoring model selection against only the five model-selected leaves.
