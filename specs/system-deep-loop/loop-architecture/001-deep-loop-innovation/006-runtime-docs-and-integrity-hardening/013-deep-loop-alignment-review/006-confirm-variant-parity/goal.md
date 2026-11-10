---
title: "Goal: confirm variant parity"
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
    packet_pointer: "scaffold/006-confirm-variant-parity"
    last_updated_at: "2026-09-15T14:23:14Z"
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
# Goal: confirm variant parity

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

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

**Objective:** Bring each confirm command variant into parity with its auto twin, or record each divergence as deliberate in the YAML.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The line-one config record, the stop policy binding, the reducer artifact argument, the resource-map posture, the git staging invariant and the mechanical post-dispatch gate either match the auto variant or carry an in-YAML rationale naming why the interactive surface differs. |
| D2 | A step the confirm variant omits is either restored or listed in one place with its reason, so the census does not have to be rediscovered. |
| D3 | Fixed by DeepSeek V4.1 Flash at max through the gateway on cli-pi, one dispatch for this phase alone, verified by the deep-loop suite before the next phase starts. |

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

- [x] Every functional divergence between a confirm variant and its auto twin is either closed or carries an in-YAML rationale
- [x] The confirm variants' adjudication records are in a shape their mode gateway accepts
- [x] Contract drift tests and the deep-loop suite exit zero
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
| Phase fix | Done | One DeepSeek V4.1 Flash max dispatch on cli-pi via the gateway; ten divergences closed across four workflow files, fourteen censused, four parity tests added |
| Full suite | Green | 2654 passed, 8 skipped, 1 failed across 152 files; the one failure is a stress assertion another session's commit staled |

### Deviations and findings

| Item | Note |
|------|------|
| Beyond the brief | Three functional holes found while closing the named seven were closed with them, because a restored step without its enabling machinery reads as parity without being it |
| Auto was sometimes the wrong one | Three defects lived in the auto variant, so it was corrected rather than copied |
| Shared branch | A neighbouring commit added executor binary probing and staled one cli-adapter stress assertion; recorded as the suite baseline, not fixed, since it is that session's surface |
<!-- /ANCHOR:log -->
