---
title: "Goal: Links scan registry rule"
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
    packet_pointer: "system-speckit/036-recorded-findings-closure/007-links-scan-registry-rule"
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
# Goal: Links scan registry rule

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short:
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Turn `check-links.sh` into a real `LINKS_VALID` registry row `validate.sh` runs, and resolve `rename-pattern.md`'s four `[[feedback_*]]` memory-name wikilinks so the new rule does not fail on its own skill's documentation the moment it is registered.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The rule's scan target stays fixed at `.opencode/skills/system-spec-kit`, not derived from the folder `validate.sh` was pointed at |
| D2 | The `mcp-obsidian` broken-link finding and repo-wide `specs/` wikilink coverage stay out of scope. Only `system-spec-kit`'s own tree is this rule's concern |
| D3 | An allowlist convention is preferred over a blanket rewrite for the memory-name citations, so their distinctive `[[feedback_*]]` form can stay where it reads better |
| D4 | The registry row and the `rename-pattern.md` fix ship together. A row without the fix fails the registry-coverage test immediately |

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

- [ ] `validator-registry.json` carries a `LINKS_VALID` row
- [ ] `bash rules/check-links.sh .opencode/skills/system-spec-kit` exits 0
- [ ] `validate-runs-every-registry-rule.vitest.ts` reports `LINKS_VALID` present
- [ ] `validate.sh --strict` on a sample of `specs/system-speckit/` packets shows no new failure
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
