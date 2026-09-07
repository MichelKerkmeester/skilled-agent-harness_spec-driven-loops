---
title: "Goal: Gate 1 instruction parity"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "gate 1 instruction parity"
  - "runtime instruction file drift"
  - "codex nodeterm block boundary"
  - "trigger index lookup pointer"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/036-recorded-findings-closure/013-gate1-instruction-parity"
    last_updated_at: "2026-09-07T00:00:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-013-gate1-instruction-parity"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Gate 1 instruction parity

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short:
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make every CLI runtime this repository supports either carry the Gate 1 trigger-index lookup instruction, be documented and verified to inherit it or receive it through an existing session hook, and prove that reach with a doctor check instead of an assumption.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Root AGENTS.md stays the single canonical source of the Gate 1 line. No runtime file duplicates the whole document, only a short generated pointer |
| D2 | The generator never writes inside the nodeterm-owned block in `.codex/AGENTS.md`. It fails closed if the markers move |
| D3 | Pi's real AGENTS.md-consumption behavior is confirmed from outside this repository's own assumptions before any Pi-specific file is touched |
| D4 | Cursor and Devin share one pointer through `.cursor/rules/skill-routing.md`, the file both already read, rather than each gaining a separate copy |

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

- [ ] `spec.md`, `plan.md`, `tasks.md` and `acceptance-criteria.md` exist with no bracketed placeholder remaining
- [ ] The Pi investigation's answer and source are recorded in `.pi/SYNC.md`
- [ ] The Gate 1 pointer generator exists with a working `--check` mode
- [ ] `.codex/AGENTS.md`'s nodeterm-marked region is confirmed byte-identical after the generator runs
- [ ] The doctor's `gate1_instruction_parity` signal exists in `doctor-speckit-retrieval.yaml` and reports per-runtime reach
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

### Deviations and findings

| Item | Note |
|------|------|
<!-- /ANCHOR:log -->
