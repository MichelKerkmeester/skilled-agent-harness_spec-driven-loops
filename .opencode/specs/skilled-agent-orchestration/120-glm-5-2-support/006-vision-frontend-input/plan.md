---
title: "Implementation Plan: Phase 6: vision-frontend-input"
description: "Prove a working image transport to GLM-5.2 (opencode-native config preferred; direct Z.AI multimodal API as a flagged fallback), then record its native vision-to-code capability + the correct image-input method across glm-5.2.md, model_profiles.json, and cli-opencode."
trigger_phrases:
  - "glm-5.2 vision plan"
  - "glm-5.2 image input transport"
  - "opencode 20802 workaround"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/120-glm-5-2-support/006-vision-frontend-input"
    last_updated_at: "2026-06-28T17:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Planned the two-stage approach: prove image transport, then record capability + method"
    next_safe_action: "Get operator approval for the transport, then execute Stage A"
    blockers:
      - "Stage A fallback (direct Z.AI API) needs operator approval — flagged cli-opencode deviation"
    key_files:
      - ".opencode/skills/sk-prompt-models/references/models/glm-5.2.md"
      - ".opencode/skills/sk-prompt-models/assets/model_profiles.json"
      - ".opencode/skills/cli-opencode/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "anobel-glm-vision-debug/006-vision-frontend-input"
      parent_session_id: null
    completion_pct: 40
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 6: vision-frontend-input

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown + JSON skill config; shell/Node smoke tests |
| **Framework** | sk-prompt-models + cli-opencode surfaces; Z.AI Coding Plan multimodal API |
| **Storage** | None (file-based skill config + routing metadata) |
| **Testing** | Live image-describe smoke test; card-sync guard; node JSON.parse |

### Overview
Two stages, gated. **Stage A** establishes a transport that actually delivers pixels to GLM-5.2's multimodal endpoint — the mandated `opencode --file` path is broken for `zai-coding-plan` (opencode #20802; verified `NO_IMAGE_RECEIVED` / hang). **Stage B** records the native vision capability + the correct image-input method as dated, additive notes across the canonical surfaces, so visual-design dispatches feed pixels instead of re-discovering the trap.

### Why this phase exists (confirmed findings)
GLM-5.2 is the newest GLM (2026-06-16), natively multimodal, strong at vision-to-code. Our weak Anobel output came from (a) transcribing reference images to lossy text and (b) opencode #20802 dropping image attachments to vision models on custom OpenAI-compatible providers. The model was never the problem.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear; root cause isolated with live evidence
- [x] Correct method identified (pixels + render-feedback loop)
- [ ] Transport approach approved by operator (Stage A gate)

### Definition of Done
- [ ] A live call delivers an image to GLM-5.2 and it describes it (no `NO_IMAGE_RECEIVED`)
- [ ] glm-5.2.md + model_profiles.json + cli-opencode carry the capability, transport, and #20802 caveat
- [ ] Card-sync exit 0; model_profiles.json parses
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Capability + transport record. The model is natively multimodal; the work is making image input reliably reach it and recording the method. No model/framework change to the text verdict (COSTAR stands).

### Key Components
- **Transport**: how pixels reach `zai-coding-plan/glm-5.2` — opencode `--file` (broken here per #20802) vs. direct Z.AI multimodal `image_url`.
- **glm-5.2.md**: per-model profile (currently silent on vision) — gains a Vision / image-input section.
- **model_profiles.json**: registry entry — gains modalities/vision metadata + a vision-to-code strength note.
- **cli-opencode**: dispatch surface — gains the #20802 image caveat + workaround on the GLM line.

### Data Flow (correct method)
1. Caller attaches the actual reference image(s) to a multimodal request.
2. GLM-5.2 reads the pixels (layout, palette, hierarchy) and emits frontend code.
3. Iteration: render the output, attach reference + current render, ask it to close named gaps.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is a capability/record change, not a bug fix in our code (the bug is upstream opencode #20802). The table tracks the surfaces that must carry the finding.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| sk-prompt-models/references/models/glm-5.2.md | Per-model profile (silent on vision) | Add Vision / image-input section: capability + transport + #20802 caveat + render-feedback loop | card-sync; review |
| sk-prompt-models/assets/model_profiles.json | Registry entry | Add modalities/vision + vision-to-code strength | node JSON.parse; card-sync |
| cli-opencode/SKILL.md (+ cli_reference.md) | Dispatch surface | GLM line: `--file` image drop on custom OpenAI-compatible providers (#20802) + workaround | review |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Discovery & Setup (complete)
- [x] Confirm GLM-5.2 recency + multimodality (Z.AI docs: release 2026-06-16; vision-to-code)
- [x] Reproduce `--file` failure: glm-5.2 → `NO_IMAGE_RECEIVED`; glm-5v-turbo → hang
- [x] Identify upstream cause (opencode #20802); confirm `zai-coding-plan` credential present

### Phase 2: Core Implementation (pending approval)
- [ ] Stage A: try an opencode-native config that makes `--file` deliver images for this provider (preferred — stays on the mandate)
- [ ] Stage A fallback: build the direct Z.AI multimodal call (base64 `image_url`) — after operator approval; confirm endpoint + payload
- [ ] Stage B: write the Vision section into glm-5.2.md; add modalities to model_profiles.json; add the #20802 caveat to cli-opencode

### Phase 3: Verification (pending)
- [ ] Live image-describe returns real content (transport proven)
- [ ] Card-sync exit 0; JSON parses; surfaces carry the notes
- [ ] Add changelog entry; flip parent phase-map status to Complete; refresh metadata
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual | Image actually reaches GLM-5.2 | `opencode run ... --file <img>` or direct Z.AI multimodal call → describe |
| Guard | Profile/registry completeness | `check-prompt-quality-card-sync.sh .` |
| Parse | Edited JSON | `node` JSON.parse |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Operator approval of the transport (esp. the direct-API fallback) | External | Pending | Stage A cannot proceed; build blocked |
| Z.AI Coding Plan multimodal endpoint accepts images for glm-5.2 | External | To confirm | Direct transport fails; fall back to opencode-native fix |
| opencode #20802 (upstream) | External | Open | `--file` stays broken for this provider until patched |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Card-sync fails, JSON breaks, or the recorded transport proves wrong.
- **Procedure**: Stage-B edits are additive doc/metadata — `git checkout` the specific files to revert. Stage A is a read-only describe test using an existing credential; nothing to undo.
<!-- /ANCHOR:rollback -->
