---
title: "Goal: catalog and readme truth"
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
    packet_pointer: "scaffold/005-catalog-and-readme-truth"
    last_updated_at: "2026-09-15T14:23:13Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Phase fix landed and criteria checked"
    next_safe_action: "Commit once the full suite exits zero"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: catalog and readme truth

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

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

**Objective:** Every catalog entry, README claim and playbook statement matches the tree it describes.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Cited paths that do not exist are re-pointed or removed, hand-written counts are corrected against what they count, the superseded runtime-layout references are updated, and claims the tree contradicts (no test suite, removed benchmark artifacts, renamed test files) are rewritten. |
| D2 | A count that a script can derive names the script rather than the number, where one exists. |
| D3 | Fixed by DeepSeek V4.1 Flash at max through the gateway on cli-pi, one dispatch for this phase alone, verified by the deep-loop suite before the next phase starts. |

### Operator copy

The operator holds this directive as the session objective, and that copy is
what judges completion, not this file. Whenever anything above the log changes
(objective, a decision, the binding table, a criterion), resend the durable
slice of this file in chat, frontmatter excluded, so the operator can update
their copy. Keep reminding while it stays unset; never stop work for it. A
child goal change that alters a parent decision or criterion is an amendment
to the parent: apply it there first, then resend the parent.
<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] No catalog, README or playbook under the three hubs cites a path absent from the tree
- [x] No stated count disagrees with what it counts, and no claim of absence survives against files that exist
- [x] The deep-loop suite exits zero
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
| Phase fix | Done | One DeepSeek V4.1 Flash max dispatch on cli-pi via the gateway; sixty-two documentation files, ten classes swept to zero; metadata gate exit 0 |
| Full suite | Green | `npm test` in the runtime: 152 files, 149 passed and 3 failed, 2642 tests passed. All three failures belong to another session's cli-hermes work on the shared branch, which also breaks the typecheck at `executor-config.ts:116`: two assert its persona field list and transport probe, the third timed out under load and passes in isolation. This phase changed documentation only |

### Deviations and findings

| Item | Note |
|------|------|
| Shared branch | Another session's commit broke the runtime typecheck and one adapter test mid-phase; this change is documentation only, verified by the working-tree diff |
| Residuals | Router, reference and SKILL documents carry matches this phase's classes do not cover, enumerated for the phases that own them |
<!-- /ANCHOR:log -->
