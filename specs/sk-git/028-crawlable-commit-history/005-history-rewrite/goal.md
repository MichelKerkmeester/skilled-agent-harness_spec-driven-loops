---
title: "Goal: Phase 5: history rewrite"
description: "The durable directive this phase executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-git/028-crawlable-commit-history/005-history-rewrite"
    last_updated_at: "2026-09-11T09:25:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-11-skgit-028"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 5: history rewrite

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short:
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Rewrite main, skilled/v4.0.0.0 and the five tags to the new grammar on a mirror clone with git filter-repo, emit the old-to-new hash map, remap every commit-hash citation under specs/, and publish only after a written rollback and a fresh yes.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The rewrite runs on a mirror clone first. The live checkout is never the first target. |
| D2 | Scope is main, skilled/v4.0.0.0 and tags. Other branches and worktrees are rebased or archived, and the record says which. |
| D3 | The force-push waits for the operator's written yes in this phase. Nothing earlier counts. |
| D4 | Live-sync and pre-push hooks are bypassed only for that push, and the bypass flag is named in the record. |

### Operator copy

The operator holds this directive as the session objective, and that copy is
what judges completion, not this file. Whenever anything above the log changes
(objective, a decision, the binding table, a criterion), resend the full text
of this file in chat so the operator can update their copy. A child goal change
that alters a parent decision or criterion is an amendment to the parent: apply
it there first, then resend the parent.
<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [ ] The mirror clone holds 9,106 rewritten commits and every one matches the frozen grammar
- [ ] hash-map file exists with one old-to-new pair per commit
- [ ] rg over specs/ finds zero old 10-hex hashes that appear in the hash map
- [ ] validate.sh specs --strict --recursive prints RESULT: PASSED after the remap
- [ ] The rollback sentence and the operator's yes are recorded before the push
- [ ] origin/main and origin/skilled/v4.0.0.0 point at rewritten commits
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phase opened | Pending | |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | |
<!-- /ANCHOR:log -->
