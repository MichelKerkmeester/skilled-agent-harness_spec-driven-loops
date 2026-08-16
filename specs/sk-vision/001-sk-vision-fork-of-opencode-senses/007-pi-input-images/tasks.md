---
title: "Tasks: sk-vision 007 Pi input.images auto-inspect"
description: "Task list for the Pi input-images child."
trigger_phrases:
  - "sk-vision 007 tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/007-pi-input-images"
    last_updated_at: "2026-08-16T12:00:00.000Z"
    last_updated_by: "pi"
    recent_action: "Created 007 task list."
    next_safe_action: "Complete T001-T010 with evidence."
    blockers: []
    key_files:
      - "tasks.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-007-pi-input-images"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: sk-vision 007 Pi input.images auto-inspect

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:tasks -->
## Tasks

| ID | Task | Status |
|----|------|--------|
| T001 | Read the OpenCode AttachmentInjector (`vision-runtime/src/opencode/attachments.ts`) and the pi docs Input Events section + installed `InputEvent` type | [ ] |
| T002 | Add bounded `pi.on("input")` handler inside the factory: skip `extension` source and `steer` streaming; 2s `Promise.race`; try/catch → continue | [ ] |
| T003 | Prove `rg -n 'on\("input"\)' .opencode/skills/sk-vision/pi/sk-vision.ts` exit 0 and the 2s race exists | [ ] |
| T004 | Prove no unbounded await in the handler: `rg -n "await provider" .opencode/skills/sk-vision/pi/sk-vision.ts` exit 1 (or awaited calls only inside the race) | [ ] |
| T005 | Update `.pi/extensions/README.md`: remove "not wired (P1 gap)" wording, describe shipped hook | [ ] |
| T006 | Prove `rg -n "not wired" .pi/extensions/README.md` exit 1 | [ ] |
| T007 | Regression: `cd vision-runtime && bun run build && bun test` exit 0 | [ ] |
| T008 | Session proof: `pi --offline --approve` exit 0, extension loads, no fail-closed | [ ] |
| T009 | Optional live smoke: attach an image in a real pi session and confirm transform evidence appears (record PASS/SKIP with blocker) | [ ] |
| T010 | Run `validate.sh --strict` on this child | [ ] |
| T011 | All tasks marked `[x]` with evidence; no `[B]` remaining | [ ] |
<!-- /ANCHOR:tasks -->
