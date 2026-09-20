---
title: "Goal: cli-jev becomes its own parent hub and joins the compiled fleet"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "cli-jev hub"
  - "cli-usage mode"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/002-cli-jev-hub-migration"
    last_updated_at: "2026-09-20T11:05:00Z"
    last_updated_by: "orchestrator-session"
    recent_action: "Parent scaffolded; track metadata authored; directive written"
    next_safe_action: "Run phase 001: move the packet history into this track"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-002-hub-migration"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
# Goal: cli-jev becomes its own parent hub and joins the compiled fleet

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** `cli-jev` is a standalone parent hub at `.skilled/skills/cli-jev/` with CLI usage as its first
mode, `cli-external-orchestration` carries no trace of it, its history lives at `specs/cli-jev/001-cli-jev-creation`,
and the compiled fleet serves six hubs.

### Decisions

| ID | Decision |
|----|----------|
| D1 | Hub `.skilled/skills/cli-jev/`; first mode `cli-usage/` with `packetKind: "transport"`; hub id keeps `cli-jev` |
| D2 | The hub joins the compiled fleet in this program |
| D3 | The 22-scenario playbook is re-run from the new home; verdicts are cited, never rewritten |
| D4 | The mode keeps its `references/`, `assets/`, catalog, playbook, benchmark and changelog; the hub gets scaffold-level docs |
| D5 | The `transport-axis` extension moves with the packet; the old hub drops it |
| D6 | Program packet `002-cli-jev-hub-migration`; moved history is `001-cli-jev-creation` |
| D7 | The orchestrator owns writes, gates and re-runs; `cli-pi` leaves sweep, draft, review, run evidence |
| D8 | No commit, push, branch or worktree unless the operator asks |

### Roadmap

| # | Phase | Outcome |
|---|-------|---------|
| 1 | `001-track-and-packet-migration` | History in the `cli-jev` track, metadata and citations repaired |
| 2 | `002-hub-scaffold-and-mode-migration` | Hub exists; the mode answers from `cli-usage` |
| 3 | `003-decouple-and-rewire` | Old hub clean; dispatch, rosters and artifacts rewired |
| 4 | `004-compiled-fleet-onboarding` | Six hubs served fresh; admission cleared |
| 5 | `005-playbook-reverification-and-closeout` | Playbook re-run; packet closed with evidence |

Each phase has its own `goal.md`; a child that changes a decision here amends it.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

| Phase | Goal document |
|-------|---------------|
| 001-005 | each child's `goal.md` |
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] The hub passes the doctor and package validator with `cli-usage` as its transport mode
- [ ] `cli-external-orchestration` is back to seven workflow modes with no transport trace
- [ ] The dispatch chain resolves the moved packet; both hook suites pass
- [ ] History lives at `specs/cli-jev/001-cli-jev-creation`; the track root declares both children
- [ ] Six hubs report `compiled-serving` fresh; the foundation suite passes
- [ ] The playbook ran from the new home with zero failures
- [ ] The recursive strict gate passes across both packets
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

| Date | Event |
|------|-------|
| 2026-09-20 | Parent scaffolded with five children; track root metadata authored; baseline probes captured |
| 2026-09-20 | Directive written from the operator's answers: hub `cli-jev` + mode `cli-usage`, fleet membership in scope, playbook re-run approved |
<!-- /ANCHOR:log -->
