---
title: "Goal: Phase 4: catalog-and-playbook"
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
    packet_pointer: "cli-jev/001-cli-jev-creation/004-catalog-and-playbook"
    last_updated_at: "2026-09-20T13:25:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Repointed after the packet move; the directive records the landed catalog and playbook"
    next_safe_action: "None; the phase is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 4: catalog-and-playbook

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

**Objective:** The mode ships a feature catalog and a manual-testing playbook that their package validators accept, and the unauthenticated run is recorded with its skips named rather than hidden.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | One scenario file per JEV id: the combined per-category files were rejected by the playbook validator, so the playbook was split rather than the validator bent |
| D2 | Verdicts live in benchmark reports, never in the playbook text, so a run record cannot drift from its scenario |
| D3 | The credential-gated rows stay `SKIP` until a provider key exists, and the blocker is named in the row |

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

- [x] `validate_catalog_package.py --package cli-external-orchestration/cli-jev --strict` printed `PASS` with 0 violations
- [x] `validate-playbook-package.cjs --package cli-external-orchestration/cli-jev` printed `PASS`, 22 scenarios across 5 categories, 0 violations
- [x] The run report records 20 `PASS` and 2 `SKIP`, each skip naming the missing credential
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
| Catalog landed | Done | `feature-catalog/` root plus four category files; the catalog validator clears |
| Playbook restructured | Done | 22 per-scenario files across five kebab-case categories; the package validator clears |
| Unauthenticated run recorded | Done | `benchmark/reports/2026-09-20-phase-004-unauthenticated-pass/skill-benchmark-report.md` |

### Deviations and findings

| Item | Note |
|------|------|
| The first playbook shape failed its validator with 63 violations | Five multi-scenario files were split into 22 per-scenario files on the validator's own contract, not around it |
| The credential-gated scenarios could not run | Recorded as `SKIP` with the blocker named; the authenticated half was verified later, in phase 005, once the operator supplied a key |
<!-- /ANCHOR:log -->
