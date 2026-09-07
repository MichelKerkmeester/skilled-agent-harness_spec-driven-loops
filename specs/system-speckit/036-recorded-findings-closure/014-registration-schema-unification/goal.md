---
title: "Goal: Registration schema unification"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "registration schema unification"
  - "hook registration drift"
  - "one behavioral contract five schemas"
  - "generated hook registration check"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/036-recorded-findings-closure/014-registration-schema-unification"
    last_updated_at: "2026-09-07T00:00:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-014-registration-schema-unification"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Registration schema unification

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short:
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make one canonical source describe the hook set that five CLI runtimes register through five structurally different, hand-authored schemas, so a change to the behavioral contract requires one edit instead of five hand-synchronized ones.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The generator's first run must reproduce the four current JSON files byte-for-byte before any behavioral change is considered |
| D2 | The generator writes only the `hooks` key of `.claude/settings.json`, never the file's other hand-authored keys |
| D3 | Pi's registration is verified against the canonical source, not generated, since Pi has no JSON file to write into |
| D4 | The four runtimes' structural dialects (nesting shape, matcher convention, project-dir variable, fallback-envelope text) are modeled as four distinct template functions, not one parameterized template |

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
- [ ] The canonical hook-set source exists and names every hook from all four current registration files
- [ ] The generator's first run reproduces the four JSON files byte-for-byte against their pre-change content
- [ ] `node <generator script> --check` exits 0 against the repository
- [ ] `sync-runtime-mirrors.cjs --check` still exits 0 against the regenerated files
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
