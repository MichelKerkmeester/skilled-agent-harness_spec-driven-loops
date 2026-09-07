---
title: "Goal: Playbook provenance lines"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "playbook provenance goal directive"
  - "suite path proof objective"
  - "provenance line completion criteria"
  - "no fabrication goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/036-recorded-findings-closure/003-playbook-provenance-lines"
    last_updated_at: "2026-09-07T00:00:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-07-036-recorded-findings-closure-003"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Playbook provenance lines

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short:
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give every one of the 85 manual-testing-playbook files a real provenance line naming the automated suite or the hand procedure that proves it, backed by a test that fails if a cited path does not exist, without fabricating a suite that does not exist.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | A provenance line names a real suite path or the literal words "manual only" plus the exact command, never a third form |
| D2 | No line is written that names a suite the scenario does not actually have, even when that leaves a file "manual only" |
| D3 | Provenance lines land inside each file's existing Section 4, no new section is introduced, so the cross-skill structural gate (`playbook-operator-contract.yml`) needs no change |
| D4 | A new test under `runtime/cli` proves the claim on every future CI run, not just once at authoring time |

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

- [ ] `grep -rL "Provenance:" manual-testing-playbook --include="*.md"` returns zero files
- [ ] `playbook-provenance-paths.vitest.ts` exists and exits 0 against all 85 files
- [ ] Every suite-backed provenance line's path is confirmed to exist, none fabricated
- [ ] `playbook-operator-contract.yml`'s validator step still exits 0 against the changed tree
- [ ] `manual-testing-playbook.md` Section 8 names the provenance-line convention
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
