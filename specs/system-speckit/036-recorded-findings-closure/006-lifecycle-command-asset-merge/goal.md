---
title: "Goal: Lifecycle command asset merge"
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
    packet_pointer: "system-speckit/036-recorded-findings-closure/006-lifecycle-command-asset-merge"
    last_updated_at: "2026-09-07T00:00:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Lifecycle command asset merge

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short:
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Merge the `/speckit:plan`, `implement` and `complete` auto/confirm workflow asset pairs into one asset per command with an execution-mode branch and a declared checkpoint list, collapse the six duplicated `save_context` copies into one shared tail, and comment every `validate.sh --strict` call site with its cadence reason.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Each command keeps exactly one asset after the merge. Execution mode is a field the agent reads, not a second file |
| D2 | Step content, order and behavior stay as they are. This phase is a structural merge, not a workflow redesign |
| D3 | `complete`'s reuse of `plan`'s and `implement`'s step names stays documented, not collapsed into a sub-workflow reference. That larger change is out of scope |
| D4 | `resume.md`'s workflow assets and the presentation `.txt` files stay untouched, since neither is duplicated per mode today |

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

- [x] `ls .opencode/commands/speckit/assets/speckit-{plan,implement,complete}*.yaml` lists three files, not six
- [x] `save_context` is defined once and referenced by all three merged assets
- [x] Every `validate.sh [SPEC_FOLDER] --strict` call site carries a one-line cadence comment
- [x] `validate-command-tree-parity.sh` and `sync-runtime-mirrors.cjs --check` both exit 0
- [x] `validate.sh --strict` prints `RESULT: PASSED` for this child
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
| Six assets merged into three with `execution_mode`, `checkpoints` and `mode_overrides.confirm`; shared save-context tail extracted; every validate.sh site commented | Done | `implementation-summary.md` Verification |
| Consumers re-pointed: five tests, three routers, README, SKILL.md, two catalog entries, two playbooks | Done | grep for the six old names outside specs, changelogs and benchmark reports returns nothing |
| Gates | Done | PyYAML parses all four assets; workflow test 144 pass with the four pre-existing phase-flag failures unchanged; plugin test 4/4; intake payload test 7/7; autopilot contract 4/4; BooleanExpr suite passes; parity and mirror checks PASS 169 mirrors |

### Deviations and findings

| Item | Note |
|------|------|
<!-- /ANCHOR:log -->
