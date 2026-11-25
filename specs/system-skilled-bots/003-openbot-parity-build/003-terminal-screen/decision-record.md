---
title: "Decision Record: Phase 3: terminal-screen"
description: "The operator decisions that span this phase parent's six children, each with the answer on record and the child that carries it."
trigger_phrases:
  - "003-terminal-screen operator decisions"
  - "terminal screen phase parent decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/003-terminal-screen"
    last_updated_at: "2026-11-25T21:12:34Z"
    last_updated_by: "review-fix-pass"
    recent_action: "Recorded Q008 on grants drawn when present and Q009 on the NO_COLOR route"
    next_safe_action: "Work child 001-ux-and-component-map against Q002 to Q009"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "w4-003-terminal-parent"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: Phase 3: terminal-screen

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

A phase parent carries this file for the decisions no single child owns. Each row names the child that carries the decision out, so a child can be worked without reading the other five.

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Write every phase of 003 in full now: spec, plan, tasks and acceptance criteria for all ten children. | The operator chose full planning over scoping later phases. | None | Superseded by Q002 |
| Q002 | Phase 003 becomes a Level 3 phase parent with six nested children. Its plan, tasks, acceptance criteria and goal move into the children, and the pre-expansion documents stay in `context/legacy-003/`. | Six work streams of one crate do not fit one folder: the UX map, the crate and its contracts, the shell, the panes, the answer flow and the hardening proof each close on their own evidence. | Q001 | All six children |
| Q003 | The overlay takes a free-text answer when an item has no options, and single-key shortcuts pause while the operator types. | `bots answer` already takes free text, so an open question with no options was unanswerable from the screen. Pausing the shortcuts is what makes typing a sentence safe. | None | 005-answer-flow |
| Q004 | The key map gains `[` and `]` as fallback tab keys beside Alt+1..4, and Ctrl+C closes an open overlay or quits and never writes. | Alt+1..4 is unreliable on macOS, where Terminal.app and iTerm send `¡™£¢` unless Option is Meta, and Ctrl+Tab is rarely delivered. Ctrl+C needs one meaning that cannot lose an answer. | None | 003-shell-and-navigation, 005-answer-flow |
| Q005 | The six status markers gain a scheduled, a recurring and an unknown glyph, and the set carries an ASCII fallback. | `?` marked scheduled, recurring and unknown alike, so a run that has not begun read the same as a value the mapping does not name. The ASCII set keeps the screen readable where the glyphs do not render. | None | 004-panes |
| Q006 | `insta` is not approved. Snapshot tests assert the ratatui `TestBackend` buffer directly. | One dependency fewer, and the assertion names the cells the operator sees rather than a stored file that hides them. | None | 004-panes, 006-hardening-and-proof |
| Q007 | The four existing screenshots are linked, and openhuman's `--demo` is built locally to capture its TUI into the gitignored `context/screenshots/`. | No repository in the context set holds a TUI screenshot, so the design reference needs a capture of its own. The folder is gitignored, so the images stay local. | None | 001-ux-and-component-map |
| Q008 | The overlay draws a grant's kind and rung only when the item carries them, and draws nothing where they are absent. | Packet phase 006 lands `grants` and the ladder, so a screen that required them would not build before it. Drawing them when present lets the same frame build now and light up after 006, with no second code path. | None | 004-panes, 005-answer-flow |
| Q009 | The `bots ui` verb reads `NO_COLOR` and passes `--mono`, and passes `--ascii` when asked, to the binary. The binary reads no environment variable. | The binary stays environment-free, so every no-env::var check holds and a test can drive the palette from an argument. The verb is the one place a shell convention is translated into a flag. | None | 002-architecture-and-contracts, 003-shell-and-navigation |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:335d5a41-9d36-45cb-8bae-6e6010fef894:toolu_01TffhHm3wMmLnW5Gx3Pz8R7:1 -->

Question:
```text
How far should the phases be written now?
```

Options:
```text
Full first, scoped rest (Recommended)
All phases full
Parent map only
```

Answer:
```text
All phases full
```

### Q002 to Q007

Question:
```text
The expansion of phase 003 into a phase parent, and the key, glyph, test and screenshot choices that go with it.
```

Answer:
```text
Recorded in research/ui-advisory.md section "Operator decisions (2026-11-25)", items 1 to 4, which is the advisory's own record of the operator's answers. No transcript was captured for these six, so this appendix quotes the advisory rather than a conversation.
```

### Q008 to Q009

Question:
```text
Two conflicts the first review of the children raised: whether the overlay may draw a grant before packet phase 006 lands one, and which side of the process boundary reads NO_COLOR.
```

Answer:
```text
Recorded in research/ui-review-1.md section "Operator decisions (2026-11-25)", items 1 and 2, which is the review's own record of the operator's answers. No transcript was captured for these two, so this appendix quotes the review rather than a conversation.
```

<!-- /ANCHOR:operator-answers-verbatim -->
