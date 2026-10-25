---
title: "Implementation Summary"
description: "A refused handoff claim now says what the note's state means: a done note is finished, a claimed note names its owner and a note with no status is not a handoff note."
trigger_phrases:
  - "claim error per state implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/033-research-remediation/008-claim-error-per-state"
    last_updated_at: "2026-10-25T16:45:00Z"
    last_updated_by: "builder"
    recent_action: "Added per-state claim refusal messages with failing-first tests"
    next_safe_action: "Orchestrator commits the phase and refreshes the parent changelog"
    blockers: []
    key_files:
      - ".skilled/hooks/session-relaunch/lib/relaunch-core.cjs"
      - ".skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-008-claim-error-per-state"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-claim-error-per-state |
| **Completed** | 2026-10-25 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A refused handoff claim now tells the session what the note's state means. Before, every refusal read `cannot claim handoff with status X` and nothing more, so a session could not tell finished work from another session's live claim.

### Phase 8: claim-error-per-state

`claimHandoff` keeps the old prefix and adds one sentence chosen by status. A done note says the work is finished and must not be continued, and names the note in `superseded_by` when it carries one. A claimed note names `claimed_by` and `claimed_at`, and says "an unknown session" or "an unknown time" when a field is absent. A note with no status says it is not a handoff note. Any other status, such as `withdrawn`, keeps the bare prefix, because guessing its meaning would be worse than saying nothing.

Example: `cannot claim handoff with status claimed. It was claimed by session s-1 at 2026-10-25T10:00:00Z; do not continue another session's claim.`

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | Modified | New `claimRefusalMessage` helper; `claimHandoff` throws its result |
| `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` | Modified | Five new tests plus two small local helpers that write a note with chosen status lines and capture the claim error |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The five tests went in first and ran red against the old code: four failed on the missing sentence (for example `actual: 'cannot claim handoff with status done', expected: /finished/`), and the unknown-status test passed, as it should, since that behaviour does not change. The helper then went in, and the full suite ran again. `rg -n "cannot claim handoff" .skilled/hooks .opencode/plugins` found one producer and only the two prefix regexes at test lines 302 and 1940, so no CLI test needed a change.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Prefix first, sentence after a period | Existing tests and any reader matching the prefix keep working unedited |
| Unknown status keeps the prefix only | A guessed meaning for a status the code does not know could mislead a session |
| Absent claim fields print "unknown" | A blank name would read as a formatting bug rather than missing data |
| The message reads only the frontmatter already parsed | No extra file read, and `parseHandoff` takes one line per field, so a value cannot carry a line break into the message |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Baseline `node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/session-relaunch.test.cjs` | 868 pass, 0 fail |
| New tests before the code change | 4 fail, 1 pass (unknown status, unchanged behaviour), exit 1 |
| Same suite after the change, mid-build | 892 tests, 891 pass, 1 fail: `arm with a new model and no effort clears the recorded effort`, the other builder's failing-first `armLocked` test before its code landed. All five new tests and both prefix tests passed |
| Final rerun of the same suite | 896 pass, 0 fail, exit 0 |
| `npx vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts` | 54 passed, exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A note whose status is literally `missing`** gets the not-a-handoff-note sentence, the same as a note with no status. No writer produces that status, so this is left as is.
2. **The parent changelog entry** is outside this phase's write scope and is left for the orchestrator.
<!-- /ANCHOR:limitations -->

---
