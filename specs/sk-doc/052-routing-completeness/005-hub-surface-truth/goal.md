---
title: "Goal: Hub Surface Truth"
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
    packet_pointer: "sk-doc/052-routing-completeness/005-hub-surface-truth"
    last_updated_at: "2026-09-02T18:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the durable directive"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-02-052-005-hub-surface-truth"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Hub Surface Truth

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE. Keep it short: goal surfaces cap what
> they hold, and a truncated objective loses its tail, where the criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make every hub document agree with the registries it describes, and add a check that fails when they stop agreeing.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The registry is the source of truth; the document moves |
| D2 | Every fix gets a check, because a hand-found defect that stays hand-found comes back |
| D3 | A new check is shown failing before it is trusted |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Copy these into the objective verbatim. Nothing dereferences a path.

- [x] Removing a registry entry makes the new check fail
- [x] The inventory intent enumerates every leaf, and its count matches the tree
- [x] The hub readme, its frontmatter and the hub manifest agree with the registries
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
| Findings closed | Done | `8bb9011584` records the hub surface findings closed |
| Command column check added | Done | Proven to fail on the dash form, a wrong command string, and a deleted row |
| Two findings still owned | Done | Register 20 and 25 read Planned against this phase |

### Deviations and findings

| Item | Note |
|------|------|
| The real defect was the gap, not the drift | Every automated check reads a registry, and none compared a document against the registry it describes |
<!-- /ANCHOR:log -->
