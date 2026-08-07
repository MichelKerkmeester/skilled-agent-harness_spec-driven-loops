[0m
> build · mimo-v2.5-pro-ultraspeed
[0m
[0m→ [0mRead .opencode/skills/sk-prompt-models/changelog/v0.9.0.0.md
[0m→ [0mRead .opencode/skills/sk-prompt-models/changelog/v0.3.0.0.md
```json
{"pass":"changelog-doc-accuracy","findings":[]}
```

Both changelogs are accurate. v0.3.0.0 was frozen untouched and still correctly documents the rename TO `sk-prompt-small-model` (lines 1, 5, 10). v0.9.0.0 correctly documents the rename FROM `sk-prompt-small-model` TO `sk-prompt-models`, correctly identifies v0.3.0.0 as frozen historical record (line 16), and confirms zero live residuals via git grep (line 22). No falsified history detected.
