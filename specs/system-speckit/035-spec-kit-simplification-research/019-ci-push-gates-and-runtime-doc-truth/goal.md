---
title: "Goal: CI push gates and runtime document truth"
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
    packet_pointer: "system-speckit/035-spec-kit-simplification-research/019-ci-push-gates-and-runtime-doc-truth"
    last_updated_at: "2026-09-07T15:20:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Closed every criterion"
    next_safe_action: "None; the packet is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-06-simplification-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: CI push gates and runtime document truth

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short:
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Close every confirmed finding from the CLI runtime lane's third round so that a direct push meets the gates a pull request meets, every harness in the tests folder runs in a lane, and the documents name what the code reads, with nothing deferred.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | A gate that guards the skill runs on push with the skill's path filter; review-time gates stay pull-request only and the README says so |
| D2 | A harness in the tests folder runs in a lane or is removed; none stays orphaned |
| D3 | A row that fails to reproduce is recorded with the line that shows why |

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

- [x] Every row of the CLI runtime lane's round-three section names a fix, a document change or a recorded reason
- [x] Both workflows declare a push trigger and parse
- [x] The validation lane runs the four harnesses
- [x] validate.sh --strict prints RESULT: PASSED for this child
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
| Packet opened | Done | this file |
| Twelve rows and one parked GLM iteration censused | Done | `../002-cli-runtime-utilization/research/confirmed-findings.md` §7 |
| Workflow, reference, package, asset and comment changes | Done | `implementation-summary.md` Files Changed |
| Gates | Done | yaml parse, harnesses by hand, four lanes, strict validation |

### Deviations and findings

| Item | Note |
|------|------|
| Two rows did not reproduce | The pi adapters' import base is documented; the example file is at the root |
| The mirror job had never run on a push | So its missing install was invisible until the push trigger existed; lane 003's round found the same job |
| The first push run failed twice more | The mirror scripts require the shared package's compiled output, and the runner ships no ripgrep; the workflow builds the package and installs ripgrep now |
| The second push run failed the runtime project on Linux | Four suites hard-coded the macOS temp root, one imports a plugin SDK the runner lacked, and one spawned the live advisor; all three are portable now. The mirror job also reports codex prompt drift from the other session's design-command rename, which is theirs to regenerate |
<!-- /ANCHOR:log -->
