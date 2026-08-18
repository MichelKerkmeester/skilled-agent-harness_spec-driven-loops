# Lineage Resource Map — pi-flash-or (sk-vision host-adapter findings)

Generated from converged research deltas. Lists the durable evidence and source inventory this lineage produced and consumed.

## Readme/Docs (skill docs)
- `.opencode/skills/sk-vision/SKILL.md` — OCR model guidance, host adapter layout
- `.opencode/skills/sk-vision/hooks/README.md` — four-host adapter model, Cursor chain
- `.opencode/skills/cli-external-orchestration/cli-cursor/SKILL.md` + references (cli-reference.md, cursor-tools.md, shared-editor-config.md)
- `.opencode/skills/cli-external-orchestration/cli-devin/SKILL.md` + references

## Source (runtime code)
- `vision-runtime/python/runtime.py` — model lifecycle, ocr/scene/query handlers, `_resolve_image`, `MOONDREAM3_ONLY_TASKS`
- `vision-runtime/src/mcp/server.ts` — MCP stdio server for Cursor/Devin
- `vision-runtime/src/opencode/tools.ts` — shared 13-tool definitions
- `vision-runtime/src/providers/photon.ts` — request construction (no settings)
- `vision-runtime/src/providers/types.ts` — request types (no settings)
- `vision-runtime/src/core/context-builder.ts` — renderOCR/verbatim rendering

## Specs (packet)
- `specs/cli-external-orchestration/048-earlier-findings-deep-research/spec.md`
- `specs/cli-external-orchestration/048-earlier-findings-deep-research/resource-map.md`

## Config (host MCP)
- `.cursor/mcp.json` → `.mcp.json` → `.claude/mcp.json` (symlink chain)
- `.devin/mcp_config.json` (symlink) + `hooks/devin/mcp_config.json`
- `hooks/cursor/mcp.json` (portable reference)

## Scripts/evidence
- `specs/sk-vision/001-sk-vision-fork-of-opencode-senses/017-cursor-devin-testing-playbook/scratch/run-2026-08-17/` — vsn-017…vsn-020 transcripts, outcomes, OCR fixture, ground truth
- `~/.cache/sk-vision/venv/.../kestrel/` + `moondream/` — library internals (config.py, skills/query.py, base.py)

## Web sources
- docs.cursor.com/context/model-context-protocol; forum.cursor.com (approval, duplicate servers, env interpolation)
- docs.devinai.cn/cli/reference/permissions; docs.devin.ai
- huggingface.co/vikhyatk/moondream2; moondream.ai/p/models
