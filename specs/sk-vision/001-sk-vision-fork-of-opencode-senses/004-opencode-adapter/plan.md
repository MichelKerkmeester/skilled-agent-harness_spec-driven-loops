---
title: "Implementation Plan: sk-vision 004 opencode adapter"
description: "Wire sk-vision to OpenCode plugins directory and configure image auto-inspection."
trigger_phrases:
  - "sk-vision opencode plan"
  - "sk-vision plugin plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/004-opencode-adapter"
    last_updated_at: "2026-08-16T07:10:00.000Z"
    last_updated_by: "cursor-grok"
    recent_action: "Pointed plan at re-export copy pack and analog file."
    next_safe_action: "Wait for 003 dist/plugin.js; then author plugin."
    blockers: []
    key_files:
      - "plan.md"
      - "spec.md"
      - ".opencode/plugins/sk-vision.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-004-opencode-20260815"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: sk-vision 004 opencode adapter

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript / TypeScript |
| **Framework** | OpenCode Plugin Architecture |
| **Storage** | Plugin registry file |
| **Testing** | OpenCode runtime verification, `validate.sh` |

### Overview
Create `.opencode/plugins/sk-vision.js` as a **real file** (not a symlink), analog to `.opencode/plugins/mk-communication-projection.js`. Import `../skills/sk-vision/vision-runtime/dist/plugin.js`. Restore dump hooks `event`, `chat.message`, `tool`, `dispose`. Auto-inspect waits at most 2000ms and never awaits the full GPU run. Register the 13 dump `sk_vision_*` tools. Do not add a repo-root `opencode.json` plugin array.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Verification Command | Threshold |
|------|----------------------|-----------|
| **Plugin Real-File Check** | `test -f .opencode/plugins/sk-vision.js && test ! -L .opencode/plugins/sk-vision.js` | Regular file |
| **Plugin Export Check** | Analog: `mk-communication-projection.js` importing skill `dist/` | Same pattern |
| **README Verification** | Check `.opencode/plugins/README.md` entry | Row present |
| **No plugin array** | `rg -n 'plugin' opencode.json` | No new sk-vision plugin array |
| **Packet Validation** | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/sk-vision/001-sk-vision-fork-of-opencode-senses/004-opencode-adapter --strict` | Exit 0 |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

```
.opencode/
├── plugins/
│   ├── sk-vision.js          # Real file re-exporting plugin factory
│   └── README.md             # Plugin registration documentation
└── skills/
    └── sk-vision/
        └── vision-runtime/
            └── dist/
                └── plugin.js # Target compiled plugin
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## 4. AFFECTED SURFACES

| Surface | Path | Action |
|---------|------|--------|
| **Plugin Loader** | `.opencode/plugins/sk-vision.js` | Create real file |
| **Plugin Registry** | `.opencode/plugins/README.md` | Update table |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 5. IMPLEMENTATION PHASES

### Phase 1: Setup
- Verify `003-runtime-fork` build artifact `dist/plugin.js` is present.
- Inspect `.opencode/plugins/` directory structure.

### Phase 2: Plugin Adapter Creation
Follow `spec.md` Implementer copy pack. Do not symlink. Do not edit `opencode.json`.
- Author `.opencode/plugins/sk-vision.js` as the documented re-export of `vision-runtime/dist/plugin.js`.
- Keep dump hooks via that factory: `event`, `chat.message` (2s grace), `tool` (13 names), `dispose`.
- Update `.opencode/plugins/README.md` with the inventory row from the copy pack.

### Phase 3: Verification
- Verify OpenCode plugin discovery.
- Run `validate.sh` on this spec packet.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 6. TESTING STRATEGY

- [ ] Verify `.opencode/plugins/sk-vision.js` is a regular file (`test ! -L`) analog to `mk-communication-projection.js`.
- [ ] Verify the 13 dump tools register: `sk_vision_inspect`, `sk_vision_detect`, `sk_vision_point`, `sk_vision_ocr`, `sk_vision_status`, `sk_vision_segment`, `sk_vision_metadata`, `sk_vision_crop`, `sk_vision_zoom`, `sk_vision_colors`, `sk_vision_diff`, `sk_vision_annotate`, `sk_vision_reverse`.
- [ ] Verify auto-inspect injects `<SK-VISION>` within 2000ms and never awaits the full GPU run.
- [ ] Verify repo-root `opencode.json` gained no `plugin` array for this skill.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 7. DEPENDENCIES

| Dependency | Purpose | Status |
|------------|---------|--------|
| `003-runtime-fork` | Provides `dist/plugin.js` | Predecessor |
| OpenCode Plugin System | Loads plugins from `.opencode/plugins/` | Built-in |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 8. ROLLBACK PLAN

Remove `.opencode/plugins/sk-vision.js` and revert changes to `.opencode/plugins/README.md`.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## 9. PHASE DEPENDENCIES

- `003-runtime-fork` -> `004-opencode-adapter` -> `005-pi-adapter`
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## 10. ESTIMATED EFFORT

| Task Group | Effort |
|------------|--------|
| Plugin file authoring | 15 mins |
| README registration | 10 mins |
| Verification & validation | 15 mins |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## 11. ENHANCED ROLLBACK PROTOCOL

1. Delete `.opencode/plugins/sk-vision.js`.
2. Remove `sk-vision.js` row from `.opencode/plugins/README.md`.
<!-- /ANCHOR:enhanced-rollback -->
