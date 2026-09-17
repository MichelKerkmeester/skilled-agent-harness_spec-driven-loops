---
description: "On-device read of your latest image: scene, caption and exact OCR, or a direct answer. No model switch."
argument-hint: "[question about your most recent image] — omit for a full read"
allowed-tools: Read
---

# /vision

Run sk-vision's local vision model on the most recent image in this session, then answer using its analysis.

By the time you read this, the sk-vision plugin has ALREADY analyzed the latest image on-device and injected its findings into this turn as a `<SK-VISION COMMAND> … </SK-VISION COMMAND>` block. That block is how you "see" the image — you do not call a tool to inspect it, and you must not claim to see anything the block does not contain.

---

## 1. PURPOSE

Give the user a fast, private read of an image they attached — a screenshot, error dialog, design mockup, diagram, chart, or photo — without switching models or sending the image to a cloud provider. This works whether the active model is text-only or vision-capable: it grounds the answer in a consistent local analysis plus exact OCR.

---

## 2. INPUTS

- `$ARGUMENTS` — an optional natural-language question about the image.
  - **Present** → the injected block is sk-vision's answer to that question.
  - **Empty** → the injected block is a full read: scene analysis, a caption, and verbatim OCR of any visible text.
- The injected `<SK-VISION COMMAND>` block is your **only** source of truth about the image. If it is missing, empty, or reads `no recent image found`, treat that literally (see §4).

---

## 3. INSTRUCTIONS

1. **Question given** (`$ARGUMENTS` non-empty) → answer it directly and concisely, grounded in the evidence. Lead with the answer, then the supporting detail.
2. **No question** (bare `/vision`) → give a short structured read: what the image is, its key elements or layout, and any text it contains.
3. **Trust levels** — treat the **OCR text as exact and verbatim**: quote it faithfully, especially error strings, codes, URLs, and UI copy. Treat the **scene and caption as the model's interpretation**: useful, but hedge claims the analysis can't fully support (small or blurry text, ambiguous UI state, off-screen content).
4. **Synthesize, don't dump** — do not paste the raw evidence block back at the user. Turn it into a natural answer, surfacing exact OCR only where it carries the meaning.
5. **Stay within the evidence** — never invent detail the analysis doesn't contain. If the question can't be answered from what sk-vision returned, say what's missing and suggest a sharper `/vision <question>` or a clearer/closer image.

---

## 4. EDGE CASES

- **No image** — if the block reads `no recent image found`, tell the user to attach an image (paste, drag, or file) and run `/vision <question>` again. Do not guess at contents.
- **Runtime error** — if the block is `SK_VISION_ERROR: …`, report the error in one line and suggest retrying. Do not fabricate an analysis.
- **Multiple images** — sk-vision reads the **most recent** image only. If the user meant an earlier one, ask them to re-attach it as the latest, then re-run.

---

## 5. NOTES

- sk-vision runs entirely on-device and shuts its runtime down after each `/vision` call, so nothing lingers in memory between calls; the next call starts fresh.
- `/vision` is the intended entry point — the `sk_vision_*` tools stay hidden by default so they don't clutter other models. Set `SK_VISION_AUTOINSPECT=1` to restore automatic image inspection and the full tool set.
