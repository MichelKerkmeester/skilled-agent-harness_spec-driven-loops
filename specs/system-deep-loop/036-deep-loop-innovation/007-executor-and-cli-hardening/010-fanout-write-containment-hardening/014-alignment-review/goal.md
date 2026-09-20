---
title: "Goal: alignment review"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "scaffold/014-alignment-review"
    last_updated_at: "2026-09-14T22:56:44Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Phase fix landed and criteria checked"
    next_safe_action: "Commit once the full suite exits zero"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: alignment review

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything between the frontmatter and the log is the DURABLE SLICE: it is
> what an operator sets as the session objective, and it must stay true for the
> life of the packet. The frontmatter above it is bookkeeping and never leaves
> this file: it is not sent in chat, not injected, not stored in an objective.
> Keep the slice short. A phase parent or top-level packet warns past 3000
> characters and fails past 4000, measured from the frontmatter's closing fence
> to the log anchor; the runtime goal surfaces cap what they hold, and a
> truncated objective loses its tail, which is where the criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Run a fifteen-iteration alignment review of the remediated tree and bind every confirmed finding to a phase or record it as reviewed.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The review reads six dimensions against the repo rules: sk-code and OpenCode alignment, feature catalog and playbook alignment, SKILL.md against its references and assets, deep-loop command alignment, deep-loop agent alignment, and general architecture. |
| D2 | Executors in fallback order: DeepSeek V4.1 Flash max on cli-devin as the primary, three lanes of five iterations at concurrency three; a lane that fails moves to LUNA max fast on cli-codex, then to DeepSeek V4.1 Flash max on cli-pi via the gateway. The gateway serves no V4.2 Flash id, so V4.1 stands in for the third rung until one exists. |
| D3 | No early stop: the stop policy is max-iterations with convergence off, and the merged verdict is strongest-restriction across lanes. |

### Operator copy

The operator holds this directive as the session objective, and that copy is
what judges completion, not this file. Whenever anything above the log changes
(objective, a decision, the binding table, a criterion), resend the durable
slice of this file in chat, frontmatter excluded, so the operator can update
their copy. Keep reminding while it stays unset; never stop work for it. A
child goal change that alters a parent decision or criterion is an amendment
to the parent: apply it there first, then resend the parent.
<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [x] Fifteen iterations completed across the lanes, each state record carrying the route-proof fields, merged with an attribution table naming kind and model per lane
- [x] Every P0 and P1 finding is verified against the repository and either bound to a new phase under this packet or recorded as reviewed with the reason
- [x] The parent goal's last criterion is checked with the verdict and the binding table cited
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
| Phase fix | Done | Three cli-devin DeepSeek V4.1 Flash max lanes, five iterations each; merged CONDITIONAL, P0 0, P1 7; findings bound to phases 016 to 020, all landed |
| Full suite | Green | Each bound phase carried its own green full suite; the last, phase 020, `npm test` in the runtime: 152 files, 2644 passed, 8 skipped, exit 0, 1291 s |

### Deviations and findings

| Item | Note |
|------|------|
| Bound | 016 command YAML alignment; 017 protocol and catalog; 018 orchestrate mirrors; 019 forced-depth empty records; 020 direct append sites |
| Recorded as reviewed | the review YAML's single-executor linked-worktree guard predates the packet and gates the operator's session worktree; Pi's generated tools list omits the delegation tool because no installed package registers one; a model-benchmark remediation test expects the retired opencode-go DeepSeek route, outside this packet |
| Executor deviation | no DeepSeek V4.2 Flash on the gateway; V4.1 stood in for the third fallback rung, never exercised |
<!-- /ANCHOR:log -->
