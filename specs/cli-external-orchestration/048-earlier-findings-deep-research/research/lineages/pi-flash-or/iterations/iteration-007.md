# Iteration 007 — F5a: base64 `image` param 'Incorrect padding' root cause + durable fix

## Focus
Root-cause the `SK_VISION_ERROR (INVALID_INPUT): Incorrect padding` failure on the `image` base64 data-URL parameter (while `path` works) and propose the cleanest durable fix.

## Actions Taken
1. Read the source-resolution chain end-to-end: `tools.ts makeImageSource` → `photon.ts toSource` → `runtime.py _resolve_image`.
2. Verified the failure mode locally with Python: `base64.b64decode('iVBORw0KGgo')` (unpadded) → `binascii.Error: Incorrect padding`; padded `iVBORw0KGgo=` → OK; newline-containing input decodes fine.
3. Read `SkVisionError`/`fail()` wrapping in `tools.ts` + the JSON-RPC error mapping in `runtime.py` `main()` (ValueError → `INVALID_INPUT`).

## Findings

### Root cause — strict `base64.b64decode` on an unpadded/URL-safe data URL
`runtime.py::_resolve_image`:
```python
if kind == "data":
    data = source["data"]
    if "," in data:
        data = data.split(",", 1)[1]
    return Image.open(io.BytesIO(base64.b64decode(data)))
```
`base64.b64decode` (stdlib, default `validate=False`) **still raises `binascii.Error: Incorrect padding` when the length of the base64 payload is not a multiple of 4 / lacks the expected `=` padding**, and it does **not** accept URL-safe alphabet (`-`/`_`) without `altchars`. When a coding model renders an inline `data:image/png;base64,...` argument, the payload is frequently **unpadded or URL-safe** — the decoder rejects it with `binascii.Error`, which `main()` maps to `INVALID_INPUT` and `tools.ts fail()` renders as `SK_VISION_ERROR (INVALID_INPUT): Incorrect padding`. The `path` parameter works because it never enters the base64 path (`type == "path"` → file/URL resolution).

### Bug vs expected
**Bug (sk-vision robustness):** the data-URL decoder is stricter than the input contract tolerates. The `image` param is documented as "base64 data URL" — data URLs in the wild may omit padding (per RFC 4648 §3.2 the pad may be omitted when the length is unambiguous) or use URL-safe encoding. A tolerant decoder is the correct behavior for a tool whose input is produced by LLMs.
Expected part: `base64.b64decode` raising on malformed input is the stdlib's correct strictness — the defect is that sk-vision does not normalize before decoding.

### The cleanest durable fix (single location)
Fix `_resolve_image`'s `data` branch to be RFC-4648-tolerant:
1. Strip whitespace/newlines from the payload.
2. Accept URL-safe alphabet: `data = data.replace("-", "+").replace("_", "/")` (or pass `altchars`).
3. Re-pad: `data += "=" * (-len(data) % 4)` before `base64.b64decode`.
4. Wrap with a clear error message naming the parameter ("image base64 data URL") instead of leaking `binascii.Error` text.
This one Python change fixes every host (Cursor, Devin, Pi, OpenCode all hit the same runtime). No TS-side change needed for the padding bug itself.

### Cross-host generalization
Host-independent: Cursor and Devin both reproduced it (vsn-020-cursor-ocr-md3.log: first attempt failed, retry with `path` succeeded). Because all hosts share `runtime.py`, the single decoder fix generalizes to all four hosts at once. Note also that `moondream/photon_vl.py::_image_to_bytes` has the same strict `base64.b64decode` pattern for `Base64EncodedImage` — but sk-vision passes decoded PIL images, so the runtime fix is the effective one.

## Questions Answered
- Q: Root cause of 'Incorrect padding'? A: strict stdlib b64decode on unpadded/URL-safe data URLs in `_resolve_image`; path bypasses decode.
- Q: Where to fix? A: one tolerant-decoder change in `runtime.py _resolve_image` data branch.

## Questions Remaining
- F5b: settings passthrough for inspect (next iteration).

## Next Focus
Iteration 8: F5b — whether `sk_vision_inspect` should forward a `settings` object (max_tokens etc.) to the Python runtime.

## Ruled Out
- A TS-side fix being required for padding (the decoder lives in Python; one fix covers all hosts).
- Treating 'Incorrect padding' as model-related (it fails before any model load).

## Source Citations
- [SOURCE: file: .opencode/skills/sk-vision/vision-runtime/python/runtime.py:147-159]
- [SOURCE: file: .opencode/skills/sk-vision/vision-runtime/src/opencode/tools.ts:14-22]
- [SOURCE: file: .opencode/skills/sk-vision/vision-runtime/src/providers/photon.ts toSource]
- [SOURCE: file: scratch/run-2026-08-17/vsn-020-cursor-ocr-md3.log]
- [SOURCE: local verification: python3 base64.b64decode('iVBORw0KGgo') -> Incorrect padding]
