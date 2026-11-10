---
title: "Decision Record: Setup guide for using Skilled in your own project"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "006-setup-guide operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/001-skill-and-overlay-build/006-setup-guide"
    last_updated_at: "2026-11-08T16:05:32.697Z"
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
# Decision Record: Setup guide for using Skilled in your own project

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Fix the gaps in both Skilled's engine and docs and in Barter's overlay manifest. | Not stated. | None | specs/system-skilled-doctor/001-skill-and-overlay-build/005-barter-parity spec.md §3 |
| Q002 | Open a follow-up packet for the OpenCode worker that wrote into the main checkout. | Not stated. | None | specs/cli-external-orchestration/087-opencode-worktree-confinement |
| Q003 | Add a changelog entry and a system-skilled-doctor version bump for the overlay work. | Not stated. | None | system-skilled-doctor changelog v1.1.0.0 |
| Q004 | Fix every CI failure main already had before merging. | Not stated. | None | 005-barter-parity tasks.md T023 |
| Q005 | Document the two outside defects in two new packets. | Not stated. | None | specs/system-speckit/045-upgrade-level-anchor-insert, specs/sk-git/worktree-lifecycle/006-provision-private-command-links |
| Q006 | Add changelog entries for the follow-up fixes before pushing. | Not stated. | None | sk-git v1.11.11.0, system-spec-kit v2.12.36.0, cli-opencode v1.5.9.0, deep-loop runtime v1.9.16.0 |
| Q007 | Write the setup guide as a root SETUP.md and trim the README's setup sections. | Not stated. | None | 006-setup-guide spec.md §3, INSTALL-SKILLED.md (renamed from SETUP.md) |
| Q008 | Fix the two first-link problems in a new packet. | Not stated. | None | specs/system-skilled-doctor/002-symlink-first-link |
| Q009 | Fix every finding of the Sonnet writing review and push to main. | Not stated. | None | commit 6370817c2a |
| Q010 | Replace Barter with neutral names in the skill docs and keep the spec packets as the record. | Not stated. | None | system-skilled-doctor references/overlays.md examples |
| Q011 | Update the v4.0.2.0 notes, delete the tag and republish the release. | Not stated. | None | .skilled/changelog/skilled/v4.0.2.0.md, GitHub release v4.0.2.0 |
| Q012 | Make all four doc-tooling fixes: README prose, release amend, merge-aware bump and HVR proper names. | Not stated. | None | specs/sk-doc/doc-validation-tooling/004-doc-tooling-prose-and-release-amend |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:b2bc3af2-2d66-4d13-9d70-784e628579d2:toolu_01WSHqCfJqNCLKoW6MzKKkn7:2 -->

Question:
```text
Scope: the gaps are in Skilled's engine and docs (no .dsh in re-pin, no fork-drifted state, missing runbook steps, docs that only advertise linking) and in Barter's setup (no .skilled-overlays.json, no protectedPaths, no repin block). Which side should I change?
```

Options:
```text
Skilled only (Recommended)
Skilled + Barter
```

Answer:
```text
Skilled + Barter
```

### Q002
<!-- source: claude:b2bc3af2-2d66-4d13-9d70-784e628579d2:toolu_01R9g3pxhxBSfanYkFFJQVAy:1 -->

Question:
```text
Q8: one OpenCode DeepSeek worker started in the worktree but wrote into the main checkout (/Users/michelkerkmeester/MEGA/Development/Skilled). I reverted it by hand. How should this be handled?
```

Options:
```text
Log only (Recommended)
Open a follow-up packet
Fix it in this packet
```

Answer:
```text
Open a follow-up packet
```

### Q003
<!-- source: claude:b2bc3af2-2d66-4d13-9d70-784e628579d2:toolu_01R9g3pxhxBSfanYkFFJQVAy:2 -->

Question:
```text
Q9: this overlay/re-pin work has no changelog entry and no system-skilled-doctor version bump yet. Add them?
```

Options:
```text
Add both (Recommended)
Changelog only
Neither
```

Answer:
```text
Add both (Recommended)
```

### Q004
<!-- source: claude:b2bc3af2-2d66-4d13-9d70-784e628579d2:toolu_01R9g3pxhxBSfanYkFFJQVAy:3 -->

Question:
```text
Q10: CI has failures that main already has: the 6 agents-md doctor tests, 2 playbook SKIP_BLOCKER_MISSING lines, and the README link to runtime/ENV-REFERENCE.md. Fix any of them here?
```

Options:
```text
Leave them (Recommended)
Fix playbook + README
Fix all
```

Answer:
```text
Fix all
```

### Q005
<!-- source: claude:b2bc3af2-2d66-4d13-9d70-784e628579d2:toolu_01RVqnYrfFaVLTQUzCaUWXLG:0 -->

Question:
```text
Where should the spec docs for the two defects outside this work go? The first is spec-kit's upgrade-level.sh putting the Level 2 sections inside the questions anchor. The second is sk-git's worktree setup linking the private local-* commands so a new worktree can't commit. All work stays in worktree 324.
```

Options:
```text
Two new packets (Recommended)
One new packet
Fold into 087
```

Answer:
```text
Two new packets (Recommended)
```

### Q006
<!-- source: claude:b2bc3af2-2d66-4d13-9d70-784e628579d2:toolu_01NEbyGLUDqK8p1dwsUqhme6:1 -->

Question:
```text
These fixes change behavior in sk-git, cli-opencode, system-spec-kit and system-deep-loop, and none of them has a changelog entry or version bump. Add them?
```

Options:
```text
Add before push (Recommended)
Leave for release
```

Answer:
```text
Add before push (Recommended)
```

### Q007
<!-- source: claude:b2bc3af2-2d66-4d13-9d70-784e628579d2:toolu_01Q5dLwke4bScaFF16fKLWRS:0 -->

Question:
```text
Build the setup guide and trim the root README's setup sections (§4 'Use It In Your Own Project' and all of §5) down to a short pointer?
```

Options:
```text
Root SETUP.md (Recommended)
Inside the doctor skill
Not now
```

Answer:
```text
Root SETUP.md (Recommended)
```

### Q008
<!-- source: claude:b2bc3af2-2d66-4d13-9d70-784e628579d2:toolu_01HRKBR2qWgibZnMdWbki9TB:1 -->

Question:
```text
Fix the two linking problems the tests found, so the first /doctor:symlink link links everything and git status stays clean? The setup guide would then lose its 'run link twice' and 'leave them uncommitted' notes.
```

Options:
```text
Fix in a new packet (Recommended)
Leave documented
```

Answer:
```text
Fix in a new packet (Recommended)
```

### Q009
<!-- source: claude:b2bc3af2-2d66-4d13-9d70-784e628579d2:toolu_014nZBic6SCh1Q8SANYm7A4y:0 -->

Question:
```text
The Sonnet review found real factual errors in SETUP.md, the v1.1.1.0 changelog and some spec docs that are already on main. Fix them and push to main again?
```

Options:
```text
Fix all and push (Recommended)
Accuracy only, push
Fix, don't push
```

Answer:
```text
Fix all and push (Recommended)
```

### Q010
<!-- source: claude:b2bc3af2-2d66-4d13-9d70-784e628579d2:toolu_014nZBic6SCh1Q8SANYm7A4y:1 -->

Question:
```text
The 005 packet and the overlay docs name Barter, its paths and its commits, in a public repo. What should happen to those mentions?
```

Options:
```text
Leave as is (Recommended)
Generalize in docs
```

Answer:
```text
Generalize in docs
```

### Q011
<!-- source: claude:b2bc3af2-2d66-4d13-9d70-784e628579d2:toolu_015A1wAqT1GaS153c1Tz4YHP:0 -->

Question:
```text
By 'Rebase', do you mean: update the v4.0.2.0 notes with this work, then move the v4.0.2.0 tag to the new main and republish the release? Moving a published tag rewrites it for anyone who already fetched it.
```

Options:
```text
Notes + move tag (Recommended)
Notes + new tag v4.0.2.1
Notes only
Rebase the branch
```

Answer:
```text
Delete tag and republish + notes
```

### Q012
<!-- source: claude:b2bc3af2-2d66-4d13-9d70-784e628579d2:toolu_01UEaSpRpyNDSGAFpvJqL8bi:0 -->

Question:
```text
Which of the four doc-tooling fixes should I make now? Each would get its own changelog entry and tests where a script changes.
```

Options:
```text
sk-create-readme prose
Changelog release amend
Bump hook on merges
HVR proper names
```

Answer:
```text
sk-create-readme prose, Changelog release amend, Bump hook on merges, HVR proper names
```

<!-- /ANCHOR:operator-answers-verbatim -->
