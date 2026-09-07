---
title: "Goal: Shared README generator and dead exports"
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
    packet_pointer: "system-speckit/035-spec-kit-simplification-research/021-shared-readme-generator-and-dead-exports"
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
# Goal: Shared README generator and dead exports

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short:
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Close every confirmed finding from the shared package lane's third round so that a claim of generation is backed by a generator, a check and a test, the package exports only what something imports, and CI does what its comments say, with nothing deferred.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | A README sentence that says generated is backed by a committed generator with a check mode and a test |
| D2 | An export with no importer beyond its own test is removed; one a test imports through the package is a public surface and stays |
| D3 | A CI step exists because a script needs it; a build no step loads is removed |
| D4 | The advisor's files are another lane's surface and are recorded, not edited |

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

- [x] Every row of the shared package lane's round-three section names a fix, a document change or a recorded reason
- [x] The generator's check mode passes and runs under the shared test suite
- [x] The two dead exports are gone and the builds pass
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
| Twenty-two rows and two parked GLM iterations censused | Done | `../003-shared-package-utilization/research/confirmed-findings.md` §7 |
| Generator, tests, README, export, type, comment and workflow changes | Done | `implementation-summary.md` Files Changed |
| Gates | Done | generator check, shared suite, builds, four lanes, strict validation |

### Deviations and findings

| Item | Note |
|------|------|
| Child 015's claim was overstated | The table was produced by a scan that was never committed; this child commits the generator |
| The first retry test assumed field names the module does not use | Rewritten against the module's config shape |
<!-- /ANCHOR:log -->
