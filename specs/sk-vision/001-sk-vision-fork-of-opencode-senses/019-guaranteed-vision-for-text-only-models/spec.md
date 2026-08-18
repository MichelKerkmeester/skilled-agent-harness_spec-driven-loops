---
title: "Feature Specification: Guaranteed vision for text-only models"
description: "Gate sk-vision's auto-inspect on an operator-curated text-only model allowlist and await the full analysis for those models, so a blind model always gets image evidence."
trigger_phrases:
  - "sk-vision guaranteed vision text-only"
  - "sk-vision non-vision model allowlist"
  - "sk-vision force auto-inspect"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/019-guaranteed-vision-for-text-only-models"
    last_updated_at: "2026-08-18T11:00:00.000Z"
    last_updated_by: "claude"
    recent_action: "Shipped Pi per-model gate + Cursor/Devin best-effort rules; commit pending."
    next_safe_action: "Commit packet on v4 (and main) once the operator approves."
    blockers: []
    key_files:
      - "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/019-guaranteed-vision-for-text-only-models/spec.md"
      - ".opencode/skills/sk-vision/vision-runtime/src/model-modality.ts"
      - ".opencode/skills/sk-vision/hooks/pi/sk-vision.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-019-guaranteed-vision"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Guaranteed vision for text-only models

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-08-18 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `specs/sk-vision/001-sk-vision-fork-of-opencode-senses` |
| **Predecessor** | `018-host-adapter-findings-fixes` |
| **Successor** | N/A |
| **Handoff Criteria** | For an allowlisted text-only model, the in-process host awaits the full analysis so `<SK-VISION>` evidence is guaranteed; other models keep the non-blocking grace; classifier + guarantee are unit-tested. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

Today the auto-inspect is best-effort: a 2-second grace, and under a cold load it may only hand the model a file path rather than real evidence. For a text-only model that is a correctness gap — it has no other way to see the image. This packet makes the run guaranteed for models the operator lists as text-only. Built OpenCode-first (where the active model is exposed as `{providerID, modelID}`), then expanded to Pi (per-model gate on `ctx.model`) and to a best-effort Cursor rule + Devin note.

**Scope Boundary**: `vision-runtime/src/model-modality.ts` (new classifier), the OpenCode (`attachments.ts`) and Pi (`hooks/pi/sk-vision.ts`) auto-inspect gates, the Cursor/Devin `vision-rule.md` notes, and tests.

**Deliverables**: an operator-curated text-only allowlist (with a declared-modality signal) + a guaranteed in-process auto-inspect on OpenCode and Pi + best-effort rules for Cursor/Devin.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
sk-vision's auto-inspect never blocks message submit (a 2-second grace, then it injects whatever is ready — often just a materialized file path). For a multimodal model that is fine, but a **text-only model cannot see the image at all**, so a raced-out analysis leaves it blind with no signal. There was also no notion of *which* model is active — the inject fired the same way regardless.

### Purpose
Introduce an operator-curated **text-only model allowlist** and, when the active model is on it, **await the full analysis** so the `<SK-VISION>` evidence is guaranteed present before the model reads the message. Every other model keeps today's cheap, non-blocking behaviour.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (shipped)
- A shared classifier `isTextOnlyModel({providerID, modelID, input?})` reading a built-in allowlist plus env overrides (`SK_VISION_FORCE=1`, `SK_VISION_TEXT_ONLY_MODELS`), and treating a host-declared non-image `input` modality as authoritative.
- Gate OpenCode's `AttachmentInjector` and Pi's `inspectAttachedImages` on it: await the full analysis for a text-only model; keep the grace race otherwise.
- A best-effort Cursor rule (`.cursor/rules/sk-vision.md`) + Devin drop-in note telling a text-only model to call `sk_vision_*` on an attached image.
- Unit tests for the classifier (incl. the modality signal) and the OpenCode await-vs-race behaviour.

### Out of Scope
- A hard guarantee on Cursor/Devin — MCP cannot see the model or force a tool call; the rule/note is best-effort by design.
- Eager session-start pre-warm (rejected: wastes VRAM on image-less sessions).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-vision/vision-runtime/src/model-modality.ts` | Create | Text-only classifier + allowlist + env overrides + declared-modality signal |
| `.opencode/skills/sk-vision/vision-runtime/src/model-modality.test.ts` | Create | Classifier unit tests (incl. modality) |
| `.opencode/skills/sk-vision/vision-runtime/src/opencode/attachments.ts` | Update | Gate the await on the classifier; injectable grace for tests |
| `.opencode/skills/sk-vision/vision-runtime/src/opencode/attachments.test.ts` | Create | Guarantee test (await vs race) |
| `.opencode/skills/sk-vision/hooks/pi/sk-vision.ts` | Update | Gate `inspectAttachedImages` on `ctx.model`; await for text-only |
| `.opencode/skills/sk-vision/hooks/cursor/vision-rule.md` | Create | Cursor best-effort rule (wired via `.cursor/rules/sk-vision.md`) |
| `.opencode/skills/sk-vision/hooks/devin/vision-rule.md` | Create | Devin best-effort drop-in note |

### Verification evidence
- `bun test src/model-modality.test.ts` — 5/5; `bun test src/opencode/attachments.test.ts` — 2/2 (text-only awaits past the grace; other models do not).
- `tsc --noEmit` exit 0; full suite 16/16; `bun run build` OK.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Text-only classifier | Listed families → true; unlisted → false; `SK_VISION_FORCE=1` forces true |
| REQ-002 | Guaranteed run (OpenCode) | For a listed model the injector awaits the full analysis; evidence present even when slower than the grace |
| REQ-003 | No regression for others | Non-listed models keep the non-blocking grace race |
| REQ-004 | Tested | Classifier + guarantee unit tests pass; `tsc` clean |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-P1 | Operator-editable list | Allowlist extendable without a rebuild via `SK_VISION_TEXT_ONLY_MODELS` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- [x] Classifier lands with the allowlist + env overrides. Evidence: `model-modality.ts`; 5 tests pass.
- [x] OpenCode injector gated to await for text-only models. Evidence: `attachments.ts` `guaranteed` branch.
- [x] Guarantee proven vs the grace. Evidence: `attachments.test.ts` 2/2.
- [x] No regression; types clean. Evidence: full suite 17/17; `tsc` exit 0.
- [x] Expanded to Pi + Cursor/Devin rules. Evidence: Pi `guaranteed` gate on `ctx.model`; `vision-rule.md` (cursor + devin).
- [ ] Changes committed on v4. Evidence: pending the commit.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Allowlist misses a text-only model | That model stays best-effort | Env override adds it without a rebuild; ship a comprehensive starter list |
| Risk | Awaiting blocks submit on first cold load | Slow first image | Paste-preload gives a head start; documented cost; no eager warm |
| Dependency | OpenCode SDK exposes `{providerID, modelID}` | Gate can't classify | Confirmed in the SDK type |
<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

### Answered Questions
- **Q**: Allowlist or denylist? **A**: Operator-curated **allowlist** (explicit) — only listed text-only models get the guarantee; unlisted fall back to best-effort.
- **Q**: How to handle cold-load latency? **A**: Await fully, leverage the existing paste-preload, no eager session-start pre-warm (VRAM courtesy).
- **Q**: Does Pi's message hook expose the active model? **A**: Yes — the `input` hook's `ctx.model` is `{provider, id, input}`. Pi gets real per-model gating; a declared non-image `input` is an authoritative text-only signal on top of the allowlist.

### Open Questions
- None. Cursor/Devin remain best-effort by design (MCP cannot force a tool call); a live text-only session with an image on each host is the end-to-end confirmation.
<!-- /ANCHOR:questions -->
