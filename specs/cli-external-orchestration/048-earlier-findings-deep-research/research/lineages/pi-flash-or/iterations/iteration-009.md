# Iteration 009 — Cross-host generalization & consolidated fix list

## Focus
Synthesize the four-host trust/env/model/config patterns across the five findings into a cross-host generalization and the consolidated durable-fix list.

## Actions Taken
1. Re-read the per-finding conclusions from iterations 2–8.
2. Mapped each finding onto the four-host matrix (Pi, OpenCode in-process; Cursor, Devin MCP).
3. Consolidated the fix list into one coherent, minimal set of changes.

## Findings

### Cross-host generalization matrix

| Layer | Pi / OpenCode (in-process) | Cursor (MCP) | Devin (MCP) | Generalization |
|-------|---------------------------|--------------|-------------|----------------|
| Trust/approval | Plugin auto-registers; no per-server trust gate | One-time `cursor-agent mcp enable` / `--approve-mcps` per dispatch | `permissions.allow: mcp__server__tool`; else `dangerous` | **Grant tool/server-scoped trust; never disable all approval.** (F1, F2) |
| Config scope | In-process plugin config | `.cursor/mcp.json` (project; symlinked here) or `~/.cursor/mcp.json` | `.devin/mcp_config.json` (symlink) + `.devin/config*.json` allowlists | **Per-server env lives in the host's own config scope.** (F4) |
| Model/task gating | Shared runtime `_require_task` | Same runtime | Same runtime | **Capability guards belong in the shared runtime, not per host.** (F3a) |
| Tool schema | Shared `tools.ts` | Same (MCP server reuses defs) | Same | **Schema gaps are host-independent and fixed once.** (F5b) |
| Image source decoding | Shared `runtime.py _resolve_image` | Same | Same | **Decoder robustness is one Python change for all hosts.** (F5a) |

### Consolidated durable-fix list (ordered, minimal)

1. **`runtime.py` — tolerant base64 decode** (F5a): strip whitespace, translate URL-safe alphabet, re-pad, decode with clear error. One function; fixes `image` param on every host.
2. **`runtime.py` — enforce `_require_task("ocr")`** (F3a): mirror `handle_segment`'s guard in `handle_ocr` so moondream2 fails loudly instead of returning 1-token garbage.
3. **`types.ts` + `photon.ts` + `tools.ts` — settings passthrough** (F5b): add optional `settings` to the text-quality tool schemas and forward to the runtime. Enables `max_tokens`/`temperature` control and the F3b sampling mitigation.
4. **SKILL.md / hooks README — OCR model + env docs** (F3b, F4): document that `sk_vision_ocr` requires a Moondream 3.x checkpoint (moondream3-preview output is approximately correct — verify against ground truth when exactness matters), and that Cursor per-server env must be authored in `.cursor/mcp.json` scope (via env block or envFile), not only `.claude/mcp.json`.
5. **cli-cursor skill — `--approve-mcps` recipe** (F1): make `--approve-mcps` the documented non-interactive path for MCP-dependent automated dispatches; keep `cursor-agent mcp enable` as the operator trust mutation.
6. **cli-devin skill — MCP allowlist contract** (F2): document `permissions.allow: ["mcp__sk-vision__*"]` (or per-tool) in `.devin/config.json`/`config.local.json` as the least-privileged non-interactive route; reserve `dangerous` for throwaway/isolated runners.

### Ranking by blast radius
- Fixes 1–3 are code changes in the shared skill runtime; low risk, high generality (all 4 hosts).
- Fixes 4–6 are documentation/contract changes; zero runtime risk, unblock operators and CI today.

## Questions Answered
- Q: What's the shared pattern? A: trust at tool/server scope; env in host's own scope; capability guards + schema + decoding in the shared runtime.

## Questions Remaining
- None at the finding level. Open: whether the repo wants Fix 3 on all 13 tools or only inspect/ocr (recommend inspect/ocr first).

## Next Focus
Iteration 10: final verification — re-confirm each finding against the evidence and prepare the synthesis (research.md).

## Ruled Out
- Per-host copies of the shared runtime logic (all hosts already share it; fixes land once).

## Source Citations
- [SOURCE: iterations/iteration-002.md..iteration-008.md summaries]
- [SOURCE: file: .opencode/skills/sk-vision/vision-runtime/python/runtime.py]
- [SOURCE: file: .opencode/skills/sk-vision/vision-runtime/src/opencode/tools.ts]
