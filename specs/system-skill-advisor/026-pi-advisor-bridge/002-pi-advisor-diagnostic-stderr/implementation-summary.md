---
title: "Implementation Summary"
description: "Pi no longer prints the advisor diagnostic record over its input line. The bridge passes a no-op diagnostic writer, and the record is still saved to disk."
trigger_phrases:
  - "pi advisor diagnostic stderr implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/038-pi-advisor-diagnostic-stderr"
    last_updated_at: "2026-10-21T16:37:24Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Fixed the Pi bridge diagnostic on stderr and verified it"
    next_safe_action: "Commit the two code files and this packet when the operator asks"
    blockers: []
    key_files:
      - ".skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts"
      - ".skilled/skills/system-skill-advisor/runtime/tests/hooks/prompt-advisor.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-038-pi-advisor-diagnostic-stderr"
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
| **Spec Folder** | 038-pi-advisor-diagnostic-stderr |
| **Completed** | 2026-10-21 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Pi no longer prints `{"timestamp":…,"runtime":"pi",…}` into its input area on every prompt. The advisor still records the line on disk, so nothing is lost.

### Pi advisor diagnostic on stderr

The Pi bridge runs the advisor hook inside Pi's own process to avoid a slow subprocess. The hook writes one diagnostic record per prompt through a `writeDiagnostic` dependency that defaults to `process.stderr.write`. That default suits the Claude, Codex and Cursor runtimes, which run the hook as a subprocess, but in Pi the line lands on the terminal. The bridge now passes a no-op writer. The hook's separate persist step still appends the record to the durable diagnostics file.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts` | Modified | Pass `writeDiagnostic: () => {}` to the in-process hook call |
| `.skilled/skills/system-skill-advisor/runtime/tests/hooks/prompt-advisor.vitest.ts` | Modified | New stderr test, and the call-shape assertion names the writer |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A scratch script called the built hook as Pi does, with `{ runtime: "pi" }` alone, and its stderr held the record. The new test runs a real prompt through the bridge against the built hook, with `process.stderr.write` spied. It failed with the one-line fix reverted and passed with it in place. The Pi bridge is excluded from the runtime build (`tsconfig.build.json`, `"../hooks/pi/**"`), so `dist` needed no rebuild.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Silence the writer in the bridge, not in the hook | The hook's stderr default is correct for the subprocess runtimes. Only the in-process caller needs a different writer, and the hook already exposes that seam. |
| Keep persisting the record | The record feeds advisor telemetry, and `SPECKIT_PI_ADVISOR_DEBUG=1` still shows advisor status inside the prompt. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Repro: built hook called as Pi does | Stderr held the `"runtime":"pi"` record |
| New test without the fix | FAIL, `expected [ Array(1) ] to deeply equal []` |
| `prompt-advisor.vitest.ts` with the fix | PASS, 13 of 13 (baseline 12 of 12) |
| `validate.sh --strict` on this packet | `RESULT: PASSED`, 0 errors, 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not checked in a live interactive Pi session.** The test drives the real bridge and the built hook, but an interactive Pi run is the operator's to confirm.
<!-- /ANCHOR:limitations -->

---


