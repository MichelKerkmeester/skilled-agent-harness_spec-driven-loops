Iteration 012 complete. I've successfully analyzed the 3-tier config resolution and dynamic provider discovery patterns from the upstream auto-review plugin, cross-checked our local plugins, and documented concrete adoption proposals.

**Key findings:**
- Upstream uses file-tier (`~/.config/opencode/plugin/auto-review.json`) → env-tier (`AUTO_REVIEW_*`) → default-tier fallback with silent-failure tolerance
- Dynamic provider discovery via `client.config.providers()` adapts to user's configured models without hardcoding
- Our plugins (mk-skill-advisor, mk-code-graph) lack file-tier config, relying only on env vars for binary flags
- Proposed adding 3-tier config to both plugins with specific file paths and env-var prefixes
- Rejected dynamic model discovery for our plugins since they don't dispatch models

**Output:**
- `research/iterations/iteration-012.md` (90 lines) ✓
- `research/deep-research-state.jsonl` (appended iteration record) ✓

All acceptance criteria met. Ready for iteration 013.
d → fall through |
| 3 (Default) | Hardcoded in plugin factory | `config.X ?? env.X ?? default` | n/a |

### Per-Field Resolution
| Field | Tier 1 (file) | Tier 2 (env) | Tier 3 (default) | Effective formula |
|-------|--------------|--------------|------------------|-------------------|
| model | config.model | process.env.AUTO_REVIEW_MODEL | "" | `config.model || process.env.AUTO_REVIEW_MODEL || ""` |
| reasoning | config.reasoning | process.env.AUTO_REVIEW_REASONING | "" | `config.reasoning || process.env.AUTO_REVIEW_REASONING || ""` |
| minToolCalls | config.minToolCalls | n/a | 3 | `config.minToolCalls ?? 3` |
| debug | config.debug | process.env.AUTO_REVIEW_DEBUG === "1" | false | `config.debug ?? process.env.AUTO_REVIEW_DEBUG === "1"` |

**Note**: The upstream uses `??` (nullish coalesce) for `minToolCalls` and `debug`, but `||` (logical OR) for `model` and `reasoning`. This distinction matters: `??` only falls through on null/undefined, while `||` falls through on any falsy value (including empty string). The choice of `||` for model/reasoning allows users to explicitly set an empty string in the config file to override an env var, which is a deliberate UX choice for those fields.

### Config Loading Timing
The upstream calls `loadConfig()` at module initialization time (line 10: `const configPromise = loadConfig()`), making it async but non-blocking. The plugin factory awaits this promise before resolving config values. This pattern ensures config is loaded once at plugin startup rather than on every request, which is appropriate for config that doesn't change during a session.

### Silent-Failure Design Philosophy
Both `loadConfig()` and the dynamic provider discovery use silent-failure patterns:
- `loadConfig()` catches all errors and returns `{}`, never throwing
- `client.config.providers()` failure is caught, logged via debug, and results in an empty `availableModels` array
- This aligns with the plugin's defensive design: missing config or unavailable SDK endpoints should not prevent the plugin from loading, only from functioning optimally

### loadConfig Function (verbatim from upstream)
```typescript
async function loadConfig(): Promise<AutoReviewConfig> {
  const configPath = join(homedir(), ".config", "opencode", "plugin", "auto-review.json")
  try {
    const raw = await readFile(configPath, "utf-8")
    return JSON.parse(raw) as AutoReviewConfig
  } catch {
    return {}
  }
}
```

### Dynamic Provider Discovery (verbatim from upstream)
```typescript
// Fetch available models dynamically from the SDK
let availableModels: ModelSpec[] = []
try {
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
} catch (error) {
  debug("config.providers failed, using empty list", error)
}
```

### Our Plugins vs Upstream Pattern
| Plugin | File-tier? | Env-tier? | Default-tier? | Dynamic model discovery? |
|--------|-----------|-----------|---------------|--------------------------|
| Upstream auto-review | ✅ `~/.config/opencode/plugin/auto-review.json` | ✅ `AUTO_REVIEW_*` | ✅ hardcoded fallbacks | ✅ `client.config.providers()` |
| mk-skill-advisor | ❌ No file-tier config | ✅ `MK_SKILL_ADVISOR_HOOK_DISABLED`, `MK_SKILL_ADVISOR_PLUGIN_DISABLED`, legacy `SPECKIT_*` env vars at :35-38, :66-69, :73-84 | ✅ `DEFAULT_NODE_BINARY` fallback at :119 | n/a (doesn't dispatch models) |
| mk-code-graph | ❌ No file-tier config | ✅ `SPEC_KIT_PLUGIN_NODE_BINARY` at :127, :140 | ✅ `DEFAULT_NODE_BINARY` fallback at :127, :140 | n/a (doesn't dispatch models) |

### Proposed Adoption Plan
| Plugin | Pattern | File path | Env-var prefix | Rationale |
|--------|---------|-----------|---------------|-----------|
| mk-skill-advisor | 3-tier config | `~/.config/opencode/plugin/mk-skill-advisor.json` | `MK_SKILL_ADVISOR_*` | Runtime toggle for debug mode, lane weights override without rebuild, per-project customization of max brief chars and cache entries |
| mk-code-graph | 3-tier config | `~/.config/opencode/plugin/mk-code-graph.json` | `MK_CODE_GRAPH_*` | Runtime override for index path, freshness window (cache TTL), and bridge timeout without code changes |

### Reject List
| Pattern | Why reject | Where would have applied |
|---------|-----------|-------------------------|
| Dynamic model discovery | Our advisor + code-graph plugins don't dispatch models; they expose data via MCP (skill advisor) or build code indices (code graph). The `client.config.providers()` SDK call is only relevant for plugins that create child sessions with model selection. | n/a |

## Convergence Signal
`newInfoRatio: 0.75` — moderate. This iteration extracted 2 reusable patterns (3-tier config resolution and dynamic provider discovery) with verbatim source quotes, and performed a concrete gap analysis against our local plugins using grep evidence. The findings are actionable with specific file paths and env-var prefixes proposed for adoption. `dimension status: FULLY EXTRACTED for config patterns`
