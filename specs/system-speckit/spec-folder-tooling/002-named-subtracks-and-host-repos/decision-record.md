---
title: "Decision Record: Named sub-track support in spec-kit, plus project-owned doctor entries, the vendored .skilled/specs link and a host-repository trigger index"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "044-named-subtracks-and-host-repos operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-folder-tooling/002-named-subtracks-and-host-repos"
    last_updated_at: "2026-11-07T15:26:58.159Z"
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
# Decision Record: Named sub-track support in spec-kit, plus project-owned doctor entries, the vendored .skilled/specs link and a host-repository trigger index

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | A new host gets .skilled/ built in place, so .skilled/specs points at the host specs/ folder or is omitted, instead of one whole link to the checkout. | The operator chose the recommended option: a whole link resolves .skilled/specs into the Skilled checkout own specs, the wrong tree for a host. | None | REQ-010, AC-010, T015, implementation-summary.md Key Decisions |
| Q002 | create.sh refuses an undeclared two-level --track instead of creating an unlisted packet. | Not stated. | None | 001-create-track-fixes/spec.md D-001, create.sh, create-track-refresh.vitest.ts |
| Q003 | Take every recommended option for the nine smaller design choices D-002a/b, D-003a/b, D-004a/b and D-005a/b/c. | Not stated. | None | Phase decision records D-002 to D-005, phases 002-005 |
| Q004 | Investigate branch worktrees/087-doctor-update-test-environment and merge only what is worth keeping, never its sk-git rollback. | Not stated. | None | Workspace cleanup after the packet landed |
| Q005 | Restore the leftover test noise and keep the new research lineage files. | Not stated. | None | Workspace cleanup after the packet landed |
| Q006 | This run fixes all four sub-track gaps: the spec-kit duplicate hole, the two Barter data gaps and moving Skilled's own specs into sub-tracks. | Not stated. | none | specs/system-speckit/spec-folder-tooling/002-named-subtracks-and-host-repos/spec.md |
| Q007 | The alignment run checks only the 16 uncommitted files of the sub-track fix, not the 263 sweet-search files already on local main. | Not stated. | none | specs/system-speckit/spec-folder-tooling/002-named-subtracks-and-host-repos/spec.md |
| Q008 | The three paid review lanes and the critic run on DeepSeek V4.1 Flash max through OpenCode Go. | Not stated. | none | specs/system-speckit/spec-folder-tooling/002-named-subtracks-and-host-repos/spec.md |
| Q009 | The session itself handles the primary checkout: it fast-forwards main to origin/main and carries the modified description.json and the untracked leftovers to the packet's new path. | Not stated. | none | specs/system-speckit/spec-folder-tooling/002-named-subtracks-and-host-repos/spec.md |
| Q010 | The operator commits the Barter repo's children-list and metadata fixes; superseded by claude:1dd4a9a8-36db-41ed-a4d5-da599d436310:toolu_01GdzJPZuZu3ywncL2prf8NH:2 (Commit and push, L4515). | Not stated. | none | 007-children-list-duplicates/tasks.md T011, T012 |
| Q011 | Barter's 10 flat packets in bartender, barter-scrooge and gitops-development go into themed sub-tracks (such as api-behavior, agent-skills, environments, gitops-workflows), renumbered from 001; done in the Barter repo and pushed as d2e173376. | Not stated. | none | specs/system-speckit/spec-folder-tooling/002-named-subtracks-and-host-repos/008-track-subtrack-regrouping/spec.md |
| Q012 | The Barter specs/skilled mirror's children list is emptied with refresh-track-roots; the file is git-ignored, so nothing is committed. | Not stated. | none | 007-children-list-duplicates/implementation-summary.md:133 |
| Q013 | The Barter fixes and packet moves are committed on branch skilled/v4.0.2.0 and pushed (d2e173376). | Not stated. | none | 007-children-list-duplicates/tasks.md T011, T012 |
| Q014 | This session's work (sub-track regroup, sweep check, rename-rule and test fixes, Node minimums) is added to the v4.0.2.1 release note. | Not stated. | none | specs/system-speckit/spec-folder-tooling/002-named-subtracks-and-host-repos/spec.md |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78:toolu_01LiZmqrhGhP27DpaXaP2rzs:0 -->

Question:
```text
Packet 044, REQ-010 (no dangling .skilled/specs link in a host): worker D's fix makes /doctor:symlink build .skilled/ as a real folder with per-child links in every new host, instead of today's single whole link to the checkout. That way .skilled/specs points at the host's own specs/, or is left out when the host has none. Keep that default change?
```

Options:
```text
Keep D's merge build (Recommended)
Keep whole link, narrow fix
Defer REQ-010
```

Answer:
```text
Keep D's merge build (Recommended)
```

### Q002
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78:toolu_01Mrb8q8T8e6RHMc1CM3Ez5z:0 -->

Question:
```text
Phase 001: create.sh currently creates a packet under an undeclared two-level --track (e.g. demo/x where x has no sub-track description.json) and silently skips the listing refresh; a test asserts that. What should it do?
```

Options:
```text
Refuse it (Recommended)
Warn and proceed
```

Answer:
```text
Refuse it (Recommended)
```

### Q003
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78:toolu_01Mrb8q8T8e6RHMc1CM3Ez5z:1 -->

Question:
```text
The phase docs record nine smaller design choices (D-002a/b, D-003a/b, D-004a/b, D-005a/b/c), each with a recommended option: one shared parity test for the sub-track rule, skip symlinked packets in sub-tracks only, guard symlinked metadata writes for top-level tracks too, let refresh create a missing sub-track metadata file, keep the host-relative link un-ignored and pin it with a test, and fix docs rather than add features. Take all the recommendations?
```

Options:
```text
Take all recommended
Let me review first
```

Answer:
```text
Take all recommended
```

### Q004
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78:toolu_013XkxBd3ryK3GdohGAHAJVP:2 -->

Question:
```text
Branch worktrees/087-doctor-update-test-environment has 7 commits not on main, including 'replace sk-git with the older Barter skill' and 'record v4.0.0.0 as the fixture base'. It's a test fixture for /doctor:update, and merging it would roll sk-git back on main. Should it be merged?
```

Options:
```text
Don't merge it (Recommended)
Merge it anyway
```

Answer:
```text
Investigate what to keep and merge
```

### Q005
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78:toolu_013XkxBd3ryK3GdohGAHAJVP:3 -->

Question:
```text
Leftover test output: the hostile-workspace scratch links modified in worktrees 145, 218 and 265; old scratch test files in spec 040 (Oct 23); a coverage-graph DB in 043's review lineage; and new research lineage files for 023 in worktree 218. What should happen to them?
```

Options:
```text
Restore noise, keep research (Recommended)
Commit all of it
Touch none of it
```

Answer:
```text
Restore noise, keep research (Recommended)
```

### Q006
<!-- source: claude:1dd4a9a8-36db-41ed-a4d5-da599d436310:toolu_01YADYs7ipmydtTgHqed3aJT:2 -->

Question:
```text
Which of the four gaps should this run fix? Gap 1 is the spec-kit duplicate hole. Gaps 2 and 3 are Barter data in ai-speckit, which stays uncommitted for you to commit. Gap 4 would move Skilled's own specs into sub-tracks as a worked example.
```

Options:
```text
Gaps 1 to 3 (Recommended)
Gap 1 only
All four
```

Answer:
```text
All four
```

### Q007
<!-- source: claude:1dd4a9a8-36db-41ed-a4d5-da599d436310:toolu_012Reo8e3wRDB6f5DbyDcRm4:0 -->

Question:
```text
The alignment scope against origin/main is 279 files, but 263 of them come from two sweet-search commits already on your local main, not from the sub-track fix (16 uncommitted files). Which scope should the alignment run check?
```

Options:
```text
Only my 16 files (Recommended)
Approve as shown
Cancel
```

Answer:
```text
Only my 16 files (Recommended)
```

### Q008
<!-- source: claude:1dd4a9a8-36db-41ed-a4d5-da599d436310:toolu_01AR6exjWTN9fUMrL17sJsZg:0 -->

Question:
```text
The alignment battery is done (31 pass, 1 fail that also fails on clean main). Run the three paid review lanes and the critic on DeepSeek V4.1 Flash max through OpenCode Go?
```

Options:
```text
Approve (Recommended)
Battery only
Cancel
```

Answer:
```text
Approve (Recommended)
```

### Q009
<!-- source: claude:1dd4a9a8-36db-41ed-a4d5-da599d436310:toolu_01NtT9TKhFyC4d5rkSqCMfAs:0 -->

Question:
```text
Your primary checkout (MEGA/Development/Skilled) is behind origin/main and has one modified file: specs/system-speckit/047-v4-release-line-research/description.json. That packet moved to runtime-and-release/004-v4-release-line-research, so a pull will conflict. What should I do with it?
```

Options:
```text
Leave it to me
Discard and pull
Carry change over
```

Answer:
```text
You handle it
```

### Q010
<!-- source: claude:1dd4a9a8-36db-41ed-a4d5-da599d436310:toolu_01NtT9TKhFyC4d5rkSqCMfAs:3 -->

Question:
```text
The Barter repo (barter/ai-speckit) still has my earlier uncommitted fixes: 17 duplicate children entries removed in 7 sub-tracks, plus new description.json and graph-metadata.json for skilled-barter-overlays. Who commits them?
```

Options:
```text
I commit myself
You commit, no push
```

Answer:
```text
I commit myself
```

### Q011
<!-- source: claude:1dd4a9a8-36db-41ed-a4d5-da599d436310:toolu_01GdzJPZuZu3ywncL2prf8NH:0 -->

Question:
```text
In the Barter repo (barter/ai-speckit), three tracks each have one sub-track called knowledge plus flat packets beside it: bartender (2 flat), barter-scrooge (6) and gitops-development (2). Into which sub-tracks should those 10 packets go? All are renumbered from 001 in their original order.
```

Options:
```text
By theme (Recommended)
One per track
Dissolve knowledge
```

Answer:
```text
By theme (Recommended)
```

### Q012
<!-- source: claude:1dd4a9a8-36db-41ed-a4d5-da599d436310:toolu_01GdzJPZuZu3ywncL2prf8NH:1 -->

Question:
```text
The sweep also reports specs/skilled in Barter as drifted. That folder is a git-ignored local mirror of Skilled's specs, and its graph-metadata.json lists two packets that do not exist (999-test-sandbox, 999-playbook-test-memory-mcp-validation). What should I do with it?
```

Options:
```text
Clear the list (Recommended)
Leave it
```

Answer:
```text
Clear the list (Recommended)
```

### Q013
<!-- source: claude:1dd4a9a8-36db-41ed-a4d5-da599d436310:toolu_01GdzJPZuZu3ywncL2prf8NH:2 -->

Question:
```text
Barter is on branch skilled/v4.0.2.0 with my earlier fixes uncommitted (7 children lists and the two skilled-barter-overlays files). How should I handle git for this work?
```

Options:
```text
Commit on branch, no push
Commit and push
Leave uncommitted
```

Answer:
```text
Commit and push
```

### Q014
<!-- source: claude:1dd4a9a8-36db-41ed-a4d5-da599d436310:toolu_01TS5skeWSeRUXmRfPUrA69V:0 -->

Question:
```text
Which root release note should carry this session's work (ten tracks regrouped into sub-tracks, the mixed-track sweep check, the rename-rule and test fixes, and the Node.js minimums)? v4.0.1.0 is the older tagged release about ROUTER.md files, and v4.0.2.0 and v4.0.2.1 are also already tagged.
```

Options:
```text
New v4.0.3.0 (Recommended)
New v4.0.2.2
Add to v4.0.2.1
Really v4.0.1.0
```

Answer:
```text
Add to v4.0.2.1
```

<!-- /ANCHOR:operator-answers-verbatim -->
