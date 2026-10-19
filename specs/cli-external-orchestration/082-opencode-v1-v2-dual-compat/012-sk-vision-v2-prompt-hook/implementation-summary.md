---
title: "Implementation Summary"
description: "With automatic inspection on, a prompt with an attached image now carries sk-vision evidence on OpenCode 2.0.32 as it does on OpenCode 1, through OpenCode 2's prompt hook. A live private-server run stored the Scene, Caption, OCR and Atlas blocks with the flag on and none with it off."
trigger_phrases:
  - "sk vision v2 prompt hook implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/012-sk-vision-v2-prompt-hook"
    last_updated_at: "2026-10-19T12:30:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Ported the automatic image check to the OpenCode 2 prompt hook and proved it live"
    next_safe_action: "Phase complete. Pushing the branch waits for the operator"
    blockers: []
    key_files:
      - ".skilled/skills/sk-vision/vision-runtime/src/plugin.ts"
      - ".skilled/skills/sk-vision/vision-runtime/src/opencode/attachments.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-012-sk-vision-v2-prompt-hook"
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
| **Spec Folder** | 012-sk-vision-v2-prompt-hook |
| **Completed** | 2026-10-19 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A text-only model on OpenCode 2 can now read an attached image, as it can on OpenCode 1. With `SK_VISION_AUTOINSPECT=1`, sk-vision's OpenCode 2 entry runs the automatic image check in `session.hook("prompt")` and appends the evidence to the prompt text before the model sees it.

### Phase 12: sk-vision-v2-prompt-hook

The evidence builder moved out of `AttachmentInjector.handle` into `evidenceText`, which both hosts call. OpenCode 1 still pushes it as a message part in `chat.message`. On OpenCode 2 the prompt hook keeps the `/vision` template path first. For any other prompt it turns image and PDF files into file parts, reads the session's model through `session.get`, waits for the full analysis for a listed text-only model, and gives any other model the 2-second grace. With the flag off, no vision runtime is built.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-vision/vision-runtime/src/opencode/attachments.ts` | Modified | `evidenceText`, shared by both hosts |
| `.skilled/skills/sk-vision/vision-runtime/src/plugin.ts` | Modified | Automatic inspection in the OpenCode 2 prompt hook, and the `bmp` mime |
| `.skilled/skills/sk-vision/vision-runtime/src/plugin.test.ts` | Modified | Four tests for the new path |
| `.skilled/skills/sk-vision/vision-runtime/dist/plugin.js` | Rebuilt | 511520 bytes. The folder is gitignored |
| `.opencode/plugins/README.md` | Modified | The sk-vision row and the OpenCode 2 gap paragraph |
| `.skilled/hooks/injection-contract.md` | Modified | The OpenCode 2 channel for sk-vision evidence |
| `../spec.md`, `../goal.md`, `../011-two-version-proof-and-closeout/implementation-summary.md` | Modified | Phase 12 in the map and binding, and limitation 5 marked resolved |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The orchestrator read the hook and session shapes from the published 2.0.32 packages, took the baselines, ran every suite, battery and live probe, and wrote the docs. DeepSeek wrote the code and tests through cli-pi in four short briefs (`scratch/briefs/`). Luna reviewed read-only in two rounds. The live probe ran a private `opencode2 serve` with its own port, database and data folder. The shared OpenCode 2 service kept its start time throughout.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The shapes come from the published 2.0.32 packages (decision 1) | The hook had to be pinned from the types, and the v2 install ships only a binary |
| One builder for both hosts (decision 2) | The evidence text stays identical, and only the attach step differs per host |
| The model comes from `session.get` (decision 3) | The prompt hook carries no model, and OpenCode 1 waits for a listed text-only model |
| Luna's `RuntimeClient.close()` P2 is recorded, not fixed (decision 4) | The client is unchanged here, and OpenCode 1 disposal has the same behaviour |
| Level 2 over the recommended Level 1 (decision 5) | It matches the sibling phases and carries `acceptance-criteria.md` |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Suites against the baseline (`scratch/suites-before.txt`, `scratch/suites-final.txt`) | sk-vision 46 to 50 pass and 0 fail, typecheck exit 0 both times, plugins 356 to 356, v2 bridge and hard-plugin files 39 to 39 |
| Live private OpenCode 2.0.32 run (`scratch/proof/`) | Flag off: exit 0, no evidence. Flag on: exit 0, Scene, Caption, OCR and Atlas blocks stored, rerun from the final bundle with the same result |
| `opencode-version-battery.cjs --family=v1` and `--family=v2` | Exit 0 each (`scratch/battery-v1.txt`, `scratch/battery-v2.txt`) |
| Luna review (`scratch/luna-1.txt`, `scratch/luna-2.txt`) | Round 1 PASS with three P2s. The `bmp` and test P2s were fixed, and round 2 reviewed the fix |
| `validate_document.py` on the two docs | Exit 0, 0 issues |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat --recursive --strict` | `RESULT: PASSED` (`scratch/validate-recursive.txt`) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The `sk_vision_*` tools do not register on OpenCode 2.** The `setup` entry never registered them, so the Atlas note's pointer to them has no tool behind it there. Registering them through `ctx.tool.transform` is a separate change.
2. **OpenCode 2 has no paste-time preload.** OpenCode 1 starts the analysis when the image is attached. OpenCode 2 starts it when the prompt is submitted, so a fast submit on a model not on the text-only list more often gets only the path note.
3. **Disposal during startup.** `RuntimeClient.close()` does not cancel a Python start still in progress, on either version.
4. **The proof ran on one machine with one model.** The live run used `llmgateway/deepseek-v4.1-flash`, a listed text-only model, and the unit tests assert only the text-only case. The 2-second grace path for other models is the existing OpenCode 1 code, unexercised on OpenCode 2.
<!-- /ANCHOR:limitations -->

---
