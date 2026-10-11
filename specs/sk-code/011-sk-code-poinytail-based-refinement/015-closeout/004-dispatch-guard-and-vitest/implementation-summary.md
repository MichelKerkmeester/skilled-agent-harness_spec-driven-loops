---
title: "Implementation Summary"
description: "A vitest run over the hooks tree exits 0, and a bash -c payload with escaped quotes is classified by the command it runs."
trigger_phrases:
  - "dispatch guard and vitest implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/015-closeout/004-dispatch-guard-and-vitest"
    last_updated_at: "2026-10-11T12:00:00Z"
    last_updated_by: "closeout-orchestrator"
    recent_action: "Closed the phase with every goal criterion passing"
    next_safe_action: "Start the next phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "summary-015-004-dispatch-guard-and-vitest"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-dispatch-guard-and-vitest |
| **Completed** | 2026-10-11 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A vitest run over the hooks tree exits 0, and a bash -c payload with escaped quotes is classified by the command it runs.

### Phase 4: dispatch-guard-and-vitest

SHELL_WRAPPER now has one alternative per quote style: a single-quoted payload has no escapes, and a double-quoted payload runs past `\.` pairs to its real closing quote. A new shellPayload helper returns the payload and, for the double-quoted form, drops a backslash before $, backtick, double quote, backslash and newline, as the shell does. All three callers use the helper. The hooks vitest config now walks the hooks tree when it loads and excludes every JavaScript test file that does not import vitest; that covers the 15 node:test files and the plain-node mcp-route-guard suite. Those files keep running under node in CI and in their READMEs.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/vitest.config.ts` | Modify | Content-based exclude |
| `.skilled/hooks/dispatch/lib/dispatch-audit.mjs` | Modify | SHELL_WRAPPER and shellPayload |
| `.skilled/hooks/dispatch/lib/dispatch-audit.test.mjs` | Modify | Four cases |
| `.skilled/hooks/dispatch/pi/dispatch-preflight-lint.test.ts` | Modify | One case |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Tests first: with the old dispatch-audit.mjs restored the two inspector cases and the Pi case failed; with the fix all passed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A $ expansion in a payload stays ambiguous | The top-level read sees an expanded token carrying dispatch text and fails closed before unwrapping, which keeps `bash -c "$CMD"` from reading as none; a test pins it |
| Exclude by content | A hand list would go stale on the next node-style file |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npx --prefix .skilled vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/dispatch` | exit 1 before (No test suite found); after, 4 files, 142 tests passed, exit 0 |
| `npx --prefix .skilled vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks` | 5 files, 147 tests passed, exit 0 |
| `node --test` over every skipped file | 257 tests, pass 257, fail 0 |
| `node --test .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` | pass 20, fail 0 |
| Inspector suite with the old dispatch-audit.mjs | 2 failed of 84; with the fix 84 passed |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. None.
<!-- /ANCHOR:limitations -->

---
