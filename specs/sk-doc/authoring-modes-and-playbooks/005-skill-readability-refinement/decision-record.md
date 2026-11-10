---
title: "Decision Record: Manually check and refine every skill and mode for readability, layout and structure"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "066-skill-readability-refinement operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/authoring-modes-and-playbooks/005-skill-readability-refinement"
    last_updated_at: "2026-11-05T05:22:34.630Z"
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
# Decision Record: Manually check and refine every skill and mode for readability, layout and structure

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Luna audits and DeepSeek fixes each skill or mode phase. | Later replaced by goal decision D1, DeepSeek V4.1 Flash only. | None | specs/sk-doc/authoring-modes-and-playbooks/005-skill-readability-refinement/goal.md |
| Q002 | Only cli-opencode, cli-pi and cli-codex run the work; the Devin CLI is never used. | Not stated. | None | specs/sk-doc/authoring-modes-and-playbooks/005-skill-readability-refinement/goal.md D1 |
| Q003 | An overview section was to be added to the two Style Reference DESIGN.md files. | Not stated. | None | specs/sk-doc/authoring-modes-and-playbooks/005-skill-readability-refinement/007-sk-design |
| Q004 | Every remaining skill gets one independent opus-medium review of its diff before its commit. | Not stated. | None | specs/sk-doc/authoring-modes-and-playbooks/005-skill-readability-refinement/goal.md D4 |
| Q005 | The dispatcher keeps its cap at five leaf workers. | Not stated. | None | specs/sk-doc/authoring-modes-and-playbooks/005-skill-readability-refinement/010-sk-prompt/scratch/tools/dispatch-v6.sh |
| Q006 | A fresh opus-medium agent investigates the Style Reference conflict before a choice is made. | Not stated. | None | specs/sk-doc/authoring-modes-and-playbooks/005-skill-readability-refinement/007-sk-design |
| Q007 | validate_document.py skips only assets/style-reference/<name>/DESIGN.md, which code reads by heading and hash. | Not stated. | the add-an-overview answer for the Style References | .skilled/skills/sk-doc/shared/scripts/validate_document.py |
| Q008 | sk-create-goal's three goal templates gain the FILL lines goal.md.tmpl carries. | Not stated. | None | specs/sk-doc/authoring-modes-and-playbooks/005-skill-readability-refinement/008-sk-doc/009-sk-create-goal |
| Q009 | Docs whose exact text code depends on are listed in the render ledger's exempt map and skipped by the render check. | Not stated. | None | .skilled/skills/sk-doc/sk-create-skill/scripts/render-known-debt.json |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78:toolu_018KR2ix6ep43EVeSRt1QRww:1 -->

Question:
```text
How should the two executors split each skill or mode phase? Luna 6 xhigh fast runs on cli-codex; DeepSeek V4.1 Flash high runs on cli-pi as llmgateway/deepseek-v4.1-flash-1017 (DevPass, metered per token).
```

Options:
```text
Luna audits, DeepSeek fixes (Recommended)
Both audit, DeepSeek fixes
Split the skills
```

Answer:
```text
Luna audits, DeepSeek fixes (Recommended)
```

### Q002
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78:toolu_01X1LongPfu82MCdURM3ogxd:0 -->

Question:
```text
"Only cli pi, opencode and codex": do you mean which CLIs run the work, or which cli-external-orchestration mode docs get refined? Right now no Devin CLI is used: every call is cli-opencode (DeepSeek max, audit/review) or cli-pi (DeepSeek high, fixes); 'cli-devin' is only the name of the mode whose docs are being refined.
```

Options:
```text
Executors only
Mode scope
Both
```

Answer:
```text
Executors only
```

### Q003
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78:toolu_01CdA5fbun4NQSbjVLFyfBAb:0 -->

Question:
```text
Two DESIGN.md Style References fail validation for a missing overview section: sk-design-chart's `assets/style-reference/evilcharts/DESIGN.md` and sk-design-diagram's `assets/style-reference/harness-diagram/DESIGN.md`. Both are unchanged from HEAD, and the DESIGN.md format has no overview section. `validate_document.py` already exempts the format spec and its four example DESIGN.md files for this reason (FORMAT_SPEC_FILES). The completion criteria need invalid=0. How should I handle them?
```

Options:
```text
Exempt in validator (Recommended)
Add an overview section
Leave them invalid
```

Answer:
```text
Add an overview section
```

### Q004
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78:toolu_01CdA5fbun4NQSbjVLFyfBAb:1 -->

Question:
```text
The first round of independent opus-medium reviews found misses my own diff reads didn't catch: a reordered procedure in system-spec-kit and a dropped paragraph in cli-jev. Should every remaining skill get one opus-medium review of its diff before its commit?
```

Options:
```text
Yes, every skill (Recommended)
Only large skills
No, my read only
```

Answer:
```text
Yes, every skill (Recommended)
```

### Q005
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78:toolu_01CdA5fbun4NQSbjVLFyfBAb:2 -->

Question:
```text
The dispatcher holds total leaf workers at 5. At 5 there have been no 429s and no slowdown per step. Should I raise the cap? The long leaves left are sk-code-skilled (73 files), sk-design-diagram (62) and sk-doc's 15 modes.
```

Options:
```text
Keep 5
Raise to 7
```

Answer:
```text
Keep 5
```

### Q006
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78:toolu_01RjkmzAfDLwusgAxxKfFMvA:0 -->

Question:
```text
I tried adding the overview to evilcharts/DESIGN.md and found a conflict. A `## 1. OVERVIEW` heading makes the file valid, but then it has 5 render warnings, 'unnumbered H2 among numbered peers'. Numbering the other sections would break `sk-design-chart/scripts/apply-design-md.cjs`, which finds sections by exact text such as `## Tokens — Colors`, and the DESIGN.md format the generator writes. I've put the file back to HEAD. Which way should I go?
```

Options:
```text
Exempt in validator (Recommended)
Number all and update parser
Leave them invalid
```

Answer:
```text
ask fresh opus medium to investigate
```

### Q007
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78:toolu_017QQNs46jXPxojcAtAh83w9:0 -->

Question:
```text
The investigation found that evilcharts/DESIGN.md is hash-pinned in palettes.json and origin.md (I confirmed it), so any edit, an overview included, fails the chart corpus gate. The DESIGN.md format spec also says these headings are rendered verbatim and read by both apply-design-md.cjs scripts. Its recommendation: a narrow rule in validate_document.py that skips any DESIGN.md under assets/style-reference/<name>/, plus a test. That rule matches exactly these 2 files, and the 1,290 styles/library bundle DESIGN.md files are not matched. Should I make that change?
```

Options:
```text
Narrow style-reference rule (Recommended)
List the two paths
Leave them invalid
```

Answer:
```text
Narrow style-reference rule (Recommended)
```

### Q008
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78:toolu_019hAZLpfdmWDZb4tAceNiim:0 -->

Question:
```text
sk-create-goal's template-parity test fails 3 of 32 because its three goal asset templates lack the FILL line system-spec-kit's goal.md.tmpl gained on 2026-10-26 (fails at the program's base commit too). Its README row claims a green run, and that row now blocks the sk-create-goal leaf and the sk-doc commit. How should I handle it?
```

Options:
```text
Fix the drift (Recommended)
Record as known failure
Restore HEAD wording
```

Answer:
```text
Fix the drift (Recommended)
```

### Q009
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78:toolu_01JZ1UqLhp6tUXLBACfufnFg:0 -->

Question:
```text
Four deep-loop asset files can't reach 0 render warnings through doc edits alone, because code depends on their exact text: (1) the lettered H2s 6A/10A/11A in deep-research's dashboard and strategy templates and 2A/10A in deep-review's, which reduce-state.cjs writes verbatim and vitest asserts; (2) deep-review's review-mode-contract-snapshot.md, generated by render-contract-snapshot.cjs, which emits no overview; (3) deep-ai-council's prompt-pack-round.md, sent whole as every seat's prompt, which has no overview and unnumbered H2s. The goal requires an empty debt object, which conflicts with D2 (form only; tests are out of scope). How should these be handled?
```

Options:
```text
Keep as debt (Recommended)
Change the code
Exempt runtime files
```

Answer:
```text
Exempt runtime files
```

<!-- /ANCHOR:operator-answers-verbatim -->
