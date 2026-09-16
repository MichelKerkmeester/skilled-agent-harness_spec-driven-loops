## opencode:hooks / git — 3 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/hooks/git/README.md` | :16,18,29,37,44,57,91,110 (+1) | constructs/matches `.opencode` as a contract (sentinel, gate, installer, hook) | authored | decide the contract (compat vs rename) then rewrite; gates self-disengage if missed | manual |
| `.opencode/hooks/git/install-hooks.sh` | :7,12,15 | constructs/matches `.opencode` as a contract (sentinel, gate, installer, hook) | authored | decide the contract (compat vs rename) then rewrite; gates self-disengage if missed | manual |
| `.opencode/hooks/git/pre-commit` | :3,5,8,12,13,39,45,48 (+1) | constructs/matches `.opencode` as a contract (sentinel, gate, installer, hook) | authored | decide the contract (compat vs rename) then rewrite; gates self-disengage if missed | manual |
