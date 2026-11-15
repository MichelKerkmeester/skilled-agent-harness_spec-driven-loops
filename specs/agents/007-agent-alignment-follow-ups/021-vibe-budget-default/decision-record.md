---
title: "Decision Record: Phase 21: vibe-budget-default"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "021-vibe-budget-default operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/007-agent-alignment-follow-ups/021-vibe-budget-default"
    last_updated_at: "2026-11-15T17:29:55.726Z"
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
# Decision Record: Phase 21: vibe-budget-default

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Add runId, sessionId and lineageId to the Step 8 example record in deep-research.md. | Not stated. | None | 010-deep-loop-leaf-state-and-status |
| Q002 | The deep-review session verdict follows review-mode-contract.yaml: a required quality gate still failing at the terminal stop fails the session. | Not stated. | None | 015-review-verdict-gate-rule |
| Q003 | Amend agent-template.md so its bindings rule matches the markdown agent's. | Not stated. | None | 013-context-markdown-design-fixes |
| Q004 | Build the verdict gate rule in full, with a typed terminal-gates ledger event. | Not stated. | None | 015-review-verdict-gate-rule |
| Q005 | Run the planning workflow for child 015 in autonomous mode. | Not stated. | None | 015-review-verdict-gate-rule, plan.md |
| Q006 | Treat the child 015 research intent as a bug fix. | Not stated. | None | 015-review-verdict-gate-rule, spec.md |
| Q007 | Keep child 015 as one phase, not split into children. | Not stated. | None | 015-review-verdict-gate-rule |
| Q008 | Fix the /speckit:implement step that runs check-prerequisites.sh without the SPECIFY_FEATURE override before building child 015. | Not stated. | None | 015-review-verdict-gate-rule, 016-follow-up-fix-sweep T017 |
| Q009 | A deep review that enters synthesis after three consecutive errors records its terminal gates with stop reason error. | Not stated. | None | 016-follow-up-fix-sweep, deep-review-auto.yaml |
| Q010 | The @debug agent fixes by default. | Not stated. | None | 016-follow-up-fix-sweep |
| Q011 | A LOW-confidence @review pass with no P0 and no open P1 is surfaced and re-dispatched once. | Not stated. | None | 016-follow-up-fix-sweep, orchestrate.md |
| Q012 | Build the follow-up fixes in a new child 016. | Not stated. | None | 016-follow-up-fix-sweep |
| Q013 | Port packet 016's fixes onto the merged origin/main and push. | Not stated. | None | 016-follow-up-fix-sweep |
| Q014 | A deep-review run that hits its time limit records its terminal gates with a new stop reason, maxDurationReached. | Not stated. | None | 017-terminal-record-gaps, 018-research-duration-check |
| Q015 | Send manual stops through the verdict step before gate_pre_synthesis, so the verdict is derived from the terminal gate record. | Not stated. | None | 017-terminal-record-gaps |
| Q016 | Put the two upstream gap fixes in a new child 017. | Not stated. | None | 017-terminal-record-gaps |
| Q017 | Regenerate the stale Vibe agent profiles and add a CI check for Vibe mirror drift. | Not stated. | None | 019-vibe-agent-sync-check |
| Q018 | The operator asked whether Vibe has its own usage pool instead of choosing an option, which led to probing the Vibe budget. | Not stated. | None | 020-agent-docs-alignment-research |
| Q019 | Probe the Vibe budget with one call before any rerun. | Not stated. | None | 020-agent-docs-alignment-research |
| Q020 | Make the Vibe budget the default on both layers: the machine credential stores and the repo runner and docs. | Not stated. | None | 021-vibe-budget-default |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:a84f4eed-26f9-49ac-91eb-e2375c207e96:toolu_01CdegRHzXxcavYjrF3T6tWK:0 -->

Question:
```text
Deep-research identity fields: the Step 8 example record in deep-research.md has no runId, sessionId or lineageId. The append gateway (legacy-compatibility.ts) rejects a record without them as `stable-identity-missing`. Should I add the three fields to that example line?
```

Options:
```text
Yes, add them (Recommended)
No, record no fix
```

Answer:
```text
Yes, add them (Recommended)
```

### Q002
<!-- source: claude:a84f4eed-26f9-49ac-91eb-e2375c207e96:toolu_01CdegRHzXxcavYjrF3T6tWK:1 -->

Question:
```text
Which rule decides the deep-review session verdict? review-mode-contract.yaml:105 fails the session on a failed quality gate. deep-review-auto.yaml:2403-2408 fails only when a P0 finding is still open. For now the agent defers to whichever verdict the workflow produces.
```

Options:
```text
Workflow: P0 only
Contract: a gate failure fails
Leave deferred, record it
```

Answer:
```text
Contract: a gate failure fails
```

### Q003
<!-- source: claude:a84f4eed-26f9-49ac-91eb-e2375c207e96:toolu_01CdegRHzXxcavYjrF3T6tWK:2 -->

Question:
```text
agent-template.md:281 tells every agent to emit its bindings before any read. markdown.md copies that rule, but deep-review and markdown now emit some bindings after reading their config or template. Should the template allow 'after the config read' when a binding's value comes from that read?
```

Options:
```text
Yes, amend the template
No, record the exception
```

Answer:
```text
Yes, amend the template
```

### Q004
<!-- source: claude:a84f4eed-26f9-49ac-91eb-e2375c207e96:toolu_016ShRFvrSYmpfvenGgFxwn5:0 -->

Question:
```text
Child 015 (review verdict: a failed required quality gate forces FAIL) turns out to need a ledger change. The contract's required gates are evidence, scope and coverage. But when a review ends at max iterations, or by a manual or error stop, no saved record says which of them were still failing; the workflow only notes it in prose. How should 015 be scoped?
```

Options:
```text
Full: typed event (Recommended)
Workflow only
Plan only, build later
```

Answer:
```text
Full: typed event (Recommended)
```

### Q005
<!-- source: claude:a84f4eed-26f9-49ac-91eb-e2375c207e96:toolu_019CoF9XY2pVKqKmEwY2wdsZ:1 -->

Question:
```text
Q2, execution mode for the planning workflow?
```

Options:
```text
A) Autonomous (Recommended)
B) Interactive
```

Answer:
```text
A) Autonomous (Recommended)
```

### Q006
<!-- source: claude:a84f4eed-26f9-49ac-91eb-e2375c207e96:toolu_019CoF9XY2pVKqKmEwY2wdsZ:2 -->

Question:
```text
Q4, research intent?
```

Options:
```text
fix_bug (Recommended)
add_feature
refactor
```

Answer:
```text
fix_bug (Recommended)
```

### Q007
<!-- source: claude:a84f4eed-26f9-49ac-91eb-e2375c207e96:toolu_019CoF9XY2pVKqKmEwY2wdsZ:3 -->

Question:
```text
Q5, phase decomposition: split 015 into its own phase children?
```

Options:
```text
A) No (Recommended)
B) Yes
```

Answer:
```text
A) No (Recommended)
```

### Q008
<!-- source: claude:a84f4eed-26f9-49ac-91eb-e2375c207e96:toolu_01Mw4d2nSDWv3vQSJfPF3XQ2:0 -->

Question:
```text
Correction: `check-prerequisites.sh` already supports nested track packets. With `SPECIFY_FEATURE=agents/007-agent-alignment-follow-ups/015-review-verdict-gate-rule` it skips the branch check and exits 0 on the right folder. I said it couldn't, which was wrong, and you chose 'fix the script first' on that basis. The real gap is that /speckit:implement step 1 runs the script without setting the override, and no command doc mentions it. How should I proceed?
```

Options:
```text
Build 015 now, log the gap (Recommended)
Fix the workflow step first
Stop
```

Answer:
```text
Fix the workflow step first
```

### Q009
<!-- source: claude:a84f4eed-26f9-49ac-91eb-e2375c207e96:toolu_01FopZ3vk39EBY2CSAKjhehG:0 -->

Question:
```text
Item 1: what verdict should a deep review get when it enters synthesis after three consecutive errors?
```

Options:
```text
Record gates (Recommended)
Mark incomplete
Keep P0-only
```

Answer:
```text
Record gates (Recommended)
```

### Q010
<!-- source: claude:a84f4eed-26f9-49ac-91eb-e2375c207e96:toolu_01FopZ3vk39EBY2CSAKjhehG:1 -->

Question:
```text
Item 8: should @debug fix by default?
```

Options:
```text
Fix by default
Diagnose by default
```

Answer:
```text
Fix by default
```

### Q011
<!-- source: claude:a84f4eed-26f9-49ac-91eb-e2375c207e96:toolu_01FopZ3vk39EBY2CSAKjhehG:2 -->

Question:
```text
Item 9: a LOW-confidence @review with no P0 and no open P1, what should happen?
```

Options:
```text
Surface + redo (Recommended)
Pass as today
Fail the gate
```

Answer:
```text
Surface + redo (Recommended)
```

### Q012
<!-- source: claude:a84f4eed-26f9-49ac-91eb-e2375c207e96:toolu_01FopZ3vk39EBY2CSAKjhehG:3 -->

Question:
```text
Should I build the fixes, and in which packet?
```

Options:
```text
New child 016 (Recommended)
Plan only
Not now
```

Answer:
```text
New child 016 (Recommended)
```

### Q013
<!-- source: claude:a84f4eed-26f9-49ac-91eb-e2375c207e96:toolu_01AYQgh9zzUBgsmQGnT4Gjxr:0 -->

Question:
```text
Packet 016's fixes are committed locally as a681ca23b73 but not pushed. Merging origin/main conflicted in files that aren't generated: upstream retired the council skill (adbba5a06a9 deletes deep-ai-council and its docs) and merged deep-review-auto.yaml and deep-review-confirm.yaml into one deep-review.yaml, which has 5 conflict hunks. My stop-reason pass-through, the three-errors path that records the gates with reason error, and the manual-stop records have to be ported into that file. I aborted the merge, so the worktree is clean. How should I proceed?
```

Options:
```text
Port and push (Recommended)
Hold the commit
```

Answer:
```text
Port and push (Recommended)
```

### Q014
<!-- source: claude:a84f4eed-26f9-49ac-91eb-e2375c207e96:toolu_017qRhghpGULQr38t6WqyzYA:0 -->

Question:
```text
Two gaps from upstream main are still open. First: after the default 120 minutes, a deep-review run jumps straight to synthesis without writing the terminal gate record, so the verdict can PASS while a required gate fails. Writing the record there needs a stop reason the record accepts, which today is converged, maxIterationsReached, manualStop or error. Which should the duration stop use?
```

Options:
```text
Add maxDurationReached (Recommended)
Map to maxIterationsReached
Leave it
```

Answer:
```text
Add maxDurationReached (Recommended)
```

### Q015
<!-- source: claude:a84f4eed-26f9-49ac-91eb-e2375c207e96:toolu_017qRhghpGULQr38t6WqyzYA:1 -->

Question:
```text
Second gap: a manual stop (option C at a gate) jumps to gate_pre_synthesis. That skips the steps that read the terminal gate record and derive the verdict, so the record is written but the verdict is never derived from it. Fix it by sending manual stops through the verdict step first?
```

Options:
```text
Fix it (Recommended)
Leave it
```

Answer:
```text
Fix it (Recommended)
```

### Q016
<!-- source: claude:a84f4eed-26f9-49ac-91eb-e2375c207e96:toolu_017qRhghpGULQr38t6WqyzYA:2 -->

Question:
```text
If you choose any fix, where should the work go?
```

Options:
```text
New child 017 (Recommended)
Extend 016
```

Answer:
```text
New child 017 (Recommended)
```

### Q017
<!-- source: claude:a84f4eed-26f9-49ac-91eb-e2375c207e96:toolu_01Cc13WFFtu32Dip5ZmR38jX:1 -->

Question:
```text
Vibe agent copies do NOT update automatically. `sync-agents-vibe.cjs --check` exits 1: `.vibe/agents/orchestrate.toml` and `markdown.toml` have been stale since this packet's 016 commit changed their sources. Pi and DSH copies are in sync because CI checks them. Nothing checks Vibe: not the pre-commit hook, not CI, not `check-agent-mirror-sync.cjs`. What should I do?
```

Options:
```text
Regen + add CI check (Recommended)
Regenerate only
Leave for the research
```

Answer:
```text
Regen + add CI check (Recommended)
```

### Q018
<!-- source: claude:a84f4eed-26f9-49ac-91eb-e2375c207e96:toolu_018q56tcBGyxWsm2QqNRNQTi:0 -->

Question:
```text
The Mistral API budget is exhausted: both Vibe lineages got `402 API budget exhausted` on their first call and wrote no iterations. How should the 5-iteration agent-docs research run?
```

Options:
```text
Top up, then rerun Vibe (Recommended)
cli-pi LLM Gateway
cli-opencode, opencode-go
Stop for now
```

Answer:
```text
cli vibe doesnt have usage?
```

### Q019
<!-- source: claude:a84f4eed-26f9-49ac-91eb-e2375c207e96:toolu_012p8Fz9fnHiKLziwqrK5JRw:0 -->

Question:
```text
Your Vibe budget (€255, 0% used) is separate from the API budget (€25.50, 100% used), and the repo's Vibe dispatches bill the API one. How should the 5-iteration agent-docs research run?
```

Options:
```text
Probe the Vibe budget first (Recommended)
cli-pi LLM Gateway
cli-opencode, opencode-go
Wait for Dec 1
```

Answer:
```text
Probe the Vibe budget first (Recommended)
```

### Q020
<!-- source: claude:a84f4eed-26f9-49ac-91eb-e2375c207e96:toolu_01YWjR9cAKB3f9VNEoL3X6s5:0 -->

Question:
```text
To make the Vibe budget the default for every Mistral route, two layers need changing. Your machine: ~/.zshenv exports the API-budget key, and Pi's auth.json stores that same key. The repo: the runner passes the env key to Vibe lineages, and the docs require it. Which should I change?
```

Options:
```text
Both (Recommended)
Repo only
Machine only
```

Answer:
```text
Both (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
