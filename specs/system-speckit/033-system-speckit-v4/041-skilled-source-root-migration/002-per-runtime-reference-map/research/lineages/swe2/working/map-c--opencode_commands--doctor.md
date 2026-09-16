## opencode:commands / doctor — 33 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/commands/doctor/_routes.yaml` | :5,6,10,11,41,42,56,71 (+28) | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/doctor/assets/doctor-deep-loop.yaml` | :83,84,85,86,94,95,96,97 (+3) | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/doctor/assets/doctor-embeddings.yaml` | :21,40,49 | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/doctor/assets/doctor-fable-mode.yaml` | :7,34,35,36 | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/doctor/assets/doctor-mcp-debug.yaml` | :42,44,45,89,106,109,122,126 (+5) | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/doctor/assets/doctor-mcp-install.yaml` | :43,45,92,101,127,132,135,140 (+4) | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/doctor/assets/doctor-mcp-presentation.txt` | :50,54 | txt content naming `.opencode` | authored | mechanical rewrite | mechanical |
| `.opencode/commands/doctor/assets/doctor-parent-skill.yaml` | :59,60,61,75 | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/doctor/assets/doctor-router-reach.yaml` | :52,53,54,55,70 | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/doctor/assets/doctor-runtime-mirrors.yaml` | :5,7,34,35,36,37,38,39 (+71) | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/doctor/assets/doctor-skill-advisor.yaml` | :35,76,77,78,80,81,90,203 (+6) | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/doctor/assets/doctor-skill-budget.yaml` | :36,37,39,40 | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/doctor/assets/doctor-skill-graph-freshness.yaml` | :43,44,45,46 | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/doctor/assets/doctor-speckit-presentation.txt` | :104,142,146,200 | txt content naming `.opencode` | authored | mechanical rewrite | mechanical |
| `.opencode/commands/doctor/assets/doctor-speckit-retrieval.yaml` | :23,29,30,31,33,36,70,74 (+11) | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/doctor/assets/doctor-update-presentation.txt` | :104,105,135,155,166 | txt content naming `.opencode` | authored | mechanical rewrite | mechanical |
| `.opencode/commands/doctor/assets/doctor-update.yaml` | :21,22,104,105,106,107,108,109 (+44) | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/doctor/mcp.md` | :24,25,26,44,49,50,62 | documentation (7 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/commands/doctor/scripts/README.md` | :19,28,85,91,100,101,102,103 (+13) | documentation (13 fenced (runnable); 8 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/commands/doctor/scripts/agent-roster-mirror-check.cjs` | :37 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/commands/doctor/scripts/audit_descriptions.py` | :11,12,13,29,155,183,218,423 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/commands/doctor/scripts/check-mcp-mutation-class.sh` | :14,19,44,87 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/commands/doctor/scripts/command-catalog-mirror-check.cjs` | :8,45,51,305,316,319 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/commands/doctor/scripts/doctor-runtime-bootstrap.sh` | :24,26,44,125,136,138,144,148 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/commands/doctor/scripts/mcp-doctor-lib.sh` | :158 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/commands/doctor/scripts/mcp-doctor.sh` | :9,43,141,143,144 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/commands/doctor/scripts/parent-skill-check.cjs` | :43,49,86,91,100,583 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/commands/doctor/scripts/route-validate.py` | :8,60,61,65,148,154 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/commands/doctor/scripts/route-validate.sh` | :5,17,18,107 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/commands/doctor/scripts/skill-graph-freshness.cjs` | :28,29,30 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/commands/doctor/scripts/tests/skill-advisor-route-contract.test.cjs` | :31,34,35,38 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/commands/doctor/speckit.md` | :24,25,48,49,50,51,52,53 (+8) | documentation (16 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/commands/doctor/update.md` | :24,25,45,50,58 | documentation (5 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
