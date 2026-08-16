---
title: "Feature Specification: sk-vision 005 pi adapter"
description: "Author ExtensionFactory at .opencode/skills/sk-vision/pi/sk-vision.ts, relative-symlink it into .pi/extensions/, register 13 sk_vision_* tools, and optionally bound pi.on(input) image handling."
trigger_phrases:
  - "sk-vision pi adapter"
  - "sk-vision pi extension"
  - "sk-vision pi registerTool"
  - "pi vision tools"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/005-pi-adapter"
    last_updated_at: "2026-08-15T16:55:00.000Z"
    last_updated_by: "cursor-grok"
    recent_action: "Enriched Pi fail-closed, 13-tool, and symlink analog contracts."
    next_safe_action: "Author pi/sk-vision.ts and relative symlink after 003 core exists."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - ".opencode/skills/sk-vision/pi/sk-vision.ts"
      - ".pi/extensions/sk-vision.ts"
      - ".pi/extensions/README.md"
      - ".pi/extensions/git-preflight-advisory.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-005-pi-20260815"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Skill owns the source file; .pi/extensions/ holds a relative symlink."
      - "Primary path is pi.registerTool, not MCP or bash JSON-RPC."
---
# Feature Specification: sk-vision 005 pi adapter

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-08-15 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 5 of 5 |
| **Predecessor** | `003-runtime-fork` (code). `004-opencode-adapter` is not a code dependency; run 005 after 004 so tool names and evidence tags stay aligned. |
| **Successor** | None. Parent epic is then ready for operator use on both hosts. |
| **Handoff Criteria** | `pi --offline --approve` starts without extension fail-closed. Model sees `sk_vision_*` tools. Relative symlink resolves. Optional `input.images` hook is bounded or the gap is recorded. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Pi loads `*.ts` from `.pi/extensions/` and fail-closes the whole session if the default export is invalid. MCP wrappers and bash JSON-RPC are fallbacks, not the native path. Without an `ExtensionFactory` that calls `pi.registerTool`, Pi models only see read/bash/edit/write/grep/find/ls.

### Purpose
Give Pi the same local vision tools as OpenCode through `ExtensionAPI.registerTool`, using the 003 RuntimeClient, with a relative symlink that matches every other extension in this repo.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Author `.opencode/skills/sk-vision/pi/sk-vision.ts` as an `ExtensionFactory` default export.
- Create relative symlink `.pi/extensions/sk-vision.ts` → `../../.opencode/skills/sk-vision/pi/sk-vision.ts`. Analog: `git-preflight-advisory.ts` → `../../.opencode/skills/sk-git/scripts/hooks/pi/git-preflight-advisory.ts`. `.pi/SYNC.md` already describes this pattern; do not invent a new sync mechanism.
- Add a row to `.pi/extensions/README.md`.
- Register the same 13 `sk_vision_*` tools as 003/004. Each tool calls PhotonProvider / RuntimeClient. No extra subprocess wrapper.
- Optional P1 auto-inspect: `pi.on("input")` when `InputEvent.images` is present. Confirmed Pi 0.84.2 shape: `images?: ImageContent[]` with `{type, data, mimeType}`. Mirror the 2s grace. Never block the full GPU run. If live image paste is unproven, record that gap and still close on tools.
- Close the client on `session_shutdown` (inferred from Pi lifecycle; prove against 0.84.2 types or document the substitute event).

### Out of Scope
- MCP server, bash JSON-RPC, or SKILL.md-only as the **primary** adapter (those remain fallbacks only).
- Changing core RPC or Python runtime.
- npm publish.
- Making 004 a compile-time dependency.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-vision/pi/sk-vision.ts` | Create | Owner factory |
| `.pi/extensions/sk-vision.ts` | Create | Relative symlink |
| `.pi/extensions/README.md` | Modify | Inventory row |

### Tool names (must match 003/004)

`sk_vision_inspect`, `sk_vision_detect`, `sk_vision_point`, `sk_vision_ocr`, `sk_vision_status`, `sk_vision_segment`, `sk_vision_metadata`, `sk_vision_crop`, `sk_vision_zoom`, `sk_vision_colors`, `sk_vision_diff`, `sk_vision_annotate`, `sk_vision_reverse`.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### Functional Requirements
- **REQ-001**: Placement: owner file at `.opencode/skills/sk-vision/pi/sk-vision.ts`; `.pi/extensions/sk-vision.ts` is a relative symlink (`readlink` equals `../../.opencode/skills/sk-vision/pi/sk-vision.ts`).
- **REQ-002**: Tools: `pi.registerTool` for all 13 `sk_vision_*` names. Model must see them, not only the built-in file tools.
- **REQ-003**: Bridge: tools MUST call the 003 PhotonProvider / RuntimeClient. No bash JSON-RPC primary path.
- **REQ-004**: Fail-closed safety: default export MUST be a valid `ExtensionFactory`. Invalid export fail-closes the Pi session (confirmed by cli-pi pin / 001-research).
- **REQ-005**: Shutdown: register a lifecycle handler that calls `client.close()`, or document why the 0.84.2 API uses a different event name.
- **REQ-006**: README: `.pi/extensions/README.md` MUST list `sk-vision.ts` and the owner path.

### Non-Functional Requirements
- **NFR-001**: Symlink is relative, not absolute.
- **NFR-002**: Startup MUST NOT block on model `load`. Pre-warm is optional.
- **NFR-003**: Path-tool execute is proven when GPU is present. If 003 SKIP, close on registration plus a dry factory test (`pi --offline --approve` starts).
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- [ ] `test -f .opencode/skills/sk-vision/pi/sk-vision.ts`
- [ ] `test -L .pi/extensions/sk-vision.ts` and `readlink` is the relative owner path
- [ ] README row exists
- [ ] `pi --offline --approve` starts without extension fail-closed
- [ ] Registered tool names match the 13-name list
- [ ] Auto-inspect is implemented with a 2s bound, or the unproven-paste gap is recorded in implementation-summary
- [ ] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/sk-vision/001-sk-vision-fork-of-opencode-senses/005-pi-adapter --strict` exits 0
- [ ] Parent `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/sk-vision/001-sk-vision-fork-of-opencode-senses --recursive --strict` exits 0 after this child closes
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk / Assumption | Impact | Mitigation |
|-------------------|--------|------------|
| Invalid default export | High | Fail-closes entire Pi session; keep factory tiny and typed |
| Absolute symlink | High | Match `git-preflight-advisory.ts` relative form |
| `input` handler blocks send | High | 2s grace; tools still work on paths if auto-inspect is skipped |
| `session_shutdown` name drift | Medium | Prove against installed 0.84.2 types; document substitute |
| GPU absent | Medium | Close on registration + dry factory; SKIP live execute |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

### Answered Questions
- **Q**: Real file or symlink in `.pi/extensions/`?
  - **A**: Relative symlink to the skill owner file (ADR-001, ADR-003, `.pi/extensions/README.md`).
- **Q**: MCP / bash as primary?
  - **A**: No. `registerTool` is primary. MCP/bash/skill-only stay fallbacks inside this child, not a sixth phase.

### Open Questions
- Live image-paste auto-inspect on Pi may stay unproven in this environment. If so, record the gap and still close on tool registration.
<!-- /ANCHOR:questions -->
