---
title: "Implementation Summary: Phase 6: vision-frontend-input"
description: "COMPLETE: GLM-5.2 vision-to-code transport proven (direct Z.AI Coding Plan multimodal API, base64 image_url at /api/coding/paas/v4) and the capability + correct image-input method recorded in glm-5.2.md (§7), model_profiles.json, and cli-opencode. opencode --file stays broken for this provider (#20802) — documented with the direct-API workaround."
trigger_phrases:
  - "glm-5.2 vision findings"
  - "glm-5.2 image input transport"
  - "opencode 20802 image attachment"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/024-glm-5-2-support/006-vision-frontend-input"
    last_updated_at: "2026-06-28T18:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Proved GLM-5.2 vision transport; recorded capability in profile, registry, cli-opencode"
    next_safe_action: "Phase 6 complete; vision-to-code usable via the direct Coding Plan API"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt-models/references/models/glm-5.2.md"
      - ".opencode/skills/sk-prompt-models/assets/model_profiles.json"
      - ".opencode/skills/cli-opencode/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "anobel-glm-vision-debug/006-vision-frontend-input"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Whether an opencode-native config can make --file deliver images (would avoid the direct-API deviation)"
    answered_questions:
      - "GLM-5.2 reads images via the direct Z.AI Coding Plan API; opencode --file is broken for this provider (#20802)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Phase 6: vision-frontend-input

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Status** | Complete — transport proven (REQ-004); capability recorded in 3 surfaces |
| **Phase** | 6 |
| **Completed** | 2026-06-28 |
| **Verification** | Live image-read + card-sync guard + JSON parse |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

GLM-5.2's native vision capability is now proven and recorded. The "build" deliverable is the proven transport plus the capability record across the canonical surfaces.

1. **Transport proven (REQ-004).** A `glm-5.2` request carrying a base64 `image_url` block to `https://api.z.ai/api/coding/paas/v4/chat/completions` returned a correct reading of an attached UI; a budget dashboard tile was then built from a reference screenshot (the Anobel `budgetteren-glm.html`). `glm-4.6v` also reads images; non-vision `glm-4.6` rejects image content (code 1210). The general `/api/paas/v4` endpoint 429s ("insufficient balance") for this subscription key — the Coding Plan endpoint is the one that works.
2. **Capability recorded in three surfaces:**
   - `sk-prompt-models/references/models/glm-5.2.md` — new **§7 Vision / image input**: native vision-to-code, the working transport, the #20802 `--file` caveat, the render-feedback loop; plus a Modalities row in §2 and vision trigger phrases.
   - `sk-prompt-models/assets/model_profiles.json` — glm-5.2 `capability.modalities` `["text","image"]` + a `vision` note.
   - `cli-opencode/SKILL.md` — the GLM line now carries the #20802 `--file` image caveat + the direct-API workaround.
3. **Method recorded:** feed pixels not prose; render-feedback loop; gates stay checks, never taste-overrides.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

- A direct Z.AI Coding Plan multimodal call (base64 `image_url`) bypassed opencode's broken `--file` (#20802) and proved GLM-5.2 reads images.
- The capability + transport + caveat were written as dated, additive notes; the card-sync guard (`check-prompt-quality-card-sync.sh`) passed and `model_profiles.json` parses.
- The deviation (direct API vs `opencode run`) is flagged in all three surfaces, justified by the verified #20802 breakage.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

1. **Direct Z.AI Coding Plan API for image input** — opencode `--file` is broken for custom OpenAI-compatible providers (#20802); the direct API is the only working transport. Flagged as a cli-opencode deviation.
2. **Large `max_tokens` for vision-to-code** — thinking-on consumes the budget first; too small a cap returns empty `content` (`finish_reason:"length"`).
3. **T006 (opencode-native `--file` config) deferred** — would remove the deviation; kept as the one open follow-up rather than blocking the proven path.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- Image read: `[200] glm-5.2 @ /api/coding/paas/v4/chat/completions` with an `image_url` block; `glm-4.6v` reasoning correctly described the reference ("budget per ship dashboard for maart 2026").
- Negative control: `--file` to `zai-coding-plan/glm-5.2` → `NO_IMAGE_RECEIVED`; `glm-5v-turbo --file` → hang (confirms #20802, not a model limit).
- Card-sync guard exit 0; `model_profiles.json` parses; the three surfaces carry the notes.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Image input bypasses `opencode run`.** Until opencode #20802 is fixed (or an opencode-native vision config is confirmed — the one open follow-up), image dispatch uses the direct Z.AI API, outside the cli-opencode mandate.
2. **Token budget sensitivity.** Vision-to-code needs a large `max_tokens` or `content` returns empty after thinking.
3. **Findings from live tests + docs** — framed as dated observations, not a benchmark.
<!-- /ANCHOR:limitations -->
