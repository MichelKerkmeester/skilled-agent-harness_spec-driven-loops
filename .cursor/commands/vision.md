---
description: On-device vision on an image, run locally through the sk-vision CLI.
argument-hint: "<image path> [question] — omit the question for a full read"
allowed-tools: Read, Bash
---

# /vision

## 1. PURPOSE

Read an image locally and answer from the returned evidence. The analysis runs on-device through a local model. Nothing is uploaded and no API key is involved.

---

## 2. OVERVIEW

Cursor reaches sk-vision by running its CLI, not through a tool. Cursor delivers no prompt-time hook event, so there is no way to place the evidence in front of you automatically the way the OpenCode and Devin adapters do. Running the command is what produces the evidence.

The CLI prints a `<SK-VISION EVIDENCE>` block containing scene analysis, a caption and exact OCR, or an answer to a question when you pass one.

---

## 3. CONTRACT

**Input:** `$ARGUMENTS` — an image path, optionally followed by a question about it.

**Output:** A concise answer synthesized from the `<SK-VISION EVIDENCE>` block. Treat OCR as exact evidence. Treat scene and caption as interpretation.

**Command:**

```bash
node .opencode/skills/sk-vision/vision-runtime/dist/vision-cli.js <image-path> [question...]
```

Exit codes: `0` evidence on stdout, `1` a runtime or usage error on stderr, `2` no image found.

---

## 4. INSTRUCTIONS

1. Extract the image path from `$ARGUMENTS`. Ask for one if the user named no path, since the CLI cannot see the conversation.
2. Run the command above with that path, appending the user's question when they asked one.
3. Answer from the `<SK-VISION EVIDENCE>` block. Synthesize it rather than pasting the raw block back.
4. Treat OCR as exact and verbatim, especially error strings, codes, URLs and UI copy. Hedge claims the scene and caption cannot fully support.
5. Never invent detail the analysis does not contain.

---

## 5. HARD RULES

- If the command exits `1`, report the `SK_VISION_ERROR` line in one sentence and stop. Do not fabricate an analysis.
- If it exits `2`, tell the user the path did not resolve and ask for a correct one.
- The first run downloads model weights, roughly 3.9 GB, and takes minutes. Say so rather than letting the user think it hung.
- Never claim to see anything the block does not contain.

User request: $ARGUMENTS
