---
title: "Tasks: sk-vision Pi extension factory"
description: "Executable tasks for sk-vision Pi extension factory."
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
    recent_action: "Marked T001–T008 complete with copy-pack evidence."
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
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: sk-vision Pi extension factory

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm RuntimeClient and PhotonProvider exist — evidence: `test -f .opencode/skills/sk-vision/vision-runtime/src/runtime/client.ts && test -f .opencode/skills/sk-vision/vision-runtime/src/providers/photon.ts` exit 0
- [x] T002 Read analog git-preflight-advisory.ts default export — evidence: pattern confirmed `export default function gitPreflightAdvisory(pi: ExtensionAPI): void` in `.pi/extensions/git-preflight-advisory.ts` owner tree
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Write `.opencode/skills/sk-vision/pi/sk-vision.ts` — evidence: file exists (404 lines); imports RuntimeClient, PhotonProvider from vision-runtime/src
- [x] T004 Register 13 tools; do not register sk_vision_query — evidence: `rg -c 'pi\.registerTool'`=13; names inspect detect point ocr status segment metadata crop zoom colors diff annotate reverse; `rg sk_vision_query` exit 1
- [x] T005 Close client on shutdown — evidence: `pi.on("session_shutdown", async () => { await client.close(); })` at line 401
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Confirm default export is a function — evidence: `rg 'export default function skVision' .opencode/skills/sk-vision/pi/sk-vision.ts` exit 0
- [x] T007 Confirm .pi/extensions/sk-vision.ts does not exist yet — evidence: orchestrator gate `test ! -e .pi/extensions/sk-vision.ts` at factory delivery; symlink owned by child 002
- [x] T008 Run validate.sh --strict on this child — evidence: post-closeout run recorded in `implementation-summary.md`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
