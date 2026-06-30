Now let me check a couple more benchmarks for completeness:
Here is the verification report.

---

# 1. EXACT INVOCATION & NAVIGATION

**How the skill is reached.** The advisor surfaces `sk-prompt-models` via `enhances` edges from `cli-devin` and `cli-opencode`, both at weight 0.5 (`graph-metadata.json:8-18`). The edge context strings confirm the routing targets. There are no `depends_on` edges — the skill is a leaf knowledge hub.

**Navigation chain.** SKILL.md §2 "Smart Routing" (`SKILL.md:79-86`) defines the phase detection:

```text
STEP 0: Resolve the target model id (alias map) — the routing key
Phase 1: Load references/models/_index.md, pick the model
Phase 2: Load references/models/<id>.md for framework + scaffold + gotchas
Phase 3: Follow references/pattern-index.md to executor MECHANICS in the cli-X
```

The resource loading levels table (`SKILL.md:109-114`) specifies: ALWAYS load `_index.md`, CONDITIONAL load `<id>.md` and `pattern-index.md`.

**What each profile documents.** Every profile contains 6 sections (verified against `swe-1.6.md`, `minimax-m3.md`, `mimo-v2.5-pro.md`):
- §1 OVERVIEW — purpose, when to use, core principle
- §2 IDENTITY — slug, context window, quota pool, executor path, billing
- §3 RECOMMENDED FRAMEWORK — primary, fallback, avoid, pre-planning density, rationale. Each profile cites `model-profiles.json` as the DATA source (e.g. `swe-1.6.md:70-75`: "These choices mirror `recommended_frameworks` in model-profiles.json…")
- §4 BENCHMARK EVIDENCE — scores, sample, discriminator, confidence
- §5 TUNED TEMPLATE SNIPPET — copy-paste scaffold
- §6 DISPATCH GOTCHAS — capability fields table, non-TTY rules, escalation

---

# 2. CAPABILITY ROSTER

**Exact model list with recommended frameworks** (from `model-profiles.json` and `_index.md`):

| Model | Primary Framework | Fallback | Pre-planning | Status |
|---|---|---|---|---|
| `swe-1.6` | RCAF | null | medium | default-unverified |
| `deepseek-v4-pro` | RCAF | null | medium | default-unverified |
| `kimi-k2.6` | RCAF | null | medium | default-unverified |
| `qwen3.6` | RCAF | null | medium | default-unverified |
| `glm-5.1` | RCAF | null | medium | default-unverified |
| `minimax-m3` | TIDD-EC | RCAF | dense | empirical (benchmark 003, on M2.7) |
| `mimo-v2.5-pro` | COSTAR | RACE (avoid TIDD-EC, CIDI) | lean | empirical (benchmark 004) |
| `minimax-2.7` | TIDD-EC | RCAF | dense | historical |
| `haiku` | N/A | N/A | N/A | optional-unverified |

Source: `model-profiles.json:35-48` (swe-1.6), `:95-109` (deepseek), `:148-162` (kimi), `:194-208` (qwen), `:245-259` (glm), `:308-322` (minimax-m3), `:427-444` (mimo), `:469-474` (haiku); `_index.md:16-37`.

**Ownership split** (from `SKILL.md:214-216` and `pattern-index.md:54-60`):
- **This skill OWNS:** per-model prompt-craft profiles (`references/models/<id>.md`), model registry DATA (`assets/model-profiles.json`), indexes
- **`cli-devin` OWNS:** SWE-1.6 budget + verification + fallback mechanics; DeepSeek/Kimi/GLM via Cognition Pro
- **`cli-opencode` OWNS:** flags, permissions, budget propagation mirror; MiniMax/MiMo invocation mechanics
- **`sk-prompt` OWNS:** generic framework definitions (the 7-framework closed set)
- **`system-spec-kit` OWNS:** runtime helpers (TS code)

**Pattern set** (from `pattern-index.md:33-48`):
1. Context budget engine (`cli-devin`)
2. Output verification pipeline (`cli-devin`)
3. Confidence-scoring rubric (`cli-devin`)
4. Per-model budget defaults (`cli-devin`)
5. Quota-pool-aware fallback (`cli-devin`)
6. Model-profile registry (`sk-prompt-models`)
7. Bayesian tool scoring (`system-spec-kit` + `cli-devin`)
8. Fallback router (`system-spec-kit`)
9. Structured permissions schema (`cli-opencode`)
10. Structured permissions reference (`cli-opencode`)
11. Permissions gate runtime (`system-spec-kit`)
12. cli-opencode budget propagation (`cli-opencode`)
13. MiniMax-M3 prompt-framework guidance (`sk-prompt-models`)
14. MiMo-V2.5-Pro prompt-framework guidance (`sk-prompt-models`)

---

# 3. KEY FILES

| Path | Role |
|---|---|
| `SKILL.md` | Runtime entry point, model-keyed smart router, dispatch matrix, rules, ownership boundary |
| `README.md` | Human-facing overview, quick start, features, structure, FAQ |
| `graph-metadata.json` | `enhances` edges (weight 0.5 each), trigger phrases, intent signals for advisor |
| `references/models/_index.md` | Thin per-model index: id → framework primary + status; links to each profile |
| `references/models/swe-1.6.md` | SWE-1.6 prompt-craft profile: RCAF + medium, no benchmark |
| `references/models/deepseek-v4-pro.md` | DeepSeek-v4-pro profile: RCAF + medium, no benchmark |
| `references/models/kimi-k2.6.md` | Kimi-k2.6 profile: RCAF + medium, no benchmark |
| `references/models/qwen3.6.md` | Qwen3.6 profile: RCAF + medium, no benchmark |
| `references/models/glm-5.1.md` | GLM-5.1 profile: RCAF + medium, no benchmark |
| `references/models/minimax-m3.md` | MiniMax-M3 profile: TIDD-EC + dense, benchmark 003 (run on M2.7) |
| `references/models/minimax-2.7.md` | MiniMax-2.7 historical profile (benchmark 003 host) |
| `references/models/mimo-v2.5-pro.md` | MiMo-V2.5-Pro profile: COSTAR + lean, benchmark 004 |
| `references/pattern-index.md` | Index mapping every executor-owned pattern to its canonical location + ship status |
| `assets/model-profiles.json` | Unified model registry (version 1.4); the DATA each profile mirrors and cites |
| `assets/cli_prompt_quality_card.md` | Canonical cross-CLI prompt quality card: framework table, CLEAR checklist, precedence tiers |
| `benchmarks/001-swe-1.6-eval-loop/` | SWE-1.6 eval-loop benchmark data + synthesis |
| `benchmarks/002-swe-1.6-extraction-rerun/` | SWE-1.6 extraction rerun data |
| `benchmarks/003-minimax-prompt-framework/` | MiniMax prompt framework comparison (TIDD-EC vs RCAF, 7-fixture rig) |
| `benchmarks/004-mimo-prompt-framework/` | MiMo prompt framework comparison (COSTAR winner, 10 real runs) |
| `benchmarks/005-mimo-minimax-capability-discrimination/` | MiMo vs MiniMax capability discrimination data |

---

# 4. WORKFLOWS & OUTPUTS

**Documented lookup workflow** (from `SKILL.md:195-197`):

1. **Discover** — Advisor surfaces the hub alongside the relevant CLI skill when an operator names a small model or pattern.
2. **Read the profile** — Open `references/models/<id>.md` for framework (primary + fallback), pre-planning density, scaffold shape, gotchas — mirrored from `model-profiles.json`.
3. **Apply MECHANICS + dispatch** — Follow `references/pattern-index.md` to the owning `cli-X` for flags/wrappers/budgets/permissions; prompt-craft (here) and mechanics (`cli-X`) combine in the executor's prompt-pack.

**What `model-profiles.json` provides** (from `model-profiles.json:2-3`): "Shared small-model profile registry for cli-devin and cli-opencode dispatch. Each model declares one or more executor paths with their provider + quota_pool, so the fallback engine can route across pools when one is exhausted." Fields per model: `id`, `context_length`, `tool_calling`, `executors[]` (executor, provider, quota_pool, status, notes), `primary_quota_pool`, `fallback_target`, `free_tier`, `strengths`, `weaknesses`, `avg_iter_wall_clock_min`, `status`, `recommended_frameworks` (primary, fallback, avoid, preplanning_density, evidence, profile_ref, status), and optionally `capability` (model_slug, default_variant, variant_flag, agent_policy, format_mode).

**Adoption checklist** lives in `pattern-index.md:68-79` (section 4) — 9 steps from registry entry through re-index + verify. SKILL.md §3 (`SKILL.md:220`) explicitly defers here: "Follow the single canonical checklist in references/pattern-index.md §4."

---

# 5. TROUBLESHOOTING & FAQ

**Concrete failure modes:**

| Failure | Cause | Fix |
|---|---|---|
| Hub not surfacing on small-model prompts | Trigger phrases stale or advisor not re-indexed | Run `skill_advisor.py --force-refresh`, verify with a sample prompt (`README.md:190`) |
| Model unreachable by name | Missing from executor's trigger phrases | Add to that `cli-*/graph-metadata.json`, re-index (`README.md:191`) |
| Profile contradicts registry | Prose drifted from `model-profiles.json` | Re-mirror the profile from its registry row (`README.md:192`) |
| Model has no profile | Provider adopted without authoring profile | Follow `pattern-index.md` section 4 (`README.md:193`) |
| No profile for a model | Profile not yet authored | Path missing on disk is a roadmap pointer, not a broken link (`_index.md:10`) |
| Looking for mechanics here | Binary flags/wrappers are in `cli-X`, not this hub | Follow `pattern-index.md` link to the owning executor (`SKILL.md:49-51`) |
| Model id drift | Alias not normalized | `SKILL.md:66-74` defines `MODEL_ALIASES` dict; normalize before lookup |

**Top 3-5 FAQ** (from `README.md:199-213`):

1. **Q: What does this hub own versus the executors?** A: Hub owns prompt-craft (framework, scaffold, gotchas) per model plus registry. `cli-*` executors own mechanics. `sk-prompt` owns generic framework definitions.
2. **Q: Where do I add a new pattern or mechanic?** A: Add to the executor that runs it, then add a row to `references/pattern-index.md`. Do not host mechanics here.
3. **Q: How do I add a new small-model provider?** A: Follow `references/pattern-index.md` section 4 canonical checklist.
4. **Q: Are frontier models supported?** A: No. Opus, Sonnet, gpt-5.5 are out of scope.

**How it differs from `sk-prompt` and `cli-X`:** `sk-prompt` owns the generic 7-framework definitions (RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE, CRAFT) and CLEAR scoring. This hub owns per-model *choices* of which framework to use and the scaffold gotchas. `cli-X` executors own invocation mechanics (binary flags, wrappers, budgets, permissions). STAR and BUILD are cli-devin task-shapes, NOT sk-prompt frameworks (`SKILL.md:237`).

---

# 6. STALE FACTS IN CURRENT README

| README claim | Actual fact | Source |
|---|---|---|
| **Version: `0.7.0.0`** | SKILL.md frontmatter says **`0.7.2.0`** | `SKILL.md:5` |
| **"Active model profiles: 7"** | `_index.md` lists **7 active models** (correct count), but `references/models/` contains **9 files** (8 `<id>.md` + `_index.md`), including `minimax-2.7.md` (historical). The count of 7 active is accurate per `_index.md:16-24`. | `_index.md:16-24`, `references/models/` directory listing |
| **"5 executors" in "the five executors"** (README §3.1, line 93) | The hub interacts with **3 executor skills**: `cli-devin`, `cli-opencode`, `cli-claude-code` (Haiku). The phrase "five executors" is not supported by any source file. | `SKILL.md:200-210`, `pattern-index.md:54-60` |
| **"5 cli cards" in quality card section** (README §3 table, line 130) | `cli_prompt_quality_card.md:117` says "All four cli-* cards (`cli-claude-code`, `cli-codex`, `cli-devin`, `cli-opencode`)" — that is **4**, not 5. | `cli_prompt_quality_card.md:117` |
| **README does not mention `cli-claude-code`** as an executor for Haiku | SKILL.md dispatch matrix (`SKILL.md:210`) and `model-profiles.json:451-458` both list `cli-claude-code` → `anthropic` for Haiku. | `SKILL.md:210`, `model-profiles.json:451-458` |
| **README says "Gemini Flash" in adoption example** (line 29) | `pattern-index.md:68` and `_index.md:37` both mention "Gemini Flash" as optional-future, but `graph-metadata.json` trigger phrases include `"gemini flash"` — this is consistent. However, no Gemini Flash profile or registry entry exists. The adoption example is forward-looking, not stale. | `pattern-index.md:68`, `_index.md:37`, `graph-metadata.json:74` |
| **README §5 "enhances -> cli-devin weight 0.5"** | Confirmed correct — `graph-metadata.json:10-11` shows weight 0.5. No discrepancy. | `graph-metadata.json:10-11` |
| **README does not mention `minimax-2.7`** as a historical model | `_index.md:28-30` lists `minimax-2.7` as historical with its own profile. `references/models/minimax-2.7.md` exists on disk. The README's model list (line 37) omits it entirely. | `_index.md:28-30`, `references/models/minimax-2.7.md` |
| **README does not mention MiMo's Xiaomi Token Plan or `cli-claude-code`** executor paths | SKILL.md dispatch matrix (`SKILL.md:209-210`) details MiMo via `xiaomi-token-plan-ams` and Haiku via `cli-claude-code`. README §9 related docs table (line 226-228) does not list `cli-claude-code`. | `SKILL.md:209-210` |

**Summary of stale facts requiring correction:**
1. Version `0.7.0.0` → should be `0.7.2.0`
2. "five executors" (§3.1) → should be "four executors" or "three executor skills" (cli-devin, cli-opencode, cli-claude-code, cli-codex for quality card only)
3. "5 cli cards" → should be "4 cli cards"
4. Missing `minimax-2.7` from the historical model mention
5. Missing `cli-claude-code` as Haiku executor from related docs