---
title: "Implementation Summary: sk-vision 007 Pi input.images auto-inspect"
description: "Closeout record for the Pi input-images child."
trigger_phrases:
  - "sk-vision 007 summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/007-pi-input-images"
    last_updated_at: "2026-08-16T12:00:00.000Z"
    last_updated_by: "pi"
    recent_action: "Child implemented; closeout recorded."
    next_safe_action: "Run 010 quality gate after 008/009 complete."
    blockers: []
    key_files:
      - "spec.md"
      - ".opencode/skills/sk-vision/pi/sk-vision.ts"
      - ".pi/extensions/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-007-pi-input-images"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-pi-input-images |
| **Completed** | 2026-08-16 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The Pi extension factory (`.opencode/skills/sk-vision/pi/sk-vision.ts`) now registers a bounded `input`-event handler inside `skVision(...)`, closing the recorded `input.images` P1 gap and reaching dual-host parity with the OpenCode `AttachmentInjector`.

**Handler contract (pi/sk-vision.ts:469-483):**
- Skips `event.source === "extension"` and `event.streamingBehavior === "steer"` with `{ action: "continue" }`.
- For non-empty `event.images`, races the provider analysis against a 2s `Promise.race` cap (`:439-441`) — the GPU call is never awaited unbounded.
- Per-image evidence cache `Map<string, string>` bounded at 32 entries with oldest-eviction (`:407-408`); cache key is `mimeType + data URL` (image bytes = identity, mirrors the injector's path+mtime+size idea). A timed-out in-flight analysis warms the cache for the follow-up message via `pending.then(...)`.
- On success returns `{ action: "transform", text: event.text + "\n\n<SK-VISION>\n...evidence...\n</SK-VISION>" }`; scene + caption + OCR rendered with the same `contextBuilder` renderers the 13 tools use.
- Never raises: inner analysis failures resolve `undefined`, the outer handler body is wrapped in try/catch returning `{ action: "continue" }`.

`.pi/extensions/README.md` row 72 rewritten: the `input.images` not wired (P1 gap) row now describes the shipped bounded 2s-grace auto-inspect with `<SK-VISION>` evidence injection.

The 13 `sk_vision_*` tool registrations are untouched (`rg -c 'pi\.registerTool'` = 13, no `sk_vision_query`).
<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

1. Read the copy pack (`spec.md`) in full, then the reference injector `vision-runtime/src/opencode/attachments.ts` (2s race, 32-entry cache, never-raise pattern).
2. Confirmed the event shape against the installed Pi 0.84.2 types (`dist/core/extensions/types.d.ts`): `InputEvent.images?: ImageContent[]`, `ImageContent = { type: "image", data, mimeType }`, result union `continue | transform | handled`; also read `docs/extensions.md` "Input Events" and `examples/extensions/input-transform.ts`.
3. Implemented the handler inside the existing `skVision` factory so it shares the `RuntimeClient`/`PhotonProvider`; image data passed via the existing `makeImageSource(undefined, img.data)` helper (runtime accepts data URLs or raw base64 — verified in `python/runtime.py` source loading).
4. Updated `.pi/extensions/README.md` row 72 (gap note removed).
5. Ran the proof battery (rg proofs, bun build+test regression, `pi --offline --approve`), then the spec-folder `validate.sh --strict`, then refreshed metadata and set `spec.md` Status to Complete.

Skill README/SKILL.md: no gap mention found (rg on `input.images`/`not wired` exit 1), so per the copy pack they were not touched.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Handler placed inside the factory, not module scope | Shares the existing `RuntimeClient`/`provider(ctx)` so one runtime backs both tools and the hook; matches the copy pack requirement |
| Per-image cache key = `mimeType + data URL` | The data URL is the stable identity for Pi `ImageContent` (no filesystem path exists); identical bytes reuse evidence instead of paying the GPU again |
| `pending.then(...)` warms the cache after a 2s timeout | A follow-up message with the same image resolves instantly; the bounded cap is never exceeded |
| No image materialization to disk | The Pi `transform` payload keeps the image inline (data URL); the evidence block is the deliverable, and writing temp files would widen scope |
| Runtime/OpenCode plugin untouched | Both injectors now exist; changing them would violate the phase scope boundary |
| `rg 'on("input")'` proof pattern deviation | The registration `pi.on("input", handler)` cannot contain the literal `on("input")`; equivalent proof `rg 'pi\.on\("input"'` exit 0 used instead |
<!-- /ANCHOR:decisions -->

---



---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| input hook present | PASS — `rg -n 'pi\.on\("input"' pi/sk-vision.ts` exit 0 (line 469) |
| 2s race + no unbounded await | PASS — `Promise.race` + `setTimeout(..., 2_000)` at pi/sk-vision.ts:439-441; no `await provider(...)` outside the race |
| README gap note removed | PASS — `rg -n "not wired" .pi/extensions/README.md` exit 1 |
| bun regression | PASS — `bun run build` exit 0; `bun test` 8 pass / 0 fail / 27 expect (pre- and post-edit) |
| `pi --offline --approve` | PASS — exit 0; only unrelated deep-pi lock timeout logged; no sk-vision error; session not fail-closed |
| `validate.sh --strict` this child | PASS — folder `RESULT: PASSED`, `Summary: Errors: 0` (wrapper exit 2 is the pre-existing repo-wide COMMAND_TREE_PARITY drift only) |
<!-- /ANCHOR:verification -->
<!-- ANCHOR:limitations -->
## KNOWN LIMITATIONS

- Live attach-image smoke SKIP with blocker: this run is non-interactive, so a real pi TUI session with an attached image cannot be driven headlessly; GPU inference on real images is deferred to 009's authorized live playbook runs (VSN-012 status, VSN-002 ocr). The handler's guard paths (extension/steer/no-images → continue) are deterministic and verified by code read + module load proof.
- The copy-pack proof `rg 'on("input")'` (literal close-paren) cannot pass for a valid `pi.on("input", handler)` call; the equivalent `rg 'pi\.on\("input"'` exit 0 was used and is documented as a deviation.
- `pi --offline --approve` logs a pre-existing unrelated deep-pi statistics-lock timeout (documented by 005-002 as well); it does not affect sk-vision loading.
<!-- /ANCHOR:limitations -->
