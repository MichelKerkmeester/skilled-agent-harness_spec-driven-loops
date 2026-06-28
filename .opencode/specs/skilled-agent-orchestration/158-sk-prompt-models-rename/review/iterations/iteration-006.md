[0m
> build · mimo-v2.5-pro-ultraspeed
[0m
[0m→ [0mRead .opencode/skills/sk-prompt-models/assets/model_profiles.json
[0m→ [0mRead .opencode/skills/sk-prompt-models/references/models/_index.md
[0m→ [0mRead .opencode/skills/cli-opencode/graph-metadata.json
[0m
[0m$ [0mls .opencode/skills/sk-prompt-models/references/models/
_index.md
deepseek-v4-pro.md
glm-5.2.md
kimi-k2.7-code.md
mimo-v2.5-pro.md
minimax-m3.md
[0m
```json
{"pass":"cross-ref-consistency","findings":[]}
```

All checks pass:
- **profile_ref resolution**: all 5 refs (`deepseek-v4-pro.md`, `kimi-k2.7-code.md`, `minimax-m3.md`, `mimo-v2.5-pro.md`, `glm-5.2.md`) resolve to existing files under `sk-prompt-models/references/models/`.
- **_index.md ↔ registry**: the 5 active models listed in `_index.md` match the 5 active models in `model_profiles.json`; `haiku` is correctly noted as optional/unadopted.
- **graph-metadata routing**: `cli-opencode` `edges.enhances[0].target` = `"sk-prompt-models"` (correct current name, not stale).
