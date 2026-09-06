---
title: "Goal: authored READMEs follow the punctuation rule the repo documents"
description: "The durable directive this phase executes against, and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/010-readme-human-voice"
    last_updated_at: "2026-09-06T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Removed 909 prose em-dashes from 147 authored READMEs"
    next_safe_action: "Decide whether the same sweep should cover the 835 semicolons the scanner also flags"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/ROUTER.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-06-018-sk-design-parent-v2"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Goal: authored READMEs follow the punctuation rule the repo documents

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->

**Inherits the parent `goal.md`. Where this file and that one disagree, that one wins.**

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

Authored READMEs follow the Em Dash Ban the Human Voice Rules already carry.

### Decisions

**Replace by sentence shape, not by one substitution.** A colon after a label or before an independent
clause, a comma for a short appositive, a full stop where the continuation was already sentence-shaped.
A blanket comma produces comma splices, which is worse prose than the dash it replaced.

**Vendored and historical content keeps its dashes.** 377 in copies of external projects and 153 in
spec records. Rewriting either is not a voice fix.

**A lone dash in a table cell is a glyph.** It means not-applicable. Swapping it for a comma destroys
the meaning.

### Operator copy

909 em-dashes gone from the READMEs a person actually reads; vendored and historical text untouched.
<!-- /ANCHOR:directive -->

<!-- ANCHOR:binding -->
## 2. BINDING

1. Only a line containing an em-dash may change. Audit every changed line against `HEAD`.
2. Never touch a fenced code block, ascii art, or a table cell whose whole content is a dash.
3. Read the diff. A gate cannot tell you a replacement reads worse than the dash it replaced.
4. Run `hvr_scan.py` before and after; it is the independent check.
<!-- /ANCHOR:binding -->

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

| # | Criterion | How it is proven |
|---|-----------|------------------|
| 1 | No prose em-dash remains | 0 across the authored set, from 909 |
| 2 | No comma splice introduced | Audited line by line against `HEAD` |
| 3 | No out-of-scope edit | Zero changed lines that carried no em-dash |
| 4 | Independently confirmed | `hvr_scan.py` reports no `punctuation —` finding |
<!-- /ANCHOR:completion -->

<!-- ANCHOR:log -->
## 4. LOG

### Progress

Done. 689 lines across 147 files; 0 prose em-dashes, 0 splices, 0 out-of-scope edits.

### Deviations and findings

- **The first attempt produced comma splices and was reverted whole.** A blanket comma after every
  dash reads as a splice wherever the following clause can stand alone. Two follow-up passes tried to
  repair it and made things worse, because neither could tell its own edits from prose that was always
  there. The fix was to revert everything and do one pass with the rule right.
- **`never` and `not` are not prepositions.** A softening pass that treated them as such turned
  correct colons into splices. Both now force a colon.
- **Three sentences wrap across lines with the dash at the end.** A line-based pass cannot see them;
  they were found by scanning for a trailing dash and fixed by hand.
- **The scanner flags 835 semicolons in the same files.** Also a hard blocker under the same rules,
  and out of scope for a request that named em-dashes.
<!-- /ANCHOR:log -->
