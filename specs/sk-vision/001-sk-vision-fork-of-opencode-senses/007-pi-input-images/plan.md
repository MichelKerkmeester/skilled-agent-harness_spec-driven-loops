---
title: "Implementation Plan: sk-vision 007 Pi input.images auto-inspect"
description: "Add a bounded on('input') handler to the Pi factory mirroring the OpenCode AttachmentInjector, then update README rows and prove session safety."
trigger_phrases:
  - "sk-vision input images"
  - "sk-vision pi auto-inspect"
  - "sk-vision attachment injector"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/007-pi-input-images"
    last_updated_at: "2026-08-16T12:00:00.000Z"
    last_updated_by: "pi"
    recent_action: "Created 007 plan skeleton."
    next_safe_action: "Implement per spec.md copy pack."
    blockers: []
    key_files:
      - "spec.md"
      - ".opencode/skills/sk-vision/pi/sk-vision.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-007-pi-input-images"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: sk-vision 007 Pi input.images auto-inspect

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript Pi extension factory |
| **Framework** | Pi 0.84.2 `on("input")` + `event.images` |
| **Storage** | Bounded in-memory evidence cache (~32 entries) |
| **Testing** | rg proofs; vision-runtime regression; `pi --offline --approve` |

### Overview
Mirror the OpenCode `AttachmentInjector` for Pi: bounded 2s preload on attached images, transform-injected evidence, silent continue on any failure. Read the installed pi docs + types first so the event shape is exact.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met — evidence: REQ-001..REQ-006 + REQ-P1..REQ-P3 satisfied; see `implementation-summary.md`
- [ ] Tests passing (if applicable) — evidence: rg proofs + `pi --offline --approve` + runtime regression
- [ ] Docs updated (spec/plan/tasks) — evidence: closeout refresh
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Event-hook adapter with bounded preload, mirroring the OpenCode injector.

### Key Components
- **input handler**: skips extension/steer traffic; races 2s vs analysis; caches per image key; transform-injects `<SK-VISION>` evidence.
- **shared client**: same RuntimeClient/PhotonProvider as the 13 tools.

### Data Flow
input(event.images) → cache hit? instant : race(analysis, 2s) → success: transform(text + evidence) | failure/timeout: continue.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| pi/sk-vision.ts | 13 tools only | add input hook | rg 'on("input")' |
| .pi/extensions/README.md | records P1 gap | remove gap wording | rg "not wired" exit 1 |
| vision-runtime | unchanged | regression | bun build+test |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Read
- [ ] Read attachments.ts injector + pi docs Input Events + input-transform examples
- [ ] Read installed `InputEvent` type for `images` shape

### Phase 2: Implement
- [ ] Add bounded input handler inside factory
- [ ] Add bounded cache; try/catch → continue

### Phase 3: Docs + verify
- [ ] Update .pi/extensions/README.md (remove gap note)
- [ ] rg proofs; bun regression; pi --offline --approve
- [ ] validate.sh --strict on this child
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static | handler presence, gap note | rg |
| Regression | runtime untouched | bun build + test |
| Integration | extension loads | pi --offline --approve |
| Manual | input with attached image | Live TUI smoke (record PASS/SKIP) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 005 factory + symlink | Internal | Shipped | No host to extend |
| Pi 0.84.2 input event | External | Installed | No event.images contract |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Session fail-closed, blocked input, or unbounded awaits in review.
- **Procedure**: Remove the input handler block from pi/sk-vision.ts; restore README rows; rerun `pi --offline --approve`. Do not touch `context/`.
<!-- /ANCHOR:rollback -->
