---
title: "Tasks: sk-vision 007 Pi input.images auto-inspect"
description: "Executable tasks for the Pi input-images child."
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
    next_safe_action: "Complete T001-T011 with evidence."
    blockers: []
    key_files:
      - "tasks.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-007-pi-input-images"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: sk-vision 007 Pi input.images auto-inspect

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] T001 Read the OpenCode AttachmentInjector (`vision-runtime/src/opencode/attachments.ts`) — Evidence: `handle()`/`readiness()`/`analyze()` read; pattern confirmed: 2s `Promise.race`, cache bound 32 with oldest-eviction, never raises (analysis failures → warn block, not throw)
- [x] T002 Read the pi docs Input Events section + installed `InputEvent` type (image shape) + input-transform examples — Evidence: `extensions.md` input section read; `dist/core/extensions/types.d.ts` confirms `InputEvent { text, images?: ImageContent[], source: "interactive"|"rpc"|"extension", streamingBehavior?: "steer"|"followUp" }` and `ImageContent { type:"image", data, mimeType }`; result union `continue | transform | handled`; `examples/extensions/input-transform.ts` read
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add bounded `pi.on("input")` handler inside the factory: skip `extension` source and `steer` streaming; 2s `Promise.race`; try/catch → continue — Evidence: handler at `pi/sk-vision.ts:469`; extension+steer guards; 2s race at `:441`; outer try/catch → `{ action: "continue" }`; inner analysis try/catch → undefined
- [x] T004 Add bounded evidence cache (~32 entries) reusing the existing helpers; transform-inject `<SK-VISION>` evidence on success — Evidence: `inputEvidenceCache` Map + `maxInputEvidenceEntries = 32` at `pi/sk-vision.ts:407-408` with oldest-eviction; per-image key = mimeType+data URL (reuses `makeImageSource`); success returns `{ action: "transform", text: event.text + <SK-VISION> evidence }`
- [x] T005 Update `.pi/extensions/README.md`: remove "not wired (P1 gap)" wording, describe shipped hook — Evidence: row 72 rewritten — `input.images` auto-injects `<SK-VISION>` evidence after a 2s grace; extension-sourced traffic and mid-stream steers passed through
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Prove `rg -n 'on\("input"\)' .opencode/skills/sk-vision/pi/sk-vision.ts` exit 0 and the 2s race exists — Evidence: DEVIATION — the copy-pack pattern `on("input")` exits 1 because the registration takes a handler argument (`pi.on("input", async (event, ctx) => ...)`, line 469), so the literal `on("input")` (close-paren immediately after the quote) cannot occur in valid code — same as the pre-existing `pi.on("session_shutdown", ...)` call. Equivalent proof: `rg -n 'pi\.on\("input"'` exit 0 (line 469). 2s race confirmed at line 441 (`new Promise(... setTimeout(..., 2_000))` inside `Promise.race`); no `await provider(...)` outside the race
- [x] T007 Prove `rg -n "not wired" .pi/extensions/README.md` exit 1 — Evidence: `rg -n "not wired" .pi/extensions/README.md` exit 1 (no match)
- [x] T008 Regression: `cd vision-runtime && bun run build && bun test` exit 0 — Evidence: baseline pre-edit build exit 0 + test 8 pass / 0 fail / 27 expect; post-edit re-run build exit 0 + test 8 pass / 0 fail (no src change; proves no regression)
- [x] T009 Session proof: `pi --offline --approve` exit 0, extension loads, no fail-closed — Evidence: `pi --offline --approve` exit 0; only logged error is the pre-existing unrelated deep-pi statistics lock timeout; no sk-vision extension error; session not fail-closed
- [x] T010 Optional live smoke: attach an image in a real pi session and confirm transform evidence appears (record PASS/SKIP with blocker); run `validate.sh --strict` on this child — Evidence: live smoke SKIP — blocker: this is a non-interactive run; attaching an image requires a TUI session that cannot be driven headlessly, and GPU inference is deferred to 009's playbook live runs. `validate.sh --strict` on this child: RESULT PASSED (see T011 evidence)
- [x] T011 All tasks marked `[x]` with evidence; no `[B]` remaining — Evidence: T001-T010 above all `[x]` with inline command evidence; zero blocked tasks
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
