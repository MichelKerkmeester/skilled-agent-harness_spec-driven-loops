---
title: "Resource Map - Post Batch 11 Re-review"
description: "Coverage map for local-LLM legacy findings synthesized from post-batch-11 deep-review iterations."
trigger_phrases:
  - "resource map"
  - "coverage map"
  - "local llm legacy"
importance_tier: "normal"
contextType: "general"
---

# Resource Map

The available iteration files report aggregate scan counts per iteration, not per surface family. `Files Scanned` below therefore counts unique finding-bearing files per surface family; the notes cite the relevant iteration sources.

| Surface | Files Scanned | P0 | P1 | P2 | Notes |
|---------|---------------|----|----|----|-------|
| Root/editor runtime config and release surfaces | 2 finding files | 0 | 3 | 1 | `.vscode/mcp.json` and `PUBLIC_RELEASE.md`; iterations 001 and 003. |
| Command packs, doctor tooling, and launcher scripts | 8 finding files | 0 | 7 | 1 | OpenCode, Claude, Gemini doctor/update surfaces plus `.gemini/scripts/spec-kit-memory.sh`; iterations 001, 003, 004, and 010. |
| 017 llama-cpp default-flip packet docs and metadata | 6 finding files | 0 | 10 | 0 | `description.json`, `graph-metadata.json`, `spec.md`, `plan.md`, `checklist.md`, and `tasks.md`; iterations 002 and 005. |
| Main system-spec-kit embedding runtime and package graph | 4 finding files | 0 | 4 | 0 | Provider profile factory, Voyage/OpenAI providers, and package lock ONNX residue; iterations 007 and 010. |
| Main system-spec-kit install docs and feature catalog | 2 finding files | 0 | 1 | 2 | `mcp_server/INSTALL_GUIDE.md` and native-module feature catalog; iterations 002 and 008. |
| Main system-spec-kit tests, setup scripts, fixtures, evals, and migrations | 8 finding files | 0 | 2 | 7 | Setup installer, embedding tests, fixture generators, eval comments, and restore backup naming; iterations 003, 004, 007, 009, and 010. |
| Barter mirror configs, docs, packages, and tests | 9 finding files | 0 | 15 | 0 | Barter Codex/OpenCode/VS Code configs, CocoIndex docs, system-spec-kit install/package/test mirrors; iteration 006. |
