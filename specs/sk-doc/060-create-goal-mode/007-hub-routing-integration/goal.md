---
title: "Goal: Phase 7: hub-routing-integration"
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
    packet_pointer: "sk-doc/060-create-goal-mode/007-hub-routing-integration"
    last_updated_at: "2026-09-25T19:30:00Z"
    last_updated_by: "gpt-6-luna"
    recent_action: "Planned hub routing checks"
    next_safe_action: "Execute after phases 002-006 provide the mode packet"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "not-recorded"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Which authoring-only aliases route through both stages without capturing session-goal phrases?"
      - "Which actual mode-packet leaves should the stage-two resource map name?"
      - "Does the completed mode packet already declare the final alias source line within the frozen phase scope?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 7: hub-routing-integration

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything between the frontmatter and the log is the DURABLE SLICE: it is
> what an operator sets as the session objective, and it must stay true for the
> life of the packet. The frontmatter above it is bookkeeping and never leaves
> this file: it is not sent in chat, not injected, not stored in an objective.
> Keep the slice short. A phase parent or top-level packet has one limit, 4000
> characters, measured from the frontmatter's closing fence to the log anchor.
> Up to 4000 passes and past it fails; the runtime goal surfaces cap what they
> hold, and a truncated objective loses its tail, which is where the criteria
> live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Goal-authoring requests reach sk-create-goal through both sk-doc routing stages without routing session-goal management into the mode.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Candidate aliases describe authoring a packet goal artifact; bare `goal` and session-management verbs are excluded. |
| D2 | Reachability evidence separately observes advisor identity, hub mode target and generated leaf resolution on a fixed prompt corpus. |

### Operator copy

The operator holds this directive as the session objective, and that copy is
what judges completion, not this file. Whenever anything above the log changes
(objective, a decision, the binding table, a criterion), resend this file's
chat slice so the operator can update their copy. The chat slice is the
durable slice without its frontmatter, HTML comments, anchor markers, `---`
dividers or heading section numbers, and `goal.cjs packet` prints it as
`chat_slice`. Never send more than 4000 characters: cut this file first. Keep
reminding while the copy stays unset, and never stop work for it. A child goal
change that alters a parent decision or criterion is an amendment to the
parent: apply it there first, then resend the parent.
<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [ ] The explicit-path sk-doc parent-skill check exits 0.
- [ ] At least one goal-authoring prompt selects sk-doc and then sk-create-goal, while all six session-goal and host-command probes produce zero sk-create-goal targets.
- [ ] The same ten newcomer prompts have ten recorded before rows and ten recorded after rows.
- [ ] `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --check .skilled/skills/sk-doc` exits 0.
- [ ] Strict validation of this phase prints `RESULT: PASSED`.
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
| Phase planned | Done | this folder's spec.md, plan.md, tasks.md |
| Mode registered in the hub | Done | Registry, hub router, surface router, advisor metadata and `SKILL.md`; parent-skill check OK |
| Newcomer replay | Done | 0 of 10 before, 10 of 10 after at the hub, 9 of 10 at the advisor; 0 of 6 probes |
| Compiled routing republished | Done | Canary 22 of 22; all hubs `compiled-serving`; no lock or rollback left |
| Strict validation | Done | `RESULT: PASSED` on 2026-09-26 |

### Deviations and findings

| Item | Note |
|------|------|
| Scope amendment | Operator approved on 2026-09-26: this phase also updates the sk-doc canary fixture and harness topology counts and republishes compiled routing (REQ-008, T013, AC-008), as the frontmatter mode registration required. No parent decision or criterion changed. |
| Authored canary source amendment | Operator approved on 2026-09-26: the canary case is mirrored into the authored fixture, and the authored activation manifest is re-minted (REQ-008). No parent decision or criterion changed. |
| Executor | MiMo 2.6 Pro on cli-pi, chosen by the operator after cli-codex ran out of quota and LLM Gateway Luna failed on tool turns. |
| Worker fixes | The orchestrator restored five dropped trailing newlines and republished after mirroring the canary case. |
<!-- /ANCHOR:log -->
