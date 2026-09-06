---
title: "Goal: CLI package residue removal"
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
    packet_pointer: "system-speckit/035-spec-kit-simplification-research/007-cli-package-residue-removal"
    last_updated_at: "2026-09-06T18:40:00Z"
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
# Goal: CLI package residue removal

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short —
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Close every confirmed finding from the CLI runtime lane so that the package holds only what something reaches, its records describe what the code does, and its gates run in CI, with nothing deferred.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | A file is removed only after a repository-wide reference census finds no consumer outside specs, changelogs and benchmark reports |
| D2 | A duplicate that turns out to serve a different input or consumer is documented at both sites rather than merged |
| D3 | The index carries only this packet's hunks; another session's uncommitted edits to the same files stay in the working tree |
| D4 | A test that reads another session's live packet is recorded as failing, never patched around |

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

- [x] Every row of the research lane's confirmed-findings table names a fix commit or a recorded decision
- [x] npm run check and the CLI vitest project pass after the removals, except the one test that reads another session's packet
- [x] A GitHub workflow runs the CLI check gate, typecheck, the shared tests, the CLI vitest project and the mirror checks
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
| Census of 13 removal, 11 merge and 13 fix rows | Done | `../002-cli-runtime-utilization/research/confirmed-findings.md` |
| Removals, corrections, regex, workflow | Done | `implementation-summary.md` Files Changed |
| Gates | Done | rebuild, `npm run check`, dist fresh, six vitest files, legacy suite, shared tests, full CLI project, strict validation |

### Deviations and findings

| Item | Note |
|------|------|
| Another session's README sweep landed in the working tree mid-phase | Edits were re-applied onto HEAD copies and staged by object id; the sweep stays theirs. |
| Two findings not in the synthesis | The export-contracts test could not run and asserted retired handlers, removed; the manifest test reads another session's packet, recorded. |
| Mirror checks fail today on the other session's uncommitted diagram move | Left as their drift; the new workflow will surface it, which is what the finding asked for. |
<!-- /ANCHOR:log -->
