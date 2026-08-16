---
title: "Feature Specification: sk-vision Pi extension factory"
description: "Author the function default-export factory at .opencode/skills/sk-vision/pi/sk-vision.ts with 13 pi.registerTool calls. Do not symlink yet."
trigger_phrases:
  - "sk-vision pi factory"
  - "sk-vision registerTool"
  - "sk-vision ExtensionFactory"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/005-pi-adapter/001-extension-factory"
    last_updated_at: "2026-08-16T10:30:00.000Z"
    last_updated_by: "markdown-agent"
    recent_action: "Closed out factory delivery; validate.sh --strict on this child."
    next_safe_action: "002-symlink-and-dry-factory"
    blockers: []
    key_files:
      - "spec.md"
      - ".opencode/skills/sk-vision/pi/sk-vision.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-001-sk-vision-fork-of-opencode-senses-005-pi-adapter-001-extension-factory"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: sk-vision Pi extension factory

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
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-16 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 2 |
| **Predecessor** | None |
| **Successor** | 002-symlink-and-dry-factory |
| **Handoff Criteria** | Owner file exists. Default export is a function. 13 tools registered. client.close() on shutdown. No file in .pi/extensions/ yet. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of `005-pi-adapter`.

**Scope Boundary**: Owner TypeScript only. No symlink. No object/class/promise default export.

**Dependencies**:
- 003 RuntimeClient / PhotonProvider exist.

**Deliverables**:
- .opencode/skills/sk-vision/pi/sk-vision.ts

**Changelog**:
- When this phase closes, refresh the matching file in the parent changelog using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Pi has no owner-tree factory, so a later symlink would have nothing legal to load.

### Purpose
Write a function default export that registers 13 tools and closes the client.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create pi/sk-vision.ts
- Function default export
- 13 registerTool names
- Close client on session_shutdown or documented substitute

### Out of Scope
- Putting a real file in .pi/extensions/ — next child uses a relative symlink
- MCP or bash JSON-RPC as the primary path
- Object, class instance, or promise default export
- Inventing sk_vision_query
- Treating 004 as a compile-time import

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-vision/pi/sk-vision.ts` | Create | Owner factory |

### Implementer copy pack (follow exactly)

Stop and report if any of these is true: 003 has no RuntimeClient / PhotonProvider; you are about to put a real file in `.pi/extensions/`; you are about to default-export an object, class instance, or promise; you are about to invent `sk_vision_query`.

Analog default export: `.pi/extensions/git-preflight-advisory.ts` owner file `export default function gitPreflightAdvisory(pi: ExtensionAPI): void`. Confirmed: invalid default export fail-closes the whole Pi session.

Pi types: `@earendil-works/pi-coding-agent`. `registerTool` plus optional `InputEvent.images`.

Create `.opencode/skills/sk-vision/pi/sk-vision.ts`. Default export MUST be a function `ExtensionFactory`: `(pi: ExtensionAPI) => void`. Keep it tiny. Construct `RuntimeClient` + `PhotonProvider` from 003. Register all 13 tools. Close the client on `session_shutdown` (prove the event name against installed 0.84.2 types; if different, document the substitute).

Skeleton (fill execute bodies from dump `context/src/opencode/tools.ts` via PhotonProvider; do not spawn a second Python wrapper):

```typescript
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { RuntimeClient } from "../vision-runtime/src/runtime/client.ts";
import { PhotonProvider } from "../vision-runtime/src/providers/photon.ts";

export default function skVision(pi: ExtensionAPI): void {
  const client = new RuntimeClient();
  const provider = new PhotonProvider(client, { projectDir: pi.cwd ?? process.cwd() });

  // Register each of the 13 names with pi.registerTool. Map:
  // sk_vision_inspect  -> caption+scene+ocr, or query when question is set
  // sk_vision_detect   -> provider.detect
  // sk_vision_point    -> provider.point
  // sk_vision_ocr      -> provider.ocr
  // sk_vision_status   -> provider.health
  // sk_vision_segment  -> provider.segment
  // sk_vision_metadata -> provider.metadata
  // sk_vision_crop     -> provider.crop
  // sk_vision_zoom     -> provider.zoom
  // sk_vision_colors   -> provider.colors
  // sk_vision_diff     -> provider.diff
  // sk_vision_annotate -> provider.annotate
  // sk_vision_reverse  -> provider reverse / hashSearch
  // Do not register sk_vision_query.

  pi.on("session_shutdown", async () => {
    await client.close();
  });
}
```

Adjust import paths if 003 emits only `dist/` (prefer the same modules 004 imports). `PhotonProvider` constructor args must match 003 after rebrand. If `pi.cwd` is not on 0.84.2 `ExtensionAPI`, use the documented context field from installed types.

Fail-closed rules (any one of these fail-closes Pi — do not ship them):

- missing default export
- default export is not a function
- thrown error during factory load (outside a tool execute try/catch)

Tool execute may fail with `SK_VISION_ERROR`; that must not crash session start.

Close this child with:

```bash
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/sk-vision/001-sk-vision-fork-of-opencode-senses/005-pi-adapter/001-extension-factory --strict
```
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Function default export | export default function ... |
| REQ-002 | 13 sk_vision_* tools; no sk_vision_query | registerTool list |
| REQ-003 | client.close() on shutdown | session_shutdown or documented substitute |
| REQ-004 | No .pi/extensions file yet | next child owns the symlink |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-P1 | No extra scope | Files outside Files to Change stay untouched |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- [x] Owner file exists — evidence: `test -f .opencode/skills/sk-vision/pi/sk-vision.ts` exit 0 (404 lines)
- [x] Default export is a function — evidence: `rg 'export default function skVision' .opencode/skills/sk-vision/pi/sk-vision.ts` exit 0
- [x] 13 tools named; no sk_vision_query — evidence: `rg -c 'pi\.registerTool'`=13; `rg sk_vision_query` exit 1
- [x] This child validate.sh --strict exits 0 — evidence: see `implementation-summary.md` verification table
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Object default export fail-closes Pi | High | Function-only skeleton |
| Risk | Second Python wrapper | High | Reuse 003 PhotonProvider |
| Dependency | 003 core | High | Stop if RuntimeClient missing |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

### Answered Questions
- **Q**: MCP primary path? **A**: No. Native registerTool is the path.

### Open Questions
- None.
<!-- /ANCHOR:questions -->
