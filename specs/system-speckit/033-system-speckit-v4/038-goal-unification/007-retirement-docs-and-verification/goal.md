---
title: "Goal: Retirement, docs and verification"
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
    packet_pointer: "system-speckit/033-system-speckit-v4/036-goal-unification/007-retirement-docs-and-verification"
    last_updated_at: "2026-09-11T07:40:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-11-system-spec-kit-goals"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Retirement, docs and verification

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short:
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Retire the legacy goal store per ADR-2, bring every doc onto the packet-backed model, and prove all gates green from the final state.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Deletion waits for an operator yes after the rollback is named. |
| D2 | Docs are authored through sk-create-readme and sk-create-skill, not edited freehand. |

### Operator copy

The operator holds this directive as the session objective, and that copy is
what judges completion, not this file. Whenever anything above the log changes
(objective, a decision, the binding table, a criterion), resend the durable slice
of this file in chat, frontmatter excluded, so the operator can update their copy. A child goal change
that alters a parent decision or criterion is an amendment to the parent: apply
it there first, then resend the parent.
<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [ ] Recursive validate --strict on 036 reports RESULT: PASSED for every folder
- [ ] Goal suites, plugin tests, drift check and hygiene gate pass with outputs recorded
- [ ] deep review reports no open P0 or P1
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
| Phase scaffolded and directive authored | Done | This file, 2026-09-11 |
| Store demoted, not deleted | Done | ADR-002; store held zero records; `.state/goal/README.md` v1.1.0.0 carries the migration note for both key schemes; no rollback needed because nothing was removed |
| Docs | Done | hook `README.md`, `goal-plugin.md`, state README, spec-kit `SKILL.md`, feature catalog, changelog, 009 decision-record and spec amendments; all validate_document.py VALID |
| Verification sweep | Done | validate.sh --strict recursive 8/8 PASSED; hook suites 112/112; plugin suites 135/135; spec-doc-structure vitest 25/25; drift PASS; hygiene scan clean |
| Catalogs, playbooks, hook contracts | Done | Three catalog entries, eight playbooks (one new for Devin), hooks README matrix, injection contract, coverage rationale, hook-system transport paragraph, plugin READMEs, root README |
| Deep review pass 3 | Done | `review/lineages/deepseek-review-3`: 5 iterations, 0 P0, 0 P1, 10 P2; eight fixed in phase 008 plus one rejected with probe evidence (the lock root stays in the workspace, unclosed-opener and tolerant-fence parity with a real cross-implementation pin, README import claims, session-free `packet-log` replacing the undecidable carve-out, `packet` without session, log-cell sanitizing, plugin rebind archiving, Devin note rescoped to three writers); F107 stays a live-run unknown |
| Deep review pass 2 | Done | `review/lineages/deepseek-review-2`: 5 iterations, 0 P0, 0 P1, 7 P2; F101-F106 fixed in phase 008, F107 recorded in DV-022 |
| Deep review | Done | 3-iteration deepseek review lineage: 0 P0, 5 P1, 10 P2. All 5 P1 fixed (fence tolerance, symlink containment, set-time budget report, OpenCode reminder, ADR wording). 4 P2 fixed (F011, F012, F013, F015). 6 P2 recorded as follow-ups. |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | |
<!-- /ANCHOR:log -->
