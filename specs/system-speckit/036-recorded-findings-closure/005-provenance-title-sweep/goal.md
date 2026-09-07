---
title: "Goal: Provenance title sweep"
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
    packet_pointer: "system-speckit/036-recorded-findings-closure/005-provenance-title-sweep"
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
# Goal: Provenance title sweep

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short:
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Strip the scaffold's `[template:level-N/doc]` provenance token from the titles of the 929 in-scope committed spec documents this session owns, regenerate each touched packet's metadata, and add a third hard class to `rules/check-placeholders.sh` so the token cannot silently return.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Only the `title:` frontmatter field is stripped. Prose that quotes the token while describing this exact defect stays as written |
| D2 | The four other-session groups (`sk-doc/052-routing-completeness`, `system-deep-loop/036-deep-loop-innovation`, `sk-design/*`, `sk-doc/051-*`) stay untouched and are named as left for their owners |
| D3 | The sweep and the third rule class ship in the same change, since either one alone leaves the corpus and the validator disagreeing |
| D4 | Fixtures that model an untouched scaffold on purpose (`072-scaffold-never-touched-violation`) keep their token. Only fixtures that stand for "valid, fully authored" are swept |

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

- [ ] `grep -rIl '\[template:level' specs` returns only paths under the four excluded groups
- [ ] `rules/check-placeholders.sh` reports a title carrying the token as a fail under a third named class
- [ ] `002-valid-level1`, `003-valid-level2` and `004-valid-level3` validate strict clean under the new class
- [ ] The runtime and CLI vitest projects, the goldens and `npm run check` pass with no new failure
- [ ] `validate.sh --strict` prints `RESULT: PASSED` for this child
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
