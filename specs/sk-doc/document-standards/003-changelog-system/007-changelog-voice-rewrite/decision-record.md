---
title: "Decision Record: Rewrite every skill and release changelog to the Human Voice Rules with shorter sentences"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "007-changelog-voice-rewrite operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/document-standards/003-changelog-system/007-changelog-voice-rewrite"
    last_updated_at: "2026-11-19T17:36:52.593Z"
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
# Decision Record: Rewrite every skill and release changelog to the Human Voice Rules with shorter sentences

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | The voice rewrite covers the skill changelogs and the Skilled release line (1,573 files), not the deprecated packet-local changelogs under specs/. | Not stated. | none | specs/sk-doc/document-standards/003-changelog-system/007-changelog-voice-rewrite/spec.md |
| Q002 | The human-voice rule that a released changelog entry is never edited is amended so this rewrite may edit released entries. | Not stated. | none | specs/sk-doc/document-standards/003-changelog-system/007-changelog-voice-rewrite/spec.md |
| Q003 | After the rewrite, only the bodies of the 24 published GitHub releases are synced; tags are not moved. | Not stated. | none | specs/sk-doc/document-standards/003-changelog-system/007-changelog-voice-rewrite/spec.md |
| Q004 | /speckit:plan for the changelog voice rewrite runs in autonomous mode. | Not stated. | none | specs/sk-doc/document-standards/003-changelog-system/007-changelog-voice-rewrite/spec.md |
| Q005 | The planning research intent for the voice rewrite is refactor. | Not stated. | none | specs/sk-doc/document-standards/003-changelog-system/007-changelog-voice-rewrite/spec.md |
| Q006 | The 1,573-file rewrite is split into 12 phase children. | Not stated. | none | specs/sk-doc/document-standards/003-changelog-system/007-changelog-voice-rewrite/spec.md |
| Q007 | No session goal is set for the voice-rewrite planning run. | Not stated. | none | specs/sk-doc/document-standards/003-changelog-system/007-changelog-voice-rewrite/spec.md |
| Q008 | The 52 GitHub release bodies rewritten by phase 002 and the pilot are synced now with gh release edit. | Not stated. | none | specs/sk-doc/document-standards/003-changelog-system/007-changelog-voice-rewrite/spec.md |
| Q009 | After the Mistral API budget ran out in phase 006, the workers keep running through the Vibe CLI, which the operator says has usage available. | Not stated. | none | specs/sk-doc/document-standards/003-changelog-system/007-changelog-voice-rewrite/spec.md |
| Q010 | The workers may use the Vibe budget from the operator's browser login to the Vibe CLI. | Not stated. | none | specs/sk-doc/document-standards/003-changelog-system/007-changelog-voice-rewrite/spec.md |
| Q011 | Branch worktrees/401-changelog-voice-rewrite is merged to main now. | Not stated. | none | specs/sk-doc/document-standards/003-changelog-system/007-changelog-voice-rewrite/spec.md |
| Q012 | The untracked scratch folders runs/ and orig/ are deleted and failed/ is kept, because committed phase docs point to drafts in it. | Not stated. | none | specs/sk-doc/document-standards/003-changelog-system/007-changelog-voice-rewrite/spec.md |
| Q013 | The 39 skill changelogs main added or changed after the rewrite started stay in the old style for now. | Not stated. | none | specs/sk-doc/document-standards/003-changelog-system/007-changelog-voice-rewrite/spec.md |
| Q014 | All 9 remote branches except main are deleted, and PR #105 is closed too. | Not stated. | none | specs/sk-doc/document-standards/003-changelog-system/007-changelog-voice-rewrite/spec.md |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:079f7de2-cb32-4e35-b608-1c6f6425d281:toolu_017HFKWHP5s23Fj4RREJ5dgr:1 -->

Question:
```text
Which changelogs are in scope? Skill changelogs plus the Skilled release line are 1,573 files (about 1.0M tokens of text). Old packet-local changelogs under specs/ are another 1,637 files (about 2.1M tokens), deprecated, and the earlier retrofit excluded them.
```

Options:
```text
Skills and release line (Recommended)
Also packet-local changelogs
```

Answer:
```text
Skills and release line (Recommended)
```

### Q002
<!-- source: claude:079f7de2-cb32-4e35-b608-1c6f6425d281:toolu_017HFKWHP5s23Fj4RREJ5dgr:2 -->

Question:
```text
The human-voice rules say a released changelog entry is never edited (scope-and-exemptions.md section 3, SKILL.md NEVER 2). This rewrite edits all of them. How should the spec handle that?
```

Options:
```text
Record the exception in the packet (Recommended)
Amend the rule
```

Answer:
```text
Amend the rule
```

### Q003
<!-- source: claude:079f7de2-cb32-4e35-b608-1c6f6425d281:toolu_017HFKWHP5s23Fj4RREJ5dgr:3 -->

Question:
```text
24 Skilled release entries have published GitHub releases. After a rewrite, what should happen to them?
```

Options:
```text
Sync release bodies only (Recommended)
Sync bodies and republish tags
Leave releases alone
```

Answer:
```text
Sync release bodies only (Recommended)
```

### Q004
<!-- source: claude:079f7de2-cb32-4e35-b608-1c6f6425d281:toolu_01EMptGxNMx6Lj4mxShsT65g:0 -->

Question:
```text
/speckit:plan setup for the changelog voice rewrite. Which execution mode? Autonomous runs the 7 planning steps without pausing. Interactive stops for approval after each step.
```

Options:
```text
Autonomous (Recommended)
Interactive
```

Answer:
```text
Autonomous (Recommended)
```

### Q005
<!-- source: claude:079f7de2-cb32-4e35-b608-1c6f6425d281:toolu_01EMptGxNMx6Lj4mxShsT65g:1 -->

Question:
```text
What kind of work is this, for the planning research intent?
```

Options:
```text
refactor (Recommended)
add_feature
```

Answer:
```text
refactor (Recommended)
```

### Q006
<!-- source: claude:079f7de2-cb32-4e35-b608-1c6f6425d281:toolu_01EMptGxNMx6Lj4mxShsT65g:2 -->

Question:
```text
Split the 1,573-file rewrite into phase children? The earlier retrofit used one tooling-and-pilot phase, then one phase per skill.
```

Options:
```text
Yes, 12 phases (Recommended)
Yes, 4 phases
No phases
```

Answer:
```text
Yes, 12 phases (Recommended)
```

### Q007
<!-- source: claude:079f7de2-cb32-4e35-b608-1c6f6425d281:toolu_01EMptGxNMx6Lj4mxShsT65g:3 -->

Question:
```text
Set a session goal for this planning run?
```

Options:
```text
Skip (Recommended)
Offer a goal
```

Answer:
```text
Skip (Recommended)
```

### Q008
<!-- source: claude:079f7de2-cb32-4e35-b608-1c6f6425d281:toolu_01ThUejjLjy3dx1zYh2ae2QP:0 -->

Question:
```text
Phase 002 rewrote 51 Skilled release notes, and the pilot had already rewritten 2. 52 of those 53 have a published GitHub release (v1.0.0.0 has none). The spec says to sync those release bodies with `gh release edit`; tags do not move. Each body is replaced by its entry's new text, and I save every current body to scratch first so any one can be put back. Sync the 52 GitHub release bodies now?
```

Options:
```text
Sync now (Recommended)
Defer to the end
Don't sync
```

Answer:
```text
Sync now (Recommended)
```

### Q009
<!-- source: claude:079f7de2-cb32-4e35-b608-1c6f6425d281:toolu_01896PGm7y7c6CDyCoBPgCMY:0 -->

Question:
```text
The Mistral API budget ran out during phase 006 (HTTP 402 'API budget exhausted' from 14:20). Every DeepSeek Flash worker call through Vibe failed after that. Phase 006 kept 4 rewrites; the other 206 files are untouched and match the commit. Phases 001-005 are done and pushed. I've fixed the driver so a 402 now stops the run instead of working through the list. How should I continue?
```

Options:
```text
I'll top up, then resume
Pause the program
```

Answer:
```text
we have usage through .vibe vibe cli
```

### Q010
<!-- source: claude:079f7de2-cb32-4e35-b608-1c6f6425d281:toolu_016VsrfwaegE1qEGSPSigQMH:0 -->

Question:
```text
I tested the Vibe CLI directly with the repo's own setup. One call with deepseek-flash, a fresh home and the rendered hooks returned the same 'Status 402: API budget exhausted'. The repo's .vibe/config.toml sends both roster models through provider 'mistral' with MISTRAL_API_KEY. Mistral's account record for that key says plan_type 'api' and has_paid_vibe_entitlement false, so I found no separate Vibe-plan usage. How should I continue?
```

Options:
```text
I'll fix billing, then resume
Pause and commit what's done
```

Answer:
```text
i logged into with browser, you can use vibe budget
```

### Q011
<!-- source: claude:079f7de2-cb32-4e35-b608-1c6f6425d281:toolu_019PjzvZcXear65g7vskWUJZ:0 -->

Question:
```text
The changelog voice rewrite is finished and pushed on branch worktrees/401-changelog-voice-rewrite (12 phases, 1,571 changelogs). The 52 GitHub release pages already show the rewritten text, but main still has the old changelog files. Should I merge the branch into main now?
```

Options:
```text
Merge to main now (Recommended)
Leave it unmerged
```

Answer:
```text
Merge to main now (Recommended)
```

### Q012
<!-- source: claude:079f7de2-cb32-4e35-b608-1c6f6425d281:toolu_019PjzvZcXear65g7vskWUJZ:1 -->

Question:
```text
The rewrite left three untracked scratch folders in the program's scratch/ folder: runs/ (worker logs), orig/ (copies of the original changelogs) and failed/ (rejected drafts). Committed phase docs point to drafts in failed/. What should happen to them?
```

Options:
```text
Delete runs/ and orig/, keep failed/ (Recommended)
Keep all three
Delete all three
```

Answer:
```text
Delete runs/ and orig/, keep failed/ (Recommended)
```

### Q013
<!-- source: claude:079f7de2-cb32-4e35-b608-1c6f6425d281:toolu_019uzyi4QxNxSjuGAZRZFdu1:2 -->

Question:
```text
Main added or changed 39 skill changelog files after this rewrite started, for example deep-review v1.11.17.0. They are in the old style and were not rewritten. What should happen to them?
```

Options:
```text
Leave them for now (Recommended)
Rewrite them as phase 013
```

Answer:
```text
Leave them for now (Recommended)
```

### Q014
<!-- source: claude:079f7de2-cb32-4e35-b608-1c6f6425d281:toolu_01WbZWytDngTMvnBonCWpDAJ:0 -->

Question:
```text
Deleting 9 remote branches (all except main). 8 have their content in main: worktrees/314, 316, 321, 324, 334 and 401, plus two dependabot branches (vite-8.3.4, and the pi npm-security one whose PR #95 was merged). The 9th, the mcp-code-mode dependabot branch, is open PR #105 and isn't merged; deleting it closes that PR. Worktrees 314, 316 and 334 are still on this machine; their local branches stay, only the remote copies go. Undo: I saved every branch tip and can recreate any with `git push origin <sha>:refs/heads/<branch>`. Which should I delete?
```

Options:
```text
All 8 merged, keep PR #105 (Recommended)
All 9, close PR #105 too
Cancel
```

Answer:
```text
All 9, close PR #105 too
```

<!-- /ANCHOR:operator-answers-verbatim -->
