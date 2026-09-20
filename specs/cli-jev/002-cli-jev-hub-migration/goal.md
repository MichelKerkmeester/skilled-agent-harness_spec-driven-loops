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
    last_updated_at: "2026-09-20T14:45:00Z"
    last_updated_by: "orchestrator-session"
    recent_action: "Phases 001-005 closed; both playbooks re-run from the new home"
    next_safe_action: "Operator decision: commit the working tree, or leave it uncommitted"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-002-hub-migration"
      parent_session_id: null
    completion_pct: 100
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
| D9 | The hub's release line starts at `0.1.0.0` by operator direction; the transport's `1.x` history stays recorded in the mode's own changelog |

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

- [x] The hub passes the doctor and package validator with `cli-usage` as its transport mode
- [x] `cli-external-orchestration` is back to seven workflow modes with no transport trace
- [x] The dispatch chain resolves the moved packet; both hook suites pass
- [x] History lives at `specs/cli-jev/001-cli-jev-creation`; the track root declares both children
- [x] Six hubs report `compiled-serving` fresh and the guard exits 0; the suites keep their pre-existing resolution failures only — two of 37 and fifteen of 42, all the archived authored resolver
- [x] The playbook ran from the new home with zero failures
- [x] The recursive strict gate passes across both packets
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

| Date | Event |
|------|-------|
| 2026-09-20 | Parent scaffolded with five children; track root metadata authored; baseline probes captured |
| 2026-09-20 | Directive written from the operator's answers: hub `cli-jev` + mode `cli-usage`, fleet membership in scope, playbook re-run approved |
| 2026-09-20 | Phase 001 closed: the packet history lives at `specs/cli-jev/001-cli-jev-creation`, both packets validate at 0 errors, and the `cli-jev` track sweep reports no drift |
| 2026-09-20 | Phase 002 closed: `.skilled/skills/cli-jev/` passes the doctor at 0 warnings and the package validator on all three sub-checks; the mode answers as `cli-usage`; the old hub still registers the retired row until phase 003 |
| 2026-09-20 | Phase 003 closed: the old hub answers with seven workflow modes and no transport trace (doctor 41 `PASS`), the preflight chain refuses `jev run @request.json --value` with the packet's own rule text, both hook suites pass, the rosters and generated surfaces name the new home, and the hub's release line is `0.1.0.0` |
| 2026-09-20 | Phase 004 closed: the hub is the sixth fleet member — rollout child `008-cli-jev` built at `3240ebf5…`, six surfaces wired, activation minted (generation 1, fence epoch 1) and fresh, `compiled-route.cjs` serves it under an unset flag, admission passes for the fleet, and the hub's doctor and validator report `0.2.0.0` and `compiled-ready` |
| 2026-09-20 | Operator direction recorded: the new hub starts its own release line at `0.1.0.0` instead of continuing the transport's `1.x` history, which stays in the mode's changelog |
| 2026-09-20 | Measured, and left open: the fleet-wide completion bullet cannot be ticked in this tree — `sk-doc` reports `stale-manifest` on another writer's uncommitted packet `SKILL.md`, and the router-unification program's authored resolver is archived, which is why the foundation suite keeps four failures and the manifest suite sixteen. Both were measured before phase 004's first edit and are unchanged by it |
| 2026-09-20 | Phase 005 closed: all 22 transport scenarios and the hub's three routing scenarios executed from the new home — 22 PASS / 0 FAIL / 0 SKIP, the no-key half byte-identical to its recorded baseline, the credential half live with zero key material in any capture, the dispatch gates deciding again (5 deny, 2 advisory, 8 approve), and one judgment returning `0.86` through the hub's own resolved route. Reports: `cli-usage/benchmark/reports/2026-09-20-post-migration-reverification/` and `cli-jev/benchmark/reports/2026-09-20-hub-routing-baseline/` |
| 2026-09-20 | Two findings from the re-run, recorded rather than smoothed: the no-key rows are only reproducible with `XDG_CONFIG_HOME` pointed away from the stored credential, and `jev-stdin-bounded` refuses a quoted-literal state as well as the forms its declaration names — the predicate is shared infrastructure and was left unchanged |
| 2026-09-20 | Re-measured at close: the sk-doc owner re-minted its hub, so all six serve `compiled-serving` fresh and the guard exits 0; the suites stand at 2 failures of 37 and 15 of 42 — every remaining failure the archived authored resolver, none from this program |
<!-- /ANCHOR:log -->
