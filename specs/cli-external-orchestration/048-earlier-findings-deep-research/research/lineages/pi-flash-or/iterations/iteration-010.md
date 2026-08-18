# Iteration 010 — Final verification against evidence

## Focus
Re-confirm each of the five findings' root-cause/classification/fix against the primary evidence, and lock the synthesis inputs.

## Actions Taken
1. Re-read each iteration file (002–009) and cross-checked against primary sources.
2. Verified the two P0 code claims once more: `handle_ocr` missing `_require_task` (runtime.py:462) and `_resolve_image` strict b64decode (runtime.py:147-159) — both confirmed by direct read.
3. Confirmed the MCP server reuses shared tool defs (server.ts createSkVisionMcpServer loop) so F5b/settings fix propagates to Cursor+Devin.
4. Confirmed `settings` is absent from all TS request types and present in all relevant Python handlers (query/caption/ocr/detect/point/segment).

## Findings (final per-finding verdicts)

1. **F1 (Cursor approval):** Root cause = intentional one-time trust grant; bug-vs-expected = expected; fix = `--approve-mcps` (CI) + `mcp enable` (operator) + optional `~/.cursor/mcp.json`; docs change in cli-cursor skill.
2. **F2 (Devin dangerous-only):** Root cause = MCP tools confirmation-gated + `-p` cannot answer prompts + `smart` unavailable; expected behavior with a contract gap; fix = `permissions.allow: ["mcp__sk-vision__*"]` in `.devin/config.local.json` (least privilege); docs change in cli-devin skill.
3. **F3 (moondream2 1-token / moondream3 doubling):** Root cause = model-capability gap (moondream2 lacks OCR) exposed by unenforced `_require_task("ocr")`; md3 doubling = preview-checkpoint repetition/sampling artifact; fixes = enforce guard (P0), document moondream3-for-OCR + verify-against-ground-truth, and enable settings (temp 0) via F5b.
4. **F4 (Cursor .mcp.json chain):** Root cause = Cursor reads its own scope (`.cursor/mcp.json` symlinked → `.mcp.json`/`.claude/mcp.json`); env in `.claude/mcp.json` alone is not honored; expected with a docs gap; fix = author env in `.cursor/mcp.json` scope (env block or envFile) + document chain in hooks README.
5. **F5 (base64 padding + settings):** Root cause = strict `base64.b64decode` on unpadded/URL-safe data URL in `_resolve_image` (P0) + settings dropped at TS schema boundary (P0); fixes = tolerant decoder + 3-layer settings passthrough (types/photon/tools).

### Cross-cutting verdicts
- 3 P0 code fixes (all in the shared runtime/tools layer → propagate to all 4 hosts): tolerant b64decode; enforce `_require_task("ocr")`; settings passthrough.
- 3 documentation/contract fixes (cli-cursor `--approve-mcps` recipe; cli-devin MCP allowlist; SKILL.md/hooks README OCR model + env scope).
- No host-adapter code changes required for any finding — the MCP server and in-process adapters share the same definitions, so the fixes are host-independent by construction.

## Questions Answered
- All five F1–F5 questions answered with root cause + bug/expected + fix + cross-host generalization.

## Questions Remaining
- None. (Synthesis-ready.)

## Next Focus
Phase synthesis: compile research/research.md.

## Ruled Out
- Any per-host code fix (shared layer covers all hosts).

## Source Citations
- [SOURCE: file: .opencode/skills/sk-vision/vision-runtime/python/runtime.py:147-159,462-470]
- [SOURCE: file: .opencode/skills/sk-vision/vision-runtime/src/mcp/server.ts:84-101]
- [SOURCE: file: .opencode/skills/sk-vision/vision-runtime/src/opencode/tools.ts:43-50]
- [SOURCE: iterations/iteration-002.md … iteration-009.md]
