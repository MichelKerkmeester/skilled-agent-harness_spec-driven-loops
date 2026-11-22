---
title: "Decision Record: mcp-browser-use hub: Bladebro, Aside and Chrome DevTools browser modes"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "001-mcp-browser-use-hub operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp/mcp-browser-use/001-mcp-browser-use-hub"
    last_updated_at: "2026-11-21T12:34:51.631Z"
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
# Decision Record: mcp-browser-use hub: Bladebro, Aside and Chrome DevTools browser modes

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | The research runs all 10 iterations with stop policy max-iterations. | Not stated. | None | 001-research/spec.md, goal.md criterion 1 |
| Q002 | Spec-kit is extended to support two sub-track levels before the MCP specs are regrouped. | Not stated. | None | specs/system-speckit/spec-folder-tooling/007-nested-subtracks |
| Q003 | Opus 5.5 medium tasks run through claude -p on the second Claude account, overriding the cli-claude-code self-invocation guard for this session. | Not stated. | None | goal.md D4 |
| Q004 | The 26 MCP packets move under specs/mcp with two local commits on worktree branch 505 and no push. | Not stated. | None | commits b0b3c8d9bf1 and 614858c884c on worktrees/505-mcp-browser-use-hub |
| Q005 | Two more hy4 iterations run to recover the ones lost to the question-prefix mistake, then the research is accepted with its closeout gap. | Not stated. | None | 001-research/implementation-summary.md |
| Q006 | The mutation-guard pattern fix lands in 003 together with the mode move. | Not stated. | None | 003-mode-relocation/spec.md |
| Q007 | Parent criterion 3 checks stale mcp-tooling/ path references and the old hub files only; sibling cross-references stay untouched. | Not stated. | None | goal.md criterion 3 |
| Q008 | 006 uses a two-stage advisor plus hub-router replay as its routing benchmark. | Not stated. | None | 006-verification/spec.md |
| Q009 | Build 002 and 003 now, stopping before the Bladebro install. | Not stated. | None | 002-hub-scaffold, 003-mode-relocation |
| Q010 | Each mode uses its CLI when installed and MCP via Code Mode when the CLI is missing or the task needs composition, parallel isolation or an MCP-only capability. | Not stated. | None | goal.md D2 |
| Q011 | Install bladebro 4.8.2 pinned in 006, digest-checked before first run, isolated agent profile only; rb real-browser steps skipped. | Not stated. | None | goal.md D5, 006-verification |
| Q012 | Rewrite the old paths in cite-drift-redirects.json and semantic-probes.json so criterion 3 passes as written. | Not stated. | None | goal.md criterion 3, 003-mode-relocation AC-002 |
| Q013 | After final verification, land one local commit per phase 002-006 on worktree branch 505; no push or merge. | Not stated. | None | goal.md D8 |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:433fe077-5d40-4bad-953f-18be20938fb8:toolu_01N2WMbjSyeA5sX4idYomzfm:2 -->

Question:
```text
Should the research run exactly 10 iterations, or may it stop early once it converges?
```

Options:
```text
Force all 10 (Recommended)
Up to 10
```

Answer:
```text
Force all 10 (Recommended)
```

### Q002
<!-- source: claude:433fe077-5d40-4bad-953f-18be20938fb8:toolu_0117b9fSPDX3MDxq7b6gDUR5:0 -->

Question:
```text
Spec-kit only supports ONE sub-track level (folder-structure.md: "One level is supported: a sub-track holds numbered packets, not another sub-track" — create.sh refuses deeper nesting). Your layout (mcp track → per-hub sub-track → 3rd-level sub-tracks) needs two. How should we proceed?
```

Options:
```text
One track per hub (Recommended)
Single mcp/ track, flat
Extend spec-kit first
```

Answer:
```text
Extend spec-kit first
```

### Q003
<!-- source: claude:433fe077-5d40-4bad-953f-18be20938fb8:toolu_017jvhPa9zVV9knf6c7nosiu:0 -->

Question:
```text
cli-claude-code forbids shelling out to `claude -p` from inside a Claude Code session (SKILL.md line 10, ROUTER.md line 57); its documented route is a native subagent instead. claude2 (~/.claude-account2) is logged in. How should the Opus 5.5 medium tasks run?
```

Options:
```text
Override: claude2 via CLI
Native opus-medium agent
Mix
```

Answer:
```text
Override: claude2 via CLI
```

### Q004
<!-- source: claude:433fe077-5d40-4bad-953f-18be20938fb8:toolu_01JipJWQ1XzmS4vaacsZqpcy:0 -->

Question:
```text
Approve the specs/mcp/ relocation? 26 moves: code-mode 001-003 → mcp/mcp-code-mode/; clickup-figma 001-003 and mcp-obsidian 001-002 → mcp/mcp-tooling/<same sub-track>/; the 18 archived packets → mcp/mcp-tooling/z_archive/. relocate.mjs rewrites 741 files (732 inside the moved packets, ~100 path mentions in other tracks' docs). It refuses to run on uncommitted files, so it needs TWO local commits on worktree branch 505 (no push): one for the nested-subtrack spec-kit work + new track root, one after the map. Rollback: `git reset --hard <commit before>` on the worktree branch.
```

Options:
```text
Approve + 2 local commits (Recommended)
Approve, but keep archive
Stop, review first
```

Answer:
```text
Approve + 2 local commits (Recommended)
```

### Q005
<!-- source: claude:433fe077-5d40-4bad-953f-18be20938fb8:toolu_019nadtoFfC6w7EmE4DdT5bJ:0 -->

Question:
```text
The 10 hy4 iterations finished and research.md (29.5 KB) answers KQ1-KQ8 (KQ4 blast-radius file list only partial; iterations 9-10 were spent repairing a question-prefix setup mistake, so ~8 iterations of real research). The workflow's closeout check failed: iterations claimed 65 findings, the reducer rebuilt 44 because several iterations wrote findings as '### Finding N' instead of a '## Findings' list. How should I close 001-research?
```

Options:
```text
Accept + move on (Recommended)
Extend 2 more iterations
Fix reducer first
```

Answer:
```text
Extend 2 more iterations
```

### Q006
<!-- source: claude:433fe077-5d40-4bad-953f-18be20938fb8:toolu_0173gVNm1LNyM9ad9gYqP8k8:0 -->

Question:
```text
Mutation-guard gap: after 003 moves the packets to skills/mcp-browser-use/, the pre-commit hook (pre-commit:632) and check-mcp-mutation-class.sh stop checking their install.sh/doctor.sh. Where should the pattern fix land?
```

Options:
```text
In 003 with the move (Recommended)
Keep it in 005
```

Answer:
```text
In 003 with the move (Recommended)
```

### Q007
<!-- source: claude:433fe077-5d40-4bad-953f-18be20938fb8:toolu_0173gVNm1LNyM9ad9gYqP8k8:1 -->

Question:
```text
Parent criterion 3 wants zero mentions of `mcp-chrome-devtools`/`mcp-aside-devtools` under skills/mcp-tooling, but 12 files in 4 sibling packets (click-up, figma, mobbin, refero) cross-reference those ids, and D3 says those modes stay unchanged. The ids survive the move, so the references stay correct. Which gives?
```

Options:
```text
Narrow the criterion (Recommended)
Edit the sibling docs
```

Answer:
```text
Narrow the criterion (Recommended)
```

### Q008
<!-- source: claude:433fe077-5d40-4bad-953f-18be20938fb8:toolu_0173gVNm1LNyM9ad9gYqP8k8:2 -->

Question:
```text
006's routing benchmark: /create:benchmark only supports MCP-promotion benchmarks and the old mcp-tooling routing harness is retired. 006 proposes a two-stage replay (advisor + hub router, one real request per mode + 3 tie-break requests) archived under the new hub's benchmark/reports/compiled-routing/. Approve that substitute?
```

Options:
```text
Approve the replay (Recommended)
Drop the benchmark
```

Answer:
```text
Approve the replay (Recommended)
```

### Q009
<!-- source: claude:433fe077-5d40-4bad-953f-18be20938fb8:toolu_0173gVNm1LNyM9ad9gYqP8k8:3 -->

Question:
```text
The spec is planned and validated (7/7 PASSED). Start the build now?
```

Options:
```text
Build 002 + 003 now (Recommended)
Build 002-005
Stop here
```

Answer:
```text
Build 002 + 003 now (Recommended)
```

### Q010
<!-- source: claude:433fe077-5d40-4bad-953f-18be20938fb8:toolu_016gZt3XKCLE6AuoBGwxXjUd:0 -->

Question:
```text
D2 says each mode uses its CLI (bladebro, aside, bdg) when installed and its MCP server via Code Mode otherwise. The research found cases where MCP is the right lane even with the CLI installed: chaining with other Code Mode tools, parallel isolated sessions, and capabilities only MCP has (Chrome's lighthouse_audit and performance traces; bdg has neither). How should D2 read?
```

Options:
```text
CLI-first + MCP exceptions (Recommended)
Strict CLI-first
```

Answer:
```text
CLI-first + MCP exceptions (Recommended)
```

### Q011
<!-- source: claude:433fe077-5d40-4bad-953f-18be20938fb8:toolu_01JPkbwejqCixHk6btPmFgZb:0 -->

Question:
```text
The goal requires a live Bladebro run on macOS (006). D5 needs your yes before installing. The plan: `npm install -g bladebro@4.8.2` (pinned), verify the binary's SHA-256 against the release BEFORE first run (R-SEC-3), then run the 14-step plan in the isolated agent-browser profile only (no real-browser/`rb` lane on your signed-in Chrome). Rollback: `npm uninstall -g bladebro` and delete its profile dir (`BLADE_HOME`, default under ~). May I install it when 006 is reached?
```

Options:
```text
Yes, agent profile only (Recommended)
Yes, incl. rb attach
No install yet
```

Answer:
```text
Yes, agent profile only (Recommended)
```

### Q012
<!-- source: claude:433fe077-5d40-4bad-953f-18be20938fb8:toolu_01HmmZfAGJq7n6edcvv8VTV2:0 -->

Question:
```text
Goal criterion 3 (no `mcp-tooling/mcp-chrome-devtools|aside` paths under .skilled) can never pass as written: two files keep the old path by design. `sk-doc/shared/scripts/cite-drift-redirects.json` is the rename ledger (its 'from' side records old paths) and `system-spec-kit/.../fixtures/semantic-probes.json` is frozen acceptance evidence the retrieval README says is never regenerated (it even uses the older .opencode/ root). How should criterion 3 read?
```

Options:
```text
Exclude the two history files (Recommended)
Rewrite them anyway
```

Answer:
```text
Rewrite them anyway
```

### Q013
<!-- source: claude:433fe077-5d40-4bad-953f-18be20938fb8:toolu_01HmmZfAGJq7n6edcvv8VTV2:1 -->

Question:
```text
D8 says no commits without your instruction. When 005 and 006 are done and verified, how should the build land on worktree branch 505?
```

Options:
```text
Local commits per phase (Recommended)
One squashed local commit
Leave uncommitted
```

Answer:
```text
Local commits per phase (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
