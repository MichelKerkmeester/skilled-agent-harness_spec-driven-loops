---
title: "Verification Checklist: sk-vision 004 opencode adapter"
description: "Verification checklist for sk-vision OpenCode plugin adapter."
trigger_phrases:
  - "sk-vision opencode checklist"
importance_tier: "important"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/004-opencode-adapter"
    last_updated_at: "2026-08-15T17:45:00.000Z"
    last_updated_by: "cursor-grok"
    recent_action: "Added 13-tool, real-file, and 2s grace checks."
    next_safe_action: "Wait for 003 before pre-implementation checks."
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-004-opencode-20260815"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: sk-vision 004 opencode adapter

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
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md | Evidence: Spec Section 4
- [ ] CHK-002 [P0] Technical approach defined in plan.md | Evidence: Plan Section 1
- [ ] CHK-003 [P1] Predecessor 003-runtime-fork complete | Evidence: 003-runtime-fork/implementation-summary.md
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `.opencode/plugins/sk-vision.js` exists as a regular file (`test -f` and `test ! -L`), analog to `mk-communication-projection.js` | Evidence: File type check
- [ ] CHK-011 [P0] Plugin default-exports the skill factory from `vision-runtime/dist/plugin.js` | Evidence: Module export check
- [ ] CHK-012 [P1] Hooks cover event, chat.message, tool, and dispose | Evidence: Plugin source inspection
- [ ] CHK-013 [P0] Tools are the 13 dump `sk_vision_*` names; no `sk_vision_query` | Evidence: Tool registration list
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Plugin loads cleanly in OpenCode runtime | Evidence: OpenCode session test
- [ ] CHK-021 [P1] Auto-inspect injects `<SK-VISION>` within 2000ms and never awaits the full GPU run | Evidence: Message trace
- [ ] CHK-022 [P1] GPU attach smoke runs only if 003 `load`/`status` passed; otherwise SKIP | Evidence: Implementation summary
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-030 [P0] No root `opencode.json` modification required | Evidence: git diff opencode.json
- [ ] CHK-031 [P1] Plugin configuration documented in README | Evidence: .opencode/plugins/README.md
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-040 [P0] Auto-inspect only processes local image attachments | Evidence: Security scan
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-050 [P0] Implementation summary updated with delivered structure | Evidence: implementation-summary.md
- [ ] CHK-051 [P1] Spec packet passes strict validation | Evidence: validate.sh output
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-060 [P0] File structure matches architecture in plan.md | Evidence: Directory tree
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Metric | Value |
|--------|-------|
| Total Checks | 16 |
| Passed Checks | 0 |
| Remaining Checks | 16 |
| P0 Blockers | 10 |
<!-- /ANCHOR:summary -->
