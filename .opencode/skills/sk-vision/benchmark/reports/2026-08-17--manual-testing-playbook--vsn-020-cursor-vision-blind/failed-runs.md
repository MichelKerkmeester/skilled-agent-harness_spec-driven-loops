# Failed Runs

> sk-vision · doc · vsn-020-cursor-vision-blind

1 of 1 scenario(s) recorded a FAIL verdict.

## VSN-020

| Field | Value |
|---|---|
| Hub | sk-vision |
| Stage | host-adapters |
| Expected route | not recorded |
| Score | not recorded |
| Model | not recorded (vsn-020-cursor-vision-blind) |

**Recorded reason.** GLM-5.2-High via cli-cursor called sk_vision_inspect and sk_vision_ocr (no hallucination) and recovered the unguessable ground-truth tokens CODE and 4218 via inspect ('CODE DE DE 4218'); but exact-quote match to 'CODE 4218' failed — ocr returned only 'CO' and inspect carried a model repetition artifact. Root cause: default moondream2 truncates text reads and OCR is moondream3-only; moondream3 reads content but with a token-doubling artifact (vsn-020-cursor-ocr.log).
