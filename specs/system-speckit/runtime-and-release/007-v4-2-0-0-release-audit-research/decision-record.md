---
title: "Decision Record: Deep research audit of the v4.2.0.0 changelog against the commits since v4.1.0.0 and the recent spec folders"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "007-v4-2-0-0-release-audit-research operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research"
    last_updated_at: "2026-11-25T08:05:05.800Z"
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
# Decision Record: Deep research audit of the v4.2.0.0 changelog against the commits since v4.1.0.0 and the recent spec folders

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Recorded automatically: Auto, 10 iters each (Recommended) | Not stated. | None | Not linked to a requirement yet. |
| Q002 | Recorded automatically: Ship on (Recommended) | Not stated. | None | Not linked to a requirement yet. |
| Q003 | Recorded automatically: Hand-edit it (Recommended) | Not stated. | None | Not linked to a requirement yet. |
| Q004 | Recorded automatically: Two commits (Recommended) | Not stated. | None | Not linked to a requirement yet. |
| Q005 | Recorded automatically: em dash. a;s rema,e thpse woth colon to use em dash | Not stated. | None | Not linked to a requirement yet. |
| Q006 | Recorded automatically: Commit it first (Recommended) | Not stated. | None | Not linked to a requirement yet. |
| Q007 | Recorded automatically: A) Run it (Recommended) | Not stated. | None | Not linked to a requirement yet. |
| Q008 | Recorded automatically: Everything | Not stated. | None | Not linked to a requirement yet. |
| Q009 | Recorded automatically: Dangerous, 3 parallel (Recommended) | Not stated. | None | Not linked to a requirement yet. |
| Q010 | Recorded automatically: cli-pi | Not stated. | None | Not linked to a requirement yet. |
| Q011 | Fix every open Dependabot alert group on `main`: hono, aiohttp and the vendored snapshot lockfiles. | Not stated. | None | REQ-006, T022 |
| Q012 | Make Dependabot PR 108 pass and merge it into `main` before the tag moves. | Not stated. | None | REQ-006, T023 |
| Q013 | Dismiss the 12 pip alerts as not used, since their `uv.lock` files are no longer tracked and no commit can fix them. | Not stated. | Q011, for the aiohttp and vendored snapshot groups | REQ-006, T024 |
| Q014 | Fix the three CI checks already failing on `main`, then move the tag. | Not stated. | None | REQ-006, T025 |
| Q015 | Recorded automatically: Delete and update docs | Not stated. | None | Not linked to a requirement yet. |
| Q016 | Recorded automatically: Yes, delete it | Not stated. | None | Not linked to a requirement yet. |
| Q017 | Recorded automatically: A) Run it (Recommended) | Not stated. | None | Not linked to a requirement yet. |
| Q018 | Recorded automatically: Raise to 180 min (Recommended) | Not stated. | None | Not linked to a requirement yet. |
| Q019 | Replace the fixed TASK heredoc in every hub front-door example with a task file argument to compiled-route.cjs. | Not stated. | none | Remaining work F2, research/research.md section 8 |
| Q020 | Require answeredQuestions evidence to resolve a question in default depth mode, dropping the focus-equality rule there. | Not stated. | none | Remaining work P1-pre, reduce-state.cjs |
| Q021 | Keep the pre-push track-root fail-open on sweep errors and document it in the git-hooks README. | Not stated. | none | Remaining work P2-pre, git-hooks README |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:d46cd0dc-b63f-443e-8e44-4ae03af818a5:toolu_014aZHSCGhBTJRdTHvbQugms:1 -->

Question:
```text
How should /deep:research run with two executors, cli-codex luna 6 xhigh fast and cli-devin deepseek v4.1 flash max, over v4.1.0.0..HEAD plus the ~20 most recent spec folders?
```

Options:
```text
Auto, 10 iters each (Recommended)
Auto, 20 iters each
Confirm mode
No loop
```

Answer:
```text
Auto, 10 iters each (Recommended)
```

### Q002
<!-- source: claude:d46cd0dc-b63f-443e-8e44-4ae03af818a5:toolu_01FuiZ8rvF33xzEYKXKcyNdN:0 -->

Question:
```text
Stop records Claude Code question-tool answers into decision-record.md automatically, and that is on by default. Its own packet (decision-capture/001) still reads In Progress. How should v4.2.0.0 ship it?
```

Options:
```text
Ship on (Recommended)
Ship off
```

Answer:
```text
Ship on (Recommended)
```

### Q003
<!-- source: claude:d46cd0dc-b63f-443e-8e44-4ae03af818a5:toolu_01FuiZ8rvF33xzEYKXKcyNdN:1 -->

Question:
```text
The generated findings block in spec.md §7 still lists the component-list question as open, though the 12 components were added. What should happen to it?
```

Options:
```text
Hand-edit it (Recommended)
Leave it
```

Answer:
```text
Hand-edit it (Recommended)
```

### Q004
<!-- source: claude:d46cd0dc-b63f-443e-8e44-4ae03af818a5:toolu_01FuiZ8rvF33xzEYKXKcyNdN:2 -->

Question:
```text
Nothing is committed on main yet. How should it be committed?
```

Options:
```text
Two commits (Recommended)
One commit
Don't commit
```

Answer:
```text
Two commits (Recommended)
```

### Q005
<!-- source: claude:d46cd0dc-b63f-443e-8e44-4ae03af818a5:toolu_018kd6aE1gJ4qXhnrFksDmWa:1 -->

Question:
```text
Which release title format? The changelog workflow says to use an em dash, but v4.1.0.0 was published with a colon.
```

Options:
```text
Colon, like v4.1 (Recommended)
Em dash, per workflow
```

Answer:
```text
em dash. a;s rema,e thpse woth colon to use em dash
```

### Q006
<!-- source: claude:d46cd0dc-b63f-443e-8e44-4ae03af818a5:toolu_018kd6aE1gJ4qXhnrFksDmWa:2 -->

Question:
```text
The Stop hook just wrote your last three answers into the audit packet's decision-record.md, which is now uncommitted. What should happen to it before the tag?
```

Options:
```text
Commit it first (Recommended)
Leave it uncommitted
```

Answer:
```text
Commit it first (Recommended)
```

### Q007
<!-- source: claude:d46cd0dc-b63f-443e-8e44-4ae03af818a5:toolu_019YRjohRTupydWpt1YNk2zT:1 -->

Question:
```text
Run a deep research loop on "v4.2.0.0 logic and features: remaining bugs, drift and bad UX"?
/deep:research:auto "v4.2.0.0 logic and features: remaining bugs, docs that drifted from the code, and bad UX in what shipped since v4.1.0.0" --max-iterations=10
That's up to 10 iterations on the native Claude deep-research agent, written to the chosen packet's research/ folder. --max-iterations=10 is your count, and the run can stop early once it converges.
```

Options:
```text
A) Run it (Recommended)
B) Step through setup
C) No loop
```

Answer:
```text
A) Run it (Recommended)
```

### Q008
<!-- source: claude:d46cd0dc-b63f-443e-8e44-4ae03af818a5:toolu_01533yy5dh3tGi7ULzTfg6GC:2 -->

Question:
```text
What does "all" cover?
```

Options:
```text
Confirmed + nearby (Recommended)
Everything
P2s first
```

Answer:
```text
Everything
```

### Q009
<!-- source: claude:d72bb3f6-0909-44a7-99b3-69b669d33d8f:toolu_01UeJvnaCWJrJ7J9KPEomdnt:0 -->

Question:
```text
The cli-devin skill (SKILL.md, NEVER rule 1) says `--permission-mode dangerous` needs your approval for this task, and rule 15 runs one dispatch at a time unless you authorize parallel ones. Without `dangerous`, a fix worker can edit files but cannot run tests or grep, so it writes unverified edits. How should the DeepSeek flash max fix workers run in worktree 545?
```

Options:
```text
Dangerous, 3 parallel (Recommended)
Dangerous, one at a time
accept-edits only
```

Answer:
```text
Dangerous, 3 parallel (Recommended)
```

### Q010
<!-- source: claude:d72bb3f6-0909-44a7-99b3-69b669d33d8f:toolu_01LmYbSqEqXjT1D8meQCTV7K:0 -->

Question:
```text
cli-devin can't run: the probe returned "Your weekly usage quota has been exhausted" from Cognition. The same model family, DeepSeek V4.1 Flash at max effort, is reachable on other routes in the CLI hub. Which route should the fix workers use (same plan: three in parallel, write mode, I review and rerun every suite)?
```

Options:
```text
cli-opencode (Recommended)
cli-pi
Wait for Devin quota
```

Answer:
```text
cli-pi
```

### Q011
<!-- source: claude:1cf09172-5a54-4491-b11f-0d1deee0fd05:toolu_01HCBG88tASrL3tq8FuDxoN5:2 -->

Question:
```text
Which of the 22 open alerts should be fixed? 10 are hono (fix in 4.13.16) in the two shipped lockfiles: system-spec-kit and mcp-code-mode/mcp-server. 9 are aiohttp (fix in 3.14.4) in the zvec-grep benchmark uv.lock. 3 are mcp and opentelemetry-api in uv.lock files inside vendored upstream snapshots under specs/*/context/ (GraphARC-main, jev-cli-main).
```

Options:
```text
Fix all three groups (Recommended)
Fix shipped code, dismiss vendored
Fix hono only
```

Answer:
```text
Fix all three groups (Recommended)
```

### Q012
<!-- source: claude:1cf09172-5a54-4491-b11f-0d1deee0fd05:toolu_01HCBG88tASrL3tq8FuDxoN5:3 -->

Question:
```text
What should happen to Dependabot PR #108 (dev-dependency bumps: vitest, rolldown, @opencode/plugin, pi-coding-agent 1.6.0, which has a breaking change)? It fixes none of the alerts, and 7 of its CI checks fail.
```

Options:
```text
Leave it open (Recommended)
Fix it and merge
Close it
```

Answer:
```text
Fix it and merge
```

### Q013
<!-- source: claude:1cf09172-5a54-4491-b11f-0d1deee0fd05:toolu_01NaT1mu65uP253TDfo3LiCb:0 -->

Question:
```text
The 12 pip alerts (aiohttp, mcp, opentelemetry-api) name uv.lock files that are no longer in the repository. Commit 00c5a5b1a25 stopped tracking the vendored context folders, and GitHub returns 404 for all three paths on main. No commit can fix them. How should they be closed?
```

Options:
```text
Dismiss as not used (Recommended)
Leave them open
```

Answer:
```text
Dismiss as not used (Recommended)
```

### Q014
<!-- source: claude:1cf09172-5a54-4491-b11f-0d1deee0fd05:toolu_01NaT1mu65uP253TDfo3LiCb:1 -->

Question:
```text
Three CI checks were already failing on main before PR #108 and are still failing: Gate Inputs (2 pre-push tests hit "pathspec 'main' did not match"), sk-doc walk (test_readme_manifest.py, a README manifest that no longer reproduces) and spec-kit CLI vitest shards 1 and 3 (a deep-review contract test and three upgrade-legacy tests). Fix them before re-tagging v4.2.0.0?
```

Options:
```text
Re-tag now, fix later (Recommended)
Fix all three, then re-tag
```

Answer:
```text
Fix all three, then re-tag
```

### Q015
<!-- source: claude:1cf09172-5a54-4491-b11f-0d1deee0fd05:toolu_01TqRnTndtYfb1nHMdwYsRN1:1 -->

Question:
```text
INSTALL-SKILLED.md (:145, :167) and .skilled/commands/doctor/symlink.md (:60) describe the .skilled/specs link and how the doctor's auto mode treats it. Without the link, auto links .skilled as one folder in a project that has none. Should those docs change along with the deletion?
```

Options:
```text
Delete the link only (Recommended)
Delete and update docs
```

Answer:
```text
Delete and update docs
```

### Q016
<!-- source: claude:1cf09172-5a54-4491-b11f-0d1deee0fd05:toolu_017YST9DW2Rmy75Ny2JtYFiZ:0 -->

Question:
```text
specs/mcp-tooling is not on the remote (GitHub returns 404; its packets moved to specs/mcp in 614858c884c). Locally it holds only 4 ignored leftovers: three website-link.md files and one fanout.log under z_archive. Git cannot restore them once deleted. Delete the folder?
```

Options:
```text
Yes, delete it
No, keep it
```

Answer:
```text
Yes, delete it
```

### Q017
<!-- source: claude:1cf09172-5a54-4491-b11f-0d1deee0fd05:toolu_01ASn1nNxD6Ygr4B39ZMeL5x:1 -->

Question:
```text
Run a deep research loop on bugs, drift and issues in everything changed since v4.1.0.0 (1239 commits)?
```

Options:
```text
A) Run it (Recommended)
B) Step through setup
C) No loop
```

Answer:
```text
A) Run it (Recommended)
```

### Q018
<!-- source: claude:012507d7-ddbb-4b4f-9a7c-222cd8523a30:toolu_019FCupFaSkNheMYh1g4CyRA:0 -->

Question:
```text
Deep-research iteration 1 took about 15 minutes, not the 3 to 10 I estimated earlier. At that pace the run's 120-minute budget (the YAML default; your invocation didn't set it) stops the loop after about 8 of the 10 iterations you asked for. Iterations 2 onward are already running in the background. Should I raise the duration budget so all 10 iterations start? (Separately: the per-iteration timeout is already 1,800 s instead of 900 s, a change the previous session made for xhigh.)
```

Options:
```text
Raise to 180 min (Recommended)
Keep 120 min
```

Answer:
```text
Raise to 180 min (Recommended)
```

### Q019
<!-- source: claude:012507d7-ddbb-4b4f-9a7c-222cd8523a30:toolu_01HCoX4b7JxXDXJySRcM3UJ8:1 -->

Question:
```text
How should the heredoc fix stop task text from escaping into the shell? Right now every hub's compiled-route example closes stdin at a fixed `TASK` line.
```

Options:
```text
Task file argument (Recommended)
Per-call random delimiter
```

Answer:
```text
Task file argument (Recommended)
```

### Q020
<!-- source: claude:012507d7-ddbb-4b4f-9a7c-222cd8523a30:toolu_01HCoX4b7JxXDXJySRcM3UJ8:2 -->

Question:
```text
The reducer marks a research question resolved when an iteration's focus text equals it, even when that iteration's answeredQuestions is empty. The rule is documented on purpose at reduce-state.cjs:2580, and it closed Q1 after iteration 1 in this run. What should change?
```

Options:
```text
Require answer evidence (Recommended)
Keep the rule, document it
```

Answer:
```text
Require answer evidence (Recommended)
```

### Q021
<!-- source: claude:012507d7-ddbb-4b4f-9a7c-222cd8523a30:toolu_01HCoX4b7JxXDXJySRcM3UJ8:3 -->

Question:
```text
Pre-push lets the push through, with a warning, when the track-root sweep itself errors (exit 2), but the README calls the gate blocking. How should that be resolved?
```

Options:
```text
Document fail-open (Recommended)
Fail closed with bypass
```

Answer:
```text
Document fail-open (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
