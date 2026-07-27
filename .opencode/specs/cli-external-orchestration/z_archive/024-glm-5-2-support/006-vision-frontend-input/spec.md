---
title: "Feature Specification: Phase 6: vision-frontend-input"
description: "GLM-5.2 is a native multimodal vision-to-code model (newest GLM, 2026-06-16) but phases 1-5 only profiled it for TEXT. Real visual-design use produced 'same but less refined' output because (a) reference images were transcribed to lossy text and (b) opencode --file does NOT deliver image attachments to vision models on custom OpenAI-compatible providers (opencode #20802); zai-coding-plan is exactly such a provider. This phase records GLM-5.2's vision capability + the correct image-input transport across the canonical surfaces."
trigger_phrases:
  - "glm-5.2 vision"
  - "glm-5.2 multimodal image input"
  - "glm-5.2 vision to code"
  - "glm-5.2 frontend screenshot"
  - "opencode file image attachment vision"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/024-glm-5-2-support/006-vision-frontend-input"
    last_updated_at: "2026-06-28T17:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Proved GLM-5.2 vision transport; recorded capability in profile, registry, cli-opencode"
    next_safe_action: "Phase 6 complete; use vision-to-code via the direct Coding Plan API for image input"
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
      - "Working transport confirmed 2026-06-28: direct Z.AI Coding Plan API /api/coding/paas/v4 with base64 image_url; glm-5.2 reads images and built a budget tile from a screenshot"
      - "GLM-5.2 is the newest GLM (2026-06-16), multimodal, with design taste rated above Claude (vision-to-code is a core strength) — it was NOT the wrong tool"
      - "Root cause of weak output = lossy text-transcription of reference images + opencode #20802 (custom OpenAI-compatible providers drop image attachments to vision models); zai-coding-plan is such a provider"
      - "Empirically: glm-5.2 + --file image -> NO_IMAGE_RECEIVED (no image part attached); glm-5v-turbo + --file -> hang/timeout"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 6: vision-frontend-input

<!-- SPECKIT_LEVEL: 1 -->

> **COMPLETE — observation-driven.** GLM-5.2's reputation for visual frontend is real and the failure that surfaced it was a transport/method bug on our side, not a model limit. The transport is proven (REQ-004 met 2026-06-28: glm-5.2 read an attached image via the direct Z.AI Coding Plan API and built a budget tile from a screenshot), and the capability + correct image-input method are now recorded in glm-5.2.md (§7), model_profiles.json, and cli-opencode. The direct-API transport is a flagged cli-opencode deviation, justified by the verified opencode #20802 breakage of `--file`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete — transport proven (REQ-004); capability recorded in glm-5.2.md / model_profiles.json / cli-opencode |
| **Created** | 2026-06-28 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 |
| **Predecessor** | 001-model-registration (the profile/surfaces this extends), 005-operational-caveats (sibling caveat phase) |
| **Trigger** | A real GLM-5.2 visual-design dispatch (Anobel bento tiles) produced "same as existing but less refined" output; root-cause investigation found the model was capable but never received the image |
| **Handoff Criteria** | GLM-5.2's vision capability + the correct image-input transport are recorded in `glm-5.2.md`, `model_profiles.json`, and `cli-opencode`, framed as dated observations; a working transport is proven (model reads an attached image) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This phase extends `157-glm-5-2-support` from a TEXT-only adoption to cover GLM-5.2's **native multimodal vision-to-code** capability — the trait the model is actually known for. Phases 1-5 registered GLM-5.2, picked its text framework (COSTAR, benchmark 008), and recorded text dispatch caveats. None addressed image input.

**Scope Boundary**: Record the vision capability + the correct image-input transport as additive, dated observations in the canonical surfaces. This is OBSERVATION + a transport contract, not a benchmark and not a change to the text framework verdict.

**How it surfaced**: While generating Anobel bento dashboard tiles (`anobel.com/004-bento-visuals`), GLM-5.2 was dispatched via `cli-opencode` with reference designs supplied only as TEXT transcriptions. The output reproduced existing cards' compositions but at lower refinement. A fresh-perspective review + live smoke tests isolated the cause (Section 2).

**Changelog**: When this phase closes, add the matching file under `../changelog/`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
GLM-5.2 is the newest GLM (released **2026-06-16**), is **natively multimodal**, and is widely cited for strong visual-frontend / "vision-to-code" work (design taste rated above Claude on design benchmarks). Yet our visual-design dispatches produced "same but less refined" output. Root-cause investigation found **two compounding failures**, neither of which is a GLM capability limit:

1. **Lossy input method.** Reference designs were transcribed into prose and handed to GLM as text. Refinement lives in pixels (icon chips, pill treatment, spacing, geometry); a text summary discards it, so a faithful rebuild can only *shed* refinement. This produces exactly the "same composition, less refined" symptom.
2. **Broken image transport (upstream).** `opencode run --file <image>` does **not** deliver image attachments to vision-capable models on **custom OpenAI-compatible providers** (opencode GitHub issue **#20802**). `zai-coding-plan` is exactly such a provider. So even had we attached the image, GLM never received it.

**Live evidence (this install, 2026-06-28):**
- `opencode run --model zai-coding-plan/glm-5.2 --file <ref>.png "describe the image"` → model replied **`NO_IMAGE_RECEIVED`**; the JSON event stream shows **no image/file part** was ever attached.
- `opencode run --model zai-coding-plan/glm-5v-turbo --file <ref>.png "..."` → dispatch **hangs / times out** (no output).
- The `glm-5.2.md` profile and `model_profiles.json` glm-5.2 entry are **silent on vision/modalities** — so the capability is undiscoverable and the trap is re-paid every time.

### Purpose
Make GLM-5.2's vision capability and the **correct image-input transport** first-class and discoverable, so future visual-design dispatches feed the model pixels (native vision-to-code) instead of lossy text, and don't re-hit the #20802 trap.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Record GLM-5.2 as vision/multimodal in `model_profiles.json` (modalities) and the `glm-5.2.md` profile (a Vision / image-input section: capability + the correct transport + the #20802 caveat).
- Record the **correct image-input method** (the transport contract + the render-feedback loop) so visual-design dispatches feed pixels, not text.
- Record the opencode **#20802** image-transport limitation for custom OpenAI-compatible providers (incl. `zai-coding-plan`) on the GLM line in `cli-opencode`.
- Prove a working image transport: GLM-5.2 reads an attached reference image and describes it.

### Out of Scope
- Re-benchmarking GLM-5.2's text framework (phase 2/3 verdict — COSTAR — stands unchanged).
- The Anobel bento-visual deliverable itself (that is `anobel.com/004-bento-visuals`; this phase only captures the GLM-5.2 method learned there).
- Patching opencode upstream (#20802) — out of this packet; we document + work around it.

### Files to Change (the build — pending approval)
| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-prompt-models/references/models/glm-5.2.md` | Modify | New Vision / image-input section: native multimodal; correct transport (direct Z.AI multimodal `image_url`); #20802 `--file` caveat; render-feedback loop |
| `.opencode/skills/sk-prompt-models/assets/model_profiles.json` | Modify | glm-5.2 modalities/vision metadata + a strength note for vision-to-code |
| `.opencode/skills/cli-opencode/SKILL.md` (+ `cli_reference.md` if relevant) | Modify | GLM line caveat: `--file` image attachments do not reach vision models on custom OpenAI-compatible providers (#20802); name the direct-API workaround |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | GLM-5.2's vision/multimodal capability is recorded | `glm-5.2.md` has a Vision section; `model_profiles.json` glm-5.2 carries modalities/vision; both name vision-to-code as a strength |
| REQ-002 | The correct image-input transport is documented | The profile names the working transport (pixels to the model's multimodal endpoint) + the render-feedback loop, NOT text transcription |
| REQ-003 | The #20802 `--file` caveat is recorded where dispatch is composed | `cli-opencode` GLM line states `--file` images do not reach vision models on custom OpenAI-compatible providers, with the workaround |
| REQ-004 | A working transport is proven | A live call delivers an image to GLM-5.2 and it describes the content (no `NO_IMAGE_RECEIVED`) |
| REQ-005 | Framed as dated observation; gates stay green | Text dated; `check-prompt-quality-card-sync.sh` exit 0; `model_profiles.json` parses |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: GLM-5.2 reads an attached reference image and describes it (transport proven; REQ-004).
- **SC-002**: `glm-5.2.md` + `model_profiles.json` + `cli-opencode` carry the vision capability, the correct transport, and the #20802 caveat (REQ-001/002/003).
- **SC-003**: Card-sync guard green; `model_profiles.json` parses (REQ-005).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The working transport may require the **direct Z.AI multimodal API** (bypassing `opencode --file`) | A documented deviation from the cli-opencode small-model-dispatch mandate | Flag the deviation to the operator and get approval (plan-workflow lock); justification is the verified #20802 breakage of the mandated path |
| Risk | Z.AI Coding Plan endpoint may not accept images for glm-5.2 (vs the general API) | Transport fails | Confirm the exact endpoint + `image_url` payload on implement (REQ-004 is the gate) |
| Risk | Over-generalizing from a few smoke tests | Misleading caveat | Frame as dated observation; cite #20802 + the live test outputs |
| Risk | Breaking the card-sync guard | CI red | Additive notes only; run the guard post-edit |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What is the exact Z.AI multimodal endpoint + `image_url` payload shape the Coding Plan accepts for `glm-5.2`? (Confirm on implement.)
- Is there an opencode provider/model config that marks `zai-coding-plan/glm-5.2` vision-capable so `--file` works, removing the need for the direct API? (Investigate; preferred if it keeps dispatch on the mandated workflow.)
- Does feeding pixels (native vision-to-code) actually clear the refinement bar that text-transcription could not? (The real test, once transport works.)
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Sibling caveat phase**: `../005-operational-caveats/` — text dispatch gotchas (this is the vision analogue)
- **Profile to update**: `.opencode/skills/sk-prompt-models/references/models/glm-5.2.md`
- **Upstream bug**: opencode issue #20802 (custom OpenAI-compatible providers drop image attachments to vision models)
- **Where it surfaced**: `.opencode/specs/anobel.com/004-bento-visuals/` (the visual-design work that exposed the method gap)
- **Parent Spec**: `../spec.md`
