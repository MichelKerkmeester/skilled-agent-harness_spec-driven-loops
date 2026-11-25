---
title: "Decision Record: Phase 1: ux-and-component-map"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "001-ux-and-component-map operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map"
    last_updated_at: "2026-11-25T20:42:59.034Z"
    last_updated_by: "decision-record-writer"
    recent_action: "Recorded operator decisions"
    next_safe_action: "Review the recorded operator decisions"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "decision-record-writer"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: Phase 1: ux-and-component-map

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| U001 | Link the four existing screenshots and also build openhuman demo to capture its TUI. | No repository in the context set holds a TUI screenshot, so the design reference needs a capture of its own. The folder is gitignored, so the images stay local. | None | specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/spec.md |
| U002 | Operator chose: Nest six children (Recommended) | Six work streams of one crate do not fit one folder: the UX map, the crate and its contracts, the shell, the panes, the answer flow and the hardening proof each close on their own evidence. | None | specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/spec.md |
| U003 | Operator chose: Free-text answers (Recommended), [ ] tab keys, Ctrl+C quits, New glyphs and ASCII set | `bots answer` already takes free text, so an open question with no options was unanswerable from the screen. Alt+1..4 is unreliable on macOS, where Terminal.app and iTerm send `¡™£¢` unless Option is Meta. `?` marked scheduled, recurring and unknown alike, so a run that had not begun read the same as a value the mapping does not name. | None | specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/spec.md |
| U004 | Operator chose: Verb passes --mono (Recommended) | The binary stays environment-free, so every no-env::var check holds and a test can drive the palette from an argument. The verb is the one place a shell convention is translated into a flag. | None | specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/spec.md |
| U005 | Operator chose: Show only when present (Recommended) | Packet phase 006 lands `grants` and the ladder, so a screen that required them would not build before it. Drawing them when present lets the same frame build now and light up after 006, with no second code path. | None | specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/spec.md |
| U006 | Operator chose: Re-review, then commit (Recommended) | The review that found the findings is not the review that proves them fixed, so a second pass runs before the commit. | None | specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/spec.md |
| U007 | Operator chose: Same pair, 10 each | Devin was out of weekly quota, so the second lineage runs on the same DeepSeek flash max pair, ten iterations each. | None | specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/spec.md |
| U008 | Operator chose: Codex Luna xhigh fast | opencode-go had hit its monthly limit and Devin was out of weekly quota, so the missing second lineage ran on Codex Luna at xhigh on the fast tier. | None | specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/spec.md |
| U009 | Operator chose: No count (Recommended) | The banner row already carries the open-item count and the key to the inbox on every tab, so a count on the tab label would say the same thing twice. The tab stays `2 Inbox`. | None | specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design/mockups.md |
<!-- /ANCHOR:operator-decisions -->

The key map's approval is the next row. `design/key-map.md` section 6 holds the answer, `acceptance-criteria.md` AC-007 restates it, and this table takes it as a row when the operator gives it, so the parent's handoff wording holds without a deviation.

Two parent decisions also bind this packet and are recorded in `../decision-record.md`: Q008, that the overlay draws a grant's kind and rung only when the item carries them, and Q009, that the `bots ui` verb reads `NO_COLOR` and passes `--mono` while the binary reads no environment variable. U004 and U005 above carry their reasoning.

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### U001
<!-- source: claude:335d5a41-9d36-45cb-8bae-6e6010fef894:toolu_01VpujwifaYqxMZ1RGSLRxkN:2 -->

Question:
```text
Screenshots for the context folder: no repo has a terminal UI screenshot. What should go in?
```

Options:
```text
Link the four existing (Recommended)
Also build openhuman demo
```

Answer:
```text
Also build openhuman demo
```

### U002
<!-- source: claude:335d5a41-9d36-45cb-8bae-6e6010fef894:toolu_01VpujwifaYqxMZ1RGSLRxkN:0 -->

Question:
```text
Expand the terminal screen phase 003 into a Level 3 phase parent with six nested children (UX and component map, architecture and contracts, shell and navigation, panes, answer flow, hardening)? Nesting keeps every existing citation to 003 valid.
```

Options:
```text
Nest six children (Recommended)
One phase, six milestones
```

Answer:
```text
Nest six children (Recommended)
```

### U003
<!-- source: claude:335d5a41-9d36-45cb-8bae-6e6010fef894:toolu_01VpujwifaYqxMZ1RGSLRxkN:1 -->

Question:
```text
Which proposed UI rules do you approve for the terminal screen?
```

Options:
```text
Free-text answers (Recommended)
[ ] tab keys, Ctrl+C quits
New glyphs and ASCII set
insta snapshot tests
```

Answer:
```text
Free-text answers (Recommended), [ ] tab keys, Ctrl+C quits, New glyphs and ASCII set
```

### U004
<!-- source: claude:335d5a41-9d36-45cb-8bae-6e6010fef894:toolu_01349adVLgRnXK7QXysbE4Qb:0 -->

Question:
```text
How should the terminal screen pick its colour mode? The children disagree: 001 has the bots ui verb turn NO_COLOR into a --mono flag (the binary reads no environment variables), 003 has the binary read NO_COLOR itself.
```

Options:
```text
Verb passes --mono (Recommended)
Binary reads NO_COLOR
```

Answer:
```text
Verb passes --mono (Recommended)
```

### U005
<!-- source: claude:335d5a41-9d36-45cb-8bae-6e6010fef894:toolu_01349adVLgRnXK7QXysbE4Qb:1 -->

Question:
```text
The overlay mockups show grant kind and rung, which only packet phase 006 provides (after the screen). How should v1 handle it?
```

Options:
```text
Show only when present (Recommended)
Drop from v1
```

Answer:
```text
Show only when present (Recommended)
```

### U006
<!-- source: claude:335d5a41-9d36-45cb-8bae-6e6010fef894:toolu_01349adVLgRnXK7QXysbE4Qb:2 -->

Question:
```text
Apply all review findings (3 P0, about 12 P1, P2s) to the terminal screen children with Vibe writers, then what?
```

Options:
```text
Re-review, then commit (Recommended)
Commit after fixes
```

Answer:
```text
Re-review, then commit (Recommended)
```

### U007
<!-- source: claude:335d5a41-9d36-45cb-8bae-6e6010fef894:toolu_01WzyXZWHdXhfaNjPDXAWqbf:1 -->

Question:
```text
Which DeepSeek flash max pair should run it? Vibe needs a second executor beside it, and Devin is out of weekly quota.
```

Options:
```text
Vibe + opencode-go (Recommended)
Vibe + pi llmgateway
Same pair, 10 each
```

Answer:
```text
Same pair, 10 each
```

### U008
<!-- source: claude:335d5a41-9d36-45cb-8bae-6e6010fef894:toolu_01UnEftoYL9PebkieTeYknCg:0 -->

Question:
```text
The planning-depth research got 10 of 20 iterations: Vibe finished, opencode-go hit its monthly limit at once, and Devin is out of weekly quota. How should the missing second lineage run?
```

Options:
```text
pi llmgateway DeepSeek max (Recommended)
Codex Luna xhigh fast
Proceed with Vibe only
```

Answer:
```text
Codex Luna xhigh fast
```

### U009
<!-- source: claude:833af0cc-38d5-498d-8268-a1869252b4d2:askuserquestion:0 -->

Question:
```text
Should the Inbox tab show an unread count, e.g. `2 Inbox (3)`?
```

Options:
```text
No count (Recommended)
Add the count
```

Answer:
```text
No count (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
