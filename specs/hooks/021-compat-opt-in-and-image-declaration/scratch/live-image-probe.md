# Live probe: image pass-through on `llmgateway/deepseek-v4.1-flash`

**Question this answers:** does the channel actually accept image content, or would declaring
`input: ["text","image"]` make Pi send images uphill into a 400?

**Date:** 2026-09-11 · **Endpoint:** `POST https://api.llmgateway.io/v1/chat/completions`
**Model id sent:** `deepseek-v4.1-flash` · **Auth:** `${LLMGATEWAY_API_KEY}` (never printed)

## Probe input

`scratch/vision-probe.png` — generated deterministically by Pillow (720x300), Arial Bold 46px, white
background, with three text lines and one shape whose colour is known in advance:

```
PI VISION PROBE
CODE KX-4471
SEVEN ORANGE KITES
```

plus a red ellipse inside a black square outline at the right.

The point of the fixture is that the expected answer is not opinion: every token of that ground truth
is written down here before the request is sent.

## Request

Standard OpenAI-compatible multimodal message: one `text` part asking for an exact transcription plus
the shape colour, one `image_url` part carrying the PNG as a base64 data URL. `max_tokens` 300,
`temperature` 0. No affinity headers on this probe, so a failure would attribute to the image rather
than to headers.

## Result

**HTTP 200.** Full response in `scratch/live-image-probe.json`.

Model answer, verbatim:

```
Transcription of the text, line by line:

1. PI VISION PROBE
2. CODE KX-4471
3. SEVEN ORANGE KITES

The shape on the right is a red circle (set inside a black square outline); its colour is **red**.
```

Usage: `prompt_tokens` 254, `completion_tokens` 263 (203 of them reasoning), cost `0.0003918`.
Gateway-reported model: `deepseek/deepseek-v4.1-flash`.

## Verdict

All three lines match the fixture exactly, including the arbitrary code `KX-4471`, and the colour is
correct. The channel is not merely accepting the image and dropping it — it read it. This licenses the
`input: ["text","image"]` declaration on the model entry.

**Limit of this evidence:** it proves the gateway accepts and forwards images to this one upstream for
this one model. It says nothing about the other `llmgateway` models, which keep their existing
declarations.
