# Deep Research Iteration 012 of 20 — Config 3-tier (JSON > env > defaults) + dynamic provider discovery

## SITUATION

You are running as **cli-devin SWE-1.6** in non-interactive print mode, dispatched as iteration 12 of a 20-iteration deep-research campaign on the upstream `dzianisv/opencode-plugins` `auto-review` package.

**Prior context (REQUIRED)**:
- Iter 002 documented the example.json config schema
- Iter 003 documented `loadConfig` and `AutoReviewConfig` type
- Iter 005 documented the resolution at plugin-init time (`config.X ?? process.env.AUTO_REVIEW_X ?? default`)

**Why this iter exists**: this plugin demonstrates two reusable config patterns that our plugins do not consistently apply:

1. **3-tier config resolution**: file > env > default. Each tier is silent-failure-tolerant.
2. **Dynamic provider/model discovery**: rather than hardcoding model lists, query the OpenCode SDK at runtime via `client.config.providers()`.

Our `mk-skill-advisor.js` and `mk-code-graph.js` plugins use SOME config from `process.env`, but lack the file-tier and don't dynamically discover models. Investigate whether adopting these patterns would improve our plugin ergonomics.

## TASK

### Step 1 — Aggregate config-related findings

```bash
sed -n '1,200p' .opencode/specs/skilled-agent-orchestration/z_archive/086-opencode-auto-review-teachings-research/research/iterations/iteration-002.md
sed -n '1,200p' .opencode/specs/skilled-agent-orchestration/z_archive/086-opencode-auto-review-teachings-research/research/iterations/iteration-003.md
sed -n '1,300p' .opencode/specs/skilled-agent-orchestration/z_archive/086-opencode-auto-review-teachings-research/research/iterations/iteration-005.md
```

Document:
- File-tier: `~/.config/opencode/plugin/auto-review.json` (silent-fail to `{}`)
- Env-tier: `AUTO_REVIEW_MODEL`, `AUTO_REVIEW_REASONING`, `AUTO_REVIEW_DEBUG`
- Default-tier: `model: ""`, `reasoning: ""`, `minToolCalls: 3`, `debug: false`
- Resolution order: file value first (truthy), else env, else default

### Step 2 — Document the dynamic provider discovery

From iter-005, the runReview function calls:

```typescript
const { data } = await client.config.providers({ query: { directory: sessionDirectory } })
const providersData = data as { providers?: Array<{ id: string; models: Record<string, { id: string }> }> } | undefined
if (providersData?.providers) {
  for (const provider of providersData.providers) {
    for (const modelKey of Object.keys(provider.models || {})) {
      const model = provider.models[modelKey]
      if (model?.id) {
        availableModels.push({ providerID: provider.id, modelID: model.id })
      }
    }
  }
}
```

Document:
- SDK call: `client.config.providers({ query: { directory } })`
- Response shape: `{ providers?: Array<{ id, models: Record<modelKey, {id}> }> }`
- Iteration: outer loop over providers, inner loop over models
- Resilience: empty/null providers → empty `availableModels` array (silent)
- Effect: the algorithm adapts to whatever the user has configured (no hardcoding)

### Step 3 — Cross-check our plugins

```bash
# Does mk-skill-advisor have a config-file tier?
rg -nC2 'loadConfig|readFile|process.env|getenv|MK_SKILL_ADVISOR' .opencode/plugins/mk-skill-advisor.js 2>&1 | head -30

# Does mk-code-graph?
rg -nC2 'loadConfig|readFile|process.env|getenv|MK_CODE_GRAPH' .opencode/plugins/mk-code-graph.js 2>&1 | head -30

# Do our plugins discover models dynamically?
rg -nC2 'providers|config.providers|availableModels' .opencode/plugins/ 2>&1 | head -20
```

Comparison table:

| Plugin | File-tier config? | Env-tier config? | Default-tier? | Dynamic model discovery? |
|--------|------------------|------------------|--------------|--------------------------|
| Upstream auto-review | ✅ `~/.config/opencode/plugin/auto-review.json` | ✅ `AUTO_REVIEW_*` | ✅ hardcoded fallbacks | ✅ `client.config.providers()` |
| mk-skill-advisor | <YES/NO + path> | <YES/NO + list> | <YES/NO> | n/a (doesn't need model discovery) |
| mk-code-graph | <YES/NO + path> | <YES/NO + list> | <YES/NO> | n/a |

### Step 4 — Propose adoption

For each of our plugins, propose concrete changes:

| Plugin | Pattern to adopt | File path | Env-var prefix | Rationale |
|--------|-----------------|-----------|---------------|-----------|
| mk-skill-advisor | 3-tier config | `~/.config/opencode/plugin/mk-skill-advisor.json` | `MK_SKILL_ADVISOR_*` | runtime toggle for debug, lane weights override without rebuild |
| mk-code-graph | 3-tier config | `~/.config/opencode/plugin/mk-code-graph.json` | `MK_CODE_GRAPH_*` | runtime override for index path, freshness window |

Note any pattern that should NOT be adopted (e.g. dynamic model discovery doesn't apply to advisor/code-graph because they don't dispatch models).

## SCOPE

- Iter outputs 002, 003, 005
- Local plugins: `.opencode/plugins/mk-skill-advisor.js`, `.opencode/plugins/mk-code-graph.js`
- **No writes outside `research/iterations/iteration-012.md` and `research/deep-research-state.jsonl`**

## VERIFICATION COMMANDS

```bash
sed -n '1,200p' .opencode/specs/skilled-agent-orchestration/z_archive/086-opencode-auto-review-teachings-research/research/iterations/iteration-002.md
sed -n '1,200p' .opencode/specs/skilled-agent-orchestration/z_archive/086-opencode-auto-review-teachings-research/research/iterations/iteration-003.md
sed -n '1,300p' .opencode/specs/skilled-agent-orchestration/z_archive/086-opencode-auto-review-teachings-research/research/iterations/iteration-005.md

rg -nC3 'loadConfig|readFile|process.env|MK_SKILL_ADVISOR|MK_CODE_GRAPH|providers' .opencode/plugins/ 2>&1 | head -40
```

## CONSTRAINTS

- READ-ONLY.
- Quote `loadConfig` verbatim (from iter-003).
- Quote the providers-discovery block verbatim (from iter-005).
- Cite local plugin file:line for every "we have X" / "we don't have X" claim.

## COMMON FAILURE MODES

1. **Confusing `??` vs `||`**: nullish coalesce (`??`) only falls through on null/undefined; `||` falls through on any falsy. Note which the upstream uses.
2. **process.env lookup vs argv**: the upstream uses `process.env.AUTO_REVIEW_*`; don't confuse with command-line args.
3. **Silent-failure vs throw**: `loadConfig` returns `{}` on any error rather than throwing. Don't mis-state this.

## OUTPUT FORMAT

Write to `research/iterations/iteration-012.md`:

```markdown
<!-- PINNED_UPSTREAM_SHA: <sha> -->

# Iteration 012 — Config 3-tier + dynamic provider discovery

## Summary
<2-4 sentence verdict>

## Findings

### 3-Tier Config Resolution
| Tier | Source | Mechanism | Failure mode |
|------|--------|-----------|--------------|
| 1 (File) | `~/.config/opencode/plugin/auto-review.json` | `loadConfig()` async readFile | silent → `{}` |
| 2 (Env) | `AUTO_REVIEW_MODEL`, `AUTO_REVIEW_REASONING`, `AUTO_REVIEW_DEBUG` | `process.env.X` | undefined → fall through |
| 3 (Default) | Hardcoded in plugin factory | `config.X ?? env.X ?? default` | n/a |

### Per-Field Resolution
| Field | Tier 1 (file) | Tier 2 (env) | Tier 3 (default) | Effective formula |
|-------|--------------|--------------|------------------|-------------------|
| model | config.model | process.env.AUTO_REVIEW_MODEL | "" | `config.model \|\| process.env.AUTO_REVIEW_MODEL \|\| ""` |
| reasoning | config.reasoning | process.env.AUTO_REVIEW_REASONING | "" | same pattern |
| minToolCalls | config.minToolCalls | n/a | 3 | `config.minToolCalls ?? 3` |
| debug | config.debug | process.env.AUTO_REVIEW_DEBUG === "1" | false | `config.debug ?? process.env.AUTO_REVIEW_DEBUG === "1"` |

### Dynamic Provider Discovery (verbatim from iter-005)
```typescript
<verbatim block from auto-review.ts>
```

### Our Plugins vs Upstream Pattern
| Plugin | File-tier? | Env-tier? | Default-tier? | Dynamic model discovery? |
|--------|-----------|-----------|---------------|--------------------------|
| Upstream auto-review | ✅ | ✅ | ✅ | ✅ |
| mk-skill-advisor | <answer> | <answer> | <answer> | n/a |
| mk-code-graph | <answer> | <answer> | <answer> | n/a |

### Proposed Adoption Plan
| Plugin | Pattern | File path | Env-var prefix | Rationale |
|--------|---------|-----------|---------------|-----------|
| mk-skill-advisor | 3-tier config | `~/.config/opencode/plugin/mk-skill-advisor.json` | `MK_SKILL_ADVISOR_*` | <reason> |
| mk-code-graph | 3-tier config | `~/.config/opencode/plugin/mk-code-graph.json` | `MK_CODE_GRAPH_*` | <reason> |

### Reject List
| Pattern | Why reject | Where would have applied |
|---------|-----------|-------------------------|
| Dynamic model discovery | Our advisor + code-graph plugins don't dispatch models; they expose data via MCP | n/a |

## Convergence Signal
`newInfoRatio: <0.0-1.0>` — moderate.
```

Then append to `research/deep-research-state.jsonl`:

```jsonl
{"type":"iteration","run":12,"focus":"config 3-tier + dynamic provider discovery","mechanismsExtracted":2,"gapsIdentified":<N>,"newInfoRatio":<0.0-1.0>,"executor":"cli-devin","model":"swe-1.6","pinnedSha":"<sha>","durationSec":<N>,"timestamp":"<ISO8601>"}
```

## ACCEPTANCE CRITERIA FOR THIS ITER

- [ ] 3-tier resolution table with per-tier mechanism + failure mode
- [ ] Per-field resolution table with effective formula
- [ ] Dynamic provider discovery block quoted verbatim
- [ ] Our-plugins comparison table populated with grep evidence
- [ ] Proposed adoption plan with concrete file paths + env-var prefixes
- [ ] Reject list (at least 1 entry)
- [ ] Output file ≥ 90 lines

Begin.
