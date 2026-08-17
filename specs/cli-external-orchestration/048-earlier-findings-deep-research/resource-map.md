# Known Context — sk-vision host-adapter findings (research corpus)

This packet seeds a deep-research loop over five findings surfaced while running the
`sk-vision` manual-testing-playbook across Cursor and Devin with GLM 5.2 (via cli-cursor and
cli-devin). Each finding below is the research subject: determine root cause, classify it as a
bug vs expected behavior, propose the cleanest durable fix or documentation, and note any
cross-host generalization.

## Finding 1 — Cursor requires one-time MCP approval
`cursor-agent mcp list` reported `sk-vision: not loaded (needs approval)`; the server only
became usable after `cursor-agent mcp enable sk-vision`, after which `mcp list-tools sk-vision`
returned all 13 tools. Question: is per-server manual approval the intended Cursor security
posture, and what is the cleanest way to pre-approve a repo's own MCP server for operators/CI?

## Finding 2 — Devin `-p` blocks MCP tools without `dangerous`
Devin non-interactive (`devin -p`) rejected the sk-vision MCP tool call under `auto` and
`accept-edits` ("rejected a tool call that requires confirmation"). `smart` mode printed
"Smart permission mode is not available. Falling back to normal." Only
`--permission-mode dangerous` auto-approved the (read-only) MCP tools. Question: is there a
narrower per-tool/per-server MCP allowlist for Devin that avoids `dangerous`, and what should
the cli-devin contract recommend?

## Finding 3 — moondream2 truncates text; OCR needs moondream3
The default `moondream2` model returned ~1 token for OCR/VQA text reads ("SK", "GR", "CO")
regardless of an explicit `max_tokens` setting; `sk_vision_ocr` is gated to Moondream3-only
tasks. Loading `moondream3-preview` read the real text but with a token-doubling artifact
("CODE 42184218", "CODE 4 4218"). Question: root cause of the 1-token moondream2 behavior (a
generation cap vs a decode bug), and the doubling artifact under moondream3; what is the
correct default + documented OCR guidance?

## Finding 4 — Cursor reads `.mcp.json`, not `.claude/mcp.json`
Setting the sk-vision server `env` (e.g. `SK_VISION_MODEL=moondream3-preview`) in
`.claude/mcp.json` had no effect on a dispatched cursor-agent; the effective config is
`.mcp.json` (reached via the `.cursor/mcp.json` symlink). Question: document the exact Cursor
MCP config-resolution chain and where per-server env overrides must live.

## Finding 5 — `image` base64 param + `settings` passthrough
A vision tool call using the `image` base64 data-URL parameter failed with
`SK_VISION_ERROR (INVALID_INPUT): Incorrect padding`, while the `path` parameter worked.
Separately, `sk_vision_inspect` does not forward a `settings` object to the Python runtime, so
`max_tokens` cannot be raised through the MCP tool. Question: root cause of the base64 padding
error and whether `inspect` should forward `settings`.

## Source artifacts (for reference, not required reading)
- `specs/sk-vision/001-sk-vision-fork-of-opencode-senses/017-cursor-devin-testing-playbook/scratch/run-2026-08-17/` — transcripts + OCR fixture.
- `.opencode/skills/sk-vision/benchmark/reports/2026-08-17--manual-testing-playbook--*` — recorded verdicts.
