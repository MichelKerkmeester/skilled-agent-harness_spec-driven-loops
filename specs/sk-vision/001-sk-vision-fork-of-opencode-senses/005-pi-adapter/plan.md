---
title: "Implementation Plan: sk-vision 005 pi adapter"
description: "Author native Pi extension in skill directory and create relative symlink in .pi/extensions/."
trigger_phrases:
  - "sk-vision pi plan"
  - "sk-vision extension plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/005-pi-adapter"
    last_updated_at: "2026-08-15T17:45:00.000Z"
    last_updated_by: "cursor-grok"
    recent_action: "Named analog, 13 tools, and fail-closed dry factory."
    next_safe_action: "Wait for 003 core; then author pi/sk-vision.ts."
    blockers: []
    key_files:
      - "plan.md"
      - "spec.md"
      - ".opencode/skills/sk-vision/pi/sk-vision.ts"
      - ".pi/extensions/sk-vision.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-005-pi-20260815"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: sk-vision 005 pi adapter

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js |
| **Framework** | CLI Pi Extension Architecture (`@mariozechner/pi-coding-agent`) |
| **Storage** | Extension symlink |
| **Testing** | `pi --offline --approve`, `validate.sh` |

### Overview
Author `.opencode/skills/sk-vision/pi/sk-vision.ts` as an `ExtensionFactory` default export. Create a relative symlink `.pi/extensions/sk-vision.ts` → `../../.opencode/skills/sk-vision/pi/sk-vision.ts`, analog to `git-preflight-advisory.ts`. Register the 13 dump `sk_vision_*` tools via `pi.registerTool`. Invalid default export fail-closes the Pi session. Optional P1: bounded `input.images` with 2s grace. `004` is not a code dependency.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Verification Command | Threshold |
|------|----------------------|-----------|
| **Symlink Resolution** | `readlink .pi/extensions/sk-vision.ts` | `../../.opencode/skills/sk-vision/pi/sk-vision.ts` |
| **Analog Check** | Compare to `.pi/extensions/git-preflight-advisory.ts` | Same relative-symlink pattern |
| **Dry Factory** | `pi --offline --approve` | Starts without extension fail-closed |
| **README Verification** | Check `.pi/extensions/README.md` entry | Row present |
| **Packet Validation** | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/sk-vision/001-sk-vision-fork-of-opencode-senses/005-pi-adapter --strict` | Exit 0 |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

```
.pi/
└── extensions/
    ├── sk-vision.ts          # Symlink -> ../../.opencode/skills/sk-vision/pi/sk-vision.ts
    └── README.md             # Extension documentation table

.opencode/skills/sk-vision/
└── pi/
    └── sk-vision.ts          # Native Pi extension factory implementation
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## 4. AFFECTED SURFACES

| Surface | Path | Action |
|---------|------|--------|
| **Pi Source** | `.opencode/skills/sk-vision/pi/sk-vision.ts` | Create |
| **Pi Symlink** | `.pi/extensions/sk-vision.ts` | Create symlink |
| **Pi Registry** | `.pi/extensions/README.md` | Update table |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 5. IMPLEMENTATION PHASES

### Phase 1: Setup
- Create `.opencode/skills/sk-vision/pi/` directory.
- Verify Pi extension directory `.pi/extensions/`.

### Phase 2: Extension Authoring & Symlinking
- Author `.opencode/skills/sk-vision/pi/sk-vision.ts` implementing `ExtensionFactory`.
- Create relative symlink `.pi/extensions/sk-vision.ts`.
- Update `.pi/extensions/README.md`.

### Phase 3: Verification
- Verify Pi loads the extension without crash.
- Run `validate.sh` on this spec packet.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 6. TESTING STRATEGY

- [ ] Check symlink target via `test -L` and `readlink` equals `../../.opencode/skills/sk-vision/pi/sk-vision.ts`.
- [ ] Verify `pi.registerTool` for the 13 dump names; no `sk_vision_query`.
- [ ] Verify `pi --offline --approve` starts without fail-closed.
- [ ] Verify `session_shutdown` (or documented 0.84.2 substitute) closes the client.
- [ ] Optional: `input.images` 2s grace, or record the unproven-paste gap.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 7. DEPENDENCIES

| Dependency | Purpose | Status |
|------------|---------|--------|
| `003-runtime-fork` | Provides core provider & client | Predecessor |
| Pi Extension API | Type definitions & lifecycle hooks | Installed |
| `004-opencode-adapter` | Name/envelope alignment only | Not a code dependency |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 8. ROLLBACK PLAN

Delete `.pi/extensions/sk-vision.ts` symlink, delete `.opencode/skills/sk-vision/pi/sk-vision.ts`, and revert `.pi/extensions/README.md`.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## 9. PHASE DEPENDENCIES

- `003-runtime-fork` -> `005-pi-adapter`. `004-opencode-adapter` is sequencing for name alignment, not a compile-time dependency.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## 10. ESTIMATED EFFORT

| Task Group | Effort |
|------------|--------|
| Extension authoring | 20 mins |
| Symlink & README setup | 10 mins |
| Verification & validation | 15 mins |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## 11. ENHANCED ROLLBACK PROTOCOL

1. Remove `.pi/extensions/sk-vision.ts`.
2. Remove `.opencode/skills/sk-vision/pi/`.
3. Revert changes to `.pi/extensions/README.md`.
<!-- /ANCHOR:enhanced-rollback -->
