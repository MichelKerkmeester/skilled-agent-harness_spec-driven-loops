# Findings And Recommendations

> sk-vision · doc · vsn-020-cursor-vision-blind

1 failing scenario(s) grouped into 1 recorded pattern(s).

## 1. GLM-5.2-High via cli-cursor called sk_vision_inspect and sk_vision_ocr (no hallucination) and recovered the unguessable ground-truth tokens CODE and 4218 via inspect ('CODE DE DE 4218'); but exact-quote match to 'CODE 4218' failed — ocr returned only 'CO' and inspect carried a model repetition artifact. Root cause: default moondream2 truncates text reads and OCR is moondream3-only; moondream3 reads content but with a token-doubling artifact (vsn-020-cursor-ocr.log).

Affects 1 scenario(s): VSN-020.

---

Grouping reflects only the reasons this run recorded. Scenarios whose reason was not captured are grouped together and need a re-run before they can be diagnosed.
