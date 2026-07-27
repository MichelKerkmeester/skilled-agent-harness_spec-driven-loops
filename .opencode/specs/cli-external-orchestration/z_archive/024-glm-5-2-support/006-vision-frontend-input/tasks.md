---
title: "Tasks: Phase 6: vision-frontend-input"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "glm-5.2 vision tasks"
  - "glm-5.2 image input"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/024-glm-5-2-support/006-vision-frontend-input"
    last_updated_at: "2026-06-28T18:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Transport proven; capability recorded in the three surfaces; phase 6 tasks complete"
    next_safe_action: "Phase 6 complete"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt-models/references/models/glm-5.2.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "anobel-glm-vision-debug/006-vision-frontend-input"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 6: vision-frontend-input

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

_Research / diagnosis — complete._

- [x] T001 Confirm GLM-5.2 is newest GLM + multimodal (release 2026-06-16; vision-to-code) — Z.AI docs + web research
- [x] T002 Reproduce `opencode run --model zai-coding-plan/glm-5.2 --file <img>` → `NO_IMAGE_RECEIVED`; no image part in event stream
- [x] T003 [P] Reproduce `glm-5v-turbo --file` → hang/timeout (200s, no output)
- [x] T004 Identify upstream cause: opencode #20802 (custom OpenAI-compatible providers drop image attachments to vision models)
- [x] T005 [P] Confirm `zai-coding-plan` credential present (auth.json) + profile/registry silent on vision
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

_Complete — transport proven via the direct Coding Plan API; capability recorded in three surfaces._

- [ ] T006 Stage A (opencode-native config so `--file` delivers images) — NOT pursued; superseded by T007. Stays the one open question (it would avoid the deviation)
- [x] T007 Stage A: direct Z.AI multimodal call built + proven — base64 `image_url` at `https://api.z.ai/api/coding/paas/v4/chat/completions`
- [x] T008 Stage B: Vision / image-input section added to the profile (`sk-prompt-models/references/models/glm-5.2.md` §7)
- [x] T009 [P] Stage B: modalities/vision + transport added to the registry (`sk-prompt-models/assets/model_profiles.json`)
- [x] T010 [P] Stage B: #20802 `--file` caveat + direct-API workaround added on the GLM line (`cli-opencode/SKILL.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

_Complete._

- [x] T011 Live transport proven — `glm-5.2` read an attached image (no `NO_IMAGE_RECEIVED`) and built a budget tile from a screenshot
- [x] T012 Card-sync guard exit 0; `model_profiles.json` parses; the three surfaces carry the notes
- [x] T013 Parent phase-map flipped to Complete; metadata refreshed
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All non-superseded tasks marked `[x]`
- [x] Transport proven; capability recorded; card-sync green
- [x] T006 documented as the one open follow-up (opencode-native `--file` config)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Where it surfaced**: `.opencode/specs/anobel.com/004-bento-visuals/`
- **Upstream bug**: opencode issue #20802
<!-- /ANCHOR:cross-refs -->
