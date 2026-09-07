---
title: "Goal: Shared package post-remediation cleanup"
description: "The durable directive this packet executes against, and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/035-spec-kit-simplification-research/015-shared-package-post-remediation-cleanup"
    last_updated_at: "2026-09-07T07:05:00Z"
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
# Goal: Shared package post-remediation cleanup

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short —
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Close every confirmed finding from the shared-package lane's second round so that the package's manifest, modules, README and tests describe and exercise what exists after the decommission, and the live-half duplication the lane found is a recorded decision with its reason, with nothing deferred.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | A README table that describes readers is generated from the files that read, never typed |
| D2 | The two live Ollama implementations and the eight root resolvers stay: the first is the advisor's stack, the second marks module-system boundaries; both are recorded with their reasons |
| D3 | The factory's database candidate scan stays because it reads the advisor's active embedder; only the ownerless profile cluster goes |
| D4 | The sk-doc baseline loses the rows for READMEs this program removed and nothing else |

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

- [x] Every row of the shared-package lane's round-two section names a fix, a kept reason or a recorded decision
- [x] The shared package builds from clean, its lane passes with two new tests, and the CLI and runtime build with the removals
- [x] The README's reader table is generated from the code
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
| Seven P1 and forty-two P2 rows censused | Done | `../003-shared-package-utilization/research/confirmed-findings.md` §6 |
| Manifest, module, test, README and baseline changes | Done | `implementation-summary.md` Files Changed |
| Gates | Done | shared build and lane, CLI rebuild and check, runtime build, dist freshness, two suites, residue search, sk-doc validator, strict validation |

### Deviations and findings

| Item | Note |
|------|------|
| The parity test was already failing on 36 other rows | The lane blamed one row; the two rows this program owns are gone, and the rest are sk-doc's validator and fixture drift under other skills, reported to the operator. |
| The lane's "adapter is a shim" was wrong in round one | Round two corrected it: both Ollama implementations are live; the decision to leave them is recorded. |
<!-- /ANCHOR:log -->
