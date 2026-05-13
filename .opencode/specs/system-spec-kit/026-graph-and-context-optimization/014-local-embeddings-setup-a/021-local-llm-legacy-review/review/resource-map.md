# Local-LLM Legacy Review Resource Map

Source note: iteration files provide aggregate files-scanned counts per pass, not per surface family. The `Files Scanned` column below is therefore the count of distinct finding-bearing files observed in that surface family.

| Surface | Files Scanned | P0 | P1 | P2 | Notes |
|---|---:|---:|---:|---:|---|
| Claude runtime config | 1 | 0 | 4 | 0 | Claude MCP config notes preserve llama-cpp, Voyage, and old database-default language. |
| Codex runtime config | 1 | 0 | 4 | 0 | Codex config notes preserve llama-cpp, Voyage, and old database-default language. |
| Gemini runtime config | 1 | 0 | 4 | 0 | Gemini settings preserve llama-cpp, Voyage, and old database-default language. |
| OpenCode install guides | 1 | 0 | 7 | 0 | Install docs still present Voyage/OpenAI/Nomic/generic sqlite as defaults or recommendations. |
| Root runtime/docs | 3 | 0 | 13 | 0 | Root README and MCP/OpenCode config notes still advertise cloud/provider/default drift. |
| mcp-coco-index skill | 14 | 0 | 20 | 10 | Docs, templates, tests, catalogs, and playbooks retain MiniLM/Voyage defaults. |
| system-spec-kit MCP server | 10 | 0 | 8 | 4 | Install docs, tests, package metadata, and checkpoint/eval helpers retain old DB/backend assumptions. |
| system-spec-kit feature catalog | 4 | 0 | 2 | 4 | Generated catalog entries need regeneration after source defaults change. |
| system-spec-kit manual testing playbook | 4 | 0 | 0 | 4 | Manual playbooks still assert generic sqlite/Voyage profile paths. |
| system-spec-kit references | 2 | 0 | 3 | 0 | Reference docs still describe Voyage/cloud provider precedence. |
| system-spec-kit scripts/tests | 12 | 0 | 7 | 6 | Eval/setup/checkpoint/test scripts retain generic sqlite, Nomic, llama-cpp, or ONNX residue. |
| system-spec-kit shared embeddings | 5 | 2 | 6 | 1 | Provider resolver and embedding facade contain the only P0 runtime default findings. |
| system-spec-kit skill root docs/package | 2 | 0 | 5 | 2 | Skill README/package metadata retain Voyage and ONNX backend residue. |
