---
title: "Decision Record: Hand-over doc alignment: fix the 58 findings of the doc alignment run and add vibe to the loop shell shim"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "049-handover-doc-alignment operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-handover/002-session-handover-loop/049-handover-doc-alignment"
    last_updated_at: "2026-11-16T09:23:10.367Z"
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
# Decision Record: Hand-over doc alignment: fix the 58 findings of the doc alignment run and add vibe to the loop shell shim

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Findings in the READMEs worktree 411 rewrites go to that session; every other finding is fixed in this packet. | Not stated. | None | REQ-003, AC-003 |
| Q002 | Check whether Vibe is really integrated into the loop shell shim before choosing code or docs. | Not stated. | None | plan.md affected surfaces |
| Q003 | Add vibe to skilled-loop-shell.sh with shim test cases instead of changing the docs. | Not stated. | None | REQ-002, AC-002, .skilled/bin/skilled-loop-shell.sh |
| Q004 | Resolve the guards-and-hooks.md version conflict to main plus one bump, 1.3.9.0. | Not stated. | None | tasks.md T008 |
| Q005 | The alignment run checks that all hand-over docs (READMEs and other md files) match the current session-handover logic; the fixes land in new child 049, and a local command for the check is built in the git-ignored specs/other/007-local-doc-alignment. | Not stated. | none | specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/049-handover-doc-alignment/spec.md |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:b726ec67-1d85-4833-b219-c038e184d696:toolu_01CBGWuqNtHMZ2fqbdvj3Rt9:2 -->

Question:
```text
Worktree 411 (another session) is rewriting almost every hook README: .claude/.codex/.pi hooks READMEs, .skilled/hooks/README.md, coverage-rationale.md and the session-handover README, which it splits into five docs. About 12 findings land in those files. How should those be handled?
```

Options:
```text
Send them to 411 (Recommended)
Fix all on main anyway
Wait for 411 to land
```

Answer:
```text
Send them to 411 (Recommended)
```

### Q002
<!-- source: claude:b726ec67-1d85-4833-b219-c038e184d696:toolu_01CBGWuqNtHMZ2fqbdvj3Rt9:3 -->

Question:
```text
skilled-loop-shell.sh wraps claude, pi, opencode, codex, devin and cursor but not vibe, while some docs say a plain vibe launch runs under the wrapper. Fix the code or the docs?
```

Options:
```text
Fix the docs (Recommended)
Add vibe to the shim
```

Answer:
```text
check if its actually integrated into skilled loop shell
```

### Q003
<!-- source: claude:b726ec67-1d85-4833-b219-c038e184d696:toolu_01SH3R4mvVsEb1FVFyhjXbFY:0 -->

Question:
```text
Vibe works through the skilled-loop wrapper but was left out of skilled-loop-shell.sh (no vibe function, not in the resolver's runtime list, no shim test), apparently by omission. Which way should the 049 fix go?
```

Options:
```text
Add vibe to the shim (Recommended)
Fix the docs only
```

Answer:
```text
Add vibe to the shim (Recommended)
```

### Q004
<!-- source: claude:b726ec67-1d85-4833-b219-c038e184d696:toolu_01A1xk2HMMsLvozJSV3YhkTy:0 -->

Question:
```text
Merging main into worktree 424 hit one conflict: the version line of cli-mistral-vibe/references/guards-and-hooks.md (ours 1.3.7.0 from the auto-bump, main 1.3.8.0 from the Vibe hook review packet). The doc text merged cleanly. How should it be resolved?
```

Options:
```text
Take main, bump once (Recommended)
Take main's 1.3.8.0
Abort the merge
```

Answer:
```text
Take main, bump once (Recommended)
```

### Q005
<!-- source: claude:b726ec67-1d85-4833-b219-c038e184d696:toolu_01Mnv28WA2vypixxSV6juFR2:0 -->

Question:
```text
The HEAD scope holds only 3 uncommitted files from other sessions (.pi/settings.json and two description.json files), with 0 commits, so it would not check any of the 048 hand-over work. What should the alignment run check?
```

Options:
```text
048 range (Recommended)
Approve HEAD as-is
Cancel
```

Answer:
```text
We just need tp make sure all docs mds reassmes etc are alligned with current state of session handover logic
```

<!-- /ANCHOR:operator-answers-verbatim -->
