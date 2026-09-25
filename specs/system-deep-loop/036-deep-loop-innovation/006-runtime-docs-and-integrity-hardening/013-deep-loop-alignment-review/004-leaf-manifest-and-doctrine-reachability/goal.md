---
title: "Goal: leaf manifest and doctrine reachability"
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
    packet_pointer: "scaffold/004-leaf-manifest-and-doctrine-reachability"
    last_updated_at: "2026-09-15T14:23:12Z"
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
# Goal: leaf manifest and doctrine reachability

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

**Objective:** Make the leaf-manifest generator see symlinked files, so no doctrine file is reachable only by prose.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The manifest walker resolves symlinks, so the twelve sk-code doctrine files it skipped are typed and reachable; both freshness gates regenerate with the same walker and therefore agree. |
| D2 | A file reachable only through a prose citation is either typed into a manifest or its prose path is recorded as the deliberate route. |
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

- [x] The leaf manifests of every hub include the files their walkers previously skipped, and both freshness gates pass on the regenerated output
- [x] No doctrine file under the three hubs is reachable only by prose citation without that being recorded
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
| Phase fix | Done | One DeepSeek V4.1 Flash max dispatch on cli-pi via the gateway, relaunched once after a memory kill; two scripts, one manifest, five tests; freshness, metadata and typecheck gates exit 0 |
| Full suite | Green | `npm test` in the runtime: 152 files, 2644 passed, 8 skipped, exit 0, 1322 s |

### Deviations and findings

| Item | Note |
|------|------|
| Not ours | The compiled route guard fails on one hub because another session holds twelve of its packet files uncommitted; verified by scoped stash, left for that session |
| Pre-existing | A create-skill metadata test expects a retired skill and fails identically at baseline |
<!-- /ANCHOR:log -->
