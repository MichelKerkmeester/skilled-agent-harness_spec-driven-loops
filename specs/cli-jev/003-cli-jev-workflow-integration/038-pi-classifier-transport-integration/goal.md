---
title: "Goal: Phase 38: pi-classifier-transport-integration"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "pi classifier transport integration goal"
  - "jev transport switch goal"
  - "pi transport integration criteria"
  - "choice transport opt-in goal"
  - "pi transport follow-up list"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/038-pi-classifier-transport-integration"
    last_updated_at: "2026-09-30T16:30:00Z"
    last_updated_by: "markdown-leaf"
    recent_action: "Authored the durable directive as a Planned phase"
    next_safe_action: "Build the phase against the completion criteria"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/038-pi-classifier-transport-integration/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/038-pi-classifier-transport-integration/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-038-pi-classifier-transport-integration"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 38: pi-classifier-transport-integration

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make Pi's native classifier runtime an opt-in transport for Jev `choice` questions, and teach cli-pi workers to use it, without changing today's default.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The jev CLI stays the default. Pi answers only when a caller or the environment asks for it by name |
| D2 | Only `choice` moves, as 037 measured. `bool` and `score` stay on the CLI until each passes its own run under 037's keep rule |
| D3 | The transport returns the shape callers get from the jev CLI today. A caller that opts in changes one call, not its parsing |
| D4 | When Pi is asked for but its gate fails, the transport prints one skip line and does what `spec.md` fixes. It never switches silently |
| D5 | Pi's own store holds every credential. The transport never reads, prints or passes a key. Runtime trees owned by other packets are not edited |
| D6 | Executors follow parent D5: DeepSeek writes, MiMo reviews, no Claude workers. Fix P0 and P1, record P2 |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] With the switch off, every changed caller prints what it printed before, byte for byte, on a stub-backed run
- [ ] With the switch on, the transport answers a `choice` question through Pi and returns the CLI's result shape, proved by tests with both backends stubbed
- [ ] A failed Pi gate prints one skip line and follows the rule in `spec.md`, proved by a test for each gate
- [ ] `cli-jev` and `cli-pi/SKILL.md` document the Pi route, and `validate_document.py` is VALID on every changed doc
- [ ] Runtime-tree callers are listed as a follow-up with file paths, and `validate.sh --strict` passes for this phase
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
| Spec authored | Done | 2026-09-30, docs only, from `scratch/context/context.md`, the 037 verdict and the operator's "Plan the integration". Status Planned, Level 2, priority P1. No build exists |

### Deviations and findings

| Item | Note |
|------|------|
| Planned state (2026-09-30) | At authoring, nothing is built and the five completion criteria are open. The five open questions in `spec.md` section 10 each carry a proposed answer, and the gate-failure rule in `spec.md` section 4 is fixed at spec approval, before any wiring |
| Basis | 037's one approved live run printed `verdict pi-transport: adopt K=111 M=111 coverage=100.0 agreement=95.5 median_abs_dp=0.0100 p95_ms=340/387 cost_per_100=0.0022` for `choice` only, on Pi 0.99.1 `openrouter` `typesafe/jev-1.13` against the CLI's `official` `jev-1.13.0`, and it holds on a one-row margin (`../037-pi-native-classifier-transport/scratch/live-run.stdout.txt`) |
| Out of scope | Any edit under the system-deep-loop, system-skill-advisor or system-spec-kit runtime trees, adopting `bool` or `score` without their own measured run, installing anything, and changing the default transport (D1, D2, parent D7) |
<!-- /ANCHOR:log -->

---
