---
title: "Implementation Summary: Hook Deadline and Diagnostics"
description: "A slow advisor now leaves the model the directives fallback instead of nothing on every runtime behind the Claude shim, and each hook turn records its real runtime and the bytes it delivered, including turns that run as a subprocess."
trigger_phrases:
  - "hook deadline summary"
  - "advisor diagnostics summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/002-hook-deadline-and-diagnostics"
    last_updated_at: "2026-09-26T12:10:00Z"
    last_updated_by: "orchestrate"
    recent_action: "Shipped R1, R3, R7, R11, R12 and the diagnostic flush"
    next_safe_action: "Start 003-hook-path-cli-spawn-trim"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts"
      - ".skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts"
      - ".skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts"
      - ".skilled/skills/system-skill-advisor/runtime/lib/metrics.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-26-030-orchestrate"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The R1 margin is 300 ms: the hook's own overhead measured p50 69 ms and max 135 ms under load average 6.87."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Hook Deadline and Diagnostics

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-hook-deadline-and-diagnostics |
| **Completed** | 2026-09-26 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A slow advisor no longer costs Claude, Codex, Cursor or Devin the guardrail. Before, the shim and the hook both used 2,500 ms, so the shim killed the hook first and the model got `{}`. Now the hook's CLI budget ends 300 ms earlier and the hook prints its fallback in time. Every hook turn now also records which runtime it served and how many bytes it delivered, which is the baseline phases 003 and 004 are measured against.

### Phase 2: hook deadline and diagnostics

- **Nested deadline (R1).** When the operator has not set `SPECKIT_CLAUDE_HOOK_TIMEOUT_MS`, the Claude shim sets it to 2,200 ms for the hook it spawns. An operator-set value passes through unchanged.
- **Runtime and bytes (R3).** The runtime list gained `pi`, `codex`, `cursor` and `devin`, and `metrics.ts` now re-exports the canonical list instead of keeping its own copy. Diagnostic records carry `emittedBytes` and `directivesSuppressed`. The Codex, Cursor and Devin adapters set `SPECKIT_RUNTIME` for the hook, and Pi passes `runtime: 'pi'` in-process.
- **Pi dist-path guard (R7).** A test resolves both of Pi's import specifiers from their real locations and imports the module, so a renamed dist path fails CI instead of silently turning the Pi advisor off.
- **Crash-safe trim (R11).** The bounded log trim writes a temp file and renames it over the log, so a crash mid-trim leaves the old log.
- **Pi deadline (R12).** Pi's in-process advisor call races a timer of the budget plus 300 ms and delivers the fallback directive if the call hangs.
- **Diagnostic flush (found here).** Subprocess turns lost their durable record because the hook exited before the fire-and-forget append settled. The CLI entry now waits for pending writes, capped at 100 ms, before exiting.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts` | Modified | R1 child budget |
| `.skilled/skills/system-spec-kit/runtime/hooks/{codex,cursor,devin}/shared.ts` | Modified | R3 `SPECKIT_RUNTIME` per adapter |
| `.skilled/skills/system-skill-advisor/runtime/lib/advisor-runtime-values.ts` | Modified | R3 runtime list |
| `.skilled/skills/system-skill-advisor/runtime/lib/metrics.ts` | Modified | R3 record fields and single list, R11 trim |
| `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts` | Modified | R3 runtime and bytes, fallback re-export, diagnostic flush |
| `.skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts` | Modified | R7 exported specifiers, R12 deadline and runtime |
| `.skilled/skills/system-spec-kit/runtime/tests/user-prompt-submit-shim.vitest.ts` | Modified | R1 tests |
| `.skilled/skills/system-spec-kit/runtime/tests/hook-adapter-runtime-label.vitest.ts` | Created | R3 adapter tests |
| `.skilled/skills/system-skill-advisor/runtime/tests/legacy/advisor-observability.vitest.ts` | Modified | R3 record tests, R11 trim test |
| `.skilled/skills/system-skill-advisor/runtime/tests/hooks/claude-user-prompt-submit-hook.vitest.ts` | Modified | R3 runtime and bytes tests, flush tests |
| `.skilled/skills/system-skill-advisor/runtime/tests/hooks/prompt-advisor.vitest.ts` | Modified | R7 and R12 tests |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

GPT-6 Luna at max effort wrote each change from a one-change brief, through cli-codex in fast mode and through cli-pi on the `openai-codex` provider, two at a time on disjoint files. Every brief asked for its test to fail first; each return reported that failure, and the orchestrator reread each diff and reran each test before the next brief. Two Pi returns came back BLOCKED because Pi's `edit_lines` tool counts a trailing newline as an extra line; the orchestrator made the one-line runtime-list edit directly and re-ran the trim brief with `--exclude-tools edit_lines`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Margin 300 ms, child budget 2,200 ms | Measured hook overhead p50 69 ms, max 135 ms under load, with about twice the worst case as headroom |
| Reuse `SPECKIT_RUNTIME` rather than add a variable | The scorer already reads it as its metrics label and the launcher already passes it through |
| Re-export the runtime list from `metrics.ts` | Two copies would drift again the next time a runtime is added |
| Cap the diagnostic flush at 100 ms | The shim kills the hook 300 ms after its CLI budget ends, and start-up takes up to about 135 ms |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| REQ-001 end to end: real shim, real hook, CLI stub sleeping 3 s | New default: fallback directive delivered at 2,294 ms. Old equal 2,500 ms budget: `{}` with `CHILD_TIMEOUT` at 2,544 ms |
| REQ-002 live, debug on, built dist | Records written for `claude` (shim), `codex` (adapter) and `pi` (in-process), each with `emittedBytes` 260 |
| Advisor suite, `npx vitest run` | 903 passed, 1 failed, 6 skipped of 910, against a baseline of 888 passed, 3 failed, 6 skipped of 897. The 13 added tests are this phase's. The two command-bridge failures in the baseline were fixed by a concurrent commit, `3fce512201`. The remaining failure, the routing-divergence ratchet, failed at baseline too |
| Typecheck, both packages | Exit 0 |
| Shim and adapter tests | 10 of 10 |
| Plugin suite | 29 of 29 |
| Negative controls | Each new test failed on the unchanged code, as reported by each return; the R7 test failed with a deliberately broken path |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement --strict --recursive` | Run at phase close, see the parent packet |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Diagnostics need debug on.** Records are written only with `SKILL_ADVISOR_DEBUG` set, so the `durationMs` baseline for 003 needs an operator-enabled collection window.
2. **The Codex, Cursor and Devin adapters keep their 2,800 ms outer limit.** The shim they spawn now finishes by about 2,500 ms plus its own start-up, which fits inside it.
<!-- /ANCHOR:limitations -->

---
