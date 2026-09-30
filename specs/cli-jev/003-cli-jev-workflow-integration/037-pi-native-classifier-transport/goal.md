---
title: "Goal: Phase 37: pi-native-classifier-transport"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "pi native classifier transport goal"
  - "pi transport verdict criteria"
  - "jev transport comparison goal"
  - "pi classify comparison completion"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/037-pi-native-classifier-transport"
    last_updated_at: "2026-09-30T13:22:09Z"
    last_updated_by: "markdown-leaf"
    recent_action: "Authored the planned phase docs from the recorded context"
    next_safe_action: "Operator: give the live-run yes and choose any extra columns"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/037-pi-native-classifier-transport/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/037-pi-native-classifier-transport/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-037-pi-native-classifier-transport"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 37: pi-native-classifier-transport

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Measure whether Pi's native classifier runtime answers the packet's Jev questions as the jev CLI does, at a similar speed and cost, before anything is wired to it.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The default run is a zero-call census. A live call runs only behind its own switch after the operator's yes, and every call is recorded |
| D2 | Pi is reached through its SDK (`ModelRuntime`) from a Node script, never through an agent turn. The script never reads, prints or passes a key: credentials stay in Pi's own store |
| D3 | Both sides ask the same model, Jev 1.13: the jev CLI through its `official` provider and Pi through `openrouter` `typesafe/jev-1.13` |
| D4 | The keep rule in `spec.md` is fixed before any live run and prints one line `verdict pi-transport: adopt\|keep-cli\|stop (<reason>)` |
| D5 | No integration change here. Other classifier families and a llama.cpp model are extra columns, each only on the operator's yes |
| D6 | Executors follow parent D5: DeepSeek writes, MiMo reviews, no Claude workers. Fix P0 and P1, record P2 |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] The default run prints Pi's version, the classifier models available per provider, the jev CLI identity line and the replay row count, and makes no model call
- [ ] One approved live run prints top-choice agreement, the median probability difference, p95 latency per side and Pi's cost per 100 calls, with every call in `calls.jsonl`
- [ ] The run ends in one `verdict pi-transport:` line under the keep rule fixed in `spec.md`
- [ ] The script's tests cover each public surface with a happy path and an edge case, both backends stubbed
- [ ] `validate_document.py` is VALID on every doc the phase changes, and `validate.sh --strict` passes for this phase
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
| Spec authored | Done | 2026-09-30, docs only, from `scratch/context/context.md` and the operator's "Test it first (Recommended)". Status Planned, Level 2, priority P1. No build exists |
| Build | Pending | No code exists yet. The completion criteria above are all open, and no verdict line exists |
| Live run | Pending | Waits on the operator's yes, one approved run on the real tree |

### Deviations and findings

| Item | Note |
|------|------|
| Planned state | Nothing is built. The five completion criteria are open, and the three open questions in `spec.md` section 10 each carry a proposed answer. The keep rule in `spec.md` section 4 was fixed at spec approval, before any live call |
| Prior evidence | The operator's live 019 Jev run holds 333 `choice` calls over 111 rows on `jev-1.13.0` through provider `official`, every call `measured` on attempt 1 (`specs/cli-jev/003-cli-jev-workflow-integration/019-advisor-suggested-order/scratch/w4-session/jev-run/calls.jsonl`). Pi's zero-call probe found 12 classifier models known and 7 with credentials present, all through `openrouter` |
| Today's transport | `.skilled/skills/cli-classifier/cli-usage/SKILL.md:97` pins `jev --version` at `jev 0.6.2`, and the shipped arms shell out to `jev noul\|choice\|score` after `jev auth status --provider <p>` |
| Out of scope | Wiring Pi into `cli-classifier` or `cli-pi` waits on the verdict and the operator's call. The skill-advisor runtime tree is read-only to this phase, and no install runs (parent D7) |
<!-- /ANCHOR:log -->

---
