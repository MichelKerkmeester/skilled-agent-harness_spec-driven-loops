# Gate A: Signal Closure Measurement

This is a measurement record, not a fix. It sweeps every signal the five parent hubs declare and checks whether each one resolves end to end to exactly one mode through the daemon-backed advisor. No routing file was touched to produce it.

**Overall Gate A number: 234 / 444 RESOLVED.**

## Method

Declared signals came from two sources per hub, unioned and de-duplicated by exact string: the `intent_signals` column on that hub's row in the advisor graph database, and `derived.trigger_phrases` in that hub's `graph-metadata.json`. Cross-hub overlap was checked and found to be zero. Each signal was sent to the daemon-backed advisor CLI (`skill-advisor.cjs advisor_recommend`), not the Python scorer, since the daemon is the transport that governs automatic routing.

The top result for a reply is `recommendations[0]`, the array's own first entry. This was verified against the scorer source, not assumed: the daemon's internal sort key blends the raw `score` field with per-candidate command, intent and conflict bonuses that are not exposed on the record (`lib/scorer/fusion.ts`, the `ranked = recommendations.sort(...)` block). A first attempt re-sorted replies by the bare `score` field instead of trusting the array's own order, and that attempt inflated the `cli-external-orchestration` RESOLVED count from 7 to 44 on tied scores alone. Reading the sort implementation, then re-deriving the count against `recommendations[0]`, was what caught it.

Each reply was classified into exactly one bucket:

- **RESOLVED**: the top result is the owning hub and `targets` names exactly one mode.
- **NO_RECOMMENDATION**: `recommendations` is empty.
- **WRONG_HUB**: the top result is a different hub.
- **DEFERRED**: the owning hub wins but `targets` is empty or `action` is not `route`.
- **MULTI**: `targets` names more than one mode.

A confidence of exactly `0.8200` is a floor the daemon applies to anything it surfaces at all, not evidence of a real match, so `score` is the field recorded and reasoned about here, never confidence alone.

## Per-hub bucket distribution

| Hub | Total | Resolved | No Recommendation | Wrong Hub | Deferred | Multi |
|---|---|---|---|---|---|---|
| sk-doc | 97 | 87 | 1 | 6 | 3 | 0 |
| sk-code | 93 | 42 | 1 | 3 | 41 | 6 |
| mcp-tooling | 109 | 84 | 7 | 4 | 14 | 0 |
| cli-external-orchestration | 115 | 7 | 47 | 55 | 6 | 0 |
| system-deep-loop | 30 | 14 | 3 | 4 | 9 | 0 |
| **All hubs** | **444** | **234** | **59** | **72** | **73** | **6** |

## Gate A number per hub

- `sk-doc`: 87 / 97
- `sk-code`: 42 / 93
- `mcp-tooling`: 84 / 109
- `cli-external-orchestration`: 7 / 115
- `system-deep-loop`: 14 / 30
- **All hubs combined: 234 / 444**

## Every signal not in RESOLVED

Full list, one row per non-resolved signal, grouped by owning hub then bucket. `skillId` and `score` describe the top result the daemon returned (`recommendations[0]`), not the owning hub, except where the bucket is `DEFERRED` or `MULTI` and the owning hub itself is the top result. `targets` lists each `workflowMode` the compiled route named, comma-separated, empty when there was none.

### sk-doc

10 non-resolved of 97 total.

| Signal | Bucket | Top skillId | Score | Targets |
|---|---|---|---|---|
| dqi score | NO_RECOMMENDATION |  |  |  |
| create agent | WRONG_HUB | create:agent | 0.513333 |  |
| doc quality | WRONG_HUB | sk-code | 0.419264 |  |
| document before after review | WRONG_HUB | sk-code | 0.776858 |  |
| opencode agent | WRONG_HUB | sk-code | 0.709691 |  |
| opencode command | WRONG_HUB | sk-code | 0.804943 |  |
| opencode skill | WRONG_HUB | sk-code | 0.837137 |  |
| create benchmark | DEFERRED | sk-doc | 0.305535 |  |
| documentation hub | DEFERRED | sk-doc | 0.828895 |  |
| sk-doc | DEFERRED | sk-doc | 0.632695 |  |

### sk-code

51 non-resolved of 93 total.

| Signal | Bucket | Top skillId | Score | Targets |
|---|---|---|---|---|
| ink-on-parchment retint | NO_RECOMMENDATION |  |  |  |
| code mode router | WRONG_HUB | mcp-code-mode | 0.697325 |  |
| merge readiness | WRONG_HUB | sk-git | 0.608098 |  |
| pi remote design system | WRONG_HUB | sk-design-md-generator | 0.617459 |  |
| add a fallback | DEFERRED | sk-code | 0.626167 |  |
| add a flag | DEFERRED | sk-code | 0.618583 |  |
| add a method | DEFERRED | sk-code | 0.618583 |  |
| add a parameter | DEFERRED | sk-code | 0.618583 |  |
| agent file | DEFERRED | sk-code | 0.482 |  |
| animation | DEFERRED | sk-code | 0.545264 |  |
| argparse block | DEFERRED | sk-code | 0.556267 |  |
| audit packet docs | DEFERRED | sk-code | 0.767329 |  |
| build a script that | DEFERRED | sk-code | 0.729741 |  |
| build a tiny script | DEFERRED | sk-code | 0.729741 |  |
| code work | DEFERRED | sk-code | 0.756834 |  |
| command script | DEFERRED | sk-code | 0.665467 |  |
| console.error fallback | DEFERRED | sk-code | 0.707583 |  |
| counts how many | DEFERRED | sk-code | 0.620967 |  |
| cross-stack animation | DEFERRED | sk-code | 0.783875 |  |
| early return | DEFERRED | sk-code | 0.556267 |  |
| findings | DEFERRED | sk-code | 0.527633 |  |
| function signature | DEFERRED | sk-code | 0.556267 |  |
| handle empty | DEFERRED | sk-code | 0.570567 |  |
| handle null | DEFERRED | sk-code | 0.556267 |  |
| implement function | DEFERRED | sk-code | 0.6146 |  |
| language-specific verification commands | DEFERRED | sk-code | 0.513037 |  |
| mobile cli source | DEFERRED | sk-code | 0.644935 |  |
| mobile cli source conventions | DEFERRED | sk-code | 0.865671 |  |
| motion animation integration | DEFERRED | sk-code | 0.852572 |  |
| motion api | DEFERRED | sk-code | 0.650514 |  |
| motion decision matrix | DEFERRED | sk-code | 0.831837 |  |
| motion snippets | DEFERRED | sk-code | 0.638597 |  |
| motion-dev integration | DEFERRED | sk-code | 0.773627 |  |
| motion.dev integration | DEFERRED | sk-code | 0.773627 |  |
| motion_dev references | DEFERRED | sk-code | 0.643407 |  |
| refactor function | DEFERRED | sk-code | 0.556267 |  |
| refactor the | DEFERRED | sk-code | 0.462933 |  |
| skill script | DEFERRED | sk-code | 0.723346 |  |
| surface detection routing | DEFERRED | sk-code | 0.366604 |  |
| throw on missing | DEFERRED | sk-code | 0.620967 |  |
| tiny script that counts | DEFERRED | sk-code | 0.707934 |  |
| type annotation | DEFERRED | sk-code | 0.5785 |  |
| verification commands | DEFERRED | sk-code | 0.54687 |  |
| vitest covering | DEFERRED | sk-code | 0.7 |  |
| workflow doctrine | DEFERRED | sk-code | 0.69287 |  |
| code surface detection | MULTI | sk-code | 0.855671 | sk-code-quality,sk-code-review,sk-code-webflow,sk-code-opencode,sk-code-mobile-cli,sk-code-obsidian |
| p0 p1 p2 review | MULTI | sk-code | 0.760531 | sk-code-quality,sk-code-review |
| sk-code | MULTI | sk-code | 0.642787 | sk-code-quality,sk-code-review,sk-code-webflow,sk-code-opencode,sk-code-mobile-cli,sk-code-obsidian |
| sk-code hub | MULTI | sk-code | 0.666837 | sk-code-quality,sk-code-review,sk-code-webflow,sk-code-opencode,sk-code-mobile-cli,sk-code-obsidian |
| stable jsonl keys | MULTI | sk-code | 0.732125 | sk-code-quality,sk-code-opencode |
| surface-aware code implementation | MULTI | sk-code | 0.807637 | sk-code-quality,sk-code-review,sk-code-webflow,sk-code-opencode,sk-code-mobile-cli,sk-code-obsidian |

### mcp-tooling

25 non-resolved of 109 total.

| Signal | Bucket | Top skillId | Score | Targets |
|---|---|---|---|---|
| dom inspect | NO_RECOMMENDATION |  |  |  |
| lighthouse | NO_RECOMMENDATION |  |  |  |
| magicpath | NO_RECOMMENDATION |  |  |  |
| magicpath ai | NO_RECOMMENDATION |  |  |  |
| magicpath canvas | NO_RECOMMENDATION |  |  |  |
| mcp-magicpath | NO_RECOMMENDATION |  |  |  |
| task list | NO_RECOMMENDATION |  |  |  |
| browser debug | WRONG_HUB | sk-code | 0.732421 |  |
| capture browser screenshots | WRONG_HUB | sk-code | 0.666454 |  |
| magicpath design system | WRONG_HUB | sk-design-md-generator | 0.624284 |  |
| mcp tool bridge | WRONG_HUB | mcp-code-mode | 0.666741 |  |
| add note to task | DEFERRED | mcp-tooling | 0.732647 |  |
| chrome-devtools | DEFERRED | mcp-tooling | 0.728685 |  |
| complete task | DEFERRED | mcp-tooling | 0.57259 |  |
| mark task done | DEFERRED | mcp-tooling | 0.388824 |  |
| mcp-chrome-devtools | DEFERRED | mcp-tooling | 0.847802 |  |
| mcp-click-up | DEFERRED | mcp-tooling | 0.745446 |  |
| mcp-tooling | DEFERRED | mcp-tooling | 0.745446 |  |
| note management | DEFERRED | mcp-tooling | 0.715491 |  |
| real app screen search | DEFERRED | mcp-tooling | 0.396246 |  |
| real app ux patterns | DEFERRED | mcp-tooling | 0.302315 |  |
| screen examples | DEFERRED | mcp-tooling | 0.57259 |  |
| start timer | DEFERRED | mcp-tooling | 0.563612 |  |
| stop timer | DEFERRED | mcp-tooling | 0.563612 |  |
| tag task | DEFERRED | mcp-tooling | 0.57259 |  |

### cli-external-orchestration

108 non-resolved of 115 total.

| Signal | Bucket | Top skillId | Score | Targets |
|---|---|---|---|---|
| MiniMax-M3 | NO_RECOMMENDATION |  |  |  |
| anthropic | NO_RECOMMENDATION |  |  |  |
| claude-code | NO_RECOMMENDATION |  |  |  |
| codex sandbox | NO_RECOMMENDATION |  |  |  |
| deepseek dispatch | NO_RECOMMENDATION |  |  |  |
| deepseek-v4 | NO_RECOMMENDATION |  |  |  |
| deepseek-v4-pro | NO_RECOMMENDATION |  |  |  |
| devin subagent | NO_RECOMMENDATION |  |  |  |
| full plugin runtime dispatch | NO_RECOMMENDATION |  |  |  |
| glm | NO_RECOMMENDATION |  |  |  |
| glm coding plan | NO_RECOMMENDATION |  |  |  |
| glm dispatch | NO_RECOMMENDATION |  |  |  |
| glm-5.2 | NO_RECOMMENDATION |  |  |  |
| kimi | NO_RECOMMENDATION |  |  |  |
| kimi dispatch | NO_RECOMMENDATION |  |  |  |
| kimi for coding | NO_RECOMMENDATION |  |  |  |
| kimi-for-coding | NO_RECOMMENDATION |  |  |  |
| kimi-for-coding/k2p7 | NO_RECOMMENDATION |  |  |  |
| kimi-k2.6 | NO_RECOMMENDATION |  |  |  |
| kimi-k2.7 | NO_RECOMMENDATION |  |  |  |
| mimo | NO_RECOMMENDATION |  |  |  |
| mimo pro | NO_RECOMMENDATION |  |  |  |
| mimo-v2.5-pro | NO_RECOMMENDATION |  |  |  |
| minimax | NO_RECOMMENDATION |  |  |  |
| minimax dispatch | NO_RECOMMENDATION |  |  |  |
| minimax m3 | NO_RECOMMENDATION |  |  |  |
| minimax token plan | NO_RECOMMENDATION |  |  |  |
| minimax-coding-plan | NO_RECOMMENDATION |  |  |  |
| minimax-coding-plan/MiniMax-M3 | NO_RECOMMENDATION |  |  |  |
| minimax-m3 | NO_RECOMMENDATION |  |  |  |
| pi community package | NO_RECOMMENDATION |  |  |  |
| pi rpc integration | NO_RECOMMENDATION |  |  |  |
| qwen | NO_RECOMMENDATION |  |  |  |
| qwen dispatch | NO_RECOMMENDATION |  |  |  |
| qwen3.6 | NO_RECOMMENDATION |  |  |  |
| swe-1.6 dispatch | NO_RECOMMENDATION |  |  |  |
| xiaomi | NO_RECOMMENDATION |  |  |  |
| xiaomi api | NO_RECOMMENDATION |  |  |  |
| xiaomi direct | NO_RECOMMENDATION |  |  |  |
| xiaomi token plan | NO_RECOMMENDATION |  |  |  |
| xiaomi-api | NO_RECOMMENDATION |  |  |  |
| xiaomi-token-plan-ams | NO_RECOMMENDATION |  |  |  |
| xiaomi-token-plan-ams/mimo-v2.5-pro | NO_RECOMMENDATION |  |  |  |
| xiaomi/mimo-v2.5-pro | NO_RECOMMENDATION |  |  |  |
| z.ai coding plan | NO_RECOMMENDATION |  |  |  |
| zai-coding-plan | NO_RECOMMENDATION |  |  |  |
| zai-coding-plan/glm-5.2 | NO_RECOMMENDATION |  |  |  |
| ablation suite opencode | WRONG_HUB | sk-code | 0.723304 |  |
| anthropic cli second opinion | WRONG_HUB | cli-claude-code | 0.299764 |  |
| claude cli | WRONG_HUB | cli-claude-code | 0.708749 |  |
| claude code | WRONG_HUB | cli-claude-code | 0.701631 |  |
| claude code cli orchestration | WRONG_HUB | cli-claude-code | 0.821633 |  |
| cli claude code | WRONG_HUB | cli-claude-code | 0.816164 |  |
| cli codex | WRONG_HUB | cli-codex | 0.705227 |  |
| cli cursor | WRONG_HUB | cli-cursor | 0.696431 |  |
| cli devin | WRONG_HUB | cli-devin | 0.69643 |  |
| cli opencode | WRONG_HUB | cli-opencode | 0.848465 |  |
| cli-claude-code | WRONG_HUB | cli-claude-code | 0.816164 |  |
| cli-codex | WRONG_HUB | cli-codex | 0.705228 |  |
| cli-cursor | WRONG_HUB | cli-cursor | 0.696431 |  |
| cli-devin | WRONG_HUB | cli-devin | 0.696431 |  |
| cli-opencode | WRONG_HUB | cli-opencode | 0.848465 |  |
| cli-pi | WRONG_HUB | cli-pi | 0.603097 |  |
| codex cli | WRONG_HUB | cli-codex | 0.705228 |  |
| codex cli orchestration | WRONG_HUB | cli-codex | 0.808342 |  |
| codex diff review | WRONG_HUB | sk-code | 0.789661 |  |
| codex exec | WRONG_HUB | cli-codex | 0.696431 |  |
| cognition cli second opinion | WRONG_HUB | cli-devin | 0.789764 |  |
| cross-ai handback opencode | WRONG_HUB | sk-code | 0.840286 |  |
| cursor agent | WRONG_HUB | cli-cursor | 0.603098 |  |
| cursor ask mode | WRONG_HUB | cli-cursor | 0.27643 |  |
| cursor cli | WRONG_HUB | cli-cursor | 0.696431 |  |
| cursor cloud worker | WRONG_HUB | cli-cursor | 0.183097 |  |
| cursor composer | WRONG_HUB | cli-cursor | 0.69643 |  |
| cursor plan mode | WRONG_HUB | cli-cursor | 0.295601 |  |
| cursor worktree | WRONG_HUB | cli-cursor | 0.598679 |  |
| delegate to claude | WRONG_HUB | cli-claude-code | 0.703938 |  |
| delegate to claude code | WRONG_HUB | cli-claude-code | 0.810011 |  |
| delegate to codex | WRONG_HUB | cli-codex | 0.703938 |  |
| delegate to cursor | WRONG_HUB | cli-cursor | 0.703938 |  |
| delegate to devin | WRONG_HUB | cli-devin | 0.703938 |  |
| delegate to opencode | WRONG_HUB | cli-opencode | 0.788743 |  |
| delegate to pi | WRONG_HUB | cli-pi | 0.59714 |  |
| devin cli | WRONG_HUB | cli-devin | 0.696431 |  |
| devin handoff | WRONG_HUB | cli-devin | 0.638491 |  |
| gpt codex dispatch | WRONG_HUB | cli-codex | 0.27643 |  |
| in-opencode parallel session | WRONG_HUB | sk-code | 0.742091 |  |
| kimi k2.7 code | WRONG_HUB | sk-code | 0.488087 |  |
| kimi-k2.7-code | WRONG_HUB | sk-code | 0.488087 |  |
| openai cli second opinion | WRONG_HUB | cli-codex | 0.789764 |  |
| opencode cli | WRONG_HUB | cli-opencode | 0.850652 |  |
| opencode cli orchestration | WRONG_HUB | cli-opencode | 0.850649 |  |
| opencode run | WRONG_HUB | cli-opencode | 0.732528 |  |
| parallel detached session | WRONG_HUB | cli-opencode | 0.798864 |  |
| pi agent | WRONG_HUB | cli-pi | 0.509764 |  |
| pi cli | WRONG_HUB | cli-pi | 0.603097 |  |
| pi coding agent | WRONG_HUB | cli-pi | 0.589633 |  |
| pi json event stream | WRONG_HUB | sk-code | 0.570794 |  |
| pi.dev cli | WRONG_HUB | cli-pi | 0.708564 |  |
| structured claude code output | WRONG_HUB | cli-claude-code | 0.673229 |  |
| tidd-ec framework | WRONG_HUB | sk-prompt | 0.69786 |  |
| worker farm opencode | WRONG_HUB | sk-code | 0.783962 |  |
| claude-cli | DEFERRED | cli-external-orchestration | 0.658348 |  |
| cli dispatch | DEFERRED | cli-external-orchestration | 0.285227 |  |
| cli-external-orchestration | DEFERRED | cli-external-orchestration | 0.801897 |  |
| cognition-cli | DEFERRED | cli-external-orchestration | 0.27643 |  |
| cross-ai delegation | DEFERRED | cli-external-orchestration | 0.662714 |  |
| executor delegation | DEFERRED | cli-external-orchestration | 0.646031 |  |

### system-deep-loop

16 non-resolved of 30 total.

| Signal | Bucket | Top skillId | Score | Targets |
|---|---|---|---|---|
| evaluate agent | NO_RECOMMENDATION |  |  |  |
| improve agent | NO_RECOMMENDATION |  |  |  |
| score agent candidate | NO_RECOMMENDATION |  |  |  |
| benchmark a model or prompt framework | WRONG_HUB | sk-prompt | 0.845686 |  |
| deep-review | WRONG_HUB | sk-design | 0.297255 |  |
| model benchmark | WRONG_HUB | deep-model-benchmark | 0.606667 |  |
| severity weighted findings | WRONG_HUB | sk-code | 0.534068 |  |
| agent improvement benchmark | DEFERRED | system-deep-loop | 0.687878 |  |
| deep loop workflow | DEFERRED | system-deep-loop | 0.756045 |  |
| deep loop workflows | DEFERRED | system-deep-loop | 0.679478 |  |
| deep review | DEFERRED | system-deep-loop | 0.80559 |  |
| deep-improvement | DEFERRED | system-deep-loop | 0.681057 |  |
| deep-loop-workflows | DEFERRED | system-deep-loop | 0.679478 |  |
| release readiness | DEFERRED | system-deep-loop | 0.78479 |  |
| skill benchmark | DEFERRED | system-deep-loop | 0.567654 |  |
| system-deep-loop | DEFERRED | system-deep-loop | 0.800712 |  |

## Reproduction commands

Declared-signal extraction per hub (`intent_signals` from the graph database, unioned with `derived.trigger_phrases` from `graph-metadata.json`, de-duplicated):

```bash
sqlite3 .opencode/skills/system-skill-advisor/mcp-server/database/skill-graph.sqlite \
  "select intent_signals from skill_nodes where id='<hub>';"
```

Per-signal measurement, run through the daemon-backed advisor CLI:

```bash
node .opencode/bin/skill-advisor.cjs advisor_recommend \
  --json '{"prompt":"<signal>"}' --format json --timeout-ms 60000
```

The sweep itself ran as a background script over the union of all 444 declared signals, batching calls in groups of 20 concurrent daemon requests and writing one JSON reply per signal to its own file. Exit status was read from a `.exit` file per signal, never through a pipe. Classification then read `recommendations[0]` from each reply against the classification rules above, was tallied two ways (a Python pass and an independent `jq` pass reading the same raw replies), and the two tallies agreed exactly (234 / 444, matching per hub).

## Where the method falls short

The daemon's returned `recommendations` array is not sorted by the plain `score` field on each record. The true sort key adds bonuses the reply does not expose. That means `score` alone cannot reconstruct rank order from outside the process, and any future probe against this data must treat `recommendations[0]` as the sole source of truth for rank, never a re-sort. This measurement does that, but a reader diffing against `gate-a-raw.tsv` later should keep the same rule.

A few declared signals are single tokens or fragments rather than full prompts (for example short executor names under `cli-external-orchestration`), which the advisor's low-information abstention path can treat differently from a full sentence. Those rows are still measured and reported as-is. No signal was excluded or rephrased.

