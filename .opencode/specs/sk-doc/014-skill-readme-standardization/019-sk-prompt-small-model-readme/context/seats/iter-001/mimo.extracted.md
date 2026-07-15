1. **Purpose** — The skill is the per-model prompt-craft hub for small-model dispatch: it owns one prompt-craft profile per active small model (framework, scaffold, gotchas) and the unified model registry, while executor mechanics (binary flags, invocation wrappers, budgets, permissions) live in `cli-devin` and `cli-opencode`.

2. **Problem** — Each small model in the rotation (SWE-1.6, DeepSeek-v4-pro, Kimi-k2.6, Qwen3.6, GLM-5.1, MiniMax-M3, MiMo-V2.5-Pro) responds best to a different prompt framework, scaffold shape, and pre-planning density — MiniMax wins on TIDD-EC with dense pre-planning while MiMo wins on COSTAR with lean pre-planning, the exact opposite. Without a centralized knowledge hub, framework choices would drift across the five executor surfaces, and every new model adoption would require updating multiple disconnected files. Separating prompt-craft (this hub) from executor mechanics (the `cli-*` skills) keeps each concern editable in one place: a profile author never needs to touch invocation flags, and a mechanics author never needs to understand framework selection.

3. **Modes & Capabilities**
   - **Per-model profiles** — one `references/models/<id>.md` per active model containing framework (primary + fallback), pre-planning density, scaffold template, benchmark evidence, and dispatch gotchas.
   - **Model registry** — `assets/model-profiles.json` (version 1.4, 9 model entries including historical `minimax-2.7` and optional `haiku`) is the DATA source each profile mirrors and cites.
   - **Prompt-craft-versus-mechanics split** — this hub owns framework selection and scaffold shape; `cli-devin`/`cli-opencode` own binary flags, invocation wrappers, budgets, and permissions.
   - **Advisor co-surfacing** — `graph-metadata.json` declares `enhances` edges (weight 0.5 each) to `cli-devin` and `cli-opencode` so the advisor surfaces the hub alongside whichever executor matches.
   - **Benchmarks** — five benchmark runs under `benchmarks/` (001 SWE-1.6 eval loop, 002 SWE-1.6 extraction rerun, 003 MiniMax prompt framework on M2.7, 004 MiMo prompt framework, 005 MiMo-MiniMax capability discrimination) providing empirical framework evidence.

4. **Invocation** — The advisor co-surfaces this skill alongside `cli-devin` or `cli-opencode` via `enhances` edges in `graph-metadata.json` when an operator names a small model or pattern. Navigation path: `references/models/_index.md` (ALWAYS loaded — thin index listing each model's id, framework primary, and status) → `references/models/<id>.md` (CONDITIONAL — loaded for the specific model being dispatched) → `references/pattern-index.md` (CONDITIONAL — maps executor-owned mechanics to their canonical `cli-*` locations). A profile contains: identity fields (slug, context window, quota pool, executor path), recommended framework with rationale, benchmark evidence table, a tuned template snippet (copy-paste scaffold), and dispatch gotchas (capability fields, slug availability, automation rules). The skill carries no tools, no shell commands, and no runtime code (`allowed-tools: []` in SKILL.md frontmatter).

5. **Key Files**

   | Path | Purpose |
   |---|---|
   | `SKILL.md` | Runtime entry point: model-keyed smart router (285 lines), dispatch matrix, rules, alias map |
   | `README.md` | Human-facing overview, quick start, features, troubleshooting, FAQ |
   | `graph-metadata.json` | `enhances` edges to `cli-devin`/`cli-opencode` plus trigger phrases for the advisor |
   | `description.json` | Machine-readable metadata for memory indexing (tier: important) |
   | `references/models/_index.md` | Thin per-model index: id → framework primary/fallback, pre-planning density, status |
   | `references/models/swe-1.6.md` | Prompt-craft profile for SWE-1.6 (RCAF, default-unverified) |
   | `references/models/deepseek-v4-pro.md` | Prompt-craft profile for DeepSeek-v4-pro (RCAF, default-unverified) |
   | `references/models/kimi-k2.6.md` | Prompt-craft profile for Kimi-k2.6 (RCAF, default-unverified) |
   | `references/models/qwen3.6.md` | Prompt-craft profile for Qwen3.6 (RCAF, default-unverified) |
   | `references/models/glm-5.1.md` | Prompt-craft profile for GLM-5.1 (RCAF, default-unverified) |
   | `references/models/minimax-m3.md` | Prompt-craft profile for MiniMax-M3 (TIDD-EC + dense, empirical from benchmark 003 carried from M2.7) |
   | `references/models/minimax-2.7.md` | Historical profile for MiniMax-M2.7 (benchmark 003 host; M3 carries its contract) |
   | `references/models/mimo-v2.5-pro.md` | Prompt-craft profile for MiMo-V2.5-Pro (COSTAR + lean, empirical from benchmark 004) |
   | `references/pattern-index.md` | Authoritative index mapping each small-model pattern to its executor-owned canonical location + ship status |
   | `assets/model-profiles.json` | Unified model registry (9 entries); the DATA source each profile mirrors |
   | `assets/cli_prompt_quality_card.md` | Canonical cross-CLI prompt quality card: framework selection table, CLEAR checklist, composition precedence |
   | `benchmarks/001-swe-1.6-eval-loop/` | SWE-1.6 benchmark run data (6 iterations) |
   | `benchmarks/002-swe-1.6-extraction-rerun/` | SWE-1.6 extraction rerun with confirmation runs and synthesis |
   | `benchmarks/003-minimax-prompt-framework/` | MiniMax prompt-framework benchmark (7 iterations, dispatch scripts, run on M2.7) |
   | `benchmarks/004-mimo-prompt-framework/` | MiMo-V2.5-Pro prompt-framework benchmark (10 real runs, 5 frameworks) |
   | `benchmarks/005-mimo-minimax-capability-discrimination/` | MiMo vs MiniMax capability discrimination (strict validation + capability-discrimination eval) |

6. **Boundaries** — The skill does NOT own: executor mechanics (binary flags, invocation wrappers, budgets, permissions — owned by `cli-devin` and `cli-opencode`); generic prompt-engineering framework definitions (the 7-framework set RCAF/COSTAR/RACE/CIDI/TIDD-EC/CRISPE/CRAFT — owned by `sk-prompt`); runtime logic or TypeScript helpers (owned by `system-spec-kit`/`deep-loop-runtime`); shell commands, scripts, or agent-config recipes (none exist in this skill). STAR/BUILD are `cli-devin` task-shapes, not `sk-prompt` frameworks, and stay `cli-devin`-local. Frontier models (Opus, Sonnet, gpt-5.5) are explicitly out of scope.

7. **Troubleshooting & FAQ Material**
   - **Common failure modes:** Hub not surfacing on small-model prompts (stale trigger phrases or advisor not re-indexed → run `skill_advisor.py --force-refresh`); a model unreachable by name (missing from the dispatching executor's trigger phrases → add to that `cli-*/graph-metadata.json`); a profile contradicts the registry (prose drifted from `model-profiles.json` → re-mirror from registry row); a model has no profile (provider adopted without authoring → follow `pattern-index.md` §4); craft-versus-mechanics confusion (operator looks for flags in this skill → flags live in `cli-X`, follow `pattern-index.md` link).
   - **User questions:** (1) "What does this hub own versus the executors?" — prompt-craft (framework, scaffold, gotchas) per model plus the registry here; mechanics (flags, wrappers, budgets, permissions) in `cli-*`. (2) "Where do I add a new pattern or mechanic?" — to the executor that runs it, then add a row to `pattern-index.md`. (3) "How do I add a new small-model provider?" — follow `pattern-index.md` §4 (registry row → author profile → `_index.md` row → dispatch-matrix row → executor triggers → re-index → verify). (4) "Are frontier models supported?" — no, out of scope.

8. **Stale Facts**
   - **Version mismatch:** README.md §Key Statistics reports version `0.7.0.0`; SKILL.md frontmatter declares `0.7.2.0`. The README is stale.
   - **Profile count ambiguous:** README says "7 active model profiles" — there are 7 active models and 8 profile files on disk (7 active + 1 historical `minimax-2.7.md`). The count is technically correct for "active" but does not acknowledge the historical file exists.
   - **Missing `cli-claude-code` reference:** SKILL.md §3 Dispatch Matrix lists `cli-claude-code → anthropic (anthropic)` as the Haiku executor path. The README §Quick Start §1 lists only `cli-devin` and `cli-opencode` as executor names in the invocation sentence; `cli-claude-code` is not mentioned in the README at all despite appearing in the dispatch matrix.
   - **Benchmarks section absent:** README §4 Structure lists `benchmarks/` with one line ("Relocated benchmark run data + synthesis") but does not name the five benchmarks; the count and naming are not surfaced to the reader.
   - **`model-profiles.json` registry version:** README does not report the registry version (currently `1.4`); the SKILL.md does not either — only the JSON file itself carries it.