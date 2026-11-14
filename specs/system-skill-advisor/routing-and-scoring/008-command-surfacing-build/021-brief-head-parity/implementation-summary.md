---
title: "Implementation Summary"
description: "Claude and OpenCode now show the same brief head for the same prompt: the head row keeps its command under every request shape, the OpenCode plugin asks for the same route option and labels the first passing row, and the doctor companion line names its policy and never repeats a printed command."
trigger_phrases:
  - "brief head parity implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/021-brief-head-parity"
    last_updated_at: "2026-11-14T11:05:00Z"
    last_updated_by: "claude"
    recent_action: "Closed phase 021 after the gates T009 to T012"
    next_safe_action: "Commit phase 021, then start phase 022 at T001"
    blockers: []
    key_files:
      - ".skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts"
      - ".skilled/skills/system-skill-advisor/runtime/lib/render.ts"
      - ".opencode/plugins/system-skill-advisor.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "close-021-brief-head-parity"
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
| **Spec Folder** | 021-brief-head-parity |
| **Completed** | 2026-11-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A model now sees the same workflow offer whichever runtime carries the prompt. On the head probe 17 of 17 prompts print the same head on Claude and OpenCode, where 14 did before.

### Phase 21: brief-head-parity

The brief head is where a model learns which workflow fits the task. When Claude showed `use sk-doc → /create:manual-testing-playbook (start)` and OpenCode showed `use sk-doc` alone, the same request reached a different choice on each runtime. This phase makes the head the same everywhere. The head row keeps its command whether the request asks for every row or the top only. The OpenCode plugin asks the advisor for the same top-only route the hooks ask for, and labels its head from the first row that passes, as the renderer does. The doctor companion line now prints its policy word, `Also: /doctor:update (ask)`, and is left out when the head or its partner already prints that command.

The start commit `BASE` is `7281629941`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts` | Modified | The head row keeps its command under every request shape |
| `.skilled/skills/system-skill-advisor/runtime/lib/render.ts` | Modified | The companion line prints its policy word and drops a command the head or partner already prints |
| `.opencode/plugins/system-skill-advisor.js` | Modified | Labels the head from the first passing row and sends `compiledRouteTopOnly` |
| `.skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-recommend-compiled-route-option.vitest.ts` | Modified | The head row carries its command under both request shapes |
| `.skilled/skills/system-skill-advisor/runtime/tests/doctor-brief-render.vitest.ts` | Modified | The policy word, the child marker and the repeated-command cases |
| `.opencode/plugins/tests/system-skill-advisor.test.cjs` | Modified | The first-passing-row label and the request option |
| `.skilled/skills/system-skill-advisor/README.md` | Modified | Shows the companion line with its policy word |
| `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md` | Modified | Shows the companion line form and when it is left out |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek v4.1 flash max workers on OpenCode Go wrote one task each in four lanes that owned different files, test first. An Opus verifier checked each code task before the next in its lane, and the coordinator checked the two doc sentences directly. No check failed. The coordinator then rebuilt the advisor and ran the full suite, the child-flag run, the plugin tests, both captures and the head probe.

The three prompts whose heads differed before:

| Prompt | OpenCode before | OpenCode after, same as Claude |
|--------|-----------------|--------------------------------|
| `make a manual testing playbook for the login flow` | `use sk-doc 0.95/0.12 pass.` | `use sk-doc → /create:manual-testing-playbook (start) 0.95/0.12 pass.` |
| The ambiguous review prompt led by `system-deep-loop` | `vs sk-doc → /create:readme (start) 0.93/0.12 pass.` | `vs sk-doc 0.93/0.12 pass.` |
| The ambiguous playbook prompt led by `sk-doc` | `ambiguous: sk-doc 0.95/0.16 vs system-deep-loop → /deep:review (ask) 0.92/0.12 pass.` | `ambiguous: sk-doc → /create:manual-testing-playbook (start) 0.95/0.16 vs system-deep-loop 0.92/0.12 pass.` |

The planned fourth mismatch and the companion lines on the probe were already gone at `BASE`, because phase 020 removed the doctor offers those prompts drew.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The head row keeps its command even when a lower command row offers the same one | The head is what the model reads first, so dropping its command on one request shape hid the workflow on one runtime |
| A repeated companion is dropped, not replaced by the next bridge | One offer per command keeps the brief readable, and the task named the drop |
| The plugin test passes `freshness: 'live'` | Without it the plugin renders the outage line, so the case would fail for a reason it does not test. Every other brief case in the file does the same |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Build and typecheck in the advisor runtime | PASS, both exit 0 |
| Full advisor suite | PASS, 1922 passed, 0 failed, against 1919 before |
| Child-flag run and plugin tests | PASS, 16 of 16 and 45 of 45 |
| Floors, eval and real capture | PASS, each equals `before.txt`: 24 of 44, 0 of 35, 44 of 44, 28 of 45, 1 of 44, `[161,51,21,5]`, real holdout 4 of 44. No `GAIN` and no `DROP` |
| Head probe | PASS, 17 of 17 same head, no `command-doctor-` label, no bare `Also:` line |
| Boundaries | PASS, eight files, no `AGENTS.md`, package or comment-id change |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The route lookup and the lead row can differ.** The top-only option looks up a route for row 0, but the brief leads with the first row that passes. When row 0 fails and row 1 passes, row 1 leads with no command on every runtime. Inferred by the Opus check of T014, not probed. Carried to the packet review.
2. **A child session prints a different word.** The README sentence says the policy is run, start or ask, but a child session prints `parent-named only` in its place.
3. **The OpenCode label skips the needs-mode fallback.** The plugin always fills the label from the lead row's skill, so the renderer's fallback that names a needs-mode row by its owning skill never runs there. It is older than this phase and is carried to the packet review.
4. **Two pages still show the companion without its policy word.** `feature-catalog/scorer-fusion/doctor-command-routing.md` and `runtime/scripts/command-bridges/README.md` write `Also: /doctor:<command> <target>`. They are listed for the changelog entry the packet close writes.
5. **The Claude hook has the same label fallback.** `skillLabelFor` in `hooks/claude/user-prompt-submit.ts` takes `metadata.skillLabel` and falls back to row 0 only when it is missing. Carried to the packet review.
<!-- /ANCHOR:limitations -->
