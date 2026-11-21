---
title: "Decision Record: Ollama lane removal"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "024-ollama-lane-removal operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal"
    last_updated_at: "2026-11-20T22:06:58.647Z"
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
# Decision Record: Ollama lane removal

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | /speckit:plan runs in :auto mode for the removal. | Not stated. | None | 024 spec.md How the Run Executes |
| Q002 | The operator-local doc-alignment topic advisor-vector-refresh is replaced by advisor-lane-removal. | Not stated. | None | operator-local topics.json; 008 implementation-summary.md alignment-pass |
| Q003 | Do not keep the alignment executors on OpenCode Go; find a default that uses the active agent, CLI or provider. | Most repo users will not use OpenCode Go. | None | operator-local executors.json |
| Q004 | The lane cleanup gets no advisor routing vocabulary; the docs say it is reached through /doctor:update apply. | Not stated. | None | .skilled/commands/doctor/update.md section 6; doctor-update-presentation.txt section 9 |
| Q005 | Both alignment commands default to a native preset whose lanes and critic run as subagents of the conducting runtime on its own model. | Not stated. | None | operator-local executors.json, the four alignment workflow YAMLs and both router docs |
| Q006 | The advisory CI job is renamed after the steps it runs now. | Not stated. | None | .github/workflows/advisory-checks.yml |
| Q007 | Criterion 3 takes the machine-mode proof on a fixture home and checkout; exit 0 on the operator's machine follows the merge. | Not stated. | None | goal.md completion criteria |
| Q008 | The pulled nomic-embed-text model is removed by hand on the operator's machine. | Not stated. | None | 008 implementation-summary.md |
| Q009 | The operator closes the session goal; the work stays on the worktree branch. | Not stated. | None | goal.md |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_01MBxAnf732hvdFk5kX6z6Kf:3 -->

Question:
```text
Which mode should /speckit:plan run in for the removal?
```

Options:
```text
:auto (Recommended)
:confirm
```

Answer:
```text
:auto (Recommended)
```

### Q002
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_0163n2dMsCHSr7pKZ2yxRCN8:0 -->

Question:
```text
Your operator-local topics.json (untracked, in the primary checkout) still has the 'advisor-vector-refresh' topic, which lists code files this branch deleted, so /local-doc-alignment on it exits 2. What should I do with it?
```

Options:
```text
Replace with new topic (Recommended)
Add new, keep old
Leave the file alone
```

Answer:
```text
Replace with new topic (Recommended)
```

### Q003
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_0163n2dMsCHSr7pKZ2yxRCN8:1 -->

Question:
```text
Your shared executors.json pins the alignment critic to the OpenCode Go model whose monthly quota is used up, so every default run fails its critic and lanes. Change it?
```

Options:
```text
Leave as is (Recommended)
Switch critic to deepseek
Switch default preset too
```

Answer:
```text
Most repo users wont use opencode go, alternatives that uses the active agent / cli / provider?
```

### Q004
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_0163n2dMsCHSr7pKZ2yxRCN8:3 -->

Question:
```text
Asking the advisor to 'clean up what the old embedder left on my machine' routes nowhere or to sk-doc instead of /doctor:update. I documented the path rather than add routing phrases, because new phrases move the frozen routing baselines. What do you want?
```

Options:
```text
Keep it documented (Recommended)
Add one narrow phrase
```

Answer:
```text
Keep it documented (Recommended)
```

### Q005
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_01ELRCwxVMwfGRzCJwdVHxXV:0 -->

Question:
```text
For the shared alignment executors.json (operator-local, used by both /local-doc-alignment and /local-skilled-alignment): the workflows already support kind 'native', where lanes and the critic run as subagents of whichever runtime is conducting the command, with no external CLI or provider. How should the default work?
```

Options:
```text
Native default, inherit model (Recommended)
Native default, pinned model
Only fix the critic
Leave it for now
```

Answer:
```text
Native default, inherit model (Recommended)
```

### Q006
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_012VHbxtHdJt1Vs3wwyu5ZvW:0 -->

Question:
```text
The advisory CI job in .github/workflows/advisory-checks.yml is still named 'Advisory — test suites and doc-model references', but the doc-model step was removed on this branch. Renaming the display name can break a branch-protection rule that requires the check by its exact name. Rename it?
```

Options:
```text
Rename it (Recommended)
Keep the old name
```

Answer:
```text
Rename it (Recommended)
```

### Q007
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_01Vw42v9fjMMZBRVaETTEKgP:0 -->

Question:
```text
Criterion 3 requires machine mode to exit 0 on this Mac, but M8 scans every worktree including your primary checkout on main, which keeps the lane until this branch merges, and decision D2 says nothing merges. 26 other session worktrees also hold it. Which truth prevails?
```

Options:
```text
Amend: fixture proof counts (Recommended)
Keep criterion, goal stays open
Lift D2 and merge now
```

Answer:
```text
Amend: fixture proof counts (Recommended)
```

### Q008
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_01Vw42v9fjMMZBRVaETTEKgP:1 -->

Question:
```text
Separately, M6 is the pulled Ollama model nomic-embed-text in ~/.ollama. D6 keeps the cleanup tool's apply off this machine. Do you want it removed now by hand with `ollama rm nomic-embed-text`? Undo: `ollama pull nomic-embed-text`.
```

Options:
```text
Leave it (Recommended)
Remove it now
```

Answer:
```text
Remove it now
```

### Q009
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_01D5bGuJ43uEdVELiWy4gXqi:0 -->

Question:
```text
The session goal still has the old criterion 3: machine mode must exit 0 on this Mac. Only M8 blocks it now, meaning the lane still sits in your primary checkout on main plus 26 other session worktrees. How do you want to close it?
```

Options:
```text
I'll resend /goal myself (Recommended)
I'll clear the goal
Leave it open
```

Answer:
```text
I'll clear the goal
```

<!-- /ANCHOR:operator-answers-verbatim -->
