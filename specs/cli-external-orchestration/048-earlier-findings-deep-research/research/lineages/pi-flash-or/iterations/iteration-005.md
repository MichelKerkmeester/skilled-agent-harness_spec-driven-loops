# Iteration 005 — F3b: moondream3 token-doubling artifact + correct default & OCR guidance

## Focus
Root-cause the moondream3 token-doubling artifact (observed `CODE 42184218` on Cursor, `CODE 4 4218` on Devin vs ground-truth `CODE 4218`), and define the correct default model + documented OCR guidance.

## Actions Taken
1. Compared MD2 vs MD3 tokenizer/query templates in `kestrel/models/moondream/config.py`.
2. Read the query decode path (`kestrel/skills/query.py:231`, `post_reasoning_prefix`, `answer_suppressed_token_ids`) and chat skill.
3. Read `renderOCR` in `context-builder.ts` (verbatim `.trim()`, no normalization) and `handle_ocr` forwarding.
4. Web-confirmed moondream3-preview is a preview checkpoint with a reported OCRBench aggregrate (61.2).

## Findings

### Root cause — model inherent repetition artifact in a preview checkpoint
The doubling is **not a sk-vision decode bug**. sk-vision's `handle_ocr` returns `res["answer"]` verbatim and `renderOCR` only `.trim()`s it; it does not synthesize or duplicate text. The artifact is intrinsic to the **`moondream3-preview`** checkpoint — a preview release with known generation/repetition artifacts. The same fixture produced `CODE 42184218` (Cursor) and `CODE 4 4218` (Devin), i.e. the numeric run `4218` is doubled/re-inferred differently run-to-run. Tokenizer/config evidence:
- Base `_TOKENIZER_CONFIG` query template (used by MD3) has single `answer_prefix: [3]` and **empty** `answer_suppressed_token_ids` — so MD3 has no trained-in suppression of the answer boundary, and it is NOT the doubled-id artifact that MD2 declares (`answer_prefix: [3,3]`, `answer_suppressed_token_ids: [3]`).
- The repetition is therefore a **sampling-level repetition artifact** of the small preview model under the long transcription prompt, not a template/decode error in sk-vision.

### Bug vs expected
- **Expected (library):** moondream3-preview is a preview checkpoint with imperfect OCR output (aggregate OCRBench ~61.2 is a benchmark aggregate, not character-exact). Hosts legitimately got slightly different, still-wrong reads from the same image because generation is sampled.
- **sk-vision consideration:** the skill advertises `ocr` as an exact-text tool and the SKILL.md already notes OCR needs a Moondream 3.x checkpoint, but it does not warn that preview checkpoints can double/repeat tokens. That documentation gap is the actionable sk-vision-side item.

### The correct default + documented OCR guidance
1. **Correct default:** `DEFAULT_MODEL = "moondream2"` is fine for caption/scene/detect where it is adequate and lighter (~6GB). For **OCR**, moondream2 cannot do it (F3a) and moondream3-preview does it with artifacts — so the *documented default for OCR* should be a moondream3 checkpoint, requested explicitly, NOT for all tools.
2. **Documented OCR guidance (durable doc fix):**
   - Set `SK_VISION_MODEL` to a Moondream 3.x checkpoint for `sk_vision_ocr`/`sk_vision_inspect` text reads.
   - Treat `moondream3-preview` output as **approximately correct, verify against ground truth** when exactness matters (this is exactly what the manual-testing-playbook already did via `ocr-ground-truth.txt`).
   - Mitigate sampling-doubling by **seeding/limiting temperature** — but this currently is blocked because sk-vision never forwards `settings` (F5). Once F5 is fixed, lower-temperature/greedy sampling is the concrete lever to reduce repetition.
3. **Ideal combined fix (ties F3+F5):** add `_require_task("ocr")` (F3a) so misleading moondream2 runs fail loudly, AND forward a `settings` object through `sk_vision_inspect`/`sk_vision_ocr` (F5) so operators can pass `{"temperature": 0, "max_tokens": 256}` to tame moondream3 repetition.

### Cross-host generalization
The moondream3 artifact is host-independent (reproduces on Cursor and Devin because both hit the same runtime/library). This is a **library/model** issue, not a host-adapter issue — so the remediation belongs in the shared runtime/SKILL.md, not per-host.

## Questions Answered
- Q: Root cause of doubling? A: moondream3-preview repetition/sampling artifact; sk-vision returns it verbatim; not a sk-vision or host bug.
- Q: Correct default? A: keep moondream2 default but document moondream3 for OCR; ideal fix forwards settings to reduce sampling variance.

## Questions Remaining
- Confirmed F5 is the enabler for the sampling-mitigation lever (covered next).

## Next Focus
Iteration 6: F4 — Cursor's exact MCP config-resolution chain and where per-server env must live.

## Ruled Out
- A sk-vision-side text-doubling/synthesis bug (handle_ocr returns verbatim; renderOCR only trims).
- An MD2 doubled-id template bug causing the md3 doubling (MD2 declares [3,3]; MD3 base uses single [3]; different mechanisms).

## Source Citations
- [SOURCE: file: /Users/michelkerkmeester/.cache/sk-vision/venv/.../kestrel/models/moondream/config.py:197-304]
- [SOURCE: file: .opencode/skills/sk-vision/vision-runtime/src/core/context-builder.ts renderOCR]
- [SOURCE: file: .opencode/skills/sk-vision/vision-runtime/python/runtime.py:462-470]
- [SOURCE: file: scratch/run-2026-08-17/vsn-020-cursor-ocr-md3.log, vsn-020-devin-ocr-md3.log]
- [SOURCE: web moondream.ai/p/models — MD3 OCRBench 61.2 aggregate]
