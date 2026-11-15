---
title: "Decision Record: Mistral as a provider across the CLI runtimes and Mistral Vibe as a cli-external-orchestration runtime mode"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "004-cli-mistral-vibe-creation operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation"
    last_updated_at: "2026-11-14T12:51:29.807Z"
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
# Decision Record: Mistral as a provider across the CLI runtimes and Mistral Vibe as a cli-external-orchestration runtime mode

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Build the DeepSeek Harness Mistral route now and prove it once MISTRAL_API_KEY is exported. | Not stated. | None | 003-dsh-mistral-route T004-T010 |
| Q002 | A direct-dispatch-only Pi row needs the roster alone; a fan-out model also needs PI_SUPPORTED_MODELS. | Not stated. | None | cli-pi/SKILL.md, cli-pi/references/providers-and-models.md |
| Q003 | Merge origin/main into the Vibe branch by resolving each of the 82 conflicts by hand, keeping both sides and regenerating generated files. | Not stated. | None | Merge commits 1e6742548a2 and c7b8a6ff1d9 |
| Q004 | Push the .vibe roster doc edits to main right away instead of holding them for one final push. | Not stated. | None | Commit e122448415c, pushed to main |
| Q005 | Push the .vibe/plugins/README.md plugin map to main right away. | Not stated. | None | Commit 544fb7345ec, pushed to main |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:7b5419e7-b051-48ae-a853-821592ddf9fd:toolu_01BcMfUT78fjRZJb5Jm5Y446:1 -->

Question:
```text
What next for the DSH Mistral route?
```

Options:
```text
Build after I export key
Build now, prove later
Hold phase 003
```

Answer:
```text
Build now, prove later
```

### Q002
<!-- source: claude:7b5419e7-b051-48ae-a853-821592ddf9fd:toolu_01BcMfUT78fjRZJb5Jm5Y446:2 -->

Question:
```text
Apply the one-line fix to the cli-pi PI_SUPPORTED_MODELS rule?
```

Options:
```text
Apply the fix
Wire fan-out instead
Leave as is
```

Answer:
```text
Apply the fix (Recommended)
```

### Q003
<!-- source: claude:abd87731-caa8-451c-b4f8-279c696fc7c1:toolu_01FGePnsqTrSaUyKBdgKQF2n:0 -->

Question:
```text
Merging origin/main into the Vibe branch (commit 36ddad5062d) hits 82 conflicts. origin/main already carries an earlier copy of this work: 7c2073a7dc1 'add the Mistral Vibe runtime packet' (249 files) and 5a1a516b082 'add the Mistral routes'. About 48 conflicts are that packet's own spec docs, about 15 are hub, agent and skill docs both sides edited, and about 8 are generated indexes (trigger index, skill graph, retrieval fixtures). I've aborted the merge, so the branch is clean and nothing is pushed. How should I resolve it?
```

Options:
```text
Branch wins on Vibe (Recommended)
Merge every file by hand
Push the branch only
```

Answer:
```text
Merge every file by hand
```

### Q004
<!-- source: claude:ad8b9098-fc02-46dd-b031-024bfd7e15c9:toolu_01S4e8EazEuwiXoxpM9tbVg3:0 -->

Question:
```text
The .vibe roster edits are done locally (root README, CROSS-CLI.md, PUBLIC-RELEASE.md, SECURITY.md, .claude/SYNC.md, hooks README). The alignment lanes are still running and may produce more fixes. When should these reach origin/main?
```

Options:
```text
One push at the end (Recommended)
Push the doc edits now
Commit, don't push
```

Answer:
```text
Push the doc edits now
```

### Q005
<!-- source: claude:ad8b9098-fc02-46dd-b031-024bfd7e15c9:toolu_01YFQrihtnG2U61RVVNHETtm:0 -->

Question:
```text
I added .vibe/plugins/README.md: a map from each of the 21 OpenCode plugins to the hooks.toml entry, event and script that does its job in Vibe (no symlinks, because Vibe would skip or refuse them). It's committed locally as 544fb7345ec. Push it to main now too?
```

Options:
```text
Push it now (Recommended)
Hold for the final push
```

Answer:
```text
Push it now (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
