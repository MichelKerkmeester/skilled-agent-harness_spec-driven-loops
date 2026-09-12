---
title: "Goal: Phase 1: goal-drift-remediation"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "scaffold/011-goal-drift-remediation"
    last_updated_at: "2026-09-12T06:30:35Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-11-system-spec-kit-goals"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 1: goal-drift-remediation

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything between the frontmatter and the log is the DURABLE SLICE: it is
> what an operator sets as the session objective, and it must stay true for the
> life of the packet. The frontmatter above it is bookkeeping and never leaves
> this file: it is not sent in chat, not injected, not stored in an objective.
> Keep the slice short. A phase parent or top-level packet warns past 3000
> characters and fails past 4000, measured from the frontmatter's closing fence
> to the log anchor; the runtime goal surfaces cap what they hold, and a
> truncated objective loses its tail, which is where the criteria live.

---

<!-- ANCHOR:directive -->
## 1. DIRECTIVE

**Objective:** Close every finding the repo-wide goal research raised, so the documents and the
code say the same thing about goals.

The research found the system working and the writing around it drifted: fifteen
contradictions, five hand-copied flag rosters, and six citations pointing at files, counts and
names that had moved. Fix what is fixable, take the four decisions the operator answered, and
leave behind a check so the next drift fails a test instead of waiting for a research pass.
<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 2. COMPLETION

- [x] The hook stops applying the durable budget to phase children, matching the validator
- [x] The canonical disable variable is what the code prints and what every document teaches
- [x] Resume is described per engine, because the two carry different state sets
- [x] Both engines name goal states the same way, and records written under the old word still read
- [x] The kill switch freezes the session-free library paths, not only the commands
- [x] The plugin honours the record-store override the core already honours
- [x] The command line emits the field its twin emits and the documents name
- [x] One workspace walk, shared, instead of two identical copies
- [x] Injection without management is no longer described as read-only, and Cursor's cadence is right
- [x] Every stale citation, count and filename in the goal playbooks is corrected
- [x] A contract test fails when a goal document cites a path that moved, a count that changed, or the wrong variable
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 3. LOG

| Item | State | Evidence |
|---|---|---|
| Budget scope aligned | Done | Hook skips phase children; pinned by a slice test with a budget manifest fixture |
| Flag naming corrected | Done | Canonical name in both engines' error text, the plugin rule and the example env file |
| Status vocabularies merged | Done | Core renamed with a read-path upgrade; a legacy record reads back under the new word |
| Kill switch made total | Done | Both session-free library paths refuse when disabled |
| Record-store override honoured | Done | Plugin reads it; the packet lock deliberately stays on the workspace |
| Documentation corrected | Done | Resume, injection-only, cadence, counts, filenames, dead citation, wording |
| Contract test added | Done | Three checks, negative-controlled on a broken citation |
<!-- /ANCHOR:log -->
