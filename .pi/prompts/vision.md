# Pi entry: /vision

## 1. OVERVIEW

Pi reaches sk-vision through a hidden but callable extension tool. This prompt is the native `/vision` entry point and tells the agent to inspect the user's most recent image with `sk_vision_inspect`.

---

## 2. CONTRACT

**Input:** `$ARGUMENTS` — an optional question about the most recent image.

**Output:** A concise answer synthesized from the `sk_vision_inspect` tool's `<SK-VISION>` output. Treat OCR as exact evidence; treat scene and caption as interpretation.

---

## 3. INSTRUCTIONS

1. Call the hidden but callable `sk_vision_inspect` tool on the user's **most recent image**, using the attached image or its path.
2. When `$ARGUMENTS` is non-empty, pass it as the tool's `question` parameter.
3. When `$ARGUMENTS` is empty, either ask the user what they want to know about the image or request a full read — choose based on context.
4. Answer using the tool's `<SK-VISION>` output. Synthesize the evidence instead of dumping the raw block.
5. Treat OCR as exact and verbatim. Treat scene and caption as interpretation and hedge uncertain claims.
6. Never invent details beyond the tool evidence.

---

## 4. HARD RULES

- If there is no recent image, ask the user to attach one and run `/vision` again.
- If the tool errors, report the error briefly and do not fabricate an analysis.
- If multiple images are present, use only the most recent one.

User request: $ARGUMENTS
