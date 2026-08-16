---
title: "Verification Checklist: sk-vision 007 Pi input.images auto-inspect"
description: "Verification Date: 2026-08-16"
trigger_phrases:
  - "sk-vision 007 checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/007-pi-input-images"
    last_updated_at: "2026-08-16T12:00:00.000Z"
    last_updated_by: "pi"
    recent_action: "Created 007 checklist skeleton."
    next_safe_action: "Fill with evidence at closeout."
    blockers: []
    key_files:
      - "checklist.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-007-pi-input-images"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: sk-vision 007 Pi input.images auto-inspect

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Complete or documented deferral |

---

<!-- ANCHOR:items -->
## Verification Items

| ID | Priority | Item | Status | Evidence |
|----|----------|------|--------|----------|
| V001 | P0 | Input hook present inside factory | [ ] | `rg 'on\("input"\)'` exit 0 |
| V002 | P0 | 2s grace cap via `Promise.race`; no unbounded await | [ ] | grep handler body |
| V003 | P0 | Handler never raises (try/catch → continue) | [ ] | read + forced-error smoke |
| V004 | P0 | Extension/steer traffic skipped | [ ] | read handler guards |
| V005 | P0 | README gap note removed | [ ] | `rg "not wired"` exit 1 |
| V006 | P0 | `pi --offline --approve` exit 0; no fail-closed | [ ] | command output |
| V007 | P0 | Runtime regression: `bun run build && bun test` exit 0 | [ ] | command output |
| V008 | P1 | Transform injection uses `<SK-VISION>` envelope | [ ] | read handler |
| V009 | P1 | Live attach-image smoke (PASS/SKIP with blocker) | [ ] | recorded |
| V010 | P0 | `validate.sh --strict` on this child exit 0 | [ ] | command output |
<!-- /ANCHOR:items -->
