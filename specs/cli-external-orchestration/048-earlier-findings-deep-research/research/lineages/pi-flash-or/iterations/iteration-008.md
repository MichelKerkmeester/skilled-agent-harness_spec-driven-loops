# Iteration 008 — F5b: sk_vision_inspect settings passthrough

## Focus
Determine whether `sk_vision_inspect` (and the other MCP/plugin tools) should forward a `settings` object (e.g. `max_tokens`, `temperature`) to the Python runtime, and design the cleanest durable change.

## Actions Taken
1. Traced the full request path: `tools.ts sk_vision_inspect` args → `provider().query/caption/scene/ocr` → `photon.ts` request construction → `runtime.py` handlers.
2. Read `providers/types.ts` for `QueryRequest`/`SceneRequest`/`OCRRequest` (no `settings` field anywhere).
3. Read runtime.py `handle_query`/`handle_scene`/`handle_ocr` — all already **accept** `settings` from params (`settings=params.get("settings") or None`), proving the Python side is ready; only the TS layer drops it.

## Findings

### Root cause — schema + provider drop `settings` before it reaches the runtime
The Python runtime **already forwards settings** on query/caption/ocr/detect/point/segment (`settings=params.get("settings") or None`), and moondream's `SamplingSettings` TypedDict supports `temperature`, `top_p`, `max_tokens`, `max_objects` (moondream/types.py:17-26). But the TS tool layer:
1. `sk_vision_inspect` args schema declares only `path`, `image`, `question` — no `settings` (tools.ts:43-50).
2. `provider().query/caption/scene/ocr` construct the request without a `settings` field (photon.ts query() lines ~230-245).
3. `QueryRequest`/`SceneRequest`/`OCRRequest` in `providers/types.ts` have no `settings` member.

So `max_tokens` cannot be raised through `sk_vision_inspect` (or any of the 13 tools) — the parameter is dropped at the schema boundary. This directly blocks the F3b mitigation (temperature-0 / greedy sampling to reduce moondream3 doubling) and any user who needs longer OCR output.

### Bug vs expected
**Bug (incomplete plumbing):** the runtime supports settings; the tool surface does not expose them. The `sk_vision_inspect` description even claims to return "exact OCR of any visible text" — the exactness is capped by the very settings the tool cannot pass. This is a schema/forwarding gap, not a runtime defect.

### The cleanest durable fix (3 layers, one PR)
1. **types.ts:** add optional `settings?: { temperature?: number; top_p?: number; max_tokens?: number; max_objects?: number }` to `QueryRequest`, `SceneRequest`, `OCRRequest`, `CaptionRequest`, `DetectRequest`, `PointRequest`, `SegmentRequest`.
2. **photon.ts:** forward `settings: request.settings` in each `client.request(...)` payload.
3. **tools.ts:** add an optional `settings` JSON-string arg to `sk_vision_inspect` (and `sk_vision_ocr`, `sk_vision_detect`, etc.), parse it, and pass it through: `settings: args.settings ? JSON.parse(args.settings) : undefined`.
Minimal variant if a single tool is the target: add `settings` to `sk_vision_inspect` and `sk_vision_ocr` only (the two text-quality tools), since those are where max_tokens/temperature matter most. The MCP server (`mcp/server.ts`) automatically inherits the new arg because it reuses the shared definitions.

### Cross-host generalization
Host-independent — every host (Pi, OpenCode, Cursor, Devin) shares `tools.ts`/`photon.ts`/`runtime.py`, so the three-layer change propagates to all four hosts with no per-host work. This is the enabler for the F3b sampling mitigation (temperature 0) and for users who need explicit token budgets.

## Questions Answered
- Q: Should inspect forward settings? A: Yes — the runtime supports it and the schema gap blocks max_tokens/temperature control (incl. the F3b mitigation).
- Q: Where's the change? A: types.ts + photon.ts + tools.ts (all shared, one PR).

## Questions Remaining
- None for F5b.

## Next Focus
Iteration 9: cross-host generalization — synthesize the four-host trust/env/model/config patterns and the consolidated fix list.

## Ruled Out
- A Python-side settings gap (runtime already forwards settings; TS layer is the missing link).
- Per-host settings plumbing (shared definitions make it one change for all hosts).

## Source Citations
- [SOURCE: file: .opencode/skills/sk-vision/vision-runtime/src/opencode/tools.ts:43-50]
- [SOURCE: file: .opencode/skills/sk-vision/vision-runtime/src/providers/photon.ts query/scene/ocr]
- [SOURCE: file: .opencode/skills/sk-vision/vision-runtime/src/providers/types.ts — no settings field]
- [SOURCE: file: .opencode/skills/sk-vision/vision-runtime/python/runtime.py:315-316,354-366,462-470]
- [SOURCE: file: /Users/michelkerkmeester/.cache/sk-vision/venv/.../moondream/types.py:17-26 — SamplingSettings]
