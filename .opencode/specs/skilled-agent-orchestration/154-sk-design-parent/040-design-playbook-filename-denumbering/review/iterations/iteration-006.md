[0m
> build · glm-5.2
[0m
[0m$ [0mreadlink .opencode/changelog/sk-prompt-models; echo "---"; readlink .opencode/changelog/design-audit
../skills/sk-prompt-models/changelog
---
../skills/sk-design/design-audit/changelog
[0m
[0m$ [0mls -d .opencode/skills/sk-prompt-models/changelog/ 2>&1; echo "---"; ls -d .opencode/skills/sk-design/design-audit/changelog/ 2>&1
.opencode/skills/sk-prompt-models/changelog/
---
.opencode/skills/sk-design/design-audit/changelog/
[0m
[0m$ [0mcd .opencode/changelog && for l in *; do if [ -L "$l" ]; then tgt=$(readlink "$l"); if [ ! -d "$l/" ]; then echo "DANGLING: $l -> $tgt"; else echo "OK: $l -> $tgt"; fi; fi; done
OK: cli-claude-code -> ../skills/cli-claude-code/changelog
OK: cli-codex -> ../skills/cli-codex/changelog
OK: cli-opencode -> ../skills/cli-opencode/changelog
OK: deep-loop-runtime -> ../skills/deep-loop-runtime/changelog
OK: deep-loop-workflows -> ../skills/deep-loop-workflows/changelog
OK: design-audit -> ../skills/sk-design/design-audit/changelog
OK: design-foundations -> ../skills/sk-design/design-foundations/changelog
OK: design-interface -> ../skills/sk-design/design-interface/changelog
OK: design-md-generator -> ../skills/sk-design/design-md-generator/changelog
OK: design-motion -> ../skills/sk-design/design-motion/changelog
OK: mcp-chrome-devtools -> ../skills/mcp-chrome-devtools/changelog
OK: mcp-clickup -> ../skills/mcp-click-up/changelog
OK: mcp-code-mode -> ../skills/mcp-code-mode/changelog
OK: mcp-figma -> ../skills/mcp-figma/changelog
OK: mcp-open-design -> ../skills/mcp-open-design/changelog
OK: sk-code -> ../skills/sk-code/changelog
OK: sk-code-review -> ../skills/sk-code-review/changelog
OK: sk-design -> ../skills/sk-design/changelog
OK: sk-doc -> ../skills/sk-doc/changelog
OK: sk-git -> ../skills/sk-git/changelog
OK: sk-prompt -> ../skills/sk-prompt/changelog
OK: sk-prompt-models -> ../skills/sk-prompt-models/changelog
OK: system-code-graph -> ../skills/system-code-graph/changelog
OK: system-skill-advisor -> ../skills/system-skill-advisor/changelog
OK: system-spec-kit -> ../skills/system-spec-kit/changelog
[0m
All 25 changelog symlinks resolve. `sk-prompt-models` points at the new `sk-prompt-models/changelog` (not an old path). `design-audit` and the four siblings all point under `sk-design/` (current paths). No dangling or stale-target symlinks.

```json
{"pass":"symlink-fix-009","findings":[]}
```
