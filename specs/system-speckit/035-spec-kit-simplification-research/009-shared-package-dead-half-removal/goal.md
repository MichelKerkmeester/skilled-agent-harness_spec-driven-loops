---
title: "Goal: Shared package dead half removal"
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
    packet_pointer: "system-speckit/035-spec-kit-simplification-research/009-shared-package-dead-half-removal"
    last_updated_at: "2026-09-07T00:20:00Z"
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
# Goal: Shared package dead half removal

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short —
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Close every confirmed finding from the shared package lane so that every module in the package has an importer, every derived path names something that exists, and the README describes the package a consumer reaches, with nothing deferred.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | A module is removed only when the real-tree census finds no importer outside the root barrel and its own tests; a document that cites a module as a contract counts as an importer |
| D2 | A claim the lane derived from its worktree's provisioning is recorded as an environment fact, not fixed in the repository |
| D3 | A derivation kept only for its directory becomes a directory export; nothing keeps a sentinel path nobody writes |
| D4 | Contracts the skill advisor owns are recorded for its maintainers, not changed from this program |

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

- [x] Every row of the research lane's confirmed-findings table names a fix commit, a correction or a recorded decision
- [x] Shared, runtime and CLI build, the CLI check gate and the shared tests pass after the removals
- [x] The telemetry store still resolves to runtime/database under the skill root
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
| Ten P1 rows censused: six confirmed, three corrected, one dropped | Done | `../003-shared-package-utilization/research/confirmed-findings.md` |
| Removals, seam repairs, README rewrite | Done | `implementation-summary.md` Files Changed |
| Gates | Done | three builds, check gate, shared lane, 33 runtime tests, drift guard, full CLI project, strict validation |

### Deviations and findings

| Item | Note |
|------|------|
| The predicate module came back | Zero code importers, but three speckit contracts and one deep contract cite it as their `when:` grammar; a contract's citation is a consumer. |
| The registry's error class came back, unexported | The synthesis counted references and missed the `throw` inside the same file; the build caught it. |
| Two more documents named removed members than the synthesis listed | The parsing README and the CLI lib README; both corrected in the residue sweep. |
<!-- /ANCHOR:log -->
