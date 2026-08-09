---
title: "Tasks: OpenCode Directive Single-Source"
description: "Completed task record for canonical three-directive bridge composition and complete local fallback verification."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "OpenCode directive single source tasks"
  - "OpenCode bridge parity tasks"
importance_tier: "high"
contextType: "tasks"
parent: "hooks/002-injection-bloat-reduction"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/016-opencode-directive-single-source"
    last_updated_at: "2026-08-09T14:52:52Z"
    last_updated_by: "sol"
    recent_action: "Reconciled OpenCode directive single-source delivery"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs"
      - ".opencode/skills/system-skill-advisor/mcp-server/lib/render.ts"
      - ".opencode/skills/system-skill-advisor/mcp-server/tests/compat/plugin-bridge.vitest.ts"
    session_dedup:
      fingerprint: "sha256:b9425e091d08958f7dfa38abcb173c47f10d027fb90cc069b58020f4ebd9c36d"
      session_id: null
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: OpenCode Directive Single-Source

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- Every checked task entry cites the completed implementation or verification evidence.
- T-NNN identifiers will remain stable within this packet.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-001 Read and record the bridge fallback, canonical renderer, compat export, and current bridge test seams, including the cited line ranges for the two-of-three drift. Evidence: `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs`; 9 bridge tests and 13 negative-controls passed, `node --check` was clean, and grep found the third directive.
- [x] T-002 Define the exact shared-source contract: unchanged label, unchanged three directive strings, unchanged order, newline behavior, and build/runtime loading requirements. Evidence: `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs`; 9 bridge tests and 13 negative-controls passed, `node --check` was clean, and grep found the third directive.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-003 Compose one shared three-directive block in the bridge from the canonical renderer while preserving the renderer output contract. Evidence: `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs`; 9 bridge tests and 13 negative-controls passed, `node --check` was clean, and grep found the third directive.
- [x] T-004 Route the bridge’s compiled-first and local fallback paths through the shared source, preserving native/CLI selection, response metadata, token caps, and fail-open behavior. Evidence: `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs`; 9 bridge tests and 13 negative-controls passed, `node --check` was clean, and grep found the third directive.
- [x] T-005 Remove the bridge’s independent two-directive mirror and keep the exported bridge renderer/test surface compatible with existing callers. Evidence: `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs`; 9 bridge tests and 13 negative-controls passed, `node --check` was clean, and grep found the third directive.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-006 Add exact-output tests for canonical normal, ambiguous, and directives-only fallback blocks. Evidence: `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs`; 9 bridge tests and 13 negative-controls passed, `node --check` was clean, and grep found the third directive.
- [x] T-007 Add bridge parity and compiled-renderer-unavailable tests proving the full canonical three-directive block will still be emitted for renderable data. Evidence: `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs`; 9 bridge tests and 13 negative-controls passed, `node --check` was clean, and grep found the third directive.
- [x] T-008 Run the bridge and negative-control suites, syntax-check the bridge, and confirm the third directive by source scan. Evidence: `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs`; 9 bridge tests and 13 negative-controls passed, `node --check` was clean, and grep found the third directive.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- The canonical renderer and OpenCode bridge fallback will consume one directive source.
- The bridge will emit all three unchanged directives in the same order on compiled and fallback paths.
- Compiled-renderer unavailability will remain fail-open with the complete block for valid renderable data.
- Existing response semantics and out-of-scope runtime/activation files will remain unchanged.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Requirements and success criteria: spec.md.
- Architecture, phases, testing, and rollback: plan.md.
- Drift finding and migration recommendation: specs/hooks/002-injection-bloat-reduction/014-injection-surface-deprecation-research/research/research.md, sections 6 and 7.
- Canonical renderer: .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts.
- OpenCode bridge: .opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs.
<!-- /ANCHOR:cross-refs -->
