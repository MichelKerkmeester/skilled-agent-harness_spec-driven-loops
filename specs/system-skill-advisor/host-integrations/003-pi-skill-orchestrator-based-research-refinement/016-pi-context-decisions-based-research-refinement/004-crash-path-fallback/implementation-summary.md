---
title: "Implementation Summary"
description: "Built in worktree 474, not committed: the shared Claude hook catch returns the outage line and directives instead of nothing, and the threshold doc names the override that works."
trigger_phrases:
  - "crash path fallback implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/004-crash-path-fallback"
    last_updated_at: "2026-11-18T12:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Phase built and verified"
    next_safe_action: "Start phase 003"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "db37536c-37e4-472c-8a05-521b8fec328d"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-crash-path-fallback |
| **Completed** | 2026-11-18. Built in worktree 474, not committed |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

### Phase 4: crash-path-fallback

When the shared UserPromptSubmit handler's own code throws, its catch still records the `fail_open` diagnostic, and now also returns the timeout outage line and the directives as `additionalContext`. A nested try keeps `{}` if rendering that line throws too. Claude, Codex, Pi, DSH and Vibe reach this handler; OpenCode uses its own plugin, which already did this. The `SPECKIT_ADVISOR_CONFIDENCE_THRESHOLD` row now says the value is read once when the daemon starts, that the per-request `confidenceThreshold` option is the supported override, and that hook briefs always send 0.8.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `hooks/claude/user-prompt-submit.ts` | Modify | Imports `renderAdvisorTimeoutFallback` and returns it from the outer catch inside a nested try |
| `runtime/tests/hooks/claude-user-prompt-submit-hook.vitest.ts` | Modify | One test: a throwing `renderBrief` yields the outage context and an `UNKNOWN` `fail_open` diagnostic |
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` | Modify | One sentence on line 382 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The conductor re-read the catch and recorded the hook suite baseline. Two GPT-6 Luna `xhigh` `fast` leaves then wrote the test and the doc sentence in parallel. The conductor confirmed the new test failed for the right reason, and a third leaf changed the catch. The conductor ran every check, then a read-only Luna refutation pass.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Edit only the shared catch | Pi, DSH and Vibe pass `additionalContext` through, so one edit covers them, and Codex delegates to the same handler. The adapter catches fire only on an import failure nobody has seen |
| Render with default options and skip directive-lifecycle dedup in the catch | The catch cannot trust any state built in the try, and running dedup there would put possibly-failing code back on the crash path. A repeated directive block on a crashing turn costs bytes, not correctness |
| A doc sentence, not an output field | No two callers need different threshold values today, and the per-request option already works |
| Doc edit anchored on text unique to line 382 | Line 383 ends with the same words, so the brief's first anchor matched twice |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| How often the catch fires | Counted during planning: `files=187 records=8231 unhandled=0`. This is a cheap guard, not an incident fix |
| Hook suite baseline (T002) | `npx vitest run tests/hooks` exit 0, 170 of 170 |
| New test before the catch change (T003) | 1 failed, 170 passed; it received `{}` where the outage context was expected, after `renderBrief` was called once |
| Hook suite after the change (T004) | Exit 0, 171 of 171 |
| `npx vitest run tests/hooks tests/parity` | Exit 0, 19 files, 235 of 235 |
| Typecheck and build (T006) | Both exit 0 |
| Doc sentence (T005) | `rg -n 'daemon starts'` and `rg -n 'never reaches'` both print line 382. No hook sets `thresholdConfig`, so `hooks/lib/skill-advisor-cli-fallback.ts:245` defaults to 0.8 |
| Diff scope (T007) | This phase adds only the three planned files; phase 002's uncommitted files share the worktree |
| Comment hygiene (T008) | `rg` printed nothing |
| Refutation pass (Luna `xhigh`, read-only) | Six findings, checked by the conductor. Confirmed and kept by design: the crash fallback skips directive dedup. Confirmed edge cases, listed below: setup wording, a skipped prompt shown as an outage, policy observation without session context. Confirmed but outside scope: a throwing `dependencies.now` runs before the try; the row's existing words "unless `confidenceOnly` mode is active" are false, because `skill-advisor-brief.ts:175-176` still applies the confidence threshold in that mode |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **An adapter that fails to import the built handler stays silent.** Pi, DSH and Vibe each have their own catch for that case. The fallback text lives in the module that failed to load, so covering it would need a duplicated string. Rebuilding the runtime is the workaround if it ever happens.
2. **Fixed by phase 009, completed in phase 012. The crash fallback rendered with default options.** A setup prompt lost its `/doctor:setup` hint, a prompt the policy would skip was shown as an outage and the directive block was not deduplicated across repeated crashing turns; phase 009 fixed those three (`hooks/claude/user-prompt-submit.ts`, the catch block). The policy observation still carried no session when the crash came before the delivery state was set, which phase 012 fixed by setting it right after the input is validated.
3. **Fixed by phase 009. The doc row's `confidenceOnly` clause was wrong**; that mode drops the uncertainty check, not the confidence threshold. `ENV-REFERENCE.md:382` now says `confidenceOnly` mode skips only the uncertainty check.
<!-- /ANCHOR:limitations -->

---
