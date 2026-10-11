---
title: "Implementation Summary: Phase 9: pi-guard-classification"
description: "The Pi guard now sees a dispatch wrapped in `bash -c`, stops denying `mkdir -p $DIR`, and its denial no longer forbids paths."
trigger_phrases:
  - "pi guard classification implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/013-root-cause-and-ux-research/009-pi-guard-classification"
    last_updated_at: "2026-10-10T20:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Closed the phase"
    next_safe_action: "Start the next phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-009-pi-guard-classification"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Phase 9: pi-guard-classification

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-pi-guard-classification |
| **Completed** | 2026-10-10 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The Pi guard now sees a dispatch wrapped in `bash -c`, stops denying `mkdir -p $DIR`, and its denial no longer forbids paths.

### Phase 9: pi-guard-classification

The shared inspector classified `bash -c 'devin -p task'` as none, so Pi let an unauthorized wrapped dispatch run, and it read any variable beside a `-p` flag as a dispatch. It now unwraps a shell `-c` wrapper and classifies the command inside, and counts a variable as an executor only in command position. The hook resolver unwraps before matching shapes, so the existing jev case still resolves. The deny text and the two docs now say what the code does.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/dispatch/lib/dispatch-audit.mjs` | Modified | Unwrap and command-position rule |
| `.skilled/hooks/dispatch/lib/dispatch-audit.test.mjs` | Modified | Five rows |
| `.skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts` | Modified | Deny text |
| `.skilled/hooks/dispatch/pi/dispatch-preflight-lint.test.ts` | Modified | Boundary row and wording assertion |
| `cli-dispatch-authorization.md` (catalog) | Modified | Wrapper paragraph |
| `cli-dispatch-preflight-authorization.md` (playbook) | Modified | Wrapper sentence |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Eight one-change cli-pi builds by DeepSeek V4.1 Flash at max effort on llmgateway; the orchestrator ran every suite after each.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Return ambiguous payloads too | A wrapped ambiguous dispatch is denied, not allowed |
| Resolver unwraps first | Blanking quotes on the outer wrapper hid the payload |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npx vitest run` inspector and Pi suites | 111 passed before; 117 passed after |
| `node --test dispatch-rule-checks.test.mjs` | 20 pass, 0 fail |
| `validate_document.py` on both docs | 0 issues each |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Escaped quotes in a payload.** SHELL_WRAPPER stops at the first escaped quote, so such a wrapped dispatch reads ambiguous and Pi denies it. Fixed 2026-10-11 in `015-closeout/004-dispatch-guard-and-vitest`: a double-quoted payload now runs to its closing quote and is unescaped before inspection. A payload holding an expansion such as `$DIR` still reads ambiguous on purpose, so `bash -c "$CMD"` cannot read as none.
<!-- /ANCHOR:limitations -->

---
