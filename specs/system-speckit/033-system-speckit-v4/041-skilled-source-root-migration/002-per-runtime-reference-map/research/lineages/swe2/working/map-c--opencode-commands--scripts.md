## opencode:commands / scripts — 4 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/commands/scripts/README.md` | :19,28,64,88,94,100,110 | documentation (5 fenced (runnable); 2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/commands/scripts/fixtures/README.md` | :19,86 | documentation (1 fenced (runnable); 1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/commands/scripts/fixtures/broken-command-refs.yaml` | :17,19,26 | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/scripts/validate-command-references.cjs` | :13,42,46,52,65,69,169,186 (+6) | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
