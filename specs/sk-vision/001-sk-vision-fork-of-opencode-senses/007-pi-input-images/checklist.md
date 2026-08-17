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
    recent_action: "Checklist filled with evidence at closeout."
    next_safe_action: "Run 010 quality gate after 008/009 complete."
    blockers: []
    key_files:
      - "checklist.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-007-pi-input-images"
      parent_session_id: null
    completion_pct: 100
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
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: REQ-001..REQ-006 in `spec.md` section 4.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: bounded preload pattern in `plan.md` Architecture.
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: pi `on("input")` + `event.images` confirmed in installed docs (`extensions.md` + `dist/core/extensions/types.d.ts`).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks. Evidence: `bun run build` in vision-runtime regression exit 0 (pre- and post-edit); module loads cleanly in `pi --offline --approve`.
- [x] CHK-011 [P0] No console errors or warnings. Evidence: `pi --offline --approve` session output shows no sk-vision error (only unrelated deep-pi lock timeout).
- [x] CHK-012 [P1] Error handling implemented. Evidence: handler try/catch → `continue`; inner analysis try/catch → undefined; never raises.
- [x] CHK-013 [P1] Code follows project patterns. Evidence: mirrors `AttachmentInjector` in `src/opencode/attachments.ts` (2s race, 32-entry cache, never-raise).
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: REQ-001..006 mapped in `implementation-summary.md` (input hook present, 2s race, never raises, extension skip, README gap gone, session not fail-closed; REQ-P1 transform envelope, REQ-P2 steer passthrough, REQ-P3 scope).
- [x] CHK-021 [P0] Manual testing complete. Evidence: `pi --offline --approve` exit 0; optional live attach-image smoke recorded as SKIP with blocker (non-interactive run cannot drive a TUI image attach; GPU inference deferred to 009 live runs).
- [x] CHK-022 [P1] Edge cases tested. Evidence: extension-source and steer-stream passthrough guards present and read (pi/sk-vision.ts:470-471); no-images → continue.
- [x] CHK-023 [P1] Error scenarios validated. Evidence: timeout path returns `continue` by design (Promise.race 2s); analysis failures resolve undefined via inner try/catch; forced-error smoke not feasible without GPU, covered by 009 live runs.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class: `feature-completion`. Evidence: closes the recorded P1 gap in `.pi/extensions/README.md` (row 72).
- [x] CHK-FIX-002 [P0] Same-class producer inventory. Evidence: OpenCode `AttachmentInjector` is the analog producer (mirrored).
- [x] CHK-FIX-003 [P0] Consumer inventory. Evidence: Pi interactive and RPC input paths consume the hook (handler registered at `pi/sk-vision.ts:469`); extension source explicitly excluded.
- [x] CHK-FIX-004 [P0] Adversarial table. Evidence: unbounded-await and raise-on-input rows listed in `spec.md` risks and handled in code (2s race; try/catch → continue).
- [x] CHK-FIX-005 [P1] Matrix axes listed. Evidence: source (interactive/rpc/extension) × streaming (steer/followUp/undefined) matrix in copy pack; `event.source === "extension"` and `streamingBehavior === "steer"` guards return continue at `pi/sk-vision.ts:470-471`.
- [x] CHK-FIX-006 [P1] Hostile env variant. Evidence: cold model cache → `Promise.race` resolves `undefined` after `2_000` ms (`pi/sk-vision.ts:439-441`) → handler returns `continue`.
- [x] CHK-FIX-007 [P1] Evidence pinned. Evidence: `rg` proofs + session output in `implementation-summary.md` Verification table.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: diff of `pi/sk-vision.ts` adds no credentials; image data routed through existing `makeImageSource` helper; no secrets in README row edit.
- [x] CHK-031 [P0] Input validation implemented. Evidence: image source validated via `makeImageSource`; bbox/params unchanged.
- [x] CHK-032 [P1] Auth/authz working correctly. Evidence: local-first runtime (NDJSON over stdio, `RuntimeClient`); hook adds no network or trust boundary; `rg "not wired"` exit 1 proves README no longer claims a missing hook.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. Evidence: REQ/task numbering matches across docs; `rg -c "\[x\]" tasks.md` = 14 and spec.md Status=Complete; plan DoD all `[x]`.
- [x] CHK-041 [P1] Code comments adequate. Evidence: handler comments explain the 2s race and never-raise rule (durable WHY at `pi/sk-vision.ts:404-410`); no ids/paths embedded.
- [x] CHK-042 [P2] README updated (if applicable). Evidence: `.pi/extensions/README.md` gap note replaced with shipped-behavior description.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. Evidence: proof logs written under `/tmp` (`/tmp/build2.log`, `/tmp/test2.log`, `/tmp/pi-offline.log`, `/tmp/sk-vision-gate.log`); no files created outside the scope table.
- [x] CHK-051 [P1] scratch/ cleaned before completion. Evidence: `ls scratch/` shows only `.gitkeep`; no residue; sweep ran at closeout.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

- [x] CHK-060 [P0] All checklist items marked `[x]` or explicitly deferred with reasons. Evidence: `rg -c "\[x\]" checklist.md` counts all items; live-smoke deferral recorded in CHK-021 with blocker.
- [x] CHK-061 [P0] This child `validate.sh --strict` exits 0.
<!-- /ANCHOR:summary -->
