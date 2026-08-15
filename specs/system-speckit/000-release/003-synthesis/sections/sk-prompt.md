### Prompt (sk-prompt)
- The `sk-prompt` skill is now the single home for prompt work, merging prompt-improvement and small-model dispatch into one hub with a router benchmark that scores 100/100 across both modes.
- Run `/prompt-improve` for the full DEPTH-thinking, CLEAR-scored prompt-enhancement engine — it replaces the old `/prompt` command (the `/prompt` command and prompt-improver agent still work; only names changed).
- Get automatic framework selection across 11 prompt frameworks plus CLEAR quality scoring, with six intent categories (text, UI, image, video, framework, format) routing your request to the right guidance.
- Get per-model prompt-craft profiles for all eight active small models (DeepSeek, GLM-5.2, and more), each naming preferred frameworks, fallbacks, avoid lists, and evidence, so dispatch stays inside each model's context window.
- All five CLI executor skills now share one three-tier prompt-composition precedence rule, with inline framework tables thinned into mirrors of a single canonical card to end cross-executor drift.
- Opt-in extras ship disabled by default: output verification, quota-aware fail-fast model fallback, and Bayesian scoring — enable them when you need them.
- A 28-scenario manual testing playbook for the sk-prompt skill ships for validating prompt-improvement workflows.

**Breaking:** Several names changed framework-wide: the skill is now `sk-prompt` (was `sk-improve-prompt`), the small-model skill is now `sk-prompt-models` (was `sk-prompt-small-model`), and the agent is now `@prompt-improver` (was `@improve-prompt`). The old names are gone from all runtime mirrors — use the new names when invoking or referencing them.
