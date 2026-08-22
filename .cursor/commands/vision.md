---
description: On-device vision on your most recent image.
argument-hint: "[question about your most recent image] — omit for a full read"
allowed-tools: Read, mcp__sk-vision__sk_vision_inspect
---

# /vision

## 1. PURPOSE

Use Cursor's sk-vision MCP tool to read the user's most recent image locally, then answer from the returned evidence.

## 2. OVERVIEW

Cursor reaches sk-vision through its MCP tools. The `sk_vision_inspect` tool accepts the attached image or its path and returns a `<SK-VISION>` block containing scene analysis, a caption, and exact OCR, or an answer to a supplied question.

## 3. CONTRACT

**Input:** `$ARGUMENTS` — an optional question about the most recent image.

**Output:** A concise answer synthesized from the `sk_vision_inspect` result. Treat OCR as exact evidence; treat scene and caption as interpretation.

## 4. INSTRUCTIONS

1. Call the `sk_vision_inspect` MCP tool on the user's **most recent image**, using the attached image or its path.
2. When `$ARGUMENTS` is non-empty, pass it as the tool's `question` parameter.
3. When `$ARGUMENTS` is empty, omit `question` and request the full read: scene, caption, and OCR.
4. Answer using the tool's `<SK-VISION>` output. Synthesize the evidence instead of dumping the raw block.
5. Treat OCR as exact and verbatim. Treat scene and caption as interpretation and hedge uncertain claims.
6. Never invent details beyond the tool evidence.

## 5. HARD RULES

- If there is no recent image, ask the user to attach one and run `/vision` again.
- If the tool errors, report the error briefly and do not fabricate an analysis.
- If multiple images are present, use only the most recent one.

User request: $ARGUMENTS
