# Iteration 004 — F3a: Root cause of the 1-token moondream2 OCR/VQA truncation

## Focus
Determine whether the ~1-token moondream2 OCR/VQA output ("SK", "GR", "CO") is a generation cap, a decode bug, or a model-capability gap; identify the cleanest durable fix.

## Actions Taken
1. Read `runtime.py` handlers: `handle_ocr`, `_require_task`, `_supports`, `MOONDREAM3_ONLY_TASKS`, `DEFAULT_MODEL`.
2. Read the installed moondream/kestrel library: `moondream/photon_vl.py`, `kestrel/skills/query.py`, `kestrel/models/moondream/config.py`, `kestrel/skills/base.py`.
3. Web-confirmed moondream2 semantics of `max_tokens` and OCR model choice.

## Findings

### Root cause — model-capability gap, exposed by a missing task guard
The 1-token truncation is **not** a max_tokens cap in sk-vision. At the kestrel/library layer the default `AR_DEFAULT_MAX_NEW_TOKENS = 768` (kestrel/skills/base.py:23), so the decoder is not capped to 1 token. And the skill's default model is `DEFAULT_MODEL = "moondream2"` (runtime.py:89), a 2B Phi-1.5-based checkpoint that is **not trained for faithful OCR text transcription** — its `query()` degrades the "Transcribe the text in this image…" prompt into a ~1–2 token fragment ("SK"/"GR"/"CO").

The triggerable bug is in `runtime.py`:
- `MOONDREAM3_ONLY_TASKS = {"segment", "reason", "ocr"}` (line 92) correctly declares `ocr` as moondream3-only.
- `handle_segment` enforces this with `_require_task("segment")` (line ~432).
- **`handle_ocr` (line 462) does NOT call `_require_task("ocr")`.** It runs `model.query(...)` unconditionally. So on the default moondream2 model, `sk_vision_ocr` silently returns 1-token garbage instead of failing with "task 'ocr' is not supported by model 'moondream2'".

### Bug vs expected
Mixed:
- **Bug (sk-vision):** the `ocr` task guard is declared but not enforced on `handle_ocr`. This is the actual defect that lets a moondream2 run "succeed" with meaningless output.
- **Expected (moondream):** moondream2 genuinely cannot do faithful OCR; this is a model-selection expectation, not a library bug. Web docs confirm OCR via `query()` with a transcription prompt and a real token budget, and that moondream3 is the OCR-capable checkpoint (moondream3 OCRBench ≈ 61.2 in aggregate).

### The cleanest durable fix (dual)
1. **Enforce the guard** (mirror `handle_segment`): add `_require_task("ocr")` at the top of `handle_ocr` so a moondream2 run fails loudly with a clear "task 'ocr' is not supported by model 'moondream2'" message instead of returning garbage.
2. **Auto-select / default documentation:** because OCR is moondream3-only, either (a) default `SK_VISION_MODEL` to a moondream3 checkpoint for `ocr`/`scene`/`segment`/`reason`-using tools (larger VRAM cost — ~6GB), or (b) document in the SKILL.md that `sk_vision_ocr` requires `SK_VISION_MODEL=moondream3-preview` when the default model is moondream2. Given the runtime already re-gates `segment` loudly, honoring (1) plus a SKILL.md note that "set SK_VISION_MODEL to a Moondream 3.x checkpoint for `segment`/`ocr`" (already partially present at SKILL.md) is the minimal correct fix.

### Root-cause type (F3)
Generation-cap vs decode bug: **neither** in sk-vision — it's a **missing capability guard + wrong default model for the task**. The web "max_tokens=1" reading is a misleading coincidence: it explains the *user* symptom only if the user *set* max_tokens=1, which sk-vision never forwards (F5). In the observed transcripts the tool passed `settings=None`, so 768 applied and the model simply couldn't transcribe.

## Questions Answered
- Q: Generation cap or decode bug? A: Neither — model-capability gap exposed by unenforced `ocr` task guard + moondream2 default.
- Q: Does sk-vision set max_tokens=1? A: No; it passes `settings=None`, kestrel defaults to 768.

## Questions Remaining
- F3b (moondream3 token-doubling) — next iteration.

## Next Focus
Iteration 5: F3b — the moondream3 token-doubling artifact ("CODE 42184218" vs ground truth "CODE 4218") and the correct default + OCR guidance.

## Ruled Out
- A sk-vision generation cap of 1 token (skill passes settings=None; kestrel default is 768).
- A plain decode bug in `photon_vl.py` (it forwards settings faithfully).

## Source Citations
- [SOURCE: file: .opencode/skills/sk-vision/vision-runtime/python/runtime.py:89,92,462-470]
- [SOURCE: file: /Users/michelkerkmeester/.cache/sk-vision/venv/.../kestrel/skills/base.py:23] (AR_DEFAULT_MAX_NEW_TOKENS=768)
- [SOURCE: file: /Users/michelkerkmeester/.cache/sk-vision/venv/.../kestrel/models/moondream/config.py:197-248] (MD2 vs MD3 tokenizer)
- [SOURCE: web huggingface.co/vikhyatk/moondream2 — OCR via query()]
- [SOURCE: web moondream.ai/p/models — MD3 OCRBench 61.2]
