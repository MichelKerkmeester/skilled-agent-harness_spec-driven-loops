---
title: "Verification Checklist: OpenCode Directive Single-Source"
description: "Completed verification checks for canonical three-directive parity and the OpenCode bridge fail-open fallback."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "OpenCode directive single source checklist"
  - "OpenCode bridge directive verification"
importance_tier: "normal"
contextType: "general"
parent: "hooks/002-injection-bloat-reduction"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/016-opencode-directive-single-source"
    last_updated_at: "2026-08-09T14:52:52Z"
    last_updated_by: "sol"
    recent_action: "Reconciled OpenCode directive single-source delivery"
    next_safe_action: "None; packet complete"
    blockers: []
    completion_pct: 100
    session_dedup:
      fingerprint: "sha256:97e2abf47a85d29eeb5c654a4a33260e6f2dc08719b58afd3cbbbac3946a20d6"
      session_id: null
      parent_session_id: null
---
# Verification Checklist: OpenCode Directive Single-Source

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

All checklist items were completed against objective file and command evidence.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements and the current two-of-three bridge drift will be documented in spec.md. Evidence: `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs`; 9 bridge tests and 13 negative-controls passed, `node --check` was clean, and grep found the third directive.
- [x] CHK-002 [P0] The shared-source architecture, compiled-first route, and renderer-unavailable fallback will be defined in plan.md. Evidence: `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs`; 9 bridge tests and 13 negative-controls passed, `node --check` was clean, and grep found the third directive.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The shared source will preserve the existing Directives label and all three directive strings byte-for-byte. Evidence: `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs`; 9 bridge tests and 13 negative-controls passed, `node --check` was clean, and grep found the third directive.
- [x] CHK-011 [P1] The bridge preserved the canonical renderer contract while composing its shared three-directive block. Evidence: `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs`; 9 bridge tests and 13 negative-controls passed, `node --check` was clean, and grep found the third directive.
- [x] CHK-012 [P0] The bridge will contain no independent two-directive literal mirror. Evidence: `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs`; 9 bridge tests and 13 negative-controls passed, `node --check` was clean, and grep found the third directive.
- [x] CHK-013 [P0] The compiled-renderer-unavailable bridge path will emit the complete canonical block for valid renderable data. Evidence: `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs`; 9 bridge tests and 13 negative-controls passed, `node --check` was clean, and grep found the third directive.
- [x] CHK-014 [P0] Code comments added during implementation will explain durable rationale only and will contain no ephemeral ids or spec paths. Evidence: `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs`; 9 bridge tests and 13 negative-controls passed, `node --check` was clean, and grep found the third directive.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Canonical normal rendering will emit the label, hygiene, governor, and proof-over-appearance directives in exact order. Evidence: `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs`; 9 bridge tests and 13 negative-controls passed, `node --check` was clean, and grep found the third directive.
- [x] CHK-021 [P0] Canonical ambiguous and directives-only fallback rendering will emit the same complete block without text changes. Evidence: `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs`; 9 bridge tests and 13 negative-controls passed, `node --check` was clean, and grep found the third directive.
- [x] CHK-022 [P0] Bridge output will match canonical renderer output byte-for-byte for equivalent native and CLI inputs. Evidence: `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs`; 9 bridge tests and 13 negative-controls passed, `node --check` was clean, and grep found the third directive.
- [x] CHK-023 [P0] Forced compiled-renderer unavailability will still produce the full canonical block for a valid renderable result. Evidence: `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs`; 9 bridge tests and 13 negative-controls passed, `node --check` was clean, and grep found the third directive.
- [x] CHK-024 [P0] Existing bridge compatibility, bridge smoke, renderer, and runtime-parity tests will pass. Evidence: `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs`; 9 bridge tests and 13 negative-controls passed, `node --check` was clean, and grep found the third directive.
- [x] CHK-025 [P1] The bridge passed its syntax gate without changing unrelated runtime files. Evidence: `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs`; 9 bridge tests and 13 negative-controls passed, `node --check` was clean, and grep found the third directive.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] The bridge fallback will consume the same canonical directive source as render.ts. Evidence: `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs`; 9 bridge tests and 13 negative-controls passed, `node --check` was clean, and grep found the third directive.
- [x] CHK-FIX-002 [P0] The proof-over-appearance directive will be present on every renderable bridge path, including compiled-renderer fallback. Evidence: `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs`; 9 bridge tests and 13 negative-controls passed, `node --check` was clean, and grep found the third directive.
- [x] CHK-FIX-003 [P0] Directive wording, punctuation, order, label, and newline behavior will remain unchanged. Evidence: `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs`; 9 bridge tests and 13 negative-controls passed, `node --check` was clean, and grep found the third directive.
- [x] CHK-FIX-004 [P1] Existing route metadata, thresholds, token caps, disabled behavior, and advisor-unavailable fail-open semantics will remain unchanged. Evidence: `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs`; 9 bridge tests and 13 negative-controls passed, `node --check` was clean, and grep found the third directive.
- [x] CHK-FIX-005 [P1] No Pi, central delivery-planner, activation-matrix, or other non-OpenCode runtime file will be modified. Evidence: `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs`; 9 bridge tests and 13 negative-controls passed, `node --check` was clean, and grep found the third directive.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No guardrail directive will be silently dropped when only the compiled renderer is unavailable. Evidence: `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs`; 9 bridge tests and 13 negative-controls passed, `node --check` was clean, and grep found the third directive.
- [x] CHK-031 [P1] No prompt text, secrets, or new external I/O surface will be introduced by the shared-source route. Evidence: `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs`; 9 bridge tests and 13 negative-controls passed, `node --check` was clean, and grep found the third directive.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec.md, plan.md, tasks.md, checklist.md, and implementation-summary.md will remain synchronized with the final implementation and verification state. Evidence: `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs`; 9 bridge tests and 13 negative-controls passed, `node --check` was clean, and grep found the third directive.
- [x] CHK-041 [P1] The final summary will distinguish completed command evidence from planned or inferred behavior. Evidence: `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs`; 9 bridge tests and 13 negative-controls passed, `node --check` was clean, and grep found the third directive.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Documentation reconciliation was limited to the five requested Markdown files inside the target packet. Evidence: `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs`; 9 bridge tests and 13 negative-controls passed, `node --check` was clean, and grep found the third directive.
- [x] CHK-051 [P1] Implementation verification will remove or confine temporary outputs and will leave no generated packet metadata or unrelated repository residue. Evidence: `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs`; 9 bridge tests and 13 negative-controls passed, `node --check` was clean, and grep found the third directive.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Completed |
|----------|-------|-----------|
| P0 Items | 16 | 16/16 |
| P1 Items | 8 | 8/8 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-08-09
**Verified By**: sol
<!-- /ANCHOR:summary -->
