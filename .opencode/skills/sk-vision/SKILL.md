---
name: sk-vision
description: "Local vision for text-only models: OCR, inspect, and detect on screenshots and mockups via Moondream."
allowed-tools: [Read, Bash]
version: 0.1.0.0
---

<!-- Keywords: screenshot OCR, attached image, mockup, error.png, local vision, moondream, grounded evidence, sk-vision -->

# sk-vision

Local vision skill. Text-only coding models get grounded OCR, layout, detect, and inspect evidence from a local image. The runtime and host adapters land in later children. This file only reserves paths and advisor triggers.

## 1. WHEN TO USE

Use this skill when the primary model is text-only and the user attached or named a local image:

- screenshot OCR
- attached image
- mockup
- error.png
- local vision
- moondream
- grounded evidence

### WHEN NOT TO USE

- The primary model is already multimodal and can see the image itself.
- The ask is audio, video, or documents.
- Publishing under the upstream npm name `opencode-senses`.
- Inventing a tool named `sk_vision_query`. Dump `senses_inspect` without a question already runs caption + scene + OCR together.

## 2. SMART ROUTING

Standalone Class S skill. One workflow mode: `sk-vision`. Leaf root: `references/` only. No `mode-registry.json`. No `hub-router.json`.

| Level | When to load | Resources |
|-------|----------------|-----------|
| ALWAYS | Every invocation | This SKILL.md |
| ON_DEMAND | Explicit request | `references/` markdown if any exists |

```python
from pathlib import Path
SKILL_ROOT = Path(__file__).resolve().parent
INTENT_SIGNALS = {
    "VISION": {
        "weight": 4,
        "keywords": [
            "screenshot OCR", "attached image", "mockup", "error.png",
            "local vision", "moondream", "grounded evidence",
        ],
    },
}
RESOURCE_MAP = {"VISION": []}
UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm the input is a local image path or attachment",
    "Confirm the primary model is text-only",
    "Do not route audio, video, or document work here",
]
```

## 3. HOW IT WORKS

This child does not copy runtime code and does not register host tools.

Reserved package home (leave empty here): `.opencode/skills/sk-vision/vision-runtime/`

Later OpenCode load path (do not create here): `.opencode/plugins/sk-vision.js` as a real file, not a symlink.

Later Pi load path (do not create here): `.pi/extensions/sk-vision.ts` as a relative symlink to `.opencode/skills/sk-vision/pi/sk-vision.ts`.

Locked tool names (13, implement in 003/004/005): `sk_vision_inspect`, `sk_vision_detect`, `sk_vision_point`, `sk_vision_ocr`, `sk_vision_status`, `sk_vision_segment`, `sk_vision_metadata`, `sk_vision_crop`, `sk_vision_zoom`, `sk_vision_colors`, `sk_vision_diff`, `sk_vision_annotate`, `sk_vision_reverse`.

## 4. RULES

- Class S: author `graph-metadata.json` and `leaf-manifest.config.json`. Generate `leaf-manifest.json` and `leaf-aliases.json` with `ci-skill-root-metadata.cjs --fix`.
- Forbidden at this root: `description.json`, `mode-registry.json`, `hub-router.json`, `command-metadata.json`.
- Do not populate `vision-runtime/` in this child.
- Do not publish as `opencode-senses`.
- Do not add a repo-root `opencode.json` `plugin` array.

## 5. REFERENCES

- Class S analog: `.opencode/skills/sk-git/`
- Contract: `.opencode/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md`
- Read-only dump (not this skill's corpus): `specs/sk-vision/001-sk-vision-fork-of-opencode-senses/context/`
