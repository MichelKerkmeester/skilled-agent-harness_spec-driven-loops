---
title: "Feature Specification: Phase 12: sk-vision-v2-prompt-hook"
description: "sk-vision's automatic image check runs on OpenCode 1 through `chat.message`, which the OpenCode 2 loader never calls, so on OpenCode 2 a pasted image reaches a text-only model with no evidence. This phase moves the check onto OpenCode 2's `session.hook(\"prompt\")`."
trigger_phrases:
  - "sk vision v2 prompt hook"
  - "phase 12 sk vision v2 prompt hook"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 12: sk-vision-v2-prompt-hook

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-19 |
| **Branch** | `scaffold/012-sk-vision-v2-prompt-hook` |
| **Parent Spec** | ../spec.md |
| **Phase** | 12 of 12 |
| **Predecessor** | 011-two-version-proof-and-closeout |
| **Successor** | None |
| **Handoff Criteria** | With `SK_VISION_AUTOINSPECT=1`, a prompt with an attached image on OpenCode 2.0.32 carries sk-vision evidence, OpenCode 1 behaviour is unchanged, every touched suite is at or above its baseline and recursive strict validation prints `RESULT: PASSED`. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 12** of the OpenCode v1 and v2 dual compatibility packet. It closes the closeout's known limitation 5.

**Scope Boundary**: The sk-vision runtime source (`vision-runtime/src/plugin.ts`, `src/opencode/attachments.ts` and `src/plugin.test.ts`), its rebuilt bundle, the two docs that describe the OpenCode 2 gap, and this packet's records.

**Dependencies**:
- Phase 3 gave sk-vision its OpenCode 2 `setup` entry and the `/vision` prompt hook this phase extends.
- OpenCode 2.0.32's `@opencode/plugin` types: `SessionPrompt` and `session.get`.

**Deliverables**:
- An OpenCode 2 prompt hook that runs the automatic image check when `SK_VISION_AUTOINSPECT=1`.
- Unit tests for the new path and a live run on a private OpenCode 2 server.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
On OpenCode 1, sk-vision's `server` entry registers a `chat.message` hook when `SK_VISION_AUTOINSPECT=1`. The hook analyses each attached image and adds a text part with the evidence. OpenCode 2 calls the plugin's `setup` entry instead, and that entry registers only the `/vision` command and its template hook. A text-only model on OpenCode 2 therefore gets a pasted image with no evidence at all.

### Purpose
With automatic inspection turned on, a prompt with an attached image carries the same sk-vision evidence on OpenCode 2 as on OpenCode 1.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Extract the evidence assembly from `AttachmentInjector.handle` into `evidenceText`, which both hosts call.
- Register the OpenCode 2 prompt hook when a vision template exists or automatic inspection is on, and append the evidence to the mutable prompt text.
- Read the session's model through `session.get`, so a text-only model waits for the full analysis as it does on OpenCode 1.
- Unit tests, the rebuilt bundle, the plugin README and the injection contract.

### Out of Scope
- Registering the 13 `sk_vision_*` tools on OpenCode 2. The `setup` entry has never registered them, and the bridge does not wrap sk-vision. It is a separate gap.
- The paste-time preload through `message.part.updated`. OpenCode 2 runs the analysis when the prompt is submitted.
- The server-side toast. Research marks it irreducible on OpenCode 2.
- Any change to the OpenCode 1 `chat.message` behaviour.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-vision/vision-runtime/src/opencode/attachments.ts` | Modify | Extract `evidenceText` from `handle` |
| `.skilled/skills/sk-vision/vision-runtime/src/plugin.ts` | Modify | The OpenCode 2 automatic inspection through the prompt hook |
| `.skilled/skills/sk-vision/vision-runtime/src/plugin.test.ts` | Modify | Four tests for the new path |
| `.skilled/skills/sk-vision/vision-runtime/dist/plugin.js` | Build output | Rebuilt by `bun run build`. The folder is gitignored |
| `.opencode/plugins/README.md` | Modify | The OpenCode 2 gap paragraph |
| `.skilled/hooks/injection-contract.md` | Modify | The per-runtime channel for sk-vision evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | With `SK_VISION_AUTOINSPECT=1`, the OpenCode 2 prompt hook appends sk-vision evidence to a prompt that carries an image or PDF file. |
| REQ-002 | OpenCode 1's `chat.message` behaviour is unchanged, and the v1 doctor battery still passes. |
| REQ-003 | Without `SK_VISION_AUTOINSPECT=1`, OpenCode 2 starts no vision runtime and changes no prompt outside the `/vision` template. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | A prompt that matches the vision template keeps the command path and is not inspected twice. |
| REQ-005 | Any failure leaves the prompt unchanged and never blocks the turn. |
| REQ-006 | Every touched suite is at or above its baseline, and the docs that describe the gap say what now holds. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A live run on a private OpenCode 2.0.32 server with automatic inspection on stores a user message that contains an `<SK-VISION` block, and the same run with it off does not.
- **SC-002**: The sk-vision suite rises by the four new tests with zero failures, and the plugin and v2 suites hold their counts.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | OpenCode 2.0.32's `SessionPrompt` keeps `prompt` mutable | Without it the evidence never reaches the model | Read from the published `@opencode/plugin` 2.0.32 types and proved by the live run |
| Risk | A text-only model waits for a cold vision runtime before the turn starts | Med | Same trade as OpenCode 1, which awaits for listed text-only models. Other models keep the 2-second grace |
| Risk | The evidence names `sk_vision_*` tools that OpenCode 2 does not register | Low | Recorded as an open gap. The evidence text itself still answers the image |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: A model not on the text-only list waits at most the 2-second grace before its turn starts.
- **NFR-P02**: With automatic inspection off, the prompt hook adds no work beyond the template match.

### Security
- **NFR-S01**: The hook reads only the attached files OpenCode hands it, and writes only its own temp copies of inline images.
- **NFR-S02**: No secret or server password appears in any log or proof file.

### Reliability
- **NFR-R01**: Every failure path fails open and leaves the prompt as typed.
- **NFR-R02**: Disposal closes the vision runtime the hook started.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a prompt with no files returns before any analysis.
- Maximum length: the analysis cache keeps at most 32 images, as on OpenCode 1.
- Invalid format: a file whose mime is not an image or PDF is skipped, and a malformed `file://` uri fails open.

### Error Scenarios
- External service failure: the vision runtime failing yields the notice block, or nothing, and the prompt still goes through.
- Network timeout: `session.get` failing means no model, so the bounded grace applies.
- Concurrent access: concurrent analysis of one image is deduplicated by the existing in-flight map.

### State Transitions
- Partial completion: an image still being analysed after the grace gets only its path note.
- Session expiry: not applicable. The hook reads the session once per prompt.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Three source files and two docs, about 250 lines |
| Risk | 8/25 | A plugin API change on one host, behind an opt-in flag |
| Research | 6/20 | The v2 hook shape had to be read from the published types |
| **Total** | **22/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should OpenCode 2 also register the `sk_vision_*` tools through `ctx.tool.transform`? Out of scope here, recorded as a gap.
<!-- /ANCHOR:questions -->

---
