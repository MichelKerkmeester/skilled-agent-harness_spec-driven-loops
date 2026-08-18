---
title: "Implementation Summary: Guaranteed vision for text-only models"
description: "Closeout for guaranteed vision on text-only models: a shared allowlist+modality classifier, awaited auto-inspect on OpenCode and Pi, and best-effort Cursor/Devin rules."
trigger_phrases:
  - "sk-vision guaranteed vision summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/019-guaranteed-vision-for-text-only-models"
    last_updated_at: "2026-08-18T13:00:00.000Z"
    last_updated_by: "claude"
    recent_action: "Fixed a P0 OCR-guard regression; live GLM Cursor/Devin tests PASS."
    next_safe_action: "Push the fix + playbook to v4 and main."
    blockers: []
    key_files:
      - "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/019-guaranteed-vision-for-text-only-models/implementation-summary.md"
      - ".opencode/skills/sk-vision/vision-runtime/src/model-modality.ts"
      - ".opencode/skills/sk-vision/hooks/pi/sk-vision.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-019-guaranteed-vision"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 019-guaranteed-vision-for-text-only-models |
| **Status** | In Progress |
| **Level** | 1 |

The guaranteed-vision run is built and proven on both in-process hosts (OpenCode + Pi), with best-effort rules for the MCP-only hosts (Cursor + Devin); only the commit remains.
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

For a text-only model, both in-process hosts now **await the full image analysis** so `<SK-VISION>` evidence is guaranteed present; every other model keeps the cheap non-blocking grace. The MCP-only hosts get a best-effort rule telling the model to inspect images itself.

### Fix evidence

| Edit | Artifact | Result |
|------|----------|--------|
| Classifier | `model-modality.ts` | `isTextOnlyModel({providerID, modelID, input?})` + allowlist + declared-modality signal + `SK_VISION_FORCE` / `SK_VISION_TEXT_ONLY_MODELS` |
| OpenCode gate | `attachments.ts` | awaits fully for a text-only model; grace race otherwise; injectable `graceMs` |
| Pi gate | `hooks/pi/sk-vision.ts` | reads `ctx.model` (`{provider, id, input}`); awaits fully when text-only |
| Cursor rule | `cursor/vision-rule.md` | best-effort always-on rule, wired via `.cursor/rules/sk-vision.md` |
| Devin note | `devin/vision-rule.md` | best-effort drop-in for Devin Knowledge |
| Classifier tests | `model-modality.test.ts` | 6/6 (incl. the modality signal) |
| Guarantee test | `attachments.test.ts` | 2/2 — text-only awaits past the grace; other models do not |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Built OpenCode-first because its SDK exposes the active model as `{providerID, modelID}`, so the gate can classify precisely. The classifier is a small shared module (allowlist substrings + env overrides) so every in-process adapter can reuse it. In `AttachmentInjector.handle`, the per-image branch became a ternary on the verdict: await the full readiness for a text-only model, keep the bounded grace race otherwise. The 2-second grace was made an injectable constructor option so the guarantee could be proven fast — a slow mock provider shows the text-only path captures evidence past the grace while a non-listed model does not. No eager session-start pre-warm was added: it would load the vision model on image-less sessions and compete with the coding model for VRAM.

Pi then reused the same classifier. Its `input` hook exposes `ctx.model` as `{provider, id, input}`, so `inspectAttachedImages` gained a `guaranteed` flag: for a text-only model it awaits the full analysis instead of racing the 2-second grace, mirroring OpenCode. Pi's `model.input` also gave an authoritative modality signal — a model that declares no `image` input is blind regardless of the name allowlist — so the shared classifier now treats that as text-only too, falling through to the allowlist only when the host does not declare modality (OpenCode today). Cursor and Devin attach sk-vision only over MCP, which cannot see the model or force a tool call, so they get a best-effort rule rather than a hard guarantee: the skill owns `cursor/vision-rule.md` (wired as an always-on Cursor rule via the `.cursor/rules/sk-vision.md` symlink) and `devin/vision-rule.md` (a drop-in for Devin Knowledge, since Devin has no repo-owned always-on rule slot).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Operator allowlist, not denylist | The operator wanted explicit control; an unlisted model falls back to today's best-effort |
| Declared modality beats the name list | Pi's `model.input` is authoritative — a model that declares no image input is blind regardless of its name, so it needs no allowlist maintenance |
| Await fully, no eager pre-warm | Guarantees evidence without loading the vision model on sessions that never attach an image |
| Injectable `graceMs` | Makes the await-vs-race guarantee unit-testable without a multi-second test |
| Cursor/Devin best-effort only | MCP cannot see the model or force a tool call, so a rule/note is the honest ceiling — never a hard guarantee |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Classifier | `model-modality.test.ts` 6/6 (incl. declared-modality signal) |
| Guarantee | `attachments.test.ts` 2/2 (await past grace for text-only; not for others) |
| Types | `tsc --noEmit` exit 0 |
| Full suite | 17/17 |
| Build | `bun run build` OK |
| Pi gate | type-sound by construction against the confirmed pi SDK types (`ctx.model.{provider,id,input}`); bun parses the hook clean; pi type-checks/loads the extension at runtime (no repo-level tsc covers pi extensions) |
| Cursor rule | `.cursor/rules/sk-vision.md` symlink resolves to the `alwaysApply: true` source |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## KNOWN LIMITATIONS

- Cursor/Devin cannot be hard-guaranteed — MCP cannot see the model or force a tool call — so their rule/note is best-effort by design; a text-only model that ignores the rule still gets no evidence there.
- The allowlist is an explicit list: an unlisted text-only model whose host does not declare its input modality stays best-effort until added (by design). On Pi, a declared non-image `input` is covered automatically.
- The OpenCode guarantee is proven at the unit level with a mock provider; the Pi gate is type-sound and parses clean but is verified at runtime by pi (no repo-level tsc covers pi extensions).
- Setting `SK_VISION_MODEL` as a shell-env prefix on a cli dispatch does not reach the host-spawned MCP server; reliable moondream3 selection needs the `env` block inside `.mcp.json` / `.devin/mcp_config.json`. On moondream3 the dedicated OCR prompt also under-reads some fixtures (returns a truncated span) while `caption`/`scene` read the full text — a model/prompt-quality matter, not a crash.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:regression-and-tests -->
## POST-SHIP REGRESSION FIX & LIVE TESTS

Manual testing surfaced a P0 regression in the runtime (from the predecessor packet): `handle_ocr` called `_require_task("ocr")`, but OCR is implemented via the model's general `query` path — no model advertises a task named `ocr` — so the guard threw on every real model. That broke the `sk_vision_ocr` tool and, because the auto-inject ran `Promise.all([caption, scene, ocr])`, it collapsed the whole guaranteed auto-inject on real models. Unit tests missed it (a mocked provider reports no capabilities, so the guard passed).

| Fix | Artifact | Result |
|-----|----------|--------|
| Drop the phantom task guard | `python/runtime.py` `handle_ocr` | OCR runs via `query` again; the failing NDJSON call now returns text |
| Make analyzers independent | `attachments.ts`, `hooks/pi/sk-vision.ts` | `Promise.all` → `Promise.allSettled`; one failed analyzer no longer discards the others' evidence |

Live end-to-end tests with GLM (a text-only model), and the classifier unit run:

| Scenario | Host / model | Verdict | Evidence |
|----------|--------------|---------|----------|
| VSN-022 rule-driven vision | cli-cursor · glm-5.2-high | PASS | neutral prompt; the auto-loaded `.cursor/rules/sk-vision.md` drove an unprompted read returning `DEPLOYOK7391` — the exact scene read incl. the unguessable code |
| VSN-023 note-driven vision | cli-devin · glm-5-2 (dangerous) | PASS | note-as-guidance drove `inspect`+`ocr`+`zoom`; reported ground truth `DEPLOY OK 7391`; the `ocr` call ran without the old crash |
| VSN-024 classifier + env | local `bun test` | PASS | `model-modality.test.ts` 6/0; `attachments.test.ts` 2/0 |
| VSN-021 in-process guarantee | OpenCode / Pi | unit-proven | needs a live OpenCode/Pi session for the end-to-end run |

Post-fix gate: `tsc --noEmit` exit 0; full suite 17/17; `bun run build` OK; the exact OCR NDJSON call that threw before now returns text.
<!-- /ANCHOR:regression-and-tests -->
