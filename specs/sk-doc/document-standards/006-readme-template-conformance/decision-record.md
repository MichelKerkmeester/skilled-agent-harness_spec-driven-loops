---
title: "Decision Record: README template conformance"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "006-readme-template-conformance operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/document-standards/006-readme-template-conformance"
    last_updated_at: "2026-11-16T15:44:17.036Z"
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
# Decision Record: README template conformance

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Hook code folder READMEs join as phase 007 and phase 006 writes a new .vibe/README.md. | Not stated. | None | ../spec.md Files to Change |
| Q002 | Phase 007 also rewrites the hooks library README at .skilled/hooks/README.md, last. | Not stated. | None | ../007-hook-code-folder-readmes/spec.md |
| Q003 | README writers and reviewers run as DeepSeek V4.1 Flash at max through cli-opencode instead of Opus agents. | Not stated. | None | plan.md Key Components, implementation-summary.md Key Decisions, ../goal.md D4 |
| Q004 | Phase 003 edits the skill-advisor symlink's target, .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md, in place to the hook template. | Not stated. | None | 003-hook-folder-readmes/plan.md |
| Q005 | From the end of phase 002, README writers and reviewers run as GPT-6 Luna at max on the fast tier through cli-codex instead of DeepSeek V4.1 Flash. | Not stated. | Q003 | ../goal.md D4 |
| Q006 | When the codex usage limit stopped phase 004 with a reset three hours away, writers and reviewers switch executor at once. The operator named the executor in chat as "deepseek flash max cli devin": DeepSeek V4.1 Flash Max (`deepseek-v4-1-flash-1017-max`) through cli-devin. | Not stated. | Q005 | ../goal.md D4, 004-hook-runtime-readmes/plan.md Key Components |
| Q007 | Devin writers and reviewers run in `dangerous` permission mode, four sessions at a time, each killed by its own PID. | `auto` mode refuses the shell commands both roles need to run their checks. | None | 004-hook-runtime-readmes/plan.md Key Components |
| Q008 | When devin's daily quota ran out at 08:19, the operator asked to keep DeepSeek Flash Max on devin. A probe of both DeepSeek Flash Max ids returned `resource_exhausted`, so the question was asked again. | Not stated. | None | Q009 |
| Q009 | Writers and reviewers run DeepSeek V4.1 Flash at max through cli-opencode on the OpenCode Go route (`opencode-go/deepseek-v4.1-flash#max`). | Not stated. | Q006 | ../goal.md D4, 004-hook-runtime-readmes/plan.md Key Components |
| Q010 | The README alert and fold conventions run as phase 008 of this program, not as a new packet. | Not stated. | None | ../goal.md D3, 008-readme-html-conventions/spec.md |
| Q011 | The repo-rules folder README runs as phase 009 of this program, and the repo-rules checker and card builder skip a README in that folder so it can exist. | Not stated. | None | ../goal.md D3, 009-repo-rules-readme/spec.md |
| Q012 | Phase 010 writers and reviewers run Hy4 Flash Free at high through cli-opencode (`opencode-go/hy4-flash-free#high`), one README per session. The operator named it in chat as "Hy4 flash high free". | Not stated. | Q009 for phase 010 | ../goal.md D4, 010-readme-text-diagrams/plan.md Key Components |
| Q013 | README diagrams go back to box-drawing text, run as phase 010 of this program. The skill README template and the README rules ask for a text diagram and rule out Mermaid, and the 55 Mermaid blocks are redrawn. The operator asked to "revert to like we always did markdown diagrams". | Not stated. | None | ../goal.md D3, 010-readme-text-diagrams/spec.md |
| Q014 | The README follow-ups run as phase 011. The operator answered "fix all" to the review of the open items, which also settles the `SKILL.md` question: the `SKILL.md` template stops asking for Mermaid, a template-only change because no `SKILL.md` uses it. README edits keep Q012's executor, Hy4 Flash Free at high, one writer and one reviewer session per README. | Not stated. | None | ../goal.md D3 and D4, 011-readme-guards/spec.md |
| Q015 | The 4 stale generated trigger-index files in the primary checkout are discarded so origin/main can merge. | Not stated. | none | 007-hook-code-folder-readmes (commit ddacb0a2bf9) |
| Q016 | The four uncommitted generated trigger-index files are discarded and local main takes origin's versions. | Not stated. | none | 010-readme-text-diagrams |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:337e2d66-377c-4a62-99f7-86910ae24591oolu_01RdW8gGhhSUQZqf9H1TeRx7:2 -->

Question:
```text
Two scope items fall outside the six template families as the note counted them. Which should the program include? Pick none to keep the six families only.
```

Options:
```text
Hook code folders
New .vibe/README.md
```

Answer:
```text
Hook code folders, New .vibe/README.md
```

### Q002
<!-- source: claude:337e2d66-377c-4a62-99f7-86910ae24591oolu_01B5CZNpDQg4L2uaQWGbcpuc:1 -->

Question:
```text
The hooks library README at .skilled/hooks/README.md holds the switch index and the coverage matrix the other hook READMEs link to. The hook template sends it to the code-folder template. Should phase 007 rewrite it too?
```

Options:
```text
Include it (Recommended)
Leave it out
```

Answer:
```text
Include it (Recommended)
```

### Q003
<!-- source: claude:f7735347-b0b1-4b4f-a0cd-c44e70a362ab:toolu_014pYMtgckDpEUbqizwCjbx8:1 -->

Question:
```text
The plan asks for five parallel Opus writer batches. Under :auto the implement workflow falls back to direct work, and its @markdown agent runs on Haiku. How should phase 001 dispatch the writing?
```

Options:
```text
Opus-high writers (Recommended)
Follow the YAML as written
```

Answer:
```text
use deepseek flash max agents
```

### Q004
<!-- source: claude:256db329-443e-4697-8e43-b3b7f7c74ec6:toolu_01VBY7nfexELS9MFKGCK9LqZ:0 -->

Question:
```text
Phase 003 (hook folder READMEs) has 4 symlinks. Three are fine: git-preflight and git-message-gate both point to sk-git/scripts/hooks/README.md, and spec-gate points to a spec-kit runtime README. All three already match the hook template. The fourth, .skilled/hooks/skill-advisor/README.md, points to .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md. That is a skill reference doc AGENTS.md cites by path. It passes the validator and voice scan, but its sections differ from the hook template. D3 puts docs outside .skilled/hooks/ out of scope. How should 003 treat it?
```

Options:
```text
Edit target in place (Recommended)
Leave it as is
Replace the symlink
```

Answer:
```text
Edit target in place (Recommended)
```

### Q005
<!-- source: claude:256db329-443e-4697-8e43-b3b7f7c74ec6:toolu_01TuvkhWhwEZzwxrydHJkDdQ:0 -->

Question:
```text
The DevPass (LLM Gateway) plan hit its daily cap ($14.22 per rolling 24 hours), so DeepSeek V4.1 Flash, the writer and reviewer model D4 names, now fails every call. The ClinePass and direct-provider routes to it refused too (403 and 'not available on coding plans'). Phase 002 used about one day's cap for 41 READMEs (82 sessions). Phases 003 to 007 still hold 129 READMEs (about 258 sessions), so DeepSeek-only would take roughly three more days of cap. How should the writers and reviewers run from here?
```

Options:
```text
Wait for the cap (Recommended)
Claude subagents instead
Mixed: Claude reviews only
```

Answer:
```text
use luna max fast cli codex
```

### Q006
<!-- source: claude:8d8133eb-b573-4b60-8bba-186b349d3926:toolu_01B7cUUCd4wq1A8bbmxnqgCR:0 -->

Question:
```text
The codex (GPT-6 Luna) usage limit stopped the phase 004 drive at 07:43. It resets at 10:38 AM. No writer changed a file. How should the 46 remaining runtime adapter READMEs proceed?
```

Options:
```text
Wait for reset (Recommended)
Switch executor now
Pause the program
```

Answer:
```text
Switch executor now
```

The follow-up question naming the executor was declined, and the operator typed the executor in chat instead:
```text
deepseek flash max cli devin
```

### Q007
<!-- source: claude:8d8133eb-b573-4b60-8bba-186b349d3926:toolu_0127FSJZgx2or54fYeond3ZZ:0 -->

Question:
```text
cli-devin's SKILL.md (§4 NEVER rule 1 and ALWAYS rule 15) needs two approvals for the 46 remaining phase 004 READMEs on deepseek-v4-1-flash-1017-max: (1) `--permission-mode dangerous` for writers and reviewers, because `auto` refuses the shell commands both need to run checks. Reviewers are told to write nothing, and I diff the tree after each wave. (2) Four devin sessions at once, in waves, each killed by its own PID. Approve both for this phase?
```

Options:
```text
Approve both (Recommended)
Dangerous, one at a time
Writers only dangerous
```

Answer:
```text
Approve both (Recommended)
```

### Q008
<!-- source: claude:8d8133eb-b573-4b60-8bba-186b349d3926:toolu_01362k9N9MMSRVdAQ9GUzJaT:0 -->

Question:
```text
Devin's daily usage quota ran out at 08:19, so DeepSeek V4.1 Flash Max can't run. 15 of the 47 phase 004 READMEs are written and reviewed; 32 remain, and no file was left half-written. Codex (GPT-6 Luna) resets at 10:38. How should the remaining 32 proceed?
```

Options:
```text
Codex at 10:38 (Recommended)
Devin swe-2-max now
Claude subagents now
```

Answer:
```text
Deepseek flash max cli devin
```

### Q009
<!-- source: claude:8d8133eb-b573-4b60-8bba-186b349d3926:toolu_01DGKqEN8uRPnR78ko66edaz:0 -->

Question:
```text
DeepSeek Flash Max on devin can't run right now. I just probed both deepseek-v4-1-flash-1017-max and deepseek-v4-flash-max, and both returned 'Your daily usage quota has been exhausted' (resource_exhausted), with no reset time. Devin says to buy on-demand usage or turn on auto-reload at https://app.devin.ai/settings/usage. What should I do?
```

Options:
```text
I'll top up devin
Poll devin hourly
Codex at 10:38 (Recommended)
```

Answer:
```text
Cli opencode with opencode go
```

### Q015
<!-- source: claude:3984aaec-9181-4f22-ae90-fe5d131a5589:toolu_01FvjrFkaCjW3dRkakDYDGqQ:0 -->

Question:
```text
Phase 007 is committed locally (ddacb0a2bf9), but merging origin/main is blocked by 4 uncommitted generated files in the primary checkout: trigger-index.json and three retrieval fixtures under system-spec-kit. They have been dirty since before this session's work, and origin/main already carries a newer index rebuild (4458e492e6a). sk-git forbids me from stashing or resetting a shared checkout on my own. How should I clear them so I can merge and push?
```

Options:
```text
Discard them (Recommended)
Stash them, keep the stash
I'll clear them myself
```

Answer:
```text
Discard them (Recommended)
```

### Q016
<!-- source: claude:3984aaec-9181-4f22-ae90-fe5d131a5589:toolu_0164wTJstJybMxEuoBiYfcTp:0 -->

Question:
```text
Local main can't fast-forward to origin/main: four generated trigger-index files (trigger-index.json and three retrieval fixtures) have uncommitted edits from another session, and origin/main changed them too. Everything else in the goal holds. How do you want to clear them?
```

Options:
```text
Discard, take origin (Recommended)
Wait for the other session
```

Answer:
```text
Discard, take origin (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
