---
title: "Implementation Plan: Guaranteed vision for text-only models"
description: "Classifier + OpenCode injector gate now; Pi and Cursor/Devin rules as follow-on phases."
trigger_phrases:
  - "sk-vision guaranteed vision plan"
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
      - "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/019-guaranteed-vision-for-text-only-models/plan.md"
      - ".opencode/skills/sk-vision/hooks/pi/sk-vision.ts"
      - ".opencode/skills/sk-vision/hooks/cursor/vision-rule.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-019-guaranteed-vision"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Guaranteed vision for text-only models

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (vision-runtime) |
| **Framework** | sk-vision in-process host adapters (OpenCode first) |
| **Storage** | `vision-runtime/src/model-modality.ts`, `src/opencode/attachments.ts` |
| **Testing** | `bun test`; `tsc --noEmit`; injectable grace for fast timing tests |

### Overview
A shared classifier decides if the active model is text-only; the OpenCode injector awaits the full analysis for those models and keeps the non-blocking grace for the rest. Pi and Cursor/Devin follow once the OpenCode path is proven.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Model shape confirmed on OpenCode. Evidence: SDK type `{providerID, modelID}`.
- [x] Policy chosen. Evidence: operator allowlist; await-fully, no eager pre-warm.

### Definition of Done
- [x] OpenCode cut lands + proven. Evidence: `implementation-summary.md` Verification.
- [x] Pi + Cursor/Devin expansion. Evidence: Pi `guaranteed` gate; `vision-rule.md` (cursor + devin).
- [ ] Changes committed on v4. Evidence: pending the commit.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A single shared classifier (`isTextOnlyModel`) that every in-process adapter can call; the adapter changes only its await policy based on the verdict. Config is a built-in allowlist plus env overrides so no rebuild is needed to extend it.

### Key Components
- **`model-modality.ts`** — the allowlist + `isTextOnlyModel({providerID, modelID}, env)`.
- **`attachments.ts`** — reads `input.model`, awaits fully when text-only, injectable `graceMs` for tests.

### Data Flow
message submit → `handle(input)` reads `input.model` → `isTextOnlyModel` → await full analysis (text-only) or grace race (else) → `<SK-VISION>` block injected.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Classifier + OpenCode gate (done)
- [x] Add `model-modality.ts` + tests; gate `attachments.ts`; prove await-vs-race. Evidence: 17/17 tests; `tsc` 0.

### Phase 2: Pi (done)
- [x] Pi's `input` hook exposes `ctx.model` (`{provider, id, input}`); gate `inspectAttachedImages` to await for a text-only model. Evidence: `sk-vision.ts` `guaranteed` gate; declared non-image `input` is authoritative.

### Phase 3: Cursor/Devin rules (done)
- [x] Ship a `.cursor/rules` rule + Devin drop-in note telling a text-only model to call `sk_vision_*` on an image. Evidence: `cursor/vision-rule.md` (wired via `.cursor/rules/sk-vision.md`), `devin/vision-rule.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | classifier verdicts | `model-modality.test.ts` |
| Behaviour | await vs grace race | `attachments.test.ts` (injected `graceMs`) |
| Types | compiles | `tsc --noEmit` |
| Build | dist emits | `bun run build` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| OpenCode SDK model shape | External | Available | Gate cannot classify |
| Existing paste-preload | Internal | Available | Cold-load blocks submit longer |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The await path blocks submit too long, or the classifier misfires.
- **Procedure**: Revert the `guaranteed` branch in `attachments.ts` (restores the unconditional grace race) and remove `model-modality.ts`. The classifier is isolated, so a revert restores prior behaviour with no other change.
<!-- /ANCHOR:rollback -->
