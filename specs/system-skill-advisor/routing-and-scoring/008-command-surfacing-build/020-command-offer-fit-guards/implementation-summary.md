---
title: "Implementation Summary"
description: "The advisor now withholds a command where none fits: a command the prompt only mentions, refuses or asks about, a small correction to an existing document, an uncertain meaning match, a no-edit request and a weak doctor cue. Every floor held."
trigger_phrases:
  - "command offer fit guards implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/020-command-offer-fit-guards"
    last_updated_at: "2026-11-14T10:45:00Z"
    last_updated_by: "claude"
    recent_action: "Closed phase 020 after the gates T012 to T015"
    next_safe_action: "Commit phase 020, then start phase 021 at T001"
    blockers: []
    key_files:
      - ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts"
      - ".skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts"
      - ".skilled/skills/system-skill-advisor/runtime/lib/scorer/doctor-helper-handoff.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "close-020-command-offer-fit-guards"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 020-command-offer-fit-guards |
| **Completed** | 2026-11-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The advisor stops pushing a command where no command fits the request. On the reproduction probe the offers fell from 26 to 8, and the 8 left are real requests or two cases this phase leaves out of scope by name.

### Phase 20: command-offer-fit-guards

A model that works through skills stays free to pick the command path or the skill path. That freedom is lost when the brief names a command the person only mentioned, refused or asked about. This phase withholds the command in five such cases. A command the prompt only mentions, refuses or asks about is not attached. A small correction inside an existing README, catalog or playbook gets no creation command. A command row that passes on meaning alone must also clear the uncertainty bar. A no-edit request keeps only read-only commands. A weak doctor cue, a bare word that ordinary work also uses, needs a ranker score of 9, between the strong-cue bar and the no-cue bar of 10.

The start commit `BASE` is `3d558e78cf`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` | Modified | The mention reader `commandOnlyMentioned`, its lead lists and the small-edit gate on the readme, catalog and playbook commands |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts` | Modified | The uncertainty bar on a meaning pass, the no-edit gate on writing command rows and the weak-cue hand-off bar |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/doctor-helper-handoff.ts` | Modified | The header comment that states the cue rule |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts` | Modified | Refusal, question, request and control cases for the mention reader and the small-edit gate, 104 cases |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-meaning-anchor.vitest.ts` | Modified | The uncertainty bar and the no-edit gate, 28 cases |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/doctor-handoff-command.vitest.ts` | Modified | The app-problem and toolkit-problem hand-off cases, 16 cases |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/typed-command-owner.vitest.ts` | Modified | A typed command the prompt refuses keeps no owner, 5 cases |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-routing-baseline.json` | Recaptured | Rows sv-09, sv-11 and sv-12, questions about a command, are no longer offered. Decision P020 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek v4.1 flash max workers on OpenCode Go wrote one task each, test first, and an Opus verifier checked each task before the next in its lane. Seven checks failed and each failure became a new task: the small-edit gate failed three times on real creation requests, so at the retry bound it was narrowed to the readme, catalog and playbook commands. The coordinator then rebuilt the advisor, ran the full suite, both captures, both reproduction probes and the boundary checks, in that order.

| Probe | Before | After |
|-------|--------|-------|
| `probe-offers.mjs` lines with `command=/` | 26 | 8 |
| `/speckit:complete` | 3 | 1 |
| `/create:readme` | 6 | 2 |
| `/doctor:` | 9 | 2 |
| `verify-fix-prompts.json` lines with `command=/` | 19 | 11 |
| fix probe `/deep:research`, `/speckit:complete`, `/speckit:plan`, `/create:readme` | 1, 3, 3, 4 | none, 1, 2, 4 |

The real-embedding capture moved on one line. Typed recall stayed 24 of 44 and plain tune stayed 33 of 45. Plain holdout fell from 5 to 4 of 44, recorded as `DROP: real plain holdout 5 to 4` with `cause: T007`: removing the weak-cue bar left 4, and removing the uncertainty bar on meaning matches returned 5. The bar stays (decision P021).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The small-edit gate covers only the readme, catalog and playbook commands | Three Opus checks found real creation requests losing their command under a wider gate. At the retry bound the gate was narrowed once rather than tuned again |
| A weak doctor cue gets its own bar of 9 | A bare word ordinary work also uses should not hand off as easily as a strong cue, and a bar of 10 dropped real toolkit problems |
| The slice baseline is recaptured (P020) | The slice test failed only on three question rows this phase stops offering a command on by design |
| The uncertainty bar stays despite the real sealed drop of 1 (P021) | It withholds a command the scorer is unsure of, every fixture floor held, and the task says a lower real count does not block |
| `?` and `,` do not end a sentence for the mention reader (P022) | The task named `.`, `!` and a line break, and no real prompt has shown the gap |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Build and typecheck in the advisor runtime | PASS, both exit 0 |
| Full advisor suite | PASS, 184 of 184 files, 1919 passed, 0 failed, against 1838 before |
| Five floor lines and the eval line | PASS, each equals `before.txt`: 24 of 44, 0 of 35, 44 of 44, 28 of 45, 1 of 44 and `[161,51,21,5]` |
| Reproduction probe counts | PASS, 8, 1, 2, 2, 2 and no banned command |
| Boundaries | PASS with one recorded deviation: no `AGENTS.md`, package or comment-id change, and eight files where seven were planned |
| Phase test files | PASS: attach guards 104, meaning anchor 28, hand-off 16, typed owner 5 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Two doctor cases are left out of scope.** `/doctor:mcp debug` on `the mcp tool call fails with a wrong argument error in my weather server code` scores 10.009, and `/doctor:helper` beside `sk-code` on `turn off the dark mode toggle in the settings page` scores 9.761. Both sit inside the range real toolkit problems score (7.491 to 23.471), so a bar cannot tell them apart without dropping real cases.
2. **Real sealed reach fell by one row.** The real-embedding sealed plain count is 4 of 44, one below its before value, caused by the uncertainty bar. Phase 023 measures untuned reach and is where a fix would be judged.
3. **Two question shapes read as requests.** `quick question? is /speckit:resume safe to run twice` and `ok, is /speckit:plan enough here` keep their command, because the mention reader ends a sentence only at `.`, `!` or a line break.
4. **Pages that state a rule this phase changed.** `runtime/lib/README.md` (the `command-attach.ts` row), `runtime/tests/README.md` (the `command-meaning-anchor.vitest.ts` case count), `feature-catalog/cli-surface/advisor-recommend.md` and `feature-catalog/scorer-fusion/command-meaning-matching.md`. They are listed for the changelog entry the packet close writes.
<!-- /ANCHOR:limitations -->
