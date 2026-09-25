---
title: "Goal: quarantine retention per pass"
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
    packet_pointer: "scaffold/012-quarantine-retention-per-pass"
    last_updated_at: "2026-09-14T17:44:17Z"
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
# Goal: quarantine retention per pass

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

**Objective:** Keep every containment pass's quarantine evidence instead of letting a later pass overwrite an earlier one.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Each containment pass writes under a directory keyed by attempt and iteration; the manifest, content copies and patches of earlier passes are never replaced, and the returned quarantine path names the pass that wrote it. |
| D2 | Readers that expect the old fixed path are updated in the same change. |
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

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [x] Two containment passes on the same lane leave two manifests and both sets of patches on disk, with the second pass's path distinct from the first
- [x] The same test against the unmodified writer leaves one manifest
- [x] The deep-loop runtime suite exits zero
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
| Phase fix | Done | One DeepSeek V4.1 Flash max dispatch on cli-pi via the gateway; pass-keyed exclusive quarantine in `write-containment.ts`, two tests, ten assertions re-pointed; touched files plus typecheck exit 0 |
| Full suite | Green | `npm test` in the runtime: 152 files, 2614 passed, 8 skipped, exit 0, 1205 s; contract drift and render tests rerun green after the protocol edit and recompile |

### Deviations and findings

| Item | Note |
|------|------|
| Docs naming the fixed path | The protocol line and the parent plan named the old layout; both updated by the orchestrator and the deep/research contract regenerated |
| Delegate self-caught defects | A patch write through a link at the pass directory, and an exclusive mkdir discarding a manifest; both fixed before return |
<!-- /ANCHOR:log -->
