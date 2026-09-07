---
title: "Goal: Hook adapter thin transports"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "hook adapter goal directive"
  - "spec gate port objective"
  - "adapter thin transport completion"
  - "runtime trio goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/036-recorded-findings-closure/001-hook-adapter-thin-transports"
    last_updated_at: "2026-09-07T00:00:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-07-036-recorded-findings-closure-001"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Hook adapter thin transports

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short:
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Port claude, codex, cursor and devin's spec-gate classify and enforce hooks onto the shared `spec-gate-core.mjs` so each keeps only its own payload parsing and envelope emission, then move pi onto the same shared call site.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Only the spec-gate classify/enforce mechanism is in scope. The lifecycle hooks' spawnSync delegation to `claude/*.js` stays untouched because `hooks/README.md` documents it as a deliberate single-owner design |
| D2 | Envelope construction (Cursor's `{permission, user_message, agent_message}` versus the `hookSpecificOutput` shape the other three use) stays in each runtime's own file. Only the decision logic feeding it moves into the shared core |
| D3 | Each runtime is migrated and tested independently, one at a time, so a regression is traceable to a single runtime rather than the whole port |
| D4 | pi moves onto the same shared functions the other four adopt, rather than staying its own separately-thin fifth shape |

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

- [ ] Each of claude/codex/cursor/devin's classify+enforce+shared.ts trio measures under 200 lines with `wc -l`
- [ ] pi's classify/enforce hooks call the same shared function names as the other four runtimes
- [ ] The eight named regression suites all exit 0 with unchanged rule ids and outcomes
- [ ] `hooks/README.md` names the new single call site
- [ ] No file under the lifecycle-hook set (session-prime, session-stop, compact-inject, directive-lifecycle-boundary) appears in the phase's diff
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
