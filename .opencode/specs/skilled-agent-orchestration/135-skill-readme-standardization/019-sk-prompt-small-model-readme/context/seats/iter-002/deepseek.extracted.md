Now let me read the model profiles and index:
Here is the full verification report:

---

# 1. EXACT INVOCATION & NAVIGATION

**How the skill is reached (advisor enhances edges):**

The advisor co-surfaces this skill alongside `cli-devin` or `cli-opencode` through `enhances` edges in `graph-metadata.json`, each weighted 0.5:

```json
// .opencode/skills/sk-prompt-small-model/graph-metadata.json:8-19
"enhances": [
  { "target": "cli-devin", "weight": 0.5, ... },
  { "target": "cli-opencode", "weight": 0.5, ... }
]
```

SKILL.md:185-187 confirms: "The skill-advisor still surfaces this hub via `graph-metadata.json` trigger phrases (lexical) and the `enhances` edges from `cli-devin`/`cli-opencode` (graph)".

**Navigation chain (Phase Detection, SKILL.md:79-86):**

```
STEP 0: Resolve the target model id (alias map) — the routing key
Phase 1: Load references/models/_index.md, pick the model
Phase 2: Load references/models/<id>.md for framework + scaffold + gotchas
Phase 3: Follow references/pattern-index.md to executor MECHANICS in the cli-X
```

**What each profile documents (mirrors `model-profiles.json` `recommended_frameworks`):**

Each `<id>.md` profile records:
- **Framework primary and fallback** — e.g. `mimo-v2.5-pro.md:52-54`: "**Primary:** COSTAR / **Fallback:** RACE / **Avoid:** `tidd-ec`, `cidi`"
- **Pre-planning density** — e.g. `mimo-v2.5-pro.md:56`: "**Pre-planning density:** lean (2–3 ordered steps with acceptance criteria)"
- **Scaffold** — a tuned template snippet (e.g. `mimo-v2.5-pro.md:98-131`)
- **Gotchas** — a dispatch-gotchas table (e.g. `mimo-v2.5-pro.md:146-165`)

Every profile cites the registry as source: `mimo-v2.5-pro.md:58`: "These choices mirror `recommended_frameworks` in `model-profiles.json#mimo-v2.5-pro`".

---

# 2. CAPABILITY ROSTER

**Exact model list with recommended frameworks (from `model-profiles.json`):**

| Model | Primary | Fallback | Avoid | Density | Evidence Status |
|---|---|---|---|---|---|
| `swe-1.6` | `rcaf` | `null` | `[]` | `medium` | default-unverified |
| `deepseek-v4-pro` | `rcaf` | `null` | `[]` | `medium` | default-unverified |
| `kimi-k2.6` | `rcaf` | `null` | `[]` | `medium` | default-unverified |
| `qwen3.6` | `rcaf` | `null` | `[]` | `medium` | default-unverified |
| `glm-5.1` | `rcaf` | `null` | `[]` | `medium` | default-unverified |
| `minimax-m3` | `tidd-ec` | `rcaf` | `[]` | `dense` | empirical (benchmark 003) |
| `minimax-2.7` | `tidd-ec` | `rcaf` | `[]` | `dense` | historical |
| `mimo-v2.5-pro` | `costar` | `race` | `["tidd-ec","cidi"]` | `lean` | empirical (benchmark 004) |
| `haiku` | (none — no `recommended_frameworks` object) | — | — | — | optional-unverified |

Source: `.opencode/skills/sk-prompt-small-model/assets/model-profiles.json:5-476`.

**Prompt-craft versus mechanics ownership split (SKILL.md:214-216):**

> "This skill OWNS per-model prompt-craft profiles (`references/models/<id>.md`) and the model registry DATA (`assets/model-profiles.json`); `cli-devin`/`cli-opencode` own executor MECHANICS (flags, wrappers, budgets, permissions); `sk-prompt` owns generic framework definitions; `system-spec-kit` owns runtime helpers."

**Pattern set (from `references/pattern-index.md:33-48`):**

| Pattern | Owner |
|---|---|
| Context budget engine | `cli-devin` |
| Output verification pipeline | `cli-devin` |
| Confidence-scoring rubric | `cli-devin` |
| Per-model budget defaults | `cli-devin` |
| Quota-pool-aware fallback | `cli-devin` |
| Model-profile registry | `sk-prompt-small-model` |
| Bayesian tool scoring | `system-spec-kit` + `cli-devin` |
| Fallback router | `system-spec-kit` |
| Structured permissions schema | `cli-opencode` |
| Structured permissions reference | `cli-opencode` |
| Permissions gate runtime | `system-spec-kit` |
| cli-opencode budget propagation | `cli-opencode` |
| MiniMax-M3 prompt-framework guidance | `sk-prompt-small-model` |
| MiMo-V2.5-Pro prompt-framework guidance | `sk-prompt-small-model` |

---

# 3. KEY FILES

| File | One-line role |
|---|---|
| `.opencode/skills/sk-prompt-small-model/SKILL.md` | Runtime entry point: smart router, dispatch matrix, rules, resource domains |
| `.opencode/skills/sk-prompt-small-model/references/models/_index.md` | Thin per-model index: id → framework primary, fallback, density, status |
| `.opencode/skills/sk-prompt-small-model/references/models/swe-1.6.md` | Prompt-craft profile: RCAF + medium pre-planning for SWE-1.6 |
| `.opencode/skills/sk-prompt-small-model/references/models/deepseek-v4-pro.md` | Prompt-craft profile: RCAF + medium pre-planning for DeepSeek-v4-pro |
| `.opencode/skills/sk-prompt-small-model/references/models/kimi-k2.6.md` | Prompt-craft profile: RCAF + medium pre-planning for Kimi-k2.6 |
| `.opencode/skills/sk-prompt-small-model/references/models/qwen3.6.md` | Prompt-craft profile: RCAF + medium pre-planning for Qwen3.6 |
| `.opencode/skills/sk-prompt-small-model/references/models/glm-5.1.md` | Prompt-craft profile: RCAF + medium pre-planning for GLM-5.1 |
| `.opencode/skills/sk-prompt-small-model/references/models/minimax-m3.md` | Prompt-craft profile: TIDD-EC + dense pre-planning for MiniMax-M3 |
| `.opencode/skills/sk-prompt-small-model/references/models/minimax-2.7.md` | Historical profile: TIDD-EC + dense, benchmark 003 origin |
| `.opencode/skills/sk-prompt-small-model/references/models/mimo-v2.5-pro.md` | Prompt-craft profile: COSTAR + lean pre-planning for MiMo-V2.5-Pro |
| `.opencode/skills/sk-prompt-small-model/references/pattern-index.md` | Index mapping each executor-owned mechanic to its canonical location + ship status |
| `.opencode/skills/sk-prompt-small-model/assets/cli_prompt_quality_card.md` | Canonical cross-CLI prompt quality card (framework selection, CLEAR, tiers) |
| `.opencode/skills/sk-prompt-small-model/assets/model-profiles.json` | Unified model registry (DATA); each profile mirrors its `recommended_frameworks` |
| `.opencode/skills/sk-prompt-small-model/benchmarks/` | Benchmark run data + synthesis (directories 002 through 005) |

---

# 4. WORKFLOWS & OUTPUTS

**Documented lookup workflow (SKILL.md:193-197):**

1. **Discover** — "The advisor surfaces `sk-prompt-small-model` alongside the relevant CLI skill when an operator names a small model or pattern."
2. **Read the profile** — "Open `references/models/<id>.md` for that model's prompt-craft: framework (primary + fallback), pre-planning density, scaffold shape, gotchas — mirrored from `model-profiles.json`."
3. **Apply MECHANICS + dispatch** — "Follow `references/pattern-index.md` to the owning `cli-X` for flags/wrappers/budgets/permissions; the prompt-craft (here) and mechanics (`cli-X`) combine in the executor's prompt-pack."

**What `model-profiles.json` provides (SKILL.md:212):**

> "Canonical source: `sk-prompt-small-model/assets/model-profiles.json` (each entry's `executors` array enumerates the paths above)."

The registry (`.opencode/skills/sk-prompt-small-model/assets/model-profiles.json`) provides per-model:
- `context_length`, `tool_calling`, `chat_template`
- `executors[]` array (executor, provider, quota_pool, status, notes)
- `primary_quota_pool`, `fallback_target`, `free_tier`
- `strengths[]`, `weaknesses[]`, `avg_iter_wall_clock_min`
- `recommended_frameworks` (primary, fallback, avoid, preplanning_density, evidence)
- `capability` block (model_slug, default_variant, variant_flag, agent_policy, format_mode) — present on minimax-m3, minimax-2.7, and mimo-v2.5-pro only

---

# 5. TROUBLESHOOTING & FAQ

**Concrete failure modes (from SKILL.md + README.md §7):**

1. **No profile for a model** — SKILL.md router pseudocode Tier 2 (`route_small_model_profile`): if model ID resolves but no `<id>.md` exists on disk, returns `notice: "No prompt-craft profile authored yet for '<model_id>'; see _index.md"`. README §7: "Provider adopted without authoring the profile → Follow `pattern-index.md` section 4".

2. **Looking for mechanics here** — SKILL.md §4 NEVER rule 1: "Never duplicate EXECUTOR MECHANICS here — binary flags, invocation wrappers, budgets, and permissions stay in `cli-devin`/`cli-opencode`. A profile points at them via `pattern-index.md`; it does not restate them."

3. **Model id drift** — README §7: "The model name is missing from the dispatching executor's trigger phrases → Add the name to that `cli-*/graph-metadata.json`, then re-index."

4. **Profile contradicts registry** — README §7: "Profile prose drifted from `model-profiles.json` → Re-mirror the profile from its registry row."

5. **Hub not surfacing** — README §7: "Trigger phrases stale or advisor not re-indexed → Run `skill_advisor.py --force-refresh`, verify with a sample prompt."

**Likely user questions (from README §8):**

**Q: What does this hub own versus the executors?**
A: Hub = prompt-craft (framework, scaffold, gotchas) per model + the registry. cli-* executors = mechanics (flags, wrappers, budgets, permissions). sk-prompt = generic framework definitions.

**Q: How does this differ from sk-prompt?**
A: `sk-prompt` owns the generic 7-framework definitions (RCAF/COSTAR/RACE/CIDI/TIDD-EC/CRISPE/CRAFT) and CLEAR scoring. This hub owns the *per-model choice* of which framework to use, plus model-specific scaffolds and gotchas. It never restates the framework bodies — it links to `sk-prompt/references/patterns_evaluation.md`.

**Q: How does this differ from cli-devin / cli-opencode?**
A: The CLI executors own MECHANICS: binary flags (`--pure`, `--variant`, `--agent`), invocation wrappers, `</dev/null` rules, budget engines, verification pipelines, permission schemas, quota-fallback logic. This hub tells you *what* framework and scaffold to use for a given model; the executors tell you *how* to invoke it.

**Q: Where do I add a new pattern or mechanic?**
A: Add it to the executor that runs it, then add a row to `references/pattern-index.md` pointing to the new location. Do not host mechanics here.

**Q: How do I add a new small-model provider?**
A: Follow the canonical checklist in `references/pattern-index.md` §4 (registry entry → author profile → _index.md row → dispatch-matrix row → executor triggers → re-index → verify).

**Q: Are frontier models supported?**
A: No. The hub scopes to small models. Opus, Sonnet, and gpt-5.5 are explicitly out of scope (SKILL.md §1 "When NOT to Use", README §8).

---

# 6. STALE FACTS IN CURRENT README

1. **Version mismatch** — README.md:35 says `Version | 0.7.0.0`. SKILL.md frontmatter:5 says `version: 0.7.2.0`. The actual version is `0.7.2.0`.

2. **"five executors" claim** — README.md:93 says "The hub keeps prompt-craft in one place so it cannot drift across the five executors." The skill dispatches through exactly 2 active executors (`cli-devin`, `cli-opencode`) plus 1 optional (`cli-claude-code` for haiku). SKILL.md:3 describes it as "across cli-devin and cli-opencode". The dispatch matrix (SKILL.md:201-210) lists only `cli-devin`, `cli-opencode`, and `cli-claude-code` (optional). "Five" is incorrect — likely a confusion with the 5 CLI quality-card mirrors mentioned in `cli_prompt_quality_card.md:117`, which are not dispatch executors of this skill.

3. **README §9 `cli-opencode/SKILL.md` description incomplete** — README.md:227 says `cli-opencode/SKILL.md` is "DeepSeek / Kimi / Qwen / GLM / MiniMax / MiMo dispatch surface, owns permissions and budget mechanics". This omits the DeepSeek-v4-pro direct API path (deepseek-api) and the cli-devin path for DeepSeek/Kimi/GLM. More importantly, cli-devin also dispatches DeepSeek/Kimi/GLM (not just SWE-1.6 as implied by the README's description of `cli-devin/SKILL.md` on line 226: "SWE-1.6 dispatch surface").

4. **README §6 MiMo example says "plus the cli-opencode invocation mechanics" without naming the two-provider detail** — README.md:163 says "Expected output: COSTAR + lean scaffold from the profile, plus the cli-opencode invocation mechanics". While not factually wrong, it omits that there are 3 distinct cli-opencode paths for MiMo (xiaomi-token-plan-ams + xiaomi direct API + opencode/mimo-v2.5-free sibling). Minor, but the dispatch matrix in SKILL.md:209 explicitly documents the two primary paths.

No further stale claims found. The model count (7 active), framework assignments, file paths, ownership boundaries, benchmark references, and architectural descriptions are all consistent between README.md and the real files.