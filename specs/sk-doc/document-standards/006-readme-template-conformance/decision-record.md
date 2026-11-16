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

<!-- /ANCHOR:operator-answers-verbatim -->
