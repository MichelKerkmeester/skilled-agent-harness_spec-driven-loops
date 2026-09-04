---
title: "Goal: Sk Create Frontmatter"
description: "The durable directive this packet executes against, and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/049-sk-create-frontmatter"
    last_updated_at: "2026-09-02T20:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the parent directive and its phase binding"
    next_safe_action: "Close the open criteria in phase 008"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-02-049-sk-create-frontmatter"
      parent_session_id: null
    completion_pct: 88
    open_questions: []
    answered_questions: []
---
# Goal: Sk Create Frontmatter

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short, because
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give the frontmatter contract an owning mode, so the spec six modes read is accountable to one of them rather than to nobody.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The contract moves into a mode named for it. Shared reach was right, shared ownership was not |
| D2 | No alias is added to make a moved reference resolve. A reference that breaks gets repointed |
| D3 | Reachability is proved in both routing stages, not asserted from a registry entry |
| D4 | A documented number the repository contradicts is remeasured, not softened |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 008-utilization-review | `008-utilization-review/goal.md` |

Phases 001 through 007 closed before this addon existed and carry no goal
document. Their scope is the phase map in `spec.md`.

**Precedence.** Decisions above outrank child detail, and child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [ ] `validate.sh --strict --recursive` over this packet prints `RESULT: PASSED` for every folder
- [ ] The mode owns the frontmatter spec and no consumer still resolves through an alias added to paper over the move
- [ ] Every keyword trigger the mode declares resolves through the hub, measured rather than assumed
- [ ] Every phase reports its acceptance criteria closeable
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
| Phases 001 to 006, mode built and closed out | Done | `7589536feb feat(sk-doc): give the frontmatter contract an owner, and every mode a playbook` |
| Phase 007, voice playbook | Done | Planned in `c8eda6a356`, shipped with the same sweep |
| Phase 008, utilization review | In Progress | `8ad1f98d09` ran the playbook and fixed four defects. Five criteria stay open in `008-utilization-review/goal.md` |
| Validator repairs the packet exposed | Done | `d229b0a24d fix(sk-doc): make the validators look where they were not looking` |

### Deviations and findings

| Item | Note |
|------|------|
| Declared reachability outran real reachability | The mode registered cleanly and still answered nothing to eight of its own seventeen triggers. Registration and routing are two measurements, and only the second one counts |
| The phase map disagrees with phase 008 | `spec.md` lists phase 8 as `Pending` with a `[Phase 8 scope]` placeholder, while `008-utilization-review/spec.md` reports Status Complete. Recorded here rather than fixed, since this session owns goal documents only |
<!-- /ANCHOR:log -->
