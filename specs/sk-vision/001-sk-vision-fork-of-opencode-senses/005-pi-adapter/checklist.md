---
title: "Verification Checklist: sk-vision 005 pi adapter"
description: "Verification checklist for sk-vision Pi extension adapter."
trigger_phrases:
  - "sk-vision pi checklist"
importance_tier: "important"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/005-pi-adapter"
    last_updated_at: "2026-08-16T07:10:00.000Z"
    last_updated_by: "cursor-grok"
    recent_action: "Kept fail-closed, 13-tool, and relative-symlink checks."
    next_safe_action: "Wait for 003 before pre-implementation checks."
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-005-pi-20260815"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: sk-vision 005 pi adapter

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

- [ ] CHK-010 [P0] `.opencode/skills/sk-vision/pi/sk-vision.ts` default-exports a valid ExtensionFactory | Evidence: Source code inspection
- [ ] CHK-011 [P0] Relative symlink `.pi/extensions/sk-vision.ts` matches analog `git-preflight-advisory.ts` | Evidence: readlink check
- [ ] CHK-012 [P0] Tools registered: the 13 dump `sk_vision_*` names; no `sk_vision_query` | Evidence: registerTool calls
- [ ] CHK-013 [P0] Invalid default export would fail-close the Pi session; factory stays typed and tiny | Evidence: Export shape review
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] `pi --offline --approve` starts without extension fail-closed | Evidence: CLI test run
- [ ] CHK-021 [P1] Session shutdown invokes runtime client termination, or 0.84.2 substitute is documented | Evidence: Shutdown hook test
- [ ] CHK-022 [P1] `input.images` uses 2s grace or the unproven-paste gap is recorded | Evidence: Implementation summary
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-030 [P0] Pi extension documentation updated | Evidence: .pi/extensions/README.md
- [ ] CHK-031 [P1] Relative symlink does not use absolute paths | Evidence: ls -la .pi/extensions
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-040 [P0] No credential exposure in tool definitions | Evidence: Static code scan
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
| P0 Blockers | 11 |
<!-- /ANCHOR:summary -->
