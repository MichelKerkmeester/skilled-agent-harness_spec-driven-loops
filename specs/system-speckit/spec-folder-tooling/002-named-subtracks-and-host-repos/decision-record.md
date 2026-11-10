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

<!-- /ANCHOR:operator-answers-verbatim -->
