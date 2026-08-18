# Iteration 001 — Broad Survey & Corpus Mapping

## Focus
Enumerate the five sk-vision host-adapter findings, locate the evidence artifacts and the sk-vision MCP/runtime code each touches, and establish first root-cause hypotheses.

## Actions Taken
1. Read the packet `spec.md` and `resource-map.md` confirming the five-finding corpus and the forced-depth (10-iter) mandate.
2. Inventoried the scratch evidence dir `specs/sk-vision/001-sk-vision-fork-of-opencode-senses/017-cursor-devin-testing-playbook/scratch/run-2026-08-17/` (vsn-017…vsn-020 transcripts, outcomes, OCR fixture, ground truth `CODE 4218`).
3. Read the sk-vision MCP runtime code: `vision-runtime/python/runtime.py`, `src/mcp/server.ts`, `src/opencode/tools.ts`, `src/core/context-builder.ts`, `src/providers/photon.ts`.
4. Inspected the installed moondream/kestrel library internals.
5. Inspected the host MCP config surface: `.cursor/mcp.json`, `.mcp.json`, `.claude/mcp.json`, `.devin/mcp_config.json` symlinks/entries and the `hooks/` blobs.

## Findings
- **Evidence completeness (F1–F5):** each finding has a durable artifact in the scratch dir: F1 (vsn-018 cursor status + `needs approval`), F2 (vsn-019 devin status logs incl. `Smart permission mode is not available. Falling back to normal.`), F3 (vsn-020 OCR logs: moondream2 → `SK`/`CO` ~1 token; moondream3 → `CODE 42184218`/`CODE 4 4218`; ground truth `CODE 4218`), F4 (`.cursor/mcp.json` symlink chain + env not applied), F5 (vsn-020 note: `image` base64 → `SK_VISION_ERROR (INVALID_INPUT): Incorrect padding`; `path` worked).
- **Invariant established:** the MCP server (`src/mcp/server.ts`) registers the SAME 13 shared tool definitions (`src/opencode/tools.ts`) that the in-process Pi/OpenCode adapters use. So schema gaps (e.g. no `settings` on inspect) are host-independent and would reproduce on every MCP host.
- **F3 hypothesis:** `runtime.py` `handle_ocr` calls `model.query(..., settings=params.get("settings"))` but the TS tool layer (`sk_vision_ocr`, `provider().ocr`) never forwards `settings`, and `handle_ocr` — unlike `handle_segment` which calls `_require_task("segment")` — does NOT gate on `_require_task("ocr")`. The `MOONDREAM3_ONLY_TASKS` set names `ocr` but the gate is not enforced on the OCR handler. moondream2 (2B, caption/VQA-trained) degrades OCR transcription to ~1–2 meaningless tokens; moondream3 is the OCR-capable checkpoint.
- **F5 hypothesis:** `_resolve_image` (`kind == "data"`) does `base64.b64decode(data)` after stripping the `data:...,` prefix; `base64.b64decode` raises `binascii.Error: Incorrect padding` on unpadded or URL-safe base64 (verified locally). The `path` param bypasses decode entirely, so it works. Root cause is strict padding handling on inline data, not a broken model.

## Questions Answered
- Q: What code does each finding touch? A: F3/F5 → `runtime.py` + `tools.ts`; F1/F2/F4 → host config + MCP server entry.

## Questions Remaining
- All five F1–F5 open (see strategy).

## Next Focus
Iteration 2: F1 — Cursor one-time MCP approval posture and pre-approval paths (web + local `.cursor` surface).

## Ruled Out
- None this iteration.

## Source Citations
- [SOURCE: file: .opencode/skills/sk-vision/vision-runtime/python/runtime.py]
- [SOURCE: file: .opencode/skills/sk-vision/vision-runtime/src/opencode/tools.ts]
- [SOURCE: file: scratch/run-2026-08-17/vsn-020-cursor-ocr.log]
- [SOURCE: file: scratch/run-2026-08-17/ocr-ground-truth.txt]
