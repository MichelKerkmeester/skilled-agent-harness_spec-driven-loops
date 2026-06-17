# Iteration 004

**Pool:** native-a + native-b (sonnet) · **Focus:** sk-prompt-small-model registry; swe-1.6 RESOLVED cli-devin-exclusive; ~18 edit sites

## Findings (13)
- `.opencode/skills/sk-prompt-small-model/assets/model-profiles.json` — swe-1.6 executors[0] (10-18) → decision — ONLY executor=cli-devin (cognition-free), fallback null -> swe-1.6 cli-devin-EXCLUSIVE; remove model entirely or mark retired
- `.opencode/skills/sk-prompt-small-model/assets/model-profiles.json` — deepseek-v4-pro cli-devin row (57-64) → delete-map-entry — keeps deepseek-api + opencode-go paths
- `.opencode/skills/sk-prompt-small-model/assets/model-profiles.json` — kimi-k2.6 cli-devin row (117-123) → delete-map-entry — keeps opencode-go
- `.opencode/skills/sk-prompt-small-model/assets/model-profiles.json` — glm-5.1 cli-devin row (216-222) → delete-map-entry — keeps opencode-go
- `.opencode/skills/sk-prompt-small-model/SKILL.md` — desc/when-use/aliases/matrix/boundary/resources/keywords (3,8,21-22,51,67,103,201-212,216,237,258-264,274,281) → multi inline+delete — ~12 sites incl MODEL_ALIASES swe-1.6 (67), dispatch matrix rows (204-208), 5 related-resource cli-devin links (258-264), boundary map node (281)
- `.opencode/skills/sk-prompt-small-model/graph-metadata.json` — enhances[0]/related_to[0]/causal_summary/trigger_phrases (9-13,27,128,+trigger_phrases) → delete-entry+inline — remove cli-devin enhances edge + related_to + causal_summary mention + swe-1.6 trigger phrases
- `.opencode/skills/sk-prompt-small-model/references/models/swe-1.6.md` — entire file (1-244) → decision — cli-devin-exclusive profile; delete or archive with swe-1.6 removal
- `.opencode/skills/sk-prompt-small-model/references/models/deepseek-v4-pro.md` — executor rows + cross-links (40,149,155,168,172) → inline-edit — remove cli-devin row + non-TTY mention + 2 dead cross-links
- `.opencode/skills/sk-prompt-small-model/references/models/kimi-k2.6.md` — executor path A + cross-links (40,138,143,153,158) → inline-edit — remove cli-devin path + dead cross-links
- `.opencode/skills/sk-prompt-small-model/references/models/glm-5.1.md` — executor row + cross-links (40,117,129,139) → inline-edit — remove cli-devin path + dead cross-link
- `.opencode/skills/sk-prompt-small-model/references/models/_index.md` — swe-1.6 ACTIVE row (20) → delete-map-entry — remove or move to Historical
- `.opencode/skills/sk-prompt-small-model/references/pattern-index.md` — ownership row + adopt-provider step (56,75) → delete+inline — delete cli-devin ownership row; fix 'cli-devin and/or cli-opencode' -> cli-opencode
- `.opencode/skills/sk-prompt-small-model/README.md` — works-on/trigger_phrases/framework-map/boundary (7,25,90,128) → inline+delete — remove swe-1.6 + cli-devin trigger phrase + boundary row

See `../seats/iter-004/` for the full per-seat finding sets.
